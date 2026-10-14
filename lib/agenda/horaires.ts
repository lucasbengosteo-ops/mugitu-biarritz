import type { MomentId } from "./salles.ts";

/**
 * Les heures d'une demi-journée, en heure de Paris.
 *
 * Des repères pour les calendriers abonnés (spec admin UI § 2), pas une
 * règle du cabinet : la grille ne connaît que « matin » et « après-midi ».
 * Les changer ici suffit, le fichier calendrier les relit à chaque appel.
 */
export const HORAIRES: Record<MomentId, { debut: string; fin: string }> = {
  matin: { debut: "08:00", fin: "14:00" },
  aprem: { debut: "14:00", fin: "20:00" },
};
