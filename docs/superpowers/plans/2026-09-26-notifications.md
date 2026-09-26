# Récapitulatif quotidien (C2) — plan d'implémentation

> **Pour les exécutants agentiques :** SOUS-COMPÉTENCE REQUISE — utiliser `superpowers:subagent-driven-development` (recommandé) ou `superpowers:executing-plans` pour exécuter ce plan tâche par tâche. Les étapes se suivent en cochant les cases (`- [ ]`).

**But :** Lucas et Jean-Baptiste reçoivent un mail par jour disant ce qui a bougé dans l'espace d'administration, et rien du tout les jours sans rien.

**Architecture :** une table d'événements alimentée par des déclencheurs en base — pas par l'interface —, une fonction qui compose le récapitulatif et le dépose dans la file de mails existante, une route de cron quotidienne, et un interrupteur par personne.

**Pile :** Next.js 16 App Router, React 19, Supabase (projet `nuehdfyscqnkckudkqhe`), `node --test`.

**Spec :** `docs/superpowers/specs/2026-09-26-notifications-design.md`.

**Ce qui est déjà en production** : `agenda_mails` et `agenda_reserver_mails`, vidées par `/api/agenda/tache` toutes les cinq minutes ; `agenda__mettre_en_file` qui n'écrit rien à celui qui agit ; `site_super_admins` (Lucas et JB) ; `site_est_equipe()` et `site_est_super_admin()` ; `lib/agenda/{mails,envoi}.ts`.

---

## Règles pour l'exécutant

1. **Lire `AGENTS.md` à la racine.** Cette version de Next.js a des ruptures d'API. Avant d'utiliser une API Next que tu n'as pas déjà vue employée dans ce dépôt, lis le guide correspondant dans `node_modules/next/dist/docs/`.
2. **Base de production, en service.** Projet `nuehdfyscqnkckudkqhe` : 23 articles, 2 créneaux et 11 séances du Klub, 8 vœux d'agenda, 1 absence. Migrations avec `mcp__4497d48a-79cd-4b24-bdf1-1339728e2b85__apply_migration`, lectures avec `..._execute_sql`, `project_id` explicite. **Jamais les outils `mcp__supabase__*`**, qui pointent sur un autre projet.
3. **Ne créer que les objets de ce plan.** Une seule modification d'objet existant est prévue, par la tâche 1 : ajouter le type `recap` à la contrainte `agenda_mails_type_check`. **Ne touche à aucune fonction existante**, ni `klub_*`, ni `agenda_*`, ni `site_*`.
4. **Les déclencheurs de la tâche 1 se posent sur des tables en service** — `articles`, `klub_seances`, `agenda_voeux`. Un déclencheur qui lève une exception empêcherait d'écrire dans la table : chacun est écrit pour ne jamais échouer, et la tâche 2 l'éprouve.
5. **N'envoie aucun mail réel** avant la tâche 6, qui le fait exprès et une seule fois.
6. **Tout essai destructif dans `begin; … rollback;`.**
7. **Lint React Compiler** : pas de `setState` dans le corps d'un effet, pas de mutation pendant le rendu. `npm run lint` doit finir **sans aucun avertissement**.
8. **Le code de ce plan n'a jamais été compilé.** Si une signature du dépôt diffère, suis le dépôt et dis précisément ce qui différait.
9. **Commits.** `git add <chemins explicites>`, jamais `-a` ni `-am`. Messages en français, au style des commits existants.
10. Ne rien pousser et n'ouvrir aucune PR avant la tâche 6.

## Carte des fichiers

| Fichier | Responsabilité |
|---|---|
| `supabase/migrations/20260926160000_site_evenements.sql` | Les deux tables, les déclencheurs, la fonction de composition |
| `supabase/tests/notifications.sql` | Scénarios, en transaction annulée |
| `lib/site/recap.ts` | Composition du texte, pure et testable |
| `lib/site/recap.test.ts` | Tests unitaires |
| `app/api/site/recap/route.ts` | La route de cron |
| `vercel.json` | L'entrée de cron quotidienne |
| `components/admin/PanneauAdmin.tsx` | L'interrupteur, pour les gérants seulement |

---

### Task 0: Espace de travail

- [ ] **Step 1: Vérifier l'état de départ**

```bash
cd /Users/lucas/Desktop/mugitu-biarritz-admin
git status --short
git log --oneline -1
```

Attendu : arbre propre, branche `feature/notifications`, dernier commit `f6e2e6a notifications : spec du récapitulatif quotidien`.

**Un second worktree existe**, `/Users/lucas/Desktop/mugitu-biarritz-c3`, où un autre chantier tourne en parallèle. **N'y touche pas**, et ne quitte pas ce répertoire-ci.

