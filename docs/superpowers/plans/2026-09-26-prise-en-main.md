# Carte « Premiers pas » (C3) — plan d'implémentation

> **Pour les exécutants agentiques :** SOUS-COMPÉTENCE REQUISE — utiliser `superpowers:subagent-driven-development` (recommandé) ou `superpowers:executing-plans` pour exécuter ce plan tâche par tâche. Les étapes se suivent en cochant les cases (`- [ ]`).

**But :** un praticien qui se connecte pour la première fois sait quoi faire, sans qu'on lui envoie un document.

**Architecture :** une carte en tête du tableau de bord, adossée à l'état réel des données. Les étapes déductibles — un vœu, une absence, un article — ne sont pas stockées, elles se recalculent ; seules les coches manuelles et le masquage vivent en base. Le calcul est une fonction pure, testable sans base ni navigateur.

**Pile :** Next.js 16 App Router, React 19, Supabase (projet `nuehdfyscqnkckudkqhe`), `node --test`.

**Spec :** `docs/superpowers/specs/2026-09-26-prise-en-main-design.md`.

**Ce worktree est dédié à ce chantier** : `/Users/lucas/Desktop/mugitu-biarritz-c3`, branche `feature/prise-en-main`. Le chantier C2 tourne en parallèle dans `/Users/lucas/Desktop/mugitu-biarritz-admin`. **Ne jamais travailler dans l'autre.**

---

## Règles pour l'exécutant

1. **Lire `AGENTS.md` à la racine.** Cette version de Next.js a des ruptures d'API. Avant d'utiliser une API Next que tu n'as pas déjà vue employée dans ce dépôt, lis le guide correspondant dans `node_modules/next/dist/docs/`.
2. **Base de production, en service.** Projet `nuehdfyscqnkckudkqhe`. Migrations avec `mcp__4497d48a-79cd-4b24-bdf1-1339728e2b85__apply_migration`, lectures avec `..._execute_sql`, `project_id` explicite. **Jamais les outils `mcp__supabase__*`**, qui pointent sur un autre projet.
3. **Ne créer que les objets de ce plan.** Aucune modification d'objet existant : ce chantier n'ajoute qu'une table et une carte.
4. **Tout essai destructif dans `begin; … rollback;`.**
5. **Lint React Compiler** : pas de `setState` dans le corps d'un effet, pas de mutation pendant le rendu. Le motif du dépôt est `window.setTimeout(() => void charger(), 0)`. `npm run lint` doit finir **sans aucun avertissement**.
6. **Le code de ce plan n'a jamais été compilé.** Si une signature du dépôt diffère, suis le dépôt et dis précisément ce qui différait.
7. **Commits.** `git add <chemins explicites>`, jamais `-a` ni `-am`. Messages en français, au style des commits existants.
8. Ne rien pousser et n'ouvrir aucune PR avant la tâche 5.

## Carte des fichiers

| Fichier | Responsabilité |
|---|---|
| `supabase/migrations/20260926170000_site_prise_en_main.sql` | La table et sa RLS |
| `supabase/tests/prise_en_main.sql` | Scénarios de droits, en transaction annulée |
| `lib/admin/prise-en-main.ts` | Le calcul des étapes, pur |
| `lib/admin/prise-en-main.test.ts` | Tests unitaires |
| `components/admin/PremiersPas.tsx` | La carte |
| `components/admin/TableauDeBord.tsx` | Son branchement, en tête |

---

### Task 0: Espace de travail

- [ ] **Step 1: Vérifier l'état de départ**

```bash
cd /Users/lucas/Desktop/mugitu-biarritz-c3
git status --short
git log --oneline -1
```

Attendu : arbre propre, branche `feature/prise-en-main`. Les dépendances sont déjà installées et `npm test` donne 59 tests.

- [ ] **Step 2: Vérifier les tests existants**

Run: `npm test`
Attendu : 59 tests passent.

---

### Task 1: La table

**Files:**
- Create: `supabase/migrations/20260926170000_site_prise_en_main.sql`

- [ ] **Step 1: Écrire la migration**

