import type { Metadata } from "next";
import type { ContentPage } from "./content-page";

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

/** Metadata standard d'une page de contenu, à partir de son hero. */
export function contentMetadata(page: ContentPage, path: string): Metadata {
  const title = plain(page.title);
  const description = plain(page.lead);
  return {
    title,
    description,
    alternates: { canonical: `https://mugitu-biarritz.fr${path}` },
    openGraph: { title, description },
  };
}
