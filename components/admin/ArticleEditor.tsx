"use client";

import Image from "next/image";
import { useState } from "react";
import { tempsDeLecture } from "@/lib/lecture";
import { TEAM } from "@/lib/team";
import type { Article } from "@/lib/articles";
import ArticleCorps from "@/components/site/ArticleCorps";
import ImageDrop from "./ImageDrop";

/**
 * L'éditeur d'un article, en document.
 *
 * À gauche, l'article dans l'ordre où il sera lu — titre, introduction,
 * sections, blocs complémentaires —, avec un aperçu rendu par les composants
 * mêmes de la page publique. À droite, les réglages.
 *
 * Le panneau passe sous le document quand la place manque, par le seul jeu
 * de flex-wrap : les styles du site sont en ligne, sans media queries.
 */

export type Draft = Omit<Article, "views" | "likes"> & { auteur_id: string | null };

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
    cover_focus: "50% 50%",
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
    auteur_id: null,
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
const bloc: React.CSSProperties = { background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 3px 16px rgba(60,40,30,.06)" };
const h2: React.CSSProperties = { margin: "0 0 14px", fontSize: 16, fontWeight: 700, color: "#003850" };
const legende: React.CSSProperties = { margin: "6px 0 0", fontSize: 11.5, color: "rgba(51,51,52,.5)" };

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

/** Un bloc complémentaire, replié par défaut, qui dit où il apparaît. */
function BlocDetails({
  titre,
  rempli,
  ou,
  children,
}: {
  titre: string;
  rempli: boolean;
  ou: string;
  children: React.ReactNode;
}) {
  return (
    <details>
      <summary style={{ cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#003850", padding: "4px 0" }}>
        {titre}
        {rempli && <span style={{ fontWeight: 600, color: "#04A49B" }}> · rempli</span>}
      </summary>
      <p style={legende}>{ou}</p>
      <div style={{ display: "grid", gap: 12, marginTop: 10 }}>{children}</div>
    </details>
  );
}

export default function ArticleEditor({
  draft,
  onChange,
  estSuperAdmin,
  comptes,
}: {
  draft: Draft;
  /**
   * Reçoit une fonction de mise à jour, jamais un brouillon tout fait : deux
   * modifications déclenchées dans le même instant — l'image déposée, puis son
   * point focal remis au centre — doivent s'appliquer l'une après l'autre.
   * Avec un brouillon recopié, la seconde écrasait la première et la nouvelle
   * couverture n'était jamais enregistrée.
   */
  onChange: (maj: (d: Draft) => Draft) => void;
  /** Les non-super-admins ne pilotent ni l’auteur, ni la date, ni le statut, ni la une, ni le propriétaire. */
  estSuperAdmin: boolean;
  /** Les comptes pouvant devenir propriétaire d’un article, fournis par ArticleAdmin. */
  comptes: { user_id: string; nom: string }[];
}) {
  const [onglet, setOnglet] = useState<"ecrire" | "apercu">("ecrire");
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => onChange((d) => ({ ...d, [k]: v }));

  // Un non-gérant choisit entre Brouillon et À relire ; si l'article est déjà
  // programmé ou publié, l'option courante reste visible mais désactivée —
  // il ne peut ni y rester par erreur de menu, ni la retirer lui-même.
  const statutsVisibles: { value: string; label: string; disabled: boolean }[] = estSuperAdmin
    ? STATUTS.map((s) => ({ ...s, disabled: false }))
    : STATUTS.filter((s) => s.value === "brouillon" || s.value === "relecture" || s.value === draft.status).map(
        (s) => ({ ...s, disabled: s.value === "programme" || s.value === "publie" }),
      );

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
      <div style={{ flex: "999 1 480px", minWidth: 0 }}>
        <div style={bloc}>
          <div style={{ display: "flex", gap: 4, marginBottom: 16, borderBottom: "1px solid rgba(0,56,80,.1)" }}>
            {(["ecrire", "apercu"] as const).map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setOnglet(o)}
                style={{
                  padding: "9px 16px",
                  border: "none",
                  borderBottom: `2px solid ${onglet === o ? "#04A49B" : "transparent"}`,
                  background: "transparent",
                  font: "inherit",
                  fontSize: 14,
                  fontWeight: 700,
                  color: onglet === o ? "#003850" : "rgba(51,51,52,.5)",
                  cursor: "pointer",
                }}
              >
                {o === "ecrire" ? "Écrire" : "Aperçu"}
              </button>
            ))}
          </div>

          {onglet === "ecrire" ? (
            <div style={{ display: "grid", gap: 22 }}>
              <div>
                <input
                  id="f-title"
                  aria-label="Titre"
                  placeholder="Le titre de l'article"
                  style={{ width: "100%", fontSize: 26, fontWeight: 700, border: "none", background: "transparent", padding: 0, font: "inherit", color: "#003850" }}
                  value={draft.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    // Le slug suit le titre tant que l’article n’est pas publié :
                    // changer l’URL d’un article en ligne casserait les liens.
                    onChange((d) => ({ ...d, title, slug: d.status === "publie" ? d.slug : slugify(title) }));
                  }}
                />
                <p style={{ margin: "4px 0 6px", fontSize: 12, color: "rgba(51,51,52,.5)" }}>
                  /actualites/{draft.slug || "…"}
                  {draft.status === "publie" && " — figé tant que l’article est publié"}
                </p>
                <input
                  id="f-slug"
                  aria-label="Adresse (slug)"
                  style={{ ...champ, fontSize: 12.5, padding: "6px 10px" }}
                  value={draft.slug}
                  onChange={(e) => set("slug", slugify(e.target.value))}
                />
              </div>

              <div>
                <label style={label} htmlFor="f-chapo">Introduction</label>
                <textarea id="f-chapo" rows={3} style={champ} value={draft.chapo} onChange={(e) => set("chapo", e.target.value)} />
                <p style={legende}>Deux ou trois phrases. C&apos;est ce qu&apos;on lit sur la carte de l&apos;article et dans Google.</p>
              </div>

              <div>
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
                      placeholder="Écrivez ici."
                      value={s.p.join("\n\n")}
                      onChange={(e) => {
                        const sections = [...draft.sections];
                        sections[i] = { ...s, p: e.target.value.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean) };
                        set("sections", sections);
                      }}
                    />
                    <p style={legende}>
                      <code>**gras**</code> · <code>*italique*</code> · <code>[texte](https://…)</code> · lignes en <code>- </code> pour une liste · une ligne vide pour un nouveau paragraphe
                    </p>
                  </div>
                ))}
                <Bouton onClick={() => set("sections", [...draft.sections, { h: "", p: [""] }])}>+ Ajouter une section</Bouton>
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                <BlocDetails titre="Un cas concret" rempli={Boolean(draft.cas)} ou="Un encadré beige après les sections.">
                  <div>
                    <label style={label} htmlFor="f-cas">Un cas concret</label>
                    <textarea id="f-cas" rows={3} style={champ} value={draft.cas ?? ""} onChange={(e) => set("cas", e.target.value)} />
                  </div>
                </BlocDetails>

                <BlocDetails
                  titre="Un exercice"
                  rempli={Boolean(draft.exercice?.title || draft.exercice?.body)}
                  ou="Un encadré bleu nuit, avec un titre et une description."
                >
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
                </BlocDetails>

                <BlocDetails
                  titre="Des chiffres clés"
                  rempli={draft.stats.length > 0}
                  ou="Des tuiles en tête de l'article. Une ligne par chiffre : « valeur | légende »."
                >
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
                </BlocDetails>

                <BlocDetails
                  titre="Des questions fréquentes"
                  rempli={draft.faq.length > 0}
                  ou="Une liste dépliante en fin d'article."
                >
                  {draft.faq.map((f, i) => (
                    <div key={i} style={{ display: "grid", gap: 8 }}>
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
                </BlocDetails>
              </div>
            </div>
          ) : (
            <div style={{ background: "#FDF8F4", borderRadius: 16, padding: "clamp(18px,3vw,32px)" }}>
              {draft.eyebrow ? (
                <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#04A49B" }}>
                  {draft.eyebrow}
                </p>
              ) : null}
              <h1 style={{ margin: "0 0 12px", fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, letterSpacing: "-.025em", color: "#003850" }}>
                {draft.title || "Le titre de l'article"}
              </h1>
              <p style={{ margin: "0 0 22px", fontSize: 17, lineHeight: 1.6, color: "rgba(51,51,52,.75)" }}>{draft.chapo}</p>
              {draft.cover ? (
                <div style={{ position: "relative", aspectRatio: "4 / 3", maxWidth: 560, borderRadius: 16, overflow: "hidden", marginBottom: 28 }}>
                  <Image src={draft.cover} alt="" fill sizes="560px" style={{ objectFit: "cover", objectPosition: draft.cover_focus }} />
                </div>
              ) : null}
              <ArticleCorps article={draft} />
              <p style={{ margin: "18px 0 0", fontSize: 12, color: "rgba(51,51,52,.5)" }}>
                L&apos;en-tête est simplifié ; le corps est rendu par les composants mêmes de la page publique.
              </p>
            </div>
          )}
        </div>
      </div>

      <aside style={{ flex: "1 1 260px", minWidth: 0, display: "grid", gap: 14 }}>
        <div style={bloc}>
          <h2 style={h2}>Classement</h2>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={label} htmlFor="f-cat">Catégorie</label>
              <select id="f-cat" style={champ} value={draft.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={label} htmlFor="f-eyebrow">Surtitre</label>
              <input id="f-eyebrow" style={champ} value={draft.eyebrow ?? ""} onChange={(e) => set("eyebrow", e.target.value)} />
              <p style={legende}>La petite ligne au-dessus du titre. Facultatif.</p>
            </div>
            <div>
              <label style={label} htmlFor="f-tags">Mots-clés (séparés par des virgules)</label>
              <input id="f-tags" style={champ} value={draft.tags.join(", ")}
                onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} />
            </div>
          </div>
        </div>

        <div style={bloc}>
          <h2 style={h2}>Couverture</h2>
          <ImageDrop
            valeur={draft.cover ?? ""}
            onChange={(url) => set("cover", url)}
            focus={draft.cover_focus ?? "50% 50%"}
            onFocusChange={(f) => set("cover_focus", f)}
          />
        </div>

        <div style={bloc}>
          <h2 style={h2}>Publication</h2>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={label} htmlFor="f-status">Statut</label>
              <select id="f-status" style={champ} value={draft.status} onChange={(e) => set("status", e.target.value)}>
                {statutsVisibles.map((s) => <option key={s.value} value={s.value} disabled={s.disabled}>{s.label}</option>)}
              </select>
              {!estSuperAdmin && (
                <p style={legende}>
                  Passez l&apos;article en « À relire » quand il est prêt : Lucas et Jean-Baptiste le publient.
                </p>
              )}
            </div>
            {draft.status === "programme" && (
              <div>
                <label style={label} htmlFor="f-publishat">Mise en ligne le</label>
                <input
                  id="f-publishat"
                  type="datetime-local"
                  style={champ}
                  disabled={!estSuperAdmin}
                  value={draft.publish_at ? draft.publish_at.slice(0, 16) : ""}
                  onChange={(e) => set("publish_at", e.target.value ? new Date(e.target.value).toISOString() : null)}
                />
              </div>
            )}
            <div>
              <label style={label} htmlFor="f-author">Auteur</label>
              <select
                id="f-author"
                style={champ}
                disabled={!estSuperAdmin}
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
              <input id="f-date" type="date" style={champ} disabled={!estSuperAdmin} value={draft.date} onChange={(e) => set("date", e.target.value)} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600, color: "#003850", cursor: estSuperAdmin ? "pointer" : "default" }}>
              <input type="checkbox" disabled={!estSuperAdmin} checked={draft.featured} onChange={(e) => set("featured", e.target.checked)} style={{ width: 17, height: 17, accentColor: "#04A49B" }} />
              Mettre à la une
            </label>
            {estSuperAdmin && (
              <label style={{ display: "block" }}>
                <span style={label}>Propriétaire (qui peut modifier cet article)</span>
                <select
                  style={champ}
                  value={draft.auteur_id ?? ""}
                  onChange={(e) => set("auteur_id", e.target.value || null)}
                >
                  <option value="">— personne —</option>
                  {comptes.map((c) => (
                    <option key={c.user_id} value={c.user_id}>
                      {c.nom}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <p style={{ margin: 0, fontSize: 13, color: "rgba(51,51,52,.7)" }}>
              Temps de lecture estimé : {tempsDeLecture(draft)} min
            </p>
          </div>
        </div>

        <div style={bloc}>
          <h2 style={h2}>Référencement</h2>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={label} htmlFor="f-seot">Titre SEO</label>
              <input
                id="f-seot"
                maxLength={70}
                style={champ}
                placeholder={draft.title}
                value={draft.seo?.title ?? ""}
                onChange={(e) => set("seo", { ...draft.seo, title: e.target.value })}
              />
              <p style={legende}>{(draft.seo?.title || draft.title).length} / 70</p>
            </div>
            <div>
              <label style={label} htmlFor="f-seod">Description SEO</label>
              <textarea
                id="f-seod"
                maxLength={170}
                rows={2}
                style={champ}
                placeholder={draft.chapo}
                value={draft.seo?.desc ?? ""}
                onChange={(e) => set("seo", { ...draft.seo, desc: e.target.value })}
              />
              <p style={legende}>{(draft.seo?.desc || draft.chapo).length} / 170</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
