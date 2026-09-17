-- Mugi Klub : retours exacts des actions de l'admin.
-- Remplace klub__annuler de 20260915120100_klub_visiteur.sql et klub__inscrire
-- de 20260915120260_klub_anti_abus.sql ; ce fichier fait foi pour leur état final.
--
-- klub__annuler : sur une séance annulée, l'admin reçoit « seance_annulee »
-- comme le visiteur, sans rien modifier ni mettre de mail en file.
-- klub__inscrire : un ajout admin sur une adresse déjà inscrite (inscription
-- active) lève KLUB_DOUBLON. Le parcours du site ne change pas ; ce qui suit
-- (repris de 20260915120260_klub_anti_abus.sql) ne vaut que pour lui.
--
-- Pas d'oracle de statut. Une adresse déjà inscrite sur la séance reçoit la
-- réponse qu'aurait une nouvelle inscription à cet instant (confirmée s'il
-- reste une place, sinon attente au rang « attentes + 1 »), et non le statut
-- réel de l'inscription existante : sans cela, n'importe qui pourrait savoir
-- si une adresse donnée est inscrite, et où. Le vrai mail est remis en file
-- au plus une fois par tranche de 10 minutes ; il ne part qu'à la vraie
-- propriétaire de l'adresse, qui y lit son statut réel.
--
-- Plafond silencieux (inscriptions du site seulement, adresse pas encore
-- inscrite sur cette séance) : au moins 6 inscriptions actives sur des séances
-- publiées à venir, ou au moins 10 mails créés en 24 h pour des inscriptions
-- de cette adresse. Rien n'est inséré, aucun mail n'est mis en file, et la
-- réponse est celle d'une nouvelle inscription, avec mail_id null. Les ajouts
-- de l'admin ne sont jamais plafonnés.
--
-- Fuite résiduelle acceptée : les compteurs publics (places_restantes et
-- nb_attente de klub_planning / klub_seance) ne bougent que sur une vraie
-- insertion. Comparer les compteurs avant et après un envoi révèle donc qu'une
-- adresse était déjà inscrite ou plafonnée.
create or replace function public.klub__inscrire(
  p_seance uuid, p_prenom text, p_nom text, p_email text, p_telephone text,
  p_premiere boolean, p_origine text, p_si_complet text
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  s public.klub_seances;
  -- Blancs tolérés comme côté client : tabulation, espace insécable (U+00A0)
  -- et espace fine insécable (U+202F), que trim() et \s ignorent.
  c_blancs constant text := E' \t\r\n' || chr(160) || chr(8239);
  v_email text := lower(btrim(coalesce(p_email, ''), c_blancs));
  v_tel text := regexp_replace(coalesce(p_telephone, ''), '[\s.()' || chr(160) || chr(8239) || '-]', '', 'g');
  v_existant public.klub_inscriptions;
  v_statut text;
  v_id uuid;
  v_mail uuid;
  v_rang integer;
begin
  if p_origine not in ('site', 'admin') then raise exception 'KLUB_ORIGINE'; end if;
  if char_length(btrim(coalesce(p_prenom, ''), c_blancs)) = 0
     or char_length(btrim(coalesce(p_nom, ''), c_blancs)) = 0 then
    raise exception 'KLUB_NOM';
  end if;
  if v_email !~ '^[^\s@,;]{1,64}@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$' then raise exception 'KLUB_EMAIL'; end if;
  if v_tel !~ '^\+?[0-9]{9,15}$' then raise exception 'KLUB_TELEPHONE'; end if;

  -- Le verrou sérialise les inscriptions d'une même séance : pas de surréservation.
  -- Il est pris avant les comptages ci-dessous pour que la réponse reste
  -- cohérente sous concurrence.
  select * into s from public.klub_seances where id = p_seance for no key update;
  if not found or s.statut <> 'publiee' then raise exception 'KLUB_SEANCE'; end if;
  if not s.inscription_requise then raise exception 'KLUB_LIBRE'; end if;
  if (p_origine = 'site' and s.debut <= now())
     or (p_origine = 'admin' and s.debut + make_interval(mins => s.duree_min::int) <= now()) then
    raise exception 'KLUB_COMMENCEE';
  end if;

  select * into v_existant from public.klub_inscriptions
  where seance_id = p_seance and email = v_email and statut <> 'annulee';

  if found then
    -- Ajout depuis l'admin : les praticiens lisent déjà toutes les inscriptions,
    -- le doublon leur est signalé tel quel.
    if p_origine = 'admin' then raise exception 'KLUB_DOUBLON'; end if;
    -- Doublon : le vrai mail est renvoyé au plus une fois par tranche de
    -- 10 minutes ; la réponse est celle d'une nouvelle inscription (plus bas).
    if not exists (
      select 1 from public.klub_mails
      where inscription_id = v_existant.id and type in ('confirmation', 'attente', 'promotion')
        and created_at > now() - interval '10 minutes'
    ) then
      insert into public.klub_mails (type, inscription_id, seance_id)
      values (case when v_existant.statut = 'confirmee' then 'confirmation' else 'attente' end, v_existant.id, p_seance)
      returning id into v_mail;
    end if;
  elsif p_origine = 'site' and (
    (select count(*) from public.klub_inscriptions i
     join public.klub_seances x on x.id = i.seance_id
     where i.email = v_email and i.statut in ('confirmee', 'attente')
       and x.statut = 'publiee' and x.debut > now()) >= 6
    or (select count(*) from public.klub_mails m
        join public.klub_inscriptions i on i.id = m.inscription_id
        where i.email = v_email and m.created_at > now() - interval '24 hours') >= 10
  ) then
    -- Plafond atteint : rien n'est inséré ni mis en file, même réponse
    -- qu'une nouvelle inscription.
    v_mail := null;
  else
    if (select count(*) from public.klub_inscriptions where seance_id = p_seance and statut = 'confirmee') < s.capacite
       or p_si_complet = 'forcer' then
      v_statut := 'confirmee';
    else
      v_statut := 'attente';
    end if;
    -- `clock_timestamp()` et non le `now()` par défaut : l'ordre de la liste
    -- d'attente suit la prise du verrou, pas le début de la transaction.
    insert into public.klub_inscriptions (seance_id, prenom, nom, email, telephone, premiere_seance, statut, origine,
                                          created_at)
    values (p_seance, left(btrim(p_prenom, c_blancs), 60), left(btrim(p_nom, c_blancs), 60), v_email, v_tel,
            coalesce(p_premiere, false), v_statut, p_origine, clock_timestamp())
    returning id into v_id;
    insert into public.klub_mails (type, inscription_id, seance_id)
    values (case when v_statut = 'confirmee' then 'confirmation' else 'attente' end, v_id, p_seance)
    returning id into v_mail;

    if v_statut = 'attente' then
      select count(*) into v_rang
      from public.klub_inscriptions a, public.klub_inscriptions moi
      where moi.id = v_id and a.seance_id = p_seance and a.statut = 'attente'
        and (a.created_at, a.id) <= (moi.created_at, moi.id);
    end if;

    return jsonb_build_object('statut', v_statut, 'rang', v_rang, 'mail_id', v_mail, 'debut', s.debut, 'titre', s.titre);
  end if;

  -- Doublon ou plafond : ce qu'une nouvelle inscription recevrait maintenant.
  if (select count(*) from public.klub_inscriptions where seance_id = p_seance and statut = 'confirmee') < s.capacite
     or p_si_complet = 'forcer' then
    v_statut := 'confirmee';
  else
    v_statut := 'attente';
    v_rang := 1 + (select count(*) from public.klub_inscriptions where seance_id = p_seance and statut = 'attente');
  end if;

  return jsonb_build_object('statut', v_statut, 'rang', v_rang, 'mail_id', v_mail, 'debut', s.debut, 'titre', s.titre);
end;
$$;

create or replace function public.klub__annuler(p_inscription uuid, p_admin boolean)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_seance uuid;
  s public.klub_seances;
  i public.klub_inscriptions;
  v_mail uuid;
begin
  select seance_id into v_seance from public.klub_inscriptions where id = p_inscription;
  if v_seance is null then return jsonb_build_object('resultat', 'inconnu'); end if;
  -- Même ordre de verrouillage que l'inscription : la séance d'abord.
  select * into s from public.klub_seances where id = v_seance for no key update;
  if not found then return jsonb_build_object('resultat', 'inconnu'); end if;
  select * into i from public.klub_inscriptions where id = p_inscription for no key update;
  if not found then return jsonb_build_object('resultat', 'inconnu'); end if;
  if i.statut = 'annulee' then return jsonb_build_object('resultat', 'deja', 'seance_id', s.id); end if;
  -- Séance annulée : rien à faire, pour le visiteur comme pour l'admin (pas de
  -- second mail après celui de l'annulation de la séance).
  if s.statut = 'annulee' then return jsonb_build_object('resultat', 'seance_annulee', 'seance_id', s.id); end if;
  if (not p_admin and s.debut <= now())
     or (p_admin and s.debut + make_interval(mins => s.duree_min::int) <= now()) then
    return jsonb_build_object('resultat', 'passee', 'seance_id', s.id);
  end if;
  update public.klub_inscriptions set statut = 'annulee' where id = i.id;
  insert into public.klub_mails (type, inscription_id, seance_id) values ('annulation', i.id, s.id) returning id into v_mail;
  if i.statut = 'confirmee' then perform public.klub__remplir(s.id); end if;
  return jsonb_build_object('resultat', 'annulee', 'seance_id', s.id, 'mail_id', v_mail);
end;
$$;

revoke execute on function public.klub__inscrire(uuid, text, text, text, text, boolean, text, text)
  from public, anon, authenticated, service_role;
revoke execute on function public.klub__annuler(uuid, boolean) from public, anon, authenticated, service_role;
