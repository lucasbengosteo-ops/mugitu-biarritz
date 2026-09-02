/**
 * Forme commune aux pages de contenu extraites des maquettes : soins,
 * méthodes, pathologies, bilans et sports partagent exactement le même
 * gabarit (hero + corps), seul le contenu change.
 *
 * Le `bodyHtml` est du HTML statique versionné issu du bundle de design,
 * jamais d'une saisie utilisateur — c'est ce qui rend son injection
 * acceptable côté rendu.
 */
export type ContentPage = {
  /** Dernier segment d'URL. */
  slug: string;
  /** Titre du hero — peut contenir un <br> de mise en forme. */
  title: string;
  eyebrow: string;
  /** Chapô du hero (HTML : contient des <strong>). */
  lead: string;
  /** Libellé courant du fil d'Ariane. */
  crumb: string;
  /** Fil d'Ariane, hors élément courant. */
  trail: { label: string; href: string }[];
  /** Destination du bouton « Prendre rendez-vous ». */
  cta: string;
  /**
   * Taille du H1, propre à chaque maquette : les titres courts (« BFR »)
   * montent à 110px, les titres longs (« Rééducation après rupture du
   * LCA… ») descendent à 64px. Extrait page par page, pas déduit.
   */
  titleSize: string;
  titleLineHeight: string;
  bodyHtml: string;
};
