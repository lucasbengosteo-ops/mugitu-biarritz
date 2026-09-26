import type { MomentId, SalleId } from "./salles.ts";

export type StatutVoeu = "propose" | "valide" | "refuse" | "retrait_demande";

export type Voeu = {
  id: string;
  user_id: string;
  salle: SalleId | string;
  jour: number;
  moment: MomentId | string;
  statut: StatutVoeu;
  decide_par: string | null;
  decide_le: string | null;
};

export type Commentaire = {
  id: string;
  voeu_id: string;
  auteur_id: string;
  texte: string;
  created_at: string;
};

/** Prénom et nom d'un compte, pour nommer les cases. */
export type Personne = { id: string; nom: string };

export type Absence = {
  id: string;
  user_id: string;
  /** `AAAA-MM-JJ`, comme le renvoie Postgres pour un `date`. */
  du: string;
  au: string;
  motif: string | null;
};

export type Exception = {
  id: string;
  /** `AAAA-MM-JJ` : une date réelle, pas un jour de la semaine. */
  jour: string;
  salle: string;
  moment: string;
  user_id: string;
  echange_id: string | null;
};

export type StatutEchange = "propose" | "accepte_pair" | "refuse_pair" | "valide" | "refuse" | "annule";

export type Echange = {
  id: string;
  demandeur_id: string;
  voeu_cible_id: string;
  voeu_offert_id: string | null;
  portee: "ponctuel" | "definitif";
  /** Le lundi de la semaine concernée, `null` pour un définitif. */
  semaine: string | null;
  motif: string;
  statut: StatutEchange;
  pair_le: string | null;
  decide_par: string | null;
  decide_le: string | null;
  created_at: string;
};
