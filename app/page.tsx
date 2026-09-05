import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Handshake, Mail, MapPin, Mountain, Star, Target } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import LandingEffects from "@/components/site/LandingEffects";
import { EXTERNAL, ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Mugitu Biarritz — Centre médical et paramédical du sportif",
  description:
    "Centre médical et paramédical spécialisé dans la prise en charge du sportif à Biarritz Kléber. Médecine du sport, kinésithérapie, ostéopathie, psychologie, nutrition et préparation physique.",
  alternates: { canonical: "https://mugitu-biarritz.fr" },
};

/* ── Avis Google affichés dans le marquee (dupliqués pour la boucle) ── */
const AVIS = [
  {
    initials: "CC",
    color: "#04A49B",
    first: "Charlotte",
    last: "Chauvet",
    text: "Un très beau lieu, ultra chaleureux dans une ambiance bienveillante et apaisante ! Le suivi est personnalisé du début à la fin, on se sent vraiment accompagné. Moi qui reprends le sport après une blessure, je recommande les yeux fermés.",
  },
  {
    initials: "AG",
    color: "#003850",
    first: "Aline-Marie",
    last: "Glimois",
    text: "J’ai consulté pour une analyse de foulée avant mon premier trail. Bilan complet, conseils précis et un vrai plan de progression. Rien à voir avec ce que j’avais connu ailleurs — je reviendrai sans hésiter.",
  },
  {
    initials: "MC",
    color: "#EE806C",
    first: "Marjorie",
    last: "Cariou",
    text: "J’ai commencé le suivi en novembre et j’adore ! L’équipe est top, à l’écoute et toujours de bonne humeur. Je remercie toute la maison pour la réactivité et la gentillesse. Enchantée de faire partie de la communauté Mugitu.",
  },
  {
    initials: "TL",
    color: "#0A556B",
    first: "Thomas",
    last: "Larrieu",
    text: "Pris en charge après une entorse au rugby. Entre le médecin, le kiné et l’ostéo tout est coordonné, je n’ai jamais eu à répéter mon histoire. Retour au terrain en avance sur le planning. Bravo.",
  },
  {
    initials: "IB",
    color: "#d49a40",
    first: "Inès",
    last: "Bonnet",
    text: "La thérapie Allyane a débloqué mon genou en deux séances là où je traînais depuis des mois. Approche sérieuse, explications claires, locaux impeccables. Une vraie pépite à Biarritz.",
  },
  {
    initials: "JE",
    color: "#04A49B",
    first: "Julien",
    last: "Etcheberry",
    text: "Préparation physique au top avant ma saison de surf. Programme sur-mesure, suivi via l’appli, et des praticiens qui connaissent vraiment le sport. Je recommande à tous les sportifs du coin.",
  },
] as const;

/* ── Les trois piliers de la section « Votre expérience » ─────────── */
type Experience = {
  href: string;
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  src: string;
  objectPosition?: string;
};

const EXPERIENCES: Experience[] = [
  {
    href: ROUTES.team,
    eyebrow: "L’équipe",
    title: "La Mugi Team",
    text: "Médecins, kinés et ostéopathes du sport réunis autour de votre mouvement.",
    cta: "Découvrir l’équipe",
    src: "/lucas-bengoechea.jpg",
    objectPosition: "center 30%",
  },
  {
    href: ROUTES.klub,
    eyebrow: "La communauté",
    title: "Le Mugi Klub",
    text: "Small groups, ateliers, conférences et soirées autour du sport-santé.",
    cta: "Voir le planning",
    src: "/mugi-klub.jpg",
  },
  {
    href: ROUTES.soins,
    eyebrow: "L’innovation",
    title: "Nos méthodes & technologies",
    text: "Allyane®, Clinique du Coureur®, testing Vald®, EMDR, dry needling…",
    cta: "Explorer les méthodes",
    src: "/allyane-session.png",
    objectPosition: "center 40%",
  },
];

const H2: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(30px,5vw,46px)",
  fontWeight: 700,
  letterSpacing: "-.025em",
  color: "#003850",
};

const EYEBROW: React.CSSProperties = {
  margin: "0 0 12px",
  fontSize: 12,
  letterSpacing: "var(--ls-eyebrow)",
  textTransform: "uppercase",
  fontWeight: 600,
  color: "#04A49B",
};

