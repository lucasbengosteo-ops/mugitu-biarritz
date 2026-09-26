-- Back-office : où en est chacun de sa prise en main.
--
-- Seules les coches manuelles et le masquage vivent ici. Les étapes
-- déductibles — un vœu posé, une absence déclarée, un article possédé — se
-- recalculent à chaque affichage : stocker un état déductible, c'est se
-- garantir qu'il divergera.
--
-- `cochees` n'est pas contraint à une liste fermée. Une étape retirée du
-- code laisse une chaîne orpheline, ce qui est sans effet ; une contrainte,
-- elle, empêcherait de renommer une étape sans migration.

create table public.site_prise_en_main (
  user_id uuid primary key references auth.users (id) on delete cascade,
  cochees text[] not null default '{}',
  masquee boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.site_prise_en_main enable row level security;

-- Chacun lit et écrit sa ligne, et rien d'autre. L'absence de ligne vaut
-- « rien de coché, carte visible » : on n'en crée pas onze à l'avance.
create policy site_prise_en_main_lecture on public.site_prise_en_main
  for select to authenticated using (user_id = auth.uid());
create policy site_prise_en_main_creation on public.site_prise_en_main
  for insert to authenticated with check (user_id = auth.uid() and public.site_est_equipe());
create policy site_prise_en_main_modification on public.site_prise_en_main
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

revoke all on public.site_prise_en_main from anon;
grant select, insert, update on public.site_prise_en_main to authenticated;
