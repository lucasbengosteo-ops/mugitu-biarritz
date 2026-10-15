import { extraireFaq } from "./faq.ts";
import { sansBalises, slugifier } from "./texte.ts";
import type { Passage } from "./types.ts";

export type PageSource = { id: string; titre: string; lien: string; html: string };
export type TarifSource = { praticien: string; nom: string; fiche: string; lignes: { titre: string; prix: string; mention?: string }[] };

/** Une page longue est découpée à chaque <h2>, pour des passages courts et citables. */
export function decouper(page: PageSource): Passage[] {
  const morceaux = page.html.split(/(?=<h2[\s>])/i);
  const passages: Passage[] = [];
  for (const m of morceaux) {
    const titreH2 = /<h2[^>]*>([\s\S]*?)<\/h2>/i.exec(m)?.[1];
    const texte = sansBalises(m);
    if (texte.length < 40) continue;
    const titre = titreH2 ? `${page.titre} — ${sansBalises(titreH2)}` : page.titre;
    passages.push({ id: `${page.id}-${slugifier(titreH2 ? sansBalises(titreH2) : "intro")}`, titre, texte, lien: page.lien });
  }
  return passages;
}

export function construireCorpus(src: { faqHtml: string; pages: PageSource[]; tarifs: TarifSource[] }): Passage[] {
  const faq: Passage[] = extraireFaq(src.faqHtml).map((q) => ({ id: q.id, titre: q.question, texte: q.reponse, lien: "/faq" }));
  const pages = src.pages.flatMap(decouper);
  const tarifs: Passage[] = src.tarifs
    .filter((t) => t.lignes.length > 0)
    .map((t) => ({
      id: `tarifs-${t.praticien}`,
      titre: `Tarifs de ${t.nom}`,
      texte: t.lignes.map((l) => `${l.titre} : ${l.prix}${l.mention ? ` (${l.mention})` : ""}`).join(" ; "),
      lien: t.fiche,
    }));
  // Identifiants uniques : un doublon reçoit un suffixe.
  const vus = new Map<string, number>();
  return [...faq, ...pages, ...tarifs].map((p) => {
    const n = vus.get(p.id) ?? 0;
    vus.set(p.id, n + 1);
    return n === 0 ? p : { ...p, id: `${p.id}-${n + 1}` };
  });
}

export function nombreDeMots(corpus: Passage[]): number {
  return corpus.reduce((n, p) => n + `${p.titre} ${p.texte}`.split(/\s+/).length, 0);
}
