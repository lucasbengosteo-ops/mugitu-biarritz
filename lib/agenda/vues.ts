import { etatCase } from "./grille.ts";
import { type Occupation, occupantALaDate } from "./occupation.ts";
import { MOMENTS, SALLES, type MomentId, type SalleId } from "./salles.ts";
import { absentLe, dateDuJour, lundiDe } from "./semaine.ts";
import type { Absence, Exception, Voeu } from "./types.ts";

/**
 * Les vues de l'agenda — « Aujourd'hui », la semaine d'une personne, les
 * créneaux libres — à partir des mêmes couches que `occupation.ts` (vœux,
 * exceptions, absences). Pur, sans accès réseau : lu tel quel par les
 * tests `node --test`.
 */

/** Deux statuts tiennent une case : un retrait demandé ne libère rien tant qu'il n'est pas tranché. */
const TIENNENT = ["valide", "retrait_demande"];

/** 1 = lundi … 7 = dimanche, pour une date `AAAA-MM-JJ` quelconque. */
export function numeroJour(date: string): number {
  const jourSemaine = new Date(`${date}T00:00:00Z`).getUTCDay(); // 0 = dimanche
  return jourSemaine === 0 ? 7 : jourSemaine;
}

export type CasePresence = {
  salle: SalleId | string;
  moment: MomentId | string;
  userId: string | null;
  origine: Occupation["origine"];
  absent: boolean;
};

export type PresenceDuJour = {
  cases: CasePresence[];
  /** Personnes en congé ce jour-là qui tiennent au moins une case de la semaine type. */
  absents: string[];
};

/** Qui tient au moins une case de la semaine type (vœux accordés, toutes dates confondues). */
function titulairesSemaineType(voeux: Voeu[]): string[] {
  const vus = new Set<string>();
  for (const v of voeux) {
    if (TIENNENT.includes(v.statut)) vus.add(v.user_id);
  }
  return [...vus];
}

/** Qui est au cabinet à cette date, salle par salle et moment par moment. */
export function presenceDuJour(
  voeux: Voeu[],
  exceptions: Exception[],
  absences: Absence[],
  date: string,
): PresenceDuJour {
  const lundi = lundiDe(date);
  const jour = numeroJour(date);
  const cases: CasePresence[] = [];
  for (const salle of SALLES) {
    for (const moment of MOMENTS) {
      const o = occupantALaDate(voeux, exceptions, absences, salle.id, jour, moment.id, lundi);
      cases.push({ salle: salle.id, moment: moment.id, userId: o.userId, origine: o.origine, absent: o.absent });
    }
  }
  const absents = titulairesSemaineType(voeux).filter((userId) => absentLe(absences, userId, date));
  return { cases, absents };
}

export type JourPersonne = {
  jour: number;
  date: string;
  matin: { salle: SalleId | string; origine: Occupation["origine"] } | null;
  aprem: { salle: SalleId | string; origine: Occupation["origine"] } | null;
  absent: boolean;
};

/** La semaine d'une personne : où elle est chaque jour, matin et après-midi. */
export function semaineDePersonne(
  userId: string,
  voeux: Voeu[],
  exceptions: Exception[],
  absences: Absence[],
  lundi: string,
): JourPersonne[] {
  const resultat: JourPersonne[] = [];
  for (let jour = 1; jour <= 7; jour++) {
    const date = dateDuJour(lundi, jour);
    let matin: JourPersonne["matin"] = null;
    let aprem: JourPersonne["aprem"] = null;
    let absent = false;
    for (const salle of SALLES) {
      for (const moment of MOMENTS) {
        const o = occupantALaDate(voeux, exceptions, absences, salle.id, jour, moment.id, lundi);
        if (o.userId !== userId) continue;
        if (o.absent) absent = true;
        const info = { salle: salle.id, origine: o.origine };
        if (moment.id === "matin") matin = info;
        else aprem = info;
      }
    }
    resultat.push({ jour, date, matin, aprem, absent });
  }
  return resultat;
}

export type CaseLibre = {
  salle: SalleId | string;
  jour: number;
  moment: MomentId | string;
  date: string;
  /** Les vœux proposés sur cette case, pas encore tranchés. */
  demandes: number;
};

/** Les cases sans occupant de la semaine, avec le compte de demandes en attente sur chacune. */
export function casesLibres(
  voeux: Voeu[],
  exceptions: Exception[],
  absences: Absence[],
  lundi: string,
): CaseLibre[] {
  const resultat: CaseLibre[] = [];
  for (let jour = 1; jour <= 7; jour++) {
    const date = dateDuJour(lundi, jour);
    for (const salle of SALLES) {
      for (const moment of MOMENTS) {
        const o = occupantALaDate(voeux, exceptions, absences, salle.id, jour, moment.id, lundi);
        if (o.userId !== null) continue;
        const { demandes } = etatCase(voeux, salle.id, jour, moment.id);
        resultat.push({ salle: salle.id, jour, moment: moment.id, date, demandes: demandes.length });
      }
    }
  }
  return resultat;
}
