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

rollback;
select 'klub paiement : scénarios OK' as resultat;
