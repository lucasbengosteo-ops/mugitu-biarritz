-- Mugi Klub : l'inscription payante. Spec § 3 et 5.
-- Spec : docs/superpowers/specs/2026-10-13-klub-paiement-design.md.
--
-- Nouveau statut `paiement` : une place tenue pendant qu'on paie. Elle compte
-- dans les places prises. Elle devient `confirmee` quand Stripe notifie le
-- paiement, `annulee` à l'expiration.
--
-- Une séance sans paiement en ligne (klub__paiement_en_ligne faux : pas de
-- prix, pas de praticien, ou compte Stripe pas prêt) garde exactement le
-- fonctionnement d'avant : aucune inscription n'y prend le statut `paiement`,
-- et klub__places_prises y vaut le compte des confirmées.
--
-- Fonctions qui lisaient le statut des inscriptions, et décision :
--   klub__seance_publique      places_restantes -> klub__places_prises
--   klub__inscrire             places -> klub__places_prises ; plafond par
--                              adresse compte aussi `paiement` ; chemin payant
--   klub__remplir              places -> klub__places_prises ; promotion payante
--   klub__annuler              une place `paiement` libérée remplit aussi
--   klub_admin_modifier_seance capacité -> klub__places_prises ; KLUB_LIBRE et
--                              mail seance_modifiee comptent aussi `paiement`
--   klub_admin_annuler_seance  mail seance_annulee aussi aux `paiement`
--   klub_tache                 inchangée (rappel et liste : confirmées seules)
--   klub_admin_presence, klub_admin_sauver_creneau, klub_annuler,
--   klub_annulation_infos      inchangées (pas de compte de statut)

-- Noms vérifiés en production le 13 oct. 2026.
alter table public.klub_inscriptions drop constraint klub_inscriptions_statut_check;
alter table public.klub_inscriptions add constraint klub_inscriptions_statut_check
  check (statut in ('confirmee', 'attente', 'annulee', 'paiement'));

alter table public.klub_inscriptions
  add column paiement_expire_at timestamptz,
  add column montant_centimes integer check (montant_centimes is null or montant_centimes >= 0),
  add column stripe_compte text,
  add column stripe_session text unique,
  add column stripe_session_url text,
  add column stripe_paiement text unique,
  add column paye_at timestamptz,
  add constraint klub_inscriptions_paiement_expire_check
    check (statut <> 'paiement' or paiement_expire_at is not null);

create index klub_inscriptions_paiement on public.klub_inscriptions (paiement_expire_at) where statut = 'paiement';

alter table public.klub_mails drop constraint klub_mails_type_check;
alter table public.klub_mails add constraint klub_mails_type_check
  check (type in ('confirmation', 'attente', 'promotion', 'annulation', 'rappel',
                  'seance_modifiee', 'seance_annulee', 'liste_intervenant', 'place_liberee'));

-- Places prises : confirmées et en cours de paiement.
create or replace function public.klub__places_prises(p_seance uuid)
returns integer
language sql
stable
set search_path = ''
as $$
  select count(*)::integer from public.klub_inscriptions
  where seance_id = p_seance and statut in ('confirmee', 'paiement');
$$;
-- Aide interne, retirée aussi à service_role comme les autres klub__*
-- (tests/klub.sql, bloc SERVICE_ROLE) : seules l'appellent des fonctions
-- security definer.
revoke all on function public.klub__places_prises(uuid) from public, anon, authenticated, service_role;

-- Corps repris de la production le 13 oct. 2026, changements :
-- places_restantes compte par klub__places_prises (confirmées + paiement).
create or replace function public.klub__seance_publique(s klub_seances)
returns jsonb
language sql
stable
set search_path to ''
as $function$
  select jsonb_build_object(
    'id', s.id,
    'debut', s.debut,
    'duree_min', s.duree_min,
    'type', s.type,
    'titre', s.titre,
    'description', s.description,
    'intervenant', s.intervenant,
    'prix_libelle', s.prix_libelle,
    'prix_centimes', s.prix_centimes,
    'paiement_en_ligne', public.klub__paiement_en_ligne(s),
    'inscription_requise', s.inscription_requise,
    'capacite', s.capacite,
    'statut', s.statut,
    'reservation_url', s.reservation_url,
    'reservation_libelle', s.reservation_libelle,
    'image', s.image,
    'image_focus', s.image_focus,
    'places_restantes', case when s.inscription_requise then greatest(
      s.capacite - public.klub__places_prises(s.id), 0) end,
    'nb_attente', (select count(*) from public.klub_inscriptions i where i.seance_id = s.id and i.statut = 'attente')
  );
