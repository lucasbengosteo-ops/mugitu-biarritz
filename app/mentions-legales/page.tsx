import type { Metadata } from "next";
import ContentPageView from "@/components/site/ContentPageView";
import { getInstitutionnel } from "@/lib/institutionnel";
import { metaPage } from "@/lib/site";

const PAGE = getInstitutionnel("mentions-legales");

export const metadata: Metadata = metaPage("/mentions-legales", {
  description:
    "Mentions légales du site mugitu-biarritz.fr : éditeur, hébergeur, propriété intellectuelle et données personnelles.",
});

export default function Page() {
  return <ContentPageView page={PAGE} />;
}
