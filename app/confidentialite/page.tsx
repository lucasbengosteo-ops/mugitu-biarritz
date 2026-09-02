import type { Metadata } from "next";
import ContentPageView from "@/components/site/ContentPageView";
import { getInstitutionnel } from "@/lib/institutionnel";

const PAGE = getInstitutionnel("confidentialite");

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Mugitu Biarritz collecte, utilise et protège vos données personnelles.",
  alternates: { canonical: "https://mugitu-biarritz.fr/confidentialite" },
};

export default function Page() {
  return <ContentPageView page={PAGE} />;
}
