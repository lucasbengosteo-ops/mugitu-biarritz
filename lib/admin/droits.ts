/**
 * Règles de droits du back-office, côté interface.
 *
 * Elles disent ce que l'écran affiche. La base dit ce qui est possible :
 * les politiques RLS de `articles` et de `practitioner_overrides` refusent
 * tout ce que ces règles masquent. Aucun import : ce fichier est lu tel quel
 * par les tests `node --test`.
 */

export type EtatAcces = "chargement" | "deconnecte" | "pret";

export type Acces = {
  etat: EtatAcces;
  userId: string | null;
  prenom: string;
  estEquipe: boolean;
  estSuperAdmin: boolean;
};

export const ACCES_INITIAL: Acces = {
  etat: "chargement",
  userId: null,
  prenom: "",
  estEquipe: false,
  estSuperAdmin: false,
};

export type Rubrique = {
  href: string;
  label: string;
  groupe: "" | "Contenu" | "Cabinet" | "Super-admin";
  /** Annoncée dans le panneau, pas encore ouverte : chantier de l'agenda. */
  bientot?: boolean;
};

const RUBRIQUES: (Rubrique & { superAdmin?: boolean })[] = [
  { href: "/admin", label: "Tableau de bord", groupe: "" },
  { href: "/admin/actualites", label: "Actualités", groupe: "Contenu" },
  { href: "/admin/mugi-klub", label: "Mugi Klub", groupe: "Contenu" },
  { href: "/admin/agenda", label: "Agenda", groupe: "Cabinet" },
  { href: "/admin/evenements", label: "Événements", groupe: "" },
  { href: "/admin/praticiens", label: "Praticiens", groupe: "Super-admin", superAdmin: true },
];

/** Les rubriques du panneau pour ce compte, dans l'ordre d'affichage. */
export function rubriquesVisibles(a: Acces): Rubrique[] {
  if (!a.estEquipe) return [];
  return RUBRIQUES.filter((r) => !r.superAdmin || a.estSuperAdmin);
}

export function peutModifierArticle(a: Acces, auteurId: string | null): boolean {
  if (!a.estEquipe) return false;
  if (a.estSuperAdmin) return true;
  return auteurId !== null && auteurId === a.userId;
}

export function peutSupprimerArticle(a: Acces, auteurId: string | null): boolean {
  return peutModifierArticle(a, auteurId);
}