- [ ] **Step 2: Vérifier les tests existants**

Run: `npm test`
Attendu : 59 tests passent.

- [ ] **Step 3: Relever les états d'un article**

```sql
select pg_get_constraintdef(con.oid)
from pg_constraint con join pg_class c on c.oid = con.conrelid
where c.relname = 'articles' and con.contype = 'c' and pg_get_constraintdef(con.oid) like '%status%';
```

Le plan suppose les états `brouillon`, `relecture`, `programme`, `publie`. **Si la contrainte dit autre chose, suis la base** et adapte les déclencheurs de la tâche 1, en le signalant.

---

### Task 1: Les événements

**Files:**
- Create: `supabase/migrations/20260926160000_site_evenements.sql`

- [ ] **Step 1: Écrire la migration**

```sql
-- Back-office : ce qui a bougé, et le réglage de chacun.
--
-- Les événements viennent de déclencheurs en base et non de l'interface :
-- un article publié directement en SQL doit compter autant qu'un article
-- publié depuis l'écran. L'interface, on oublie de l'appeler ; un
-- déclencheur, non.
--
-- Chaque déclencheur est écrit pour ne JAMAIS échouer. Il se pose sur des
-- tables en service : une exception y empêcherait de publier un article ou
-- de créer une séance. D'où le bloc `exception when others then return ...`
-- de chacun — on préfère perdre une ligne de récapitulatif que bloquer le
-- travail du cabinet.

create table public.site_evenements (
  id uuid primary key default gen_random_uuid(),
  quoi text not null check (quoi in (
    'seance_creee', 'seance_annulee', 'creneau_modifie',
    'article_publie', 'article_a_relire',
    'voeu_pose', 'absence_declaree', 'echange_demande')),
  sujet text not null,
  qui uuid references auth.users (id) on delete set null,
  lien text,
  created_at timestamptz not null default now()
);

create index site_evenements_jour on public.site_evenements (created_at);

alter table public.site_evenements enable row level security;
revoke all on public.site_evenements from anon, authenticated;
-- Personne ne lit cette table depuis le navigateur : les déclencheurs y
-- écrivent, la clé de service la relit. Aucune politique, donc aucun accès.

create table public.site_reglages_mail (
  user_id uuid primary key references auth.users (id) on delete cascade,
  recap boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.site_reglages_mail enable row level security;

-- Chacun lit et écrit sa ligne, et rien d'autre. L'absence de ligne vaut
-- « oui » : on ne crée pas une ligne pour les onze comptes à l'avance.
create policy site_reglages_lecture on public.site_reglages_mail
  for select to authenticated using (user_id = auth.uid());
create policy site_reglages_creation on public.site_reglages_mail
  for insert to authenticated with check (user_id = auth.uid() and public.site_est_equipe());
create policy site_reglages_modification on public.site_reglages_mail
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

revoke all on public.site_reglages_mail from anon;
grant select, insert, update on public.site_reglages_mail to authenticated;

-- Poser un événement. Interne, et silencieuse en cas de problème.
create or replace function public.site__evenement(
  p_quoi text, p_sujet text, p_qui uuid, p_lien text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.site_evenements (quoi, sujet, qui, lien)
  values (p_quoi, left(p_sujet, 300), p_qui, p_lien);
exception when others then
  -- Un récapitulatif manquant ne justifie pas d'empêcher le travail.
  return;
end;
$$;

revoke all on function public.site__evenement(text, text, uuid, text) from public, anon, authenticated;

-- Les articles. Seules les transitions comptent : réenregistrer un article
-- publié ne l'annonce pas une seconde fois.
create or replace function public.site__ev_article()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'publie' and (tg_op = 'INSERT' or old.status is distinct from 'publie') then
    perform public.site__evenement('article_publie', new.title, new.auteur_id, '/admin/actualites');
  elsif new.status = 'relecture' and (tg_op = 'INSERT' or old.status is distinct from 'relecture') then
    perform public.site__evenement('article_a_relire', new.title, new.auteur_id, '/admin/actualites');
  end if;
  return new;
exception when others then return new;
end;
$$;

revoke all on function public.site__ev_article() from public, anon, authenticated;

create trigger site_ev_article
  after insert or update on public.articles
  for each row execute function public.site__ev_article();

-- Les séances du Klub.
create or replace function public.site__ev_seance()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sujet text;
begin
  v_sujet := new.titre || ', le ' || to_char(new.debut at time zone 'Europe/Paris', 'DD/MM à HH24hMI');
  if tg_op = 'INSERT' then
    perform public.site__evenement('seance_creee', v_sujet, null, '/admin/mugi-klub');
  elsif new.statut = 'annulee' and old.statut is distinct from 'annulee' then
    perform public.site__evenement('seance_annulee', v_sujet, null, '/admin/mugi-klub');
  end if;
  return new;
exception when others then return new;
end;
$$;

revoke all on function public.site__ev_seance() from public, anon, authenticated;

create trigger site_ev_seance
  after insert or update on public.klub_seances
  for each row execute function public.site__ev_seance();

-- Les créneaux : seul un changement de fond compte, pas un `updated_at`.
create or replace function public.site__ev_creneau()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (new.titre, new.jour, new.heure, new.duree_min, new.capacite, new.prix_libelle,
      new.inscription_requise, new.actif, new.reservation_url)
     is distinct from
     (old.titre, old.jour, old.heure, old.duree_min, old.capacite, old.prix_libelle,
      old.inscription_requise, old.actif, old.reservation_url) then
    perform public.site__evenement('creneau_modifie', new.titre, null, '/admin/mugi-klub');
  end if;
  return new;
exception when others then return new;
end;
$$;

revoke all on function public.site__ev_creneau() from public, anon, authenticated;

create trigger site_ev_creneau
  after update on public.klub_creneaux
  for each row execute function public.site__ev_creneau();

-- L'agenda : un vœu posé, une absence déclarée, un échange demandé. Les
-- décisions et les commentaires sont déjà adressés à quelqu'un : les mettre
-- au récapitulatif les dirait deux fois.
create or replace function public.site__ev_voeu()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.site__evenement('voeu_pose',
    public.agenda__libelle_case(new.salle, new.jour, new.moment), new.user_id, '/admin/agenda');
  return new;
exception when others then return new;
end;
$$;

revoke all on function public.site__ev_voeu() from public, anon, authenticated;

create trigger site_ev_voeu
  after insert on public.agenda_voeux
  for each row execute function public.site__ev_voeu();

create or replace function public.site__ev_absence()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.site__evenement('absence_declaree',
    'du ' || to_char(new.du, 'DD/MM') || ' au ' || to_char(new.au, 'DD/MM'),
    new.user_id, '/admin/agenda');
  return new;
exception when others then return new;
end;
$$;

revoke all on function public.site__ev_absence() from public, anon, authenticated;

create trigger site_ev_absence
  after insert on public.agenda_absences
  for each row execute function public.site__ev_absence();

create or replace function public.site__ev_echange()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.site__evenement('echange_demande',
    public.agenda__libelle_echange(new.id), new.demandeur_id, '/admin/agenda');
  return new;
exception when others then return new;
end;
$$;

revoke all on function public.site__ev_echange() from public, anon, authenticated;

create trigger site_ev_echange
  after insert on public.agenda_echanges
  for each row execute function public.site__ev_echange();

-- Le type de mail rejoint la file de l'agenda. Son nom devient faux avant sa
-- mécanique : la fusion des deux files est notée dans la spec.
alter table public.agenda_mails drop constraint agenda_mails_type_check;
alter table public.agenda_mails add constraint agenda_mails_type_check
  check (type in ('voeu_valide', 'voeu_refuse', 'retrait_demande', 'retrait_tranche',
                  'commentaire', 'absence',
                  'echange_propose', 'echange_pair', 'echange_tranche',
                  'recap'));

-- Composer le récapitulatif et le déposer dans la file.
--
-- Réservée à la clé de service : elle lit les événements de tout le monde.
-- S'il n'y a rien à dire, elle ne met rien en file — c'est la règle qui fait
-- qu'on ouvrira encore ce mail dans six mois.
create or replace function public.site_recap_du_jour()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_depuis timestamptz := now() - interval '24 hours';
  v_n int;
  v_corps text := '';
  v_gerant record;
  v_mails int := 0;
  v_titres constant jsonb := jsonb_build_object(
    'seance_creee', 'Séances créées',
    'seance_annulee', 'Séances annulées',
    'creneau_modifie', 'Créneaux modifiés',
    'article_publie', 'Articles publiés',
    'article_a_relire', 'Articles à relire',
    'voeu_pose', 'Créneaux demandés dans l''agenda',
    'absence_declaree', 'Absences déclarées',
    'echange_demande', 'Échanges demandés');
  v_ordre constant text[] := array['seance_creee', 'seance_annulee', 'creneau_modifie',
    'article_publie', 'article_a_relire', 'voeu_pose', 'absence_declaree', 'echange_demande'];
  v_type text;
  v_bloc text;
begin
  select count(*) into v_n from public.site_evenements where created_at >= v_depuis;
  if v_n = 0 then return jsonb_build_object('evenements', 0, 'mails', 0); end if;

  foreach v_type in array v_ordre loop
    select string_agg('- ' || e.sujet
             || coalesce(' (' || nullif(coalesce(p.first_name || ' ' || p.last_name, u.email), '') || ')', ''),
             chr(10) order by e.created_at)
      into v_bloc
      from public.site_evenements e
      left join auth.users u on u.id = e.qui
      left join public.profiles p on p.user_id = e.qui
     where e.created_at >= v_depuis and e.quoi = v_type;

    if v_bloc is not null then
      v_corps := v_corps || (v_titres->>v_type) || chr(10) || v_bloc || chr(10) || chr(10);
    end if;
  end loop;

  for v_gerant in
    select s.user_id from public.site_super_admins s
     where coalesce((select r.recap from public.site_reglages_mail r where r.user_id = s.user_id), true)
  loop
    perform public.agenda__mettre_en_file('recap', v_gerant.user_id,
      'Mugitu, ce qui a bougé hier', v_corps);
    v_mails := v_mails + 1;
  end loop;

  return jsonb_build_object('evenements', v_n, 'mails', v_mails);
end;
$$;

revoke all on function public.site_recap_du_jour() from public, anon, authenticated;
```

