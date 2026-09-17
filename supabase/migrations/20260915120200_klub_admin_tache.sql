-- Mugi Klub : fonctions de l'admin, génération des séances, tâche planifiée.
-- Toutes les fonctions admin vérifient is_practitioner() : la RLS des tables
-- ne donne aux praticiens que la lecture.

create or replace function public.klub__verifier_droits()
returns void language plpgsql stable security definer set search_path = '' as $$
begin
  if not coalesce(public.is_practitioner(), false) then raise exception 'KLUB_DROITS'; end if;
end;
$$;

-- Séances des créneaux actifs sur les 28 jours à venir. Rejouable : un
-- créneau n'a jamais deux séances le même jour.
create or replace function public.klub__generer()
returns integer language plpgsql security definer set search_path = '' as $$
declare
  c public.klub_creneaux;
  v_aujourdhui date := (now() at time zone 'Europe/Paris')::date;
  v_jour date;
  v_debut timestamptz;
  v_n integer := 0;
begin
  for c in select * from public.klub_creneaux where actif loop
    for d in 0..27 loop
      v_jour := v_aujourdhui + d;
      continue when extract(isodow from v_jour) <> c.jour;
      v_debut := (v_jour + c.heure) at time zone 'Europe/Paris';
      continue when v_debut <= now();
      continue when exists (
        select 1 from public.klub_seances
        where creneau_id = c.id and (debut at time zone 'Europe/Paris')::date = v_jour
      );
      insert into public.klub_seances (creneau_id, debut, duree_min, type, titre, description, intervenant,
                                       intervenant_email, capacite, prix_libelle, inscription_requise)
      values (c.id, v_debut, c.duree_min, c.type, c.titre, c.description, c.intervenant,
              c.intervenant_email, c.capacite, c.prix_libelle, c.inscription_requise)
      on conflict (creneau_id, debut) do nothing;
      v_n := v_n + 1;
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
  v_id uuid := nullif(p->>'id', '')::uuid;
  v_requise boolean := coalesce((p->>'inscription_requise')::boolean, true);
  v_conservees integer;
begin
  perform public.klub__verifier_droits();

  if v_id is null or not exists (select 1 from public.klub_creneaux where id = v_id) then
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
  end if;

  delete from public.klub_seances s
  where s.creneau_id = v_id and s.debut > now() and not s.modifiee and s.statut = 'publiee'
    and not exists (select 1 from public.klub_inscriptions i where i.seance_id = s.id);

  select count(*) into v_conservees from public.klub_seances where creneau_id = v_id and debut > now();

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
  v_requise boolean := coalesce((p->>'inscription_requise')::boolean, true);
  v_id uuid;
begin
  perform public.klub__verifier_droits();
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
  v_requise boolean := coalesce((p->>'inscription_requise')::boolean, true);
  v_capacite smallint := case when coalesce((p->>'inscription_requise')::boolean, true) then nullif(p->>'capacite', '')::smallint end;
  v_prevenus integer := 0;
begin
  perform public.klub__verifier_droits();
  select * into s from public.klub_seances where id = p_id for no key update;
  if not found then raise exception 'KLUB_SEANCE'; end if;
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
  -- Les mails pas encore partis n'ont plus de sens.
  update public.klub_mails set statut = 'abandonne', reserve_at = null where seance_id = p_id and statut = 'a_envoyer';
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

create or replace function public.klub_admin_ajouter(
  p_seance uuid, p_prenom text, p_nom text, p_email text, p_telephone text, p_premiere boolean, p_si_complet text
)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.klub__verifier_droits();
  return public.klub__inscrire(p_seance, p_prenom, p_nom, p_email, p_telephone, p_premiere, 'admin',
                               case when p_si_complet = 'forcer' then 'forcer' else 'attente' end);
end;
$$;

create or replace function public.klub_admin_annuler_inscription(p_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.klub__verifier_droits();
  return public.klub__annuler(p_id, true);
end;
$$;

create or replace function public.klub_admin_presence(p_id uuid, p_present boolean)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform public.klub__verifier_droits();
  update public.klub_inscriptions set present = coalesce(p_present, false) where id = p_id;
end;
$$;

create or replace function public.klub_admin_relancer_mail(p_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform public.klub__verifier_droits();
  update public.klub_mails
  set statut = 'a_envoyer', tentatives = 0, envoyer_apres = now(), derniere_erreur = null, reserve_at = null
  where id = p_id and statut = 'erreur';
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

  -- Envoi interrompu depuis plus de 10 minutes : on le remet en file.
  update public.klub_mails set statut = 'a_envoyer', reserve_at = null
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

revoke execute on function public.klub__verifier_droits() from public, anon, authenticated;
revoke execute on function public.klub__generer() from public, anon, authenticated;

revoke execute on function public.klub_admin_sauver_creneau(jsonb) from public, anon;
revoke execute on function public.klub_admin_creer_seance(jsonb) from public, anon;
revoke execute on function public.klub_admin_modifier_seance(uuid, jsonb) from public, anon;
revoke execute on function public.klub_admin_annuler_seance(uuid) from public, anon;
revoke execute on function public.klub_admin_ajouter(uuid, text, text, text, text, boolean, text) from public, anon;
revoke execute on function public.klub_admin_annuler_inscription(uuid) from public, anon;
revoke execute on function public.klub_admin_presence(uuid, boolean) from public, anon;
revoke execute on function public.klub_admin_relancer_mail(uuid) from public, anon;
grant execute on function public.klub_admin_sauver_creneau(jsonb) to authenticated;
grant execute on function public.klub_admin_creer_seance(jsonb) to authenticated;
grant execute on function public.klub_admin_modifier_seance(uuid, jsonb) to authenticated;
grant execute on function public.klub_admin_annuler_seance(uuid) to authenticated;
grant execute on function public.klub_admin_ajouter(uuid, text, text, text, text, boolean, text) to authenticated;
grant execute on function public.klub_admin_annuler_inscription(uuid) to authenticated;
grant execute on function public.klub_admin_presence(uuid, boolean) to authenticated;
grant execute on function public.klub_admin_relancer_mail(uuid) to authenticated;

revoke execute on function public.klub_tache() from public, anon, authenticated;
grant execute on function public.klub_tache() to service_role;
