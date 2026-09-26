-- Récapitulatif quotidien. Tout se passe dans une transaction annulée :
-- rien n'est écrit. Lancer avec l'outil MCP execute_sql
-- (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « notifications : scénarios OK ».

begin;

do $$
declare
  v_lucas uuid; v_hugo uuid; v_kine uuid;
  v_n int; v_avant int; v_bilan jsonb; v_slug text := 'test-recap-' || gen_random_uuid()::text;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  select u.id into v_kine  from auth.users u where u.email = 'jbc.kine@gmail.com';
  assert v_lucas is not null and v_hugo is not null and v_kine is not null, 'N0 comptes absents';

  -- On repart d'une table vide : les vrais événements du cabinet ne doivent
  -- pas décider du résultat de ces scénarios.
  delete from public.site_evenements;
  -- Même chose pour les réglages : un gérant qui a vraiment coupé son
  -- récapitulatif fausserait le compte de N7 (arrivé le 26 sept. 2026).
  delete from public.site_reglages_mail;

  -- N1. Publier un article pose un événement.
  insert into public.articles (slug, title, category, chapo, cover, author, date, status, sections, auteur_id)
  values (v_slug, 'Test récap', 'Pathologies', '', '/x.jpg', '{}'::jsonb, current_date, 'brouillon', '[]'::jsonb, v_hugo);
  assert (select count(*) from public.site_evenements where quoi = 'article_publie') = 0, 'N1a un brouillon a été annoncé';
  update public.articles set status = 'publie' where slug = v_slug;
  assert (select count(*) from public.site_evenements where quoi = 'article_publie') = 1, 'N1b';

  -- N2. Le réenregistrer ne l'annonce pas une seconde fois.
  update public.articles set title = 'Test récap corrigé' where slug = v_slug;
  assert (select count(*) from public.site_evenements where quoi = 'article_publie') = 1, 'N2 publié deux fois';

  -- N3. Le passer en relecture pose l'autre événement.
  update public.articles set status = 'relecture' where slug = v_slug;
  assert (select count(*) from public.site_evenements where quoi = 'article_a_relire') = 1, 'N3';

  -- N4. Un vœu posé compte ; la décision sur ce vœu ne compte pas.
  select count(*) into v_avant from public.site_evenements where quoi = 'voeu_pose';
  insert into public.agenda_voeux (user_id, salle, jour, moment) values (v_hugo, 'ura', 6, 'aprem');
  assert (select count(*) from public.site_evenements where quoi = 'voeu_pose') = v_avant + 1, 'N4a';
  select count(*) into v_n from public.site_evenements;
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.agenda_decider(
    (select id from public.agenda_voeux where user_id = v_hugo and salle = 'ura' and jour = 6 and moment = 'aprem'),
    'valide', null);
  assert (select count(*) from public.site_evenements) = v_n, 'N4b une décision a été annoncée';
  perform set_config('request.jwt.claims', '', true);

  -- N5. Une absence déclarée compte.
  select count(*) into v_avant from public.site_evenements where quoi = 'absence_declaree';
  insert into public.agenda_absences (user_id, du, au) values (v_hugo, current_date + 30, current_date + 40);
  assert (select count(*) from public.site_evenements where quoi = 'absence_declaree') = v_avant + 1, 'N5';

  -- N6. Une séance créée compte, une séance annulée aussi.
  select count(*) into v_avant from public.site_evenements where quoi = 'seance_creee';
  insert into public.klub_seances (debut, duree_min, type, titre, inscription_requise, capacite)
  values (now() + interval '40 days', 60, 'small', 'Test récap', true, 5);
  assert (select count(*) from public.site_evenements where quoi = 'seance_creee') = v_avant + 1, 'N6a';
  update public.klub_seances set statut = 'annulee' where titre = 'Test récap';
  assert (select count(*) from public.site_evenements where quoi = 'seance_annulee') = 1, 'N6b';

  -- N7. La composition met un mail par gérant, avec le texte groupé.
  delete from public.agenda_mails where type = 'recap';
  v_bilan := public.site_recap_du_jour();
  assert (v_bilan->>'mails')::int = 2, 'N7a ' || v_bilan::text;
  assert (select corps from public.agenda_mails where type = 'recap' limit 1) like '%Articles à relire%', 'N7b';
  assert (select corps from public.agenda_mails where type = 'recap' limit 1) like '%Séances créées%', 'N7c';

  -- N8. Un gérant qui coupe ne reçoit plus rien.
  insert into public.site_reglages_mail (user_id, recap) values (v_lucas, false);
  delete from public.agenda_mails where type = 'recap';
  v_bilan := public.site_recap_du_jour();
  assert (v_bilan->>'mails')::int = 1, 'N8 ' || v_bilan::text;

  -- N9. Sans événement, aucun mail. C'est la règle qui compte le plus.
  delete from public.site_evenements;
  delete from public.agenda_mails where type = 'recap';
  v_bilan := public.site_recap_du_jour();
  assert (v_bilan->>'mails')::int = 0 and (v_bilan->>'evenements')::int = 0, 'N9 ' || v_bilan::text;
  assert not exists (select 1 from public.agenda_mails where type = 'recap'), 'N9b un mail vide a été posé';
end $$;

-- BLOC DROITS
do $$
declare
  v_hugo uuid; v_kine uuid;
begin
  select u.id into v_hugo from auth.users u where u.email = 'hugo.daminato@gmail.com';
  select u.id into v_kine from auth.users u where u.email = 'jbc.kine@gmail.com';

  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;

  -- D1. On ne lit pas les événements depuis le navigateur.
  begin
    perform count(*) from public.site_evenements;
    assert false, 'D1 un praticien lit site_evenements';
  exception when insufficient_privilege then null;
  end;

  -- D2. On ne compose pas le récapitulatif soi-même.
  begin
    perform public.site_recap_du_jour();
    assert false, 'D2 un praticien compose le récapitulatif';
  exception when insufficient_privilege then null;
  end;

  -- D3. Chacun écrit son propre réglage.
  insert into public.site_reglages_mail (user_id, recap) values (v_hugo, false);
  assert (select recap from public.site_reglages_mail where user_id = v_hugo) = false, 'D3';

  -- D4. Et pas celui d'un autre.
  begin
    insert into public.site_reglages_mail (user_id, recap) values (v_kine, false);
    assert false, 'D4 un praticien écrit le réglage d''un autre';
  exception when insufficient_privilege then null;
  end;

  -- D5. Il ne lit pas celui d'un autre non plus.
  assert not exists (select 1 from public.site_reglages_mail where user_id = v_kine), 'D5';

  reset role;
  perform set_config('request.jwt.claims', '', true);
end $$;

set local role anon;
do $$
begin
  begin
    perform count(*) from public.site_reglages_mail;
    assert false, 'P1 anon lit les réglages';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

rollback;
select 'notifications : scénarios OK' as resultat;
