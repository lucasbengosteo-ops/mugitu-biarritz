-- Scénarios du paiement en ligne du Klub. Transaction annulée : rien n'est
-- écrit en base. Lancer avec l'outil MCP execute_sql (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « klub paiement : scénarios OK ».

begin;

-- SECTION A : le socle — praticien, prix, comptes Stripe.
do $$
declare
  v_lucas uuid; v_hugo uuid;
  v_s uuid;
  v_praticien uuid;
  v_prix integer;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  assert v_lucas is not null and v_hugo is not null, 'A0 comptes absents';
  delete from public.site_super_admins where user_id = v_hugo;

  -- A1. En Lucas (gérant) : créer une séance, puis la rattacher à Hugo à 15 €.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  set local role authenticated;
  v_s := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '5 days', 'duree_min', 45, 'type', 'small', 'titre', 'Test encaissement',
    'capacite', 3, 'prix_libelle', '15 €', 'inscription_requise', true));
  perform public.klub_admin_encaissement('seance', v_s, v_hugo, 1500);
  reset role;
  select praticien_id, prix_centimes into v_praticien, v_prix from public.klub_seances where id = v_s;
  assert v_praticien = v_hugo and v_prix = 1500, 'A1';

  -- A2. En Hugo (praticien rattaché) : changer le prix de sa propre séance : passe.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  perform public.klub_admin_encaissement('seance', v_s, v_hugo, 2000);
  reset role;
  assert (select prix_centimes from public.klub_seances where id = v_s) = 2000, 'A2';

  -- A3. En Hugo : rattacher la séance à Lucas lève KLUB_ENCAISSEMENT.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  begin
    perform public.klub_admin_encaissement('seance', v_s, v_lucas, 2000);
    assert false, 'A3 attendu KLUB_ENCAISSEMENT';
  exception when raise_exception then assert sqlerrm = 'KLUB_ENCAISSEMENT', 'A3 ' || sqlerrm;
  end;
  reset role;

  -- A4. En Lucas : rattacher la séance à Lucas ; puis en Hugo, changer le
  -- prix d'une séance qui n'est plus la sienne lève KLUB_ENCAISSEMENT.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  set local role authenticated;
  perform public.klub_admin_encaissement('seance', v_s, v_lucas, 2000);
  reset role;
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  begin
    perform public.klub_admin_encaissement('seance', v_s, v_lucas, 2500);
    assert false, 'A4 attendu KLUB_ENCAISSEMENT';
  exception when raise_exception then assert sqlerrm = 'KLUB_ENCAISSEMENT', 'A4 ' || sqlerrm;
  end;
  reset role;

  -- A5. klub__paiement_en_ligne vaut faux tant qu'aucun compte n'existe ;
  -- vrai une fois le compte du praticien (Lucas, rattaché à la séance) prêt ;
  -- faux de nouveau si l'état repasse en vérification.
  assert not (select public.klub__paiement_en_ligne(s) from public.klub_seances s where id = v_s), 'A5a';
  insert into public.site_comptes_stripe (user_id, compte, etat) values (v_lucas, 'acct_test', 'pret');
  assert (select public.klub__paiement_en_ligne(s) from public.klub_seances s where id = v_s), 'A5b';
  update public.site_comptes_stripe set etat = 'verification' where user_id = v_lucas;
  assert not (select public.klub__paiement_en_ligne(s) from public.klub_seances s where id = v_s), 'A5c';
  update public.site_comptes_stripe set etat = 'pret' where user_id = v_lucas;

  -- A6. Une séance générée depuis un créneau qui porte praticien et prix
  -- hérite des deux (trigger before insert, hors fonction publique).
  declare
    v_c uuid;
    v_s2 uuid;
  begin
    insert into public.klub_creneaux (jour, heure, duree_min, type, titre, capacite, prix_libelle,
                                       inscription_requise, actif, praticien_id, prix_centimes)
    values (1, '18:00', 45, 'small', 'Test créneau', 3, '15 €', true, true, v_hugo, 1500)
    returning id into v_c;
    insert into public.klub_seances (creneau_id, debut, duree_min, type, titre, capacite, prix_libelle, inscription_requise)
    values (v_c, now() + interval '6 days', 45, 'small', 'Test héritée', 3, '15 €', true)
    returning id into v_s2;
    select praticien_id, prix_centimes into v_praticien, v_prix from public.klub_seances where id = v_s2;
    assert v_praticien = v_hugo and v_prix = 1500, 'A6';
  end;

  -- A7. anon ne lit rien dans site_comptes_stripe ; Hugo ne voit pas la
  -- ligne de Lucas.
  perform set_config('klub.test_s_a7', v_s::text, true);
