-- Méthodes de réservation du Mugi Klub. Tout se passe dans une transaction
-- annulée : rien n'est écrit. Lancer avec l'outil MCP execute_sql
-- (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « réservation : scénarios OK ».

begin;

do $$
declare
  v_lucas uuid;
  v_hugo uuid;
  v_creneau uuid;
  v_seance uuid;
  v_heritee uuid;
  v_json jsonb;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  assert v_lucas is not null and v_hugo is not null, 'R0 comptes absents';

  -- Un créneau et une séance de travail, en entrée libre.
  insert into public.klub_creneaux (jour, heure, duree_min, type, titre, inscription_requise, capacite)
  values (2, '08:00', 60, 'small', 'Essai réservation', false, null) returning id into v_creneau;
  insert into public.klub_seances (debut, duree_min, type, titre, inscription_requise, capacite)
  values (now() + interval '7 days', 60, 'small', 'Essai réservation', false, null) returning id into v_seance;

  -- R1. Une URL qui n'est pas en https est refusée par la contrainte.
  begin
    update public.klub_seances set reservation_url = 'http://exemple.fr' where id = v_seance;
    assert false, 'R1 une URL http est acceptée';
  exception when check_violation then null;
  end;

  -- R2. Un lien sur une séance qui garde son formulaire est refusé.
  begin
    update public.klub_seances
       set inscription_requise = true, reservation_url = 'https://chat.whatsapp.com/abc'
     where id = v_seance;
    assert false, 'R2 un lien coexiste avec le formulaire';
  exception when check_violation then null;
  end;

  -- R3. La fonction pose le lien sur une séance.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.klub_admin_reservation('seance', v_seance, 'https://chat.whatsapp.com/abc', 'S''inscrire sur WhatsApp');
  assert (select reservation_url from public.klub_seances where id = v_seance) = 'https://chat.whatsapp.com/abc', 'R3a';
  assert (select reservation_libelle from public.klub_seances where id = v_seance) = 'S''inscrire sur WhatsApp', 'R3b';

  -- R4. Elle le retire, et le libellé part avec.
  perform public.klub_admin_reservation('seance', v_seance, null, 'Resté seul');
  assert (select reservation_url from public.klub_seances where id = v_seance) is null, 'R4a';
  assert (select reservation_libelle from public.klub_seances where id = v_seance) is null, 'R4b';

  -- R5. Elle refuse une URL qui n'est pas en https, avec un code lisible.
  begin
    perform public.klub_admin_reservation('seance', v_seance, 'javascript:alert(1)', null);
    assert false, 'R5 une URL javascript est acceptée';
  exception when raise_exception then assert sqlerrm = 'KLUB_URL', 'R5 ' || sqlerrm;
  end;

  -- R6. Elle refuse une cible inconnue.
  begin
    perform public.klub_admin_reservation('atelier', v_seance, 'https://exemple.fr', null);
    assert false, 'R6 une cible inconnue est acceptée';
  exception when raise_exception then assert sqlerrm = 'KLUB_CIBLE', 'R6 ' || sqlerrm;
  end;

  -- R7. Elle refuse de poser un lien sur une séance qui garde son formulaire.
  update public.klub_seances set inscription_requise = true, capacite = 8 where id = v_seance;
  begin
    perform public.klub_admin_reservation('seance', v_seance, 'https://exemple.fr', null);
    assert false, 'R7 un lien posé sur une séance à formulaire';
  exception when raise_exception then assert sqlerrm = 'KLUB_RESERVATION_REQUISE', 'R7 ' || sqlerrm;
  end;
  update public.klub_seances set inscription_requise = false, capacite = null where id = v_seance;

  -- R8. Le créneau transmet ses deux colonnes à la séance qu'il engendre.
  perform public.klub_admin_reservation('creneau', v_creneau, 'https://chat.whatsapp.com/xyz', 'Rejoindre le groupe');
  insert into public.klub_seances (creneau_id, debut, duree_min, type, titre, inscription_requise, capacite)
  values (v_creneau, now() + interval '14 days', 60, 'small', 'Essai réservation', false, null)
  returning id into v_heritee;
  assert (select reservation_url from public.klub_seances where id = v_heritee) = 'https://chat.whatsapp.com/xyz', 'R8a';
  assert (select reservation_libelle from public.klub_seances where id = v_heritee) = 'Rejoindre le groupe', 'R8b';

  -- R9. Une séance à formulaire n'hérite pas : la contrainte l'interdirait,
  -- et faire échouer la génération entière serait pire.
  insert into public.klub_seances (creneau_id, debut, duree_min, type, titre, inscription_requise, capacite)
  values (v_creneau, now() + interval '21 days', 60, 'small', 'Essai réservation', true, 8)
  returning id into v_heritee;
  assert (select reservation_url from public.klub_seances where id = v_heritee) is null, 'R9';

  -- R10. Le JSON public porte le lien, et aucune place restante.
  v_json := public.klub__seance_publique((select s from public.klub_seances s where s.id = v_seance));
  perform public.klub_admin_reservation('seance', v_seance, 'https://chat.whatsapp.com/abc', null);
  v_json := public.klub__seance_publique((select s from public.klub_seances s where s.id = v_seance));
  assert v_json->>'reservation_url' = 'https://chat.whatsapp.com/abc', 'R10a ' || v_json::text;
  assert v_json->>'reservation_libelle' is null, 'R10b';
  assert v_json->'places_restantes' = 'null'::jsonb, 'R10c ' || v_json::text;

  -- R11. Un praticien ordinaire peut poser un lien : l'écran du Klub est
  -- ouvert à toute l'équipe, comme le tarif.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  perform public.klub_admin_reservation('seance', v_seance, 'https://chat.whatsapp.com/def', null);
  assert (select reservation_url from public.klub_seances where id = v_seance) = 'https://chat.whatsapp.com/def', 'R11';

  perform set_config('request.jwt.claims', '', true);
end $$;

-- BLOC DROITS ANON
set local role anon;
do $$
begin
  begin
    perform public.klub_admin_reservation('seance', gen_random_uuid(), 'https://exemple.fr', null);
    assert false, 'P1 anon pose un lien de réservation';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

rollback;
select 'réservation : scénarios OK' as resultat;
