import Link from "next/link";
import { etatPlaces, heure, type EtatPlaces } from "@/lib/klub/format";
import { COULEUR_TYPE, LIBELLE_TYPE, type SeancePublique } from "@/lib/klub/types";
import { klubSeancePath } from "@/lib/routes";
import KlubVisuel from "./KlubVisuel";

const COULEUR_ETAT: Record<EtatPlaces["ton"], string> = {
  ok: "#1F8A5B",
  peu: "#C2410C",
  complet: "#9E4433",
  libre: "#04A49B",
  externe: "#04A49B",
  annulee: "rgba(51,51,52,.5)",
  passee: "rgba(51,51,52,.5)",
};

function action(ton: EtatPlaces["ton"]): string | null {
  if (ton === "ok" || ton === "peu") return "S’inscrire →";
  if (ton === "complet") return "Liste d’attente →";
  if (ton === "externe") return "S’inscrire ↗";
  if (ton === "libre") return "Détails →";
  return null;
}

/**
 * Une séance dans la liste : l'image carrée à gauche, l'essentiel à droite.
 * Sur téléphone l'image passe au-dessus, par le seul jeu de `flex-wrap` —
 * les styles du site sont en ligne, sans feuille de media queries.
 */
export default function KlubCarte({ seance, maintenant }: { seance: SeancePublique; maintenant: string }) {
  const etat = etatPlaces(seance, maintenant);
  const annulee = etat.ton === "annulee";
  const couleur = COULEUR_TYPE[seance.type];
  const meta = [`${heure(seance.debut)} · ${seance.duree_min} min`, seance.intervenant, seance.prix_libelle].filter(Boolean);
  const libelle = action(etat.ton);

  const contenu = (
    <>
      <span
        style={{
          flex: "0 0 132px",
          position: "relative",
          aspectRatio: "1 / 1",
          minHeight: 132,
          borderRadius: "var(--r-m)",
          overflow: "hidden",
        }}
      >
        <KlubVisuel seance={seance} sizes="140px" />
      </span>
      <span style={{ flex: "1 1 220px", minWidth: 0, display: "flex", flexDirection: "column", gap: 6, padding: "4px 2px" }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: couleur }}>
          {LIBELLE_TYPE[seance.type]}
        </span>
        <span
          style={{
            fontSize: "var(--h3-s)",
            fontWeight: 700,
            color: "#003850",
            lineHeight: 1.2,
            textDecoration: annulee ? "line-through" : "none",
          }}
        >
          {seance.titre}
        </span>
        <span style={{ fontSize: 13.5, color: "rgba(51,51,52,.65)" }}>{meta.join(" · ")}</span>
        <span style={{ marginTop: "auto", paddingTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: COULEUR_ETAT[etat.ton] }}>{etat.texte}</span>
          {libelle ? <span style={{ fontSize: 13, fontWeight: 700, color: "#04A49B" }}>{libelle}</span> : null}
        </span>
      </span>
    </>
  );

  const style: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    padding: 12,
    borderRadius: "var(--r-l)",
    background: "#fff",
    boxShadow: "0 3px 16px rgba(60,40,30,.06)",
    textDecoration: "none",
    opacity: annulee ? 0.6 : 1,
  };

  return annulee ? (
    <div style={style}>{contenu}</div>
  ) : (
    <Link href={klubSeancePath(seance.id)} style={style} className="mg-inline-hover">
      {contenu}
    </Link>
  );
}
