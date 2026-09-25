# Coque d'admin et droits : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Donner au back-office une coque unique à panneau latéral, un tableau de bord d'arrivée, une rubrique Événements, et deux niveaux de droits (équipe, super-admin) tenus par la base.

**Architecture:** Les droits vivent dans Postgres — deux fonctions `security definer` (`site_est_equipe`, `site_est_super_admin`), une table `site_super_admins`, et des politiques RLS qui donnent la propriété d'un article à son créateur. Côté Next.js 16, un layout `app/admin/layout.tsx` rend une coque cliente qui porte la session, le panneau et l'écran de connexion ; les écrans existants deviennent de simples enfants.

**Tech Stack:** Next.js 16.2 (App Router), React 19.2, TypeScript, Supabase (Postgres 17, PostgREST, MCP compte 4497, projet `nuehdfyscqnkckudkqhe`), tests `node --test` (Node 22, types retirés nativement).

Spec : `docs/superpowers/specs/2026-09-23-admin-coque-et-droits-design.md`.

---

## Règles pour l'exécutant

- **Lire `AGENTS.md`** : cette version de Next diffère de la mémoire d'entraînement. Vérifier dans `node_modules/next/dist/docs/` avant d'utiliser une API Next (`layout.tsx`, `usePathname`, métadonnées). Déjà vérifié pour ce plan : un layout peut être un composant client et recevoir `children` rendus côté serveur.
- **Supabase** : uniquement les outils MCP `mcp__4497d48a-79cd-4b24-bdf1-1339728e2b85__apply_migration` / `execute_sql` / `get_advisors`, avec `project_id: "nuehdfyscqnkckudkqhe"`. Jamais `mcp__supabase__*` (autre projet). Base de production : ne créer que les objets décrits, ne jamais toucher `user_roles`, `is_practitioner()`, `profiles`, ni les tables de l'app.
- **Scénarios SQL** : toujours dans `begin; … rollback;`. Le transport MCP transforme `\uXXXX` en caractère brut : utiliser `chr()` si besoin.
- **Textes visibles** : apostrophe typographique `’`, pas de tirets cadratins ajoutés, style maison (`~/Documents/marqueurs-langage-ia-brief-design.md`).
- **Commits** : `git add <chemins>` explicites, jamais `git add -A`. Terminer chaque message par `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- **Ne jamais manipuler de secret** : aucune clé n'est nécessaire dans ce chantier.

## Carte des fichiers

| Fichier | Rôle |
|---|---|
| `supabase/migrations/20260923120000_site_droits.sql` | table `site_super_admins`, fonctions `site_est_equipe` / `site_est_super_admin` |
| `supabase/migrations/20260923120100_articles_propriete.sql` | colonne `auteur_id`, RLS articles et fiches praticien |
| `supabase/migrations/20260923120200_site_jeux_alba.sql` | état et suppression des données des jeux |
| `supabase/tests/admin.sql` | scénarios de droits, transaction annulée |
| `lib/admin/droits.ts` (+ `.test.ts`) | règles pures : qui peut modifier quoi |
| `lib/admin/acces.ts` | hook de session et de droits pour les écrans |
| `lib/evenements.ts` | annuaire des événements (données écrites à la main) |
| `components/admin/AdminCoque.tsx` | coque : session, panneau, en-tête, menu mobile |
| `components/admin/PanneauAdmin.tsx` | le panneau latéral seul |
| `components/admin/TableauDeBord.tsx` | page d'arrivée et ses quatre blocs |
| `components/admin/EvenementsAdmin.tsx` | écran Événements |
| `app/admin/layout.tsx`, `app/admin/page.tsx`, `app/admin/evenements/page.tsx` | routes |
| modifiés | `components/admin/{ArticleAdmin,ArticleEditor,KlubAdmin,PraticiensAdmin}.tsx`, `app/admin/*/page.tsx` |
| supprimé | `components/admin/AdminNav.tsx` |

---

### Task 0: Espace de travail

- [ ] **Step 1: Vérifier le worktree**

Run: `cd /Users/lucas/Desktop/mugitu-biarritz-admin && git log --oneline -2 && git status --short`
Expected: la spec en tête (`docs : spec de la coque d'admin et des droits`), arbre propre.

- [ ] **Step 2: Installer les dépendances si besoin**

Run: `ls node_modules >/dev/null 2>&1 || npm ci`
Expected: `node_modules` présent.

- [ ] **Step 3: État de départ vert**

Run: `npx tsc --noEmit && npm run lint`
Expected: aucune erreur.

---

### Task 1: Droits en base

**Files:**
- Create: `supabase/migrations/20260923120000_site_droits.sql`, `supabase/tests/admin.sql`

- [ ] **Step 1: Écrire les scénarios `supabase/tests/admin.sql`**

```sql
-- Droits du back-office. Tout se passe dans une transaction annulée : rien
-- n'est écrit. Lancer avec l'outil MCP execute_sql (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « admin : scénarios OK ».

begin;

-- BLOC ÉQUIPE ET SUPER-ADMIN
do $$
declare
  v_lucas uuid;
  v_kine uuid;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_kine from auth.users u where u.email = 'jbc.kine@gmail.com';
  assert v_lucas is not null and v_kine is not null, 'D0 comptes de référence absents';

  -- D1. Lucas est équipe et super-admin.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  assert public.site_est_equipe(), 'D1a';
  assert public.site_est_super_admin(), 'D1b';

  -- D2. Un praticien sans ligne dans site_super_admins est équipe, pas super-admin.
  delete from public.site_super_admins where user_id = v_kine;
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  assert public.site_est_equipe(), 'D2a';
  assert not public.site_est_super_admin(), 'D2b';

  -- D3. Un compte sans rôle n'est rien du tout.
  perform set_config('request.jwt.claims', json_build_object('sub', gen_random_uuid(), 'role', 'authenticated')::text, true);
  assert not public.site_est_equipe(), 'D3a';
  assert not public.site_est_super_admin(), 'D3b';

  -- D4. Le Klub s'aligne sur la même définition de l'équipe.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  assert public.klub__est_equipe(), 'D4';

  perform set_config('request.jwt.claims', '', true);
end $$;
-- FIN BLOC ÉQUIPE

-- BLOC DROITS ANON
set local role anon;
do $$
begin
  begin
    perform public.site_est_super_admin();
    assert false, 'P1 anon peut appeler site_est_super_admin';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.site_est_equipe();
    assert false, 'P2 anon peut appeler site_est_equipe';
  exception when insufficient_privilege then null;
  end;
  begin
    assert (select count(*) from public.site_super_admins) = 0, 'P3 anon lit la liste des super-admins';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
-- FIN BLOC DROITS ANON

rollback;
select 'admin : scénarios OK' as resultat;
```

- [ ] **Step 2: Lancer les scénarios, ils doivent échouer**

Outil `execute_sql` avec le contenu du fichier.
Expected: erreur `function public.site_est_equipe() does not exist`.

- [ ] **Step 3: Écrire `supabase/migrations/20260923120000_site_droits.sql`**

```sql
-- Back-office : deux niveaux de droits.
-- « Équipe » = tout compte ayant un rôle dans user_roles autre que sportif.
-- « Super-admin » = compte inscrit dans site_super_admins (Lucas, JB).
-- Le rôle `admin` de user_roles appartient à l'app praticiens : on n'y touche pas.

create table if not exists public.site_super_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  note text not null default '',
  created_at timestamptz not null default now()
);

alter table public.site_super_admins enable row level security;

create or replace function public.site_est_super_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.site_super_admins s where s.user_id = auth.uid());
$$;

create or replace function public.site_est_equipe()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = auth.uid() and ur.role::text <> 'sportif'
  );
$$;

-- Une seule définition de l'équipe pour tout le site.
create or replace function public.klub__est_equipe()
returns boolean language sql stable security definer set search_path = '' as $$
  select public.site_est_equipe();
$$;

drop policy if exists site_super_admins_lecture on public.site_super_admins;
create policy site_super_admins_lecture on public.site_super_admins
  for select to authenticated using (public.site_est_super_admin());

revoke all on public.site_super_admins from anon;
revoke insert, update, delete, truncate, references, trigger on public.site_super_admins from authenticated;

revoke execute on function public.site_est_super_admin(), public.site_est_equipe() from public, anon;
grant execute on function public.site_est_super_admin(), public.site_est_equipe() to authenticated;

-- Les deux gérants. Ajouter un super-admin se fait par une migration, jamais par l'interface.
insert into public.site_super_admins (user_id, note)
select u.id, 'Gérant de la SCM'
from auth.users u
where u.email in ('lucas.bengosteo@gmail.com', 'jbc.kine@gmail.com')
on conflict (user_id) do nothing;
```

- [ ] **Step 4: Appliquer la migration**

Outil `apply_migration`, `name: "site_droits"`, `query:` le contenu du fichier.
Expected: `{"success": true}`.

- [ ] **Step 5: Relancer les scénarios**

Outil `execute_sql` avec `supabase/tests/admin.sql`.
Expected: `[{"resultat":"admin : scénarios OK"}]`.

- [ ] **Step 6: Vérifier les deux super-admins**

Outil `execute_sql` :

```sql
select u.email, s.note from public.site_super_admins s join auth.users u on u.id = s.user_id order by 1;
```

Expected : `jbc.kine@gmail.com` et `lucas.bengosteo@gmail.com`.

- [ ] **Step 7: Commit**

```bash
git add supabase/migrations/20260923120000_site_droits.sql supabase/tests/admin.sql
git commit -m "admin : équipe et super-admins en base

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Propriété des articles

**Files:**
- Create: `supabase/migrations/20260923120100_articles_propriete.sql`
- Modify: `supabase/tests/admin.sql`

- [ ] **Step 1: Ajouter les scénarios**

Dans `supabase/tests/admin.sql`, insérer ce bloc entre `-- FIN BLOC ÉQUIPE` et `-- BLOC DROITS ANON` :

```sql
-- BLOC ARTICLES
do $$
declare
  v_lucas uuid;
  v_kine uuid;
  v_autre uuid;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_kine from auth.users u where u.email = 'jbc.kine@gmail.com';
  select u.id into v_autre from auth.users u where u.email = 'hugo.daminato@gmail.com';
  assert v_autre is not null, 'A0 compte praticien de test absent';
  delete from public.site_super_admins where user_id in (v_kine, v_autre);

  -- A1. Tous les articles existants appartiennent à Lucas.
  assert not exists (select 1 from public.articles where auteur_id is distinct from v_lucas), 'A1';

  -- A2. Un praticien crée un article à son nom.
  perform set_config('request.jwt.claims', json_build_object('sub', v_autre, 'role', 'authenticated')::text, true);
  set local role authenticated;
  insert into public.articles (slug, title, category, chapo, cover, author, date, status, sections, auteur_id)
  values ('test-hugo', 'Test Hugo', 'Pathologies', '', '/x.jpg',
          '{"name":"Hugo Daminato","job":"Préparateur physique","photo":"","fiche":"/equipe/hugo-daminato"}'::jsonb,
          current_date, 'brouillon', '[]'::jsonb, v_autre);
  assert exists (select 1 from public.articles where slug = 'test-hugo'), 'A2';

  -- A3. Il modifie le sien.
  update public.articles set title = 'Test Hugo 2' where slug = 'test-hugo';
  assert (select title from public.articles where slug = 'test-hugo') = 'Test Hugo 2', 'A3';

  -- A4. Il ne modifie pas celui d'un autre.
  update public.articles set title = 'Détourné' where slug = 'syndrome-rotulien';
  assert (select title from public.articles where slug = 'syndrome-rotulien') <> 'Détourné', 'A4';

  -- A5. Il ne supprime pas celui d'un autre.
  delete from public.articles where slug = 'syndrome-rotulien';
  assert exists (select 1 from public.articles where slug = 'syndrome-rotulien'), 'A5';

  -- A6. Il ne peut pas créer un article au nom d'un autre.
  begin
    insert into public.articles (slug, title, category, chapo, cover, author, date, status, sections, auteur_id)
    values ('test-vol', 'Test vol', 'Pathologies', '', '/x.jpg', '{}'::jsonb, current_date, 'brouillon', '[]'::jsonb, v_lucas);
    assert false, 'A6 un praticien crée un article au nom d’un autre';
  exception when insufficient_privilege then null;
  end;

  -- A7. Il n'écrit pas dans les fiches praticien.
  update public.practitioner_overrides set badge = 'Détourné' where slug is not null;
  assert not exists (select 1 from public.practitioner_overrides where badge = 'Détourné'), 'A7';

  reset role;

  -- A8. Un super-admin modifie l'article d'un autre et change son propriétaire.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  set local role authenticated;
  update public.articles set title = 'Repris par Lucas', auteur_id = v_lucas where slug = 'test-hugo';
  assert (select auteur_id from public.articles where slug = 'test-hugo') = v_lucas, 'A8';
  reset role;

  perform set_config('request.jwt.claims', '', true);
end $$;
-- FIN BLOC ARTICLES
```

- [ ] **Step 2: Lancer les scénarios, ils doivent échouer**

Outil `execute_sql` avec le fichier.
Expected: erreur `column "auteur_id" of relation "articles" does not exist`.

- [ ] **Step 3: Écrire `supabase/migrations/20260923120100_articles_propriete.sql`**

```sql
-- Un article a un propriétaire : le compte qui peut le modifier.
-- La signature affichée sur le site reste la colonne `author` (nom, métier,
-- fiche) : on peut publier un article signé d'un praticien tout en restant
-- celui qui le modifie.

alter table public.articles add column if not exists auteur_id uuid references auth.users (id) on delete set null;

update public.articles
set auteur_id = (select id from auth.users where email = 'lucas.bengosteo@gmail.com')
where auteur_id is null;

create index if not exists articles_auteur on public.articles (auteur_id);

drop policy if exists articles_all_practitioner on public.articles;

create policy articles_lecture_equipe on public.articles
  for select to authenticated using (public.site_est_equipe());

-- Un super-admin peut créer un article au nom de quelqu'un d'autre, pas les autres.
create policy articles_creation on public.articles
  for insert to authenticated
  with check (public.site_est_equipe() and (auteur_id = auth.uid() or public.site_est_super_admin()));

create policy articles_modification on public.articles
  for update to authenticated
  using (public.site_est_equipe() and (auteur_id = auth.uid() or public.site_est_super_admin()))
  with check (public.site_est_equipe() and (auteur_id = auth.uid() or public.site_est_super_admin()));

create policy articles_suppression on public.articles
  for delete to authenticated
  using (public.site_est_equipe() and (auteur_id = auth.uid() or public.site_est_super_admin()));

-- Les fiches praticien passent sous la main des seuls super-admins.
drop policy if exists practitioner_overrides_write on public.practitioner_overrides;
create policy practitioner_overrides_ecriture on public.practitioner_overrides
  for all to authenticated
  using (public.site_est_super_admin())
  with check (public.site_est_super_admin());
```

- [ ] **Step 4: Appliquer la migration**

Outil `apply_migration`, `name: "articles_propriete"`.
Expected: `{"success": true}`.

- [ ] **Step 5: Relancer les scénarios**

Expected: `[{"resultat":"admin : scénarios OK"}]`. Si A4 ou A5 échoue, la politique laisse passer trop : corriger la migration par un nouvel `apply_migration` et reporter la correction dans le fichier.

- [ ] **Step 6: Vérifier que le site public n'a pas bougé**

Outil `execute_sql` :

```sql
select count(*) filter (where auteur_id is null) as sans_proprietaire, count(*) as total from public.articles;
```

Expected : `sans_proprietaire = 0`, `total = 23`.

Puis `curl -s -o /dev/null -w "%{http_code}\n" https://www.mugitu-biarritz.fr/actualites` → `200`.

- [ ] **Step 7: Commit**

```bash
git add supabase/migrations/20260923120100_articles_propriete.sql supabase/tests/admin.sql
git commit -m "admin : chaque article a un propriétaire, fiches praticien réservées

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: État et suppression des données des jeux

**Files:**
- Create: `supabase/migrations/20260923120200_site_jeux_alba.sql`
- Modify: `supabase/tests/admin.sql`

- [ ] **Step 1: Ajouter les scénarios**

Dans `supabase/tests/admin.sql`, insérer ce bloc juste avant `-- BLOC DROITS ANON` :

```sql
-- BLOC JEUX ALBA
do $$
declare
  v_lucas uuid;
  v_autre uuid;
  v_etat jsonb;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_autre from auth.users u where u.email = 'hugo.daminato@gmail.com';
  delete from public.site_super_admins where user_id = v_autre;

  -- J1. L'état est lisible par l'équipe.
  perform set_config('request.jwt.claims', json_build_object('sub', v_autre, 'role', 'authenticated')::text, true);
  v_etat := public.site_jeux_alba_etat();
  assert (v_etat->>'participants')::int >= 0, 'J1 ' || v_etat;

  -- J2. Un praticien ordinaire ne peut pas supprimer.
  begin
    perform public.site_supprimer_jeux_alba();
    assert false, 'J2 attendu SITE_DROITS';
  exception when raise_exception then assert sqlerrm = 'SITE_DROITS', 'J2 ' || sqlerrm;
  end;

  -- J3. Un super-admin supprime, et l'état retombe à zéro.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  v_etat := public.site_supprimer_jeux_alba();
  assert (v_etat->>'participants')::int >= 0, 'J3a ' || v_etat;
  v_etat := public.site_jeux_alba_etat();
  assert (v_etat->>'participants')::int = 0 and (v_etat->>'scores')::int = 0 and (v_etat->>'tirages')::int = 0, 'J3b ' || v_etat;

  perform set_config('request.jwt.claims', '', true);
end $$;
-- FIN BLOC JEUX ALBA
```

La suppression est réelle mais la transaction est annulée : les 18 participants, 66 scores et 9 tirages sont toujours là après le test.

- [ ] **Step 2: Lancer les scénarios, ils doivent échouer**

Expected: erreur `function public.site_jeux_alba_etat() does not exist`.

- [ ] **Step 3: Écrire `supabase/migrations/20260923120200_site_jeux_alba.sql`**

```sql
-- Les jeux du stand de l'Alba Deep Fitness Race 2026.
-- Le règlement annonce la suppression des données au plus tard le
-- 13 octobre 2026 : l'écran Événements montre l'échéance et propose le
-- bouton, réservé aux super-admins.

create or replace function public.site_jeux_alba_etat()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'participants', (select count(*) from public.jeux_participants),
    'scores', (select count(*) from public.jeux_scores),
    'tirages', (select count(*) from public.jeux_tirages)
  );
$$;

create or replace function public.site_supprimer_jeux_alba()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_avant jsonb;
begin
  if not public.site_est_super_admin() then raise exception 'SITE_DROITS'; end if;
  v_avant := public.site_jeux_alba_etat();
  delete from public.jeux_tirages;
  delete from public.jeux_scores;
  delete from public.jeux_participants;
  return v_avant;
end;
$$;

revoke execute on function public.site_jeux_alba_etat(), public.site_supprimer_jeux_alba() from public, anon;
grant execute on function public.site_jeux_alba_etat(), public.site_supprimer_jeux_alba() to authenticated;
```

- [ ] **Step 4: Appliquer la migration**

Outil `apply_migration`, `name: "site_jeux_alba"`.
Expected: `{"success": true}`.

- [ ] **Step 5: Relancer les scénarios et vérifier que rien n'a été perdu**

Expected: `[{"resultat":"admin : scénarios OK"}]`.

Puis `execute_sql` : `select public.site_jeux_alba_etat();`
Expected : `{"participants": 18, "scores": 66, "tirages": 9}`.

- [ ] **Step 6: Conseiller de sécurité**

Outil `get_advisors`, `type: "security"`.
Expected : les alertes connues (fonctions publiques du Klub, `klub_events_touch`), plus les nouvelles fonctions `site_*` signalées comme exécutables par `authenticated` — c'est voulu, elles vérifient les droits dans leur corps. Rien d'autre de nouveau.

- [ ] **Step 7: Commit**

```bash
git add supabase/migrations/20260923120200_site_jeux_alba.sql supabase/tests/admin.sql
git commit -m "admin : état et suppression des données des jeux de l'Alba

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Règles de droits côté interface

**Files:**
- Create: `lib/admin/droits.ts`, `lib/admin/acces.ts`
- Test: `lib/admin/droits.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Étendre le script de test**

Dans `package.json`, remplacer la ligne du script `test` par :

```json
    "test": "node --test lib/klub/*.test.ts lib/admin/*.test.ts",
```

- [ ] **Step 2: Écrire `lib/admin/droits.test.ts`**

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { peutModifierArticle, peutSupprimerArticle, rubriquesVisibles, type Acces } from "./droits.ts";

const equipe: Acces = { etat: "pret", userId: "u1", prenom: "Hugo", estEquipe: true, estSuperAdmin: false };
const patron: Acces = { etat: "pret", userId: "u2", prenom: "Lucas", estEquipe: true, estSuperAdmin: true };
const inconnu: Acces = { etat: "pret", userId: "u3", prenom: "", estEquipe: false, estSuperAdmin: false };

test("un praticien ne modifie que ses articles", () => {
  assert.equal(peutModifierArticle(equipe, "u1"), true);
  assert.equal(peutModifierArticle(equipe, "u2"), false);
  assert.equal(peutModifierArticle(equipe, null), false);
});

test("un super-admin modifie tout, y compris un article sans propriétaire", () => {
  assert.equal(peutModifierArticle(patron, "u1"), true);
  assert.equal(peutModifierArticle(patron, null), true);
});

test("hors équipe, aucun droit", () => {
  assert.equal(peutModifierArticle(inconnu, "u3"), false);
  assert.equal(peutSupprimerArticle(inconnu, "u3"), false);
});

test("la suppression suit la modification", () => {
  assert.equal(peutSupprimerArticle(equipe, "u1"), true);
  assert.equal(peutSupprimerArticle(equipe, "u2"), false);
  assert.equal(peutSupprimerArticle(patron, "u1"), true);
});

test("les rubriques dépendent des droits", () => {
  assert.deepEqual(
    rubriquesVisibles(equipe).map((r) => r.href),
    ["/admin", "/admin/actualites", "/admin/mugi-klub", "/admin/agenda", "/admin/evenements"],
  );
  assert.ok(rubriquesVisibles(patron).some((r) => r.href === "/admin/praticiens"));
  assert.deepEqual(rubriquesVisibles(inconnu), []);
});

test("l’agenda est annoncé mais pas encore ouvert", () => {
  const agenda = rubriquesVisibles(equipe).find((r) => r.href === "/admin/agenda");
  assert.equal(agenda?.bientot, true);
});
```

- [ ] **Step 3: Lancer le test, il doit échouer**

Run: `npm test`
Expected: FAIL, `Cannot find module '.../lib/admin/droits.ts'`.

- [ ] **Step 4: Créer `lib/admin/droits.ts`**

```ts
/**
 * Règles de droits du back-office, côté interface.
 *
 * Elles disent ce que l'écran affiche. La base dit ce qui est possible :
 * les politiques RLS de `articles` et de `practitioner_overrides` refusent
 * tout ce que ces règles masquent. Aucun import : ce fichier est lu tel quel
 * par les tests `node --test`.
 */

