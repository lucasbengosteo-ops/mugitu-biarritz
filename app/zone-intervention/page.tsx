import type { Metadata } from "next";
import ContentPageView from "@/components/site/ContentPageView";
import { getInstitutionnel } from "@/lib/institutionnel";
import { metaPage } from "@/lib/site";

const PAGE = getInstitutionnel("zone-intervention");

export const metadata: Metadata = metaPage("/zone-intervention", {
  description:
    "Le cabinet Mugitu, 3 avenue Kléber à Biarritz : accès, stationnement, transports et zone d’intervention au Pays Basque.",
});

export default function Page() {
  return <ContentPageView page={PAGE} />;
}
