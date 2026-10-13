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

/**
 * Le compte Stripe d'un praticien, par l'API Accounts v2 : Stripe refuse la
 * création de comptes v1 pour une nouvelle plateforme (constaté le 13 oct.
 * 2026). Réglages équivalents à l'ancien compte Standard : tableau de bord
 * Stripe complet, frais et litiges à la charge du praticien, paiement par
 * carte. Le praticien est le vendeur ; Mugitu ne prend aucune part.
 */
const VERSION_CREATION_COMPTE = "v2-pays-seul";

export async function creerComptePraticien(p: { userId: string }): Promise<string> {
  const compte = await stripe().v2.core.accounts.create(
    {
      // Le pays seul : Stripe l'exige avant la configuration marchande. Le
      // reste de l'identité (e-mail compris), une plateforme basée en France
      // ne peut le poser que par des jetons de compte : le praticien le saisit
      // lui-même dans l'inscription Stripe.
      identity: { country: "fr" },
      dashboard: "full",
      defaults: { responsibilities: { fees_collector: "stripe", losses_collector: "stripe" } },
      configuration: { merchant: { capabilities: { card_payments: { requested: true } } } },
    },
    // Stripe rejoue pendant 24 h la réponse liée à une clé, erreur comprise :
    // la version dans la clé change à chaque changement de cette requête.
    { idempotencyKey: `compte-${VERSION_CREATION_COMPTE}-${p.userId}` },
  );
  return compte.id;
}

/** Le lien d'inscription Stripe d'un compte, valable quelques minutes et une seule fois. */
export async function lienInscriptionPraticien(compte: string, retour: string, relance: string): Promise<string> {
  const lien = await stripe().v2.core.accountLinks.create({
    account: compte,
    use_case: {
      type: "account_onboarding",
      account_onboarding: { return_url: retour, refresh_url: relance },
    },
  });
  return lien.url;
}

/** Un compte encaisse dès que Stripe a activé le paiement par carte. */
export async function etatComptePraticien(compte: string): Promise<"pret" | "verification"> {
  const c = await stripe().v2.core.accounts.retrieve(compte, { include: ["configuration.merchant"] });
  return c.configuration?.merchant?.capabilities?.card_payments?.status === "active" ? "pret" : "verification";
}

/** État d'un compte lu dans une notification v1 `account.updated`. */
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
  try {
    const r = await stripe().refunds.create(
      { payment_intent: p.paiement },
      { stripeAccount: p.compte, idempotencyKey: `remboursement-${p.inscriptionId}` },
    );
    return r.id;
  } catch (e) {
    // Déjà remboursé en entier (depuis le tableau de bord Stripe du
    // praticien, par exemple) : on retrouve ce remboursement-là plutôt que
    // d'échouer une seconde fois sur la même inscription.
    if (e instanceof Stripe.errors.StripeInvalidRequestError && e.code === "charge_already_refunded") {
      const existants = await stripe().refunds.list({ payment_intent: p.paiement }, { stripeAccount: p.compte });
      if (existants.data[0]) return existants.data[0].id;
    }
    throw e;
  }
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
