import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { METHODES, getMethode } from "@/lib/methodes";
import { ROUTES } from "@/lib/routes";

export function generateStaticParams() {
  return METHODES.map((m) => ({ slug: m.slug }));
}

/** Titre lisible : on retire le <br> décoratif du hero. */
function plainTitle(title: string) {
  return title.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").trim();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = getMethode(slug);
  if (!m) return {};
  const title = plainTitle(m.title);
  const description = m.lead.replace(/<[^>]+>/g, "").trim();
  return {
    title: `${title} — ${m.eyebrow.replace(/&amp;/g, "&")}`,
    description,
    alternates: { canonical: `https://mugitu-biarritz.fr/methodes/${slug}` },
    openGraph: { title, description },
  };
}

export default async function MethodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getMethode(slug);
  if (!m) notFound();

  return (
    <>
      <SiteHeader />

      <main style={{ position: "relative", overflowX: "hidden", background: "#FDF8F4" }}>
        {/* ░░ HERO ░░ */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "clamp(120px,16vh,180px) clamp(20px,5vw,64px) clamp(50px,7vw,80px)",
            background: "linear-gradient(160deg,#013242,#003850 55%,#0A556B)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.05,
              backgroundImage: "radial-gradient(circle at 1px 1px,#fff 1px,transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "-12%",
              right: "-8%",
              width: "44%",
              height: "60%",
              background: "radial-gradient(circle,rgba(4,164,155,.2),transparent 70%)",
              filter: "blur(20px)",
            }}
          />
          <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto" }}>
            <nav
              aria-label="Fil d'Ariane"
              style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,.55)", marginBottom: 26, flexWrap: "wrap" }}
            >
              <Link href={ROUTES.home} style={{ color: "rgba(255,255,255,.55)", textDecoration: "none" }}>
                Accueil
              </Link>
              <span>›</span>
              <Link href={ROUTES.soins} style={{ color: "rgba(255,255,255,.55)", textDecoration: "none" }}>
                Nos soins
              </Link>
              <span>›</span>
              <span style={{ color: "#04A49B", fontWeight: 600 }}>{m.crumb}</span>
            </nav>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "clamp(28px,5vw,72px)", alignItems: "end" }}>
              <div>
                <p style={{ margin: "0 0 18px", fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", fontWeight: 600, color: "#04A49B" }}>
                  {m.eyebrow.replace(/&amp;/g, "&")}
                </p>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "clamp(48px,9vw,110px)",
                    fontWeight: 700,
                    letterSpacing: "-.035em",
                    lineHeight: 0.92,
                    color: "#fff",
                  }}
                  dangerouslySetInnerHTML={{ __html: m.title }}
                />
              </div>
              <div style={{ paddingBottom: 10 }}>
                <p
                  style={{
                    margin: "0 0 22px",
                    fontSize: "clamp(16px,1.5vw,19px)",
                    fontWeight: 300,
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,.78)",
                    maxWidth: 460,
                  }}
                  dangerouslySetInnerHTML={{ __html: m.lead }}
                />
                <Link
                  href={m.cta}
                  className="mg-cta-teal"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "15px 30px",
                    borderRadius: 999,
                    background: "#04A49B",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Prendre rendez-vous <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ░░ CORPS ░░ */}
        <div dangerouslySetInnerHTML={{ __html: m.bodyHtml }} />
      </main>

      <SiteFooter />
    </>
  );
}
