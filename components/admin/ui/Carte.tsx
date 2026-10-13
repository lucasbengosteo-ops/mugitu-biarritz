/**
 * Carte du back-office : fond blanc, rayon 14 px, bordure fine, une seule
 * ombre douce.
 *
 * Props
 * - `titre?`    : titre de la carte (18 px).
 * - `niveau?`   : niveau du titre, 2 (par défaut, sous le `h1` de la page) ou 3.
 * - `action?`   : un bouton ou un lien à droite du titre.
 * - `className?`, `style?` : ajoutés à la `<section>`.
 * - `children`  : le contenu.
 */
export default function Carte({
  titre,
  niveau = 2,
  action,
  className,
  style,
  children,
}: {
  titre?: React.ReactNode;
  niveau?: 2 | 3;
  action?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const Titre = niveau === 3 ? "h3" : "h2";
  return (
    <section
      className={className}
      style={{
        minWidth: 0,
        background: "#fff",
        borderRadius: 14,
        border: "1px solid rgba(0,56,80,.1)",
        boxShadow: "0 2px 14px rgba(60,40,30,.06)",
        padding: 16,
        ...style,
      }}
    >
      {titre || action ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
          {titre ? (
            <Titre style={{ margin: 0, fontSize: 18, lineHeight: 1.3, fontWeight: 700, color: "#003850" }}>{titre}</Titre>
          ) : (
            <span />
          )}
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