**Attention à `agenda__mettre_en_file`** : elle n'écrit rien quand le destinataire est `auth.uid()`. Appelée par la clé de service depuis le cron, `auth.uid()` est nul, donc aucun gérant n'est écarté. C'est correct, mais **vérifie-le** au Step 4 : si tu appelles `site_recap_du_jour()` en étant connecté comme Lucas dans un essai, il ne recevra rien, et ce ne sera pas un défaut.

- [ ] **Step 2: Appliquer la migration**

Outil `apply_migration`, `project_id` = `nuehdfyscqnkckudkqhe`, `name` = `site_evenements`.

- [ ] **Step 3: Vérifier les objets**

```sql
select
  (select count(*) from information_schema.tables where table_schema='public'
     and table_name in ('site_evenements','site_reglages_mail')) as tables,
  (select count(*) from pg_trigger where tgname like 'site_ev_%') as declencheurs,
  (select count(*) from pg_policies where schemaname='public' and tablename='site_reglages_mail') as politiques,
  (select count(*) from information_schema.role_table_grants where table_schema='public'
     and table_name='site_evenements' and grantee in ('anon','authenticated')) as acces_evenements,
  has_function_privilege('authenticated', 'public.site_recap_du_jour()', 'execute') as recap_equipe;
```

Attendu : `tables` 2, `declencheurs` 6, `politiques` 3, `acces_evenements` 0, `recap_equipe` faux.

