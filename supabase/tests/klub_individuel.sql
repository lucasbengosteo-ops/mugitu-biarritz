-- Scénarios de la préparation individuelle du Klub (séances individuelles,
-- bilans, réservation à deux). Transaction annulée : rien n'est écrit en base.
-- Lancer avec l'outil MCP execute_sql (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « klub individuel : scénarios OK ».
--
-- Identités : Lucas (gérant), Hugo et Baptiste (équipe, non gérants : retirés
-- de site_super_admins pour la transaction).

begin;

-- I1 : contraintes des deux nouveaux types.
do $$
declare
  v_lucas uuid;
  v_c text;
  v_s uuid;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  assert v_lucas is not null, 'I1 compte absent';

  -- I1a. Un individuel à capacité 2 : refusé, sur une séance et sur un créneau.
  begin
    insert into public.klub_seances (debut, duree_min, type, titre, capacite, prix_libelle, inscription_requise)
    values (now() + interval '5 days', 60, 'individuel', 'Test I1a', 2, '', true);
    assert false, 'I1a attendu une violation';
  exception when check_violation then
    get stacked diagnostics v_c = constraint_name;
    assert v_c = 'klub_seances_individuel', 'I1a ' || v_c;
  end;
  begin
    insert into public.klub_creneaux (jour, heure, duree_min, type, titre, capacite, prix_libelle, inscription_requise, actif)
    values (1, '08:00', 60, 'individuel', 'Test I1a', 2, '', true, false);
    assert false, 'I1a créneau attendu une violation';
  exception when check_violation then
    get stacked diagnostics v_c = constraint_name;
    assert v_c = 'klub_creneaux_individuel', 'I1a créneau ' || v_c;
  end;
  -- I1b. Un bilan sans inscription, ou avec un lien externe : refusé.
  begin
    insert into public.klub_seances (debut, duree_min, type, titre, capacite, prix_libelle, inscription_requise, reservation_url)
    values (now() + interval '5 days', 30, 'bilan', 'Test I1b', null, '', false, 'https://example.com');
    assert false, 'I1b attendu une violation';
  exception when check_violation then
    get stacked diagnostics v_c = constraint_name;
    assert v_c = 'klub_seances_individuel', 'I1b ' || v_c;
  end;
  -- I1c. Un bilan avec un prix : refusé, seul comme à deux.
  begin
    insert into public.klub_seances (debut, duree_min, type, titre, capacite, prix_libelle, inscription_requise, prix_centimes)
    values (now() + interval '5 days', 30, 'bilan', 'Test I1c', 1, '', true, 1000);
    assert false, 'I1c attendu une violation';
  exception when check_violation then
    get stacked diagnostics v_c = constraint_name;
    assert v_c = 'klub_seances_bilan_gratuit', 'I1c ' || v_c;
  end;
  begin
    insert into public.klub_creneaux (jour, heure, duree_min, type, titre, capacite, prix_libelle, inscription_requise, actif,
                                      prix_centimes)
    values (1, '08:00', 30, 'bilan', 'Test I1c', 1, '', true, false, 1000);
    assert false, 'I1c créneau attendu une violation';
  exception when check_violation then
    get stacked diagnostics v_c = constraint_name;
    assert v_c = 'klub_creneaux_bilan_gratuit', 'I1c créneau ' || v_c;
  end;
  -- I1d. Un small avec un prix duo : refusé.
  begin
    insert into public.klub_seances (debut, duree_min, type, titre, capacite, prix_libelle, inscription_requise, prix_duo_centimes)
    values (now() + interval '5 days', 45, 'small', 'Test I1d', 6, '', true, 1000);
    assert false, 'I1d attendu une violation';
  exception when check_violation then
    get stacked diagnostics v_c = constraint_name;
    assert v_c = 'klub_seances_prix_duo_individuel', 'I1d ' || v_c;
  end;
  begin
    insert into public.klub_creneaux (jour, heure, duree_min, type, titre, capacite, prix_libelle, inscription_requise, actif,
                                      prix_duo_centimes)
    values (1, '08:00', 45, 'small', 'Test I1d', 6, '', true, false, 1000);
    assert false, 'I1d créneau attendu une violation';
  exception when check_violation then
    get stacked diagnostics v_c = constraint_name;
    assert v_c = 'klub_creneaux_prix_duo_individuel', 'I1d créneau ' || v_c;
  end;
  -- I1e. Depuis l'admin, un individuel à capacité 2 : KLUB_CHAMP ; à capacité 1 : passe.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  begin
    perform public.klub_admin_creer_seance(jsonb_build_object(
      'debut', now() + interval '5 days', 'duree_min', 60, 'type', 'individuel', 'titre', 'Test I1e',
      'capacite', 2, 'prix_libelle', '', 'inscription_requise', true));
    assert false, 'I1e attendu KLUB_CHAMP';
  exception when raise_exception then assert sqlerrm = 'KLUB_CHAMP', 'I1e ' || sqlerrm;
  end;
  v_s := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '5 days', 'duree_min', 60, 'type', 'individuel', 'titre', 'Test I1e',
    'capacite', 1, 'prix_libelle', '', 'inscription_requise', true));
  assert (select type = 'individuel' and capacite = 1 from public.klub_seances where id = v_s), 'I1e création';
  perform set_config('request.jwt.claims', '', true);
