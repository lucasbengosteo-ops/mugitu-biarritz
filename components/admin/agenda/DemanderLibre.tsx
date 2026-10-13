"use client";

import { useState } from "react";
import { Bouton, Message } from "@/components/admin/ui";
import { JOURS, nomSalle } from "@/lib/agenda/salles";
import Feuille from "./Feuille";

/**
 * « Demander Sua, mardi matin ? » : la confirmation ouverte en touchant une
 * case libre, « Créneaux libres » actif.
 *
 * La demande est un vœu de la semaine type, exactement comme une case
 * cochée dans « Mes demandes » : `onDemander` fait l'insertion, la base
 * contrôle, un gérant accorde ou refuse.
 *
 * Props
 * - `salle`, `jour` (1 = lundi), `moment` : la case.
 * - `onDemander` : insère le vœu ; `true` si c'est fait.
 * - `onFermer`   : ferme la feuille.
 */
export default function DemanderLibre({
  salle,
  jour,
  moment,
  onDemander,
  onFermer,
}: {
  salle: string;
  jour: number;
  moment: string;
  onDemander: () => Promise<boolean>;
  onFermer: () => void;
}) {
  const [occupe, setOccupe] = useState(false);
  const leJour = (JOURS[jour - 1] ?? "").toLowerCase();
  const leMoment = moment === "matin" ? "matin" : "après-midi";

  const [echec, setEchec] = useState(false);

  const demander = async () => {
    setOccupe(true);
    setEchec(false);
    const ok = await onDemander();
    setOccupe(false);
    if (ok) onFermer();
    else setEchec(true);
  };

  return (
    <Feuille titre={`Demander ${nomSalle(salle)}, ${leJour} ${leMoment} ?`} onFermer={onFermer}>
      {echec ? (
        <div style={{ marginBottom: 12 }}>
          <Message ton="erreur">La demande n’a pas pu être envoyée. Réessayez, ou rechargez la page.</Message>
        </div>
      ) : null}
      <p className="ad-agenda-texte" style={{ marginTop: 0 }}>
        La demande porte sur la semaine type : tous les {leJour}s {leMoment}, en salle {nomSalle(salle)}. Lucas et
        Jean-Baptiste l’accordent ou la refusent, et vous répondent dans le fil du créneau.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
        <Bouton enCours={occupe} onClick={() => void demander()}>
          Demander
        </Bouton>
        <Bouton variante="secondaire" disabled={occupe} onClick={onFermer}>
          Annuler
        </Bouton>
      </div>
    </Feuille>
  );
}
