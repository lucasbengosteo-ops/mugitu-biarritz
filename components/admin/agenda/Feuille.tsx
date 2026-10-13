"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

/**
 * Une feuille modale : monte du bas sur téléphone, centrée sur ordinateur.
 *
 * Un `<dialog>` natif ouvert par `showModal()` : le reste de la page devient
 * inerte, le focus reste dedans, Échap ferme. À la fermeture, le focus
 * revient à l'élément qui l'avait (la case touchée).
 *
 * Props
 * - `titre`      : le titre (`h2`), qui nomme la boîte de dialogue.
 * - `sousTitre?` : une ligne sous le titre.
 * - `onFermer`   : appelé par Échap, le bouton « Fermer » ou un toucher hors de la feuille.
 * - `children`   : le contenu.
 */
export default function Feuille({
  titre,
  sousTitre,
  onFermer,
  children,
}: {
  titre: React.ReactNode;
  sousTitre?: React.ReactNode;
  onFermer: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const idTitre = useId();

  useEffect(() => {
    const dialogue = ref.current;
    const avant = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (dialogue && !dialogue.open) dialogue.showModal();
    return () => {
      if (dialogue?.open) dialogue.close();
      avant?.focus();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className="ad-agenda-feuille"
      aria-labelledby={idTitre}
      onCancel={(e) => {
        // Échap : on laisse React démonter la feuille plutôt que le navigateur la fermer seul.
        e.preventDefault();
        onFermer();
      }}
      onClick={(e) => {
        // Un toucher sur le voile (hors du contenu) touche le `<dialog>` lui-même.
        if (e.target === e.currentTarget) onFermer();
      }}
    >
      <div className="ad-agenda-feuille-corps">
        <div className="ad-agenda-feuille-tete">
          <div style={{ minWidth: 0 }}>
            <h2 id={idTitre} className="ad-agenda-feuille-titre">
              {titre}
            </h2>
            {sousTitre ? <p className="ad-agenda-feuille-sous-titre">{sousTitre}</p> : null}
          </div>
          <button type="button" className="ad-bouton-icone" aria-label="Fermer" onClick={onFermer}>
            <X aria-hidden="true" size={20} strokeWidth={1.75} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
