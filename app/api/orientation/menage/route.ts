import { NextResponse } from "next/server";
import { rpcService } from "@/lib/supabase-service";

/**
 * GET /api/orientation/menage, appelée une fois par jour par le cron Vercel.
 *
 * Supprime les textes libres de plus de 90 jours et les compteurs de
 * limitation de plus d'un jour. Sur le modèle de `/api/site/recap`.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Bilan = { textes: number; limites: number };

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[orientation-menage] CRON_SECRET absente");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const r = await rpcService<Bilan>("orientation_menage", {});
  if (!r.ok) {
    console.error("[orientation-menage] ménage en échec", r.status, r.corps);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  console.log("[orientation-menage]", JSON.stringify(r.data));
  return NextResponse.json({ ok: true, bilan: r.data });
}
