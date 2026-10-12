import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Seuls l'API et le back-office sont fermés aux robots. Les autres pages à
 * tenir hors de Google (jeux du stand, newsletter, espace patient,
 * mugicoloc.html…) portent déjà un noindex : un Disallow empêcherait le
 * robot de le lire, et une adresse trouvée ailleurs pourrait alors être
 * indexée sans son contenu.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
