# Éditeur d'articles en document (chantier B) — plan d'implémentation

> **Pour les exécutants agentiques :** SOUS-COMPÉTENCE REQUISE — utiliser `superpowers:subagent-driven-development` (recommandé) ou `superpowers:executing-plans` pour exécuter ce plan tâche par tâche. Les étapes se suivent en cochant les cases (`- [ ]`).

**But :** écrire un article comme un document, avec un aperçu fidèle et un panneau de réglages ; des marques simples de mise en forme ; et le statut tenu en base.

**Architecture :** une lecture des marques pure et testée (`lib/marques.ts`), rendue en éléments React sans HTML brut ; le corps de l'article extrait dans un composant partagé par la page publique et l'aperçu ; un déclencheur sur `articles` pour le statut ; un éditeur réécrit.

**Pile :** Next.js 16 App Router, React 19, Supabase (projet `nuehdfyscqnkckudkqhe`), `node --test`.

**Spec :** `docs/superpowers/specs/2026-09-26-editeur-articles-design.md`.

---

## Règles pour l'exécutant

1. **Lire `AGENTS.md` à la racine.** Cette version de Next.js a des ruptures d'API.
2. **Base de production, en service.** Projet `nuehdfyscqnkckudkqhe` : 23 articles publiés, lus par le site. Migrations avec `mcp__4497d48a-79cd-4b24-bdf1-1339728e2b85__apply_migration`, lectures avec `..._execute_sql`, `project_id` explicite. **Jamais les outils `mcp__supabase__*`. Ne jamais mettre en pause ni supprimer le projet.**
3. **La page publique des articles est en production.** La tâche 2 la réorganise : elle doit rendre **exactement** la même chose qu'avant pour les 23 articles.
4. **Tout essai destructif dans `begin; … rollback;`.**
5. **Lint React Compiler** : pas de `setState` dans le corps d'un effet, pas de mutation pendant le rendu. `npm run lint` sans aucun avertissement.
6. **Le code de ce plan n'a jamais été compilé.** Si une signature du dépôt diffère, suis le dépôt et dis précisément ce qui différait.
7. **Commits.** `git add <chemins explicites>`, jamais `-a`. Messages en français, terminés par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
8. Ne rien pousser avant la tâche 5.

## Carte des fichiers

| Fichier | Responsabilité |
|---|---|
| `lib/marques.ts`, `lib/marques.test.ts` | Lire les marques d'un texte |
| `lib/lecture.ts`, `lib/lecture.test.ts` | Temps de lecture |
| `package.json` | Couvrir `lib/*.test.ts` |
| `components/site/ArticleTexte.tsx` | Rendre un texte marqué en React |
| `components/site/ArticleCorps.tsx` | Le corps d'un article, partagé par la page et l'aperçu |
| `app/actualites/[slug]/page.tsx` | Utiliser `ArticleCorps` |
| `supabase/migrations/20260926190000_articles_garde_statut.sql` | Le déclencheur de statut |
| `supabase/tests/articles_statut.sql` | Scénarios |
| `components/admin/ArticleEditor.tsx` | L'éditeur, réécrit |
| `components/admin/ArticleAdmin.tsx` | Temps de lecture et message de refus à l'enregistrement |

---

### Task 0: Espace de travail

- [ ] **Step 1** : `cd /Users/lucas/Desktop/mugitu-biarritz-admin && git status --short && git log --oneline -1` — arbre propre, branche `feature/editeur-articles`.
- [ ] **Step 2** : `npm test` — 84 tests passent.

---

### Task 1: Lire les marques, et le temps de lecture

**Files:** Create `lib/marques.ts`, `lib/marques.test.ts`, `lib/lecture.ts`, `lib/lecture.test.ts`. Modify `package.json`.

- [ ] **Step 1: Écrire les tests qui échouent**

`lib/marques.test.ts` :

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { lireTexte } from "./marques.ts";

test("un texte brut reste un paragraphe identique", () => {
  assert.deepEqual(lireTexte("Bonjour le monde."), [
    { type: "paragraphe", morceaux: [{ texte: "Bonjour le monde." }] },
  ]);
});

test("une ligne vide sépare deux paragraphes", () => {
  const b = lireTexte("Un.\n\nDeux.");
  assert.equal(b.length, 2);
  assert.equal(b[1].type, "paragraphe");
});

