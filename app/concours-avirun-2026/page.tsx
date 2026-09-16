import type { Metadata } from "next";
import ConcoursPageContent from "./ConcoursPageContent";
import { getDict, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

const LOCALE: Locale = "fr";
const dict = getDict(LOCALE);

export const metadata: Metadata = {
  title: dict.concoursPage.metaTitle,
  description: dict.concoursPage.metaDescription,
  alternates: {
    canonical: `${SITE_URL}/concours-avirun-2026`,
    languages: {
      fr: `${SITE_URL}/concours-avirun-2026`,
      eu: `${SITE_URL}/eu/concours-avirun-2026`,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: `${SITE_URL}/concours-avirun-2026`,
    siteName: "Mugitu Biarritz",
    title: dict.concoursPage.ogTitle,
    description: dict.concoursPage.ogDescription,
    images: [
      {
        url: "/hero-avirun-2026.avif",
        width: 1920,
        height: 600,
        alt: "Concours Avirun 2K26 — Résultats",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export default function ConcoursAvirun2026Page() {
  return <ConcoursPageContent dict={dict} locale={LOCALE} />;
}
