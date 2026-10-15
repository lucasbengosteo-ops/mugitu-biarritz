import type { Metadata } from "next";
import ContentPageView from "@/components/site/ContentPageView";
import { getInstitutionnel } from "@/lib/institutionnel";
import { metaPage } from "@/lib/site";

const PAGE = getInstitutionnel("confidentialite");

export const metadata: Metadata = metaPage("/confidentialite", {
  description:
    "Comment Mugitu Biarritz collecte, utilise et protège vos données personnelles.",
});

export default function Page() {
  return <ContentPageView page={PAGE} />;
}