export type EtatAcces = "chargement" | "deconnecte" | "pret";

export type Acces = {
  etat: EtatAcces;
  userId: string | null;
  prenom: string;
  estEquipe: boolean;
  estSuperAdmin: boolean;
};

export const ACCES_INITIAL: Acces = {
  etat: "chargement",
  userId: null,
  prenom: "",
  estEquipe: false,
  estSuperAdmin: false,
};

export type Rubrique = {
  href: string;
  label: string;
  groupe: "" | "Contenu" | "Cabinet" | "Super-admin";
  /** Annoncée dans le panneau, pas encore ouverte : chantier de l'agenda. */
  bientot?: boolean;
};

const RUBRIQUES: (Rubrique & { superAdmin?: boolean })[] = [
  { href: "/admin", label: "Tableau de bord", groupe: "" },
  { href: "/admin/actualites", label: "Actualités", groupe: "Contenu" },
  { href: "/admin/mugi-klub", label: "Mugi Klub", groupe: "Contenu" },
  { href: "/admin/agenda", label: "Agenda", groupe: "Cabinet", bientot: true },
  { href: "/admin/evenements", label: "Événements", groupe: "" },
  { href: "/admin/praticiens", label: "Praticiens", groupe: "Super-admin", superAdmin: true },
];

/** Les rubriques du panneau pour ce compte, dans l'ordre d'affichage. */
export function rubriquesVisibles(a: Acces): Rubrique[] {
  if (!a.estEquipe) return [];
  return RUBRIQUES.filter((r) => !r.superAdmin || a.estSuperAdmin).map(({ superAdmin: _, ...r }) => r);
}

