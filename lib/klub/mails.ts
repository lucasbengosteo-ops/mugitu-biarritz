import { dateHeure, dateLongue, heure, rang } from "./format.ts";
import type { Inscription, Seance, TypeMail } from "./types.ts";

/**
 * Gabarits des mails du Klub. Fonctions pures : le contenu est construit au
 * moment de l'envoi, à partir de l'état actuel de la séance.
 */

export const ADRESSE = "3 avenue Kléber, 64200 Biarritz";

export type Contexte = {
  type: TypeMail;
  site: string;
  seance: Seance;
  inscription?: Inscription | null;
  /** Mail `attente` : rang actuel dans la liste. */
  rang?: number | null;
  /** Mail `liste_intervenant`. */
  confirmes?: Inscription[];
  attente?: Inscription[];
};

export type MailCompose = {
  destinataire: { email: string; name?: string };
  sujet: string;
  html: string;
  texte: string;
  ics: boolean;
};

type Bloc = {
  titre: string;
  paragraphes: string[];
  bouton?: { libelle: string; url: string };
  tableauHtml?: string;
  tableauTexte?: string;
};

const echapper = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function habiller(b: Bloc): { html: string; texte: string } {
  const p = (t: string) =>
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:rgba(51,51,52,.8);">${echapper(t)}</p>`;
  const bouton = b.bouton
    ? `<p style="margin:8px 0 26px;"><a href="${echapper(b.bouton.url)}" style="display:inline-block;padding:14px 28px;border-radius:999px;background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">${echapper(b.bouton.libelle)}</a></p>`
    : "";
  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FDF8F4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FDF8F4;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#fff;border-radius:16px;padding:36px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
        <tr><td>
          <p style="margin:0 0 22px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Mugi Klub</p>
          <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;font-weight:700;color:#003850;">${echapper(b.titre)}</h1>
          ${b.paragraphes.map(p).join("\n          ")}
          ${b.tableauHtml ?? ""}
          ${bouton}
          <p style="margin:0;padding-top:20px;border-top:1px solid rgba(0,56,80,.12);font-size:12.5px;line-height:1.6;color:rgba(51,51,52,.5);">
            Mugitu, ${echapper(ADRESSE)}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
  const texte = [
    ...b.paragraphes,
    ...(b.tableauTexte ? [b.tableauTexte] : []),
    ...(b.bouton ? [`${b.bouton.libelle} : ${b.bouton.url}`] : []),
    `Mugitu, ${ADRESSE}`,
  ].join("\n\n");
  return { html, texte };
}

function exiger(i: Inscription | null | undefined, type: TypeMail): Inscription {
  if (!i) throw new Error(`[klub] mail ${type} sans inscription`);
  return i;
}

