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

-- BLOC ARTICLES
do $$
declare
  v_lucas uuid;
  v_kine uuid;
  v_autre uuid;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_kine from auth.users u where u.email = 'jbc.kine@gmail.com';
  select u.id into v_autre from auth.users u where u.email = 'hugo.daminato@gmail.com';
  assert v_autre is not null, 'A0 compte praticien de test absent';
  delete from public.site_super_admins where user_id in (v_kine, v_autre);

  -- A1. Tous les articles existants appartiennent à Lucas.
  assert not exists (select 1 from public.articles where auteur_id is distinct from v_lucas), 'A1';

  -- A2. Un praticien crée un article à son nom.
  perform set_config('request.jwt.claims', json_build_object('sub', v_autre, 'role', 'authenticated')::text, true);
  set local role authenticated;
  insert into public.articles (slug, title, category, chapo, cover, author, date, status, sections, auteur_id)
  values ('test-hugo', 'Test Hugo', 'Pathologies', '', '/x.jpg',
          '{"name":"Hugo Daminato","job":"Préparateur physique","photo":"","fiche":"/equipe/hugo-daminato"}'::jsonb,
          current_date, 'brouillon', '[]'::jsonb, v_autre);
  assert exists (select 1 from public.articles where slug = 'test-hugo'), 'A2';

  -- A3. Il modifie le sien.
  update public.articles set title = 'Test Hugo 2' where slug = 'test-hugo';
  assert (select title from public.articles where slug = 'test-hugo') = 'Test Hugo 2', 'A3';

  -- A4. Il ne modifie pas celui d'un autre.
  update public.articles set title = 'Détourné' where slug = 'syndrome-rotulien';
  assert (select title from public.articles where slug = 'syndrome-rotulien') <> 'Détourné', 'A4';

  -- A5. Il ne supprime pas celui d'un autre.
  delete from public.articles where slug = 'syndrome-rotulien';
  assert exists (select 1 from public.articles where slug = 'syndrome-rotulien'), 'A5';

  -- A6. Il ne peut pas créer un article au nom d'un autre.
  begin
    insert into public.articles (slug, title, category, chapo, cover, author, date, status, sections, auteur_id)
    values ('test-vol', 'Test vol', 'Pathologies', '', '/x.jpg', '{}'::jsonb, current_date, 'brouillon', '[]'::jsonb, v_lucas);
    assert false, 'A6 un praticien crée un article au nom d’un autre';
  exception when insufficient_privilege then null;
  end;

  -- A7. Il n'écrit pas dans les fiches praticien.
  update public.practitioner_overrides set badge = 'Détourné' where slug is not null;
  assert not exists (select 1 from public.practitioner_overrides where badge = 'Détourné'), 'A7';

  reset role;

  -- A8. Un super-admin modifie l'article d'un autre et change son propriétaire.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  set local role authenticated;
  update public.articles set title = 'Repris par Lucas', auteur_id = v_lucas where slug = 'test-hugo';
  assert (select auteur_id from public.articles where slug = 'test-hugo') = v_lucas, 'A8';
  reset role;

  perform set_config('request.jwt.claims', '', true);
end $$;
-- FIN BLOC ARTICLES

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
