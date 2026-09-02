import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PageHero from "@/components/site/PageHero";
import { SOINS, getSoin } from "@/lib/soins";

export function generateStaticParams() {
  return SOINS.map((s) => ({ slug: s.slug }));
}

/** Retire le HTML de mise en forme pour les balises meta. */
function plain(html: string) {
  return html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getSoin(slug);
  if (!s) return {};
  const title = plain(s.title);
  const description = plain(s.lead);
  return {
    title,
    description,
    alternates: { canonical: `https://mugitu-biarritz.fr/soins/${slug}` },
    openGraph: { title, description },
  };
}

export default async function SoinPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSoin(slug);
  if (!s) notFound();

  return (
    <>
      <SiteHeader />
      <main style={{ position: "relative", overflowX: "hidden", background: "#FDF8F4" }}>
        <PageHero trail={s.trail} crumb={s.crumb} eyebrow={s.eyebrow} title={s.title} lead={s.lead} cta={s.cta} />
        <div dangerouslySetInnerHTML={{ __html: s.bodyHtml }} />
      </main>
      <SiteFooter />
    </>
  );
}
