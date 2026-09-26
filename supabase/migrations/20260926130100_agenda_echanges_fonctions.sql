-- Agenda : les quatre transitions d'un échange, et l'application d'un accord.
--
-- Codes levés : AGENDA_DROITS, AGENDA_VOEU, AGENDA_STATUT, AGENDA_MOTIF,
-- AGENDA_SOI_MEME, AGENDA_SEMAINE, AGENDA_CASE_PRISE.

-- Le nom affichable d'un compte, pour les mails.
create or replace function public.agenda__nom(p_user uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  -- profiles.user_id référence auth.users ; profiles.id est une autre clé.
  select coalesce(p.first_name || ' ' || p.last_name, u.email)
    from auth.users u
    left join public.profiles p on p.user_id = u.id
   where u.id = p_user;
$$;

revoke all on function public.agenda__nom(uuid) from public, anon, authenticated;

-- Le libellé d'un échange, pour les mails et les fils.
create or replace function public.agenda__libelle_echange(p_echange uuid)
returns text
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  e record; c record; o record; v_texte text;
begin
  select * into e from public.agenda_echanges where id = p_echange;
  if not found then return ''; end if;
  select * into c from public.agenda_voeux where id = e.voeu_cible_id;

  v_texte := public.agenda__nom(e.demandeur_id) || ' demande '
          || public.agenda__libelle_case(c.salle, c.jour, c.moment);

  if e.voeu_offert_id is not null then
    select * into o from public.agenda_voeux where id = e.voeu_offert_id;
    v_texte := v_texte || ', en échange de ' || public.agenda__libelle_case(o.salle, o.jour, o.moment);
  else
    v_texte := v_texte || ', sans contrepartie';
  end if;

  if e.portee = 'ponctuel' then
    v_texte := v_texte || ', pour la semaine du ' || to_char(e.semaine, 'DD/MM/YYYY');
  else
    v_texte := v_texte || ', de façon définitive';
  end if;

  return v_texte;
end;
$$;

revoke all on function public.agenda__libelle_echange(uuid) from public, anon, authenticated;

-- 1. Proposer un échange.
create or replace function public.agenda_proposer_echange(
  p_cible uuid, p_offert uuid, p_portee text, p_semaine date, p_motif text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  c record; o record; v_id uuid;
begin
  perform public.agenda__verifier_equipe();
  if p_motif is null or length(btrim(p_motif)) = 0 then raise exception 'AGENDA_MOTIF'; end if;
  if p_portee not in ('ponctuel', 'definitif') then raise exception 'AGENDA_STATUT'; end if;

  select * into c from public.agenda_voeux where id = p_cible;
  if not found then raise exception 'AGENDA_VOEU'; end if;
  if c.statut <> 'valide' then raise exception 'AGENDA_STATUT'; end if;
  if c.user_id = auth.uid() then raise exception 'AGENDA_SOI_MEME'; end if;

  if p_offert is not null then
    select * into o from public.agenda_voeux where id = p_offert;
    if not found then raise exception 'AGENDA_VOEU'; end if;
    if o.user_id <> auth.uid() then raise exception 'AGENDA_DROITS'; end if;
    if o.statut <> 'valide' then raise exception 'AGENDA_STATUT'; end if;
  end if;

  if p_portee = 'ponctuel' then
    if p_semaine is null then raise exception 'AGENDA_SEMAINE'; end if;
    -- Un lundi, et pas une semaine déjà passée : un échange rétroactif
    -- n'arrange personne et poserait une exception invisible.
    if extract(isodow from p_semaine) <> 1 then raise exception 'AGENDA_SEMAINE'; end if;
    if p_semaine < date_trunc('week', current_date)::date then raise exception 'AGENDA_SEMAINE'; end if;
  elsif p_semaine is not null then
    raise exception 'AGENDA_SEMAINE';
  end if;

  insert into public.agenda_echanges (demandeur_id, voeu_cible_id, voeu_offert_id, portee, semaine, motif)
  values (auth.uid(), p_cible, p_offert, p_portee,
          case when p_portee = 'ponctuel' then p_semaine end, btrim(p_motif))
  returning id into v_id;

  perform public.agenda__mettre_en_file('echange_propose', c.user_id,
    'Demande d''échange de créneau',
    public.agenda__libelle_echange(v_id) || chr(10) || chr(10) || btrim(p_motif));

  return v_id;
end;
$$;

revoke all on function public.agenda_proposer_echange(uuid, uuid, text, date, text) from public, anon;
grant execute on function public.agenda_proposer_echange(uuid, uuid, text, date, text) to authenticated;

-- 2. Le titulaire de la case répond.
create or replace function public.agenda_repondre_echange(p_echange uuid, p_accepte boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  e record; c record; v_gerant record; v_libelle text;
begin
  perform public.agenda__verifier_equipe();

  select * into e from public.agenda_echanges where id = p_echange for no key update;
  if not found then raise exception 'AGENDA_VOEU'; end if;
  if e.statut <> 'propose' then raise exception 'AGENDA_STATUT'; end if;

  select * into c from public.agenda_voeux where id = e.voeu_cible_id;
  if c.user_id <> auth.uid() then raise exception 'AGENDA_DROITS'; end if;

  v_libelle := public.agenda__libelle_echange(p_echange);

  update public.agenda_echanges
     set statut = case when p_accepte then 'accepte_pair' else 'refuse_pair' end,
         pair_le = now()
   where id = p_echange;

  if p_accepte then
    -- Les deux sont d'accord : c'est aux gérants de trancher.
    for v_gerant in select user_id from public.site_super_admins loop
      perform public.agenda__mettre_en_file('echange_pair', v_gerant.user_id,
        'Échange à arbitrer', v_libelle || chr(10) || chr(10)
        || public.agenda__nom(c.user_id) || ' est d''accord.');
    end loop;
  else
    perform public.agenda__mettre_en_file('echange_pair', e.demandeur_id,
      'Votre demande d''échange est refusée',
      v_libelle || chr(10) || chr(10) || public.agenda__nom(c.user_id) || ' a refusé.');
  end if;
end;
$$;

revoke all on function public.agenda_repondre_echange(uuid, boolean) from public, anon;
grant execute on function public.agenda_repondre_echange(uuid, boolean) to authenticated;

-- 3. Un gérant tranche, et l'accord s'applique.
create or replace function public.agenda_trancher_echange(
  p_echange uuid, p_accorde boolean, p_commentaire text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  e record; c record; o record;
  v_libelle text;
  v_jour_cible date;
  v_jour_offert date;
begin
  if not coalesce(public.site_est_super_admin(), false) then raise exception 'AGENDA_DROITS'; end if;

  select * into e from public.agenda_echanges where id = p_echange for no key update;
  if not found then raise exception 'AGENDA_VOEU'; end if;
  -- Un gérant ne tranche pas ce que le pair n'a pas accepté.
  if e.statut <> 'accepte_pair' then raise exception 'AGENDA_STATUT'; end if;

  select * into c from public.agenda_voeux where id = e.voeu_cible_id for no key update;
  if not found then raise exception 'AGENDA_VOEU'; end if;
  if e.voeu_offert_id is not null then
    select * into o from public.agenda_voeux where id = e.voeu_offert_id for no key update;
  end if;

  v_libelle := public.agenda__libelle_echange(p_echange);

  if p_accorde then
    if e.portee = 'ponctuel' then
      -- La date de chaque côté se déduit du jour de son propre vœu.
      v_jour_cible := e.semaine + (c.jour - 1);

      -- Deux échanges accordés sur la même case à la même date : on lève un
      -- code lisible plutôt que de laisser remonter la violation d'unicité,
      -- dont le message brut n'apprendrait rien au gérant.
      if exists (select 1 from public.agenda_exceptions
                  where jour = v_jour_cible and salle = c.salle and moment = c.moment) then
        raise exception 'AGENDA_EXCEPTION_PRISE';
      end if;

      insert into public.agenda_exceptions (jour, salle, moment, user_id, echange_id)
      values (v_jour_cible, c.salle, c.moment, e.demandeur_id, p_echange);

      if e.voeu_offert_id is not null then
        v_jour_offert := e.semaine + (o.jour - 1);
        if exists (select 1 from public.agenda_exceptions
                    where jour = v_jour_offert and salle = o.salle and moment = o.moment) then
          raise exception 'AGENDA_EXCEPTION_PRISE';
        end if;
        insert into public.agenda_exceptions (jour, salle, moment, user_id, echange_id)
        values (v_jour_offert, o.salle, o.moment, c.user_id, p_echange);
      end if;
    else
      -- Définitif : les vœux changent de propriétaire. On retire d'abord un
      -- éventuel vœu du receveur sur cette case, sinon l'unicité
      -- (user_id, salle, jour, moment) refuse le changement.
      perform set_config('agenda.transition', '1', true);

      delete from public.agenda_voeux
       where user_id = e.demandeur_id and salle = c.salle and jour = c.jour
         and moment = c.moment and id <> c.id;
      update public.agenda_voeux set user_id = e.demandeur_id where id = c.id;

      if e.voeu_offert_id is not null then
        delete from public.agenda_voeux
         where user_id = c.user_id and salle = o.salle and jour = o.jour
           and moment = o.moment and id <> o.id;
        update public.agenda_voeux set user_id = c.user_id where id = o.id;
      end if;

      perform set_config('agenda.transition', '', true);
    end if;
  end if;

  update public.agenda_echanges
     set statut = case when p_accorde then 'valide' else 'refuse' end,
         decide_par = auth.uid(), decide_le = now()
   where id = p_echange;

  perform public.agenda__mettre_en_file('echange_tranche', e.demandeur_id,
    case when p_accorde then 'Échange accordé' else 'Échange refusé' end,
    v_libelle || chr(10) || chr(10) || coalesce(btrim(p_commentaire), ''));
  perform public.agenda__mettre_en_file('echange_tranche', c.user_id,
    case when p_accorde then 'Échange accordé' else 'Échange refusé' end,
    v_libelle || chr(10) || chr(10) || coalesce(btrim(p_commentaire), ''));
end;
$$;

revoke all on function public.agenda_trancher_echange(uuid, boolean, text) from public, anon;
grant execute on function public.agenda_trancher_echange(uuid, boolean, text) to authenticated;

-- 4. Le demandeur annule, tant que rien n'est tranché.
create or replace function public.agenda_annuler_echange(p_echange uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  e record;
begin
  perform public.agenda__verifier_equipe();

  select * into e from public.agenda_echanges where id = p_echange for no key update;
  if not found then raise exception 'AGENDA_VOEU'; end if;
  if e.demandeur_id <> auth.uid() then raise exception 'AGENDA_DROITS'; end if;
  if e.statut not in ('propose', 'accepte_pair') then raise exception 'AGENDA_STATUT'; end if;

  update public.agenda_echanges set statut = 'annule' where id = p_echange;
end;
$$;

revoke all on function public.agenda_annuler_echange(uuid) from public, anon;
grant execute on function public.agenda_annuler_echange(uuid) to authenticated;
