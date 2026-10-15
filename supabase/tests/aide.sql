-- Droits des tables du widget d'aide. Tout se passe dans une transaction
-- annulée : rien n'est écrit. Lancer avec l'outil MCP execute_sql (projet
-- nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « aide : scénarios OK ».
--
-- Comptes de test : `public.site_est_super_admin()` reconnaît un compte
-- inscrit dans `site_super_admins` (lucas.bengosteo@gmail.com et
-- jbc.kine@gmail.com, posés par la migration 20260923120000_site_droits.sql,
-- « Les deux gérants »). Pour un membre de l'équipe qui n'est *pas*
-- super-admin, on reprend le compte de Jean-Baptiste (déjà équipe par
-- `user_roles`) et on retire, dans la transaction annulée, sa ligne de
-- `site_super_admins` — exactement le procédé de `supabase/tests/orientation.sql`.

begin;

do $$
declare
  v_lucas uuid;
  v_kine uuid;
  v_id_a1 uuid;
  v_id_a2 uuid;
  v_id_vieux uuid;
  v_id_recent uuid;
  v_menage jsonb;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_kine from auth.users u where u.email = 'jbc.kine@gmail.com';
  assert v_lucas is not null and v_kine is not null, 'A0 comptes de référence absents';
  delete from public.site_super_admins where user_id = v_kine;

  set local role service_role;

  -- A1. Une question consentie, avec sources et page, enregistre son texte.
  v_id_a1 := public.aide_enregistrer(
    '{"type":"reponse","sources":["faq-x"],"page":"/equipe","consentement":true}'::jsonb,
    'Faut-il une ordonnance ?',
    'Oui.'
  );
  assert v_id_a1 is not null, 'A1a aucun identifiant rendu';
  assert (select question from public.aide_textes where question_id = v_id_a1) = 'Faut-il une ordonnance ?', 'A1b question absente';
  assert (select reponse from public.aide_textes where question_id = v_id_a1) = 'Oui.', 'A1c réponse absente';

  -- A2. Sans consentement, le texte et la réponse fournis ne sont pas
  -- gardés, même si la question est bien écrite.
  v_id_a2 := public.aide_enregistrer(
    '{"type":"reponse","sources":[],"page":"/","consentement":false}'::jsonb,
    'texte qui ne doit pas rester',
    'réponse qui ne doit pas rester'
  );
  assert v_id_a2 is not null, 'A2a aucun identifiant rendu';
  assert not exists (select 1 from public.aide_textes where question_id = v_id_a2), 'A2b texte gardé sans consentement';

  -- A3. Le vote n'est noté qu'une fois.
  perform public.aide_vote(v_id_a1, true);
  perform public.aide_vote(v_id_a1, false);
  assert (select utile from public.aide_questions where id = v_id_a1) = true, 'A3 vote modifié après la première réponse';

  -- A4. Le ménage n'efface que les textes d'aide de plus de 90 jours et le
  -- bilan porte la clé « aide ».
  v_id_vieux := public.aide_enregistrer(
    '{"type":"reponse","sources":[],"page":"/","consentement":true}'::jsonb,
    'texte vieux de 91 jours',
    'réponse vieille de 91 jours'
  );
  v_id_recent := public.aide_enregistrer(
    '{"type":"reponse","sources":[],"page":"/","consentement":true}'::jsonb,
    'texte vieux de 10 jours',
    'réponse vieille de 10 jours'
  );
  update public.aide_textes set cree_le = now() - interval '91 days' where question_id = v_id_vieux;
  update public.aide_textes set cree_le = now() - interval '10 days' where question_id = v_id_recent;
  v_menage := public.orientation_menage();
  assert not exists (select 1 from public.aide_textes where question_id = v_id_vieux), 'A4a texte de 91 jours conservé';
  assert exists (select 1 from public.aide_textes where question_id = v_id_recent), 'A4b texte de 10 jours effacé';
  assert (v_menage ->> 'aide')::int >= 1, 'A4c ' || v_menage;

  reset role;
end $$;

-- BLOC DROITS ANON
set local role anon;
do $$
begin
  -- A5. Sans compte, rien n'est lisible ni modifiable.
  begin
    perform count(*) from public.aide_questions;
    assert false, 'A5a anon lit les questions';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.aide_enregistrer('{"type":"inconnu","sources":[],"page":"/"}'::jsonb);
    assert false, 'A5b anon enregistre une question';
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

  -- A6. L'équipe sans être super-admin ne voit aucune ligne, et n'écrit pas
  -- davantage que l'anonyme, alors qu'A1, A2 et A4 ont déjà écrit.
  assert (select count(*) from public.aide_questions) = 0, 'A6a praticien lit les questions';
  assert (select count(*) from public.aide_textes) = 0, 'A6b praticien lit les textes';
  begin
    perform public.aide_enregistrer('{"type":"inconnu","sources":[],"page":"/"}'::jsonb);
    assert false, 'A6c praticien enregistre une question';
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

  -- A7. Le super-admin lit la question et le texte d'A1.
  assert exists (
    select 1 from public.aide_questions
    where page = '/equipe' and type = 'reponse' and utile = true
  ), 'A7a super-admin ne lit pas la question d''A1';
  assert exists (
    select 1 from public.aide_textes t
    join public.aide_questions q on q.id = t.question_id
    where q.page = '/equipe' and t.question = 'Faut-il une ordonnance ?' and t.reponse = 'Oui.'
  ), 'A7b super-admin ne lit pas le texte d''A1';

  reset role;
  perform set_config('request.jwt.claims', '', true);
end $$;
-- FIN BLOC SUPER-ADMIN

rollback;
select 'aide : scénarios OK' as resultat;
