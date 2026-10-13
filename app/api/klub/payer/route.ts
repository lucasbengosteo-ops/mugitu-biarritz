import { NextResponse } from "next/server";
import { finSessionPaiement } from "@/lib/klub/paiement";
import { JETON } from "@/lib/klub/validation";
import { creerSessionPaiement } from "@/lib/stripe";
import { rpcService } from "@/lib/supabase-service";

/**
 * GET /api/klub/payer?jeton=…
 *
 * Le lien du mail « Une place s'est libérée » (liste d'attente payante) :
 * une redirection vers Stripe, jamais une page. On réutilise la session déjà
 * créée si elle existe, sinon on en crée une — même logique que la route
 * d'inscription. Un jeton qui ne mène plus à un paiement en attente (expiré,
 * déjà payé, séance dépubliée) renvoie vers la page de retour, `etat=expire`.
 */

export const dynamic = "force-dynamic";

type InfosPaiement = {
  inscription_id: string;
  email: string;
  jeton: string;
  montant_centimes: number;
  expire_at: string;
  session_url: string | null;
  seance_id: string;
  titre: string;
  debut: string;
  compte: string;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const jeton = url.searchParams.get("jeton") ?? "";
  const expire = NextResponse.redirect(`${url.origin}/mugi-klub/paiement?etat=expire`, 303);
  if (!JETON.test(jeton)) return expire;

  try {
    const infosR = await rpcService<InfosPaiement | null>("klub_paiement_infos", { p_inscription: null, p_jeton: jeton });
    if (!infosR.ok) throw new Error(`klub_paiement_infos ${infosR.status}`);
    const infos = infosR.data;
    if (!infos) return expire;

    if (infos.session_url) return NextResponse.redirect(infos.session_url, 303);

    const session = await creerSessionPaiement({
      compte: infos.compte,
      inscriptionId: infos.inscription_id,
      email: infos.email,
      titre: infos.titre,
      montantCentimes: infos.montant_centimes,
      origine: url.origin,
      jeton: infos.jeton,
      expireAt: finSessionPaiement(new Date(), infos.expire_at),
    });
    const sessionR = await rpcService<null>("klub_paiement_session", {
      p_inscription: infos.inscription_id,
      p_compte: infos.compte,
      p_session: session.id,
      p_url: session.url,
    });
    if (!sessionR.ok) throw new Error(`klub_paiement_session ${sessionR.status}`);
    return NextResponse.redirect(session.url, 303);
  } catch (e) {
    console.error("[klub] lien de paiement indisponible", e);
    return expire;
  }
}
