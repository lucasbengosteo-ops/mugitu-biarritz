"use client";

import { useEffect, useRef } from "react";

/**
 * Rangée d'onglets. Elle défile horizontalement sur téléphone au lieu de
 * passer à la ligne (classe `.ad-onglets`).
 *
 * Props
 * - `onglets`    : `{ id, label, compte? }[]` — `compte` affiche un nombre
 *   à côté du libellé (lu avec lui : « Échanges 2 »).
 * - `actif`      : l'`id` de l'onglet sélectionné.
 * - `onChange`   : `(id) => void`, appelé au clic et au clavier.
 * - `label`      : nom de la rangée pour les lecteurs d'écran (`aria-label`).
 * - `panneauId?` : `id` de l'élément qui affiche le contenu de l'onglet
 *   actif ; le relie par `aria-controls`. L'appelant donne à cet élément
 *   `role="tabpanel"` et `aria-labelledby={ongletId(panneauId, actif)}`.
 *
 * Clavier : flèches gauche/droite (avec retour au début), Début, Fin. La
 * sélection suit le focus. Seul l'onglet actif est dans l'ordre de tabulation.
 *
 * L'onglet actif est toujours ramené dans la rangée visible, y compris quand
 * il vient de l'adresse (`?vue=…`) ou d'un lien : la rangée défile seule,
 * jamais la page.
 */
export type Onglet<T extends string = string> = { id: T; label: string; compte?: number };

/** `id` du bouton d'un onglet, pour l'`aria-labelledby` du panneau. */
export function ongletId(panneauId: string, id: string): string {
  return `${panneauId}-onglet-${id}`;
}

export default function Onglets<T extends string>({
  onglets,
  actif,
  onChange,
  label,
  panneauId,
}: {
  onglets: Onglet<T>[];
  actif: T;
  onChange: (id: T) => void;
  label: string;
  panneauId?: string;
}) {
  const rangee = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let actifEncore = true;
    const ramener = () => {
      const r = rangee.current;
      const bouton = r?.querySelector<HTMLElement>(`[data-onglet="${CSS.escape(actif)}"]`);
      if (!actifEncore || !r || !bouton) return;
      // On laisse dépasser un bout de l'onglet voisin : il dit qu'il y en a d'autres.
      const marge = 32;
      // Position du bouton dans la rangée, quel que soit son ancêtre positionné.
      const gauche = bouton.getBoundingClientRect().left - r.getBoundingClientRect().left + r.scrollLeft;
      const droite = gauche + bouton.offsetWidth;
      if (gauche < r.scrollLeft) r.scrollLeft = gauche - marge;
      else if (droite > r.scrollLeft + r.clientWidth) r.scrollLeft = droite - r.clientWidth + marge;
    };
    ramener();
    // La police web élargit les onglets en arrivant : on recale une fois chargée.
    void document.fonts?.ready.then(ramener);
    return () => {
      actifEncore = false;
    };
  }, [actif]);

  const allerA = (index: number) => {
    const o = onglets[(index + onglets.length) % onglets.length];
    if (!o) return;
    onChange(o.id);
    const bouton = rangee.current?.querySelector<HTMLButtonElement>(`[data-onglet="${CSS.escape(o.id)}"]`);
    bouton?.focus();
  };

  const auClavier = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") allerA(index + 1);
    else if (e.key === "ArrowLeft") allerA(index - 1);
    else if (e.key === "Home") allerA(0);
    else if (e.key === "End") allerA(onglets.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div ref={rangee} role="tablist" aria-label={label} className="ad-onglets">
      {onglets.map((o, i) => {
        const selectionne = o.id === actif;
        return (
          <button
            key={o.id}
            type="button"
            role="tab"
            data-onglet={o.id}
            id={panneauId ? ongletId(panneauId, o.id) : undefined}
            aria-selected={selectionne}
            aria-controls={panneauId && selectionne ? panneauId : undefined}
            tabIndex={selectionne ? 0 : -1}
            className="ad-onglet"
            onClick={() => onChange(o.id)}
            onKeyDown={(e) => auClavier(e, i)}
          >
            {o.label}
            {o.compte !== undefined ? <span className="ad-onglet-compte">{o.compte}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
