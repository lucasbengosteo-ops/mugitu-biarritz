import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PageHero from "@/components/site/PageHero";
import ArticleCards from "@/components/site/ArticleCards";
import { articleDate, formatDate, listArticles } from "@/lib/articles";
import { articlePath, ROUTES } from "@/lib/routes";

// ISR : publier un article n’exige pas de redéploiement (cf. ARTICLES_REVALIDATE).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Les actualités — conseils sport-santé de la Mugi Team",
  description:
    "Pathologies, sports, bilans : les articles de l’équipe Mugitu Biarritz. Comprendre sa blessure, sa pratique et ses bilans, expliqué par les praticiens du cabinet.",
  alternates: { canonical: "https://mugitu-biarritz.fr/actualites" },
};

export default async function ActualitesPage() {
  const articles = await listArticles();
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a.slug !== featured?.slug);
  // Dérivées de TOUS les articles : sinon une catégorie dont l’unique
  // article est à la une disparaîtrait des filtres.
  const categories = [...new Set(articles.map((a) => a.category))].sort();

  return (
    <>
      <SiteHeader />
      <main className="mg-main" style={{ background: "#FDF8F4" }}>
        <PageHero
          trail={[{ label: "Accueil", href: ROUTES.home }]}
          crumb="Les actualités"
          eyebrow="Le blog de Mugitu"
          title="Les actualités"
          lead="Comprendre sa blessure, sa pratique et ses bilans — expliqué par les praticiens du cabinet, sans jargon inutile."
          cta={ROUTES.team}
          size="xl"
        />

        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(40px,6vw,64px) clamp(20px,5vw,48px) 0" }}>
          {featured && (
            <Link
              href={articlePath(featured.slug)}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
                borderRadius: "var(--r-xl)",
                overflow: "hidden",
                boxShadow: "0 12px 44px rgba(60,40,30,.12)",
                textDecoration: "none",
                background: "#003850",
              }}
            >
              <div style={{ position: "relative", minHeight: 320 }}>
                {featured.cover && <Image src={featured.cover} alt="" fill sizes="(max-width: 900px) 100vw, 600px" style={{ objectFit: "cover" }} priority />}
              </div>
              <div style={{ padding: "clamp(28px,4vw,52px)", display: "flex", flexDirection: "column", justifyContent: "center", color: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                  <span
                    style={{
                      padding: "5px 12px",
                      borderRadius: "var(--r-pill)",
                      background: "rgba(243,190,121,.95)",
                      color: "#3a2a10",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "var(--ls-label)",
                      textTransform: "uppercase",
                    }}
                  >
                    À la une
                  </span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,.55)" }}>{featured.eyebrow ?? featured.category}</span>
                </div>
                <h2 style={{ margin: "0 0 14px", fontSize: "clamp(24px,3.2vw,34px)", fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1.15 }}>
                  {featured.title}
                </h2>
                <p style={{ margin: "0 0 24px", fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,.72)", maxWidth: 520 }}>{featured.chapo}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  {featured.author.photo && (
                    <Image
                      src={featured.author.photo}
                      alt=""
                      width={40}
                      height={40}
                      style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", objectPosition: "center 22%" }}
                    />
                  )}
                  <div style={{ lineHeight: 1.3 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{featured.author.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,.5)" }}>
                      {formatDate(articleDate(featured))}
                      {featured.read_mins ? ` · ${featured.read_mins} min` : ""}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </section>

        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(40px,6vw,64px) clamp(20px,5vw,48px) clamp(60px,8vw,100px)" }}>
          <ArticleCards articles={rest} categories={categories} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
