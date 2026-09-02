"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TEAM, TEAM_CATEGORIES, countByCategory, type TeamCategory } from "@/lib/team";
import { practitionerPath } from "@/lib/routes";

/**
 * Grille des praticiens avec filtres par discipline.
 *
 * Le filtre est purement client : les 13 fiches sont rendues côté serveur
 * (bon pour le SEO) et on ne fait que masquer celles hors catégorie.
 */
export default function TeamGrid() {
  const [active, setActive] = useState<TeamCategory>("all");

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", margin: "0 0 clamp(24px,3vw,36px)" }}>
        <span style={{ fontSize: 11, letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "rgba(51,51,52,.5)", fontWeight: 600, marginRight: 6 }}>
          Filtrer
        </span>
        {TEAM_CATEGORIES.map((c) => {
          const on = active === c.key;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setActive(c.key)}
              aria-pressed={on}
              className={on ? undefined : "mt-filter"}
              style={{
                cursor: "pointer",
                font: "inherit",
                padding: "9px 18px",
                borderRadius: "var(--r-pill)",
                border: `1px solid ${on ? "transparent" : "rgba(0,56,80,.14)"}`,
                background: on ? "#003850" : "transparent",
                color: on ? "#fff" : "#003850",
                fontSize: 13,
                fontWeight: 600,
                transition: "all .22s cubic-bezier(.16,1,.3,1)",
              }}
            >
              {c.label} <span style={{ opacity: on ? 0.55 : 0.45, fontWeight: 500 }}>{countByCategory(c.key)}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,300px),1fr))", gap: "clamp(18px,2.4vw,30px)" }}>
        {TEAM.map((p) => {
          const visible = active === "all" || p.cats.includes(active as Exclude<TeamCategory, "all">);
          const href = practitionerPath(p.slug);
          return (
            <article key={p.slug} className="mt-card" style={{ display: visible ? undefined : "none" }}>
              <div
                style={{
                  position: "relative",
                  borderRadius: "var(--r-l)",
                  overflow: "hidden",
                  aspectRatio: "4 / 5",
                  background: "#012A3A",
                  boxShadow: "0 6px 26px rgba(60,40,30,.1)",
                }}
              >
                <Image
                  src={p.photo}
                  alt={p.name}
                  fill
                  sizes="(max-width: 900px) 100vw, 300px"
                  className="mt-img"
                  style={{ objectFit: "cover", objectPosition: p.objectPosition }}
                />

                {/* Lien étendu : toute la photo mène à la fiche, sans imbriquer
                    d'ancres (ce qui casserait l'hydratation React). */}
                <Link
                  href={href}
                  aria-label={`Voir la fiche de ${p.name}`}
                  style={{ position: "absolute", inset: 0, zIndex: 1 }}
                />

                <div
                  className="mt-bio"
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: 24,
                    background: "linear-gradient(to top,rgba(1,30,42,.96) 0%,rgba(1,30,42,.7) 40%,rgba(1,30,42,0) 75%)",
                    // Le voile laisse passer les clics vers le lien étendu ;
                    // seuls les deux boutons restent cliquables.
                    pointerEvents: "none",
                  }}
                >
                  <p style={{ margin: "0 0 12px", fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,.86)" }}>{p.bio}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch", pointerEvents: "auto" }}>
                    <a
                      href={p.booking}
                      target={p.booking.startsWith("http") ? "_blank" : undefined}
                      rel={p.booking.startsWith("http") ? "noopener noreferrer" : undefined}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 7,
                        padding: "10px 16px",
                        borderRadius: "var(--r-pill)",
                        background: "#04A49B",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Prendre rendez-vous <span>↗</span>
                    </a>
                    <Link
                      href={href}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 7,
                        padding: "10px 16px",
                        borderRadius: "var(--r-pill)",
                        background: "rgba(255,255,255,.14)",
                        border: "1px solid rgba(255,255,255,.4)",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Voir la fiche
                    </Link>
                  </div>
                </div>
              </div>

              <div style={{ padding: "16px 4px 4px" }}>
                <p style={{ margin: "0 0 3px", fontSize: 11, letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "#04A49B", fontWeight: 600 }}>
                  {p.role}
                </p>
                <Link href={href} style={{ textDecoration: "none" }}>
                  <h3 style={{ margin: "0 0 8px", fontSize: 21, fontWeight: 700, color: "#003850", letterSpacing: "-.01em" }}>{p.name}</h3>
                </Link>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {p.tags.map((t) => (
                    <span key={t} style={{ padding: "3px 9px", borderRadius: "var(--r-pill)", background: "rgba(4,164,155,.1)", color: "#04A49B", fontSize: 11, fontWeight: 500 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
