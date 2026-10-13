"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Bouton } from "@/components/admin/ui";
import { decalerSemaine, libelleSemaine } from "@/lib/agenda/semaine";

/**
 * Le choix de la semaine, partagé par « Semaine » et « Par praticien » :
 * semaine précédente, libellé, semaine suivante, « Cette semaine ».
 *
 * Props
 * - `lundi`        : le lundi affiché, `AAAA-MM-JJ`.
 * - `lundiCourant` : le lundi de la semaine en cours (heure de Paris).
 * - `onLundi`      : `(lundi) => void`.
 */
export default function NavSemaine({
  lundi,
  lundiCourant,
  onLundi,
}: {
  lundi: string;
  lundiCourant: string;
  onLundi: (lundi: string) => void;
}) {
  return (
    <div className="ad-agenda-nav">
      <div className="ad-agenda-nav-fleches">
        <button
          type="button"
          className="ad-bouton-icone ad-agenda-fleche"
          aria-label="Semaine précédente"
          onClick={() => onLundi(decalerSemaine(lundi, -1))}
        >
          <ChevronLeft aria-hidden="true" size={22} />
        </button>
        <p className="ad-agenda-nav-libelle" aria-live="polite">
          {libelleSemaine(lundi)}
        </p>
        <button
          type="button"
          className="ad-bouton-icone ad-agenda-fleche"
          aria-label="Semaine suivante"
          onClick={() => onLundi(decalerSemaine(lundi, 1))}
        >
          <ChevronRight aria-hidden="true" size={22} />
        </button>
      </div>
      <Bouton
        variante="secondaire"
        taille="petite"
        onClick={() => onLundi(lundiCourant)}
      >
        Cette semaine
      </Bouton>
    </div>
  );
}