$function$;

-- Corps repris de la production le 13 oct. 2026, changements :
--  - les deux comptes de places passent par klub__places_prises ;
--  - le plafond de 6 inscriptions actives par adresse compte aussi `paiement` ;
--  - chemin payant (origine site, séance payable en ligne) : statut `paiement`,
--    réservation de 35 min, montant figé, pas de mail de confirmation ;
--  - une inscription existante en `paiement` : réservation repoussée (jamais
--    raccourcie), aucun mail, réponse `paiement` avec son identifiant ;
--  - le JSON renvoyé gagne 'inscription_id'.
create or replace function public.klub__inscrire(p_seance uuid, p_prenom text, p_nom text, p_email text, p_telephone text, p_premiere boolean, p_origine text, p_si_complet text)
 returns jsonb
 language plpgsql
 security definer
 set search_path to ''
as $function$
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
  v_payant boolean;
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
  -- Paiement en ligne : depuis le site seulement. L'admin inscrit d'office,
  -- le paiement se fait alors sur place.
  v_payant := p_origine = 'site' and public.klub__paiement_en_ligne(s);

  select * into v_existant from public.klub_inscriptions
  where seance_id = p_seance and email = v_email and statut <> 'annulee';

  if found then
    -- Ajout depuis l'admin : les praticiens lisent déjà toutes les inscriptions,
    -- le doublon leur est signalé tel quel.
    if p_origine = 'admin' then raise exception 'KLUB_DOUBLON'; end if;
    -- Paiement en cours pour cette adresse : on lui laisse le temps de payer,
    -- sans mail. `greatest` : une place gardée 6 h depuis la liste d'attente
    -- n'est jamais raccourcie.
    if v_existant.statut = 'paiement' then
      update public.klub_inscriptions
      set paiement_expire_at = greatest(paiement_expire_at, now() + interval '35 minutes')
      where id = v_existant.id;
      return jsonb_build_object('statut', 'paiement', 'rang', null, 'mail_id', null, 'debut', s.debut, 'titre', s.titre,
                                'inscription_id', v_existant.id);
    end if;
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
     where i.email = v_email and i.statut in ('confirmee', 'attente', 'paiement')
       and x.statut = 'publiee' and x.debut > now()) >= 6
    or (select count(*) from public.klub_mails m
        join public.klub_inscriptions i on i.id = m.inscription_id
        where i.email = v_email and m.created_at > now() - interval '24 hours') >= 10
  ) then
    -- Plafond atteint : rien n'est inséré ni mis en file, même réponse
    -- qu'une nouvelle inscription.
    v_mail := null;
  else
    if public.klub__places_prises(p_seance) < s.capacite
       or p_si_complet = 'forcer' then
      v_statut := case when v_payant then 'paiement' else 'confirmee' end;
    else
      v_statut := 'attente';
    end if;
    -- `clock_timestamp()` et non le `now()` par défaut : l'ordre de la liste
    -- d'attente suit la prise du verrou, pas le début de la transaction.
    insert into public.klub_inscriptions (seance_id, prenom, nom, email, telephone, premiere_seance, statut, origine,
                                          created_at, paiement_expire_at, montant_centimes)
    values (p_seance, left(btrim(p_prenom, c_blancs), 60), left(btrim(p_nom, c_blancs), 60), v_email, v_tel,
            coalesce(p_premiere, false), v_statut, p_origine, clock_timestamp(),
            case when v_statut = 'paiement' then now() + interval '35 minutes' end,
            case when v_statut = 'paiement' then s.prix_centimes end)
    returning id into v_id;
    -- En paiement : la confirmation part quand Stripe notifie le paiement.
    if v_statut <> 'paiement' then
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

    return jsonb_build_object('statut', v_statut, 'rang', v_rang, 'mail_id', v_mail, 'debut', s.debut, 'titre', s.titre,
                              'inscription_id', v_id);
  end if;

  -- Doublon ou plafond : ce qu'une nouvelle inscription recevrait maintenant.
  if public.klub__places_prises(p_seance) < s.capacite
     or p_si_complet = 'forcer' then
    v_statut := 'confirmee';
  else
    v_statut := 'attente';
    v_rang := 1 + (select count(*) from public.klub_inscriptions where seance_id = p_seance and statut = 'attente');
  end if;

  return jsonb_build_object('statut', v_statut, 'rang', v_rang, 'mail_id', v_mail, 'debut', s.debut, 'titre', s.titre,
                            'inscription_id', v_id);
