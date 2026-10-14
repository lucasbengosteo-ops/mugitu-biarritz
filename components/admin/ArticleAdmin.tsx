"use client";

import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { montrerFiche } from "./montrerFiche";
import ArticleEditor, { nouvelArticle, type Draft } from "./ArticleEditor";
import { formatDate } from "@/lib/articles";
import { tempsDeLecture } from "@/lib/lecture";
import { useAccesCourant } from "@/lib/admin/acces";
import { peutModifierArticle, peutSupprimerArticle } from "@/lib/admin/droits";
import { ArrowLeft, ExternalLink, Plus, Trash2 } from "lucide-react";
import { Badge, Bouton, Carte, Message, Page, type TonBadge } from "./ui";

/**
 * Back-office des actualités : connexion, liste des articles et édition.
 *
 * Tout passe par la session Supabase du praticien : la RLS de la table
 * `articles` fait foi côté serveur, l’interface ne fait que refléter les
 * droits (l’administrateur pilote auteur, date, statut et mise à la une).
 */

const STATUT: Record<string, { txt: string; ton: TonBadge }> = {
  brouillon: { txt: "Brouillon", ton: "neutre" },
  relecture: { txt: "À relire", ton: "attente" },
  programme: { txt: "Programmé", ton: "info" },
  publie: { txt: "Publié", ton: "succes" },
};

