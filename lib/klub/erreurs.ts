/** Messages lisibles pour les codes levés par les fonctions Postgres du Klub. */
export const ERREURS: Record<string, string> = {
  KLUB_NOM: "Indiquez votre prénom et votre nom.",
  KLUB_EMAIL: "Cette adresse e-mail ne semble pas valide.",
  KLUB_TELEPHONE: "Ce numéro de téléphone ne semble pas valide.",
  KLUB_SEANCE: "Cette séance n’est plus proposée.",
  KLUB_COMMENCEE: "Cette séance a déjà commencé, les inscriptions sont fermées.",
  KLUB_LIBRE: "Pas besoin de s’inscrire à cette séance : l’entrée est libre.",
  KLUB_DROITS: "Votre compte n’a pas accès à l’admin du Klub.",
  KLUB_CAPACITE: "La capacité ne peut pas descendre sous le nombre d’inscrits confirmés.",
  KLUB_CHAMP: "Un champ est vide ou mal rempli.",
  KLUB_ORIGINE: "Origine d’inscription inconnue.",
  KLUB_CRENEAU: "Ce créneau n’existe plus.",
  KLUB_DOUBLON: "Cette adresse est déjà inscrite à cette séance.",
};

/** Extrait le code KLUB_* d'une réponse d'erreur PostgREST ou supabase-js. */
export function codeErreur(corps: unknown): string | null {
  const msg = (corps as { message?: unknown } | null)?.message;
  if (typeof msg !== "string") return null;
  const m = msg.match(/KLUB_[A-Z]+/);
  return m ? m[0] : null;
}
