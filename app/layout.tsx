import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mugitu-biarritz.fr"),
  title: {
    default: "Mugitu Biarritz — Kinésithérapie, Médecine & Ostéopathie du sport",
    template: "%s | Mugitu Biarritz",
  },
  description:
    "Centre pluridisciplinaire de kinésithérapie du sport, médecine du sport et ostéopathie à Biarritz. Prise en charge coordonnée, méthode Allyane® et programme Andrew. 3 avenue Kléber, 64200 Biarritz.",
  keywords: [
    "kinésithérapie sport Biarritz",
    "médecine du sport Biarritz",
    "ostéopathie sport Biarritz",
    "Allyane Biarritz",
    "kiné Biarritz",
    "cabinet pluridisciplinaire Biarritz",
    "Mugitu",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://mugitu-biarritz.fr",
    siteName: "Mugitu Biarritz",
    title: "Mugitu Biarritz — La maison du mouvement",
    description:
      "Centre pluridisciplinaire de kinésithérapie du sport, médecine du sport et ostéopathie à Biarritz.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Mugitu Biarritz" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://mugitu-biarritz.fr" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Mugitu — La maison du mouvement",
  description:
    "Cabinet pluridisciplinaire de kinésithérapie du sport, médecine du sport et ostéopathie du sport à Biarritz.",
  url: "https://mugitu-biarritz.fr",
  telephone: "+33559000000",
  email: "contact@mugitu-biarritz.fr",
  address: {
    "@type": "PostalAddress",
    streetAddress: "3 avenue Kléber",
    addressLocality: "Biarritz",
    postalCode: "64200",
    addressRegion: "Nouvelle-Aquitaine",
    addressCountry: "FR",
  },
  geo: { "@type": "GeoCoordinates", latitude: 43.4832, longitude: -1.5586 },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "19:00" },
  ],
  areaServed: [
    { "@type": "City", name: "Biarritz" },
    { "@type": "City", name: "Bayonne" },
    { "@type": "City", name: "Anglet" },
    { "@type": "AdministrativeArea", name: "Pays Basque" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
