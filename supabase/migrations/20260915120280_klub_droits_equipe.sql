-- Mugi Klub : droits réservés à l'équipe et permissions de tables resserrées.
-- Remplace klub__verifier_droits de 20260915120200_klub_admin_tache.sql et les
-- politiques *_lecture_praticien de 20260915120000_klub_tables.sql ; ce
-- fichier fait foi pour leur état final.
--
-- public.is_practitioner() (hors de ce dépôt) répond vrai pour toute ligne de
-- user_roles, y compris le rôle « sportif » donné aux athlètes. Le Klub a donc
-- son propre contrôle : une ligne user_roles dont le rôle n'est pas « sportif ».
-- is_practitioner() et user_roles ne sont pas modifiés.
--
-- Deuxième barrière : anon n'a plus aucun droit sur les tables (tout passe par
-- les fonctions security definer), authenticated ne garde que la lecture
-- (filtrée par RLS). service_role n'est pas touché : la clé de service écrit
-- dans klub_mails depuis lib/klub/envoi.ts.

create or replace function public.klub__est_equipe()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = auth.uid() and ur.role::text <> 'sportif'
  );
$$;

revoke all on function public.klub__est_equipe() from public, anon;
grant execute on function public.klub__est_equipe() to authenticated;

create or replace function public.klub__verifier_droits()
returns void
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not coalesce(public.klub__est_equipe(), false) then raise exception 'KLUB_DROITS'; end if;
end;
$$;

drop policy if exists klub_creneaux_lecture_praticien on public.klub_creneaux;
create policy klub_creneaux_lecture_praticien on public.klub_creneaux
  for select to authenticated using (public.klub__est_equipe());

drop policy if exists klub_seances_lecture_praticien on public.klub_seances;
create policy klub_seances_lecture_praticien on public.klub_seances
  for select to authenticated using (public.klub__est_equipe());

drop policy if exists klub_inscriptions_lecture_praticien on public.klub_inscriptions;
create policy klub_inscriptions_lecture_praticien on public.klub_inscriptions
  for select to authenticated using (public.klub__est_equipe());

drop policy if exists klub_mails_lecture_praticien on public.klub_mails;
create policy klub_mails_lecture_praticien on public.klub_mails
  for select to authenticated using (public.klub__est_equipe());

revoke all on public.klub_creneaux, public.klub_seances, public.klub_inscriptions, public.klub_mails from anon;
revoke insert, update, delete, truncate, references, trigger, maintain
  on public.klub_creneaux, public.klub_seances, public.klub_inscriptions, public.klub_mails from authenticated;
