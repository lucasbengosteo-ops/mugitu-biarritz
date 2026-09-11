import type { Metadata } from "next";
import Link from "next/link";
import JeuxInscription from "@/components/site/JeuxInscription";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { articlePath } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Jeux concours du Mugitu Hub — Alba Deep Fitness Race",
  description:
    "Inscrivez-vous aux jeux du stand Mugitu à l’Alba Deep Fitness Race, les 12 et 13 septembre 2026 à la Halle d’Iraty.",
  // On y arrive par le QR code du stand : inutile de l'indexer.
  robots: { index: false, follow: true },
};

/**
 * Page d'arrivée du QR code affiché sur le stand. Le formulaire vient tout de
 * suite : la personne est debout, téléphone en main, entre deux épreuves.
 */
export default function JeuxPage() {
  return (
    <>
      <SiteHeader />
      <main className="mg-main" style={{ background: "#FDF8F4" }}>
        <section
          style={{
            padding: "clamp(96px,14vh,130px) clamp(18px,5vw,40px) clamp(22px,4vw,32px)",
            background: "linear-gradient(160deg,#012A3A,#003850 55%,#0A556B)",
          }}
        >
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <p style={{ margin: "0 0 12px", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 700, color: "#04A49B" }}>
              Alba Deep Fitness Race · Mugitu Hub
            </p>
            <h1 className="mg-h1-m" style={{ margin: "0 0 12px", fontWeight: 800, letterSpacing: "-.03em", color: "#fff", textWrap: "balance" }}>
              Les jeux du stand
            </h1>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,.75)", textWrap: "pretty" }}>
              Inscription gratuite et ouverte à tous. Choisissez vos jeux, obtenez votre numéro, et passez nous voir à l’étage
              intermédiaire.
            </p>
          </div>
        </section>

        <section style={{ padding: "clamp(26px,5vw,40px) clamp(18px,5vw,40px) clamp(56px,8vw,90px)" }}>
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <JeuxInscription />
            <p style={{ margin: "28px 0 0", textAlign: "center", fontSize: 13.5, color: "rgba(51,51,52,.55)" }}>
              <Link href={articlePath("alba-deep-fitness-race")} style={{ color: "#04A49B", fontWeight: 600, textDecoration: "none" }}>
                Tout le programme du week-end
              </Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
