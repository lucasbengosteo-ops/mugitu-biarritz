/**
 * Cadre d'une page du back-office : titre, phrase d'introduction, actions,
 * puis le contenu. Marges de 16 px sur téléphone, 24 × 32 px dès 700 px,
 * largeur maximale 1200 px (classes `.ad-page`, `.ad-entete` de globals.css).
 *
 * Props
 * - `titre`    : texte du `h1` (24 px, 28 px dès 700 px) — un seul par page.
 * - `intro?`   : phrase sous le titre, 15 px.
 * - `actions?` : boutons à droite du titre ; dessous sur téléphone.
 * - `children` : le contenu de la page.
 *
 * Rend un `<main>` : la page ne doit pas en contenir un autre.
 */
export default function Page({
  titre,
  intro,
  actions,
  children,
}: {
  titre: React.ReactNode;
  intro?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <main className="ad-page">
      <header className="ad-entete">
        <div style={{ minWidth: 0 }}>
          <h1 className="ad-page-titre">{titre}</h1>
          {intro ? <p className="ad-page-intro">{intro}</p> : null}
        </div>
        {actions ? <div className="ad-entete-actions">{actions}</div> : null}
      </header>
      {children}
    </main>
  );
}
