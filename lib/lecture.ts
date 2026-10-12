/**
 * Temps de lecture d'un article, à environ 220 mots par minute. Calculé
 * plutôt que saisi : un chiffre tapé à la main ne suit pas le texte.
 */

type Contenu = {
  chapo: string;
  sections: { h: string; p: string[] }[];
  cas: string | null;
  exercice: { title?: string; body?: string } | null;
  faq: { q: string; a: string }[];
};

function mots(texte: string | null | undefined): number {
  return (texte ?? "").split(/\s+/).filter(Boolean).length;
}

export function tempsDeLecture(a: Contenu): number {
  const total =
    mots(a.chapo) +
    a.sections.reduce((n, s) => n + mots(s.h) + s.p.reduce((m, p) => m + mots(p), 0), 0) +
    mots(a.cas) +
    mots(a.exercice?.title) +
    mots(a.exercice?.body) +
    a.faq.reduce((n, f) => n + mots(f.q) + mots(f.a), 0);
  return Math.max(1, Math.round(total / 220));
}