```sql
-- Back-office : où en est chacun de sa prise en main.
--
-- Seules les coches manuelles et le masquage vivent ici. Les étapes
-- déductibles — un vœu posé, une absence déclarée, un article possédé — se
-- recalculent à chaque affichage : stocker un état déductible, c'est se
-- garantir qu'il divergera.
--
-- `cochees` n'est pas contraint à une liste fermée. Une étape retirée du
-- code laisse une chaîne orpheline, ce qui est sans effet ; une contrainte,
-- elle, empêcherait de renommer une étape sans migration.

create table public.site_prise_en_main (
  user_id uuid primary key references auth.users (id) on delete cascade,
  cochees text[] not null default '{}',
  masquee boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.site_prise_en_main enable row level security;

-- Chacun lit et écrit sa ligne, et rien d'autre. L'absence de ligne vaut
-- « rien de coché, carte visible » : on n'en crée pas onze à l'avance.
create policy site_prise_en_main_lecture on public.site_prise_en_main
  for select to authenticated using (user_id = auth.uid());
create policy site_prise_en_main_creation on public.site_prise_en_main
  for insert to authenticated with check (user_id = auth.uid() and public.site_est_equipe());
create policy site_prise_en_main_modification on public.site_prise_en_main
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

revoke all on public.site_prise_en_main from anon;
grant select, insert, update on public.site_prise_en_main to authenticated;
```

- [ ] **Step 2: Appliquer la migration**

Outil `apply_migration`, `project_id` = `nuehdfyscqnkckudkqhe`, `name` = `site_prise_en_main`.

- [ ] **Step 3: Vérifier**

```sql
select
  (select count(*) from information_schema.tables
    where table_schema='public' and table_name='site_prise_en_main') as table_creee,
  (select count(*) from pg_policies where schemaname='public' and tablename='site_prise_en_main') as politiques,
  (select count(*) from information_schema.role_table_grants where table_schema='public'
     and table_name='site_prise_en_main' and grantee='anon') as droits_anon;
```

Attendu : `table_creee` 1, `politiques` 3, `droits_anon` 0.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260926170000_site_prise_en_main.sql
git commit -m "$(cat <<'EOF'
prise en main : où en est chacun

Seules les coches manuelles et le masquage vivent en base. Les étapes
déductibles se recalculent à chaque affichage : stocker un état déductible,
c'est se garantir qu'il divergera.

