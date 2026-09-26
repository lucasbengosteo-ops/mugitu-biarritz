"use client";

import { useState } from "react";
import { dateLongue } from "@/lib/klub/format";
import { filtrerJours, type Jour } from "@/lib/klub/planning";
import { COULEUR_TYPE, LIBELLE_TYPE, type KlubType } from "@/lib/klub/types";
import KlubCarte from "./KlubCarte";

/**
 * La liste du planning, et ses filtres par type. Seul morceau interactif de
 * la page : les séances arrivent préparées du serveur, on ne fait ici que
 * choisir lesquelles montrer.
 */
export default function KlubListe({
  jours,
  types,
  afficherFiltres,
  maintenant,
}: {
  jours: Jour[];
  types: { type: KlubType; nombre: number }[];
  afficherFiltres: boolean;
  maintenant: string;
}) {
  const [choix, setChoix] = useState<KlubType | null>(null);
  const visibles = filtrerJours(jours, choix);

  const pastille = (actif: boolean, couleur = "#003850"): React.CSSProperties => ({
    padding: "7px 14px",
    borderRadius: 999,
    border: `1px solid ${actif ? couleur : "rgba(0,56,80,.15)"}`,
    background: actif ? couleur : "#fff",
    color: actif ? "#fff" : "#003850",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  });

  return (
    <>
      {afficherFiltres ? (
        <div role="group" aria-label="Filtrer par type" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 26 }}>
          <button type="button" aria-pressed={choix === null} onClick={() => setChoix(null)} style={pastille(choix === null)}>
            Tout
          </button>
          {types.map((t) => (
            <button
              key={t.type}
              type="button"
              aria-pressed={choix === t.type}
              onClick={() => setChoix(t.type)}
              style={pastille(choix === t.type, COULEUR_TYPE[t.type])}
            >
              {LIBELLE_TYPE[t.type]} <span style={{ opacity: 0.7 }}>{t.nombre}</span>
            </button>
          ))}
        </div>
      ) : null}

      {visibles.length === 0 ? (
        <p style={{ margin: 0, padding: "20px 0", fontSize: 15, color: "rgba(51,51,52,.6)" }}>
          Aucune autre séance programmée pour l’instant.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 30 }}>
          {visibles.map((j) => {
            const libelle = dateLongue(`${j.cle}T12:00:00Z`);
            return (
              <section key={j.cle}>
                <h3
                  style={{
                    margin: "0 0 12px",
                    paddingBottom: 10,
                    borderBottom: "1px solid rgba(0,56,80,.1)",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "var(--ls-label)",
                    textTransform: "uppercase",
                    color: "#003850",
                  }}
                >
                  {libelle}
                </h3>
                <div style={{ display: "grid", gap: 12 }}>
                  {j.seances.map((s) => (
                    <KlubCarte key={s.id} seance={s} maintenant={maintenant} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
