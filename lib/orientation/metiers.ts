import { ROUTES } from "../routes.ts";
import type { Lien, MetierId } from "./types.ts";

/**
 * Les sept métiers du cabinet, dans le vocabulaire des filtres de l'équipe
 * (`TEAM_CATEGORIES`), avec leur page. La préparation physique n'a pas de
 * page de soin : elle pointe sur sa page de méthode.
 */
export const METIERS: Record<MetierId, { titre: string; lien: string }> = {
  kine: { titre: "Kinésithérapie du sport", lien: ROUTES.kine },
  osteo: { titre: "Ostéopathie", lien: ROUTES.osteopathie },
  medecin: { titre: "Médecine du sport", lien: ROUTES.medecineSport },
  psy: { titre: "Psychologie du sport", lien: ROUTES.psychologie },
  nutrition: { titre: "Nutrition du sport", lien: ROUTES.nutrition },
  podologie: { titre: "Podologie du sport", lien: ROUTES.podologie },
  prepa: { titre: "Préparation physique", lien: ROUTES.prepaPhysique },
};

/** Pages de soins et de bilans que le catalogue peut citer (slug → lien). */
export const PAGES_SOINS: Record<string, Lien> = {
  "kinesitherapie-du-sport": { titre: "Kinésithérapie du sport", lien: ROUTES.kine },
  "medecine-du-sport": { titre: "Médecine du sport", lien: ROUTES.medecineSport },
  osteopathie: { titre: "Ostéopathie", lien: ROUTES.osteopathie },
  podologie: { titre: "Podologie", lien: ROUTES.podologie },
  psychologie: { titre: "Psychologie", lien: ROUTES.psychologie },
  "nutrition-du-sport": { titre: "Nutrition du sport", lien: ROUTES.nutrition },
  "bilan-pre-saison": { titre: "Bilan pré-saison", lien: "/soins/bilan-pre-saison" },
  "bilan-retour-au-sport": { titre: "Bilan de retour au sport", lien: "/soins/bilan-retour-au-sport" },
  "analyse-de-foulee": { titre: "Analyse de foulée", lien: "/soins/analyse-de-foulee" },
};

/** Le métier qu'une page de soin désigne, pour `?depuis=`. */
export const METIER_DE_SOIN: Record<string, MetierId> = {
  "kinesitherapie-du-sport": "kine",
  "medecine-du-sport": "medecin",
  osteopathie: "osteo",
  podologie: "podologie",
  psychologie: "psy",
  "nutrition-du-sport": "nutrition",
};

/** Le Mugi Klub, proposé avec la préparation physique. */
export const KLUB: Lien[] = [
  { titre: "Préparation individuelle, bilan de 30 minutes offert", lien: ROUTES.klubIndividuel },
  { titre: "Les small groups du Mugi Klub", lien: ROUTES.klub },
];
