"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { ROUTES } from "@/lib/routes";

/** Largeur en dessous de laquelle on bascule sur le menu burger. */
const MOBILE_BP = 900;

type Pane = "centre" | "soins" | null;

/** Carte illustrée du mega-menu (titre + sous-titre + visuel 16/10). */
function MegaCard({
  href,
  title,
  subtitle,
  src,
  alt,
  objectPosition,
  minSubtitleHeight,
}: {
  href: string;
  title: string;
  subtitle: string;
  src: string;
  alt: string;
  objectPosition?: string;
  minSubtitleHeight?: number;
}) {
  return (
    <Link href={href} className="mg-card-lift" style={{ textDecoration: "none" }}>
      <p style={{ margin: "0 0 3px", fontSize: 15, fontWeight: 600, color: "#fff" }}>{title}</p>
      <p
        style={{
          margin: "0 0 9px",
          fontSize: 13,
          lineHeight: 1.5,
          color: "rgba(255,255,255,.82)",
          fontWeight: 500,
          minHeight: minSubtitleHeight,
        }}
      >
        {subtitle}
      </p>
      <div
        style={{
          position: "relative",
          borderRadius: 14,
          overflow: "hidden",
          aspectRatio: "16 / 10",
          background: "#0b1c26",
        }}
      >
        <Image src={src} alt={alt} fill sizes="(max-width: 900px) 50vw, 240px" style={{ objectFit: "cover", objectPosition }} />
      </div>
    </Link>
  );
}

/** Lien « titre + flèche » souligné, utilisé dans les colonnes du mega-menu. */
function MegaLink({ href, children, size = "lg" }: { href: string; children: React.ReactNode; size?: "lg" | "md" }) {
  const big = size === "lg";
  return (
    <Link
      href={href}
      className="mg-link-arrow"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: big ? 10 : 9,
        alignSelf: "flex-start",
        fontSize: big ? "clamp(20px,1.7vw,26px)" : "clamp(16px,1.25vw,20px)",
        fontWeight: 700,
        color: "#fff",
        textDecoration: "none",
        borderBottom: `1px solid rgba(255,255,255,${big ? ".35" : ".26"})`,
        paddingBottom: big ? 6 : 5,
      }}
    >
      {children} <span style={{ fontSize: big ? ".8em" : ".75em" }}>↗</span>
    </Link>
  );
}

