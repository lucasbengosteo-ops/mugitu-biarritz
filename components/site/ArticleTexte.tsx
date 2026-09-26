import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { lireTexte, type Morceau } from "@/lib/marques";

/**
 * Un texte d'article, marques comprises, rendu en éléments React. Aucun HTML
 * brut : un texte ne peut rien injecter dans la page.
 *
 * Un morceau ni gras ni italique ni lien ne porte que du texte : il faut
 * malgré tout un élément avec une clé, donc un `<span>` — exactement ce que
 * rendait déjà la page publique pour un morceau sans lien. Un morceau lié,
 * en revanche, portait sa clé directement sur le `<a>` : on l'imite, pour ne
 * pas ajouter d'enveloppe qui n'existait pas.
 */

const LIEN: React.CSSProperties = {
  color: "#04A49B",
  textDecoration: "none",
  borderBottom: "1px solid rgba(4,164,155,.35)",
};

const FORT: React.CSSProperties = { fontWeight: 700, color: "#003850" };

function rendreMorceau(m: Morceau, k: number): ReactNode {
  let emphase: ReactNode = null;
  if (m.gras) emphase = <strong style={FORT}>{m.texte}</strong>;
  if (m.italique) emphase = m.gras ? <em>{emphase}</em> : <em>{m.texte}</em>;

  if (m.href) {
    const externe = m.href.startsWith("https://");
    return (
      <a
        key={k}
        href={m.href}
        style={LIEN}
        {...(externe ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {emphase ?? m.texte}
      </a>
    );
  }

  if (emphase !== null && isValidElement(emphase)) {
    return cloneElement(emphase as ReactElement, { key: k });
  }
  return <span key={k}>{m.texte}</span>;
}

function rendreMorceaux(morceaux: Morceau[]): ReactNode[] {
  return morceaux.map((m, k) => rendreMorceau(m, k));
}

export default function ArticleTexte({ texte, style }: { texte: string; style: React.CSSProperties }) {
  return (
    <>
      {lireTexte(texte).map((b, i) =>
        b.type === "liste" ? (
          <ul key={i} style={{ ...style, paddingLeft: 22 }}>
            {b.items.map((item, j) => (
              <li key={j} style={{ marginBottom: 6 }}>
                {rendreMorceaux(item)}
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} style={style}>
            {rendreMorceaux(b.morceaux)}
          </p>
        ),
      )}
    </>
  );
}
