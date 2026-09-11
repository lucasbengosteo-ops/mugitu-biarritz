/**
 * Les quatre jeux du Mugitu Hub — Alba Deep Fitness Race 2026.
 *
 * Une seule source pour le formulaire d'inscription, l'outil du stand et le
 * règlement. Le sens du classement est porté par la fonction Postgres
 * `jeux_classement` : il est rappelé ici pour l'affichage, pas recalculé.
 */

export type JeuId = "grip" | "symetrie" | "detente" | "pari";

export type Jeu = {
  id: JeuId;
  nom: string;
  outil: string;
  /** Une ligne, pour la case à cocher. */
  accroche: string;
  /** Pour le règlement : ce qui est mesuré et comment on gagne. */
  regle: string;
  unite: string;
  /** Ce qui gagne : la plus grande valeur, ou la plus petite. */
  gagne: "haut" | "bas";
  /** Étiquette du champ de saisie au stand. */
  champ: string;
};

export const JEUX: Jeu[] = [
  {
    id: "grip",
    nom: "Le Grip",
    outil: "DynaMo Plus",
    accroche: "Serrer la poignée le plus fort possible. Un classement femmes, un classement hommes.",
    regle:
      "Force de préhension mesurée au dynamomètre DynaMo Plus, en kilogrammes. La plus forte valeur l’emporte. Deux classements distincts, femmes et hommes.",
    unite: "kg",
    gagne: "haut",
    champ: "Force (kg)",
  },
  {
    id: "symetrie",
    nom: "La Symétrie",
    outil: "ForceFrame",
    accroche: "La force ne compte pas : le plus équilibré entre ses deux jambes gagne.",
    regle:
      "Poussée de chaque jambe mesurée sur le ForceFrame. Le score est l’écart entre les deux côtés, en pourcentage. Le plus petit écart l’emporte.",
    unite: "%",
    gagne: "bas",
    champ: "Écart droite / gauche (%)",
  },
  {
    id: "detente",
    nom: "La Détente",
    outil: "ForceDecks",
    accroche: "Un saut vertical sur les plaques de force. La hauteur la plus haute gagne.",
    regle:
      "Hauteur d’un saut vertical mesurée sur les plateformes de force ForceDecks, en centimètres. La plus grande hauteur l’emporte.",
    unite: "cm",
    gagne: "haut",
    champ: "Hauteur (cm)",
  },
  {
    id: "pari",
    nom: "Le Pari",
    outil: "avec Hugo Daminato",
    accroche: "Annoncez votre chiffre avant de tester. Le plus proche de son annonce gagne.",
    regle:
      "Le participant annonce le résultat qu’il pense obtenir avant de réaliser l’épreuve. Le score est l’écart entre l’annonce et le résultat mesuré. Le plus petit écart l’emporte.",
    unite: "",
    gagne: "bas",
    champ: "Résultat mesuré",
  },
];

export const jeuParId = (id: string) => JEUX.find((j) => j.id === id);

/** Dossard affiché sur trois chiffres : 7 → « 007 ». */
export const dossard = (n: number) => String(n).padStart(3, "0");

/** Messages lisibles pour les codes levés par les fonctions Postgres. */
export const ERREURS: Record<string, string> = {
  JEUX_REGLEMENT: "Il faut accepter le règlement pour participer.",
  JEUX_INSTAGRAM: "La participation suppose de suivre @mugitu_biarritz sur Instagram.",
  JEUX_EMAIL: "Cette adresse e-mail ne semble pas valide.",
  JEUX_NOM: "Indiquez votre prénom et votre nom.",
  JEUX_CHOIX: "Choisissez au moins un jeu.",
  JEUX_CATEGORIE: "Pour le Grip, précisez le classement : femmes ou hommes.",
  JEUX_ANNONCE: "Pour le Pari, il faut le chiffre annoncé.",
  JEUX_INCONNU: "Aucun participant ne porte ce numéro.",
  JEUX_CLE: "La clé du stand n’est pas valable ou a expiré.",
};

/** Extrait le code JEUX_* d'une réponse d'erreur PostgREST. */
export function codeErreur(corps: unknown): string | null {
  const msg = (corps as { message?: unknown } | null)?.message;
  if (typeof msg !== "string") return null;
  const m = msg.match(/JEUX_[A-Z]+/);
  return m ? m[0] : null;
}
