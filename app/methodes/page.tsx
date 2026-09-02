import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import BackLink from "@/components/site/BackLink";
import { METHODE_CARDS } from "@/lib/methodes";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Nos méthodes & technologies",
  description:
    "Allyane®, La Clinique du Coureur®, testing Vald®, EMDR, dry needling, électrostimulation, BFR, préparation physique, infiltrations et mésothérapie : les méthodes et technologies du cabinet Mugitu à Biarritz.",
  alternates: { canonical: "https://mugitu-biarritz.fr/methodes" },
};

export default function MethodesPage() {
  return (
    <>
      <SiteHeader solid />

      <main style={{ position: "relative", overflowX: "hidden", background: "#FDF8F4" }}>
        <section style={{ padding: "clamp(140px,17vh,190px) clamp(20px,5vw,64px) clamp(40px,5vw,56px)", maxWidth: 1280, margin: "0 auto" }}>
          <BackLink />
          <p style={{ margin: "0 0 18px", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 600, color: "#04A49B" }}>
            L&apos;innovation au service du soin
          </p>
          <h1 className="mg-h1-xl"
            style={{
              margin: "0 0 clamp(20px,3vw,28px)",
              fontWeight: 700,
              letterSpacing: "-.04em",
              color: "#003850",
            }}
          >
            Méthodes &amp; technologies
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "clamp(17px,1.6vw,21px)",
              fontWeight: 300,
              lineHeight: 1.55,
              color: "rgba(51,51,52,.72)",
              maxWidth: 660,
              textWrap: "pretty",
            }}
          >
            Chaque outil sert à objectiver et accompagner votre progression — du diagnostic à la performance. Voici ce
            que nous pratiquons au cabinet, et pourquoi.
          </p>
        </section>

        <section style={{ padding: "0 clamp(20px,5vw,64px) clamp(60px,8vw,100px)", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))", gap: "clamp(18px,2.4vw,28px)" }}>
            {METHODE_CARDS.map((c) => (
              <Link
                key={c.slug}
                href={`${ROUTES.methodes}/${c.slug}`}
                className="mg-card-lift"
                style={{
                  textDecoration: "none",
                  background: "#fff",
                  borderRadius: "var(--r-l)",
                  overflow: "hidden",
                  boxShadow: "0 6px 28px rgba(60,40,30,.08)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 10", background: "#012A3A" }}>
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 300px"
                    style={{ objectFit: "cover", objectPosition: c.objectPosition }}
                  />
                </div>
                <div style={{ padding: 22, display: "flex", flexDirection: "column", flex: 1 }}>
                  <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: "#003850", letterSpacing: "-.01em" }}>{c.title}</h2>
                  <p style={{ margin: "0 0 14px", fontSize: 14, lineHeight: 1.55, color: "rgba(51,51,52,.65)", flex: 1 }}>{c.subtitle}</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: "#04A49B" }}>
                    En savoir plus <span>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ background: "#003850", padding: "clamp(56px,8vw,90px) clamp(20px,5vw,48px)", textAlign: "center" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h2 style={{ margin: "0 0 14px", fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, letterSpacing: "-.02em", color: "#fff" }}>
              Une question sur la méthode adaptée&nbsp;?
            </h2>
            <p style={{ margin: "0 0 30px", fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,.7)" }}>
              L&apos;équipe vous oriente vers l&apos;approche la plus pertinente pour votre situation.
            </p>
            <Link
              href={ROUTES.team}
              className="mg-cta-teal"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "15px 32px",
                borderRadius: "var(--r-pill)",
                background: "#04A49B",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Prendre rendez-vous <span>↗</span>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
