import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase-config";

/**
 * Identifier, côté serveur, qui appelle une route admin.
 *
 * Le navigateur envoie `Authorization: Bearer <access_token>` de sa session
 * Supabase. On interroge Supabase Auth avec ce jeton (jamais la clé de
 * service), puis on vérifie l'appartenance à l'équipe avec ce même jeton :
 * c'est `site_est_equipe()`, exécutable par `authenticated`, qui tranche —
 * pas cette fonction.
 */

export type Appelant = { userId: string; email: string; jeton: string };

/** L'utilisateur connecté qui appelle la route, s'il fait partie de l'équipe ; sinon null. */
export async function appelantEquipe(request: Request): Promise<Appelant | null> {
  const auth = request.headers.get("authorization") ?? "";
  const jeton = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!jeton) return null;
  const entetes = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${jeton}`, "Content-Type": "application/json" };

  const u = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: entetes, cache: "no-store" });
  if (!u.ok) return null;
  const user = (await u.json()) as { id?: string; email?: string };
  if (!user.id) return null;

  const e = await fetch(`${SUPABASE_URL}/rest/v1/rpc/site_est_equipe`, { method: "POST", headers: entetes, body: "{}", cache: "no-store" });
  if (!e.ok || (await e.json()) !== true) return null;
  return { userId: user.id, email: user.email ?? "", jeton };
}
