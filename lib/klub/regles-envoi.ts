import type { Inscription, Mail, Seance } from "./types.ts";

export type MailComplet = Mail & { inscription: Inscription | null; seance: Seance | null };

/**
 * Un mail mis en file peut perdre son sens avant de partir : place annulée
 * entre-temps, séance supprimée… On le vérifie au dernier moment.
 */
export function doitPartir(m: MailComplet, maintenant: Date): boolean {
  const s = m.seance;
  if (!s) return false;
  const i = m.inscription;
  const aVenir = new Date(s.debut) > maintenant;
  switch (m.type) {
    case "confirmation":
    case "promotion":
    case "rappel":
      return !!i && i.statut === "confirmee" && s.statut === "publiee" && aVenir;
    case "attente":
      return !!i && i.statut === "attente" && s.statut === "publiee" && aVenir;
    case "annulation":
      return !!i && i.statut === "annulee";
    case "seance_modifiee":
      return !!i && i.statut !== "annulee" && s.statut === "publiee" && aVenir;
    case "seance_annulee":
      return !!i && s.statut === "annulee";
    case "liste_intervenant":
      return s.statut === "publiee" && !!s.intervenant_email && aVenir;
  }
}

/** Adresses des scénarios SQL et du script de concurrence : jamais envoyées. */
export function adresseDeTest(email: string): boolean {
  return /@example\.(com|org|net)$/i.test(email);
}

/**
 * Minutes avant la tentative suivante, ou `null` pour marquer le mail en
 * erreur. `tentatives` compte l'envoi qui vient d'échouer.
 */
export function delaiNouvelleTentative(tentatives: number): number | null {
  return [1, 5, 15][tentatives - 1] ?? null;
}
