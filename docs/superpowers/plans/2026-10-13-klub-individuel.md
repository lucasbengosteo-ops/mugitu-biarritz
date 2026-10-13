# Mugi Klub : préparation individuelle et en duo — plan d'implémentation

> **Pour les exécutants agentiques :** SOUS-COMPÉTENCE REQUISE — `superpowers:subagent-driven-development` (recommandé) ou `superpowers:executing-plans`. Les étapes se suivent en cochant les cases (`- [ ]`).

**But :** Hugo, Baptiste et Jean-Baptiste publient des séances individuelles (seul ou à deux) et des bilans offerts de 30 minutes, réservés et payés en ligne, présentés sur une page dédiée.

**Architecture :** deux nouveaux types de séance du Klub, `individuel` et `bilan`, qui reprennent les créneaux, l'inscription, le paiement de la partie 2, les rappels et l'annulation. Le duo est un choix fait à la réservation (`nb_personnes`, `accompagnant`), qui fixe le montant. Une page publique regroupe les créneaux par préparateur.

**Pile :** Next.js 16 App Router, React 19, Supabase (`nuehdfyscqnkckudkqhe`), Stripe (via `lib/stripe.ts`), `node --test`.

**Spec :** `docs/superpowers/specs/2026-10-13-klub-individuel-design.md`. Elle s'appuie sur `docs/superpowers/specs/2026-10-13-klub-paiement-design.md`. **Lis les deux avant ta tâche.**

