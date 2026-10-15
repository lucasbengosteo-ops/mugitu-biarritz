/**
 * Le widget d'aide : types partagés par le navigateur et les routes.
 * Aucun import : lisible partout.
 */

/** Un morceau de page que l'IA peut citer. */
export type Passage = {
  /** Identifiant stable, cité par l'IA : « faq-faut-il-une-ordonnance ». */
  id: string;
  titre: string;
  texte: string;
  /** Lien interne vers la page (commence par « / »). */
  lien: string;
};

export const TYPES_REPONSE = ["reponse", "inconnu", "medical", "orientation", "alerte", "detresse"] as const;
export type TypeReponse = (typeof TYPES_REPONSE)[number];

export type Source = { titre: string; lien: string };

/** Un échange précédent, renvoyé pour une question de suivi. */
export type Echange = { question: string; reponse: string };

export const QUESTION_MAX = 500;

/** Ce que le navigateur envoie à `POST /api/aide/question`. */
export type Question = {
  texte: string;
  consentement: boolean;
  /** Le chemin de la page où le widget est ouvert. */
  page: string;
  historique: Echange[];
};

/** Ce que renvoie `POST /api/aide/question`. */
export type ReponseAide = {
  /** Identifiant de la question enregistrée (pour le vote), ou null. */
  id: string | null;
  type: TypeReponse;
  texte: string;
  sources: Source[];
};

export const RUBRIQUES = ["faq", "pathologies", "actualites"] as const;
export type Rubrique = (typeof RUBRIQUES)[number];

/** Un élément de l'onglet Articles. */
export type ArticleAide = {
  rubrique: Rubrique;
  titre: string;
  lien: string;
  /** Pour la FAQ : la réponse entière ; sinon un résumé court. */
  texte: string;
};
