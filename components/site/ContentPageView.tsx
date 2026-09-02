import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import PageHero from "./PageHero";
import type { ContentPage } from "@/lib/content-page";

/**
 * Rendu complet d'une page de contenu extraite des maquettes : header, hero,
 * corps, footer. Soins, pathologies et sports partagent exactement ce
 * gabarit — seule la donnée change.
 */
export default function ContentPageView({ page }: { page: Omit<ContentPage, "slug"> }) {
  return (
    <>
      <SiteHeader />
      <main style={{ position: "relative", overflowX: "hidden", background: "#FDF8F4" }}>
        <PageHero
          trail={page.trail}
          crumb={page.crumb}
          eyebrow={page.eyebrow}
          title={page.title}
          lead={page.lead}
          cta={page.cta}
          titleSize={page.titleSize}
          titleLineHeight={page.titleLineHeight}
        />
        {/* HTML statique versionné, issu du bundle de design (cf. lib/content-page.ts). */}
        <div dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
      </main>
      <SiteFooter />
    </>
  );
}
