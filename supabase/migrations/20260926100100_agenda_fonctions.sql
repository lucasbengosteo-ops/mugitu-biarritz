-- Agenda : la file de mails, et les quatre transitions d'état.
--
-- La file est dénormalisée — destinataire, sujet et corps figés à la mise
-- en file — parce qu'un retrait accordé supprime le vœu : le mail qui
-- l'annonce doit survivre à la ligne qui l'a déclenché.

create table public.agenda_mails (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in
    ('voeu_valide', 'voeu_refuse', 'retrait_demande', 'retrait_tranche', 'commentaire')),
  destinataire_email text not null,
  sujet text not null,
  corps text not null,
  envoyer_apres timestamptz not null default now(),
  statut text not null default 'a_envoyer'
    check (statut in ('a_envoyer', 'en_cours', 'envoye', 'erreur', 'abandonne')),
  tentatives smallint not null default 0,
  reserve_at timestamptz,
  derniere_erreur text,
  created_at timestamptz not null default now(),
  envoye_at timestamptz
);

create index agenda_mails_file on public.agenda_mails (statut, envoyer_apres);

alter table public.agenda_mails enable row level security;
revoke all on public.agenda_mails from anon, authenticated;
-- Personne ne lit cette table depuis le navigateur : seule la clé de
-- service y touche, depuis lib/agenda/envoi.ts.

-- Le libellé d'une case, pour les mails et les fils.
create or replace function public.agenda__libelle_case(p_salle text, p_jour smallint, p_moment text)
returns text
language sql
immutable
set search_path = ''
as $$
  select initcap(p_salle) || ', '
      || (array['lundi','mardi','mercredi','jeudi','vendredi'])[p_jour] || ' '
      || case p_moment when 'matin' then 'matin' else 'après-midi' end;
$$;

