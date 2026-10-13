/**
 * Règles du paiement en ligne du Klub, partagées par le site, l'admin et
 * les mails. La base applique les mêmes chiffres (voir les migrations du
 * 13 oct. 2026) : les changer ici exige de les changer là-bas.
 *
 * Aucun import : lu tel quel par `node --test`.
 */

/** Durée pendant laquelle une place est réservée à qui est en train de payer. */
export const DELAI_RESERVATION_MIN = 35;

/** Durée de la session de paiement Stripe : le minimum accepté par Stripe est 30 min. */
export const DUREE_SESSION_MIN = 31;

/** Durée de garde d'une place proposée à la liste d'attente. */
export const GARDE_ATTENTE_H = 6;

/** Délai sous lequel une annulation par le client n'est plus remboursée. */
export const DELAI_REMBOURSEMENT_H = 24;

export function libellePrix(centimes: number): string {
  if (centimes === 0) return "Gratuit";
  const euros = centimes / 100;
  const texte = Number.isInteger(euros)
    ? String(euros)
    : euros.toFixed(2).replace(".", ",");
  return `${texte} €`;
}

export function prixAffiche(s: { prix_centimes: number | null; prix_libelle: string }): string {
  return s.prix_centimes === null ? s.prix_libelle : libellePrix(s.prix_centimes);
}

export function remboursable(debut: string | Date, maintenant: Date): boolean {
  return new Date(debut).getTime() - maintenant.getTime() > DELAI_REMBOURSEMENT_H * 3_600_000;
}

export function finGardeAttente(maintenant: Date, debut: string | Date): Date {
  const garde = maintenant.getTime() + GARDE_ATTENTE_H * 3_600_000;
  return new Date(Math.min(garde, new Date(debut).getTime()));
}

/**
 * Jusqu'à quand ouvrir la session de paiement Stripe : `DUREE_SESSION_MIN`
 * par défaut, jamais après l'expiration de la réservation si elle est plus
 * proche — sauf à descendre sous les 30 minutes que Stripe exige, où la
 * session dépasse alors la réservation. Un paiement qui arrive après
 * l'expiration de la réservation est traité comme tardif et remboursé
 * (`klub_paiement_confirme`) : ce dépassement est voulu, pas une fuite.
 */
export function finSessionPaiement(maintenant: Date, expireReservation: string | Date): Date {
  const MINIMUM_STRIPE_MS = 30 * 60_000;
  const cible = maintenant.getTime() + DUREE_SESSION_MIN * 60_000;
  const plafond = Math.min(cible, new Date(expireReservation).getTime());
  return new Date(Math.max(plafond, maintenant.getTime() + MINIMUM_STRIPE_MS));
}
