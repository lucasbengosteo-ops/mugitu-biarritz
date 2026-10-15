import type { ArticleAide, Echange, ReponseAide } from "@/lib/aide/types";

/** Pose une question ; « trop » si la limite est atteinte, null si le service ne répond pas. */
export async function poserQuestion(
  texte: string,
  consentement: boolean,
  historique: Echange[],
): Promise<ReponseAide | "trop" | null> {
  try {
    const res = await fetch("/api/aide/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texte, consentement, historique, page: window.location.pathname }),
    });
    if (res.status === 429) return "trop";
    if (!res.ok) return null;
    const corps = (await res.json()) as ReponseAide;
    if (!corps || typeof corps.type !== "string" || typeof corps.texte !== "string") return null;
    return { ...corps, sources: Array.isArray(corps.sources) ? corps.sources : [] };
  } catch {
    return null;
  }
}

/** Note un vote sans attendre de réponse. */
export function voter(id: string | null, utile: boolean): void {
  if (!id) return;
  try {
    navigator.sendBeacon("/api/aide/vote", new Blob([JSON.stringify({ id, utile })], { type: "application/json" }));
  } catch {
    // Un vote perdu n'empêche rien.
  }
}

/** Les éléments de l'onglet Articles, ou null si le service ne répond pas. */
export async function chargerArticles(): Promise<ArticleAide[] | null> {
  try {
    const res = await fetch("/api/aide/articles");
    if (!res.ok) return null;
    const corps = (await res.json()) as ArticleAide[];
    return Array.isArray(corps) ? corps : null;
  } catch {
    return null;
  }
}
