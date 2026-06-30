import type { Metadata } from "next";
import ConcoursPageContent from "../../concours-avirun-2026/ConcoursPageContent";
import { getDict, type Locale } from "@/lib/i18n";

const LOCALE: Locale = "eu";
const dict = getDict(LOCALE);

export const metadata: Metadata = {
  title: dict.concoursPage.metaTitle,
  description: dict.concoursPage.metaDescription,
  alternates: {
    canonical: "https://mugitu-biarritz.fr/eu/concours-avirun-2026",
    languages: {
      fr: "https://mugitu-biarritz.fr/concours-avirun-2026",
      eu: "https://mugitu-biarritz.fr/eu/concours-avirun-2026",
    },
  },
  openGraph: {
    type: "website",
    locale: "eu_ES",
    url: "https://mugitu-biarritz.fr/eu/concours-avirun-2026",
    siteName: "Mugitu Biarritz",
    title: dict.concoursPage.ogTitle,
    description: dict.concoursPage.ogDescription,
    images: [
      {
        url: "/hero-avirun-2026.avif",
        width: 1920,
        height: 600,
        alt: "Avirun 2K26 lehiaketa — Emaitzak",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export default function ConcoursAvirun2026PageEu() {
  return <ConcoursPageContent dict={dict} locale={LOCALE} />;
}
