"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, CircleHelp, Newspaper, Search, Stethoscope, type LucideIcon } from "lucide-react";
import { chercher } from "@/lib/aide/recherche";
import type { ArticleAide, Rubrique } from "@/lib/aide/types";

export type VueArticles = { rubrique: Rubrique | null; faq: ArticleAide | null };

const RUBRIQUES: { id: Rubrique; titre: string; icone: LucideIcon }[] = [
  { id: "faq", titre: "Questions fréquentes", icone: CircleHelp },
  { id: "pathologies", titre: "Pathologies", icone: Stethoscope },
  { id: "actualites", titre: "Actualités", icone: Newspaper },
];

function nombre(n: number): string {
  return n > 1 ? `${n} articles` : `${n} article`;
}

export default function OngletArticles({
  articles,
  vue,
  setVue,
  recherche,
  setRecherche,
  onRecharger,
}: {
  articles: ArticleAide[] | null | "erreur";
  vue: VueArticles;
  setVue: (v: VueArticles) => void;
  recherche: string;
  setRecherche: (r: string) => void;
  onRecharger: () => void;
}) {
  const titre = useRef<HTMLHeadingElement>(null);

  // Une réponse ou une rubrique ouverte : le focus va à son titre.
  const cle = vue.faq ? `faq:${vue.faq.lien}:${vue.faq.titre}` : vue.rubrique ?? "";
  useEffect(() => {
    if (cle) titre.current?.focus({ preventScroll: true });
  }, [cle]);

  if (articles === null) {
    return (
      <div className="wa-articles">
        <p className="wa-discret wa-centre">Chargement…</p>
      </div>
    );
  }
  if (articles === "erreur") {
    return (
      <div className="wa-articles">
        <div className="wa-vide">
          <p>Les articles ne sont pas disponibles pour le moment.</p>
          <button type="button" className="wa-bouton" onClick={onRecharger}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Une question de la FAQ, ouverte dans le widget.
  if (vue.faq) {
    const a = vue.faq;
    return (
      <div className="wa-articles">
        <button type="button" className="wa-retour" onClick={() => setVue({ ...vue, faq: null })}>
          <ChevronLeft aria-hidden="true" size={18} />
          Retour
        </button>
        <article className="wa-article">
          <h3 ref={titre} tabIndex={-1} className="wa-article-titre">
            {a.titre}
          </h3>
          {a.texte
            .split(/\n{2,}/)
            .filter(Boolean)
            .map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          <Link href={a.lien} className="wa-lien-page">
            Voir la page
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </article>
      </div>
    );
  }

  const requete = recherche.trim();
  const resultats = requete ? chercher(articles, requete) : [];
  const liste = vue.rubrique ? articles.filter((a) => a.rubrique === vue.rubrique) : [];
  const rubrique = RUBRIQUES.find((r) => r.id === vue.rubrique);

  return (
    <div className="wa-articles">
      <div className="wa-recherche" role="search">
        <Search aria-hidden="true" size={18} className="wa-recherche-icone" />
        <label htmlFor="wa-recherche" className="wa-sr">
          Trouver une réponse
        </label>
        <input
          id="wa-recherche"
          type="search"
          className="wa-recherche-champ"
          placeholder="Trouver une réponse…"
          autoComplete="off"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
      </div>

      {requete ? (
        <section aria-label="Résultats">
          <p className="wa-discret" role="status">
            {resultats.length === 0
              ? "Aucun article ne correspond. Essayez un autre mot, ou posez la question dans Messages."
              : resultats.length > 1
                ? `${resultats.length} résultats`
                : "1 résultat"}
          </p>
          <Liste articles={resultats} onOuvrir={(a) => setVue({ ...vue, faq: a })} />
        </section>
      ) : rubrique ? (
        <section>
          <button type="button" className="wa-retour" onClick={() => setVue({ rubrique: null, faq: null })}>
            <ChevronLeft aria-hidden="true" size={18} />
            Toutes les rubriques
          </button>
          <h3 ref={titre} tabIndex={-1} className="wa-bloc-titre wa-bloc-titre--grand">
            {rubrique.titre}
          </h3>
          <Liste articles={liste} onOuvrir={(a) => setVue({ ...vue, faq: a })} />
        </section>
      ) : (
        <ul className="wa-rubriques">
          {RUBRIQUES.map((r) => {
            const Icone = r.icone;
            const n = articles.filter((a) => a.rubrique === r.id).length;
            return (
              <li key={r.id}>
                <button type="button" className="wa-raccourci" onClick={() => setVue({ rubrique: r.id, faq: null })}>
                  <span className="wa-raccourci-icone" aria-hidden="true">
                    <Icone size={20} strokeWidth={1.75} />
                  </span>
                  <span className="wa-raccourci-texte">
                    {r.titre}
                    <span className="wa-raccourci-detail">{nombre(n)}</span>
                  </span>
                  <ChevronRight className="wa-chevron" aria-hidden="true" size={18} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Une liste d'articles : la FAQ s'ouvre dans le widget, le reste mène à sa page. */
function Liste({ articles, onOuvrir }: { articles: ArticleAide[]; onOuvrir: (a: ArticleAide) => void }) {
  if (articles.length === 0) return null;
  return (
    <ul className="wa-rangs">
      {articles.map((a) => (
        <li key={a.rubrique + a.lien + a.titre}>
          {a.rubrique === "faq" ? (
            <button type="button" className="wa-rang" onClick={() => onOuvrir(a)}>
              <span>{a.titre}</span>
              <ChevronRight className="wa-chevron" aria-hidden="true" size={18} />
            </button>
          ) : (
            <Link href={a.lien} className="wa-rang">
              <span>
                {a.titre}
                {a.texte ? <span className="wa-rang-resume">{a.texte}</span> : null}
              </span>
              <ArrowRight className="wa-chevron" aria-hidden="true" size={18} />
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
