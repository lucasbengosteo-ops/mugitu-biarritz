import Link from "next/link";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import { ROUTES } from "@/lib/routes";

/**
 * Page de retour après un clic dans un mail : confirmation ou désinscription.
 * Un titre, une phrase, une porte de sortie — rien d'autre à faire ici.
 */
export default function NewsletterMessage({
  eyebrow,
  titre,
  texte,
  ton = "ok",
}: {
  eyebrow: string;
  titre: string;
  texte: string;
  ton?: "ok" | "neutre";
}) {
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
              boxShadow: "0 6px 30px rgba(60,40,30,.08)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: "0 0 14px",
                fontSize: 12,
                letterSpacing: "var(--ls-eyebrow)",
                textTransform: "uppercase",
                fontWeight: 600,
                color: ton === "ok" ? "#04A49B" : "rgba(51,51,52,.45)",
              }}
            >
              {eyebrow}
            </p>
            <h1
              className="mg-h1-m"
              style={{ margin: "0 0 16px", fontWeight: 700, letterSpacing: "-.025em", color: "#003850", textWrap: "balance" }}
            >
              {titre}
            </h1>
            <p style={{ margin: "0 auto 30px", maxWidth: 420, fontSize: 16, lineHeight: 1.65, color: "rgba(51,51,52,.72)", textWrap: "pretty" }}>
              {texte}
            </p>
            <Link
              href={ROUTES.actualites}
              className="mg-cta-teal"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 30px",
                borderRadius: "var(--r-pill)",
                background: "#04A49B",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Lire les actualités <span>↗</span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