cochees n'est pas contraint à une liste fermée, pour qu'une étape puisse
être renommée sans migration. Une chaîne orpheline est sans effet.
EOF
)"
```

---

### Task 2: Les scénarios

**Files:**
- Create: `supabase/tests/prise_en_main.sql`

- [ ] **Step 1: Écrire le fichier**

```sql
-- Prise en main : droits. Tout se passe dans une transaction annulée :
-- rien n'est écrit. Lancer avec l'outil MCP execute_sql
-- (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « prise en main : scénarios OK ».

begin;

do $$
declare
  v_hugo uuid;
  v_kine uuid;
begin
  select u.id into v_hugo from auth.users u where u.email = 'hugo.daminato@gmail.com';
  select u.id into v_kine from auth.users u where u.email = 'jbc.kine@gmail.com';
  assert v_hugo is not null and v_kine is not null, 'T0 comptes absents';

  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;

  -- T1. Chacun crée sa ligne.
  insert into public.site_prise_en_main (user_id, cochees) values (v_hugo, array['klub']);
  assert (select cochees from public.site_prise_en_main where user_id = v_hugo) = array['klub'], 'T1';

  -- T2. Et la modifie.
  update public.site_prise_en_main set cochees = array['klub', 'article'] where user_id = v_hugo;
  assert array_length((select cochees from public.site_prise_en_main where user_id = v_hugo), 1) = 2, 'T2';

  -- T3. Il ne crée pas celle d'un autre.
  begin
    insert into public.site_prise_en_main (user_id) values (v_kine);
    assert false, 'T3 un praticien crée la ligne d''un autre';
  exception when insufficient_privilege then null;
  end;

  -- T4. Il ne lit pas celle d'un autre.
  assert not exists (select 1 from public.site_prise_en_main where user_id = v_kine), 'T4';

  -- T5. Il masque la sienne.
  update public.site_prise_en_main set masquee = true where user_id = v_hugo;
  assert (select masquee from public.site_prise_en_main where user_id = v_hugo), 'T5';

  reset role;
  perform set_config('request.jwt.claims', '', true);
end $$;

set local role anon;
do $$
begin
  begin
    perform count(*) from public.site_prise_en_main;
    assert false, 'P1 anon lit la prise en main';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

rollback;
select 'prise en main : scénarios OK' as resultat;
```

- [ ] **Step 2: Lancer les scénarios**

Outil `execute_sql`, `project_id` = `nuehdfyscqnkckudkqhe`, le fichier **en entier, en une seule fois**.
Attendu : `[{"resultat":"prise en main : scénarios OK"}]`.

- [ ] **Step 3: Vérifier que rien n'a persisté**

```sql
select count(*) as lignes from public.site_prise_en_main;
```

Attendu : le nombre réel de lignes, qui vaut 0 si personne n'a encore utilisé la carte.

- [ ] **Step 4: Commit**

```bash
git add supabase/tests/prise_en_main.sql
git commit -m "$(cat <<'EOF'
prise en main : scénarios de droits

Six scénarios. Les deux qui comptent : personne ne crée ni ne lit la ligne
d'un autre. Une prise en main est personnelle, et savoir où en est un
collègue ne regarde personne.
EOF
)"
```

---

### Task 3: Le calcul des étapes

**Files:**
- Create: `lib/admin/prise-en-main.ts`, `lib/admin/prise-en-main.test.ts`

- [ ] **Step 1: Écrire le test qui échoue**

`lib/admin/prise-en-main.test.ts` :

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { etatPriseEnMain, type Donnees } from "./prise-en-main.ts";

const vierge: Donnees = {
  aUnVoeu: false,
  aUneAbsence: false,
  aUnArticle: false,
  cochees: [],
  masquee: false,
  estGerant: false,
};

test("un compte neuf a quatre étapes, toutes ouvertes", () => {
  const e = etatPriseEnMain(vierge);
  assert.equal(e.etapes.length, 4);
  assert.equal(e.etapes.every((x) => !x.faite), true);
  assert.equal(e.terminee, false);
  assert.equal(e.visible, true);
});

test("un vœu ferme l’étape de l’agenda", () => {
  const e = etatPriseEnMain({ ...vierge, aUnVoeu: true });
  assert.equal(e.etapes.find((x) => x.id === "agenda")?.faite, true);
  assert.equal(e.terminee, false);
});

test("une absence ferme la sienne, et la coche aussi", () => {
  assert.equal(
    etatPriseEnMain({ ...vierge, aUneAbsence: true }).etapes.find((x) => x.id === "absences")?.faite,
    true,
  );
  assert.equal(
    etatPriseEnMain({ ...vierge, cochees: ["absences"] }).etapes.find((x) => x.id === "absences")?.faite,
    true,
  );
});

test("un article ferme la sienne, et « pas pour moi » aussi", () => {
  assert.equal(
    etatPriseEnMain({ ...vierge, aUnArticle: true }).etapes.find((x) => x.id === "article")?.faite,
    true,
  );
  assert.equal(
    etatPriseEnMain({ ...vierge, cochees: ["article"] }).etapes.find((x) => x.id === "article")?.faite,
    true,
  );
});

test("l’étape du Klub ne se ferme qu’à la main", () => {
  const e = etatPriseEnMain({ ...vierge, aUnVoeu: true, aUneAbsence: true, aUnArticle: true });
  assert.equal(e.etapes.find((x) => x.id === "klub")?.faite, false);
  assert.equal(e.terminee, false);
});

test("les quatre fermées donnent terminée", () => {
  const e = etatPriseEnMain({
    ...vierge,
    aUnVoeu: true,
    aUneAbsence: true,
    aUnArticle: true,
    cochees: ["klub"],
  });
  assert.equal(e.terminee, true);
});

test("une carte masquée n’est plus visible, même inachevée", () => {
  const e = etatPriseEnMain({ ...vierge, masquee: true });
  assert.equal(e.visible, false);
  assert.equal(e.terminee, false);
});

test("un gérant a une cinquième étape, les autres non", () => {
  assert.equal(etatPriseEnMain({ ...vierge, estGerant: true }).etapes.length, 5);
  assert.equal(
    etatPriseEnMain({ ...vierge, estGerant: true }).etapes.some((x) => x.id === "recap"),
    true,
  );
  assert.equal(etatPriseEnMain(vierge).etapes.some((x) => x.id === "recap"), false);
});

test("une coche orpheline ne casse rien", () => {
  const e = etatPriseEnMain({ ...vierge, cochees: ["etape-supprimee-il-y-a-six-mois"] });
  assert.equal(e.etapes.length, 4);
  assert.equal(e.terminee, false);
});

test("seules les étapes cochables le sont", () => {
  const e = etatPriseEnMain(vierge);
  assert.equal(e.etapes.find((x) => x.id === "agenda")?.cochable, false);
  assert.equal(e.etapes.find((x) => x.id === "klub")?.cochable, true);
});
```

