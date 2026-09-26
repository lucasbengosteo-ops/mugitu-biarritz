import Link from "next/link";
import { etatPlaces, heure, type EtatPlaces } from "@/lib/klub/format";
import { COULEUR_TYPE, LIBELLE_TYPE, type SeancePublique } from "@/lib/klub/types";
import { klubSeancePath } from "@/lib/routes";

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
  if (ton === "libre" || ton === "externe") return "Détails →";
  return null;
}

export default function KlubCarte({ seance, maintenant }: { seance: SeancePublique; maintenant: string }) {
  const etat = etatPlaces(seance, maintenant);
  const inerte = etat.ton === "annulee" || etat.ton === "passee";
  const couleur = COULEUR_TYPE[seance.type];
  const meta = [seance.intervenant, `${seance.duree_min} min`].filter(Boolean).join(" · ");
  const libelle = action(etat.ton);

  const style: React.CSSProperties = {
    display: "block",
    textDecoration: "none",
    borderRadius: "var(--r-m)",
    background: "#fff",
    boxShadow: "0 3px 16px rgba(60,40,30,.06)",
    borderLeft: `3px solid ${couleur}`,
    padding: 14,
    opacity: inerte ? 0.6 : 1,
  };

  const contenu = (
    <>
      <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#003850" }}>{heure(seance.debut)}</span>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: couleur }}>
          {LIBELLE_TYPE[seance.type]}
        </span>
      </span>
      <span
        style={{
          display: "block",
          margin: "0 0 5px",
          fontSize: "var(--h3-s)",
          fontWeight: 600,
          color: "#003850",
          lineHeight: 1.25,
          textDecoration: etat.ton === "annulee" ? "line-through" : "none",
        }}
      >
        {seance.titre}
      </span>
      <span style={{ display: "block", margin: "0 0 10px", fontSize: 12, color: "rgba(51,51,52,.55)" }}>{meta}</span>
      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: COULEUR_ETAT[etat.ton] }}>{etat.texte}</span>
        {libelle && <span style={{ fontSize: 12, fontWeight: 600, color: "#04A49B" }}>{libelle}</span>}
      </span>
    </>
  );

  return inerte ? (
    <div style={style}>{contenu}</div>
  ) : (
    <Link href={klubSeancePath(seance.id)} style={style} className="mg-inline-hover">
      {contenu}
    </Link>
  );
}
