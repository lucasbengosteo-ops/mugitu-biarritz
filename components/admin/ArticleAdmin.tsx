"use client";

import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import AdminLogin from "./AdminLogin";
import AdminNav from "./AdminNav";
import ArticleEditor, { nouvelArticle, type Draft } from "./ArticleEditor";
import { formatDate } from "@/lib/articles";

/**
 * Back-office des actualités : connexion, liste des articles et édition.
 *
 * Tout passe par la session Supabase du praticien : la RLS de la table
 * `articles` fait foi côté serveur, l’interface ne fait que refléter les
 * droits (l’administrateur pilote auteur, date, statut et mise à la une).
 */

type Etat = "chargement" | "deconnecte" | "pret";

const STATUT_STYLE: Record<string, { txt: string; bg: string; fg: string }> = {
  brouillon: { txt: "Brouillon", bg: "rgba(51,51,52,.08)", fg: "rgba(51,51,52,.6)" },
  relecture: { txt: "À relire", bg: "rgba(243,190,121,.22)", fg: "#8a5a10" },
  programme: { txt: "Programmé", bg: "rgba(10,85,107,.14)", fg: "#0A556B" },
  publie: { txt: "Publié", bg: "rgba(4,164,155,.14)", fg: "#04A49B" },
};

export default function ArticleAdmin() {
  const [etat, setEtat] = useState<Etat>("chargement");
  const [estAdmin, setEstAdmin] = useState(false);
  const [articles, setArticles] = useState<Draft[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [recherche, setRecherche] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [occupe, setOccupe] = useState(false);

  const notifier = (m: string) => {
    setMessage(m);
    window.setTimeout(() => setMessage(null), 3500);
  };

  /** Charge la liste et le rôle de l’utilisateur connecté. */
  const charger = useCallback(async () => {
    const sb = supabaseBrowser();
    const { data: session } = await sb.auth.getSession();
    if (!session.session) {
      setEtat("deconnecte");
      return;
    }
    const uid = session.session.user.id;
    const [{ data: admin }, { data: rows, error }] = await Promise.all([
      sb.rpc("has_role", { _user_id: uid, _role: "admin" }),
      sb.from("articles").select("*").order("date", { ascending: false }),
    ]);
    if (error) {
      notifier(`Lecture impossible : ${error.message}`);
    }
    setEstAdmin(Boolean(admin));
    setArticles((rows ?? []) as Draft[]);
    setEtat("pret");
  }, []);

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
    const { error } = await supabaseBrowser().from("articles").upsert(draft, { onConflict: "slug" });
    setOccupe(false);
    if (error) {
      notifier(`Enregistrement refusé : ${error.message}`);
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

  async function deconnexion() {
    await supabaseBrowser().auth.signOut();
    setDraft(null);
    setEtat("deconnecte");
  }

  if (etat === "chargement") {
    return <p style={{ padding: 40, fontSize: 15, color: "rgba(51,51,52,.6)" }}>Chargement…</p>;
  }
  if (etat === "deconnecte") {
    return <AdminLogin onSignedIn={() => void charger()} />;
  }

  const filtres = articles.filter((a) =>
    `${a.title} ${a.category} ${a.author.name}`.toLowerCase().includes(recherche.toLowerCase()),
  );

  return (
    <div style={{ minHeight: "100vh", background: "#FDF8F4" }}>
      <header
        style={{
          background: "#003850",
          color: "#fff",
          padding: "18px clamp(16px,4vw,32px)",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#04A49B", fontWeight: 700 }}>
            Back-office
          </p>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Actualités</p>
        </div>
        <AdminNav courant="/admin/actualites" />
        <span style={{ fontSize: 12, padding: "5px 12px", borderRadius: 999, background: "rgba(255,255,255,.12)" }}>
          {estAdmin ? "Administrateur" : "Praticien"}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={() => setDraft(nouvelArticle())}
            style={{ padding: "9px 18px", borderRadius: 999, border: "none", background: "#04A49B", color: "#fff", font: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Nouvel article
          </button>
          <button
            type="button"
            onClick={() => void deconnexion()}
            style={{ padding: "9px 18px", borderRadius: 999, border: "1px solid rgba(255,255,255,.3)", background: "transparent", color: "#fff", font: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Se déconnecter
          </button>
        </div>
      </header>

      {message && (
        <p role="status" style={{ margin: 0, padding: "12px clamp(16px,4vw,32px)", background: "rgba(4,164,155,.12)", color: "#036b66", fontSize: 14, fontWeight: 600 }}>
          {message}
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,300px) minmax(0,1fr)", gap: 20, padding: "clamp(16px,3vw,28px)", alignItems: "start" }}>
        <aside style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 3px 16px rgba(60,40,30,.06)", position: "sticky", top: 16 }}>
          <input
            aria-label="Rechercher un article"
            placeholder="Rechercher…"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            style={{ width: "100%", padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(0,56,80,.16)", font: "inherit", fontSize: 14, marginBottom: 12 }}
          />
          <p style={{ margin: "0 0 10px", fontSize: 12, color: "rgba(51,51,52,.5)" }}>
            {filtres.length} article{filtres.length > 1 ? "s" : ""}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: "60vh", overflowY: "auto" }}>
            {filtres.map((a) => {
              const st = STATUT_STYLE[a.status] ?? STATUT_STYLE.brouillon;
              const actif = draft?.slug === a.slug;
              return (
                <button
                  key={a.slug}
                  type="button"
                  onClick={() => setDraft({ ...a })}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: `1px solid ${actif ? "#04A49B" : "transparent"}`,
                    background: actif ? "rgba(4,164,155,.07)" : "transparent",
                    font: "inherit",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#003850", lineHeight: 1.35 }}>{a.title}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 5 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: st.bg, color: st.fg }}>{st.txt}</span>
                    <span style={{ fontSize: 11, color: "rgba(51,51,52,.45)" }}>{formatDate(a.publish_at ?? a.date)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <main style={{ minWidth: 0 }}>
          {!draft ? (
            <div style={{ background: "#fff", borderRadius: 16, padding: 40, textAlign: "center", boxShadow: "0 3px 16px rgba(60,40,30,.06)" }}>
              <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#003850" }}>Sélectionnez un article</h2>
              <p style={{ margin: 0, fontSize: 14, color: "rgba(51,51,52,.6)" }}>ou créez-en un nouveau depuis le bandeau.</p>
            </div>
          ) : (
            <>
              <ArticleEditor draft={draft} onChange={setDraft} estAdmin={estAdmin} />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", position: "sticky", bottom: 0, background: "#FDF8F4", padding: "12px 0" }}>
                <button
                  type="button"
                  onClick={() => void enregistrer()}
                  disabled={occupe}
                  style={{ padding: "12px 26px", borderRadius: 999, border: "none", background: occupe ? "rgba(4,164,155,.5)" : "#04A49B", color: "#fff", font: "inherit", fontSize: 15, fontWeight: 600, cursor: occupe ? "default" : "pointer" }}
                >
                  {occupe ? "Enregistrement…" : "Enregistrer"}
                </button>
                {draft.slug && articles.some((a) => a.slug === draft.slug) && (
                  <a
                    href={`/actualites/${draft.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: "12px 22px", borderRadius: 999, border: "1px solid rgba(0,56,80,.2)", color: "#003850", fontSize: 15, fontWeight: 600, textDecoration: "none" }}
                  >
                    Voir la page ↗
                  </a>
                )}
                {estAdmin && draft.slug && articles.some((a) => a.slug === draft.slug) && (
                  <button
                    type="button"
                    onClick={() => void supprimer()}
                    disabled={occupe}
                    style={{ marginLeft: "auto", padding: "12px 22px", borderRadius: 999, border: "none", background: "rgba(238,128,108,.16)", color: "#c2543c", font: "inherit", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
