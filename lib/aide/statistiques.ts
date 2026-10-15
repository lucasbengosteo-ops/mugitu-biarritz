/** Agrégats de l'onglet « Questions » du back-office. */

import { lundiParis } from "../orientation/statistiques.ts";

export type LigneQuestion = {
  id: string;
  cree_le: string;
  type: string;
  sources: string[];
  page: string;
  utile: boolean | null;
  consentement: boolean;
};

export type SemaineQuestions = { semaine: string; total: number; sansReponse: number; utiles: number; votes: number };

export function questionsParSemaine(lignes: LigneQuestion[]): SemaineQuestions[] {
  const m = new Map<string, SemaineQuestions>();
  for (const x of lignes) {
    const k = lundiParis(x.cree_le);
    const s = m.get(k) ?? { semaine: k, total: 0, sansReponse: 0, utiles: 0, votes: 0 };
    s.total++;
    if (x.type === "inconnu") s.sansReponse++;
    if (x.utile !== null) s.votes++;
    if (x.utile === true) s.utiles++;
    m.set(k, s);
  }
  return [...m.values()].sort((a, b) => b.semaine.localeCompare(a.semaine));
}

/**
 * Compte chaque page citée dans `sources`, triées par nombre décroissant.
 * `lib/orientation/statistiques.ts#frequences` est typé pour `LigneParcours`
 * (une seule valeur par ligne) et ne se détourne pas proprement pour une
 * liste de sources par ligne : un petit compteur local plutôt qu'un `as never`.
 */
export function sourcesFrequentes(lignes: LigneQuestion[]): { valeur: string; nombre: number }[] {
  const m = new Map<string, number>();
  for (const x of lignes) {
    for (const s of x.sources) m.set(s, (m.get(s) ?? 0) + 1);
  }
  return [...m.entries()].map(([valeur, nombre]) => ({ valeur, nombre })).sort((a, b) => b.nombre - a.nombre || a.valeur.localeCompare(b.valeur));
}
