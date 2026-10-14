import { couleursParPersonne } from "@/lib/agenda/couleurs";
import { etatCase } from "@/lib/agenda/grille";
import { occupantALaDate, type Occupation } from "@/lib/agenda/occupation";
import { JOURS } from "@/lib/agenda/salles";
import { dateDuJour } from "@/lib/agenda/semaine";
import type { Absence, Exception, Personne, Voeu } from "@/lib/agenda/types";

/**
 * Petits calculs partagés par les vues de l'agenda : la date du jour à
 * Paris, les libellés de dates, l'état complet d'une case à une date, et les
 * couleurs des personnes.
 */

/**
 * La date du jour en heure de Paris, `AAAA-MM-JJ`. Pas en UTC : à 0 h 30 à
 * Paris, `toISOString()` donne encore la veille.
 */
export function aujourdhuiParis(maintenant: Date = new Date()): string {
  const parties = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(maintenant);
  const lire = (type: string) => parties.find((p) => p.type === type)?.value ?? "";
  return `${lire("year")}-${lire("month")}-${lire("day")}`;
}

/** Le lendemain d'une date `AAAA-MM-JJ`. */
export function lendemain(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

const FORMAT_LONG = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const FORMAT_COURT = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });

/** « mardi 14 octobre ». */
export function dateLongue(iso: string): string {
  return FORMAT_LONG.format(new Date(`${iso}T00:00:00Z`));
}

/** « 14 oct. ». */
export function dateCourte(iso: string): string {
  return FORMAT_COURT.format(new Date(`${iso}T00:00:00Z`));
}

/** « Lun », « Mar »… pour la rangée des jours du téléphone. */
export function jourAbrege(jour: number): string {
  return (JOURS[jour - 1] ?? "?").slice(0, 3);
}

/** Le prénom, pour les cases étroites : le premier mot du nom. */
export function prenom(nom: string): string {
  return nom.trim().split(/\s+/)[0] || nom;
}

/** Une teinte de pastille : le fond et la couleur des initiales (4,5:1 au moins). */
export type Couleur = { readonly fond: string; readonly texte: string };

/** Pour une personne absente de l'annuaire : bleu nuit sur gris clair (plus de 10:1). */
export const TEINTE_NEUTRE: Couleur = { fond: "#DCE4E8", texte: "#003850" };

/**
 * Une couleur par personne qui figure dans l'agenda (un vœu, quel que soit
 * son état, ou un échange daté). L'ordre alphabétique des noms décide : la
 * couleur ne bouge pas d'une semaine à l'autre.
 */
export function teintesDeLAgenda(
  voeux: Voeu[],
  exceptions: Exception[],
  personnes: Record<string, Personne>,
): Record<string, Couleur> {
  const ids = new Set<string>();
  for (const v of voeux) ids.add(v.user_id);
  for (const x of exceptions) ids.add(x.user_id);
  return couleursParPersonne([...ids].map((id) => ({ id, nom: personnes[id]?.nom ?? "" })));
}

export function teinteDe(teintes: Record<string, Couleur>, userId: string | null | undefined): Couleur {
  return (userId ? teintes[userId] : undefined) ?? TEINTE_NEUTRE;
}

export type EtatDate = Occupation & {
  date: string;
  /** Vœux en attente sur la case de la semaine type. */
  demandes: number;
  enConflit: boolean;
};

/** Tout ce qu'une case montre à une date : occupant réel, absence, échange, demandes, conflit. */
export function etatALaDate(
  voeux: Voeu[],
  exceptions: Exception[],
  absences: Absence[],
  salle: string,
  jour: number,
  moment: string,
  lundi: string,
): EtatDate {
  const o = occupantALaDate(voeux, exceptions, absences, salle, jour, moment, lundi);
  const e = etatCase(voeux, salle, jour, moment);
  return { ...o, date: dateDuJour(lundi, jour), demandes: e.demandes.length, enConflit: e.enConflit };
}

/** Le nom d'une personne, ou un tiret si l'annuaire ne la connaît pas. */
export function nomDe(personnes: Record<string, Personne>, userId: string | null | undefined): string {
  return (userId ? personnes[userId]?.nom : undefined) ?? "—";
}
