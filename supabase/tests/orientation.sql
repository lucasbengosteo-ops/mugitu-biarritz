-- Droits des tables de mesure de « Par où commencer ? ». Tout se passe dans
-- une transaction annulée : rien n'est écrit. Lancer avec l'outil MCP
-- execute_sql (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « orientation : scénarios OK ».
--
-- Comptes de test : `public.site_est_super_admin()` reconnaît un compte
-- inscrit dans `site_super_admins` (lucas.bengosteo@gmail.com et
-- jbc.kine@gmail.com, posés par la migration 20260923120000_site_droits.sql,
-- « Les deux gérants »). Pour un membre de l'équipe qui n'est *pas*
-- super-admin, on reprend le compte de Jean-Baptiste (déjà équipe par
-- `user_roles`) et on retire, dans la transaction annulée, sa ligne de
-- `site_super_admins` — exactement le procédé de `supabase/tests/admin.sql`
-- (bloc « ÉQUIPE ET SUPER-ADMIN », D2).

begin;

do $$
declare
  v_lucas uuid;
  v_kine uuid;
  v_id_o1 uuid;
  v_id_o2 uuid;
  v_id_o3 uuid;
  v_id_vieux uuid;
  v_id_recent uuid;
  v_ok boolean;
  v_menage jsonb;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_kine from auth.users u where u.email = 'jbc.kine@gmail.com';
  assert v_lucas is not null and v_kine is not null, 'O0 comptes de référence absents';
  delete from public.site_super_admins where user_id = v_kine;

  set local role service_role;

  -- O1. Un parcours consenti enregistre son texte.
  v_id_o1 := public.orientation_enregistrer(
    '{"motif":"douleur","zone":"genou","source":"regles","consentement":true}'::jsonb,
    'mal au genou'
  );
  assert v_id_o1 is not null, 'O1a aucun identifiant rendu';
  assert (select texte from public.orientation_textes where parcours_id = v_id_o1) = 'mal au genou', 'O1b texte absent';

  -- O2. Sans consentement, le texte fourni n'est pas gardé, même la ligne
  -- du parcours est bien écrite.
  v_id_o2 := public.orientation_enregistrer(
    '{"motif":"douleur","zone":"dos","source":"regles","consentement":false}'::jsonb,
    'texte qui ne doit pas rester'
  );
  assert v_id_o2 is not null, 'O2a aucun identifiant rendu';
  assert not exists (select 1 from public.orientation_textes where parcours_id = v_id_o2), 'O2b texte gardé sans consentement';

  -- O3. Seul le premier clic d'un parcours est noté.
  perform public.orientation_clic(v_id_o1, 'reservation', 'julien-blamont');
  perform public.orientation_clic(v_id_o1, 'page', 'autre');
  assert (select clic_type from public.orientation_parcours where id = v_id_o1) = 'reservation', 'O3a clic_type';
  assert (select clic_cible from public.orientation_parcours where id = v_id_o1) = 'julien-blamont', 'O3b clic_cible';

  -- O4. La limite compte par empreinte et par heure.
  v_ok := public.orientation_limiter(repeat('a', 64), 2);
  assert v_ok, 'O4a premier appel refusé';
  v_ok := public.orientation_limiter(repeat('a', 64), 2);
  assert v_ok, 'O4b second appel refusé';
  v_ok := public.orientation_limiter(repeat('a', 64), 2);
  assert not v_ok, 'O4c troisième appel accepté au-delà de la limite';

  -- O5. Le ménage n'efface que les textes de plus de 90 jours.
  v_id_vieux := public.orientation_enregistrer(
    '{"motif":"performance","source":"regles","consentement":true}'::jsonb,
    'texte vieux de 91 jours'
  );
  v_id_recent := public.orientation_enregistrer(
    '{"motif":"performance","source":"regles","consentement":true}'::jsonb,
    'texte vieux de 10 jours'
  );
  update public.orientation_textes set cree_le = now() - interval '91 days' where parcours_id = v_id_vieux;
  update public.orientation_textes set cree_le = now() - interval '10 days' where parcours_id = v_id_recent;
  v_menage := public.orientation_menage();
  assert not exists (select 1 from public.orientation_textes where parcours_id = v_id_vieux), 'O5a texte de 91 jours conservé';
  assert exists (select 1 from public.orientation_textes where parcours_id = v_id_recent), 'O5b texte de 10 jours effacé';
  assert (v_menage ->> 'textes')::int >= 1, 'O5c ' || v_menage;

  reset role;
end $$;

-- BLOC DROITS ANON
set local role anon;
do $$
begin
  -- O6. Sans compte, rien n'est lisible ni modifiable.
  begin
    perform count(*) from public.orientation_parcours;
    assert false, 'O6a anon lit les parcours';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.orientation_enregistrer('{"motif":"douleur","source":"regles"}'::jsonb);
    assert false, 'O6b anon enregistre un parcours';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
-- FIN BLOC DROITS ANON

-- BLOC AUTHENTIFIÉ, PAS SUPER-ADMIN
do $$
declare
  v_kine uuid;
begin
  select u.id into v_kine from auth.users u where u.email = 'jbc.kine@gmail.com';
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  set local role authenticated;

  -- O7. L'équipe sans être super-admin ne voit aucune ligne, et n'écrit pas
  -- davantage que l'anonyme, alors qu'O1, O2 et O5 ont déjà écrit.
  assert (select count(*) from public.orientation_parcours) = 0, 'O7a praticien lit les parcours';
  assert (select count(*) from public.orientation_textes) = 0, 'O7b praticien lit les textes';
  begin
    perform public.orientation_enregistrer('{"motif":"douleur","source":"regles"}'::jsonb);
    assert false, 'O7c praticien enregistre un parcours';
  exception when insufficient_privilege then null;
  end;

  reset role;
  perform set_config('request.jwt.claims', '', true);
end $$;
-- FIN BLOC AUTHENTIFIÉ, PAS SUPER-ADMIN

-- BLOC SUPER-ADMIN
do $$
declare
  v_lucas uuid;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  set local role authenticated;

  -- O8. Le super-admin lit les parcours et les textes écrits en O1.
  assert exists (
    select 1 from public.orientation_parcours
    where motif = 'douleur' and zone = 'genou' and clic_type = 'reservation'
  ), 'O8a super-admin ne lit pas le parcours d''O1';
  assert exists (
    select 1 from public.orientation_textes t
    join public.orientation_parcours p on p.id = t.parcours_id
    where p.motif = 'douleur' and p.zone = 'genou' and t.texte = 'mal au genou'
  ), 'O8b super-admin ne lit pas le texte d''O1';

  reset role;
  perform set_config('request.jwt.claims', '', true);
end $$;
-- FIN BLOC SUPER-ADMIN

rollback;
select 'orientation : scénarios OK' as resultat;
