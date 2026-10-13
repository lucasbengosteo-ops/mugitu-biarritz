import { CircleAlert, CircleCheck, Info } from "lucide-react";

/**
 * Message d'information, de succès ou d'erreur, avec son icône.
 *
 * Props
 * - `ton`      : "info" | "succes" | "erreur".
 * - `children` : le texte (14 px).
 *
 * Info et succès : `role="status"` (annoncé sans interrompre) ; erreur :
 * `role="alert"`. Pour qu'un lecteur d'écran l'annonce, le message doit
 * apparaître dans un conteneur déjà présent, ou être rendu au moment où
 * l'événement se produit.
 */
export type TonMessage = "info" | "succes" | "erreur";

const TONS = {
  info: { Icone: Info, fond: "rgba(10,85,107,.07)", bord: "#0A556B", icone: "#0A556B" },
  succes: { Icone: CircleCheck, fond: "rgba(4,164,155,.1)", bord: "#04A49B", icone: "#0A556B" },
  erreur: { Icone: CircleAlert, fond: "rgba(238,128,108,.14)", bord: "#EE806C", icone: "#003850" },
} as const;

export default function Message({ ton, children }: { ton: TonMessage; children: React.ReactNode }) {
  const { Icone, fond, bord, icone } = TONS[ton];
  return (
    <div
      role={ton === "erreur" ? "alert" : "status"}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "12px 14px",
        borderRadius: 12,
        background: fond,
        borderLeft: `4px solid ${bord}`,
        color: "#003850",
        fontSize: 14,
        lineHeight: 1.5,
      }}
    >
      <Icone aria-hidden="true" size={18} color={icone} style={{ flex: "none", marginTop: 1 }} />
      <div style={{ minWidth: 0 }}>{children}</div>
    </div>
  );
}
