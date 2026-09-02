import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PageHero from "@/components/site/PageHero";
import { METHODES, getMethode } from "@/lib/methodes";
import { ROUTES } from "@/lib/routes";

export function generateStaticParams() {
  return METHODES.map((m) => ({ slug: m.slug }));
}

/** Retire le HTML de mise en forme pour les balises meta. */
function plain(html: string) {
  return html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

/** Fil d’Ariane des méthodes, identique sur les 10 maquettes. */
const TRAIL = [
  { label: "Accueil", href: ROUTES.home },
  { label: "Nos soins", href: ROUTES.soins },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = getMethode(slug);
  if (!m) return {};
  const title = plain(m.title);
  const description = plain(m.lead);
  return {
    title: `${title} — ${plain(m.eyebrow)}`,
    description,
    alternates: { canonical: `https://mugitu-biarritz.fr/methodes/${slug}` },
    openGraph: { title, description },
  };
}

export default async function MethodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getMethode(slug);
  if (!m) notFound();

  return (
    <>
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
