import Image from "next/image";
import Link from "next/link";
import ScrollToTop from "./ScrollToTop";
import { EXTERNAL, ROUTES } from "@/lib/routes";

const linkStyle: React.CSSProperties = {
  fontSize: 16,
  color: "rgba(255,255,255,.85)",
  textDecoration: "none",
};

const colTitleStyle: React.CSSProperties = {
  margin: "0 0 18px",
  fontSize: 15,
  fontWeight: 600,
  color: "rgba(255,255,255,.45)",
};

/** Colonne de liens du footer. */
function FooterCol({ title, links }: { title: string; links: { href: string; label: string; external?: boolean }[] }) {
  return (
    <div>
      <p style={colTitleStyle}>{title}</p>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 13 }}>
        {links.map((l) => (
          <li key={l.label}>
            {l.external ? (
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="mg-footlink" style={linkStyle}>
                {l.label}
              </a>
            ) : (
              <Link href={l.href} className="mg-footlink" style={linkStyle}>
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer style={{ background: "#012A3A", color: "#fff", padding: "clamp(56px,8vw,96px) clamp(20px,5vw,64px) 34px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <a
          href={`mailto:${EXTERNAL.email}`}
          className="mg-mail-big"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            fontSize: "clamp(24px,4.5vw,52px)",
            fontWeight: 600,
            letterSpacing: "-.02em",
            color: "#fff",
            textDecoration: "none",
            borderBottom: "1px solid rgba(255,255,255,.3)",
            paddingBottom: 10,
            maxWidth: "100%",
            wordBreak: "break-word",
          }}
        >
          {EXTERNAL.email} <span style={{ fontSize: ".6em" }}>↗</span>
        </a>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 36,
            marginTop: "clamp(48px,7vw,90px)",
          }}
        >
          <div>
            <p style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,.45)" }}>Mugitu Biarritz</p>
            <p style={{ margin: "0 0 6px", fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,.8)" }}>
              3 avenue Kléber
              <br />
              64200 Biarritz
            </p>
            <p style={{ margin: "14px 0 0", fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,.5)" }}>
              Lun – ven · 8h00 – 20h00
              <br />
              Sam · 9h00 – 16h00
            </p>
            <Image
              src="/logo-mini-navy.png"
              alt="Mugitu"
              width={81}
              height={24}
              style={{ height: 24, width: "auto", filter: "brightness(0) invert(1)", marginTop: 24, opacity: 0.9 }}
            />

            <a
              href={EXTERNAL.googleReview}
              target="_blank"
              rel="noopener noreferrer"
              className="mg-google"
              style={{
                marginTop: 22,
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "rgba(255,255,255,.06)",
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: "var(--r-m)",
                padding: "12px 14px",
                textDecoration: "none",
                maxWidth: 250,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 48 48" style={{ flex: "0 0 auto" }} aria-hidden="true">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
              <div style={{ lineHeight: 1.25 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>5,0</span>
                  <span style={{ color: "#F3BE79", fontSize: 13, letterSpacing: 1 }}>★★★★★</span>
                </div>
                <p style={{ margin: "1px 0 0", fontSize: 12, color: "rgba(255,255,255,.6)" }}>158 avis · voir sur Google</p>
              </div>
            </a>
          </div>

          <FooterCol
            title="Navigation"
            links={[
              { href: ROUTES.esprit, label: "Le centre" },
              { href: ROUTES.soins, label: "Nos soins" },
              { href: ROUTES.methodes, label: "Méthodes & technologies" },
              { href: ROUTES.klub, label: "Le Mugi Klub" },
              { href: `${ROUTES.klub}#planning`, label: "Planning" },
              { href: `${ROUTES.klub}#tarifs`, label: "Tarifs" },
              { href: ROUTES.rdv, label: "Prendre rendez-vous" },
            ]}
          />

          <FooterCol
            title="Découvrir"
            links={[
              { href: ROUTES.team, label: "La Mugi Team" },
              { href: ROUTES.ambassadeurs, label: "Nos ambassadeurs" },
              { href: ROUTES.zone, label: "Venir au cabinet" },
              { href: ROUTES.actualites, label: "Actualités" },
              { href: ROUTES.espace, label: "Mon espace" },
              { href: EXTERNAL.appPraticien, label: "App praticien ↗", external: true },
            ]}
          />

          <div>
            <FooterCol
              title="Utiles"
              links={[
                { href: ROUTES.mentions, label: "Mentions légales" },
                { href: ROUTES.confidentialite, label: "Confidentialité" },
                { href: ROUTES.faq, label: "FAQ" },
              ]}
            />
            <p style={{ margin: "28px 0 14px", fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,.45)" }}>Partenaires</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
              <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: ".02em", color: "rgba(255,255,255,.7)" }}>Allyane®</span>
              <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "var(--ls-label)", color: "rgba(255,255,255,.7)" }}>VALD</span>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "clamp(40px,6vw,72px)",
            paddingTop: 26,
            borderTop: "1px solid rgba(255,255,255,.12)",
            display: "flex",
            flexWrap: "wrap",
            gap: 18,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,.4)" }}>© 2026 Mugitu · La maison du mouvement</p>
          <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
            <a
              href={EXTERNAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mg-footlink"
              style={{ fontSize: 14, color: "rgba(255,255,255,.7)", textDecoration: "none" }}
            >
              Instagram
            </a>
            <ScrollToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
