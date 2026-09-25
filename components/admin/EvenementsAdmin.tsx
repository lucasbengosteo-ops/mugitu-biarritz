"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccesCourant } from "@/lib/admin/acces";
import { ECHEANCE_JEUX_ALBA, EVENEMENTS } from "@/lib/evenements";
import { supabaseBrowser } from "@/lib/supabase-browser";

/**
 * Annuaire des événements. Lecture pour toute l'équipe ; la suppression des
 * données des jeux est réservée aux super-admins, et la base le vérifie.
 */

type EtatJeux = { participants: number; scores: number; tirages: number };

export default function EvenementsAdmin() {
  const acces = useAccesCourant();
  const [jeux, setJeux] = useState<EtatJeux | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [occupe, setOccupe] = useState(false);

  const charger = useCallback(async () => {
    const { data, error } = await supabaseBrowser().rpc("site_jeux_alba_etat");
    if (error) {
      setMessage(`État des jeux illisible : ${error.message}`);
      return;
    }
    setJeux(data as EtatJeux);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(t);
  }, [charger]);

  const supprimer = async () => {
    if (!jeux) return;
    const total = jeux.participants + jeux.scores + jeux.tirages;
    if (!window.confirm(`Supprimer définitivement les ${total} lignes des jeux de l’Alba ? Cette action est irréversible.`)) return;
    setOccupe(true);
    const { error } = await supabaseBrowser().rpc("site_supprimer_jeux_alba");
    setOccupe(false);
    if (error) {
      setMessage(`Suppression refusée : ${error.message}`);
      return;
    }
    setMessage("Données des jeux supprimées.");
    await charger();
  };

  const carte: React.CSSProperties = {
    background: "#fff",
    borderRadius: 14,
    padding: "clamp(16px,2.5vw,24px)",
    boxShadow: "0 2px 10px rgba(60,40,30,.06)",
    marginBottom: 14,
  };

  return (
    <div style={{ padding: "clamp(14px,3vw,26px)", maxWidth: 820 }}>
      <h1 style={{ margin: "0 0 4px", fontSize: 21, fontWeight: 700, color: "#003850" }}>Événements</h1>
      <p style={{ margin: "0 0 18px", fontSize: 13.5, color: "rgba(51,51,52,.65)" }}>
        Les stands passés et leurs outils. Une entrée s’ajoute dans le code, au moment où un nouveau stand se prépare.
      </p>

      {message && (
        <p role="status" style={{ ...carte, padding: "12px 14px", color: "#036b66", fontSize: 13.5, fontWeight: 600 }}>
          {message}
        </p>
      )}

      {EVENEMENTS.map((e) => (
        <section key={e.id} style={carte}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#003850" }}>{e.nom}</h2>
            <span style={{ fontSize: 12, color: "rgba(51,51,52,.55)" }}>{e.dates}</span>
            {e.passe && (
              <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: "rgba(51,51,52,.08)", color: "rgba(51,51,52,.6)" }}>
                Passé
              </span>
            )}
          </div>
          <p style={{ margin: "8px 0 12px", fontSize: 14, lineHeight: 1.6, color: "rgba(51,51,52,.75)" }}>{e.resume}</p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {e.liens.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: "7px 13px", borderRadius: 999, border: "1px solid rgba(0,56,80,.18)", color: "#003850", fontSize: 12.5, fontWeight: 600, textDecoration: "none" }}
              >
                {l.label} ↗
              </a>
            ))}
          </div>

          {e.donnees === "jeux-alba" && (
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(0,56,80,.1)" }}>
              {jeux === null ? (
                <p style={{ margin: 0, fontSize: 13, color: "rgba(51,51,52,.6)" }}>Lecture de l’état des données…</p>
              ) : jeux.participants + jeux.scores + jeux.tirages === 0 ? (
                <p style={{ margin: 0, fontSize: 13, color: "rgba(51,51,52,.6)" }}>
                  Les données des jeux ont été supprimées, comme l’annonçait le règlement.
                </p>
              ) : (
                <>
                  <p style={{ margin: "0 0 8px", fontSize: 13.5, color: "#003850" }}>
                    {jeux.participants} participants, {jeux.scores} scores, {jeux.tirages} tirages encore en base.
                  </p>
                  <p style={{ margin: "0 0 10px", fontSize: 12.5, color: "#8a5a10" }}>
                    Le règlement annonce leur suppression au plus tard le {ECHEANCE_JEUX_ALBA}.
                  </p>
                  {acces.estSuperAdmin && (
                    <button
                      type="button"
                      disabled={occupe}
                      onClick={() => void supprimer()}
                      style={{ padding: "9px 18px", borderRadius: 999, border: "1px solid rgba(194,65,12,.35)", background: "transparent", color: "#C2410C", font: "inherit", fontSize: 13.5, fontWeight: 600, cursor: occupe ? "default" : "pointer" }}
                    >
                      {occupe ? "Suppression…" : "Supprimer les données des jeux"}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