- [ ] **Step 2: Lancer le test pour le voir échouer**

Run: `node --test lib/admin/prise-en-main.test.ts`
Attendu : ÉCHEC, `ERR_MODULE_NOT_FOUND` pour `./prise-en-main.ts`.

- [ ] **Step 3: Écrire `lib/admin/prise-en-main.ts`**

```ts
/**
 * Où en est quelqu'un de sa prise en main du back-office.
 *
 * Pur, sans import : lu tel quel par les tests `node --test`. Les étapes
 * déductibles se calculent depuis les données, les autres se cochent.
 *
 * Deux étapes admettent d'être cochées sans avoir été faites — « je n'ai pas
 * d'absence », « les articles, pas pour moi ». Une liste où l'on ne peut pas
 * dire « pas moi » ne se termine jamais, et une liste qui ne se termine
 * jamais se masque.
 */

export type Donnees = {
  aUnVoeu: boolean;
  aUneAbsence: boolean;
  aUnArticle: boolean;
  cochees: string[];
  masquee: boolean;
  estGerant: boolean;
};

export type Etape = {
  id: "agenda" | "absences" | "klub" | "article" | "recap";
  titre: string;
  detail: string;
  lien: string;
  faite: boolean;
  /** Peut se fermer d'une coche, sans avoir été faite pour de vrai. */
  cochable: boolean;
};

export type EtatPriseEnMain = {
  etapes: Etape[];
  terminee: boolean;
  visible: boolean;
};

export function etatPriseEnMain(d: Donnees): EtatPriseEnMain {
  const coche = (id: string) => d.cochees.includes(id);

  const etapes: Etape[] = [
    {
      id: "agenda",
      titre: "Posez vos demi-journées au cabinet",
      detail:
        "Dites dans quelles salles et quand vous souhaitez être là. C’est la seule chose qu’on attend de chacun, et sans elle personne ne peut arbitrer les salles.",
      lien: "/admin/agenda",
      faite: d.aUnVoeu,
      cochable: false,
    },
    {
      id: "absences",
      titre: "Déclarez vos absences à venir",
      detail:
        "Congés, formation, arrêt : sans ça la grille du cabinet annonce des présences fausses.",
      lien: "/admin/agenda",
      faite: d.aUneAbsence || coche("absences"),
      cochable: true,
    },
    {
      id: "klub",
      titre: "Voyez comment marche le Mugi Klub",
      detail:
        "Les séances, les inscrits, les présents le jour J. Même si vous n’animez rien, vous pouvez être celui qui répond au téléphone.",
      lien: "/admin/mugi-klub",
      faite: coche("klub"),
      cochable: true,
    },
    {
      id: "article",
      titre: "Écrivez ou relisez un article",
      detail: "Les Actualités du site. Tout le monde n’écrit pas, et ce n’est pas grave.",
      lien: "/admin/actualites",
      faite: d.aUnArticle || coche("article"),
      cochable: true,
    },
  ];

  if (d.estGerant) {
    etapes.push({
      id: "recap",
      titre: "Choisissez si vous voulez le récapitulatif quotidien",
      detail:
        "Un mail par jour sur ce qui a bougé dans l’espace. L’interrupteur est au pied du panneau de gauche.",
      lien: "/admin",
      faite: coche("recap"),
      cochable: true,
    });
  }

  const terminee = etapes.every((e) => e.faite);
  return { etapes, terminee, visible: !d.masquee };
}
```

