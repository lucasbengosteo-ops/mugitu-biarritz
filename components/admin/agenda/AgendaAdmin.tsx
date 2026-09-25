"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccesCourant } from "@/lib/admin/acces";
import { compteurParPersonne, voeuDe } from "@/lib/agenda/grille";
import { libelleCase } from "@/lib/agenda/salles";
import type { Commentaire, Personne, Voeu } from "@/lib/agenda/types";
import { supabaseBrowser } from "@/lib/supabase-browser";
import CaseDetail from "./CaseDetail";
import Grille from "./Grille";
import { appeler } from "./rpc";

/**
 * L'agenda du cabinet : la semaine type, ses vœux et leur arbitrage.
 *
 * Deux vues sur la même grille. « Ma semaine » coche et décoche ; « Le
 * cabinet » consulte et ouvre le détail d'une case.
 */

type Onglet = "mienne" | "cabinet";
type CaseOuverte = { salle: string; jour: number; moment: string };

export default function AgendaAdmin() {
  const acces = useAccesCourant();
  const [onglet, setOnglet] = useState<Onglet>("mienne");
  const [voeux, setVoeux] = useState<Voeu[]>([]);
  const [personnes, setPersonnes] = useState<Record<string, Personne>>({});
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [ouverte, setOuverte] = useState<CaseOuverte | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(true);

  const charger = useCallback(async () => {
    const sb = supabaseBrowser();
    const [v, p, c] = await Promise.all([
      sb.from("agenda_voeux").select("*"),
      // `profiles.id` est la clé propre de la table, distincte de
      // `profiles.user_id` (qui référence auth.users). agenda_voeux.user_id
      // pointe sur auth.users : l'annuaire doit donc être indexé par
      // `user_id`, pas par `id`.
      sb.from("profiles").select("user_id, first_name, last_name"),
      sb.from("agenda_commentaires").select("*").order("created_at"),
    ]);
    if (v.error) {
      setErreur("Impossible de charger l’agenda.");
      setChargement(false);
      return;
    }
    setVoeux((v.data ?? []) as Voeu[]);
    const annuaire: Record<string, Personne> = {};
    for (const ligne of (p.data ?? []) as { user_id: string; first_name: string | null; last_name: string | null }[]) {
      annuaire[ligne.user_id] = {
        id: ligne.user_id,
        nom: [ligne.first_name, ligne.last_name].filter(Boolean).join(" ") || "Sans nom",
      };
    }
    setPersonnes(annuaire);
    setCommentaires((c.data ?? []) as Commentaire[]);
    setErreur(null);
    setChargement(false);
  }, []);

  useEffect(() => {
    // Motif du dépôt : pas de setState synchrone dans le corps d'un effet.
    const t = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(t);
  }, [charger]);

  const basculer = useCallback(
    async (salle: string, jour: number, moment: string) => {
      if (!acces.userId) return;
      const existant = voeuDe(voeux, acces.userId, salle, jour, moment);
      const sb = supabaseBrowser();
      if (!existant) {
        const { error } = await sb
          .from("agenda_voeux")
          .insert({ user_id: acces.userId, salle, jour, moment });
        if (error) setErreur("Impossible d’ajouter ce créneau.");
      } else if (existant.statut === "propose" || existant.statut === "refuse") {
        const { error } = await sb.from("agenda_voeux").delete().eq("id", existant.id);
        if (error) setErreur("Impossible de retirer ce créneau.");
      } else {
        setErreur(
          `Ce créneau vous est accordé : passez par « demander à le rendre » dans le détail de ${libelleCase(salle, jour, moment)}.`,
        );
        setOuverte({ salle, jour, moment });
        return;
      }
      await charger();
    },
    [acces.userId, voeux, charger],
  );

  const agir = useCallback(
    async (nom: string, args: Record<string, unknown>) => {
      const r = await appeler(nom, args);
      if (!r.ok) {
        setErreur(r.message);
        return false;
      }
      setErreur(null);
      await charger();
      return true;
    },
    [charger],
  );

  if (chargement) return <p style={{ fontSize: 13 }}>Chargement…</p>;

  return (
    <div>
      <h1 style={{ margin: "0 0 4px", fontSize: 22, color: "#003850" }}>Agenda du cabinet</h1>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: "rgba(0,56,80,.65)" }}>
        Votre semaine type : les demi-journées que vous souhaitez, dans quelle salle. Lucas et Jean-Baptiste
        accordent ou refusent, et vous répondent dans le fil de chaque créneau.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {(
          [
            ["mienne", "Ma semaine"],
            ["cabinet", "Le cabinet"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setOnglet(id)}
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              border: "1px solid rgba(0,56,80,.15)",
              background: onglet === id ? "#04A49B" : "#fff",
              color: onglet === id ? "#fff" : "#003850",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {erreur ? (
        <p
          role="status"
          style={{
            background: "rgba(238,128,108,.14)",
            color: "#9E4433",
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 13,
            margin: "0 0 14px",
          }}
        >
          {erreur}
        </p>
      ) : null}

      {onglet === "cabinet" ? (
        <p style={{ margin: "0 0 12px", fontSize: 12, color: "rgba(0,56,80,.6)" }}>
          {Object.entries(compteurParPersonne(voeux))
            .sort((a, b) => b[1] - a[1])
            .map(([id, n]) => `${personnes[id]?.nom ?? "—"} ${n}`)
            .join(" · ") || "Aucune demande pour l’instant."}
        </p>
      ) : null}

      <Grille
        voeux={voeux}
        personnes={personnes}
        moi={acces.userId ?? ""}
        mode={onglet === "mienne" ? "mien" : "cabinet"}
        onCase={(salle, jour, moment) =>
          onglet === "mienne" ? void basculer(salle, jour, moment) : setOuverte({ salle, jour, moment })
        }
      />

      {ouverte ? (
        <CaseDetail
          {...ouverte}
          voeux={voeux}
          commentaires={commentaires}
          personnes={personnes}
          moi={acces.userId ?? ""}
          estGerant={acces.estSuperAdmin}
          onFermer={() => setOuverte(null)}
          onAgir={agir}
        />
      ) : null}
    </div>
  );
}
