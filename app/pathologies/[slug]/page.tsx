import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPageView from "@/components/site/ContentPageView";
import { contentMetadata } from "@/lib/content-meta";
import { PATHOLOGIES, getPathologie } from "@/lib/pathologies";

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
  return <ContentPageView page={page} />;
}
