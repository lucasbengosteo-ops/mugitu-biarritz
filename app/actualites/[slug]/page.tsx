import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleToc from "@/components/site/ArticleToc";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { articleDate, formatDate, getArticle, listArticles } from "@/lib/articles";
import { articlePath, ROUTES } from "@/lib/routes";
import { jsonLdScript } from "@/lib/json-ld";

// ISR : publier un article n’exige pas de redéploiement (cf. ARTICLES_REVALIDATE).
export const revalidate = 300;

/** Les articles en ligne sont pré-rendus ; les nouveaux le seront à la demande. */
export async function generateStaticParams() {
  const articles = await listArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return {};
  const title = a.seo?.title || a.title;
  const description = a.seo?.desc || a.chapo;
  return {
    title,
    description,
    alternates: { canonical: `https://mugitu-biarritz.fr/actualites/${slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: articleDate(a),
      authors: [a.author.name],
      images: a.cover ? [{ url: a.cover }] : undefined,
    },
  };
}

const H2: React.CSSProperties = {
  margin: "0 0 16px",
  fontSize: "clamp(22px,3vw,30px)",
  fontWeight: 700,
  letterSpacing: "-.02em",
  color: "#003850",
};

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const all = await listArticles();
  const related = all.filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 3);

  // Sommaire : les sections, puis les blocs optionnels réellement présents.
  const toc = [
    ...article.sections.map((s, i) => ({ id: `sec-${i}`, label: s.h })),
    ...(article.cas ? [{ id: "sec-cas", label: "Un cas concret" }] : []),
    ...(article.exercice?.title ? [{ id: "sec-ex", label: article.exercice.title }] : []),
    ...(article.faq.length ? [{ id: "sec-faq", label: "Questions fréquentes" }] : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.chapo,
    datePublished: articleDate(article),
    author: { "@type": "Person", name: article.author.name },
    publisher: { "@type": "Organization", name: "Mugitu Biarritz" },
    // Une couverture peut désormais être une URL absolue (image déposée dans
    // le stockage Supabase) ou un chemin local hérité : ne préfixer que le second.
    ...(article.cover
      ? { image: article.cover.startsWith("http") ? article.cover : `https://mugitu-biarritz.fr${article.cover}` }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <SiteHeader />

      <main className="mg-main" style={{ background: "#FDF8F4" }}>
        {/* ░░ HERO ░░ */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "clamp(120px,15vh,170px) clamp(20px,5vw,64px) clamp(44px,6vw,72px)",
            background: "linear-gradient(160deg,#012A3A,#003850 55%,#0A556B)",
            color: "#fff",
          }}
        >
          <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "radial-gradient(circle at 1px 1px,#fff 1px,transparent 0)", backgroundSize: "40px 40px" }} />
          <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto" }}>
            <nav aria-label="Fil d’Ariane" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,.5)", marginBottom: 26, flexWrap: "wrap" }}>
              <Link href={ROUTES.home} style={{ color: "rgba(255,255,255,.5)", textDecoration: "none" }}>Accueil</Link>
              <span>›</span>
              <Link href={ROUTES.actualites} style={{ color: "rgba(255,255,255,.5)", textDecoration: "none" }}>Les actualités</Link>
              <span>›</span>
              <span style={{ color: "#04A49B", fontWeight: 600 }}>{article.category}</span>
            </nav>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "clamp(26px,4vw,52px)", alignItems: "center" }}>
              <div>
                <p style={{ margin: "0 0 16px", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 600, color: "#04A49B" }}>
                  {article.eyebrow ?? article.category}
                </p>
                <h1 className="mg-h1-m" style={{ margin: "0 0 20px", fontWeight: 700, letterSpacing: "-.035em", lineHeight: 1.04 }}>
                  {article.title}
                </h1>
                <p style={{ margin: "0 0 26px", maxWidth: 600, fontSize: "clamp(16px,1.5vw,19px)", fontWeight: 300, lineHeight: 1.6, color: "rgba(255,255,255,.78)" }}>
                  {article.chapo}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  {article.author.photo && (
                    <Image src={article.author.photo} alt="" width={44} height={44} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", objectPosition: "center 22%" }} />
                  )}
                  <div style={{ lineHeight: 1.35 }}>
                    {article.author.fiche ? (
                      <Link href={article.author.fiche} style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#fff", textDecoration: "none" }}>
                        {article.author.name}
                      </Link>
                    ) : (
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{article.author.name}</p>
                    )}
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,.55)" }}>{article.author.job}</p>
                  </div>
                  <span style={{ width: 1, height: 28, background: "rgba(255,255,255,.18)" }} />
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", lineHeight: 1.35 }}>
                    {formatDate(articleDate(article))}
                    {article.read_mins ? <><br />{article.read_mins} min de lecture</> : null}
                  </div>
                </div>
              </div>
              {article.cover && (
                <div style={{ position: "relative", borderRadius: "var(--r-l)", overflow: "hidden", aspectRatio: "4 / 3", boxShadow: "0 14px 40px rgba(0,0,0,.28)" }}>
                  <Image src={article.cover} alt="" fill priority sizes="(max-width: 900px) 100vw, 560px" style={{ objectFit: "cover", objectPosition: article.cover_focus }} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ░░ SOMMAIRE + CORPS ░░ */}
        <div className="ar-layout">
          <ArticleToc entries={toc} />

          <div style={{ minWidth: 0 }}>
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
                <h2 style={H2}>{s.h}</h2>
                {s.p.map((para, j) => (
                  <p key={j} style={{ margin: "0 0 16px", fontSize: 16, lineHeight: 1.75, color: "rgba(51,51,52,.8)", textWrap: "pretty" }}>
                    {para}
                  </p>
                ))}
              </section>
            ))}

            {article.cas && (
              <section id="sec-cas" className="ar-sec" style={{ marginBottom: "clamp(32px,4vw,44px)", background: "#F5EDE4", borderRadius: "var(--r-l)", padding: "clamp(24px,3vw,34px)" }}>
                <p style={{ margin: "0 0 10px", fontSize: 11, letterSpacing: "var(--ls-label)", textTransform: "uppercase", fontWeight: 700, color: "#04A49B" }}>
                  Un cas concret
                </p>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: "rgba(51,51,52,.82)" }}>{article.cas}</p>
              </section>
            )}

            {article.exercice?.title && (
              <section id="sec-ex" className="ar-sec" style={{ marginBottom: "clamp(32px,4vw,44px)", background: "linear-gradient(150deg,#003850,#0A556B)", borderRadius: "var(--r-l)", padding: "clamp(24px,3vw,34px)", color: "#fff" }}>
                <p style={{ margin: "0 0 10px", fontSize: 11, letterSpacing: "var(--ls-label)", textTransform: "uppercase", fontWeight: 700, color: "#04A49B" }}>
                  L&apos;exercice
                </p>
                <h2 style={{ ...H2, color: "#fff", marginBottom: 12 }}>{article.exercice.title}</h2>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,.78)" }}>{article.exercice.body}</p>
              </section>
            )}

            {article.faq.length > 0 && (
              <section id="sec-faq" className="ar-sec" style={{ marginBottom: "clamp(32px,4vw,44px)" }}>
                <h2 style={H2}>Questions fréquentes</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {article.faq.map((f) => (
                    <details key={f.q} style={{ background: "#fff", borderRadius: "var(--r-m)", padding: "18px 20px", boxShadow: "0 3px 16px rgba(60,40,30,.06)" }}>
                      <summary style={{ cursor: "pointer", fontSize: 15, fontWeight: 700, color: "#003850" }}>{f.q}</summary>
                      <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.7, color: "rgba(51,51,52,.75)" }}>{f.a}</p>
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

            <div style={{ background: "#003850", borderRadius: "var(--r-l)", padding: "clamp(26px,3.5vw,40px)", textAlign: "center" }}>
              <h2 style={{ ...H2, color: "#fff" }}>Une question sur votre situation&nbsp;?</h2>
              <p style={{ margin: "0 0 24px", fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,.7)" }}>
                Un article ne remplace pas un examen. L&apos;équipe vous reçoit 3 avenue Kléber à Biarritz.
              </p>
              <Link
                href={ROUTES.team}
                className="mg-cta-teal"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 30px", borderRadius: "var(--r-pill)", background: "#04A49B", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none" }}
              >
                Prendre rendez-vous <span>↗</span>
              </Link>
            </div>

            {related.length > 0 && (
              <section style={{ marginTop: "clamp(40px,5vw,60px)" }}>
                <h2 style={{ ...H2, marginBottom: 20 }}>À lire aussi</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 16 }}>
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={articlePath(r.slug)}
                      className="mg-card-lift"
                      style={{ background: "#fff", borderRadius: "var(--r-m)", overflow: "hidden", boxShadow: "0 3px 16px rgba(60,40,30,.06)", textDecoration: "none" }}
                    >
                      <div style={{ position: "relative", height: 110, background: "#012A3A" }}>
                        {r.cover && <Image src={r.cover} alt="" fill sizes="220px" style={{ objectFit: "cover", objectPosition: r.cover_focus }} />}
                      </div>
                      <div style={{ padding: 16 }}>
                        <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "#04A49B" }}>{r.category}</p>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#003850", lineHeight: 1.35 }}>{r.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
