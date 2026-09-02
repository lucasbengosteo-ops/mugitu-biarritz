import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPageView from "@/components/site/ContentPageView";
import { contentMetadata } from "@/lib/content-meta";
import { SOINS, getSoin } from "@/lib/soins";

export function generateStaticParams() {
  return SOINS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getSoin(slug);
  return s ? contentMetadata(s, `/soins/${slug}`) : {};
}

export default async function SoinPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getSoin(slug);
  if (!page) notFound();
  return <ContentPageView page={page} />;
}
