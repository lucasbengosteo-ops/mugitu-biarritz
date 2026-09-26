"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccesCourant } from "@/lib/admin/acces";
import { compteurParPersonne, voeuDe } from "@/lib/agenda/grille";
import { libelleCase } from "@/lib/agenda/salles";
import { decalerSemaine, libelleSemaine, lundiDe, personnesAbsentes } from "@/lib/agenda/semaine";
import type { Absence, Commentaire, Personne, Voeu } from "@/lib/agenda/types";
import { supabaseBrowser } from "@/lib/supabase-browser";
import CaseDetail from "./CaseDetail";
import Grille from "./Grille";
import MesConges from "./MesConges";
import { appeler } from "./rpc";

/**
 * L'agenda du cabinet : la semaine type, ses vœux et leur arbitrage.
 *
 * Deux vues sur la même grille. « Ma semaine » coche et décoche ; « Le
 * cabinet » consulte et ouvre le détail d'une case.
 */

type Onglet = "mienne" | "cabinet" | "conges";
type CaseOuverte = { salle: string; jour: number; moment: string };

const FLECHE: React.CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: 999,
  border: "1px solid rgba(0,56,80,.15)",
  background: "#fff",
  color: "#003850",
  fontSize: 16,
  lineHeight: 1,
  cursor: "pointer",
};

export default function AgendaAdmin() {
  const acces = useAccesCourant();
  const [onglet, setOnglet] = useState<Onglet>("mienne");
  const [voeux, setVoeux] = useState<Voeu[]>([]);
  const [personnes, setPersonnes] = useState<Record<string, Personne>>({});
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [lundi, setLundi] = useState(() => lundiDe(new Date().toISOString().slice(0, 10)));
  const [ouverte, setOuverte] = useState<CaseOuverte | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(true);

  const charger = useCallback(async () => {
    const sb = supabaseBrowser();
    const [v, p, c, ab] = await Promise.all([
      sb.from("agenda_voeux").select("*"),
      // `profiles.id` est la clé propre de la table, distincte de
      // `profiles.user_id` (qui référence auth.users). agenda_voeux.user_id
      // pointe sur auth.users : l'annuaire doit donc être indexé par
      // `user_id`, pas par `id`.
      sb.from("profiles").select("user_id, first_name, last_name"),
      sb.from("agenda_commentaires").select("*").order("created_at"),
      sb.from("agenda_absences").select("*").order("du"),
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
    setAbsences((ab.data ?? []) as Absence[]);
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

  const ajouterAbsence = useCallback(
    async (du: string, au: string, motif: string) => {
      if (!acces.userId) return false;
      const { error } = await supabaseBrowser()
        .from("agenda_absences")
        .insert({ user_id: acces.userId, du, au, motif: motif.trim() || null });
      if (error) {
        setErreur("Impossible d’enregistrer cette absence.");
        return false;
      }
      setErreur(null);
      await charger();
      return true;
    },
    [acces.userId, charger],
  );

  const retirerAbsence = useCallback(
    async (id: string) => {
      const { error } = await supabaseBrowser().from("agenda_absences").delete().eq("id", id);
      if (error) {
        setErreur("Impossible de retirer cette absence.");
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
            ["conges", "Mes congés"],
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
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <button type="button" onClick={() => setLundi(decalerSemaine(lundi, -1))} style={FLECHE}>
            ‹
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#003850", minWidth: 200, textAlign: "center" }}>
            {libelleSemaine(lundi)}
          </span>
          <button type="button" onClick={() => setLundi(decalerSemaine(lundi, 1))} style={FLECHE}>
            ›
          </button>
          <button
            type="button"
            onClick={() => setLundi(lundiDe(new Date().toISOString().slice(0, 10)))}
            style={{ ...FLECHE, width: "auto", padding: "0 12px", fontSize: 12 }}
          >
            Cette semaine
          </button>
          {(() => {
            const manquants = personnesAbsentes(absences, lundi);
            if (manquants.length === 0) return null;
            return (
              <span style={{ fontSize: 12, color: "rgba(0,56,80,.6)" }}>
                Absents cette semaine : {manquants.map((id) => personnes[id]?.nom ?? "—").join(", ")}
              </span>
            );
          })()}
        </div>
      ) : null}

      {onglet === "cabinet" ? (
        <p style={{ margin: "0 0 12px", fontSize: 12, color: "rgba(0,56,80,.6)" }}>
          {Object.entries(compteurParPersonne(voeux))
            .sort((a, b) => b[1] - a[1])
            .map(([id, n]) => `${personnes[id]?.nom ?? "—"} ${n}`)
            .join(" · ") || "Aucune demande pour l’instant."}
        </p>
      ) : null}

      {onglet === "conges" ? (
        <MesConges
          absences={absences}
          personnes={personnes}
          moi={acces.userId ?? ""}
          estGerant={acces.estSuperAdmin}
          onAjouter={ajouterAbsence}
          onRetirer={retirerAbsence}
        />
      ) : (
        <Grille
          voeux={voeux}
          personnes={personnes}
          moi={acces.userId ?? ""}
          mode={onglet === "mienne" ? "mien" : "cabinet"}
          lundi={onglet === "cabinet" ? lundi : undefined}
          absences={onglet === "cabinet" ? absences : undefined}
          onCase={(salle, jour, moment) =>
            onglet === "mienne" ? void basculer(salle, jour, moment) : setOuverte({ salle, jour, moment })
          }
        />
      )}

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
