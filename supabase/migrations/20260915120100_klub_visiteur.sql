-- Mugi Klub : fonctions du parcours visiteur.
-- Lecture publique sans donnée personnelle, inscription, annulation,
-- promotion depuis la liste d'attente, réservation des mails à envoyer.

-- Vue publique d'une séance : jamais d'e-mail, de téléphone ni de jeton.
create or replace function public.klub__seance_publique(s public.klub_seances)
returns jsonb language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'id', s.id,
    'debut', s.debut,
    'duree_min', s.duree_min,
    'type', s.type,
    'titre', s.titre,
    'description', s.description,
    'intervenant', s.intervenant,
    'prix_libelle', s.prix_libelle,
    'inscription_requise', s.inscription_requise,
    'capacite', s.capacite,
    'statut', s.statut,
    'places_restantes', case when s.inscription_requise then greatest(
      s.capacite - (select count(*) from public.klub_inscriptions i where i.seance_id = s.id and i.statut = 'confirmee'), 0) end,
    'nb_attente', (select count(*) from public.klub_inscriptions i where i.seance_id = s.id and i.statut = 'attente')
  );
$$;

create or replace function public.klub_planning(p_du timestamptz, p_au timestamptz)
returns jsonb language sql stable security definer set search_path = '' as $$
  select coalesce(jsonb_agg(public.klub__seance_publique(s) order by s.debut), '[]'::jsonb)
  from public.klub_seances s
  where s.debut >= p_du and s.debut < least(p_au, p_du + interval '35 days');
$$;

create or replace function public.klub_seance(p_id uuid)
returns jsonb language sql stable security definer set search_path = '' as $$
  select public.klub__seance_publique(s) from public.klub_seances s where s.id = p_id;
$$;

