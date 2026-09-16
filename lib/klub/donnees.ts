import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase-config";
import type { InfosAnnulation, SeancePublique } from "./types";
import { JETON, UUID } from "./validation";

/**
 * Lectures publiques du Klub, avec la clé anon. Les fonctions appelées sont
 * `stable` : PostgREST les accepte en GET, que le cache de Next sait garder.
 */

/** Durée de cache des pages Klub, en secondes. */
export const KLUB_REVALIDATE = 60;

async function rpcGet<T>(nom: string, args: Record<string, string>, cache: boolean): Promise<T | null> {
  const url = `${SUPABASE_URL}/rest/v1/rpc/${nom}?${new URLSearchParams(args)}`;
  try {
    const res = await fetch(url, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      ...(cache ? { next: { revalidate: KLUB_REVALIDATE } } : { cache: "no-store" as const }),
    });
    if (!res.ok) {
      console.error(`[klub] ${nom} a répondu ${res.status}`, await res.text());
      return null;
    }
    return (await res.json()) as T;
  } catch (e) {
    console.error(`[klub] ${nom} injoignable`, e);
    return null;
  }
}

export async function getPlanning(du: Date, au: Date): Promise<SeancePublique[]> {
  return (await rpcGet<SeancePublique[]>("klub_planning", { p_du: du.toISOString(), p_au: au.toISOString() }, true)) ?? [];
}

export async function getSeance(id: string): Promise<SeancePublique | null> {
  if (!UUID.test(id)) return null;
  return rpcGet<SeancePublique>("klub_seance", { p_id: id }, true);
}

/** Jamais en cache : l'état change au clic. */
export async function getAnnulation(jeton: string): Promise<InfosAnnulation | null> {
  if (!JETON.test(jeton)) return null;
  return rpcGet<InfosAnnulation>("klub_annulation_infos", { p_jeton: jeton }, false);
}
