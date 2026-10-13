import { NextResponse } from "next/server";
import { appelantEquipe } from "@/lib/admin/session-serveur";
import { creerComptePraticien, etatComptePraticien, lienInscriptionPraticien } from "@/lib/stripe";
import { restService, rpcService } from "@/lib/supabase-service";

/**
 * POST /api/stripe/compte — relier le compte Stripe du praticien qui appelle.
 * GET /api/stripe/compte — synchroniser son état, au retour de Stripe.
 *
 * Compte Accounts v2 réglé comme un compte Standard : le praticien a son propre tableau de bord Stripe, ses
 * virements, ses litiges et ses reçus. Mugitu ne détient ni ne voit ses
 * données bancaires (spec § 2).
 */

export const dynamic = "force-dynamic";

type LigneCompte = { compte: string; etat: "verification" | "pret" };
type Etat = "a_relier" | "verification" | "pret";

const message = "Stripe est indisponible pour le moment. Réessayez dans quelques instants.";

async function ligneCompte(userId: string): Promise<LigneCompte | null> {
  const r = await restService<LigneCompte[]>(`site_comptes_stripe?user_id=eq.${userId}&select=compte,etat`);
  if (!r.ok) throw new Error(`[stripe] site_comptes_stripe illisible (${r.status})`);
  return r.data[0] ?? null;
}

export async function POST(request: Request) {
  const appelant = await appelantEquipe(request);
  if (!appelant) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    let ligne = await ligneCompte(appelant.userId);
    if (!ligne) {
      const compte = await creerComptePraticien({ userId: appelant.userId });
      const r = await rpcService<null>("site_compte_stripe_enregistrer", {
        p_user: appelant.userId,
        p_compte: compte,
        p_etat: "verification",
      });
      if (!r.ok) throw new Error(`[stripe] site_compte_stripe_enregistrer en échec (${r.status})`);
      ligne = { compte, etat: "verification" };
    }

    const origine = new URL(request.url).origin;
    const url = await lienInscriptionPraticien(
      ligne.compte,
      `${origine}/admin/mugi-klub?stripe=retour`,
      `${origine}/admin/mugi-klub?stripe=relancer`,
    );
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    console.error("[stripe] compte : liaison en échec", e);
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}

export async function GET(request: Request) {
  const appelant = await appelantEquipe(request);
  if (!appelant) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    const ligne = await ligneCompte(appelant.userId);
    if (!ligne) return NextResponse.json({ ok: true, etat: "a_relier" satisfies Etat });

    const etat = await etatComptePraticien(ligne.compte);
    const r = await rpcService<null>("site_compte_stripe_etat", { p_compte: ligne.compte, p_etat: etat });
    if (!r.ok) throw new Error(`[stripe] site_compte_stripe_etat en échec (${r.status})`);

    return NextResponse.json({ ok: true, etat: etat satisfies Etat });
  } catch (e) {
    console.error("[stripe] compte : synchronisation en échec", e);
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
