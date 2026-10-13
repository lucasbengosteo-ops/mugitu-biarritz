import { libellePrix } from "./paiement.ts";

/**
 * Préparation individuelle du Klub (spec du 13 oct. 2026, partie 3).
 * Pur, sans alias : lu tel quel par `node --test`.
 */

export const TYPES_INDIVIDUELS = new Set(["individuel", "bilan"] as const);

type Prix = { prix_centimes: number | null; prix_duo_centimes: number | null };

/** Montant d'une réservation ; null si le choix n'est pas proposé ou si la séance n'a pas de prix. */
export function montantReservation(p: Prix, aDeux: boolean): number | null {
  if (aDeux) return p.prix_duo_centimes === null ? null : 2 * p.prix_duo_centimes;
  return p.prix_centimes;
}

export function libelleTarifs(p: Prix): string {
  if (p.prix_centimes === null) return "";
  const seul = `${libellePrix(p.prix_centimes)} la séance`;
  return p.prix_duo_centimes === null ? seul : `${seul} · ${libellePrix(p.prix_duo_centimes)} par personne à deux`;
}

type SeanceMin = Prix & { id: string; intervenant: string; type: string; debut: string };

export type Preparateur<S extends SeanceMin> = { intervenant: string; seances: S[]; tarifs: Prix | null };

/**
 * Regroupe les créneaux individuels et bilans par intervenant. Ordre : le
 * préparateur dont le prochain créneau arrive le plus tôt d'abord. Les
 * tarifs affichés sont ceux de son prochain créneau individuel.
 */
export function preparateurs<S extends SeanceMin>(seances: S[]): Preparateur<S>[] {
  const parNom = new Map<string, S[]>();
  for (const s of [...seances].sort((a, b) => a.debut.localeCompare(b.debut))) {
    if (!TYPES_INDIVIDUELS.has(s.type as "individuel" | "bilan")) continue;
    const cle = s.intervenant.trim();
    if (!cle) continue;
    parNom.set(cle, [...(parNom.get(cle) ?? []), s]);
  }
  return [...parNom].map(([intervenant, liste]) => {
    const ind = liste.find((s) => s.type === "individuel" && s.prix_centimes !== null);
    return {
      intervenant,
      seances: liste,
      tarifs: ind ? { prix_centimes: ind.prix_centimes, prix_duo_centimes: ind.prix_duo_centimes } : null,
    };
  });
}
