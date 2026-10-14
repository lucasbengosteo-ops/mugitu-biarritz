/**
 * « Par où commencer ? » — les questions, les identifiants et les types
 * partagés par la section de l'accueil (client) et la route serveur.
 * Aucun import : lisible par le navigateur comme par `node --test`.
 */

export const MOTIFS = [
  { id: "douleur", label: "Une douleur ou une blessure" },
  { id: "reprise", label: "Reprendre le sport après une blessure" },
  { id: "performance", label: "Préparer une saison, progresser" },
  { id: "mental", label: "Stress, sommeil, mental" },
  { id: "nutrition", label: "Alimentation, poids de forme" },
  { id: "bilan", label: "Un bilan ou un test" },
] as const;
export type MotifId = (typeof MOTIFS)[number]["id"];

export const ZONES = [
  { id: "cou", label: "Cou" },
  { id: "epaule", label: "Épaule" },
  { id: "bras-coude-main", label: "Bras, coude, main" },
  { id: "dos", label: "Dos" },
  { id: "hanche-aine", label: "Hanche, aine" },
  { id: "cuisse", label: "Cuisse" },
  { id: "genou", label: "Genou" },
  { id: "jambe-mollet", label: "Jambe, mollet" },
  { id: "cheville-pied", label: "Cheville, pied" },
  { id: "autre", label: "Autre" },
] as const;
export type ZoneId = (typeof ZONES)[number]["id"];

export const ANCIENNETES = [
  { id: "moins-1-semaine", label: "Moins d’une semaine" },
  { id: "1-6-semaines", label: "Une à six semaines" },
  { id: "plus-6-semaines", label: "Plus de six semaines" },
] as const;
export type AncienneteId = (typeof ANCIENNETES)[number]["id"];

export const SPORTS_CHOIX = [
  { id: "surf", label: "Surf" },
  { id: "rugby", label: "Rugby" },
  { id: "trail-et-course", label: "Trail et course" },
  { id: "danse", label: "Danse" },
  { id: "pelote-basque", label: "Pelote basque" },
  { id: "autre", label: "Autre" },
  { id: "aucun", label: "Aucun" },
] as const;
export type SportChoixId = (typeof SPORTS_CHOIX)[number]["id"];

/** Les signes d'alerte de l'étape 4. À faire relire par Basile. */
export const SIGNES_ALERTE = [
  "Douleur dans la poitrine, essoufflement inhabituel",
  "Après un choc : déformation, ou impossible de poser le pied",
  "Fièvre avec la douleur",
  "Perte de force, fourmillements qui s’étendent, troubles pour uriner",
  "Douleur la nuit, forte, qui ne cède pas",
] as const;

export const METIER_IDS = ["kine", "osteo", "medecin", "psy", "nutrition", "podologie", "prepa"] as const;
export type MetierId = (typeof METIER_IDS)[number];

export const TEXTE_MAX = 500;

/** Ce que le navigateur envoie à `POST /api/orientation`. */
export type Reponses = {
  motif: MotifId;
  zone: ZoneId | null;
  anciennete: AncienneteId | null;
  sport: SportChoixId | null;
  /** Un « oui » à l'étape des signes d'alerte. */
  signes: boolean;
  texte: string;
  /** Slug de la page d'où vient le visiteur (`?depuis=`), ou null. */
  depuis: string | null;
  consentement: boolean;
};

/** La zone et l'ancienneté ne sont demandées que pour ces motifs. */
export function demandeZone(motif: MotifId): boolean {
  return motif === "douleur" || motif === "reprise";
}

/** Les signes d'alerte ne sont demandés que pour une douleur. */
export function demandeSignes(motif: MotifId): boolean {
  return motif === "douleur";
}

export type Lien = { titre: string; lien: string };

export type PraticienCarte = {
  slug: string;
  nom: string;
  role: string;
  photo: string;
  objectPosition: string;
  fiche: string;
  reservation: string;
};

export type MethodeCarte = Lien & { slug: string; acteMedical: boolean };

/** Une carte du résultat, entièrement construite par le serveur. */
export type Carte = {
  metier: MetierId;
  titre: string;
  lien: string;
  pourquoi: string;
  praticiens: PraticienCarte[];
  methodes: MethodeCarte[];
  pages: Lien[];
  klub: Lien[];
};

export type Etat = "suggestions" | "alerte" | "detresse";
export type Source = "ia" | "regles" | "repli";
export type Alerte = "aucune" | "signe" | "mot" | "detresse" | "ia";

/** Ce que renvoie `POST /api/orientation`. */
export type ReponseOrientation = {
  /** Identifiant du parcours enregistré, pour noter un clic ; null si l'enregistrement a échoué. */
  id: string | null;
  etat: Etat;
  cartes: Carte[];
  source: Source;
};
