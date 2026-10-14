import { echapper, plier } from "../klub/ics.ts";
import { HORAIRES } from "./horaires.ts";
import { occupantALaDate } from "./occupation.ts";
import { MOMENTS, nomSalle as nomSalleParDefaut, SALLES } from "./salles.ts";
import { dateDuJour, decalerSemaine, lundiDe } from "./semaine.ts";
import type { Absence, Exception, Voeu } from "./types.ts";

/**
 * La présence d'une personne au cabinet, en fichier calendrier (RFC 5545),
 * pour l'abonnement de son agenda personnel (spec admin UI § 2).
 *
 * Fuseau : les heures sont écrites en UTC (suffixe `Z`), calculées depuis
 * l'heure de Paris par la règle européenne du changement d'heure. Pas de
 * bloc `VTIMEZONE` : sa règle écrite à la main serait une seconde source de
 * vérité, que Google, Apple et Outlook interprètent chacun à leur manière,
 * alors qu'un instant UTC n'a qu'une lecture possible et que chaque agenda
 * l'affiche dans le fuseau de son utilisateur. C'est déjà le choix du
 * fichier joint aux mails du Klub (`lib/klub/ics.ts`).
 *
 * Pur, sans accès réseau : lu tel quel par les tests `node --test`.
 */

export const ADRESSE_CABINET = "3 avenue Kléber, 64200 Biarritz";

export type EntreeCalendrier = {
  userId: string;
  voeux: Voeu[];
  exceptions: Exception[];
  absences: Absence[];
  /** `AAAA-MM-JJ` : le fichier part du lundi de la semaine qui contient cette date. */
  depuis: string;
  /** Nombre de semaines couvertes, celle de `depuis` comprise. */
  semaines?: number;
  nomSalle?: (id: string) => string;
  /** Horodatage du fichier (`DTSTAMP`) ; injecté par les tests. */
  maintenant?: Date;
};

const HEURE = 3_600_000;

/** Le dernier dimanche d'un mois (1 = janvier), en jour du mois. */
function dernierDimanche(an: number, mois: number): number {
  const dernier = new Date(Date.UTC(an, mois, 0)); // jour 0 du mois suivant
  return dernier.getUTCDate() - dernier.getUTCDay();
}

/**
 * L'heure d'été est-elle en vigueur à Paris à cet instant ? Règle de l'Union
 * européenne depuis 1996 : du dernier dimanche de mars au dernier dimanche
 * d'octobre, à 1 h UTC dans les deux cas.
 */
function heureDEte(instant: number): boolean {
  const an = new Date(instant).getUTCFullYear();
  const debut = Date.UTC(an, 2, dernierDimanche(an, 3), 1);
  const fin = Date.UTC(an, 9, dernierDimanche(an, 10), 1);
  return debut <= instant && instant < fin;
}

/** L'instant UTC d'une heure de Paris (`HH:MM`) à une date (`AAAA-MM-JJ`). */
export function parisVersUtc(date: string, heure: string): Date {
  const [a, m, j] = date.split("-").map(Number);
  const [h, mi] = heure.split(":").map(Number);
  const murale = Date.UTC(a, m - 1, j, h, mi);
  // Essayer UTC+2 d'abord : s'il tombe en heure d'été, c'est le bon. Sinon
  // c'est l'hiver, UTC+1. Les heures du cabinet ne tombent jamais dans
  // l'heure sautée ou répétée du changement (entre 2 h et 3 h du matin).
  const ete = murale - 2 * HEURE;
  return new Date(heureDEte(ete) ? ete : murale - HEURE);
}

const horodatage = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function presenceEnIcs({
  userId,
  voeux,
  exceptions,
  absences,
  depuis,
  semaines = 8,
  nomSalle = nomSalleParDefaut,
  maintenant = new Date(),
}: EntreeCalendrier): string {
  const stamp = horodatage(maintenant);
  const lignes = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mugitu Biarritz//Agenda du cabinet//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Mugitu · ma présence",
    "X-WR-TIMEZONE:Europe/Paris",
    // Une suggestion de rythme de relecture ; chaque agenda garde le sien.
    "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
    "X-PUBLISHED-TTL:PT1H",
  ];

  const premier = lundiDe(depuis);
  for (let s = 0; s < semaines; s++) {
    const lundi = decalerSemaine(premier, s);
    for (let jour = 1; jour <= 7; jour++) {
      const date = dateDuJour(lundi, jour);
      for (const moment of MOMENTS) {
        for (const salle of SALLES) {
          const o = occupantALaDate(voeux, exceptions, absences, salle.id, jour, moment.id, lundi);
          if (o.userId !== userId || o.absent) continue;
          const h = HORAIRES[moment.id];
          lignes.push(
            "BEGIN:VEVENT",
            // Stable d'une lecture à l'autre : l'agenda met à jour au lieu de doubler.
            // La salle en fait partie, au cas où une personne en tiendrait deux à la fois.
            `UID:agenda-${userId}-${date}-${moment.id}-${salle.id}@mugitu-biarritz.fr`,
            `DTSTAMP:${stamp}`,
            `DTSTART:${horodatage(parisVersUtc(date, h.debut))}`,
            `DTEND:${horodatage(parisVersUtc(date, h.fin))}`,
            `SUMMARY:${echapper(`${nomSalle(salle.id)} · cabinet Mugitu`)}`,
            `LOCATION:${echapper(ADRESSE_CABINET)}`,
            "END:VEVENT",
          );
        }
      }
    }
  }

  lignes.push("END:VCALENDAR");
  return lignes.map(plier).join("\r\n") + "\r\n";
}
