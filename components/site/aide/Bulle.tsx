"use client";

import type { Ref } from "react";
import { MessageCircle, X } from "lucide-react";

/** Le bouton rond en bas à droite : ouvre et ferme le panneau d'aide. */
export default function Bulle({
  ouvert,
  onBasculer,
  controle,
  boutonRef,
}: {
  ouvert: boolean;
  onBasculer: () => void;
  /** L'identifiant du panneau. */
  controle: string;
  boutonRef: Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={boutonRef}
      type="button"
      className={`wa-bulle${ouvert ? " wa-bulle--ouverte" : ""}`}
      aria-label={ouvert ? "Fermer l’aide" : "Ouvrir l’aide"}
      aria-expanded={ouvert}
      aria-controls={controle}
      onClick={onBasculer}
    >
      {ouvert ? <X aria-hidden="true" size={26} /> : <MessageCircle aria-hidden="true" size={26} />}
    </button>
  );
}
