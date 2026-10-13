import { NextResponse } from "next/server";
import { JETON } from "@/lib/klub/validation";
import { adresseDePaiement } from "@/lib/klub/session-paiement";

/**
 * GET /api/klub/payer?jeton=…
 *
 * Le lien du mail « Une place s'est libérée » (liste d'attente payante) :
 * une redirection vers Stripe, jamais une page. La session déjà créée est
 * réutilisée si Stripe la dit encore ouverte (lib/klub/session-paiement.ts).
 * Un jeton qui ne mène plus à un paiement en attente (expiré, déjà payé,
 * séance dépubliée) renvoie vers la page de retour, `etat=expire`.
 */

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const jeton = url.searchParams.get("jeton") ?? "";
  const expire = NextResponse.redirect(`${url.origin}/mugi-klub/paiement?etat=expire`, 303);
  if (!JETON.test(jeton)) return expire;

  try {
    const adresse = await adresseDePaiement({ jeton }, url.origin);
    return adresse ? NextResponse.redirect(adresse, 303) : expire;
  } catch (e) {
    console.error("[klub] lien de paiement indisponible", e);
    return expire;
  }
}
