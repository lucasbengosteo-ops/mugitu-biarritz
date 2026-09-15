-- Scénarios du Mugi Klub. Tout se passe dans une transaction annulée à la
-- fin : rien n'est écrit en base. Les adresses @example.com ne sont jamais
-- envoyées (lib/klub/regles-envoi.ts).
-- Lancer avec l'outil MCP execute_sql (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « klub : scénarios OK ».

begin;

-- BLOC VISITEUR
do $$
declare
  v_s uuid;
  v_r jsonb;
  v_jeton text;
begin
  -- V1. Capacité 1 : le premier est confirmé, le deuxième en attente au rang 1.
  insert into public.klub_seances (debut, duree_min, type, titre, capacite, prix_libelle, inscription_requise)
  values (now() + interval '3 days', 45, 'small', 'Test V', 1, '15 €', true) returning id into v_s;
  v_r := public.klub_inscrire(v_s, 'Ana', 'Test', 'ANA@example.com', '06 12 34 56 78', true);
  assert v_r->>'statut' = 'confirmee', 'V1a ' || v_r;
  assert v_r->>'mail_id' is not null, 'V1b mail de confirmation absent';
  v_r := public.klub_inscrire(v_s, 'Bob', 'Test', 'bob@example.com', '0612345679', false);
  assert v_r->>'statut' = 'attente' and (v_r->>'rang')::int = 1, 'V1c ' || v_r;

  -- V2. Même adresse : réponse identique, pas de doublon, pas de nouveau mail avant 10 minutes.
  v_r := public.klub_inscrire(v_s, 'Ana', 'Test', 'ana@example.com', '0612345678', true);
  assert v_r->>'statut' = 'confirmee' and v_r->>'mail_id' is null, 'V2a ' || v_r;
  assert (select count(*) from public.klub_inscriptions where seance_id = v_s) = 2, 'V2b doublon';

  -- V3. Annulation à plus de 2 h : Bob est promu et prévenu.
  select jeton into v_jeton from public.klub_inscriptions where seance_id = v_s and email = 'ana@example.com';
  v_r := public.klub_annuler(v_jeton);
  assert v_r->>'resultat' = 'annulee', 'V3a ' || v_r;
  assert (select statut from public.klub_inscriptions where seance_id = v_s and email = 'bob@example.com') = 'confirmee', 'V3b';
  assert exists (select 1 from public.klub_mails where seance_id = v_s and type = 'promotion'), 'V3c';
  assert exists (select 1 from public.klub_mails where seance_id = v_s and type = 'annulation'), 'V3d';

  -- V4. Le même lien une seconde fois.
  assert public.klub_annuler(v_jeton)->>'resultat' = 'deja', 'V4';

  -- V5. Réinscription après annulation : nouvelle ligne, en attente.
  v_r := public.klub_inscrire(v_s, 'Ana', 'Test', 'ana@example.com', '0612345678', false);
  assert v_r->>'statut' = 'attente', 'V5 ' || v_r;

  -- V6. À moins de 2 h : pas de promotion, la place va au prochain visiteur.
  update public.klub_seances set debut = now() + interval '90 minutes' where id = v_s;
  select jeton into v_jeton from public.klub_inscriptions where seance_id = v_s and email = 'bob@example.com';
  perform public.klub_annuler(v_jeton);
  assert (select statut from public.klub_inscriptions
          where seance_id = v_s and email = 'ana@example.com' and statut <> 'annulee') = 'attente', 'V6a';
  v_r := public.klub_inscrire(v_s, 'Cy', 'Test', 'cy@example.com', '0612345670', false);
  assert v_r->>'statut' = 'confirmee', 'V6b ' || v_r;

  -- V7. Séance commencée : inscription refusée, annulation refusée.
  update public.klub_seances set debut = now() - interval '1 minute' where id = v_s;
  begin
    perform public.klub_inscrire(v_s, 'Di', 'Test', 'di@example.com', '0612345671', false);
    assert false, 'V7a attendu KLUB_COMMENCEE';
  exception when raise_exception then
    assert sqlerrm = 'KLUB_COMMENCEE', 'V7a ' || sqlerrm;
  end;
  select jeton into v_jeton from public.klub_inscriptions where seance_id = v_s and email = 'cy@example.com';
  assert public.klub_annuler(v_jeton)->>'resultat' = 'passee', 'V7b';

  -- V8. Validation des coordonnées.
  update public.klub_seances set debut = now() + interval '3 days' where id = v_s;
  begin
    perform public.klub_inscrire(v_s, 'Di', 'Test', 'di@', '0612345671', false);
    assert false, 'V8a attendu KLUB_EMAIL';
  exception when raise_exception then assert sqlerrm = 'KLUB_EMAIL', 'V8a ' || sqlerrm;
  end;
  begin
    perform public.klub_inscrire(v_s, 'Di', 'Test', 'di@example.com', '0612', false);
    assert false, 'V8b attendu KLUB_TELEPHONE';
  exception when raise_exception then assert sqlerrm = 'KLUB_TELEPHONE', 'V8b ' || sqlerrm;
  end;
  begin
    perform public.klub_inscrire(v_s, ' ', 'Test', 'di@example.com', '0612345671', false);
    assert false, 'V8c attendu KLUB_NOM';
  exception when raise_exception then assert sqlerrm = 'KLUB_NOM', 'V8c ' || sqlerrm;
  end;

  -- V8d. Tabulation et espaces insécables tolérés, comme côté client.
  v_r := public.klub_inscrire(v_s, 'Dee', 'Test', E'dee@example.com\t', replace('06_12_34_56_78', '_', chr(160)), false);
  assert v_r->>'statut' in ('confirmee', 'attente'), 'V8d ' || v_r;
  assert exists (select 1 from public.klub_inscriptions
                 where seance_id = v_s and email = 'dee@example.com' and telephone = '0612345678'), 'V8d stockage';

  -- V9. Entrée libre et séance annulée.
  update public.klub_seances set inscription_requise = false, capacite = null where id = v_s;
  begin
    perform public.klub_inscrire(v_s, 'Di', 'Test', 'di@example.com', '0612345671', false);
    assert false, 'V9a attendu KLUB_LIBRE';
  exception when raise_exception then assert sqlerrm = 'KLUB_LIBRE', 'V9a ' || sqlerrm;
  end;
  update public.klub_seances set inscription_requise = true, capacite = 5, statut = 'annulee' where id = v_s;
  begin
    perform public.klub_inscrire(v_s, 'Di', 'Test', 'di@example.com', '0612345671', false);
    assert false, 'V9b attendu KLUB_SEANCE';
  exception when raise_exception then assert sqlerrm = 'KLUB_SEANCE', 'V9b ' || sqlerrm;
  end;

  -- V10. La page d'annulation ne reçoit ni e-mail ni téléphone.
  select jeton into v_jeton from public.klub_inscriptions where seance_id = v_s and email = 'cy@example.com';
  v_r := public.klub_annulation_infos(v_jeton);
  assert v_r->>'prenom' = 'Cy', 'V10a ' || v_r;
  assert v_r::text !~ '(example\.com|0612345670|email|telephone)', 'V10b ' || v_r;

  -- V11. Jeton inconnu.
  assert public.klub_annuler(repeat('0', 64))->>'resultat' = 'inconnu', 'V11';
