/**
 * Types et libellés du Mugi Klub, partagés par le site, l'admin et les mails.
 * Aucun import : ce fichier est lu tel quel par les tests `node --test`.
 */

export type KlubType = "small" | "atelier" | "conf" | "soiree" | "individuel" | "bilan";

export const KLUB_TYPES: { value: KlubType; label: string }[] = [
  { value: "small", label: "Small group" },
  { value: "atelier", label: "Atelier" },
  { value: "conf", label: "Conférence" },
  { value: "soiree", label: "Soirée" },
  { value: "individuel", label: "Séance individuelle" },
  { value: "bilan", label: "Bilan offert" },
];

export const LIBELLE_TYPE: Record<KlubType, string> = {
  small: "Small group",
  atelier: "Atelier",
  conf: "Conférence",
  soiree: "Soirée",
  individuel: "Séance individuelle",
  bilan: "Bilan offert",
};

export const COULEUR_TYPE: Record<KlubType, string> = {
  small: "#04A49B",
  atelier: "#d49a40",
  conf: "#003850",
  soiree: "#EE806C",
  individuel: "#0A556B",
  bilan: "#1F8A5B",
};

/** 1 = lundi … 7 = dimanche, comme `isodow` en Postgres. */
export const KLUB_JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] as const;

/** Champs descriptifs communs au créneau et à la séance. */
export type ChampsSeance = {
  type: KlubType;
  titre: string;
  description: string;
  intervenant: string;
  intervenant_email: string | null;
  duree_min: number;
  capacite: number | null;
  prix_libelle: string;
  /** Prix saisi en centimes ; `null` tant qu'aucun prix n'est fixé (le libellé libre prévaut alors). */
  prix_centimes: number | null;
  /** Prix par personne à deux, centimes ; permis sur un `individuel` seulement, `null` = duo non proposé. */
  prix_duo_centimes: number | null;
  inscription_requise: boolean;
  /** Quand l'inscription se fait ailleurs : l'adresse, et le texte du bouton. */
  reservation_url: string | null;
  reservation_libelle: string | null;
  /** L'image de la séance, et son point focal en « x% y% ». */
  image: string | null;
  image_focus: string;
};

export type Creneau = ChampsSeance & {
  /** Chaîne vide pour un créneau pas encore enregistré. */
  id: string;
  jour: number;
  /** `HH:MM:SS`, heure de Paris. */
  heure: string;
  actif: boolean;
};

export type Seance = ChampsSeance & {
  id: string;
  creneau_id: string | null;
  debut: string;
  statut: "publiee" | "annulee";
  modifiee: boolean;
};

/** Ce que renvoient `klub_planning` et `klub_seance` : aucune donnée personnelle. */
export type SeancePublique = Omit<ChampsSeance, "intervenant_email"> & {
  id: string;
  debut: string;
  statut: "publiee" | "annulee";
  places_restantes: number | null;
  nb_attente: number;
  /** Vrai quand l'inscription se paie en ligne (prix, praticien et compte Stripe prêt). */
  paiement_en_ligne: boolean;
};

export type StatutInscription = "confirmee" | "attente" | "annulee" | "paiement";

export type Inscription = {
  id: string;
  seance_id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  premiere_seance: boolean;
  statut: StatutInscription;
  present: boolean;
  origine: "site" | "admin";
  jeton: string;
  created_at: string;
  /** Montant réellement dû, en centimes ; `null` hors paiement en ligne. */
  montant_centimes: number | null;
  /** Identifiant Stripe du paiement, une fois reçu. */
  stripe_paiement: string | null;
  /** État du remboursement ; `null` tant qu'aucun n'est dû. */
  remboursement: "a_faire" | "fait" | "erreur" | null;
  /**
   * Jusqu'à quand la place en statut `paiement` est gardée. Ce champ n'est
   * pas dans la carte du plan (étape 1), mais `doitPartir` en a besoin pour
   * savoir si un mail `place_liberee` a encore un sens.
   */
  paiement_expire_at: string | null;
};

export type TypeMail =
  | "confirmation"
  | "attente"
  | "promotion"
  | "annulation"
  | "rappel"
  | "seance_modifiee"
  | "seance_annulee"
  | "liste_intervenant"
  | "place_liberee";

export type Mail = {
  id: string;
  type: TypeMail;
  inscription_id: string | null;
  seance_id: string;
  envoyer_apres: string;
  statut: "a_envoyer" | "en_cours" | "envoye" | "erreur" | "abandonne";
  tentatives: number;
  derniere_erreur: string | null;
  created_at: string;
};

export type ReponseInscription = {
  statut: "confirmee" | "attente" | "paiement";
  rang: number | null;
  mail_id: string | null;
  debut: string;
  titre: string;
  /**
   * `null` pour un doublon déjà confirmé ou en attente, ou un plafond
   * d'adresse atteint : réponse habituelle, sans redirection. Non nul dans
   * tous les autres cas (nouvelle inscription, ou doublon encore `paiement`).
   */
  inscription_id: string | null;
};

export type InfosAnnulation = {
  prenom: string;
  statut: StatutInscription;
  seance: SeancePublique;
  /** Inscription payée en ligne. */
  paye: boolean;
  /** Vrai si l'annulation, prise maintenant, serait remboursée. */
  rembourse_si_annule: boolean;
  /** Montant réellement payé : un duo paie deux places. */
  montant_centimes: number | null;
};
