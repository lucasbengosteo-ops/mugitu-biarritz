/**
 * Qui pratique quelle méthode. Écrit à la main d'après les fiches
 * praticien et les pages de méthode ; **à faire valider par Lucas**.
 * Une méthode sans praticien n'est jamais proposée.
 *
 * Vérifié contre les CTA praticien de chaque page `lib/methodes.ts` et,
 * à défaut (emdr, où la page ne nomme personne), contre les spécialités
 * de `lib/fiches-data.ts`. Un écart relevé : la page `clinique-du-coureur`
 * ne met en avant que Julien Blamont, mais la fiche de Baptiste Caparros
 * documente une formation poussée à la méthode (niveau « Expert 2.0 »,
 * plusieurs modules). Il est conservé ici car documenté ; à confirmer par
 * Lucas si la page doit aussi le citer.
 */
export const METHODES_PRATICIENS: Record<string, string[]> = {
  allyane: ["lucas-bengoechea", "jean-baptiste-colombie"],
  bfr: ["jean-baptiste-colombie", "clement-cofourain", "hugo-daminato"],
  "clinique-du-coureur": ["julien-blamont", "baptiste-caparros"],
  "dry-needling": ["lucas-bengoechea", "jean-baptiste-colombie", "clement-cofourain"],
  emdr: ["mailys-bersier"],
  electrostimulation: ["jean-baptiste-colombie", "clement-cofourain", "hugo-daminato"],
  infiltrations: ["basile-carcassonne"],
  mesotherapie: ["basile-carcassonne"],
  "preparation-physique": ["jean-baptiste-colombie", "marine-vignaud", "hugo-daminato", "baptiste-caparros"],
  "testing-vald": [
    "lucas-bengoechea",
    "jean-baptiste-colombie",
    "clement-cofourain",
    "marine-vignaud",
    "hugo-daminato",
  ],
};

/** Actes médicaux : jamais proposés hors de la carte du médecin du sport. */
export const ACTES_MEDICAUX = ["infiltrations", "mesotherapie"] as const;
