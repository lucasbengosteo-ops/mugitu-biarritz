import { envoyerBrevo } from "@/lib/brevo";
import { restService, rpcService } from "@/lib/supabase-service";
import { habiller } from "./mails";

/**
 * Vide la file `agenda_mails`. Chaque mail est d'abord réservé en base
 * (`agenda_reserver_mails`, qui pose `statut = 'en_cours'` sous
 * `for update skip locked`), ce qui empêche deux exécutions du cron
 * d'envoyer le même mail deux fois.
 */

export type BilanAgenda = { envoyes: number; abandonnes: number; echecs: number };

type MailEnFile = {
  id: string;
  type: string;
  destinataire_email: string;
  sujet: string;
  corps: string;
  tentatives: number;
};

const attendre = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Met à jour un mail, en retentant : un envoyé qui reste « en_cours » repartirait. */
async function marquer(id: string, champs: Record<string, unknown>): Promise<boolean> {
  for (let tentative = 1; tentative <= 3; tentative++) {
    try {
      const r = await restService(`agenda_mails?id=eq.${id}`, { method: "PATCH", corps: champs });
      if (r.ok) return true;
      console.error("[agenda] mise à jour du mail impossible", id, r.status, r.corps);
    } catch (e) {
      console.error("[agenda] mise à jour du mail impossible", id, e);
    }
    if (tentative < 3) await attendre(300);
  }
  return false;
}

export async function envoyerFileAgenda(max = 20): Promise<BilanAgenda> {
  const bilan: BilanAgenda = { envoyes: 0, abandonnes: 0, echecs: 0 };

  let reserve;
  try {
    reserve = await rpcService<MailEnFile[]>("agenda_reserver_mails", { p_max: max });
  } catch (e) {
    console.error("[agenda] réservation impossible", e);
    return bilan;
  }
  if (!reserve.ok) {
    console.error("[agenda] réservation impossible", reserve.status, reserve.corps);
    return bilan;
  }

  for (const m of reserve.data ?? []) {
    const { html, texte } = habiller(m.sujet, m.corps);
    const r = await envoyerBrevo({
      a: { email: m.destinataire_email },
      sujet: m.sujet,
      html,
      texte,
      tags: [`agenda-${m.type}`],
    });

    if (r.ok) {
      await marquer(m.id, { statut: "envoye", envoye_at: new Date().toISOString(), reserve_at: null });
      bilan.envoyes++;
      continue;
    }

    console.error("[agenda] envoi en échec", m.id, m.type, r.erreur);
    if (m.tentatives >= 5) {
      await marquer(m.id, { statut: "abandonne", derniere_erreur: r.erreur, reserve_at: null });
      bilan.abandonnes++;
    } else {
      await marquer(m.id, {
        statut: "erreur",
        derniere_erreur: r.erreur,
        reserve_at: null,
        envoyer_apres: new Date(Date.now() + 5 * 60_000).toISOString(),
      });
      bilan.echecs++;
    }
  }

  return bilan;
}
