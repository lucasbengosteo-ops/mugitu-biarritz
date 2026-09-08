import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./supabase-config";

/**
 * Envoi du mail de confirmation de la newsletter, via l'API transactionnelle
 * de Brevo.
 *
 * Le mail de confirmation est transactionnel, pas commercial : il répond à une
 * action de l'internaute et ne contient aucune promotion. La lettre elle-même
 * partira des campagnes Brevo, sur la liste des adresses confirmées.
 *
 * La clé vit dans `BREVO_API_KEY`, côté serveur uniquement — jamais de préfixe
 * NEXT_PUBLIC_, qui l'exposerait dans le bundle du navigateur.
 */

/** Doit appartenir au domaine authentifié chez Brevo, sinon DKIM ne signe rien. */
export const EXPEDITEUR = { email: "bonjour@mugitu-biarritz.fr", name: "Mugitu Biarritz" };

export const SITE = "https://mugitu-biarritz.fr";

/** Écrit dans les logs si la variable manque, mais ne casse pas l'inscription. */
export function cleBrevo(): string | null {
  const cle = process.env.BREVO_API_KEY;
  return cle && cle.trim() !== "" ? cle.trim() : null;
}

function gabarit(lienConfirmation: string): { html: string; texte: string } {
  const texte = [
    "Bonjour,",
    "",
    "Vous avez demandé à recevoir la lettre Mugitu : les nouveaux articles, le",
    "planning du Mugi Klub et nos rendez-vous, une fois par mois.",
    "",
    "Il reste une étape — confirmez votre inscription :",
    lienConfirmation,
    "",
    "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message :",
    "sans confirmation, aucune lettre ne vous sera envoyée.",
    "",
    "L'équipe Mugitu — 3 avenue Kléber, Biarritz",
  ].join("\n");

  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FDF8F4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FDF8F4;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:16px;padding:36px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
        <tr><td>
          <p style="margin:0 0 22px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">La lettre Mugitu</p>
          <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;font-weight:700;color:#003850;">Confirmez votre inscription</h1>
          <p style="margin:0 0 18px;font-size:15px;line-height:1.65;color:rgba(51,51,52,.8);">
            Vous avez demandé à recevoir les nouveaux articles, le planning du Mugi Klub
            et nos rendez-vous, une fois par mois. Il reste une étape.
          </p>
          <p style="margin:0 0 26px;">
            <a href="${lienConfirmation}" style="display:inline-block;padding:14px 28px;border-radius:999px;background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Confirmer mon inscription</a>
          </p>
          <p style="margin:0 0 22px;font-size:13px;line-height:1.6;color:rgba(51,51,52,.55);">
            Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur&nbsp;:<br>
            <a href="${lienConfirmation}" style="color:#04A49B;word-break:break-all;">${lienConfirmation}</a>
          </p>
          <p style="margin:0;padding-top:20px;border-top:1px solid rgba(0,56,80,.12);font-size:12.5px;line-height:1.6;color:rgba(51,51,52,.5);">
            Vous n'êtes pas à l'origine de cette demande&nbsp;? Ignorez ce message&nbsp;:
            sans confirmation, aucune lettre ne partira.<br><br>
            Mugitu — 3 avenue Kléber, 64200 Biarritz
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return { html, texte };
}

/**
 * Envoie le mail de confirmation. Renvoie `false` sur échec — l'appelant garde
 * l'inscription en base malgré tout : l'adresse est capturée, le mail se
 * relancera. Perdre l'inscription parce que Brevo tousse serait pire.
 */
export async function envoyerConfirmation(email: string, jeton: string): Promise<boolean> {
  const cle = cleBrevo();
  if (!cle) {
    console.error("[newsletter] BREVO_API_KEY absente — aucun mail envoyé");
    return false;
  }

  const lien = `${SITE}/newsletter/confirmation?jeton=${encodeURIComponent(jeton)}`;
  const { html, texte } = gabarit(lien);

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": cle, "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: EXPEDITEUR,
        to: [{ email }],
        subject: "Confirmez votre inscription à la lettre Mugitu",
        htmlContent: html,
        textContent: texte,
        // Repéré dans les statistiques Brevo sans polluer le sujet.
        tags: ["newsletter-confirmation"],
      }),
    });

    if (!res.ok) {
      console.error("[newsletter] Brevo a refusé l'envoi", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[newsletter] Brevo injoignable", e);
    return false;
  }
}

/** Appelle une fonction Postgres exposée en RPC avec la clé publique. */
export async function rpc<T>(nom: string, args: Record<string, unknown>): Promise<T | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${nom}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`[newsletter] rpc ${nom}`, res.status, await res.text());
      return null;
    }
    return (await res.json()) as T;
  } catch (e) {
    console.error(`[newsletter] rpc ${nom} injoignable`, e);
    return null;
  }
}
