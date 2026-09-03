"use client";

import { TEAM } from "@/lib/team";
import type { Article } from "@/lib/articles";
import ImageDrop from "./ImageDrop";

/**
 * Formulaire d’édition d’un article.
 *
 * Les blocs répétables (sections, FAQ) et les listes saisies en texte
 * (paragraphes, stats, tags) sont convertis ici même : la base reçoit
 * toujours la forme structurée attendue par les pages publiques.
 */

export type Draft = Omit<Article, "views" | "likes">;

/** Un article vierge, prêt à être rempli. */
export function nouvelArticle(): Draft {
  const auteur = TEAM[0];
  return {
    slug: "",
    title: "",
    eyebrow: "",
    category: "Pathologies",
    chapo: "",
    cover: "",
    tags: [],
    author: { name: auteur.name, job: auteur.role, photo: auteur.photo, fiche: `/equipe/${auteur.slug}` },
    date: new Date().toISOString().slice(0, 10),
    status: "brouillon",
    publish_at: null,
    featured: false,
    read_mins: 3,
    sections: [{ h: "", p: [""] }],
    faq: [],
    cas: "",
    exercice: { title: "", body: "", video: "" },
    stats: [],
    seo: { title: "", desc: "" },
  };
}

/** Slug normalisé à partir du titre : accents retirés, tirets. */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const CATEGORIES = ["Pathologies", "Sports", "Bilans", "Le centre"];
const STATUTS: { value: string; label: string }[] = [
  { value: "brouillon", label: "Brouillon" },
  { value: "relecture", label: "À relire" },
  { value: "programme", label: "Programmé" },
  { value: "publie", label: "Publié" },
];

