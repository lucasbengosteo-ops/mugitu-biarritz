import Stripe from "stripe";

/**
 * Stripe, côté serveur seulement. Les paiements sont « directs » : la session
 * est créée sur le compte Stripe du praticien (en-tête Stripe-Account), qui
 * est le vendeur. Mugitu ne prend aucune part.
 *
 * La clé vit dans STRIPE_SECRET_KEY, posée par Lucas dans Vercel. Sans elle,
 * chaque appel lève une erreur claire ; le build n'en dépend pas.
 */

let client: Stripe | null = null;

export function stripe(): Stripe {
  if (typeof window !== "undefined") throw new Error("[stripe] appelé depuis le navigateur");
  const cle = process.env.STRIPE_SECRET_KEY?.trim();
  if (!cle) throw new Error("[stripe] STRIPE_SECRET_KEY absente");
  client ??= new Stripe(cle);
  return client;
}

export function etatCompte(c: Stripe.Account): "pret" | "verification" {
  return c.charges_enabled && c.details_submitted ? "pret" : "verification";
}

export async function creerSessionPaiement(p: {
  compte: string;
  inscriptionId: string;
  email: string;
  titre: string;
  montantCentimes: number;
  origine: string;
  jeton: string;
  expireAt: Date;
}): Promise<{ id: string; url: string }> {
  const session = await stripe().checkout.sessions.create(
    {
      mode: "payment",
      customer_email: p.email,
      line_items: [
        {
          quantity: 1,
          price_data: { currency: "eur", unit_amount: p.montantCentimes, product_data: { name: p.titre } },
        },
      ],
      metadata: { inscription_id: p.inscriptionId },
      payment_intent_data: { metadata: { inscription_id: p.inscriptionId } },
      expires_at: Math.floor(p.expireAt.getTime() / 1000),
      success_url: `${p.origine}/mugi-klub/paiement?etat=recu&jeton=${p.jeton}`,
      cancel_url: `${p.origine}/mugi-klub/paiement?etat=abandon&jeton=${p.jeton}`,
    },
    { stripeAccount: p.compte, idempotencyKey: `session-${p.inscriptionId}-${p.expireAt.getTime()}` },
  );
  if (!session.url) throw new Error("[stripe] session sans adresse");
  return { id: session.id, url: session.url };
}

export async function rembourser(p: { compte: string; paiement: string; inscriptionId: string }): Promise<string> {
  const r = await stripe().refunds.create(
    { payment_intent: p.paiement },
    { stripeAccount: p.compte, idempotencyKey: `remboursement-${p.inscriptionId}` },
  );
  return r.id;
}

/**
 * État d'une session de paiement déjà créée : son adresse si elle est encore
 * payable, « payee » si le paiement a abouti (la notification peut ne pas être
 * encore arrivée), null si elle a expiré.
 */
export async function etatSession(compte: string, id: string): Promise<{ url: string } | "payee" | null> {
  const s = await stripe().checkout.sessions.retrieve(id, {}, { stripeAccount: compte });
  if (s.status === "complete") return "payee";
  return s.status === "open" && s.url ? { url: s.url } : null;
}
