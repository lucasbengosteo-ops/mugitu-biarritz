import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { envoyerFile } from "@/lib/klub/envoi";
import { ROUTES } from "@/lib/routes";
import { rpcService } from "@/lib/supabase-service";

/**
 * GET /api/klub/tache, appelée chaque minute par le cron Vercel (vercel.json).
 * Vercel envoie `Authorization: Bearer <CRON_SECRET>` quand la variable existe.
 * Génère les séances, met en file rappels et listes, purge, puis envoie.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type BilanTache = { generees: number; rappels: number; listes: number; relancees: number; purgees: number };

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

  const mails = await envoyerFile(20);
  if (t.data.generees > 0 || t.data.purgees > 0) revalidatePath(ROUTES.klub);

  return NextResponse.json({ ok: true, ...t.data, mails });
}
