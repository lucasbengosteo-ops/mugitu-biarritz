import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { getAnnulation } from "@/lib/klub/donnees";
import { klubSeancePath, ROUTES } from "@/lib/routes";

/**
 * Page de retour de Stripe (succès ou abandon) et du lien expiré de la liste
 * d'attente. Elle ne confirme jamais rien : seule la notification de Stripe
 * confirme une inscription (`/api/stripe/webhook`). Le jeton dans l'URL sert
 * uniquement à retrouver la séance, pour proposer d'y revenir.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Paiement — Mugi Klub",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const TITRES: Record<string, string> = {
  recu: "Paiement reçu",
  abandon: "Paiement non effectué",
  expire: "Lien expiré",
};

const TEXTES: Record<string, string> = {
  recu: "Votre place est réservée. La confirmation arrive par e-mail, et le reçu de Stripe dans un mail séparé.",
  abandon: "Votre place reste réservée quelques minutes. Vous pouvez reprendre le paiement depuis la page de la séance.",
  expire: "Ce lien n’est plus valable : la place a été proposée à quelqu’un d’autre.",
};

export default async function PaiementPage({
  searchParams,
}: {
  searchParams: Promise<{ etat?: string; jeton?: string }>;
}) {
  const { etat = "", jeton = "" } = await searchParams;
  const titre = TITRES[etat] ?? "Paiement";
  const texte = TEXTES[etat] ?? "Statut du paiement introuvable.";

  let lienSeance: { href: string; titre: string } | null = null;
  try {
    const infos = jeton ? await getAnnulation(jeton) : null;
    if (infos) lienSeance = { href: klubSeancePath(infos.seance.id), titre: infos.seance.titre };
  } catch {
    // Lien générique plus bas : la page reste utilisable sans cette lecture.
  }

  return (
    <>
      {/* Fond clair sans bandeau sombre : l’en-tête transparent y serait blanc sur blanc. */}
      <SiteHeader solid />
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
            <h1 style={{ margin: "0 0 14px", fontSize: "var(--h2-s)", fontWeight: 700, color: "#003850", lineHeight: 1.2 }}>{titre}</h1>
            <p style={{ margin: "0 0 22px", fontSize: 16, lineHeight: 1.6, color: "rgba(51,51,52,.75)" }}>{texte}</p>
            <p style={{ margin: 0, display: "flex", gap: 18, flexWrap: "wrap" }}>
              {lienSeance && (
                <Link href={lienSeance.href} style={{ color: "#04A49B", fontWeight: 600, fontSize: 15 }}>
                  Revenir à « {lienSeance.titre} »
                </Link>
              )}
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