test("le gras et l’italique", () => {
  const [b] = lireTexte("Un **mot fort** et un *mot léger*.");
  assert.equal(b.type, "paragraphe");
  if (b.type !== "paragraphe") return;
  assert.deepEqual(b.morceaux, [
    { texte: "Un " },
    { texte: "mot fort", gras: true },
    { texte: " et un " },
    { texte: "mot léger", italique: true },
    { texte: "." },
  ]);
});

test("un lien https et un lien interne", () => {
  const [b] = lireTexte("Voir [le guide](https://exemple.fr/guide) ou [l’équipe](/equipe).");
  if (b.type !== "paragraphe") return assert.fail("paragraphe attendu");
  assert.deepEqual(b.morceaux, [
    { texte: "Voir " },
    { texte: "le guide", href: "https://exemple.fr/guide" },
    { texte: " ou " },
    { texte: "l’équipe", href: "/equipe" },
    { texte: "." },
  ]);
});

test("un lien dangereux ou en http reste du texte", () => {
  for (const url of ["javascript:alert(1)", "http://exemple.fr", "//exemple.fr"]) {
    const [b] = lireTexte(`[clic](${url})`);
    if (b.type !== "paragraphe") return assert.fail("paragraphe attendu");
    assert.equal(b.morceaux.some((m) => m.href), false, url);
    assert.equal(b.morceaux.map((m) => m.texte).join(""), `[clic](${url})`, url);
  }
});

test("des lignes qui commencent toutes par un tiret font une liste", () => {
  const [b] = lireTexte("- douleur en fin de rame\n- **raideur** le matin");
  assert.equal(b.type, "liste");
  if (b.type !== "liste") return;
  assert.equal(b.items.length, 2);
  assert.deepEqual(b.items[1], [{ texte: "raideur", gras: true }, { texte: " le matin" }]);
});

test("un tiret isolé au milieu d’un paragraphe ne fait pas une liste", () => {
  const [b] = lireTexte("Voici :\n- un\n- deux");
  assert.equal(b.type, "paragraphe");
});

test("la reconnaissance automatique continue de marcher", () => {
  const [b] = lireTexte("Suivez @mugitu et mugitu-biarritz.fr");
  if (b.type !== "paragraphe") return assert.fail("paragraphe attendu");
  assert.deepEqual(
    b.morceaux.filter((m) => m.href).map((m) => m.href),
    ["https://www.instagram.com/mugitu/", "https://mugitu-biarritz.fr"],
  );
});

test("un lien écrit entre crochets l’emporte sur la reconnaissance automatique", () => {
  const [b] = lireTexte("[notre site](https://mugitu-biarritz.fr)");
  if (b.type !== "paragraphe") return assert.fail("paragraphe attendu");
  assert.deepEqual(b.morceaux, [{ texte: "notre site", href: "https://mugitu-biarritz.fr" }]);
});

test("une étoile seule et un tiret bas restent du texte", () => {
  const [b] = lireTexte("3 * 4 font 12, mot_clé");
  if (b.type !== "paragraphe") return assert.fail("paragraphe attendu");
  assert.equal(b.morceaux.map((m) => m.texte).join(""), "3 * 4 font 12, mot_clé");
  assert.equal(b.morceaux.some((m) => m.gras || m.italique), false);
});

test("un texte vide ne produit rien", () => {
  assert.deepEqual(lireTexte(""), []);
  assert.deepEqual(lireTexte("   \n\n  "), []);
});
```

`lib/lecture.test.ts` :

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { tempsDeLecture } from "./lecture.ts";

const vide = { chapo: "", sections: [], cas: null, exercice: null, faq: [] };

test("un article vide se lit en une minute", () => {
  assert.equal(tempsDeLecture(vide), 1);
});

test("environ 220 mots par minute, sections, cas et FAQ compris", () => {
  const mots = (n: number) => Array.from({ length: n }, () => "mot").join(" ");
  assert.equal(
    tempsDeLecture({
      ...vide,
      chapo: mots(20),
      sections: [{ h: "Titre", p: [mots(300), mots(100)] }],
      cas: mots(20),
      faq: [{ q: "Question", a: mots(0) }],
    }),
    2,
  );
});
```

