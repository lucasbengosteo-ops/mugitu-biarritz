/**
 * Annuaire des événements auxquels Mugitu tient un stand.
 *
 * Écrit à la main : deux entrées aujourd'hui, une ligne à ajouter quand un
 * stand se présente. Un vrai gestionnaire (créer l'événement, ses épreuves,
 * son QR) reste à ouvrir le jour où ça se répète.
 */

export type Evenement = {
  id: string;
  nom: string;
  dates: string;
  /** Vrai quand l'événement est passé : la fiche le dit et range les liens. */
  passe: boolean;
  resume: string;
  liens: { label: string; href: string }[];
  /** Les jeux de l'Alba ont des données à supprimer ; l'Avirun n'en a pas. */
  donnees?: "jeux-alba";
};

export const EVENEMENTS: Evenement[] = [
  {
    id: "alba-2026",
    nom: "Alba Deep Fitness Race 2026",
    dates: "12 et 13 septembre 2026",
    passe: true,
    resume:
      "Stand Mugitu dans la Recovery Area, avec quatre jeux mesurés au matériel VALD et un tirage au sort des lots.",
    liens: [
      { label: "La page des jeux", href: "/jeux" },
      { label: "Le règlement", href: "/jeux/reglement" },
      { label: "L’outil du stand", href: "/jeux/stand" },
      { label: "L’article du compte rendu", href: "/actualites/alba-deep-fitness-race-2026-retour" },
    ],
    donnees: "jeux-alba",
  },
  {
    id: "avirun-2026",
    nom: "Concours Avirun 2K26",
    dates: "2026",
    passe: true,
    resume:
      "Concours relayé sur Instagram : la page publique affiche le nombre de participations, lu sur les commentaires du post. Aucune donnée n’est stockée.",
    liens: [
      { label: "La page du concours", href: "/concours-avirun-2026" },
      { label: "La version basque", href: "/eu/concours-avirun-2026" },
    ],
  },
];

/** Échéance annoncée par le règlement des jeux de l'Alba. */
export const ECHEANCE_JEUX_ALBA = "13 octobre 2026";
