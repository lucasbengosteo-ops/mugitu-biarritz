-- Prise en main : droits. Tout se passe dans une transaction annulée :
-- rien n'est écrit. Lancer avec l'outil MCP execute_sql
-- (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « prise en main : scénarios OK ».

begin;

do $$
declare
  v_hugo uuid;
  v_kine uuid;
begin
  select u.id into v_hugo from auth.users u where u.email = 'hugo.daminato@gmail.com';
  select u.id into v_kine from auth.users u where u.email = 'jbc.kine@gmail.com';
  assert v_hugo is not null and v_kine is not null, 'T0 comptes absents';

  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;

  -- T1. Chacun crée sa ligne.
  insert into public.site_prise_en_main (user_id, cochees) values (v_hugo, array['klub']);
  assert (select cochees from public.site_prise_en_main where user_id = v_hugo) = array['klub'], 'T1';

  -- T2. Et la modifie.
  update public.site_prise_en_main set cochees = array['klub', 'article'] where user_id = v_hugo;
  assert array_length((select cochees from public.site_prise_en_main where user_id = v_hugo), 1) = 2, 'T2';

  -- T3. Il ne crée pas celle d'un autre.
  begin
    insert into public.site_prise_en_main (user_id) values (v_kine);
    assert false, 'T3 un praticien crée la ligne d''un autre';
  exception when insufficient_privilege then null;
  end;

  -- T4. Il ne lit pas celle d'un autre.
  assert not exists (select 1 from public.site_prise_en_main where user_id = v_kine), 'T4';

  -- T5. Il masque la sienne.
  update public.site_prise_en_main set masquee = true where user_id = v_hugo;
  assert (select masquee from public.site_prise_en_main where user_id = v_hugo), 'T5';

  reset role;
  perform set_config('request.jwt.claims', '', true);
end $$;

set local role anon;
do $$
begin
  begin
    perform count(*) from public.site_prise_en_main;
    assert false, 'P1 anon lit la prise en main';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

rollback;
select 'prise en main : scénarios OK' as resultat;
