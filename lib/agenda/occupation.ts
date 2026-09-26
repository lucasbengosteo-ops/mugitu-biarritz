import { dateDuJour } from "./semaine.ts";
import type { Absence, Exception, Voeu } from "./types.ts";

/**
 * Qui tient une case à une date donnée.
 *
 * Trois couches, dans cet ordre : l'exception si elle existe pour cette
 * date et cette case, sinon le vœu accordé, et par-dessus l'absence de
 * celui qui tient — qui ne lui retire rien, mais que l'écran signale.
 *
 * Pur, sans accès réseau : lu tel quel par les tests `node --test`.
 */

/** Deux statuts tiennent une case : un retrait demandé ne libère rien tant qu'il n'est pas tranché. */
const TIENNENT = ["valide", "retrait_demande"];

export type Occupation = {
  userId: string | null;
  /** D'où vient l'occupant : une exception datée, la semaine type, ou personne. */
  origine: "exception" | "voeu" | "libre";
  /** L'occupant réel est absent ce jour-là. */
  absent: boolean;
};

export function occupantALaDate(
  voeux: Voeu[],
  exceptions: Exception[],
  absences: Absence[],
  salle: string,
  jour: number,
  moment: string,
  lundi: string,
): Occupation {
  const date = dateDuJour(lundi, jour);

  const exception = exceptions.find(
    (x) => x.jour === date && x.salle === salle && x.moment === moment,
  );
  if (exception) {
    return {
      userId: exception.user_id,
      origine: "exception",
      absent: estAbsent(absences, exception.user_id, date),
    };
  }

  const tenu = voeux.find(
    (v) => v.salle === salle && v.jour === jour && v.moment === moment && TIENNENT.includes(v.statut),
  );
  if (tenu) {
    return { userId: tenu.user_id, origine: "voeu", absent: estAbsent(absences, tenu.user_id, date) };
  }

  return { userId: null, origine: "libre", absent: false };
}

function estAbsent(absences: Absence[], userId: string, date: string): boolean {
  return absences.some((a) => a.user_id === userId && a.du <= date && date <= a.au);
}