create or replace function public.klub_annulation_infos(p_jeton text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('prenom', i.prenom, 'statut', i.statut, 'seance', public.klub__seance_publique(s))
  from public.klub_inscriptions i
  join public.klub_seances s on s.id = i.seance_id
  where i.jeton = p_jeton;
$$;

-- Promeut la liste d'attente tant qu'il reste des places, si le début est à
-- plus de 2 heures. Prend son propre verrou sur la séance : réentrant si
-- l'appelant le tient déjà.
create or replace function public.klub__remplir(p_seance uuid)
returns integer language plpgsql security definer set search_path = '' as $$
declare
  s public.klub_seances;
  v_libres integer;
  v_promus integer := 0;
  v_id uuid;
begin
  select * into s from public.klub_seances where id = p_seance for no key update;
  if not found or s.statut <> 'publiee' or not s.inscription_requise or s.debut - now() <= interval '2 hours' then
    return 0;
  end if;
  v_libres := s.capacite - (select count(*) from public.klub_inscriptions where seance_id = p_seance and statut = 'confirmee');
  while v_libres > 0 loop
    v_id := null;
    select id into v_id from public.klub_inscriptions
    where seance_id = p_seance and statut = 'attente'
    order by created_at, id limit 1;
    exit when v_id is null;
    update public.klub_inscriptions set statut = 'confirmee' where id = v_id;
    insert into public.klub_mails (type, inscription_id, seance_id) values ('promotion', v_id, p_seance);
    v_libres := v_libres - 1;
    v_promus := v_promus + 1;
  end loop;
  return v_promus;
end;
$$;

-- Règle d'inscription commune au site et à l'admin.
-- p_si_complet : 'attente' ou 'forcer' (admin seulement).
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
    -- Même réponse qu'une première inscription ; le mail n'est renvoyé
    -- qu'une fois par tranche de 10 minutes.
    v_id := v_existant.id;
    v_statut := v_existant.statut;
    if not exists (
      select 1 from public.klub_mails
      where inscription_id = v_id and type in ('confirmation', 'attente', 'promotion')
        and created_at > now() - interval '10 minutes'
    ) then
      insert into public.klub_mails (type, inscription_id, seance_id)
      values (case when v_statut = 'confirmee' then 'confirmation' else 'attente' end, v_id, p_seance)
      returning id into v_mail;
    end if;
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
  end if;

  if v_statut = 'attente' then
    select count(*) into v_rang
    from public.klub_inscriptions a, public.klub_inscriptions moi
    where moi.id = v_id and a.seance_id = p_seance and a.statut = 'attente'
      and (a.created_at, a.id) <= (moi.created_at, moi.id);
  end if;

  return jsonb_build_object('statut', v_statut, 'rang', v_rang, 'mail_id', v_mail, 'debut', s.debut, 'titre', s.titre);
end;
$$;

create or replace function public.klub_inscrire(
  p_seance uuid, p_prenom text, p_nom text, p_email text, p_telephone text, p_premiere boolean
)
returns jsonb language sql security definer set search_path = '' as $$
  select public.klub__inscrire(p_seance, p_prenom, p_nom, p_email, p_telephone, p_premiere, 'site', 'attente');
$$;

-- Règle d'annulation commune. L'admin peut annuler jusqu'à la fin de la séance.
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
  if not p_admin and s.statut = 'annulee' then return jsonb_build_object('resultat', 'seance_annulee', 'seance_id', s.id); end if;
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

create or replace function public.klub_annuler(p_jeton text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
begin
  select id into v_id from public.klub_inscriptions where jeton = p_jeton;
  if v_id is null then return jsonb_build_object('resultat', 'inconnu'); end if;
  return public.klub__annuler(v_id, false);
end;
$$;

-- Réserve des mails à envoyer. `skip locked` : l'envoi immédiat et la tâche
-- planifiée ne prennent jamais le même mail.
create or replace function public.klub_reserver_mails(p_id uuid, p_limite integer)
returns uuid[] language sql security definer set search_path = '' as $$
  with choisis as (
    select id from public.klub_mails
    where statut = 'a_envoyer' and envoyer_apres <= now() and (p_id is null or id = p_id)
    order by envoyer_apres, id
    limit greatest(least(coalesce(p_limite, 50), 200), 1)
    for update skip locked
  ), maj as (
    update public.klub_mails m
    set statut = 'en_cours', tentatives = m.tentatives + 1, reserve_at = now()
    from choisis where m.id = choisis.id
    returning m.id
  )
  select coalesce(array_agg(id), '{}') from maj;
$$;

revoke execute on function public.klub__seance_publique(public.klub_seances) from public, anon, authenticated;
revoke execute on function public.klub__remplir(uuid) from public, anon, authenticated;
revoke execute on function public.klub__inscrire(uuid, text, text, text, text, boolean, text, text) from public, anon, authenticated;
revoke execute on function public.klub__annuler(uuid, boolean) from public, anon, authenticated;
-- Les aides internes ne sont appelées que depuis les fonctions security definer.
revoke execute on function public.klub__remplir(uuid), public.klub__inscrire(uuid, text, text, text, text, boolean, text, text),
  public.klub__annuler(uuid, boolean), public.klub__seance_publique(public.klub_seances) from service_role;

revoke execute on function public.klub_inscrire(uuid, text, text, text, text, boolean) from public, anon, authenticated;
revoke execute on function public.klub_annuler(text) from public, anon, authenticated;
revoke execute on function public.klub_reserver_mails(uuid, integer) from public, anon, authenticated;
grant execute on function public.klub_inscrire(uuid, text, text, text, text, boolean) to service_role;
grant execute on function public.klub_annuler(text) to service_role;
grant execute on function public.klub_reserver_mails(uuid, integer) to service_role;

revoke execute on function public.klub_planning(timestamptz, timestamptz) from public;
revoke execute on function public.klub_seance(uuid) from public;
revoke execute on function public.klub_annulation_infos(text) from public;
grant execute on function public.klub_planning(timestamptz, timestamptz) to anon, authenticated;
grant execute on function public.klub_seance(uuid) to anon, authenticated;
grant execute on function public.klub_annulation_infos(text) to anon, authenticated;
