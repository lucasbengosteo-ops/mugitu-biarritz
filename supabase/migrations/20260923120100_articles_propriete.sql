-- Un article a un propriétaire : le compte qui peut le modifier.
-- La signature affichée sur le site reste la colonne `author` (nom, métier,
-- fiche) : on peut publier un article signé d'un praticien tout en restant
-- celui qui le modifie.

alter table public.articles add column if not exists auteur_id uuid references auth.users (id) on delete set null;

update public.articles
set auteur_id = (select id from auth.users where email = 'lucas.bengosteo@gmail.com')
where auteur_id is null;

create index if not exists articles_auteur on public.articles (auteur_id);

drop policy if exists articles_all_practitioner on public.articles;

create policy articles_lecture_equipe on public.articles
  for select to authenticated using (public.site_est_equipe());

-- Un super-admin peut créer un article au nom de quelqu'un d'autre, pas les autres.
create policy articles_creation on public.articles
  for insert to authenticated
  with check (public.site_est_equipe() and (auteur_id = auth.uid() or public.site_est_super_admin()));

create policy articles_modification on public.articles
  for update to authenticated
  using (public.site_est_equipe() and (auteur_id = auth.uid() or public.site_est_super_admin()))
  with check (public.site_est_equipe() and (auteur_id = auth.uid() or public.site_est_super_admin()));

create policy articles_suppression on public.articles
  for delete to authenticated
  using (public.site_est_equipe() and (auteur_id = auth.uid() or public.site_est_super_admin()));

-- Les fiches praticien passent sous la main des seuls super-admins.
drop policy if exists practitioner_overrides_write on public.practitioner_overrides;
create policy practitioner_overrides_ecriture on public.practitioner_overrides
  for all to authenticated
  using (public.site_est_super_admin())
  with check (public.site_est_super_admin());
