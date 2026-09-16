# Mugi Klub : inscriptions en ligne, plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permettre aux visiteurs de mugitu-biarritz.fr de s'inscrire aux séances du Mugi Klub (places comptées, liste d'attente, mails), et à l'équipe de tout gérer depuis `/admin/mugi-klub`.

**Architecture:** Toutes les règles (places, liste d'attente, génération des séances, file de mails) vivent dans Postgres (Supabase `nuehdfyscqnkckudkqhe`), en fonctions `security definer` derrière des tables fermées au public. Next.js 16 (App Router) affiche le planning via des RPC publiques sans donnée personnelle, écrit via des routes API qui utilisent la clé de service, et envoie les mails Brevo depuis une file vidée par un cron Vercel chaque minute. Spec : `docs/superpowers/specs/2026-09-15-mugi-klub-inscriptions-design.md`.

**Tech Stack:** Next.js 16.2, React 19.2, TypeScript, Supabase (Postgres 17, PostgREST, MCP compte 4497), Brevo API transactionnelle, Vercel (plan Pro, cron), tests `node --test` (Node 22.18, types retirés nativement).

---

## Règles pour l'exécutant

- **Lire `AGENTS.md`** : cette version de Next diffère de la mémoire d'entraînement. Avant d'utiliser une API Next, vérifier dans `node_modules/next/dist/docs/`. Déjà vérifié pour ce plan : `after` (`next/server`, utilisable en route handler), `revalidatePath` (`next/cache`, chemin concret d'une route dynamique accepté), `params` et `searchParams` sont des `Promise`.
- **Supabase** : toujours l'outil MCP `mcp__4497d48a-79cd-4b24-bdf1-1339728e2b85__apply_migration` / `execute_sql` avec `project_id: "nuehdfyscqnkckudkqhe"`. La MCP `mcp__supabase__*` pointe sur un autre projet : ne jamais l'utiliser ici.
- **Textes visibles** (site, mails) : respecter `~/Documents/marqueurs-langage-ia-brief-design.md`. Pas d'antithèse corrective, pas de tricolon systématique, peu de tirets cadratins, apostrophe typographique `’` dans les textes affichés.
- **Commits** : n'ajouter que les fichiers de la tâche (`git add <chemins>`), jamais `git add -A`. Terminer chaque message par la ligne `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- **Ne jamais manipuler de clé secrète** : Lucas pose lui-même `SUPABASE_SERVICE_ROLE_KEY` et `CRON_SECRET`.

## Carte des fichiers

| Fichier | Rôle |
|---|---|
| `supabase/migrations/20260915120000_klub_tables.sql` | tables, index, RLS, déclencheurs |
| `supabase/migrations/20260915120100_klub_visiteur.sql` | lecture publique, inscription, annulation, promotion, réservation des mails |
| `supabase/migrations/20260915120200_klub_admin_tache.sql` | fonctions admin, génération, tâche planifiée |
| `supabase/tests/klub.sql` | scénarios SQL dans une transaction annulée |
| `scripts/klub-concurrence.mjs` | dix inscriptions simultanées sur une place |
| `lib/klub/types.ts` | types et libellés partagés |
| `lib/klub/format.ts` (+ `.test.ts`) | dates et heures de Paris, semaines, état des places |
| `lib/klub/erreurs.ts` | messages des codes `KLUB_*` |
| `lib/klub/validation.ts` (+ `.test.ts`) | contrôle des coordonnées |
| `lib/klub/ics.ts` (+ `.test.ts`) | fichier agenda |
| `lib/klub/regles-envoi.ts` (+ `.test.ts`) | pertinence d'un mail au départ, délais de relance |
| `lib/klub/mails.ts` (+ `.test.ts`) | gabarits des huit mails |
| `lib/klub/envoi.ts` | réservation, envoi Brevo, mise à jour de la file |
| `lib/klub/donnees.ts` | lectures publiques côté serveur |
| `lib/brevo.ts` | envoi Brevo générique (extrait de `lib/newsletter.ts`) |
| `lib/supabase-service.ts` | appels PostgREST avec la clé de service |
| `app/api/klub/inscription/route.ts`, `annulation/route.ts`, `tache/route.ts` | routes serveur |
| `vercel.json` | cron chaque minute |
| `app/mugi-klub/page.tsx` | planning réel et tarifs |
| `app/mugi-klub/seance/[id]/page.tsx` | page d'une séance |
| `app/mugi-klub/annulation/page.tsx` | page d'annulation |
| `components/site/klub/*` | `KlubPlanning`, `KlubSemaines`, `KlubCarte`, `KlubFormulaire`, `KlubAnnulation` |
| `components/admin/KlubAdmin.tsx` | coquille de l'admin (réécrite) |
| `components/admin/klub/*` | `styles`, `rpc`, `ChampsSeanceForm`, `KlubCreneaux`, `KlubSeances`, `KlubSeanceDetail`, `KlubMailsEnErreur` |
| `lib/klub.ts` | contenu statique : tarifs corrigés, appel final |
| `lib/routes.ts` | routes Klub |
| `lib/institutionnel.ts` | section Mugi Klub de la confidentialité |
| supprimés | `lib/klub-events.ts`, `components/site/MugiKlubPlanning.tsx`, `components/site/KlubBientot.tsx`, table `klub_events` |

---

### Task 0: Worktree de travail

Le dossier principal contient des copies non suivies (`KlubAdmin 3.tsx`, `lib/klub-events 2.ts`…) qui importent des fichiers que ce chantier supprime. Un worktree propre évite que le build local échoue à cause d'elles.

- [ ] **Step 1: Créer le worktree**

```bash
cd /Users/lucas/Desktop/mugitu-biarritz
git switch main
git worktree add ../mugitu-biarritz-klub feature/klub-inscriptions
cd ../mugitu-biarritz-klub
npm ci
```

Expected: `Preparing worktree (checking out 'feature/klub-inscriptions')`, puis `added N packages`.

- [ ] **Step 2: Vérifier l'état de départ**

Run: `git log --oneline -3 && npm run lint`
Expected: les commits de spec en tête, lint sans erreur.

Tous les chemins qui suivent sont relatifs à `/Users/lucas/Desktop/mugitu-biarritz-klub`.

---

### Task 1: Types partagés et formatage des dates

**Files:**
- Modify: `tsconfig.json`, `package.json`
- Create: `lib/klub/types.ts`, `lib/klub/format.ts`
- Test: `lib/klub/format.test.ts`

- [ ] **Step 1: Autoriser les imports `.ts` et ajouter le script de test**

Dans `tsconfig.json`, ajouter dans `compilerOptions`, après `"noEmit": true,` :

```json
    "allowImportingTsExtensions": true,
```

Dans `package.json`, remplacer le bloc `scripts` par :

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "node --test lib/klub/*.test.ts"
  },
```

Les modules testés s'importent entre eux avec l'extension `.ts` : Node exécute les fichiers TypeScript sans compilation mais ne devine pas l'extension.

- [ ] **Step 2: Créer `lib/klub/types.ts`**

```ts
/**
 * Types et libellés du Mugi Klub, partagés par le site, l'admin et les mails.
 * Aucun import : ce fichier est lu tel quel par les tests `node --test`.
 */

export type KlubType = "small" | "atelier" | "conf" | "soiree";

export const KLUB_TYPES: { value: KlubType; label: string }[] = [
  { value: "small", label: "Small group" },
  { value: "atelier", label: "Atelier" },
  { value: "conf", label: "Conférence" },
  { value: "soiree", label: "Soirée" },
];

export const LIBELLE_TYPE: Record<KlubType, string> = {
  small: "Small group",
  atelier: "Atelier",
  conf: "Conférence",
  soiree: "Soirée",
};

export const COULEUR_TYPE: Record<KlubType, string> = {
  small: "#04A49B",
  atelier: "#d49a40",
  conf: "#003850",
  soiree: "#EE806C",
};

/** 1 = lundi … 7 = dimanche, comme `isodow` en Postgres. */
export const KLUB_JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] as const;

/** Champs descriptifs communs au créneau et à la séance. */
export type ChampsSeance = {
  type: KlubType;
  titre: string;
  description: string;
  intervenant: string;
  intervenant_email: string | null;
  duree_min: number;
  capacite: number | null;
  prix_libelle: string;
  inscription_requise: boolean;
};

export type Creneau = ChampsSeance & {
  /** Chaîne vide pour un créneau pas encore enregistré. */
  id: string;
  jour: number;
  /** `HH:MM:SS`, heure de Paris. */
  heure: string;
  actif: boolean;
};

export type Seance = ChampsSeance & {
  id: string;
  creneau_id: string | null;
  debut: string;
  statut: "publiee" | "annulee";
  modifiee: boolean;
};

/** Ce que renvoient `klub_planning` et `klub_seance` : aucune donnée personnelle. */
export type SeancePublique = Omit<ChampsSeance, "intervenant_email"> & {
  id: string;
  debut: string;
  statut: "publiee" | "annulee";
  places_restantes: number | null;
  nb_attente: number;
};

export type StatutInscription = "confirmee" | "attente" | "annulee";

export type Inscription = {
  id: string;
  seance_id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  premiere_seance: boolean;
  statut: StatutInscription;
  present: boolean;
  origine: "site" | "admin";
  jeton: string;
  created_at: string;
};

export type TypeMail =
  | "confirmation"
  | "attente"
  | "promotion"
  | "annulation"
  | "rappel"
  | "seance_modifiee"
  | "seance_annulee"
  | "liste_intervenant";

export type Mail = {
  id: string;
  type: TypeMail;
  inscription_id: string | null;
  seance_id: string;
  envoyer_apres: string;
  statut: "a_envoyer" | "en_cours" | "envoye" | "erreur" | "abandonne";
  tentatives: number;
  derniere_erreur: string | null;
  created_at: string;
};

export type ReponseInscription = {
  statut: "confirmee" | "attente";
  rang: number | null;
  mail_id: string | null;
  debut: string;
  titre: string;
};

export type InfosAnnulation = {
  prenom: string;
  statut: StatutInscription;
  seance: SeancePublique;
};
```

- [ ] **Step 3: Écrire le test `lib/klub/format.test.ts`**

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ajouterJours,
  cleJour,
  dateHeure,
  dateLongue,
  depuisChampDateHeure,
  etatPlaces,
  heure,
  lundiDe,
  rang,
  semaines,
  versChampDateHeure,
} from "./format.ts";
import type { SeancePublique } from "./types.ts";

test("heure et date de Paris en heure d'été", () => {
  assert.equal(heure("2026-09-22T10:30:00Z"), "12 h 30");
  assert.equal(dateLongue("2026-09-22T10:30:00Z"), "mardi 22 septembre");
  assert.equal(dateHeure("2026-09-22T10:30:00Z"), "mardi 22 septembre à 12 h 30");
});

test("heure de Paris en heure d'hiver", () => {
  assert.equal(heure("2026-11-03T11:30:00Z"), "12 h 30");
  assert.equal(heure("2026-11-03T08:05:00Z"), "9 h 05");
});

test("la clé de jour suit Paris, pas UTC", () => {
  assert.equal(cleJour("2026-09-21T22:30:00Z"), "2026-09-22");
});

test("semaines à partir d'aujourd'hui", () => {
  assert.equal(lundiDe("2026-09-16"), "2026-09-14");
  assert.equal(lundiDe("2026-09-20"), "2026-09-14");
  assert.equal(ajouterJours("2026-10-30", 3), "2026-11-02");
  const s = semaines("2026-09-16", 4);
  assert.equal(s.length, 4);
  assert.deepEqual(s[0], { debut: "2026-09-14", fin: "2026-09-20", libelle: "14 sept. – 20 sept." });
  assert.equal(s[3].debut, "2026-10-05");
});

test("rang lisible", () => {
  assert.equal(rang(1), "1ʳᵉ");
  assert.equal(rang(3), "3ᵉ");
});

const base: SeancePublique = {
  id: "x",
  debut: "2026-09-22T10:30:00Z",
  duree_min: 45,
  type: "small",
  titre: "Renfo",
  description: "",
  intervenant: "Hugo",
  prix_libelle: "15 €",
  inscription_requise: true,
  capacite: 5,
  statut: "publiee",
  places_restantes: 3,
  nb_attente: 0,
};
const avant = "2026-09-20T08:00:00Z";

test("état des places", () => {
  assert.deepEqual(etatPlaces(base, avant), { texte: "3 places sur 5", ton: "ok" });
  assert.deepEqual(etatPlaces({ ...base, places_restantes: 1 }, avant), { texte: "1 place sur 5", ton: "peu" });
  assert.equal(etatPlaces({ ...base, places_restantes: 0 }, avant).ton, "complet");
  assert.equal(
    etatPlaces({ ...base, inscription_requise: false, capacite: null, places_restantes: null }, avant).texte,
    "Entrée libre",
  );
  assert.equal(etatPlaces({ ...base, statut: "annulee" }, avant).texte, "Annulée");
  assert.equal(etatPlaces(base, "2026-09-22T11:00:00Z").texte, "Terminée");
});

test("champ datetime-local en heure de Paris", () => {
  assert.equal(versChampDateHeure("2026-09-22T10:30:00Z"), "2026-09-22T12:30");
  assert.equal(depuisChampDateHeure("2026-09-22T12:30"), "2026-09-22T10:30:00.000Z");
  assert.equal(depuisChampDateHeure("2026-11-03T12:30"), "2026-11-03T11:30:00.000Z");
});
```

- [ ] **Step 4: Lancer le test, il doit échouer**

Run: `npm test`
Expected: FAIL, `Cannot find module '.../lib/klub/format.ts'`.

- [ ] **Step 5: Créer `lib/klub/format.ts`**

```ts
import type { SeancePublique } from "./types.ts";

/**
 * Dates du Mugi Klub. Tout est affiché à l'heure de Paris, quel que soit le
 * fuseau du serveur (UTC sur Vercel) ou du navigateur.
 */

const FUSEAU = "Europe/Paris";

function morceaux(instant: string | Date, options: Intl.DateTimeFormatOptions): Record<string, string> {
  const parts = new Intl.DateTimeFormat("fr-FR", { timeZone: FUSEAU, ...options }).formatToParts(new Date(instant));
  return Object.fromEntries(parts.map((p) => [p.type, p.value]));
}

const JOUR_HEURE: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
};

/** Jour à Paris, au format `AAAA-MM-JJ`. */
export function cleJour(instant: string | Date): string {
  const p = morceaux(instant, { year: "numeric", month: "2-digit", day: "2-digit" });
  return `${p.year}-${p.month}-${p.day}`;
}

/** `12 h 30`, heure de Paris. */
export function heure(instant: string | Date): string {
  const p = morceaux(instant, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  return `${Number(p.hour)} h ${p.minute}`;
}

/** `mardi 22 septembre`, jour de Paris. */
export function dateLongue(instant: string | Date): string {
  return new Intl.DateTimeFormat("fr-FR", { timeZone: FUSEAU, weekday: "long", day: "numeric", month: "long" }).format(
    new Date(instant),
  );
}

/** `mardi 22 septembre à 12 h 30`. */
export function dateHeure(instant: string | Date): string {
  return `${dateLongue(instant)} à ${heure(instant)}`;
}

/** Clé de jour décalée de `n` jours. */
export function ajouterJours(cle: string, n: number): string {
  const d = new Date(`${cle}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Lundi de la semaine qui contient `cle`. */
export function lundiDe(cle: string): string {
  const jour = new Date(`${cle}T12:00:00Z`).getUTCDay();
  return ajouterJours(cle, jour === 0 ? -6 : 1 - jour);
}

export type Semaine = { debut: string; fin: string; libelle: string };

function jourMois(cle: string): string {
  return new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", day: "numeric", month: "short" }).format(
    new Date(`${cle}T12:00:00Z`),
  );
}

/** Les `n` semaines à partir de celle qui contient `aujourdhui`. */
export function semaines(aujourdhui: string, n = 4): Semaine[] {
  const lundi = lundiDe(aujourdhui);
  return Array.from({ length: n }, (_, i) => {
    const debut = ajouterJours(lundi, 7 * i);
    const fin = ajouterJours(debut, 6);
    return { debut, fin, libelle: `${jourMois(debut)} – ${jourMois(fin)}` };
  });
}

/** Rang lisible : 1 → « 1ʳᵉ », 2 → « 2ᵉ ». */
export function rang(n: number): string {
  return n === 1 ? "1ʳᵉ" : `${n}ᵉ`;
}

export type EtatPlaces = { texte: string; ton: "ok" | "peu" | "complet" | "libre" | "annulee" | "passee" };

/** Libellé de disponibilité affiché sur les cartes et la page de séance. */
export function etatPlaces(s: SeancePublique, maintenant: string | Date): EtatPlaces {
  if (s.statut === "annulee") return { texte: "Annulée", ton: "annulee" };
  if (new Date(s.debut) <= new Date(maintenant)) return { texte: "Terminée", ton: "passee" };
  if (!s.inscription_requise) return { texte: "Entrée libre", ton: "libre" };
  const restantes = s.places_restantes ?? 0;
  if (restantes === 0) return { texte: "Complet, liste d’attente ouverte", ton: "complet" };
  return {
    texte: `${restantes} place${restantes > 1 ? "s" : ""} sur ${s.capacite}`,
    ton: restantes <= 2 ? "peu" : "ok",
  };
}

/** Valeur d'un champ `datetime-local` pour un instant, heure de Paris. */
export function versChampDateHeure(instant: string | Date): string {
  const p = morceaux(instant, JOUR_HEURE);
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

/**
 * Instant ISO pour une heure de Paris saisie dans un champ `datetime-local`.
 * Deux passes suffisent à retomber sur le bon décalage, y compris les jours
 * de changement d'heure.
 */
export function depuisChampDateHeure(valeur: string): string {
  const [date, temps] = valeur.split("T");
  const [a, m, j] = date.split("-").map(Number);
  const [h, mi] = temps.split(":").map(Number);
  const mur = Date.UTC(a, m - 1, j, h, mi);
  const decalage = (instant: number) => {
    const p = morceaux(new Date(instant), JOUR_HEURE);
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) - instant;
  };
  let instant = mur - decalage(mur);
  instant = mur - decalage(instant);
  return new Date(instant).toISOString();
}
```

- [ ] **Step 6: Lancer le test, il doit passer**

Run: `npm test`
Expected: `# pass 7`, `# fail 0`.

- [ ] **Step 7: Commit**

```bash
git add tsconfig.json package.json lib/klub/types.ts lib/klub/format.ts lib/klub/format.test.ts
git commit -m "klub : types partagés et dates à l'heure de Paris

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Codes d'erreur et validation des coordonnées

**Files:**
- Create: `lib/klub/erreurs.ts`, `lib/klub/validation.ts`
- Test: `lib/klub/validation.test.ts`

- [ ] **Step 1: Écrire le test `lib/klub/validation.test.ts`**

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { codeErreur, ERREURS } from "./erreurs.ts";
import { normaliserTelephone, UUID, verifierCoordonnees } from "./validation.ts";

const ok = { prenom: "Ana", nom: "Test", email: "ana@example.com", telephone: "06 12 34 56 78" };

test("coordonnées valides", () => {
  assert.equal(verifierCoordonnees(ok), null);
  assert.equal(verifierCoordonnees({ ...ok, telephone: "+33 6 12 34 56 78" }), null);
});

test("chaque problème a son code", () => {
  assert.equal(verifierCoordonnees({ ...ok, nom: "  " }), "KLUB_NOM");
  assert.equal(verifierCoordonnees({ ...ok, email: "ana@" }), "KLUB_EMAIL");
  assert.equal(verifierCoordonnees({ ...ok, telephone: "0612" }), "KLUB_TELEPHONE");
});

test("normalisation du téléphone", () => {
  assert.equal(normaliserTelephone("06.12-34 (56) 78"), "0612345678");
});

test("identifiant de séance", () => {
  assert.ok(UUID.test("3f2b8c1e-9a4d-4c7e-8b1a-2d3e4f5a6b7c"));
  assert.ok(!UUID.test("pas-un-uuid"));
});

test("codes lus dans les erreurs PostgREST", () => {
  assert.equal(codeErreur({ message: "KLUB_COMMENCEE" }), "KLUB_COMMENCEE");
  assert.equal(codeErreur(null), null);
  for (const code of ["KLUB_NOM", "KLUB_EMAIL", "KLUB_TELEPHONE", "KLUB_SEANCE", "KLUB_COMMENCEE", "KLUB_LIBRE"]) {
    assert.ok(ERREURS[code], code);
  }
});
```

- [ ] **Step 2: Lancer le test, il doit échouer**

Run: `npm test`
Expected: FAIL, `Cannot find module '.../lib/klub/erreurs.ts'`.

- [ ] **Step 3: Créer `lib/klub/erreurs.ts`**

```ts
/** Messages lisibles pour les codes levés par les fonctions Postgres du Klub. */
export const ERREURS: Record<string, string> = {
  KLUB_NOM: "Indiquez votre prénom et votre nom.",
  KLUB_EMAIL: "Cette adresse e-mail ne semble pas valide.",
  KLUB_TELEPHONE: "Ce numéro de téléphone ne semble pas valide.",
  KLUB_SEANCE: "Cette séance n’est plus proposée.",
  KLUB_COMMENCEE: "Cette séance a déjà commencé, les inscriptions sont fermées.",
  KLUB_LIBRE: "Pas besoin de s’inscrire à cette séance : l’entrée est libre.",
  KLUB_DROITS: "Votre compte n’a pas accès à l’admin du Klub.",
  KLUB_CAPACITE: "La capacité ne peut pas descendre sous le nombre d’inscrits confirmés.",
  KLUB_CHAMP: "Un champ est vide ou mal rempli.",
};

/** Extrait le code KLUB_* d'une réponse d'erreur PostgREST ou supabase-js. */
export function codeErreur(corps: unknown): string | null {
  const msg = (corps as { message?: unknown } | null)?.message;
  if (typeof msg !== "string") return null;
  const m = msg.match(/KLUB_[A-Z]+/);
  return m ? m[0] : null;
}
```

- [ ] **Step 4: Créer `lib/klub/validation.ts`**

```ts
/**
 * Contrôles du formulaire d'inscription. Mêmes règles que `klub__inscrire`
 * en base : ici pour répondre tout de suite, là-bas pour faire foi.
 */

export const EMAIL = /^[^\s@,;]{1,64}@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i;

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Jeton d'annulation : 32 octets en hexadécimal. */
export const JETON = /^[0-9a-f]{64}$/;

export function normaliserTelephone(t: string): string {
  return t.replace(/[\s.()-]/g, "");
}

export type Coordonnees = { prenom: string; nom: string; email: string; telephone: string };

/** Premier problème trouvé, sous forme de code `KLUB_*`, ou `null`. */
export function verifierCoordonnees(c: Coordonnees): string | null {
  if (!c.prenom.trim() || !c.nom.trim()) return "KLUB_NOM";
  if (!EMAIL.test(c.email.trim())) return "KLUB_EMAIL";
  if (!/^\+?[0-9]{9,15}$/.test(normaliserTelephone(c.telephone))) return "KLUB_TELEPHONE";
  return null;
}
```

- [ ] **Step 5: Lancer les tests, ils doivent passer**

Run: `npm test`
Expected: `# fail 0`.

- [ ] **Step 6: Commit**

```bash
git add lib/klub/erreurs.ts lib/klub/validation.ts lib/klub/validation.test.ts
git commit -m "klub : codes d'erreur et validation des coordonnées

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Fichier agenda (.ics)

**Files:**
- Create: `lib/klub/ics.ts`
- Test: `lib/klub/ics.test.ts`

- [ ] **Step 1: Écrire le test `lib/klub/ics.test.ts`**

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { genererIcs } from "./ics.ts";

const evenement = {
  uid: "abc",
  debut: "2026-09-22T10:30:00Z",
  dureeMin: 45,
  titre: "Renfo, mobilité; cœur",
  description: "Ligne 1\nLigne 2",
  lieu: "3 avenue Kléber, 64200 Biarritz",
  url: "https://mugitu-biarritz.fr/mugi-klub",
};

test("structure et horaires en UTC", () => {
  const ics = genererIcs(evenement, new Date("2026-09-15T08:00:00Z"));
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.ok(ics.includes("UID:abc@mugitu-biarritz.fr\r\n"));
  assert.ok(ics.includes("DTSTAMP:20260915T080000Z\r\n"));
  assert.ok(ics.includes("DTSTART:20260922T103000Z\r\n"));
  assert.ok(ics.includes("DTEND:20260922T111500Z\r\n"));
  assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
});

test("échappement des caractères réservés", () => {
  const ics = genererIcs(evenement, new Date("2026-09-15T08:00:00Z"));
  assert.ok(ics.includes("SUMMARY:Renfo\\, mobilité\\; cœur\r\n"));
  assert.ok(ics.includes("DESCRIPTION:Ligne 1\\nLigne 2\r\n"));
});

test("aucune ligne ne dépasse 75 octets", () => {
  const ics = genererIcs({ ...evenement, description: "é".repeat(200) }, new Date("2026-09-15T08:00:00Z"));
  const enc = new TextEncoder();
  for (const ligne of ics.split("\r\n")) assert.ok(enc.encode(ligne).length <= 75, ligne);
  assert.ok(ics.includes("\r\n é"));
});
```

- [ ] **Step 2: Lancer le test, il doit échouer**

Run: `npm test`
Expected: FAIL, `Cannot find module '.../lib/klub/ics.ts'`.

- [ ] **Step 3: Créer `lib/klub/ics.ts`**

```ts
/**
 * Fichier agenda joint aux mails de confirmation (RFC 5545). Les heures sont
 * écrites en UTC : chaque agenda les affiche dans le fuseau de son utilisateur.
 */

export type EvenementIcs = {
  uid: string;
  debut: string;
  dureeMin: number;
  titre: string;
  description: string;
  lieu: string;
  url: string;
};

const horodatage = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const echapper = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Coupe une ligne à 75 octets ; les lignes de suite commencent par une espace. */
function plier(ligne: string): string {
  const enc = new TextEncoder();
  const lignes: string[] = [];
  let courant = "";
  let octets = 0;
  for (const car of ligne) {
    const n = enc.encode(car).length;
    const limite = lignes.length === 0 ? 75 : 74;
    if (octets + n > limite) {
      lignes.push(courant);
      courant = "";
      octets = 0;
    }
    courant += car;
    octets += n;
  }
  lignes.push(courant);
  return lignes.join("\r\n ");
}

export function genererIcs(e: EvenementIcs, maintenant: Date = new Date()): string {
  const debut = new Date(e.debut);
  const fin = new Date(debut.getTime() + e.dureeMin * 60_000);
  const lignes = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mugitu Biarritz//Mugi Klub//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.uid}@mugitu-biarritz.fr`,
    `DTSTAMP:${horodatage(maintenant)}`,
    `DTSTART:${horodatage(debut)}`,
    `DTEND:${horodatage(fin)}`,
    `SUMMARY:${echapper(e.titre)}`,
    `DESCRIPTION:${echapper(e.description)}`,
    `LOCATION:${echapper(e.lieu)}`,
    `URL:${e.url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lignes.map(plier).join("\r\n") + "\r\n";
}
```