-- Met un mail en file. Interne : jamais appelée depuis le navigateur.
create or replace function public.agenda__mettre_en_file(
  p_type text, p_destinataire uuid, p_sujet text, p_corps text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text;
begin
  select u.email into v_email from auth.users u where u.id = p_destinataire;
  if v_email is null then return; end if;
  insert into public.agenda_mails (type, destinataire_email, sujet, corps)
  values (p_type, v_email, p_sujet, p_corps);
end;
$$;

revoke all on function public.agenda__mettre_en_file(text, uuid, text, text) from public, anon, authenticated;

-- Réserve des mails à envoyer. `for update skip locked` empêche deux
-- exécutions du cron d'envoyer le même mail deux fois.
create or replace function public.agenda_reserver_mails(p_max int default 20)
returns setof public.agenda_mails
language plpgsql
security definer
set search_path = ''
as $$
begin
  return query
  with pris as (
    select m.id from public.agenda_mails m
    where m.statut in ('a_envoyer', 'erreur')
      and m.envoyer_apres <= now()
      and m.tentatives < 5
    order by m.envoyer_apres
    limit p_max
    for update skip locked
  )
  update public.agenda_mails m
     set statut = 'en_cours', reserve_at = now(), tentatives = m.tentatives + 1
    from pris
   where m.id = pris.id
  returning m.*;
end;
$$;

revoke all on function public.agenda_reserver_mails(int) from public, anon, authenticated;

-- Garde commune : l'appelant fait-il partie de l'équipe ?
create or replace function public.agenda__verifier_equipe()
returns void
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not coalesce(public.site_est_equipe(), false) then raise exception 'AGENDA_DROITS'; end if;
end;
$$;

revoke all on function public.agenda__verifier_equipe() from public, anon;
grant execute on function public.agenda__verifier_equipe() to authenticated;

-- 1. Un gérant accorde ou refuse un vœu.
create or replace function public.agenda_decider(
  p_voeu uuid, p_statut text, p_commentaire text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v record;
  v_libelle text;
begin
  if not coalesce(public.site_est_super_admin(), false) then raise exception 'AGENDA_DROITS'; end if;
  if p_statut not in ('valide', 'refuse') then raise exception 'AGENDA_STATUT'; end if;

  select * into v from public.agenda_voeux where id = p_voeu for no key update;
  if not found then raise exception 'AGENDA_VOEU'; end if;
  if v.statut not in ('propose', 'refuse') then raise exception 'AGENDA_STATUT'; end if;

  -- Une case ne porte qu'un seul vœu accordé.
  if p_statut = 'valide' and exists (
    select 1 from public.agenda_voeux a
    where a.salle = v.salle and a.jour = v.jour and a.moment = v.moment
      and a.id <> v.id and a.statut in ('valide', 'retrait_demande')
  ) then
    raise exception 'AGENDA_CASE_PRISE';
  end if;

  perform set_config('agenda.transition', '1', true);
  update public.agenda_voeux
     set statut = p_statut, decide_par = auth.uid(), decide_le = now()
   where id = p_voeu;
  perform set_config('agenda.transition', '', true);

  if p_commentaire is not null and length(btrim(p_commentaire)) > 0 then
    insert into public.agenda_commentaires (voeu_id, auteur_id, texte)
    values (p_voeu, auth.uid(), btrim(p_commentaire));
  end if;

  v_libelle := public.agenda__libelle_case(v.salle, v.jour, v.moment);
  perform public.agenda__mettre_en_file(
    case when p_statut = 'valide' then 'voeu_valide' else 'voeu_refuse' end,
    v.user_id,
    case when p_statut = 'valide'
      then 'Votre créneau est accordé : ' || v_libelle
      else 'Votre demande de créneau est refusée : ' || v_libelle end,
    coalesce(btrim(p_commentaire), ''));
end;
$$;

revoke all on function public.agenda_decider(uuid, text, text) from public, anon;
grant execute on function public.agenda_decider(uuid, text, text) to authenticated;

-- 2. L'auteur d'un vœu accordé demande à le rendre.
create or replace function public.agenda_demander_retrait(p_voeu uuid, p_motif text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v record;
  v_libelle text;
  v_gerant record;
  v_nom text;
begin
  perform public.agenda__verifier_equipe();
  if p_motif is null or length(btrim(p_motif)) = 0 then raise exception 'AGENDA_MOTIF'; end if;

  select * into v from public.agenda_voeux where id = p_voeu for no key update;
  if not found then raise exception 'AGENDA_VOEU'; end if;
  if v.user_id <> auth.uid() then raise exception 'AGENDA_DROITS'; end if;
  if v.statut <> 'valide' then raise exception 'AGENDA_STATUT'; end if;

  perform set_config('agenda.transition', '1', true);
  update public.agenda_voeux set statut = 'retrait_demande' where id = p_voeu;
  perform set_config('agenda.transition', '', true);
  insert into public.agenda_commentaires (voeu_id, auteur_id, texte)
  values (p_voeu, auth.uid(), btrim(p_motif));

  v_libelle := public.agenda__libelle_case(v.salle, v.jour, v.moment);
  select coalesce(p.first_name || ' ' || p.last_name, u.email) into v_nom
    from auth.users u left join public.profiles p on p.id = u.id where u.id = v.user_id;

  for v_gerant in select user_id from public.site_super_admins loop
    perform public.agenda__mettre_en_file('retrait_demande', v_gerant.user_id,
      'Demande de retrait : ' || v_libelle,
      v_nom || ' demande à rendre ce créneau.' || chr(10) || chr(10) || btrim(p_motif));
  end loop;
end;
$$;

revoke all on function public.agenda_demander_retrait(uuid, text) from public, anon;
grant execute on function public.agenda_demander_retrait(uuid, text) to authenticated;

-- 3. Un gérant tranche la demande de retrait.
create or replace function public.agenda_trancher_retrait(
  p_voeu uuid, p_accorde boolean, p_commentaire text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v record;
  v_libelle text;
begin
  if not coalesce(public.site_est_super_admin(), false) then raise exception 'AGENDA_DROITS'; end if;

  select * into v from public.agenda_voeux where id = p_voeu for no key update;
  if not found then raise exception 'AGENDA_VOEU'; end if;
  if v.statut <> 'retrait_demande' then raise exception 'AGENDA_STATUT'; end if;

  v_libelle := public.agenda__libelle_case(v.salle, v.jour, v.moment);

  perform public.agenda__mettre_en_file('retrait_tranche', v.user_id,
    case when p_accorde
      then 'Retrait accordé : ' || v_libelle
      else 'Retrait refusé : ' || v_libelle end,
    coalesce(btrim(p_commentaire), ''));

  perform set_config('agenda.transition', '1', true);
  if p_accorde then
    -- Le mail est déjà en file : il survit à la suppression du vœu.
    delete from public.agenda_voeux where id = p_voeu;
  else
    update public.agenda_voeux
       set statut = 'valide', decide_par = auth.uid(), decide_le = now()
     where id = p_voeu;
    if p_commentaire is not null and length(btrim(p_commentaire)) > 0 then
      insert into public.agenda_commentaires (voeu_id, auteur_id, texte)
      values (p_voeu, auth.uid(), btrim(p_commentaire));
    end if;
  end if;
  perform set_config('agenda.transition', '', true);
end;
$$;

revoke all on function public.agenda_trancher_retrait(uuid, boolean, text) from public, anon;
grant execute on function public.agenda_trancher_retrait(uuid, boolean, text) to authenticated;

-- 4. Poster un commentaire dans le fil d'un vœu.
create or replace function public.agenda_commenter(p_voeu uuid, p_texte text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v record;
  v_libelle text;
  v_gerant record;
begin
  perform public.agenda__verifier_equipe();
  if p_texte is null or length(btrim(p_texte)) = 0 then raise exception 'AGENDA_TEXTE'; end if;

  select * into v from public.agenda_voeux where id = p_voeu;
  if not found then raise exception 'AGENDA_VOEU'; end if;
  if v.user_id <> auth.uid() and not coalesce(public.site_est_super_admin(), false) then
    raise exception 'AGENDA_DROITS';
  end if;

  insert into public.agenda_commentaires (voeu_id, auteur_id, texte)
  values (p_voeu, auth.uid(), btrim(p_texte));

  v_libelle := public.agenda__libelle_case(v.salle, v.jour, v.moment);

  if v.user_id = auth.uid() then
    -- L'auteur parle : ce sont les gérants qui doivent lire.
    for v_gerant in select user_id from public.site_super_admins loop
      perform public.agenda__mettre_en_file('commentaire', v_gerant.user_id,
        'Nouveau message : ' || v_libelle, btrim(p_texte));
    end loop;
  else
    perform public.agenda__mettre_en_file('commentaire', v.user_id,
      'Nouveau message : ' || v_libelle, btrim(p_texte));
  end if;
end;
$$;

revoke all on function public.agenda_commenter(uuid, text) from public, anon;
grant execute on function public.agenda_commenter(uuid, text) to authenticated;