- [ ] **Step 4: Étendre le script de test si besoin**

Le script `test` de `package.json` couvre déjà `lib/admin/*.test.ts` : **vérifie-le** et ne le change que s'il ne le couvre pas.

- [ ] **Step 5: Lancer les tests**

Run: `npm test`
Attendu : 69 tests passent (59 existants + 10 nouveaux).

- [ ] **Step 6: Vérifier types et lint**

Run: `npx tsc --noEmit && npm run lint`
Attendu : aucune sortie, aucun avertissement.

- [ ] **Step 7: Commit**

```bash
git add lib/admin/prise-en-main.ts lib/admin/prise-en-main.test.ts
git commit -m "$(cat <<'EOF'
prise en main : le calcul des étapes

Pur et sans import, donc testable tel quel. Les étapes déductibles se
calculent depuis les vœux, les absences et les articles ; les autres se
cochent.

Deux admettent d'être cochées sans avoir été faites — « je n'ai pas
d'absence », « les articles, pas pour moi ». Une liste où l'on ne peut pas
dire « pas moi » ne se termine jamais, et une liste qui ne se termine
jamais se masque.

Une coche orpheline, laissée par une étape retirée du code, est sans
effet : un test le vérifie.
EOF
)"
```

---

### Task 4: La carte

**Files:**
- Create: `components/admin/PremiersPas.tsx`
- Modify: `components/admin/TableauDeBord.tsx`

- [ ] **Step 1: Écrire la carte**

