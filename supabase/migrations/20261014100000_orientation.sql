-- « Par où commencer ? » : mesures des parcours d'orientation de l'accueil.
-- Spec : docs/superpowers/specs/2026-10-14-orientation-design.md, § 4.
--
-- Aucune donnée d'identité : pas d'adresse IP en clair, pas de compte. Le
-- texte libre n'est gardé qu'avec l'accord du visiteur, 90 jours.
-- Écriture : uniquement par les fonctions ci-dessous, réservées à
-- service_role (les routes /api/orientation). Lecture : super-admins.

create table public.orientation_parcours (
  id uuid primary key default gen_random_uuid(),
  cree_le timestamptz not null default now(),
  motif text not null check (motif in ('douleur', 'reprise', 'performance', 'mental', 'nutrition', 'bilan')),
  zone text check (zone in ('cou', 'epaule', 'bras-coude-main', 'dos', 'hanche-aine', 'cuisse', 'genou', 'jambe-mollet', 'cheville-pied', 'autre')),
  anciennete text check (anciennete in ('moins-1-semaine', '1-6-semaines', 'plus-6-semaines')),
  sport text check (sport in ('surf', 'rugby', 'trail-et-course', 'danse', 'pelote-basque', 'autre', 'aucun')),
  depuis text check (depuis ~ '^[a-z0-9-]{1,80}$'),
  alerte text not null default 'aucune' check (alerte in ('aucune', 'signe', 'mot', 'detresse', 'ia')),
  source text not null check (source in ('ia', 'regles', 'repli')),
  suggestions jsonb not null default '[]'::jsonb check (jsonb_typeof(suggestions) = 'array'),
  clic_type text check (clic_type in ('reservation', 'page')),
  clic_cible text check (char_length(clic_cible) <= 200),
  clic_le timestamptz,
  consentement boolean not null default false
);

create index orientation_parcours_cree_le on public.orientation_parcours (cree_le desc);

create table public.orientation_textes (
  parcours_id uuid primary key references public.orientation_parcours (id) on delete cascade,
  texte text not null check (char_length(texte) between 1 and 500),
  cree_le timestamptz not null default now()
);

create table public.orientation_limites (
  empreinte text not null check (empreinte ~ '^[0-9a-f]{64}$'),
  fenetre timestamptz not null,
  compte integer not null default 0,
  primary key (empreinte, fenetre)
);

alter table public.orientation_parcours enable row level security;
alter table public.orientation_textes enable row level security;
alter table public.orientation_limites enable row level security;

create policy orientation_parcours_lecture on public.orientation_parcours
  for select to authenticated using (public.site_est_super_admin());
create policy orientation_textes_lecture on public.orientation_textes
  for select to authenticated using (public.site_est_super_admin());

-- Les privilèges par défaut de Supabase ouvrent toute nouvelle table à anon
-- et à authenticated : on referme. authenticated ne garde que la lecture,
-- filtrée par la politique ; les limites ne se lisent pas.
revoke all on public.orientation_parcours, public.orientation_textes, public.orientation_limites from anon;
revoke insert, update, delete, truncate, references, trigger on public.orientation_parcours, public.orientation_textes from authenticated;
revoke all on public.orientation_limites from authenticated;

-- Compte un appel pour cette empreinte dans l'heure en cours. Vrai tant
-- que la limite n'est pas dépassée.
create or replace function public.orientation_limiter(p_empreinte text, p_max integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_compte integer;
begin
  insert into public.orientation_limites (empreinte, fenetre, compte)
  values (p_empreinte, date_trunc('hour', now()), 1)
  on conflict (empreinte, fenetre) do update set compte = public.orientation_limites.compte + 1
  returning compte into v_compte;
  return v_compte <= p_max;
end;
$$;

-- Enregistre un parcours ; le texte seulement s'il est fourni (la route ne
-- le fournit qu'avec l'accord du visiteur). Rend l'identifiant.
create or replace function public.orientation_enregistrer(p_parcours jsonb, p_texte text default null)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  insert into public.orientation_parcours (motif, zone, anciennete, sport, depuis, alerte, source, suggestions, consentement)
  values (
    p_parcours ->> 'motif',
    p_parcours ->> 'zone',
    p_parcours ->> 'anciennete',
    p_parcours ->> 'sport',
    p_parcours ->> 'depuis',
    coalesce(p_parcours ->> 'alerte', 'aucune'),
    p_parcours ->> 'source',
    coalesce(p_parcours -> 'suggestions', '[]'::jsonb),
    coalesce((p_parcours ->> 'consentement')::boolean, false)
  )
  returning id into v_id;

  if p_texte is not null and btrim(p_texte) <> '' and coalesce((p_parcours ->> 'consentement')::boolean, false) then
    insert into public.orientation_textes (parcours_id, texte) values (v_id, left(btrim(p_texte), 500));
  end if;
  return v_id;
end;
$$;

-- Note le premier clic d'un parcours ; les suivants sont ignorés.
create or replace function public.orientation_clic(p_id uuid, p_type text, p_cible text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.orientation_parcours
  set clic_type = p_type, clic_cible = left(p_cible, 200), clic_le = now()
  where id = p_id and clic_le is null and p_type in ('reservation', 'page');
$$;

-- Ménage quotidien : textes de plus de 90 jours, compteurs de plus d'un jour.
create or replace function public.orientation_menage()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_textes integer;
  v_limites integer;
begin
  delete from public.orientation_textes where cree_le < now() - interval '90 days';
  get diagnostics v_textes = row_count;
  delete from public.orientation_limites where fenetre < now() - interval '1 day';
  get diagnostics v_limites = row_count;
  return jsonb_build_object('textes', v_textes, 'limites', v_limites);
end;
$$;

revoke all on function public.orientation_limiter(text, integer) from public, anon, authenticated;
revoke all on function public.orientation_enregistrer(jsonb, text) from public, anon, authenticated;
revoke all on function public.orientation_clic(uuid, text, text) from public, anon, authenticated;
revoke all on function public.orientation_menage() from public, anon, authenticated;
grant execute on function public.orientation_limiter(text, integer) to service_role;
grant execute on function public.orientation_enregistrer(jsonb, text) to service_role;
grant execute on function public.orientation_clic(uuid, text, text) to service_role;
grant execute on function public.orientation_menage() to service_role;
