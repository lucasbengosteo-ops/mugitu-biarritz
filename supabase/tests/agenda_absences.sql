-- Droits des absences de l'agenda. Tout se passe dans une transaction
-- annulée : rien n'est écrit. Lancer avec l'outil MCP execute_sql
-- (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « absences : scénarios OK ».

begin;

do $$
declare
  v_lucas uuid;
  v_hugo uuid;
  v_kine uuid;
  v_id uuid;
  v_sien uuid;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  select u.id into v_kine  from auth.users u where u.email = 'jbc.kine@gmail.com';
  assert v_lucas is not null and v_hugo is not null and v_kine is not null, 'A0 comptes absents';
  delete from public.site_super_admins where user_id in (v_hugo, v_kine);

  -- A1. Un praticien déclare son absence.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  insert into public.agenda_absences (user_id, du, au, motif)
  values (v_hugo, '2026-08-03', '2026-08-16', 'Congés') returning id into v_sien;
  assert v_sien is not null, 'A1';

  -- A2. Il ne déclare pas l'absence d'un autre.
  begin
    insert into public.agenda_absences (user_id, du, au) values (v_kine, '2026-08-03', '2026-08-16');
    assert false, 'A2 un praticien déclare l''absence d''un autre';
  exception when insufficient_privilege then null;
  end;

  -- A3. Une plage à l'envers est refusée.
  begin
    insert into public.agenda_absences (user_id, du, au) values (v_hugo, '2026-08-16', '2026-08-03');
    assert false, 'A3 une plage à l''envers est acceptée';
  exception when check_violation then null;
  end;

  -- A4. Une plage d'un seul jour est permise.
  insert into public.agenda_absences (user_id, du, au) values (v_hugo, '2026-09-01', '2026-09-01');
  assert exists (select 1 from public.agenda_absences where user_id = v_hugo and du = '2026-09-01'), 'A4';

  -- A5. Les plages qui se chevauchent sont permises.
  insert into public.agenda_absences (user_id, du, au) values (v_hugo, '2026-08-10', '2026-08-20');
  assert (select count(*) from public.agenda_absences where user_id = v_hugo) = 3, 'A5';

  -- A6. Il retire la sienne.
  delete from public.agenda_absences where du = '2026-09-01' and user_id = v_hugo;
  assert not exists (select 1 from public.agenda_absences where du = '2026-09-01' and user_id = v_hugo), 'A6';
  reset role;

  -- A7. Un tiers ne retire pas celle d'un autre.
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  set local role authenticated;
  delete from public.agenda_absences where id = v_sien;
  assert exists (select 1 from public.agenda_absences where id = v_sien), 'A7 un tiers a retiré une absence';

  -- A8. Mais il la lit : la vision d'ensemble est le but.
  assert (select count(*) from public.agenda_absences where user_id = v_hugo) = 2, 'A8';

  -- A9. On ne modifie pas une absence, on la retire et on la repose.
  update public.agenda_absences set au = '2026-12-31' where id = v_sien;
  assert (select au from public.agenda_absences where id = v_sien) = date '2026-08-16', 'A9 une absence a été modifiée';
  reset role;

  -- A10. Un gérant retire n'importe laquelle, pour faire le ménage.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  set local role authenticated;
  delete from public.agenda_absences where id = v_sien;
  assert not exists (select 1 from public.agenda_absences where id = v_sien), 'A10';
  reset role;

  perform set_config('request.jwt.claims', '', true);
end $$;

-- BLOC DROITS ANON
set local role anon;
do $$
begin
  begin
    assert (select count(*) from public.agenda_absences) = 0, 'P1 anon lit les absences';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

rollback;
select 'absences : scénarios OK' as resultat;