export function peutModifierArticle(a: Acces, auteurId: string | null): boolean {
  if (!a.estEquipe) return false;
  if (a.estSuperAdmin) return true;
  return auteurId !== null && auteurId === a.userId;
}

export function peutSupprimerArticle(a: Acces, auteurId: string | null): boolean {
  return peutModifierArticle(a, auteurId);
}
```

- [ ] **Step 5: Lancer le test, il doit passer**

Run: `npm test`
Expected: `# fail 0`.

- [ ] **Step 6: Créer `lib/admin/acces.ts`**

```ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { ACCES_INITIAL, type Acces } from "./droits";

/**
 * Session et droits du back-office, lus une fois et partagés par les écrans.
 *
 * Le prénom vient des métadonnées du compte, à défaut de la partie gauche de
 * l'adresse : ça suffit pour dire bonjour, et ça évite une lecture de plus.
 */
export function useAcces(): Acces & { recharger: () => void } {
  const [acces, setAcces] = useState<Acces>(ACCES_INITIAL);

  const charger = useCallback(async () => {
    const sb = supabaseBrowser();
    const { data } = await sb.auth.getSession();
    const session = data.session;
    if (!session) {
      setAcces({ ...ACCES_INITIAL, etat: "deconnecte" });
      return;
    }
    const [{ data: equipe }, { data: patron }] = await Promise.all([
      sb.rpc("site_est_equipe"),
      sb.rpc("site_est_super_admin"),
    ]);
    const meta = session.user.user_metadata as { prenom?: string; first_name?: string } | null;
    const prenom = meta?.prenom ?? meta?.first_name ?? (session.user.email ?? "").split("@")[0];
    setAcces({
      etat: "pret",
      userId: session.user.id,
      prenom,
      estEquipe: Boolean(equipe),
      estSuperAdmin: Boolean(patron),
    });
  }, []);

  useEffect(() => {
    // Même motif que les autres écrans : on s'abonne à la session, et le
    // premier chargement passe par un timeout (lint React Compiler).
    const { data } = supabaseBrowser().auth.onAuthStateChange(() => {
      void charger();
    });
    const initial = window.setTimeout(() => void charger(), 0);
    return () => {
      data.subscription.unsubscribe();
      window.clearTimeout(initial);
    };
  }, [charger]);

  return { ...acces, recharger: () => void charger() };
}
```

