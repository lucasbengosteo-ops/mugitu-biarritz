-- Mugi Klub : inscriptions en ligne. Tables, index, RLS.
-- Spec : docs/superpowers/specs/2026-09-15-mugi-klub-inscriptions-design.md

create or replace function public.klub__touch()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
revoke execute on function public.klub__touch() from public, anon, authenticated;

-- Modèles hebdomadaires.
create table public.klub_creneaux (
  id uuid primary key default gen_random_uuid(),
  jour smallint not null check (jour between 1 and 7),
  heure time not null,
  duree_min smallint not null check (duree_min between 5 and 600),
  type text not null check (type in ('small', 'atelier', 'conf', 'soiree')),
  titre text not null check (char_length(trim(titre)) between 1 and 120),
  description text not null default '',
  intervenant text not null default '',
  intervenant_email text check (intervenant_email is null or intervenant_email ~* '^[^\s@]+@[^\s@]+\.[a-z]{2,}$'),
  capacite smallint check (capacite is null or capacite between 1 and 200),
  prix_libelle text not null default '',
  inscription_requise boolean not null default true,
  actif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (not inscription_requise or capacite is not null)
);

-- Séances datées, générées depuis un créneau ou créées à la main.
create table public.klub_seances (
  id uuid primary key default gen_random_uuid(),
  creneau_id uuid references public.klub_creneaux (id) on delete set null,
  debut timestamptz not null,
  duree_min smallint not null check (duree_min between 5 and 600),
  type text not null check (type in ('small', 'atelier', 'conf', 'soiree')),
  titre text not null check (char_length(trim(titre)) between 1 and 120),
  description text not null default '',
  intervenant text not null default '',
  intervenant_email text check (intervenant_email is null or intervenant_email ~* '^[^\s@]+@[^\s@]+\.[a-z]{2,}$'),
  capacite smallint check (capacite is null or capacite between 1 and 200),
  prix_libelle text not null default '',
  inscription_requise boolean not null default true,
  statut text not null default 'publiee' check (statut in ('publiee', 'annulee')),
  modifiee boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (not inscription_requise or capacite is not null),
  unique (creneau_id, debut)
);
create index klub_seances_debut on public.klub_seances (debut);

create table public.klub_inscriptions (
  id uuid primary key default gen_random_uuid(),
  seance_id uuid not null references public.klub_seances (id) on delete cascade,
  prenom text not null check (char_length(prenom) between 1 and 60),
  nom text not null check (char_length(nom) between 1 and 60),
  email text not null check (email = lower(email)),
  telephone text not null check (telephone ~ '^\+?[0-9]{9,15}$'),
  premiere_seance boolean not null default false,
  statut text not null check (statut in ('confirmee', 'attente', 'annulee')),
  present boolean not null default false,
  origine text not null default 'site' check (origine in ('site', 'admin')),
  jeton text not null unique default encode(extensions.gen_random_bytes(32), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Une adresse ne tient qu'une inscription active par séance.
create unique index klub_inscriptions_active on public.klub_inscriptions (seance_id, email) where statut <> 'annulee';
create index klub_inscriptions_seance on public.klub_inscriptions (seance_id, statut, created_at);

-- File d'envoi. Le contenu est construit au moment de l'envoi.
create table public.klub_mails (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('confirmation', 'attente', 'promotion', 'annulation', 'rappel',
                                     'seance_modifiee', 'seance_annulee', 'liste_intervenant')),
  inscription_id uuid references public.klub_inscriptions (id) on delete cascade,
  seance_id uuid not null references public.klub_seances (id) on delete cascade,
  envoyer_apres timestamptz not null default now(),
  statut text not null default 'a_envoyer' check (statut in ('a_envoyer', 'en_cours', 'envoye', 'erreur', 'abandonne')),
  tentatives smallint not null default 0,
  reserve_at timestamptz,
  derniere_erreur text,
  created_at timestamptz not null default now(),
  envoye_at timestamptz
);
-- Rappel et liste intervenant ne partent qu'une fois.
create unique index klub_mails_une_fois on public.klub_mails (type, inscription_id, seance_id) nulls not distinct
  where type in ('rappel', 'liste_intervenant');
create index klub_mails_file on public.klub_mails (statut, envoyer_apres);
create index klub_mails_inscription on public.klub_mails (inscription_id, created_at);
create index klub_mails_seance on public.klub_mails (seance_id);

create trigger klub_creneaux_touch before update on public.klub_creneaux for each row execute function public.klub__touch();
create trigger klub_seances_touch before update on public.klub_seances for each row execute function public.klub__touch();
create trigger klub_inscriptions_touch before update on public.klub_inscriptions for each row execute function public.klub__touch();

-- Aucune politique pour anon. Les praticiens lisent ; toutes les écritures
-- passent par des fonctions.
alter table public.klub_creneaux enable row level security;
alter table public.klub_seances enable row level security;
alter table public.klub_inscriptions enable row level security;
alter table public.klub_mails enable row level security;

create policy klub_creneaux_lecture_praticien on public.klub_creneaux for select to authenticated using (public.is_practitioner());
create policy klub_seances_lecture_praticien on public.klub_seances for select to authenticated using (public.is_practitioner());
create policy klub_inscriptions_lecture_praticien on public.klub_inscriptions for select to authenticated using (public.is_practitioner());
create policy klub_mails_lecture_praticien on public.klub_mails for select to authenticated using (public.is_practitioner());
