import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { corpusDuSite } from "@/lib/aide/corpus-site";
import { repondre } from "@/lib/aide/repondre";
import type { ReponseAide } from "@/lib/aide/types";
import { lireQuestion } from "@/lib/aide/validation";
import { appelerMistral } from "@/lib/orientation/mistral";
import { rpcService } from "@/lib/supabase-service";

/** POST /api/aide/question : une question pratique → une réponse sourcée. Spec widget § 2. */

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  const q = lireQuestion(await request.json().catch(() => null));
  if (!q) return NextResponse.json({ erreur: "requete" }, { status: 400 });

  const sel = process.env.ORIENTATION_SEL?.trim();
  if (sel) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
    const empreinte = createHash("sha256").update(`${sel}:${ip}`).digest("hex");
    const lim = await rpcService<boolean>("orientation_limiter", { p_empreinte: empreinte, p_max: 20 });
    if (lim.ok && lim.data === false) return NextResponse.json({ erreur: "trop" }, { status: 429 });
  }

  const cle = process.env.MISTRAL_API_KEY?.trim();
  const r = await repondre(q, await corpusDuSite(), cle ? (m) => appelerMistral(m, { cle }) : null);

  const enr = await rpcService<string>("aide_enregistrer", {
    p_question: { type: r.type, sources: r.sources.map((s) => s.lien), page: q.page, consentement: q.consentement },
    p_texte: q.consentement ? q.texte : null,
    p_reponse: q.consentement ? r.texte : null,
  });
  if (!enr.ok) console.error("[aide] enregistrement en échec", enr.status);

  const corps: ReponseAide = { id: enr.ok ? enr.data : null, type: r.type, texte: r.texte, sources: r.sources };
  return NextResponse.json(corps, { headers: { "Cache-Control": "no-store" } });
}
