import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/site/PageHero";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import KlubCarte from "@/components/site/klub/KlubCarte";
import { FICHES, type Fiche } from "@/lib/fiches";
import { getPlanning } from "@/lib/klub/donnees";
import { cleJour, semaines } from "@/lib/klub/format";
import { libelleTarifs, preparateurs } from "@/lib/klub/individuel";
import { ROUTES, practitionerPath } from "@/lib/routes";
import { metaPage } from "@/lib/site";

export const metadata: Metadata = metaPage("/mugi-klub/preparation-individuelle", {
  title: "Préparation individuelle et bilans offerts — Mugi Klub",
  description:
    "Séances individuelles, seul ou à deux, et bilans de 30 minutes offerts avec les préparateurs physiques du Mugi Klub à Biarritz. Réservation et paiement en ligne.",
});

/* Même valeur littérale que /mugi-klub : les deux pages partagent la même
   fenêtre de planning et le même délai de cache. */
export const revalidate = 60;

const TRAIL = [
  { label: "Accueil", href: ROUTES.home },
  { label: "Le Mugi Klub", href: ROUTES.klub },
];

/** Nom sans accents ni casse, pour retrouver la fiche d'un intervenant. */
function normaliserNom(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function ficheDe(intervenant: string): Fiche | null {
  const cle = normaliserNom(intervenant);
  return FICHES.find((f) => normaliserNom(f.name) === cle) ?? null;
}

const carte: React.CSSProperties = {
  background: "#fff",
  borderRadius: "var(--r-l)",
  boxShadow: "0 6px 28px rgba(60,40,30,.07)",
  padding: "clamp(22px,4vw,34px)",
};

export default async function PreparationIndividuellePage() {
  const maintenant = new Date();
  const liste = semaines(cleJour(maintenant), 4);
  // Lundi 0 h à Paris tombe le dimanche soir en UTC : marge de 2 h.
  const du = new Date(Date.parse(`${liste[0].debut}T00:00:00Z`) - 2 * 3600_000);
  const au = new Date(Date.parse(`${liste[liste.length - 1].fin}T23:59:59Z`));
  const seances = await getPlanning(du, au);
  const groupes = preparateurs(seances);

  const medecin = FICHES.find((f) => f.slug === "basile-carcassonne") ?? null;

  return (
    <>
      <SiteHeader />
      <main className="mg-main" style={{ background: "#FDF8F4" }}>
        <PageHero
          trail={TRAIL}
          crumb="Préparation individuelle"
          eyebrow="Mugi Klub"
          title="Préparation individuelle et bilans offerts"
          lead="Des séances pour soi, seul ou à deux, avec Hugo, Baptiste et Jean-Baptiste. Un bilan de 30 minutes offert est conseillé avant la première séance."
          cta="#preparateurs"
          ctaLabel="Voir les préparateurs"
          size="m"
        />

        <section
          id="preparateurs"
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "var(--sect-base) clamp(20px,5vw,40px) 0",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(28px,4vw,40px)",
          }}
        >
          {groupes.length === 0 ? (
            <p style={{ margin: 0, fontSize: 15.5, color: "rgba(51,51,52,.65)" }}>
              Aucun créneau individuel n’est ouvert pour le moment.{" "}
              <Link href={ROUTES.contact} style={{ color: "#04A49B", fontWeight: 600 }}>
                Contactez-nous
              </Link>{" "}
              pour être prévenu·e.
            </p>
          ) : (
            groupes.map((groupe) => {
              const fiche = ficheDe(groupe.intervenant);
              const tarifs = groupe.tarifs ? libelleTarifs(groupe.tarifs) : "";
              return (
                <section key={groupe.intervenant} style={carte}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center", marginBottom: 20 }}>
                    {fiche && (
                      <div
                        style={{
                          position: "relative",
                          width: 72,
                          height: 72,
                          flex: "0 0 auto",
                          borderRadius: "50%",
                          overflow: "hidden",
                          background: "#012A3A",
                        }}
                      >
                        <Image
                          src={fiche.photo}
                          alt=""
                          fill
                          sizes="72px"
                          style={{ objectFit: "cover", objectPosition: fiche.objectPosition }}
                        />
                      </div>
                    )}
                    <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                      <h2 style={{ margin: "0 0 4px", fontSize: "var(--h3-l)", fontWeight: 700, color: "#003850" }}>
                        {fiche ? (
                          <Link href={practitionerPath(fiche.slug)} style={{ color: "inherit", textDecoration: "none" }}>
                            {fiche.name}
                          </Link>
                        ) : (
                          groupe.intervenant
                        )}
                      </h2>
                      {fiche && <p style={{ margin: "0 0 2px", fontSize: 14, color: "rgba(51,51,52,.65)" }}>{fiche.badge}</p>}
                      {fiche && (
                        <Link href={practitionerPath(fiche.slug)} style={{ fontSize: 13.5, fontWeight: 600, color: "#04A49B" }}>
                          Voir la fiche →
                        </Link>
                      )}
                    </div>
                  </div>

                  {tarifs && <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "#003850" }}>{tarifs}</p>}
                  <p style={{ margin: "0 0 20px", fontSize: 14, color: "rgba(51,51,52,.65)" }}>
                    Bilan de 30 minutes offert avant la première séance.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {groupe.seances.map((s) => (
                      <KlubCarte key={s.id} seance={s} maintenant={maintenant.toISOString()} />
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </section>

        {medecin && (
          <section style={{ maxWidth: 1080, margin: "0 auto", padding: "var(--sect-base) clamp(20px,5vw,40px) var(--sect-ample)" }}>
            <div
              style={{
                padding: "clamp(22px,4vw,34px)",
                borderRadius: "var(--r-l)",
                background: "#F5EDE4",
              }}
            >
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "rgba(51,51,52,.8)" }}>
                Pour un suivi plus complet, une consultation de médecine du sport avec le{" "}
                <Link href={practitionerPath(medecin.slug)} style={{ color: "#04A49B", fontWeight: 600 }}>
                  Dr Basile Carcassonne
                </Link>{" "}
                est possible en complément. Elle est réservée et facturée par le médecin, indépendamment de la préparation.
              </p>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
