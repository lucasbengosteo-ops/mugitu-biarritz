"use client";

import { etatCase, type Voeu } from "@/lib/agenda/grille";
import { JOURS, MOMENTS, SALLES } from "@/lib/agenda/salles";
import type { Personne } from "@/lib/agenda/types";

/**
 * La grille des cinq salles sur la semaine, rendue deux fois : une fois
 * pour ses propres vœux (`mode="mien"`, on coche), une fois pour tout le
 * cabinet (`mode="cabinet"`, on consulte et on ouvre le détail).
 *
 * Sur écran étroit, la grille se lit salle par salle : dix colonnes ne
 * tiennent pas sur un téléphone.
 */

const CASE_BASE: React.CSSProperties = {
  border: "1px solid rgba(0,56,80,.1)",
  borderRadius: 8,
  padding: "6px 8px",
  fontSize: 11.5,
  minHeight: 38,
  textAlign: "left",
  width: "100%",
  cursor: "pointer",
  background: "#fff",
  color: "#003850",
};

const TEINTE: Record<string, React.CSSProperties> = {
  vide: {},
  mien: { background: "rgba(4,164,155,.12)", borderColor: "#04A49B", fontWeight: 700 },
  propose: { background: "rgba(243,190,121,.22)", borderColor: "rgba(243,190,121,.6)" },
  occupe: { background: "rgba(0,56,80,.06)" },
  conflit: { background: "rgba(238,128,108,.16)", borderColor: "#EE806C" },
};

export default function Grille({
  voeux,
  personnes,
  moi,
  mode,
  onCase,
}: {
  voeux: Voeu[];
  personnes: Record<string, Personne>;
  moi: string;
  mode: "mien" | "cabinet";
  onCase: (salle: string, jour: number, moment: string) => void;
}) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      {SALLES.map((salle) => (
        <section key={salle.id}>
          <h3 style={{ margin: "0 0 2px", fontSize: 14, color: "#003850" }}>{salle.nom}</h3>
          <p style={{ margin: "0 0 8px", fontSize: 11.5, color: "rgba(0,56,80,.55)" }}>{salle.vocation}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 6 }}>
            {JOURS.map((jourLabel, i) => (
              <div key={jourLabel} style={{ display: "grid", gap: 4 }}>
                <div style={{ fontSize: 11, color: "rgba(0,56,80,.55)", textAlign: "center" }}>{jourLabel}</div>
                {MOMENTS.map((m) => {
                  const e = etatCase(voeux, salle.id, i + 1, m.id);
                  const mien = [e.occupant, ...e.demandes].find((v) => v?.user_id === moi) ?? null;
                  const teinte = e.enConflit
                    ? TEINTE.conflit
                    : mien
                      ? mien.statut === "propose"
                        ? TEINTE.propose
                        : TEINTE.mien
                      : e.occupant
                        ? TEINTE.occupe
                        : TEINTE.vide;
                  const nomOccupant = e.occupant ? (personnes[e.occupant.user_id]?.nom ?? "—") : "";
                  return (
                    <button
                      key={m.id}
                      type="button"
                      style={{ ...CASE_BASE, ...teinte }}
                      onClick={() => onCase(salle.id, i + 1, m.id)}
                      aria-label={`${salle.nom}, ${jourLabel} ${m.label}`}
                    >
                      <span style={{ display: "block", fontSize: 10, opacity: 0.6 }}>{m.label}</span>
                      {mode === "cabinet" && nomOccupant ? <span>{nomOccupant}</span> : null}
                      {mode === "mien" && mien ? <span>{libelleStatut(mien.statut)}</span> : null}
                      {e.demandes.length > 0 ? (
                        <span style={{ display: "block", fontSize: 10, opacity: 0.7 }}>
                          {e.demandes.length} en attente
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function libelleStatut(s: Voeu["statut"]): string {
  if (s === "valide") return "Accordé";
  if (s === "propose") return "Demandé";
  if (s === "refuse") return "Refusé";
  return "Retrait demandé";
}
