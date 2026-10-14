import { NextResponse } from "next/server";
import { rpcService } from "@/lib/supabase-service";

/** POST /api/orientation/clic : note le premier clic d'un parcours. Répond toujours 204. */

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export async function POST(request: Request) {
  const b = (await request.json().catch(() => null)) as { id?: unknown; type?: unknown; cible?: unknown } | null;
  if (
    b &&
    typeof b.id === "string" &&
    UUID.test(b.id) &&
    (b.type === "reservation" || b.type === "page") &&
    typeof b.cible === "string" &&
    b.cible.length <= 200
  ) {
    const r = await rpcService<null>("orientation_clic", { p_id: b.id, p_type: b.type, p_cible: b.cible });
    if (!r.ok) console.error("[orientation] clic en échec", r.status);
  }
  return new NextResponse(null, { status: 204 });
}