export default function SiteHeader({ solid: forceSolid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [pane, setPane] = useState<Pane>(null);
  const [mobOpen, setMobOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const closeTimer = useRef<number | null>(null);

  // Le header devient opaque dès qu'on scrolle, ou quand le mega-menu est ouvert.
  const solid = forceSolid || scrolled || (pane !== null && !isMobile);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    const onResize = () => {
      const mobile = window.innerWidth < MOBILE_BP;
      setIsMobile(mobile);
      // Le mega-menu n'existe pas en mobile : on le referme en passant le breakpoint.
      if (mobile) setPane(null);
    };
    onScroll();
    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Le menu mobile plein écran bloque le scroll de la page.
  useEffect(() => {
    document.body.style.overflow = mobOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobOpen]);

  const openPane = useCallback(
    (p: Exclude<Pane, null>) => {
      if (isMobile) return;
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      setPane(p);
    },
    [isMobile],
  );

  // Petite tempo à la fermeture : évite que le menu disparaisse en traversant
  // le vide entre le bouton et le panneau.
  const closePane = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setPane(null), 120);
  }, []);

  const navItemStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 500,
    color: solid ? "#003850" : "#fff",
    fontFamily: "inherit",
    textDecoration: "none",
    padding: "6px 0",
  };

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 90,
          transition: "background .35s ease, box-shadow .35s ease, backdrop-filter .35s",
          background: solid ? "rgba(255,255,255,.95)" : "transparent",
          boxShadow: solid ? "0 4px 24px rgba(60,40,30,.08)" : "none",
          backdropFilter: solid ? "blur(10px)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 clamp(18px,4vw,44px)",
            height: 92,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <Link href={ROUTES.home} style={{ display: "flex", alignItems: "center", flex: "0 0 auto" }}>
            <Image
              src="/logo-mini-navy.png"
              alt="Mugitu"
              width={101}
              height={30}
              priority
              style={{
                height: 30,
                width: "auto",
                display: "block",
                filter: solid ? "none" : "brightness(0) invert(1)",
                transition: "filter .35s",
              }}
            />
          </Link>

          {!isMobile && (
            <nav style={{ display: "flex", alignItems: "center", gap: "clamp(14px,2.2vw,34px)" }}>
              <button
                type="button"
                className="mg-navlink"
                onMouseEnter={() => openPane("centre")}
                onClick={() => setPane((p) => (p === "centre" ? null : "centre"))}
                style={navItemStyle}
              >
                Le centre <span style={{ fontSize: 17, lineHeight: 0, fontWeight: 400 }}>+</span>
              </button>
              <Link href={ROUTES.soins} className="mg-navlink" onMouseEnter={() => openPane("soins")} style={navItemStyle}>
                Nos soins <span style={{ fontSize: 17, lineHeight: 0, fontWeight: 400 }}>+</span>
              </Link>
              <Link href={ROUTES.contact} className="mg-navlink" onMouseEnter={closePane} style={navItemStyle}>
                Contact
              </Link>
            </nav>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 14, flex: "0 0 auto" }}>
            <Link
              href={ROUTES.espace}
              onMouseEnter={closePane}
              aria-label="Mon espace"
              title="Mon espace"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 42,
                height: 42,
                borderRadius: "50%",
                border: `1px solid ${solid ? "rgba(0,56,80,.15)" : "rgba(255,255,255,.3)"}`,
                color: solid ? "#003850" : "#fff",
                textDecoration: "none",
                transition: "border-color .2s, color .2s",
              }}
            >
              <User style={{ width: 19, height: 19 }} />
            </Link>

            {!isMobile && (
              <Link
                href={ROUTES.rdv}
                onMouseEnter={closePane}
                className="mg-cta-ghost"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "12px 24px",
                  borderRadius: 999,
                  background: solid ? "#04A49B" : "rgba(255,255,255,.14)",
                  border: `1px solid ${solid ? "#04A49B" : "rgba(255,255,255,.3)"}`,
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  backdropFilter: "blur(6px)",
                }}
              >
                Prendre rendez-vous <span style={{ fontSize: 13 }}>↗</span>
              </Link>
            )}

            {isMobile && (
              <button
                type="button"
                onClick={() => setMobOpen((v) => !v)}
                aria-label="Menu"
                aria-expanded={mobOpen}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                  width: 30,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 2px",
                  color: solid ? "#003850" : "#fff",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ height: 2, width: 26, background: "currentColor", borderRadius: 2, display: "block" }} />
                ))}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── MEGA MENU (desktop) ─────────────────────────────────── */}
      {!isMobile && (
        <div
          onMouseEnter={() => {
            if (closeTimer.current) window.clearTimeout(closeTimer.current);
          }}
          onMouseLeave={closePane}
          style={{
            position: "fixed",
            top: 92,
            left: 0,
            right: 0,
            zIndex: 80,
            padding: "0 clamp(14px,2vw,22px) 18px",
            opacity: pane ? 1 : 0,
            visibility: pane ? "visible" : "hidden",
            transform: pane ? "translateY(0)" : "translateY(-12px)",
            transition:
              "opacity .4s cubic-bezier(.16,1,.3,1), transform .45s cubic-bezier(.16,1,.3,1), visibility .4s",
          }}
        >
          {/* Pane « Le centre » */}
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              background: "#012A3A",
              borderRadius: 24,
              boxShadow: "0 30px 70px rgba(0,20,30,.45)",
              padding: "clamp(28px,3.4vw,48px)",
              display: pane === "centre" ? "grid" : "none",
              gridTemplateColumns: "minmax(220px,.85fr) 1.5fr",
              gap: "clamp(28px,4vw,60px)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <MegaLink href={ROUTES.rdv}>Prendre rdv</MegaLink>
              <MegaLink href={ROUTES.team}>La Mugi Team</MegaLink>
              <MegaLink href={ROUTES.espace}>Mon espace</MegaLink>
              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 3, paddingTop: 20 }}>
                <p style={{ margin: 0, fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.4)" }}>
                  Adresse
                </p>
                <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,.8)" }}>3 av. Kléber, 64200 Biarritz</p>
                <a
                  href="mailto:contact@mugitu-biarritz.fr"
                  style={{ fontSize: 14, color: "#04A49B", textDecoration: "none", marginTop: 6 }}
                >
                  contact@mugitu-biarritz.fr
                </a>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <MegaCard href={ROUTES.klub} title="Le Mugi Klub" subtitle="Small groups, conférences, ateliers, soirées & tarifs" src="/mugi-klub.jpg" alt="Le Mugi Klub" />
              <MegaCard href={ROUTES.esprit} title="L'esprit Mugitu" subtitle="Le projet, les salles de soin & le matériel" src="/esprit-mugitu-hero.jpg" alt="L'esprit Mugitu" objectPosition="center 45%" />
              <MegaCard href={ROUTES.ambassadeurs} title="Nos ambassadeurs" subtitle="Les sportifs partenaires qui parlent de nous" src="/athlete-surf.jpg" alt="Nos ambassadeurs" objectPosition="center 30%" />
              <MegaCard href={ROUTES.actualites} title="Les actualités" subtitle="Le blog de Mugitu" src="/vignette-actualites.png" alt="Les actualités" objectPosition="top center" />
            </div>
          </div>

          {/* Pane « Nos soins » */}
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              background: "#012A3A",
              borderRadius: 24,
              boxShadow: "0 30px 70px rgba(0,20,30,.45)",
              padding: "clamp(28px,3.4vw,48px)",
              display: pane === "soins" ? "grid" : "none",
              gridTemplateColumns: "minmax(230px,.78fr) 1.65fr",
              gap: "clamp(28px,4vw,56px)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ margin: "0 0 2px", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.4)" }}>
                Nos disciplines
              </p>
              <MegaLink href={ROUTES.medecineSport} size="md">Médecine du sport &amp; Rééducation</MegaLink>
              <MegaLink href={ROUTES.osteopathie} size="md">Ostéopathie</MegaLink>
              <MegaLink href={ROUTES.psychologie} size="md">Psychologie</MegaLink>
              <MegaLink href={ROUTES.prepaPhysique} size="md">Coaching / Préparation physique</MegaLink>
              <MegaLink href={ROUTES.nutrition} size="md">Nutrition du sport</MegaLink>
              <MegaLink href={ROUTES.podologie} size="md">Podologie</MegaLink>
              <MegaLink href={ROUTES.kine} size="md">Kinésithérapie du sport</MegaLink>

              <p style={{ margin: "18px 0 2px", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.4)" }}>
                Trouver autrement
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  { href: ROUTES.soinsPathologies, label: "Par pathologie" },
                  { href: ROUTES.soinsSports, label: "Par sport" },
                  { href: ROUTES.soinsBilans, label: "Bilans & tests" },
                ].map((p) => (
                  <Link
                    key={p.label}
                    href={p.href}
                    className="mg-pill"
                    style={{
                      padding: "8px 14px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,.08)",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    {p.label}
                  </Link>
                ))}
                <Link
                  href={ROUTES.soins}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    background: "rgba(4,164,155,.9)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Tous nos soins →
                </Link>
              </div>
            </div>

            <div>
              <p style={{ margin: "0 0 14px", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.4)" }}>
                Nos méthodes &amp; technologies
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 16 }}>
                <MegaCard href={ROUTES.allyane} title="Thérapie Allyane®" subtitle="by Galmeon" src="/allyane-session.png" alt="Thérapie Allyane" minSubtitleHeight={39} />
                <MegaCard href={ROUTES.cliniqueCoureur} title="La Clinique du Coureur®" subtitle="Suivi & analyse de foulée" src="/clinique-coureur-analyse.png" alt="La Clinique du Coureur" minSubtitleHeight={39} />
                <MegaCard href={ROUTES.testingVald} title="Testing du sportif" subtitle="by Vald®" src="/vald-forceframe-testing.webp" alt="Testing du sportif" minSubtitleHeight={39} />
                <MegaCard href={ROUTES.emdr} title="Thérapie EMDR" subtitle="Gestion du trauma & du stress" src="/emdr.webp" alt="Thérapie EMDR" minSubtitleHeight={39} />
                <MegaCard href={ROUTES.dryNeedling} title="Dry Needling & Cupping" subtitle="Techniques manuelles ciblées" src="/dry-needling.jpg" alt="Dry Needling et Cupping" minSubtitleHeight={39} />
                <MegaCard href={ROUTES.electrostimulation} title="Électrostimulation" subtitle="Compex® · renfort & récup" src="/electrostimulation.png" alt="Électrostimulation Compex" minSubtitleHeight={39} />
                <MegaCard href={ROUTES.bfr} title="BFR" subtitle="Blood Flow Restriction" src="/bfr.webp" alt="BFR Blood Flow Restriction" minSubtitleHeight={39} />
                <MegaCard href={ROUTES.prepaPhysique} title="Préparation physique" subtitle="Coaching & small groups" src="/prepa-physique-small-group.jpeg" alt="Préparation physique" objectPosition="center 40%" minSubtitleHeight={39} />
                <MegaCard href={ROUTES.infiltrations} title="Infiltrations" subtitle="PRP · viscosupplémentation · corticoïdes" src="/infiltrations.jpeg" alt="Infiltrations" minSubtitleHeight={39} />
                <MegaCard href={ROUTES.mesotherapie} title="Mésothérapie" subtitle="Micro-injections locales" src="/mesotherapie.jpeg" alt="Mésothérapie" objectPosition="center 35%" minSubtitleHeight={39} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MENU MOBILE ─────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 140,
          background: "#012A3A",
          display: "flex",
          flexDirection: "column",
          padding: "92px clamp(22px,7vw,40px) 40px",
          gap: 2,
          opacity: mobOpen ? 1 : 0,
          visibility: mobOpen ? "visible" : "hidden",
          transform: mobOpen ? "translateY(0)" : "translateY(-2%)",
          transition: "opacity .4s ease, transform .45s ease, visibility .4s",
          overflowY: "auto",
        }}
      >
        <button
          type="button"
          onClick={() => setMobOpen(false)}
          aria-label="Fermer"
          style={{ position: "absolute", top: 32, right: 24, width: 30, height: 30, background: "transparent", border: "none", cursor: "pointer" }}
        >
          <span style={{ position: "absolute", top: "50%", left: 0, width: 28, height: 2, background: "#fff", transform: "rotate(45deg)" }} />
          <span style={{ position: "absolute", top: "50%", left: 0, width: 28, height: 2, background: "#fff", transform: "rotate(-45deg)" }} />
        </button>

        {[
          { href: ROUTES.esprit, label: "Le centre" },
          { href: ROUTES.soins, label: "Nos soins" },
          { href: ROUTES.team, label: "La Mugi Team" },
          { href: ROUTES.klub, label: "Le Mugi Klub" },
          { href: ROUTES.espace, label: "Mon espace" },
          { href: ROUTES.contact, label: "Contact" },
        ].map((l) => (
          <Link
            key={l.label}
            href={l.href}
            onClick={() => setMobOpen(false)}
            style={{
              fontSize: "clamp(28px,7vw,34px)",
              fontWeight: 700,
              color: "#fff",
              textDecoration: "none",
              padding: "11px 0",
              borderBottom: "1px solid rgba(255,255,255,.1)",
            }}
          >
            {l.label}
          </Link>
        ))}

        <Link
          href={ROUTES.rdv}
          onClick={() => setMobOpen(false)}
          style={{
            marginTop: 26,
            display: "inline-flex",
            alignSelf: "flex-start",
            alignItems: "center",
            gap: 8,
            padding: "14px 28px",
            borderRadius: 999,
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
    </>
  );
}
