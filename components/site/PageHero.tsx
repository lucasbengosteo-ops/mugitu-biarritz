import Link from "next/link";

/**
 * Hero commun aux pages de contenu du site (méthodes, soins, et plus tard
 * pathologies et sports) : fond dégradé navy, fil d'Ariane, titre XXL,
 * chapô et bouton de prise de rendez-vous.
 *
 * `title` et `lead` viennent des maquettes et contiennent du HTML de mise en
 * forme (`<br>`, `<strong>`) — d'où l'injection contrôlée.
 */
export default function PageHero({
  trail,
  crumb,
  eyebrow,
  title,
  lead,
  cta,
  ctaLabel = "Prendre rendez-vous",
}: {
  trail: { label: string; href: string }[];
  crumb: string;
  eyebrow: string;
  title: string;
  lead: string;
  cta: string;
  ctaLabel?: string;
}) {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "clamp(120px,16vh,180px) clamp(20px,5vw,64px) clamp(50px,7vw,80px)",
        background: "linear-gradient(160deg,#013242,#003850 55%,#0A556B)",
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
        <nav
          aria-label="Fil d'Ariane"
          style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,.55)", marginBottom: 26, flexWrap: "wrap" }}
        >
          {trail.map((t) => (
            <span key={t.href + t.label} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Link href={t.href} style={{ color: "rgba(255,255,255,.55)", textDecoration: "none" }}>
                {t.label}
              </Link>
              <span>›</span>
            </span>
          ))}
          <span style={{ color: "#04A49B", fontWeight: 600 }}>{crumb}</span>
        </nav>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "clamp(28px,5vw,72px)", alignItems: "end" }}>
          <div>
            <p style={{ margin: "0 0 18px", fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", fontWeight: 600, color: "#04A49B" }}>
              {eyebrow.replace(/&amp;/g, "&")}
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(48px,9vw,110px)",
                fontWeight: 700,
                letterSpacing: "-.035em",
                lineHeight: 0.92,
                color: "#fff",
              }}
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </div>
          <div style={{ paddingBottom: 10 }}>
            <p
              style={{
                margin: "0 0 22px",
                fontSize: "clamp(16px,1.5vw,19px)",
                fontWeight: 300,
                lineHeight: 1.6,
                color: "rgba(255,255,255,.78)",
                maxWidth: 460,
              }}
              dangerouslySetInnerHTML={{ __html: lead }}
            />
            <Link
              href={cta}
              className="mg-cta-teal"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "15px 30px",
                borderRadius: 999,
                background: "#04A49B",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              {ctaLabel} <span>↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
