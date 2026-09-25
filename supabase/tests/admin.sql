-- Droits du back-office. Tout se passe dans une transaction annulée : rien
-- n'est écrit. Lancer avec l'outil MCP execute_sql (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « admin : scénarios OK ».

begin;

-- BLOC ÉQUIPE ET SUPER-ADMIN
do $$
declare
  v_lucas uuid;
  v_kine uuid;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_kine from auth.users u where u.email = 'jbc.kine@gmail.com';
  assert v_lucas is not null and v_kine is not null, 'D0 comptes de référence absents';

  -- D1. Lucas est équipe et super-admin.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  assert public.site_est_equipe(), 'D1a';
  assert public.site_est_super_admin(), 'D1b';

  -- D2. Un praticien sans ligne dans site_super_admins est équipe, pas super-admin.
  delete from public.site_super_admins where user_id = v_kine;
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  assert public.site_est_equipe(), 'D2a';
  assert not public.site_est_super_admin(), 'D2b';

  -- D3. Un compte sans rôle n'est rien du tout.
  perform set_config('request.jwt.claims', json_build_object('sub', gen_random_uuid(), 'role', 'authenticated')::text, true);
  assert not public.site_est_equipe(), 'D3a';
  assert not public.site_est_super_admin(), 'D3b';

  -- D4. Le Klub s'aligne sur la même définition de l'équipe.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  assert public.klub__est_equipe(), 'D4';

  perform set_config('request.jwt.claims', '', true);
end $$;
-- FIN BLOC ÉQUIPE

-- BLOC DROITS ANON
set local role anon;
do $$
begin
  begin
    perform public.site_est_super_admin();
    assert false, 'P1 anon peut appeler site_est_super_admin';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.site_est_equipe();
    assert false, 'P2 anon peut appeler site_est_equipe';
  exception when insufficient_privilege then null;
  end;
  begin
    assert (select count(*) from public.site_super_admins) = 0, 'P3 anon lit la liste des super-admins';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
-- FIN BLOC DROITS ANON

rollback;
select 'admin : scénarios OK' as resultat;
