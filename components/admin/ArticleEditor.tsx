"use client";

import Image from "next/image";
import { useState } from "react";
import { tempsDeLecture } from "@/lib/lecture";
import { TEAM } from "@/lib/team";
import type { Article } from "@/lib/articles";
import ArticleCorps from "@/components/site/ArticleCorps";
import ImageDrop from "./ImageDrop";
import { Plus, Trash2 } from "lucide-react";
import { Badge, Bouton, Carte, Champ, Onglets, ongletId } from "./ui";

/**
 * L'éditeur d'un article, en document.
 *
 * À gauche, l'article dans l'ordre où il sera lu — titre, introduction,
 * sections, blocs complémentaires —, avec un aperçu rendu par les composants
 * mêmes de la page publique. À droite, les réglages.
 *
 * Le panneau passe sous le document quand la place manque, par le seul jeu
 * de flex-wrap.
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

const legende: React.CSSProperties = { margin: "6px 0 0", fontSize: 13, lineHeight: 1.5, color: "rgba(0,56,80,.72)" };

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
    <details className="ad-details">
      <summary>
        {titre}
        {rempli && <Badge ton="succes">rempli</Badge>}
      </summary>
      <p style={{ ...legende, margin: "0 0 4px" }}>{ou}</p>
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
  /** Les non-super-admins ne pilotent ni l’auteur, ni la date, ni la une, ni le propriétaire ; leur statut s’arrête à « À relire ». */
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
        <Carte>
          <Onglets
            label="Édition de l’article"
            panneauId="article-panneau"
            onglets={[
              { id: "ecrire", label: "Écrire" },
              { id: "apercu", label: "Aperçu" },
            ]}
            actif={onglet}
            onChange={setOnglet}
          />

          <div id="article-panneau" role="tabpanel" aria-labelledby={ongletId("article-panneau", onglet)}>
            {onglet === "ecrire" ? (
              <div style={{ display: "grid", gap: 22 }}>
                <div style={{ display: "grid", gap: 12 }}>
                  {/* Une zone de texte plutôt qu'un champ : un titre long revient
                      à la ligne au lieu d'être coupé. Les retours à la ligne
                      tapés ou collés deviennent des espaces. */}
                  <textarea
                    id="f-title"
                    aria-label="Titre"
                    placeholder="Le titre de l'article"
                    rows={2}
                    style={{ font: "inherit", width: "100%", fontSize: "clamp(22px, 5vw, 26px)", fontWeight: 700, lineHeight: 1.25, border: "none", background: "transparent", padding: 0, color: "#003850", resize: "none" }}
                    value={draft.title}
                    onChange={(e) => {
                      const title = e.target.value.replace(/\s*\n\s*/g, " ");
                      // Le slug suit le titre tant que l’article n’est pas publié :
                      // changer l’URL d’un article en ligne casserait les liens.
                      onChange((d) => ({ ...d, title, slug: d.status === "publie" ? d.slug : slugify(title) }));
                    }}
                  />
                  <Champ
                    id="f-slug"
                    label="Adresse de la page"
                    aide={
                      <span style={{ overflowWrap: "anywhere" }}>
                        /actualites/{draft.slug || "…"}
                        {draft.status === "publie" && " — figé tant que l’article est publié"}
                      </span>
                    }
                  >
                    <input value={draft.slug} onChange={(e) => set("slug", slugify(e.target.value))} />
                  </Champ>
                </div>

                <Champ
                  id="f-chapo"
                  label="Introduction"
                  aide="Deux ou trois phrases. C'est ce qu'on lit sur la carte de l'article et dans Google."
                >
                  <textarea rows={3} value={draft.chapo} onChange={(e) => set("chapo", e.target.value)} />
                </Champ>

                <div>
                  {draft.sections.map((s, i) => (
                    <div key={i} style={{ borderTop: i ? "1px solid rgba(0,56,80,.08)" : undefined, paddingTop: i ? 16 : 0, marginBottom: 16 }}>
                      <div className="ad-champ" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <input
                          aria-label={`Titre de la section ${i + 1}`}
                          style={{ flex: 1, minWidth: 0, fontWeight: 700 }}
                          placeholder="Titre de la section"
                          value={s.h}
                          onChange={(e) => {
                            const sections = [...draft.sections];
                            sections[i] = { ...s, h: e.target.value };
                            set("sections", sections);
                          }}
                        />
                        <Bouton
                          variante="secondaire"
                          taille="petite"
                          icone={Trash2}
                          aria-label={`Retirer la section ${i + 1}`}
                          onClick={() => set("sections", draft.sections.filter((_, j) => j !== i))}
                          style={{ flex: "none" }}
                        >
                          Retirer
                        </Bouton>
                      </div>
                      <div className="ad-champ">
                        <textarea
                          aria-label={`Paragraphes de la section ${i + 1}`}
                          rows={5}
                          placeholder="Écrivez ici."
                          value={s.p.join("\n\n")}
                          onChange={(e) => {
                            const sections = [...draft.sections];
                            sections[i] = { ...s, p: e.target.value.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean) };
                            set("sections", sections);
                          }}
                        />
                      </div>
                      <p style={legende}>
                        <code>**gras**</code> · <code>*italique*</code> · <code>[texte](https://…)</code> · lignes en <code>- </code> pour une liste · une ligne vide pour un nouveau paragraphe
                      </p>
                    </div>
                  ))}
                  <Bouton variante="secondaire" taille="petite" icone={Plus} onClick={() => set("sections", [...draft.sections, { h: "", p: [""] }])}>
                    Ajouter une section
                  </Bouton>
                </div>

                <div style={{ display: "grid", gap: 4 }}>
                  <BlocDetails titre="Un cas concret" rempli={Boolean(draft.cas)} ou="Un encadré beige après les sections.">
                    <Champ id="f-cas" label="Un cas concret">
                      <textarea rows={3} value={draft.cas ?? ""} onChange={(e) => set("cas", e.target.value)} />
                    </Champ>
                  </BlocDetails>

                  <BlocDetails
                    titre="Un exercice"
                    rempli={Boolean(draft.exercice?.title || draft.exercice?.body)}
                    ou="Un encadré bleu nuit, avec un titre et une description."
                  >
                    <Champ id="f-extitle" label="L'exercice — titre">
                      <input value={draft.exercice?.title ?? ""} onChange={(e) => set("exercice", { ...draft.exercice, title: e.target.value })} />
                    </Champ>
                    <Champ id="f-exbody" label="L'exercice — description">
                      <textarea rows={2} value={draft.exercice?.body ?? ""} onChange={(e) => set("exercice", { ...draft.exercice, body: e.target.value })} />
                    </Champ>
                  </BlocDetails>

                  <BlocDetails
                    titre="Des chiffres clés"
                    rempli={draft.stats.length > 0}
                    ou="Des tuiles en tête de l'article. Une ligne par chiffre : « valeur | légende »."
                  >
                    <Champ id="f-stats" label="Chiffres clés — une ligne par chiffre, « valeur | légende »">
                      <textarea
                        rows={3}
                        placeholder="1 sur 3 | récidive après une entorse mal rééduquée"
                        value={draft.stats.map((s) => `${s.value} | ${s.label}`).join("\n")}
                        onChange={(e) =>
                          set("stats", e.target.value.split("\n").map((l) => {
                            const [value, ...reste] = l.split("|");
                            return { value: value.trim(), label: reste.join("|").trim() };
                          }).filter((s) => s.value && s.label))
                        }
                      />
                    </Champ>
                  </BlocDetails>

                  <BlocDetails
                    titre="Des questions fréquentes"
                    rempli={draft.faq.length > 0}
                    ou="Une liste dépliante en fin d'article."
                  >
                    {draft.faq.map((f, i) => (
                      <div key={i} className="ad-champ" style={{ display: "grid", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <input aria-label={`Question ${i + 1}`} style={{ flex: 1, minWidth: 0, fontWeight: 600 }} placeholder="Question" value={f.q}
                            onChange={(e) => { const faq = [...draft.faq]; faq[i] = { ...f, q: e.target.value }; set("faq", faq); }} />
                          <Bouton
                            variante="secondaire"
                            taille="petite"
                            icone={Trash2}
                            aria-label={`Retirer la question ${i + 1}`}
                            onClick={() => set("faq", draft.faq.filter((_, j) => j !== i))}
                            style={{ flex: "none" }}
                          >
                            Retirer
                          </Bouton>
                        </div>
                        <textarea aria-label={`Réponse ${i + 1}`} rows={3} placeholder="Réponse" value={f.a}
                          onChange={(e) => { const faq = [...draft.faq]; faq[i] = { ...f, a: e.target.value }; set("faq", faq); }} />
                      </div>
                    ))}
                    <div>
                      <Bouton variante="secondaire" taille="petite" icone={Plus} onClick={() => set("faq", [...draft.faq, { q: "", a: "" }])}>
                        Ajouter une question
                      </Bouton>
                    </div>
                  </BlocDetails>
                </div>
              </div>
            ) : (
              <div style={{ background: "#FDF8F4", borderRadius: 16, padding: "clamp(16px,3vw,32px)", overflowWrap: "anywhere" }}>
                {draft.eyebrow ? (
                  <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#0A556B" }}>
                    {draft.eyebrow}
                  </p>
                ) : null}
                {/* Aperçu du titre de la page publique : un niveau 2 ici, le h1 est celui du back-office. */}
                <p role="heading" aria-level={2} style={{ margin: "0 0 12px", fontSize: "clamp(26px,4vw,40px)", lineHeight: 1.15, fontWeight: 700, letterSpacing: "-.025em", color: "#003850" }}>
                  {draft.title || "Le titre de l'article"}
                </p>
                <p style={{ margin: "0 0 22px", fontSize: 17, lineHeight: 1.6, color: "rgba(51,51,52,.85)" }}>{draft.chapo}</p>
                {draft.cover ? (
                  <div style={{ position: "relative", aspectRatio: "4 / 3", maxWidth: 560, borderRadius: 16, overflow: "hidden", marginBottom: 28 }}>
                    <Image src={draft.cover} alt="" fill sizes="(max-width: 700px) 90vw, 560px" style={{ objectFit: "cover", objectPosition: draft.cover_focus }} />
                  </div>
                ) : null}
                <ArticleCorps article={draft} />
                <p style={{ margin: "18px 0 0", fontSize: 13, color: "rgba(0,56,80,.72)" }}>
                  L&apos;en-tête est simplifié ; le corps est rendu par les composants mêmes de la page publique.
                </p>
              </div>
            )}
          </div>
        </Carte>
      </div>

      <aside style={{ flex: "1 1 260px", minWidth: 0, display: "grid", gap: 16 }}>
        <Carte titre="Classement">
          <div style={{ display: "grid", gap: 14 }}>
            <Champ id="f-cat" label="Catégorie">
              <select value={draft.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Champ>
            <Champ id="f-eyebrow" label="Surtitre" aide="La petite ligne au-dessus du titre. Facultatif.">
              <input value={draft.eyebrow ?? ""} onChange={(e) => set("eyebrow", e.target.value)} />
            </Champ>
            <Champ id="f-tags" label="Mots-clés (séparés par des virgules)">
              <input value={draft.tags.join(", ")}
                onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} />
            </Champ>
          </div>
        </Carte>

        <Carte titre="Couverture">
          <ImageDrop
            valeur={draft.cover ?? ""}
            onChange={(url) => set("cover", url)}
            focus={draft.cover_focus ?? "50% 50%"}
            onFocusChange={(f) => set("cover_focus", f)}
          />
        </Carte>

        <Carte titre="Publication">
          <div style={{ display: "grid", gap: 14 }}>
            <Champ
              id="f-status"
              label="Statut"
              aide={estSuperAdmin ? undefined : "Passez l'article en « À relire » quand il est prêt : Lucas et Jean-Baptiste le publient."}
            >
              <select value={draft.status} onChange={(e) => set("status", e.target.value)}>
                {statutsVisibles.map((s) => <option key={s.value} value={s.value} disabled={s.disabled}>{s.label}</option>)}
              </select>
            </Champ>
            {draft.status === "programme" && (
              <Champ id="f-publishat" label="Mise en ligne le">
                <input
                  type="datetime-local"
                  disabled={!estSuperAdmin}
                  value={draft.publish_at ? draft.publish_at.slice(0, 16) : ""}
                  onChange={(e) => set("publish_at", e.target.value ? new Date(e.target.value).toISOString() : null)}
                />
              </Champ>
            )}
            <Champ id="f-author" label="Auteur">
              <select
                disabled={!estSuperAdmin}
                value={draft.author.name}
                onChange={(e) => {
                  const p = TEAM.find((t) => t.name === e.target.value);
                  if (p) set("author", { name: p.name, job: p.role, photo: p.photo, fiche: `/equipe/${p.slug}` });
                }}
              >
                {TEAM.map((t) => <option key={t.slug}>{t.name}</option>)}
              </select>
            </Champ>
            <Champ id="f-date" label="Date">
              <input type="date" disabled={!estSuperAdmin} value={draft.date} onChange={(e) => set("date", e.target.value)} />
            </Champ>
            <label className="ad-case" style={{ fontWeight: 600 }}>
              <input type="checkbox" disabled={!estSuperAdmin} checked={draft.featured} onChange={(e) => set("featured", e.target.checked)} />
              Mettre à la une
            </label>
            {estSuperAdmin && (
              <Champ id="f-proprietaire" label="Propriétaire (qui peut modifier cet article)">
                <select value={draft.auteur_id ?? ""} onChange={(e) => set("auteur_id", e.target.value || null)}>
                  <option value="">— personne —</option>
                  {comptes.map((c) => (
                    <option key={c.user_id} value={c.user_id}>
                      {c.nom}
                    </option>
                  ))}
                </select>
              </Champ>
            )}
            <p style={{ margin: 0, fontSize: 14, color: "rgba(0,56,80,.78)" }}>
              Temps de lecture estimé : {tempsDeLecture(draft)} min
            </p>
          </div>
        </Carte>

        <Carte titre="Référencement">
          <div style={{ display: "grid", gap: 14 }}>
            <Champ id="f-seot" label="Titre SEO" aide={`${(draft.seo?.title || draft.title).length} / 70`}>
              <input
                maxLength={70}
                placeholder={draft.title}
                value={draft.seo?.title ?? ""}
                onChange={(e) => set("seo", { ...draft.seo, title: e.target.value })}
              />
            </Champ>
            <Champ id="f-seod" label="Description SEO" aide={`${(draft.seo?.desc || draft.chapo).length} / 170`}>
              <textarea
                maxLength={170}
                rows={2}
                placeholder={draft.chapo}
                value={draft.seo?.desc ?? ""}
                onChange={(e) => set("seo", { ...draft.seo, desc: e.target.value })}
              />
            </Champ>
          </div>
        </Carte>
      </aside>
    </div>
  );
}
