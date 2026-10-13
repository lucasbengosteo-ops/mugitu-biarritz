/**
 * Encaissement d'une séance ou d'un créneau : colonnes posées par la
 * migration du 13 oct. 2026 (`praticien_id` sur `klub_seances` et
 * `klub_creneaux`, table `site_comptes_stripe`), pas encore reprises dans
 * `lib/klub/types.ts` — une autre tâche y travaille en parallèle sur ce
 * chantier. Déclarées ici plutôt que d'y toucher.
 */

export type ChampsEncaissement = { praticien_id: string | null };

export type Compte = { user_id: string; nom: string };

/** Nom d'un compte de l'équipe, par repli sur un extrait de son identifiant. */
export function nomCompte(comptes: Compte[], userId: string | null): string | null {
  if (!userId) return null;
  return comptes.find((c) => c.user_id === userId)?.nom ?? null;
}

export type EtatEncaissement = { visible: true; pret: boolean } | { visible: false };

/**
 * Qui voit l'état du compte Stripe d'un praticien : le gérant, et le
 * praticien pour lui-même — même règle que la RLS de `site_comptes_stripe`
 * (migration `klub_encaissement`). Pour un autre praticien, un non-gérant ne
 * voit rien : ni prêt ni pas prêt, juste invisible.
 */
export function etatEncaissement(args: {
  praticienId: string | null;
  estGerant: boolean;
  userId: string | null;
  comptesPrets: Set<string>;
}): EtatEncaissement {
  if (!args.praticienId) return { visible: true, pret: false };
  if (!args.estGerant && args.praticienId !== args.userId) return { visible: false };
  return { visible: true, pret: args.comptesPrets.has(args.praticienId) };
}

/** La ligne affichée sous le choix du praticien. */
export function ligneEtatEncaissement(etat: EtatEncaissement, nomPraticien: string | null): string {
  if (!etat.visible) return "Paiement sur place si le praticien n’a pas relié de compte Stripe.";
  if (etat.pret) return "Paiement en ligne.";
  if (nomPraticien) return `Paiement sur place : ${nomPraticien} n’a pas relié de compte Stripe.`;
  return "Paiement sur place : aucun praticien n’encaisse cette séance.";
}

/** « 15 », « 12,50 » ou « 15 € » (saisie en euros) → centimes ; vide ou illisible → null. */
export function centimesDepuisTexte(texte: string): number | null {
  // « 15 € » et « 12,50€ » se lisent aussi : on retire le symbole et les espaces.
  const net = texte.replace(/[€\s\u00a0\u202f]/g, "").replace(",", ".");
  if (!net) return null;
  const euros = Number(net);
  if (!Number.isFinite(euros) || euros < 0) return null;
  return Math.round(euros * 100);
}

/** 1500 → « 15 » ; 1250 → « 12,50 » ; null → « » — pour remplir le champ de saisie. */
export function texteDepuisCentimes(centimes: number | null): string {
  if (centimes === null) return "";
  const euros = centimes / 100;
  return Number.isInteger(euros) ? String(euros) : euros.toFixed(2).replace(".", ",");
}
