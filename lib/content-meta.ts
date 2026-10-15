import type { Metadata } from "next";
import type { ContentPage } from "./content-page";
import { SEO, SUFFIXE } from "./seo/pages.ts";
import { SITE_URL, partage } from "./site.ts";

/** Retire le HTML de mise en forme pour produire du texte de balise meta. */
export function plain(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Titre complet et description d'une page de contenu. La table
 * `lib/seo/pages.ts` prime ; à défaut, le titre du hero suivi de la marque,
 * et le chapô.
 */
export function seoContenu(page: Pick<ContentPage, "title" | "lead">, path: string): { title: string; description: string } {
  const seo = SEO[path];
  return {
    title: seo?.titre ?? `${plain(page.title)}${SUFFIXE}`,
    description: seo?.description ?? plain(page.lead),
  };
}

/** Metadata standard d’une page de contenu (soins, pathologies, sports, méthodes). */
export function contentMetadata(page: Pick<ContentPage, "title" | "lead">, path: string): Metadata {
  const { title, description } = seoContenu(page, path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: partage(path, { title, description }),
  };
}