```tsx
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAccesCourant } from "@/lib/admin/acces";
import { etatPriseEnMain, type Donnees } from "@/lib/admin/prise-en-main";
import { supabaseBrowser } from "@/lib/supabase-browser";

/**
 * « Premiers pas » : ce qu'on attend d'un nouveau venu, adossé à l'état réel
 * de ses données.
 *
 * Pas une visite guidée : l'admin a changé six fois en dix jours, et une
 * visite figée sur des positions d'écran serait fausse la semaine prochaine.
 * Une liste qui coche ce qui est déjà fait ne dépend d'aucune position.
 *
 * Quand tout est fait, la carte le dit une fois et se masque d'elle-même :
 * au chargement suivant elle a disparu, sans colonne supplémentaire pour
 * s'en souvenir.
 */

const GUIDE = "https://claude.ai/artifact/9rgJ3dL2wZt7PHoqbRCPkP";

export default function PremiersPas() {
  const acces = useAccesCourant();
  const [donnees, setDonnees] = useState<Donnees | null>(null);

  const charger = useCallback(async () => {
    if (!acces.userId) return;
    const sb = supabaseBrowser();
    const [voeux, absences, articles, ligne] = await Promise.all([
      sb.from("agenda_voeux").select("id").eq("user_id", acces.userId).limit(1),
      sb.from("agenda_absences").select("id").eq("user_id", acces.userId).limit(1),
      sb.from("articles").select("slug").eq("auteur_id", acces.userId).limit(1),
      sb.from("site_prise_en_main").select("cochees, masquee").eq("user_id", acces.userId).maybeSingle(),
    ]);
    setDonnees({
      aUnVoeu: (voeux.data ?? []).length > 0,
      aUneAbsence: (absences.data ?? []).length > 0,
      aUnArticle: (articles.data ?? []).length > 0,
      cochees: ligne.data?.cochees ?? [],
      masquee: ligne.data?.masquee ?? false,
      estGerant: acces.estSuperAdmin,
    });
  }, [acces.userId, acces.estSuperAdmin]);

  useEffect(() => {
    // Motif du dépôt : pas de setState synchrone dans le corps d'un effet.
    const t = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(t);
  }, [charger]);

  const ecrire = useCallback(
    async (champs: { cochees?: string[]; masquee?: boolean }) => {
      if (!acces.userId || !donnees) return;
      const suivant = {
        cochees: champs.cochees ?? donnees.cochees,
        masquee: champs.masquee ?? donnees.masquee,
      };
      setDonnees({ ...donnees, ...suivant });
      const { error } = await supabaseBrowser()
        .from("site_prise_en_main")
        .upsert({ user_id: acces.userId, ...suivant, updated_at: new Date().toISOString() });
      if (error) setDonnees(donnees);
    },
    [acces.userId, donnees],
  );

  if (!donnees) return null;
  const etat = etatPriseEnMain(donnees);
  if (!etat.visible) return null;

  if (etat.terminee) {
    return (
      <div style={CARTE}>
        <p style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: "#003850" }}>
          Vous avez tout vu
        </p>
        <p style={{ margin: "0 0 10px", fontSize: 13, color: "rgba(51,51,52,.7)" }}>
          Cette carte ne réapparaîtra plus. Le guide reste là si vous en avez besoin.
        </p>
        <button type="button" onClick={() => void ecrire({ masquee: true })} style={BOUTON_PLAT}>
          Fermer
        </button>
      </div>
    );
  }

  const restantes = etat.etapes.filter((e) => !e.faite).length;

  return (
    <div style={CARTE}>
      <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700, color: "#003850" }}>Premiers pas</p>
      <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "rgba(51,51,52,.65)" }}>
        {restantes === 1 ? "Il reste une chose à faire" : `Il reste ${restantes} choses à faire`}, et ça prend
        dix minutes. <a href={GUIDE} target="_blank" rel="noopener noreferrer" style={{ color: "#04A49B" }}>
          Le guide complet
        </a>
        .
      </p>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {etat.etapes.map((e) => (
          <li
            key={e.id}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              padding: "9px 0",
              borderTop: "1px solid rgba(0,56,80,.08)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                flexShrink: 0,
                marginTop: 2,
                background: e.faite ? "#04A49B" : "transparent",
                border: e.faite ? "none" : "1px solid rgba(0,56,80,.25)",
              }}
            />
            <span style={{ flex: 1, fontSize: 13, color: e.faite ? "rgba(51,51,52,.5)" : "#1d2d33" }}>
              <span style={{ fontWeight: 600, textDecoration: e.faite ? "line-through" : "none" }}>
                {e.titre}
              </span>
              {e.faite ? null : (
                <>
                  <span style={{ display: "block", fontSize: 12.5, color: "rgba(51,51,52,.65)", margin: "2px 0 6px" }}>
                    {e.detail}
                  </span>
                  <Link href={e.lien} style={{ fontSize: 12.5, color: "#04A49B", fontWeight: 600 }}>
                    Y aller →
                  </Link>
                  {e.cochable ? (
                    <button
                      type="button"
                      onClick={() => void ecrire({ cochees: [...donnees.cochees, e.id] })}
                      style={{ ...BOUTON_PLAT, marginLeft: 14 }}
                    >
                      {e.id === "absences" ? "Je n’en ai pas" : e.id === "klub" ? "C’est vu" : "Pas pour moi"}
                    </button>
                  ) : null}
                </>
              )}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => void ecrire({ masquee: true })}
        style={{ ...BOUTON_PLAT, marginTop: 12 }}
      >
        Masquer définitivement
      </button>
    </div>
  );
}

const CARTE: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(4,164,155,.35)",
  borderRadius: 12,
  padding: 16,
  marginBottom: 18,
  boxShadow: "0 2px 10px rgba(60,40,30,.06)",
};

const BOUTON_PLAT: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  font: "inherit",
  fontSize: 12.5,
  color: "rgba(51,51,52,.6)",
  cursor: "pointer",
  textDecoration: "underline",
};
```

- [ ] **Step 2: Brancher la carte en tête du tableau de bord**

Dans `components/admin/TableauDeBord.tsx`, ajouter aux imports :

```tsx
import PremiersPas from "./PremiersPas";
```

Puis, dans le rendu, **juste après** le bloc des deux raccourcis « Nouvel article » et « Nouvelle séance » et **avant** la grille des blocs, insérer :

```tsx
      <PremiersPas />
```