end;
$function$;

-- Corps repris de la production le 13 oct. 2026, changements :
--  - les places libres se comptent par klub__places_prises ;
--  - séance payable en ligne : la personne promue passe en `paiement`, place
--    gardée 6 h et jamais au-delà du début, mail `place_liberee` au lieu de
--    `promotion`.
create or replace function public.klub__remplir(p_seance uuid)
 returns integer
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare
  s public.klub_seances;
  v_libres integer;
  v_promus integer := 0;
  v_id uuid;
  v_payant boolean;
begin
  select * into s from public.klub_seances where id = p_seance for no key update;
  if not found or s.statut <> 'publiee' or not s.inscription_requise or s.debut - now() <= interval '2 hours' then
    return 0;
  end if;
  v_payant := public.klub__paiement_en_ligne(s);
  v_libres := s.capacite - public.klub__places_prises(p_seance);
  while v_libres > 0 loop
    v_id := null;
    select id into v_id from public.klub_inscriptions
    where seance_id = p_seance and statut = 'attente'
    order by created_at, id limit 1;
    exit when v_id is null;
    if v_payant then
      update public.klub_inscriptions
      set statut = 'paiement', paiement_expire_at = least(now() + interval '6 hours', s.debut),
          montant_centimes = s.prix_centimes
      where id = v_id;
      insert into public.klub_mails (type, inscription_id, seance_id) values ('place_liberee', v_id, p_seance);
    else
      update public.klub_inscriptions set statut = 'confirmee' where id = v_id;
      insert into public.klub_mails (type, inscription_id, seance_id) values ('promotion', v_id, p_seance);
    end if;
    v_libres := v_libres - 1;
    v_promus := v_promus + 1;
  end loop;
  return v_promus;
end;
$function$;

-- Corps repris de la production le 13 oct. 2026, changement : une place
-- tenue en `paiement` qui se libère fait aussi avancer la liste d'attente.
create or replace function public.klub__annuler(p_inscription uuid, p_admin boolean)
 returns jsonb
 language plpgsql
 security definer
 set search_path to ''
as $function$
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
  if i.statut in ('confirmee', 'paiement') then perform public.klub__remplir(s.id); end if;
  return jsonb_build_object('resultat', 'annulee', 'seance_id', s.id, 'mail_id', v_mail);
end;
$function$;

-- Corps repris de la production le 13 oct. 2026, changements :
--  - la capacité ne descend pas sous klub__places_prises (confirmées + paiement) ;
--  - une place en `paiement` empêche aussi de rendre la séance libre, et sa
--    titulaire est prévenue d'un changement comme les autres inscrites.
create or replace function public.klub_admin_modifier_seance(p_id uuid, p jsonb)
 returns jsonb
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare
  s public.klub_seances;
  n public.klub_seances;
  v_requise boolean;
  v_capacite smallint;
  v_prevenus integer := 0;