- [ ] **Step 4: Éprouver les déclencheurs et la composition**

```sql
begin;
do $$
declare
  v_lucas uuid; v_hugo uuid; v_n1 int; v_n2 int; v_bilan jsonb;
begin
  select id into v_lucas from auth.users where email = 'lucas.bengosteo@gmail.com';
  select id into v_hugo  from auth.users where email = 'hugo.daminato@gmail.com';

  -- Un vœu posé produit un événement.
  select count(*) into v_n1 from public.site_evenements;
  insert into public.agenda_voeux (user_id, salle, jour, moment)
  values (v_hugo, 'etera', 3, 'matin');
  select count(*) into v_n2 from public.site_evenements;
  assert v_n2 = v_n1 + 1, 'le déclencheur des vœux n''a rien posé';

  -- La composition met un mail par gérant, et renvoie son bilan.
  v_bilan := public.site_recap_du_jour();
  assert (v_bilan->>'evenements')::int >= 1, 'bilan sans événement : ' || v_bilan::text;
  assert (v_bilan->>'mails')::int = 2, 'bilan : ' || v_bilan::text;
  assert exists (select 1 from public.agenda_mails where type = 'recap'), 'aucun mail recap en file';

  -- Un gérant qui coupe le récapitulatif ne le reçoit plus.
  insert into public.site_reglages_mail (user_id, recap) values (v_lucas, false);
  delete from public.agenda_mails where type = 'recap';
  v_bilan := public.site_recap_du_jour();
  assert (v_bilan->>'mails')::int = 1, 'la préférence n''est pas lue : ' || v_bilan::text;
end $$;
rollback;
select 'déclencheurs et récapitulatif : OK' as resultat,
       (select count(*) from public.site_evenements) as evenements,
       (select count(*) from public.agenda_mails where type = 'recap') as recaps;
```

Attendu : `déclencheurs et récapitulatif : OK`, `evenements` 0, `recaps` 0.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260926160000_site_evenements.sql
git commit -m "$(cat <<'EOF'
notifications : les événements, le réglage, et la composition

