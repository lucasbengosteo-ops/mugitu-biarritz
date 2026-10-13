"use client";

import { JOURS, MOMENTS, SALLES } from "@/lib/agenda/salles";
import { dateCourte, dateLongue } from "./cases";

/**
 * Le tableau du cabinet sur ordinateur : les salles en lignes (nom et
 * vocation), les sept jours en colonnes, chaque jour coupé en deux
 * demi-cases — le matin au-dessus, l'après-midi dessous, pour que le nom
 * tienne en entier dans une colonne.
 *
 * Le tableau ne sait rien des vœux : chaque case est décrite par
 * `cellule`, ce qui sert aussi bien la semaine du cabinet (pastilles) que
 * « Mes demandes » (on coche). La même description sert la vue jour par
 * jour du téléphone (`SemaineJour`).
 *
 * Clavier : chaque case est un bouton ; les flèches passent d'une case à sa
 * voisine, Début et Fin vont au lundi et au dimanche de la ligne.
 */

export type FormatCase = "etroit" | "large";

export type DescriptionCase = {
  /** Le libellé lu pour la case, complet : salle, jour, moment, occupant, état. */
  label: string;
  contenu: React.ReactNode;
  /** Classes de modification (`ad-agenda-case--libre`…). */
  classes?: string;
  onClick: () => void;
};

export type DecrireCase = (salle: string, jour: number, moment: string, format: FormatCase) => DescriptionCase;

export default function Grille({
  titre,
  cellule,
  dates,
  jourCourant,
}: {
  /** Légende du tableau, pour les lecteurs d'écran. */
  titre: string;
  cellule: DecrireCase;
  /** Les sept dates `AAAA-MM-JJ` de la semaine affichée ; absentes pour la semaine type. */
  dates?: string[];
  /** Le jour (1 à 7) à mettre en avant, s'il est dans la semaine affichée. */
  jourCourant?: number | null;
}) {
  const auClavier = (e: React.KeyboardEvent<HTMLTableElement>) => {
    const cible = e.target as HTMLElement;
    const l = Number(cible.dataset.l);
    const c = Number(cible.dataset.c);
    if (Number.isNaN(l) || Number.isNaN(c) || cible.dataset.l === undefined) return;
    let nl = l;
    let nc = c;
    if (e.key === "ArrowRight") nc = Math.min(6, c + 1);
    else if (e.key === "ArrowLeft") nc = Math.max(0, c - 1);
    else if (e.key === "ArrowDown") nl = Math.min(SALLES.length * MOMENTS.length - 1, l + 1);
    else if (e.key === "ArrowUp") nl = Math.max(0, l - 1);
    else if (e.key === "Home") nc = 0;
    else if (e.key === "End") nc = 6;
    else return;
    e.preventDefault();
    e.currentTarget.querySelector<HTMLButtonElement>(`[data-l="${nl}"][data-c="${nc}"]`)?.focus();
  };

  return (
    <div className="ad-agenda-tableau-cadre">
      <table className="ad-agenda-tableau" onKeyDown={auClavier}>
        <caption className="ad-agenda-sr">{titre}</caption>
        <colgroup>
          <col className="ad-agenda-col-salle" />
          <col className="ad-agenda-col-moment" />
          {JOURS.map((j) => (
            <col key={j} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <td colSpan={2} />
            {JOURS.map((j, i) => {
              const date = dates?.[i];
              const courant = jourCourant === i + 1;
              return (
                <th
                  key={j}
                  scope="col"
                  className={courant ? "ad-agenda-jour-courant" : undefined}
                  aria-label={date ? `${dateLongue(date)}${courant ? ", aujourd’hui" : ""}` : j}
                >
                  <span className="ad-agenda-entete-jour">{j}</span>
                  {date ? <span className="ad-agenda-entete-date">{courant ? "Aujourd’hui" : dateCourte(date)}</span> : null}
                </th>
              );
            })}
          </tr>
        </thead>
        {SALLES.map((salle, s) => (
          <tbody key={salle.id}>
            {MOMENTS.map((m, im) => (
              <tr key={m.id} className={im === 0 ? "ad-agenda-ligne-matin" : "ad-agenda-ligne-aprem"}>
                {im === 0 ? (
                  <th scope="rowgroup" rowSpan={MOMENTS.length} className="ad-agenda-th-salle">
                    <span className="ad-agenda-salle-nom">{salle.nom}</span>
                    <span className="ad-agenda-salle-vocation">{salle.vocation}</span>
                  </th>
                ) : null}
                <th scope="row" className="ad-agenda-th-moment">
                  {m.label}
                </th>
                {JOURS.map((j, i) => {
                  const d = cellule(salle.id, i + 1, m.id, "etroit");
                  return (
                    <td key={j} className={jourCourant === i + 1 ? "ad-agenda-jour-courant" : undefined}>
                      <button
                        type="button"
                        className={`ad-agenda-case ${d.classes ?? ""}`}
                        data-l={s * MOMENTS.length + im}
                        data-c={i}
                        aria-label={d.label}
                        onClick={d.onClick}
                      >
                        {d.contenu}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
