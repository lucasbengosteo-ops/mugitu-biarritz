import { cleJour } from "./format.ts";
import { KLUB_TYPES, type KlubType, type SeancePublique } from "./types.ts";

/**
 * Préparer le planning public du Klub : la séance à la une, la liste
 * groupée par jour, et le compte par type pour les filtres.
 *
 * Pur, sans import d'alias : lu tel quel par les tests `node --test`.
 */

export type Jour = { cle: string; seances: SeancePublique[] };

export type Planning = {
  aLaUne: SeancePublique | null;
  jours: Jour[];
  types: { type: KlubType; nombre: number }[];
  /** Une rangée de filtres à une seule valeur ne filtre rien. */
  afficherFiltres: boolean;
};

export function preparerPlanning(seances: SeancePublique[], maintenant: string | Date): Planning {
  const triees = [...seances].sort((a, b) => a.debut.localeCompare(b.debut));
  const now = new Date(maintenant).getTime();
  const fin = (s: SeancePublique) => new Date(s.debut).getTime() + s.duree_min * 60_000;

  // Une séance terminée n'a rien à faire sur la page : un visiteur ne peut
  // plus s'y inscrire. On le décide sur l'heure, et non sur l'état
  // d'affichage : celui-ci dit « annulée » avant de regarder si la séance est
  // finie, et une séance annulée la semaine dernière serait restée pour
  // toujours. Une séance annulée À VENIR reste, barrée — ceux qui comptaient
  // venir doivent pouvoir le constater.
  const avenir = triees.filter((s) => fin(s) > now);

  // À la une : la prochaine qui n'est ni annulée ni déjà commencée. Une
  // séance en cours reste dans la liste, mais on ne met pas en avant ce à
  // quoi on ne peut plus se joindre.
  const aLaUne = avenir.find((s) => s.statut !== "annulee" && new Date(s.debut).getTime() > now) ?? null;

  const jours: Jour[] = [];
  for (const s of avenir) {
    if (s.id === aLaUne?.id) continue;
    const cle = cleJour(s.debut);
    const dernier = jours[jours.length - 1];
    if (dernier && dernier.cle === cle) dernier.seances.push(s);
    else jours.push({ cle, seances: [s] });
  }

  const types = KLUB_TYPES.map(({ value }) => ({
    type: value,
    nombre: avenir.filter((s) => s.type === value).length,
  })).filter((t) => t.nombre > 0);

  return { aLaUne, jours, types, afficherFiltres: types.length > 1 };
}

/** La liste restreinte à un type ; `null` rend tout. Les jours vidés disparaissent. */
export function filtrerJours(jours: Jour[], type: KlubType | null): Jour[] {
  if (type === null) return jours;
  return jours
    .map((j) => ({ cle: j.cle, seances: j.seances.filter((s) => s.type === type) }))
    .filter((j) => j.seances.length > 0);
}
