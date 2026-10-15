import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PageHero from "@/components/site/PageHero";
import FaqAccordion from "@/components/site/FaqAccordion";
import { getInstitutionnel } from "@/lib/institutionnel";
import JsonLd from "@/components/site/JsonLd";
import { extraireFaq } from "@/lib/aide/faq";
import { pageFaq } from "@/lib/seo/donnees-structurees";
import { metaPage } from "@/lib/site";

const PAGE = getInstitutionnel("faq");

export const metadata: Metadata = metaPage("/faq", {
  description:
    "Tarifs, remboursements, déroulé des séances, prise de rendez-vous, méthodes : les réponses aux questions les plus posées au cabinet Mugitu Biarritz.",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd donnees={[pageFaq(extraireFaq(PAGE.bodyHtml))]} />
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
