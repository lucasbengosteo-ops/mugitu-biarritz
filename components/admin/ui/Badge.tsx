/**
 * Étiquette d'état. Le texte est obligatoire : la couleur n'est jamais le
 * seul repère, elle accompagne le mot.
 *
 * Props
 * - `ton`      : "neutre" | "succes" | "attente" | "alerte" | "info".
 * - `children` : le mot ou la courte phrase (12 px, gras).
 *
 * Toutes les paires fond/texte dépassent 4,5:1.
 */
export type TonBadge = "neutre" | "succes" | "attente" | "alerte" | "info";

const TONS: Record<TonBadge, { fond: string; texte: string; point: string }> = {
  neutre: { fond: "rgba(0,56,80,.08)", texte: "#003850", point: "rgba(0,56,80,.5)" },
  succes: { fond: "rgba(4,164,155,.14)", texte: "#0A556B", point: "#04A49B" },
  attente: { fond: "rgba(243,190,121,.32)", texte: "#003850", point: "#D9952F" },
  alerte: { fond: "rgba(238,128,108,.2)", texte: "#003850", point: "#EE806C" },
  info: { fond: "rgba(10,85,107,.1)", texte: "#0A556B", point: "#0A556B" },
};

export default function Badge({ ton, children }: { ton: TonBadge; children: React.ReactNode }) {
  const t = TONS[ton];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 9px",
        borderRadius: 999,
        background: t.fond,
        color: t.texte,
        fontSize: 12,
        fontWeight: 700,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: 999, background: t.point, flex: "none" }} />
      {children}
    </span>
  );
}