begin
  perform public.klub__verifier_droits();
  v_requise := coalesce((p->>'inscription_requise')::boolean, true);
  v_capacite := case when v_requise then nullif(p->>'capacite', '')::smallint end;

  select * into s from public.klub_seances where id = p_id for no key update;
  if not found or s.statut = 'annulee' then raise exception 'KLUB_SEANCE'; end if;
  if not v_requise and exists (
    select 1 from public.klub_inscriptions where seance_id = p_id and statut in ('confirmee', 'attente', 'paiement')
  ) then
    raise exception 'KLUB_LIBRE';
  end if;
  if v_requise and v_capacite is not null
     and v_capacite < public.klub__places_prises(p_id) then
    raise exception 'KLUB_CAPACITE';
  end if;

  update public.klub_seances set
    debut = (p->>'debut')::timestamptz,
    duree_min = (p->>'duree_min')::smallint,
    type = p->>'type',
    titre = trim(coalesce(p->>'titre', '')),
    description = coalesce(p->>'description', ''),
    intervenant = coalesce(p->>'intervenant', ''),
    intervenant_email = nullif(lower(trim(coalesce(p->>'intervenant_email', ''))), ''),
    capacite = v_capacite,
    prix_libelle = coalesce(p->>'prix_libelle', ''),
    inscription_requise = v_requise,
    modifiee = true
  where id = p_id
  returning * into n;

  if n.debut <> s.debut then
    -- Rappel et liste intervenant pas encore partis : la tâche les remettra en
    -- file selon le nouvel horaire. Ceux déjà envoyés restent ; une séance
    -- déplacée après l'envoi de son rappel n'en reçoit pas de second (le mail
    -- `seance_modifiee` prévient déjà les inscrits). Un envoi `en_cours` est
    -- laissé tel quel pour ne pas doubler un mail peut-être déjà parti.
    delete from public.klub_mails
    where seance_id = p_id and type in ('rappel', 'liste_intervenant') and statut not in ('envoye', 'en_cours');
  end if;

  if n.debut <> s.debut or n.duree_min <> s.duree_min or n.intervenant <> s.intervenant then
    with ins as (
      insert into public.klub_mails (type, inscription_id, seance_id)
      select 'seance_modifiee', i.id, p_id from public.klub_inscriptions i
      where i.seance_id = p_id and i.statut in ('confirmee', 'attente', 'paiement')
      returning 1
    )
    select count(*) into v_prevenus from ins;
  end if;

  perform public.klub__remplir(p_id);
  return jsonb_build_object('prevenus', v_prevenus);
exception
  when check_violation or not_null_violation or invalid_text_representation
       or invalid_datetime_format or datetime_field_overflow or numeric_value_out_of_range then
    raise exception 'KLUB_CHAMP';
end;
$function$;

-- Corps repris de la production le 13 oct. 2026, changement : le mail
-- `seance_annulee` part aussi à qui tient une place en `paiement`. Les
-- remboursements viennent avec la migration klub_remboursements.
create or replace function public.klub_admin_annuler_seance(p_id uuid)
 returns integer
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare
  s public.klub_seances;
  v_n integer;
begin
  perform public.klub__verifier_droits();
  select * into s from public.klub_seances where id = p_id for no key update;
  if not found then raise exception 'KLUB_SEANCE'; end if;
  if s.statut = 'annulee' then return 0; end if;
  update public.klub_seances set statut = 'annulee' where id = p_id;
  -- Les mails pas encore partis n'ont plus de sens, sauf la confirmation
  -- d'une annulation demandée par l'inscrit.
  update public.klub_mails set statut = 'abandonne', reserve_at = null
  where seance_id = p_id and statut = 'a_envoyer' and type <> 'annulation';
  with ins as (
    insert into public.klub_mails (type, inscription_id, seance_id)
    select 'seance_annulee', i.id, p_id from public.klub_inscriptions i
    where i.seance_id = p_id and i.statut in ('confirmee', 'attente', 'paiement')
    returning 1
  )
  select count(*) into v_n from ins;
  return v_n;
end;
$function$;

-- Les places tenues dont le paiement n'est pas arrivé à temps se libèrent.
-- Appelée par la tâche minute et la notification `checkout.session.expired`.
-- On ne modifie pas klub_tache. Renvoie le nombre d'inscriptions expirées.
create or replace function public.klub_paiements_expirer()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_seance uuid;
  v_lignes integer;
  v_n integer := 0;
