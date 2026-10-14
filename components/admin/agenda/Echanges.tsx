"use client";

import { Badge, Bouton, Carte, type TonBadge } from "@/components/admin/ui";
import { libelleCase } from "@/lib/agenda/salles";
import type { Echange, Personne, Voeu } from "@/lib/agenda/types";

/**
 * Les échanges : ce qui attend une réponse de moi, ce que j'ai demandé, et
 * pour les gérants ce qui attend un arbitrage.
 *
 * La demande ne se lance pas ici mais depuis une case de la grille : c'est
 * en regardant la grille qu'on voit ce qu'on veut.
 */

const STATUT: Record<Echange["statut"], { mot: string; ton: TonBadge }> = {
  propose: { mot: "en attente de réponse", ton: "attente" },
  accepte_pair: { mot: "en attente d’arbitrage", ton: "attente" },
  refuse_pair: { mot: "refusé par le titulaire", ton: "alerte" },
  valide: { mot: "accordé", ton: "succes" },
  refuse: { mot: "refusé", ton: "alerte" },
  annule: { mot: "annulé", ton: "neutre" },
};

const ACTIONS: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 };

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
        <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700 }}>
          {personnes[e.demandeur_id]?.nom ?? "—"} demande{" "}
          {c ? libelleCase(c.salle, c.jour, c.moment) : "une case disparue"}
        </p>
        <p style={{ margin: "0 0 6px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          <Badge ton={STATUT[e.statut].ton}>{STATUT[e.statut].mot}</Badge>
          <span className="ad-agenda-mention">
            {o ? `En échange de ${libelleCase(o.salle, o.jour, o.moment)}` : "Sans contrepartie"}
            {" · "}
            {e.portee === "ponctuel" ? `semaine du ${jour(e.semaine)}` : "définitif"}
          </span>
        </p>
        <p className="ad-agenda-texte" style={{ margin: 0 }}>
          {e.motif}
        </p>
      </>
    );
  };

  const rien = (quoi: string) => (
    <p className="ad-agenda-texte" style={{ margin: 0 }}>
      {quoi}
    </p>
  );

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Carte titre="On attend votre réponse">
        {aRepondre.length === 0
          ? rien("Personne ne demande un de vos créneaux.")
          : aRepondre.map((e) => (
              <div key={e.id} className="ad-agenda-bloc">
                {ligne(e)}
                <div style={ACTIONS}>
                  <Bouton taille="petite" disabled={occupe} onClick={() => void onRepondre(e.id, true)}>
                    J’accepte
                  </Bouton>
                  <Bouton taille="petite" variante="danger" disabled={occupe} onClick={() => void onRepondre(e.id, false)}>
                    Je refuse
                  </Bouton>
                </div>
              </div>
            ))}
      </Carte>

      {estGerant ? (
        <Carte titre="À arbitrer">
          {aArbitrer.length === 0
            ? rien("Aucun échange n’attend votre arbitrage.")
            : aArbitrer.map((e) => (
                <div key={e.id} className="ad-agenda-bloc">
                  {ligne(e)}
                  <p className="ad-agenda-mention" style={{ margin: "8px 0 0" }}>
                    {personnes[titulaire(e) ?? ""]?.nom ?? "—"} est d’accord.
                  </p>
                  <div style={ACTIONS}>
                    <Bouton taille="petite" disabled={occupe} onClick={() => void onTrancher(e.id, true)}>
                      Accorder
                    </Bouton>
                    <Bouton taille="petite" variante="danger" disabled={occupe} onClick={() => void onTrancher(e.id, false)}>
                      Refuser
                    </Bouton>
                  </div>
                </div>
              ))}
        </Carte>
      ) : null}

      <Carte titre="Mes demandes d’échange">
        {miennes.length === 0
          ? rien("Vous n’avez demandé aucun échange.")
          : miennes.map((e) => (
              <div key={e.id} className="ad-agenda-bloc">
                {ligne(e)}
                {e.statut === "propose" || e.statut === "accepte_pair" ? (
                  <div style={ACTIONS}>
                    <Bouton taille="petite" variante="secondaire" disabled={occupe} onClick={() => void onAnnuler(e.id)}>
                      Annuler ma demande
                    </Bouton>
                  </div>
                ) : null}
              </div>
            ))}
      </Carte>
    </div>
  );
}

function jour(iso: string | null): string {
  if (!iso) return "?";
  const [an, mois, j] = iso.split("-");
  return `${Number(j)}/${mois}/${an}`;
}
