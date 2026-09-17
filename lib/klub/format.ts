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
  const debut = new Date(s.debut);
  const fin = new Date(debut.getTime() + s.duree_min * 60_000);
  const now = new Date(maintenant);
  if (now >= fin) return { texte: "Terminée", ton: "passee" };
  if (now >= debut) return { texte: "En cours", ton: "passee" };
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
