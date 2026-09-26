import Link from "next/link";
import { dateLongue, etatPlaces, heure } from "@/lib/klub/format";
import { COULEUR_TYPE, LIBELLE_TYPE, type SeancePublique } from "@/lib/klub/types";
import { klubSeancePath } from "@/lib/routes";
import KlubVisuel from "./KlubVisuel";

/** La prochaine séance, en grand. Sur le modèle de « À la une » de thera.family. */
export default function KlubALaUne({ seance, maintenant }: { seance: SeancePublique; maintenant: string }) {
  const etat = etatPlaces(seance, maintenant);
  const couleur = COULEUR_TYPE[seance.type];
  const quand = dateLongue(seance.debut);
  const externe = etat.ton === "externe" && seance.reservation_url;

  const meta = [
    `${quand.charAt(0).toUpperCase() + quand.slice(1)}, ${heure(seance.debut)}`,
    `${seance.duree_min} min`,
    seance.intervenant,
    seance.prix_libelle,
  ].filter(Boolean);

  return (
    <article
      style={{
        display: "flex",
        flexWrap: "wrap-reverse",
        gap: "clamp(20px,3vw,40px)",
        alignItems: "center",
        marginBottom: "clamp(34px,5vw,56px)",
      }}
    >
      <div style={{ flex: "1 1 320px", minWidth: 0 }}>
        <p style={{ margin: "0 0 12px", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 600, color: "#04A49B" }}>
          Prochaine séance
        </p>
        <span
          style={{
            display: "inline-block",
            marginBottom: 12,
            padding: "4px 10px",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "var(--ls-label)",
            textTransform: "uppercase",
            color: couleur,
            background: `${couleur}1f`,
          }}
        >
          {LIBELLE_TYPE[seance.type]}
        </span>
        <h3 style={{ margin: "0 0 14px", fontSize: "var(--h2-l)", fontWeight: 700, letterSpacing: "-.025em", lineHeight: 1.05, color: "#003850" }}>
          {seance.titre}
        </h3>
        <p style={{ margin: "0 0 8px", fontSize: 15.5, color: "rgba(51,51,52,.75)" }}>{meta.join(" · ")}</p>
        <p style={{ margin: "0 0 22px", fontSize: 14, fontWeight: 600, color: etat.ton === "complet" ? "#9E4433" : etat.ton === "peu" ? "#C2410C" : "#1F8A5B" }}>
          {etat.texte}
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href={klubSeancePath(seance.id)}
            style={{ padding: "12px 22px", borderRadius: 999, background: "#003850", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}
          >
            Découvrir →
          </Link>
          {externe ? (
            <a
              href={seance.reservation_url ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: "12px 22px", borderRadius: 999, border: "1px solid rgba(0,56,80,.2)", color: "#003850", fontSize: 14, fontWeight: 700, textDecoration: "none" }}
            >
              {seance.reservation_libelle || "S’inscrire"} ↗
            </a>
          ) : null}
        </div>
      </div>
      <div
        style={{
          flex: "1 1 360px",
          position: "relative",
          aspectRatio: "16 / 10",
          borderRadius: "var(--r-l)",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(60,40,30,.10)",
        }}
      >
        <KlubVisuel seance={seance} sizes="(max-width: 900px) 100vw, 600px" grand />
      </div>
    </article>
  );
}