Six déclencheurs sur les tables en service. Chacun avale ses erreurs :
posés sur articles, klub_seances et agenda_voeux, une exception y
empêcherait de publier un article ou de créer une séance. On préfère
perdre une ligne de récapitulatif que bloquer le travail du cabinet.

Chacun n'écrit que sur une transition réelle — sans quoi corriger une
coquille dans un article publié annoncerait sa publication une seconde
fois.

site_recap_du_jour ne met rien en file quand il n'y a rien à dire : c'est
la règle qui fait qu'on ouvrira encore ce mail dans six mois.
EOF
)"
```

---

### Task 2: Les scénarios

**Files:**
- Create: `supabase/tests/notifications.sql`

- [ ] **Step 1: Écrire le fichier**

```sql
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
```

- [ ] **Step 2: Lancer les scénarios**

Outil `execute_sql`, `project_id` = `nuehdfyscqnkckudkqhe`, `query` = le contenu du fichier, **en une seule fois**.
Attendu : `[{"resultat":"notifications : scénarios OK"}]`.

Si un `assert` échoue, le message nomme le scénario. **Ne modifie pas le scénario pour le faire passer sans avoir établi si c'est lui ou la migration qui a tort.**

- [ ] **Step 3: Vérifier que rien n'a persisté**

```sql
select
  (select count(*) from public.articles) as articles,
  (select count(*) from public.klub_seances) as seances,
  (select count(*) from public.agenda_voeux) as voeux,
  (select count(*) from public.agenda_absences) as absences,
  (select count(*) from public.site_evenements) as evenements,
  (select count(*) from public.site_reglages_mail) as reglages,
  (select count(*) from public.agenda_mails where type = 'recap') as recaps;
```

Attendu : `articles` 23, `seances` 11, `voeux` 8, `absences` 1, `reglages` 0, `recaps` 0. `evenements` vaut ce que les vrais gestes de l'équipe ont produit depuis la tâche 1 — **il peut donc être non nul, et ce n'est pas une fuite.** Le fichier de scénarios contient un `delete from public.site_evenements;` sans clause `where` : vérifie qu'il n'a pas emporté de vraies lignes en comparant avec un comptage fait **avant** de lancer le fichier.

- [ ] **Step 4: Commit**

```bash
git add supabase/tests/notifications.sql
git commit -m "$(cat <<'EOF'
notifications : scénarios du récapitulatif

Quinze scénarios. Les trois qui comptent : réenregistrer un article publié
ne l'annonce pas deux fois, une décision sur un vœu n'entre pas au
récapitulatif puisqu'elle est déjà adressée à quelqu'un, et sans événement
aucun mail ne part.

Le fichier vide site_evenements au début : les vrais gestes de l'équipe ne
doivent pas décider du résultat des scénarios. Sans clause where, donc sûr
seulement dans la transaction annulée.
EOF
)"
```

---

### Task 3: Le texte du récapitulatif

**Files:**
- Create: `lib/site/recap.ts`, `lib/site/recap.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Écrire le test qui échoue**

`lib/site/recap.test.ts` :

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { habillerRecap } from "./recap.ts";

const CORPS = `Séances créées
- Prépa des danseurs, le 03/10 à 08h00

Articles à relire
- Épaule du surfeur (Hugo Daminato)
`;

test("chaque thème devient un titre, chaque ligne un item", () => {
  const { html, texte } = habillerRecap(CORPS);
  assert.ok(html.includes("Séances créées"));
  assert.ok(html.includes("<li"));
  assert.ok(html.includes("Épaule du surfeur"));
  assert.ok(texte.includes("Séances créées"));
  assert.ok(texte.includes("- Prépa des danseurs, le 03/10 à 08h00"));
});

test("le HTML est échappé", () => {
  const { html } = habillerRecap("Articles publiés\n- <script>alert(1)</script>\n");
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("&lt;script&gt;"));
});

test("un corps vide ne produit aucun thème", () => {
  const { html, texte } = habillerRecap("");
  assert.ok(!html.includes("<li"));
  assert.equal(texte.trim().length > 0, true);
});

test("une ligne sans thème au-dessus n’est pas perdue", () => {
  const { texte } = habillerRecap("- orpheline\n");
  assert.ok(texte.includes("orpheline"));
});
```

- [ ] **Step 2: Lancer le test pour le voir échouer**

Run: `node --test lib/site/recap.test.ts`
Attendu : ÉCHEC, `ERR_MODULE_NOT_FOUND` pour `./recap.ts`.

- [ ] **Step 3: Écrire `lib/site/recap.ts`**

```ts
/**
 * Habillage du récapitulatif quotidien.
 *
 * Le corps est composé en base par `site_recap_du_jour()` : des lignes de
 * titre, et des lignes d'item commençant par « - ». Ce module ne fait que
 * l'habiller — il n'invente aucun contenu, ce qui le rend testable sans
 * base ni réseau.
 */