- [ ] **Step 4: Lancer les tests, ils doivent passer**

Run: `npm test`
Expected: `# fail 0`.

- [ ] **Step 5: Commit**

```bash
git add lib/klub/ics.ts lib/klub/ics.test.ts
git commit -m "klub : fichier agenda joint aux confirmations

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Tables, index et RLS

**Files:**
- Create: `supabase/migrations/20260915120000_klub_tables.sql`

`klub_events` n'est pas touchée ici : la page actuelle continue de fonctionner jusqu'à la Task 14.

- [ ] **Step 1: Écrire la migration**

```sql
-- Mugi Klub : inscriptions en ligne. Tables, index, RLS.
-- Spec : docs/superpowers/specs/2026-09-15-mugi-klub-inscriptions-design.md

create or replace function public.klub__touch()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
revoke execute on function public.klub__touch() from public, anon, authenticated;

-- Modèles hebdomadaires.
create table public.klub_creneaux (
  id uuid primary key default gen_random_uuid(),
  jour smallint not null check (jour between 1 and 7),
  heure time not null,
  duree_min smallint not null check (duree_min between 5 and 600),
  type text not null check (type in ('small', 'atelier', 'conf', 'soiree')),
  titre text not null check (char_length(trim(titre)) between 1 and 120),
  description text not null default '',
  intervenant text not null default '',
  intervenant_email text check (intervenant_email is null or intervenant_email ~* '^[^\s@]+@[^\s@]+\.[a-z]{2,}$'),
  capacite smallint check (capacite is null or capacite between 1 and 200),
  prix_libelle text not null default '',
  inscription_requise boolean not null default true,
  actif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (not inscription_requise or capacite is not null)
);

-- Séances datées, générées depuis un créneau ou créées à la main.
create table public.klub_seances (
  id uuid primary key default gen_random_uuid(),
  creneau_id uuid references public.klub_creneaux (id) on delete set null,
  debut timestamptz not null,
  duree_min smallint not null check (duree_min between 5 and 600),
  type text not null check (type in ('small', 'atelier', 'conf', 'soiree')),
  titre text not null check (char_length(trim(titre)) between 1 and 120),
  description text not null default '',
  intervenant text not null default '',
  intervenant_email text check (intervenant_email is null or intervenant_email ~* '^[^\s@]+@[^\s@]+\.[a-z]{2,}$'),
  capacite smallint check (capacite is null or capacite between 1 and 200),
  prix_libelle text not null default '',
  inscription_requise boolean not null default true,
  statut text not null default 'publiee' check (statut in ('publiee', 'annulee')),
  modifiee boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (not inscription_requise or capacite is not null),
  unique (creneau_id, debut)
);
create index klub_seances_debut on public.klub_seances (debut);

create table public.klub_inscriptions (
  id uuid primary key default gen_random_uuid(),
  seance_id uuid not null references public.klub_seances (id) on delete cascade,
  prenom text not null check (char_length(prenom) between 1 and 60),
  nom text not null check (char_length(nom) between 1 and 60),
  email text not null check (email = lower(email)),
  telephone text not null check (telephone ~ '^\+?[0-9]{9,15}$'),
  premiere_seance boolean not null default false,
  statut text not null check (statut in ('confirmee', 'attente', 'annulee')),
  present boolean not null default false,
  origine text not null default 'site' check (origine in ('site', 'admin')),
  jeton text not null unique default encode(extensions.gen_random_bytes(32), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Une adresse ne tient qu'une inscription active par séance.
create unique index klub_inscriptions_active on public.klub_inscriptions (seance_id, email) where statut <> 'annulee';
create index klub_inscriptions_seance on public.klub_inscriptions (seance_id, statut, created_at);

-- File d'envoi. Le contenu est construit au moment de l'envoi.
create table public.klub_mails (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('confirmation', 'attente', 'promotion', 'annulation', 'rappel',
                                     'seance_modifiee', 'seance_annulee', 'liste_intervenant')),
  inscription_id uuid references public.klub_inscriptions (id) on delete cascade,
  seance_id uuid not null references public.klub_seances (id) on delete cascade,
  envoyer_apres timestamptz not null default now(),
  statut text not null default 'a_envoyer' check (statut in ('a_envoyer', 'en_cours', 'envoye', 'erreur', 'abandonne')),
  tentatives smallint not null default 0,
  reserve_at timestamptz,
  derniere_erreur text,
  created_at timestamptz not null default now(),
  envoye_at timestamptz
);
-- Rappel et liste intervenant ne partent qu'une fois.
create unique index klub_mails_une_fois on public.klub_mails (type, inscription_id, seance_id) nulls not distinct
  where type in ('rappel', 'liste_intervenant');
create index klub_mails_file on public.klub_mails (statut, envoyer_apres);
create index klub_mails_inscription on public.klub_mails (inscription_id, created_at);
create index klub_mails_seance on public.klub_mails (seance_id);

create trigger klub_creneaux_touch before update on public.klub_creneaux for each row execute function public.klub__touch();
create trigger klub_seances_touch before update on public.klub_seances for each row execute function public.klub__touch();
create trigger klub_inscriptions_touch before update on public.klub_inscriptions for each row execute function public.klub__touch();

-- Aucune politique pour anon. Les praticiens lisent ; toutes les écritures
-- passent par des fonctions.
alter table public.klub_creneaux enable row level security;
alter table public.klub_seances enable row level security;
alter table public.klub_inscriptions enable row level security;
alter table public.klub_mails enable row level security;

create policy klub_creneaux_lecture_praticien on public.klub_creneaux for select to authenticated using (public.is_practitioner());
create policy klub_seances_lecture_praticien on public.klub_seances for select to authenticated using (public.is_practitioner());
create policy klub_inscriptions_lecture_praticien on public.klub_inscriptions for select to authenticated using (public.is_practitioner());
create policy klub_mails_lecture_praticien on public.klub_mails for select to authenticated using (public.is_practitioner());
```

- [ ] **Step 2: Appliquer la migration**

Outil `mcp__4497d48a-79cd-4b24-bdf1-1339728e2b85__apply_migration` avec `project_id: "nuehdfyscqnkckudkqhe"`, `name: "klub_tables"`, `query:` le contenu du fichier.
Expected: `{"success": true}`.

- [ ] **Step 3: Vérifier**

Outil `execute_sql` :

```sql
select c.relname, c.relrowsecurity
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname like 'klub\_%' and c.relkind = 'r'
order by 1;
```

Expected : `klub_creneaux`, `klub_events`, `klub_inscriptions`, `klub_mails`, `klub_seances`, toutes avec `relrowsecurity = true`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260915120000_klub_tables.sql
git commit -m "klub : tables des créneaux, séances, inscriptions et mails

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Fonctions du parcours visiteur

**Files:**
- Create: `supabase/tests/klub.sql`, `supabase/migrations/20260915120100_klub_visiteur.sql`

- [ ] **Step 1: Écrire les scénarios `supabase/tests/klub.sql`**

```sql
-- Scénarios du Mugi Klub. Tout se passe dans une transaction annulée à la
-- fin : rien n'est écrit en base. Les adresses @example.com ne sont jamais
-- envoyées (lib/klub/regles-envoi.ts).
-- Lancer avec l'outil MCP execute_sql (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « klub : scénarios OK ».

begin;

-- BLOC VISITEUR
do $$
declare
  v_s uuid;
  v_r jsonb;
  v_jeton text;
begin
  -- V1. Capacité 1 : le premier est confirmé, le deuxième en attente au rang 1.
  insert into public.klub_seances (debut, duree_min, type, titre, capacite, prix_libelle, inscription_requise)
  values (now() + interval '3 days', 45, 'small', 'Test V', 1, '15 €', true) returning id into v_s;
  v_r := public.klub_inscrire(v_s, 'Ana', 'Test', 'ANA@example.com', '06 12 34 56 78', true);
  assert v_r->>'statut' = 'confirmee', 'V1a ' || v_r;
  assert v_r->>'mail_id' is not null, 'V1b mail de confirmation absent';
  v_r := public.klub_inscrire(v_s, 'Bob', 'Test', 'bob@example.com', '0612345679', false);
  assert v_r->>'statut' = 'attente' and (v_r->>'rang')::int = 1, 'V1c ' || v_r;

  -- V2. Même adresse : réponse identique, pas de doublon, pas de nouveau mail avant 10 minutes.
  v_r := public.klub_inscrire(v_s, 'Ana', 'Test', 'ana@example.com', '0612345678', true);
  assert v_r->>'statut' = 'confirmee' and v_r->>'mail_id' is null, 'V2a ' || v_r;
  assert (select count(*) from public.klub_inscriptions where seance_id = v_s) = 2, 'V2b doublon';

  -- V3. Annulation à plus de 2 h : Bob est promu et prévenu.
  select jeton into v_jeton from public.klub_inscriptions where seance_id = v_s and email = 'ana@example.com';
  v_r := public.klub_annuler(v_jeton);
  assert v_r->>'resultat' = 'annulee', 'V3a ' || v_r;
  assert (select statut from public.klub_inscriptions where seance_id = v_s and email = 'bob@example.com') = 'confirmee', 'V3b';
  assert exists (select 1 from public.klub_mails where seance_id = v_s and type = 'promotion'), 'V3c';
  assert exists (select 1 from public.klub_mails where seance_id = v_s and type = 'annulation'), 'V3d';

  -- V4. Le même lien une seconde fois.
  assert public.klub_annuler(v_jeton)->>'resultat' = 'deja', 'V4';

  -- V5. Réinscription après annulation : nouvelle ligne, en attente.
  v_r := public.klub_inscrire(v_s, 'Ana', 'Test', 'ana@example.com', '0612345678', false);
  assert v_r->>'statut' = 'attente', 'V5 ' || v_r;

  -- V6. À moins de 2 h : pas de promotion, la place va au prochain visiteur.
  update public.klub_seances set debut = now() + interval '90 minutes' where id = v_s;
  select jeton into v_jeton from public.klub_inscriptions where seance_id = v_s and email = 'bob@example.com';
  perform public.klub_annuler(v_jeton);
  assert (select statut from public.klub_inscriptions
          where seance_id = v_s and email = 'ana@example.com' and statut <> 'annulee') = 'attente', 'V6a';
  v_r := public.klub_inscrire(v_s, 'Cy', 'Test', 'cy@example.com', '0612345670', false);
  assert v_r->>'statut' = 'confirmee', 'V6b ' || v_r;

  -- V7. Séance commencée : inscription refusée, annulation refusée.
  update public.klub_seances set debut = now() - interval '1 minute' where id = v_s;
  begin
    perform public.klub_inscrire(v_s, 'Di', 'Test', 'di@example.com', '0612345671', false);
    assert false, 'V7a attendu KLUB_COMMENCEE';
  exception when raise_exception then
    assert sqlerrm = 'KLUB_COMMENCEE', 'V7a ' || sqlerrm;
  end;
  select jeton into v_jeton from public.klub_inscriptions where seance_id = v_s and email = 'cy@example.com';
  assert public.klub_annuler(v_jeton)->>'resultat' = 'passee', 'V7b';

  -- V8. Validation des coordonnées.
  update public.klub_seances set debut = now() + interval '3 days' where id = v_s;
  begin
    perform public.klub_inscrire(v_s, 'Di', 'Test', 'di@', '0612345671', false);
    assert false, 'V8a attendu KLUB_EMAIL';
  exception when raise_exception then assert sqlerrm = 'KLUB_EMAIL', 'V8a ' || sqlerrm;
  end;
  begin
    perform public.klub_inscrire(v_s, 'Di', 'Test', 'di@example.com', '0612', false);
    assert false, 'V8b attendu KLUB_TELEPHONE';
  exception when raise_exception then assert sqlerrm = 'KLUB_TELEPHONE', 'V8b ' || sqlerrm;
  end;
  begin
    perform public.klub_inscrire(v_s, ' ', 'Test', 'di@example.com', '0612345671', false);
    assert false, 'V8c attendu KLUB_NOM';
  exception when raise_exception then assert sqlerrm = 'KLUB_NOM', 'V8c ' || sqlerrm;
  end;

  -- V8d. Tabulation et espaces insécables tolérés, comme côté client.
  v_r := public.klub_inscrire(v_s, 'Dee', 'Test', E'dee@example.com\t', replace('06_12_34_56_78', '_', chr(160)), false);
  assert v_r->>'statut' in ('confirmee', 'attente'), 'V8d ' || v_r;
  assert exists (select 1 from public.klub_inscriptions
                 where seance_id = v_s and email = 'dee@example.com' and telephone = '0612345678'), 'V8d stockage';

  -- V9. Entrée libre et séance annulée.
  update public.klub_seances set inscription_requise = false, capacite = null where id = v_s;
  begin
    perform public.klub_inscrire(v_s, 'Di', 'Test', 'di@example.com', '0612345671', false);
    assert false, 'V9a attendu KLUB_LIBRE';
  exception when raise_exception then assert sqlerrm = 'KLUB_LIBRE', 'V9a ' || sqlerrm;
  end;
  update public.klub_seances set inscription_requise = true, capacite = 5, statut = 'annulee' where id = v_s;
  begin
    perform public.klub_inscrire(v_s, 'Di', 'Test', 'di@example.com', '0612345671', false);
    assert false, 'V9b attendu KLUB_SEANCE';
  exception when raise_exception then assert sqlerrm = 'KLUB_SEANCE', 'V9b ' || sqlerrm;
  end;

  -- V10. La page d'annulation ne reçoit ni e-mail ni téléphone.
  select jeton into v_jeton from public.klub_inscriptions where seance_id = v_s and email = 'cy@example.com';
  v_r := public.klub_annulation_infos(v_jeton);
  assert v_r->>'prenom' = 'Cy', 'V10a ' || v_r;
  assert v_r::text !~ '(example\.com|0612345670|email|telephone)', 'V10b ' || v_r;

  -- V11. Jeton inconnu.
  assert public.klub_annuler(repeat('0', 64))->>'resultat' = 'inconnu', 'V11';
end $$;
-- FIN BLOC VISITEUR

-- BLOC DROITS
set local role anon;
do $$
begin
  assert (select count(*) from public.klub_inscriptions) = 0, 'P1 anon lit les inscriptions';
  assert (select count(*) from public.klub_mails) = 0, 'P2 anon lit les mails';
  begin
    perform public.klub_inscrire(gen_random_uuid(), 'a', 'b', 'c@example.com', '0612345678', false);
    assert false, 'P3 anon peut appeler klub_inscrire';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.klub_annuler(repeat('a', 64));
    assert false, 'P5 anon peut appeler klub_annuler';
  exception when insufficient_privilege then null;
  end;
  assert public.klub_planning(now() - interval '1 day', now() + interval '30 days')::text !~ '(example\.com|email|telephone|jeton)',
    'P6 donnée personnelle dans le planning';
end $$;
reset role;
-- FIN BLOC DROITS

-- BLOC SERVICE_ROLE
-- Les aides `klub__*` sont retirées à service_role : la clé de service doit
-- garder son parcours complet par les seules fonctions publiques.
do $$
declare
  v_s uuid;
begin
  insert into public.klub_seances (debut, duree_min, type, titre, capacite, prix_libelle, inscription_requise)
  values (now() + interval '4 days', 45, 'small', 'Test S', 3, '15 €', true) returning id into v_s;
  perform set_config('klub.test_seance', v_s::text, true);
end $$;

set local role service_role;
do $$
declare
  v_r jsonb;
begin
  v_r := public.klub_inscrire(current_setting('klub.test_seance')::uuid,
                              'Eve', 'Test', 'eve@example.com', '0612345672', false);
  assert v_r->>'statut' = 'confirmee', 'S1 ' || v_r;
end $$;
reset role;

-- Le jeton n'est lisible que hors service_role : on le relit ici.
do $$
begin
  perform set_config('klub.test_jeton',
    (select jeton from public.klub_inscriptions
     where seance_id = current_setting('klub.test_seance')::uuid and email = 'eve@example.com'), true);
end $$;

set local role service_role;
do $$
begin
  assert public.klub_annuler(current_setting('klub.test_jeton'))->>'resultat' = 'annulee', 'S2';
end $$;
reset role;
-- FIN BLOC SERVICE_ROLE

rollback;
select 'klub : scénarios OK' as resultat;
```

- [ ] **Step 2: Lancer les scénarios, ils doivent échouer**

Outil `execute_sql` avec le contenu du fichier.
Expected: erreur `function public.klub_inscrire(uuid, unknown, ...) does not exist`.

- [ ] **Step 3: Écrire `supabase/migrations/20260915120100_klub_visiteur.sql`**

```sql
-- Mugi Klub : fonctions du parcours visiteur.
-- Lecture publique sans donnée personnelle, inscription, annulation,
-- promotion depuis la liste d'attente, réservation des mails à envoyer.

-- Vue publique d'une séance : jamais d'e-mail, de téléphone ni de jeton.
create or replace function public.klub__seance_publique(s public.klub_seances)
returns jsonb language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'id', s.id,
    'debut', s.debut,
    'duree_min', s.duree_min,
    'type', s.type,
    'titre', s.titre,
    'description', s.description,
    'intervenant', s.intervenant,
    'prix_libelle', s.prix_libelle,
    'inscription_requise', s.inscription_requise,
    'capacite', s.capacite,
    'statut', s.statut,
    'places_restantes', case when s.inscription_requise then greatest(
      s.capacite - (select count(*) from public.klub_inscriptions i where i.seance_id = s.id and i.statut = 'confirmee'), 0) end,
    'nb_attente', (select count(*) from public.klub_inscriptions i where i.seance_id = s.id and i.statut = 'attente')
  );
$$;

create or replace function public.klub_planning(p_du timestamptz, p_au timestamptz)
returns jsonb language sql stable security definer set search_path = '' as $$
  select coalesce(jsonb_agg(public.klub__seance_publique(s) order by s.debut), '[]'::jsonb)
  from public.klub_seances s
  where s.debut >= p_du and s.debut < least(p_au, p_du + interval '35 days');
$$;

create or replace function public.klub_seance(p_id uuid)
returns jsonb language sql stable security definer set search_path = '' as $$
  select public.klub__seance_publique(s) from public.klub_seances s where s.id = p_id;
$$;

