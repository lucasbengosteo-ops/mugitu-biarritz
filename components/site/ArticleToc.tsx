"use client";

import { useEffect, useRef, useState } from "react";

export type TocEntry = { id: string; label: string };

/**
 * Sommaire d'article, en deux rendus pilotés par CSS (jamais par du state,
 * pour éviter tout écart au rendu serveur) :
 *  - ≥ 900px : rail vertical collant à gauche du corps ;
 *  - < 900px : barre horizontale collante sous le header, défilable au doigt.
 *
 * La section active est suivie par IntersectionObserver ; sur mobile, l'entrée
 * active est ramenée dans le champ de vision de la barre.
 */
export default function ArticleToc({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sections = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    // On retient la section la plus haute encore visible sous le header.
    const observer = new IntersectionObserver(
      (records) => {
        const visibles = records
          .filter((r) => r.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visibles.length > 0) setActive(visibles[0].target.id);
      },
      { rootMargin: "-160px 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [entries]);

  // Barre mobile : garder l'entrée active visible sans faire défiler la page.
  useEffect(() => {
    if (!active || !barRef.current) return;
    const lien = barRef.current.querySelector<HTMLElement>(`[data-toc="${active}"]`);
    if (!lien) return;
    const bar = barRef.current;
    const decalage = lien.offsetLeft - bar.clientWidth / 2 + lien.clientWidth / 2;
    bar.scrollTo({ left: Math.max(0, decalage), behavior: "smooth" });
  }, [active]);

  return (
    <>
      {/* ── Rail vertical (desktop) ── */}
      <aside className="ar-toc">
        <p
          style={{
            margin: "0 0 14px",
            fontSize: 11,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "rgba(51,51,52,.45)",
          }}
        >
          Sur cette page
        </p>
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderLeft: "2px solid rgba(0,56,80,.12)",
          }}
        >
          {entries.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              aria-current={active === t.id ? "true" : undefined}
              className="ar-toc-link"
              style={{
                padding: "9px 0 9px 14px",
                marginLeft: -2,
                borderLeft: "2px solid transparent",
                fontSize: 13,
                lineHeight: 1.35,
                textDecoration: "none",
              }}
            >
              {t.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* ── Barre horizontale (mobile) ── */}
      <div className="ar-toc-mob" ref={barRef} aria-label="Sommaire de l'article">
        <span className="ar-toc-mob-eyebrow">Sommaire</span>
        {entries.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            data-toc={t.id}
            aria-current={active === t.id ? "true" : undefined}
            className="ar-toc-chip"
          >
            {t.label}
          </a>
        ))}
      </div>
    </>
  );
}
