import type { Message } from "./prompt.ts";

/**
 * Un appel à l'API Mistral en mode JSON. Rend le contenu de la réponse, ou
 * null en cas d'erreur, de délai dépassé ou de réponse vide : l'appelant
 * se replie alors sur la table fixe.
 */
export async function appelerMistral(
  messages: Message[],
  opts: { cle: string; modele?: string; delaiMs?: number; fetch?: typeof fetch },
): Promise<string | null> {
  const f = opts.fetch ?? fetch;
  try {
    const res = await f("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${opts.cle}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: opts.modele ?? "mistral-small-latest",
        temperature: 0.2,
        max_tokens: 900,
        response_format: { type: "json_object" },
        messages,
      }),
      signal: AbortSignal.timeout(opts.delaiMs ?? 15_000),
    });
    if (!res.ok) {
      console.error("[orientation] Mistral", res.status);
      return null;
    }
    const corps = (await res.json()) as { choices?: { message?: { content?: unknown } }[] };
    const c = corps.choices?.[0]?.message?.content;
    return typeof c === "string" && c.trim() ? c : null;
  } catch (e) {
    console.error("[orientation] Mistral injoignable", e instanceof Error ? e.name : e);
    return null;
  }
}