**Branche :** `feature/klub-individuel`, partie de `feature/klub-paiement` (PR #40, non fusionnée). La PR de cette partie visera `feature/klub-paiement`.

---

## Règles pour l'exécutant

1. **Lire `AGENTS.md`.** Next.js a des ruptures d'API : lis `node_modules/next/dist/docs/` avant toute API de route ou de page.
2. **Base de production, en service.** Projet `nuehdfyscqnkckudkqhe`, qui sert le site mugitu-biarritz.fr. Règles :
   - uniquement les outils `mcp__4497d48a-79cd-4b24-bdf1-1339728e2b85__execute_sql` / `apply_migration` (à charger avec ToolSearch), toujours avec `project_id` explicite ;
   - **jamais `mcp__supabase__*`**, qui pointent sur un autre projet ;
   - jamais de pause ni de suppression du projet ;
   - tout essai dans `begin; … rollback;`.
3. **Fonctions existantes : partir de `pg_get_functiondef` en production**, jamais des fichiers. Plusieurs ont été redéfinies par les migrations du 13 octobre (`supabase/migrations/20261013*.sql`). Recopie le corps tel quel, applique seulement les changements décrits, et mets un commentaire en tête.
4. **Avant `apply_migration`**, rejoue la migration entière dans une transaction annulée, avec les nouveaux scénarios et le bloc pertinent de `klub.sql` et de `klub_paiement.sql`.
5. **Rien ne doit changer pour les séances existantes** (types `small`, `atelier`, `conf`, `soiree`). Les scénarios existants passent sans modification.
6. **Le code de ce plan n'a jamais été exécuté.** Suis le réel, et signale chaque écart.
7. **Lint React Compiler** sans avertissement : motif `window.setTimeout(() => void charger(), 0)` pour charger au montage, pas de `setState` dans le corps d'un effet, pas de mutation pendant le rendu.
8. **Modules purs** testés par `node --test` : imports voisins avec l'extension `.ts`, jamais l'alias `@/`.
9. **Aucune clé.** Ne lis pas `.env*`.
10. **Commits** : `git add` de chemins explicites. Messages en français, terminés par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Ne pousse rien.
11. **Libellés** français sobres, non genrés. **`profiles.id` n'est jamais `profiles.user_id`.**
12. **Messages d'assert** dans les scénarios : `'X ' || v_r::text`, jamais `'X ' || v_r` avec un jsonb.

## Carte des fichiers

| Fichier | Rôle |
|---|---|
| `lib/klub/individuel.ts` (+ test) | Montant d'une réservation, libellé des tarifs, préparateurs affichés |
| `supabase/migrations/20261013110000_klub_individuel.sql` | Types, prix duo, réservation à deux, droits |
| `supabase/tests/klub_individuel.sql` | Scénarios |
| `lib/klub/types.ts` | Types et libellés |
| `app/api/klub/inscription/route.ts`, `lib/klub/validation.ts` | Choix seul ou à deux |
| `components/site/klub/KlubFormulaire.tsx` | Le formulaire public |
| `app/mugi-klub/preparation-individuelle/page.tsx` | La page publique |
| Planning du Klub, `lib/routes.ts`, `lib/site/plan.ts` | Exclusion des nouveaux types, lien, plan du site |
| `components/admin/klub/*` | Création des créneaux, prix duo, inscrits à deux |
| `lib/klub/mails.ts`, `lib/klub/envoi.ts` | Mails du duo et du bilan |

---

### Task 0: Espace de travail

- [ ] `cd /Users/lucas/Desktop/mugitu-biarritz-admin && git status --short && git branch --show-current` — arbre propre, branche `feature/klub-individuel`.
- [ ] `npm test` — note le nombre de tests (attendu : 124).
- [ ] Vérifie que l'outil MCP 4497 répond : `select count(*) from public.klub_seances`. S'il est indisponible, arrête-toi et dis-le.

---

### Task 1: Les règles pures

**Files:** Create `lib/klub/individuel.ts`, `lib/klub/individuel.test.ts`.

- [ ] **Step 1: Le test**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { TYPES_INDIVIDUELS, libelleTarifs, montantReservation, preparateurs } from "./individuel.ts";

test("le montant d'une réservation, seul ou à deux", () => {
  assert.equal(montantReservation({ prix_centimes: 4000, prix_duo_centimes: 3000 }, false), 4000);
  assert.equal(montantReservation({ prix_centimes: 4000, prix_duo_centimes: 3000 }, true), 6000);
  assert.equal(montantReservation({ prix_centimes: 4000, prix_duo_centimes: null }, true), null);
  assert.equal(montantReservation({ prix_centimes: null, prix_duo_centimes: null }, false), null);
});

test("le libellé des tarifs", () => {
  assert.equal(libelleTarifs({ prix_centimes: 4000, prix_duo_centimes: 3000 }), "40 € la séance · 30 € par personne à deux");
  assert.equal(libelleTarifs({ prix_centimes: 4000, prix_duo_centimes: null }), "40 € la séance");
  assert.equal(libelleTarifs({ prix_centimes: null, prix_duo_centimes: null }), "");
});

test("les nouveaux types sont reconnus", () => {
  assert.deepEqual([...TYPES_INDIVIDUELS].sort(), ["bilan", "individuel"]);
});

test("les préparateurs : groupés par intervenant, triés par prochain créneau, tarifs du prochain individuel", () => {
  const s = (id: string, intervenant: string, type: "individuel" | "bilan", debut: string, prix: number | null = null) => ({
    id, intervenant, type, debut, prix_centimes: prix, prix_duo_centimes: prix ? 3000 : null,
  });
  const p = preparateurs([
    s("1", "Hugo Daminato", "bilan", "2026-10-20T08:00:00Z"),
    s("2", "Baptiste Caparros", "individuel", "2026-10-19T08:00:00Z", 4500),
    s("3", "Hugo Daminato", "individuel", "2026-10-21T08:00:00Z", 4000),
  ]);
  assert.deepEqual(p.map((x) => x.intervenant), ["Baptiste Caparros", "Hugo Daminato"]);
  assert.equal(p[1].seances.length, 2);
  assert.deepEqual(p[1].tarifs, { prix_centimes: 4000, prix_duo_centimes: 3000 });
});
```

- [ ] **Step 2** : `node --test lib/klub/individuel.test.ts` — échec, module absent.

- [ ] **Step 3: Le module**

```ts
import { libellePrix } from "./paiement.ts";

/**
 * Préparation individuelle du Klub (spec du 13 oct. 2026, partie 3).
 * Pur, sans alias : lu tel quel par `node --test`.
 */

export const TYPES_INDIVIDUELS = new Set(["individuel", "bilan"] as const);

type Prix = { prix_centimes: number | null; prix_duo_centimes: number | null };

/** Montant d'une réservation ; null si le choix n'est pas proposé ou si la séance n'a pas de prix. */
export function montantReservation(p: Prix, aDeux: boolean): number | null {
  if (aDeux) return p.prix_duo_centimes === null ? null : 2 * p.prix_duo_centimes;
  return p.prix_centimes;
}

export function libelleTarifs(p: Prix): string {
  if (p.prix_centimes === null) return "";
  const seul = `${libellePrix(p.prix_centimes)} la séance`;
  return p.prix_duo_centimes === null ? seul : `${seul} · ${libellePrix(p.prix_duo_centimes)} par personne à deux`;
}

type SeanceMin = Prix & { id: string; intervenant: string; type: string; debut: string };

export type Preparateur<S extends SeanceMin> = { intervenant: string; seances: S[]; tarifs: Prix | null };

/**
 * Regroupe les créneaux individuels et bilans par intervenant. Ordre : le
 * préparateur dont le prochain créneau arrive le plus tôt d'abord. Les
 * tarifs affichés sont ceux de son prochain créneau individuel.
 */
export function preparateurs<S extends SeanceMin>(seances: S[]): Preparateur<S>[] {
  const parNom = new Map<string, S[]>();
  for (const s of [...seances].sort((a, b) => a.debut.localeCompare(b.debut))) {
    if (!TYPES_INDIVIDUELS.has(s.type as "individuel" | "bilan")) continue;
    const cle = s.intervenant.trim();
    if (!cle) continue;
    parNom.set(cle, [...(parNom.get(cle) ?? []), s]);
  }
  return [...parNom].map(([intervenant, liste]) => {
    const ind = liste.find((s) => s.type === "individuel" && s.prix_centimes !== null);
    return {
      intervenant,
      seances: liste,
      tarifs: ind ? { prix_centimes: ind.prix_centimes, prix_duo_centimes: ind.prix_duo_centimes } : null,
    };
  });
}
```

- [ ] **Step 4** : `npm test` (+4), `npx tsc --noEmit`, `npm run lint`.
- [ ] **Step 5: Commit** « klub : règles de la préparation individuelle ».

---

### Task 2: La base

**Files:** Create `supabase/migrations/20261013110000_klub_individuel.sql`, `supabase/tests/klub_individuel.sql`.

**Avant d'écrire**, relève en production :
- les noms et définitions des contraintes `check` qui listent les types sur `klub_creneaux` et `klub_seances` ;
- la signature de `klub__inscrire` et de `klub_inscrire`, et **toutes les fonctions qui appellent `klub__inscrire`** (au moins `klub_inscrire` et `klub_admin_ajouter`) ;
- si `klub_admin_creer_seance` et `klub_admin_sauver_creneau` valident le type en plpgsql, en plus de la contrainte.

- [ ] **Step 1: La migration**, en une seule transaction. Ce qu'elle fait :

1. **Types** : les contraintes de type des deux tables acceptent aussi `individuel` et `bilan`. Supprime-les par leur nom réel, puis recrée-les avec les six valeurs.

2. **Prix duo** : `prix_duo_centimes integer check (prix_duo_centimes is null or prix_duo_centimes between 0 and 100000)` sur `klub_creneaux` et `klub_seances`.

3. **Contraintes des nouveaux types**, sur les deux tables, `not valid` puis `validate constraint`. Aucune ligne existante n'est de ces types, la validation passe.

```sql
check (type not in ('individuel', 'bilan') or (capacite = 1 and inscription_requise and reservation_url is null))
check (type <> 'bilan' or (prix_centimes is null and prix_duo_centimes is null))
check (prix_duo_centimes is null or type = 'individuel')
```

   Vérifie que `reservation_url` existe sur `klub_creneaux` aussi. Sinon, adapte la première contrainte sur cette table.

4. **Héritage** : redéfinis `klub__heriter_encaissement` (production) pour copier aussi `prix_duo_centimes` depuis le créneau, dans les mêmes conditions.

5. **Inscription** : `klub_inscriptions` gagne :

```sql
add column nb_personnes smallint not null default 1 check (nb_personnes in (1, 2)),
add column accompagnant text check (accompagnant is null or char_length(btrim(accompagnant)) between 1 and 120),
add constraint klub_inscriptions_duo check ((nb_personnes = 2) = (accompagnant is not null))
```

6. **`klub__inscrire`** gagne deux paramètres, `p_a_deux boolean` et `p_accompagnant text`.
   - Supprime l'ancienne signature après avoir recréé la nouvelle, et mets à jour **chaque appelant** relevé plus haut, en lui passant `false, null`.
   - Dans le corps (version production), avant toute écriture :
     - si `p_a_deux` : lever `KLUB_DUO` si `s.type <> 'individuel'` ou `s.prix_duo_centimes is null` ; lever `KLUB_ACCOMPAGNANT` si `btrim(p_accompagnant)` est vide ou dépasse 120 caractères ;
     - à l'insertion d'une **nouvelle** inscription : `nb_personnes = case when p_a_deux then 2 else 1 end`, `accompagnant = case when p_a_deux then left(btrim(p_accompagnant), 120) end`, et `montant_centimes = case when p_a_deux then 2 * s.prix_duo_centimes else s.prix_centimes end` là où la partie 2 posait `s.prix_centimes`.
   - Un doublon (même adresse, inscription active) garde ses choix d'origine.

7. **`klub_inscrire`** (publique) : recrée-la avec `p_a_deux boolean default false, p_accompagnant text default null` **en fin de liste**, et supprime l'ancienne signature à 6 paramètres. La route en production, qui appelle avec 6 arguments nommés, continue de fonctionner grâce aux valeurs par défaut : **vérifie-le** dans la transaction d'essai par un appel nommé à 6 arguments (`select public.klub_inscrire(p_seance => …, p_prenom => …, …)`). Re-donne les mêmes `grant` (service_role seul).

8. **`klub__remplir`** (production) : à la promotion payante, `montant_centimes = case when i.nb_personnes = 2 then 2 * s.prix_duo_centimes else s.prix_centimes end`. Si le créneau ne propose plus le duo (`prix_duo_centimes` null) et que `nb_personnes = 2`, garde le montant déjà enregistré sur l'inscription.

9. **`klub__seance_publique`** (production) : ajoute `'prix_duo_centimes', s.prix_duo_centimes`. Rien d'autre.

10. **`klub_admin_encaissement`** (production) : l'assouplissement pour les deux nouveaux types.

```sql
  -- Un praticien se rattache lui-même à ses créneaux individuels et bilans
  -- (spec partie 3, § 5) : seulement à lui-même, seulement si personne
  -- d'autre n'y est rattaché.
  if p_praticien is distinct from v_praticien and not v_gerant then
    if not (v_type in ('individuel', 'bilan')
            and p_praticien = auth.uid()
            and (v_praticien is null or v_praticien = auth.uid())) then
      raise exception 'KLUB_ENCAISSEMENT';
    end if;
  end if;
```

   `v_type` est lu avec le praticien et le prix. La règle du prix ne change pas : gérant, ou praticien déjà rattaché. Après un rattachement à soi-même dans le même appel, le praticien peut aussi poser le prix : évalue la règle du prix avec `coalesce(p_praticien, v_praticien)` pour ces deux types seulement, et explique ton choix dans le rapport.

11. **Écrire le prix duo** : une fonction à part, et pas un paramètre facultatif de `klub_admin_encaissement`. Le back-office actuel appelle cette fonction avec quatre arguments : un paramètre de plus, avec `null` par défaut, effacerait le prix duo à chaque enregistrement.

```sql
-- Codes : KLUB_DROITS, KLUB_CIBLE, KLUB_ENCAISSEMENT, KLUB_PRIX, KLUB_DUO.
create or replace function public.klub_admin_prix_duo(p_cible text, p_id uuid, p_prix_duo_centimes integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_praticien uuid;
  v_type text;
begin
  perform public.klub__verifier_droits();
  if p_cible not in ('seance', 'creneau') then raise exception 'KLUB_CIBLE'; end if;
  if p_prix_duo_centimes is not null and (p_prix_duo_centimes < 0 or p_prix_duo_centimes > 100000) then
    raise exception 'KLUB_PRIX';
  end if;
  if p_cible = 'seance' then
    select praticien_id, type into v_praticien, v_type from public.klub_seances where id = p_id for update;
  else
    select praticien_id, type into v_praticien, v_type from public.klub_creneaux where id = p_id for update;
  end if;
  if not found then raise exception 'KLUB_CIBLE'; end if;
  if v_type <> 'individuel' and p_prix_duo_centimes is not null then raise exception 'KLUB_DUO'; end if;
  if not coalesce(public.site_est_super_admin(), false) and v_praticien is distinct from auth.uid() then
    raise exception 'KLUB_ENCAISSEMENT';
  end if;
  if p_cible = 'seance' then
    update public.klub_seances set prix_duo_centimes = p_prix_duo_centimes where id = p_id;
  else
    update public.klub_creneaux set prix_duo_centimes = p_prix_duo_centimes where id = p_id;
  end if;
end;
$$;
revoke all on function public.klub_admin_prix_duo(text, uuid, integer) from public, anon;
grant execute on function public.klub_admin_prix_duo(text, uuid, integer) to authenticated;
```

- [ ] **Step 2: Essai complet dans une transaction annulée**, puis **appliquer**, avec `name` = `klub_individuel`.

- [ ] **Step 3: Scénarios** — `supabase/tests/klub_individuel.sql`, même structure que `klub_paiement.sql`. Identités : Lucas (gérant), Hugo (`hugo.daminato@gmail.com`, retiré de `site_super_admins`), Baptiste (`baptiste` : retrouve son adresse dans `auth.users` via `profiles`, jointure sur `user_id`). S'il n'a pas de compte, prends n'importe quel autre compte de l'équipe, non gérant.
  - I1 : un `individuel` à capacité 2 est refusé ; un `bilan` avec un prix est refusé ; un `small` avec `prix_duo_centimes` est refusé.
  - I2 : en Hugo, créer un créneau `individuel`, puis `klub_admin_encaissement(…, hugo, 4000)` et `klub_admin_prix_duo(…, 3000)` : passent. En Hugo, `klub_admin_prix_duo` sur l'individuel de Baptiste : `KLUB_ENCAISSEMENT`. Sur un small : `KLUB_DUO`.
  - I3 : en Hugo, se rattacher à un `small` : `KLUB_ENCAISSEMENT`. Rattacher son `individuel` à Baptiste : `KLUB_ENCAISSEMENT`. Se rattacher à l'`individuel` de Baptiste : `KLUB_ENCAISSEMENT`.
  - I4 : `klub_inscrire(…, p_a_deux => true, p_accompagnant => 'Léa Martin')` sur un individuel à 4000 / duo 3000, sans compte Stripe → `confirmee`, `nb_personnes = 2`, `montant_centimes = 6000` ; `places_restantes = 0` ; une 2e adresse → `attente`.
  - I5 : avec un compte `acct_test` prêt pour le praticien → `paiement`, `montant_centimes = 6000`.
  - I6 : duo sur un individuel sans prix duo → `KLUB_DUO` ; duo sur un small → `KLUB_DUO` ; duo sans accompagnant → `KLUB_ACCOMPAGNANT`.
  - I7 : appel nommé à 6 arguments (ancienne forme) → fonctionne, `nb_personnes = 1`.
  - I8 : promotion d'un duo en attente sur un individuel payant → `paiement`, `montant_centimes = 2 × prix duo`.
  - I9 : un bilan se réserve gratuitement → `confirmee`, sans montant.

- [ ] **Step 4** : relance **en entier** `klub_individuel.sql`, `klub_paiement.sql`, `klub.sql`, `klub_images.sql`, `klub_reservation.sql`, `notifications.sql`, avec la contre-épreuve `assert false`. Vérifie qu'aucune donnée de test ne reste.
- [ ] **Step 5: Commit** « klub : séances individuelles, bilans et réservation à deux en base ».

---

### Task 3: Le parcours public

**Files:** Modify `lib/klub/types.ts`, `lib/klub/validation.ts`, `app/api/klub/inscription/route.ts`, `components/site/klub/KlubFormulaire.tsx`, `app/mugi-klub/seance/[id]/page.tsx`, le composant du planning, `lib/routes.ts`, `lib/site/plan.ts` (+ son test). Create `app/mugi-klub/preparation-individuelle/page.tsx`.

- [ ] **Step 1: Types** — `KlubType` gagne `"individuel" | "bilan"`. Libellés : « Séance individuelle », « Bilan offert ». Couleurs : prends deux teintes déjà présentes dans le site, distinctes de celles des autres types. `ChampsSeance` gagne `prix_duo_centimes: number | null`. Corrige tout `Record<KlubType, …>` non exhaustif (`tsc` les signale).

- [ ] **Step 2: Route d'inscription** — accepte `aDeux` (booléen) et `accompagnant` (texte). Valide l'accompagnant côté serveur comme le nom : non vide, 120 caractères au plus. Passe `p_a_deux` et `p_accompagnant` à `klub_inscrire`. Traduis `KLUB_DUO` (« La séance à deux n'est pas proposée sur ce créneau. ») et `KLUB_ACCOMPAGNANT` (« Indiquez le prénom et le nom de la seconde personne. ») dans `lib/klub/erreurs.ts`.

- [ ] **Step 3: Formulaire**, pour une séance `individuel` :
  - si `prix_duo_centimes` existe, deux boutons radio, « Seul » et « À deux » ;
  - à deux, un champ « Prénom et nom de la seconde personne » ;
  - le bouton affiche le montant de `montantReservation()` (« Payer et réserver · 60 € pour deux », ou « Réserver · 60 € à régler sur place » sans paiement en ligne) ;
  - la case « Première séance » devient « Première séance avec <intervenant> ». Cochée, elle affiche au-dessus du bouton « Avant une première séance, <intervenant> propose un bilan de 30 minutes offert. » et les liens vers ses trois prochains bilans libres. Ces bilans sont passés en props par la page de séance, qui les lit avec `getPlanning`, filtrés par type `bilan`, même intervenant, places restantes, à venir.

  Pour un `bilan`, le bouton dit « Réserver mon bilan offert ».

- [ ] **Step 4: Planning du Klub** — les types `individuel` et `bilan` n'y apparaissent plus (filtre dans la préparation du planning, avec un test dans `lib/klub/planning.test.ts`). Ajoute sous le planning un lien « Préparation individuelle et bilans offerts → ».

- [ ] **Step 5: La page** `app/mugi-klub/preparation-individuelle/page.tsx` :
  - `revalidate` à la même valeur littérale que `/mugi-klub` ; métadonnées via `metaPage()` de `lib/site.ts` ;
  - données : `getPlanning` sur 4 semaines, puis `preparateurs()` de `lib/klub/individuel.ts` ;
  - pour chaque préparateur : la fiche est retrouvée dans `FICHES` (`lib/fiches.ts`) en comparant les noms sans accents ni casse, avec sa photo, sa discipline (le badge de la fiche) et un lien vers `/equipe/<slug>`. Sans fiche, nom seul ;
  - puis les tarifs (`libelleTarifs`), « Bilan de 30 minutes offert avant la première séance. », et ses créneaux en cartes `KlubCarte` ;
  - aucun préparateur : « Aucun créneau individuel n'est ouvert pour le moment. » avec un lien vers le contact ;
  - en bas, l'encart sur la consultation de médecine du sport, au texte exact de la spec § 4, avec un lien vers la fiche du médecin du sport dans `FICHES` (vérifie le slug réel).

  Ajoute la route à `ROUTES` (`klubIndividuel`) et à `PAGES` dans `lib/site/plan.ts` (+ test).

- [ ] **Step 6** : `npm test`, tsc, lint, build. Commit « klub : réserver une séance individuelle, seul ou à deux, et la page des préparateurs ».

---

### Task 4: Le back-office

**Files:** Modify `components/admin/klub/*` (formulaire, créneaux, séances, détail), `lib/klub/types.ts` si `KLUB_TYPES` y vit.

- [ ] **Step 1** : `KLUB_TYPES` propose « Séance individuelle » et « Bilan offert ». Pour ces deux types :
  - la capacité est fixée à 1 et le champ est désactivé, avec l'aide « Une réservation par créneau, seul ou à deux » ;
  - « inscription requise » est imposée ;
  - la méthode de réservation externe est masquée.

  Pour un bilan, les champs de prix sont masqués.
- [ ] **Step 2** : un champ « Prix à deux, par personne (€) », pour une séance individuelle seulement. Même saisie que le prix (`centimesDepuisTexte` de `components/admin/klub/encaissement.ts`, avec la même protection contre une saisie illisible). Il s'écrit par `klub_admin_prix_duo` (tâche 2), appelée **seulement si sa valeur a changé**, **après** `klub_admin_encaissement` : le praticien doit être rattaché avant de pouvoir poser le prix duo. Ajoute `KLUB_DUO` à `ERREURS_ADMIN` de `rpc.ts`.
- [ ] **Step 3** : à la création d'un créneau ou d'une séance individuel ou bilan par un non-gérant, le praticien qui encaisse est le praticien connecté, déjà sélectionné. Un gérant choisit librement.
- [ ] **Step 4** : la liste des inscrits affiche un duo « Prénom Nom + <accompagnant> (à deux) », avec le montant.
- [ ] **Step 5** : tsc, lint, build, `npm test`. Commit « klub : créneaux individuels et bilans dans le back-office ».

---

### Task 5: Les mails

**Files:** Modify `lib/klub/mails.ts` (+ test), `lib/klub/envoi.ts`.

- [ ] Le `Contexte` gagne `nbPersonnes` et `accompagnant` (lus sur l'inscription) et le type de séance.
- [ ] Confirmation d'un duo : ajoute « Séance à deux, avec <accompagnant>. ».
- [ ] Confirmation d'un bilan : remplace le texte de paiement par « Bilan offert de 30 minutes avec <intervenant>. Venez en tenue de sport. »
- [ ] La liste envoyée à l'intervenant affiche un duo « Prénom Nom + <accompagnant> ».
- [ ] Un test par texte. `npm test`, tsc, lint. Commit « klub : mails des séances à deux et des bilans ».

---

### Task 6: Vérification (session principale)

- [ ] `npm test`, tsc, lint, build ; tous les scénarios SQL du Klub et du paiement en entier.
- [ ] Relecture visuelle de la page « Préparation individuelle » et du formulaire (seul, à deux, bilan), sur ordinateur et sur téléphone.
- [ ] Mode test Stripe, quand les clés de Lucas sont en place : réservation seule, à deux, annulation d'un duo remboursée en entier.
- [ ] Pousser, ouvrir la PR vers `feature/klub-paiement`. Ne pas fusionner sans l'accord de Lucas.
