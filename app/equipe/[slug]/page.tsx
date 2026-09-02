import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import FicheRail from "@/components/site/FicheRail";
import LucideIcon from "@/components/site/LucideIcon";
import { FICHES, getFiche } from "@/lib/fiches";
import { getPractitioner } from "@/lib/team";
import { ROUTES } from "@/lib/routes";

/** Les 13 fiches sont connues à la compilation → pages statiques. */
export function generateStaticParams() {
  return FICHES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const fiche = getFiche(slug);
  if (!fiche) return {};
  const practitioner = getPractitioner(slug);
  return {
    title: `${fiche.name} — ${fiche.badge}`,
    description:
      practitioner?.bio ??
      `${fiche.name}, ${fiche.badge} au cabinet Mugitu, 3 avenue Kléber à Biarritz. Prenez rendez-vous en ligne.`,
    alternates: { canonical: `https://mugitu-biarritz.fr/equipe/${slug}` },
    openGraph: {
      title: `${fiche.name} — ${fiche.badge}`,
      description: practitioner?.bio ?? fiche.badge,
      images: [{ url: fiche.photo }],
    },
  };
}

export default async function FichePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fiche = getFiche(slug);
  if (!fiche) notFound();

  const external = fiche.booking.startsWith("http");

  return (
    <>
      <SiteHeader />

      <main style={{ position: "relative", overflowX: "clip", background: "#FDF8F4" }}>
        {/* ░░ HERO ░░ */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "clamp(120px,15vh,170px) clamp(20px,5vw,64px) clamp(50px,7vw,84px)",
            background: "linear-gradient(160deg,#012A3A,#003850 55%,#0A556B)",
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
              background: "radial-gradient(circle,rgba(4,164,155,.22),transparent 70%)",
              filter: "blur(20px)",
            }}
          />
          <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto" }}>
            <nav
              aria-label="Fil d’Ariane"
              style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,.55)", marginBottom: 30, flexWrap: "wrap" }}
            >
              <Link href={ROUTES.home} style={{ color: "rgba(255,255,255,.55)", textDecoration: "none" }}>
                Accueil
              </Link>
              <span>›</span>
              <Link href={ROUTES.team} style={{ color: "rgba(255,255,255,.55)", textDecoration: "none" }}>
                La Mugi Team
              </Link>
              <span>›</span>
              <span style={{ color: "#04A49B", fontWeight: 600 }}>{fiche.name}</span>
            </nav>

            <div style={{ display: "flex", gap: "clamp(28px,5vw,64px)", alignItems: "center", flexWrap: "wrap" }}>
              <div
                style={{
                  position: "relative",
                  width: "clamp(200px,26vw,300px)",
                  aspectRatio: "4 / 5",
                  borderRadius: "var(--r-xl)",
                  overflow: "hidden",
                  boxShadow: "0 24px 60px rgba(0,0,0,.4)",
                  flex: "0 0 auto",
                }}
              >
                <Image
                  src={fiche.photo}
                  alt={fiche.name}
                  fill
                  priority
                  sizes="(max-width: 900px) 60vw, 300px"
                  style={{ objectFit: "cover", objectPosition: fiche.objectPosition }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 280 }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "7px 16px",
                    borderRadius: "var(--r-pill)",
                    background: "rgba(4,164,155,.18)",
                    border: "1px solid rgba(4,164,155,.35)",
                    color: "#04A49B",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "var(--ls-label)",
                    textTransform: "uppercase",
                    marginBottom: 20,
                  }}
                >
                  {fiche.badge}
                </span>
                <h1 className="mg-h1-l"
                  style={{
                    margin: "0 0 18px",
                    fontWeight: 800,
                    letterSpacing: "-.035em",
                    color: "#fff",
                  }}
                >
                  {fiche.name}
                </h1>
                {fiche.quote && (
                  <p
                    style={{
                      margin: "0 0 28px",
                      fontSize: "clamp(19px,2.4vw,28px)",
                      fontWeight: 400,
                      lineHeight: 1.3,
                      color: "rgba(255,255,255,.82)",
                      maxWidth: 520,
                    }}
                    dangerouslySetInnerHTML={{ __html: fiche.quote }}
                  />
                )}

                <div style={{ display: "flex", flexWrap: "wrap", gap: "14px 20px", alignItems: "center" }}>
                  {fiche.booking && (
                    <a
                      href={fiche.booking}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="mg-cta-teal"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 9,
                        padding: "16px 34px",
                        borderRadius: "var(--r-pill)",
                        background: "#04A49B",
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: 600,
                        textDecoration: "none",
                        boxShadow: "0 10px 30px rgba(4,164,155,.35)",
                      }}
                    >
                      Prendre rendez-vous <span>↗</span>
                    </a>
                  )}
                  {fiche.chips.map((c) => (
                    <span key={c.text} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, color: "rgba(255,255,255,.6)" }}>
                      <LucideIcon name={c.icon} style={{ width: 16, height: 16, color: "#04A49B" }} />
                      {c.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ░░ RAIL + CONTENU ░░ */}
        <div className="lb-layout">
          <FicheRail html={fiche.railHtml} />
          <div className="lb-main" dangerouslySetInnerHTML={{ __html: fiche.mainHtml }} />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
