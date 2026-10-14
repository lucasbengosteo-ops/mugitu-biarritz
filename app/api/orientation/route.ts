import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { catalogueDuSite } from "@/lib/orientation/catalogue-site";
import { appelerMistral } from "@/lib/orientation/mistral";
import { orienter } from "@/lib/orientation/orienter";
import type { ReponseOrientation } from "@/lib/orientation/types";
import { lireReponses } from "@/lib/orientation/validation";
import { rpcService } from "@/lib/supabase-service";

/**
 * POST /api/orientation : les réponses du visiteur → une à trois cartes.
 * Spec orientation § 3 et § 4. Rien n'est gardé au nom du visiteur ; le
 * texte ne l'est qu'avec son accord.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const LIMITE_PAR_HEURE = 20;

function empreinte(request: Request, sel: string): string {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
  return createHash("sha256").update(`${sel}:${ip}`).digest("hex");
}

export async function POST(request: Request) {
  const corps = await request.json().catch(() => null);
  const r = lireReponses(corps);
  if (!r) return NextResponse.json({ erreur: "requete" }, { status: 400 });

  const sel = process.env.ORIENTATION_SEL?.trim();
  if (sel) {
    const lim = await rpcService<boolean>("orientation_limiter", { p_empreinte: empreinte(request, sel), p_max: LIMITE_PAR_HEURE });
    if (lim.ok && lim.data === false) return NextResponse.json({ erreur: "trop" }, { status: 429 });
    if (!lim.ok) console.error("[orientation] limite illisible", lim.status);
  } else {
    console.warn("[orientation] ORIENTATION_SEL absente : pas de limite d'appels");
  }

  const cle = process.env.MISTRAL_API_KEY?.trim();
  const cat = await catalogueDuSite();
  const o = await orienter(r, cat, cle ? (m) => appelerMistral(m, { cle }) : null);

  const suggestions = o.cartes.map((c) => ({ metier: c.metier, praticiens: c.praticiens.map((p) => p.slug) }));
  const enr = await rpcService<string>("orientation_enregistrer", {
    p_parcours: {
      motif: r.motif,
      zone: r.zone,
      anciennete: r.anciennete,
      sport: r.sport,
      depuis: r.depuis,
      alerte: o.alerte,
      source: o.source,
      suggestions,
      consentement: r.consentement,
    },
    p_texte: r.consentement && r.texte ? r.texte : null,
  });
  if (!enr.ok) console.error("[orientation] enregistrement en échec", enr.status);

  const reponse: ReponseOrientation = { id: enr.ok ? enr.data : null, etat: o.etat, cartes: o.cartes, source: o.source };
  return NextResponse.json(reponse, { headers: { "Cache-Control": "no-store" } });
}