- [ ] **Step 2: Constater l'échec** : `node --test lib/marques.test.ts lib/lecture.test.ts` — `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Écrire `lib/marques.ts`**

```ts
import { decouper } from "./autoliens.ts";

/**
 * Les marques de mise en forme des articles.
 *
 * Les textes sont stockés bruts ; ces marques s'y écrivent à la main et se
 * lisent ici, en blocs et en morceaux. Rien ne devient du HTML : le rendu
 * produit des éléments React, qui échappent tout.
 *
 *   **gras**  *italique*  [texte](https://…) ou [texte](/chemin)
 *   des lignes commençant toutes par « - » : une liste
 *   une ligne vide : un nouveau paragraphe
 *
 * Pas de « _ » pour l'italique : un paragraphe en ligne contient un tiret bas,
 * il en serait déformé. Vérifié le 26 sept. 2026 : aucun des 412 textes en
 * base ne contient ces marques, donc aucun article existant ne change.
 *
 * Pur, sans import d'alias : lu tel quel par `node --test`.
 */

export type Morceau = { texte: string; gras?: boolean; italique?: boolean; href?: string };
export type Bloc = { type: "paragraphe"; morceaux: Morceau[] } | { type: "liste"; items: Morceau[][] };

const LIEN = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const EMPHASE = /\*\*([^*]+?)\*\*|\*([^*\s](?:[^*]*?[^*\s])?)\*/g;

/** Seuls https et les chemins internes font un lien ; « //hote » n'est pas interne. */
function lienSur(url: string): boolean {
  return url.startsWith("https://") || (url.startsWith("/") && !url.startsWith("//"));
}

/** Le texte hors marque passe par la reconnaissance automatique existante. */
function brut(texte: string): Morceau[] {
  return decouper(texte).map((m) => (m.href ? { texte: m.texte, href: m.href } : { texte: m.texte }));
}

function emphases(texte: string): Morceau[] {
  const out: Morceau[] = [];
  let curseur = 0;
  for (const m of texte.matchAll(EMPHASE)) {
    const debut = m.index ?? 0;
    if (debut > curseur) out.push(...brut(texte.slice(curseur, debut)));
    if (m[1] !== undefined) out.push({ texte: m[1], gras: true });
    else out.push({ texte: m[2], italique: true });
    curseur = debut + m[0].length;
  }
  if (curseur < texte.length) out.push(...brut(texte.slice(curseur)));
  return out;
}

/** Une ligne : les liens d'abord, puis les emphases dans le reste. */
export function lireLigne(ligne: string): Morceau[] {
  const out: Morceau[] = [];
  let curseur = 0;
  for (const m of ligne.matchAll(LIEN)) {
    const debut = m.index ?? 0;
    if (!lienSur(m[2])) continue;
    if (debut > curseur) out.push(...emphases(ligne.slice(curseur, debut)));
    out.push({ texte: m[1], href: m[2] });
    curseur = debut + m[0].length;
  }
  if (curseur < ligne.length) out.push(...emphases(ligne.slice(curseur)));
  return out.filter((m) => m.texte.length > 0);
}

export function lireTexte(texte: string): Bloc[] {
  return texte
    .split(/\n\s*\n/)
    .map((bloc) => bloc.trim())
    .filter(Boolean)
    .map((bloc): Bloc => {
      const lignes = bloc.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lignes.every((l) => l.startsWith("- "))) {
        return { type: "liste", items: lignes.map((l) => lireLigne(l.slice(2))) };
      }
      return { type: "paragraphe", morceaux: lireLigne(bloc) };
    });
}
```

**Vérifie** que `lib/autoliens.ts` n'importe rien avec un alias `@/` : sinon `node --test` ne saurait pas le résoudre.

- [ ] **Step 4: Écrire `lib/lecture.ts`**

