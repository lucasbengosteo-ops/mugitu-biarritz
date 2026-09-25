-- Les jeux du stand de l'Alba Deep Fitness Race 2026.
-- Le règlement annonce la suppression des données au plus tard le
-- 13 octobre 2026 : l'écran Événements montre l'échéance et propose le
-- bouton, réservé aux super-admins.

create or replace function public.site_jeux_alba_etat()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'participants', (select count(*) from public.jeux_participants),
    'scores', (select count(*) from public.jeux_scores),
    'tirages', (select count(*) from public.jeux_tirages)
  );
$$;

create or replace function public.site_supprimer_jeux_alba()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_avant jsonb;
begin
  if not public.site_est_super_admin() then raise exception 'SITE_DROITS'; end if;
  v_avant := public.site_jeux_alba_etat();
  delete from public.jeux_tirages;
  delete from public.jeux_scores;
  delete from public.jeux_participants;
  return v_avant;
end;
$$;

revoke execute on function public.site_jeux_alba_etat(), public.site_supprimer_jeux_alba() from public, anon;
grant execute on function public.site_jeux_alba_etat(), public.site_supprimer_jeux_alba() to authenticated;
