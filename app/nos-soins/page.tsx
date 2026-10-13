import type { Metadata } from "next";
import ContentPageView from "@/components/site/ContentPageView";
import { NOS_SOINS } from "@/lib/soins";
import { metaPage } from "@/lib/site";

export const metadata: Metadata = metaPage("/nos-soins", {
  title: "Nos soins — disciplines, pathologies, sports & bilans",
  description:
    "Sept métiers sous le même toit à Biarritz. Trouvez votre porte d’entrée : par discipline, par pathologie, par sport pratiqué, ou par bilan à réaliser.",
});

export default function NosSoinsPage() {
  return <ContentPageView page={NOS_SOINS} />;
}
