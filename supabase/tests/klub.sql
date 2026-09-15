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
