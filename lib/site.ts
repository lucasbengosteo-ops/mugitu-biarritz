import type { Metadata } from "next";
import { titreDe } from "./seo/pages.ts";

/**
 * Origine canonique du site. L'apex mugitu-biarritz.fr redirige (307) vers le
 * www : toutes les URL absolues destinées aux moteurs (canonical, Open Graph,
 * JSON-LD, metadataBase) doivent partir d'ici, sinon Google voit des canoniques
 * qui pointent vers une redirection.
 */
export const SITE_URL = "https://www.mugitu-biarritz.fr";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/** L'image de partage d'une page qui n'en a pas à elle. */
export const IMAGE_PARTAGE = { url: "/og-image.jpg", width: 1200, height: 630, alt: "Mugitu Biarritz" };

/**
 * Le bloc Open Graph complet d'une page.
 *
 * Next ne fusionne pas `openGraph` avec celui du layout. Une page qui n'en
 * déclare pas reprend celui de l'accueil, adresse, titre et description
 * compris : partagée, la FAQ s'annonçait comme l'accueil. Une page qui en
 * déclare un perd l'image, le nom du site et la langue. Toute page publique
 * passe donc par ici.
 */
export function partage(chemin: string, champs: OpenGraph): OpenGraph {
  return {
    type: "website",
    locale: "fr_FR",
    siteName: "Mugitu Biarritz",
    url: `${SITE_URL}${chemin}`,
    ...champs,
    images: champs.images ?? [IMAGE_PARTAGE],
  } as OpenGraph;
}

/**
 * Titre, description, canonique et Open Graph d'une page simple.
 *
 * Sans titre explicite, le titre vient de la table `lib/seo/pages.ts`. Il est
 * complet, marque comprise, et posé en `absolute` : le modèle du layout ne
 * s'y ajoute pas.
 */
export function metaPage(chemin: string, { title, description }: { title?: string; description: string }): Metadata {
  const titre = title ?? titreDe(chemin);
  if (!titre) throw new Error(`Pas de titre pour ${chemin} : l'ajouter à lib/seo/pages.ts`);
  return {
    title: { absolute: titre },
    description,
    alternates: { canonical: `${SITE_URL}${chemin}` },
    openGraph: partage(chemin, { title: titre, description }),
  };
}
