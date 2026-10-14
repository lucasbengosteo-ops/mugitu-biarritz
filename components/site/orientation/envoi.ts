import type { Reponses, ReponseOrientation } from "@/lib/orientation/types";

/** Envoie les réponses ; « trop » si la limite est atteinte, null si le service ne répond pas. */
export async function demanderOrientation(r: Reponses): Promise<ReponseOrientation | "trop" | null> {
  try {
    const res = await fetch("/api/orientation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(r),
    });
    if (res.status === 429) return "trop";
    if (!res.ok) return null;
    const corps = (await res.json()) as ReponseOrientation;
    if (!corps || !Array.isArray(corps.cartes) || typeof corps.etat !== "string") return null;
    return corps;
  } catch {
    return null;
  }
}

/** Note un clic sans retarder la navigation. */
export function noterClic(id: string | null, type: "reservation" | "page", cible: string): void {
  if (!id) return;
  const corps = new Blob([JSON.stringify({ id, type, cible })], { type: "application/json" });
  try {
    navigator.sendBeacon("/api/orientation/clic", corps);
  } catch {
    // Un clic non noté n'empêche jamais d'ouvrir le lien.
  }
}
