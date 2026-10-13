import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { envoyerFile } from "@/lib/klub/envoi";
import { ROUTES } from "@/lib/routes";
import { rembourser } from "@/lib/stripe";
import { rpcService } from "@/lib/supabase-service";

/**
 * GET /api/klub/tache, appelée chaque minute par le cron Vercel (vercel.json).
 * Vercel envoie `Authorization: Bearer <CRON_SECRET>` quand la variable existe.
 * Génère les séances, met en file rappels et listes, purge, expire les
 * réservations de paiement, vide la file de remboursements, puis envoie.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type BilanTache = { generees: number; rappels: number; listes: number; relancees: number; purgees: number };
type ARembourser = { inscription_id: string; compte: string; paiement: string };

/**
 * Vide la file `klub_remboursements_a_faire`, une ligne après l'autre : une
 * erreur Stripe sur l'une n'empêche pas les suivantes. Sans clé Stripe, on ne
 * tente rien (`klub_paiements_expirer` n'en a pas besoin, lui).
 */
async function viderRemboursements(): Promise<{ rembourses: number; echecs: number }> {
  if (!process.env.STRIPE_SECRET_KEY?.trim()) {
    console.error("[klub] STRIPE_SECRET_KEY absente : remboursements de la tâche minute ignorés");
    return { rembourses: 0, echecs: 0 };
  }

  let lignes: ARembourser[] = [];
  try {
    const r = await rpcService<ARembourser[]>("klub_remboursements_a_faire", { p_limite: 10 });
    if (!r.ok) {
      console.error("[klub] lecture des remboursements à faire en échec", r.status, r.corps);
      return { rembourses: 0, echecs: 0 };
    }
    lignes = r.data ?? [];
  } catch (e) {
    console.error("[klub] remboursements à faire injoignables", e);
    return { rembourses: 0, echecs: 0 };
  }

  let rembourses = 0;
  let echecs = 0;
  for (const ligne of lignes) {
    let remboursementId: string | null = null;
    let erreur: string | null = null;
    try {
      remboursementId = await rembourser({
        compte: ligne.compte,
        paiement: ligne.paiement,
        inscriptionId: ligne.inscription_id,
      });
    } catch (e) {
      // Pas de donnée de carte dans un message d'erreur Stripe : seul le
      // message est consigné, jamais rien d'autre de la réponse brute.
      erreur = e instanceof Error ? e.message : "erreur inconnue";
      console.error("[klub] remboursement en échec", ligne.inscription_id, e);
    }
    try {
      const r = await rpcService<null>("klub_remboursement_resultat", {
        p_inscription: ligne.inscription_id,
        p_remboursement: remboursementId,
        p_erreur: erreur,
      });
      if (!r.ok) throw new Error(`klub_remboursement_resultat ${r.status}`);
    } catch (e) {
      console.error("[klub] consignation du remboursement impossible", ligne.inscription_id, e);
    }
    if (remboursementId) rembourses++;
    else echecs++;
  }
  return { rembourses, echecs };
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[klub] CRON_SECRET absente");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let t;
  try {
    t = await rpcService<BilanTache>("klub_tache", {});
  } catch (e) {
    console.error("[klub] tâche injoignable", e);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  if (!t.ok) {
    console.error("[klub] tâche en échec", t.status, t.corps);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  let expirees = 0;
  try {
    const exp = await rpcService<number>("klub_paiements_expirer", {});
    if (exp.ok) expirees = exp.data ?? 0;
    else console.error("[klub] expiration des paiements en échec", exp.status, exp.corps);
  } catch (e) {
    console.error("[klub] expiration des paiements injoignable", e);
  }

  const { rembourses, echecs: echecsRemboursement } = await viderRemboursements();

  const mails = await envoyerFile(20);
  if (t.data.generees > 0 || t.data.purgees > 0 || expirees > 0) revalidatePath(ROUTES.klub);

  return NextResponse.json({
    ok: true,
    ...t.data,
    expirees,
    rembourses,
    echecs_remboursement: echecsRemboursement,
    mails,
  });
}
