import type { MetadataRoute } from "next";
import { listArticles } from "@/lib/articles";
import { FICHES } from "@/lib/fiches";
import { METHODES } from "@/lib/methodes";
import { PATHOLOGIES } from "@/lib/pathologies";
import { SITE_URL } from "@/lib/site";
import { planDuSite } from "@/lib/site/plan";
import { SOINS } from "@/lib/soins";
import { SPORTS } from "@/lib/sports";

/* Valeur littérale obligatoire. Même délai que le blog : un article publié
   depuis le back-office entre au plan sans attendre un déploiement. Si
   Supabase ne répond pas, l'erreur remonte et le dernier plan valide reste
   servi — comme pour la liste des articles. */
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return planDuSite({
    site: SITE_URL,
    articles: await listArticles(),
    fiches: FICHES,
    soins: SOINS,
    pathologies: PATHOLOGIES,
    sports: SPORTS,
    methodes: METHODES,
  });
}