/** Carte « pourquoi Mugitu » de la section Histoire. */
function HistoireCard({
  icon,
  title,
  children,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay: string;
}) {
  return (
    <div
      data-reveal
      style={{
        borderRadius: "var(--r-m)",
        background: "rgba(255,255,255,.05)",
        border: "1px solid rgba(255,255,255,.1)",
        padding: 28,
        transitionDelay: delay,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "var(--r-s)",
          background: "rgba(4,164,155,.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
        }}
      >
        {icon}
      </div>
      <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 600, color: "#fff" }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,.55)" }}>{children}</p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <LandingEffects />
      <SiteHeader />

      <main className="mg-main">
        {/* ░░ HERO ░░ */}
        <section
          id="top"
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            padding: "120px 20px 60px",
            background: "linear-gradient(160deg,#012A3A 0%,#003850 45%,#0A556B 100%)",
          }}
        >
          {/* Pas de `poster` : c'était le logo, étiré en `object-fit: cover`,
              ce qui produisait une bande floue quand la lecture ne démarrait
              pas — cas fréquent sur mobile (mode économie d'énergie d'iOS,
              économiseur de données Android). Le dégradé navy du conteneur
              fait un fond propre en attendant, ou à la place. */}
          {/* `data-src` et non `src` : la source est posée par
              LandingEffects, uniquement sur grand écran. Sans source, rien
              n'est téléchargé — les 5,6 Mo ne sont pas infligés au mobile.
              L'opacité part de 0 et passe à .55 quand la lecture démarre
              vraiment, pour que l'attente ne se voie pas. */}
          <video
            data-hero
            data-src="/hero-sport.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0,
              transition: "opacity .9s ease",
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(0,28,40,.62),rgba(0,40,56,.55) 45%,rgba(0,28,40,.78))" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.05,
              backgroundImage: "radial-gradient(circle at 1px 1px,#fff 1px,transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "-10%",
              left: "-8%",
              width: "46%",
              height: "46%",
              background: "radial-gradient(circle,rgba(4,164,155,.22),transparent 70%)",
              filter: "blur(20px)",
              animation: "mg-drift1 18s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-12%",
              right: "-8%",
              width: "46%",
              height: "46%",
              background: "radial-gradient(circle,rgba(243,190,121,.16),transparent 70%)",
              filter: "blur(20px)",
              animation: "mg-drift2 22s ease-in-out infinite",
            }}
          />

          <div
            data-reveal
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              maxWidth: 820,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 16px",
                borderRadius: "var(--r-pill)",
                background: "rgba(255,255,255,.1)",
                border: "1px solid rgba(255,255,255,.18)",
                backdropFilter: "blur(6px)",
                color: "rgba(255,255,255,.85)",
                fontSize: 11,
                letterSpacing: "var(--ls-label)",
                textTransform: "uppercase",
                marginBottom: 30,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#04A49B", display: "block" }} />
              Biarritz · Pays Basque
            </span>

            {/* Le titre de la page EST la marque : c'est le logo qui porte le
                <h1>, via son alt. Le chapô en dessous n'est qu'un chapô — le
                mettre en <h1> donnait à la page d'accueil un titre de 21px et
                privait le lecteur d'écran du nom du cabinet. */}
            <h1 style={{ margin: 0 }}>
              <Image
                src="/logo-full-white.png"
                alt="Mugitu — La maison du mouvement"
                width={440}
                height={165}
                priority
                style={{ width: "min(440px,76vw)", height: "auto", marginBottom: 26 }}
              />
            </h1>

            <p
              style={{
                margin: "0 0 38px",
                fontSize: "clamp(17px,2.1vw,21px)",
                fontWeight: 300,
                lineHeight: 1.6,
                color: "rgba(255,255,255,.86)",
                maxWidth: 620,
              }}
            >
              Centre médical et paramédical spécialisé dans la prise en charge du sportif à Biarritz Kléber.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
              <a
                href="#contact"
                className="mg-cta-teal"
                style={{
                  padding: "15px 32px",
                  borderRadius: "var(--r-pill)",
                  background: "#04A49B",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Prendre rendez-vous
              </a>
              <Link
                href={ROUTES.team}
                className="mg-cta-ghost"
                style={{
                  padding: "15px 32px",
                  borderRadius: "var(--r-pill)",
                  border: "1px solid rgba(255,255,255,.4)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Découvrir l&apos;équipe
              </Link>
            </div>
          </div>

          {/* Compteurs animés */}
          <div data-reveal style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 720, marginTop: 54, transitionDelay: ".15s" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 1,
                background: "rgba(255,255,255,.12)",
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: "var(--r-l)",
                overflow: "hidden",
                backdropFilter: "blur(4px)",
              }}
            >
              {[
                { count: 12, suffix: "", label: "Spécialistes" },
                { count: 7, suffix: "", label: "Disciplines" },
                { count: 360, suffix: "°", label: "Suivi sportif" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "22px 8px", background: "rgba(255,255,255,.05)" }}>
                  <span
                    className="mg-count"
                    data-count={s.count}
                    data-suffix={s.suffix}
                    style={{
                      fontSize: "clamp(28px,4vw,40px)",
                      fontWeight: 800,
                      color: "#fff",
                      fontVariantNumeric: "tabular-nums",
                      letterSpacing: "-.02em",
                    }}
                  >
                    0{s.suffix}
                  </span>
                  <span style={{ fontSize: 11, letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginTop: 4 }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 2 }}>
            <span style={{ fontSize: 10, letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(255,255,255,.45)" }}>Scroll</span>
            <span style={{ width: 1, height: 34, background: "linear-gradient(to bottom,rgba(255,255,255,.5),transparent)", animation: "mg-pulseline 2s ease-in-out infinite" }} />
          </div>
        </section>

        {/* ░░ HISTOIRE ░░ */}
        <section id="histoire" style={{ background: "#003850", padding: "clamp(70px,10vw,120px) 20px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-15%", right: "-10%", width: "50%", height: "60%", background: "radial-gradient(circle,rgba(4,164,155,.1),transparent 70%)" }} />
          <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
            <div data-reveal style={{ textAlign: "center", marginBottom: 54 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: "var(--r-pill)",
                  background: "rgba(4,164,155,.18)",
                  color: "#04A49B",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "var(--ls-label)",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                Étymologie &amp; Histoire
              </span>
              <h2 style={{ ...H2, color: "#fff" }}>Pourquoi Mugitu ?</h2>
            </div>

            <div
              data-reveal
              style={{
                borderRadius: "var(--r-l)",
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.1)",
                padding: "clamp(28px,5vw,52px)",
                marginBottom: 38,
                transitionDelay: ".1s",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: 38, alignItems: "flex-start" }}>
                <div style={{ flex: "0 0 auto" }}>
                  <p style={{ margin: 0, fontSize: "clamp(54px,9vw,86px)", fontWeight: 700, color: "#04A49B", letterSpacing: "-.03em", lineHeight: 0.9 }}>
                    mugitu
                  </p>
                  <p style={{ margin: "8px 0 0", fontSize: 13, fontStyle: "italic", color: "rgba(255,255,255,.4)" }}>Basque · verbe</p>
                </div>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <p style={{ margin: "0 0 12px", fontSize: 11, letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "rgba(255,255,255,.5)" }}>
                    Définition
                  </p>
                  <p style={{ margin: "0 0 16px", fontSize: "clamp(18px,2.4vw,24px)", fontWeight: 300, lineHeight: 1.45, color: "#fff" }}>
                    «&nbsp;Se mouvoir, bouger, être en mouvement&nbsp;»
                  </p>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,.6)" }}>
                    Du basque <em>mugitu</em> — mouvement, déplacement, action de bouger. Une racine ancrée dans la culture du Pays
                    Basque, terre de sport, d&apos;effort et de dépassement de soi.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
              <HistoireCard icon={<Mountain style={{ color: "#04A49B", width: 22, height: 22 }} />} title="Ancrage local" delay=".1s">
                Né à Biarritz, au cœur du Pays Basque, terre de surf, de rugby, de trail et de pelote.
              </HistoireCard>
              <HistoireCard icon={<Handshake style={{ color: "#04A49B", width: 22, height: 22 }} />} title="Vision pluridisciplinaire" delay=".2s">
                Le sportif blessé mérite une prise en charge coordonnée entre kiné, médecin et ostéo, sous le même toit, avec le même
                dossier.
              </HistoireCard>
              <HistoireCard icon={<Target style={{ color: "#04A49B", width: 22, height: 22 }} />} title="La maison du mouvement" delay=".3s">
                Cinq salles, un plateau technique, et des praticiens qui partagent la même philosophie : que le mouvement soit toujours
                possible, durable et performant.
              </HistoireCard>
            </div>

            <div data-reveal style={{ display: "flex", justifyContent: "center", marginTop: 44, transitionDelay: ".15s" }}>
              <Link
                href={ROUTES.esprit}
                className="mg-cta-teal"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "15px 32px",
                  borderRadius: "var(--r-pill)",
                  background: "#04A49B",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Découvrir l&apos;esprit Mugitu <span style={{ fontSize: ".9em" }}>↗</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ░░ VOTRE EXPÉRIENCE ░░ */}
        <section id="experience" style={{ background: "#FDF8F4", padding: "clamp(70px,10vw,120px) 20px" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div data-reveal style={{ maxWidth: 680, marginBottom: 52 }}>
              <p style={{ ...EYEBROW, margin: "0 0 14px" }}>Votre expérience</p>
              <h2 style={{ ...H2, marginBottom: 20 }}>Une prise en charge globale, sous un même toit</h2>
              <p style={{ margin: 0, fontSize: "clamp(16px,1.6vw,18px)", lineHeight: 1.65, color: "rgba(51,51,52,.7)" }}>
                Du diagnostic médical à la rééducation, du retour au sport à la performance — nos praticiens coordonnent chaque étape de
                votre suivi. Et au-delà des soins, Mugitu c&apos;est aussi un club, des ateliers, des conférences et des méthodes de
                pointe pour faire vivre le mouvement au quotidien.
              </p>
            </div>

            <div
              data-reveal
              className="mg-xp-stage"
              style={{
                position: "relative",
                borderRadius: "var(--r-xl)",
                minHeight: "clamp(540px,74vh,720px)",
                display: "flex",
                alignItems: "center",
                boxShadow: "0 10px 40px rgba(60,40,30,.14)",
              }}
            >
              {EXPERIENCES.map((x, i) => (
                <Image
                  key={x.src}
                  src={x.src}
                  alt=""
                  aria-hidden="true"
                  fill
                  data-i={i}
                  className="mg-xp-bg"
                  sizes="(max-width: 900px) 100vw, 1140px"
                  style={{ objectFit: "cover", objectPosition: x.objectPosition }}
                />
              ))}

              {/* Voile : plus dense à gauche, là où se pose le panneau. */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(100deg,rgba(0,30,42,.88) 0%,rgba(0,30,42,.72) 38%,rgba(0,30,42,.3) 72%,rgba(0,30,42,.12) 100%)",
                }}
              />

              <div
                className="mg-xp-glass"
                style={{
                  position: "relative",
                  margin: "clamp(16px,3vw,40px)",
                  padding: 8,
                  width: "100%",
                  maxWidth: 430,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {EXPERIENCES.map((x) => (
                  <Link
                    key={x.title}
                    href={x.href}
                    className="mg-xp-card"
                    style={{
                      display: "block",
                      padding: "clamp(16px,2.4vw,22px)",
                      borderRadius: "var(--r-l)",
                      textDecoration: "none",
                    }}
                  >
                    <p style={{ margin: "0 0 6px", fontSize: 11, letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "#5FD3CB", fontWeight: 600 }}>
                      {x.eyebrow}
                    </p>
                    <h3 style={{ margin: "0 0 8px", fontSize: "clamp(19px,2vw,22px)", fontWeight: 700, color: "#fff", letterSpacing: "-.01em", lineHeight: 1.2 }}>
                      {x.title}
                    </h3>
                    <p style={{ margin: "0 0 12px", fontSize: 13.5, lineHeight: 1.55, color: "rgba(255,255,255,.82)" }}>{x.text}</p>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: "#fff" }}>
                      {x.cta} <span className="mg-xp-arrow">→</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ░░ AVIS ░░ */}
        <section id="avis" style={{ background: "#F5EDE4", padding: "clamp(70px,10vw,120px) 0", overflow: "hidden" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 20px" }}>
            <div data-reveal style={{ textAlign: "center", marginBottom: 50 }}>
              <p style={EYEBROW}>Ils nous font confiance</p>
              <h2 style={H2}>Les avis de nos sportifs</h2>
            </div>
          </div>
          <div
            style={{
              position: "relative",
              WebkitMaskImage: "linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)",
              maskImage: "linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)",
            }}
          >
            <div className="mg-avis-track" style={{ display: "flex", gap: 24, width: "max-content", padding: "10px 24px" }}>
              {[...AVIS, ...AVIS].map((a, i) => (
                <figure
                  key={`${a.initials}-${i}`}
                  aria-hidden={i >= AVIS.length}
                  style={{
                    flex: "0 0 auto",
                    width: "min(86vw,360px)",
                    background: "#fff",
                    borderRadius: "var(--r-l)",
                    boxShadow: "0 6px 28px rgba(60,40,30,.08)",
                    padding: 28,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                    <span
                      style={{
                        flex: "0 0 auto",
                        width: 46,
                        height: 46,
                        borderRadius: "50%",
                        background: a.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: 700,
                        letterSpacing: ".02em",
                      }}
                    >
                      {a.initials}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#003850" }}>{a.first}</span>
                      <span style={{ fontSize: 14, color: "rgba(51,51,52,.45)" }}>{a.last}</span>
                    </div>
                    <span style={{ marginLeft: "auto", display: "flex", gap: 1 }} aria-label="5 étoiles sur 5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} style={{ width: 14, height: 14, color: "#F3BE79", fill: "#F3BE79" }} />
                      ))}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.62, color: "rgba(51,51,52,.78)" }}>{a.text}</p>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ░░ CONTACT ░░ */}
        <section id="contact" style={{ background: "#fff", padding: "clamp(70px,10vw,120px) 20px" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div data-reveal style={{ textAlign: "center", marginBottom: 54 }}>
              <p style={EYEBROW}>Adresse &amp; rendez-vous</p>
              <h2 style={H2}>Nous trouver</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "clamp(24px,4vw,56px)" }}>
              <div data-reveal style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ borderRadius: "var(--r-l)", background: "#F5EDE4", padding: 26, display: "flex", flexDirection: "column", gap: 18 }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <MapPin style={{ color: "#04A49B", width: 20, height: 20, flex: "0 0 auto", marginTop: 2 }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: "#003850", fontSize: 14 }}>Adresse</p>
                      <p style={{ margin: "2px 0 0", fontSize: 14, color: "rgba(51,51,52,.7)" }}>3 avenue Kléber, 64200 Biarritz</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <Mail style={{ color: "#04A49B", width: 20, height: 20, flex: "0 0 auto", marginTop: 2 }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: "#003850", fontSize: 14 }}>Email</p>
                      <a href={`mailto:${EXTERNAL.email}`} style={{ fontSize: 14, color: "#04A49B", textDecoration: "none" }}>
                        {EXTERNAL.email}
                      </a>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <Clock style={{ color: "#04A49B", width: 20, height: 20, flex: "0 0 auto", marginTop: 2 }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: "#003850", fontSize: 14 }}>Horaires</p>
                      <p style={{ margin: "2px 0 0", fontSize: 14, color: "rgba(51,51,52,.7)" }}>
                        Lundi au vendredi : 8h00 – 20h00. Samedi : 9h00 – 16h00.
                      </p>
                    </div>
                  </div>
                </div>
                <div style={{ borderRadius: "var(--r-l)", overflow: "hidden", boxShadow: "0 2px 14px rgba(60,40,30,.06)", height: 260 }}>
                  <iframe
                    src="https://maps.google.com/maps?q=3+avenue+Kl%C3%A9ber%2C+64200+Biarritz&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localisation Mugitu Biarritz"
                  />
                </div>
              </div>

              <div data-reveal style={{ display: "flex", flexDirection: "column", gap: 14, transitionDelay: ".1s" }}>
                <p style={{ margin: "0 0 4px", fontSize: 12, letterSpacing: "var(--ls-label)", textTransform: "uppercase", fontWeight: 600, color: "rgba(51,51,52,.55)" }}>
                  Réserver en ligne
                </p>
                <Link
                  href={ROUTES.rdv}
                  className="mg-doc"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "22px 24px",
                    borderRadius: "var(--r-m)",
                    border: "1px solid rgba(4,164,155,.3)",
                    textDecoration: "none",
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: "#003850", fontSize: 15 }}>Prendre rendez-vous</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#04A49B" }}>Choisissez votre praticien &amp; réservez en ligne</p>
                  </div>
                  <ArrowRight style={{ color: "#04A49B", width: 20, height: 20 }} />
                </Link>
                <div style={{ marginTop: 8, padding: 22, borderRadius: "var(--r-m)", background: "rgba(0,56,80,.05)", textAlign: "center" }}>
                  <p style={{ margin: "0 0 6px", fontSize: 13, color: "rgba(51,51,52,.6)" }}>Ou écrivez-nous</p>
                  <a href={`mailto:${EXTERNAL.email}`} style={{ fontSize: 16, fontWeight: 700, color: "#003850", textDecoration: "none" }}>
                    {EXTERNAL.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