- [ ] **Step 7: Vérifier**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: aucune erreur.

- [ ] **Step 8: Commit**

```bash
git add package.json lib/admin/droits.ts lib/admin/droits.test.ts lib/admin/acces.ts
git commit -m "admin : règles de droits et hook de session

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: La coque et le panneau

**Files:**
- Create: `components/admin/PanneauAdmin.tsx`, `components/admin/AdminCoque.tsx`, `app/admin/layout.tsx`
- Modify: `lib/admin/acces.ts`
- Delete: `components/admin/AdminNav.tsx`
- Modify: `components/admin/ArticleAdmin.tsx`, `components/admin/KlubAdmin.tsx`, `components/admin/PraticiensAdmin.tsx`

- [ ] **Step 1: Ajouter le contexte dans `lib/admin/acces.ts`**

En tête du fichier, remplacer la ligne d'import de React par :

```ts
import { createContext, useCallback, useContext, useEffect, useState } from "react";
```

Et ajouter à la fin du fichier :

```ts
/** Les droits, calculés une fois par la coque et lus par les écrans. */
export const AccesContexte = createContext<Acces | null>(null);

export function useAccesCourant(): Acces {
  const valeur = useContext(AccesContexte);
  if (!valeur) throw new Error("[admin] useAccesCourant hors de la coque d’admin");
  return valeur;
}
```

- [ ] **Step 2: Créer `components/admin/PanneauAdmin.tsx`**

```tsx
"use client";

import Link from "next/link";
import { rubriquesVisibles, type Acces } from "@/lib/admin/droits";

/**
 * Panneau latéral du back-office. Blanc et sobre : c'est un outil de
 * travail, pas une vitrine. La rubrique active est surlignée, l'agenda est
 * annoncé mais désactivé tant que son chantier n'est pas livré.
 */
