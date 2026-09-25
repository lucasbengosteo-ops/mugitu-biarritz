"use client";

import { useState } from "react";
import type { Absence, Personne } from "@/lib/agenda/types";

/**
 * Les absences : une liste de plages, qu'on ajoute et qu'on retire.
 *
 * Aucune validation à demander : on ne demande pas la permission de prendre
 * ses congés. Les gérants sont prévenus par un mail, posé par un
 * déclencheur en base — cet écran n'a donc rien à envoyer.
 *
 * Une absence ne se modifie pas : on la retire et on la repose. C'est ce
 * que dit la base, qui n'a aucune politique d'`update`.
 */

const CHAMP: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid rgba(0,56,80,.16)",
  fontSize: 13.5,
  fontFamily: "inherit",
};

export default function MesConges({
  absences,
  personnes,
  moi,
  estGerant,
  onAjouter,
  onRetirer,
}: {
  absences: Absence[];
  personnes: Record<string, Personne>;
  moi: string;
  estGerant: boolean;
  onAjouter: (du: string, au: string, motif: string) => Promise<boolean>;
  onRetirer: (id: string) => Promise<boolean>;
}) {
  const [du, setDu] = useState("");
  const [au, setAu] = useState("");
  const [motif, setMotif] = useState("");
  const [occupe, setOccupe] = useState(false);

  const miennes = absences.filter((a) => a.user_id === moi);
  const autres = absences.filter((a) => a.user_id !== moi);

  const ajouter = async () => {
    setOccupe(true);
    const ok = await onAjouter(du, au || du, motif);
    setOccupe(false);
    if (ok) {
      setDu("");
      setAu("");
      setMotif("");
    }
  };

  const valide = du.length === 10 && (au.length === 0 || au >= du);

  return (
    <div>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: "rgba(0,56,80,.65)" }}>
        Déclarez vos congés, formations et arrêts. Rien à faire valider : la grille du cabinet vous
        affichera absent sur les semaines concernées, et Lucas et Jean-Baptiste sont prévenus.
      </p>

      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "flex-end",
          background: "#fff",
          borderRadius: 12,
          padding: 14,
          marginBottom: 18,
          boxShadow: "0 2px 10px rgba(60,40,30,.06)",
        }}
      >
        <label style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: 11.5, color: "rgba(0,56,80,.6)" }}>Du</span>
          <input type="date" style={CHAMP} value={du} onChange={(e) => setDu(e.target.value)} />
        </label>
        <label style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: 11.5, color: "rgba(0,56,80,.6)" }}>Au (vide = un seul jour)</span>
          <input type="date" style={CHAMP} value={au} min={du || undefined} onChange={(e) => setAu(e.target.value)} />
        </label>
        <label style={{ display: "grid", gap: 4, flex: 1, minWidth: 160 }}>
          <span style={{ fontSize: 11.5, color: "rgba(0,56,80,.6)" }}>Motif (facultatif)</span>
          <input type="text" style={CHAMP} value={motif} onChange={(e) => setMotif(e.target.value)} />
        </label>
        <button
          type="button"
          disabled={occupe || !valide}
          onClick={() => void ajouter()}
          style={{
            padding: "9px 16px",
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
          Ajouter
        </button>
      </div>

      <h3 style={{ margin: "0 0 8px", fontSize: 14, color: "#003850" }}>Mes absences</h3>
      {miennes.length === 0 ? (
        <p style={{ fontSize: 13, color: "rgba(0,56,80,.6)" }}>Aucune absence déclarée.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px" }}>
          {miennes.map((a) => (
            <Ligne
              key={a.id}
              absence={a}
              nom={null}
              occupe={occupe}
              onRetirer={async () => {
                setOccupe(true);
                await onRetirer(a.id);
                setOccupe(false);
              }}
            />
          ))}
        </ul>
      )}

      <h3 style={{ margin: "0 0 8px", fontSize: 14, color: "#003850" }}>Le reste de l’équipe</h3>
      {autres.length === 0 ? (
        <p style={{ fontSize: 13, color: "rgba(0,56,80,.6)" }}>Personne d’autre n’a déclaré d’absence.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {autres.map((a) => (
            <Ligne
              key={a.id}
              absence={a}
              nom={personnes[a.user_id]?.nom ?? "—"}
              occupe={occupe}
              onRetirer={
                estGerant
                  ? async () => {
                      setOccupe(true);
                      await onRetirer(a.id);
                      setOccupe(false);
                    }
                  : null
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function Ligne({
  absence,
  nom,
  occupe,
  onRetirer,
}: {
  absence: Absence;
  nom: string | null;
  occupe: boolean;
  onRetirer: (() => Promise<void>) | null;
}) {
  return (
    <li
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        padding: "9px 0",
        borderTop: "1px solid rgba(0,56,80,.08)",
        fontSize: 13,
      }}
    >
      <span>
        {nom ? <strong style={{ marginRight: 6 }}>{nom}</strong> : null}
        {periode(absence)}
        {absence.motif ? <span style={{ opacity: 0.6 }}> · {absence.motif}</span> : null}
      </span>
      {onRetirer ? (
        <button
          type="button"
          disabled={occupe}
          onClick={() => void onRetirer()}
          style={{
            background: "none",
            border: "none",
            color: "#9E4433",
            fontSize: 12.5,
            cursor: occupe ? "not-allowed" : "pointer",
            padding: 0,
          }}
        >
          Retirer
        </button>
      ) : null}
    </li>
  );
}

function periode(a: Absence): string {
  if (a.du === a.au) return `le ${jour(a.du)}`;
  return `du ${jour(a.du)} au ${jour(a.au)}`;
}

function jour(iso: string): string {
  const [an, mois, j] = iso.split("-");
  return `${Number(j)}/${mois}/${an}`;
}
