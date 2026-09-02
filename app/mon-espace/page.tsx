import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, LineChart, Sparkles, Stethoscope } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PageHero from "@/components/site/PageHero";
import { EXTERNAL, ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Mon espace patient",
  description:
    "L’espace patient Mugitu : vos rendez-vous, vos activités du Mugi Klub et votre progression, synchronisés avec vos praticiens. Bientôt disponible.",
  alternates: { canonical: "https://mugitu-biarritz.fr/mon-espace" },
  // Page d’annonce : pas d’intérêt à la référencer tant que l’espace n’existe pas.
  robots: { index: false, follow: true },
};

/**
 * Page d’annonce de l’espace patient.
 *
 * La maquette « Mon Espace » propose un espace complet (connexion, rendez-vous,
 * progression, auto-tests). Elle repose sur un identifiant en dur dans le
 * JavaScript et un état en localStorage : la publier telle quelle reviendrait à
 * mettre une fausse connexion en ligne. Cette page annonce donc le service et
 * renvoie vers la prise de rendez-vous, en attendant une vraie authentification.
 */
const MODULES = [
  { icon: CalendarDays, title: "Mes rendez-vous", text: "Vos séances et activités à venir, au même endroit." },
  { icon: Sparkles, title: "Le Klub", text: "Inscrivez-vous aux activités avec vos crédits." },
  { icon: LineChart, title: "Ma progression", text: "Synchronisée avec vos praticiens sur app.mugitu.pro." },
  { icon: Stethoscope, title: "Auto-tests santé", text: "Des repères simples pour suivre votre état entre deux séances." },
];

export default function MonEspacePage() {
  return (
    <>
      <SiteHeader />
      <main className="mg-main" style={{ background: "#FDF8F4" }}>
        <PageHero
          trail={[{ label: "Accueil", href: ROUTES.home }]}
          crumb="Mon espace"
          eyebrow="Bientôt disponible"
          title="Mon espace<br>patient"
          lead="Retrouver vos rendez-vous, vos activités du Klub et votre progression au même endroit. L’espace ouvrira bientôt&nbsp;; en attendant, la prise de rendez-vous se fait directement auprès de votre praticien."
          cta={ROUTES.team}
          size="xl"
        />

        <section style={{ maxWidth: 1140, margin: "0 auto", padding: "clamp(50px,7vw,90px) clamp(20px,5vw,40px)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
            {MODULES.map(({ icon: Icon, title, text }) => (
              <div key={title} style={{ background: "#fff", borderRadius: "var(--r-l)", padding: 26, boxShadow: "0 4px 20px rgba(60,40,30,.06)" }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "var(--r-s)",
                    background: "rgba(4,164,155,.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Icon style={{ width: 23, height: 23, color: "#04A49B" }} />
                </div>
                <h2 style={{ margin: "0 0 7px", fontSize: 17, fontWeight: 700, color: "#003850" }}>{title}</h2>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "rgba(51,51,52,.65)" }}>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: "#003850", padding: "clamp(56px,8vw,90px) clamp(20px,5vw,48px)", textAlign: "center" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h2 style={{ margin: "0 0 14px", fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, letterSpacing: "-.02em", color: "#fff" }}>
              En attendant, prenez rendez-vous
            </h2>
            <p style={{ margin: "0 0 30px", fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,.7)" }}>
              Chaque praticien de la Mugi Team gère ses créneaux en ligne. Vous êtes praticien&nbsp;? Votre espace se
              trouve sur app.mugitu.pro.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
              <Link
                href={ROUTES.team}
                className="mg-cta-teal"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "15px 32px",
                  borderRadius: "var(--r-pill)",
                  background: "#04A49B",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Prendre rendez-vous <span>↗</span>
              </Link>
              <a
                href={EXTERNAL.appPraticien}
                target="_blank"
                rel="noopener noreferrer"
                className="mg-cta-ghost"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "15px 32px",
                  borderRadius: "var(--r-pill)",
                  border: "1px solid rgba(255,255,255,.4)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Espace praticien ↗
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
