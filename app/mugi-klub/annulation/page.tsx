import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import KlubAnnulation from "@/components/site/klub/KlubAnnulation";
import { getAnnulation } from "@/lib/klub/donnees";
import { dateHeure } from "@/lib/klub/format";
import type { InfosAnnulation } from "@/lib/klub/types";
import { ROUTES } from "@/lib/routes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Annuler une inscription au Mugi Klub",
  robots: { index: false, follow: false },
};

function Message({ titre, texte }: { titre: string; texte: string }) {
  return (
    <>
      <h1 style={{ margin: "0 0 14px", fontSize: "var(--h2-s)", fontWeight: 700, color: "#003850", lineHeight: 1.2 }}>{titre}</h1>
      <p style={{ margin: "0 0 22px", fontSize: 16, lineHeight: 1.6, color: "rgba(51,51,52,.75)" }}>{texte}</p>
    </>
  );
}

export default async function AnnulationPage({ searchParams }: { searchParams: Promise<{ jeton?: string }> }) {
  const { jeton = "" } = await searchParams;

  let infos: InfosAnnulation | null = null;
  let panne = false;
  try {
    infos = await getAnnulation(jeton);
  } catch (e) {
    console.error("[klub] page d'annulation : base injoignable", e);
    panne = true;
  }

  let contenu: ReactNode;
  if (panne) {
    contenu = <Message titre="Service momentanément indisponible" texte="Réessayez dans quelques minutes, ou écrivez-nous." />;
  } else if (!infos) {
    contenu = <Message titre="Ce lien n’est plus valable" texte="Vérifiez que vous avez ouvert le lien du dernier mail reçu, ou écrivez-nous." />;
  } else if (infos.statut === "annulee") {
    contenu = <Message titre="Inscription déjà annulée" texte={`Votre inscription à « ${infos.seance.titre} » est déjà annulée. Vous n’avez rien d’autre à faire.`} />;
  } else if (infos.seance.statut === "annulee") {
    contenu = <Message titre="Séance annulée" texte="Cette séance a été annulée par l’équipe. Vous n’avez rien à faire." />;
  } else if (new Date(infos.seance.debut) <= new Date()) {
    contenu = <Message titre="Séance commencée" texte="La séance a déjà commencé ou est terminée : l’inscription ne peut plus être annulée." />;
  } else {
    contenu = (
      <KlubAnnulation
        jeton={jeton}
        prenom={infos.prenom}
        titre={infos.seance.titre}
        quand={dateHeure(infos.seance.debut)}
        attente={infos.statut === "attente"}
      />
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mg-main" style={{ background: "#FDF8F4" }}>
        <section
          style={{
            minHeight: "calc(100svh - 84px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(90px,14vh,150px) clamp(20px,5vw,64px) clamp(60px,9vw,110px)",
          }}
        >
          <div style={{ maxWidth: 560, width: "100%", background: "#fff", borderRadius: "var(--r-l)", padding: "clamp(30px,5vw,52px)", boxShadow: "0 6px 28px rgba(60,40,30,.07)" }}>
            <p style={{ margin: "0 0 18px", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 700, color: "#04A49B" }}>
              Mugi Klub
            </p>
            {contenu}
            <p style={{ margin: "26px 0 0" }}>
              <Link href={`${ROUTES.klub}#planning`} style={{ color: "#04A49B", fontWeight: 600, fontSize: 15 }}>
                Voir le planning
              </Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
