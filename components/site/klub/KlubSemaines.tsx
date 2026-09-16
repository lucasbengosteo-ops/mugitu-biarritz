"use client";

import { useState } from "react";

/** Navigation entre les semaines du planning, rendues à l'avance côté serveur. */
export default function KlubSemaines({ libelles, panneaux }: { libelles: string[]; panneaux: React.ReactNode[] }) {
  const [i, setI] = useState(0);

  const fleche = (desactive: boolean): React.CSSProperties => ({
    width: 38,
    height: 38,
    borderRadius: "50%",
    border: "1px solid rgba(0,56,80,.18)",
    background: "#fff",
    color: "#003850",
    fontSize: 18,
    lineHeight: 1,
    cursor: desactive ? "default" : "pointer",
    opacity: desactive ? 0.35 : 1,
  });

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <button type="button" aria-label="Semaine précédente" disabled={i === 0} onClick={() => setI(i - 1)} style={fleche(i === 0)}>
          ‹
        </button>
        <span aria-live="polite" style={{ minWidth: 170, textAlign: "center", fontSize: 15, fontWeight: 600, color: "#003850" }}>
          {i === 0 ? "Cette semaine" : libelles[i]}
        </span>
        <button
          type="button"
          aria-label="Semaine suivante"
          disabled={i === panneaux.length - 1}
          onClick={() => setI(i + 1)}
          style={fleche(i === panneaux.length - 1)}
        >
          ›
        </button>
      </div>
      {panneaux[i]}
    </>
  );
}
