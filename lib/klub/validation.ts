/**
 * Contrôles du formulaire d'inscription. Mêmes règles que `klub__inscrire`
 * en base : ici pour répondre tout de suite, là-bas pour faire foi.
 */

export const EMAIL = /^[^\s@,;]{1,64}@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i;

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Jeton d'annulation : 32 octets en hexadécimal. */
export const JETON = /^[0-9a-f]{64}$/;

export function normaliserTelephone(t: string): string {
  return t.replace(/[\s.()-]/g, "");
}

export type Coordonnees = { prenom: string; nom: string; email: string; telephone: string };

/** Premier problème trouvé, sous forme de code `KLUB_*`, ou `null`. */
export function verifierCoordonnees(c: Coordonnees): string | null {
  if (!c.prenom.trim() || !c.nom.trim()) return "KLUB_NOM";
  if (!EMAIL.test(c.email.trim())) return "KLUB_EMAIL";
  if (!/^\+?[0-9]{9,15}$/.test(normaliserTelephone(c.telephone))) return "KLUB_TELEPHONE";
  return null;
}
