import { METIER_DE_SOIN } from "./metiers.ts";
import type { MetierId, MotifId, ZoneId } from "./types.ts";

/**
 * Ce qu'une page d'origine (`?depuis=<slug>`) permet de préremplir. Les
 * pathologies donnent un motif et souvent une zone ; les soins, un métier
 * à mettre en tête.
 */
export type Prerempli = { motif?: MotifId; zone?: ZoneId; metier?: MetierId; slug: string };

const PATHOLOGIES: Record<string, { motif: MotifId; zone?: ZoneId }> = {
  "reeducation-lca": { motif: "reprise", zone: "genou" },
  "tendinopathie-achille": { motif: "douleur", zone: "cheville-pied" },
  pubalgie: { motif: "douleur", zone: "hanche-aine" },
  "entorse-de-cheville": { motif: "douleur", zone: "cheville-pied" },
  "lesion-ischio-jambiers": { motif: "douleur", zone: "cuisse" },
  "periostite-tibiale": { motif: "douleur", zone: "jambe-mollet" },
  "syndrome-rotulien": { motif: "douleur", zone: "genou" },
  epicondylite: { motif: "douleur", zone: "bras-coude-main" },
  "aponevrosite-plantaire": { motif: "douleur", zone: "cheville-pied" },
  "fracture-de-fatigue": { motif: "douleur" },
  "lombalgie-du-sportif": { motif: "douleur", zone: "dos" },
  "epaule-du-surfeur": { motif: "douleur", zone: "epaule" },
};

const SLUG = /^[a-z0-9-]{1,80}$/;

export function prerempli(depuis: string | null | undefined): Prerempli | null {
  if (!depuis || !SLUG.test(depuis)) return null;
  const p = PATHOLOGIES[depuis];
  if (p) return { ...p, slug: depuis };
  const metier = METIER_DE_SOIN[depuis];
  if (metier) return { metier, slug: depuis };
  return null;
}
