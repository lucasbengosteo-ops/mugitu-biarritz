import { NextResponse } from "next/server";
import { envoyerFileAgenda } from "@/lib/agenda/envoi";

/**
 * GET /api/agenda/tache, appelée toutes les cinq minutes par le cron Vercel
 * (vercel.json). Vercel envoie `Authorization: Bearer <CRON_SECRET>`.
 *
 * Route séparée de celle du Klub à dessein : le Klub tourne en production
 * et sa route n'a pas à changer pour l'agenda.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[agenda] CRON_SECRET absente");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const mails = await envoyerFileAgenda(20);
  return NextResponse.json({ ok: true, mails });
}
