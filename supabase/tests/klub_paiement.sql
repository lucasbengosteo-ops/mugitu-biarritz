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

-- SECTION C : annulations remboursées, par une file.
-- Aide de test (pg_temp, disparaît avec la transaction) : une inscription
-- depuis le site, payée par la notification Stripe.
create function pg_temp.klub_test_payer(p_seance uuid, p_prenom text, p_email text, p_tel text, p_cle text)
returns uuid
language plpgsql
as $$
declare
  v_r jsonb;
  v_i uuid;
begin
  v_r := public.klub_inscrire(p_seance, p_prenom, 'Test', p_email, p_tel, false);
  assert v_r->>'statut' = 'paiement', 'payer ' || p_cle || ' ' || v_r::text;
  v_i := (v_r->>'inscription_id')::uuid;
  perform public.klub_paiement_session(v_i, 'acct_test', 'cs_test_' || p_cle, 'https://checkout.stripe.com/c/pay/cs_test_' || p_cle);
  assert public.klub_paiement_confirme('cs_test_' || p_cle, 'pi_test_' || p_cle, 1500) = 'confirmee', 'payer ' || p_cle;
  return v_i;
end;
$$;

do $$
declare
  v_lucas uuid;
  v_s1 uuid; v_s2 uuid; v_s3 uuid; v_s4 uuid; v_s6 uuid; v_s6b uuid; v_s8 uuid;
  v_r jsonb;
  v_n integer;
  v_i uuid; v_j uuid; v_k uuid; v_l uuid; v_m uuid;
  v_ins public.klub_inscriptions;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  assert v_lucas is not null, 'C0 compte absent';
  insert into public.site_comptes_stripe (user_id, compte, etat) values (v_lucas, 'acct_test', 'pret')
  on conflict (user_id) do update set compte = excluded.compte, etat = excluded.etat;

  -- Séances payantes à 15 €, rattachées à Lucas (compte prêt).
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  v_s1 := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '3 days', 'duree_min', 45, 'type', 'small', 'titre', 'Test C1',
    'capacite', 3, 'prix_libelle', '', 'inscription_requise', true));
  v_s2 := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '10 hours', 'duree_min', 45, 'type', 'small', 'titre', 'Test C2',
    'capacite', 3, 'prix_libelle', '', 'inscription_requise', true));
  v_s3 := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '3 days', 'duree_min', 45, 'type', 'small', 'titre', 'Test C3',
    'capacite', 4, 'prix_libelle', '', 'inscription_requise', true));
  v_s4 := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '3 days', 'duree_min', 45, 'type', 'small', 'titre', 'Test C4',
    'capacite', 4, 'prix_libelle', '', 'inscription_requise', true));
  v_s6 := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '3 days', 'duree_min', 45, 'type', 'small', 'titre', 'Test C6',
    'capacite', 1, 'prix_libelle', '', 'inscription_requise', true));
  v_s6b := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '3 days', 'duree_min', 45, 'type', 'small', 'titre', 'Test C6b',
    'capacite', 1, 'prix_libelle', '', 'inscription_requise', true));
  v_s8 := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '3 days', 'duree_min', 45, 'type', 'small', 'titre', 'Test C8',
    'capacite', 2, 'prix_libelle', '', 'inscription_requise', true));
  perform public.klub_admin_encaissement('seance', x, v_lucas, 1500)
  from unnest(array[v_s1, v_s2, v_s3, v_s4, v_s6, v_s6b, v_s8]) x;
  perform set_config('request.jwt.claims', '', true);

  -- C1. Payée, annulée par son lien à 3 jours : en file, et le JSON le dit.
  -- Une place en `paiement` (pas payée) annulée de même : rien en file.
  v_i := pg_temp.klub_test_payer(v_s1, 'Ana', 'c1-ana@example.com', '0612345601', 'c1');
  v_r := public.klub_annuler((select jeton from public.klub_inscriptions where id = v_i));
  assert v_r->>'resultat' = 'annulee' and (v_r->>'rembourse')::boolean, 'C1a ' || v_r::text;
  assert (select statut = 'annulee' and remboursement = 'a_faire' from public.klub_inscriptions where id = v_i), 'C1b';
  v_r := public.klub_inscrire(v_s1, 'Bob', 'Test', 'c1-bob@example.com', '0612345602', false);
  assert v_r->>'statut' = 'paiement', 'C1c ' || v_r::text;
  v_j := (v_r->>'inscription_id')::uuid;
  v_r := public.klub_annuler((select jeton from public.klub_inscriptions where id = v_j));
  assert v_r->>'resultat' = 'annulee' and not (v_r->>'rembourse')::boolean, 'C1d ' || v_r::text;
  assert (select remboursement is null from public.klub_inscriptions where id = v_j), 'C1e';
  -- Une seconde annulation ne change rien.
  assert public.klub_annuler((select jeton from public.klub_inscriptions where id = v_i))->>'resultat' = 'deja', 'C1f';
  assert (select remboursement = 'a_faire' from public.klub_inscriptions where id = v_i), 'C1g';

  -- C2. La même chose à 10 h du début : la séance est due.
  v_i := pg_temp.klub_test_payer(v_s2, 'Ana', 'c2-ana@example.com', '0612345603', 'c2');
  v_r := public.klub_annuler((select jeton from public.klub_inscriptions where id = v_i));
  assert v_r->>'resultat' = 'annulee' and not (v_r->>'rembourse')::boolean, 'C2a ' || v_r::text;
  assert (select statut = 'annulee' and remboursement is null from public.klub_inscriptions where id = v_i), 'C2b';

  -- C3. Séance annulée par le praticien : toutes les inscriptions payées en
  -- file, y compris une payée puis annulée sans remboursement ; les non payées
  -- (paiement en cours, attente, inscrite par l'admin) intactes.
  v_i := pg_temp.klub_test_payer(v_s3, 'Ana', 'c3-ana@example.com', '0612345604', 'c3a');
  v_j := pg_temp.klub_test_payer(v_s3, 'Bob', 'c3-bob@example.com', '0612345605', 'c3b');
  v_k := pg_temp.klub_test_payer(v_s3, 'Cy', 'c3-cy@example.com', '0612345606', 'c3c');
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.klub_admin_annuler_inscription(v_k, false);
  assert (select remboursement is null from public.klub_inscriptions where id = v_k), 'C3a';
  v_r := public.klub_inscrire(v_s3, 'Di', 'Test', 'c3-di@example.com', '0612345607', false);
  assert v_r->>'statut' = 'paiement', 'C3b ' || v_r::text;
  v_l := (v_r->>'inscription_id')::uuid;
  v_r := public.klub_admin_ajouter(v_s3, 'Ed', 'Test', 'c3-ed@example.com', '0612345608', false, 'attente');
  assert v_r->>'statut' = 'confirmee', 'C3c ' || v_r::text;
  v_m := (v_r->>'inscription_id')::uuid;
  v_n := public.klub_admin_annuler_seance(v_s3);
  perform set_config('request.jwt.claims', '', true);
  assert v_n = 4, 'C3d ' || v_n;
  assert (select count(*) from public.klub_inscriptions where id in (v_i, v_j, v_k) and remboursement = 'a_faire') = 3, 'C3e';
  assert (select count(*) from public.klub_inscriptions where id in (v_l, v_m) and remboursement is null) = 2, 'C3f';
  assert (select statut from public.klub_inscriptions where id = v_i) = 'confirmee', 'C3g';

  -- C4. Annulation par l'admin : remboursée seulement si elle le choisit.
  -- Sans le paramètre (appel du back-office actuel) : pas de remboursement.
  v_i := pg_temp.klub_test_payer(v_s4, 'Ana', 'c4-ana@example.com', '0612345609', 'c4a');
  v_j := pg_temp.klub_test_payer(v_s4, 'Bob', 'c4-bob@example.com', '0612345610', 'c4b');
  v_k := pg_temp.klub_test_payer(v_s4, 'Cy', 'c4-cy@example.com', '0612345611', 'c4c');
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  v_r := public.klub_admin_annuler_inscription(v_i, p_rembourser => false);
  assert v_r->>'resultat' = 'annulee' and not (v_r->>'rembourse')::boolean, 'C4a ' || v_r::text;
  assert (select remboursement is null from public.klub_inscriptions where id = v_i), 'C4b';
  v_r := public.klub_admin_annuler_inscription(v_j, p_rembourser => true);
  assert v_r->>'resultat' = 'annulee' and (v_r->>'rembourse')::boolean, 'C4c ' || v_r::text;
  assert (select remboursement = 'a_faire' from public.klub_inscriptions where id = v_j), 'C4d';
  v_r := public.klub_admin_annuler_inscription(p_id => v_k);
  assert v_r->>'resultat' = 'annulee' and not (v_r->>'rembourse')::boolean, 'C4e ' || v_r::text;
  assert (select remboursement is null from public.klub_inscriptions where id = v_k), 'C4f';
  -- Déjà annulée : demander le remboursement ensuite ne met rien en file.
  v_r := public.klub_admin_annuler_inscription(v_i, p_rembourser => true);
  assert v_r->>'resultat' = 'deja', 'C4g ' || v_r::text;
  assert (select remboursement is null from public.klub_inscriptions where id = v_i), 'C4h';
  perform set_config('request.jwt.claims', '', true);

  -- C5. Résultat d'une tentative : 'fait' une fois ; cinq échecs -> 'erreur'.
  assert exists (select 1 from public.klub_remboursements_a_faire(50) f
                 where f.inscription_id = v_j and f.compte = 'acct_test' and f.paiement = 'pi_test_c4b'), 'C5a';
  perform public.klub_remboursement_resultat(v_j, 're_test_1', null);
  select * into v_ins from public.klub_inscriptions where id = v_j;
  assert v_ins.remboursement = 'fait' and v_ins.stripe_remboursement = 're_test_1' and v_ins.rembourse_at is not null
         and v_ins.remboursement_erreur is null, 'C5b';
  perform public.klub_remboursement_resultat(v_j, 're_test_2', null);
  perform public.klub_remboursement_resultat(v_j, null, 'erreur tardive');
  select * into v_ins from public.klub_inscriptions where id = v_j;
  assert v_ins.remboursement = 'fait' and v_ins.stripe_remboursement = 're_test_1' and v_ins.remboursement_tentatives = 0
         and v_ins.remboursement_erreur is null, 'C5c';
  assert not exists (select 1 from public.klub_remboursements_a_faire(50) f where f.inscription_id = v_j), 'C5d';
  -- Cinq échecs sur une inscription en file (C3, Ana).
  select id into v_i from public.klub_inscriptions where seance_id = v_s3 and email = 'c3-ana@example.com';
  for v_n in 1..4 loop
    perform public.klub_remboursement_resultat(v_i, null, 'refus ' || v_n);
  end loop;
  select * into v_ins from public.klub_inscriptions where id = v_i;
  assert v_ins.remboursement = 'a_faire' and v_ins.remboursement_tentatives = 4 and v_ins.remboursement_erreur = 'refus 4', 'C5e';
  perform public.klub_remboursement_resultat(v_i, null, repeat('x', 600));
  select * into v_ins from public.klub_inscriptions where id = v_i;
  assert v_ins.remboursement = 'erreur' and v_ins.remboursement_tentatives = 5
         and char_length(v_ins.remboursement_erreur) = 500, 'C5f';
  perform public.klub_remboursement_resultat(v_i, null, 'encore');
  perform public.klub_remboursement_resultat(v_i, 're_test_3', null);
  select * into v_ins from public.klub_inscriptions where id = v_i;
  assert v_ins.remboursement = 'erreur' and v_ins.remboursement_tentatives = 5 and v_ins.stripe_remboursement is null, 'C5g';
  assert not exists (select 1 from public.klub_remboursements_a_faire(50) f where f.inscription_id = v_i), 'C5h';

  -- C6. Paiement tardif : réservation expirée, puis paiement notifié.
  v_r := public.klub_inscrire(v_s6, 'Ana', 'Test', 'c6-ana@example.com', '0612345612', false);
  assert v_r->>'statut' = 'paiement', 'C6a ' || v_r::text;
  v_i := (v_r->>'inscription_id')::uuid;
  perform public.klub_paiement_session(v_i, 'acct_test', 'cs_test_c6', 'https://checkout.stripe.com/c/pay/cs_test_c6');
  update public.klub_inscriptions set paiement_expire_at = now() - interval '1 minute' where id = v_i;
  assert public.klub_paiements_expirer() >= 1, 'C6b';
  assert (select statut from public.klub_inscriptions where id = v_i) = 'annulee', 'C6c';
  assert public.klub_paiement_confirme('cs_test_c6', 'pi_test_c6', 1500) = 'tardif', 'C6d';
  assert (select statut = 'annulee' and stripe_paiement = 'pi_test_c6' and remboursement = 'a_faire'
          from public.klub_inscriptions where id = v_i), 'C6e';
  assert not exists (select 1 from public.klub_mails where inscription_id = v_i and type = 'confirmation'), 'C6f';
  -- Notification reçue de nouveau : 'deja', rien ne bouge.
  assert public.klub_paiement_confirme('cs_test_c6', 'pi_test_c6', 1500) = 'deja', 'C6g';
  -- C6h. Séance annulée pendant le paiement : 'tardif', en file aussi.
  v_r := public.klub_inscrire(v_s6b, 'Bob', 'Test', 'c6-bob@example.com', '0612345613', false);
  v_j := (v_r->>'inscription_id')::uuid;
  perform public.klub_paiement_session(v_j, 'acct_test', 'cs_test_c6b', 'https://checkout.stripe.com/c/pay/cs_test_c6b');
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.klub_admin_annuler_seance(v_s6b);
  perform set_config('request.jwt.claims', '', true);
  assert (select remboursement is null from public.klub_inscriptions where id = v_j), 'C6h pas encore payée';
  assert public.klub_paiement_confirme('cs_test_c6b', 'pi_test_c6b', 1500) = 'tardif', 'C6i';
  assert (select statut = 'paiement' and remboursement = 'a_faire' from public.klub_inscriptions where id = v_j), 'C6j';

  -- C7. Remboursement constaté par la notification charge.refunded, deux fois.
  v_i := pg_temp.klub_test_payer(v_s1, 'Cy', 'c7-cy@example.com', '0612345614', 'c7');
  perform public.klub_paiement_rembourse('pi_test_c7', 're_test_c7');
  perform public.klub_paiement_rembourse('pi_test_c7', 're_test_c7_bis');
  select * into v_ins from public.klub_inscriptions where id = v_i;
  assert v_ins.remboursement = 'fait' and v_ins.stripe_remboursement = 're_test_c7' and v_ins.rembourse_at is not null
         and v_ins.statut = 'confirmee', 'C7a';
  -- Annulée ensuite à plus de 24 h : rien de plus en file, le JSON dit remboursé.
  v_r := public.klub_annuler(v_ins.jeton);
  assert v_r->>'resultat' = 'annulee' and (v_r->>'rembourse')::boolean, 'C7b ' || v_r::text;
  assert (select remboursement = 'fait' from public.klub_inscriptions where id = v_i), 'C7c';
  -- En file puis remboursé depuis le tableau de bord : 'fait', la tâche ne
  -- retente pas.
  select id into v_k from public.klub_inscriptions where seance_id = v_s3 and email = 'c3-bob@example.com';
  perform public.klub_paiement_rembourse('pi_test_c3b', null);
  perform public.klub_remboursement_resultat(v_k, null, 'charge déjà remboursée');
  select * into v_ins from public.klub_inscriptions where id = v_k;
  assert v_ins.remboursement = 'fait' and v_ins.remboursement_tentatives = 0 and v_ins.stripe_remboursement is null, 'C7d';

  -- C8. La page d'annulation sait, avant confirmation, si l'annulation sera
  -- remboursée : de part et d'autre des 24 h, et jamais sans paiement.
  v_i := pg_temp.klub_test_payer(v_s8, 'Ana', 'c8-ana@example.com', '0612345615', 'c8');
  v_r := public.klub_annulation_infos((select jeton from public.klub_inscriptions where id = v_i));
  assert (v_r->>'paye')::boolean and (v_r->>'rembourse_si_annule')::boolean, 'C8a ' || v_r::text;
  assert v_r::text !~ '(example\.com|email|telephone|stripe|pi_test)', 'C8b ' || v_r::text;
  update public.klub_seances set debut = now() + interval '24 hours 5 minutes' where id = v_s8;
  assert (public.klub_annulation_infos((select jeton from public.klub_inscriptions where id = v_i))->>'rembourse_si_annule')::boolean, 'C8c';
  update public.klub_seances set debut = now() + interval '23 hours 55 minutes' where id = v_s8;
  v_r := public.klub_annulation_infos((select jeton from public.klub_inscriptions where id = v_i));
  assert (v_r->>'paye')::boolean and not (v_r->>'rembourse_si_annule')::boolean, 'C8d ' || v_r::text;
  update public.klub_seances set debut = now() + interval '3 days' where id = v_s8;
  v_r := public.klub_inscrire(v_s8, 'Bob', 'Test', 'c8-bob@example.com', '0612345616', false);
  v_r := public.klub_annulation_infos((select jeton from public.klub_inscriptions where id = (v_r->>'inscription_id')::uuid));
  assert not (v_r->>'paye')::boolean and not (v_r->>'rembourse_si_annule')::boolean, 'C8e ' || v_r::text;

  -- C9. Droits : la file et les comptes Stripe au serveur seul ; l'aide
  -- interne à personne ; l'annulation admin aux comptes connectés.
  assert not has_function_privilege('anon', 'public.klub_remboursements_a_faire(integer)', 'execute')
     and not has_function_privilege('authenticated', 'public.klub_remboursements_a_faire(integer)', 'execute')
     and has_function_privilege('service_role', 'public.klub_remboursements_a_faire(integer)', 'execute'), 'C9a';
  assert not has_function_privilege('authenticated', 'public.klub_remboursement_resultat(uuid,text,text)', 'execute')
     and has_function_privilege('service_role', 'public.klub_remboursement_resultat(uuid,text,text)', 'execute'), 'C9b';
  assert not has_function_privilege('authenticated', 'public.klub_paiement_rembourse(text,text)', 'execute')
     and has_function_privilege('service_role', 'public.klub_paiement_rembourse(text,text)', 'execute'), 'C9c';
  assert not has_function_privilege('authenticated', 'public.site_compte_stripe_enregistrer(uuid,text,text)', 'execute')
     and not has_function_privilege('anon', 'public.site_compte_stripe_etat(text,text)', 'execute')
     and has_function_privilege('service_role', 'public.site_compte_stripe_etat(text,text)', 'execute'), 'C9d';
  assert not has_function_privilege('anon', 'public.klub__a_rembourser(uuid)', 'execute')
     and not has_function_privilege('authenticated', 'public.klub__a_rembourser(uuid)', 'execute')
     and not has_function_privilege('service_role', 'public.klub__a_rembourser(uuid)', 'execute'), 'C9e';
  assert has_function_privilege('authenticated', 'public.klub_admin_annuler_inscription(uuid,boolean)', 'execute')
     and not has_function_privilege('anon', 'public.klub_admin_annuler_inscription(uuid,boolean)', 'execute')
     and not has_function_privilege('service_role', 'public.klub_admin_annuler_inscription(uuid,boolean)', 'execute'), 'C9f';
  assert not exists (select 1 from pg_proc where proname = 'klub_admin_annuler_inscription' and pronargs = 1), 'C9g';
end $$;

rollback;
select 'klub paiement : scénarios OK' as resultat;
