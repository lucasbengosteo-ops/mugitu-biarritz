-- Droits des jetons de l'abonnement calendrier. Tout se passe dans une
-- transaction annulée : rien n'est écrit. Lancer avec l'outil MCP
-- execute_sql (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « calendrier : scénarios OK ».

begin;

do $$
declare
  v_hugo uuid;
  v_kine uuid;
  v_dehors uuid;
  v_j1 text;
  v_j2 text;
  v_j3 text;
begin
  select u.id into v_hugo from auth.users u where u.email = 'hugo.daminato@gmail.com';
  select u.id into v_kine from auth.users u where u.email = 'jbc.kine@gmail.com';
  assert v_hugo is not null and v_kine is not null, 'J0 comptes absents';
  -- Un compte sans rôle d'équipe. S'il n'en existe plus, un identifiant
  -- inconnu joue le même rôle : site_est_equipe() est faux pour lui aussi.
  select u.id into v_dehors from auth.users u
  where not exists (
    select 1 from public.user_roles ur where ur.user_id = u.id and ur.role::text <> 'sportif'
  )
  order by u.created_at
  limit 1;
  v_dehors := coalesce(v_dehors, gen_random_uuid());
  -- Indépendant de ce que l'équipe a déjà demandé : on repart de zéro,
  -- dans la transaction annulée.
  delete from public.agenda_calendrier_jetons where user_id in (v_hugo, v_kine, v_dehors);

  -- J1. Première demande : un jeton est créé, 64 caractères hexadécimaux.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  v_j1 := public.agenda_mon_jeton_calendrier();
  assert v_j1 ~ '^[0-9a-f]{64}$', 'J1 ' || coalesce(v_j1, 'null');

  -- J2. Une seconde demande rend le même jeton.
  v_j2 := public.agenda_mon_jeton_calendrier(false);
  assert v_j2 = v_j1, 'J2 le jeton change sans qu''on le demande';

  -- J3. Il lit sa ligne.
  assert (select jeton from public.agenda_calendrier_jetons where user_id = v_hugo) = v_j1, 'J3';

  -- J4. La régénération rend un autre jeton et remplace l'ancien.
  v_j3 := public.agenda_mon_jeton_calendrier(true);
  assert v_j3 ~ '^[0-9a-f]{64}$' and v_j3 <> v_j1, 'J4 jeton régénéré identique';
  assert (select count(*) from public.agenda_calendrier_jetons where user_id = v_hugo) = 1, 'J4 deux lignes';
  assert (select jeton from public.agenda_calendrier_jetons where user_id = v_hugo) = v_j3, 'J4 ancien jeton conservé';
  assert public.agenda_mon_jeton_calendrier() = v_j3, 'J4 relecture après régénération';

  -- J5. Il n'écrit pas sa ligne directement.
  begin
    update public.agenda_calendrier_jetons set jeton = repeat('0', 64) where user_id = v_hugo;
    assert false, 'J5a mise à jour directe permise';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.agenda_calendrier_jetons (user_id, jeton) values (v_kine, repeat('1', 64));
    assert false, 'J5b insertion directe permise';
  exception when insufficient_privilege then null;
  end;
  begin
    delete from public.agenda_calendrier_jetons where user_id = v_hugo;
    assert false, 'J5c suppression directe permise';
  exception when insufficient_privilege then null;
  end;
  reset role;

  -- J6. Une autre personne de l'équipe ne lit pas la ligne de Hugo, et
  -- obtient son propre jeton, distinct.
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  set local role authenticated;
  assert (select count(*) from public.agenda_calendrier_jetons where user_id = v_hugo) = 0, 'J6 ligne d''autrui lue';
  assert not exists (select 1 from public.agenda_calendrier_jetons where jeton = v_j3), 'J6 jeton d''autrui trouvé';
  v_j1 := public.agenda_mon_jeton_calendrier();
  assert v_j1 ~ '^[0-9a-f]{64}$' and v_j1 <> v_j3, 'J6 jeton partagé';
  assert (select count(*) from public.agenda_calendrier_jetons) = 1, 'J6 voit plus que sa ligne';
  reset role;

  -- J7. Un compte hors de l'équipe est refusé, et rien n'est écrit.
  perform set_config('request.jwt.claims', json_build_object('sub', v_dehors, 'role', 'authenticated')::text, true);
  set local role authenticated;
  begin
    perform public.agenda_mon_jeton_calendrier();
    assert false, 'J7 compte hors équipe accepté';
  exception when raise_exception then assert sqlerrm = 'AGENDA_DROITS', 'J7 ' || sqlerrm;
  end;
  reset role;
  assert not exists (select 1 from public.agenda_calendrier_jetons where user_id = v_dehors), 'J7 ligne écrite';

  -- J8. La clé de service lit le jeton, comme la route.
  set local role service_role;
  assert (select user_id from public.agenda_calendrier_jetons where jeton = v_j3) = v_hugo, 'J8';
  reset role;

  perform set_config('request.jwt.claims', '', true);
end $$;

-- BLOC DROITS ANON
set local role anon;
do $$
begin
  begin
    perform count(*) from public.agenda_calendrier_jetons;
    assert false, 'P1 anon lit les jetons';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.agenda_mon_jeton_calendrier();
    assert false, 'P2 anon obtient un jeton';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
-- FIN BLOC DROITS ANON

rollback;
select 'calendrier : scénarios OK' as resultat;
