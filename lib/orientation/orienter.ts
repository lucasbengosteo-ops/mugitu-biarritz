import type { Catalogue } from "./catalogue.ts";
import { construireMessages, type Message } from "./prompt.ts";
import { correspondance, detecterAlerte, detecterDetresse } from "./regles.ts";
import type { Alerte, Carte, Etat, Reponses, Source } from "./types.ts";
import { lireReponseIA, valider } from "./validation.ts";

export type AppelIA = (messages: Message[]) => Promise<string | null>;
export type Orientation = { etat: Etat; cartes: Carte[]; source: Source; alerte: Alerte };

/**
 * L'enchaînement complet. Les alertes passent avant tout, sans IA ; l'IA
 * ne sert qu'à choisir dans le catalogue ; tout échec mène à la table fixe.
 */
export async function orienter(r: Reponses, cat: Catalogue, ia: AppelIA | null): Promise<Orientation> {
  const alerte = detecterAlerte(r);
  if (alerte) return { etat: "alerte", cartes: [], source: "regles", alerte };

  if (detecterDetresse(r.texte)) {
    return { etat: "detresse", cartes: correspondance({ ...r, motif: "mental" }, cat), source: "regles", alerte: "detresse" };
  }

  if (!ia) return { etat: "suggestions", cartes: correspondance(r, cat), source: "regles", alerte: "aucune" };

  const brut = await ia(construireMessages(r, cat));
  const lue = brut ? lireReponseIA(brut) : null;
  if (lue) {
    const v = valider(lue, cat);
    if (v.alerte) return { etat: "alerte", cartes: [], source: "ia", alerte: "ia" };
    if (v.cartes.length > 0) return { etat: "suggestions", cartes: v.cartes, source: "ia", alerte: "aucune" };
  }
  return { etat: "suggestions", cartes: correspondance(r, cat), source: "repli", alerte: "aucune" };
}
