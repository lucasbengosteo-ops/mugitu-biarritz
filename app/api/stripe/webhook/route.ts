import { revalidatePath } from "next/cache";
import { after, NextResponse } from "next/server";
import type Stripe from "stripe";
import { envoyerFile } from "@/lib/klub/envoi";
import { ROUTES } from "@/lib/routes";
import { etatCompte, stripe } from "@/lib/stripe";
import { rpcService } from "@/lib/supabase-service";

/**
 * POST /api/stripe/webhook — les notifications des comptes reliés (Connect).
 * La signature est vérifiée avant toute lecture. Chaque traitement est
 * idempotent en base : Stripe peut renvoyer un événement.
 */

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    console.error("[stripe] STRIPE_WEBHOOK_SECRET absente");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  const signature = request.headers.get("stripe-signature");
  const corps = await request.text();
  let evt: Stripe.Event;
  try {
    evt = stripe().webhooks.constructEvent(corps, signature ?? "", secret);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    switch (evt.type) {
      case "checkout.session.completed": {
        const s = evt.data.object;
        if (s.payment_status !== "paid" || typeof s.payment_intent !== "string") break;
        const r = await rpcService<string>("klub_paiement_confirme", {
          p_session: s.id,
          p_paiement: s.payment_intent,
          p_montant: s.amount_total ?? 0,
        });
        if (!r.ok) throw new Error(`klub_paiement_confirme ${r.status}`);
        revalidatePath(ROUTES.klub);
        after(() => envoyerFile(10));
        break;
      }
      case "checkout.session.expired": {
        const r = await rpcService<number>("klub_paiements_expirer", {});
        if (!r.ok) throw new Error(`klub_paiements_expirer ${r.status}`);
        break;
      }
      case "account.updated": {
        const c = evt.data.object;
        const r = await rpcService<null>("site_compte_stripe_etat", { p_compte: c.id, p_etat: etatCompte(c) });
        if (!r.ok) throw new Error(`site_compte_stripe_etat ${r.status}`);
        break;
      }
      case "charge.refunded": {
        const ch = evt.data.object;
        const remb = ch.refunds?.data?.[0]?.id ?? null;
        if (typeof ch.payment_intent === "string" && ch.refunded) {
          const r = await rpcService<null>("klub_paiement_rembourse", { p_paiement: ch.payment_intent, p_remboursement: remb });
          if (!r.ok) throw new Error(`klub_paiement_rembourse ${r.status}`);
        }
        break;
      }
    }
  } catch (e) {
    // 500 : Stripe renverra l'événement plus tard.
    console.error("[stripe] traitement en échec", evt.type, e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
