"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { articlePath } from "@/lib/routes";
import { articleDate, formatDate, type ArticleCard } from "@/lib/articles";

/**
 * Grille des articles avec filtres par catégorie.
 *
 * L'article à la une est rendu à part par la page ; il est exclu de la grille
 * pour ne pas apparaître deux fois.
 */
export default function ArticleCards({ articles, categories }: { articles: ArticleCard[]; categories: string[] }) {
  const [active, setActive] = useState("all");
  const shown = articles.filter((a) => active === "all" || a.category === active);

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "clamp(24px,3vw,36px)" }}>
        {[{ key: "all", label: "Tout" }, ...categories.map((c) => ({ key: c, label: c }))].map((c) => {
          const on = active === c.key;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setActive(c.key)}
              aria-pressed={on}
              style={{
                cursor: "pointer",
                font: "inherit",
                padding: "9px 18px",
                borderRadius: "var(--r-pill)",
                border: `1px solid ${on ? "#003850" : "rgba(0,56,80,.16)"}`,
                background: on ? "#003850" : "transparent",
                color: on ? "#fff" : "#003850",
                fontSize: 13,
                fontWeight: 600,
                transition: "all .22s cubic-bezier(.16,1,.3,1)",
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <p style={{ margin: 0, fontSize: 15, color: "rgba(51,51,52,.6)" }}>Aucun article dans cette catégorie pour le moment.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))", gap: "clamp(18px,2.4vw,26px)" }}>
          {shown.map((a) => (
            <Link
              key={a.slug}
              href={articlePath(a.slug)}
              className="mg-card-lift"
              style={{
                borderRadius: "var(--r-l)",
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 4px 20px rgba(60,40,30,.07)",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ position: "relative", height: 172, background: "#012A3A" }}>
                {a.cover && <Image src={a.cover} alt="" fill sizes="(max-width: 900px) 100vw, 300px" style={{ objectFit: "cover" }} />}
                <span
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    padding: "5px 11px",
                    borderRadius: "var(--r-pill)",
                    background: "rgba(255,255,255,.94)",
                    color: "#04A49B",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "var(--ls-label)",
                    textTransform: "uppercase",
                  }}
                >
                  {a.category}
                </span>
              </div>
              <div style={{ padding: 22, display: "flex", flexDirection: "column", flex: 1 }}>
                <h3 style={{ margin: "0 0 9px", fontSize: 17, fontWeight: 700, color: "#003850", lineHeight: 1.3, letterSpacing: "-.01em" }}>
                  {a.title}
                </h3>
                <p style={{ margin: "0 0 18px", fontSize: 13, lineHeight: 1.6, color: "rgba(51,51,52,.6)", flex: 1 }}>
                  {a.chapo.length > 130 ? `${a.chapo.slice(0, 130)}…` : a.chapo}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 14, borderTop: "1px solid rgba(0,56,80,.08)" }}>
                  {a.author.photo && (
                    <Image
                      src={a.author.photo}
                      alt=""
                      width={30}
                      height={30}
                      style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", objectPosition: "center 22%" }}
                    />
                  )}
                  <div style={{ lineHeight: 1.25, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#003850", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {a.author.name}
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: "rgba(51,51,52,.45)" }}>{formatDate(articleDate(a))}</p>
                  </div>
                  {a.read_mins ? (
                    <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(51,51,52,.45)", whiteSpace: "nowrap" }}>{a.read_mins} min</span>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
