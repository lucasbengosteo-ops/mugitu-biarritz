import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import KlubPlanning from "@/components/site/klub/KlubPlanning";
import { KLUB } from "@/lib/klub";
import { getPlanning } from "@/lib/klub/donnees";
import { cleJour, semaines } from "@/lib/klub/format";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Le Mugi Klub, small groups et ateliers à Biarritz",
  description:
    "Le planning du Mugi Klub à Biarritz : small groups, ateliers et conférences avec la Mugi Team. Inscription en ligne, paiement sur place.",
  alternates: { canonical: "https://mugitu-biarritz.fr/mugi-klub" },
};

/* Valeur littérale obligatoire. Les routes d'inscription et d'annulation
   invalident la page à chaque écriture ; ce délai couvre le reste. */
export const revalidate = 60;

const TRAIL = [{ label: "Accueil", href: ROUTES.home }];

export default async function MugiKlubPage() {
  const maintenant = new Date();
  const liste = semaines(cleJour(maintenant), 4);
  // Lundi 0 h à Paris tombe le dimanche soir en UTC : marge de 2 h.
  const du = new Date(Date.parse(`${liste[0].debut}T00:00:00Z`) - 2 * 3600_000);
  const au = new Date(Date.parse(`${liste[liste.length - 1].fin}T23:59:59Z`));
  const seances = await getPlanning(du, au);

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
          cta="#planning"
          size={KLUB.size}
          ctaLabel="Voir le planning"
        />
        <KlubPlanning seances={seances} maintenant={maintenant.toISOString()} />
        <div dangerouslySetInnerHTML={{ __html: KLUB.bodyHtml }} />
      </main>
      <SiteFooter />
    </>
  );
}
