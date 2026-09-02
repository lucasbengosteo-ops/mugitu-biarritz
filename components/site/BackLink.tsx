import Link from "next/link";
import { ROUTES } from "@/lib/routes";

/**
 * Lien « ← Retour à l’accueil » en tête des pages intérieures.
 * `tone` suit le fond de la section : clair sur hero sombre, foncé sinon.
 */
export default function BackLink({
  tone = "light",
  href = ROUTES.home,
  label = "Retour à l’accueil",
}: {
  tone?: "light" | "dark";
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className={tone === "dark" ? "mg-backlink-dark" : "mg-backlink-light"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        fontSize: 13,
        letterSpacing: ".04em",
        color: tone === "dark" ? "rgba(255,255,255,.6)" : "rgba(51,51,52,.55)",
        textDecoration: "none",
        marginBottom: 30,
      }}
    >
      <span style={{ fontSize: 15 }}>←</span> {label}
    </Link>
  );
}
