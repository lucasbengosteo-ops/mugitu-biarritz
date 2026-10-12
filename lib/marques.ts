import { decouper } from "./autoliens.ts";

/**
 * Les marques de mise en forme des articles.
 *
 * Les textes sont stockés bruts ; ces marques s'y écrivent à la main et se
 * lisent ici, en blocs et en morceaux. Rien ne devient du HTML : le rendu
 * produit des éléments React, qui échappent tout.
 *
 *   **gras**  *italique*  [texte](https://…) ou [texte](/chemin)
 *   des lignes commençant toutes par « - » : une liste
 *   une ligne vide : un nouveau paragraphe
 *
 * Pas de « _ » pour l'italique : un paragraphe en ligne contient un tiret bas,
 * il en serait déformé. Vérifié le 26 sept. 2026 : aucun des 412 textes en
 * base ne contient ces marques, donc aucun article existant ne change.
 *
 * Pur, sans import d'alias : lu tel quel par `node --test`.
 */

export type Morceau = { texte: string; gras?: boolean; italique?: boolean; href?: string };
export type Bloc = { type: "paragraphe"; morceaux: Morceau[] } | { type: "liste"; items: Morceau[][] };

const LIEN = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const EMPHASE = /\*\*([^*]+?)\*\*|\*([^*\s](?:[^*]*?[^*\s])?)\*/g;

/** Seuls https et les chemins internes font un lien ; « //hote » n'est pas interne. */
function lienSur(url: string): boolean {
  return url.startsWith("https://") || (url.startsWith("/") && !url.startsWith("//"));
}

/** Le texte hors marque passe par la reconnaissance automatique existante. */
function brut(texte: string): Morceau[] {
  return decouper(texte).map((m) => (m.href ? { texte: m.texte, href: m.href } : { texte: m.texte }));
}

function emphases(texte: string): Morceau[] {
  const out: Morceau[] = [];
  let curseur = 0;
  for (const m of texte.matchAll(EMPHASE)) {
    const debut = m.index ?? 0;
    if (debut > curseur) out.push(...brut(texte.slice(curseur, debut)));
    if (m[1] !== undefined) out.push({ texte: m[1], gras: true });
    else out.push({ texte: m[2], italique: true });
    curseur = debut + m[0].length;
  }
  if (curseur < texte.length) out.push(...brut(texte.slice(curseur)));
  return out;
}

/** Une ligne : les liens d'abord, puis les emphases dans le reste. */
export function lireLigne(ligne: string): Morceau[] {
  const out: Morceau[] = [];
  let curseur = 0;
  for (const m of ligne.matchAll(LIEN)) {
    const debut = m.index ?? 0;
    if (!lienSur(m[2])) continue;
    if (debut > curseur) out.push(...emphases(ligne.slice(curseur, debut)));
    out.push({ texte: m[1], href: m[2] });
    curseur = debut + m[0].length;
  }
  if (curseur < ligne.length) out.push(...emphases(ligne.slice(curseur)));
  return out.filter((m) => m.texte.length > 0);
}

export function lireTexte(texte: string): Bloc[] {
  return texte
    .split(/\n\s*\n/)
    .map((bloc) => bloc.trim())
    .filter(Boolean)
    .map((bloc): Bloc => {
      const lignes = bloc.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lignes.every((l) => l.startsWith("- "))) {
        return { type: "liste", items: lignes.map((l) => lireLigne(l.slice(2))) };
      }
      return { type: "paragraphe", morceaux: lireLigne(bloc) };
    });
}
