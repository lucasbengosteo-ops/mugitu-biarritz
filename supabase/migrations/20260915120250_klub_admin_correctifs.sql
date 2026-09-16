-- Mugi Klub : correctifs de revue des fonctions admin (tâche 7).
-- Remplace les définitions de 20260915120200_klub_admin_tache.sql pour les
-- fonctions ci-dessous ; ce fichier fait foi pour leur état final.

-- Date d'occurrence (jour à Paris) pour laquelle le créneau a produit la
-- séance. Déplacer une séance ne libère plus son occurrence : la génération
-- ne recrée pas l'original. Les séances ponctuelles gardent null.
alter table public.klub_seances add column occurrence date;
update public.klub_seances set occurrence = (debut at time zone 'Europe/Paris')::date
where creneau_id is not null and occurrence is null;
create unique index klub_seances_occurrence on public.klub_seances (creneau_id, occurrence);
-- L'occurrence remplace l'unicité sur le début : changer `debut` ne touche
-- plus une clé, et la mise à jour reste compatible avec FOR KEY SHARE.
alter table public.klub_seances drop constraint klub_seances_creneau_id_debut_key;

-- Séances des créneaux actifs sur les 28 jours à venir. Rejouable : un
-- créneau n'a jamais deux séances pour la même occurrence.
-- Appelants : klub_tache et klub_admin_sauver_creneau, qui prennent le verrou
-- consultatif 'klub.generation' avant.
create or replace function public.klub__generer()
returns integer language plpgsql security definer set search_path = '' as $$
declare
  c public.klub_creneaux;
  v_aujourdhui date := (now() at time zone 'Europe/Paris')::date;
  v_jour date;
  v_debut timestamptz;
  v_ligne integer;
  v_n integer := 0;
begin
  for c in select * from public.klub_creneaux where actif loop
    for d in 0..27 loop
      v_jour := v_aujourdhui + d;
      continue when extract(isodow from v_jour) <> c.jour;
      v_debut := (v_jour + c.heure) at time zone 'Europe/Paris';
      continue when v_debut <= now();
      continue when exists (
        select 1 from public.klub_seances where creneau_id = c.id and occurrence = v_jour
      );
      insert into public.klub_seances (creneau_id, occurrence, debut, duree_min, type, titre, description, intervenant,
                                       intervenant_email, capacite, prix_libelle, inscription_requise)
      values (c.id, v_jour, v_debut, c.duree_min, c.type, c.titre, c.description, c.intervenant,
              c.intervenant_email, c.capacite, c.prix_libelle, c.inscription_requise)
      on conflict (creneau_id, occurrence) do nothing;
      get diagnostics v_ligne = row_count;
      v_n := v_n + v_ligne;
    end loop;
  end loop;
  return v_n;
end;
$$;