export default function PanneauAdmin({
  acces,
  chemin,
  onNaviguer,
  onDeconnexion,
}: {
  acces: Acces;
  chemin: string;
  onNaviguer: () => void;
  onDeconnexion: () => void;
}) {
  const rubriques = rubriquesVisibles(acces);
  let groupeRendu = "";

  const lien = (actif: boolean, bientot: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "8px 10px",
    borderRadius: 9,
    marginBottom: 2,
    fontSize: 13.5,
    textDecoration: "none",
    color: actif ? "#04A49B" : bientot ? "rgba(51,51,52,.45)" : "#003850",
    background: actif ? "rgba(4,164,155,.1)" : "transparent",
    fontWeight: actif ? 700 : 500,
    cursor: bientot ? "default" : "pointer",
  });

  const pastille = (actif: boolean): React.CSSProperties => ({
    width: 15,
    height: 15,
    borderRadius: 5,
    flex: "0 0 auto",
    background: actif ? "#04A49B" : "rgba(0,56,80,.16)",
  });

  return (
    <nav aria-label="Sections du back-office" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "16px 10px" }}>
      <p style={{ margin: "0 0 14px", padding: "0 10px", fontSize: 16, fontWeight: 800, color: "#003850" }}>
        mugitu{" "}
        <span style={{ fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: "#04A49B" }}>admin</span>
      </p>

      {rubriques.map((r) => {
        const actif = chemin === r.href || (r.href !== "/admin" && chemin.startsWith(`${r.href}/`));
        const entete =
          r.groupe && r.groupe !== groupeRendu ? (
            <p key={`g-${r.groupe}`} style={{ margin: "14px 10px 5px", fontSize: 9.5, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(51,51,52,.5)" }}>
              {r.groupe}
            </p>
          ) : null;
        if (r.groupe) groupeRendu = r.groupe;

        return (
          <div key={r.href}>
            {entete}
            {r.bientot ? (
              <span style={lien(false, true)} aria-disabled="true">
                <span aria-hidden="true" style={pastille(false)} />
                {r.label}
                <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: "rgba(51,51,52,.4)" }}>bientôt</span>
              </span>
            ) : (
              <Link href={r.href} onClick={onNaviguer} aria-current={actif ? "page" : undefined} style={lien(actif, false)}>
                <span aria-hidden="true" style={pastille(actif)} />
                {r.label}
              </Link>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid rgba(0,56,80,.1)", fontSize: 12.5 }}>
        <p style={{ margin: "0 0 6px", padding: "0 10px", color: "#003850", fontWeight: 600 }}>{acces.prenom}</p>
        <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "6px 10px", color: "rgba(51,51,52,.6)", textDecoration: "none" }}>
          Voir le site ↗
        </a>
        <button
          type="button"
          onClick={onDeconnexion}
          style={{ padding: "6px 10px", border: "none", background: "none", font: "inherit", fontSize: 12.5, color: "rgba(51,51,52,.6)", cursor: "pointer" }}
        >
          Se déconnecter
        </button>
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Créer `components/admin/AdminCoque.tsx`**

```tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AccesContexte, useAcces } from "@/lib/admin/acces";
import { supabaseBrowser } from "@/lib/supabase-browser";
import AdminLogin from "./AdminLogin";
import PanneauAdmin from "./PanneauAdmin";

/**
 * Coque du back-office : session, panneau, menu de téléphone.
 *
 * Elle porte l'écran de connexion pour tout l'admin — les écrans n'ont plus
 * qu'à afficher leur contenu. Les droits sont calculés ici une fois et
 * passés aux écrans par le contexte.
 */

const LARGEUR = 196;

export default function AdminCoque({ children }: { children: React.ReactNode }) {
  const acces = useAcces();
  const chemin = usePathname() ?? "/admin";
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [etroit, setEtroit] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const suivre = () => setEtroit(mq.matches);
    suivre();
    mq.addEventListener("change", suivre);
    return () => mq.removeEventListener("change", suivre);
  }, []);

  useEffect(() => {
    const echap = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOuvert(false);
    };
    window.addEventListener("keydown", echap);
    return () => window.removeEventListener("keydown", echap);
  }, []);

  if (acces.etat === "chargement") {
    return <p style={{ padding: 40, fontSize: 15, color: "rgba(51,51,52,.6)" }}>Chargement…</p>;
  }
  if (acces.etat === "deconnecte") {
    return <AdminLogin titre="Back-office Mugitu" onSignedIn={acces.recharger} />;
  }
  if (!acces.estEquipe) {
    return (
      <main style={{ padding: 40, maxWidth: 520 }}>
        <h1 style={{ fontSize: 20, color: "#003850" }}>Ce compte n’a pas accès au back-office</h1>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(51,51,52,.7)" }}>
          Demandez à Lucas ou à Jean-Baptiste de vous ouvrir l’accès, ou connectez-vous avec une autre adresse.
        </p>
        <button
          type="button"
          onClick={() => void supabaseBrowser().auth.signOut()}
          style={{ padding: "10px 20px", borderRadius: 999, border: "1px solid rgba(0,56,80,.2)", background: "#fff", font: "inherit", fontSize: 14, cursor: "pointer" }}
        >
          Se déconnecter
        </button>
      </main>
    );
  }

  const panneau = (
    <PanneauAdmin
      acces={acces}
      chemin={chemin}
      onNaviguer={() => setMenuOuvert(false)}
      onDeconnexion={() => void supabaseBrowser().auth.signOut()}
    />
  );

  return (
    <AccesContexte.Provider value={acces}>
      <div style={{ minHeight: "100vh", background: "#FDF8F4", display: "flex" }}>
        {etroit ? (
          <>
            {menuOuvert && (
              <>
                <div
                  onClick={() => setMenuOuvert(false)}
                  style={{ position: "fixed", inset: 0, background: "rgba(0,20,28,.45)", zIndex: 40 }}
                />
                <div style={{ position: "fixed", top: 0, bottom: 0, left: 0, width: LARGEUR, background: "#fff", borderRight: "1px solid rgba(0,56,80,.1)", zIndex: 41 }}>
                  {panneau}
                </div>
              </>
            )}
          </>
        ) : (
          <aside style={{ width: LARGEUR, flex: `0 0 ${LARGEUR}px`, background: "#fff", borderRight: "1px solid rgba(0,56,80,.1)", position: "sticky", top: 0, height: "100vh" }}>
            {panneau}
          </aside>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          {etroit && (
            <button
              type="button"
              onClick={() => setMenuOuvert(true)}
              aria-label="Ouvrir le menu"
              style={{ margin: "12px 0 0 12px", padding: "8px 14px", borderRadius: 999, border: "1px solid rgba(0,56,80,.16)", background: "#fff", font: "inherit", fontSize: 14, cursor: "pointer" }}
            >
              ☰ Menu
            </button>
          )}
          {children}
        </div>
      </div>
    </AccesContexte.Provider>
  );
}
```

- [ ] **Step 4: Créer `app/admin/layout.tsx`**

```tsx
import type { Metadata } from "next";
import AdminCoque from "@/components/admin/AdminCoque";

export const metadata: Metadata = {
  // Un back-office n’a rien à faire dans les moteurs de recherche.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminCoque>{children}</AdminCoque>;
}
```

- [ ] **Step 5: Retirer l'ancienne navigation des trois écrans**

Dans `components/admin/ArticleAdmin.tsx`, `components/admin/KlubAdmin.tsx` et `components/admin/PraticiensAdmin.tsx` :

1. Supprimer les imports `AdminLogin` et `AdminNav`.
2. Supprimer les branches `if (etat === "chargement")` et `if (etat === "deconnecte")` qui rendaient un écran de connexion, ainsi que l'état `etat` s'il ne sert plus qu'à ça, et la fonction `deconnexion` là où elle existe.
3. Supprimer le `<header style={{ background: "#003850" … }}>…</header>` de chaque écran et le `<div style={{ minHeight: "100vh", background: "#FDF8F4" }}>` qui l'entoure : la coque fournit désormais le fond et la navigation.
4. Remettre en tête de chaque écran un titre simple et, pour les actions qui vivaient dans le bandeau (« Nouvel article », les onglets Séances/Créneaux du Klub), une barre locale :

```tsx
<div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "clamp(14px,3vw,24px) clamp(14px,3vw,24px) 0" }}>
  <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#003850" }}>Actualités</h1>
  {/* boutons de l'écran */}
</div>
```

Les boutons gardent leurs styles existants, seule leur couleur de fond change si elle était pensée pour le bandeau bleu : `background: "#04A49B"` et texte blanc pour l'action principale, contour `1px solid rgba(0,56,80,.18)` et texte `#003850` pour les autres.

- [ ] **Step 6: Supprimer l'ancienne navigation**

```bash
git rm components/admin/AdminNav.tsx
```

Puis vérifier qu'il ne reste aucune référence :

Run: `git grep -n "AdminNav" -- ':!docs'`
Expected: aucune ligne.

- [ ] **Step 7: Vérifier**

Run: `npx tsc --noEmit && npm run lint && npm test && npm run build`
Expected: aucune erreur. Le build liste `/admin`, `/admin/actualites`, `/admin/mugi-klub`, `/admin/praticiens`.

- [ ] **Step 8: Commit**

```bash
git add lib/admin/acces.ts components/admin/PanneauAdmin.tsx components/admin/AdminCoque.tsx app/admin/layout.tsx components/admin/ArticleAdmin.tsx components/admin/KlubAdmin.tsx components/admin/PraticiensAdmin.tsx
git commit -m "admin : coque à panneau latéral, connexion unique

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Tableau de bord

**Files:**
- Create: `app/admin/page.tsx`, `components/admin/TableauDeBord.tsx`

- [ ] **Step 1: Créer `components/admin/TableauDeBord.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAccesCourant } from "@/lib/admin/acces";
import { dateHeure } from "@/lib/klub/format";
import { supabaseBrowser } from "@/lib/supabase-browser";

/**
 * Page d'arrivée du back-office : ce qui demande une action, et rien d'autre.
 * Un bloc sans contenu disparaît ; quand tout est à jour, l'écran le dit.
 */

type Seance = {
  id: string;
  debut: string;
  titre: string;
  capacite: number | null;
  inscription_requise: boolean;
  klub_inscriptions: { statut: string }[];
};

type MailErreur = { id: string; type: string };

type ArticleCourt = { slug: string; title: string; status: string; publish_at: string | null; auteur_id: string | null };

const CARTE: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  padding: 14,
  boxShadow: "0 2px 10px rgba(60,40,30,.06)",
};

const LIGNE: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  alignItems: "center",
  fontSize: 12.5,
  padding: "7px 0",
  borderTop: "1px solid rgba(0,56,80,.08)",
  color: "#003850",
  textDecoration: "none",
};

const ETAT = (fond: string, texte: string): React.CSSProperties => ({
  fontSize: 10.5,
  fontWeight: 700,
  padding: "3px 8px",
  borderRadius: 999,
  whiteSpace: "nowrap",
  background: fond,
  color: texte,
  fontVariantNumeric: "tabular-nums",
});

export default function TableauDeBord() {
  const acces = useAccesCourant();
  const [seances, setSeances] = useState<Seance[]>([]);
  const [mails, setMails] = useState<MailErreur[]>([]);
  const [articles, setArticles] = useState<ArticleCourt[]>([]);
  const [soucis, setSoucis] = useState<string[]>([]);

  const charger = useCallback(async () => {
    const sb = supabaseBrowser();
    const maintenant = Date.now();
    const [s, m, a] = await Promise.all([
      sb
        .from("klub_seances")
        .select("id, debut, titre, capacite, inscription_requise, klub_inscriptions(statut)")
        .eq("statut", "publiee")
        .gte("debut", new Date(maintenant).toISOString())
        .lt("debut", new Date(maintenant + 7 * 86400_000).toISOString())
        .order("debut"),
      sb.from("klub_mails").select("id, type").eq("statut", "erreur").limit(20),
      sb.from("articles").select("slug, title, status, publish_at, auteur_id").neq("status", "publie").order("date", { ascending: false }),
    ]);
    const erreurs: string[] = [];
    if (s.error) erreurs.push("séances du Klub");
    if (m.error) erreurs.push("mails du Klub");
    if (a.error) erreurs.push("articles");
    setSoucis(erreurs);
    setSeances((s.data ?? []) as Seance[]);
    setMails((m.data ?? []) as MailErreur[]);
    setArticles(((a.data ?? []) as ArticleCourt[]).filter((x) => acces.estSuperAdmin || x.auteur_id === acces.userId));
  }, [acces.estSuperAdmin, acces.userId]);

  useEffect(() => {
    const t = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(t);
  }, [charger]);

  const compte = (s: Seance, statut: string) => s.klub_inscriptions.filter((i) => i.statut === statut).length;
  const completes = seances.filter((s) => s.inscription_requise && s.capacite !== null && compte(s, "confirmee") >= s.capacite);
  const aRelire = articles.filter((a) => a.status === "relecture");
  const aTraiter = mails.length + aRelire.length + completes.length;
  const riens = seances.length === 0 && aTraiter === 0 && articles.length === 0;

  const aujourdhui = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <div style={{ padding: "clamp(14px,3vw,26px)" }}>
      <h1 style={{ margin: "0 0 2px", fontSize: 21, fontWeight: 700, color: "#003850" }}>Bonjour {acces.prenom}</h1>
      <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "rgba(51,51,52,.6)" }}>
        {aujourdhui.charAt(0).toUpperCase() + aujourdhui.slice(1)}
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        <Link href="/admin/actualites" style={{ padding: "8px 16px", borderRadius: 999, background: "#04A49B", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Nouvel article
        </Link>
        <Link href="/admin/mugi-klub" style={{ padding: "8px 16px", borderRadius: 999, background: "#003850", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Nouvelle séance
        </Link>
      </div>

      {soucis.length > 0 && (
        <p role="alert" style={{ ...CARTE, marginBottom: 12, color: "#9E4433", fontSize: 13 }}>
          Impossible de charger : {soucis.join(", ")}. Rechargez la page.
        </p>
      )}

      {riens && soucis.length === 0 && (
        <p style={{ ...CARTE, fontSize: 14, color: "rgba(51,51,52,.7)" }}>Rien ne demande votre attention.</p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(255px,1fr))", gap: 12 }}>
        {seances.length > 0 && (
          <section style={CARTE}>
            <h2 style={{ margin: "0 0 10px", fontSize: 13, color: "#003850" }}>Mugi Klub, 7 prochains jours</h2>
            {seances.map((s) => {
              const c = compte(s, "confirmee");
              const att = compte(s, "attente");
              const plein = s.capacite !== null && c >= s.capacite;
              return (
                <Link key={s.id} href="/admin/mugi-klub" style={LIGNE}>
                  <span>
                    {dateHeure(s.debut)} · {s.titre}
                  </span>
                  <span style={plein ? ETAT("rgba(243,190,121,.3)", "#8a5a10") : ETAT("rgba(4,164,155,.16)", "#04A49B")}>
                    {s.inscription_requise ? `${c} / ${s.capacite}` : "Entrée libre"}
                    {att > 0 ? ` · ${att} en attente` : ""}
                  </span>
                </Link>
              );
            })}
          </section>
        )}

        {aTraiter > 0 && (
          <section style={{ ...CARTE, borderLeft: "3px solid #EE806C" }}>
            <h2 style={{ margin: "0 0 10px", fontSize: 13, color: "#003850" }}>À traiter · {aTraiter}</h2>
            {mails.length > 0 && (
              <Link href="/admin/mugi-klub" style={LIGNE}>
                <span>
                  {mails.length} mail{mails.length > 1 ? "s" : ""} du Klub en erreur
                </span>
                <span style={ETAT("rgba(238,128,108,.22)", "#9E4433")}>Relancer</span>
              </Link>
            )}
            {aRelire.map((a) => (
              <Link key={a.slug} href="/admin/actualites" style={LIGNE}>
                <span>« {a.title} » attend une relecture</span>
                <span style={ETAT("rgba(243,190,121,.3)", "#8a5a10")}>Relecture</span>
              </Link>
            ))}
            {completes.map((s) => (
              <Link key={s.id} href="/admin/mugi-klub" style={LIGNE}>
                <span>
                  {dateHeure(s.debut)} · {s.titre} est complète
                </span>
                <span style={ETAT("rgba(243,190,121,.3)", "#8a5a10")}>{compte(s, "attente")} en attente</span>
              </Link>
            ))}
          </section>
        )}

        {articles.length > 0 && (
          <section style={CARTE}>
            <h2 style={{ margin: "0 0 10px", fontSize: 13, color: "#003850" }}>
              {acces.estSuperAdmin ? "Articles en cours" : "Mes articles"}
            </h2>
            {articles.slice(0, 6).map((a) => (
              <Link key={a.slug} href="/admin/actualites" style={LIGNE}>
                <span>{a.title || a.slug}</span>
                <span style={ETAT("rgba(51,51,52,.08)", "rgba(51,51,52,.6)")}>
                  {a.status === "programme" && a.publish_at ? `Programmé ${jourCourt(a.publish_at)}` : a.status === "relecture" ? "Relecture" : "Brouillon"}
                </span>
              </Link>
            ))}
          </section>
        )}

        <section style={CARTE}>
          <h2 style={{ margin: "0 0 10px", fontSize: 13, color: "#003850" }}>Aujourd’hui au cabinet</h2>
          <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: "rgba(51,51,52,.6)" }}>
            L’agenda partagé arrive bientôt : chacun y posera ses créneaux au cabinet, et cet écran dira qui occupe quelle salle.
          </p>
        </section>
      </div>
    </div>
  );
}
```

Note : `dateHeure` vient de `lib/klub/format.ts`, livré au chantier du Klub, et formate à l'heure de Paris. Pour un article programmé, l'heure n'apporte rien : remplacer l'appel `heure(a.publish_at)` par `jourCourt(a.publish_at)`, une fonction locale placée en haut du fichier et utilisée telle quelle, et retirer `heure` de l'import :

```ts
/** « 2 oct. », heure de Paris. */
const jourCourt = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "short" }).format(new Date(iso));
```

- [ ] **Step 2: Créer `app/admin/page.tsx`**

```tsx
import type { Metadata } from "next";
import TableauDeBord from "@/components/admin/TableauDeBord";