end $$;
-- FIN BLOC VISITEUR

-- BLOC ADMIN ET TÂCHE
do $$
declare
  v_c uuid;
  v_s uuid;
  v_r jsonb;
  v_n integer;
  v_ids uuid[];
  v_praticien uuid;
  v_demain date := (now() at time zone 'Europe/Paris')::date + 1;
  v_modele jsonb;
begin
  select user_id into v_praticien from public.user_roles limit 1;
  assert v_praticien is not null, 'A0 aucun praticien dans user_roles';
  perform set_config('request.jwt.claims', json_build_object('sub', v_praticien, 'role', 'authenticated')::text, true);

  v_modele := jsonb_build_object(
    'jour', extract(isodow from v_demain)::int, 'heure', '10:00', 'duree_min', 45, 'type', 'small',
    'titre', 'Test A', 'capacite', 2, 'prix_libelle', '15 €', 'inscription_requise', true, 'actif', true);

  -- A1. Un créneau le jour de demain à 10 h donne 4 séances, une seule fois.
  v_r := public.klub_admin_sauver_creneau(v_modele);
  v_c := (v_r->>'id')::uuid;
  assert (select count(*) from public.klub_seances where creneau_id = v_c) = 4, 'A1a';
  perform public.klub__generer();
  assert (select count(*) from public.klub_seances where creneau_id = v_c) = 4, 'A1b doublons';

  -- A2. Propagation : la séance qui a un inscrit garde son titre.
  select id into v_s from public.klub_seances where creneau_id = v_c order by debut limit 1;
  perform public.klub_inscrire(v_s, 'Eve', 'Test', 'eve@example.com', '0612345672', false);
  v_r := public.klub_admin_sauver_creneau(v_modele || jsonb_build_object('id', v_c, 'titre', 'Test A2'));
  assert (v_r->>'conservees')::int = 1, 'A2a ' || v_r;
  assert (select titre from public.klub_seances where id = v_s) = 'Test A', 'A2b';
  assert (select count(*) from public.klub_seances where creneau_id = v_c and titre = 'Test A2') = 3, 'A2c';

  -- A3. Pause : seule la séance avec inscrit reste.
  perform public.klub_admin_sauver_creneau(v_modele || jsonb_build_object('id', v_c, 'actif', false));
  assert (select count(*) from public.klub_seances where creneau_id = v_c) = 1, 'A3';

  -- A4. Capacité : jamais sous les confirmés ; une hausse promeut la liste d'attente.
  perform public.klub_inscrire(v_s, 'Fred', 'Test', 'fred@example.com', '0612345673', false);
  perform public.klub_inscrire(v_s, 'Gus', 'Test', 'gus@example.com', '0612345674', false);
  begin
    perform public.klub_admin_modifier_seance(v_s,
      (select to_jsonb(s) from public.klub_seances s where id = v_s) || jsonb_build_object('capacite', 1));
    assert false, 'A4a attendu KLUB_CAPACITE';
  exception when raise_exception then assert sqlerrm = 'KLUB_CAPACITE', 'A4a ' || sqlerrm;
  end;
  v_r := public.klub_admin_modifier_seance(v_s,
    (select to_jsonb(s) from public.klub_seances s where id = v_s) || jsonb_build_object('capacite', 3));
  assert (select statut from public.klub_inscriptions where seance_id = v_s and email = 'gus@example.com') = 'confirmee', 'A4b';
  assert (v_r->>'prevenus')::int = 0, 'A4c la capacité seule ne prévient personne';
  assert (select modifiee from public.klub_seances where id = v_s), 'A4d';

  -- A5. Changement d'heure : les trois inscrits sont prévenus.
  v_r := public.klub_admin_modifier_seance(v_s,
    (select to_jsonb(s) || jsonb_build_object('debut', s.debut + interval '1 hour') from public.klub_seances s where id = v_s));
  assert (v_r->>'prevenus')::int = 3, 'A5 ' || v_r;

  -- A6. Ajout manuel sur séance complète : attente par défaut, dépassement sur demande.
  v_r := public.klub_admin_ajouter(v_s, 'Hal', 'Test', 'hal@example.com', '0612345675', false, 'attente');
  assert v_r->>'statut' = 'attente', 'A6a ' || v_r;
  v_r := public.klub_admin_ajouter(v_s, 'Ivy', 'Test', 'ivy@example.com', '0612345676', true, 'forcer');
  assert v_r->>'statut' = 'confirmee', 'A6b ' || v_r;
  assert (select origine from public.klub_inscriptions where seance_id = v_s and email = 'ivy@example.com') = 'admin', 'A6c';

  -- A7. Présence.
  perform public.klub_admin_presence((select id from public.klub_inscriptions where seance_id = v_s and email = 'ivy@example.com'), true);
  assert (select present from public.klub_inscriptions where seance_id = v_s and email = 'ivy@example.com'), 'A7';

  -- A8. Annulation par l'admin d'une inscription, puis de la séance.
  v_r := public.klub_admin_annuler_inscription((select id from public.klub_inscriptions where seance_id = v_s and email = 'ivy@example.com'));
  assert v_r->>'resultat' = 'annulee', 'A8a ' || v_r;
  v_n := public.klub_admin_annuler_seance(v_s);
  assert v_n = 4, 'A8b ' || v_n;
  assert (select count(*) from public.klub_mails where seance_id = v_s and type = 'seance_annulee') = 4, 'A8c';
  assert (select statut from public.klub_seances where id = v_s) = 'annulee', 'A8d';

  -- A9. Tâche : rappel et liste intervenant, une seule fois chacun.
  insert into public.klub_seances (debut, duree_min, type, titre, intervenant, intervenant_email, capacite, prix_libelle, inscription_requise)
  values (now() + interval '90 minutes', 45, 'small', 'Test tâche', 'Hugo', 'hugo@example.com', 5, '15 €', true)
  returning id into v_s;
  perform public.klub_inscrire(v_s, 'Jo', 'Test', 'jo@example.com', '0612345677', false);
  update public.klub_inscriptions set created_at = now() - interval '2 days' where seance_id = v_s;
  perform public.klub_tache();
  assert (select count(*) from public.klub_mails where seance_id = v_s and type = 'rappel') = 1, 'A9a rappel';
  assert (select count(*) from public.klub_mails where seance_id = v_s and type = 'liste_intervenant') = 1, 'A9b liste';
  perform public.klub_tache();
  assert (select count(*) from public.klub_mails where seance_id = v_s and type in ('rappel', 'liste_intervenant')) = 2, 'A9c doublons';

  -- A10. Un mail n'est réservé qu'une fois.
  select array_agg(id) into v_ids from public.klub_mails where seance_id = v_s;
  assert coalesce(array_length(public.klub_reserver_mails(v_ids[1], 1), 1), 0) = 1, 'A10a';
  assert coalesce(array_length(public.klub_reserver_mails(v_ids[1], 1), 1), 0) = 0, 'A10b';

  -- A11. Relance d'un mail en erreur.
  update public.klub_mails set statut = 'erreur', tentatives = 4 where id = v_ids[1];
  perform public.klub_admin_relancer_mail(v_ids[1]);
  assert (select statut = 'a_envoyer' and tentatives = 0 from public.klub_mails where id = v_ids[1]), 'A11';

  -- A12. Purge des séances de plus de 12 mois.
  insert into public.klub_seances (debut, duree_min, type, titre, capacite, prix_libelle, inscription_requise)
  values (now() - interval '13 months', 45, 'small', 'Test purge', 5, '', true) returning id into v_s;
  perform public.klub_tache();
  assert not exists (select 1 from public.klub_seances where id = v_s), 'A12';

  -- A13. Séance ponctuelle créée depuis l'admin.
  v_s := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '10 days', 'duree_min', 90, 'type', 'atelier', 'titre', 'Test atelier',
    'capacite', 12, 'prix_libelle', '20 €', 'inscription_requise', true));
  assert (select creneau_id is null and capacite = 12 from public.klub_seances where id = v_s), 'A13a';
  begin
    perform public.klub_admin_creer_seance(jsonb_build_object('debut', now() + interval '10 days', 'duree_min', 90, 'type', 'atelier', 'titre', ''));
    assert false, 'A13b attendu KLUB_CHAMP';
  exception when raise_exception then assert sqlerrm = 'KLUB_CHAMP', 'A13b ' || sqlerrm;
  end;

  -- A14. Sans compte praticien, les fonctions admin refusent.
  perform set_config('request.jwt.claims', '', true);
  begin
    perform public.klub_admin_presence(gen_random_uuid(), true);
    assert false, 'A14 attendu KLUB_DROITS';
  exception when raise_exception then assert sqlerrm = 'KLUB_DROITS', 'A14 ' || sqlerrm;
  end;
