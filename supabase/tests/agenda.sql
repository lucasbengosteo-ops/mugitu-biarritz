-- Droits de l'agenda du cabinet. Tout se passe dans une transaction
-- annulée : rien n'est écrit. Lancer avec l'outil MCP execute_sql
-- (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « agenda : scénarios OK ».

begin;

-- BLOC VŒUX
do $$
declare
  v_lucas uuid;
  v_hugo uuid;
  v_kine uuid;
  v_voeu uuid;
  v_autre uuid;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  select u.id into v_kine  from auth.users u where u.email = 'jbc.kine@gmail.com';
  assert v_lucas is not null and v_hugo is not null and v_kine is not null, 'V0 comptes absents';
  delete from public.site_super_admins where user_id in (v_hugo, v_kine);
  -- L'équipe se sert de l'agenda : ces scénarios doivent être indépendants
  -- de ce qu'elle y a posé. On repart d'une grille vide, à l'intérieur de la
  -- transaction annulée — rien n'est réellement supprimé.
  delete from public.agenda_voeux;

  -- V1. Un praticien pose un vœu à son nom.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  insert into public.agenda_voeux (user_id, salle, jour, moment)
  values (v_hugo, 'sua', 2, 'matin') returning id into v_voeu;
  assert v_voeu is not null, 'V1';

  -- V2. Il ne pose pas de vœu au nom d'un autre.
  begin
    insert into public.agenda_voeux (user_id, salle, jour, moment) values (v_kine, 'sua', 3, 'matin');
    assert false, 'V2 un praticien pose un vœu au nom d''un autre';
  exception when insufficient_privilege then null;
  end;

  -- V3. Il ne pose pas un vœu déjà accordé.
  begin
    insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
    values (v_hugo, 'ura', 4, 'aprem', 'valide');
    assert false, 'V3 un praticien s''auto-accorde une case';
  exception when insufficient_privilege then null;
  end;

  -- V3b. Il ne s'accorde pas une case par un UPDATE direct. C'est le trou
  -- que la politique de modification laisserait sans le déclencheur.
  begin
    update public.agenda_voeux set statut = 'valide' where id = v_voeu;
    assert false, 'V3b un praticien s''accorde une case par UPDATE';
  exception when raise_exception then assert sqlerrm = 'AGENDA_STATUT', 'V3b ' || sqlerrm;
  end;

  -- V4. Il ne décide pas lui-même.
  reset role;
  begin
    perform public.agenda_decider(v_voeu, 'valide', null);
    assert false, 'V4 un praticien accorde son propre vœu';
  exception when raise_exception then assert sqlerrm = 'AGENDA_DROITS', 'V4 ' || sqlerrm;
  end;

  -- V5. Un gérant accorde.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.agenda_decider(v_voeu, 'valide', 'D''accord pour le mardi matin.');
  assert (select statut from public.agenda_voeux where id = v_voeu) = 'valide', 'V5a';
  assert exists (select 1 from public.agenda_commentaires where voeu_id = v_voeu), 'V5b';
  assert exists (select 1 from public.agenda_mails where type = 'voeu_valide'), 'V5c';

  -- V6. La case est prise : un second vœu ne peut plus être accordé.
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  set local role authenticated;
  insert into public.agenda_voeux (user_id, salle, jour, moment)
  values (v_kine, 'sua', 2, 'matin') returning id into v_autre;
  reset role;
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_decider(v_autre, 'valide', null);
    assert false, 'V6 deux vœux accordés sur la même case';
  exception when raise_exception then assert sqlerrm = 'AGENDA_CASE_PRISE', 'V6 ' || sqlerrm;
  end;

  -- V7. L'auteur ne supprime pas un vœu accordé.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  delete from public.agenda_voeux where id = v_voeu;
  assert exists (select 1 from public.agenda_voeux where id = v_voeu), 'V7 un vœu accordé a été supprimé';

  -- V8. Déplacer un vœu accordé le ramène en « proposé ».
  update public.agenda_voeux set jour = 3 where id = v_voeu;
  assert (select statut from public.agenda_voeux where id = v_voeu) = 'propose', 'V8a';
  assert (select decide_par from public.agenda_voeux where id = v_voeu) is null, 'V8b';
  update public.agenda_voeux set jour = 2 where id = v_voeu;
  reset role;

  -- V9. Le retrait : demandé par l'auteur, tranché par le gérant.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.agenda_decider(v_voeu, 'valide', null);
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_demander_retrait(v_voeu, 'Je le prends.');
    assert false, 'V9a un tiers demande le retrait';
  exception when raise_exception then assert sqlerrm = 'AGENDA_DROITS', 'V9a ' || sqlerrm;
  end;
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  perform public.agenda_demander_retrait(v_voeu, 'Je change de jour à la rentrée.');
  assert (select statut from public.agenda_voeux where id = v_voeu) = 'retrait_demande', 'V9b';

  -- V10. Une case en retrait demandé reste tenue.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_decider(v_autre, 'valide', null);
    assert false, 'V10 une case en retrait demandé a été réattribuée';
  exception when raise_exception then assert sqlerrm = 'AGENDA_CASE_PRISE', 'V10 ' || sqlerrm;
  end;

  -- V11. Retrait accordé : le vœu disparaît, le mail reste.
  perform public.agenda_trancher_retrait(v_voeu, true, 'Entendu.');
  assert not exists (select 1 from public.agenda_voeux where id = v_voeu), 'V11a';
  assert exists (select 1 from public.agenda_mails where type = 'retrait_tranche'), 'V11b';

  -- V12. La case est libre : le second vœu peut être accordé.
  perform public.agenda_decider(v_autre, 'valide', null);
  assert (select statut from public.agenda_voeux where id = v_autre) = 'valide', 'V12';

  -- V13. On n'écrit pas à celui qui agit. Un gérant qui accorde son propre
  -- vœu ne reçoit rien ; s'il accorde celui d'un autre, le mail part. Sans
  -- ce scénario, la règle vit en production sans que rien ne l'éprouve.
  declare
    v_sien uuid; v_mails_avant int;
  begin
    perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
    insert into public.agenda_voeux (user_id, salle, jour, moment)
    values (v_lucas, 'etera', 3, 'aprem') returning id into v_sien;
    select count(*) into v_mails_avant from public.agenda_mails;
    perform public.agenda_decider(v_sien, 'valide', null);
    assert (select count(*) from public.agenda_mails) = v_mails_avant,
           'V13a un gérant reçoit un mail pour son propre vœu';

    insert into public.agenda_voeux (user_id, salle, jour, moment)
    values (v_kine, 'etera', 3, 'matin') returning id into v_sien;
    perform public.agenda_decider(v_sien, 'valide', null);
    assert (select count(*) from public.agenda_mails) = v_mails_avant + 1,
           'V13b le mail au titulaire ne part plus';
  end;

  perform set_config('request.jwt.claims', '', true);
end $$;
-- FIN BLOC VŒUX

-- BLOC COMMENTAIRES
do $$
declare
  v_lucas uuid;
  v_hugo uuid;
  v_kine uuid;
  v_voeu uuid;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  select u.id into v_kine  from auth.users u where u.email = 'jbc.kine@gmail.com';
  delete from public.site_super_admins where user_id in (v_hugo, v_kine);
  -- L'équipe se sert de l'agenda : ces scénarios doivent être indépendants
  -- de ce qu'elle y a posé. On repart d'une grille vide, à l'intérieur de la
  -- transaction annulée — rien n'est réellement supprimé.
  delete from public.agenda_voeux;

  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  insert into public.agenda_voeux (user_id, salle, jour, moment)
  values (v_hugo, 'etera', 5, 'aprem') returning id into v_voeu;

  -- C1. On n'écrit pas dans la table des commentaires directement.
  begin
    insert into public.agenda_commentaires (voeu_id, auteur_id, texte) values (v_voeu, v_hugo, 'Direct');
    assert false, 'C1 écriture directe dans agenda_commentaires';
  exception when insufficient_privilege then null;
  end;
  reset role;

  -- C2. L'auteur commente le sien.
  perform public.agenda_commenter(v_voeu, 'Je peux décaler si besoin.');
  assert (select count(*) from public.agenda_commentaires where voeu_id = v_voeu) = 1, 'C2';

  -- C3. Un tiers ne commente pas.
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_commenter(v_voeu, 'Moi aussi je la veux.');
    assert false, 'C3 un tiers commente le vœu d''un autre';
  exception when raise_exception then assert sqlerrm = 'AGENDA_DROITS', 'C3 ' || sqlerrm;
  end;

  -- C4. Un gérant commente n'importe lequel.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.agenda_commenter(v_voeu, 'On en parle vendredi.');
  assert (select count(*) from public.agenda_commentaires where voeu_id = v_voeu) = 2, 'C4';

  perform set_config('request.jwt.claims', '', true);
end $$;
-- FIN BLOC COMMENTAIRES

-- BLOC DROITS ANON
set local role anon;
do $$
begin
  begin
    assert (select count(*) from public.agenda_voeux) = 0, 'P1 anon lit les vœux';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.agenda_decider(gen_random_uuid(), 'valide', null);
    assert false, 'P2 anon appelle agenda_decider';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.agenda_reserver_mails(1);
    assert false, 'P3 anon appelle agenda_reserver_mails';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
-- FIN BLOC DROITS ANON

rollback;
select 'agenda : scénarios OK' as resultat;
