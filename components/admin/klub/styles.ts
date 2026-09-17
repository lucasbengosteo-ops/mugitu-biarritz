import type { CSSProperties } from "react";

export const CHAMP: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(0,56,80,.18)",
  font: "inherit",
  fontSize: 14,
  color: "#003850",
  background: "#fff",
};

export const LABEL: CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "rgba(51,51,52,.6)",
  marginBottom: 6,
};

export const CARTE: CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: "clamp(16px,2.5vw,26px)",
  boxShadow: "0 3px 16px rgba(60,40,30,.06)",
};

export const TITRE_SECTION: CSSProperties = {
  margin: "0 0 12px",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: ".12em",
  textTransform: "uppercase",
  color: "rgba(51,51,52,.45)",
};

export function bouton(variante: "plein" | "contour" | "danger" = "plein", petit = false): CSSProperties {
  const base: CSSProperties = {
    padding: petit ? "6px 12px" : "10px 20px",
    borderRadius: 999,
    font: "inherit",
    fontSize: petit ? 13 : 14,
    fontWeight: 600,
    cursor: "pointer",
  };
  if (variante === "plein") return { ...base, border: "none", background: "#04A49B", color: "#fff" };
  if (variante === "danger") return { ...base, border: "1px solid rgba(194,65,12,.35)", background: "transparent", color: "#C2410C" };
  return { ...base, border: "1px solid rgba(0,56,80,.18)", background: "transparent", color: "#003850" };
}
