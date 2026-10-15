import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PageHero from "@/components/site/PageHero";
import JsonLd from "@/components/site/JsonLd";
import { METHODES, getMethode } from "@/lib/methodes";
import { ROUTES } from "@/lib/routes";
import { contentMetadata } from "@/lib/content-meta";
import { filAriane } from "@/lib/seo/donnees-structurees";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return METHODES.map((m) => ({ slug: m.slug }));
}

/** Fil d’Ariane des méthodes, identique sur les 10 maquettes. */
const TRAIL = [
  { label: "Accueil", href: ROUTES.home },
  { label: "Nos soins", href: ROUTES.soins },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = getMethode(slug);
  return m ? contentMetadata(m, `/methodes/${slug}`) : {};
}

export default async function MethodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getMethode(slug);
  if (!m) notFound();

  return (
    <>
      <JsonLd donnees={[filAriane(SITE_URL, TRAIL, { label: m.crumb, chemin: `/methodes/${slug}` })]} />
      <SiteHeader />
      <main className="mg-main" style={{ background: "#FDF8F4" }}>
        <PageHero
          trail={TRAIL}
          crumb={m.crumb}
          eyebrow={m.eyebrow}
          title={m.title}
          lead={m.lead}
          cta={m.cta}
          size={m.size}
        />
        <div dangerouslySetInnerHTML={{ __html: m.bodyHtml }} />
      </main>
      <SiteFooter />
    </>
  );
}
