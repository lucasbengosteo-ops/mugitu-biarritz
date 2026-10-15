import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPageView from "@/components/site/ContentPageView";
import JsonLd from "@/components/site/JsonLd";
import { contentMetadata } from "@/lib/content-meta";
import { filAriane } from "@/lib/seo/donnees-structurees";
import { SITE_URL } from "@/lib/site";
import { SPORTS, getSport } from "@/lib/sports";

export function generateStaticParams() {
  return SPORTS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getSport(slug);
  return s ? contentMetadata(s, `/sports/${slug}`) : {};
}

export default async function SportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getSport(slug);
  if (!page) notFound();
  return (
    <>
      <JsonLd donnees={[filAriane(SITE_URL, page.trail, { label: page.crumb, chemin: `/sports/${slug}` })]} />
      <ContentPageView page={page} />
    </>
  );
}
