/**
 * Les paragraphes d’article sont stockés en texte brut : React les échappe,
 * donc pas de HTML dans la base. Pour citer un partenaire il faut malgré tout
 * pouvoir le lier — d’où cette reconnaissance de deux formes écrites à la main
 * dans le back-office :
 *
 *   @pseudo            → https://www.instagram.com/pseudo/
 *   exemple.com        → https://exemple.com
 *
 * Volontairement étroit : pas de e-mails, pas de chemins, pas de « http:// »
 * à taper. Ce qui n’est pas reconnu reste du texte, ce qui est le bon défaut.
 */

/** Un morceau de paragraphe : du texte, ou un lien à rendre. */
export type Morceau = { texte: string; href?: string };

/**
 * `@pseudo` : lettres, chiffres, point et tiret bas, comme Instagram l’autorise.
 * Le domaine exige une extension de 2 à 6 lettres et refuse un point final,
 * pour ne pas avaler la ponctuation de fin de phrase.
 */
const MOTIF = /(^|[\s(])(@[A-Za-z0-9._]{2,30}|(?:[a-z0-9-]+\.)+[a-z]{2,6})(?=$|[\s.,;:!?)])/g;

export function decouper(paragraphe: string): Morceau[] {
  const out: Morceau[] = [];
  let curseur = 0;

  for (const m of paragraphe.matchAll(MOTIF)) {
    const avant = m[1] ?? "";
    const jeton = m[2];
    const debut = (m.index ?? 0) + avant.length;

    if (debut > curseur) out.push({ texte: paragraphe.slice(curseur, debut) });

    out.push({
      texte: jeton,
      href: jeton.startsWith("@")
        ? `https://www.instagram.com/${jeton.slice(1)}/`
        : `https://${jeton}`,
    });

    curseur = debut + jeton.length;
  }

  if (curseur < paragraphe.length) out.push({ texte: paragraphe.slice(curseur) });
  return out;
}
