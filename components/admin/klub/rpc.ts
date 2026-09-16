import { codeErreur, ERREURS } from "@/lib/klub/erreurs";
import { supabaseBrowser } from "@/lib/supabase-browser";

export type Retour<T> = { ok: true; data: T } | { ok: false; message: string };

/**
 * Messages admin qui remplacent ceux de `lib/klub/erreurs.ts` : certains
 * codes ont un sens différent hors du parcours visiteur. `KLUB_LIBRE` est
 * levé quand on tente de passer en entrée libre une séance qui a encore des
 * inscrits ; le message visiteur (« pas besoin de s’inscrire ») n’a pas de
 * sens ici.
 */
const ERREURS_ADMIN: Record<string, string> = {
  KLUB_LIBRE: "Des personnes sont inscrites : annulez leurs inscriptions avant de passer la séance en entrée libre.",
  KLUB_SEANCE: "Cette séance n’existe plus ou a été annulée.",
};

/** Appelle une fonction admin du Klub avec la session du praticien connecté. */
export async function appeler<T>(nom: string, args: Record<string, unknown>): Promise<Retour<T>> {
  const { data, error } = await supabaseBrowser().rpc(nom, args);
  if (error) {
    const code = codeErreur(error);
    const message = code ? (ERREURS_ADMIN[code] ?? ERREURS[code]) : undefined;
    return { ok: false, message: message ?? error.message };
  }
  return { ok: true, data: data as T };
}
