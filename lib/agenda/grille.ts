import type { StatutVoeu, Voeu } from "./types.ts";

export type { Voeu } from "./types.ts";

/**
 * Calculs purs de la grille. Aucun accès réseau : ce fichier est lu tel
 * quel par les tests `node --test`.
 *
 * Deux statuts tiennent une case : « valide » et « retrait_demande ». Le
 * second parce qu'une demande de retrait ne libère rien tant qu'elle n'est
 * pas tranchée — sinon la case partirait avant l'arbitrage.
 */

const TIENNENT: StatutVoeu[] = ["valide", "retrait_demande"];
const VIVANTS: StatutVoeu[] = ["propose", "valide", "retrait_demande"];

export type EtatCase = {
  /** Le vœu qui tient la case, s'il y en a un. */
  occupant: Voeu | null;
  /** Les vœux en attente sur cette case. */
  demandes: Voeu[];
  /** Vrai dès que plus d'un vœu vivant vise la case. */
  enConflit: boolean;
};

export function etatCase(voeux: Voeu[], salle: string, jour: number, moment: string): EtatCase {
  const surLaCase = voeux.filter(
    (v) => v.salle === salle && v.jour === jour && v.moment === moment && VIVANTS.includes(v.statut),
  );
  const occupant = surLaCase.find((v) => TIENNENT.includes(v.statut)) ?? null;
  const demandes = surLaCase.filter((v) => v.id !== occupant?.id);
  return { occupant, demandes, enConflit: surLaCase.length > 1 };
}

/** Combien de demi-journées vivantes chacun demande ou tient. */
export function compteurParPersonne(voeux: Voeu[]): Record<string, number> {
  const compte: Record<string, number> = {};
  for (const v of voeux) {
    if (!VIVANTS.includes(v.statut)) continue;
    compte[v.user_id] = (compte[v.user_id] ?? 0) + 1;
  }
  return compte;
}

/** Le vœu de cette personne sur cette case, s'il existe. */
export function voeuDe(voeux: Voeu[], userId: string, salle: string, jour: number, moment: string): Voeu | null {
  return (
    voeux.find(
      (v) => v.user_id === userId && v.salle === salle && v.jour === jour && v.moment === moment,
    ) ?? null
  );
}
