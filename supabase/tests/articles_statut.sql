-- Statut des articles. Transaction annulée : rien n'est écrit.
-- Succès : « statut des articles : scénarios OK ».

begin;

do $$
declare
  v_lucas uuid; v_hugo uuid;
  v_slug text := 'test-statut-' || gen_random_uuid()::text;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  assert v_lucas is not null and v_hugo is not null, 'S0 comptes absents';
  delete from public.site_super_admins where user_id = v_hugo;

  -- Chaque bloc pose son identité au début.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;

  -- S1. Un praticien crée son brouillon.
  insert into public.articles (slug, title, category, chapo, cover, author, date, status, sections, auteur_id)
  values (v_slug, 'Test', 'Pathologies', '', '/x.jpg', '{}'::jsonb, current_date, 'brouillon', '[]'::jsonb, v_hugo);

  -- S2. Il le passe en « à relire », et retour.
  update public.articles set status = 'relecture' where slug = v_slug;
  assert (select status from public.articles where slug = v_slug) = 'relecture', 'S2a';
  update public.articles set status = 'brouillon' where slug = v_slug;

  -- S3. Il ne le publie pas.
  begin
    update public.articles set status = 'publie' where slug = v_slug;
    assert false, 'S3 un praticien publie';
  exception when raise_exception then assert sqlerrm = 'ARTICLE_STATUT', 'S3 ' || sqlerrm;
  end;

  -- S4. Ni ne le programme.
  begin
    update public.articles set status = 'programme', publish_at = now() + interval '1 day' where slug = v_slug;
    assert false, 'S4 un praticien programme';
  exception when raise_exception then assert sqlerrm = 'ARTICLE_STATUT', 'S4 ' || sqlerrm;
  end;

  -- S5. Ni ne le met à la une.
  begin
    update public.articles set featured = true where slug = v_slug;
    assert false, 'S5 un praticien met à la une';
  exception when raise_exception then assert sqlerrm = 'ARTICLE_STATUT', 'S5 ' || sqlerrm;
  end;

  -- S6. Il ne crée pas directement un article publié.
  begin
    insert into public.articles (slug, title, category, chapo, cover, author, date, status, sections, auteur_id)
    values (v_slug || '-b', 'Test', 'Pathologies', '', '/x.jpg', '{}'::jsonb, current_date, 'publie', '[]'::jsonb, v_hugo);
    assert false, 'S6 un praticien crée un article publié';
  exception when raise_exception then assert sqlerrm = 'ARTICLE_STATUT', 'S6 ' || sqlerrm;
  end;

  -- S7. Il ne publie pas non plus par un upsert, comme l'écran enregistre.
  begin
    insert into public.articles (slug, title, category, chapo, cover, author, date, status, sections, auteur_id)
    values (v_slug, 'Test', 'Pathologies', '', '/x.jpg', '{}'::jsonb, current_date, 'publie', '[]'::jsonb, v_hugo)
    on conflict (slug) do update set status = excluded.status;
    assert false, 'S7 un praticien publie par upsert';
  exception when raise_exception then assert sqlerrm = 'ARTICLE_STATUT', 'S7 ' || sqlerrm;
  end;
  reset role;

  -- S8. Un gérant publie.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  set local role authenticated;
  update public.articles set status = 'publie' where slug = v_slug;
  assert (select status from public.articles where slug = v_slug) = 'publie', 'S8';
  reset role;

  -- S9. LE PIÈGE DE L'UPSERT : le propriétaire corrige une coquille dans son
  -- article publié, par un upsert. Vu comme une insertion, ça ressemblerait
  -- à une publication ; ça doit passer.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  insert into public.articles (slug, title, category, chapo, cover, author, date, status, sections, auteur_id)
  values (v_slug, 'Test corrigé', 'Pathologies', '', '/x.jpg', '{}'::jsonb, current_date, 'publie', '[]'::jsonb, v_hugo)
  on conflict (slug) do update set title = excluded.title, status = excluded.status;
  assert (select title from public.articles where slug = v_slug) = 'Test corrigé', 'S9';
  reset role;

  -- S10. Sans session, une écriture en SQL publie.
  perform set_config('request.jwt.claims', '', true);
  update public.articles set status = 'brouillon' where slug = v_slug;
  update public.articles set status = 'publie' where slug = v_slug;
  assert (select status from public.articles where slug = v_slug) = 'publie', 'S10';
end $$;

rollback;
select 'statut des articles : scénarios OK' as resultat;
