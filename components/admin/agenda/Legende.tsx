"use client";

import { Hourglass, Plus, Repeat, TriangleAlert } from "lucide-react";
import { prenom, teinteDe, type Couleur } from "./cases";
import Pastille from "./Pastille";

/**
 * La légende de la semaine, en deux parties.
 *
 * 1. Les personnes : une pastille et un prénom par personne qui tient au
 *    moins une case. Toucher un nom le sélectionne (`aria-pressed`) : ses
 *    cases restent nettes, les autres s'estompent. Le retoucher annule.
 * 2. Les états : chacun avec son signe ET son mot — la couleur seule ne dit
 *    jamais rien.
 *
 * Props
 * - `personnes`   : `{ id, nom }[]`, dans l'ordre d'affichage.
 * - `teintes`     : couleurs par personne.
 * - `selection`   : l'id surligné, ou `null`.
 * - `onSelection` : `(id | null) => void`.
 */
export default function Legende({
  personnes,
  teintes,
  selection,
  onSelection,
}: {
  personnes: { id: string; nom: string }[];
  teintes: Record<string, Couleur>;
  selection: string | null;
  onSelection: (id: string | null) => void;
}) {
  return (
    <div className="ad-agenda-legende">
      {personnes.length > 0 ? (
        <div role="group" aria-label="Surligner les créneaux d’une personne" className="ad-agenda-legende-personnes">
          {personnes.map((p) => {
            const choisi = selection === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className="ad-agenda-puce"
                aria-pressed={choisi}
                title={p.nom}
                onClick={() => onSelection(choisi ? null : p.id)}
              >
                <Pastille nom={p.nom} teinte={teinteDe(teintes, p.id)} taille="petite" muette />
                {/* Le prénom à l'œil, le nom complet au lecteur d'écran. */}
                <span aria-hidden="true">{prenom(p.nom)}</span>
                <span className="ad-agenda-sr">{p.nom}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="ad-agenda-mention">Personne ne tient de créneau cette semaine.</p>
      )}
      <LegendeEtats />
    </div>
  );
}

/** Les états d'une case, chacun avec son échantillon et son mot. */
export function LegendeEtats() {
  return (
    <ul className="ad-agenda-etats" aria-label="Ce que montrent les cases">
      <li>
        <span className="ad-agenda-echantillon" aria-hidden="true">
          <span className="ad-agenda-echantillon-rond" />
        </span>
        Accordé
      </li>
      <li>
        <span className="ad-agenda-echantillon ad-agenda-echantillon--attente" aria-hidden="true">
          <Hourglass size={14} />
        </span>
        En attente
      </li>
      <li>
        <span className="ad-agenda-echantillon ad-agenda-echantillon--conflit" aria-hidden="true">
          <TriangleAlert size={14} />
        </span>
        Conflit
      </li>
      <li>
        <span className="ad-agenda-echantillon" aria-hidden="true">
          <Repeat size={14} />
        </span>
        Échange ponctuel
      </li>
      <li>
        <span className="ad-agenda-echantillon ad-agenda-echantillon--conge" aria-hidden="true" />
        En congé
      </li>
      <li>
        <span className="ad-agenda-echantillon ad-agenda-echantillon--libre" aria-hidden="true">
          <Plus size={14} />
        </span>
        Libre
      </li>
    </ul>
  );
}
