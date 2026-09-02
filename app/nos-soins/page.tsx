import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PageHero from "@/components/site/PageHero";
import { NOS_SOINS } from "@/lib/soins";

export const metadata: Metadata = {
  title: "Nos soins — disciplines, pathologies, sports & bilans",
  description:
    "Sept métiers sous le même toit à Biarritz. Trouvez votre porte d'entrée : par discipline, par pathologie, par sport pratiqué, ou par bilan à réaliser.",
  alternates: { canonical: "https://mugitu-biarritz.fr/nos-soins" },
};

export default function NosSoinsPage() {
  return (
    <>
      <SiteHeader />
      <main style={{ position: "relative", overflowX: "hidden", background: "#FDF8F4" }}>
        <PageHero
          trail={NOS_SOINS.trail}
          crumb={NOS_SOINS.crumb}
          eyebrow={NOS_SOINS.eyebrow}
          title={NOS_SOINS.title}
          lead={NOS_SOINS.lead}
          cta={NOS_SOINS.cta}
        />
        <div dangerouslySetInnerHTML={{ __html: NOS_SOINS.bodyHtml }} />
      </main>
      <SiteFooter />
    </>
  );
}