**Ouvre le fichier pour repérer l'endroit exact** : le rendu commence par le titre « Bonjour », la date, puis un `div` contenant les deux liens. La carte va après ce `div`.

- [ ] **Step 3: Vérifier**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Attendu : 69 tests, aucune erreur, aucun avertissement, build vert.

Si le lint refuse quelque chose — une dépendance manquante d'un `useCallback`, une mutation pendant le rendu — corrige au minimum et signale-le.

- [ ] **Step 4: Commit**

```bash
git add components/admin/PremiersPas.tsx components/admin/TableauDeBord.tsx
git commit -m "$(cat <<'EOF'
prise en main : la carte « Premiers pas »

En tête du tableau de bord, tant qu'elle n'est ni terminée ni masquée.
Chaque étape dit pourquoi elle existe, où aller, et pour celles qui
l'admettent comment s'en dispenser.

Quand tout est fait, la carte le dit une fois et se masque d'elle-même :
au chargement suivant elle a disparu, sans colonne supplémentaire pour
s'en souvenir.
EOF
)"
```

---

### Task 5: Vérification et PR

- [ ] **Step 1: Tout vérifier**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Attendu : 69 tests, aucune erreur, aucun avertissement.

Relancer `supabase/tests/prise_en_main.sql` avec `execute_sql` : `prise en main : scénarios OK`.

- [ ] **Step 2: Contrôle des droits effectifs**

Outil `get_advisors`, `project_id` explicite, `type` = `security`.
Attendu : aucune nouvelle alerte. `site_prise_en_main` a trois politiques, elle ne doit pas figurer sous « RLS enabled, no policy ».

- [ ] **Step 3: Pousser et ouvrir la PR**

```bash
git push -u origin feature/prise-en-main
gh pr create --base main --title "Back-office : la carte « Premiers pas »" --body "$(cat <<'EOF'
Un praticien qui se connecte pour la première fois sait quoi faire, sans qu'on lui envoie un document.

**Pas une visite guidée.** L'admin a changé six fois en dix jours : la coque, le tableau de bord, les événements, l'agenda, les congés, les échanges. Une visite figée sur des sélecteurs et des positions d'écran serait fausse la semaine prochaine, et personne ne s'en apercevrait — un guide faux fait douter l'utilisateur plutôt que l'outil. Une carte qui coche ce qui est déjà fait ne dépend d'aucune position d'écran.

**Quatre étapes, dont deux constatées dans les données** — un vœu posé, un article possédé — et deux cochées à la main. Deux admettent un échappatoire explicite : « je n'ai pas d'absence », « les articles, pas pour moi ». Une liste où l'on ne peut pas dire « pas moi » ne se termine jamais, et une liste qui ne se termine jamais se masque.

**Les étapes déductibles ne sont pas stockées.** Elles se recalculent à chaque affichage depuis les vœux, les absences et les articles. Stocker un état déductible, c'est se garantir qu'il divergera.

Une cinquième étape s'affiche pour Lucas et Jean-Baptiste, sur le réglage du récapitulatif quotidien. **Elle suppose que le chantier C2 soit en production** : cette PR se fusionne après celle des notifications.

`cochees` n'est pas contraint à une liste fermée, pour qu'une étape puisse être renommée sans migration. Une coche orpheline est sans effet, et un test le vérifie.

Spec : `docs/superpowers/specs/2026-09-26-prise-en-main-design.md`
Plan : `docs/superpowers/plans/2026-09-26-prise-en-main.md`

Vérifications : 69 tests, `tsc`, lint sans avertissement, build, et les scénarios de droits sur la base de production en transaction annulée.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 4: Ne pas fusionner**

Lucas a autorisé la fusion du chantier des méthodes de réservation, **pas celui-ci**. Laisse la PR ouverte, et rappelle dans ton rapport qu'elle se fusionne **après** celle des notifications, à cause de la cinquième étape.

---

## Ce que ce plan ne fait pas

- Une aide par écran.
- Un rappel par mail aux comptes qui ne se sont jamais connectés : c'est le chantier des notifications.
- Le sort du guide extérieur, vers lequel la carte renvoie.
