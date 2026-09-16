import { envoyerBrevo, SITE } from "@/lib/brevo";
import { restService, rpcService } from "@/lib/supabase-service";
import { genererIcs } from "./ics";
import { ADRESSE, composer } from "./mails";
import { adresseDeTest, delaiNouvelleTentative, doitPartir, type MailComplet } from "./regles-envoi";
import type { Inscription } from "./types";

/**
 * Vide la file `klub_mails`. Chaque mail est d'abord réservé en base
 * (`klub_reserver_mails`), ce qui empêche l'envoi immédiat d'une route et la
 * tâche planifiée de l'envoyer tous les deux.
 */

export type Bilan = { envoyes: number; abandonnes: number; echecs: number };

async function marquer(id: string, champs: Record<string, unknown>) {
  const r = await restService(`klub_mails?id=eq.${id}`, { method: "PATCH", corps: champs });
  if (!r.ok) console.error("[klub] mise à jour du mail impossible", id, r.status, r.corps);
}

async function abandonner(id: string, bilan: Bilan) {
  await marquer(id, { statut: "abandonne", reserve_at: null });
  bilan.abandonnes++;
}

async function echec(m: MailComplet, erreur: string, bilan: Bilan) {
  console.error("[klub] envoi en échec", m.id, m.type, erreur);
  const delai = delaiNouvelleTentative(m.tentatives);
  await marquer(
    m.id,
    delai === null
      ? { statut: "erreur", reserve_at: null, derniere_erreur: erreur }
      : {
          statut: "a_envoyer",
          reserve_at: null,
          derniere_erreur: erreur,
          envoyer_apres: new Date(Date.now() + delai * 60_000).toISOString(),
        },
  );
  bilan.echecs++;
}

async function traiter(id: string, bilan: Bilan) {
  const lu = await restService<MailComplet[]>(
    `klub_mails?id=eq.${id}&select=*,inscription:klub_inscriptions(*),seance:klub_seances(*)`,
  );
  if (!lu.ok || !lu.data[0]) {
    console.error("[klub] mail illisible", id, lu);
    bilan.echecs++;
    return;
  }
  const m = lu.data[0];
  if (!m.seance || !doitPartir(m, new Date())) return abandonner(id, bilan);
  const seance = m.seance;

  let confirmes: Inscription[] = [];
  let attente: Inscription[] = [];
  let rangActuel: number | null = null;
  if (m.type === "liste_intervenant" || m.type === "attente") {
    const l = await restService<Inscription[]>(
      `klub_inscriptions?seance_id=eq.${seance.id}&statut=in.(confirmee,attente)&order=created_at.asc,id.asc`,
    );
    if (!l.ok) return echec(m, `lecture des inscrits : ${l.status}`, bilan);
    confirmes = l.data.filter((x) => x.statut === "confirmee");
    attente = l.data.filter((x) => x.statut === "attente");
    if (m.type === "attente" && m.inscription) {
      const position = attente.findIndex((x) => x.id === m.inscription?.id);
      rangActuel = position >= 0 ? position + 1 : null;
    }
    if (m.type === "liste_intervenant" && confirmes.length === 0) return abandonner(id, bilan);
  }

  const mail = composer({ type: m.type, site: SITE, seance, inscription: m.inscription, rang: rangActuel, confirmes, attente });
  if (adresseDeTest(mail.destinataire.email)) return abandonner(id, bilan);

  const pieces = mail.ics
    ? [
        {
          name: "mugi-klub.ics",
          content: Buffer.from(
            genererIcs({
              uid: `${seance.id}-${m.inscription?.id ?? "liste"}`,
              debut: seance.debut,
              dureeMin: seance.duree_min,
              titre: `Mugi Klub · ${seance.titre}`,
              description: seance.description,
              lieu: ADRESSE,
              url: `${SITE}/mugi-klub/seance/${seance.id}`,
            }),
          ).toString("base64"),
        },
      ]
    : undefined;

  const r = await envoyerBrevo({
    a: mail.destinataire,
    sujet: mail.sujet,
    html: mail.html,
    texte: mail.texte,
    tags: [`klub-${m.type}`],
    pieces,
  });
  if (!r.ok) return echec(m, r.erreur, bilan);
  await marquer(id, { statut: "envoye", envoye_at: new Date().toISOString(), reserve_at: null, derniere_erreur: null });
  bilan.envoyes++;
}

async function vider(id: string | null, limite: number): Promise<Bilan> {
  const bilan: Bilan = { envoyes: 0, abandonnes: 0, echecs: 0 };
  const r = await rpcService<string[] | null>("klub_reserver_mails", { p_id: id, p_limite: limite });
  if (!r.ok) {
    console.error("[klub] réservation des mails impossible", r.status, r.corps);
    return bilan;
  }
  for (const mailId of r.data ?? []) {
    try {
      await traiter(mailId, bilan);
    } catch (e) {
      // Le mail reste « en_cours » : la tâche le remet en file après 10 minutes.
      console.error("[klub] envoi interrompu", mailId, e);
      bilan.echecs++;
    }
  }
  return bilan;
}

/** Envoie un mail précis, s'il est dû et pas déjà pris. */
export function envoyerMail(id: string): Promise<Bilan> {
  return vider(id, 1);
}

/** Envoie les mails dus, les plus anciens d'abord. */
export function envoyerFile(limite = 50): Promise<Bilan> {
  return vider(null, limite);
}
