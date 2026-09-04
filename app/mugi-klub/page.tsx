import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PageHero from "@/components/site/PageHero";
import MugiKlubPlanning from "@/components/site/MugiKlubPlanning";
import KlubBientot from "@/components/site/KlubBientot";
import { KLUB } from "@/lib/klub";
import { getKlubEvents, renderColonnes } from "@/lib/klub-events";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Le Mugi Klub — small groups, ateliers et conférences",
  description:
    "Le Mugi Klub ouvre bientôt à Biarritz : small groups, ateliers, conférences et soirées autour du sport-santé, encadrés par la Mugi Team.",
  alternates: { canonical: "https://mugitu-biarritz.fr/mugi-klub" },
};

/* Même cadence que les articles : publier un créneau depuis /admin/mugi-klub
   ne doit pas demander un redéploiement. Valeur littérale obligatoire. */
export const revalidate = 300;

const TRAIL = [{ label: "Accueil", href: ROUTES.home }];

export default async function MugiKlubPage() {
  const events = await getKlubEvents();

  return (
    <>
      <SiteHeader />
      <main className="mg-main" style={{ background: "#FDF8F4" }}>
        {/* Le voile couvre AUSSI le hero : l'annonce doit être au milieu de
            l'écran dès l'arrivée sur la page, pas au-delà du premier écran.
            Le contenu reste rendu — c'est lui qu'on devine derrière — mais il
            est inerte tant que le Klub n'a pas ouvert. */}
        <KlubBientot>
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
          <MugiKlubPlanning html={KLUB.planningShell(renderColonnes(events)) + KLUB.bodyHtml} />
        </KlubBientot>
      </main>
      <SiteFooter />
    </>
  );
}