const SITE = "https://mugitu-biarritz.fr";

export function habillerRecap(corps: string): { html: string; texte: string } {
  const lignes = corps.split("\n").map((l) => l.trimEnd());
  const morceaux: string[] = [];
  let dansListe = false;

  for (const ligne of lignes) {
    if (ligne.trim().length === 0) continue;
    if (ligne.startsWith("- ")) {
      if (!dansListe) {
        morceaux.push('<ul style="margin:0 0 14px;padding-left:20px">');
        dansListe = true;
      }
      morceaux.push(
        `<li style="font-size:14.5px;line-height:1.6;color:#1d2d33">${echapper(ligne.slice(2))}</li>`,
      );
    } else {
      if (dansListe) {
        morceaux.push("</ul>");
        dansListe = false;
      }
      morceaux.push(
        `<p style="font-size:13px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#04A49B;margin:18px 0 6px">${echapper(ligne)}</p>`,
      );
    }
  }
  if (dansListe) morceaux.push("</ul>");

  const html = [
    '<p style="font-size:16px;font-weight:600;color:#003850;margin:0 0 4px">Ce qui a bougé hier</p>',
    ...morceaux,
    `<p style="font-size:13px;margin:18px 0 0"><a href="${SITE}/admin" style="color:#04A49B">Ouvrir le back-office</a></p>`,
  ].join("");

  const texte = ["Ce qui a bougé hier", "", corps.trimEnd(), "", `Le back-office : ${SITE}/admin`].join("\n");

  return { html, texte };
}

function echapper(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
```

- [ ] **Step 4: Étendre le script de test**

Dans `package.json`, le script `test` devient :

```json
    "test": "node --test lib/klub/*.test.ts lib/admin/*.test.ts lib/agenda/*.test.ts lib/site/*.test.ts",
```

- [ ] **Step 5: Lancer les tests**

Run: `npm test`
Attendu : 63 tests passent (59 existants + 4 nouveaux).

- [ ] **Step 6: Vérifier types et lint**

Run: `npx tsc --noEmit && npm run lint`
Attendu : aucune sortie, aucun avertissement.

- [ ] **Step 7: Commit**

```bash
git add lib/site/recap.ts lib/site/recap.test.ts package.json
git commit -m "$(cat <<'EOF'
notifications : habillage du récapitulatif

Le corps est composé en base ; ce module ne fait que l'habiller, ce qui le
rend testable sans base ni réseau.

Le HTML est échappé : les sujets viennent de titres d'articles et de
descriptions que des praticiens saisissent à la main.
EOF
)"
```

---

### Task 4: La route et le cron

**Files:**
- Create: `app/api/site/recap/route.ts`
- Modify: `vercel.json`

- [ ] **Step 1: Écrire la route**

```ts
import { NextResponse } from "next/server";
import { rpcService } from "@/lib/supabase-service";