begin
  for v_seance in
    select distinct seance_id from public.klub_inscriptions
    where statut = 'paiement' and paiement_expire_at <= now()
  loop
    -- Même ordre de verrouillage que l'inscription : la séance d'abord.
    perform 1 from public.klub_seances where id = v_seance for no key update;
    update public.klub_inscriptions set statut = 'annulee'
    where seance_id = v_seance and statut = 'paiement' and paiement_expire_at <= now();
    get diagnostics v_lignes = row_count;
    v_n := v_n + v_lignes;
    perform public.klub__remplir(v_seance);
  end loop;
  return v_n;
end;
$$;
revoke all on function public.klub_paiements_expirer() from public, anon, authenticated;
grant execute on function public.klub_paiements_expirer() to service_role;

-- La session Stripe créée pour une inscription en `paiement`. Idempotente.
create or replace function public.klub_paiement_session(
  p_inscription uuid, p_compte text, p_session text, p_url text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.klub_inscriptions
  set stripe_compte = p_compte, stripe_session = p_session, stripe_session_url = p_url
  where id = p_inscription and statut = 'paiement';
$$;

-- Appelée par la notification `checkout.session.completed`.
-- Renvoie 'confirmee', 'deja', 'inconnu' ou 'tardif' (payé après expiration,
-- ou séance annulée entre-temps : à rembourser, voir klub_remboursements).
create or replace function public.klub_paiement_confirme(
  p_session text, p_paiement text, p_montant integer)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  i public.klub_inscriptions;
  v_seance_statut text;
begin
  select * into i from public.klub_inscriptions where stripe_session = p_session;
  if not found then return 'inconnu'; end if;
  select statut into v_seance_statut from public.klub_seances where id = i.seance_id for no key update;
  select * into i from public.klub_inscriptions where id = i.id for no key update;

  if i.stripe_paiement is not null then return 'deja'; end if;

  update public.klub_inscriptions
  set stripe_paiement = p_paiement, montant_centimes = p_montant, paye_at = now()
  where id = i.id;

  if i.statut = 'paiement' and v_seance_statut = 'publiee' then
    update public.klub_inscriptions set statut = 'confirmee', paiement_expire_at = null where id = i.id;
    insert into public.klub_mails (type, inscription_id, seance_id) values ('confirmation', i.id, i.seance_id);
    return 'confirmee';
  end if;
  return 'tardif';
end;
$$;

revoke all on function public.klub_paiement_session(uuid, text, text, text) from public, anon, authenticated;
revoke all on function public.klub_paiement_confirme(text, text, integer) from public, anon, authenticated;
grant execute on function public.klub_paiement_session(uuid, text, text, text) to service_role;
grant execute on function public.klub_paiement_confirme(text, text, integer) to service_role;

-- De quoi créer une session de paiement, depuis l'inscription (route
-- d'inscription) ou le jeton du mail (liste d'attente). Null si l'inscription
-- n'attend pas (ou plus) de paiement, ou si la séance n'est plus publiée.
create or replace function public.klub_paiement_infos(p_inscription uuid, p_jeton text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'inscription_id', i.id, 'email', i.email, 'jeton', i.jeton,
    'montant_centimes', i.montant_centimes, 'expire_at', i.paiement_expire_at,
    'session_url', i.stripe_session_url,
    'seance_id', s.id, 'titre', s.titre, 'debut', s.debut,
    'compte', c.compte)
  from public.klub_inscriptions i
  join public.klub_seances s on s.id = i.seance_id
  join public.site_comptes_stripe c on c.user_id = s.praticien_id and c.etat = 'pret'
  where (i.id = p_inscription or i.jeton = p_jeton)
    and i.statut = 'paiement' and i.paiement_expire_at > now()
    and s.statut = 'publiee';
$$;
revoke all on function public.klub_paiement_infos(uuid, text) from public, anon, authenticated;
grant execute on function public.klub_paiement_infos(uuid, text) to service_role;
