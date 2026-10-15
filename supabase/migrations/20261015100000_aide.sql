-- Widget d'aide : les questions pratiques posées depuis le site.
-- Spec : docs/superpowers/specs/2026-10-14-widget-aide-design.md, § 3.
-- Mêmes principes que l'orientation : aucune identité ; le texte seulement
-- avec l'accord du visiteur, 90 jours ; écriture par service_role,
-- lecture par les super-admins.

create table public.aide_questions (
  id uuid primary key default gen_random_uuid(),
  cree_le timestamptz not null default now(),
  type text not null check (type in ('reponse', 'inconnu', 'medical', 'orientation', 'alerte', 'detresse')),
  sources jsonb not null default '[]'::jsonb check (jsonb_typeof(sources) = 'array'),
  page text not null default '/' check (char_length(page) <= 200),
  utile boolean,
  consentement boolean not null default false
);

create index aide_questions_cree_le on public.aide_questions (cree_le desc);

create table public.aide_textes (
  question_id uuid primary key references public.aide_questions (id) on delete cascade,
  question text not null check (char_length(question) between 1 and 500),
  reponse text not null check (char_length(reponse) between 1 and 1000),
  cree_le timestamptz not null default now()
);

alter table public.aide_questions enable row level security;
alter table public.aide_textes enable row level security;

create policy aide_questions_lecture on public.aide_questions
  for select to authenticated using (public.site_est_super_admin());
create policy aide_textes_lecture on public.aide_textes
  for select to authenticated using (public.site_est_super_admin());

revoke all on public.aide_questions, public.aide_textes from anon;
revoke insert, update, delete, truncate, references, trigger on public.aide_questions, public.aide_textes from authenticated;

-- Enregistre une question ; les textes seulement avec l'accord du visiteur.
create or replace function public.aide_enregistrer(p_question jsonb, p_texte text default null, p_reponse text default null)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_accord boolean := coalesce((p_question ->> 'consentement')::boolean, false);
begin
  insert into public.aide_questions (type, sources, page, consentement)
  values (
    p_question ->> 'type',
    coalesce(p_question -> 'sources', '[]'::jsonb),
    left(coalesce(p_question ->> 'page', '/'), 200),
    v_accord
  )
  returning id into v_id;

  if v_accord and btrim(coalesce(p_texte, '')) <> '' and btrim(coalesce(p_reponse, '')) <> '' then
    insert into public.aide_textes (question_id, question, reponse)
    values (v_id, left(btrim(p_texte), 500), left(btrim(p_reponse), 1000));
  end if;
  return v_id;
end;
$$;

-- Le vote « Cette réponse vous a aidé ? », noté une seule fois.
create or replace function public.aide_vote(p_id uuid, p_utile boolean)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.aide_questions set utile = p_utile where id = p_id and utile is null;
$$;

-- Le ménage quotidien de l'orientation efface aussi les textes du widget.
create or replace function public.orientation_menage()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_textes integer;
  v_aide integer;
  v_limites integer;
begin
  delete from public.orientation_textes where cree_le < now() - interval '90 days';
  get diagnostics v_textes = row_count;
  delete from public.aide_textes where cree_le < now() - interval '90 days';
  get diagnostics v_aide = row_count;
  delete from public.orientation_limites where fenetre < now() - interval '1 day';
  get diagnostics v_limites = row_count;
  return jsonb_build_object('textes', v_textes, 'aide', v_aide, 'limites', v_limites);
end;
$$;

revoke all on function public.aide_enregistrer(jsonb, text, text) from public, anon, authenticated;
revoke all on function public.aide_vote(uuid, boolean) from public, anon, authenticated;
revoke all on function public.orientation_menage() from public, anon, authenticated;
grant execute on function public.aide_enregistrer(jsonb, text, text) to service_role;
grant execute on function public.aide_vote(uuid, boolean) to service_role;
grant execute on function public.orientation_menage() to service_role;
