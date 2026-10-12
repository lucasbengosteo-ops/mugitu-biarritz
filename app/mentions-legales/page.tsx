import type { Metadata } from "next";
import ContentPageView from "@/components/site/ContentPageView";
import { getInstitutionnel } from "@/lib/institutionnel";
import { SITE_URL } from "@/lib/site";

const PAGE = getInstitutionnel("mentions-legales");

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site mugitu-biarritz.fr : éditeur, hébergeur, propriété intellectuelle et données personnelles.",
  alternates: { canonical: `${SITE_URL}/mentions-legales` },
};

export default function Page() {
  return <ContentPageView page={PAGE} />;
}
