"use client";

import { useState } from "react";
import { Badge, Bouton, Champ, Message, type TonBadge } from "@/components/admin/ui";
import { etatCase } from "@/lib/agenda/grille";
import { libelleCase } from "@/lib/agenda/salles";
import type { Commentaire, Personne, Voeu } from "@/lib/agenda/types";
import DemanderEchange from "./DemanderEchange";
import Feuille from "./Feuille";

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
  /** Mes propres vœux accordés, offrables en contrepartie d'un échange. */
  mesVoeuxAccordes: Voeu[];
  onProposerEchange: (args: {
    cible: string;
    offert: string | null;
    portee: "ponctuel" | "definitif";
    semaine: string | null;
    motif: string;
  }) => Promise<boolean>;
  onFermer: () => void;
  onAgir: (nom: string, args: Record<string, unknown>) => Promise<boolean>;
  /** Le dernier message d'erreur de l'écran, répété ici : le reste de la page est derrière la feuille. */
  erreur?: string | null;
};

const RANGEE: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 };

export default function CaseDetail({
  salle,
  jour,
  moment,
  voeux,
  commentaires,
  personnes,
  moi,
  estGerant,
  mesVoeuxAccordes,
  onProposerEchange,
  onFermer,
  onAgir,
  erreur,
}: Props) {
  const [texte, setTexte] = useState("");
  const [occupe, setOccupe] = useState(false);
  const [demande, setDemande] = useState(false);
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

  const sousTitre = `${
    e.occupant ? `Tenu par ${personnes[e.occupant.user_id]?.nom ?? "—"}` : "Personne ne tient ce créneau."
  }${e.enConflit ? " · plusieurs demandes en attente" : ""}`;

  return (
    <Feuille titre={libelleCase(salle, jour, moment)} sousTitre={sousTitre} onFermer={onFermer}>
      {erreur ? (
        <div style={{ marginBottom: 16 }}>
          <Message ton="erreur">{erreur}</Message>
        </div>
      ) : null}
      {tous.some((v) => v.user_id === moi) || estGerant ? (
        <div style={{ marginBottom: 16 }}>
          <Champ label="Votre message" aide="Joint à la décision, ou envoyé seul.">
            <textarea rows={3} value={texte} onChange={(ev) => setTexte(ev.target.value)} />
          </Champ>
        </div>
      ) : null}

      {tous.length === 0 ? <p className="ad-agenda-texte">Aucune demande sur ce créneau.</p> : null}

      {tous.map((v) => {
        const fil = commentaires.filter((c) => c.voeu_id === v.id);
        const estMien = v.user_id === moi;
        const statut = STATUTS[v.statut];
        return (
          <div key={v.id} className="ad-agenda-bloc">
            <p style={{ margin: 0, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
              <strong style={{ fontSize: 15 }}>{personnes[v.user_id]?.nom ?? "—"}</strong>
              <Badge ton={statut.ton}>{statut.mot}</Badge>
            </p>

            {fil.length > 0 ? (
              <ul className="ad-agenda-fil">
                {fil.map((c) => (
                  <li key={c.id}>
                    <strong>{personnes[c.auteur_id]?.nom ?? "—"} : </strong>
                    {c.texte}
                  </li>
                ))}
              </ul>
            ) : null}

            {estGerant && (v.statut === "propose" || v.statut === "refuse") ? (
              <div style={RANGEE}>
                <Bouton
                  taille="petite"
                  disabled={occupe}
                  onClick={() => void agir("agenda_decider", { p_voeu: v.id, p_statut: "valide", p_commentaire: texte })}
                >
                  Accorder
                </Bouton>
                <Bouton
                  taille="petite"
                  variante="danger"
                  disabled={occupe}
                  onClick={() => void agir("agenda_decider", { p_voeu: v.id, p_statut: "refuse", p_commentaire: texte })}
                >
                  Refuser
                </Bouton>
              </div>
            ) : null}

            {estGerant && v.statut === "retrait_demande" ? (
              <div style={RANGEE}>
                <Bouton
                  taille="petite"
                  disabled={occupe}
                  onClick={() => void agir("agenda_trancher_retrait", { p_voeu: v.id, p_accorde: true, p_commentaire: texte })}
                >
                  Accorder le retrait
                </Bouton>
                <Bouton
                  taille="petite"
                  variante="danger"
                  disabled={occupe}
                  onClick={() => void agir("agenda_trancher_retrait", { p_voeu: v.id, p_accorde: false, p_commentaire: texte })}
                >
                  Refuser le retrait
                </Bouton>
              </div>
            ) : null}

            {estMien || estGerant ? (
              <div style={RANGEE}>
                {estMien && v.statut === "valide" ? (
                  <Bouton
                    taille="petite"
                    variante="danger"
                    disabled={occupe || texte.trim().length === 0}
                    onClick={() => void agir("agenda_demander_retrait", { p_voeu: v.id, p_motif: texte })}
                  >
                    Demander à le rendre
                  </Bouton>
                ) : null}
                <Bouton
                  taille="petite"
                  variante="secondaire"
                  disabled={occupe || texte.trim().length === 0}
                  onClick={() => void agir("agenda_commenter", { p_voeu: v.id, p_texte: texte })}
                >
                  Envoyer le message
                </Bouton>
              </div>
            ) : null}
            {estMien && v.statut === "valide" && texte.trim().length === 0 ? (
              <p className="ad-agenda-mention" style={{ marginTop: 8 }}>
                Pour rendre ce créneau, expliquez pourquoi dans « Votre message ».
              </p>
            ) : null}
          </div>
        );
      })}

      {e.occupant && e.occupant.user_id !== moi ? (
        demande ? (
          <DemanderEchange
            cible={e.occupant}
            mesVoeux={mesVoeuxAccordes}
            occupe={occupe}
            onProposer={async (args) => {
              setOccupe(true);
              const ok = await onProposerEchange(args);
              setOccupe(false);
              if (ok) {
                setDemande(false);
                onFermer();
              }
              return ok;
            }}
            onAnnuler={() => setDemande(false)}
          />
        ) : (
          <Bouton variante="secondaire" disabled={occupe} onClick={() => setDemande(true)}>
            Demander un échange
          </Bouton>
        )
      ) : null}

      <div style={{ marginTop: 16 }}>
        <Bouton variante="discret" onClick={onFermer}>
          Fermer
        </Bouton>
      </div>
    </Feuille>
  );
}

const STATUTS: Record<Voeu["statut"], { mot: string; ton: TonBadge }> = {
  valide: { mot: "accordé", ton: "succes" },
  propose: { mot: "en attente", ton: "attente" },
  refuse: { mot: "refusé", ton: "alerte" },
  retrait_demande: { mot: "retrait demandé", ton: "attente" },
};