```ts
/**
 * Temps de lecture d'un article, à environ 220 mots par minute. Calculé
 * plutôt que saisi : un chiffre tapé à la main ne suit pas le texte.
 */

type Contenu = {
  chapo: string;
  sections: { h: string; p: string[] }[];
  cas: string | null;
  exercice: { title?: string; body?: string } | null;
  faq: { q: string; a: string }[];
};

function mots(texte: string | null | undefined): number {
  return (texte ?? "").split(/\s+/).filter(Boolean).length;
}

export function tempsDeLecture(a: Contenu): number {
  const total =
    mots(a.chapo) +
    a.sections.reduce((n, s) => n + mots(s.h) + s.p.reduce((m, p) => m + mots(p), 0), 0) +
    mots(a.cas) +
    mots(a.exercice?.title) +
    mots(a.exercice?.body) +
    a.faq.reduce((n, f) => n + mots(f.q) + mots(f.a), 0);
  return Math.max(1, Math.round(total / 220));
}
```

Le test attend 2 pour 20 + 1 + 300 + 100 + 20 + 1 = 442 mots, soit 442 / 220 ≈ 2,01. **Vérifie ce calcul** avant de conclure à un défaut.

- [ ] **Step 5: Étendre le script de test** — dans `package.json`, ajouter `lib/*.test.ts` au script `test` :

```json
    "test": "node --test lib/*.test.ts lib/klub/*.test.ts lib/admin/*.test.ts lib/agenda/*.test.ts lib/site/*.test.ts",
```

**Vérifie** qu'il n'existe pas déjà des fichiers `lib/*.test.ts` qui ne passeraient pas : `ls lib/*.test.ts`.

- [ ] **Step 6: Vérifier** : `npm test` — 97 tests (84 + 11 + 2). `npx tsc --noEmit && npm run lint` — aucune sortie.

- [ ] **Step 7: Commit**

```bash
git add lib/marques.ts lib/marques.test.ts lib/lecture.ts lib/lecture.test.ts package.json
git commit -m "$(cat <<'EOF'
articles : lire les marques de mise en forme, et le temps de lecture

Gras, italique, liens et listes, écrits à la main dans le texte. Les liens
ne passent qu'en https ou vers un chemin interne ; le reste reste du texte.
La reconnaissance automatique de @pseudo et des domaines continue de
s'appliquer à ce qui n'est pas déjà dans une marque.

Pas de « _ » pour l'italique : un paragraphe en ligne en contient un.

Le temps de lecture se calcule : un chiffre tapé à la main ne suit pas le
texte.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Le rendu, partagé par la page et l'aperçu

**Files:** Create `components/site/ArticleTexte.tsx`, `components/site/ArticleCorps.tsx`. Modify `app/actualites/[slug]/page.tsx`.

**Avant tout**, relève le rendu actuel de la page publique : ouvre `app/actualites/[slug]/page.tsx` et repère le bloc « SOMMAIRE + CORPS », qui va des chiffres clés jusqu'aux mots-clés inclus. C'est lui qui part dans `ArticleCorps`. Tout le reste — l'en-tête, le sommaire, l'appel final vers l'équipe, les articles liés — reste dans la page.

- [ ] **Step 1: `components/site/ArticleTexte.tsx`**

```tsx
import { lireTexte, type Morceau } from "@/lib/marques";

/**
 * Un texte d'article, marques comprises, rendu en éléments React. Aucun HTML
 * brut : un texte ne peut rien injecter dans la page.
 */

const LIEN: React.CSSProperties = {
  color: "#04A49B",
  textDecoration: "none",
  borderBottom: "1px solid rgba(4,164,155,.35)",
};

