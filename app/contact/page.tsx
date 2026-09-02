import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import BackLink from "@/components/site/BackLink";
import ContactInteractions from "@/components/site/ContactInteractions";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Nous contacter",
  description:
    "Écrivez directement au praticien concerné ou à l’adresse générale du cabinet Mugitu, 3 avenue Kléber à Biarritz. Annuaire de l’équipe et formulaire de contact.",
  alternates: { canonical: "https://mugitu-biarritz.fr/contact" },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader solid />
      <main style={{ position: "relative", overflowX: "hidden", background: "#FDF8F4" }}>
        {/* Hero clair, propre à la page Contact. */}
        <section style={{ padding: "clamp(120px,16vh,180px) clamp(20px,5vw,64px) clamp(40px,6vw,64px)", maxWidth: 1280, margin: "0 auto" }}>
          <BackLink />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "clamp(28px,5vw,72px)", alignItems: "end" }}>
            <div>
              <p style={{ margin: "0 0 18px", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 600, color: "#04A49B" }}>
                {CONTACT.eyebrow}
              </p>
              <h1
                className={`mg-h1-${CONTACT.size}`}
                style={{
                  margin: 0,
                  fontWeight: 700,
                  letterSpacing: "-.035em",
                  color: "#003850",
                  textWrap: "balance",
                }}
                dangerouslySetInnerHTML={{ __html: CONTACT.title }}
              />
            </div>
            <div style={{ paddingBottom: 10 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "clamp(16px,1.5vw,19px)",
                  fontWeight: 300,
                  lineHeight: 1.6,
                  color: "rgba(51,51,52,.72)",
                  maxWidth: 460,
                }}
                dangerouslySetInnerHTML={{ __html: CONTACT.lead }}
              />
            </div>
          </div>
        </section>

        <ContactInteractions html={CONTACT.bodyHtml} />
      </main>
      <SiteFooter />
    </>
  );
}
