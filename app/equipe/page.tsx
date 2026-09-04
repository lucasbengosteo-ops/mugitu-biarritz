import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import BackLink from "@/components/site/BackLink";
import TeamGrid from "@/components/site/TeamGrid";
import { ROUTES } from "@/lib/routes";
import { equipeAvecOverrides, getOverrides } from "@/lib/practitioners";

export const metadata: Metadata = {
  title: "La Mugi Team — 13 praticiens du sport à Biarritz",
  description:
    "Médecins, kinés, ostéopathes, psychologues, préparateurs physiques, diététiciennes et podologue du sport réunis 3 avenue Kléber à Biarritz. Découvrez l’équipe et prenez rendez-vous.",
  alternates: { canonical: "https://mugitu-biarritz.fr/equipe" },
};

const STAT_VALUE: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(28px,3.2vw,38px)",
  fontWeight: 800,
  color: "#fff",
  letterSpacing: "-.02em",
  fontVariantNumeric: "tabular-nums",
};

const STAT_LABEL: React.CSSProperties = {
  margin: "3px 0 0",
  fontSize: 11,
  letterSpacing: "var(--ls-label)",
  textTransform: "uppercase",
  color: "rgba(255,255,255,.6)",
};

/* Les retouches du back-office sont relues à la même cadence que les
   articles. Valeur littérale obligatoire. */
export const revalidate = 300;

export default async function EquipePage() {
  const team = equipeAvecOverrides(await getOverrides());
  return (
    <>
      <SiteHeader />

      <main className="mg-main" style={{ background: "#FDF8F4" }}>
        {/* ░░ HERO / INTRO ░░
            Même dégradé navy et même trame que tous les autres hero de
            section : cette page était la seule en crème à texte sombre. */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "clamp(140px,17vh,190px) clamp(20px,5vw,64px) clamp(48px,7vw,80px)",
            background: "linear-gradient(160deg,#012A3A,#003850 55%,#0A556B)",
            color: "#fff",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.05,
              backgroundImage: "radial-gradient(circle at 1px 1px,#fff 1px,transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto" }}>
          <BackLink tone="dark" />
          <p style={{ margin: "0 0 18px", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 600, color: "#04A49B" }}>
            Pluridisciplinaire · Biarritz Kléber
          </p>
          <h1 className="mg-h1-xl"
            style={{
              margin: "0 0 clamp(20px,3vw,28px)",
              fontWeight: 700,
              letterSpacing: "-.04em",
              color: "#fff",
            }}
          >
            La Mugi Team
          </h1>
          <p
            style={{
              margin: "0 0 clamp(30px,4vw,44px)",
              fontSize: "clamp(17px,1.6vw,21px)",
              fontWeight: 300,
              lineHeight: 1.55,
              color: "rgba(255,255,255,.78)",
              maxWidth: 640,
              textWrap: "pretty",
            }}
          >
            Médecins, kinés, ostéos, psychologues, préparateurs physiques et diététiciens du sport réunis sous un même
            toit. Une équipe qui partage les dossiers, les méthodes et une même obsession&nbsp;: que le mouvement reste
            toujours possible.
          </p>
          <div className="mg-stats" style={{ "--mg-rule": "rgba(255,255,255,.18)" } as React.CSSProperties}>
            <div>
              <p style={STAT_VALUE}>{team.length}</p>
              <p style={STAT_LABEL}>Praticiens</p>
            </div>
            <div>
              <p style={STAT_VALUE}>8</p>
              <p style={STAT_LABEL}>Disciplines</p>
            </div>
            <div>
              <p style={STAT_VALUE}>1</p>
              <p style={STAT_LABEL}>Maison, 3 av. Kléber</p>
            </div>
          </div>
          </div>
        </section>

        {/* ░░ GRILLE ░░ */}
        <section style={{ padding: "0 clamp(20px,5vw,64px) clamp(60px,8vw,100px)", maxWidth: 1280, margin: "0 auto" }}>
          <TeamGrid team={team} />
        </section>

        {/* ░░ PHILOSOPHIE ░░ */}
        <section style={{ background: "#003850", padding: "clamp(60px,9vw,110px) clamp(20px,5vw,64px)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <p style={{ margin: "0 0 24px", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 600, color: "#04A49B" }}>
              L&apos;esprit Mugitu
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "clamp(22px,3.2vw,34px)",
                fontWeight: 300,
                lineHeight: 1.45,
                color: "#fff",
                letterSpacing: "-.01em",
                textWrap: "pretty",
              }}
            >
              «&nbsp;Le sportif blessé mérite une prise en charge{" "}
              <strong style={{ fontWeight: 700, color: "#04A49B" }}>coordonnée</strong> — kiné, médecin et ostéo, sous le
              même toit, avec le même dossier.&nbsp;»
            </p>
            <Link
              href={ROUTES.esprit}
              className="mg-cta-teal"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginTop: 38,
                padding: "15px 32px",
                borderRadius: "var(--r-pill)",
                background: "#04A49B",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Découvrir la maison <span>↗</span>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
