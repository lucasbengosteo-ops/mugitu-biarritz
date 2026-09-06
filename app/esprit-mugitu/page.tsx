import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Brain, Dumbbell, Footprints, Gauge, Handshake, MapPin, Mountain, ScanLine, Target, Waves } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import BackLink from "@/components/site/BackLink";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "L’esprit Mugitu — Le projet, les salles & le matériel",
  description:
    "Une maison du mouvement avenue Kléber à Biarritz : 120 m², cinq salles de soin nommées d’après les éléments basques, un plateau technique de 50 m² et le matériel du diagnostic à la performance.",
  alternates: { canonical: "https://mugitu-biarritz.fr/esprit-mugitu" },
};

/* ── Les cinq salles + le plateau technique ─────────────────────── */
type Salle = {
  element: string;
  title: string;
  text: string;
  tags: string[];
  photo: string;
  objectPosition: string;
  alt: string;
};

const SALLES: Salle[] = [
  {
    element: "Feu · Sua",
    title: "Sua — Kinésithérapie",
    text: "Salle dédiée aux prises en charge de kinésithérapie : rééducation active, thérapie manuelle et exercices.",
    tags: ["Kinésithérapie", "Rééducation active", "Thérapie manuelle"],
    photo: "/salle-sua.jpg",
    objectPosition: "22% 38%",
    alt: "Sua — salle de kinésithérapie",
  },
  {
    element: "Air · Airea",
    title: "Airea — Médecine du sport & Allyane",
    text: "Consultations de médecine du sport, séances de kinésithérapie et thérapie Allyane®, dans un espace aérien et apaisant.",
    tags: ["Médecine du sport", "Kinésithérapie", "Allyane®"],
    photo: "/salle-airea.jpg",
    objectPosition: "62% 42%",
    alt: "Airea — médecine du sport, kinésithérapie et Allyane",
  },
  {
    element: "Terre · Lurra",
    title: "Lurra — Ostéopathie & Allyane",
    text: "Salle dédiée à l’ostéopathie et à la thérapie Allyane®. Ancrée et enveloppante, pour le soin individuel en toute confidentialité.",
    tags: ["Ostéopathie", "Allyane®", "Dry needling"],
    photo: "/salle-lurra.jpg",
    objectPosition: "62% 36%",
    alt: "Lurra — salle d’ostéopathie et Allyane",
  },
  {
    element: "Éther · Etera",
    title: "Etera — psychologie & diététique",
    text: "Le bureau de la psychologue et de la diététicienne. Un espace calme et confidentiel pour les consultations d’accompagnement.",
    tags: ["Psychologie du sport", "Diététique", "Entretien confidentiel"],
    photo: "/salle-etera.jpg",
    objectPosition: "38% 45%",
    alt: "Etera — salle de psychologie et de diététique",
  },
  {
    element: "Eau · Ura",
    title: "Ura — la chill zone",
    text: "L’espace de récupération et de pause. On s’y pose avant ou après la séance, entre deux exercices, ou juste pour discuter.",
    tags: ["Récupération", "Pause", "Convivialité"],
    photo: "/salle-ura.jpg",
    objectPosition: "50% 42%",
    alt: "Ura — la chill zone du cabinet Mugitu",
  },
];

/* ── Le matériel ─────────────────────────────────────────────────── */
const MATERIEL = [
  { icon: Gauge, title: "Testing de force Vald®", text: "Dynamomètres connectés pour mesurer force et asymétries musculaires." },
  { icon: ScanLine, title: "Thérapie Allyane®", text: "Reprogrammation neuro-motrice, en salle Airea et Lurra." },
  { icon: Brain, title: "Dispositif Allyane®", text: "Reprogrammation neuro-motrice par sons de basse fréquence." },
  { icon: Footprints, title: "Analyse de foulée", text: "Tapis et captation vidéo pour optimiser la course à pied." },
  { icon: Dumbbell, title: "Plateau de renforcement", text: "Charges libres, poulies et matériel de réathlétisation." },
  { icon: Waves, title: "Espace récupération", text: "Électrostimulation, pressothérapie et protocoles de récupération." },
];

