"use client";

import type { Ref } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";

/** Une question et ses réponses en gros boutons. Un toucher répond. */
export default function Choix<T extends string>({
  titre,
  aide,
  options,
  onChoisir,
  courant,
  titreRef,
  icones,
}: {
  titre: string;
  aide?: React.ReactNode;
  options: readonly { id: T; label: string }[];
  onChoisir: (id: T) => void;
  courant?: T | null;
  /** Le titre reçoit le focus à chaque changement d'étape. */
  titreRef?: Ref<HTMLHeadingElement>;
  /** Une icône par réponse, facultative : elle précède le libellé. */
  icones?: Partial<Record<T, LucideIcon>>;
}) {
  return (
    <fieldset className="po-choix">
      <legend className="po-legende">
        <h3 ref={titreRef} tabIndex={-1} className="po-question">
          {titre}
        </h3>
      </legend>
      {aide}
      <div className={`po-options${icones ? " po-options--icones" : ""}`}>
        {options.map((o) => {
          const Icone: LucideIcon | undefined = icones?.[o.id];
          return (
            <button
              key={o.id}
              type="button"
              className="po-option"
              aria-pressed={courant === o.id}
              onClick={() => onChoisir(o.id)}
            >
              {Icone ? (
                <span className="po-option-icone" aria-hidden="true">
                  <Icone size={20} strokeWidth={1.75} />
                </span>
              ) : null}
              <span className="po-option-texte">{o.label}</span>
              <ChevronRight className="po-option-fleche" aria-hidden="true" size={18} />
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