function Morceaux({ morceaux }: { morceaux: Morceau[] }) {
  return (
    <>
      {morceaux.map((m, k) => {
        let n: React.ReactNode = m.texte;
        if (m.gras) n = <strong style={{ fontWeight: 700, color: "#003850" }}>{n}</strong>;
        if (m.italique) n = <em>{n}</em>;
        if (m.href) {
          const externe = m.href.startsWith("https://");
          n = (
            <a
              href={m.href}
              style={LIEN}
              {...(externe ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {n}
            </a>
          );
        }
        return <span key={k}>{n}</span>;
      })}
    </>
  );
}

export default function ArticleTexte({ texte, style }: { texte: string; style: React.CSSProperties }) {
  return (
    <>
      {lireTexte(texte).map((b, i) =>
        b.type === "liste" ? (
          <ul key={i} style={{ ...style, paddingLeft: 22 }}>
            {b.items.map((item, j) => (
              <li key={j} style={{ marginBottom: 6 }}>
                <Morceaux morceaux={item} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} style={style}>
            <Morceaux morceaux={b.morceaux} />
          </p>
        ),
      )}
    </>
  );
}
```

Aujourd'hui les liens reconnus automatiquement s'ouvrent dans un nouvel onglet : c'est conservé, puisqu'ils sont tous en `https://`. Un lien interne s'ouvre dans le même onglet.

- [ ] **Step 2: `components/site/ArticleCorps.tsx`**

Crée ce composant en **déplaçant** le bloc « SOMMAIRE + CORPS » de la page — chiffres clés, sections, cas concret, exercice, FAQ, mots-clés — **sans rien changer à ses styles**, à ces exceptions près :

- les paragraphes d'une section passent par `ArticleTexte` au lieu de la boucle sur `decouper` ;
- le cas concret, le corps de l'exercice et chaque réponse de FAQ passent par `ArticleTexte`, avec le style exact de leur `<p>` actuel ;
- la constante de style `H2` est déplacée ici et **exportée** sous le nom `H2_ARTICLE`, parce que la page en a encore besoin pour son appel final.

Signature :

```tsx
import type { Article } from "@/lib/articles";
import ArticleTexte from "./ArticleTexte";

export const H2_ARTICLE: React.CSSProperties = { /* la constante H2 actuelle, à l'identique */ };

export default function ArticleCorps({
  article,
}: {
  article: Pick<Article, "stats" | "sections" | "cas" | "exercice" | "faq" | "tags">;
}) {
  // … le bloc déplacé
}
```

**Garde les `id`** — `sec-${i}`, `sec-cas`, `sec-ex`, `sec-faq` — et la classe `ar-sec` : le sommaire s'en sert pour ses ancres.

Ce composant n'a **ni** `"use client"` **ni** import côté serveur : il doit pouvoir être rendu par la page, composant serveur, et par l'éditeur, composant client. Pas de `next/image` dedans : le corps n'en utilise pas.

- [ ] **Step 3: La page utilise `ArticleCorps`**

Dans `app/actualites/[slug]/page.tsx`, remplace le bloc déplacé par `<ArticleCorps article={article} />`, importe `ArticleCorps` et `H2_ARTICLE`, remplace les usages restants de `H2` par `H2_ARTICLE`, et retire l'import de `decouper` s'il n'est plus utilisé.

- [ ] **Step 4: Vérifier que la page n'a pas changé**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Attendu : 97 tests, aucune erreur, aucun avertissement, les 23 pages `/actualites/[slug]` générées.

Puis **compare le rendu** d'un article avant et après : lance `npm run build` sur `origin/main` dans un dossier temporaire n'est pas possible simplement ; à la place, compare le HTML servi par la production et celui de ta branche pour un article qui contient un lien reconnu automatiquement. Cherche un tel article en base :

```sql
select slug from public.articles a, jsonb_array_elements(a.sections) s, jsonb_array_elements_text(s->'p') p
where p ~ '(@[A-Za-z0-9._]{2,30}|[a-z0-9-]+\.(fr|com))' limit 3;
```

Le texte visible de cet article doit être identique, et ses liens aussi. La tâche 5 fait la vérification visuelle complète.

- [ ] **Step 5: Commit**

```bash
git add components/site/ArticleTexte.tsx components/site/ArticleCorps.tsx "app/actualites/[slug]/page.tsx"
git commit -m "$(cat <<'EOF'
articles : un seul rendu du corps, pour la page et pour l'aperçu

Le corps de l'article sort de la page dans ArticleCorps, sans changer ses
styles. C'est ce qui rendra l'aperçu de l'éditeur fidèle : il n'y a qu'un
rendu.

Les paragraphes, le cas concret, l'exercice et les réponses de FAQ passent
par ArticleTexte, qui lit les marques et produit des éléments React —
aucun HTML brut. Aucun des 412 textes en base ne contient de marque : la
page ne change pas.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Le statut, tenu en base

**Files:** Create `supabase/migrations/20260926190000_articles_garde_statut.sql`, `supabase/tests/articles_statut.sql`.

- [ ] **Step 1: La migration**

```sql
-- Articles : publier et mettre à la une restent aux gérants — en base.
--
-- Jusqu'ici la restriction n'existait que dans l'écran : la politique de
-- modification laisse le propriétaire écrire toutes les colonnes, statut
-- compris. Même piège que l'agenda : une politique RLS ne restreint pas les
-- colonnes.
--
-- Le propriétaire passe son article de brouillon à « à relire » et retour,
-- et corrige un article déjà publié. Il ne publie pas, ne programme pas, ne
-- met pas à la une.
--
-- Sans session — SQL, script, clé de service —, rien n'est refusé.
--
-- PIÈGE DE L'UPSERT : l'écran enregistre par un upsert. Postgres déclenche
-- alors le « before insert » sur la ligne proposée, PUIS le « before
-- update » si l'article existe. Vu comme une insertion, corriger une coquille
-- dans son article publié ressemblerait à une publication. Une insertion
-- dont le slug existe déjà est donc laissée passer : la mise à jour qui suit
-- tranche, avec l'ancien et le nouveau statut.

create or replace function public.articles__garde_statut()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if auth.uid() is null then return new; end if;
  if coalesce(public.site_est_super_admin(), false) then return new; end if;

  if tg_op = 'INSERT' then
    if exists (select 1 from public.articles a where a.slug = new.slug) then
      return new;
    end if;
    if new.status in ('programme', 'publie') or new.featured then
      raise exception 'ARTICLE_STATUT';
    end if;
    return new;
  end if;

  if new.status in ('programme', 'publie') and old.status is distinct from new.status then
    raise exception 'ARTICLE_STATUT';
  end if;
  if new.featured is distinct from old.featured then
    raise exception 'ARTICLE_STATUT';
  end if;
  return new;
end;
$$;

revoke all on function public.articles__garde_statut() from public, anon, authenticated;

create trigger articles_garde_statut
  before insert or update on public.articles
  for each row execute function public.articles__garde_statut();
```

**Avant d'appliquer**, vérifie en base les noms réels des colonnes `status`, `featured`, `slug` de `articles`, et qu'aucun déclencheur `before` n'existe déjà sur cette table.

- [ ] **Step 2: Appliquer** — `apply_migration`, `name` = `articles_garde_statut`.

- [ ] **Step 3: Les scénarios** — `supabase/tests/articles_statut.sql` :

```sql
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
```

- [ ] **Step 4: Lancer** ce fichier, puis **relancer** `supabase/tests/admin.sql` et `supabase/tests/notifications.sql`, chacun **en entier et en une seule fois**. Ces deux-là écrivent des articles : s'ils échouent, le déclencheur est trop strict. **Ne modifie pas un scénario pour le faire passer sans avoir établi qui a tort.**

- [ ] **Step 5: Vérifier que rien n'a persisté** : `select count(*) from public.articles` — 23.

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/20260926190000_articles_garde_statut.sql supabase/tests/articles_statut.sql
git commit -m "$(cat <<'EOF'
articles : publier et mettre à la une restent aux gérants, en base

La restriction n'existait que dans l'écran ; la politique de modification
laissait le propriétaire écrire n'importe quel statut. Même piège que
l'agenda : une politique RLS ne restreint pas les colonnes.

Le piège de l'upsert, couvert par S9 : l'écran enregistre par un upsert, et
Postgres déclenche l'insertion avant la mise à jour. Corriger une coquille
dans son article publié ressemblait à une publication. Une insertion dont
le slug existe laisse trancher la mise à jour qui suit.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: L'éditeur

**Files:** Rewrite `components/admin/ArticleEditor.tsx`. Modify `components/admin/ArticleAdmin.tsx`.

**Avant d'écrire**, lis l'éditeur actuel en entier : ce qui suit en garde l'interface publique — `export default ArticleEditor({ draft, onChange, estSuperAdmin, comptes })`, `export type Draft`, `export function nouvelArticle`, `export function slugify` —, **`ArticleAdmin` n'a donc pas à changer sa façon de l'appeler.** Garde aussi, mot pour mot, les commentaires qui expliquent un piège : celui de `onChange` qui reçoit une fonction et non un brouillon, et celui du slug figé une fois l'article publié.

- [ ] **Step 1: Réécrire `components/admin/ArticleEditor.tsx`**

Structure attendue — le code de chaque champ reprend celui de l'éditeur actuel, avec les changements indiqués :

```tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { tempsDeLecture } from "@/lib/lecture";
import { TEAM } from "@/lib/team";
import type { Article } from "@/lib/articles";
import ArticleCorps from "@/components/site/ArticleCorps";
import ImageDrop from "./ImageDrop";

/**
 * L'éditeur d'un article, en document.
 *
 * À gauche, l'article dans l'ordre où il sera lu — titre, introduction,
 * sections, blocs complémentaires —, avec un aperçu rendu par les composants
 * mêmes de la page publique. À droite, les réglages.
 *
 * Le panneau passe sous le document quand la place manque, par le seul jeu
 * de flex-wrap : les styles du site sont en ligne, sans media queries.
 */
```

Garde `Draft`, `nouvelArticle`, `slugify`, `CATEGORIES`, `STATUTS`, les styles `champ` et `label`, et le composant `Bouton`.

**Mise en page** — le composant rend :

```tsx
<div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
  <div style={{ flex: "999 1 480px", minWidth: 0 }}>{/* le document */}</div>
  <aside style={{ flex: "1 1 260px", minWidth: 0, display: "grid", gap: 14 }}>{/* les réglages */}</aside>
</div>
```

Le motif `999 1 480px` / `1 1 260px` met le panneau à côté quand il y a la place et en dessous sinon, le document prenant toute la largeur gagnée.

**Le document** :

1. En tête, deux onglets **Écrire** et **Aperçu**, tenus par un `useState<"ecrire" | "apercu">("ecrire")`.
2. En mode **Écrire** :
   - le **titre** : même `onChange` que l'actuel (le slug suit le titre tant que l'article n'est pas publié), mais en grand — `fontSize: 26, fontWeight: 700, border: "none", background: "transparent", padding: 0` —, placeholder « Le titre de l'article » ; sous lui, l'adresse `/actualites/{slug}` et le champ du slug, en petit ;
   - l'**introduction** : l'ancien chapô, même champ, libellé « Introduction » et la phrase « Deux ou trois phrases. C'est ce qu'on lit sur la carte de l'article et dans Google. » ;
   - les **sections** : même code que l'actuel, et sous chaque zone de texte la légende, en petit et en gris :

     ```tsx
     <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "rgba(51,51,52,.5)" }}>
       <code>**gras**</code> · <code>*italique*</code> · <code>[texte](https://…)</code> · lignes en <code>- </code> pour une liste · une ligne vide pour un nouveau paragraphe
     </p>
     ```

     Le placeholder de la zone devient « Écrivez ici. » ;
   - les **blocs complémentaires**, chacun dans un `<details>` **non contrôlé** — sans prop `open` —, dont le `<summary>` porte le nom du bloc, la mention « · rempli » quand il a du contenu, et une phrase qui dit où il apparaît :
     - « Un cas concret » — « Un encadré beige après les sections. » ;
     - « Un exercice » — « Un encadré bleu nuit, avec un titre et une description. » ;
     - « Des chiffres clés » — « Des tuiles en tête de l'article. Une ligne par chiffre : « valeur | légende ». » ;
     - « Des questions fréquentes » — « Une liste dépliante en fin d'article. » ;

     leurs champs reprennent le code actuel.
3. En mode **Aperçu** :

   ```tsx
   <div style={{ background: "#FDF8F4", borderRadius: 16, padding: "clamp(18px,3vw,32px)" }}>
     {draft.eyebrow ? (
       <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#04A49B" }}>
         {draft.eyebrow}
       </p>
     ) : null}
     <h1 style={{ margin: "0 0 12px", fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, letterSpacing: "-.025em", color: "#003850" }}>
       {draft.title || "Le titre de l'article"}
     </h1>
     <p style={{ margin: "0 0 22px", fontSize: 17, lineHeight: 1.6, color: "rgba(51,51,52,.75)" }}>{draft.chapo}</p>
     {draft.cover ? (
       <div style={{ position: "relative", aspectRatio: "4 / 3", maxWidth: 560, borderRadius: 16, overflow: "hidden", marginBottom: 28 }}>
         <Image src={draft.cover} alt="" fill sizes="560px" style={{ objectFit: "cover", objectPosition: draft.cover_focus }} />
       </div>
     ) : null}
     <ArticleCorps article={draft} />
     <p style={{ margin: "18px 0 0", fontSize: 12, color: "rgba(51,51,52,.5)" }}>
       L'en-tête est simplifié ; le corps est rendu par les composants mêmes de la page publique.
     </p>
   </div>
   ```

   **Vérifie** que `draft` satisfait le type attendu par `ArticleCorps` ; sinon passe explicitement `stats`, `sections`, `cas`, `exercice`, `faq`, `tags`. Un `cover` relatif comme `/athlete-trail.jpg` est accepté par `next/image` ; vérifie-le au build.

**Le panneau de réglages**, en quatre cartes au style `bloc` actuel mais plus serrées (`padding: 16`) :

- **Classement** : catégorie ; surtitre, libellé « Surtitre » et sous lui « La petite ligne au-dessus du titre. Facultatif. » ; mots-clés.
- **Couverture** : le `ImageDrop` actuel.
- **Publication** :
  - le **statut** : pour un gérant, les quatre ; **pour les autres, seulement Brouillon et À relire** — si le statut actuel est Programmé ou Publié, ajoute-le comme option `disabled` pour que le menu l'affiche. Le menu n'est **plus désactivé** pour les non-gérants : c'est tout l'objet du chantier. Sous lui, pour un non-gérant : « Passez l'article en « À relire » quand il est prêt : Lucas et Jean-Baptiste le publient. » ;
  - « Mise en ligne le », auteur, date, « Mettre à la une », propriétaire : le code actuel, réservé aux gérants comme aujourd'hui ;
  - le **temps de lecture**, en lecture seule : `Temps de lecture estimé : {tempsDeLecture(draft)} min`. Le champ de saisie « Minutes de lecture » disparaît.
- **Référencement** : les deux champs actuels, avec en `placeholder` ce que la page publique utilise déjà s'ils restent vides — `draft.title` et `draft.chapo` —, et un compteur `n / 70` et `n / 170` sous chacun.

- [ ] **Step 2: `ArticleAdmin` calcule le temps de lecture et traduit le refus**

Dans `components/admin/ArticleAdmin.tsx`, fonction `enregistrer` : importe `tempsDeLecture` depuis `@/lib/lecture`, et construis l'article à enregistrer avec `read_mins: tempsDeLecture(draft)`. Et traduis le refus du déclencheur :

```tsx
    if (error) {
      notifier(
        error.message.includes("ARTICLE_STATUT")
          ? "Seuls Lucas et Jean-Baptiste publient, programment ou mettent à la une. Passez l'article en « À relire »."
          : `Enregistrement refusé : ${error.message}`,
      );
      return;
    }
```

**Ne change rien d'autre** dans ce fichier.

- [ ] **Step 3: Vérifier** — `npm test && npx tsc --noEmit && npm run lint && npm run build` : 97 tests, aucune erreur, aucun avertissement.

- [ ] **Step 4: Commit**

```bash
git add components/admin/ArticleEditor.tsx components/admin/ArticleAdmin.tsx
git commit -m "$(cat <<'EOF'
articles : l'éditeur devient un document, avec un panneau de réglages

L'article s'écrit dans l'ordre où il sera lu — titre, introduction,
sections —, les blocs complémentaires repliés en dessous, chacun disant où
il apparaît. Un aperçu le rend avec les composants mêmes de la page
publique. Les réglages passent dans un panneau.

Un praticien choisit désormais entre Brouillon et À relire : c'était le
trou du chantier, il ne pouvait pas soumettre son article. Le temps de
lecture se calcule, le référencement montre ce que Google verra.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Vérification, relecture visuelle, PR et fusion

- [ ] **Step 1** : `npm test && npx tsc --noEmit && npm run lint && npm run build` — tout vert.
- [ ] **Step 2** : relancer `articles_statut.sql`, `admin.sql`, `notifications.sql` en base, chacun en entier.
- [ ] **Step 3** : **relecture visuelle**, faite par la session principale.
- [ ] **Step 4** : pousser, ouvrir la PR.
- [ ] **Step 5** : **Lucas a autorisé la fusion** de ce chantier, à condition que la CI soit verte et les scénarios passés. Vérifie les deux, puis fusionne en squash.
