import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ConcoursBanner from "@/components/ConcoursBanner";
import Hero from "@/components/Hero";
import Histoire from "@/components/Histoire";
import Services from "@/components/Services";
import Team from "@/components/Team";
import Allyane from "@/components/Allyane";
import LaCliniqueDuCoureur from "@/components/LaCliniqueDuCoureur";
import AppMugitu from "@/components/AppMugitu";
import Andrew from "@/components/Andrew";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getDict, type Locale } from "@/lib/i18n";

const LOCALE: Locale = "eu";

export const metadata: Metadata = {
  title: "Mugitu Biarritz — Kirol kinesiterapia, medikuntza eta osteopatia",
  description:
    "Kirol kinesiterapia, kirol medikuntza eta osteopatia gunea Biarritzen. Zaintza koordinatua, Allyane® metodoa eta Andrew programa. 3 Kléber etorbidea, 64200 Biarritz.",
  alternates: {
    canonical: "https://mugitu-biarritz.fr/eu",
    languages: {
      fr: "https://mugitu-biarritz.fr",
      eu: "https://mugitu-biarritz.fr/eu",
    },
  },
  openGraph: {
    type: "website",
    locale: "eu_ES",
    url: "https://mugitu-biarritz.fr/eu",
    siteName: "Mugitu Biarritz",
    title: "Mugitu Biarritz — Mugimenduaren etxea",
    description:
      "Kirol kinesiterapia, kirol medikuntza eta osteopatia gunea Biarritzen.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Mugitu Biarritz" }],
  },
};

export default function HomeEu() {
  const dict = getDict(LOCALE);
  return (
    <>
      <Nav dict={dict} locale={LOCALE} />
      <main>
        <Hero dict={dict} locale={LOCALE} />
        <ConcoursBanner dict={dict} locale={LOCALE} />
        <Histoire dict={dict} />
        <Services dict={dict} />
        <Team dict={dict} />
        <Allyane dict={dict} />
        <LaCliniqueDuCoureur dict={dict} />
        <AppMugitu dict={dict} />
        <Andrew dict={dict} />
        <Contact dict={dict} />
      </main>
      <Footer dict={dict} locale={LOCALE} />
    </>
  );
}
