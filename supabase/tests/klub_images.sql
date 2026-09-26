-- Images du Mugi Klub. Tout se passe dans une transaction annulée : rien
-- n'est écrit. Lancer avec l'outil MCP execute_sql
-- (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « images : scénarios OK ».

begin;

do $$
declare
  v_lucas uuid;
  v_creneau uuid;
  v_seance uuid;
  v_heritee uuid;
  v_json jsonb;
  v_img constant text := 'https://nuehdfyscqnkckudkqhe.supabase.co/storage/v1/object/public/site-medias/klub/essai.webp';
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  assert v_lucas is not null, 'I0 compte absent';

  -- Chaque bloc pose son identité au début plutôt que d'hériter de celle
  -- d'un bloc précédent.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);

  insert into public.klub_creneaux (jour, heure, duree_min, type, titre, inscription_requise, capacite)
  values (3, '18:00', 60, 'atelier', 'Essai image', true, 8) returning id into v_creneau;
  insert into public.klub_seances (debut, duree_min, type, titre, inscription_requise, capacite)
  values (now() + interval '9 days', 60, 'atelier', 'Essai image', true, 8) returning id into v_seance;

  -- I1. Une adresse qui n'est pas en https est refusée par la contrainte.
  begin
    update public.klub_seances set image = 'http://exemple.fr/a.jpg' where id = v_seance;
    assert false, 'I1 une image http est acceptée';
  exception when check_violation then null;
  end;

  -- I2. La fonction pose une image et son point focal.
  perform public.klub_admin_image('seance', v_seance, v_img, '50% 20%');
  assert (select image from public.klub_seances where id = v_seance) = v_img, 'I2a';
  assert (select image_focus from public.klub_seances where id = v_seance) = '50% 20%', 'I2b';

  -- I3. Un point focal vide revient au centre.
  perform public.klub_admin_image('seance', v_seance, v_img, '');
  assert (select image_focus from public.klub_seances where id = v_seance) = '50% 50%', 'I3';

  -- I4. Elle retire l'image.
  perform public.klub_admin_image('seance', v_seance, null, null);
  assert (select image from public.klub_seances where id = v_seance) is null, 'I4';

  -- I5. Elle refuse une adresse qui n'est pas en https, avec un code lisible.
  begin
    perform public.klub_admin_image('seance', v_seance, 'javascript:alert(1)', null);
    assert false, 'I5 une adresse javascript est acceptée';
  exception when raise_exception then assert sqlerrm = 'KLUB_URL', 'I5 ' || sqlerrm;
  end;

  -- I6. Une cible inexistante est refusée.
  begin
    perform public.klub_admin_image('seance', gen_random_uuid(), v_img, null);
    assert false, 'I6 une séance inexistante est acceptée';
  exception when raise_exception then assert sqlerrm = 'KLUB_CIBLE', 'I6 ' || sqlerrm;
  end;

  -- I7. Le créneau transmet son image et son point focal à la séance qu'il engendre.
  perform public.klub_admin_image('creneau', v_creneau, v_img, '30% 40%');
  insert into public.klub_seances (creneau_id, debut, duree_min, type, titre, inscription_requise, capacite)
  values (v_creneau, now() + interval '16 days', 60, 'atelier', 'Essai image', true, 8)
  returning id into v_heritee;
  assert (select image from public.klub_seances where id = v_heritee) = v_img, 'I7a';
  assert (select image_focus from public.klub_seances where id = v_heritee) = '30% 40%', 'I7b';

  -- I8. Une séance qui arrive avec sa propre image ne l'écrase pas.
  insert into public.klub_seances (creneau_id, debut, duree_min, type, titre, inscription_requise, capacite, image)
  values (v_creneau, now() + interval '23 days', 60, 'atelier', 'Essai image', true, 8,
          'https://exemple.fr/propre.jpg')
  returning id into v_heritee;
  assert (select image from public.klub_seances where id = v_heritee) = 'https://exemple.fr/propre.jpg', 'I8';

  -- I9. L'héritage du lien de réservation n'est pas dérangé.
  assert (select count(*) from pg_trigger where tgname = 'klub_seances_heriter_reservation') = 1, 'I9';

  -- I10. Le JSON public porte les deux clés.
  perform public.klub_admin_image('seance', v_seance, v_img, '50% 20%');
  v_json := public.klub__seance_publique((select s from public.klub_seances s where s.id = v_seance));
  assert v_json->>'image' = v_img, 'I10a ' || v_json::text;
  assert v_json->>'image_focus' = '50% 20%', 'I10b';

  perform set_config('request.jwt.claims', '', true);
end $$;

set local role anon;
do $$
begin
  begin
    perform public.klub_admin_image('seance', gen_random_uuid(), 'https://exemple.fr/a.jpg', null);
    assert false, 'P1 anon pose une image';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

rollback;
select 'images : scénarios OK' as resultat;
