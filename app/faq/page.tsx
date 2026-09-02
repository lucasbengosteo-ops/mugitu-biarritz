import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PageHero from "@/components/site/PageHero";
import FaqAccordion from "@/components/site/FaqAccordion";
import { getInstitutionnel } from "@/lib/institutionnel";

const PAGE = getInstitutionnel("faq");

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description:
    "Tarifs, remboursements, déroulé des séances, prise de rendez-vous, méthodes : les réponses aux questions les plus posées au cabinet Mugitu Biarritz.",
  alternates: { canonical: "https://mugitu-biarritz.fr/faq" },
};

export default function FaqPage() {
  return (
    <>
      <SiteHeader />
      <main className="mg-main" style={{ background: "#FDF8F4" }}>
        <PageHero
          trail={PAGE.trail}
          crumb={PAGE.crumb}
          eyebrow={PAGE.eyebrow}
          title={PAGE.title}
          lead={PAGE.lead}
          cta={PAGE.cta}
          size={PAGE.size}
        />
        <FaqAccordion html={PAGE.bodyHtml} />
      </main>
      <SiteFooter />
    </>
  );
}
