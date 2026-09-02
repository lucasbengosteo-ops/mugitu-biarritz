import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PageHero from "@/components/site/PageHero";
import MugiKlubPlanning from "@/components/site/MugiKlubPlanning";
import { KLUB } from "@/lib/klub";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Le Mugi Klub — small groups, ateliers et conférences",
  description:
    "Le planning hebdomadaire du Mugi Klub à Biarritz : small groups, ateliers, conférences et soirées autour du sport-santé, encadrés par la Mugi Team.",
  alternates: { canonical: "https://mugitu-biarritz.fr/mugi-klub" },
};

const TRAIL = [{ label: "Accueil", href: ROUTES.home }];

export default function MugiKlubPage() {
  return (
    <>
      <SiteHeader />
      <main className="mg-main" style={{ background: "#FDF8F4" }}>
        <PageHero
          trail={TRAIL}
          crumb="Le Mugi Klub"
          eyebrow={KLUB.eyebrow}
          title={KLUB.title}
          lead={KLUB.lead}
          cta={ROUTES.contact}
          size={KLUB.size}
          ctaLabel="Nous écrire"
        />
        <MugiKlubPlanning html={KLUB.bodyHtml} />
      </main>
      <SiteFooter />
    </>
  );
}