export function composer(c: Contexte): MailCompose {
  const s = c.seance;
  const quand = dateHeure(s.debut);
  const avec = s.intervenant ? `, avec ${s.intervenant}` : "";
  const prix = s.prix_libelle ? ` : ${s.prix_libelle}` : "";
  const planning = `${c.site}/mugi-klub#planning`;
  const lienAnnulation = (i: Inscription) => `${c.site}/mugi-klub/annulation?jeton=${encodeURIComponent(i.jeton)}`;
  const pour = (i: Inscription) => ({ email: i.email, name: `${i.prenom} ${i.nom}` });

  if (c.type === "liste_intervenant") {
    if (!s.intervenant_email) throw new Error("[klub] liste sans e-mail d'intervenant");
    const confirmes = c.confirmes ?? [];
    const attente = c.attente ?? [];
    const ligne = (i: Inscription) => `${i.prenom} ${i.nom}${i.premiere_seance ? " (première séance)" : ""}`;
    const tableauHtml = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;font-size:14px;color:#003850;border-collapse:collapse;">
${confirmes
  .map(
    (i) =>
      `<tr><td style="padding:8px 0;border-bottom:1px solid rgba(0,56,80,.08);">${echapper(ligne(i))}</td><td style="padding:8px 0;border-bottom:1px solid rgba(0,56,80,.08);text-align:right;"><a href="tel:${echapper(i.telephone)}" style="color:#04A49B;">${echapper(i.telephone)}</a></td></tr>`,
  )
  .join("\n")}
</table>${
      attente.length
        ? `<p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:rgba(51,51,52,.7);">Liste d’attente : ${echapper(attente.map(ligne).join(", "))}</p>`
        : ""
    }`;
    const tableauTexte = [
      ...confirmes.map((i) => `- ${ligne(i)}, ${i.telephone}`),
      ...(attente.length ? [`Liste d’attente : ${attente.map(ligne).join(", ")}`] : []),
    ].join("\n");
    const { html, texte } = habiller({
      titre: `Vos inscrits de ${heure(s.debut)}`,
      paragraphes: [
        s.intervenant ? `Bonjour ${s.intervenant},` : "Bonjour,",
        `Voici la liste pour « ${s.titre} », ${quand} : ${confirmes.length} inscrit${confirmes.length > 1 ? "s" : ""} sur ${s.capacite}.`,
      ],
      tableauHtml,
      tableauTexte,
    });
    return { destinataire: { email: s.intervenant_email }, sujet: `Inscrits pour « ${s.titre} », ${quand}`, html, texte, ics: false };
  }

  const i = exiger(c.inscription, c.type);
  const bonjour = `Bonjour ${i.prenom},`;
  const bloc = ((): { bloc: Bloc; sujet: string; ics: boolean } => {
    switch (c.type) {
      case "confirmation":
        return {
          sujet: `Votre place pour « ${s.titre} », ${quand}`,
          ics: true,
          bloc: {
            titre: "Votre place est réservée",
            paragraphes: [
              bonjour,
              `C’est noté pour « ${s.titre} », le ${quand}${avec}. La séance dure ${s.duree_min} minutes.`,
              `Rendez-vous au ${ADRESSE}. Le paiement se fait sur place${prix}.`,
              "Le fichier joint ajoute la séance à votre agenda.",
              "Si vous ne pouvez plus venir, libérez votre place : une personne en liste d’attente pourra la prendre.",
            ],
            bouton: { libelle: "Libérer ma place", url: lienAnnulation(i) },
          },
        };
      case "attente":
        return {
          sujet: `Liste d’attente pour « ${s.titre} », ${quand}`,
          ics: false,
          bloc: {
            titre: "Vous êtes sur la liste d’attente",
            paragraphes: [
              bonjour,
              `La séance « ${s.titre} » du ${quand} est complète. Vous êtes ${rang(c.rang ?? 1)} sur la liste d’attente.`,
              "Si une place se libère plus de deux heures avant le début, elle vous revient et un second mail vous le confirme.",
              "Si vous ne souhaitez plus attendre, vous pouvez quitter la liste.",
            ],
            bouton: { libelle: "Quitter la liste d’attente", url: lienAnnulation(i) },
          },
        };
      case "promotion":
        return {
          sujet: `Une place s’est libérée pour « ${s.titre} »`,
          ics: true,
          bloc: {
            titre: "Une place s’est libérée",
            paragraphes: [
              bonjour,
              `Une place s’est libérée pour « ${s.titre} », le ${quand}${avec}. Elle est à vous.`,
              `Rendez-vous au ${ADRESSE}. Le paiement se fait sur place${prix}.`,
              "Le fichier joint ajoute la séance à votre agenda.",
              "Si vous ne pouvez plus venir, libérez la place pour la personne suivante.",
            ],
            bouton: { libelle: "Libérer ma place", url: lienAnnulation(i) },
          },
        };
      case "annulation":
        return {
          sujet: `Inscription annulée pour « ${s.titre} »`,
          ics: false,
          bloc: {
            titre: "Inscription annulée",
            paragraphes: [bonjour, `Votre inscription à « ${s.titre} », ${quand}, est annulée.`, "Les autres séances du Klub sont sur le planning."],
            bouton: { libelle: "Voir le planning", url: planning },
          },
        };
      case "rappel":
        return {
          sujet: `Rappel : « ${s.titre} » demain à ${heure(s.debut)}`,
          ics: false,
          bloc: {
            titre: "Rendez-vous demain",
            paragraphes: [
              bonjour,
              `« ${s.titre} » a lieu demain à ${heure(s.debut)}${avec}, au ${ADRESSE}.`,
              `Le paiement se fait sur place${prix}.`,
              "Si vous ne pouvez plus venir, libérez votre place : une personne en liste d’attente pourra la prendre.",
            ],
            bouton: { libelle: "Libérer ma place", url: lienAnnulation(i) },
          },
        };
      case "seance_modifiee": {
        const enAttente = i.statut === "attente";
        return {
          sujet: `Changement pour « ${s.titre} »`,
          ics: !enAttente,
          bloc: {
            titre: "La séance a changé",
            paragraphes: [
              bonjour,
              `« ${s.titre} » a été modifiée. Elle a désormais lieu le ${quand}${avec}, pour ${s.duree_min} minutes.`,
              enAttente ? "Vous restez sur la liste d’attente." : "Votre place est conservée.",
              "Si ce changement ne vous convient pas, vous pouvez vous désinscrire.",
            ],
            bouton: { libelle: enAttente ? "Quitter la liste d’attente" : "Libérer ma place", url: lienAnnulation(i) },
          },
        };
      }
      case "seance_annulee":
        return {
          sujet: `« ${s.titre} » du ${dateLongue(s.debut)} est annulée`,
          ics: false,
          bloc: {
            titre: "Séance annulée",
            paragraphes: [
              bonjour,
              `Nous devons annuler « ${s.titre} », prévue le ${quand}. Vous n’avez rien à faire de votre côté.`,
              "Les prochaines séances sont sur le planning.",
            ],
            bouton: { libelle: "Voir le planning", url: planning },
          },
        };
    }
  })();

  const { html, texte } = habiller(bloc.bloc);
  return { destinataire: pour(i), sujet: bloc.sujet, html, texte, ics: bloc.ics };
}