export default function ArticleAdmin() {
  const acces = useAccesCourant();
  const [articles, setArticles] = useState<Draft[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [recherche, setRecherche] = useState("");
  const [mesArticles, setMesArticles] = useState(false);
  const [comptes, setComptes] = useState<{ user_id: string; nom: string }[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [occupe, setOccupe] = useState(false);

  const notifier = (m: string) => {
    setMessage(m);
    window.setTimeout(() => setMessage(null), 3500);
  };

  /** Charge la liste des articles et, pour un super-admin, les comptes disponibles. */
  const charger = useCallback(async () => {
    const sb = supabaseBrowser();
    const { data: rows, error } = await sb.from("articles").select("*").order("date", { ascending: false });
    if (error) notifier(`Lecture impossible : ${error.message}`);
    setArticles((rows ?? []) as Draft[]);
    if (acces.estSuperAdmin) {
      // `profiles.id` est la clé propre de la table, distincte de
      // `profiles.user_id` qui pointe sur `auth.users`. C'est cette
      // dernière que `articles.auteur_id` référence : prendre `id` ici
      // faisait échouer tout changement de propriétaire sur une
      // violation de clé étrangère.
      const { data: profils } = await sb.from("profiles").select("user_id, first_name, last_name");
      setComptes(
        (profils ?? []).map((p: { user_id: string; first_name: string | null; last_name: string | null }) => ({
          user_id: p.user_id,
          nom: [p.first_name, p.last_name].filter(Boolean).join(" ") || p.user_id.slice(0, 8),
        })),
      );
    }
  }, [acces.estSuperAdmin]);

  useEffect(() => {
    // On s’abonne à la session plutôt que d’appeler `charger()` dans le corps
    // de l’effet : c’est le bon usage (réagir à un système externe), et ça
    // couvre aussi le rafraîchissement du jeton et la déconnexion depuis un
    // autre onglet.
    const { data } = supabaseBrowser().auth.onAuthStateChange(() => {
      void charger();
    });
    const initial = window.setTimeout(() => void charger(), 0);
    return () => {
      data.subscription.unsubscribe();
      window.clearTimeout(initial);
    };
  }, [charger]);

  async function enregistrer() {
    if (!draft) return;
    if (!draft.slug || !draft.title.trim()) {
      notifier("Un titre et une adresse sont nécessaires.");
      return;
    }
    setOccupe(true);
    const aEnregistrer: Draft = { ...draft, auteur_id: draft.auteur_id ?? acces.userId, read_mins: tempsDeLecture(draft) };
    const { error } = await supabaseBrowser().from("articles").upsert(aEnregistrer, { onConflict: "slug" });
    setOccupe(false);
    if (error) {
      notifier(
        error.message.includes("ARTICLE_STATUT")
          ? "Seuls Lucas et Jean-Baptiste publient, programment ou mettent à la une. Passez l'article en « À relire »."
          : `Enregistrement refusé : ${error.message}`,
      );
      return;
    }
    notifier("Article enregistré.");
    await charger();
  }

  async function supprimer() {
    if (!draft?.slug) return;
    if (!window.confirm(`Supprimer définitivement « ${draft.title || draft.slug} » ?`)) return;
    setOccupe(true);
    const { error } = await supabaseBrowser().from("articles").delete().eq("slug", draft.slug);
    setOccupe(false);
    if (error) {
      notifier(`Suppression refusée : ${error.message}`);
      return;
    }
    setDraft(null);
    notifier("Article supprimé.");
    await charger();
  }

  const modifiable = peutModifierArticle(acces, draft?.auteur_id ?? null);

  const filtres = articles
    .filter((a) => `${a.title} ${a.category} ${a.author.name}`.toLowerCase().includes(recherche.toLowerCase()))
    .filter((a) => !mesArticles || a.auteur_id === acces.userId);

  const enregistre = Boolean(draft?.slug) && articles.some((a) => a.slug === draft?.slug);

  return (
    <Page
      titre="Actualités"
      intro="Les articles du site : écrire, faire relire, publier."
      actions={
        <>
          <span style={{ alignSelf: "center" }}>
            <Badge ton="neutre">{acces.estSuperAdmin ? "Administrateur" : "Praticien"}</Badge>
          </span>
          <Bouton
            icone={Plus}
            onClick={() => {
              setDraft(nouvelArticle());
              montrerFiche("articles-md");
            }}
          >
            Nouvel article
          </Bouton>
        </>
      }
    >
      <div className="ad-annonce">
        {message ? (
          <div>
            <Message ton="info">{message}</Message>
          </div>
        ) : null}
      </div>

      <div id="articles-md" className="ad-md" data-detail={draft ? "oui" : "non"} style={{ "--ad-md-liste": "300px" } as React.CSSProperties}>
        <Carte className="ad-md-liste ad-md-collante">
          <input
            type="search"
            aria-label="Rechercher un article"
            placeholder="Rechercher…"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="ad-entree"
          />
          <div className="ad-rangee" style={{ justifyContent: "space-between", margin: "4px 0" }}>
            <label className="ad-case">
              <input type="checkbox" checked={mesArticles} onChange={(e) => setMesArticles(e.target.checked)} />
              Mes articles seulement
            </label>
            <p style={{ margin: 0, fontSize: 14, color: "rgba(0,56,80,.72)" }}>
              {filtres.length} article{filtres.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="ad-liste-articles" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {filtres.map((a) => {
              const st = STATUT[a.status] ?? STATUT.brouillon;
              const actif = draft?.slug === a.slug;
              return (
                <button
                  key={a.slug}
                  type="button"
                  className="ad-choix"
                  aria-current={actif ? "true" : undefined}
                  onClick={() => {
                    setDraft({ ...a });
                    montrerFiche("articles-md");
                  }}
                  style={{ flexDirection: "column", alignItems: "flex-start", gap: 6 }}
                >
                  <span style={{ fontWeight: 600 }}>{a.title}</span>
                  <span className="ad-rangee" style={{ gap: 8, fontSize: 13, color: "rgba(0,56,80,.72)" }}>
                    <Badge ton={st.ton}>{st.txt}</Badge>
                    <span>{formatDate(a.publish_at ?? a.date)}</span>
                    {a.auteur_id !== acces.userId && <span>· {a.author.name}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </Carte>

        {!draft ? (
          <Carte className="ad-md-vide" style={{ padding: 40, textAlign: "center" }}>
            <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#003850" }}>Sélectionnez un article</h2>
            <p style={{ margin: 0, fontSize: 15, color: "rgba(0,56,80,.78)" }}>ou créez-en un nouveau avec « Nouvel article ».</p>
          </Carte>
        ) : (
          <div style={{ minWidth: 0 }}>
            <div className="ad-masque-ordi" style={{ marginBottom: 12 }}>
              <Bouton variante="discret" taille="petite" icone={ArrowLeft} onClick={() => setDraft(null)} style={{ marginLeft: -14 }}>
                Tous les articles
              </Bouton>
            </div>
            <ArticleEditor
              draft={draft}
              onChange={(maj) => setDraft((d) => (d ? maj(d) : d))}
              estSuperAdmin={acces.estSuperAdmin}
              comptes={comptes}
            />
            {!modifiable && (
              <div style={{ marginTop: 16 }}>
                <Message ton="info">Cet article appartient à quelqu’un d’autre : vous pouvez le lire, pas le modifier.</Message>
              </div>
            )}
            <div className="ad-barre-actions">
              <Bouton enCours={occupe} disabled={!modifiable} onClick={() => void enregistrer()}>
                Enregistrer
              </Bouton>
              {enregistre && (
                <a
                  href={`/actualites/${draft.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ad-bouton ad-bouton--secondaire"
                >
                  Voir la page
                  <ExternalLink aria-hidden="true" size={18} />
                  <span className="sr-only">(nouvel onglet)</span>
                </a>
              )}
              {peutSupprimerArticle(acces, draft.auteur_id) && enregistre && (
                <Bouton variante="danger" icone={Trash2} className="ad-pousse-droite ad-masque-tel" disabled={occupe} onClick={() => void supprimer()}>
                  Supprimer
                </Bouton>
              )}
            </div>
            {/* Sur téléphone, la barre collée garde une seule rangée : la
                suppression passe dessous, en fin de fiche. */}
            {peutSupprimerArticle(acces, draft.auteur_id) && enregistre && (
              <div className="ad-masque-ordi" style={{ paddingTop: 8 }}>
                <Bouton variante="danger" icone={Trash2} disabled={occupe} onClick={() => void supprimer()}>
                  Supprimer l’article
                </Bouton>
              </div>
            )}
          </div>
        )}
      </div>
    </Page>
  );
}
