import { NextResponse } from "next/server";
import { rpcService } from "@/lib/supabase-service";

/**
 * GET /api/site/recap, appelée une fois par jour par le cron Vercel.
 *
 * Elle ne compose que : l'envoi reste le travail de /api/agenda/tache, qui
 * vide la file toutes les cinq minutes. Un seul chemin d'envoi, déjà
 * éprouvé, et un mail qui part au plus tard cinq minutes après.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Bilan = { evenements: number; mails: number };

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[recap] CRON_SECRET absente");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const r = await rpcService<Bilan>("site_recap_du_jour", {});
  if (!r.ok) {
    console.error("[recap] composition en échec", r.status, r.corps);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  console.log("[recap]", JSON.stringify(r.data));
  return NextResponse.json({ ok: true, bilan: r.data });
}