/**
 * GET /api/site/recap, appelée une fois par jour par le cron Vercel.
 *
 * Elle ne compose que : l'envoi reste le travail de /api/agenda/tache, qui
 * vide la file toutes les cinq minutes. Un seul chemin d'envoi, déjà
 * éprouvé, et un mail qui part au plus tard cinq minutes après.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Bilan = { evenements: number; mails: number };

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[recap] CRON_SECRET absente");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const r = await rpcService<Bilan>("site_recap_du_jour", {});
  if (!r.ok) {
    console.error("[recap] composition en échec", r.status, r.corps);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  console.log("[recap]", JSON.stringify(r.data));
  return NextResponse.json({ ok: true, bilan: r.data });
}
```

**Avant d'écrire**, ouvre `lib/supabase-service.ts` et vérifie la signature réelle de `rpcService` et la forme de son retour. Si elles diffèrent, suis le dépôt et signale-le.

- [ ] **Step 2: Ajouter l'entrée de cron**

Dans `vercel.json`, ajouter au tableau `crons`, sans toucher aux deux existantes :

```json
    { "path": "/api/site/recap", "schedule": "0 5 * * *" }
```

`0 5 * * *` en UTC, soit 7 h à Paris en heure d'été et 6 h en heure d'hiver. Une heure de décalage sur un récapitulatif quotidien ne vaut pas la complexité d'un décalage calculé — c'est écrit dans la spec.

- [ ] **Step 3: Vérifier**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Attendu : 63 tests, aucune erreur, aucun avertissement, et `/api/site/recap` dans la liste des routes.

- [ ] **Step 4: Commit**

```bash
git add app/api/site/recap/route.ts vercel.json
git commit -m "$(cat <<'EOF'
notifications : la route quotidienne du récapitulatif

Elle ne compose que ; l'envoi reste le travail de /api/agenda/tache, qui
vide la file toutes les cinq minutes. Un seul chemin d'envoi, déjà
éprouvé.

Le cron est à 0 5 * * * UTC, soit 7 h à Paris en été et 6 h en hiver. Une
heure de décalage sur un récapitulatif quotidien ne vaut pas la
complexité d'un décalage calculé.
EOF
)"
```

---

### Task 5: L'interrupteur

**Files:**
- Modify: `components/admin/PanneauAdmin.tsx`

- [ ] **Step 1: Ajouter la case au pied du panneau**

Dans `components/admin/PanneauAdmin.tsx`, le pied contient le prénom, « Voir le site ↗ » et « Se déconnecter ». Ajouter, **entre le prénom et « Voir le site »**, et seulement pour un gérant :

```tsx
        {acces.estSuperAdmin ? <ReglageRecap /> : null}
```

Et définir le composant à la fin du fichier :

```tsx
/**
 * Recevoir ou non le récapitulatif quotidien. Un seul interrupteur ne
 * mérite pas une rubrique de réglages ; il vit donc au pied du panneau,
 * là où l'on trouve déjà ce qui concerne son propre compte.
 *
 * L'absence de ligne en base vaut « oui » : on n'en crée une qu'au premier
 * changement.
 */
function ReglageRecap() {
  const [actif, setActif] = useState<boolean | null>(null);

  const charger = useCallback(async () => {
    const sb = supabaseBrowser();
    const { data: session } = await sb.auth.getUser();
    const id = session.user?.id;
    if (!id) return;
    const { data } = await sb.from("site_reglages_mail").select("recap").eq("user_id", id).maybeSingle();
    setActif(data?.recap ?? true);
  }, []);

  useEffect(() => {
    // Motif du dépôt : pas de setState synchrone dans le corps d'un effet.
    const t = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(t);
  }, [charger]);

  const basculer = async (valeur: boolean) => {
    const sb = supabaseBrowser();
    const { data: session } = await sb.auth.getUser();
    const id = session.user?.id;
    if (!id) return;
    setActif(valeur);
    const { error } = await sb
      .from("site_reglages_mail")
      .upsert({ user_id: id, recap: valeur, updated_at: new Date().toISOString() });
    if (error) setActif(!valeur);
  };

  if (actif === null) return null;

  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        fontSize: 12,
        color: "rgba(51,51,52,.6)",
        cursor: "pointer",
      }}
    >
      <input type="checkbox" checked={actif} onChange={(e) => void basculer(e.target.checked)} />
      Récapitulatif quotidien
    </label>
  );
}
```

Ajouter aux imports du fichier ce qui manque : `useCallback`, `useEffect`, `useState` depuis `react`, et `supabaseBrowser` depuis `@/lib/supabase-browser`. **Vérifie ce que le fichier importe déjà** et ne duplique rien.

Si `PanneauAdmin` n'est pas déjà un composant client, **il l'est forcément** — il reçoit `onNaviguer` et `onDeconnexion` — mais confirme la présence de `"use client"` en tête.

- [ ] **Step 2: Vérifier**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Attendu : 63 tests, aucune erreur, aucun avertissement.

Si le lint refuse quelque chose, corrige au minimum et signale-le.

- [ ] **Step 3: Commit**

```bash
git add components/admin/PanneauAdmin.tsx
git commit -m "$(cat <<'EOF'
notifications : l'interrupteur du récapitulatif

Au pied du panneau, là où l'on trouve déjà ce qui concerne son propre
compte : un seul interrupteur ne mérite pas une rubrique de réglages.