-- Crée ou modifie un créneau, puis refait ses séances futures qui n'ont
-- aucune inscription et n'ont pas été modifiées à part.
create or replace function public.klub_admin_sauver_creneau(p jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_requise boolean;
  v_conservees integer;
begin
  -- Droits d'abord : aucune conversion ne doit s'exécuter avant (les
  -- initialiseurs du DECLARE échapperaient aussi au bloc EXCEPTION).
  perform public.klub__verifier_droits();
  -- Une seule génération à la fois (voir klub_tache).
  perform pg_advisory_xact_lock(hashtext('klub.generation'));

  v_id := nullif(p->>'id', '')::uuid;
  v_requise := coalesce((p->>'inscription_requise')::boolean, true);

  if v_id is null then
    insert into public.klub_creneaux (jour, heure, duree_min, type, titre, description, intervenant,
                                      intervenant_email, capacite, prix_libelle, inscription_requise, actif)
    values ((p->>'jour')::smallint, (p->>'heure')::time, (p->>'duree_min')::smallint, p->>'type',
            trim(coalesce(p->>'titre', '')), coalesce(p->>'description', ''), coalesce(p->>'intervenant', ''),
            nullif(lower(trim(coalesce(p->>'intervenant_email', ''))), ''),
            case when v_requise then nullif(p->>'capacite', '')::smallint end,
            coalesce(p->>'prix_libelle', ''), v_requise, coalesce((p->>'actif')::boolean, true))
    returning id into v_id;
  else
    update public.klub_creneaux set
      jour = (p->>'jour')::smallint,
      heure = (p->>'heure')::time,
      duree_min = (p->>'duree_min')::smallint,
      type = p->>'type',
      titre = trim(coalesce(p->>'titre', '')),
      description = coalesce(p->>'description', ''),
      intervenant = coalesce(p->>'intervenant', ''),
      intervenant_email = nullif(lower(trim(coalesce(p->>'intervenant_email', ''))), ''),
      capacite = case when v_requise then nullif(p->>'capacite', '')::smallint end,
      prix_libelle = coalesce(p->>'prix_libelle', ''),
      inscription_requise = v_requise,
      actif = coalesce((p->>'actif')::boolean, true)
    where id = v_id;
    if not found then raise exception 'KLUB_CRENEAU'; end if;
  end if;

  -- Verrou des séances candidates dans une instruction à part : une
  -- inscription en cours (qui tient la séance en FOR NO KEY UPDATE) se termine
  -- d'abord, et le DELETE qui suit prend un nouvel instantané où il la voit.
  -- FOR UPDATE et non FOR NO KEY UPDATE : le DELETE demandera ce niveau de
  -- toute façon, et le prendre tout de suite bloque aussi les FOR KEY SHARE
  -- (insertion d'une inscription ou d'un mail qui référence la séance) entre
  -- ce verrou et la suppression, sans montée de verrou en cours de route.
  perform 1 from public.klub_seances
  where creneau_id = v_id and debut > now() and not modifiee and statut = 'publiee'
  order by id
  for update;

  delete from public.klub_seances s
  where s.creneau_id = v_id and s.debut > now() and not s.modifiee and s.statut = 'publiee'
    and not exists (select 1 from public.klub_inscriptions i where i.seance_id = s.id);

  select count(*) into v_conservees from public.klub_seances
  where creneau_id = v_id and debut > now() and statut = 'publiee';

  perform public.klub__generer();

  return jsonb_build_object('id', v_id, 'conservees', v_conservees);
exception
  when check_violation or not_null_violation or invalid_text_representation
       or invalid_datetime_format or datetime_field_overflow or numeric_value_out_of_range then
    raise exception 'KLUB_CHAMP';
end;
$$;

create or replace function public.klub_admin_creer_seance(p jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_requise boolean;
  v_id uuid;
begin
  perform public.klub__verifier_droits();
  v_requise := coalesce((p->>'inscription_requise')::boolean, true);
  insert into public.klub_seances (debut, duree_min, type, titre, description, intervenant, intervenant_email,
                                   capacite, prix_libelle, inscription_requise)
  values ((p->>'debut')::timestamptz, (p->>'duree_min')::smallint, p->>'type', trim(coalesce(p->>'titre', '')),
          coalesce(p->>'description', ''), coalesce(p->>'intervenant', ''),
          nullif(lower(trim(coalesce(p->>'intervenant_email', ''))), ''),
          case when v_requise then nullif(p->>'capacite', '')::smallint end,
          coalesce(p->>'prix_libelle', ''), v_requise)
  returning id into v_id;
  return v_id;
exception
  when check_violation or not_null_violation or invalid_text_representation
       or invalid_datetime_format or datetime_field_overflow or numeric_value_out_of_range then
    raise exception 'KLUB_CHAMP';
end;
$$;

-- Modifie une séance. Les inscrits sont prévenus si la date, l'heure, la
-- durée ou l'intervenant changent.
create or replace function public.klub_admin_modifier_seance(p_id uuid, p jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
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
    select 1 from public.klub_inscriptions where seance_id = p_id and statut in ('confirmee', 'attente')
  ) then
    raise exception 'KLUB_LIBRE';
  end if;
  if v_requise and v_capacite is not null
     and v_capacite < (select count(*) from public.klub_inscriptions where seance_id = p_id and statut = 'confirmee') then
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
      where i.seance_id = p_id and i.statut in ('confirmee', 'attente')
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
$$;

create or replace function public.klub_admin_annuler_seance(p_id uuid)
returns integer language plpgsql security definer set search_path = '' as $$
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
    where i.seance_id = p_id and i.statut in ('confirmee', 'attente')
    returning 1
  )
  select count(*) into v_n from ins;
  return v_n;
end;
$$;

-- Appelée chaque minute par /api/klub/tache.
create or replace function public.klub_tache()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_generees integer;
  v_rappels integer;
  v_listes integer;
  v_relancees integer;
  v_purgees integer;
begin
  -- Une seule génération à la fois : deux tâches, ou une tâche et une
  -- sauvegarde de créneau, ne se croisent pas.
  perform pg_advisory_xact_lock(hashtext('klub.generation'));

  v_generees := public.klub__generer();

  -- Rappel la veille à 18 h, pour les inscriptions antérieures à ce moment.
  with ins as (
    insert into public.klub_mails (type, inscription_id, seance_id)
    select 'rappel', i.id, s.id
    from public.klub_seances s
    join public.klub_inscriptions i on i.seance_id = s.id and i.statut = 'confirmee'
    where s.statut = 'publiee' and s.debut > now()
      and now() >= ((((s.debut at time zone 'Europe/Paris')::date - 1) + time '18:00') at time zone 'Europe/Paris')
      and i.created_at < ((((s.debut at time zone 'Europe/Paris')::date - 1) + time '18:00') at time zone 'Europe/Paris')
    on conflict (type, inscription_id, seance_id) where type in ('rappel', 'liste_intervenant') do nothing
    returning 1
  )
  select count(*) into v_rappels from ins;

  -- Liste des inscrits à l'intervenant, 2 h avant.
  with ins as (
    insert into public.klub_mails (type, inscription_id, seance_id)
    select 'liste_intervenant', null, s.id
    from public.klub_seances s
    where s.statut = 'publiee' and s.inscription_requise and s.intervenant_email is not null
      and now() >= s.debut - interval '2 hours' and now() < s.debut
      and exists (select 1 from public.klub_inscriptions i where i.seance_id = s.id and i.statut = 'confirmee')
    on conflict (type, inscription_id, seance_id) where type in ('rappel', 'liste_intervenant') do nothing
    returning 1
  )
  select count(*) into v_listes from ins;

  -- Envoi interrompu depuis plus de 10 minutes : on le remet en file, sauf
  -- après 4 tentatives, où il passe en erreur (relance manuelle depuis
  -- l'admin). `relancees` compte toutes les lignes touchées.
  update public.klub_mails
  set statut = case when tentatives >= 4 then 'erreur' else 'a_envoyer' end,
      derniere_erreur = coalesce(derniere_erreur, 'envoi interrompu'),
      reserve_at = null
  where statut = 'en_cours' and reserve_at < now() - interval '10 minutes';
  get diagnostics v_relancees = row_count;

  with suppr as (
    delete from public.klub_seances
    where debut + make_interval(mins => duree_min::int) < now() - interval '12 months'
    returning 1
  )
  select count(*) into v_purgees from suppr;

  return jsonb_build_object('generees', v_generees, 'rappels', v_rappels, 'listes', v_listes,
                            'relancees', v_relancees, 'purgees', v_purgees);
end;
$$;

-- Aides internes et admin : jamais par la clé de service. Les fonctions admin
-- sont réservées aux praticiens connectés ; klub_tache appelle klub__generer
-- en tant que propriétaire.
revoke execute on function public.klub__verifier_droits(), public.klub__generer() from service_role;
revoke execute on function
  public.klub_admin_sauver_creneau(jsonb),
  public.klub_admin_creer_seance(jsonb),
  public.klub_admin_modifier_seance(uuid, jsonb),
  public.klub_admin_annuler_seance(uuid),
  public.klub_admin_ajouter(uuid, text, text, text, text, boolean, text),
  public.klub_admin_annuler_inscription(uuid),
  public.klub_admin_presence(uuid, boolean),
  public.klub_admin_relancer_mail(uuid)
from service_role;
