"use client";

import { useState } from "react";
import { etatCase } from "@/lib/agenda/grille";
import { libelleCase } from "@/lib/agenda/salles";
import type { Commentaire, Personne, Voeu } from "@/lib/agenda/types";

/**
 * Le panneau d'une case : qui la tient, qui la demande, le fil de
 * discussion, et les gestes possibles selon qui regarde.
 *
 * Toutes les décisions passent par `onAgir`, qui appelle une fonction
 * `agenda_*` en base : l'écran ne décide de rien, il propose.
 */

type Props = {
  salle: string;
  jour: number;
  moment: string;
  voeux: Voeu[];
  commentaires: Commentaire[];
  personnes: Record<string, Personne>;
  moi: string;
  estGerant: boolean;
  onFermer: () => void;
  onAgir: (nom: string, args: Record<string, unknown>) => Promise<boolean>;
};

const VOILE: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,32,45,.35)",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  zIndex: 50,
};

const PANNEAU: React.CSSProperties = {
  background: "#fff",
  borderRadius: "16px 16px 0 0",
  padding: 20,
  width: "min(560px, 100%)",
  maxHeight: "85vh",
  overflowY: "auto",
};

const CHAMP: React.CSSProperties = {
  width: "100%",
  padding: "9px 11px",
  borderRadius: 8,
  border: "1px solid rgba(0,56,80,.16)",
  fontSize: 13.5,
  fontFamily: "inherit",
};

export default function CaseDetail({
  salle,
  jour,
  moment,
  voeux,
  commentaires,
  personnes,
  moi,
  estGerant,
  onFermer,
  onAgir,
}: Props) {
  const [texte, setTexte] = useState("");
  const [occupe, setOccupe] = useState(false);
  const e = etatCase(voeux, salle, jour, moment);
  const tous = [e.occupant, ...e.demandes].filter((v): v is Voeu => v !== null);

  const agir = async (nom: string, args: Record<string, unknown>) => {
    setOccupe(true);
    const ok = await onAgir(nom, args);
    setOccupe(false);
    if (ok) {
      setTexte("");
      onFermer();
    }
  };

  return (
    <div style={VOILE} onClick={onFermer} role="presentation">
      <div style={PANNEAU} onClick={(ev) => ev.stopPropagation()} role="dialog" aria-modal="true">
        <p style={{ margin: "0 0 2px", fontSize: 17, fontWeight: 700, color: "#003850" }}>
          {libelleCase(salle, jour, moment)}
        </p>
        <p style={{ margin: "0 0 16px", fontSize: 12.5, color: "rgba(0,56,80,.6)" }}>
          {e.occupant
            ? `Tenu par ${personnes[e.occupant.user_id]?.nom ?? "—"}`
            : "Personne ne tient ce créneau."}
          {e.enConflit ? " · plusieurs demandes en attente" : ""}
        </p>

        {tous.length === 0 ? <p style={{ fontSize: 13 }}>Aucune demande sur ce créneau.</p> : null}

        {tous.map((v) => {
          const fil = commentaires.filter((c) => c.voeu_id === v.id);
          const estMien = v.user_id === moi;
          return (
            <div
              key={v.id}
              style={{
                border: "1px solid rgba(0,56,80,.1)",
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <p style={{ margin: "0 0 8px", fontSize: 13.5, fontWeight: 600, color: "#003850" }}>
                {personnes[v.user_id]?.nom ?? "—"} · {libelleStatut(v.statut)}
              </p>

              {fil.map((c) => (
                <p key={c.id} style={{ margin: "0 0 6px", fontSize: 12.5, lineHeight: 1.55 }}>
                  <span style={{ fontWeight: 600 }}>{personnes[c.auteur_id]?.nom ?? "—"} : </span>
                  {c.texte}
                </p>
              ))}

              {estGerant && (v.statut === "propose" || v.statut === "refuse") ? (
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <Bouton
                    ton="ok"
                    disabled={occupe}
                    onClick={() => void agir("agenda_decider", { p_voeu: v.id, p_statut: "valide", p_commentaire: texte })}
                  >
                    Accorder
                  </Bouton>
                  <Bouton
                    ton="non"
                    disabled={occupe}
                    onClick={() => void agir("agenda_decider", { p_voeu: v.id, p_statut: "refuse", p_commentaire: texte })}
                  >
                    Refuser
                  </Bouton>
                </div>
              ) : null}

              {estGerant && v.statut === "retrait_demande" ? (
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <Bouton
                    ton="ok"
                    disabled={occupe}
                    onClick={() => void agir("agenda_trancher_retrait", { p_voeu: v.id, p_accorde: true, p_commentaire: texte })}
                  >
                    Accorder le retrait
                  </Bouton>
                  <Bouton
                    ton="non"
                    disabled={occupe}
                    onClick={() => void agir("agenda_trancher_retrait", { p_voeu: v.id, p_accorde: false, p_commentaire: texte })}
                  >
                    Refuser le retrait
                  </Bouton>
                </div>
              ) : null}

              {estMien && v.statut === "valide" ? (
                <Bouton
                  ton="non"
                  disabled={occupe || texte.trim().length === 0}
                  onClick={() => void agir("agenda_demander_retrait", { p_voeu: v.id, p_motif: texte })}
                >
                  Demander à le rendre
                </Bouton>
              ) : null}

              {estMien || estGerant ? (
                <Bouton
                  ton="neutre"
                  disabled={occupe || texte.trim().length === 0}
                  onClick={() => void agir("agenda_commenter", { p_voeu: v.id, p_texte: texte })}
                >
                  Envoyer le message
                </Bouton>
              ) : null}
            </div>
          );
        })}

        {tous.some((v) => v.user_id === moi) || estGerant ? (
          <label style={{ display: "block", marginTop: 4 }}>
            <span style={{ display: "block", fontSize: 12, marginBottom: 4, color: "rgba(0,56,80,.6)" }}>
              Votre message — joint à la décision ou envoyé seul
            </span>
            <textarea rows={3} style={CHAMP} value={texte} onChange={(ev) => setTexte(ev.target.value)} />
          </label>
        ) : null}

        <button
          type="button"
          onClick={onFermer}
          style={{
            marginTop: 14,
            background: "none",
            border: "none",
            color: "rgba(0,56,80,.6)",
            fontSize: 13,
            cursor: "pointer",
            padding: 0,
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

function Bouton({
  ton,
  children,
  ...reste
}: { ton: "ok" | "non" | "neutre" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const fond = ton === "ok" ? "#04A49B" : ton === "non" ? "#EE806C" : "rgba(0,56,80,.08)";
  const texte = ton === "neutre" ? "#003850" : "#fff";
  return (
    <button
      type="button"
      {...reste}
      style={{
        padding: "7px 13px",
        borderRadius: 999,
        border: "none",
        background: fond,
        color: texte,
        fontSize: 12.5,
        fontWeight: 600,
        cursor: reste.disabled ? "not-allowed" : "pointer",
        opacity: reste.disabled ? 0.55 : 1,
        marginRight: 8,
        marginTop: 8,
      }}
    >
      {children}
    </button>
  );
}

function libelleStatut(s: Voeu["statut"]): string {
  if (s === "valide") return "accordé";
  if (s === "propose") return "en attente";
  if (s === "refuse") return "refusé";
  return "retrait demandé";
}
