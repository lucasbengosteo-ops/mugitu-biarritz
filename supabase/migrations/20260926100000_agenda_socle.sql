-- Agenda du cabinet : la semaine type et son fil de discussion.
--
-- Une semaine type, sans dates : un vœu dit « telle salle, tel jour de la
-- semaine, matin ou après-midi ». Les dates réelles arrivent au chantier
-- C1b (absences et exceptions) et ne modifient jamais ces lignes.
--
-- anon n'a aucun droit sur ces tables. authenticated ne garde que la
-- lecture et l'écriture de ses propres vœux : tout changement d'état passe
-- par les fonctions security definer de la migration suivante, parce
-- qu'une politique RLS ne sait pas restreindre l'écriture à certaines
-- colonnes.

create table public.agenda_voeux (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  salle text not null check (salle in ('lurra', 'airea', 'etera', 'sua', 'ura')),
  jour smallint not null check (jour between 1 and 5),
  moment text not null check (moment in ('matin', 'aprem')),
  statut text not null default 'propose'
    check (statut in ('propose', 'valide', 'refuse', 'retrait_demande')),
  decide_par uuid references auth.users (id) on delete set null,
  decide_le timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Une personne ne demande pas deux fois la même case.
  unique (user_id, salle, jour, moment)
);

create index agenda_voeux_case on public.agenda_voeux (salle, jour, moment, statut);
create index agenda_voeux_personne on public.agenda_voeux (user_id, statut);

create table public.agenda_commentaires (
  id uuid primary key default gen_random_uuid(),
  voeu_id uuid not null references public.agenda_voeux (id) on delete cascade,
  auteur_id uuid not null references auth.users (id) on delete cascade,
  texte text not null check (length(btrim(texte)) > 0),
  created_at timestamptz not null default now()
);

create index agenda_commentaires_voeu on public.agenda_commentaires (voeu_id, created_at);

-- Deux règles, un seul déclencheur.
--
-- 1. Personne ne change `statut`, `decide_par` ni `decide_le` par un UPDATE
--    direct. Sans ça, la politique de modification ci-dessous laisserait
--    n'importe qui poser un vœu en « proposé » puis se l'accorder lui-même.
--    Les fonctions security definer posent le drapeau de session
--    `agenda.transition` avant d'écrire : c'est leur laissez-passer.
-- 2. Déplacer un vœu accordé le ramène en « proposé ». Tenu ici et non par
--    l'interface : la règle doit valoir aussi pour une écriture directe.
create or replace function public.agenda__garde_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_autorise boolean := coalesce(current_setting('agenda.transition', true), '') = '1';
begin
  if not v_autorise then
    if new.statut is distinct from old.statut
       or new.decide_par is distinct from old.decide_par
       or new.decide_le is distinct from old.decide_le then
      raise exception 'AGENDA_STATUT';
    end if;

    if (new.salle, new.jour, new.moment) is distinct from (old.salle, old.jour, old.moment)
       and old.statut <> 'propose' then
      new.statut := 'propose';
      new.decide_par := null;
      new.decide_le := null;
    end if;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

create trigger agenda_voeux_garde_transition
  before update on public.agenda_voeux
  for each row execute function public.agenda__garde_transition();

alter table public.agenda_voeux enable row level security;
alter table public.agenda_commentaires enable row level security;

-- Lecture : toute l'équipe voit tout. La vision d'ensemble est le but de
-- l'outil, et la base doit dire la même chose que l'écran.
create policy agenda_voeux_lecture on public.agenda_voeux
  for select to authenticated using (public.site_est_equipe());

create policy agenda_commentaires_lecture on public.agenda_commentaires
  for select to authenticated using (public.site_est_equipe());

-- Création : chacun pose ses propres vœux, et seulement en « proposé ».
create policy agenda_voeux_creation on public.agenda_voeux
  for insert to authenticated
  with check (public.site_est_equipe() and user_id = auth.uid() and statut = 'propose');

-- Modification : chacun déplace ses propres vœux. Le déclencheur ci-dessus
-- interdit de toucher `statut`, `decide_par` et `decide_le` par cette voie,
-- et ramène en « proposé » ce qui était accordé.
create policy agenda_voeux_modification on public.agenda_voeux
  for update to authenticated
  using (public.site_est_equipe() and user_id = auth.uid())
  with check (user_id = auth.uid());

-- Suppression : chacun retire les siens tant qu'ils ne sont ni accordés ni
-- en cours de retrait. Une case accordée engage le cabinet : elle se rend
-- par agenda_trancher_retrait, jamais unilatéralement.
create policy agenda_voeux_suppression on public.agenda_voeux
  for delete to authenticated
  using (
    public.site_est_equipe()
    and (
      (user_id = auth.uid() and statut in ('propose', 'refuse'))
      or public.site_est_super_admin()
    )
  );

-- Les commentaires ne s'écrivent que par agenda_commenter, qui décide qui a
-- le droit de parler sur quel vœu. Aucune politique d'écriture ici : un
-- commentaire posté ne se modifie ni ne se supprime.

revoke all on public.agenda_voeux from anon;
revoke all on public.agenda_commentaires from anon;
grant select, insert, update, delete on public.agenda_voeux to authenticated;
grant select on public.agenda_commentaires to authenticated;
