"use client";

import { useState } from "react";
import { Bouton, Champ } from "@/components/admin/ui";
import { libelleCase } from "@/lib/agenda/salles";
import { lundiDe } from "@/lib/agenda/semaine";
import type { Voeu } from "@/lib/agenda/types";
import { aujourdhuiParis } from "./cases";

/**
 * Le formulaire de demande d'échange, ouvert depuis la case qu'on veut.
 *
 * Le demandeur choisit la portée, offre ou non une de ses cases, et
 * explique. Rien ne se décide ici : la base refait tous les contrôles, et
 * le titulaire puis un gérant ont le dernier mot.
 */
export default function DemanderEchange({
  cible,
  mesVoeux,
  occupe,
  onProposer,
  onAnnuler,
}: {
  cible: Voeu;
  /** Mes propres vœux accordés, offrables en contrepartie. */
  mesVoeux: Voeu[];
  occupe: boolean;
  onProposer: (args: {
    cible: string;
    offert: string | null;
    portee: "ponctuel" | "definitif";
    semaine: string | null;
    motif: string;
  }) => Promise<boolean>;
  onAnnuler: () => void;
}) {
  const [portee, setPortee] = useState<"ponctuel" | "definitif">("ponctuel");
  const [offert, setOffert] = useState("");
  // La semaine en cours à Paris, pas en UTC : le lundi à 0 h 30, c'est déjà la nouvelle semaine.
  const [semaine, setSemaine] = useState(() => lundiDe(aujourdhuiParis()));
  const [motif, setMotif] = useState("");

  const valide = motif.trim().length > 0 && (portee === "definitif" || semaine.length === 10);

  return (
    <div className="ad-agenda-bloc ad-agenda-bloc--accent">
      <p style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700 }}>
        Demander {libelleCase(cible.salle, cible.jour, cible.moment)}
      </p>

      <div style={{ display: "grid", gap: 14 }}>
        <Champ label="Pour quand">
          <select value={portee} onChange={(e) => setPortee(e.target.value as "ponctuel" | "definitif")}>
            <option value="ponctuel">Une seule semaine</option>
            <option value="definitif">De façon définitive</option>
          </select>
        </Champ>

        {portee === "ponctuel" ? (
          <Champ label="La semaine concernée" aide="Indiquez un jour : la semaine qui le contient est retenue.">
            <input
              type="date"
              value={semaine}
              onChange={(e) => setSemaine(e.target.value ? lundiDe(e.target.value) : "")}
            />
          </Champ>
        ) : null}

        <Champ label="Ce que vous donnez en retour (facultatif)">
          <select value={offert} onChange={(e) => setOffert(e.target.value)}>
            <option value="">Rien : je demande sans rendre</option>
            {mesVoeux.map((v) => (
              <option key={v.id} value={v.id}>
                {libelleCase(v.salle, v.jour, v.moment)}
              </option>
            ))}
          </select>
        </Champ>

        <Champ label="Pourquoi">
          <textarea rows={2} value={motif} onChange={(e) => setMotif(e.target.value)} />
        </Champ>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
        <Bouton
          disabled={!valide}
          enCours={occupe}
          onClick={() =>
            void onProposer({
              cible: cible.id,
              offert: offert || null,
              portee,
              semaine: portee === "ponctuel" ? semaine : null,
              motif,
            })
          }
        >
          Envoyer la demande
        </Bouton>
        <Bouton variante="discret" onClick={onAnnuler}>
          Annuler
        </Bouton>
      </div>
    </div>
  );
}