export const metadata: Metadata = {
  title: "Back-office Mugitu",
};

export default function AdminPage() {
  return <TableauDeBord />;
}
```

- [ ] **Step 3: Vérifier le contrat des lectures**

Outil `execute_sql` (lecture seule) pour confirmer les noms de colonnes utilisés :

```sql
select count(*) from public.klub_seances s left join public.klub_inscriptions i on i.seance_id = s.id where s.statut = 'publiee';
select count(*) from public.klub_mails where statut = 'erreur';
select slug, status, publish_at, auteur_id from public.articles where status <> 'publie' limit 3;
```

Expected : aucune erreur de colonne.

- [ ] **Step 4: Vérifier**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: aucune erreur, `/admin` apparaît dans la liste des routes.

- [ ] **Step 5: Commit**

```bash
git add app/admin/page.tsx components/admin/TableauDeBord.tsx
git commit -m "admin : tableau de bord d'arrivée

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Rubrique Événements

**Files:**
- Create: `lib/evenements.ts`, `components/admin/EvenementsAdmin.tsx`, `app/admin/evenements/page.tsx`

- [ ] **Step 1: Créer `lib/evenements.ts`**

```ts
/**
 * Annuaire des événements auxquels Mugitu tient un stand.
 *
 * Écrit à la main : deux entrées aujourd'hui, une ligne à ajouter quand un
 * stand se présente. Un vrai gestionnaire (créer l'événement, ses épreuves,
 * son QR) reste à ouvrir le jour où ça se répète.
 */

export type Evenement = {
  id: string;
  nom: string;
  dates: string;
  /** Vrai quand l'événement est passé : la fiche le dit et range les liens. */
  passe: boolean;
  resume: string;
  liens: { label: string; href: string }[];
  /** Les jeux de l'Alba ont des données à supprimer ; l'Avirun n'en a pas. */
  donnees?: "jeux-alba";
};

export const EVENEMENTS: Evenement[] = [
  {
    id: "alba-2026",
    nom: "Alba Deep Fitness Race 2026",
    dates: "12 et 13 septembre 2026",
    passe: true,
    resume:
      "Stand Mugitu dans la Recovery Area, avec quatre jeux mesurés au matériel VALD et un tirage au sort des lots.",
    liens: [
      { label: "La page des jeux", href: "/jeux" },
      { label: "Le règlement", href: "/jeux/reglement" },
      { label: "L’outil du stand", href: "/jeux/stand" },
      { label: "L’article du compte rendu", href: "/actualites/alba-deep-fitness-race-2026-retour" },
    ],
    donnees: "jeux-alba",
  },
  {
    id: "avirun-2026",
    nom: "Concours Avirun 2K26",
    dates: "2026",
    passe: true,
    resume:
      "Concours relayé sur Instagram : la page publique affiche le nombre de participations, lu sur les commentaires du post. Aucune donnée n’est stockée.",
    liens: [
      { label: "La page du concours", href: "/concours-avirun-2026" },
      { label: "La version basque", href: "/eu/concours-avirun-2026" },
    ],
  },
];

/** Échéance annoncée par le règlement des jeux de l'Alba. */
export const ECHEANCE_JEUX_ALBA = "13 octobre 2026";
```

