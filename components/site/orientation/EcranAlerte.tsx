import type { Ref } from "react";
import { Phone } from "lucide-react";

/** L'écran qui arrête le parcours. Aucune suggestion dessous. */
export default function EcranAlerte({
  onRecommencer,
  titreRef,
}: {
  onRecommencer: () => void;
  titreRef?: Ref<HTMLHeadingElement>;
}) {
  return (
    <div className="po-alerte" role="alert">
      <h3 ref={titreRef} tabIndex={-1} className="po-alerte-titre">
        <Phone aria-hidden="true" size={22} /> Demandez un avis médical rapidement
      </h3>
      <p>
        Ce que vous décrivez demande un avis médical rapide. En cas d’urgence, appelez le <a href="tel:15">15</a> ou le{" "}
        <a href="tel:112">112</a>. Sinon, consultez votre médecin traitant ou un service d’urgence aujourd’hui.
      </p>
      <button type="button" className="po-lien-bouton" onClick={onRecommencer}>
        Recommencer
      </button>
    </div>
  );
}
