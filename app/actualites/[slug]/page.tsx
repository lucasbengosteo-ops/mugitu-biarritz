import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCorps, { H2_ARTICLE } from "@/components/site/ArticleCorps";
import ArticleToc from "@/components/site/ArticleToc";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { articleDate, formatDate, getArticle, listArticles } from "@/lib/articles";
import NewsletterForm from "@/components/site/NewsletterForm";
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
            padding: "clamp(120px,15vh,170px) clamp(20px,5vw,64px) clamp(50px,7vw,80px)",
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
            <ArticleCorps article={article} />

            <div style={{ background: "#003850", borderRadius: "var(--r-l)", padding: "clamp(26px,3.5vw,40px)", textAlign: "center" }}>
              <h2 style={{ ...H2_ARTICLE, color: "#fff" }}>Une question sur votre situation&nbsp;?</h2>
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
                <h2 style={{ ...H2_ARTICLE, marginBottom: 20 }}>À lire aussi</h2>
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

            {/* Après l'article et les suggestions : le lecteur arrivé jusqu'ici
                sans prendre rendez-vous est celui qu'une lettre mensuelle peut
                ramener. Placé après le CTA de rendez-vous pour ne pas lui faire
                concurrence. */}
            <section style={{ marginTop: "clamp(40px,5vw,60px)", paddingTop: "clamp(28px,4vw,40px)", borderTop: "1px solid rgba(0,56,80,.12)" }}>
              <h2 style={{ ...H2_ARTICLE, marginBottom: 14 }}>La lettre Mugitu</h2>
              <div style={{ maxWidth: 470 }}>
                <NewsletterForm source={`article:${slug}`} />
              </div>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
