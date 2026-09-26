/**
 * Les cinq salles du cabinet.
 *
 * Écrites à la main, sur le motif de `lib/evenements.ts` : une liste qui
 * change une fois par an ne mérite pas d'écran de gestion. Les noms et les
 * vocations viennent du simulateur `public/mugicoloc.html`, recopiés et non
 * importés — les deux outils n'ont pas à dépendre l'un de l'autre.
 *
 * La vocation n'interdit rien. Dans le modèle de Mugicoloc le podologue
 * n'est admis dans aucune salle, alors qu'il fait partie de l'équipe : le
 * gérant arbitre, un blocage serait redondant.
 */

export const SALLES = [
  { id: "lurra", nom: "Lurra", vocation: "Thérapie manuelle" },
  { id: "airea", nom: "Airea", vocation: "Thérapie manuelle" },
  { id: "etera", nom: "Etera", vocation: "Lab, psy, diététique" },
  { id: "sua", nom: "Sua", vocation: "Médecine du sport, préparation" },
  { id: "ura", nom: "Ura", vocation: "Récupération, massage" },
] as const;

export type SalleId = (typeof SALLES)[number]["id"];

export const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] as const;

/** Samedi et dimanche : le cabinet reçoit, mais l'œil doit trouver le lundi vite. */
export const WEEKEND = [6, 7];
export const MOMENTS = [
  { id: "matin", label: "Matin" },
  { id: "aprem", label: "Après-midi" },
] as const;

export type MomentId = (typeof MOMENTS)[number]["id"];

export function nomSalle(id: string): string {
  return SALLES.find((s) => s.id === id)?.nom ?? id;
}

/** « Sua, mardi matin » — le même libellé que côté base. */
export function libelleCase(salle: string, jour: number, moment: string): string {
  return `${nomSalle(salle)}, ${JOURS[jour - 1]?.toLowerCase() ?? "?"} ${
    moment === "matin" ? "matin" : "après-midi"
  }`;
}
