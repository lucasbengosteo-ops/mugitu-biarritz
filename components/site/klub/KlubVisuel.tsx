import Image from "next/image";
import { COULEUR_TYPE, LIBELLE_TYPE, type SeancePublique } from "@/lib/klub/types";

/**
 * L'image d'une séance, ou à défaut un panneau à la couleur de son type.
 *
 * Le panneau n'est pas un cas limite : à l'ouverture du nouveau planning,
 * aucune séance n'a d'image. Il doit tenir seul.
 */
export default function KlubVisuel({
  seance,
  sizes,
  grand = false,
}: {
  seance: SeancePublique;
  sizes: string;
  grand?: boolean;
}) {
  const couleur = COULEUR_TYPE[seance.type];

  if (seance.image) {
    return (
      <Image
        src={seance.image}
        alt=""
        fill
        sizes={sizes}
        style={{ objectFit: "cover", objectPosition: seance.image_focus }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "flex-end",
        padding: grand ? 22 : 12,
        background: `linear-gradient(140deg, ${couleur} 0%, ${couleur}cc 55%, #003850 140%)`,
        overflow: "hidden",
      }}
    >
      <span
        style={{
          fontSize: grand ? "clamp(34px,5vw,58px)" : 22,
          fontWeight: 800,
          lineHeight: 0.95,
          letterSpacing: "-.03em",
          color: "rgba(255,255,255,.28)",
          textTransform: "uppercase",
        }}
      >
        {LIBELLE_TYPE[seance.type]}
      </span>
    </span>
  );
}