- [ ] **Step 2: Créer `components/admin/EvenementsAdmin.tsx`**

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccesCourant } from "@/lib/admin/acces";
import { ECHEANCE_JEUX_ALBA, EVENEMENTS } from "@/lib/evenements";
import { supabaseBrowser } from "@/lib/supabase-browser";

/**
 * Annuaire des événements. Lecture pour toute l'équipe ; la suppression des
 * données des jeux est réservée aux super-admins, et la base le vérifie.
 */

type EtatJeux = { participants: number; scores: number; tirages: number };

export default function EvenementsAdmin() {
  const acces = useAccesCourant();
  const [jeux, setJeux] = useState<EtatJeux | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [occupe, setOccupe] = useState(false);

  const charger = useCallback(async () => {
    const { data, error } = await supabaseBrowser().rpc("site_jeux_alba_etat");
    if (error) {
      setMessage(`État des jeux illisible : ${error.message}`);
      return;
    }
    setJeux(data as EtatJeux);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(t);
  }, [charger]);

  const supprimer = async () => {
    if (!jeux) return;
    const total = jeux.participants + jeux.scores + jeux.tirages;
    if (!window.confirm(`Supprimer définitivement les ${total} lignes des jeux de l’Alba ? Cette action est irréversible.`)) return;
    setOccupe(true);
    const { error } = await supabaseBrowser().rpc("site_supprimer_jeux_alba");
    setOccupe(false);
    if (error) {
      setMessage(`Suppression refusée : ${error.message}`);
      return;
    }
    setMessage("Données des jeux supprimées.");
    await charger();
  };

  const carte: React.CSSProperties = {
    background: "#fff",
    borderRadius: 14,
    padding: "clamp(16px,2.5vw,24px)",
    boxShadow: "0 2px 10px rgba(60,40,30,.06)",
    marginBottom: 14,
  };

  return (
    <div style={{ padding: "clamp(14px,3vw,26px)", maxWidth: 820 }}>
      <h1 style={{ margin: "0 0 4px", fontSize: 21, fontWeight: 700, color: "#003850" }}>Événements</h1>
      <p style={{ margin: "0 0 18px", fontSize: 13.5, color: "rgba(51,51,52,.65)" }}>
        Les stands passés et leurs outils. Une entrée s’ajoute dans le code, au moment où un nouveau stand se prépare.
      </p>

      {message && (
        <p role="status" style={{ ...carte, padding: "12px 14px", color: "#036b66", fontSize: 13.5, fontWeight: 600 }}>
          {message}
        </p>
      )}

      {EVENEMENTS.map((e) => (
        <section key={e.id} style={carte}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#003850" }}>{e.nom}</h2>
            <span style={{ fontSize: 12, color: "rgba(51,51,52,.55)" }}>{e.dates}</span>
            {e.passe && (
              <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: "rgba(51,51,52,.08)", color: "rgba(51,51,52,.6)" }}>
                Passé
              </span>
            )}
          </div>
          <p style={{ margin: "8px 0 12px", fontSize: 14, lineHeight: 1.6, color: "rgba(51,51,52,.75)" }}>{e.resume}</p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {e.liens.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: "7px 13px", borderRadius: 999, border: "1px solid rgba(0,56,80,.18)", color: "#003850", fontSize: 12.5, fontWeight: 600, textDecoration: "none" }}
              >
                {l.label} ↗
              </a>
            ))}
          </div>

          {e.donnees === "jeux-alba" && (
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(0,56,80,.1)" }}>
              {jeux === null ? (
                <p style={{ margin: 0, fontSize: 13, color: "rgba(51,51,52,.6)" }}>Lecture de l’état des données…</p>
              ) : jeux.participants + jeux.scores + jeux.tirages === 0 ? (
                <p style={{ margin: 0, fontSize: 13, color: "rgba(51,51,52,.6)" }}>
                  Les données des jeux ont été supprimées, comme l’annonçait le règlement.
                </p>
              ) : (
                <>
                  <p style={{ margin: "0 0 8px", fontSize: 13.5, color: "#003850" }}>
                    {jeux.participants} participants, {jeux.scores} scores, {jeux.tirages} tirages encore en base.
                  </p>
                  <p style={{ margin: "0 0 10px", fontSize: 12.5, color: "#8a5a10" }}>
                    Le règlement annonce leur suppression au plus tard le {ECHEANCE_JEUX_ALBA}.
                  </p>
                  {acces.estSuperAdmin && (
                    <button
                      type="button"
                      disabled={occupe}
                      onClick={() => void supprimer()}
                      style={{ padding: "9px 18px", borderRadius: 999, border: "1px solid rgba(194,65,12,.35)", background: "transparent", color: "#C2410C", font: "inherit", fontSize: 13.5, fontWeight: 600, cursor: occupe ? "default" : "pointer" }}
                    >
                      {occupe ? "Suppression…" : "Supprimer les données des jeux"}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Créer `app/admin/evenements/page.tsx`**

```tsx
import type { Metadata } from "next";
import EvenementsAdmin from "@/components/admin/EvenementsAdmin";

export const metadata: Metadata = {
  title: "Back-office — Événements",
};

export default function AdminEvenementsPage() {
  return <EvenementsAdmin />;
}
```

- [ ] **Step 4: Vérifier**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: aucune erreur, `/admin/evenements` dans la liste des routes.

- [ ] **Step 5: Commit**

```bash
git add lib/evenements.ts components/admin/EvenementsAdmin.tsx app/admin/evenements/page.tsx
git commit -m "admin : annuaire des événements et suppression des données des jeux

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: Propriété des articles dans l'écran

**Files:**
- Modify: `components/admin/ArticleAdmin.tsx`, `components/admin/ArticleEditor.tsx`

- [ ] **Step 1: Adapter `ArticleEditor`**

Dans `components/admin/ArticleEditor.tsx` :

1. Étendre le type `Draft` pour porter le propriétaire :

```ts
export type Draft = Omit<Article, "views" | "likes"> & { auteur_id: string | null };
```

2. Dans `nouvelArticle()`, ajouter `auteur_id: null` au dernier rang de l'objet retourné — la valeur est fixée à l'enregistrement par `ArticleAdmin`.
3. Remplacer la prop `estAdmin` par `estSuperAdmin` (même sens, nom aligné sur le reste) et, dans le bloc réservé à l'administrateur, ajouter le choix du propriétaire :

```tsx
{estSuperAdmin && (
  <label style={{ display: "block", marginTop: 12 }}>
    <span style={LABEL}>Propriétaire (qui peut modifier cet article)</span>
    <select
      style={CHAMP}
      value={draft.auteur_id ?? ""}
      onChange={(e) => set("auteur_id", e.target.value || null)}
    >
      <option value="">— personne —</option>
      {comptes.map((c) => (
        <option key={c.user_id} value={c.user_id}>
          {c.nom}
        </option>
      ))}
    </select>
  </label>
)}
```

`comptes` est une nouvelle prop : `{ user_id: string; nom: string }[]`, fournie par `ArticleAdmin`. `LABEL` et `CHAMP` sont les styles déjà définis dans le fichier ; si leurs noms diffèrent, reprendre ceux utilisés par les champs voisins.

- [ ] **Step 2: Adapter `ArticleAdmin`**

Dans `components/admin/ArticleAdmin.tsx` :

1. Supprimer l'appel `sb.rpc("has_role", …)` et l'état `estAdmin` : les droits viennent du contexte.

```tsx
import { useAccesCourant } from "@/lib/admin/acces";
import { peutModifierArticle, peutSupprimerArticle } from "@/lib/admin/droits";
```

```tsx
const acces = useAccesCourant();
```

2. Charger la liste des comptes pour le choix du propriétaire, seulement pour un super-admin :

```tsx
const [comptes, setComptes] = useState<{ user_id: string; nom: string }[]>([]);
```

Dans `charger()` :

```tsx
const { data: rows, error } = await sb.from("articles").select("*").order("date", { ascending: false });
if (error) notifier(`Lecture impossible : ${error.message}`);
setArticles((rows ?? []) as Draft[]);
if (acces.estSuperAdmin) {
  const { data: profils } = await sb.from("profiles").select("id, first_name, last_name");
  setComptes(
    (profils ?? []).map((p: { id: string; first_name: string | null; last_name: string | null }) => ({
      user_id: p.id,
      nom: [p.first_name, p.last_name].filter(Boolean).join(" ") || p.id.slice(0, 8),
    })),
  );
}
```

3. À l'enregistrement, poser le propriétaire sur un article neuf :

```tsx
const aEnregistrer: Draft = { ...draft, auteur_id: draft.auteur_id ?? acces.userId };
const { error } = await supabaseBrowser().from("articles").upsert(aEnregistrer, { onConflict: "slug" });
```

4. Conditionner les actions :

```tsx
const modifiable = peutModifierArticle(acces, draft?.auteur_id ?? null);
```

Le bouton « Enregistrer » est `disabled={occupe || !modifiable}`, le bouton « Supprimer » ne s'affiche que si `peutSupprimerArticle(acces, draft.auteur_id)`. Quand `modifiable` est faux, afficher au-dessus des boutons :

```tsx
<p style={{ margin: 0, fontSize: 13, color: "#8a5a10" }}>
  Cet article appartient à quelqu’un d’autre : vous pouvez le lire, pas le modifier.
</p>
```

5. Ajouter le filtre « Mes articles » au-dessus de la liste :

```tsx
const [mesArticles, setMesArticles] = useState(false);
```

```tsx
<label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#003850", marginBottom: 10 }}>
  <input type="checkbox" checked={mesArticles} onChange={(e) => setMesArticles(e.target.checked)} />
  Mes articles seulement
</label>
```

et dans le calcul de `filtres`, ajouter `.filter((a) => !mesArticles || a.auteur_id === acces.userId)`.

6. Dans chaque ligne de la liste, ajouter une mention discrète quand l'article n'est pas à soi :

```tsx
{a.auteur_id !== acces.userId && (
  <span style={{ fontSize: 10.5, color: "rgba(51,51,52,.45)" }}>· {a.author.name}</span>
)}
```

7. Passer les nouvelles props à l'éditeur :

```tsx
<ArticleEditor draft={draft} onChange={(maj) => setDraft((d) => (d ? maj(d) : d))} estSuperAdmin={acces.estSuperAdmin} comptes={comptes} />
```

- [ ] **Step 3: Vérifier le contrat de la table des profils**

Outil `execute_sql` :

```sql
select column_name from information_schema.columns where table_schema = 'public' and table_name = 'profiles' and column_name in ('id','first_name','last_name');
```

Expected : les trois colonnes. Si `profiles` n'est pas lisible par un praticien (politique RLS), remplacer la liste des comptes par la liste des praticiens du code (`TEAM` dans `lib/team.ts`) associée à leur `user_id` via une table de correspondance — et le signaler dans le rapport plutôt que d'inventer une jointure.

- [ ] **Step 4: Vérifier**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: aucune erreur.

- [ ] **Step 5: Commit**

```bash
git add components/admin/ArticleAdmin.tsx components/admin/ArticleEditor.tsx
git commit -m "admin : chacun modifie ses articles, les gérants modifient tout

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 9: Garde de la rubrique Praticiens

**Files:**
- Modify: `components/admin/PraticiensAdmin.tsx`

- [ ] **Step 1: Ajouter la garde**

En tête du composant :

```tsx
import { useAccesCourant } from "@/lib/admin/acces";
```

```tsx
const acces = useAccesCourant();
```

Juste avant le rendu principal :

```tsx
if (!acces.estSuperAdmin) {
  return (
    <div style={{ padding: "clamp(14px,3vw,26px)", maxWidth: 560 }}>
      <h1 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#003850" }}>Rubrique réservée</h1>
      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "rgba(51,51,52,.7)" }}>
        Les fiches praticien sont gérées par Lucas et Jean-Baptiste. Pour une correction sur votre fiche, écrivez-leur.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Vérifier que la base refuse aussi**

Outil `execute_sql`, dans une transaction annulée :

```sql
begin;
select set_config('request.jwt.claims', json_build_object('sub', (select id from auth.users where email = 'hugo.daminato@gmail.com'), 'role', 'authenticated')::text, true);
set local role authenticated;
update public.practitioner_overrides set badge = 'Test' where slug is not null;
select count(*) as modifiees from public.practitioner_overrides where badge = 'Test';
reset role;
rollback;
```

Expected : `modifiees = 0`.

- [ ] **Step 3: Vérifier**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: aucune erreur.

- [ ] **Step 4: Commit**

```bash
git add components/admin/PraticiensAdmin.tsx
git commit -m "admin : fiches praticien réservées aux gérants

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 10: Vérification d'ensemble et mise en ligne

- [ ] **Step 1: Tout vérifier**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: tests verts, aucune erreur, routes `/admin`, `/admin/actualites`, `/admin/evenements`, `/admin/mugi-klub`, `/admin/praticiens`.

Outil `execute_sql` avec `supabase/tests/admin.sql` : `[{"resultat":"admin : scénarios OK"}]`.

- [ ] **Step 2: Parcours en local**

Démarrer le serveur de développement sur le port 3010 (`npx next dev -p 3010` en arrière-plan) et vérifier au navigateur, connecté avec le compte de Lucas :

1. `/admin` affiche le tableau de bord, le panneau montre Praticiens.
2. La fenêtre réduite sous 900 px : le panneau se replie, le bouton Menu l'ouvre, Échap le ferme.
3. `/admin/actualites` : la liste s'affiche sans bandeau bleu, le filtre « Mes articles » fonctionne, l'éditeur propose le propriétaire.
4. `/admin/evenements` : les deux fiches, l'état des jeux (18 / 66 / 9) et le bouton de suppression. **Ne pas cliquer sur ce bouton.**
5. `/admin/mugi-klub` et `/admin/praticiens` s'affichent dans la coque.

Arrêter le serveur.

- [ ] **Step 3: Pousser et ouvrir la PR**

```bash
git push -u origin feature/admin-coque
gh pr create --base main --title "Back-office : coque à panneau latéral et droits" --body "$(cat <<'EOF'
Le back-office prend une coque unique, un tableau de bord, une rubrique Événements, et deux niveaux de droits.

**Interface**
- Panneau latéral blanc, rubriques groupées, menu sur téléphone, connexion unique
- Tableau de bord : séances du Klub à venir, ce qui est à traiter, articles en cours
- Rubrique Événements : Alba 2026 et concours Avirun, avec leurs liens et l'état des données des jeux

**Droits**
- `site_est_equipe()` et `site_est_super_admin()` font foi, table `site_super_admins` (Lucas, JB)
- Chaque article a un propriétaire ; chacun modifie les siens, les gérants modifient tout
- Les fiches praticien passent sous la main des seuls gérants
- Le rôle `admin` de l'app praticiens n'est pas touché

Spec : `docs/superpowers/specs/2026-09-23-admin-coque-et-droits-design.md`
Plan : `docs/superpowers/plans/2026-09-23-admin-coque-et-droits.md`

Tests : `npm test`, scénarios `supabase/tests/admin.sql`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 4: Vérifier la prévisualisation**

Attendre le déploiement Vercel, ouvrir `/admin` sur l'URL de prévisualisation (protégée par Vercel, ouvrir depuis un navigateur connecté), se connecter, refaire les cinq points du Step 2.

- [ ] **Step 5: Demander la fusion**

Ne pas fusionner sans l'accord de Lucas. Lui signaler ce qu'il doit essayer lui-même :

- se connecter avec un compte praticien autre que le sien pour voir l'absence de la rubrique Praticiens ;
- vérifier qu'un article dont il n'est pas propriétaire ne lui est pas modifiable depuis ce compte.

---

## Ce que ce plan ne fait pas

- L'éditeur d'articles reste tel quel : sa refonte est le chantier B.
- L'agenda du cabinet n'existe pas encore : sa rubrique est visible et désactivée, son bloc du tableau de bord affiche une phrase d'attente. C'est le chantier C.
- Les images des séances du Klub et le nouveau planning public sont le chantier D.
- Aucune gestion des comptes praticiens depuis l'admin : inviter ou désactiver un compte se fait dans Supabase.

