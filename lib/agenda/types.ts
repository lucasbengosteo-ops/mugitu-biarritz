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
