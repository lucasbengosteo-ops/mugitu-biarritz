import type { Metadata } from "next";
import ContentPageView from "@/components/site/ContentPageView";
import { getInstitutionnel } from "@/lib/institutionnel";
import { SITE_URL } from "@/lib/site";

const PAGE = getInstitutionnel("zone-intervention");

export const metadata: Metadata = {
  title: "Venir au cabinet",
  description:
    "Le cabinet Mugitu, 3 avenue Kléber à Biarritz : accès, stationnement, transports et zone d’intervention au Pays Basque.",
  alternates: { canonical: `${SITE_URL}/zone-intervention` },
};

export default function Page() {
  return <ContentPageView page={PAGE} />;
}
