import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPageView from "@/components/site/ContentPageView";
import JsonLd from "@/components/site/JsonLd";
import { contentMetadata, seoContenu } from "@/lib/content-meta";
import { PATHOLOGIES, getPathologie } from "@/lib/pathologies";
import { filAriane, pageMedicale } from "@/lib/seo/donnees-structurees";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return PATHOLOGIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPathologie(slug);
  return p ? contentMetadata(p, `/pathologies/${slug}`) : {};
}

export default async function PathologiePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getPathologie(slug);
  if (!page) notFound();
  const chemin = `/pathologies/${slug}`;
  const { description } = seoContenu(page, chemin);
  return (
    <>
      <JsonLd
        donnees={[
          filAriane(SITE_URL, page.trail, { label: page.crumb, chemin }),
          pageMedicale(SITE_URL, { chemin, titre: page.title, description, pathologie: page.crumb }),
        ]}
      />
      <ContentPageView page={page} orientation={slug} />
    </>
  );
}
