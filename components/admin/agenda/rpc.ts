import { supabaseBrowser } from "@/lib/supabase-browser";

export type Retour<T> = { ok: true; data: T } | { ok: false; message: string };

/** Les codes levés par les fonctions `agenda_*`, en français. */
const ERREURS: Record<string, string> = {
  AGENDA_DROITS: "Vous n’avez pas le droit de faire ça.",
  AGENDA_VOEU: "Cette demande n’existe plus.",
  AGENDA_STATUT: "L’état de cette demande a changé : rechargez la page.",
  AGENDA_CASE_PRISE: "Ce créneau est déjà accordé à quelqu’un d’autre.",
  AGENDA_MOTIF: "Expliquez pourquoi vous souhaitez rendre ce créneau.",
  AGENDA_TEXTE: "Écrivez un message.",
  AGENDA_SOI_MEME: "Ce créneau est déjà le vôtre.",
  AGENDA_SEMAINE: "Indiquez un lundi, dans une semaine qui n’est pas passée.",
  AGENDA_EXCEPTION_PRISE: "Ce créneau a déjà été échangé à cette date.",
};

function codeErreur(e: { message?: string } | null): string | undefined {
  const m = e?.message ?? "";
  const trouve = Object.keys(ERREURS).find((code) => m.includes(code));
  return trouve;
}

export async function appeler<T>(nom: string, args: Record<string, unknown>): Promise<Retour<T>> {
  const { data, error } = await supabaseBrowser().rpc(nom, args);
  if (error) {
    const code = codeErreur(error);
    return { ok: false, message: code ? ERREURS[code] : error.message };
  }
  return { ok: true, data: data as T };
}
