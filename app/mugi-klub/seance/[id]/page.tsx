import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/site/PageHero";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import KlubFormulaire from "@/components/site/klub/KlubFormulaire";
import { getSeance } from "@/lib/klub/donnees";
import { dateHeure, dateLongue, etatPlaces, heure } from "@/lib/klub/format";
import { ADRESSE } from "@/lib/klub/mails";
import { LIBELLE_TYPE } from "@/lib/klub/types";
import { klubSeancePath, ROUTES } from "@/lib/routes";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

/** Le titre du hero est inséré en HTML : on échappe ce que saisit l'équipe. */
const echapper = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const majuscule = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const s = await getSeance(id);
  if (!s) return { title: "Séance introuvable", robots: { index: false } };
  return {
    title: `${s.titre}, ${dateHeure(s.debut)}`,
    description: `${LIBELLE_TYPE[s.type]} au Mugi Klub, ${dateHeure(s.debut)}${s.intervenant ? ` avec ${s.intervenant}` : ""}. Inscription en ligne, paiement sur place.`,
    alternates: { canonical: `https://mugitu-biarritz.fr${klubSeancePath(s.id)}` },
  };
}

export default async function SeancePage({ params }: Props) {
  const { id } = await params;
  const s = await getSeance(id);
  if (!s) notFound();

  const etat = etatPlaces(s, new Date());
  const details: [string, string][] = [
    ["Date", majuscule(dateLongue(s.debut))],
    ["Heure", `${heure(s.debut)}, ${s.duree_min} min`],
    ...(s.intervenant ? ([["Avec", s.intervenant]] as [string, string][]) : []),
    ["Lieu", ADRESSE],
    ["Tarif", s.prix_libelle ? `${s.prix_libelle}, sur place` : "Sur place"],
    ["Places", etat.texte],
  ];

  const carte: React.CSSProperties = {
    background: "#fff",
    borderRadius: "var(--r-l)",
    boxShadow: "0 6px 28px rgba(60,40,30,.07)",
    padding: "clamp(22px,4vw,34px)",
  };
  const texte: React.CSSProperties = { margin: "0 0 18px", fontSize: 15, lineHeight: 1.65, color: "rgba(51,51,52,.78)" };
  const lienPlanning = (
    <Link href={`${ROUTES.klub}#planning`} style={{ color: "#04A49B", fontWeight: 600 }}>
      Voir les prochaines séances
    </Link>
  );

  return (
    <>
      <SiteHeader />
      <main className="mg-main" style={{ background: "#FDF8F4" }}>
        <PageHero
          trail={[
            { label: "Accueil", href: ROUTES.home },
            { label: "Le Mugi Klub", href: ROUTES.klub },
          ]}
          crumb={s.titre}
          eyebrow={`${LIBELLE_TYPE[s.type]} · ${dateLongue(s.debut)}`}
          title={echapper(s.titre)}
          lead=""
          cta="#inscription"
          ctaLabel={etat.ton === "complet" ? "Rejoindre la liste d’attente" : "S’inscrire"}
          size="m"
        />

        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "var(--sect-base) clamp(20px,5vw,40px) var(--sect-ample)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 22,
            alignItems: "start",
          }}
        >
          <section style={carte}>
            <dl style={{ margin: "0 0 8px", display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 18px" }}>
              {details.map(([terme, valeur]) => (
                <div key={terme} style={{ display: "contents" }}>
                  <dt style={{ fontSize: 13, fontWeight: 700, color: "rgba(51,51,52,.5)" }}>{terme}</dt>
                  <dd style={{ margin: 0, fontSize: 15, color: "#003850", fontWeight: 600 }}>{valeur}</dd>
                </div>
              ))}
            </dl>
            {s.description && <p style={{ ...texte, marginTop: 20, whiteSpace: "pre-line" }}>{s.description}</p>}
          </section>

          <section id="inscription" style={carte}>
            {etat.ton === "annulee" && (
              <>
                <p style={texte}>Cette séance est annulée.</p>
                {lienPlanning}
              </>
            )}
            {etat.ton === "passee" && (
              <>
                <p style={texte}>
                  {etat.texte === "En cours"
                    ? "Cette séance a déjà commencé, les inscriptions sont fermées."
                    : "Cette séance a déjà eu lieu."}
                </p>
                {lienPlanning}
              </>
            )}
            {etat.ton === "libre" && (
              <>
                <p style={texte}>Entrée libre, sans inscription : venez directement au {ADRESSE}.</p>
                {lienPlanning}
              </>
            )}
            {(etat.ton === "ok" || etat.ton === "peu" || etat.ton === "complet") && (
              <KlubFormulaire seanceId={s.id} quand={dateHeure(s.debut)} complet={etat.ton === "complet"} prix={s.prix_libelle} />
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
