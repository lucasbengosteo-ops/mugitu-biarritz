-- Back-office : deux niveaux de droits.
-- « Équipe » = tout compte ayant un rôle dans user_roles autre que sportif.
-- « Super-admin » = compte inscrit dans site_super_admins (Lucas, JB).
-- Le rôle `admin` de user_roles appartient à l'app praticiens : on n'y touche pas.

create table if not exists public.site_super_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  note text not null default '',
  created_at timestamptz not null default now()
);

alter table public.site_super_admins enable row level security;

create or replace function public.site_est_super_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.site_super_admins s where s.user_id = auth.uid());
$$;

create or replace function public.site_est_equipe()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = auth.uid() and ur.role::text <> 'sportif'
  );
$$;

-- Une seule définition de l'équipe pour tout le site.
create or replace function public.klub__est_equipe()
returns boolean language sql stable security definer set search_path = '' as $$
  select public.site_est_equipe();
$$;

drop policy if exists site_super_admins_lecture on public.site_super_admins;
create policy site_super_admins_lecture on public.site_super_admins
  for select to authenticated using (public.site_est_super_admin());

revoke all on public.site_super_admins from anon;
revoke insert, update, delete, truncate, references, trigger on public.site_super_admins from authenticated;

revoke execute on function public.site_est_super_admin(), public.site_est_equipe() from public, anon;
grant execute on function public.site_est_super_admin(), public.site_est_equipe() to authenticated;

-- Les deux gérants. Ajouter un super-admin se fait par une migration, jamais par l'interface.
insert into public.site_super_admins (user_id, note)
select u.id, 'Gérant de la SCM'
from auth.users u
where u.email in ('lucas.bengosteo@gmail.com', 'jbc.kine@gmail.com')
on conflict (user_id) do nothing;
