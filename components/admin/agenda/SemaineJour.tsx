"use client";

import { JOURS, MOMENTS, SALLES } from "@/lib/agenda/salles";
import { dateLongue, jourAbrege } from "./cases";
import type { DecrireCase } from "./Grille";

/**
 * La semaine sur téléphone et tablette : une rangée des sept jours, puis le
 * jour choisi, salle par salle, matin et après-midi en lignes de 48 px.
 * Sept colonnes ne tiennent pas sur 375 px : on lit un jour à la fois.
 *
 * Props
 * - `cellule`    : la même description que pour le tableau (`Grille`).
 * - `jour`       : le jour affiché (1 = lundi).
 * - `onJour`     : `(jour) => void`.
 * - `dates?`     : les sept dates de la semaine affichée (absentes pour la semaine type).
 * - `jourCourant?` : le jour d'aujourd'hui s'il est dans la semaine affichée.
 */
export default function SemaineJour({
  cellule,
  jour,
  onJour,
  dates,
  jourCourant,
}: {
  cellule: DecrireCase;
  jour: number;
  onJour: (jour: number) => void;
  dates?: string[];
  jourCourant?: number | null;
}) {
  const auClavier = (e: React.KeyboardEvent, j: number) => {
    let suivant: number | null = null;
    if (e.key === "ArrowRight") suivant = j === 7 ? 1 : j + 1;
    else if (e.key === "ArrowLeft") suivant = j === 1 ? 7 : j - 1;
    if (suivant === null) return;
    e.preventDefault();
    onJour(suivant);
    const rangee = e.currentTarget.parentElement;
    rangee?.querySelector<HTMLButtonElement>(`[data-jour="${suivant}"]`)?.focus();
  };

  const titreJour = dates ? dateLongue(dates[jour - 1]) : (JOURS[jour - 1] ?? "");

  return (
    <div>
      <div className="ad-agenda-jours" role="group" aria-label="Choisir le jour">
        {JOURS.map((nom, i) => {
          const j = i + 1;
          const date = dates?.[i];
          return (
            <button
              key={nom}
              type="button"
              data-jour={j}
              className={`ad-agenda-jour${jourCourant === j ? " ad-agenda-jour--courant" : ""}`}
              aria-pressed={jour === j}
              aria-label={`${date ? dateLongue(date) : nom}${jourCourant === j ? ", aujourd’hui" : ""}`}
              onClick={() => onJour(j)}
              onKeyDown={(e) => auClavier(e, j)}
            >
              <span>{jourAbrege(j)}</span>
              {date ? <span className="ad-agenda-jour-num">{Number(date.slice(8, 10))}</span> : null}
            </button>
          );
        })}
      </div>

      <h2 className="ad-agenda-titre-jour">{titreJour.charAt(0).toUpperCase() + titreJour.slice(1)}</h2>

      <div className="ad-agenda-salles">
        {SALLES.map((salle) => (
          <section key={salle.id} className="ad-agenda-salle" aria-label={`Salle ${salle.nom}`}>
            <p className="ad-agenda-salle-tete">
              <span className="ad-agenda-salle-nom">{salle.nom}</span>
              <span className="ad-agenda-salle-vocation">{salle.vocation}</span>
            </p>
            {MOMENTS.map((m) => {
              const d = cellule(salle.id, jour, m.id, "large");
              return (
                <button
                  key={m.id}
                  type="button"
                  className={`ad-agenda-case ad-agenda-case--ligne ${d.classes ?? ""}`}
                  aria-label={d.label}
                  onClick={d.onClick}
                >
                  <span className="ad-agenda-case-moment" aria-hidden="true">
                    {m.label}
                  </span>
                  <span className="ad-agenda-case-corps">{d.contenu}</span>
                </button>
              );
            })}
          </section>
        ))}
      </div>
    </div>
  );
}
