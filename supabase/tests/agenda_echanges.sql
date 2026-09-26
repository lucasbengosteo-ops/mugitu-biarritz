-- Échanges de créneau. Tout se passe dans une transaction annulée : rien
-- n'est écrit. Lancer avec l'outil MCP execute_sql (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « échanges : scénarios OK ».
--
-- Les quatre effets d'un accord sont vérifiés un par un, parce que c'est là
-- que tout se joue : deux portées, avec ou sans contrepartie.

begin;

-- BLOC PARCOURS ET DROITS
do $$
declare
  v_lucas uuid; v_hugo uuid; v_kine uuid;
  v_cible uuid; v_offert uuid; v_ech uuid;
  v_lundi date := (date_trunc('week', current_date) + interval '7 days')::date;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  select u.id into v_kine  from auth.users u where u.email = 'jbc.kine@gmail.com';
  assert v_lucas is not null and v_hugo is not null and v_kine is not null, 'E0 comptes absents';
  delete from public.site_super_admins where user_id in (v_hugo, v_kine);
  -- L'équipe se sert de l'agenda : ces scénarios doivent être indépendants
  -- de ce qu'elle y a posé. On repart d'une grille vide, à l'intérieur de la
  -- transaction annulée — rien n'est réellement supprimé.
  delete from public.agenda_voeux;


  -- Kine tient sua mardi matin, Hugo tient ura jeudi après-midi.
  perform set_config('agenda.transition', '1', true);
  insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
  values (v_kine, 'sua', 2, 'matin', 'valide') returning id into v_cible;
  insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
  values (v_hugo, 'ura', 4, 'aprem', 'valide') returning id into v_offert;
  perform set_config('agenda.transition', '', true);

  -- E1. On ne demande pas sa propre case.
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_proposer_echange(v_cible, null, 'definitif', null, 'La mienne');
    assert false, 'E1 on demande sa propre case';
  exception when raise_exception then assert sqlerrm = 'AGENDA_SOI_MEME', 'E1 ' || sqlerrm;
  end;

  -- E2. On n'offre pas la case d'un autre.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_proposer_echange(v_cible, v_offert, 'definitif', null, 'Pas à moi');
    assert false, 'E2 on offre la case d''un autre';
  exception when raise_exception then assert sqlerrm = 'AGENDA_DROITS', 'E2 ' || sqlerrm;
  end;

  -- E3. Une semaine passée est refusée.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_proposer_echange(v_cible, null, 'ponctuel',
      (date_trunc('week', current_date) - interval '7 days')::date, 'Trop tard');
    assert false, 'E3 une semaine passée est acceptée';
  exception when raise_exception then assert sqlerrm = 'AGENDA_SEMAINE', 'E3 ' || sqlerrm;
  end;

  -- E4. Hugo propose, et le titulaire est prévenu.
  v_ech := public.agenda_proposer_echange(v_cible, v_offert, 'ponctuel', v_lundi, 'Je dépanne un patient.');
  assert (select statut from public.agenda_echanges where id = v_ech) = 'propose', 'E4a';
  assert exists (select 1 from public.agenda_mails where type = 'echange_propose'), 'E4b';

  -- E5. Un tiers ne répond pas à sa place.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_repondre_echange(v_ech, true);
    assert false, 'E5 un tiers répond pour le titulaire';
  exception when raise_exception then assert sqlerrm = 'AGENDA_DROITS', 'E5 ' || sqlerrm;
  end;

  -- E6. Un gérant ne tranche pas avant le pair.
  begin
    perform public.agenda_trancher_echange(v_ech, true, null);
    assert false, 'E6 un gérant tranche avant le pair';
  exception when raise_exception then assert sqlerrm = 'AGENDA_STATUT', 'E6 ' || sqlerrm;
  end;

  -- E7. Le titulaire accepte, les gérants sont prévenus.
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  perform public.agenda_repondre_echange(v_ech, true);
  assert (select statut from public.agenda_echanges where id = v_ech) = 'accepte_pair', 'E7a';
  assert exists (select 1 from public.agenda_mails where type = 'echange_pair'), 'E7b';

  -- E8. Un praticien ne tranche pas.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_trancher_echange(v_ech, true, null);
    assert false, 'E8 un praticien tranche un échange';
  exception when raise_exception then assert sqlerrm = 'AGENDA_DROITS', 'E8 ' || sqlerrm;
  end;

  -- E9. Effet « ponctuel avec contrepartie » : deux exceptions croisées,
  -- chacune à la date de son propre jour.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.agenda_trancher_echange(v_ech, true, 'D''accord.');
  assert (select statut from public.agenda_echanges where id = v_ech) = 'valide', 'E9a';
  assert exists (select 1 from public.agenda_exceptions
                  where jour = v_lundi + 1 and salle = 'sua' and moment = 'matin' and user_id = v_hugo), 'E9b';
  assert exists (select 1 from public.agenda_exceptions
                  where jour = v_lundi + 3 and salle = 'ura' and moment = 'aprem' and user_id = v_kine), 'E9c';
  assert (select count(*) from public.agenda_exceptions where echange_id = v_ech) = 2, 'E9d';
  -- Les vœux n'ont pas bougé : un ponctuel ne touche pas la semaine type.
  assert (select user_id from public.agenda_voeux where id = v_cible) = v_kine, 'E9e';
  assert (select user_id from public.agenda_voeux where id = v_offert) = v_hugo, 'E9f';

  perform set_config('request.jwt.claims', '', true);
end $$;

-- BLOC EFFET PONCTUEL SANS CONTREPARTIE
do $$
declare
  v_lucas uuid; v_hugo uuid; v_kine uuid; v_cible uuid; v_ech uuid;
  v_lundi date := (date_trunc('week', current_date) + interval '14 days')::date;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  select u.id into v_kine  from auth.users u where u.email = 'jbc.kine@gmail.com';
  delete from public.site_super_admins where user_id in (v_hugo, v_kine);
  -- L'équipe se sert de l'agenda : ces scénarios doivent être indépendants
  -- de ce qu'elle y a posé. On repart d'une grille vide, à l'intérieur de la
  -- transaction annulée — rien n'est réellement supprimé.
  delete from public.agenda_voeux;


  perform set_config('agenda.transition', '1', true);
  insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
  values (v_kine, 'etera', 5, 'matin', 'valide') returning id into v_cible;
  perform set_config('agenda.transition', '', true);

  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  v_ech := public.agenda_proposer_echange(v_cible, null, 'ponctuel', v_lundi, 'Sans contrepartie.');
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  perform public.agenda_repondre_echange(v_ech, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.agenda_trancher_echange(v_ech, true, null);

  -- Une seule exception, celle de la case cible.
  assert (select count(*) from public.agenda_exceptions where echange_id = v_ech) = 1, 'F1a';
  assert exists (select 1 from public.agenda_exceptions
                  where jour = v_lundi + 4 and salle = 'etera' and moment = 'matin' and user_id = v_hugo), 'F1b';

  perform set_config('request.jwt.claims', '', true);
end $$;

-- BLOC EFFET DÉFINITIF
do $$
declare
  v_lucas uuid; v_hugo uuid; v_kine uuid;
  v_cible uuid; v_offert uuid; v_ech uuid; v_ech2 uuid; v_cible2 uuid;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  select u.id into v_kine  from auth.users u where u.email = 'jbc.kine@gmail.com';
  delete from public.site_super_admins where user_id in (v_hugo, v_kine);
  -- L'équipe se sert de l'agenda : ces scénarios doivent être indépendants
  -- de ce qu'elle y a posé. On repart d'une grille vide, à l'intérieur de la
  -- transaction annulée — rien n'est réellement supprimé.
  delete from public.agenda_voeux;


  perform set_config('agenda.transition', '1', true);
  insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
  values (v_kine, 'lurra', 1, 'matin', 'valide') returning id into v_cible;
  insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
  values (v_hugo, 'airea', 3, 'aprem', 'valide') returning id into v_offert;
  perform set_config('agenda.transition', '', true);

  -- G1. Définitif avec contrepartie : les deux vœux changent de propriétaire.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  v_ech := public.agenda_proposer_echange(v_cible, v_offert, 'definitif', null, 'On troque pour de bon.');
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  perform public.agenda_repondre_echange(v_ech, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.agenda_trancher_echange(v_ech, true, null);

  assert (select user_id from public.agenda_voeux where id = v_cible) = v_hugo, 'G1a';
  assert (select user_id from public.agenda_voeux where id = v_offert) = v_kine, 'G1b';
  -- Un définitif ne pose aucune exception.
  assert not exists (select 1 from public.agenda_exceptions where echange_id = v_ech), 'G1c';
  -- Les deux vœux restent accordés.
  assert (select statut from public.agenda_voeux where id = v_cible) = 'valide', 'G1d';

  -- G2. Définitif sans contrepartie : la case change de main, sans retour.
  perform set_config('agenda.transition', '1', true);
  insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
  values (v_kine, 'sua', 6, 'matin', 'valide') returning id into v_cible2;
  perform set_config('agenda.transition', '', true);

  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  v_ech2 := public.agenda_proposer_echange(v_cible2, null, 'definitif', null, 'Je la reprends.');
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  perform public.agenda_repondre_echange(v_ech2, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.agenda_trancher_echange(v_ech2, true, null);

  assert (select user_id from public.agenda_voeux where id = v_cible2) = v_hugo, 'G2a';
  assert (select count(*) from public.agenda_voeux where id = v_cible2) = 1, 'G2b';

  perform set_config('request.jwt.claims', '', true);
end $$;

-- BLOC REFUS ET ANNULATION
do $$
declare
  v_lucas uuid; v_hugo uuid; v_kine uuid; v_cible uuid; v_ech uuid;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  select u.id into v_kine  from auth.users u where u.email = 'jbc.kine@gmail.com';
  delete from public.site_super_admins where user_id in (v_hugo, v_kine);
  -- L'équipe se sert de l'agenda : ces scénarios doivent être indépendants
  -- de ce qu'elle y a posé. On repart d'une grille vide, à l'intérieur de la
  -- transaction annulée — rien n'est réellement supprimé.
  delete from public.agenda_voeux;


  perform set_config('agenda.transition', '1', true);
  insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
  values (v_kine, 'ura', 7, 'aprem', 'valide') returning id into v_cible;
  perform set_config('agenda.transition', '', true);

  -- H1. Le pair refuse : rien ne change, et l'affaire s'arrête là.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  v_ech := public.agenda_proposer_echange(v_cible, null, 'definitif', null, 'Essai refusé.');
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  perform public.agenda_repondre_echange(v_ech, false);
  assert (select statut from public.agenda_echanges where id = v_ech) = 'refuse_pair', 'H1a';
  assert (select user_id from public.agenda_voeux where id = v_cible) = v_kine, 'H1b';

  -- H2. Un gérant ne peut plus rien en faire.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_trancher_echange(v_ech, true, null);
    assert false, 'H2 un gérant tranche un échange refusé par le pair';
  exception when raise_exception then assert sqlerrm = 'AGENDA_STATUT', 'H2 ' || sqlerrm;
  end;

  -- H3. Le demandeur annule tant que rien n'est tranché.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  v_ech := public.agenda_proposer_echange(v_cible, null, 'definitif', null, 'À annuler.');
  perform public.agenda_annuler_echange(v_ech);
  assert (select statut from public.agenda_echanges where id = v_ech) = 'annule', 'H3';

  -- H4. Un tiers n'annule pas la demande d'un autre.
  v_ech := public.agenda_proposer_echange(v_cible, null, 'ponctuel',
    (date_trunc('week', current_date) + interval '21 days')::date, 'Pas la mienne à annuler.');
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_annuler_echange(v_ech);
    assert false, 'H4 un tiers annule la demande d''un autre';
  exception when raise_exception then assert sqlerrm = 'AGENDA_DROITS', 'H4 ' || sqlerrm;
  end;

  -- H4b. Deux échanges accordés sur la même case à la même date : le second
  -- lève un code lisible, pas une violation d'unicité brute.
  declare
    v_lundi2 date := (date_trunc('week', current_date) + interval '28 days')::date;
    v_a uuid; v_b uuid; v_autre_cible uuid;
  begin
    perform set_config('agenda.transition', '1', true);
    insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
    values (v_kine, 'airea', 2, 'matin', 'valide') returning id into v_autre_cible;
    perform set_config('agenda.transition', '', true);

    perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
    v_a := public.agenda_proposer_echange(v_autre_cible, null, 'ponctuel', v_lundi2, 'Premier.');
    v_b := public.agenda_proposer_echange(v_autre_cible, null, 'ponctuel', v_lundi2, 'Second.');
    perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
    perform public.agenda_repondre_echange(v_a, true);
    perform public.agenda_repondre_echange(v_b, true);
    perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
    perform public.agenda_trancher_echange(v_a, true, null);
    begin
      perform public.agenda_trancher_echange(v_b, true, null);
      assert false, 'H4b deux échanges accordés sur la même case et la même date';
    exception when raise_exception then
      assert sqlerrm = 'AGENDA_EXCEPTION_PRISE', 'H4b ' || sqlerrm;
    end;

    -- Ce bloc a promené l'identité de session : on la remet sur le pair,
    -- pour que H5 ne parte pas avec celle du gérant.
    perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  end;

  -- H5. Le gérant refuse un échange que le pair avait accepté : rien ne bouge.
  perform public.agenda_repondre_echange(v_ech, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.agenda_trancher_echange(v_ech, false, 'Pas cette semaine.');
  assert (select statut from public.agenda_echanges where id = v_ech) = 'refuse', 'H5a';
  assert not exists (select 1 from public.agenda_exceptions where echange_id = v_ech), 'H5b';

  perform set_config('request.jwt.claims', '', true);
end $$;

-- BLOC ÉCRITURES DIRECTES ET ANON
do $$
declare
  v_hugo uuid; v_cible uuid;
begin
  select u.id into v_hugo from auth.users u where u.email = 'hugo.daminato@gmail.com';
  perform set_config('agenda.transition', '1', true);
  insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
  values (v_hugo, 'lurra', 2, 'aprem', 'valide') returning id into v_cible;
  perform set_config('agenda.transition', '', true);

  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;

  -- I1. On n'insère pas un échange à la main.
  begin
    insert into public.agenda_echanges (demandeur_id, voeu_cible_id, portee, motif)
    values (v_hugo, v_cible, 'definitif', 'Direct');
    assert false, 'I1 écriture directe dans agenda_echanges';
  exception when insufficient_privilege then null;
  end;

  -- I2. On n'insère pas une exception à la main : l'arbitrage est le seul chemin.
  begin
    insert into public.agenda_exceptions (jour, salle, moment, user_id)
    values (current_date + 7, 'lurra', 'matin', v_hugo);
    assert false, 'I2 écriture directe dans agenda_exceptions';
  exception when insufficient_privilege then null;
  end;

  reset role;
  perform set_config('request.jwt.claims', '', true);
end $$;

set local role anon;
do $$
begin
  begin
    assert (select count(*) from public.agenda_echanges) = 0, 'P1 anon lit les échanges';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.agenda_proposer_echange(gen_random_uuid(), null, 'definitif', null, 'x');
    assert false, 'P2 anon propose un échange';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

rollback;
select 'échanges : scénarios OK' as resultat;