end $$;
-- FIN BLOC ADMIN ET TÂCHE

-- BLOC DROITS
set local role anon;
do $$
begin
  assert (select count(*) from public.klub_inscriptions) = 0, 'P1 anon lit les inscriptions';
  assert (select count(*) from public.klub_mails) = 0, 'P2 anon lit les mails';
  begin
    perform public.klub_inscrire(gen_random_uuid(), 'a', 'b', 'c@example.com', '0612345678', false);
    assert false, 'P3 anon peut appeler klub_inscrire';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.klub_tache();
    assert false, 'P4 anon peut appeler klub_tache';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.klub_annuler(repeat('a', 64));
    assert false, 'P5 anon peut appeler klub_annuler';
  exception when insufficient_privilege then null;
  end;
  assert public.klub_planning(now() - interval '1 day', now() + interval '30 days')::text !~ '(example\.com|email|telephone|jeton)',
    'P6 donnée personnelle dans le planning';
end $$;
reset role;
-- FIN BLOC DROITS

-- BLOC SERVICE_ROLE
-- Les aides `klub__*` sont retirées à service_role : la clé de service doit
-- garder son parcours complet par les seules fonctions publiques.
do $$
declare
  v_s uuid;
begin
  insert into public.klub_seances (debut, duree_min, type, titre, capacite, prix_libelle, inscription_requise)
  values (now() + interval '4 days', 45, 'small', 'Test S', 3, '15 €', true) returning id into v_s;
  perform set_config('klub.test_seance', v_s::text, true);
end $$;

set local role service_role;
do $$
declare
  v_r jsonb;
begin
  v_r := public.klub_inscrire(current_setting('klub.test_seance')::uuid,
                              'Eve', 'Test', 'eve@example.com', '0612345672', false);
  assert v_r->>'statut' = 'confirmee', 'S1 ' || v_r;
end $$;
reset role;

-- Le jeton n'est lisible que hors service_role : on le relit ici.
do $$
begin
  perform set_config('klub.test_jeton',
    (select jeton from public.klub_inscriptions
     where seance_id = current_setting('klub.test_seance')::uuid and email = 'eve@example.com'), true);
end $$;

set local role service_role;
do $$
begin
  assert public.klub_annuler(current_setting('klub.test_jeton'))->>'resultat' = 'annulee', 'S2';
end $$;
reset role;
-- FIN BLOC SERVICE_ROLE

rollback;
select 'klub : scénarios OK' as resultat;
