"use client"; // Une limite d'erreur doit être un composant client.

import Link from "next/link";
import { useEffect } from "react";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { ROUTES } from "@/lib/routes";

/** Panne du planning ou d'une page de séance : message de marque, pas la stack Next. */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[klub] erreur de rendu", error);
  }, [error]);

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
          <div
            style={{
              maxWidth: 560,
              width: "100%",
              background: "#fff",
              borderRadius: "var(--r-l)",
              padding: "clamp(30px,5vw,52px)",
              boxShadow: "0 6px 28px rgba(60,40,30,.07)",
            }}
          >
            <p style={{ margin: "0 0 18px", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 700, color: "#04A49B" }}>
              Mugi Klub
            </p>
            <h1 style={{ margin: "0 0 14px", fontSize: "var(--h2-s)", fontWeight: 700, color: "#003850", lineHeight: 1.2 }}>
              Service momentanément indisponible
            </h1>
            <p style={{ margin: "0 0 22px", fontSize: 16, lineHeight: 1.6, color: "rgba(51,51,52,.75)" }}>
              Le planning n’a pas pu être chargé. Réessayez dans quelques minutes.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <button
                type="button"
                onClick={() => unstable_retry()}
                style={{
                  padding: "15px 28px",
                  borderRadius: "var(--r-pill)",
                  border: "none",
                  background: "#04A49B",
                  color: "#fff",
                  font: "inherit",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Réessayer
              </button>
              <Link
                href={ROUTES.home}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "15px 28px",
                  borderRadius: "var(--r-pill)",
                  border: "1px solid rgba(0,56,80,.2)",
                  color: "#003850",
                  fontSize: 16,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Retour à l’accueil
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
