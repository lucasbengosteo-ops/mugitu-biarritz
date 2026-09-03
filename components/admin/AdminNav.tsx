import Link from "next/link";

/**
 * Bascule entre les sections du back-office. Volontairement minimale : deux
 * sections aujourd'hui, et un endroit unique où en ajouter une troisième.
 */

const SECTIONS = [
  { href: "/admin/actualites", label: "Actualités" },
  { href: "/admin/mugi-klub", label: "Mugi Klub" },
];

export default function AdminNav({ courant }: { courant: string }) {
  return (
    <nav aria-label="Sections du back-office" style={{ display: "flex", gap: 6 }}>
      {SECTIONS.map((s) => {
        const actif = s.href === courant;
        return (
          <Link
            key={s.href}
            href={s.href}
            aria-current={actif ? "page" : undefined}
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              fontSize: 13.5,
              fontWeight: 600,
              textDecoration: "none",
              background: actif ? "rgba(255,255,255,.16)" : "transparent",
              color: actif ? "#fff" : "rgba(255,255,255,.65)",
              border: "1px solid rgba(255,255,255,.18)",
            }}
          >
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
}
