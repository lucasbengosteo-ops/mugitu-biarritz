/**
 * Envoi de mails transactionnels via l'API Brevo.
 *
 * La clé vit dans `BREVO_API_KEY`, côté serveur uniquement : jamais de
 * préfixe NEXT_PUBLIC_, qui l'exposerait dans le bundle du navigateur.
 * Vercel lit la variable au build : redéployer après tout changement.
 */

/** Doit appartenir au domaine authentifié chez Brevo, sinon DKIM ne signe rien. */
export const EXPEDITEUR = { email: "bonjour@mugitu-biarritz.fr", name: "Mugitu Biarritz" };

export const SITE = "https://mugitu-biarritz.fr";

export function cleBrevo(): string | null {
  const cle = process.env.BREVO_API_KEY;
  return cle && cle.trim() !== "" ? cle.trim() : null;
}

/** Pièce jointe : contenu encodé en base64. */
export type PieceJointe = { name: string; content: string };

export type EnvoiBrevo = {
  a: { email: string; name?: string };
  sujet: string;
  html: string;
  texte: string;
  /** Repérage dans les statistiques Brevo. */
  tags: string[];
  pieces?: PieceJointe[];
};

export type ResultatBrevo = { ok: true } | { ok: false; erreur: string };

export async function envoyerBrevo(e: EnvoiBrevo): Promise<ResultatBrevo> {
  const cle = cleBrevo();
  if (!cle) return { ok: false, erreur: "BREVO_API_KEY absente" };
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": cle, "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: EXPEDITEUR,
        to: [e.a],
        subject: e.sujet,
        htmlContent: e.html,
        textContent: e.texte,
        tags: e.tags,
        ...(e.pieces?.length ? { attachment: e.pieces } : {}),
      }),
    });
    if (!res.ok) return { ok: false, erreur: `Brevo ${res.status} : ${(await res.text()).slice(0, 300)}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, erreur: `Brevo injoignable : ${String(err)}` };
  }
}