end $$;

-- I2 et I3 : droits du praticien sur ses créneaux individuels et bilans.
do $$
declare
  v_lucas uuid; v_hugo uuid; v_baptiste uuid;
  v_c uuid;        -- créneau individuel de Hugo
  v_s uuid;        -- séance individuelle de Hugo
  v_sb uuid;       -- séance individuelle de Baptiste
  v_small uuid;    -- small, sans praticien
  v_bilan uuid;    -- bilan de Hugo
  v_herit uuid;
  v_r jsonb;
  v_ins record;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  select u.id into v_baptiste from auth.users u join public.profiles p on p.user_id = u.id
  where u.email = 'baptiste.caparros@gmail.com';
  assert v_lucas is not null and v_hugo is not null and v_baptiste is not null, 'I2 comptes absents';
  delete from public.site_super_admins where user_id in (v_hugo, v_baptiste);

  -- I2a. En Hugo : un créneau individuel, rattaché à lui-même à 40 € dans le
  -- même appel, puis le prix duo à 30 €.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  v_r := public.klub_admin_sauver_creneau(jsonb_build_object(
    'jour', 3, 'heure', '07:15', 'duree_min', 60, 'type', 'individuel', 'titre', 'Test I2 créneau',
    'capacite', 1, 'prix_libelle', '', 'inscription_requise', true, 'actif', false));
  v_c := (v_r->>'id')::uuid;
  perform public.klub_admin_encaissement('creneau', v_c, v_hugo, 4000);
  perform public.klub_admin_prix_duo('creneau', v_c, 3000);
  -- Même chose sur une séance ponctuelle.
  v_s := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '6 days', 'duree_min', 60, 'type', 'individuel', 'titre', 'Test I2 séance',
    'capacite', 1, 'prix_libelle', '', 'inscription_requise', true));
  perform public.klub_admin_encaissement('seance', v_s, v_hugo, 4000);
  perform public.klub_admin_prix_duo('seance', v_s, 3000);
  -- Un bilan : se rattacher sans prix passe ; un prix lève KLUB_PRIX.
  v_bilan := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '6 days', 'duree_min', 30, 'type', 'bilan', 'titre', 'Test I2 bilan',
    'capacite', 1, 'prix_libelle', '', 'inscription_requise', true));
  perform public.klub_admin_encaissement('seance', v_bilan, v_hugo, null);
  begin
    perform public.klub_admin_encaissement('seance', v_bilan, v_hugo, 1000);
    assert false, 'I2b attendu KLUB_PRIX';
  exception when raise_exception then assert sqlerrm = 'KLUB_PRIX', 'I2b ' || sqlerrm;
  end;
  begin
    perform public.klub_admin_prix_duo('seance', v_bilan, 1000);
    assert false, 'I2c attendu KLUB_DUO';
  exception when raise_exception then assert sqlerrm = 'KLUB_DUO', 'I2c ' || sqlerrm;
  end;
  reset role;
  assert (select praticien_id = v_hugo and prix_centimes = 4000 and prix_duo_centimes = 3000
          from public.klub_creneaux where id = v_c), 'I2a créneau';
  assert (select praticien_id = v_hugo and prix_centimes = 4000 and prix_duo_centimes = 3000
          from public.klub_seances where id = v_s), 'I2a séance';
  assert (select praticien_id = v_hugo and prix_centimes is null from public.klub_seances where id = v_bilan), 'I2b bilan';

  -- I2d. Une séance générée depuis le créneau hérite du prix duo.
  insert into public.klub_seances (creneau_id, debut, duree_min, type, titre, capacite, prix_libelle, inscription_requise)
  values (v_c, now() + interval '8 days', 60, 'individuel', 'Test I2 héritée', 1, '', true)
  returning id into v_herit;
  select praticien_id, prix_centimes, prix_duo_centimes into v_ins from public.klub_seances where id = v_herit;
  assert v_ins.praticien_id = v_hugo and v_ins.prix_centimes = 4000 and v_ins.prix_duo_centimes = 3000, 'I2d';

  -- Baptiste : son individuel, rattaché à lui-même.
  perform set_config('request.jwt.claims', json_build_object('sub', v_baptiste, 'role', 'authenticated')::text, true);
  set local role authenticated;
  v_sb := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '6 days', 'duree_min', 60, 'type', 'individuel', 'titre', 'Test I2 Baptiste',
    'capacite', 1, 'prix_libelle', '', 'inscription_requise', true));
  perform public.klub_admin_encaissement('seance', v_sb, v_baptiste, 4500);
  reset role;

  -- Un small sans praticien, créé par Lucas.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  v_small := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '6 days', 'duree_min', 45, 'type', 'small', 'titre', 'Test I2 small',
    'capacite', 6, 'prix_libelle', '', 'inscription_requise', true));

  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  -- I2e. Le prix duo de l'individuel de Baptiste : KLUB_ENCAISSEMENT.
  begin
    perform public.klub_admin_prix_duo('seance', v_sb, 3000);
    assert false, 'I2e attendu KLUB_ENCAISSEMENT';
  exception when raise_exception then assert sqlerrm = 'KLUB_ENCAISSEMENT', 'I2e ' || sqlerrm;
  end;
  -- I2f. Un prix duo sur un small : KLUB_DUO.
  begin
    perform public.klub_admin_prix_duo('seance', v_small, 3000);
    assert false, 'I2f attendu KLUB_DUO';
  exception when raise_exception then assert sqlerrm = 'KLUB_DUO', 'I2f ' || sqlerrm;
  end;

  -- I3a. Se rattacher à un small : KLUB_ENCAISSEMENT.
  begin
    perform public.klub_admin_encaissement('seance', v_small, v_hugo, null);
    assert false, 'I3a attendu KLUB_ENCAISSEMENT';
  exception when raise_exception then assert sqlerrm = 'KLUB_ENCAISSEMENT', 'I3a ' || sqlerrm;
  end;
  -- I3b. Rattacher son individuel à Baptiste : KLUB_ENCAISSEMENT.
  begin
    perform public.klub_admin_encaissement('seance', v_s, v_baptiste, 4000);
    assert false, 'I3b attendu KLUB_ENCAISSEMENT';
  exception when raise_exception then assert sqlerrm = 'KLUB_ENCAISSEMENT', 'I3b ' || sqlerrm;
  end;
  -- I3c. Se rattacher à l'individuel de Baptiste : KLUB_ENCAISSEMENT.
  begin
    perform public.klub_admin_encaissement('seance', v_sb, v_hugo, 4500);
    assert false, 'I3c attendu KLUB_ENCAISSEMENT';
  exception when raise_exception then assert sqlerrm = 'KLUB_ENCAISSEMENT', 'I3c ' || sqlerrm;
  end;
  -- I3d. Changer le prix de l'individuel de Baptiste : KLUB_ENCAISSEMENT.
  begin
    perform public.klub_admin_encaissement('seance', v_sb, v_baptiste, 1000);
    assert false, 'I3d attendu KLUB_ENCAISSEMENT';
  exception when raise_exception then assert sqlerrm = 'KLUB_ENCAISSEMENT', 'I3d ' || sqlerrm;
  end;
  -- I3e. Se détacher de son individuel : KLUB_ENCAISSEMENT (gérant seulement).
  begin
    perform public.klub_admin_encaissement('seance', v_s, null, 4000);
    assert false, 'I3e attendu KLUB_ENCAISSEMENT';
  exception when raise_exception then assert sqlerrm = 'KLUB_ENCAISSEMENT', 'I3e ' || sqlerrm;
  end;
  -- I3f. Un prix sur un small sans praticien : KLUB_ENCAISSEMENT (règle d'avant).
  begin
    perform public.klub_admin_encaissement('seance', v_small, null, 1500);
    assert false, 'I3f attendu KLUB_ENCAISSEMENT';
  exception when raise_exception then assert sqlerrm = 'KLUB_ENCAISSEMENT', 'I3f ' || sqlerrm;
  end;
  reset role;
  assert (select praticien_id = v_baptiste and prix_centimes = 4500 and prix_duo_centimes is null
          from public.klub_seances where id = v_sb), 'I3 Baptiste intact';
  assert (select praticien_id is null and prix_centimes is null from public.klub_seances where id = v_small), 'I3 small intact';

  -- I3g. Un gérant rattache l'individuel de Hugo à Baptiste : passe.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.klub_admin_encaissement('seance', v_s, v_baptiste, 4000);
  assert (select praticien_id from public.klub_seances where id = v_s) = v_baptiste, 'I3g';
  perform set_config('request.jwt.claims', '', true);
end $$;

-- I4 à I9 : la réservation.
do $$
declare
  v_lucas uuid; v_hugo uuid;
  v_s4 uuid; v_s5 uuid; v_s6 uuid; v_s6b uuid; v_small uuid; v_s7 uuid; v_s8 uuid; v_s8b uuid; v_bilan uuid;
  v_r jsonb;
  v_i uuid;
  v_ins public.klub_inscriptions;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  assert v_lucas is not null and v_hugo is not null, 'I4 comptes absents';
  delete from public.site_super_admins where user_id = v_hugo;
  delete from public.site_comptes_stripe where user_id = v_hugo;

  -- Séances de Hugo, créées en gérant : individuels à 40 € / duo 30 €.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  v_s4 := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '5 days', 'duree_min', 60, 'type', 'individuel', 'titre', 'Test I4',
    'intervenant', 'Hugo Daminato', 'capacite', 1, 'prix_libelle', '', 'inscription_requise', true));
  v_s5 := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '5 days', 'duree_min', 60, 'type', 'individuel', 'titre', 'Test I5',
    'capacite', 1, 'prix_libelle', '', 'inscription_requise', true));
  v_s6 := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '5 days', 'duree_min', 60, 'type', 'individuel', 'titre', 'Test I6 sans duo',
    'capacite', 1, 'prix_libelle', '', 'inscription_requise', true));
  v_s6b := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '5 days', 'duree_min', 60, 'type', 'individuel', 'titre', 'Test I6 accompagnant',
    'capacite', 1, 'prix_libelle', '', 'inscription_requise', true));
  v_small := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '5 days', 'duree_min', 45, 'type', 'small', 'titre', 'Test I6 small',
    'capacite', 6, 'prix_libelle', '', 'inscription_requise', true));
  v_s7 := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '5 days', 'duree_min', 60, 'type', 'individuel', 'titre', 'Test I7',
    'capacite', 1, 'prix_libelle', '', 'inscription_requise', true));
  v_s8 := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '5 days', 'duree_min', 60, 'type', 'individuel', 'titre', 'Test I8',
    'capacite', 1, 'prix_libelle', '', 'inscription_requise', true));
  v_s8b := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '5 days', 'duree_min', 60, 'type', 'individuel', 'titre', 'Test I8 duo retiré',
    'capacite', 1, 'prix_libelle', '', 'inscription_requise', true));
  v_bilan := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '5 days', 'duree_min', 30, 'type', 'bilan', 'titre', 'Test I9',
    'capacite', 1, 'prix_libelle', '', 'inscription_requise', true));
  perform public.klub_admin_encaissement('seance', x, v_hugo, 4000)
  from unnest(array[v_s4, v_s5, v_s6, v_s6b, v_s7, v_s8, v_s8b]) x;
  perform public.klub_admin_prix_duo('seance', x, 3000)
  from unnest(array[v_s4, v_s5, v_s6b, v_s7, v_s8, v_s8b]) x;
  perform public.klub_admin_encaissement('seance', v_small, v_hugo, 1500);
  perform public.klub_admin_encaissement('seance', v_bilan, v_hugo, null);
  perform set_config('request.jwt.claims', '', true);

  -- I4. À deux, sans compte Stripe : confirmée sur place, deux personnes,
  -- 60 € enregistrés ; la place est prise ; une 2e adresse va en attente.
  assert not (public.klub_seance(v_s4)->>'paiement_en_ligne')::boolean, 'I4 séance payable';
  assert (public.klub_seance(v_s4)->>'prix_duo_centimes')::int = 3000, 'I4 prix duo absent du JSON ' || public.klub_seance(v_s4)::text;
  v_r := public.klub_inscrire(v_s4, 'Ana', 'Test', 'i4-ana@example.com', '0612345601', false,
                              p_a_deux => true, p_accompagnant => '  Léa Martin ');
  assert v_r->>'statut' = 'confirmee' and v_r->>'mail_id' is not null, 'I4a ' || v_r::text;
  select * into v_ins from public.klub_inscriptions where id = (v_r->>'inscription_id')::uuid;
  assert v_ins.nb_personnes = 2 and v_ins.accompagnant = 'Léa Martin' and v_ins.montant_centimes = 6000
         and v_ins.paiement_expire_at is null, 'I4b ' || to_jsonb(v_ins)::text;
  assert (public.klub_seance(v_s4)->>'places_restantes')::int = 0, 'I4c ' || public.klub_seance(v_s4)::text;
  v_r := public.klub_inscrire(v_s4, 'Bob', 'Test', 'i4-bob@example.com', '0612345602', false);
  assert v_r->>'statut' = 'attente' and (v_r->>'rang')::int = 1, 'I4d ' || v_r::text;
  -- I4e. Doublon de la même adresse, seul cette fois : l'inscription garde ses choix.
  v_r := public.klub_inscrire(v_s4, 'Ana', 'Test', 'i4-ana@example.com', '0612345601', false);
  assert (select count(*) from public.klub_inscriptions where seance_id = v_s4) = 2, 'I4e doublon';
  assert (select nb_personnes = 2 and accompagnant = 'Léa Martin' and montant_centimes = 6000
          from public.klub_inscriptions where id = v_ins.id), 'I4e choix modifiés';

  -- I5. Compte Stripe prêt : la réservation à deux attend son paiement, 60 €.
  insert into public.site_comptes_stripe (user_id, compte, etat) values (v_hugo, 'acct_test', 'pret');
  assert (public.klub_seance(v_s5)->>'paiement_en_ligne')::boolean, 'I5 séance non payable';
  v_r := public.klub_inscrire(v_s5, 'Ana', 'Test', 'i5-ana@example.com', '0612345603', false,
                              p_a_deux => true, p_accompagnant => 'Léa Martin');
  assert v_r->>'statut' = 'paiement' and v_r->>'mail_id' is null, 'I5a ' || v_r::text;
  v_i := (v_r->>'inscription_id')::uuid;
  assert (select montant_centimes = 6000 and nb_personnes = 2 and paiement_expire_at is not null
          from public.klub_inscriptions where id = v_i), 'I5b';
  assert (public.klub_paiement_infos(v_i, null)->>'montant_centimes')::int = 6000, 'I5c';
  -- Seul, sur une séance identique : 40 €.
  v_r := public.klub_inscrire(v_s7, 'Cy', 'Test', 'i5-cy@example.com', '0612345604', false);
  assert v_r->>'statut' = 'paiement', 'I5d ' || v_r::text;
  assert (select montant_centimes = 4000 and nb_personnes = 1 and accompagnant is null
          from public.klub_inscriptions where id = (v_r->>'inscription_id')::uuid), 'I5e';

  -- I6. Les refus.
  begin
    perform public.klub_inscrire(v_s6, 'Di', 'Test', 'i6-di@example.com', '0612345605', false, true, 'Léa Martin');
    assert false, 'I6a attendu KLUB_DUO';
  exception when raise_exception then assert sqlerrm = 'KLUB_DUO', 'I6a ' || sqlerrm;
  end;
  begin
    perform public.klub_inscrire(v_small, 'Di', 'Test', 'i6-di@example.com', '0612345605', false, true, 'Léa Martin');
    assert false, 'I6b attendu KLUB_DUO';
  exception when raise_exception then assert sqlerrm = 'KLUB_DUO', 'I6b ' || sqlerrm;
  end;
  begin
    perform public.klub_inscrire(v_bilan, 'Di', 'Test', 'i6-di@example.com', '0612345605', false, true, 'Léa Martin');
    assert false, 'I6c attendu KLUB_DUO';
  exception when raise_exception then assert sqlerrm = 'KLUB_DUO', 'I6c ' || sqlerrm;
  end;
  begin
    perform public.klub_inscrire(v_s6b, 'Di', 'Test', 'i6-di@example.com', '0612345605', false, true, null);
    assert false, 'I6d attendu KLUB_ACCOMPAGNANT';
  exception when raise_exception then assert sqlerrm = 'KLUB_ACCOMPAGNANT', 'I6d ' || sqlerrm;
  end;
  begin
    perform public.klub_inscrire(v_s6b, 'Di', 'Test', 'i6-di@example.com', '0612345605', false, true, E' \t' || chr(160));
    assert false, 'I6e attendu KLUB_ACCOMPAGNANT';
  exception when raise_exception then assert sqlerrm = 'KLUB_ACCOMPAGNANT', 'I6e ' || sqlerrm;
  end;
  begin
    perform public.klub_inscrire(v_s6b, 'Di', 'Test', 'i6-di@example.com', '0612345605', false, true, repeat('x', 121));
    assert false, 'I6f attendu KLUB_ACCOMPAGNANT';
  exception when raise_exception then assert sqlerrm = 'KLUB_ACCOMPAGNANT', 'I6f ' || sqlerrm;
  end;
  assert not exists (select 1 from public.klub_inscriptions where email = 'i6-di@example.com'), 'I6g inscription créée';
  -- I6h. Un accompagnant donné sans « à deux » est ignoré.
  v_r := public.klub_inscrire(v_s6b, 'Di', 'Test', 'i6-di@example.com', '0612345605', false, false, 'Léa Martin');
  assert (select nb_personnes = 1 and accompagnant is null and montant_centimes = 4000
          from public.klub_inscriptions where id = (v_r->>'inscription_id')::uuid), 'I6h ' || v_r::text;

  -- I7. L'ancienne forme d'appel, six arguments nommés (la route en
  -- production) : fonctionne, une personne.
  delete from public.site_comptes_stripe where user_id = v_hugo;
  v_r := public.klub_inscrire(p_seance => v_s8b, p_prenom => 'Ed', p_nom => 'Test', p_email => 'i7-ed@example.com',
                              p_telephone => '0612345606', p_premiere => true);
  assert v_r->>'statut' = 'confirmee', 'I7a ' || v_r::text;
  assert (select nb_personnes = 1 and accompagnant is null and premiere_seance and montant_centimes is null
          from public.klub_inscriptions where id = (v_r->>'inscription_id')::uuid), 'I7b';
  update public.klub_inscriptions set statut = 'annulee' where seance_id = v_s8b;

  -- I8. Promotion d'un duo en attente, séance payable : paiement, 2 × prix duo
  -- du moment.
  insert into public.site_comptes_stripe (user_id, compte, etat) values (v_hugo, 'acct_test', 'pret');
  v_r := public.klub_inscrire(v_s8, 'Fay', 'Test', 'i8-fay@example.com', '0612345607', false);
  assert v_r->>'statut' = 'paiement', 'I8a ' || v_r::text;
  v_i := (v_r->>'inscription_id')::uuid;
  v_r := public.klub_inscrire(v_s8, 'Gus', 'Test', 'i8-gus@example.com', '0612345608', false, true, 'Léa Martin');
  assert v_r->>'statut' = 'attente', 'I8b ' || v_r::text;
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.klub_admin_prix_duo('seance', v_s8, 3500);
  perform set_config('request.jwt.claims', '', true);
  update public.klub_inscriptions set paiement_expire_at = now() - interval '1 minute' where id = v_i;
  assert public.klub_paiements_expirer() >= 1, 'I8c';
  select * into v_ins from public.klub_inscriptions where seance_id = v_s8 and email = 'i8-gus@example.com';
  assert v_ins.statut = 'paiement' and v_ins.montant_centimes = 7000 and v_ins.nb_personnes = 2,
    'I8d ' || to_jsonb(v_ins)::text;
  assert exists (select 1 from public.klub_mails where inscription_id = v_ins.id and type = 'place_liberee'), 'I8e';
  -- I8f. Le créneau ne propose plus le duo : le duo promu garde le montant
  -- enregistré à son inscription.
  v_r := public.klub_inscrire(v_s8b, 'Hal', 'Test', 'i8-hal@example.com', '0612345609', false);
  assert v_r->>'statut' = 'paiement', 'I8f ' || v_r::text;
  v_i := (v_r->>'inscription_id')::uuid;
  v_r := public.klub_inscrire(v_s8b, 'Ivy', 'Test', 'i8-ivy@example.com', '0612345610', false, true, 'Léa Martin');
  assert v_r->>'statut' = 'attente', 'I8g ' || v_r::text;
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.klub_admin_prix_duo('seance', v_s8b, null);
  perform set_config('request.jwt.claims', '', true);
  perform public.klub_annuler((select jeton from public.klub_inscriptions where id = v_i));
  select * into v_ins from public.klub_inscriptions where seance_id = v_s8b and email = 'i8-ivy@example.com';
  assert v_ins.statut = 'paiement' and v_ins.montant_centimes = 6000, 'I8h ' || to_jsonb(v_ins)::text;

  -- I9. Un bilan se réserve gratuitement, même praticien prêt à encaisser.
  assert not (public.klub_seance(v_bilan)->>'paiement_en_ligne')::boolean, 'I9a';
  v_r := public.klub_inscrire(v_bilan, 'Jo', 'Test', 'i9-jo@example.com', '0612345611', true);
  assert v_r->>'statut' = 'confirmee' and v_r->>'mail_id' is not null, 'I9b ' || v_r::text;
  assert (select montant_centimes is null and nb_personnes = 1 and paiement_expire_at is null
          from public.klub_inscriptions where id = (v_r->>'inscription_id')::uuid), 'I9c';
  assert exists (select 1 from public.klub_mails where id = (v_r->>'mail_id')::uuid and type = 'confirmation'), 'I9d';
  -- I9e. Poser un prix directement en base : refusé par la contrainte.
  begin
    update public.klub_seances set prix_centimes = 1000 where id = v_bilan;
    assert false, 'I9e attendu une violation';
  exception when check_violation then null;
  end;
