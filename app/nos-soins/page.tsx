import type { Metadata } from "next";
import ContentPageView from "@/components/site/ContentPageView";
import { NOS_SOINS } from "@/lib/soins";

export const metadata: Metadata = {
  title: "Nos soins — disciplines, pathologies, sports & bilans",
  description:
    "Sept métiers sous le même toit à Biarritz. Trouvez votre porte d'entrée : par discipline, par pathologie, par sport pratiqué, ou par bilan à réaliser.",
  alternates: { canonical: "https://mugitu-biarritz.fr/nos-soins" },
};

export default function NosSoinsPage() {
  return <ContentPageView page={NOS_SOINS} />;
}
