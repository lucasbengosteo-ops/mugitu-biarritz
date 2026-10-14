import Link from "next/link";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import PageHero from "./PageHero";
import type { ContentPage } from "@/lib/content-page";

/**
 * Rendu complet d’une page de contenu extraite des maquettes : header, hero,
 * corps, footer. Soins, pathologies et sports partagent exactement ce
 * gabarit — seule la donnée change.
 */
export default function ContentPageView({
  page,
  orientation,
}: {
  page: Omit<ContentPage, "slug">;
  /** Slug de la page : affiche l'encadré « Vous ne savez pas qui consulter ? ». */
  orientation?: string;
}) {
  return (
    <>
      <SiteHeader />
      <main className="mg-main" style={{ background: "#FDF8F4" }}>
        <PageHero
          trail={page.trail}
          crumb={page.crumb}
          eyebrow={page.eyebrow}
          title={page.title}
          lead={page.lead}
          cta={page.cta}
          size={page.size}
        />
        {/* HTML statique versionné, issu du bundle de design (cf. lib/content-page.ts). */}
        <div dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
        {orientation ? (
          <aside className="po-encart" aria-label="Trouver qui consulter">
            <p className="po-encart-titre">Vous ne savez pas qui consulter&nbsp;?</p>
            <p>Quelques questions, et nous vous indiquons qui voir au cabinet.</p>
            <Link href={`/?depuis=${orientation}#par-ou-commencer`} className="po-encart-lien">
              Par où commencer&nbsp;?
            </Link>
          </aside>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
