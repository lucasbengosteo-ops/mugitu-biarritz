/**
 * Actualités qui doublonnent une page de soin.
 *
 * Plusieurs articles du blog sont des versions courtes d'une page de
 * pathologie, de sport ou de bilan. Deux pages proches se font concurrence
 * dans les moteurs ; la page de soin fait référence (décision du 15 oct.
 * 2026). L'article reste en ligne et lisible, mais sa canonique pointe vers
 * la page de soin et il sort du plan du site.
 *
 * Pur et sans alias : lu tel quel par `node --test`.
 */

/** Les correspondances qui ne se déduisent pas d'un slug identique. */
const EXCEPTIONS: Record<string, string> = {
  "bilan-de-pre-saison": "/soins/bilan-pre-saison",
  "bilan-retour-au-sport": "/soins/bilan-retour-au-sport",
  "analyse-de-foulee": "/soins/analyse-de-foulee",
  "zone-d-intervention": "/zone-intervention",
};

type Listes = { pathologies: { slug: string }[]; sports: { slug: string }[] };

/**
 * Le chemin de la page qui fait référence pour un article, ou `null` quand
 * l'article n'a pas d'équivalent (il reste alors sa propre canonique).
 */
export function pageDeReference(slugArticle: string, { pathologies, sports }: Listes): string | null {
  if (EXCEPTIONS[slugArticle]) return EXCEPTIONS[slugArticle];
  if (pathologies.some((p) => p.slug === slugArticle)) return `/pathologies/${slugArticle}`;
  if (sports.some((s) => s.slug === slugArticle)) return `/sports/${slugArticle}`;
  return null;
}