const champ: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(0,56,80,.16)",
  background: "#fff",
  font: "inherit",
  fontSize: 14,
  color: "#003850",
};
const label: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: "rgba(51,51,52,.6)", display: "block", marginBottom: 5 };
const bloc: React.CSSProperties = { background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 3px 16px rgba(60,40,30,.06)", marginBottom: 16 };
const h2: React.CSSProperties = { margin: "0 0 14px", fontSize: 16, fontWeight: 700, color: "#003850" };

function Bouton({ children, onClick, ton = "clair" }: { children: React.ReactNode; onClick: () => void; ton?: "clair" | "danger" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "7px 13px",
        borderRadius: 999,
        border: "1px solid rgba(0,56,80,.14)",
        background: ton === "danger" ? "rgba(238,128,108,.14)" : "transparent",
        color: ton === "danger" ? "#c2543c" : "#003850",
        font: "inherit",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

export default function ArticleEditor({
  draft,
  onChange,
  estAdmin,
}: {
  draft: Draft;
  onChange: (d: Draft) => void;
  /** Les non-admins ne pilotent ni l’auteur, ni la date, ni le statut, ni la une. */
  estAdmin: boolean;
}) {
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => onChange({ ...draft, [k]: v });

  return (
    <>
      <div style={bloc}>
        <h2 style={h2}>L&apos;essentiel</h2>
        <div style={{ display: "grid", gap: 14 }}>
          <div>
            <label style={label} htmlFor="f-title">Titre</label>
            <input
              id="f-title"
              style={champ}
              value={draft.title}
              onChange={(e) => {
                const title = e.target.value;
                // Le slug suit le titre tant que l’article n’est pas publié :
                // changer l’URL d’un article en ligne casserait les liens.
                onChange({ ...draft, title, slug: draft.status === "publie" ? draft.slug : slugify(title) });
              }}
            />
          </div>
          <div>
            <label style={label} htmlFor="f-slug">Adresse (slug)</label>
            <input id="f-slug" style={champ} value={draft.slug} onChange={(e) => set("slug", slugify(e.target.value))} />
            <p style={{ margin: "5px 0 0", fontSize: 12, color: "rgba(51,51,52,.5)" }}>
              /actualites/{draft.slug || "…"}
              {draft.status === "publie" && " — figé tant que l’article est publié"}
            </p>
          </div>
          <div>
            <label style={label} htmlFor="f-chapo">Chapô</label>
            <textarea id="f-chapo" rows={3} style={champ} value={draft.chapo} onChange={(e) => set("chapo", e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
            <div>
              <label style={label} htmlFor="f-cat">Catégorie</label>
              <select id="f-cat" style={champ} value={draft.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={label} htmlFor="f-eyebrow">Surtitre</label>
              <input id="f-eyebrow" style={champ} value={draft.eyebrow ?? ""} onChange={(e) => set("eyebrow", e.target.value)} />
            </div>
            <div>
              <label style={label} htmlFor="f-mins">Minutes de lecture</label>
              <input id="f-mins" type="number" min={1} style={champ} value={draft.read_mins ?? 3} onChange={(e) => set("read_mins", Number(e.target.value))} />
            </div>
          </div>
          <div>
            <p style={label}>Image de couverture</p>
            <ImageDrop valeur={draft.cover ?? ""} onChange={(url) => set("cover", url)} />
          </div>
          <div>
            <label style={label} htmlFor="f-tags">Mots-clés (séparés par des virgules)</label>
            <input id="f-tags" style={champ} value={draft.tags.join(", ")}
              onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} />
          </div>
        </div>
      </div>

      <div style={bloc}>
        <h2 style={h2}>Publication</h2>
        {!estAdmin && (
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "rgba(51,51,52,.6)" }}>
            Auteur, date, statut et mise à la une sont réservés à l&apos;administrateur.
          </p>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 12 }}>
          <div>
            <label style={label} htmlFor="f-author">Auteur</label>
            <select
              id="f-author"
              style={champ}
              disabled={!estAdmin}
              value={draft.author.name}
              onChange={(e) => {
                const p = TEAM.find((t) => t.name === e.target.value);
                if (p) set("author", { name: p.name, job: p.role, photo: p.photo, fiche: `/equipe/${p.slug}` });
              }}
            >
              {TEAM.map((t) => <option key={t.slug}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label style={label} htmlFor="f-date">Date</label>
            <input id="f-date" type="date" style={champ} disabled={!estAdmin} value={draft.date} onChange={(e) => set("date", e.target.value)} />
          </div>
          <div>
            <label style={label} htmlFor="f-status">Statut</label>
            <select id="f-status" style={champ} disabled={!estAdmin} value={draft.status} onChange={(e) => set("status", e.target.value)}>
              {STATUTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          {draft.status === "programme" && (
            <div>
              <label style={label} htmlFor="f-publishat">Mise en ligne le</label>
              <input
                id="f-publishat"
                type="datetime-local"
                style={champ}
                disabled={!estAdmin}
                value={draft.publish_at ? draft.publish_at.slice(0, 16) : ""}
                onChange={(e) => set("publish_at", e.target.value ? new Date(e.target.value).toISOString() : null)}
              />
            </div>
          )}
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, fontSize: 14, fontWeight: 600, color: "#003850", cursor: estAdmin ? "pointer" : "default" }}>
          <input type="checkbox" disabled={!estAdmin} checked={draft.featured} onChange={(e) => set("featured", e.target.checked)} style={{ width: 17, height: 17, accentColor: "#04A49B" }} />
          Mettre à la une
        </label>
      </div>

      <div style={bloc}>
        <h2 style={h2}>Le corps de l&apos;article</h2>
        {draft.sections.map((s, i) => (
          <div key={i} style={{ borderTop: i ? "1px solid rgba(0,56,80,.08)" : undefined, paddingTop: i ? 16 : 0, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <input
                aria-label={`Titre de la section ${i + 1}`}
                style={{ ...champ, fontWeight: 700 }}
                placeholder="Titre de la section"
                value={s.h}
                onChange={(e) => {
                  const sections = [...draft.sections];
                  sections[i] = { ...s, h: e.target.value };
                  set("sections", sections);
                }}
              />
              <Bouton ton="danger" onClick={() => set("sections", draft.sections.filter((_, j) => j !== i))}>Retirer</Bouton>
            </div>
            <textarea
              aria-label={`Paragraphes de la section ${i + 1}`}
              rows={5}
              style={champ}
              placeholder="Un paragraphe par ligne vide."
              value={s.p.join("\n\n")}
              onChange={(e) => {
                const sections = [...draft.sections];
                sections[i] = { ...s, p: e.target.value.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean) };
                set("sections", sections);
              }}
            />
          </div>
        ))}
        <Bouton onClick={() => set("sections", [...draft.sections, { h: "", p: [""] }])}>+ Ajouter une section</Bouton>
      </div>

      <div style={bloc}>
        <h2 style={h2}>Compléments</h2>
        <div style={{ display: "grid", gap: 14 }}>
          <div>
            <label style={label} htmlFor="f-cas">Un cas concret</label>
            <textarea id="f-cas" rows={3} style={champ} value={draft.cas ?? ""} onChange={(e) => set("cas", e.target.value)} />
          </div>
          <div>
            <label style={label} htmlFor="f-extitle">L&apos;exercice — titre</label>
            <input id="f-extitle" style={champ} value={draft.exercice?.title ?? ""}
              onChange={(e) => set("exercice", { ...draft.exercice, title: e.target.value })} />
          </div>
          <div>
            <label style={label} htmlFor="f-exbody">L&apos;exercice — description</label>
            <textarea id="f-exbody" rows={2} style={champ} value={draft.exercice?.body ?? ""}
              onChange={(e) => set("exercice", { ...draft.exercice, body: e.target.value })} />
          </div>
          <div>
            <label style={label} htmlFor="f-stats">Chiffres clés — une ligne par chiffre, « valeur | légende »</label>
            <textarea
              id="f-stats"
              rows={3}
              style={champ}
              placeholder="1 sur 3 | récidive après une entorse mal rééduquée"
              value={draft.stats.map((s) => `${s.value} | ${s.label}`).join("\n")}
              onChange={(e) =>
                set("stats", e.target.value.split("\n").map((l) => {
                  const [value, ...reste] = l.split("|");
                  return { value: value.trim(), label: reste.join("|").trim() };
                }).filter((s) => s.value && s.label))
              }
            />
          </div>
        </div>
      </div>

      <div style={bloc}>
        <h2 style={h2}>Questions fréquentes</h2>
        {draft.faq.map((f, i) => (
          <div key={i} style={{ display: "grid", gap: 8, marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <input aria-label={`Question ${i + 1}`} style={{ ...champ, fontWeight: 600 }} placeholder="Question" value={f.q}
                onChange={(e) => { const faq = [...draft.faq]; faq[i] = { ...f, q: e.target.value }; set("faq", faq); }} />
              <Bouton ton="danger" onClick={() => set("faq", draft.faq.filter((_, j) => j !== i))}>Retirer</Bouton>
            </div>
            <textarea aria-label={`Réponse ${i + 1}`} rows={3} style={champ} placeholder="Réponse" value={f.a}
              onChange={(e) => { const faq = [...draft.faq]; faq[i] = { ...f, a: e.target.value }; set("faq", faq); }} />
          </div>
        ))}
        <Bouton onClick={() => set("faq", [...draft.faq, { q: "", a: "" }])}>+ Ajouter une question</Bouton>
      </div>

      <div style={bloc}>
        <h2 style={h2}>Référencement</h2>
        <div style={{ display: "grid", gap: 14 }}>
          <div>
            <label style={label} htmlFor="f-seot">Titre SEO (70 caractères max)</label>
            <input id="f-seot" maxLength={70} style={champ} value={draft.seo?.title ?? ""}
              onChange={(e) => set("seo", { ...draft.seo, title: e.target.value })} />
          </div>
          <div>
            <label style={label} htmlFor="f-seod">Description SEO (170 caractères max)</label>
            <textarea id="f-seod" maxLength={170} rows={2} style={champ} value={draft.seo?.desc ?? ""}
              onChange={(e) => set("seo", { ...draft.seo, desc: e.target.value })} />
          </div>
        </div>
      </div>
    </>
  );
}
