"use client";

import type { Ref } from "react";

/** Une question et ses réponses en gros boutons. Un toucher répond. */
export default function Choix<T extends string>({
  titre,
  aide,
  options,
  onChoisir,
  courant,
  titreRef,
}: {
  titre: string;
  aide?: React.ReactNode;
  options: readonly { id: T; label: string }[];
  onChoisir: (id: T) => void;
  courant?: T | null;
  /** Le titre reçoit le focus à chaque changement d'étape. */
  titreRef?: Ref<HTMLHeadingElement>;
}) {
  return (
    <fieldset className="po-choix">
      <legend className="po-legende">
        <h3 ref={titreRef} tabIndex={-1} className="po-question">
          {titre}
        </h3>
      </legend>
      {aide}
      <div className="po-options">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className="po-option"
            aria-pressed={courant === o.id}
            onClick={() => onChoisir(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