end $$;

-- I7 (suite) : l'appel de la route, avec la clé de service.
do $$
declare
  v_s uuid;
begin
  insert into public.klub_seances (debut, duree_min, type, titre, capacite, prix_libelle, inscription_requise)
  values (now() + interval '4 days', 60, 'individuel', 'Test I7 service', 1, '', true) returning id into v_s;
  perform set_config('klub.test_i7', v_s::text, true);
end $$;
set local role service_role;
do $$
declare
  v_r jsonb;
begin
  v_r := public.klub_inscrire(p_seance => current_setting('klub.test_i7')::uuid, p_prenom => 'Kim', p_nom => 'Test',
                              p_email => 'i7-kim@example.com', p_telephone => '0612345612', p_premiere => false);
  assert v_r->>'statut' = 'confirmee', 'I7c ' || v_r::text;
end $$;
reset role;

-- I10 : droits des fonctions et anciennes signatures.
do $$
begin
  assert not has_function_privilege('anon', 'public.klub_admin_prix_duo(text,uuid,integer)', 'execute')
     and has_function_privilege('authenticated', 'public.klub_admin_prix_duo(text,uuid,integer)', 'execute'), 'I10a';
  assert not has_function_privilege('anon', 'public.klub_inscrire(uuid,text,text,text,text,boolean,boolean,text)', 'execute')
     and not has_function_privilege('authenticated', 'public.klub_inscrire(uuid,text,text,text,text,boolean,boolean,text)', 'execute')
     and has_function_privilege('service_role', 'public.klub_inscrire(uuid,text,text,text,text,boolean,boolean,text)', 'execute'), 'I10b';
  assert not has_function_privilege('anon', 'public.klub__inscrire(uuid,text,text,text,text,boolean,text,text,boolean,text)', 'execute')
     and not has_function_privilege('authenticated', 'public.klub__inscrire(uuid,text,text,text,text,boolean,text,text,boolean,text)', 'execute')
     and not has_function_privilege('service_role', 'public.klub__inscrire(uuid,text,text,text,text,boolean,text,text,boolean,text)', 'execute'), 'I10c';
  assert (select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
          where n.nspname = 'public' and p.proname in ('klub_inscrire', 'klub__inscrire')) = 2, 'I10d ancienne signature';
