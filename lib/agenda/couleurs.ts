/**
 * Une couleur stable par personne, attribuée dans l'ordre alphabétique des
 * noms. Chaque teinte a sa couleur de texte, vérifiée à 4,5:1. La couleur ne
 * porte jamais seule l'information : les initiales l'accompagnent toujours.
 *
 * Pur, sans accès réseau : lu tel quel par les tests `node --test`.
 */

export const PALETTE = [
  { fond: "#0F6E75", texte: "#FFFFFF" },
  { fond: "#C2410C", texte: "#FFFFFF" },
  { fond: "#3B5BA9", texte: "#FFFFFF" },
  { fond: "#7A4E9E", texte: "#FFFFFF" },
  { fond: "#9E4433", texte: "#FFFFFF" },
  { fond: "#2E7D4F", texte: "#FFFFFF" },
  { fond: "#F3BE79", texte: "#003850" },
  { fond: "#9BD7D1", texte: "#003850" },
  { fond: "#F4B6A6", texte: "#003850" },
  { fond: "#C9D6F2", texte: "#003850" },
] as const;

export type Teinte = (typeof PALETTE)[number];

/**
 * « Jean-Baptiste Colombié » → « JBC » : une lettre par mot, un prénom
 * composé (trait d'union) comptant pour autant de mots. Trois lettres au
 * plus. « ? » si le nom est vide ou ne contient que des espaces.
 */
export function initiales(nom: string): string {
  const mots = nom
    .trim()
    .split(/[\s-]+/)
    .filter(Boolean);
  if (mots.length === 0) return "?";
  return mots
    .map((mot) => mot[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 3);
}

/**
 * Ordre alphabétique des noms (locale fr, sans accents ni casse), puis
 * indice modulo la palette : la couleur ne dépend que de la position de
 * chacun dans cet ordre, jamais de l'ordre d'arrivée des données.
 */
export function couleursParPersonne(personnes: { id: string; nom: string }[]): Record<string, Teinte> {
  const tries = [...personnes].sort((a, b) => a.nom.localeCompare(b.nom, "fr", { sensitivity: "base" }));
  const resultat: Record<string, Teinte> = {};
  tries.forEach((personne, indice) => {
    resultat[personne.id] = PALETTE[indice % PALETTE.length];
  });
  return resultat;
}
