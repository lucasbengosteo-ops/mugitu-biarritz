"use client";

import Link from "next/link";
import { rubriquesVisibles, type Acces } from "@/lib/admin/droits";

/**
 * Panneau latéral du back-office. Blanc et sobre : c'est un outil de
 * travail, pas une vitrine. La rubrique active est surlignée, l'agenda est
 * annoncé mais désactivé tant que son chantier n'est pas livré.
 */
export default function PanneauAdmin({
  acces,
  chemin,
  onNaviguer,
  onDeconnexion,
}: {
  acces: Acces;
  chemin: string;
  onNaviguer: () => void;
  onDeconnexion: () => void;
}) {
  const rubriques = rubriquesVisibles(acces);

  const lien = (actif: boolean, bientot: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "8px 10px",
    borderRadius: 9,
    marginBottom: 2,
    fontSize: 13.5,
    textDecoration: "none",
    color: actif ? "#04A49B" : bientot ? "rgba(51,51,52,.45)" : "#003850",
    background: actif ? "rgba(4,164,155,.1)" : "transparent",
    fontWeight: actif ? 700 : 500,
    cursor: bientot ? "default" : "pointer",
  });

  const pastille = (actif: boolean): React.CSSProperties => ({
    width: 15,
    height: 15,
    borderRadius: 5,
    flex: "0 0 auto",
    background: actif ? "#04A49B" : "rgba(0,56,80,.16)",
  });

  return (
    <nav aria-label="Sections du back-office" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "16px 10px" }}>
      <p style={{ margin: "0 0 14px", padding: "0 10px", fontSize: 16, fontWeight: 800, color: "#003850" }}>
        mugitu{" "}
        <span style={{ fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: "#04A49B" }}>admin</span>
      </p>

      {rubriques.map((r, i) => {
        const actif = chemin === r.href || (r.href !== "/admin" && chemin.startsWith(`${r.href}/`));
        const groupePrecedent = i > 0 ? rubriques[i - 1].groupe : "";
        const entete =
          r.groupe && r.groupe !== groupePrecedent ? (
            <p key={`g-${r.groupe}`} style={{ margin: "14px 10px 5px", fontSize: 9.5, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(51,51,52,.5)" }}>
              {r.groupe}
            </p>
          ) : null;

        return (
          <div key={r.href}>
            {entete}
            {r.bientot ? (
              <span style={lien(false, true)} aria-disabled="true">
                <span aria-hidden="true" style={pastille(false)} />
                {r.label}
                <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: "rgba(51,51,52,.4)" }}>bientôt</span>
              </span>
            ) : (
              <Link href={r.href} onClick={onNaviguer} aria-current={actif ? "page" : undefined} style={lien(actif, false)}>
                <span aria-hidden="true" style={pastille(actif)} />
                {r.label}
              </Link>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid rgba(0,56,80,.1)", fontSize: 12.5 }}>
        <p style={{ margin: "0 0 6px", padding: "0 10px", color: "#003850", fontWeight: 600 }}>{acces.prenom}</p>
        <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "6px 10px", color: "rgba(51,51,52,.6)", textDecoration: "none" }}>
          Voir le site ↗
        </a>
        <button
          type="button"
          onClick={onDeconnexion}
          style={{ padding: "6px 10px", border: "none", background: "none", font: "inherit", fontSize: 12.5, color: "rgba(51,51,52,.6)", cursor: "pointer" }}
        >
          Se déconnecter
        </button>
      </div>
    </nav>
  );
}
