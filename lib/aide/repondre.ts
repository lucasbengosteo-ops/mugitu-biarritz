import type { AppelIA } from "../orientation/orienter.ts";
import { detecterDetresse, motAlerte } from "../orientation/regles.ts";
import { construireMessages } from "./prompt.ts";
import type { Passage, Question, Source, TypeReponse } from "./types.ts";
import { lireReponseIA, SOURCES_INCONNU, TEXTE_INCONNU, validerReponse } from "./validation.ts";

export const TEXTE_ALERTE =
  "Ce que vous décrivez demande un avis médical rapide. En cas d’urgence, appelez le 15 ou le 112. Sinon, consultez votre médecin traitant ou un service d’urgence aujourd’hui.";
export const TEXTE_DETRESSE =
  "Si vous pensez au suicide, parlez-en : le 3114 répond jour et nuit, gratuitement. En cas de danger immédiat, appelez le 15.";

export type Reponse = { type: TypeReponse; texte: string; sources: Source[] };

/** Les alertes passent avant tout, sans IA ; tout échec mène à « inconnu ». */
export async function repondre(q: Question, corpus: Passage[], ia: AppelIA | null): Promise<Reponse> {
  if (detecterDetresse(q.texte)) return { type: "detresse", texte: TEXTE_DETRESSE, sources: [] };
  if (motAlerte(q.texte)) return { type: "alerte", texte: TEXTE_ALERTE, sources: [] };
  const inconnu: Reponse = { type: "inconnu", texte: TEXTE_INCONNU, sources: SOURCES_INCONNU };
  if (!ia) return inconnu;
  const brut = await ia(construireMessages(q, corpus));
  const lue = brut ? lireReponseIA(brut) : null;
  return lue ? validerReponse(lue, corpus) : inconnu;
}
