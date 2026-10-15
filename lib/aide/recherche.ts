import { normaliser } from "../orientation/regles.ts";
import type { ArticleAide } from "./types.ts";

/**
 * Recherche sans IA dans l'onglet Articles : chaque mot de la requête doit
 * apparaître dans le titre ou le texte ; le titre compte triple.
 */
export function chercher(articles: ArticleAide[], requete: string, max = 20): ArticleAide[] {
  const mots = normaliser(requete).split(/[^a-z0-9]+/).filter((m) => m.length >= 2);
  if (mots.length === 0) return [];
  return articles
    .map((a) => {
      const titre = normaliser(a.titre);
      const texte = normaliser(a.texte);
      let score = 0;
      for (const m of mots) {
        if (titre.includes(m)) score += 3;
        else if (texte.includes(m)) score += 1;
        else return { a, score: -1 };
      }
      return { a, score };
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, max)
    .map((x) => x.a);
}
