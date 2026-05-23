import { NextResponse } from "next/server";

/**
 * GET /api/avirun-participants
 *
 * Renvoie le nombre de participations au concours Avirun 2K26.
 *
 * Stratégie :
 * 1. Si la variable d'env `AVIRUN_PARTICIPANT_COUNT` est définie, on la
 *    renvoie (source = "manual") — utile en fallback ou pendant les essais.
 * 2. Sinon on tente de récupérer le nombre de commentaires sur le post
 *    Instagram public via son endpoint oEmbed / sa page publique
 *    (source = "instagram").
 * 3. En cas d'échec on renvoie `null` (source = "unavailable") — le client
 *    affichera un tiret plutôt qu'une valeur erronée.
 *
 * Cache : Next met en cache la réponse 60 s côté serveur pour éviter de
 * frapper Instagram à chaque visiteur.
 */

const INSTAGRAM_POST_URL = "https://www.instagram.com/p/DYrPI2DiNiv/";

export const revalidate = 60;

type Source = "instagram" | "manual" | "unavailable";

interface ParticipantsResponse {
  count: number | null;
  source: Source;
  fetched_at: string;
}

async function fetchInstagramCommentCount(): Promise<number | null> {
  try {
    const res = await fetch(INSTAGRAM_POST_URL, {
      headers: {
        // User-agent navigateur — Instagram bloque parfois les user-agents par
        // défaut de Node/fetch. Pas de garantie de stabilité dans le temps.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
      },
      // Next 16 cache hint
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const html = await res.text();

    // Plusieurs heuristiques — Instagram change régulièrement son markup.
    const patterns = [
      /"comment_count"\s*:\s*(\d+)/,
      /"commentCount"\s*:\s*(\d+)/,
      /"edge_media_to_parent_comment"\s*:\s*\{\s*"count"\s*:\s*(\d+)/,
      /"edge_media_preview_comment"\s*:\s*\{\s*"count"\s*:\s*(\d+)/,
    ];
    for (const re of patterns) {
      const m = html.match(re);
      if (m) {
        const n = Number(m[1]);
        if (Number.isFinite(n)) return n;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET() {
  const manual = process.env.AVIRUN_PARTICIPANT_COUNT;
  if (manual && manual.trim() !== "") {
    const n = Number(manual);
    if (Number.isFinite(n)) {
      const body: ParticipantsResponse = {
        count: n,
        source: "manual",
        fetched_at: new Date().toISOString(),
      };
      return NextResponse.json(body, {
        headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
      });
    }
  }

  const count = await fetchInstagramCommentCount();
  const body: ParticipantsResponse = {
    count,
    source: count !== null ? "instagram" : "unavailable",
    fetched_at: new Date().toISOString(),
  };

  return NextResponse.json(body, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
  });
}
