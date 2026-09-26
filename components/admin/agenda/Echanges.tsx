"use client";

import { libelleCase } from "@/lib/agenda/salles";
import type { Echange, Personne, Voeu } from "@/lib/agenda/types";

/**
 * Les échanges : ce qui attend une réponse de moi, ce que j'ai demandé, et
 * pour les gérants ce qui attend un arbitrage.
 *
 * La demande ne se lance pas ici mais depuis une case de la grille : c'est
 * en regardant la grille qu'on voit ce qu'on veut.
 */

const CARTE: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  padding: 14,
  marginBottom: 10,
  boxShadow: "0 2px 10px rgba(60,40,30,.06)",
  fontSize: 13,
};

const LIBELLE_STATUT: Record<Echange["statut"], string> = {
  propose: "en attente de réponse",
  accepte_pair: "en attente d’arbitrage",
  refuse_pair: "refusé par le titulaire",
  valide: "accordé",
  refuse: "refusé",
  annule: "annulé",
};

export default function Echanges({
  echanges,
  voeux,
  personnes,
  moi,
  estGerant,
  occupe,
  onRepondre,
  onTrancher,
  onAnnuler,
}: {
  echanges: Echange[];
  voeux: Voeu[];
  personnes: Record<string, Personne>;
  moi: string;
  estGerant: boolean;
  occupe: boolean;
  onRepondre: (id: string, accepte: boolean) => Promise<boolean>;
  onTrancher: (id: string, accorde: boolean) => Promise<boolean>;
  onAnnuler: (id: string) => Promise<boolean>;
}) {
  const voeuDe = (id: string | null) => (id ? (voeux.find((v) => v.id === id) ?? null) : null);
  const titulaire = (e: Echange) => voeuDe(e.voeu_cible_id)?.user_id ?? null;

  const aRepondre = echanges.filter((e) => e.statut === "propose" && titulaire(e) === moi);
  const miennes = echanges.filter((e) => e.demandeur_id === moi);
  const aArbitrer = estGerant ? echanges.filter((e) => e.statut === "accepte_pair") : [];

  const ligne = (e: Echange) => {
    const c = voeuDe(e.voeu_cible_id);
    const o = voeuDe(e.voeu_offert_id);
    return (
      <>
        <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#003850" }}>
          {personnes[e.demandeur_id]?.nom ?? "—"} demande{" "}
          {c ? libelleCase(c.salle, c.jour, c.moment) : "une case disparue"}
        </p>
        <p style={{ margin: "0 0 4px", fontSize: 12.5, color: "rgba(0,56,80,.7)" }}>
          {o ? `En échange de ${libelleCase(o.salle, o.jour, o.moment)}` : "Sans contrepartie"}
          {" · "}
          {e.portee === "ponctuel" ? `semaine du ${jour(e.semaine)}` : "définitif"}
          {" · "}
          {LIBELLE_STATUT[e.statut]}
        </p>
        <p style={{ margin: "0 0 8px", fontSize: 12.5 }}>{e.motif}</p>
      </>
    );
  };

  const rien = (quoi: string) => (
    <p style={{ fontSize: 13, color: "rgba(0,56,80,.6)", marginBottom: 18 }}>{quoi}</p>
  );

  return (
    <div>
      <h3 style={{ margin: "0 0 8px", fontSize: 14, color: "#003850" }}>On attend votre réponse</h3>
      {aRepondre.length === 0
        ? rien("Personne ne demande un de vos créneaux.")
        : aRepondre.map((e) => (
            <div key={e.id} style={CARTE}>
              {ligne(e)}
              <Bouton ton="ok" disabled={occupe} onClick={() => void onRepondre(e.id, true)}>
                J’accepte
              </Bouton>
              <Bouton ton="non" disabled={occupe} onClick={() => void onRepondre(e.id, false)}>
                Je refuse
              </Bouton>
            </div>
          ))}

      {estGerant ? (
        <>
          <h3 style={{ margin: "0 0 8px", fontSize: 14, color: "#003850" }}>À arbitrer</h3>
          {aArbitrer.length === 0
            ? rien("Aucun échange n’attend votre arbitrage.")
            : aArbitrer.map((e) => (
                <div key={e.id} style={CARTE}>
                  {ligne(e)}
                  <p style={{ margin: "0 0 8px", fontSize: 12, color: "rgba(0,56,80,.6)" }}>
                    {personnes[titulaire(e) ?? ""]?.nom ?? "—"} est d’accord.
                  </p>
                  <Bouton ton="ok" disabled={occupe} onClick={() => void onTrancher(e.id, true)}>
                    Accorder
                  </Bouton>
                  <Bouton ton="non" disabled={occupe} onClick={() => void onTrancher(e.id, false)}>
                    Refuser
                  </Bouton>
                </div>
              ))}
        </>
      ) : null}

      <h3 style={{ margin: "0 0 8px", fontSize: 14, color: "#003850" }}>Mes demandes</h3>
      {miennes.length === 0
        ? rien("Vous n’avez demandé aucun échange.")
        : miennes.map((e) => (
            <div key={e.id} style={CARTE}>
              {ligne(e)}
              {e.statut === "propose" || e.statut === "accepte_pair" ? (
                <Bouton ton="neutre" disabled={occupe} onClick={() => void onAnnuler(e.id)}>
                  Annuler ma demande
                </Bouton>
              ) : null}
            </div>
          ))}
    </div>
  );
}

function Bouton({
  ton,
  children,
  ...reste
}: { ton: "ok" | "non" | "neutre" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const fond = ton === "ok" ? "#04A49B" : ton === "non" ? "#EE806C" : "rgba(0,56,80,.08)";
  return (
    <button
      type="button"
      {...reste}
      style={{
        padding: "6px 12px",
        borderRadius: 999,
        border: "none",
        background: fond,
        color: ton === "neutre" ? "#003850" : "#fff",
        fontSize: 12,
        fontWeight: 600,
        cursor: reste.disabled ? "not-allowed" : "pointer",
        opacity: reste.disabled ? 0.55 : 1,
        marginRight: 8,
      }}
    >
      {children}
    </button>
  );
}

function jour(iso: string | null): string {
  if (!iso) return "?";
  const [an, mois, j] = iso.split("-");
  return `${Number(j)}/${mois}/${an}`;
}
