-- Agenda du cabinet : les échanges de créneau, et l'occupation datée
-- qu'un accord produit.
--
-- Un échange se joue à trois temps : le demandeur propose, le titulaire de
-- la case accepte ou refuse, puis un gérant tranche. Le gérant tranche même
-- quand les deux praticiens sont d'accord, pour la raison qui vaut déjà pour
-- un retrait : une case accordée engage le cabinet, et lui seul voit la
-- grille entière.
--
-- Aucune de ces deux tables ne s'écrit directement : tout passe par les
-- fonctions de la migration suivante. Un accord modifie des lignes qui
-- n'appartiennent pas à celui qui le déclenche, ce qu'aucune politique RLS
-- ne sait exprimer.

create table public.agenda_echanges (
  id uuid primary key default gen_random_uuid(),
  demandeur_id uuid not null references auth.users (id) on delete cascade,
  -- La case voulue. Si son vœu disparaît, la demande n'a plus d'objet.
  voeu_cible_id uuid not null references public.agenda_voeux (id) on delete cascade,
  -- Ce qu'on donne en retour. `null` = on demande sans rendre. Si le vœu
  -- offert disparaît, la demande change de nature en silence : on la
  -- supprime plutôt que de la laisser devenir une demande à sens unique.
  voeu_offert_id uuid references public.agenda_voeux (id) on delete cascade,
  portee text not null check (portee in ('ponctuel', 'definitif')),
  -- Le lundi de la semaine concernée. Un échange ponctuel porte sur une
  -- semaine et non sur une date : la date de chaque côté se déduit du jour
  -- de son propre vœu, ce qui permet d'échanger un mardi contre un jeudi.
  semaine date,
  motif text not null check (length(btrim(motif)) > 0),
  statut text not null default 'propose'
    check (statut in ('propose', 'accepte_pair', 'refuse_pair', 'valide', 'refuse', 'annule')),
  pair_le timestamptz,
  decide_par uuid references auth.users (id) on delete set null,
  decide_le timestamptz,
  created_at timestamptz not null default now(),
  -- La semaine est exigée pour un ponctuel et interdite pour un définitif.
  constraint agenda_echanges_semaine check ((portee = 'ponctuel') = (semaine is not null)),
  -- Et c'est bien un lundi : 1 = lundi au sens ISO.
  constraint agenda_echanges_lundi check (semaine is null or extract(isodow from semaine) = 1)
);

create index agenda_echanges_cible on public.agenda_echanges (voeu_cible_id, statut);
create index agenda_echanges_demandeur on public.agenda_echanges (demandeur_id, statut);
create index agenda_echanges_arbitrage on public.agenda_echanges (statut, created_at);

create table public.agenda_exceptions (
  id uuid primary key default gen_random_uuid(),
  jour date not null,
  salle text not null check (salle in ('lurra', 'airea', 'etera', 'sua', 'ura')),
  moment text not null check (moment in ('matin', 'aprem')),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- D'où elle vient. Mise à null si la demande est purgée : l'échange a eu
  -- lieu, et supprimer sa trace ne doit pas défaire l'occupation.
  echange_id uuid references public.agenda_echanges (id) on delete set null,
  created_at timestamptz not null default now(),
  -- Une case n'a qu'un occupant à une date donnée.
  unique (jour, salle, moment)
);

create index agenda_exceptions_semaine on public.agenda_exceptions (jour);
create index agenda_exceptions_personne on public.agenda_exceptions (user_id, jour);

alter table public.agenda_echanges enable row level security;
alter table public.agenda_exceptions enable row level security;

-- Lecture pour toute l'équipe : la vision d'ensemble est le but de l'outil,
-- et savoir qui a demandé quoi fait partie de la discussion.
create policy agenda_echanges_lecture on public.agenda_echanges
  for select to authenticated using (public.site_est_equipe());

create policy agenda_exceptions_lecture on public.agenda_exceptions
  for select to authenticated using (public.site_est_equipe());

-- Aucune politique d'écriture sur les échanges : les quatre fonctions de la
-- migration suivante en ont le monopole.

-- Une exception posée par erreur doit pouvoir se défaire, sinon une case est
-- bloquée à une date pour toujours. Réservé aux gérants.
create policy agenda_exceptions_suppression on public.agenda_exceptions
  for delete to authenticated using (public.site_est_super_admin());

revoke all on public.agenda_echanges from anon;
revoke all on public.agenda_exceptions from anon;
grant select on public.agenda_echanges to authenticated;
grant select, delete on public.agenda_exceptions to authenticated;

-- Trois types de mail rejoignent la file.
alter table public.agenda_mails drop constraint agenda_mails_type_check;
alter table public.agenda_mails add constraint agenda_mails_type_check
  check (type in ('voeu_valide', 'voeu_refuse', 'retrait_demande', 'retrait_tranche',
                  'commentaire', 'absence',
                  'echange_propose', 'echange_pair', 'echange_tranche'));