Visible pour les gérants seulement, puisqu'eux seuls reçoivent le
récapitulatif. L'absence de ligne en base vaut « oui », et on n'en crée
une qu'au premier changement.
EOF
)"
```

---

### Task 6: Vérification, PR et mise en ligne

- [ ] **Step 1: Tout vérifier**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Attendu : 63 tests, aucune erreur, aucun avertissement, `/api/site/recap` dans les routes.

Relancer les fichiers de scénarios avec `execute_sql`, chacun en une seule fois : `klub.sql`, `klub_reservation.sql`, `agenda.sql`, `agenda_absences.sql`, `agenda_echanges.sql`, `admin.sql`, `notifications.sql`.

**C'est le point de vigilance de cette tâche.** Cette livraison pose six déclencheurs sur des tables que tous ces fichiers manipulent. Si l'un d'eux échoue, c'est une régression réelle, et probablement un déclencheur qui refuse une écriture au lieu de l'avaler.

- [ ] **Step 2: Contrôle des droits effectifs**

Outil `get_advisors`, `project_id` explicite, `type` = `security`.
Attendu : `site_evenements` apparaît sous « RLS enabled, no policy », ce qui est **voulu** — personne ne doit la lire. Aucune fonction `site__ev_*` ni `site_recap_du_jour` ne doit figurer dans les listes exécutables par `anon` ou `authenticated`.

- [ ] **Step 3: Vérifier que la production est intacte**

```sql
select
  (select count(*) from public.articles) as articles,
  (select count(*) from public.klub_seances) as seances,
  (select count(*) from public.agenda_voeux) as voeux,
  (select count(*) from public.site_evenements) as evenements,
  (select count(*) from public.site_reglages_mail) as reglages;
```

Attendu : `articles` 23, `seances` 11, `voeux` au moins 8. `evenements` reflète les vrais gestes depuis la tâche 1.

- [ ] **Step 4: Pousser et ouvrir la PR**

```bash
git push -u origin feature/notifications
gh pr create --base main --title "Back-office : le récapitulatif de ce qui bouge" --body "$(cat <<'EOF'
Lucas et Jean-Baptiste reçoivent un mail par jour disant ce qui a bougé dans l'espace d'administration, et rien du tout les jours sans rien.

**Pourquoi eux deux seulement.** Le piège de ce chantier n'est pas technique. Onze personnes et « toute modification », c'est plusieurs mails par jour chacun ; au bout de trois semaines plus personne ne les ouvre, et le jour où un mail compte il est noyé. Les neuf autres continuent de ne recevoir que ce qui leur est adressé — une décision sur leur vœu, un échange qu'on leur propose — et ça ne se coupe pas : une décision qui se perd n'est pas une décision.

**Les événements viennent de la base, pas de l'interface.** Un article publié directement en SQL compte autant qu'un article publié depuis l'écran. Six déclencheurs, chacun sur une transition réelle : réenregistrer un article publié ne l'annonce pas une seconde fois.

**Chaque déclencheur avale ses erreurs.** Ils sont posés sur `articles`, `klub_seances`, `klub_creneaux`, `agenda_voeux`, `agenda_absences` et `agenda_echanges` — des tables en service. Une exception y empêcherait de publier un article ou de créer une séance. On préfère perdre une ligne de récapitulatif que bloquer le travail du cabinet.

**Rien à dire, rien à envoyer.** `site_recap_du_jour()` ne met aucun mail en file quand aucun événement n'est survenu. C'est la règle qui fait qu'on ouvrira encore ce mail dans six mois.

**Le récapitulatif passe par la file de l'agenda** plutôt que par une troisième : un seul chemin d'envoi, déjà éprouvé, et un mail qui part au plus tard cinq minutes après avoir été composé. Le nom `agenda_mails` devient faux avant sa mécanique ; la fusion des deux files est notée dans la spec.

**Le cron est à 7 h à Paris en été, 6 h en hiver.** Les crons Vercel sont en UTC, et une heure de décalage sur un récapitulatif quotidien ne vaut pas la complexité d'un décalage calculé.

Spec : `docs/superpowers/specs/2026-09-26-notifications-design.md`
Plan : `docs/superpowers/plans/2026-09-26-notifications.md`

Vérifications : 63 tests, `tsc`, lint sans avertissement, build, et **tous** les fichiers de scénarios du dépôt relancés sur la base de production en transaction annulée — pas seulement les nouveaux, puisque cette livraison pose des déclencheurs sur des tables que tous manipulent.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 5: Ne pas fusionner**

Lucas a autorisé la fusion du chantier des méthodes de réservation, **pas celui-ci**. Laisse la PR ouverte et signale-le dans ton rapport.

- [ ] **Step 6: Un essai réel, après la mise en ligne seulement**

Quand la PR sera fusionnée et déployée, la route pourra être appelée une fois à la main avec le secret, pour lire le mail. **Ne le fais pas maintenant** : la route n'existe pas encore en production, et un mail réel ne s'envoie pas sans que Lucas l'ait demandé.

---

## Ce que ce plan ne fait pas

- Choisir par personne quels types figurent au récapitulatif.
- Fusionner les files `agenda_mails` et `klub_mails`.
- La carte de prise en main : chantier C3, en cours sur `feature/prise-en-main`, dans le worktree `/Users/lucas/Desktop/mugitu-biarritz-c3`.
