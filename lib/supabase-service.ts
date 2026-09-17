import { SUPABASE_URL } from "./supabase-config";

/**
 * Accès PostgREST avec la clé de service, qui contourne la RLS.
 * Serveur uniquement : routes API et tâche planifiée. La clé vit dans
 * `SUPABASE_SERVICE_ROLE_KEY`, jamais préfixée NEXT_PUBLIC_.
 */

function entetes(extra?: Record<string, string>): Record<string, string> {
  if (typeof window !== "undefined") throw new Error("[supabase-service] appelé depuis le navigateur");
  const cle = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!cle) throw new Error("[supabase-service] SUPABASE_SERVICE_ROLE_KEY absente");
  return { apikey: cle, Authorization: `Bearer ${cle}`, "Content-Type": "application/json", ...extra };
}

export type Resultat<T> = { ok: true; data: T } | { ok: false; status: number; corps: unknown };

export async function rpcService<T>(nom: string, args: Record<string, unknown>): Promise<Resultat<T>> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${nom}`, {
    method: "POST",
    headers: entetes(),
    body: JSON.stringify(args),
    cache: "no-store",
  });
  const corps = await res.json().catch(() => null);
  return res.ok ? { ok: true, data: corps as T } : { ok: false, status: res.status, corps };
}

export async function restService<T>(
  chemin: string,
  init: { method?: "GET" | "PATCH"; corps?: unknown } = {},
): Promise<Resultat<T>> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${chemin}`, {
    method: init.method ?? "GET",
    headers: entetes(init.method === "PATCH" ? { Prefer: "return=minimal" } : undefined),
    body: init.corps === undefined ? undefined : JSON.stringify(init.corps),
    cache: "no-store",
  });
  const corps = res.status === 204 ? null : await res.json().catch(() => null);
  return res.ok ? { ok: true, data: corps as T } : { ok: false, status: res.status, corps };
}