const EYEBROW: React.CSSProperties = {
  margin: "0 0 18px",
  fontSize: 12,
  letterSpacing: "var(--ls-eyebrow)",
  textTransform: "uppercase",
  fontWeight: 600,
  color: "#04A49B",
};

const HERO_STAT_LABEL: React.CSSProperties = {
  margin: "3px 0 0",
  fontSize: 11,
  letterSpacing: "var(--ls-label)",
  textTransform: "uppercase",
  color: "rgba(255,255,255,.5)",
};

const HERO_STAT_VALUE: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(28px,3.2vw,38px)",
  fontWeight: 800,
  color: "#fff",
  letterSpacing: "-.02em",
  fontVariantNumeric: "tabular-nums",
};

const CHIP: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "9px 16px",
  borderRadius: "var(--r-pill)",
  background: "rgba(4,164,155,.1)",
  color: "#04A49B",
  fontSize: 13,
  fontWeight: 600,
};

export default function EspritMugituPage() {
  return (
    <>
      {/* Sur les pages intérieures le header est opaque dès le chargement. */}
      <SiteHeader solid />

      <main className="mg-main" style={{ background: "#FDF8F4" }}>
        {/* ░░ HERO ░░ */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "clamp(140px,17vh,190px) clamp(20px,5vw,64px) clamp(50px,7vw,80px)",
            background: "linear-gradient(160deg,#012A3A,#003850 55%,#0A556B)",
          }}
        >
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
              top: "-12%",
              right: "-8%",
              width: "44%",
              height: "60%",
              background: "radial-gradient(circle,rgba(4,164,155,.2),transparent 70%)",
              filter: "blur(20px)",
            }}
          />
          <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto" }}>
            <BackLink tone="dark" />
            <p style={EYEBROW}>Le projet · Biarritz Kléber</p>
            <h1
              className="mg-h1-xl"
              style={{
                margin: "0 0 clamp(20px,3vw,28px)",
                fontWeight: 700,
                letterSpacing: "-.04em",
                color: "#fff",
                textWrap: "balance",
              }}
            >
              L&apos;esprit Mugitu
            </h1>
            <p
              style={{
                margin: "0 0 clamp(30px,4vw,44px)",
                fontSize: "clamp(17px,1.6vw,21px)",
                fontWeight: 300,
                lineHeight: 1.55,
                color: "rgba(255,255,255,.78)",
                maxWidth: 640,
                textWrap: "pretty",
              }}
            >
              Une maison du mouvement, avenue Kléber à Biarritz. Médecins, kinés et ostéopathes du sport y travaillent
              ensemble, avec l&apos;espace et le matériel adaptés à chaque étape de la prise en charge.
            </p>
            <div className="mg-stats" style={{ "--mg-rule": "rgba(255,255,255,.18)" } as React.CSSProperties}>
              <div>
                <p style={HERO_STAT_VALUE}>5</p>
                <p style={HERO_STAT_LABEL}>Salles de soin</p>
              </div>
              <div>
                <p style={HERO_STAT_VALUE}>
                  120<span style={{ fontSize: ".5em" }}>m²</span>
                </p>
                <p style={HERO_STAT_LABEL}>De cabinet</p>
              </div>
              <div>
                <p style={HERO_STAT_VALUE}>
                  50<span style={{ fontSize: ".5em" }}>m²</span>
                </p>
                <p style={HERO_STAT_LABEL}>De plateau technique</p>
              </div>
            </div>
          </div>
        </section>

        {/* Photo d’accueil */}
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "var(--sect-tight) clamp(20px,5vw,64px) 0" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "clamp(300px,46vw,560px)",
              borderRadius: "var(--r-l)",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,20,30,.25)",
            }}
          >
            <Image
              src="/salle-accueil.jpg"
              alt="L’accueil du cabinet Mugitu à Biarritz"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              style={{ objectFit: "cover", objectPosition: "57% 43%" }}
            />
          </div>
        </section>

        {/* ░░ LE PROJET ░░ */}
        <section style={{ maxWidth: 980, margin: "0 auto", padding: "clamp(30px,5vw,60px) clamp(20px,5vw,40px) clamp(50px,7vw,80px)" }}>
          <p style={EYEBROW}>Notre raison d&apos;être</p>
          <h2
            style={{
              margin: "0 0 26px",
              fontSize: "clamp(26px,4.2vw,40px)",
              fontWeight: 700,
              letterSpacing: "-.025em",
              color: "#003850",
              textWrap: "pretty",
            }}
          >
            Du basque <em style={{ color: "#04A49B", fontStyle: "italic" }}>mugitu</em>, se mouvoir. Une maison où le
            mouvement reste toujours possible.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "clamp(24px,4vw,48px)" }}>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "rgba(51,51,52,.7)" }}>
              Mugitu est né d&apos;un constat simple : le sportif blessé est trop souvent ballotté d&apos;un praticien à
              l&apos;autre, sans coordination. Nous avons voulu un lieu unique où le médecin du sport, le kinésithérapeute
              et l&apos;ostéopathe partagent le même toit, le même dossier et la même philosophie.
            </p>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "rgba(51,51,52,.7)" }}>
              Chaque espace a été pensé pour une étape du parcours — du diagnostic à la rééducation, du retour au sport à
              la performance. Et chaque équipement choisi pour une raison : objectiver, accompagner, et faire du mouvement
              une évidence retrouvée.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 34 }}>
            <span style={CHIP}>
              <Handshake style={{ width: 15, height: 15 }} />
              Pluridisciplinaire
            </span>
            <span style={CHIP}>
              <Mountain style={{ width: 15, height: 15 }} />
              Ancré au Pays Basque
            </span>
            <span style={CHIP}>
              <Target style={{ width: 15, height: 15 }} />
              Orienté performance durable
            </span>
          </div>
        </section>

        {/* ░░ LES SALLES DE SOIN ░░ */}
        <section style={{ background: "#F5EDE4", padding: "clamp(60px,9vw,110px) clamp(20px,5vw,64px)" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <p style={{ ...EYEBROW, margin: "0 0 12px" }}>Nos espaces · les 5 éléments</p>
              <h2 style={{ margin: "0 0 16px", fontSize: "clamp(28px,4.6vw,44px)", fontWeight: 700, letterSpacing: "-.025em", color: "#003850" }}>
                Cinq salles, cinq éléments
              </h2>
              <p style={{ margin: "0 auto", maxWidth: 600, fontSize: 15, lineHeight: 1.65, color: "rgba(51,51,52,.6)" }}>
                120 m² pensés autour des éléments basques : chaque salle porte un nom et une atmosphère propres, au
                service d&apos;une étape du soin.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 22, marginTop: 40 }}>
              {SALLES.map((s) => (
                <article
                  key={s.title}
                  style={{
                    background: "#fff",
                    borderRadius: "var(--r-l)",
                    overflow: "hidden",
                    boxShadow: "0 6px 28px rgba(60,40,30,.08)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ position: "relative", width: "100%", height: 230 }}>
                    <Image src={s.photo} alt={s.alt} fill sizes="(max-width: 900px) 100vw, 360px" style={{ objectFit: "cover", objectPosition: s.objectPosition }} />
                  </div>
                  <div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "#04A49B", marginBottom: 8 }}>
                      {s.element}
                    </span>
                    <h3 style={{ margin: "0 0 10px", fontSize: 21, fontWeight: 700, color: "#003850", letterSpacing: "-.01em" }}>{s.title}</h3>
                    <p style={{ margin: "0 0 16px", fontSize: 14, lineHeight: 1.6, color: "rgba(51,51,52,.65)", flex: 1 }}>{s.text}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {s.tags.map((t) => (
                        <span key={t} style={{ padding: "5px 11px", borderRadius: "var(--r-pill)", background: "rgba(4,164,155,.1)", color: "#04A49B", fontSize: 12, fontWeight: 600 }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}

              {/* Le plateau technique — carte en négatif */}
              <article
                style={{
                  background: "linear-gradient(150deg,#003850,#0A556B)",
                  borderRadius: "var(--r-l)",
                  overflow: "hidden",
                  boxShadow: "0 6px 28px rgba(0,40,56,.18)",
                  display: "flex",
                  flexDirection: "column",
                  color: "#fff",
                }}
              >
                <div style={{ position: "relative", width: "100%", height: 200 }}>
                  <Image
                    src="/salle-plateau-technique.jpg"
                    alt="Le plateau technique Mugitu"
                    fill
                    sizes="(max-width: 900px) 100vw, 360px"
                    style={{ objectFit: "cover", objectPosition: "center 60%" }}
                  />
                </div>
                <div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "#04A49B", marginBottom: 8 }}>
                    Le cœur · 50 m²
                  </span>
                  <h3 style={{ margin: "0 0 10px", fontSize: 21, fontWeight: 700, color: "#fff", letterSpacing: "-.01em" }}>Le plateau technique</h3>
                  <p style={{ margin: "0 0 16px", fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,.7)", flex: 1 }}>
                    50 m² ouverts dédiés à la réathlétisation, au renforcement et aux small groups. Là où la rééducation
                    devient performance.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {["Renforcement", "Réathlétisation", "Small groups"].map((t) => (
                      <span key={t} style={{ padding: "5px 11px", borderRadius: "var(--r-pill)", background: "rgba(255,255,255,.14)", color: "#fff", fontSize: 12, fontWeight: 600 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ░░ LE MATÉRIEL ░░ */}
        <section style={{ background: "#003850", padding: "clamp(60px,9vw,110px) clamp(20px,5vw,64px)" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 50 }}>
              <p style={{ ...EYEBROW, margin: "0 0 12px" }}>L&apos;équipement</p>
              <h2 style={{ margin: "0 0 16px", fontSize: "clamp(28px,4.6vw,44px)", fontWeight: 700, letterSpacing: "-.025em", color: "#fff" }}>
                Le matériel qui fait la différence
              </h2>
              <p style={{ margin: "0 auto", maxWidth: 600, fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,.6)" }}>
                Du diagnostic à la performance, chaque outil sert à objectiver et accompagner votre progression.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>
              {MATERIEL.map(({ icon: Icon, title, text }) => (
                <div key={title} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "var(--r-m)", padding: 26 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: "var(--r-s)",
                      background: "rgba(4,164,155,.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    <Icon style={{ width: 23, height: 23, color: "#04A49B" }} />
                  </div>
                  <h3 style={{ margin: "0 0 7px", fontSize: 16, fontWeight: 600, color: "#fff" }}>{title}</h3>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "rgba(255,255,255,.55)" }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ░░ CTA ░░ */}
        <section style={{ background: "#FDF8F4", padding: "clamp(56px,8vw,90px) clamp(20px,5vw,48px)", textAlign: "center" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div
              className="mg-float"
              style={{
                width: 56,
                height: 56,
                borderRadius: "var(--r-m)",
                background: "rgba(4,164,155,.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 22px",
              }}
            >
              <MapPin style={{ color: "#04A49B", width: 28, height: 28 }} />
            </div>
            <h2 style={{ margin: "0 0 14px", fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, letterSpacing: "-.02em", color: "#003850" }}>
              Venez découvrir la maison
            </h2>
            <p style={{ margin: "0 0 30px", fontSize: 16, lineHeight: 1.6, color: "rgba(51,51,52,.65)" }}>
              3 avenue Kléber, 64200 Biarritz. Poussez la porte, on vous fait visiter.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
              <Link
                href={ROUTES.rdv}
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
              <Link
                href={ROUTES.team}
                className="mg-cta-outline"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "15px 32px",
                  borderRadius: "var(--r-pill)",
                  border: "1px solid rgba(0,56,80,.25)",
                  color: "#003850",
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Rencontrer l&apos;équipe
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