end $$;

-- Aucun grant pour anon (revoke all) : l'accès est refusé avant même la
-- politique RLS, pas un simple « aucune ligne visible ».
set local role anon;
do $$
begin
  begin
    perform count(*) from public.site_comptes_stripe;
    assert false, 'A7a anon lit site_comptes_stripe';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

do $$
declare v_hugo uuid;
begin
  select u.id into v_hugo from auth.users u where u.email = 'hugo.daminato@gmail.com';
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
end $$;
set local role authenticated;
do $$
begin
  assert (select count(*) from public.site_comptes_stripe) = 0, 'A7b Hugo voit la ligne de Lucas';
end $$;
reset role;

-- SECTION B : l'inscription payante — place tenue, confirmation, expiration,
-- liste d'attente qui paie.
do $$
declare
  v_lucas uuid; v_hugo uuid;
  v_s uuid; v_s6 uuid; v_s7 uuid;
  v_r jsonb;
  v_i1 uuid; v_i2 uuid; v_i3 uuid;
  v_jeton3 text;
  v_expire timestamptz;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  assert v_lucas is not null and v_hugo is not null, 'B0 comptes absents';
  delete from public.site_super_admins where user_id = v_hugo;
  delete from public.site_comptes_stripe where user_id = v_hugo;
  insert into public.site_comptes_stripe (user_id, compte, etat) values (v_lucas, 'acct_test', 'pret')
  on conflict (user_id) do update set compte = excluded.compte, etat = excluded.etat;

  -- Séance payante : capacité 2, 15 €, rattachée à Lucas (compte prêt).
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  v_s := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '5 days', 'duree_min', 45, 'type', 'small', 'titre', 'Test payante',
    'capacite', 2, 'prix_libelle', '', 'inscription_requise', true));
  perform public.klub_admin_encaissement('seance', v_s, v_lucas, 1500);
  perform set_config('request.jwt.claims', '', true);
  assert (public.klub_seance(v_s)->>'paiement_en_ligne')::boolean, 'B0 séance non payable';

  -- B1. Inscription depuis le site : place tenue en `paiement`, 35 min,
  -- montant figé, aucun mail ; la place compte.
  v_r := public.klub_inscrire(v_s, 'Ana', 'Test', 'ana@example.com', '0612345678', false);
  assert v_r->>'statut' = 'paiement' and v_r->>'inscription_id' is not null and v_r->>'mail_id' is null, 'B1a ' || v_r;
  v_i1 := (v_r->>'inscription_id')::uuid;
  assert (select paiement_expire_at = now() + interval '35 minutes' and montant_centimes = 1500
          from public.klub_inscriptions where id = v_i1), 'B1b';
  assert not exists (select 1 from public.klub_mails where inscription_id = v_i1), 'B1c mail en file';
  assert (public.klub_seance(v_s)->>'places_restantes')::int = 1, 'B1d ' || public.klub_seance(v_s);

  -- B1e. Même adresse, de nouveau : même inscription, toujours en paiement,
  -- sans mail ; une réservation plus longue n'est pas raccourcie.
  update public.klub_inscriptions set paiement_expire_at = now() + interval '3 hours' where id = v_i1;
  v_r := public.klub_inscrire(v_s, 'Ana', 'Test', 'ana@example.com', '0612345678', false);
  assert v_r->>'statut' = 'paiement' and (v_r->>'inscription_id')::uuid = v_i1, 'B1e ' || v_r;
  assert (select paiement_expire_at from public.klub_inscriptions where id = v_i1) = now() + interval '3 hours', 'B1f';
  update public.klub_inscriptions set paiement_expire_at = now() + interval '1 minute' where id = v_i1;
  perform public.klub_inscrire(v_s, 'Ana', 'Test', 'ana@example.com', '0612345678', false);
  assert (select paiement_expire_at from public.klub_inscriptions where id = v_i1) = now() + interval '35 minutes', 'B1g';
  assert not exists (select 1 from public.klub_mails where inscription_id = v_i1), 'B1h mail en file';
  assert (select count(*) from public.klub_inscriptions where seance_id = v_s) = 1, 'B1i doublon';

  -- B2. Une 2e adresse : paiement ; une 3e : liste d'attente.
  v_r := public.klub_inscrire(v_s, 'Bob', 'Test', 'bob@example.com', '0612345679', false);
  assert v_r->>'statut' = 'paiement', 'B2a ' || v_r;
  v_i2 := (v_r->>'inscription_id')::uuid;
  v_r := public.klub_inscrire(v_s, 'Cy', 'Test', 'cy@example.com', '0612345670', false);
  assert v_r->>'statut' = 'attente' and (v_r->>'rang')::int = 1 and v_r->>'mail_id' is not null, 'B2b ' || v_r;
  v_i3 := (v_r->>'inscription_id')::uuid;
  select jeton into v_jeton3 from public.klub_inscriptions where id = v_i3;
  assert (public.klub_seance(v_s)->>'places_restantes')::int = 0, 'B2c';

  -- B3. Session enregistrée, paiement notifié : confirmée, un mail de
  -- confirmation. Une seconde notification : 'deja', toujours un seul mail.
  perform public.klub_paiement_session(v_i1, 'acct_test', 'cs_test_b3', 'https://checkout.stripe.com/c/pay/cs_test_b3');
  assert (select stripe_session = 'cs_test_b3' from public.klub_inscriptions where id = v_i1), 'B3a';
  assert public.klub_paiement_confirme('cs_test_b3', 'pi_test_b3', 1500) = 'confirmee', 'B3b';
  assert (select statut = 'confirmee' and paiement_expire_at is null and stripe_paiement = 'pi_test_b3' and paye_at is not null
          from public.klub_inscriptions where id = v_i1), 'B3c';
  assert (select count(*) from public.klub_mails where inscription_id = v_i1 and type = 'confirmation') = 1, 'B3d';
  assert public.klub_paiement_confirme('cs_test_b3', 'pi_test_b3', 1500) = 'deja', 'B3e';
  assert (select count(*) from public.klub_mails where inscription_id = v_i1 and type = 'confirmation') = 1, 'B3f';
  assert public.klub_paiement_confirme('cs_test_inconnue', 'pi_x', 1500) = 'inconnu', 'B3g';

  -- B4. La réservation de Bob expire : annulée ; Cy, en attente, passe en
  -- paiement avec un mail `place_liberee` et une garde de 6 h.
  update public.klub_inscriptions set paiement_expire_at = now() - interval '1 minute' where id = v_i2;
  assert public.klub_paiements_expirer() >= 1, 'B4a';
  assert (select statut from public.klub_inscriptions where id = v_i2) = 'annulee', 'B4b';
  assert (select statut = 'paiement' and montant_centimes = 1500
                 and paiement_expire_at between now() + interval '5 hours 59 minutes' and now() + interval '6 hours 1 minute'
          from public.klub_inscriptions where id = v_i3), 'B4c';
  assert exists (select 1 from public.klub_mails where inscription_id = v_i3 and type = 'place_liberee'), 'B4d';
  assert not exists (select 1 from public.klub_mails where inscription_id = v_i3 and type = 'promotion'), 'B4e';
  assert (public.klub_seance(v_s)->>'places_restantes')::int = 0, 'B4f';

  -- B5. De quoi créer une session : depuis le jeton du mail, ou l'identifiant.
  -- Rien pour une inscription confirmée.
  v_r := public.klub_paiement_infos(null, v_jeton3);
  assert v_r->>'compte' = 'acct_test' and (v_r->>'montant_centimes')::int = 1500
         and (v_r->>'inscription_id')::uuid = v_i3, 'B5a ' || coalesce(v_r::text, 'null');
  assert public.klub_paiement_infos(v_i3, null)->>'compte' = 'acct_test', 'B5b';
  assert public.klub_paiement_infos(v_i1, null) is null, 'B5c';

  -- B6. Même séance, praticien sans compte prêt (Hugo) : fonctionnement
  -- d'avant. Confirmée d'office avec un mail, liste d'attente, promotion
  -- classique à l'annulation.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  v_s6 := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '5 days', 'duree_min', 45, 'type', 'small', 'titre', 'Test sur place',
    'capacite', 1, 'prix_libelle', '', 'inscription_requise', true));
  perform public.klub_admin_encaissement('seance', v_s6, v_hugo, 1500);
  perform set_config('request.jwt.claims', '', true);
  assert not (public.klub_seance(v_s6)->>'paiement_en_ligne')::boolean, 'B6a';
  v_r := public.klub_inscrire(v_s6, 'Ana', 'Test', 'ana@example.com', '0612345678', false);
  assert v_r->>'statut' = 'confirmee' and v_r->>'mail_id' is not null, 'B6b ' || v_r;
  assert exists (select 1 from public.klub_mails where id = (v_r->>'mail_id')::uuid and type = 'confirmation'), 'B6c';
  assert (select paiement_expire_at is null and montant_centimes is null from public.klub_inscriptions
          where id = (v_r->>'inscription_id')::uuid), 'B6d';
  v_r := public.klub_inscrire(v_s6, 'Bob', 'Test', 'bob@example.com', '0612345679', false);
  assert v_r->>'statut' = 'attente', 'B6e ' || v_r;
  perform public.klub_annuler((select jeton from public.klub_inscriptions where seance_id = v_s6 and email = 'ana@example.com'));
  assert (select statut from public.klub_inscriptions where seance_id = v_s6 and email = 'bob@example.com') = 'confirmee', 'B6f';
  assert exists (select 1 from public.klub_mails m join public.klub_inscriptions i on i.id = m.inscription_id
                 where i.seance_id = v_s6 and i.email = 'bob@example.com' and m.type = 'promotion'), 'B6g';
  assert not exists (select 1 from public.klub_inscriptions where seance_id = v_s6 and statut = 'paiement'), 'B6h';

  -- B7. Depuis l'admin, sur une séance payante : confirmée d'office, paiement
  -- sur place.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  v_s7 := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '5 days', 'duree_min', 45, 'type', 'small', 'titre', 'Test admin',
    'capacite', 2, 'prix_libelle', '', 'inscription_requise', true));
  perform public.klub_admin_encaissement('seance', v_s7, v_lucas, 1500);
  assert (public.klub_seance(v_s7)->>'paiement_en_ligne')::boolean, 'B7a';
  v_r := public.klub_admin_ajouter(v_s7, 'Di', 'Test', 'di@example.com', '0612345671', false, 'attente');
  perform set_config('request.jwt.claims', '', true);
  assert v_r->>'statut' = 'confirmee', 'B7b ' || v_r;
  assert (select paiement_expire_at is null and montant_centimes is null from public.klub_inscriptions
          where id = (v_r->>'inscription_id')::uuid), 'B7c';

  -- B8. Une place en paiement libérée par son lien d'annulation fait avancer
  -- la liste d'attente (en paiement, séance payable).
  perform public.klub_inscrire(v_s7, 'Ed', 'Test', 'ed@example.com', '0612345672', false);
  v_r := public.klub_inscrire(v_s7, 'Flo', 'Test', 'flo@example.com', '0612345673', false);
  assert v_r->>'statut' = 'attente', 'B8a ' || v_r;
  assert public.klub_annuler((select jeton from public.klub_inscriptions where seance_id = v_s7 and email = 'ed@example.com'))
         ->>'resultat' = 'annulee', 'B8b';
  assert (select statut from public.klub_inscriptions where seance_id = v_s7 and email = 'flo@example.com') = 'paiement', 'B8c';

  -- B9. La capacité ne descend pas sous les places tenues (confirmée + paiement).
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  begin
    perform public.klub_admin_modifier_seance(v_s7, jsonb_build_object(
      'debut', now() + interval '5 days', 'duree_min', 45, 'type', 'small', 'titre', 'Test admin',
      'capacite', 1, 'prix_libelle', '', 'inscription_requise', true));
    assert false, 'B9 attendu KLUB_CAPACITE';
  exception when raise_exception then assert sqlerrm = 'KLUB_CAPACITE', 'B9 ' || sqlerrm;
  end;

  -- B10. Séance annulée avant le paiement : la personne en paiement est
  -- prévenue ; un paiement qui arrive ensuite n'est pas confirmé ('tardif'),
  -- et aucune session neuve n'est proposée.
  perform public.klub_paiement_session(v_i3, 'acct_test', 'cs_test_b10', 'https://checkout.stripe.com/c/pay/cs_test_b10');
  perform public.klub_admin_annuler_seance(v_s);
  perform set_config('request.jwt.claims', '', true);
  assert exists (select 1 from public.klub_mails where inscription_id = v_i3 and type = 'seance_annulee'), 'B10a';
  assert public.klub_paiement_infos(null, v_jeton3) is null, 'B10b';
  assert public.klub_paiement_confirme('cs_test_b10', 'pi_test_b10', 1500) = 'tardif', 'B10c';
  assert (select statut = 'paiement' and stripe_paiement = 'pi_test_b10' from public.klub_inscriptions where id = v_i3), 'B10d';
  assert not exists (select 1 from public.klub_mails where inscription_id = v_i3 and type = 'confirmation'), 'B10e';
end $$;

rollback;
select 'klub paiement : scénarios OK' as resultat;