end $$;

-- I11 : le praticien et le prix d'un créneau descendent sur ses séances à
-- venir, publiées, non modifiées et du même type ; jamais sur une séance
-- passée, annulée ou modifiée. Les inscriptions gardent montant et compte.
do $$
declare
  v_lucas uuid; v_hugo uuid;
  v_demain date := (now() at time zone 'Europe/Paris')::date + 1;
  v_r jsonb;
  v_c uuid;
  v_passee uuid; v_modifiee uuid; v_annulee uuid; v_autre uuid;
  v_gen1 uuid; v_gen2 uuid;
  v_i uuid;
  v_n integer;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  assert v_lucas is not null and v_hugo is not null, 'I11 comptes absents';
  delete from public.site_super_admins where user_id = v_hugo;
  delete from public.site_comptes_stripe where user_id = v_hugo;

  -- Un créneau individuel de Hugo, actif : il génère ses séances sans
  -- praticien ni prix (klub_admin_sauver_creneau n'écrit ni l'un ni l'autre).
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  v_r := public.klub_admin_sauver_creneau(jsonb_build_object(
    'jour', extract(isodow from v_demain)::int, 'heure', '06:30', 'duree_min', 60, 'type', 'individuel',
    'titre', 'Test I11', 'capacite', 1, 'prix_libelle', '', 'inscription_requise', true, 'actif', true));
  reset role;
  v_c := (v_r->>'id')::uuid;
  select count(*) into v_n from public.klub_seances where creneau_id = v_c;
  assert v_n = 4, 'I11a ' || v_n;
  assert not exists (select 1 from public.klub_seances where creneau_id = v_c
                     and (praticien_id is not null or prix_centimes is not null or prix_duo_centimes is not null)), 'I11b';
  select id into v_gen1 from public.klub_seances where creneau_id = v_c order by debut limit 1;
  select id into v_gen2 from public.klub_seances where creneau_id = v_c order by debut offset 1 limit 1;

  -- Séances du même créneau qui ne doivent rien recevoir : passée, modifiée,
  -- annulée, et une d'un autre type (créneau dont le type a changé).
  insert into public.klub_seances (creneau_id, debut, duree_min, type, titre, capacite, prix_libelle, inscription_requise)
  values (v_c, now() - interval '2 days', 60, 'individuel', 'Test I11 passée', 1, '', true) returning id into v_passee;
  insert into public.klub_seances (creneau_id, debut, duree_min, type, titre, capacite, prix_libelle, inscription_requise, modifiee)
  values (v_c, now() + interval '30 days', 60, 'individuel', 'Test I11 modifiée', 1, '', true, true) returning id into v_modifiee;
  insert into public.klub_seances (creneau_id, debut, duree_min, type, titre, capacite, prix_libelle, inscription_requise, statut)
  values (v_c, now() + interval '31 days', 60, 'individuel', 'Test I11 annulée', 1, '', true, 'annulee') returning id into v_annulee;
  insert into public.klub_seances (creneau_id, debut, duree_min, type, titre, capacite, prix_libelle, inscription_requise)
  values (v_c, now() + interval '32 days', 45, 'small', 'Test I11 autre type', 6, '', true) returning id into v_autre;

  -- Une inscription déjà enregistrée, avec un montant et un compte.
  v_r := public.klub_inscrire(v_gen1, 'Ana', 'Test', 'i11-ana@example.com', '0612345620', false);
  assert v_r->>'statut' = 'confirmee', 'I11c ' || v_r::text;
  v_i := (v_r->>'inscription_id')::uuid;
  update public.klub_inscriptions set montant_centimes = 1234, stripe_compte = 'acct_avant' where id = v_i;

  -- I11d. En Hugo : rattachement, prix et prix duo posés sur le créneau.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  perform public.klub_admin_encaissement('creneau', v_c, v_hugo, 4000);
  perform public.klub_admin_prix_duo('creneau', v_c, 3000);
  reset role;
  assert (select count(*) from public.klub_seances where creneau_id = v_c
          and praticien_id = v_hugo and prix_centimes = 4000 and prix_duo_centimes = 3000) = 4, 'I11d';
  assert not exists (select 1 from public.klub_seances where id in (v_passee, v_modifiee, v_annulee, v_autre)
                     and (praticien_id is not null or prix_centimes is not null or prix_duo_centimes is not null)), 'I11e';
  -- I11f. L'inscription garde son montant et son compte.
  assert (select montant_centimes = 1234 and stripe_compte = 'acct_avant' and statut = 'confirmee'
          from public.klub_inscriptions where id = v_i), 'I11f';

  -- I11g. Le trou est fermé : une séance générée se réserve à deux, en ligne.
  assert (public.klub_seance(v_gen2)->>'prix_duo_centimes')::int = 3000, 'I11g ' || public.klub_seance(v_gen2)::text;
  insert into public.site_comptes_stripe (user_id, compte, etat) values (v_hugo, 'acct_test', 'pret');
  v_r := public.klub_inscrire(v_gen2, 'Bob', 'Test', 'i11-bob@example.com', '0612345621', false, true, 'Léa Martin');
  assert v_r->>'statut' = 'paiement', 'I11h ' || v_r::text;
  assert (select montant_centimes = 6000 from public.klub_inscriptions where id = (v_r->>'inscription_id')::uuid), 'I11i';

  -- I11j. Retirer le duo et changer le prix sur le créneau : descend aussi ;
  -- les montants déjà enregistrés ne bougent pas.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  perform public.klub_admin_prix_duo('creneau', v_c, null);
  perform public.klub_admin_encaissement('creneau', v_c, v_hugo, 4500);
  reset role;
  assert (select count(*) from public.klub_seances where creneau_id = v_c
          and praticien_id = v_hugo and prix_centimes = 4500 and prix_duo_centimes is null) = 4, 'I11j';
  assert (select montant_centimes = 6000 and stripe_compte is null
          from public.klub_inscriptions where id = (v_r->>'inscription_id')::uuid), 'I11k';
  assert (select montant_centimes = 1234 and stripe_compte = 'acct_avant' from public.klub_inscriptions where id = v_i), 'I11l';
  assert not exists (select 1 from public.klub_seances where id in (v_passee, v_modifiee, v_annulee, v_autre)
                     and (praticien_id is not null or prix_centimes is not null or prix_duo_centimes is not null)), 'I11m';
  perform set_config('request.jwt.claims', '', true);
end $$;

-- I12 : un duo est payant ou n'est pas proposé ; une réservation à 0 € ne
-- passe pas en paiement.
do $$
declare
  v_hugo uuid;
  v_s uuid;
  v_c uuid;
  v_r jsonb;
  v_k text;
begin
  select u.id into v_hugo from auth.users u where u.email = 'hugo.daminato@gmail.com';
  delete from public.site_super_admins where user_id = v_hugo;
  delete from public.site_comptes_stripe where user_id = v_hugo;
  insert into public.site_comptes_stripe (user_id, compte, etat) values (v_hugo, 'acct_test', 'pret');

  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  v_s := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '5 days', 'duree_min', 60, 'type', 'individuel', 'titre', 'Test I12',
    'capacite', 1, 'prix_libelle', '', 'inscription_requise', true));
  perform public.klub_admin_encaissement('seance', v_s, v_hugo, 4000);
  v_r := public.klub_admin_sauver_creneau(jsonb_build_object(
    'jour', 2, 'heure', '06:30', 'duree_min', 60, 'type', 'individuel', 'titre', 'Test I12 créneau',
    'capacite', 1, 'prix_libelle', '', 'inscription_requise', true, 'actif', false));
  v_c := (v_r->>'id')::uuid;
  perform public.klub_admin_encaissement('creneau', v_c, v_hugo, 4000);
  -- I12a. Prix duo à 0 € : KLUB_PRIX, sur une séance comme sur un créneau.
  begin
    perform public.klub_admin_prix_duo('seance', v_s, 0);
    assert false, 'I12a attendu KLUB_PRIX';
  exception when raise_exception then assert sqlerrm = 'KLUB_PRIX', 'I12a ' || sqlerrm;
  end;
  begin
    perform public.klub_admin_prix_duo('creneau', v_c, 0);
    assert false, 'I12b attendu KLUB_PRIX';
  exception when raise_exception then assert sqlerrm = 'KLUB_PRIX', 'I12b ' || sqlerrm;
  end;
  -- I12c. Le prix de la séance à 0 € (posable, comme aujourd'hui).
  perform public.klub_admin_encaissement('seance', v_s, v_hugo, 0);
  reset role;

  -- I12d. Et en base, directement : la contrainte refuse 0.
  begin
    update public.klub_seances set prix_duo_centimes = 0 where id = v_s;
    assert false, 'I12d attendu une violation';
  exception when check_violation then
    get stacked diagnostics v_k = constraint_name;
    assert v_k = 'klub_seances_prix_duo_positif', 'I12d ' || v_k;
  end;
  begin
    update public.klub_creneaux set prix_duo_centimes = 0 where id = v_c;
    assert false, 'I12e attendu une violation';
  exception when check_violation then
    get stacked diagnostics v_k = constraint_name;
    assert v_k = 'klub_creneaux_prix_duo_positif', 'I12e ' || v_k;
  end;

  -- I12f. Séance à 0 €, praticien prêt à encaisser : confirmée sur place.
  v_r := public.klub_inscrire(v_s, 'Ana', 'Test', 'i12-ana@example.com', '0612345622', false);
  assert v_r->>'statut' = 'confirmee' and v_r->>'mail_id' is not null, 'I12f ' || v_r::text;
  assert (select montant_centimes is null and paiement_expire_at is null
          from public.klub_inscriptions where id = (v_r->>'inscription_id')::uuid), 'I12g';
  perform set_config('request.jwt.claims', '', true);
end $$;

-- I12h. Les deux contraintes sont posées et validées.
do $$
begin
  assert (select count(*) from pg_constraint
          where conname in ('klub_seances_prix_duo_positif', 'klub_creneaux_prix_duo_positif') and convalidated) = 2, 'I12h';
end $$;

rollback;

-- I13 : la garde de klub__inscrire, pour un duo dont le montant serait nul.
-- La contrainte interdisant désormais un prix duo à 0, on la retire le temps
-- de cette transaction, gardée courte (elle verrouille klub_seances).
begin;
alter table public.klub_seances drop constraint klub_seances_prix_duo_positif;
do $$
declare
  v_hugo uuid;
  v_s uuid; v_s2 uuid;
  v_r jsonb;
begin
  select u.id into v_hugo from auth.users u where u.email = 'hugo.daminato@gmail.com';
  delete from public.site_comptes_stripe where user_id = v_hugo;
  insert into public.site_comptes_stripe (user_id, compte, etat) values (v_hugo, 'acct_test', 'pret');
  insert into public.klub_seances (debut, duree_min, type, titre, capacite, prix_libelle, inscription_requise,
                                   praticien_id, prix_centimes, prix_duo_centimes)
  values (now() + interval '5 days', 60, 'individuel', 'Test I13', 1, '', true, v_hugo, 4000, 0) returning id into v_s;
  insert into public.klub_seances (debut, duree_min, type, titre, capacite, prix_libelle, inscription_requise,
                                   praticien_id, prix_centimes, prix_duo_centimes)
  values (now() + interval '5 days', 60, 'individuel', 'Test I13 seul', 1, '', true, v_hugo, 4000, 0) returning id into v_s2;
  -- I13a. À deux, montant nul : confirmée sur place, jamais en paiement.
  v_r := public.klub_inscrire(v_s, 'Ana', 'Test', 'i13-ana@example.com', '0612345623', false, true, 'Léa Martin');
  assert v_r->>'statut' = 'confirmee' and v_r->>'mail_id' is not null, 'I13a ' || v_r::text;
  assert (select paiement_expire_at is null and montant_centimes = 0 and nb_personnes = 2
          from public.klub_inscriptions where id = (v_r->>'inscription_id')::uuid), 'I13b';
  -- I13c. Seul, sur la même configuration : paiement à 40 €.
  v_r := public.klub_inscrire(v_s2, 'Bob', 'Test', 'i13-bob@example.com', '0612345624', false);
  assert v_r->>'statut' = 'paiement', 'I13c ' || v_r::text;
end $$;
rollback;
select 'klub individuel : scénarios OK' as resultat;