create or replace function public.klub_annulation_infos(p_jeton text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('prenom', i.prenom, 'statut', i.statut, 'seance', public.klub__seance_publique(s))
  from public.klub_inscriptions i
  join public.klub_seances s on s.id = i.seance_id
  where i.jeton = p_jeton;
$$;

-- Promeut la liste d'attente tant qu'il reste des places, si le début est à
-- plus de 2 heures. Prend son propre verrou sur la séance : réentrant si
-- l'appelant le tient déjà.
create or replace function public.klub__remplir(p_seance uuid)
returns integer language plpgsql security definer set search_path = '' as $$
declare
  s public.klub_seances;
  v_libres integer;
  v_promus integer := 0;
  v_id uuid;
begin
  select * into s from public.klub_seances where id = p_seance for no key update;
  if not found or s.statut <> 'publiee' or not s.inscription_requise or s.debut - now() <= interval '2 hours' then
    return 0;
  end if;
  v_libres := s.capacite - (select count(*) from public.klub_inscriptions where seance_id = p_seance and statut = 'confirmee');
  while v_libres > 0 loop
    v_id := null;
    select id into v_id from public.klub_inscriptions
    where seance_id = p_seance and statut = 'attente'
    order by created_at, id limit 1;
    exit when v_id is null;
    update public.klub_inscriptions set statut = 'confirmee' where id = v_id;
    insert into public.klub_mails (type, inscription_id, seance_id) values ('promotion', v_id, p_seance);
    v_libres := v_libres - 1;
    v_promus := v_promus + 1;
  end loop;
  return v_promus;
end;
$$;

-- Règle d'inscription commune au site et à l'admin.
-- p_si_complet : 'attente' ou 'forcer' (admin seulement).
create or replace function public.klub__inscrire(
  p_seance uuid, p_prenom text, p_nom text, p_email text, p_telephone text,
  p_premiere boolean, p_origine text, p_si_complet text
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  s public.klub_seances;
  -- Blancs tolérés comme côté client : tabulation, espace insécable (U+00A0)
  -- et espace fine insécable (U+202F), que trim() et \s ignorent.
  c_blancs constant text := E' \t\r\n' || chr(160) || chr(8239);
  v_email text := lower(btrim(coalesce(p_email, ''), c_blancs));
  v_tel text := regexp_replace(coalesce(p_telephone, ''), '[\s.()' || chr(160) || chr(8239) || '-]', '', 'g');
  v_existant public.klub_inscriptions;
  v_statut text;
  v_id uuid;
  v_mail uuid;
  v_rang integer;
begin
  if p_origine not in ('site', 'admin') then raise exception 'KLUB_ORIGINE'; end if;
  if char_length(btrim(coalesce(p_prenom, ''), c_blancs)) = 0
     or char_length(btrim(coalesce(p_nom, ''), c_blancs)) = 0 then
    raise exception 'KLUB_NOM';
  end if;
  if v_email !~ '^[^\s@,;]{1,64}@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$' then raise exception 'KLUB_EMAIL'; end if;
  if v_tel !~ '^\+?[0-9]{9,15}$' then raise exception 'KLUB_TELEPHONE'; end if;

  -- Le verrou sérialise les inscriptions d'une même séance : pas de surréservation.
  select * into s from public.klub_seances where id = p_seance for no key update;
  if not found or s.statut <> 'publiee' then raise exception 'KLUB_SEANCE'; end if;
  if not s.inscription_requise then raise exception 'KLUB_LIBRE'; end if;
  if (p_origine = 'site' and s.debut <= now())
     or (p_origine = 'admin' and s.debut + make_interval(mins => s.duree_min::int) <= now()) then
    raise exception 'KLUB_COMMENCEE';
  end if;

  select * into v_existant from public.klub_inscriptions
  where seance_id = p_seance and email = v_email and statut <> 'annulee';

  if found then
    -- Même réponse qu'une première inscription ; le mail n'est renvoyé
    -- qu'une fois par tranche de 10 minutes.
    v_id := v_existant.id;
    v_statut := v_existant.statut;
    if not exists (
      select 1 from public.klub_mails
      where inscription_id = v_id and type in ('confirmation', 'attente', 'promotion')
        and created_at > now() - interval '10 minutes'
    ) then
      insert into public.klub_mails (type, inscription_id, seance_id)
      values (case when v_statut = 'confirmee' then 'confirmation' else 'attente' end, v_id, p_seance)
      returning id into v_mail;
    end if;
  else
    if (select count(*) from public.klub_inscriptions where seance_id = p_seance and statut = 'confirmee') < s.capacite
       or p_si_complet = 'forcer' then
      v_statut := 'confirmee';
    else
      v_statut := 'attente';
    end if;
    -- `clock_timestamp()` et non le `now()` par défaut : l'ordre de la liste
    -- d'attente suit la prise du verrou, pas le début de la transaction.
    insert into public.klub_inscriptions (seance_id, prenom, nom, email, telephone, premiere_seance, statut, origine,
                                          created_at)
    values (p_seance, left(btrim(p_prenom, c_blancs), 60), left(btrim(p_nom, c_blancs), 60), v_email, v_tel,
            coalesce(p_premiere, false), v_statut, p_origine, clock_timestamp())
    returning id into v_id;
    insert into public.klub_mails (type, inscription_id, seance_id)
    values (case when v_statut = 'confirmee' then 'confirmation' else 'attente' end, v_id, p_seance)
    returning id into v_mail;
  end if;

  if v_statut = 'attente' then
    select count(*) into v_rang
    from public.klub_inscriptions a, public.klub_inscriptions moi
    where moi.id = v_id and a.seance_id = p_seance and a.statut = 'attente'
      and (a.created_at, a.id) <= (moi.created_at, moi.id);
  end if;

  return jsonb_build_object('statut', v_statut, 'rang', v_rang, 'mail_id', v_mail, 'debut', s.debut, 'titre', s.titre);
end;
$$;

create or replace function public.klub_inscrire(
  p_seance uuid, p_prenom text, p_nom text, p_email text, p_telephone text, p_premiere boolean
)
returns jsonb language sql security definer set search_path = '' as $$
  select public.klub__inscrire(p_seance, p_prenom, p_nom, p_email, p_telephone, p_premiere, 'site', 'attente');
$$;

-- Règle d'annulation commune. L'admin peut annuler jusqu'à la fin de la séance.
create or replace function public.klub__annuler(p_inscription uuid, p_admin boolean)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_seance uuid;
  s public.klub_seances;
  i public.klub_inscriptions;
  v_mail uuid;
begin
  select seance_id into v_seance from public.klub_inscriptions where id = p_inscription;
  if v_seance is null then return jsonb_build_object('resultat', 'inconnu'); end if;
  -- Même ordre de verrouillage que l'inscription : la séance d'abord.
  select * into s from public.klub_seances where id = v_seance for no key update;
  if not found then return jsonb_build_object('resultat', 'inconnu'); end if;
  select * into i from public.klub_inscriptions where id = p_inscription for no key update;
  if not found then return jsonb_build_object('resultat', 'inconnu'); end if;
  if i.statut = 'annulee' then return jsonb_build_object('resultat', 'deja', 'seance_id', s.id); end if;
  if not p_admin and s.statut = 'annulee' then return jsonb_build_object('resultat', 'seance_annulee', 'seance_id', s.id); end if;
  if (not p_admin and s.debut <= now())
     or (p_admin and s.debut + make_interval(mins => s.duree_min::int) <= now()) then
    return jsonb_build_object('resultat', 'passee', 'seance_id', s.id);
  end if;
  update public.klub_inscriptions set statut = 'annulee' where id = i.id;
  insert into public.klub_mails (type, inscription_id, seance_id) values ('annulation', i.id, s.id) returning id into v_mail;
  if i.statut = 'confirmee' then perform public.klub__remplir(s.id); end if;
  return jsonb_build_object('resultat', 'annulee', 'seance_id', s.id, 'mail_id', v_mail);
end;
$$;

create or replace function public.klub_annuler(p_jeton text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
begin
  select id into v_id from public.klub_inscriptions where jeton = p_jeton;
  if v_id is null then return jsonb_build_object('resultat', 'inconnu'); end if;
  return public.klub__annuler(v_id, false);
end;
$$;

-- Réserve des mails à envoyer. `skip locked` : l'envoi immédiat et la tâche
-- planifiée ne prennent jamais le même mail.
create or replace function public.klub_reserver_mails(p_id uuid, p_limite integer)
returns uuid[] language sql security definer set search_path = '' as $$
  with choisis as (
    select id from public.klub_mails
    where statut = 'a_envoyer' and envoyer_apres <= now() and (p_id is null or id = p_id)
    order by envoyer_apres, id
    limit greatest(least(coalesce(p_limite, 50), 200), 1)
    for update skip locked
  ), maj as (
    update public.klub_mails m
    set statut = 'en_cours', tentatives = m.tentatives + 1, reserve_at = now()
    from choisis where m.id = choisis.id
    returning m.id
  )
  select coalesce(array_agg(id), '{}') from maj;
$$;

revoke execute on function public.klub__seance_publique(public.klub_seances) from public, anon, authenticated;
revoke execute on function public.klub__remplir(uuid) from public, anon, authenticated;
revoke execute on function public.klub__inscrire(uuid, text, text, text, text, boolean, text, text) from public, anon, authenticated;
revoke execute on function public.klub__annuler(uuid, boolean) from public, anon, authenticated;
-- Les aides internes ne sont appelées que depuis les fonctions security definer.
revoke execute on function public.klub__remplir(uuid), public.klub__inscrire(uuid, text, text, text, text, boolean, text, text),
  public.klub__annuler(uuid, boolean), public.klub__seance_publique(public.klub_seances) from service_role;

revoke execute on function public.klub_inscrire(uuid, text, text, text, text, boolean) from public, anon, authenticated;
revoke execute on function public.klub_annuler(text) from public, anon, authenticated;
revoke execute on function public.klub_reserver_mails(uuid, integer) from public, anon, authenticated;
grant execute on function public.klub_inscrire(uuid, text, text, text, text, boolean) to service_role;
grant execute on function public.klub_annuler(text) to service_role;
grant execute on function public.klub_reserver_mails(uuid, integer) to service_role;

revoke execute on function public.klub_planning(timestamptz, timestamptz) from public;
revoke execute on function public.klub_seance(uuid) from public;
revoke execute on function public.klub_annulation_infos(text) from public;
grant execute on function public.klub_planning(timestamptz, timestamptz) to anon, authenticated;
grant execute on function public.klub_seance(uuid) to anon, authenticated;
grant execute on function public.klub_annulation_infos(text) to anon, authenticated;
```

- [ ] **Step 4: Appliquer la migration**

Outil `apply_migration`, `name: "klub_visiteur"`.
Expected: `{"success": true}`.

- [ ] **Step 5: Relancer les scénarios, ils doivent passer**

Outil `execute_sql` avec `supabase/tests/klub.sql`.
Expected: `[{"resultat":"klub : scénarios OK"}]`. Si une assertion échoue, le message commence par son code (`V6a`, `P3`…) : corriger la migration par une nouvelle `apply_migration` (`create or replace`) et reporter la correction dans le fichier.

- [ ] **Step 6: Vérifier les alertes de sécurité**

Outil `mcp__4497d48a-79cd-4b24-bdf1-1339728e2b85__get_advisors`, `type: "security"`.
Expected : les lints 0028/0029 qui citent `klub_planning`, `klub_seance` et `klub_annulation_infos` sont attendus (fonctions de lecture publique, aucune donnée personnelle). Toute autre alerte qui cite `klub_` est un problème — à l'exception de `klub_events_touch`, vestige de l'ancienne table `klub_events` supprimée en Task 20.

- [ ] **Step 7: Commit**

```bash
git add supabase/tests/klub.sql supabase/migrations/20260915120100_klub_visiteur.sql
git commit -m "klub : inscription, annulation et liste d'attente en base

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Test de concurrence sur la dernière place

**Files:**
- Create: `scripts/klub-concurrence.mjs`

Le verrou de séance ne se vérifie qu'avec de vraies connexions simultanées. Ce script doit tourner **avant** que le cron soit déployé (Task 13) : les mails mis en file sont supprimés avec la séance à la fin.

- [ ] **Step 1: Demander à Lucas la clé de service en local**

Message à Lucas : « Pour tester la concurrence, crée le fichier `/Users/lucas/Desktop/mugitu-biarritz-klub/.env.local` avec la ligne `SUPABASE_SERVICE_ROLE_KEY=…` (Supabase › Project Settings › API Keys › service_role). Le fichier est ignoré par git. » Attendre sa confirmation. Ne pas lire le fichier.

- [ ] **Step 2: Écrire `scripts/klub-concurrence.mjs`**

```js
// Dix inscriptions simultanées sur une séance à une place : une seule doit passer.
// Usage : node --env-file=.env.local scripts/klub-concurrence.mjs

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://nuehdfyscqnkckudkqhe.supabase.co";
const CLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!CLE) {
  console.error("SUPABASE_SERVICE_ROLE_KEY absente de .env.local");
  process.exit(1);
}
const entetes = { apikey: CLE, Authorization: `Bearer ${CLE}`, "Content-Type": "application/json" };

async function rest(chemin, init = {}) {
  const r = await fetch(`${URL}/rest/v1/${chemin}`, { ...init, headers: { ...entetes, ...init.headers } });
  const t = await r.text();
  if (!r.ok) throw new Error(`${chemin} ${r.status} ${t}`);
  return t ? JSON.parse(t) : null;
}

// À 60 jours : hors de la fenêtre de 28 jours affichée sur le site.
const [seance] = await rest("klub_seances", {
  method: "POST",
  headers: { Prefer: "return=representation" },
  body: JSON.stringify({
    debut: new Date(Date.now() + 60 * 86400_000).toISOString(),
    duree_min: 45,
    type: "small",
    titre: "Test concurrence",
    capacite: 1,
    prix_libelle: "",
    inscription_requise: true,
  }),
});

try {
  const resultats = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      fetch(`${URL}/rest/v1/rpc/klub_inscrire`, {
        method: "POST",
        headers: entetes,
        body: JSON.stringify({
          p_seance: seance.id,
          p_prenom: "Test",
          p_nom: `N${i}`,
          p_email: `concurrence${i}@example.com`,
          p_telephone: "0612345678",
          p_premiere: false,
        }),
      }).then((r) => r.json()),
    ),
  );
  const confirmees = resultats.filter((r) => r.statut === "confirmee").length;
  const rangs = resultats.filter((r) => r.statut === "attente").map((r) => r.rang).sort((a, b) => a - b);
  console.log({ confirmees, rangs });
  if (confirmees !== 1 || rangs.join() !== "1,2,3,4,5,6,7,8,9") {
    console.error("ÉCHEC", resultats);
    process.exitCode = 1;
  } else {
    console.log("OK : une place, une confirmation, neuf rangs distincts.");
  }
} finally {
  await rest(`klub_seances?id=eq.${seance.id}`, { method: "DELETE" });
}
```

- [ ] **Step 3: Lancer le script**

Run: `node --env-file=.env.local scripts/klub-concurrence.mjs`
Expected: `{ confirmees: 1, rangs: [1,2,3,4,5,6,7,8,9] }` puis `OK : une place, une confirmation, neuf rangs distincts.`

- [ ] **Step 4: Vérifier qu'il ne reste rien**

Outil `execute_sql` : `select count(*) from public.klub_seances where titre = 'Test concurrence';`
Expected: `0`.

- [ ] **Step 5: Commit**

```bash
git add scripts/klub-concurrence.mjs
git commit -m "klub : script de test de concurrence sur la dernière place

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Fonctions admin, génération des séances et tâche planifiée

**Files:**
- Modify: `supabase/tests/klub.sql`
- Create: `supabase/migrations/20260915120200_klub_admin_tache.sql`

- [ ] **Step 1: Ajouter les scénarios admin**

Dans `supabase/tests/klub.sql`, insérer ce bloc entre la ligne `-- FIN BLOC VISITEUR` et la ligne `-- BLOC DROITS` :

```sql
-- BLOC ADMIN ET TÂCHE
do $$
declare
  v_c uuid;
  v_s uuid;
  v_r jsonb;
  v_n integer;
  v_ids uuid[];
  v_praticien uuid;
  v_demain date := (now() at time zone 'Europe/Paris')::date + 1;
  v_modele jsonb;
begin
  select user_id into v_praticien from public.user_roles limit 1;
  assert v_praticien is not null, 'A0 aucun praticien dans user_roles';
  perform set_config('request.jwt.claims', json_build_object('sub', v_praticien, 'role', 'authenticated')::text, true);

  v_modele := jsonb_build_object(
    'jour', extract(isodow from v_demain)::int, 'heure', '10:00', 'duree_min', 45, 'type', 'small',
    'titre', 'Test A', 'capacite', 2, 'prix_libelle', '15 €', 'inscription_requise', true, 'actif', true);

  -- A1. Un créneau le jour de demain à 10 h donne 4 séances, une seule fois.
  v_r := public.klub_admin_sauver_creneau(v_modele);
  v_c := (v_r->>'id')::uuid;
  assert (select count(*) from public.klub_seances where creneau_id = v_c) = 4, 'A1a';
  perform public.klub__generer();
  assert (select count(*) from public.klub_seances where creneau_id = v_c) = 4, 'A1b doublons';

  -- A2. Propagation : la séance qui a un inscrit garde son titre.
  select id into v_s from public.klub_seances where creneau_id = v_c order by debut limit 1;
  perform public.klub_inscrire(v_s, 'Eve', 'Test', 'eve@example.com', '0612345672', false);
  v_r := public.klub_admin_sauver_creneau(v_modele || jsonb_build_object('id', v_c, 'titre', 'Test A2'));
  assert (v_r->>'conservees')::int = 1, 'A2a ' || v_r;
  assert (select titre from public.klub_seances where id = v_s) = 'Test A', 'A2b';
  assert (select count(*) from public.klub_seances where creneau_id = v_c and titre = 'Test A2') = 3, 'A2c';

  -- A3. Pause : seule la séance avec inscrit reste.
  perform public.klub_admin_sauver_creneau(v_modele || jsonb_build_object('id', v_c, 'actif', false));
  assert (select count(*) from public.klub_seances where creneau_id = v_c) = 1, 'A3';

  -- A4. Capacité : jamais sous les confirmés ; une hausse promeut la liste d'attente.
  perform public.klub_inscrire(v_s, 'Fred', 'Test', 'fred@example.com', '0612345673', false);
  perform public.klub_inscrire(v_s, 'Gus', 'Test', 'gus@example.com', '0612345674', false);
  begin
    perform public.klub_admin_modifier_seance(v_s,
      (select to_jsonb(s) from public.klub_seances s where id = v_s) || jsonb_build_object('capacite', 1));
    assert false, 'A4a attendu KLUB_CAPACITE';
  exception when raise_exception then assert sqlerrm = 'KLUB_CAPACITE', 'A4a ' || sqlerrm;
  end;
  v_r := public.klub_admin_modifier_seance(v_s,
    (select to_jsonb(s) from public.klub_seances s where id = v_s) || jsonb_build_object('capacite', 3));
  assert (select statut from public.klub_inscriptions where seance_id = v_s and email = 'gus@example.com') = 'confirmee', 'A4b';
  assert (v_r->>'prevenus')::int = 0, 'A4c la capacité seule ne prévient personne';
  assert (select modifiee from public.klub_seances where id = v_s), 'A4d';

  -- A5. Changement d'heure : les trois inscrits sont prévenus.
  v_r := public.klub_admin_modifier_seance(v_s,
    (select to_jsonb(s) || jsonb_build_object('debut', s.debut + interval '1 hour') from public.klub_seances s where id = v_s));
  assert (v_r->>'prevenus')::int = 3, 'A5 ' || v_r;

  -- A6. Ajout manuel sur séance complète : attente par défaut, dépassement sur demande.
  v_r := public.klub_admin_ajouter(v_s, 'Hal', 'Test', 'hal@example.com', '0612345675', false, 'attente');
  assert v_r->>'statut' = 'attente', 'A6a ' || v_r;
  v_r := public.klub_admin_ajouter(v_s, 'Ivy', 'Test', 'ivy@example.com', '0612345676', true, 'forcer');
  assert v_r->>'statut' = 'confirmee', 'A6b ' || v_r;
  assert (select origine from public.klub_inscriptions where seance_id = v_s and email = 'ivy@example.com') = 'admin', 'A6c';

  -- A7. Présence.
  perform public.klub_admin_presence((select id from public.klub_inscriptions where seance_id = v_s and email = 'ivy@example.com'), true);
  assert (select present from public.klub_inscriptions where seance_id = v_s and email = 'ivy@example.com'), 'A7';

  -- A8. Annulation par l'admin d'une inscription, puis de la séance.
  v_r := public.klub_admin_annuler_inscription((select id from public.klub_inscriptions where seance_id = v_s and email = 'ivy@example.com'));
  assert v_r->>'resultat' = 'annulee', 'A8a ' || v_r;
  v_n := public.klub_admin_annuler_seance(v_s);
  assert v_n = 4, 'A8b ' || v_n;
  assert (select count(*) from public.klub_mails where seance_id = v_s and type = 'seance_annulee') = 4, 'A8c';
  assert (select statut from public.klub_seances where id = v_s) = 'annulee', 'A8d';

  -- A9. Tâche : rappel et liste intervenant, une seule fois chacun.
  insert into public.klub_seances (debut, duree_min, type, titre, intervenant, intervenant_email, capacite, prix_libelle, inscription_requise)
  values (now() + interval '90 minutes', 45, 'small', 'Test tâche', 'Hugo', 'hugo@example.com', 5, '15 €', true)
  returning id into v_s;
  perform public.klub_inscrire(v_s, 'Jo', 'Test', 'jo@example.com', '0612345677', false);
  update public.klub_inscriptions set created_at = now() - interval '2 days' where seance_id = v_s;
  perform public.klub_tache();
  assert (select count(*) from public.klub_mails where seance_id = v_s and type = 'rappel') = 1, 'A9a rappel';
  assert (select count(*) from public.klub_mails where seance_id = v_s and type = 'liste_intervenant') = 1, 'A9b liste';
  perform public.klub_tache();
  assert (select count(*) from public.klub_mails where seance_id = v_s and type in ('rappel', 'liste_intervenant')) = 2, 'A9c doublons';

  -- A10. Un mail n'est réservé qu'une fois.
  select array_agg(id) into v_ids from public.klub_mails where seance_id = v_s;
  assert coalesce(array_length(public.klub_reserver_mails(v_ids[1], 1), 1), 0) = 1, 'A10a';
  assert coalesce(array_length(public.klub_reserver_mails(v_ids[1], 1), 1), 0) = 0, 'A10b';

  -- A11. Relance d'un mail en erreur.
  update public.klub_mails set statut = 'erreur', tentatives = 4 where id = v_ids[1];
  perform public.klub_admin_relancer_mail(v_ids[1]);
  assert (select statut = 'a_envoyer' and tentatives = 0 from public.klub_mails where id = v_ids[1]), 'A11';

  -- A12. Purge des séances de plus de 12 mois.
  insert into public.klub_seances (debut, duree_min, type, titre, capacite, prix_libelle, inscription_requise)
  values (now() - interval '13 months', 45, 'small', 'Test purge', 5, '', true) returning id into v_s;
  perform public.klub_tache();
  assert not exists (select 1 from public.klub_seances where id = v_s), 'A12';

  -- A13. Séance ponctuelle créée depuis l'admin.
  v_s := public.klub_admin_creer_seance(jsonb_build_object(
    'debut', now() + interval '10 days', 'duree_min', 90, 'type', 'atelier', 'titre', 'Test atelier',
    'capacite', 12, 'prix_libelle', '20 €', 'inscription_requise', true));
  assert (select creneau_id is null and capacite = 12 from public.klub_seances where id = v_s), 'A13a';
  begin
    perform public.klub_admin_creer_seance(jsonb_build_object('debut', now() + interval '10 days', 'duree_min', 90, 'type', 'atelier', 'titre', ''));
    assert false, 'A13b attendu KLUB_CHAMP';
  exception when raise_exception then assert sqlerrm = 'KLUB_CHAMP', 'A13b ' || sqlerrm;
  end;

  -- A14. Sans compte praticien, les fonctions admin refusent.
  perform set_config('request.jwt.claims', '', true);
  begin
    perform public.klub_admin_presence(gen_random_uuid(), true);
    assert false, 'A14 attendu KLUB_DROITS';
  exception when raise_exception then assert sqlerrm = 'KLUB_DROITS', 'A14 ' || sqlerrm;
  end;
end $$;
-- FIN BLOC ADMIN ET TÂCHE
```

Puis, dans le bloc droits, entre le sous-bloc P3 (`klub_inscrire`) et le sous-bloc P5 (`klub_annuler`), ajouter :

```sql
  begin
    perform public.klub_tache();
    assert false, 'P4 anon peut appeler klub_tache';
  exception when insufficient_privilege then null;
  end;
```

- [ ] **Step 2: Lancer les scénarios, ils doivent échouer**

Outil `execute_sql` avec le fichier.
Expected: erreur `function public.klub_admin_sauver_creneau(jsonb) does not exist`.

- [ ] **Step 3: Écrire `supabase/migrations/20260915120200_klub_admin_tache.sql`**

```sql
-- Mugi Klub : fonctions de l'admin, génération des séances, tâche planifiée.
-- Toutes les fonctions admin vérifient is_practitioner() : la RLS des tables
-- ne donne aux praticiens que la lecture.

create or replace function public.klub__verifier_droits()
returns void language plpgsql stable security definer set search_path = '' as $$
begin
  if not coalesce(public.is_practitioner(), false) then raise exception 'KLUB_DROITS'; end if;
end;
$$;

-- Séances des créneaux actifs sur les 28 jours à venir. Rejouable : un
-- créneau n'a jamais deux séances le même jour.
create or replace function public.klub__generer()
returns integer language plpgsql security definer set search_path = '' as $$
declare
  c public.klub_creneaux;
  v_aujourdhui date := (now() at time zone 'Europe/Paris')::date;
  v_jour date;
  v_debut timestamptz;
  v_n integer := 0;
begin
  for c in select * from public.klub_creneaux where actif loop
    for d in 0..27 loop
      v_jour := v_aujourdhui + d;
      continue when extract(isodow from v_jour) <> c.jour;
      v_debut := (v_jour + c.heure) at time zone 'Europe/Paris';
      continue when v_debut <= now();
      continue when exists (
        select 1 from public.klub_seances
        where creneau_id = c.id and (debut at time zone 'Europe/Paris')::date = v_jour
      );
      insert into public.klub_seances (creneau_id, debut, duree_min, type, titre, description, intervenant,
                                       intervenant_email, capacite, prix_libelle, inscription_requise)
      values (c.id, v_debut, c.duree_min, c.type, c.titre, c.description, c.intervenant,
              c.intervenant_email, c.capacite, c.prix_libelle, c.inscription_requise)
      on conflict (creneau_id, debut) do nothing;
      v_n := v_n + 1;
    end loop;
  end loop;
  return v_n;
end;
$$;

-- Crée ou modifie un créneau, puis refait ses séances futures qui n'ont
-- aucune inscription et n'ont pas été modifiées à part.
create or replace function public.klub_admin_sauver_creneau(p jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid := nullif(p->>'id', '')::uuid;
  v_requise boolean := coalesce((p->>'inscription_requise')::boolean, true);
  v_conservees integer;
begin
  perform public.klub__verifier_droits();

  if v_id is null or not exists (select 1 from public.klub_creneaux where id = v_id) then
    insert into public.klub_creneaux (jour, heure, duree_min, type, titre, description, intervenant,
                                      intervenant_email, capacite, prix_libelle, inscription_requise, actif)
    values ((p->>'jour')::smallint, (p->>'heure')::time, (p->>'duree_min')::smallint, p->>'type',
            trim(coalesce(p->>'titre', '')), coalesce(p->>'description', ''), coalesce(p->>'intervenant', ''),
            nullif(lower(trim(coalesce(p->>'intervenant_email', ''))), ''),
            case when v_requise then nullif(p->>'capacite', '')::smallint end,
            coalesce(p->>'prix_libelle', ''), v_requise, coalesce((p->>'actif')::boolean, true))
    returning id into v_id;
  else
    update public.klub_creneaux set
      jour = (p->>'jour')::smallint,
      heure = (p->>'heure')::time,
      duree_min = (p->>'duree_min')::smallint,
      type = p->>'type',
      titre = trim(coalesce(p->>'titre', '')),
      description = coalesce(p->>'description', ''),
      intervenant = coalesce(p->>'intervenant', ''),
      intervenant_email = nullif(lower(trim(coalesce(p->>'intervenant_email', ''))), ''),
      capacite = case when v_requise then nullif(p->>'capacite', '')::smallint end,
      prix_libelle = coalesce(p->>'prix_libelle', ''),
      inscription_requise = v_requise,
      actif = coalesce((p->>'actif')::boolean, true)
    where id = v_id;
  end if;

  delete from public.klub_seances s
  where s.creneau_id = v_id and s.debut > now() and not s.modifiee and s.statut = 'publiee'
    and not exists (select 1 from public.klub_inscriptions i where i.seance_id = s.id);

  select count(*) into v_conservees from public.klub_seances where creneau_id = v_id and debut > now();

  perform public.klub__generer();

  return jsonb_build_object('id', v_id, 'conservees', v_conservees);
exception
  when check_violation or not_null_violation or invalid_text_representation
       or invalid_datetime_format or datetime_field_overflow or numeric_value_out_of_range then
    raise exception 'KLUB_CHAMP';
end;
$$;

create or replace function public.klub_admin_creer_seance(p jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_requise boolean := coalesce((p->>'inscription_requise')::boolean, true);
  v_id uuid;
begin
  perform public.klub__verifier_droits();
  insert into public.klub_seances (debut, duree_min, type, titre, description, intervenant, intervenant_email,
                                   capacite, prix_libelle, inscription_requise)
  values ((p->>'debut')::timestamptz, (p->>'duree_min')::smallint, p->>'type', trim(coalesce(p->>'titre', '')),
          coalesce(p->>'description', ''), coalesce(p->>'intervenant', ''),
          nullif(lower(trim(coalesce(p->>'intervenant_email', ''))), ''),
          case when v_requise then nullif(p->>'capacite', '')::smallint end,
          coalesce(p->>'prix_libelle', ''), v_requise)
  returning id into v_id;
  return v_id;
exception
  when check_violation or not_null_violation or invalid_text_representation
       or invalid_datetime_format or datetime_field_overflow or numeric_value_out_of_range then
    raise exception 'KLUB_CHAMP';
end;
$$;

-- Modifie une séance. Les inscrits sont prévenus si la date, l'heure, la
-- durée ou l'intervenant changent.
create or replace function public.klub_admin_modifier_seance(p_id uuid, p jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  s public.klub_seances;
  n public.klub_seances;
  v_requise boolean := coalesce((p->>'inscription_requise')::boolean, true);
  v_capacite smallint := case when coalesce((p->>'inscription_requise')::boolean, true) then nullif(p->>'capacite', '')::smallint end;
  v_prevenus integer := 0;
begin
  perform public.klub__verifier_droits();
  select * into s from public.klub_seances where id = p_id for no key update;
  if not found then raise exception 'KLUB_SEANCE'; end if;
  if v_requise and v_capacite is not null
     and v_capacite < (select count(*) from public.klub_inscriptions where seance_id = p_id and statut = 'confirmee') then
    raise exception 'KLUB_CAPACITE';
  end if;

  update public.klub_seances set
    debut = (p->>'debut')::timestamptz,
    duree_min = (p->>'duree_min')::smallint,
    type = p->>'type',
    titre = trim(coalesce(p->>'titre', '')),
    description = coalesce(p->>'description', ''),
    intervenant = coalesce(p->>'intervenant', ''),
    intervenant_email = nullif(lower(trim(coalesce(p->>'intervenant_email', ''))), ''),
    capacite = v_capacite,
    prix_libelle = coalesce(p->>'prix_libelle', ''),
    inscription_requise = v_requise,
    modifiee = true
  where id = p_id
  returning * into n;

  if n.debut <> s.debut or n.duree_min <> s.duree_min or n.intervenant <> s.intervenant then
    with ins as (
      insert into public.klub_mails (type, inscription_id, seance_id)
      select 'seance_modifiee', i.id, p_id from public.klub_inscriptions i
      where i.seance_id = p_id and i.statut in ('confirmee', 'attente')
      returning 1
    )
    select count(*) into v_prevenus from ins;
  end if;

  perform public.klub__remplir(p_id);
  return jsonb_build_object('prevenus', v_prevenus);
exception
  when check_violation or not_null_violation or invalid_text_representation
       or invalid_datetime_format or datetime_field_overflow or numeric_value_out_of_range then
    raise exception 'KLUB_CHAMP';
end;
$$;

create or replace function public.klub_admin_annuler_seance(p_id uuid)
returns integer language plpgsql security definer set search_path = '' as $$
declare
  s public.klub_seances;
  v_n integer;
begin
  perform public.klub__verifier_droits();
  select * into s from public.klub_seances where id = p_id for no key update;
  if not found then raise exception 'KLUB_SEANCE'; end if;
  if s.statut = 'annulee' then return 0; end if;
  update public.klub_seances set statut = 'annulee' where id = p_id;
  -- Les mails pas encore partis n'ont plus de sens.
  update public.klub_mails set statut = 'abandonne', reserve_at = null where seance_id = p_id and statut = 'a_envoyer';
  with ins as (
    insert into public.klub_mails (type, inscription_id, seance_id)
    select 'seance_annulee', i.id, p_id from public.klub_inscriptions i
    where i.seance_id = p_id and i.statut in ('confirmee', 'attente')
    returning 1
  )
  select count(*) into v_n from ins;
  return v_n;
end;
$$;

create or replace function public.klub_admin_ajouter(
  p_seance uuid, p_prenom text, p_nom text, p_email text, p_telephone text, p_premiere boolean, p_si_complet text
)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.klub__verifier_droits();
  return public.klub__inscrire(p_seance, p_prenom, p_nom, p_email, p_telephone, p_premiere, 'admin',
                               case when p_si_complet = 'forcer' then 'forcer' else 'attente' end);
end;
$$;

create or replace function public.klub_admin_annuler_inscription(p_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform public.klub__verifier_droits();
  return public.klub__annuler(p_id, true);
end;
$$;

create or replace function public.klub_admin_presence(p_id uuid, p_present boolean)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform public.klub__verifier_droits();
  update public.klub_inscriptions set present = coalesce(p_present, false) where id = p_id;
end;
$$;

create or replace function public.klub_admin_relancer_mail(p_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform public.klub__verifier_droits();
  update public.klub_mails
  set statut = 'a_envoyer', tentatives = 0, envoyer_apres = now(), derniere_erreur = null, reserve_at = null
  where id = p_id and statut = 'erreur';
end;
$$;

-- Appelée chaque minute par /api/klub/tache.
create or replace function public.klub_tache()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_generees integer;
  v_rappels integer;
  v_listes integer;
  v_relancees integer;
  v_purgees integer;
begin
  v_generees := public.klub__generer();

  -- Rappel la veille à 18 h, pour les inscriptions antérieures à ce moment.
  with ins as (
    insert into public.klub_mails (type, inscription_id, seance_id)
    select 'rappel', i.id, s.id
    from public.klub_seances s
    join public.klub_inscriptions i on i.seance_id = s.id and i.statut = 'confirmee'
    where s.statut = 'publiee' and s.debut > now()
      and now() >= ((((s.debut at time zone 'Europe/Paris')::date - 1) + time '18:00') at time zone 'Europe/Paris')
      and i.created_at < ((((s.debut at time zone 'Europe/Paris')::date - 1) + time '18:00') at time zone 'Europe/Paris')
    on conflict (type, inscription_id, seance_id) where type in ('rappel', 'liste_intervenant') do nothing
    returning 1
  )
  select count(*) into v_rappels from ins;

  -- Liste des inscrits à l'intervenant, 2 h avant.
  with ins as (
    insert into public.klub_mails (type, inscription_id, seance_id)
    select 'liste_intervenant', null, s.id
    from public.klub_seances s
    where s.statut = 'publiee' and s.inscription_requise and s.intervenant_email is not null
      and now() >= s.debut - interval '2 hours' and now() < s.debut
      and exists (select 1 from public.klub_inscriptions i where i.seance_id = s.id and i.statut = 'confirmee')
    on conflict (type, inscription_id, seance_id) where type in ('rappel', 'liste_intervenant') do nothing
    returning 1
  )
  select count(*) into v_listes from ins;

  -- Envoi interrompu depuis plus de 10 minutes : on le remet en file.
  update public.klub_mails set statut = 'a_envoyer', reserve_at = null
  where statut = 'en_cours' and reserve_at < now() - interval '10 minutes';
  get diagnostics v_relancees = row_count;

  with suppr as (
    delete from public.klub_seances
    where debut + make_interval(mins => duree_min::int) < now() - interval '12 months'
    returning 1
  )
  select count(*) into v_purgees from suppr;

  return jsonb_build_object('generees', v_generees, 'rappels', v_rappels, 'listes', v_listes,
                            'relancees', v_relancees, 'purgees', v_purgees);
end;
$$;

revoke execute on function public.klub__verifier_droits() from public, anon, authenticated;
revoke execute on function public.klub__generer() from public, anon, authenticated;

revoke execute on function public.klub_admin_sauver_creneau(jsonb) from public, anon;
revoke execute on function public.klub_admin_creer_seance(jsonb) from public, anon;
revoke execute on function public.klub_admin_modifier_seance(uuid, jsonb) from public, anon;
revoke execute on function public.klub_admin_annuler_seance(uuid) from public, anon;
revoke execute on function public.klub_admin_ajouter(uuid, text, text, text, text, boolean, text) from public, anon;
revoke execute on function public.klub_admin_annuler_inscription(uuid) from public, anon;
revoke execute on function public.klub_admin_presence(uuid, boolean) from public, anon;
revoke execute on function public.klub_admin_relancer_mail(uuid) from public, anon;
grant execute on function public.klub_admin_sauver_creneau(jsonb) to authenticated;
grant execute on function public.klub_admin_creer_seance(jsonb) to authenticated;
grant execute on function public.klub_admin_modifier_seance(uuid, jsonb) to authenticated;
grant execute on function public.klub_admin_annuler_seance(uuid) to authenticated;
grant execute on function public.klub_admin_ajouter(uuid, text, text, text, text, boolean, text) to authenticated;
grant execute on function public.klub_admin_annuler_inscription(uuid) to authenticated;
grant execute on function public.klub_admin_presence(uuid, boolean) to authenticated;
grant execute on function public.klub_admin_relancer_mail(uuid) to authenticated;

revoke execute on function public.klub_tache() from public, anon, authenticated;
grant execute on function public.klub_tache() to service_role;
```

- [ ] **Step 4: Appliquer la migration**

Outil `apply_migration`, `name: "klub_admin_tache"`.
Expected: `{"success": true}`.

- [ ] **Step 5: Relancer tous les scénarios, ils doivent passer**

Outil `execute_sql` avec `supabase/tests/klub.sql`.
Expected: `[{"resultat":"klub : scénarios OK"}]`.

- [ ] **Step 6: Alertes de sécurité**

Outil `get_advisors`, `type: "security"`.
Expected : aucune alerte qui cite `klub_`.

- [ ] **Step 7: Commit**

```bash
git add supabase/tests/klub.sql supabase/migrations/20260915120200_klub_admin_tache.sql
git commit -m "klub : fonctions admin, génération des séances et tâche planifiée

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

- [ ] **Step 8: Correctifs de revue**

Migration `supabase/migrations/20260915120250_klub_admin_correctifs.sql` (appliquée sous `klub_admin_correctifs`). Elle fait foi pour l'état final de `klub__generer`, `klub_admin_sauver_creneau`, `klub_admin_creer_seance`, `klub_admin_modifier_seance`, `klub_admin_annuler_seance` et `klub_tache` ; le SQL ci-dessus reste l'historique.

- Colonne `klub_seances.occurrence` (jour d'occurrence à Paris) et index unique `(creneau_id, occurrence)`, à la place de `unique (creneau_id, debut)` : une séance déplacée ne fait plus recréer l'originale.
- Droits vérifiés avant toute conversion du JSON ; verrou `FOR UPDATE` des séances avant la suppression lors de la sauvegarde d'un créneau ; verrou consultatif `klub.generation` dans `klub_tache` et `klub_admin_sauver_creneau`.
- `klub_admin_modifier_seance` : refus sur séance annulée (`KLUB_SEANCE`), refus de l'entrée libre s'il reste des inscrits (`KLUB_LIBRE`), rappel et liste non partis supprimés si l'horaire change.
- `klub_admin_annuler_seance` garde les mails `annulation` en file ; `klub_admin_sauver_creneau` lève `KLUB_CRENEAU` sur un identifiant inconnu ; `conservees` ne compte que les séances publiées.
- `klub_tache` : un envoi bloqué `en_cours` passe en `erreur` après 4 tentatives.
- `service_role` perd l'exécution de `klub__verifier_droits`, `klub__generer` et des `klub_admin_*`.

Scénarios ajoutés dans `supabase/tests/klub.sql` (A9d-e, A11b-d, A14b-c, bloc C1-C8, P7, S3-S4).

---

### Task 8: Envoi Brevo générique

**Files:**
- Create: `lib/brevo.ts`
- Modify: `lib/newsletter.ts:1-24` et `lib/newsletter.ts:76-115`

La newsletter garde exactement le même comportement ; seul l'appel HTTP à Brevo déménage.

- [ ] **Step 1: Créer `lib/brevo.ts`**

```ts
/**
 * Envoi de mails transactionnels via l'API Brevo.
 *
 * La clé vit dans `BREVO_API_KEY`, côté serveur uniquement : jamais de
 * préfixe NEXT_PUBLIC_, qui l'exposerait dans le bundle du navigateur.
 * Vercel lit la variable au build : redéployer après tout changement.
 */

/** Doit appartenir au domaine authentifié chez Brevo, sinon DKIM ne signe rien. */
export const EXPEDITEUR = { email: "bonjour@mugitu-biarritz.fr", name: "Mugitu Biarritz" };

export const SITE = "https://mugitu-biarritz.fr";

export function cleBrevo(): string | null {
  const cle = process.env.BREVO_API_KEY;
  return cle && cle.trim() !== "" ? cle.trim() : null;
}

/** Pièce jointe : contenu encodé en base64. */
export type PieceJointe = { name: string; content: string };

export type EnvoiBrevo = {
  a: { email: string; name?: string };
  sujet: string;
  html: string;
  texte: string;
  /** Repérage dans les statistiques Brevo. */
  tags: string[];
  pieces?: PieceJointe[];
};

export type ResultatBrevo = { ok: true } | { ok: false; erreur: string };

export async function envoyerBrevo(e: EnvoiBrevo): Promise<ResultatBrevo> {
  const cle = cleBrevo();
  if (!cle) return { ok: false, erreur: "BREVO_API_KEY absente" };
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": cle, "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: EXPEDITEUR,
        to: [e.a],
        subject: e.sujet,
        htmlContent: e.html,
        textContent: e.texte,
        tags: e.tags,
        ...(e.pieces?.length ? { attachment: e.pieces } : {}),
      }),
    });
    if (!res.ok) return { ok: false, erreur: `Brevo ${res.status} : ${(await res.text()).slice(0, 300)}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, erreur: `Brevo injoignable : ${String(err)}` };
  }
}
```

- [ ] **Step 2: Brancher `lib/newsletter.ts` dessus**

Remplacer les lignes 1 à 24 (de `import { SUPABASE_ANON_KEY…` jusqu'à la fin de `cleBrevo`) par :

```ts
import { envoyerBrevo, SITE } from "./brevo";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./supabase-config";

/**
 * Envoi du mail de confirmation de la newsletter.
 *
 * Le mail de confirmation est transactionnel, pas commercial : il répond à une
 * action de l'internaute et ne contient aucune promotion. La lettre elle-même
 * partira des campagnes Brevo, sur la liste des adresses confirmées.
 */

export { cleBrevo, EXPEDITEUR, SITE } from "./brevo";
```

Remplacer la fonction `envoyerConfirmation` (lignes 76 à 115 d'origine) par :

```ts
/**
 * Envoie le mail de confirmation. Renvoie `false` sur échec : l'appelant garde
 * l'inscription en base malgré tout. Perdre l'inscription parce que Brevo
 * tousse serait pire.
 */
export async function envoyerConfirmation(email: string, jeton: string): Promise<boolean> {
  const lien = `${SITE}/newsletter/confirmation?jeton=${encodeURIComponent(jeton)}`;
  const { html, texte } = gabarit(lien);
  const r = await envoyerBrevo({
    a: { email },
    sujet: "Confirmez votre inscription à la lettre Mugitu",
    html,
    texte,
    tags: ["newsletter-confirmation"],
  });
  if (!r.ok) console.error("[newsletter] envoi en échec", r.erreur);
  return r.ok;
}
```

- [ ] **Step 3: Vérifier les imports et le typage**

Run: `npx tsc --noEmit && npm run lint`
Expected: aucune erreur. `app/api/newsletter/route.ts`, `app/api/jeux/inscription/route.ts` et les pages `app/newsletter/*` compilent sans changement.

- [ ] **Step 4: Commit**

```bash
git add lib/brevo.ts lib/newsletter.ts
git commit -m "brevo : envoi générique partagé par la newsletter et le Klub

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 9: Règles d'envoi et gabarits des mails

**Files:**
- Create: `lib/klub/regles-envoi.ts`, `lib/klub/mails.ts`
- Test: `lib/klub/regles-envoi.test.ts`, `lib/klub/mails.test.ts`

- [ ] **Step 1: Écrire `lib/klub/regles-envoi.test.ts`**

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { adresseDeTest, delaiNouvelleTentative, doitPartir, type MailComplet } from "./regles-envoi.ts";
import type { Inscription, Seance } from "./types.ts";

const seance: Seance = {
  id: "s1", creneau_id: null, debut: "2026-09-22T10:30:00Z", statut: "publiee", modifiee: false,
  type: "small", titre: "Renfo", description: "", intervenant: "Hugo", intervenant_email: "hugo@example.com",
  duree_min: 45, capacite: 5, prix_libelle: "15 €", inscription_requise: true,
};
const inscription: Inscription = {
  id: "i1", seance_id: "s1", prenom: "Ana", nom: "Test", email: "ana@example.com", telephone: "0612345678",
  premiere_seance: false, statut: "confirmee", present: false, origine: "site", jeton: "a".repeat(64),
  created_at: "2026-09-15T08:00:00Z",
};
const mail = (m: Partial<MailComplet>): MailComplet => ({
  id: "m1", type: "confirmation", inscription_id: "i1", seance_id: "s1", envoyer_apres: "", statut: "en_cours",
  tentatives: 1, derniere_erreur: null, created_at: "", inscription, seance, ...m,
});
const avant = new Date("2026-09-20T08:00:00Z");

test("confirmation, rappel, promotion : seulement pour une place confirmée à venir", () => {
  assert.equal(doitPartir(mail({}), avant), true);
  assert.equal(doitPartir(mail({ type: "rappel", inscription: { ...inscription, statut: "annulee" } }), avant), false);
  assert.equal(doitPartir(mail({ type: "promotion", seance: { ...seance, statut: "annulee" } }), avant), false);
  assert.equal(doitPartir(mail({}), new Date("2026-09-22T11:00:00Z")), false);
});

test("attente, annulation, séance annulée, liste intervenant", () => {
  assert.equal(doitPartir(mail({ type: "attente", inscription: { ...inscription, statut: "attente" } }), avant), true);
  assert.equal(doitPartir(mail({ type: "attente" }), avant), false);
  assert.equal(doitPartir(mail({ type: "annulation", inscription: { ...inscription, statut: "annulee" } }), avant), true);
  assert.equal(doitPartir(mail({ type: "seance_annulee", seance: { ...seance, statut: "annulee" } }), avant), true);
  assert.equal(doitPartir(mail({ type: "liste_intervenant", inscription: null }), avant), true);
  assert.equal(doitPartir(mail({ type: "liste_intervenant", inscription: null, seance: { ...seance, intervenant_email: null } }), avant), false);
  assert.equal(doitPartir(mail({ seance: null }), avant), false);
});

test("adresses de test et délais de relance", () => {
  assert.equal(adresseDeTest("ana@example.com"), true);
  assert.equal(adresseDeTest("ana@gmail.com"), false);
  assert.deepEqual([1, 2, 3, 4].map(delaiNouvelleTentative), [1, 5, 15, null]);
});
```

- [ ] **Step 2: Écrire `lib/klub/mails.test.ts`**

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { composer } from "./mails.ts";
import type { Inscription, Seance, TypeMail } from "./types.ts";

const site = "https://mugitu-biarritz.fr";
const seance: Seance = {
  id: "s1", creneau_id: null, debut: "2026-09-22T10:30:00Z", statut: "publiee", modifiee: false,
  type: "small", titre: "Renfo <b>", description: "", intervenant: "Hugo", intervenant_email: "hugo@example.com",
  duree_min: 45, capacite: 5, prix_libelle: "15 €", inscription_requise: true,
};
const ana: Inscription = {
  id: "i1", seance_id: "s1", prenom: "Ana", nom: "Test", email: "ana@example.com", telephone: "0612345678",
  premiere_seance: true, statut: "confirmee", present: false, origine: "site", jeton: "a".repeat(64),
  created_at: "2026-09-15T08:00:00Z",
};

test("confirmation", () => {
  const m = composer({ type: "confirmation", site, seance, inscription: ana });
  assert.equal(m.destinataire.email, "ana@example.com");
  assert.ok(m.sujet.includes("mardi 22 septembre à 12 h 30"), m.sujet);
  assert.ok(m.html.includes(`/mugi-klub/annulation?jeton=${"a".repeat(64)}`));
  assert.ok(m.html.includes("Renfo &lt;b&gt;"));
  assert.ok(!m.html.includes("Renfo <b>"));
  assert.ok(m.texte.startsWith("Bonjour Ana,"));
  assert.equal(m.ics, true);
});

test("attente avec le rang", () => {
  const m = composer({ type: "attente", site, seance, inscription: { ...ana, statut: "attente" }, rang: 2 });
  assert.ok(m.texte.includes("2ᵉ sur la liste d’attente"), m.texte);
  assert.equal(m.ics, false);
});

test("liste intervenant", () => {
  const m = composer({ type: "liste_intervenant", site, seance, confirmes: [ana], attente: [] });
  assert.equal(m.destinataire.email, "hugo@example.com");
  assert.ok(m.html.includes("0612345678"));
  assert.ok(m.texte.includes("première séance"));
});

test("chaque type a un sujet et un texte", () => {
  const types: TypeMail[] = ["confirmation", "attente", "promotion", "annulation", "rappel", "seance_modifiee", "seance_annulee"];
  for (const type of types) {
    const m = composer({ type, site, seance, inscription: ana, rang: 1 });
    assert.ok(m.sujet.length > 10 && m.texte.length > 40, type);
  }
});
```

- [ ] **Step 3: Lancer les tests, ils doivent échouer**

Run: `npm test`
Expected: FAIL, `Cannot find module '.../lib/klub/regles-envoi.ts'`.

- [ ] **Step 4: Créer `lib/klub/regles-envoi.ts`**

```ts
import type { Inscription, Mail, Seance } from "./types.ts";

export type MailComplet = Mail & { inscription: Inscription | null; seance: Seance | null };

/**
 * Un mail mis en file peut perdre son sens avant de partir : place annulée
 * entre-temps, séance supprimée… On le vérifie au dernier moment.
 */
export function doitPartir(m: MailComplet, maintenant: Date): boolean {
  const s = m.seance;
  if (!s) return false;
  const i = m.inscription;
  const aVenir = new Date(s.debut) > maintenant;
  switch (m.type) {
    case "confirmation":
    case "promotion":
    case "rappel":
      return !!i && i.statut === "confirmee" && s.statut === "publiee" && aVenir;
    case "attente":
      return !!i && i.statut === "attente" && s.statut === "publiee" && aVenir;
    case "annulation":
      return !!i && i.statut === "annulee";
    case "seance_modifiee":
      return !!i && i.statut !== "annulee" && s.statut === "publiee" && aVenir;
    case "seance_annulee":
      return !!i && s.statut === "annulee";
    case "liste_intervenant":
      return s.statut === "publiee" && !!s.intervenant_email && aVenir;
  }
}

/** Adresses des scénarios SQL et du script de concurrence : jamais envoyées. */
export function adresseDeTest(email: string): boolean {
  return /@example\.(com|org|net)$/i.test(email);
}

/**
 * Minutes avant la tentative suivante, ou `null` pour marquer le mail en
 * erreur. `tentatives` compte l'envoi qui vient d'échouer.
 */
export function delaiNouvelleTentative(tentatives: number): number | null {
  return [1, 5, 15][tentatives - 1] ?? null;
}
```

- [ ] **Step 5: Créer `lib/klub/mails.ts`**

```ts
import { dateHeure, dateLongue, heure, rang } from "./format.ts";
import type { Inscription, Seance, TypeMail } from "./types.ts";

/**
 * Gabarits des mails du Klub. Fonctions pures : le contenu est construit au
 * moment de l'envoi, à partir de l'état actuel de la séance.
 */

export const ADRESSE = "3 avenue Kléber, 64200 Biarritz";

export type Contexte = {
  type: TypeMail;
  site: string;
  seance: Seance;
  inscription?: Inscription | null;
  /** Mail `attente` : rang actuel dans la liste. */
  rang?: number | null;
  /** Mail `liste_intervenant`. */
  confirmes?: Inscription[];
  attente?: Inscription[];
};

export type MailCompose = {
  destinataire: { email: string; name?: string };
  sujet: string;
  html: string;
  texte: string;
  ics: boolean;
};

type Bloc = {
  titre: string;
  paragraphes: string[];
  bouton?: { libelle: string; url: string };
  tableauHtml?: string;
  tableauTexte?: string;
};

const echapper = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function habiller(b: Bloc): { html: string; texte: string } {
  const p = (t: string) =>
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:rgba(51,51,52,.8);">${echapper(t)}</p>`;
  const bouton = b.bouton
    ? `<p style="margin:8px 0 26px;"><a href="${echapper(b.bouton.url)}" style="display:inline-block;padding:14px 28px;border-radius:999px;background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">${echapper(b.bouton.libelle)}</a></p>`
    : "";
  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FDF8F4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FDF8F4;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#fff;border-radius:16px;padding:36px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
        <tr><td>
          <p style="margin:0 0 22px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Mugi Klub</p>
          <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;font-weight:700;color:#003850;">${echapper(b.titre)}</h1>
          ${b.paragraphes.map(p).join("\n          ")}
          ${b.tableauHtml ?? ""}
          ${bouton}
          <p style="margin:0;padding-top:20px;border-top:1px solid rgba(0,56,80,.12);font-size:12.5px;line-height:1.6;color:rgba(51,51,52,.5);">
            Mugitu, ${echapper(ADRESSE)}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
  const texte = [
    ...b.paragraphes,
    ...(b.tableauTexte ? [b.tableauTexte] : []),
    ...(b.bouton ? [`${b.bouton.libelle} : ${b.bouton.url}`] : []),
    `Mugitu, ${ADRESSE}`,
  ].join("\n\n");
  return { html, texte };
}

function exiger(i: Inscription | null | undefined, type: TypeMail): Inscription {
  if (!i) throw new Error(`[klub] mail ${type} sans inscription`);
  return i;
}

export function composer(c: Contexte): MailCompose {
  const s = c.seance;
  const quand = dateHeure(s.debut);
  const avec = s.intervenant ? `, avec ${s.intervenant}` : "";
  const prix = s.prix_libelle ? ` : ${s.prix_libelle}` : "";
  const planning = `${c.site}/mugi-klub#planning`;
  const lienAnnulation = (i: Inscription) => `${c.site}/mugi-klub/annulation?jeton=${encodeURIComponent(i.jeton)}`;
  const pour = (i: Inscription) => ({ email: i.email, name: `${i.prenom} ${i.nom}` });

  if (c.type === "liste_intervenant") {
    if (!s.intervenant_email) throw new Error("[klub] liste sans e-mail d'intervenant");
    const confirmes = c.confirmes ?? [];
    const attente = c.attente ?? [];
    const ligne = (i: Inscription) => `${i.prenom} ${i.nom}${i.premiere_seance ? " (première séance)" : ""}`;
    const tableauHtml = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;font-size:14px;color:#003850;border-collapse:collapse;">
${confirmes
  .map(
    (i) =>
      `<tr><td style="padding:8px 0;border-bottom:1px solid rgba(0,56,80,.08);">${echapper(ligne(i))}</td><td style="padding:8px 0;border-bottom:1px solid rgba(0,56,80,.08);text-align:right;"><a href="tel:${echapper(i.telephone)}" style="color:#04A49B;">${echapper(i.telephone)}</a></td></tr>`,
  )
  .join("\n")}
</table>${
      attente.length
        ? `<p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:rgba(51,51,52,.7);">Liste d’attente : ${echapper(attente.map(ligne).join(", "))}</p>`
        : ""
    }`;
    const tableauTexte = [
      ...confirmes.map((i) => `- ${ligne(i)}, ${i.telephone}`),
      ...(attente.length ? [`Liste d’attente : ${attente.map(ligne).join(", ")}`] : []),
    ].join("\n");
    const { html, texte } = habiller({
      titre: `Vos inscrits de ${heure(s.debut)}`,
      paragraphes: [
        s.intervenant ? `Bonjour ${s.intervenant},` : "Bonjour,",
        `Voici la liste pour « ${s.titre} », ${quand} : ${confirmes.length} inscrit${confirmes.length > 1 ? "s" : ""} sur ${s.capacite}.`,
      ],
      tableauHtml,
      tableauTexte,
    });
    return { destinataire: { email: s.intervenant_email }, sujet: `Inscrits pour « ${s.titre} », ${quand}`, html, texte, ics: false };
  }

  const i = exiger(c.inscription, c.type);
  const bonjour = `Bonjour ${i.prenom},`;
  const bloc = ((): { bloc: Bloc; sujet: string; ics: boolean } => {
    switch (c.type) {
      case "confirmation":
        return {
          sujet: `Votre place pour « ${s.titre} », ${quand}`,
          ics: true,
          bloc: {
            titre: "Votre place est réservée",
            paragraphes: [
              bonjour,
              `C’est noté pour « ${s.titre} », ${quand}${avec}. La séance dure ${s.duree_min} minutes.`,
              `Rendez-vous au ${ADRESSE}. Le paiement se fait sur place${prix}.`,
              "Le fichier joint ajoute la séance à votre agenda.",
              "Si vous ne pouvez plus venir, libérez votre place : une personne en liste d’attente pourra la prendre.",
            ],
            bouton: { libelle: "Libérer ma place", url: lienAnnulation(i) },
          },
        };
      case "attente":
        return {
          sujet: `Liste d’attente pour « ${s.titre} », ${quand}`,
          ics: false,
          bloc: {
            titre: "Vous êtes sur la liste d’attente",
            paragraphes: [
              bonjour,
              `« ${s.titre} », ${quand}, est complète. Vous êtes ${rang(c.rang ?? 1)} sur la liste d’attente.`,
              "Si une place se libère plus de deux heures avant le début, elle vous revient et un second mail vous le confirme.",
              "Si vous ne souhaitez plus attendre, vous pouvez quitter la liste.",
            ],
            bouton: { libelle: "Quitter la liste d’attente", url: lienAnnulation(i) },
          },
        };
      case "promotion":
        return {
          sujet: `Une place s’est libérée pour « ${s.titre} »`,
          ics: true,
          bloc: {
            titre: "Une place s’est libérée",
            paragraphes: [
              bonjour,
              `Une place s’est libérée pour « ${s.titre} », ${quand}${avec}. Elle est à vous.`,
              `Rendez-vous au ${ADRESSE}. Le paiement se fait sur place${prix}.`,
              "Le fichier joint ajoute la séance à votre agenda.",
              "Si vous ne pouvez plus venir, libérez la place pour la personne suivante.",
            ],
            bouton: { libelle: "Libérer ma place", url: lienAnnulation(i) },
          },
        };
      case "annulation":
        return {
          sujet: `Inscription annulée pour « ${s.titre} »`,
          ics: false,
          bloc: {
            titre: "Inscription annulée",
            paragraphes: [bonjour, `Votre inscription à « ${s.titre} », ${quand}, est annulée.`, "Les autres séances du Klub sont sur le planning."],
            bouton: { libelle: "Voir le planning", url: planning },
          },
        };
      case "rappel":
        return {
          sujet: `Rappel, « ${s.titre} » demain à ${heure(s.debut)}`,
          ics: false,
          bloc: {
            titre: "Rendez-vous demain",
            paragraphes: [
              bonjour,
              `« ${s.titre} » a lieu demain à ${heure(s.debut)}${avec}, au ${ADRESSE}.`,
              `Le paiement se fait sur place${prix}.`,
              "Si vous ne pouvez plus venir, libérez votre place : une personne en liste d’attente pourra la prendre.",
            ],
            bouton: { libelle: "Libérer ma place", url: lienAnnulation(i) },
          },
        };
      case "seance_modifiee": {
        const enAttente = i.statut === "attente";
        return {
          sujet: `Changement pour « ${s.titre} »`,
          ics: !enAttente,
          bloc: {
            titre: "La séance a changé",
            paragraphes: [
              bonjour,
              `« ${s.titre} » a été modifiée. Elle a désormais lieu ${quand}${avec}, pour ${s.duree_min} minutes.`,
              enAttente ? "Vous restez sur la liste d’attente." : "Votre place est conservée.",
              "Si ce changement ne vous convient pas, vous pouvez vous désinscrire.",
            ],
            bouton: { libelle: enAttente ? "Quitter la liste d’attente" : "Libérer ma place", url: lienAnnulation(i) },
          },
        };
      }
      case "seance_annulee":
        return {
          sujet: `« ${s.titre} » du ${dateLongue(s.debut)} est annulée`,
          ics: false,
          bloc: {
            titre: "Séance annulée",
            paragraphes: [
              bonjour,
              `Nous devons annuler « ${s.titre} », prévue ${quand}. Vous n’avez rien à faire de votre côté.`,
              "Les prochaines séances sont sur le planning.",
            ],
            bouton: { libelle: "Voir le planning", url: planning },
          },
        };
    }
  })();

  const { html, texte } = habiller(bloc.bloc);
  return { destinataire: pour(i), sujet: bloc.sujet, html, texte, ics: bloc.ics };
}
```

- [ ] **Step 6: Lancer les tests, ils doivent passer**

Run: `npm test`
Expected: `# fail 0`.

Si TypeScript signale plus tard (Task 10, `tsc`) que la fonction fléchée du `switch` peut renvoyer `undefined`, ajouter après le `switch` : `throw new Error(\`[klub] type de mail inconnu : ${c.type}\`);`.

- [ ] **Step 7: Commit**

```bash
git add lib/klub/regles-envoi.ts lib/klub/regles-envoi.test.ts lib/klub/mails.ts lib/klub/mails.test.ts
git commit -m "klub : gabarits des mails et règles de départ

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 10: Clé de service et envoi de la file

**Files:**
- Create: `lib/supabase-service.ts`, `lib/klub/envoi.ts`

Pas de test automatique ici : ce code ne fait que relier la base, les gabarits testés et Brevo. Il est vérifié en conditions réelles à la Task 19.

- [ ] **Step 1: Créer `lib/supabase-service.ts`**

```ts
import { SUPABASE_URL } from "./supabase-config";

/**
 * Accès PostgREST avec la clé de service, qui contourne la RLS.
 * Serveur uniquement : routes API et tâche planifiée. La clé vit dans
 * `SUPABASE_SERVICE_ROLE_KEY`, jamais préfixée NEXT_PUBLIC_.
 */

function entetes(extra?: Record<string, string>): Record<string, string> {
  if (typeof window !== "undefined") throw new Error("[supabase-service] appelé depuis le navigateur");
  const cle = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!cle) throw new Error("[supabase-service] SUPABASE_SERVICE_ROLE_KEY absente");
  return { apikey: cle, Authorization: `Bearer ${cle}`, "Content-Type": "application/json", ...extra };
}

export type Resultat<T> = { ok: true; data: T } | { ok: false; status: number; corps: unknown };

export async function rpcService<T>(nom: string, args: Record<string, unknown>): Promise<Resultat<T>> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${nom}`, {
    method: "POST",
    headers: entetes(),
    body: JSON.stringify(args),
    cache: "no-store",
  });
  const corps = await res.json().catch(() => null);
  return res.ok ? { ok: true, data: corps as T } : { ok: false, status: res.status, corps };
}

export async function restService<T>(
  chemin: string,
  init: { method?: "GET" | "PATCH"; corps?: unknown } = {},
): Promise<Resultat<T>> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${chemin}`, {
    method: init.method ?? "GET",
    headers: entetes(init.method === "PATCH" ? { Prefer: "return=minimal" } : undefined),
    body: init.corps === undefined ? undefined : JSON.stringify(init.corps),
    cache: "no-store",
  });
  const corps = res.status === 204 ? null : await res.json().catch(() => null);
  return res.ok ? { ok: true, data: corps as T } : { ok: false, status: res.status, corps };
}
```

- [ ] **Step 2: Créer `lib/klub/envoi.ts`**

```ts
import { envoyerBrevo, SITE } from "@/lib/brevo";
import { restService, rpcService } from "@/lib/supabase-service";
import { genererIcs } from "./ics";
import { ADRESSE, composer } from "./mails";
import { adresseDeTest, delaiNouvelleTentative, doitPartir, type MailComplet } from "./regles-envoi";
import type { Inscription } from "./types";

/**
 * Vide la file `klub_mails`. Chaque mail est d'abord réservé en base
 * (`klub_reserver_mails`), ce qui empêche l'envoi immédiat d'une route et la
 * tâche planifiée de l'envoyer tous les deux.
 */

export type Bilan = { envoyes: number; abandonnes: number; echecs: number };

async function marquer(id: string, champs: Record<string, unknown>) {
  const r = await restService(`klub_mails?id=eq.${id}`, { method: "PATCH", corps: champs });
  if (!r.ok) console.error("[klub] mise à jour du mail impossible", id, r.status, r.corps);
}

async function abandonner(id: string, bilan: Bilan) {
  await marquer(id, { statut: "abandonne", reserve_at: null });
  bilan.abandonnes++;
}

async function echec(m: MailComplet, erreur: string, bilan: Bilan) {
  console.error("[klub] envoi en échec", m.id, m.type, erreur);
  const delai = delaiNouvelleTentative(m.tentatives);
  await marquer(
    m.id,
    delai === null
      ? { statut: "erreur", reserve_at: null, derniere_erreur: erreur }
      : {
          statut: "a_envoyer",
          reserve_at: null,
          derniere_erreur: erreur,
          envoyer_apres: new Date(Date.now() + delai * 60_000).toISOString(),
        },
  );
  bilan.echecs++;
}

async function traiter(id: string, bilan: Bilan) {
  const lu = await restService<MailComplet[]>(
    `klub_mails?id=eq.${id}&select=*,inscription:klub_inscriptions(*),seance:klub_seances(*)`,
  );
  if (!lu.ok || !lu.data[0]) {
    console.error("[klub] mail illisible", id, lu);
    bilan.echecs++;
    return;
  }
  const m = lu.data[0];
  if (!m.seance || !doitPartir(m, new Date())) return abandonner(id, bilan);
  const seance = m.seance;

  let confirmes: Inscription[] = [];
  let attente: Inscription[] = [];
  let rangActuel: number | null = null;
  if (m.type === "liste_intervenant" || m.type === "attente") {
    const l = await restService<Inscription[]>(
      `klub_inscriptions?seance_id=eq.${seance.id}&statut=in.(confirmee,attente)&order=created_at.asc,id.asc`,
    );
    if (!l.ok) return echec(m, `lecture des inscrits : ${l.status}`, bilan);
    confirmes = l.data.filter((x) => x.statut === "confirmee");
    attente = l.data.filter((x) => x.statut === "attente");
    if (m.type === "attente" && m.inscription) {
      const position = attente.findIndex((x) => x.id === m.inscription?.id);
      rangActuel = position >= 0 ? position + 1 : null;
    }
    if (m.type === "liste_intervenant" && confirmes.length === 0) return abandonner(id, bilan);
  }

  const mail = composer({ type: m.type, site: SITE, seance, inscription: m.inscription, rang: rangActuel, confirmes, attente });
  if (adresseDeTest(mail.destinataire.email)) return abandonner(id, bilan);

  const pieces = mail.ics
    ? [
        {
          name: "mugi-klub.ics",
          content: Buffer.from(
            genererIcs({
              uid: `${seance.id}-${m.inscription?.id ?? "liste"}`,
              debut: seance.debut,
              dureeMin: seance.duree_min,
              titre: `Mugi Klub · ${seance.titre}`,
              description: seance.description,
              lieu: ADRESSE,
              url: `${SITE}/mugi-klub/seance/${seance.id}`,
            }),
          ).toString("base64"),
        },
      ]
    : undefined;

  const r = await envoyerBrevo({
    a: mail.destinataire,
    sujet: mail.sujet,
    html: mail.html,
    texte: mail.texte,
    tags: [`klub-${m.type}`],
    pieces,
  });
  if (!r.ok) return echec(m, r.erreur, bilan);
  await marquer(id, { statut: "envoye", envoye_at: new Date().toISOString(), reserve_at: null, derniere_erreur: null });
  bilan.envoyes++;
}

async function vider(id: string | null, limite: number): Promise<Bilan> {
  const bilan: Bilan = { envoyes: 0, abandonnes: 0, echecs: 0 };
  const r = await rpcService<string[] | null>("klub_reserver_mails", { p_id: id, p_limite: limite });
  if (!r.ok) {
    console.error("[klub] réservation des mails impossible", r.status, r.corps);
    return bilan;
  }
  for (const mailId of r.data ?? []) {
    try {
      await traiter(mailId, bilan);
    } catch (e) {
      // Le mail reste « en_cours » : la tâche le remet en file après 10 minutes.
      console.error("[klub] envoi interrompu", mailId, e);
      bilan.echecs++;
    }
  }
  return bilan;
}

/** Envoie un mail précis, s'il est dû et pas déjà pris. */
export function envoyerMail(id: string): Promise<Bilan> {
  return vider(id, 1);
}

/** Envoie les mails dus, les plus anciens d'abord. */
export function envoyerFile(limite = 50): Promise<Bilan> {
  return vider(null, limite);
}
```

- [ ] **Step 3: Vérifier le typage**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: aucune erreur.

- [ ] **Step 4: Commit**

```bash
git add lib/supabase-service.ts lib/klub/envoi.ts
git commit -m "klub : envoi des mails depuis la file

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 11: Routes d'inscription et d'annulation

**Files:**
- Modify: `lib/routes.ts`
- Create: `app/api/klub/inscription/route.ts`, `app/api/klub/annulation/route.ts`

- [ ] **Step 1: Ajouter les routes Klub dans `lib/routes.ts`**

Après la ligne `  klub: "/mugi-klub",`, ajouter :

```ts
  klubAnnulation: "/mugi-klub/annulation",
```

Après la fonction `practitionerPath`, ajouter :

```ts
/** Page d'une séance du Mugi Klub : /mugi-klub/seance/<id>. */
export function klubSeancePath(id: string): string {
  return `${ROUTES.klub}/seance/${id}`;
}
```

- [ ] **Step 2: Créer `app/api/klub/inscription/route.ts`**

```ts
import { revalidatePath } from "next/cache";
import { after, NextResponse } from "next/server";
import { envoyerMail } from "@/lib/klub/envoi";
import { codeErreur, ERREURS } from "@/lib/klub/erreurs";
import type { ReponseInscription } from "@/lib/klub/types";
import { UUID, verifierCoordonnees } from "@/lib/klub/validation";
import { klubSeancePath, ROUTES } from "@/lib/routes";
import { rpcService } from "@/lib/supabase-service";

/**
 * POST /api/klub/inscription
 *
 * La règle (places, liste d'attente, doublons) vit dans `klub_inscrire`,
 * exécutable par la seule clé de service. Cette route filtre les robots,
 * relaie la réponse et envoie le mail une fois la réponse partie.
 *
 * Une adresse déjà inscrite reçoit la même réponse qu'une nouvelle : la
 * distinguer permettrait de tester qui est inscrit.
 */

export const dynamic = "force-dynamic";

type Corps = {
  seance?: unknown;
  prenom?: unknown;
  nom?: unknown;
  email?: unknown;
  telephone?: unknown;
  premiere?: unknown;
  site?: unknown;
};

const texte = (v: unknown) => (typeof v === "string" ? v : "");

const refus = (message: string, status = 422) => NextResponse.json({ ok: false, message }, { status });

export async function POST(request: Request) {
  let c: Corps;
  try {
    c = await request.json();
  } catch {
    return refus("Requête illisible.", 400);
  }

  // Champ piège rempli : on fait croire à un succès, rien n'est écrit.
  if (texte(c.site).trim() !== "") return NextResponse.json({ ok: true, statut: "confirmee", rang: null });

  const seance = texte(c.seance);
  if (!UUID.test(seance)) return refus(ERREURS.KLUB_SEANCE);

  const coordonnees = { prenom: texte(c.prenom), nom: texte(c.nom), email: texte(c.email), telephone: texte(c.telephone) };
  const probleme = verifierCoordonnees(coordonnees);
  if (probleme) return refus(ERREURS[probleme]);

  let r;
  try {
    r = await rpcService<ReponseInscription>("klub_inscrire", {
      p_seance: seance,
      p_prenom: coordonnees.prenom,
      p_nom: coordonnees.nom,
      p_email: coordonnees.email,
      p_telephone: coordonnees.telephone,
      p_premiere: c.premiere === true,
    });
  } catch (e) {
    console.error("[klub] inscription : base injoignable", e);
    return refus("L’inscription n’a pas pu être enregistrée. Réessayez dans un instant.", 502);
  }

  if (!r.ok) {
    const code = codeErreur(r.corps);
    if (code && ERREURS[code]) return refus(ERREURS[code]);
    console.error("[klub] inscription refusée", r.status, r.corps);
    return refus("L’inscription n’a pas pu être enregistrée. Réessayez dans un instant.", 502);
  }

  const { statut, rang, mail_id } = r.data;
  if (mail_id) {
    after(async () => {
      await envoyerMail(mail_id);
    });
  }
  revalidatePath(ROUTES.klub);
  revalidatePath(klubSeancePath(seance));

  return NextResponse.json({ ok: true, statut, rang });
}
```

- [ ] **Step 3: Créer `app/api/klub/annulation/route.ts`**

```ts
import { revalidatePath } from "next/cache";
import { after, NextResponse } from "next/server";
import { envoyerFile, envoyerMail } from "@/lib/klub/envoi";
import { JETON } from "@/lib/klub/validation";
import { klubSeancePath, ROUTES } from "@/lib/routes";
import { rpcService } from "@/lib/supabase-service";

/**
 * POST /api/klub/annulation
 *
 * Appelée par le bouton de la page d'annulation, jamais à l'ouverture du
 * lien : les messageries qui visitent les liens des mails n'annulent rien.
 */

export const dynamic = "force-dynamic";

type ReponseAnnulation = {
  resultat: "annulee" | "deja" | "passee" | "inconnu" | "seance_annulee";
  seance_id?: string;
  mail_id?: string;
};

export async function POST(request: Request) {
  let jeton = "";
  try {
    const corps = (await request.json()) as { jeton?: unknown };
    jeton = typeof corps.jeton === "string" ? corps.jeton : "";
  } catch {
    return NextResponse.json({ ok: false, message: "Requête illisible." }, { status: 400 });
  }
  if (!JETON.test(jeton)) return NextResponse.json({ ok: true, resultat: "inconnu" });

  let r;
  try {
    r = await rpcService<ReponseAnnulation>("klub_annuler", { p_jeton: jeton });
  } catch (e) {
    console.error("[klub] annulation : base injoignable", e);
    return NextResponse.json({ ok: false, message: "L’annulation n’a pas pu être enregistrée." }, { status: 502 });
  }
  if (!r.ok) {
    console.error("[klub] annulation refusée", r.status, r.corps);
    return NextResponse.json({ ok: false, message: "L’annulation n’a pas pu être enregistrée." }, { status: 502 });
  }

  const { resultat, seance_id, mail_id } = r.data;
  if (resultat === "annulee") {
    after(async () => {
      if (mail_id) await envoyerMail(mail_id);
      // Une place libérée a peut-être promu quelqu'un : son mail part tout de suite.
      await envoyerFile(20);
    });
    revalidatePath(ROUTES.klub);
    if (seance_id) revalidatePath(klubSeancePath(seance_id));
  }
  return NextResponse.json({ ok: true, resultat });
}
```

- [ ] **Step 4: Vérifier**

Run: `npx tsc --noEmit && npm run lint`
Expected: aucune erreur.

- [ ] **Step 5: Commit**

```bash
git add lib/routes.ts app/api/klub/inscription/route.ts app/api/klub/annulation/route.ts
git commit -m "klub : routes d'inscription et d'annulation

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 12: Tâche planifiée

**Files:**
- Create: `app/api/klub/tache/route.ts`, `vercel.json`

- [ ] **Step 1: Créer `app/api/klub/tache/route.ts`**

```ts
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { envoyerFile } from "@/lib/klub/envoi";
import { ROUTES } from "@/lib/routes";
import { rpcService } from "@/lib/supabase-service";

/**
 * GET /api/klub/tache, appelée chaque minute par le cron Vercel (vercel.json).
 * Vercel envoie `Authorization: Bearer <CRON_SECRET>` quand la variable existe.
 * Génère les séances, met en file rappels et listes, purge, puis envoie.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type BilanTache = { generees: number; rappels: number; listes: number; relancees: number; purgees: number };

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[klub] CRON_SECRET absente");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const t = await rpcService<BilanTache>("klub_tache", {});
  if (!t.ok) {
    console.error("[klub] tâche en échec", t.status, t.corps);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  const mails = await envoyerFile(50);
  if (t.data.generees > 0 || t.data.purgees > 0) revalidatePath(ROUTES.klub);

  return NextResponse.json({ ok: true, ...t.data, mails });
}
```

- [ ] **Step 2: Créer `vercel.json`**

```json
{
  "crons": [{ "path": "/api/klub/tache", "schedule": "* * * * *" }]
}
```

Les crons Vercel ne tournent que sur le déploiement de production : rien ne part depuis les prévisualisations.

- [ ] **Step 3: Vérifier**

Run: `npx tsc --noEmit && npm run lint`
Expected: aucune erreur.

- [ ] **Step 4: Commit**

```bash
git add app/api/klub/tache/route.ts vercel.json
git commit -m "klub : tâche planifiée chaque minute

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 13: Lectures publiques côté serveur

**Files:**
- Create: `lib/klub/donnees.ts`

- [ ] **Step 1: Créer `lib/klub/donnees.ts`**

```ts
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase-config";
import type { InfosAnnulation, SeancePublique } from "./types";
import { JETON, UUID } from "./validation";

/**
 * Lectures publiques du Klub, avec la clé anon. Les fonctions appelées sont
 * `stable` : PostgREST les accepte en GET, que le cache de Next sait garder.
 */

/** Durée de cache des pages Klub, en secondes. */
export const KLUB_REVALIDATE = 60;

async function rpcGet<T>(nom: string, args: Record<string, string>, cache: boolean): Promise<T | null> {
  const url = `${SUPABASE_URL}/rest/v1/rpc/${nom}?${new URLSearchParams(args)}`;
  try {
    const res = await fetch(url, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      ...(cache ? { next: { revalidate: KLUB_REVALIDATE } } : { cache: "no-store" as const }),
    });
    if (!res.ok) {
      console.error(`[klub] ${nom} a répondu ${res.status}`, await res.text());
      return null;
    }
    return (await res.json()) as T;
  } catch (e) {
    console.error(`[klub] ${nom} injoignable`, e);
    return null;
  }
}

export async function getPlanning(du: Date, au: Date): Promise<SeancePublique[]> {
  return (await rpcGet<SeancePublique[]>("klub_planning", { p_du: du.toISOString(), p_au: au.toISOString() }, true)) ?? [];
}

export async function getSeance(id: string): Promise<SeancePublique | null> {
  if (!UUID.test(id)) return null;
  return rpcGet<SeancePublique>("klub_seance", { p_id: id }, true);
}

/** Jamais en cache : l'état change au clic. */
export async function getAnnulation(jeton: string): Promise<InfosAnnulation | null> {
  if (!JETON.test(jeton)) return null;
  return rpcGet<InfosAnnulation>("klub_annulation_infos", { p_jeton: jeton }, false);
}
```

- [ ] **Step 2: Vérifier la lecture en GET**

Outil `execute_sql` pour créer une séance témoin :

```sql
insert into public.klub_seances (debut, duree_min, type, titre, capacite, prix_libelle, inscription_requise)
values (now() + interval '2 days', 45, 'small', 'Test lecture', 5, '15 €', true) returning id;
```

Puis :

```bash
curl -s "https://nuehdfyscqnkckudkqhe.supabase.co/rest/v1/rpc/klub_seance?p_id=<id>" \
  -H "apikey: $(grep -o 'eyJ[^"]*' lib/supabase-config.ts)"
```

Expected : un objet JSON avec `"titre":"Test lecture"`, `"places_restantes":5`, sans e-mail ni téléphone.

Nettoyer : `delete from public.klub_seances where titre = 'Test lecture';`

- [ ] **Step 3: Commit**

```bash
git add lib/klub/donnees.ts
git commit -m "klub : lectures publiques du planning

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 14: Planning réel et tarifs corrigés

**Files:**
- Create: `components/site/klub/KlubCarte.tsx`, `components/site/klub/KlubSemaines.tsx`, `components/site/klub/KlubPlanning.tsx`
- Modify (réécriture complète): `lib/klub.ts`, `app/mugi-klub/page.tsx`

- [ ] **Step 1: Créer `components/site/klub/KlubCarte.tsx`**

```tsx
import Link from "next/link";
import { etatPlaces, heure, type EtatPlaces } from "@/lib/klub/format";
import { COULEUR_TYPE, LIBELLE_TYPE, type SeancePublique } from "@/lib/klub/types";
import { klubSeancePath } from "@/lib/routes";

const COULEUR_ETAT: Record<EtatPlaces["ton"], string> = {
  ok: "#1F8A5B",
  peu: "#C2410C",
  complet: "#9E4433",
  libre: "#04A49B",
  annulee: "rgba(51,51,52,.5)",
  passee: "rgba(51,51,52,.5)",
};

function action(ton: EtatPlaces["ton"]): string | null {
  if (ton === "ok" || ton === "peu") return "S’inscrire →";
  if (ton === "complet") return "Liste d’attente →";
  if (ton === "libre") return "Détails →";
  return null;
}

export default function KlubCarte({ seance, maintenant }: { seance: SeancePublique; maintenant: string }) {
  const etat = etatPlaces(seance, maintenant);
  const inerte = etat.ton === "annulee" || etat.ton === "passee";
  const couleur = COULEUR_TYPE[seance.type];
  const meta = [seance.intervenant, `${seance.duree_min} min`].filter(Boolean).join(" · ");
  const libelle = action(etat.ton);

  const style: React.CSSProperties = {
    display: "block",
    textDecoration: "none",
    borderRadius: "var(--r-m)",
    background: "#fff",
    boxShadow: "0 3px 16px rgba(60,40,30,.06)",
    borderLeft: `3px solid ${couleur}`,
    padding: 14,
    opacity: inerte ? 0.6 : 1,
  };

  const contenu = (
    <>
      <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#003850" }}>{heure(seance.debut)}</span>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: couleur }}>
          {LIBELLE_TYPE[seance.type]}
        </span>
      </span>
      <span
        style={{
          display: "block",
          margin: "0 0 5px",
          fontSize: "var(--h3-s)",
          fontWeight: 600,
          color: "#003850",
          lineHeight: 1.25,
          textDecoration: etat.ton === "annulee" ? "line-through" : "none",
        }}
      >
        {seance.titre}
      </span>
      <span style={{ display: "block", margin: "0 0 10px", fontSize: 12, color: "rgba(51,51,52,.55)" }}>{meta}</span>
      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: COULEUR_ETAT[etat.ton] }}>{etat.texte}</span>
        {libelle && <span style={{ fontSize: 12, fontWeight: 600, color: "#04A49B" }}>{libelle}</span>}
      </span>
    </>
  );

  return inerte ? (
    <div style={style}>{contenu}</div>
  ) : (
    <Link href={klubSeancePath(seance.id)} style={style} className="mg-inline-hover">
      {contenu}
    </Link>
  );
}
```

- [ ] **Step 2: Créer `components/site/klub/KlubSemaines.tsx`**

```tsx
"use client";

import { useState } from "react";

/** Navigation entre les semaines du planning, rendues à l'avance côté serveur. */
export default function KlubSemaines({ libelles, panneaux }: { libelles: string[]; panneaux: React.ReactNode[] }) {
  const [i, setI] = useState(0);

  const fleche = (desactive: boolean): React.CSSProperties => ({
    width: 38,
    height: 38,
    borderRadius: "50%",
    border: "1px solid rgba(0,56,80,.18)",
    background: "#fff",
    color: "#003850",
    fontSize: 18,
    lineHeight: 1,
    cursor: desactive ? "default" : "pointer",
    opacity: desactive ? 0.35 : 1,
  });

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <button type="button" aria-label="Semaine précédente" disabled={i === 0} onClick={() => setI(i - 1)} style={fleche(i === 0)}>
          ‹
        </button>
        <span aria-live="polite" style={{ minWidth: 170, textAlign: "center", fontSize: 15, fontWeight: 600, color: "#003850" }}>
          {i === 0 ? "Cette semaine" : libelles[i]}
        </span>
        <button
          type="button"
          aria-label="Semaine suivante"
          disabled={i === panneaux.length - 1}
          onClick={() => setI(i + 1)}
          style={fleche(i === panneaux.length - 1)}
        >
          ›
        </button>
      </div>
      {panneaux[i]}
    </>
  );
}
```

- [ ] **Step 3: Créer `components/site/klub/KlubPlanning.tsx`**

```tsx
import { cleJour, dateLongue, type Semaine } from "@/lib/klub/format";
import type { SeancePublique } from "@/lib/klub/types";
import KlubCarte from "./KlubCarte";
import KlubSemaines from "./KlubSemaines";

/**
 * Planning des quatre semaines à venir. Rendu côté serveur ; seule la
 * navigation entre semaines tourne dans le navigateur.
 */
export default function KlubPlanning({
  seances,
  semaines,
  maintenant,
}: {
  seances: SeancePublique[];
  semaines: Semaine[];
  maintenant: string;
}) {
  const panneaux = semaines.map((semaine) => {
    const parJour = new Map<string, SeancePublique[]>();
    for (const s of seances) {
      const cle = cleJour(s.debut);
      if (cle < semaine.debut || cle > semaine.fin) continue;
      parJour.set(cle, [...(parJour.get(cle) ?? []), s]);
    }
    const jours = [...parJour.keys()].sort();

    if (jours.length === 0) {
      return (
        <p key={semaine.debut} style={{ margin: 0, padding: "28px 0", fontSize: 15, color: "rgba(51,51,52,.6)" }}>
          Aucune séance programmée cette semaine pour l’instant.
        </p>
      );
    }

    return (
      <div
        key={semaine.debut}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, alignItems: "start" }}
      >
        {jours.map((cle) => {
          const libelle = dateLongue(`${cle}T12:00:00Z`);
          return (
            <div key={cle} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p
                style={{
                  margin: 0,
                  padding: "0 4px 10px",
                  borderBottom: "2px solid rgba(0,56,80,.1)",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#003850",
                }}
              >
                {libelle.charAt(0).toUpperCase() + libelle.slice(1)}
              </p>
              {parJour.get(cle)?.map((s) => <KlubCarte key={s.id} seance={s} maintenant={maintenant} />)}
            </div>
          );
        })}
      </div>
    );
  });

  return (
    <section id="planning" style={{ padding: "var(--sect-base) clamp(16px,4vw,48px)", maxWidth: 1320, margin: "0 auto" }}>
      <p style={{ margin: "0 0 10px", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 600, color: "#04A49B" }}>
        Les quatre prochaines semaines
      </p>
      <h2 style={{ margin: "0 0 12px", fontSize: "var(--h2-l)", fontWeight: 700, letterSpacing: "-.025em", color: "#003850" }}>
        Le planning
      </h2>
      <p style={{ margin: "0 0 28px", fontSize: 15, lineHeight: 1.6, color: "rgba(51,51,52,.7)" }}>
        Choisissez une séance pour vous inscrire. Le paiement se fait sur place.
      </p>
      <KlubSemaines libelles={semaines.map((s) => s.libelle)} panneaux={panneaux} />
    </section>
  );
}
```

- [ ] **Step 4: Réécrire `lib/klub.ts`**

```ts
/**
 * Page « Le Mugi Klub » : hero et contenu statique sous le planning.
 *
 * Le planning vient de la base (components/site/klub/KlubPlanning.tsx). Les
 * tarifs reprennent ceux de la page Préparation physique (lib/methodes.ts) :
 * 15 € la séance, 15 € la séance d'essai, 25 € l'essai en duo, groupes de 4
 * à 5. Aucun paiement en ligne : tout se règle sur place.
 */
export const KLUB = {
  eyebrow: `La communauté Mugitu`,
  title: `Le Mugi<br>Klub`,
  /* Cran de titre (cf. globals.css, --h1-*). `as const` : sans lui
     TypeScript élargit en `string` et le hero refuse la valeur. */
  size: "xl" as const,
  lead: ``,

  bodyHtml: `<!-- ░░ TARIFS ░░ -->
<section id="tarifs" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,48px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:48px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Small groups</p>
      <h2 style="margin:0;font-size:var(--h2-xl);font-weight:700;letter-spacing:-.025em;color:#003850;">Les tarifs</h2>
      <p style="margin:14px auto 0;max-width:560px;font-size:15px;line-height:1.6;color:rgba(51,51,52,.7);">Des groupes de 4 à 5 personnes. Vous réservez votre place en ligne et vous payez sur place, au centre.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px;align-items:stretch;">
      <div style="display:flex;flex-direction:column;background:#fff;border-radius:var(--r-l);box-shadow:0 6px 28px rgba(60,40,30,.07);padding:32px;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;color:rgba(51,51,52,.5);font-weight:600;">Découverte</p>
        <h3 style="margin:0 0 14px;font-size:var(--h3-l);font-weight:700;color:#003850;">Séance d’essai</h3>
        <p style="margin:0 0 22px;font-size:38px;font-weight:800;color:#003850;letter-spacing:-.02em;">15€<span style="font-size:14px;font-weight:500;color:rgba(51,51,52,.5);"> / séance</span></p>
        <ul style="margin:0 0 26px;padding:0;list-style:none;display:flex;flex-direction:column;gap:11px;flex:1;">
          <li style="font-size:14px;color:rgba(51,51,52,.72);">Votre première séance de small group</li>
          <li style="font-size:14px;color:rgba(51,51,52,.72);">Sans engagement</li>
        </ul>
        <a href="#planning" style="text-align:center;padding:13px;border-radius:var(--r-pill);border:1px solid #003850;color:#003850;font-size:14px;font-weight:600;text-decoration:none;" class="mg-inline-hover">Choisir une séance</a>
      </div>

      <div style="display:flex;flex-direction:column;background:#003850;border-radius:var(--r-l);box-shadow:0 14px 40px rgba(0,40,56,.25);padding:32px;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;color:rgba(255,255,255,.55);font-weight:600;">Le Klub</p>
        <h3 style="margin:0 0 14px;font-size:var(--h3-l);font-weight:700;color:#fff;">Small group</h3>
        <p style="margin:0 0 22px;font-size:38px;font-weight:800;color:#fff;letter-spacing:-.02em;">15€<span style="font-size:14px;font-weight:500;color:rgba(255,255,255,.5);"> / séance</span></p>
        <ul style="margin:0 0 26px;padding:0;list-style:none;display:flex;flex-direction:column;gap:11px;flex:1;">
          <li style="font-size:14px;color:rgba(255,255,255,.82);">4 à 5 personnes par séance</li>
          <li style="font-size:14px;color:rgba(255,255,255,.82);">Encadré par la Mugi Team</li>
          <li style="font-size:14px;color:rgba(255,255,255,.82);">Place réservée en ligne</li>
        </ul>
        <a href="#planning" style="text-align:center;padding:13px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:14px;font-weight:600;text-decoration:none;" class="mg-inline-hover">Voir le planning</a>
      </div>

      <div style="display:flex;flex-direction:column;background:#fff;border-radius:var(--r-l);box-shadow:0 6px 28px rgba(60,40,30,.07);padding:32px;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;color:rgba(51,51,52,.5);font-weight:600;">À deux</p>
        <h3 style="margin:0 0 14px;font-size:var(--h3-l);font-weight:700;color:#003850;">Essai en duo</h3>
        <p style="margin:0 0 22px;font-size:38px;font-weight:800;color:#003850;letter-spacing:-.02em;">25€<span style="font-size:14px;font-weight:500;color:rgba(51,51,52,.5);"> / duo</span></p>
        <ul style="margin:0 0 26px;padding:0;list-style:none;display:flex;flex-direction:column;gap:11px;flex:1;">
          <li style="font-size:14px;color:rgba(51,51,52,.72);">Une première séance avec la personne de votre choix</li>
          <li style="font-size:14px;color:rgba(51,51,52,.72);">Chacun s’inscrit de son côté sur le planning</li>
        </ul>
        <a href="#planning" style="text-align:center;padding:13px;border-radius:var(--r-pill);border:1px solid #003850;color:#003850;font-size:14px;font-weight:600;text-decoration:none;" class="mg-inline-hover">Choisir une séance</a>
      </div>
    </div>
    <p style="margin:30px 0 0;text-align:center;font-size:13px;color:rgba(51,51,52,.5);">Pour un atelier ou une conférence, le tarif est indiqué sur la page de la séance.</p>
  </div>
</section>

<!-- ░░ CTA ░░ -->
<section style="background:#003850;padding:var(--sect-base) clamp(20px,5vw,48px);text-align:center;">
  <div style="max-width:760px;margin:0 auto;">
    <h2 style="margin:0 0 16px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.02em;color:#fff;">Le mouvement, ça se partage</h2>
    <p style="margin:0 0 30px;font-size:16px;line-height:1.6;color:rgba(255,255,255,.7);">Choisissez une séance dans le planning et réservez votre place en ligne.</p>
    <a href="#planning" style="display:inline-flex;align-items:center;gap:8px;padding:15px 32px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;" class="mg-inline-hover">Voir le planning</a>
  </div>
</section>`,
};
```

- [ ] **Step 5: Réécrire `app/mugi-klub/page.tsx`**

```tsx
import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import KlubPlanning from "@/components/site/klub/KlubPlanning";
import { KLUB } from "@/lib/klub";
import { getPlanning } from "@/lib/klub/donnees";
import { cleJour, semaines } from "@/lib/klub/format";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Le Mugi Klub, small groups et ateliers à Biarritz",
  description:
    "Le planning du Mugi Klub à Biarritz : small groups, ateliers et conférences avec la Mugi Team. Inscription en ligne, paiement sur place.",
  alternates: { canonical: "https://mugitu-biarritz.fr/mugi-klub" },
};

/* Valeur littérale obligatoire. Les routes d'inscription et d'annulation
   invalident la page à chaque écriture ; ce délai couvre le reste. */
export const revalidate = 60;

const TRAIL = [{ label: "Accueil", href: ROUTES.home }];

export default async function MugiKlubPage() {
  const maintenant = new Date();
  const liste = semaines(cleJour(maintenant), 4);
  // Lundi 0 h à Paris tombe le dimanche soir en UTC : marge de 2 h.
  const du = new Date(Date.parse(`${liste[0].debut}T00:00:00Z`) - 2 * 3600_000);
  const au = new Date(Date.parse(`${liste[liste.length - 1].fin}T23:59:59Z`));
  const seances = await getPlanning(du, au);

  return (
    <>
      <SiteHeader />
      <main className="mg-main" style={{ background: "#FDF8F4" }}>
        <PageHero
          trail={TRAIL}
          crumb="Le Mugi Klub"
          eyebrow={KLUB.eyebrow}
          title={KLUB.title}
          lead={KLUB.lead}
          cta="#planning"
          size={KLUB.size}
          ctaLabel="Voir le planning"
        />
        <KlubPlanning seances={seances} semaines={liste} maintenant={maintenant.toISOString()} />
        <div dangerouslySetInnerHTML={{ __html: KLUB.bodyHtml }} />
      </main>
      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 5b: Aligner la page Préparation physique**

Tarifs confirmés par Lucas le 16 septembre 2026. Dans `lib/methodes.ts`, remplacer :

```
15 €/séance · séance d’essai 10 € · essai en duo 15 €.
```

par :

```
15 €/séance · séance d’essai 15 € · essai en duo 25 €.
```

Run: `git grep -n "essai 10\|duo 15" -- lib app components`
Expected : aucune ligne.

- [ ] **Step 6: Vérifier dans le navigateur**

Outil `execute_sql` pour une séance témoin :

```sql
insert into public.klub_seances (debut, duree_min, type, titre, intervenant, capacite, prix_libelle, inscription_requise)
values (now() + interval '1 day', 45, 'small', 'Test planning', 'Hugo', 5, '15 €', true);
```

Lancer le serveur de dev via `mcp__Claude_Browser__preview_start` (créer `.claude/launch.json` avec `npm run dev`, port 3000 s'il n'existe pas), ouvrir `/mugi-klub`.
Expected : hero, section « Le planning » avec la carte « Test planning » (« 5 places sur 5 », « S’inscrire → »), flèches de semaine fonctionnelles, trois cartes de tarifs à 15 €, 15 € et 25 €, aucune mention de 59 €, 120 € ou sauna. `read_console_messages` sans erreur.

Garder la séance témoin pour la Task 15.

- [ ] **Step 7: Commit**

```bash
git add components/site/klub/KlubCarte.tsx components/site/klub/KlubSemaines.tsx components/site/klub/KlubPlanning.tsx lib/klub.ts lib/methodes.ts app/mugi-klub/page.tsx
git commit -m "klub : planning réel des quatre semaines et tarifs corrigés

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 15: Page d'une séance et formulaire

**Files:**
- Create: `components/site/klub/KlubFormulaire.tsx`, `app/mugi-klub/seance/[id]/page.tsx`

- [ ] **Step 1: Créer `components/site/klub/KlubFormulaire.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ERREURS } from "@/lib/klub/erreurs";
import { rang } from "@/lib/klub/format";
import { verifierCoordonnees } from "@/lib/klub/validation";
import { ROUTES } from "@/lib/routes";

/**
 * Formulaire d'inscription à une séance. Pas de compte : prénom, nom,
 * e-mail, téléphone. Le mail de confirmation porte le lien d'annulation.
 */

const BLEU = "#003850";
const TEAL = "#04A49B";

const champ: React.CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: "var(--r-s)",
  border: "1px solid rgba(0,56,80,.18)",
  background: "#fff",
  color: BLEU,
  font: "inherit",
  fontSize: 16, // en dessous, iOS zoome sur le champ
};

const label: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: BLEU, marginBottom: 7 };

type Resultat = { statut: "confirmee" | "attente"; rang: number | null };

export default function KlubFormulaire({
  seanceId,
  quand,
  complet,
  prix,
}: {
  seanceId: string;
  quand: string;
  complet: boolean;
  prix: string;
}) {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [premiere, setPremiere] = useState(false);
  const [piege, setPiege] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const [resultat, setResultat] = useState<Resultat | null>(null);
  const id = useId();

  async function valider(e: React.FormEvent) {
    e.preventDefault();
    if (envoi) return;
    const code = verifierCoordonnees({ prenom, nom, email, telephone });
    if (code) return setErreur(ERREURS[code]);

    setErreur("");
    setEnvoi(true);
    try {
      const res = await fetch("/api/klub/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seance: seanceId, prenom, nom, email, telephone, premiere, site: piege }),
      });
      const data = (await res.json().catch(() => ({}))) as Partial<Resultat> & { ok?: boolean; message?: string };
      if (res.ok && data.ok && data.statut) {
        setResultat({ statut: data.statut, rang: data.rang ?? null });
      } else {
        setErreur(data.message ?? "L’inscription n’a pas pu être enregistrée.");
      }
    } catch {
      setErreur("Connexion impossible. Vérifiez le réseau et réessayez.");
    } finally {
      setEnvoi(false);
    }
  }

  function autrePersonne() {
    setResultat(null);
    setPrenom("");
    setNom("");
    setEmail("");
    setTelephone("");
    setPremiere(false);
  }

  if (resultat) {
    const confirmee = resultat.statut === "confirmee";
    return (
      <div role="status">
        <p style={{ margin: "0 0 8px", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 700, color: TEAL }}>
          {confirmee ? "Place réservée" : "Liste d’attente"}
        </p>
        <h2 style={{ margin: "0 0 14px", fontSize: "var(--h3-l)", fontWeight: 700, color: BLEU, lineHeight: 1.25 }}>
          {confirmee ? `C’est noté pour ${quand}` : `Vous êtes ${rang(resultat.rang ?? 1)} sur la liste d’attente`}
        </h2>
        <p style={{ margin: "0 0 22px", fontSize: 15, lineHeight: 1.6, color: "rgba(51,51,52,.75)" }}>
          {confirmee
            ? `Un mail de confirmation part vers ${email.trim()}, avec le lien pour libérer votre place si besoin. Le paiement se fait sur place.`
            : `Si une place se libère plus de deux heures avant le début, elle vous revient et vous recevez un mail. Un premier message part vers ${email.trim()}.`}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link
            href={`${ROUTES.klub}#planning`}
            style={{ padding: "13px 22px", borderRadius: "var(--r-pill)", background: TEAL, color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none" }}
          >
            Voir les autres séances
          </Link>
          <button
            type="button"
            onClick={autrePersonne}
            style={{ padding: "13px 22px", borderRadius: "var(--r-pill)", border: "1px solid rgba(0,56,80,.2)", background: "#fff", color: BLEU, font: "inherit", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
          >
            Inscrire une autre personne
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={valider} noValidate>
      {complet && (
        <p style={{ margin: "0 0 18px", padding: "12px 14px", borderRadius: "var(--r-m)", background: "rgba(243,190,121,.2)", color: "#8a5a10", fontSize: 14, lineHeight: 1.5 }}>
          La séance est complète : vous serez inscrit·e sur la liste d’attente.
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 14 }}>
        <div>
          <label htmlFor={`${id}-prenom`} style={label}>Prénom</label>
          <input id={`${id}-prenom`} autoComplete="given-name" value={prenom} onChange={(e) => setPrenom(e.target.value)} style={champ} />
        </div>
        <div>
          <label htmlFor={`${id}-nom`} style={label}>Nom</label>
          <input id={`${id}-nom`} autoComplete="family-name" value={nom} onChange={(e) => setNom(e.target.value)} style={champ} />
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label htmlFor={`${id}-email`} style={label}>E-mail</label>
        <input
          id={`${id}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={champ}
        />
      </div>

      <div style={{ marginBottom: 18 }}>
        <label htmlFor={`${id}-tel`} style={label}>Téléphone</label>
        <input
          id={`${id}-tel`}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          style={champ}
        />
        <p style={{ margin: "7px 0 0", fontSize: 12.5, color: "rgba(51,51,52,.55)" }}>Pour vous joindre en cas d’imprévu le jour même.</p>
      </div>

      <label style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={premiere}
          onChange={(e) => setPremiere(e.target.checked)}
          style={{ width: 20, height: 20, marginTop: 1, accentColor: TEAL, flex: "0 0 auto" }}
        />
        <span style={{ fontSize: 14.5, lineHeight: 1.5, color: BLEU }}>C’est ma première séance au Klub</span>
      </label>

      {/* Champ piège : jamais affiché, jamais annoncé aux lecteurs d'écran. */}
      <input
        type="text"
        name="site"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={piege}
        onChange={(e) => setPiege(e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      {erreur && (
        <p role="alert" style={{ margin: "0 0 16px", padding: "12px 14px", borderRadius: "var(--r-s)", background: "rgba(158,68,51,.08)", color: "#9E4433", fontSize: 14.5, lineHeight: 1.5 }}>
          {erreur}
        </p>
      )}

      <button
        type="submit"
        disabled={envoi}
        style={{
          width: "100%",
          padding: "16px 20px",
          border: "none",
          borderRadius: "var(--r-pill)",
          background: TEAL,
          color: "#fff",
          font: "inherit",
          fontSize: 16,
          fontWeight: 700,
          cursor: envoi ? "default" : "pointer",
          opacity: envoi ? 0.6 : 1,
        }}
      >
        {envoi ? "Envoi…" : complet ? "Rejoindre la liste d’attente" : "Réserver ma place"}
      </button>

      <p style={{ margin: "14px 0 0", fontSize: 12.5, lineHeight: 1.6, color: "rgba(51,51,52,.55)" }}>
        Le paiement se fait sur place{prix ? ` (${prix})` : ""}. Vos coordonnées servent uniquement à organiser la séance :{" "}
        <Link href={ROUTES.confidentialite} style={{ color: TEAL, fontWeight: 600 }}>
          politique de confidentialité
        </Link>
        .
      </p>
    </form>
  );
}
```

- [ ] **Step 2: Créer `app/mugi-klub/seance/[id]/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/site/PageHero";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import KlubFormulaire from "@/components/site/klub/KlubFormulaire";
import { getSeance } from "@/lib/klub/donnees";
import { dateHeure, dateLongue, etatPlaces, heure } from "@/lib/klub/format";
import { ADRESSE } from "@/lib/klub/mails";
import { LIBELLE_TYPE } from "@/lib/klub/types";
import { klubSeancePath, ROUTES } from "@/lib/routes";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

/** Le titre du hero est inséré en HTML : on échappe ce que saisit l'équipe. */
const echapper = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const majuscule = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const s = await getSeance(id);
  if (!s) return { title: "Séance introuvable", robots: { index: false } };
  return {
    title: `${s.titre}, ${dateHeure(s.debut)}`,
    description: `${LIBELLE_TYPE[s.type]} au Mugi Klub, ${dateHeure(s.debut)}${s.intervenant ? ` avec ${s.intervenant}` : ""}. Inscription en ligne, paiement sur place.`,
    alternates: { canonical: `https://mugitu-biarritz.fr${klubSeancePath(s.id)}` },
  };
}

export default async function SeancePage({ params }: Props) {
  const { id } = await params;
  const s = await getSeance(id);
  if (!s) notFound();

  const etat = etatPlaces(s, new Date());
  const details: [string, string][] = [
    ["Date", majuscule(dateLongue(s.debut))],
    ["Heure", `${heure(s.debut)}, ${s.duree_min} min`],
    ...(s.intervenant ? ([["Avec", s.intervenant]] as [string, string][]) : []),
    ["Lieu", ADRESSE],
    ["Tarif", s.prix_libelle ? `${s.prix_libelle}, sur place` : "Sur place"],
    ["Places", etat.texte],
  ];

  const carte: React.CSSProperties = {
    background: "#fff",
    borderRadius: "var(--r-l)",
    boxShadow: "0 6px 28px rgba(60,40,30,.07)",
    padding: "clamp(22px,4vw,34px)",
  };
  const texte: React.CSSProperties = { margin: "0 0 18px", fontSize: 15, lineHeight: 1.65, color: "rgba(51,51,52,.78)" };
  const lienPlanning = (
    <Link href={`${ROUTES.klub}#planning`} style={{ color: "#04A49B", fontWeight: 600 }}>
      Voir les prochaines séances
    </Link>
  );

  return (
    <>
      <SiteHeader />
      <main className="mg-main" style={{ background: "#FDF8F4" }}>
        <PageHero
          trail={[
            { label: "Accueil", href: ROUTES.home },
            { label: "Le Mugi Klub", href: ROUTES.klub },
          ]}
          crumb={s.titre}
          eyebrow={`${LIBELLE_TYPE[s.type]} · ${dateLongue(s.debut)}`}
          title={echapper(s.titre)}
          lead=""
          cta="#inscription"
          ctaLabel={etat.ton === "complet" ? "Rejoindre la liste d’attente" : "S’inscrire"}
          size="m"
        />

        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "var(--sect-base) clamp(20px,5vw,40px) var(--sect-ample)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 22,
            alignItems: "start",
          }}
        >
          <section style={carte}>
            <dl style={{ margin: "0 0 8px", display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 18px" }}>
              {details.map(([terme, valeur]) => (
                <div key={terme} style={{ display: "contents" }}>
                  <dt style={{ fontSize: 13, fontWeight: 700, color: "rgba(51,51,52,.5)" }}>{terme}</dt>
                  <dd style={{ margin: 0, fontSize: 15, color: "#003850", fontWeight: 600 }}>{valeur}</dd>
                </div>
              ))}
            </dl>
            {s.description && <p style={{ ...texte, marginTop: 20, whiteSpace: "pre-line" }}>{s.description}</p>}
          </section>

          <section id="inscription" style={carte}>
            {etat.ton === "annulee" && (
              <>
                <p style={texte}>Cette séance est annulée.</p>
                {lienPlanning}
              </>
            )}
            {etat.ton === "passee" && (
              <>
                <p style={texte}>Cette séance a déjà eu lieu.</p>
                {lienPlanning}
              </>
            )}
            {etat.ton === "libre" && (
              <>
                <p style={texte}>Entrée libre, sans inscription : venez directement au {ADRESSE}.</p>
                {lienPlanning}
              </>
            )}
            {(etat.ton === "ok" || etat.ton === "peu" || etat.ton === "complet") && (
              <KlubFormulaire seanceId={s.id} quand={dateHeure(s.debut)} complet={etat.ton === "complet"} prix={s.prix_libelle} />
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 3: Vérifier le parcours sur le serveur de dev**

Prérequis : `.env.local` contient `SUPABASE_SERVICE_ROLE_KEY` (Task 6). `BREVO_API_KEY` n'est pas nécessaire en local : les adresses `@example.com` ne partent jamais, le mail est marqué `abandonne`.

Depuis `/mugi-klub`, cliquer la carte « Test planning », remplir le formulaire avec `test.klub@example.com`, `06 12 34 56 78`, envoyer.
Expected : écran « C’est noté pour … ». Retour sur `/mugi-klub` : la carte affiche « 4 places sur 5 » (cache invalidé). Envoyer un e-mail invalide : message « Cette adresse e-mail ne semble pas valide. » sous le formulaire.

Outil `execute_sql` : `select statut from public.klub_inscriptions i join public.klub_seances s on s.id = i.seance_id where s.titre = 'Test planning';`
Expected : `confirmee`.

- [ ] **Step 4: Commit**

```bash
git add components/site/klub/KlubFormulaire.tsx "app/mugi-klub/seance/[id]/page.tsx"
git commit -m "klub : page de séance et formulaire d'inscription

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 16: Page d'annulation

**Files:**
- Create: `components/site/klub/KlubAnnulation.tsx`, `app/mugi-klub/annulation/page.tsx`

- [ ] **Step 1: Créer `components/site/klub/KlubAnnulation.tsx`**

```tsx
"use client";

import { useState } from "react";

/** Bouton d'annulation : ouvrir le lien du mail ne suffit pas, il faut cliquer. */
export default function KlubAnnulation({
  jeton,
  prenom,
  titre,
  quand,
  attente,
}: {
  jeton: string;
  prenom: string;
  titre: string;
  quand: string;
  attente: boolean;
}) {
  const [etat, setEtat] = useState<"pret" | "envoi" | "fait" | "erreur">("pret");
  const [message, setMessage] = useState("");

  const h1: React.CSSProperties = { margin: "0 0 14px", fontSize: "var(--h2-s)", fontWeight: 700, color: "#003850", lineHeight: 1.2 };
  const p: React.CSSProperties = { margin: "0 0 22px", fontSize: 16, lineHeight: 1.6, color: "rgba(51,51,52,.75)" };

  async function annuler() {
    setEtat("envoi");
    try {
      const res = await fetch("/api/klub/annulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jeton }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; resultat?: string; message?: string };
      if (res.ok && data.ok && (data.resultat === "annulee" || data.resultat === "deja")) {
        setEtat("fait");
        return;
      }
      setMessage(
        data.resultat === "passee"
          ? "La séance a déjà commencé : l’inscription ne peut plus être annulée."
          : data.resultat === "seance_annulee"
            ? "Cette séance a été annulée par l’équipe. Vous n’avez rien à faire."
            : (data.message ?? "L’annulation n’a pas pu être enregistrée. Réessayez ou écrivez-nous."),
      );
      setEtat("erreur");
    } catch {
      setMessage("Connexion impossible. Vérifiez le réseau et réessayez.");
      setEtat("erreur");
    }
  }

  if (etat === "fait") {
    return (
      <div role="status">
        <h1 style={h1}>{attente ? "Vous avez quitté la liste d’attente" : "Votre place est libérée"}</h1>
        <p style={p}>Merci de nous avoir prévenus. Un mail de confirmation vous est envoyé.</p>
      </div>
    );
  }

  return (
    <>
      <h1 style={h1}>Bonjour {prenom}</h1>
      <p style={p}>
        {attente
          ? `Vous êtes sur la liste d’attente pour « ${titre} », ${quand}.`
          : `Vous avez une place pour « ${titre} », ${quand}.`}
      </p>
      {etat === "erreur" && (
        <p role="alert" style={{ margin: "0 0 16px", padding: "12px 14px", borderRadius: "var(--r-s)", background: "rgba(158,68,51,.08)", color: "#9E4433", fontSize: 14.5 }}>
          {message}
        </p>
      )}
      <button
        type="button"
        disabled={etat === "envoi"}
        onClick={() => void annuler()}
        style={{
          padding: "15px 28px",
          borderRadius: "var(--r-pill)",
          border: "none",
          background: "#04A49B",
          color: "#fff",
          font: "inherit",
          fontSize: 16,
          fontWeight: 700,
          cursor: etat === "envoi" ? "default" : "pointer",
          opacity: etat === "envoi" ? 0.6 : 1,
        }}
      >
        {etat === "envoi" ? "Envoi…" : attente ? "Quitter la liste d’attente" : "Libérer ma place"}
      </button>
    </>
  );
}
```

- [ ] **Step 2: Créer `app/mugi-klub/annulation/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import KlubAnnulation from "@/components/site/klub/KlubAnnulation";
import { getAnnulation } from "@/lib/klub/donnees";
import { dateHeure } from "@/lib/klub/format";
import { ROUTES } from "@/lib/routes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Annuler une inscription au Mugi Klub",
  robots: { index: false, follow: false },
};

function Message({ titre, texte }: { titre: string; texte: string }) {
  return (
    <>
      <h1 style={{ margin: "0 0 14px", fontSize: "var(--h2-s)", fontWeight: 700, color: "#003850", lineHeight: 1.2 }}>{titre}</h1>
      <p style={{ margin: "0 0 22px", fontSize: 16, lineHeight: 1.6, color: "rgba(51,51,52,.75)" }}>{texte}</p>
    </>
  );
}

export default async function AnnulationPage({ searchParams }: { searchParams: Promise<{ jeton?: string }> }) {
  const { jeton = "" } = await searchParams;
  const infos = await getAnnulation(jeton);

  let contenu: ReactNode;
  if (!infos) {
    contenu = <Message titre="Ce lien n’est plus valable" texte="Vérifiez que vous avez ouvert le lien du dernier mail reçu, ou écrivez-nous." />;
  } else if (infos.statut === "annulee") {
    contenu = <Message titre="Inscription déjà annulée" texte={`Votre inscription à « ${infos.seance.titre} » est déjà annulée. Vous n’avez rien d’autre à faire.`} />;
  } else if (infos.seance.statut === "annulee") {
    contenu = <Message titre="Séance annulée" texte="Cette séance a été annulée par l’équipe. Vous n’avez rien à faire." />;
  } else if (new Date(infos.seance.debut) <= new Date()) {
    contenu = <Message titre="Séance commencée" texte="La séance a déjà commencé ou est terminée : l’inscription ne peut plus être annulée." />;
  } else {
    contenu = (
      <KlubAnnulation
        jeton={jeton}
        prenom={infos.prenom}
        titre={infos.seance.titre}
        quand={dateHeure(infos.seance.debut)}
        attente={infos.statut === "attente"}
      />
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mg-main" style={{ background: "#FDF8F4" }}>
        <section
          style={{
            minHeight: "calc(100svh - 84px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(90px,14vh,150px) clamp(20px,5vw,64px) clamp(60px,9vw,110px)",
          }}
        >
          <div style={{ maxWidth: 560, width: "100%", background: "#fff", borderRadius: "var(--r-l)", padding: "clamp(30px,5vw,52px)", boxShadow: "0 6px 28px rgba(60,40,30,.07)" }}>
            <p style={{ margin: "0 0 18px", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 700, color: "#04A49B" }}>
              Mugi Klub
            </p>
            {contenu}
            <p style={{ margin: "26px 0 0" }}>
              <Link href={`${ROUTES.klub}#planning`} style={{ color: "#04A49B", fontWeight: 600, fontSize: 15 }}>
                Voir le planning
              </Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 3: Vérifier sur le serveur de dev**

Outil `execute_sql` : `select jeton from public.klub_inscriptions where email = 'test.klub@example.com' and statut = 'confirmee';`

Ouvrir `/mugi-klub/annulation?jeton=<jeton>`.
Expected : « Bonjour … », phrase avec la séance, bouton « Libérer ma place ». La base n'a pas changé tant qu'on n'a pas cliqué. Cliquer : « Votre place est libérée ». Recharger la page : « Inscription déjà annulée ». Ouvrir `/mugi-klub/annulation?jeton=abc` : « Ce lien n’est plus valable ».

Nettoyer : `delete from public.klub_seances where titre = 'Test planning';`

- [ ] **Step 4: Commit**

```bash
git add components/site/klub/KlubAnnulation.tsx app/mugi-klub/annulation/page.tsx
git commit -m "klub : page d'annulation par lien et bouton

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 17: Admin, coquille et créneaux

**Files:**
- Create: `components/admin/klub/styles.ts`, `components/admin/klub/rpc.ts`, `components/admin/klub/ChampsSeanceForm.tsx`, `components/admin/klub/KlubCreneaux.tsx`
- Modify (réécriture complète): `components/admin/KlubAdmin.tsx`, `app/admin/mugi-klub/page.tsx`

`KlubAdmin.tsx` importe à la fin de cette tâche `KlubSeances` et `KlubMailsEnErreur`, créés à la Task 18. Pour que le build passe entre les deux, cette tâche crée ces deux fichiers en version minimale (Step 5), remplacés à la Task 18.

- [ ] **Step 1: Créer `components/admin/klub/styles.ts`**

```ts
import type { CSSProperties } from "react";

export const CHAMP: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(0,56,80,.18)",
  font: "inherit",
  fontSize: 14,
  color: "#003850",
  background: "#fff",
};

export const LABEL: CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "rgba(51,51,52,.6)",
  marginBottom: 6,
};

export const CARTE: CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: "clamp(16px,2.5vw,26px)",
  boxShadow: "0 3px 16px rgba(60,40,30,.06)",
};

export const TITRE_SECTION: CSSProperties = {
  margin: "0 0 12px",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: ".12em",
  textTransform: "uppercase",
  color: "rgba(51,51,52,.45)",
};

export function bouton(variante: "plein" | "contour" | "danger" = "plein", petit = false): CSSProperties {
  const base: CSSProperties = {
    padding: petit ? "6px 12px" : "10px 20px",
    borderRadius: 999,
    font: "inherit",
    fontSize: petit ? 13 : 14,
    fontWeight: 600,
    cursor: "pointer",
  };
  if (variante === "plein") return { ...base, border: "none", background: "#04A49B", color: "#fff" };
  if (variante === "danger") return { ...base, border: "1px solid rgba(194,65,12,.35)", background: "transparent", color: "#C2410C" };
  return { ...base, border: "1px solid rgba(0,56,80,.18)", background: "transparent", color: "#003850" };
}
```

- [ ] **Step 2: Créer `components/admin/klub/rpc.ts`**

```ts
import { codeErreur, ERREURS } from "@/lib/klub/erreurs";
import { supabaseBrowser } from "@/lib/supabase-browser";

export type Retour<T> = { ok: true; data: T } | { ok: false; message: string };

/** Appelle une fonction admin du Klub avec la session du praticien connecté. */
export async function appeler<T>(nom: string, args: Record<string, unknown>): Promise<Retour<T>> {
  const { data, error } = await supabaseBrowser().rpc(nom, args);
  if (error) {
    const code = codeErreur(error);
    return { ok: false, message: code && ERREURS[code] ? ERREURS[code] : error.message };
  }
  return { ok: true, data: data as T };
}
```

- [ ] **Step 3: Créer `components/admin/klub/ChampsSeanceForm.tsx`**

```tsx
"use client";

import { KLUB_TYPES, type ChampsSeance, type KlubType } from "@/lib/klub/types";
import { CHAMP, LABEL } from "./styles";

/** Champs communs au créneau et à la séance. */
export default function ChampsSeanceForm<T extends ChampsSeance>({
  valeur,
  onChange,
  prefixe,
}: {
  valeur: T;
  onChange: (maj: (v: T) => T) => void;
  prefixe: string;
}) {
  const set = <K extends keyof ChampsSeance>(k: K, v: ChampsSeance[K]) => onChange((d) => ({ ...d, [k]: v }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
        <div>
          <label style={LABEL} htmlFor={`${prefixe}-type`}>Type</label>
          <select id={`${prefixe}-type`} style={CHAMP} value={valeur.type} onChange={(e) => set("type", e.target.value as KlubType)}>
            {KLUB_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={LABEL} htmlFor={`${prefixe}-duree`}>Durée (min)</label>
          <input
            id={`${prefixe}-duree`}
            type="number"
            min={5}
            step={5}
            style={CHAMP}
            value={valeur.duree_min}
            onChange={(e) => set("duree_min", Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <label style={LABEL} htmlFor={`${prefixe}-titre`}>Titre</label>
        <input id={`${prefixe}-titre`} style={CHAMP} value={valeur.titre} onChange={(e) => set("titre", e.target.value)} />
      </div>

      <div>
        <label style={LABEL} htmlFor={`${prefixe}-desc`}>Description</label>
        <textarea
          id={`${prefixe}-desc`}
          rows={3}
          style={{ ...CHAMP, resize: "vertical" }}
          value={valeur.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        <div>
          <label style={LABEL} htmlFor={`${prefixe}-inter`}>Intervenant</label>
          <input id={`${prefixe}-inter`} style={CHAMP} value={valeur.intervenant} onChange={(e) => set("intervenant", e.target.value)} />
        </div>
        <div>
          <label style={LABEL} htmlFor={`${prefixe}-inter-mail`}>E-mail de l’intervenant</label>
          <input
            id={`${prefixe}-inter-mail`}
            type="email"
            style={CHAMP}
            value={valeur.intervenant_email ?? ""}
            onChange={(e) => set("intervenant_email", e.target.value.trim() || null)}
          />
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(51,51,52,.5)" }}>Reçoit la liste des inscrits 2 h avant.</p>
        </div>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#003850" }}>
        <input
          type="checkbox"
          checked={valeur.inscription_requise}
          onChange={(e) =>
            onChange((d) => ({ ...d, inscription_requise: e.target.checked, capacite: e.target.checked ? (d.capacite ?? 5) : null }))
          }
        />
        Inscription requise (places comptées)
      </label>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
        <div>
          <label style={LABEL} htmlFor={`${prefixe}-cap`}>Places</label>
          <input
            id={`${prefixe}-cap`}
            type="number"
            min={1}
            style={{ ...CHAMP, opacity: valeur.inscription_requise ? 1 : 0.5 }}
            disabled={!valeur.inscription_requise}
            value={valeur.capacite ?? ""}
            onChange={(e) => set("capacite", e.target.value ? Number(e.target.value) : null)}
          />
        </div>
        <div>
          <label style={LABEL} htmlFor={`${prefixe}-prix`}>Prix affiché</label>
          <input
            id={`${prefixe}-prix`}
            style={CHAMP}
            value={valeur.prix_libelle}
            placeholder="15 € la séance"
            onChange={(e) => set("prix_libelle", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Créer `components/admin/klub/KlubCreneaux.tsx`**

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { COULEUR_TYPE, KLUB_JOURS, type Creneau } from "@/lib/klub/types";
import { supabaseBrowser } from "@/lib/supabase-browser";
import ChampsSeanceForm from "./ChampsSeanceForm";
import { appeler } from "./rpc";
import { bouton, CARTE, CHAMP, LABEL, TITRE_SECTION } from "./styles";

type Props = { version: number; notifier: (m: string) => void; rafraichir: () => void };

function nouveauCreneau(): Creneau {
  return {
    id: "",
    jour: 1,
    heure: "12:30:00",
    actif: true,
    type: "small",
    titre: "",
    description: "",
    intervenant: "",
    intervenant_email: null,
    duree_min: 45,
    capacite: 5,
    prix_libelle: "15 € la séance",
    inscription_requise: true,
  };
}

function messageEnregistrement(conservees: number): string {
  if (conservees === 0) return "Créneau enregistré. Les séances à venir sont à jour.";
  if (conservees === 1)
    return "Créneau enregistré. Une séance à venir garde ses anciens réglages, parce qu’elle a des inscrits ou a été modifiée à part : voyez l’onglet Séances.";
  return `Créneau enregistré. ${conservees} séances à venir gardent leurs anciens réglages, parce qu’elles ont des inscrits ou ont été modifiées à part : voyez l’onglet Séances.`;
}

export default function KlubCreneaux({ version, notifier, rafraichir }: Props) {
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [draft, setDraft] = useState<Creneau | null>(null);
  const [occupe, setOccupe] = useState(false);

  const charger = useCallback(async () => {
    const { data, error } = await supabaseBrowser().from("klub_creneaux").select("*").order("jour").order("heure");
    if (error) notifier(`Lecture impossible : ${error.message}`);
    setCreneaux((data ?? []) as Creneau[]);
  }, [notifier]);

  useEffect(() => {
    const t = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(t);
  }, [charger, version]);

  const enregistrer = async () => {
    if (!draft) return;
    if (!draft.titre.trim()) return notifier("Le titre est obligatoire.");
    setOccupe(true);
    const r = await appeler<{ id: string; conservees: number }>("klub_admin_sauver_creneau", {
      p: { ...draft, id: draft.id || null },
    });
    setOccupe(false);
    if (!r.ok) return notifier(`Enregistrement refusé : ${r.message}`);
    notifier(messageEnregistrement(r.data.conservees));
    setDraft(null);
    rafraichir();
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,340px) minmax(0,1fr)", gap: 20, alignItems: "start" }}>
      <aside style={{ ...CARTE, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ ...TITRE_SECTION, margin: 0 }}>
            {creneaux.length} créneau{creneaux.length > 1 ? "x" : ""}
          </p>
          <button type="button" onClick={() => setDraft(nouveauCreneau())} style={bouton("plein", true)}>
            Nouveau créneau
          </button>
        </div>
        {KLUB_JOURS.map((nom, i) => {
          const duJour = creneaux.filter((c) => c.jour === i + 1);
          if (duJour.length === 0) return null;
          return (
            <div key={nom} style={{ marginBottom: 14 }}>
              <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: "#003850" }}>{nom}</p>
              {duJour.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setDraft(c)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 10px",
                    marginBottom: 4,
                    borderRadius: 10,
                    border: "1px solid",
                    borderColor: draft?.id === c.id ? "#04A49B" : "rgba(0,56,80,.1)",
                    background: draft?.id === c.id ? "rgba(4,164,155,.07)" : "transparent",
                    font: "inherit",
                    cursor: "pointer",
                    opacity: c.actif ? 1 : 0.5,
                  }}
                >
                  <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: COULEUR_TYPE[c.type] }} />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#003850", minWidth: 42 }}>{c.heure.slice(0, 5)}</span>
                  <span style={{ fontSize: 13, color: "#003850", flex: 1 }}>{c.titre}</span>
                  {!c.actif && <span style={{ fontSize: 11, color: "rgba(51,51,52,.5)" }}>en pause</span>}
                </button>
              ))}
            </div>
          );
        })}
        {creneaux.length === 0 && (
          <p style={{ margin: 0, fontSize: 13.5, color: "rgba(51,51,52,.55)" }}>
            Aucun créneau. Un créneau génère ses séances sur les quatre semaines à venir.
          </p>
        )}
      </aside>

      <section style={CARTE}>
        {!draft ? (
          <p style={{ margin: 0, fontSize: 15, color: "rgba(51,51,52,.6)" }}>
            Choisissez un créneau à gauche, ou créez-en un. Les séances des quatre semaines à venir sont créées ou mises à jour à
            l’enregistrement.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
              <div>
                <label style={LABEL} htmlFor="c-jour">Jour</label>
                <select
                  id="c-jour"
                  style={CHAMP}
                  value={draft.jour}
                  onChange={(e) => {
                    const jour = Number(e.target.value);
                    setDraft((d) => (d ? { ...d, jour } : d));
                  }}
                >
                  {KLUB_JOURS.map((n, i) => (
                    <option key={n} value={i + 1}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={LABEL} htmlFor="c-heure">Heure</label>
                <input
                  id="c-heure"
                  type="time"
                  style={CHAMP}
                  value={draft.heure.slice(0, 5)}
                  onChange={(e) => {
                    const heure = `${e.target.value}:00`;
                    setDraft((d) => (d ? { ...d, heure } : d));
                  }}
                />
              </div>
            </div>

            <ChampsSeanceForm valeur={draft} prefixe="c" onChange={(maj) => setDraft((d) => (d ? maj(d) : d))} />

            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#003850" }}>
              <input
                type="checkbox"
                checked={draft.actif}
                onChange={(e) => {
                  const actif = e.target.checked;
                  setDraft((d) => (d ? { ...d, actif } : d));
                }}
              />
              Proposé chaque semaine (décocher pour mettre en pause)
            </label>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" disabled={occupe} onClick={() => void enregistrer()} style={bouton("plein")}>
                {occupe ? "…" : "Enregistrer"}
              </button>
              <button type="button" onClick={() => setDraft(null)} style={bouton("contour")}>
                Fermer
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
```

- [ ] **Step 5: Créer les deux composants provisoires**

`components/admin/klub/KlubSeances.tsx` :

```tsx
"use client";

type Props = { version: number; notifier: (m: string) => void; rafraichir: () => void };

/** Provisoire : remplacé à la Task 18. */
export default function KlubSeances(props: Props) {
  void props;
  return null;
}
```

`components/admin/klub/KlubMailsEnErreur.tsx` :

```tsx
"use client";

type Props = { version: number; notifier: (m: string) => void; rafraichir: () => void };

/** Provisoire : remplacé à la Task 18. */
export default function KlubMailsEnErreur(props: Props) {
  void props;
  return null;
}
```

- [ ] **Step 6: Réécrire `components/admin/KlubAdmin.tsx`**

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import AdminLogin from "./AdminLogin";
import AdminNav from "./AdminNav";
import KlubCreneaux from "./klub/KlubCreneaux";
import KlubMailsEnErreur from "./klub/KlubMailsEnErreur";
import KlubSeances from "./klub/KlubSeances";
import { bouton } from "./klub/styles";

/**
 * Back-office du Mugi Klub. La RLS ne donne aux praticiens que la lecture ;
 * chaque écriture passe par une fonction `klub_admin_*` qui vérifie leurs
 * droits et applique les règles de places et de mails.
 */

type Etat = "chargement" | "deconnecte" | "pret";
type Onglet = "seances" | "creneaux";

export default function KlubAdmin() {
  const [etat, setEtat] = useState<Etat>("chargement");
  const [onglet, setOnglet] = useState<Onglet>("seances");
  const [message, setMessage] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const verifier = useCallback(async () => {
    const { data } = await supabaseBrowser().auth.getSession();
    setEtat(data.session ? "pret" : "deconnecte");
  }, []);

  useEffect(() => {
    // Même motif que les autres back-offices : abonnement à la session, et
    // premier chargement par un timeout (lint React Compiler).
    const { data } = supabaseBrowser().auth.onAuthStateChange(() => {
      void verifier();
    });
    const initial = window.setTimeout(() => void verifier(), 0);
    return () => {
      data.subscription.unsubscribe();
      window.clearTimeout(initial);
    };
  }, [verifier]);

  const notifier = useCallback((m: string) => {
    setMessage(m);
    window.setTimeout(() => setMessage(null), 6000);
  }, []);

  const rafraichir = useCallback(() => setVersion((v) => v + 1), []);

  if (etat === "chargement") {
    return <p style={{ padding: 40, fontSize: 15, color: "rgba(51,51,52,.6)" }}>Chargement…</p>;
  }
  if (etat === "deconnecte") {
    return <AdminLogin titre="Mugi Klub" onSignedIn={() => void verifier()} />;
  }

  const ongletStyle = (o: Onglet): React.CSSProperties => ({
    ...bouton("contour", true),
    color: onglet === o ? "#003850" : "rgba(255,255,255,.75)",
    background: onglet === o ? "#fff" : "transparent",
    borderColor: "rgba(255,255,255,.3)",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#FDF8F4" }}>
      <header
        style={{
          background: "#003850",
          color: "#fff",
          padding: "18px clamp(16px,4vw,32px)",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#04A49B", fontWeight: 700 }}>
            Back-office
          </p>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Mugi Klub</p>
        </div>
        <AdminNav courant="/admin/mugi-klub" />
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={() => setOnglet("seances")} style={ongletStyle("seances")}>
            Séances
          </button>
          <button type="button" onClick={() => setOnglet("creneaux")} style={ongletStyle("creneaux")}>
            Créneaux
          </button>
        </div>
        <button
          type="button"
          onClick={() => void supabaseBrowser().auth.signOut()}
          style={{ ...bouton("contour", true), marginLeft: "auto", color: "#fff", borderColor: "rgba(255,255,255,.3)" }}
        >
          Se déconnecter
        </button>
      </header>

      {message && (
        <p role="status" style={{ margin: 0, padding: "12px clamp(16px,4vw,32px)", background: "rgba(4,164,155,.12)", color: "#036b66", fontSize: 14, fontWeight: 600 }}>
          {message}
        </p>
      )}

      <div style={{ padding: "clamp(16px,3vw,28px)", display: "flex", flexDirection: "column", gap: 20 }}>
        <KlubMailsEnErreur version={version} notifier={notifier} rafraichir={rafraichir} />
        {onglet === "seances" ? (
          <KlubSeances version={version} notifier={notifier} rafraichir={rafraichir} />
        ) : (
          <KlubCreneaux version={version} notifier={notifier} rafraichir={rafraichir} />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Mettre à jour le commentaire de `app/admin/mugi-klub/page.tsx`**

Remplacer le bloc de commentaire au-dessus de `export default function AdminMugiKlubPage` par :

```tsx
/**
 * Back-office du Mugi Klub.
 *
 * Page publique au sens HTTP : la session Supabase, la RLS des tables klub_*
 * (lecture praticiens) et les contrôles des fonctions klub_admin_* protègent
 * les données. Sans session, seul l'écran de connexion est rendu.
 */
```

- [ ] **Step 8: Vérifier**

Run: `npx tsc --noEmit && npm run lint`
Expected: aucune erreur.

Sur le serveur de dev, ouvrir `/admin/mugi-klub`, se connecter (Lucas saisit lui-même son mot de passe), onglet Créneaux. Créer un créneau « Test créneau », jour de demain, 10 h, 5 places. Expected : message « Créneau enregistré. Les séances à venir sont à jour. »

Outil `execute_sql` : `select count(*) from public.klub_seances s join public.klub_creneaux c on c.id = s.creneau_id where c.titre = 'Test créneau';`
Expected : `4`.

Garder ce créneau pour la Task 18.

- [ ] **Step 9: Commit**

```bash
git add components/admin/klub/styles.ts components/admin/klub/rpc.ts components/admin/klub/ChampsSeanceForm.tsx components/admin/klub/KlubCreneaux.tsx components/admin/klub/KlubSeances.tsx components/admin/klub/KlubMailsEnErreur.tsx components/admin/KlubAdmin.tsx app/admin/mugi-klub/page.tsx
git commit -m "klub : admin des créneaux sur les nouvelles tables

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 18: Admin, séances, inscrits et mails en erreur

**Files:**
- Modify (réécriture complète): `components/admin/klub/KlubSeances.tsx`, `components/admin/klub/KlubMailsEnErreur.tsx`
- Create: `components/admin/klub/KlubSeanceDetail.tsx`

- [ ] **Step 1: Réécrire `components/admin/klub/KlubMailsEnErreur.tsx`**

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { dateHeure } from "@/lib/klub/format";
import type { Mail, TypeMail } from "@/lib/klub/types";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { appeler } from "./rpc";
import { bouton } from "./styles";

type Props = { version: number; notifier: (m: string) => void; rafraichir: () => void };

type Ligne = Mail & {
  klub_seances: { titre: string; debut: string } | null;
  klub_inscriptions: { prenom: string; nom: string } | null;
};

const LIBELLE: Record<TypeMail, string> = {
  confirmation: "Confirmation",
  attente: "Liste d’attente",
  promotion: "Place libérée",
  annulation: "Annulation",
  rappel: "Rappel",
  seance_modifiee: "Séance modifiée",
  seance_annulee: "Séance annulée",
  liste_intervenant: "Liste intervenant",
};

/** Encart visible seulement quand des mails n'ont pas pu partir après trois relances. */
export default function KlubMailsEnErreur({ version, notifier, rafraichir }: Props) {
  const [lignes, setLignes] = useState<Ligne[]>([]);

  const charger = useCallback(async () => {
    const { data, error } = await supabaseBrowser()
      .from("klub_mails")
      .select("*, klub_seances(titre, debut), klub_inscriptions(prenom, nom)")
      .eq("statut", "erreur")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) notifier(`Lecture des mails impossible : ${error.message}`);
    setLignes((data ?? []) as Ligne[]);
  }, [notifier]);

  useEffect(() => {
    const t = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(t);
  }, [charger, version]);

  if (lignes.length === 0) return null;

  const relancer = async (id: string) => {
    const r = await appeler<null>("klub_admin_relancer_mail", { p_id: id });
    if (!r.ok) return notifier(`Relance refusée : ${r.message}`);
    notifier("Mail remis en file : il part dans la minute.");
    rafraichir();
  };

  return (
    <section style={{ background: "rgba(158,68,51,.07)", border: "1px solid rgba(158,68,51,.25)", borderRadius: 16, padding: 16 }}>
      <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: "#9E4433" }}>
        {lignes.length} mail{lignes.length > 1 ? "s" : ""} n’{lignes.length > 1 ? "ont" : "a"} pas pu partir
      </p>
      {lignes.map((l) => (
        <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "8px 0", borderTop: "1px solid rgba(158,68,51,.15)" }}>
          <span style={{ fontSize: 13.5, color: "#003850", flex: 1, minWidth: 240 }}>
            <strong>{LIBELLE[l.type]}</strong>
            {l.klub_seances ? ` · ${l.klub_seances.titre}, ${dateHeure(l.klub_seances.debut)}` : ""}
            {l.klub_inscriptions ? ` · ${l.klub_inscriptions.prenom} ${l.klub_inscriptions.nom}` : ""}
            {l.derniere_erreur && (
              <span style={{ display: "block", fontSize: 12, color: "rgba(51,51,52,.55)" }}>{l.derniere_erreur}</span>
            )}
          </span>
          <button type="button" onClick={() => void relancer(l.id)} style={bouton("contour", true)}>
            Relancer
          </button>
        </div>
      ))}
    </section>
  );
}
```

- [ ] **Step 2: Créer `components/admin/klub/KlubSeanceDetail.tsx`**

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { dateHeure, depuisChampDateHeure, rang, versChampDateHeure } from "@/lib/klub/format";
import type { Inscription, ReponseInscription, Seance } from "@/lib/klub/types";
import { supabaseBrowser } from "@/lib/supabase-browser";
import ChampsSeanceForm from "./ChampsSeanceForm";
import { appeler } from "./rpc";
import { bouton, CARTE, CHAMP, LABEL, TITRE_SECTION } from "./styles";

type Props = {
  seanceId: string;
  version: number;
  notifier: (m: string) => void;
  rafraichir: () => void;
  onFermer: () => void;
};

const AJOUT_VIDE = { prenom: "", nom: "", email: "", telephone: "", premiere: false, siComplet: "attente" as "attente" | "forcer" };

const pluriel = (n: number, un: string, plusieurs: string) => (n > 1 ? plusieurs : un);

export default function KlubSeanceDetail({ seanceId, version, notifier, rafraichir, onFermer }: Props) {
  const [seance, setSeance] = useState<Seance | null>(null);
  const [debut, setDebut] = useState("");
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [ajout, setAjout] = useState(AJOUT_VIDE);
  const [occupe, setOccupe] = useState(false);

  const charger = useCallback(async () => {
    const sb = supabaseBrowser();
    const [s, i] = await Promise.all([
      sb.from("klub_seances").select("*").eq("id", seanceId).single(),
      sb.from("klub_inscriptions").select("*").eq("seance_id", seanceId).order("created_at").order("id"),
    ]);
    if (s.error) return notifier(`Lecture impossible : ${s.error.message}`);
    setSeance(s.data as Seance);
    setDebut(versChampDateHeure((s.data as Seance).debut));
    setInscriptions((i.data ?? []) as Inscription[]);
  }, [seanceId, notifier]);

  useEffect(() => {
    const t = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(t);
  }, [charger, version]);

  if (!seance) return <section style={CARTE}>Chargement…</section>;

  const confirmes = inscriptions.filter((i) => i.statut === "confirmee");
  const attente = inscriptions.filter((i) => i.statut === "attente");
  const complet = seance.inscription_requise && seance.capacite !== null && confirmes.length >= seance.capacite;

  const executer = async <T,>(nom: string, args: Record<string, unknown>, succes: (data: T) => string) => {
    setOccupe(true);
    const r = await appeler<T>(nom, args);
    setOccupe(false);
    if (!r.ok) {
      notifier(r.message);
      return false;
    }
    notifier(succes(r.data));
    rafraichir();
    return true;
  };

  const enregistrer = () =>
    executer<{ prevenus: number }>(
      "klub_admin_modifier_seance",
      { p_id: seance.id, p: { ...seance, debut: depuisChampDateHeure(debut) } },
      (d) =>
        d.prevenus > 0
          ? `Séance enregistrée. ${d.prevenus} ${pluriel(d.prevenus, "personne est prévenue", "personnes sont prévenues")} par mail.`
          : "Séance enregistrée.",
    );

  const presence = async (i: Inscription, present: boolean) => {
    const r = await appeler<null>("klub_admin_presence", { p_id: i.id, p_present: present });
    if (!r.ok) return notifier(r.message);
    setInscriptions((l) => l.map((x) => (x.id === i.id ? { ...x, present } : x)));
  };

  const annulerInscription = (i: Inscription) => {
    if (!window.confirm(`Annuler l’inscription de ${i.prenom} ${i.nom} ? La personne reçoit un mail.`)) return;
    void executer("klub_admin_annuler_inscription", { p_id: i.id }, () => "Inscription annulée.");
  };

  const ajouter = async () => {
    const ok = await executer<ReponseInscription>(
      "klub_admin_ajouter",
      {
        p_seance: seance.id,
        p_prenom: ajout.prenom,
        p_nom: ajout.nom,
        p_email: ajout.email,
        p_telephone: ajout.telephone,
        p_premiere: ajout.premiere,
        p_si_complet: ajout.siComplet,
      },
      (d) =>
        d.statut === "confirmee"
          ? "Inscription ajoutée. La personne reçoit le mail de confirmation."
          : `Ajout en liste d’attente (${rang(d.rang ?? 1)}).`,
    );
    if (ok) setAjout(AJOUT_VIDE);
  };

  const annulerSeance = () => {
    const n = confirmes.length + attente.length;
    if (!window.confirm(`Annuler la séance ? ${n} ${pluriel(n, "personne sera prévenue", "personnes seront prévenues")} par mail.`)) return;
    void executer<number>("klub_admin_annuler_seance", { p_id: seance.id }, (d) => `Séance annulée. ${d} ${pluriel(d, "mail part", "mails partent")} dans la minute.`);
  };

  const ligneInscrit = (i: Inscription, enAttente: boolean, position: number) => (
    <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", padding: "8px 0", borderTop: "1px solid rgba(0,56,80,.08)" }}>
      {enAttente ? (
        <span style={{ fontSize: 12.5, fontWeight: 700, color: "rgba(51,51,52,.5)", minWidth: 28 }}>{rang(position)}</span>
      ) : (
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "rgba(51,51,52,.6)" }}>
          <input type="checkbox" checked={i.present} onChange={(e) => void presence(i, e.target.checked)} />
          présent
        </label>
      )}
      <span style={{ flex: 1, minWidth: 180, fontSize: 14, color: "#003850" }}>
        <strong>{i.prenom} {i.nom}</strong>
        {i.premiere_seance && <span style={{ marginLeft: 8, fontSize: 12, color: "#d49a40", fontWeight: 700 }}>première séance</span>}
        {i.origine === "admin" && <span style={{ marginLeft: 8, fontSize: 12, color: "rgba(51,51,52,.45)" }}>ajout manuel</span>}
        <span style={{ display: "block", fontSize: 12.5, color: "rgba(51,51,52,.55)" }}>
          <a href={`tel:${i.telephone}`} style={{ color: "#04A49B" }}>{i.telephone}</a> · {i.email}
        </span>
      </span>
      <button type="button" disabled={occupe} onClick={() => annulerInscription(i)} style={bouton("danger", true)}>
        Annuler
      </button>
    </div>
  );

  return (
    <section style={{ ...CARTE, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#003850" }}>{seance.titre}</p>
          <p style={{ margin: "2px 0 0", fontSize: 13.5, color: "rgba(51,51,52,.6)" }}>
            {dateHeure(seance.debut)}
            {seance.statut === "annulee" && <strong style={{ marginLeft: 8, color: "#9E4433" }}>Annulée</strong>}
            {seance.creneau_id && !seance.modifiee && " · suit son créneau"}
          </p>
        </div>
        <button type="button" onClick={onFermer} style={bouton("contour", true)}>
          Fermer
        </button>
      </div>

      <div>
        <p style={TITRE_SECTION}>
          Inscrits · {confirmes.length}
          {seance.capacite !== null ? ` / ${seance.capacite}` : ""}
        </p>
        {confirmes.length === 0 && <p style={{ margin: 0, fontSize: 13.5, color: "rgba(51,51,52,.55)" }}>Personne pour l’instant.</p>}
        {confirmes.map((i, n) => ligneInscrit(i, false, n + 1))}
      </div>

      {attente.length > 0 && (
        <div>
          <p style={TITRE_SECTION}>Liste d’attente · {attente.length}</p>
          {attente.map((i, n) => ligneInscrit(i, true, n + 1))}
        </div>
      )}

      {seance.statut === "publiee" && seance.inscription_requise && (
        <div>
          <p style={TITRE_SECTION}>Ajouter quelqu’un</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
            {(
              [
                ["prenom", "Prénom"],
                ["nom", "Nom"],
                ["email", "E-mail"],
                ["telephone", "Téléphone"],
              ] as const
            ).map(([cle, libelle]) => (
              <div key={cle}>
                <label style={LABEL} htmlFor={`a-${cle}`}>{libelle}</label>
                <input
                  id={`a-${cle}`}
                  style={CHAMP}
                  value={ajout[cle]}
                  onChange={(e) => {
                    const v = e.target.value;
                    setAjout((a) => ({ ...a, [cle]: v }));
                  }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginTop: 10 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#003850" }}>
              <input
                type="checkbox"
                checked={ajout.premiere}
                onChange={(e) => {
                  const premiere = e.target.checked;
                  setAjout((a) => ({ ...a, premiere }));
                }}
              />
              Première séance
            </label>
            {complet && (
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#003850" }}>
                Séance complète :
                <select
                  style={{ ...CHAMP, width: "auto" }}
                  value={ajout.siComplet}
                  onChange={(e) => {
                    const siComplet = e.target.value as "attente" | "forcer";
                    setAjout((a) => ({ ...a, siComplet }));
                  }}
                >
                  <option value="attente">mettre en liste d’attente</option>
                  <option value="forcer">dépasser la capacité</option>
                </select>
              </label>
            )}
            <button type="button" disabled={occupe} onClick={() => void ajouter()} style={bouton("plein", true)}>
              Ajouter
            </button>
          </div>
        </div>
      )}

      <div>
        <p style={TITRE_SECTION}>Modifier la séance</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ maxWidth: 260 }}>
            <label style={LABEL} htmlFor="s-debut">Date et heure</label>
            <input id="s-debut" type="datetime-local" style={CHAMP} value={debut} onChange={(e) => setDebut(e.target.value)} />
          </div>
          <ChampsSeanceForm valeur={seance} prefixe="s" onChange={(maj) => setSeance((d) => (d ? maj(d) : d))} />
          <p style={{ margin: 0, fontSize: 12.5, color: "rgba(51,51,52,.55)" }}>
            Changer la date, l’heure, la durée ou l’intervenant prévient les inscrits par mail. Une fois modifiée ici, la
            séance ne suit plus son créneau.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" disabled={occupe} onClick={() => void enregistrer()} style={bouton("plein")}>
              Enregistrer la séance
            </button>
            {seance.statut === "publiee" && (
              <button type="button" disabled={occupe} onClick={annulerSeance} style={{ ...bouton("danger"), marginLeft: "auto" }}>
                Annuler la séance
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Réécrire `components/admin/klub/KlubSeances.tsx`**

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { cleJour, dateLongue, depuisChampDateHeure, heure } from "@/lib/klub/format";
import { COULEUR_TYPE, type ChampsSeance, type Seance, type StatutInscription } from "@/lib/klub/types";
import { supabaseBrowser } from "@/lib/supabase-browser";
import ChampsSeanceForm from "./ChampsSeanceForm";
import KlubSeanceDetail from "./KlubSeanceDetail";
import { appeler } from "./rpc";
import { bouton, CARTE, CHAMP, LABEL, TITRE_SECTION } from "./styles";

type Props = { version: number; notifier: (m: string) => void; rafraichir: () => void };

type Ligne = Seance & { klub_inscriptions: { statut: StatutInscription }[] };

const NOUVELLE: ChampsSeance = {
  type: "atelier",
  titre: "",
  description: "",
  intervenant: "",
  intervenant_email: null,
  duree_min: 90,
  capacite: 12,
  prix_libelle: "",
  inscription_requise: true,
};

function remplissage(l: Ligne): string {
  if (!l.inscription_requise) return "Entrée libre";
  const c = l.klub_inscriptions.filter((i) => i.statut === "confirmee").length;
  const a = l.klub_inscriptions.filter((i) => i.statut === "attente").length;
  return `${c}/${l.capacite}${a ? ` · ${a} en attente` : ""}`;
}

export default function KlubSeances({ version, notifier, rafraichir }: Props) {
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [selection, setSelection] = useState<string | null>(null);
  const [creation, setCreation] = useState<ChampsSeance | null>(null);
  const [debut, setDebut] = useState("");
  const [occupe, setOccupe] = useState(false);

  const charger = useCallback(async () => {
    const maintenant = Date.now();
    const { data, error } = await supabaseBrowser()
      .from("klub_seances")
      .select("*, klub_inscriptions(statut)")
      .gte("debut", new Date(maintenant - 6 * 3600_000).toISOString())
      .lt("debut", new Date(maintenant + 29 * 86400_000).toISOString())
      .order("debut");
    if (error) notifier(`Lecture impossible : ${error.message}`);
    setLignes((data ?? []) as Ligne[]);
  }, [notifier]);

  useEffect(() => {
    const t = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(t);
  }, [charger, version]);

  const creer = async () => {
    if (!creation) return;
    if (!debut) return notifier("Indiquez la date et l’heure.");
    setOccupe(true);
    const r = await appeler<string>("klub_admin_creer_seance", { p: { ...creation, debut: depuisChampDateHeure(debut) } });
    setOccupe(false);
    if (!r.ok) return notifier(`Création refusée : ${r.message}`);
    notifier("Séance créée.");
    setCreation(null);
    setDebut("");
    setSelection(r.data);
    rafraichir();
  };

  const parJour = new Map<string, Ligne[]>();
  for (const l of lignes) {
    const cle = cleJour(l.debut);
    parJour.set(cle, [...(parJour.get(cle) ?? []), l]);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,360px) minmax(0,1fr)", gap: 20, alignItems: "start" }}>
      <aside style={{ ...CARTE, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ ...TITRE_SECTION, margin: 0 }}>28 prochains jours</p>
          <button
            type="button"
            onClick={() => {
              setSelection(null);
              setCreation({ ...NOUVELLE });
            }}
            style={bouton("plein", true)}
          >
            Séance ponctuelle
          </button>
        </div>
        {lignes.length === 0 && (
          <p style={{ margin: 0, fontSize: 13.5, color: "rgba(51,51,52,.55)" }}>
            Aucune séance. Créez un créneau hebdomadaire ou une séance ponctuelle.
          </p>
        )}
        {[...parJour.entries()].map(([cle, duJour]) => {
          const libelle = dateLongue(`${cle}T12:00:00Z`);
          return (
            <div key={cle} style={{ marginBottom: 14 }}>
              <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: "#003850" }}>
                {libelle.charAt(0).toUpperCase() + libelle.slice(1)}
              </p>
              {duJour.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    setCreation(null);
                    setSelection(l.id);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 10px",
                    marginBottom: 4,
                    borderRadius: 10,
                    border: "1px solid",
                    borderColor: selection === l.id ? "#04A49B" : "rgba(0,56,80,.1)",
                    background: selection === l.id ? "rgba(4,164,155,.07)" : "transparent",
                    font: "inherit",
                    cursor: "pointer",
                    opacity: l.statut === "annulee" ? 0.5 : 1,
                  }}
                >
                  <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: COULEUR_TYPE[l.type] }} />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#003850", minWidth: 48 }}>{heure(l.debut)}</span>
                  <span style={{ fontSize: 13, color: "#003850", flex: 1, textDecoration: l.statut === "annulee" ? "line-through" : "none" }}>
                    {l.titre}
                  </span>
                  <span style={{ fontSize: 11.5, color: "rgba(51,51,52,.6)", whiteSpace: "nowrap" }}>{remplissage(l)}</span>
                </button>
              ))}
            </div>
          );
        })}
      </aside>

      {selection ? (
        <KlubSeanceDetail
          seanceId={selection}
          version={version}
          notifier={notifier}
          rafraichir={rafraichir}
          onFermer={() => setSelection(null)}
        />
      ) : creation ? (
        <section style={{ ...CARTE, display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#003850" }}>Nouvelle séance ponctuelle</p>
          <div style={{ maxWidth: 260 }}>
            <label style={LABEL} htmlFor="n-debut">Date et heure</label>
            <input id="n-debut" type="datetime-local" style={CHAMP} value={debut} onChange={(e) => setDebut(e.target.value)} />
          </div>
          <ChampsSeanceForm valeur={creation} prefixe="n" onChange={(maj) => setCreation((d) => (d ? maj(d) : d))} />
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" disabled={occupe} onClick={() => void creer()} style={bouton("plein")}>
              {occupe ? "…" : "Créer la séance"}
            </button>
            <button type="button" onClick={() => setCreation(null)} style={bouton("contour")}>
              Fermer
            </button>
          </div>
        </section>
      ) : (
        <section style={CARTE}>
          <p style={{ margin: 0, fontSize: 15, color: "rgba(51,51,52,.6)" }}>
            Choisissez une séance pour voir les inscrits, en ajouter, cocher les présents ou la modifier.
          </p>
        </section>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Vérifier**

Run: `npx tsc --noEmit && npm run lint`
Expected: aucune erreur.

Sur `/admin/mugi-klub`, onglet Séances, avec le « Test créneau » de la Task 17 :
1. Ouvrir la première séance, ajouter `a@example.com` et `b@example.com` (téléphone `0612345678`). Expected : deux lignes dans Inscrits, compteur « 2 / 5 ».
2. Passer les places à 1 et enregistrer. Expected : message « La capacité ne peut pas descendre sous le nombre d’inscrits confirmés. »
3. Passer les places à 2, ajouter `c@example.com`. Expected : sélecteur « Séance complète » visible, ajout en « Liste d’attente (1ʳᵉ) ».
4. Annuler l'inscription de `a@example.com`. Expected : `c@example.com` passe dans Inscrits.
5. Cocher « présent » sur une ligne, recharger la page. Expected : la case reste cochée.
6. Annuler la séance. Expected : confirmation « 2 personnes seront prévenues », puis la ligne barrée à gauche.
7. Créer une séance ponctuelle « Test atelier » dans 10 jours. Expected : elle apparaît et s'ouvre.

Nettoyer avec `execute_sql` :

```sql
delete from public.klub_seances where titre in ('Test créneau', 'Test atelier');
delete from public.klub_creneaux where titre = 'Test créneau';
```

- [ ] **Step 5: Commit**

```bash
git add components/admin/klub/KlubSeances.tsx components/admin/klub/KlubSeanceDetail.tsx components/admin/klub/KlubMailsEnErreur.tsx
git commit -m "klub : admin des séances, des inscrits et des mails en erreur

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 19: Confidentialité, nettoyage et build

**Files:**
- Modify: `lib/institutionnel.ts` (page `confidentialite`)
- Delete: `lib/klub-events.ts`, `components/site/MugiKlubPlanning.tsx`, `components/site/KlubBientot.tsx`

- [ ] **Step 1: Ajouter la section Mugi Klub à la confidentialité**

Dans `lib/institutionnel.ts`, remplacer :

```
  <p style="font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour&nbsp;: 1er juillet 2026</p>
```

par :

```
  <p style="font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour&nbsp;: 15 septembre 2026</p>
```

Puis, juste avant la ligne `  <h2>Durée de conservation</h2>`, insérer :

```html
  <h2>Inscriptions au Mugi Klub</h2>
  <p>Pour vous inscrire à une séance du Mugi Klub, nous vous demandons votre prénom, votre nom, votre adresse e-mail, votre numéro de téléphone et s’il s’agit de votre première séance. Ces informations servent à organiser la séance&nbsp;: confirmer votre place, gérer la liste d’attente, vous envoyer un rappel et vous prévenir d’un changement. Ce traitement répond à votre demande d’inscription.</p>
  <p>Elles sont accessibles à l’équipe Mugitu et à l’intervenant de la séance, qui reçoit la liste des inscrits avec leur téléphone. Les e-mails partent par notre prestataire d’envoi Brevo. Les inscriptions sont supprimées douze mois après la séance. S’inscrire au Klub n’inscrit pas à la lettre Mugitu.</p>
  <p>Vous pouvez annuler une inscription avec le lien reçu par e-mail, et demander l’accès à vos données, leur rectification ou leur suppression en écrivant à <a href="mailto:contact@mugitu-biarritz.fr">contact@mugitu-biarritz.fr</a>.</p>

```

- [ ] **Step 2: Supprimer l'ancien planning**

```bash
git rm lib/klub-events.ts components/site/MugiKlubPlanning.tsx components/site/KlubBientot.tsx
```

- [ ] **Step 3: Vérifier qu'aucun fichier suivi n'y fait encore référence**

Run: `git grep -n "klub-events\|MugiKlubPlanning\|KlubBientot\|klub_events" -- ':!docs'`
Expected : aucune ligne.

- [ ] **Step 4: Build complet**

Run: `npm test && npm run lint && npm run build`
Expected : tests verts, lint propre, build réussi avec les routes `/mugi-klub`, `/mugi-klub/seance/[id]`, `/mugi-klub/annulation`, `/api/klub/inscription`, `/api/klub/annulation`, `/api/klub/tache`.

- [ ] **Step 5: Vérifier la page confidentialité**

Sur le serveur de dev, ouvrir `/confidentialite`.
Expected : section « Inscriptions au Mugi Klub » avant « Durée de conservation », date du 15 septembre 2026.

- [ ] **Step 6: Commit**

```bash
git add lib/institutionnel.ts
git commit -m "klub : confidentialité des inscriptions et retrait de l'ancien planning

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 20: Mise en ligne

Chaque étape qui touche la production attend l'accord explicite de Lucas.

- [ ] **Step 1: Variables Vercel (Lucas)**

Message à Lucas : « Dans Vercel › mugitu-biarritz › Settings › Environment Variables, ajoute :
1. `SUPABASE_SERVICE_ROLE_KEY` (Production et Preview), la clé service_role de Supabase ;
2. `CRON_SECRET` (Production), une valeur aléatoire, par exemple le résultat de `openssl rand -hex 32` ;
3. vérifie que `BREVO_API_KEY` est aussi cochée pour Preview. »
Attendre sa confirmation.

- [ ] **Step 2: Pousser la branche et ouvrir la PR**

```bash
git push -u origin feature/klub-inscriptions
gh pr create --base main --title "Mugi Klub : inscriptions en ligne aux séances" --body "$(cat <<'EOF'
Inscription en ligne aux séances du Mugi Klub, paiement sur place.

- Planning réel des quatre semaines à venir, généré depuis les créneaux hebdomadaires et les séances ponctuelles
- Places comptées en base (verrou par séance), liste d'attente avec promotion automatique à plus de 2 h du début
- Mails Brevo : confirmation avec fichier agenda, attente, place libérée, annulation, rappel la veille, changement, séance annulée, liste des inscrits à l'intervenant
- Admin : créneaux, séances, inscrits, ajout manuel, présence, mails en erreur
- Tarifs corrigés (15 € la séance, 15 € l'essai, 25 € l'essai en duo), page Préparation physique alignée, section confidentialité
- Cron Vercel chaque minute sur /api/klub/tache

Spec : docs/superpowers/specs/2026-09-15-mugi-klub-inscriptions-design.md
Plan : docs/superpowers/plans/2026-09-15-mugi-klub-inscriptions.md

Tests : `npm test`, scénarios `supabase/tests/klub.sql`, `scripts/klub-concurrence.mjs`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3: Vérifier la prévisualisation**

Récupérer l'URL de prévisualisation (`gh pr checks` ou outils Vercel `list_deployments`). Créer une séance témoin « Test prévisualisation » à J+2 depuis l'admin de la prévisualisation. S'inscrire avec l'adresse de Lucas (`lucas.bengosteo@gmail.com`) après son accord.
Expected : écran de confirmation ; mail « Votre place pour « Test prévisualisation »… » reçu avec le fichier `.ics`. Les liens du mail pointent vers la production, où la page d'annulation n'existe pas encore : c'est normal avant la fusion.

`get_runtime_logs` Vercel sur le déploiement : aucune ligne `[klub]` en erreur.

- [ ] **Step 4: Fusion (sur accord de Lucas)**

```bash
gh pr merge --squash --delete-branch
```

- [ ] **Step 5: Parcours complet en production**

Sur `https://www.mugitu-biarritz.fr` après déploiement, avec l'accord de Lucas pour utiliser ses adresses :
1. Admin : séance « Test production » à J+2, 1 place, intervenant `lucas.bengosteo@gmail.com`.
2. Inscription avec `lucas.bengosteo@gmail.com`. Expected : mail de confirmation.
3. Inscription avec une seconde adresse de Lucas (`lucas@mugitu-biarritz.fr`). Expected : écran « 1ʳᵉ sur la liste d’attente », mail d'attente.
4. Clic « Libérer ma place » dans le premier mail, puis bouton. Expected : mail d'annulation à la première adresse, mail « Une place s’est libérée » à la seconde dans la minute.
5. Dans l'admin, avancer la séance à dans 90 minutes. Expected, dans les deux minutes : mail « Changement pour… », rappel, et liste des inscrits à l'intervenant.
6. `get_runtime_logs` : la route `/api/klub/tache` répond `200` chaque minute.

Nettoyer : `delete from public.klub_seances where titre in ('Test prévisualisation', 'Test production');`

- [ ] **Step 6: Supprimer `klub_events` (sur accord de Lucas)**

Ses 15 lignes sont fictives et plus aucun code ne la lit. Outil `apply_migration`, `name: "klub_events_suppression"` :

```sql
drop table public.klub_events;
```

Enregistrer le même contenu dans `supabase/migrations/20260915120300_klub_events_suppression.sql`, puis commit et push sur `main` via une petite PR.

- [ ] **Step 7: Nettoyer le worktree**

```bash
cd /Users/lucas/Desktop/mugitu-biarritz
git worktree remove ../mugitu-biarritz-klub
git switch main && git pull
```

`.env.local` disparaît avec le worktree. Rappeler à Lucas que les vrais créneaux se saisissent maintenant dans l'admin.

