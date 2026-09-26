import type { Article } from "@/lib/articles";
import ArticleTexte from "./ArticleTexte";

/**
 * Le corps d'un article — chiffres clés, sections, cas concret, exercice,
 * FAQ, mots-clés — partagé par la page publique et par l'aperçu de
 * l'éditeur. C'est ce qui rend l'aperçu fidèle : il n'y a qu'un rendu.
 *
 * Ni `"use client"` ni import côté serveur : rendu par la page (composant
 * serveur) comme par l'éditeur (composant client). Pas de `next/image`.
 */

export const H2_ARTICLE: React.CSSProperties = {
  margin: "0 0 16px",
  fontSize: "clamp(22px,3vw,30px)",
  fontWeight: 700,
  letterSpacing: "-.02em",
  color: "#003850",
};

export default function ArticleCorps({
  article,
}: {
  article: Pick<Article, "stats" | "sections" | "cas" | "exercice" | "faq" | "tags">;
}) {
  return (
    <>
      {article.stats.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, marginBottom: 36 }}>
          {article.stats.map((s) => (
            <div key={s.label} style={{ background: "#fff", borderRadius: "var(--r-m)", padding: 20, boxShadow: "0 4px 20px rgba(60,40,30,.06)" }}>
              <p style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: "#04A49B", letterSpacing: "-.02em" }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "rgba(51,51,52,.65)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {article.sections.map((s, i) => (
        <section key={s.h} id={`sec-${i}`} className="ar-sec" style={{ marginBottom: "clamp(32px,4vw,44px)" }}>
          <h2 style={H2_ARTICLE}>{s.h}</h2>
          {s.p.map((para, j) => (
            <ArticleTexte
              key={j}
              texte={para}
              style={{ margin: "0 0 16px", fontSize: 16, lineHeight: 1.75, color: "rgba(51,51,52,.8)", textWrap: "pretty" }}
            />
          ))}
        </section>
      ))}

      {article.cas && (
        <section id="sec-cas" className="ar-sec" style={{ marginBottom: "clamp(32px,4vw,44px)", background: "#F5EDE4", borderRadius: "var(--r-l)", padding: "clamp(24px,3vw,34px)" }}>
          <p style={{ margin: "0 0 10px", fontSize: 11, letterSpacing: "var(--ls-label)", textTransform: "uppercase", fontWeight: 700, color: "#04A49B" }}>
            Un cas concret
          </p>
          <ArticleTexte texte={article.cas} style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: "rgba(51,51,52,.82)" }} />
        </section>
      )}

      {article.exercice?.title && (
        <section id="sec-ex" className="ar-sec" style={{ marginBottom: "clamp(32px,4vw,44px)", background: "linear-gradient(150deg,#003850,#0A556B)", borderRadius: "var(--r-l)", padding: "clamp(24px,3vw,34px)", color: "#fff" }}>
          <p style={{ margin: "0 0 10px", fontSize: 11, letterSpacing: "var(--ls-label)", textTransform: "uppercase", fontWeight: 700, color: "#04A49B" }}>
            L&apos;exercice
          </p>
          <h2 style={{ ...H2_ARTICLE, color: "#fff", marginBottom: 12 }}>{article.exercice.title}</h2>
          <ArticleTexte texte={article.exercice.body ?? ""} style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,.78)" }} />
        </section>
      )}

      {article.faq.length > 0 && (
        <section id="sec-faq" className="ar-sec" style={{ marginBottom: "clamp(32px,4vw,44px)" }}>
          <h2 style={H2_ARTICLE}>Questions fréquentes</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {article.faq.map((f) => (
              <details key={f.q} style={{ background: "#fff", borderRadius: "var(--r-m)", padding: "18px 20px", boxShadow: "0 3px 16px rgba(60,40,30,.06)" }}>
                <summary style={{ cursor: "pointer", fontSize: 15, fontWeight: 700, color: "#003850" }}>{f.q}</summary>
                <ArticleTexte texte={f.a} style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.7, color: "rgba(51,51,52,.75)" }} />
              </details>
            ))}
          </div>
        </section>
      )}

      {article.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
          {article.tags.map((t) => (
            <span key={t} style={{ padding: "6px 13px", borderRadius: "var(--r-pill)", background: "rgba(4,164,155,.1)", color: "#04A49B", fontSize: 12, fontWeight: 600 }}>
              {t}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
