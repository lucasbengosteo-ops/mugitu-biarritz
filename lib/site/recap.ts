/**
 * Habillage du récapitulatif quotidien.
 *
 * Le corps est composé en base par `site_recap_du_jour()` : des lignes de
 * titre, et des lignes d'item commençant par « - ». Ce module ne fait que
 * l'habiller — il n'invente aucun contenu, ce qui le rend testable sans
 * base ni réseau.
 */

const SITE = "https://mugitu-biarritz.fr";

export function habillerRecap(corps: string): { html: string; texte: string } {
  const lignes = corps.split("\n").map((l) => l.trimEnd());
  const morceaux: string[] = [];
  let dansListe = false;

  for (const ligne of lignes) {
    if (ligne.trim().length === 0) continue;
    if (ligne.startsWith("- ")) {
      if (!dansListe) {
        morceaux.push('<ul style="margin:0 0 14px;padding-left:20px">');
        dansListe = true;
      }
      morceaux.push(
        `<li style="font-size:14.5px;line-height:1.6;color:#1d2d33">${echapper(ligne.slice(2))}</li>`,
      );
    } else {
      if (dansListe) {
        morceaux.push("</ul>");
        dansListe = false;
      }
      morceaux.push(
        `<p style="font-size:13px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#04A49B;margin:18px 0 6px">${echapper(ligne)}</p>`,
      );
    }
  }
  if (dansListe) morceaux.push("</ul>");

  const html = [
    '<p style="font-size:16px;font-weight:600;color:#003850;margin:0 0 4px">Ce qui a bougé hier</p>',
    ...morceaux,
    `<p style="font-size:13px;margin:18px 0 0"><a href="${SITE}/admin" style="color:#04A49B">Ouvrir le back-office</a></p>`,
  ].join("");

  const texte = ["Ce qui a bougé hier", "", corps.trimEnd(), "", `Le back-office : ${SITE}/admin`].join("\n");

  return { html, texte };
}

function echapper(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
