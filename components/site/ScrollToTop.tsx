"use client";

/** Bouton « haut de page » du footer — seul élément interactif de celui-ci. */
export default function ScrollToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Haut de page"
      className="mg-totop"
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,.2)",
        background: "transparent",
        color: "#fff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>↑</span>
    </button>
  );
}
