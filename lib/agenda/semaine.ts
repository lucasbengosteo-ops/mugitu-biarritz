import type { Absence } from "./types.ts";

/**
 * Calculs de dates de l'agenda. Purs, sans accès réseau : ce fichier est lu
 * tel quel par les tests `node --test`.
 *
 * Toutes les dates circulent en `AAAA-MM-JJ`, la forme que renvoie et
 * qu'attend Postgres pour un `date`. On compare donc des chaînes, ce qui
 * évite tout décalage de fuseau : construire un `Date` à partir d'une date
 * seule la place à minuit UTC, et l'afficher en heure de Paris la ramène
 * parfois au jour précédent.
 */

const MOIS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

/** La date, en UTC, pour ne dépendre d'aucun fuseau local. */
function versDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

function versIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Le lundi de la semaine qui contient cette date. Dimanche appartient à la semaine commencée la veille. */
export function lundiDe(iso: string): string {
  const d = versDate(iso);
  const jour = d.getUTCDay(); // 0 = dimanche
  const recul = jour === 0 ? 6 : jour - 1;
  d.setUTCDate(d.getUTCDate() - recul);
  return versIso(d);
}

/** La date du jour `jour` (1 = lundi … 5 = vendredi) de la semaine commençant au `lundi` donné. */
export function dateDuJour(lundi: string, jour: number): string {
  const d = versDate(lundi);
  d.setUTCDate(d.getUTCDate() + (jour - 1));
  return versIso(d);
}

/** Décale une semaine de `n` semaines, en avant si `n` est positif. */
export function decalerSemaine(lundi: string, n: number): string {
  const d = versDate(lundi);
  d.setUTCDate(d.getUTCDate() + n * 7);
  return versIso(d);
}

/** Cette personne est-elle absente ce jour-là ? Les bornes de la plage sont incluses. */
export function absentLe(absences: Absence[], userId: string, iso: string): boolean {
  return absences.some((a) => a.user_id === userId && a.du <= iso && iso <= a.au);
}

/** Qui manque au moins un jour de la semaine ouvrée commençant à ce lundi. */
export function personnesAbsentes(absences: Absence[], lundi: string): string[] {
  const vendredi = dateDuJour(lundi, 5);
  const vus = new Set<string>();
  for (const a of absences) {
    // Deux plages se croisent si chacune commence avant que l'autre finisse.
    if (a.du <= vendredi && lundi <= a.au) vus.add(a.user_id);
  }
  return [...vus];
}

/** « 21 – 25 septembre 2026 », ou « 28 septembre – 2 octobre 2026 » à cheval sur deux mois. */
export function libelleSemaine(lundi: string): string {
  const d1 = versDate(lundi);
  const d2 = versDate(dateDuJour(lundi, 5));
  const m1 = MOIS[d1.getUTCMonth()];
  const m2 = MOIS[d2.getUTCMonth()];
  const an = d2.getUTCFullYear();
  if (m1 === m2 && d1.getUTCFullYear() === an) {
    return `${d1.getUTCDate()} – ${d2.getUTCDate()} ${m2} ${an}`;
  }
  return `${d1.getUTCDate()} ${m1} – ${d2.getUTCDate()} ${m2} ${an}`;
}
