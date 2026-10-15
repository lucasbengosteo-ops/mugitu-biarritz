import { NextResponse } from "next/server";
import { rpcService } from "@/lib/supabase-service";

/** POST /api/aide/vote : « Cette réponse vous a aidé ? ». Répond toujours 204. */

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export async function POST(request: Request) {
  const b = (await request.json().catch(() => null)) as { id?: unknown; utile?: unknown } | null;
  if (b && typeof b.id === "string" && UUID.test(b.id) && typeof b.utile === "boolean") {
    const r = await rpcService<null>("aide_vote", { p_id: b.id, p_utile: b.utile });
    if (!r.ok) console.error("[aide] vote en échec", r.status);
  }
  return new NextResponse(null, { status: 204 });
}
