"use client";

import { useState } from "react";
import { libelleCase } from "@/lib/agenda/salles";
import { lundiDe } from "@/lib/agenda/semaine";
import type { Voeu } from "@/lib/agenda/types";

/**
 * Le formulaire de demande d'échange, ouvert depuis la case qu'on veut.
 *
 * Le demandeur choisit la portée, offre ou non une de ses cases, et
 * explique. Rien ne se décide ici : la base refait tous les contrôles, et
 * le titulaire puis un gérant ont le dernier mot.
 */

const CHAMP: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid rgba(0,56,80,.16)",
  fontSize: 13.5,
  fontFamily: "inherit",
};

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
  const [semaine, setSemaine] = useState(() => lundiDe(new Date().toISOString().slice(0, 10)));
  const [motif, setMotif] = useState("");

  const valide = motif.trim().length > 0 && (portee === "definitif" || semaine.length === 10);

  return (
    <div
      style={{
        border: "1px solid rgba(4,164,155,.4)",
        background: "rgba(4,164,155,.05)",
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
      }}
    >
      <p style={{ margin: "0 0 10px", fontSize: 13.5, fontWeight: 600, color: "#003850" }}>
        Demander {libelleCase(cible.salle, cible.jour, cible.moment)}
      </p>

      <div style={{ display: "grid", gap: 10 }}>
        <label style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: 11.5, color: "rgba(0,56,80,.6)" }}>Pour quand</span>
          <select style={CHAMP} value={portee} onChange={(e) => setPortee(e.target.value as "ponctuel" | "definitif")}>
            <option value="ponctuel">Une seule semaine</option>
            <option value="definitif">De façon définitive</option>
          </select>
        </label>

        {portee === "ponctuel" ? (
          <label style={{ display: "grid", gap: 4 }}>
            <span style={{ fontSize: 11.5, color: "rgba(0,56,80,.6)" }}>
              La semaine concernée — indiquez un lundi
            </span>
            <input
              type="date"
              style={CHAMP}
              value={semaine}
              onChange={(e) => setSemaine(e.target.value ? lundiDe(e.target.value) : "")}
            />
          </label>
        ) : null}

        <label style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: 11.5, color: "rgba(0,56,80,.6)" }}>
            Ce que vous donnez en retour (facultatif)
          </span>
          <select style={CHAMP} value={offert} onChange={(e) => setOffert(e.target.value)}>
            <option value="">Rien : je demande sans rendre</option>
            {mesVoeux.map((v) => (
              <option key={v.id} value={v.id}>
                {libelleCase(v.salle, v.jour, v.moment)}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: 11.5, color: "rgba(0,56,80,.6)" }}>Pourquoi</span>
          <textarea rows={2} style={CHAMP} value={motif} onChange={(e) => setMotif(e.target.value)} />
        </label>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          type="button"
          disabled={occupe || !valide}
          onClick={() =>
            void onProposer({
              cible: cible.id,
              offert: offert || null,
              portee,
              semaine: portee === "ponctuel" ? semaine : null,
              motif,
            })
          }
          style={{
            padding: "7px 14px",
            borderRadius: 999,
            border: "none",
            background: "#04A49B",
            color: "#fff",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: occupe || !valide ? "not-allowed" : "pointer",
            opacity: occupe || !valide ? 0.55 : 1,
          }}
        >
          Envoyer la demande
        </button>
        <button
          type="button"
          onClick={onAnnuler}
          style={{
            background: "none",
            border: "none",
            color: "rgba(0,56,80,.6)",
            fontSize: 12.5,
            cursor: "pointer",
            padding: 0,
          }}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
