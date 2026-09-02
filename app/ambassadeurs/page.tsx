import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import BackLink from "@/components/site/BackLink";
import { AMBASSADEURS } from "@/lib/ambassadeurs";

export const metadata: Metadata = {
  title: "Nos ambassadeurs",
  description:
    "Des sportifs du Pays Basque et d’ailleurs — surf de gros, trail, danse contemporaine — qui s’entraînent, récupèrent et performent avec la Mugi Team.",
  alternates: { canonical: "https://mugitu-biarritz.fr/ambassadeurs" },
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
  color: "rgba(255,255,255,.5)",
};

export default function AmbassadeursPage() {
  return (
    <>
      <SiteHeader />
      <main className="mg-main" style={{ background: "#FDF8F4" }}>
        {/* Hero au motif « esprit Mugitu » : retour + barre de statistiques. */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "clamp(140px,17vh,190px) clamp(20px,5vw,64px) clamp(48px,7vw,80px)",
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
              background: "radial-gradient(circle,rgba(4,164,155,.2),transparent 70%)",
              filter: "blur(20px)",
            }}
          />
          <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto" }}>
            <BackLink tone="dark" />
            <p style={{ margin: "0 0 18px", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 600, color: "#04A49B" }}>
              {AMBASSADEURS.eyebrow}
            </p>
            <h1
              className={`mg-h1-${AMBASSADEURS.size}`}
              style={{
                margin: "0 0 clamp(20px,3vw,28px)",
                fontWeight: 700,
                letterSpacing: "-.04em",
                color: "#fff",
                textWrap: "balance",
              }}
              dangerouslySetInnerHTML={{ __html: AMBASSADEURS.title }}
            />
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
              dangerouslySetInnerHTML={{ __html: AMBASSADEURS.lead }}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 0, borderTop: "1px solid rgba(255,255,255,.18)", paddingTop: 22 }}>
              {AMBASSADEURS.stats.map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    padding: i === 0 ? "0 clamp(28px,5vw,56px) 0 0" : "0 clamp(28px,5vw,56px)",
                    borderLeft: i === 0 ? undefined : "1px solid rgba(255,255,255,.18)",
                  }}
                >
                  <p style={STAT_VALUE} dangerouslySetInnerHTML={{ __html: s.value }} />
                  <p style={STAT_LABEL}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div dangerouslySetInnerHTML={{ __html: AMBASSADEURS.bodyHtml }} />
      </main>
      <SiteFooter />
    </>
  );
}
