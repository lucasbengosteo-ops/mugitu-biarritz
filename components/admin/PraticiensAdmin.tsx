"use client";

import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import ImageDrop from "./ImageDrop";
import { TEAM } from "@/lib/team";
import { getFiche } from "@/lib/fiches";
import type { PractitionerOverride } from "@/lib/practitioners";
import { FICHE_DATA } from "@/lib/fiches-data";
import { useAccesCourant } from "@/lib/admin/acces";
import { ExternalLink } from "lucide-react";
import { Badge, Bouton, Carte, Champ, Message, Page } from "./ui";

/**
 * Retouches des pages praticien.
 *
 * Principe affiché à l'écran : chaque champ laissé vide garde la valeur du
 * code. On ne recopie donc pas les 13 fiches en base — on ne stocke que ce
 * qui diffère, et le site continue de fonctionner si la table est vide.
 *
 * Le corps des fiches (présentation, parcours, formations) reste dans le
 * code : c'est du HTML issu du bundle de design, il ne se saisit pas dans un
 * formulaire. Ce qui est éditable ici, c'est l'identité de la page.
 */

type Brouillon = PractitionerOverride & {
  chipsTexte: string;
  tagsTexte: string;
  specialitesTexte: string;
  languesTexte: string;
  formationsTexte: string;
  tarifsTexte: string;
};

/** `"a · b"` → ["a","b"], null si vide : NULL veut dire « garder le code ». */
function liste(v: string, sep: string): string[] | null {
  const out = v.split(sep).map((x) => x.trim()).filter(Boolean);
  return out.length ? out : null;
}

/** Une ligne par entrée, colonnes séparées par `|`. */
function lignes<T>(v: string, n: number, fab: (c: string[]) => T): T[] | null {
  const out = v.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => fab(colonnes(l, n)));
  return out.length ? out : null;
}

/** `a | b | c` → ["a","b","c"], en tolérant les colonnes absentes. */
function colonnes(ligne: string, n: number): string[] {
  const p = ligne.split("|").map((x) => x.trim());
  return Array.from({ length: n }, (_, i) => p[i] ?? "");
}

/** Un code de saisie dans un libellé (« année | intitulé | groupe »). */
const CODE: React.CSSProperties = { fontSize: 13, fontWeight: 500 };

/** Les zones de saisie en colonnes séparées par « | » : une police à chasse fixe. */
const MONO: React.CSSProperties = { resize: "vertical", fontFamily: "ui-monospace, monospace", fontSize: 14 };

function vide(o: PractitionerOverride): boolean {
  return (
    !o.name && !o.role && !o.badge && !o.quote && !o.photo && !o.photo_focus &&
    !o.booking && !o.bio && !(o.tags?.length) && !(o.chips?.length) &&
    !o.contact && !(o.specialites?.length) && !(o.langues?.length) &&
    !(o.formations?.length) && !(o.tarifs?.length)
  );
}

function brouillonPour(slug: string, o?: PractitionerOverride): Brouillon {
  const base: PractitionerOverride = o ?? {
    slug, name: null, role: null, badge: null, quote: null, photo: null,
    photo_focus: null, booking: null, bio: null, tags: null, chips: null,
    contact: null, specialites: null, langues: null, formations: null,
    tarifs: null, tarifs_titre: null,
  };
  // Les listes non encore retouchées sont pré-remplies avec ce que la fiche
  // affiche aujourd'hui : on modifie un contenu existant, on ne le ressaisit
  // pas. `d` vient du fichier généré depuis le HTML des fiches.
  const d = FICHE_DATA[slug];
  const contact = base.contact ?? d?.contact ?? {};
  const formations = base.formations ?? d?.formations ?? [];
  const tarifs = base.tarifs ?? d?.tarifs ?? [];
  return {
    ...base,
    contact,
    tagsTexte: (base.tags ?? []).join(", "),
    chipsTexte: (base.chips ?? []).map((c) => `${c.icon} | ${c.text}`).join("\n"),
    specialitesTexte: (base.specialites ?? d?.specialites ?? []).join(" · "),
    languesTexte: (base.langues ?? d?.langues ?? []).join(" · "),
    formationsTexte: formations.map((f) => [f.annee, f.intitule, f.groupe].join(" | ")).join("\n"),
    tarifsTexte: tarifs.map((t) => [t.titre, t.prix, t.mention, t.texte, t.lien].join(" | ")).join("\n"),
  };
}


/**
 * Champ « laisser vide = valeur du code », avec la valeur du code en indice.
 * Défini au niveau du module et non dans le rendu : un composant recréé à
 * chaque frappe est démonté puis remonté, et le champ perd le focus.
 */
function Retouche({
  id, label, valeur, valeurCode, onChange, aire = false,
}: {
  id: string;
  label: string;
  valeur: string;
  valeurCode?: string;
  onChange: (v: string) => void;
  aire?: boolean;
}) {
  return (
    <Champ id={id} label={label} aide={valeurCode ? <>Vide → <span style={{ color: "#003850" }}>{valeurCode}</span></> : undefined}>
      {aire ? (
        <textarea rows={3} style={{ resize: "vertical" }} value={valeur} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input value={valeur} onChange={(e) => onChange(e.target.value)} />
      )}
    </Champ>
  );
}

export default function PraticiensAdmin() {
  const acces = useAccesCourant();
  const [overrides, setOverrides] = useState<PractitionerOverride[]>([]);
  const [slug, setSlug] = useState<string>(TEAM[0]?.slug ?? "");
  const [draft, setDraft] = useState<Brouillon | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [occupe, setOccupe] = useState(false);

  const notifier = (m: string) => {
    setMessage(m);
    window.setTimeout(() => setMessage(null), 3500);
  };

  const charger = useCallback(async () => {
    const sb = supabaseBrowser();
    const { data: session } = await sb.auth.getSession();
    if (!session.session) return;
    const { data, error } = await sb.from("practitioner_overrides").select("*");
    if (error) notifier(`Lecture impossible : ${error.message}`);
    const liste = (data ?? []) as PractitionerOverride[];
    setOverrides(liste);
    setDraft((d) => d ?? brouillonPour(TEAM[0]?.slug ?? "", liste.find((o) => o.slug === TEAM[0]?.slug)));
  }, []);

  useEffect(() => {
    const { data } = supabaseBrowser().auth.onAuthStateChange(() => void charger());
    const initial = window.setTimeout(() => void charger(), 0);
    return () => {
      data.subscription.unsubscribe();
      window.clearTimeout(initial);
    };
  }, [charger]);

  const choisir = (s: string) => {
    setSlug(s);
    setDraft(brouillonPour(s, overrides.find((o) => o.slug === s)));
  };

  const enregistrer = async () => {
    if (!draft) return;
    const chips = draft.chipsTexte
      .split("\n")
      .map((l) => l.split("|").map((x) => x.trim()))
      .filter((p) => p.length === 2 && p[0] && p[1])
      .map(([icon, text]) => ({ icon, text }));
    const tags = draft.tagsTexte.split(",").map((t) => t.trim()).filter(Boolean);
    const payload: PractitionerOverride = {
      slug: draft.slug,
      name: draft.name || null,
      role: draft.role || null,
      badge: draft.badge || null,
      quote: draft.quote || null,
      photo: draft.photo || null,
      photo_focus: draft.photo_focus || null,
      booking: draft.booking || null,
      bio: draft.bio || null,
      tags: tags.length ? tags : null,
      chips: chips.length ? chips : null,
      contact: Object.keys(draft.contact ?? {}).length ? draft.contact : null,
      specialites: liste(draft.specialitesTexte, "·"),
      langues: liste(draft.languesTexte, "·"),
      formations: lignes(draft.formationsTexte, 3, ([annee, intitule, groupe]) => ({ annee, intitule, groupe })),
      tarifs: lignes(draft.tarifsTexte, 5, ([titre, prix, mention, texte, lien]) => ({ titre, prix, mention, texte, lien })),
      tarifs_titre: draft.tarifs_titre || null,
    };
    setOccupe(true);
    // Tout vider revient à retirer la retouche : on supprime la ligne plutôt
    // que de laisser une coquille qui ferait croire à une personnalisation.
    const sb = supabaseBrowser();
    const { error } = vide(payload)
      ? await sb.from("practitioner_overrides").delete().eq("slug", payload.slug)
      : await sb.from("practitioner_overrides").upsert(payload, { onConflict: "slug" });
    setOccupe(false);
    if (error) {
      notifier(`Enregistrement refusé : ${error.message}`);
      return;
    }
    notifier(vide(payload) ? "Retouches retirées — la fiche reprend les valeurs du code." : "Retouches enregistrées.");
    void charger();
  };

  const maj = <K extends keyof Brouillon>(k: K, v: Brouillon[K]) =>
    setDraft((d) => (d ? { ...d, [k]: v } : d));

  const base = TEAM.find((p) => p.slug === slug);
  const fiche = getFiche(slug);
  const retouches = new Set(overrides.map((o) => o.slug));
  const fd = FICHE_DATA[slug];

  if (!acces.estSuperAdmin) {
    return (
      <Page titre="Pages praticien">
        <div style={{ maxWidth: 560 }}>
          <Message ton="info">
            <strong>Rubrique réservée.</strong> Les fiches praticien sont gérées par Lucas et Jean-Baptiste. Pour une
            correction sur votre fiche, écrivez-leur.
          </Message>
        </div>
      </Page>
    );
  }

  return (
    <Page
      titre="Pages praticien"
      intro="Chaque champ laissé vide garde la valeur du site. On ne saisit ici que ce qu’on veut changer."
    >
      <div className="ad-annonce">
        {message ? (
          <div>
            <Message ton="info">{message}</Message>
          </div>
        ) : null}
      </div>

      <div className="ad-md" data-detail="oui" style={{ "--ad-md-liste": "280px" } as React.CSSProperties}>
        {/* Sur ordinateur, la liste ; sur téléphone, un menu déroulant en tête de fiche. */}
        <Carte className="ad-md-collante ad-masque-tel" style={{ padding: 10 }}>
          <nav aria-label="Praticiens">
            {TEAM.map((p) => (
              <button
                key={p.slug}
                type="button"
                className="ad-choix"
                aria-current={slug === p.slug ? "true" : undefined}
                onClick={() => choisir(p.slug)}
                style={{ marginBottom: 2 }}
              >
                <span style={{ flex: 1, minWidth: 0 }}>{p.name}</span>
                {retouches.has(p.slug) && <Badge ton="succes">Retouché</Badge>}
              </button>
            ))}
          </nav>
        </Carte>

        <Carte>
          <div className="ad-masque-ordi" style={{ marginBottom: 20 }}>
            <Champ id="p-choix" label="Praticien">
              <select value={slug} onChange={(e) => choisir(e.target.value)}>
                {TEAM.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                    {retouches.has(p.slug) ? " · retouché" : ""}
                  </option>
                ))}
              </select>
            </Champ>
          </div>

          {!draft || !base ? (
            <p style={{ margin: 0, fontSize: 15, color: "rgba(0,56,80,.78)" }}>Choisissez un praticien.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, color: "#003850" }}>Photo</p>
                <ImageDrop
                  dossier="praticiens"
                  valeur={draft.photo || base.photo}
                  onChange={(url) => maj("photo", url === base.photo ? null : url)}
                  focus={draft.photo_focus || base.objectPosition || "50% 50%"}
                  onFocusChange={(f) => maj("photo_focus", f)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(240px,100%),1fr))", gap: 16 }}>
                <Retouche id="p-name" label="Nom affiché" valeur={draft.name ?? ""} valeurCode={base.name} onChange={(v) => maj("name", v || null)} />
                <Retouche id="p-role" label="Intitulé court (carte d’équipe)" valeur={draft.role ?? ""} valeurCode={base.role} onChange={(v) => maj("role", v || null)} />
                <Retouche id="p-badge" label="Intitulé long (fiche)" valeur={draft.badge ?? ""} valeurCode={fiche?.badge} onChange={(v) => maj("badge", v || null)} />
                <Retouche id="p-booking" label="Lien de réservation" valeur={draft.booking ?? ""} valeurCode={base.booking} onChange={(v) => maj("booking", v || null)} />
              </div>

              <Retouche id="p-quote" label="Citation (guillemets compris)" valeur={draft.quote ?? ""} valeurCode={fiche?.quote.replace(/&nbsp;/g, " ")} onChange={(v) => maj("quote", v || null)} />
              <Retouche id="p-bio" label="Résumé affiché au survol de la carte" valeur={draft.bio ?? ""} valeurCode={base.bio} onChange={(v) => maj("bio", v || null)} aire />

              <Champ
                id="p-tags"
                label="Mots-clés (séparés par des virgules)"
                aide={<>Vide → <span style={{ color: "#003850" }}>{base.tags.join(", ")}</span></>}
              >
                <input value={draft.tagsTexte} onChange={(e) => maj("tagsTexte", e.target.value)} />
              </Champ>

              {/* ── Coordonnées ── */}
              <fieldset style={{ margin: 0, minWidth: 0, border: "1px solid rgba(0,56,80,.14)", borderRadius: 12, padding: 14 }}>
                <legend style={{ padding: "0 6px", fontSize: 14, fontWeight: 700, color: "#003850" }}>Coordonnées</legend>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(220px,100%),1fr))", gap: 14 }}>
                  {([["tel", "Téléphone"], ["email", "E-mail"], ["instagram", "Instagram (URL)"], ["linkedin", "LinkedIn (URL)"], ["site", "Site web"]] as const).map(([cle, lab]) => (
                    <Champ key={cle} id={`c-${cle}`} label={lab}>
                      <input
                        value={draft.contact?.[cle] ?? ""}
                        onChange={(e) => maj("contact", { ...(draft.contact ?? {}), [cle]: e.target.value || undefined })}
                      />
                    </Champ>
                  ))}
                </div>
              </fieldset>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(240px,100%),1fr))", gap: 16 }}>
                <Champ id="p-langues" label={<>Langues parlées — séparées par «&nbsp;·&nbsp;»</>}>
                  <input value={draft.languesTexte} onChange={(e) => maj("languesTexte", e.target.value)} />
                </Champ>
                <Champ id="p-spec" label={<>Spécialités — séparées par «&nbsp;·&nbsp;»</>}>
                  <input value={draft.specialitesTexte} onChange={(e) => maj("specialitesTexte", e.target.value)} />
                </Champ>
              </div>

              {/* ── Parcours ── */}
              {fd && !fd.formationsComplet ? (
                <div>
                  <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, color: "#003850" }}>Diplômes &amp; formations</p>
                  <Message ton="info">
                    Section verrouillée : elle contient un bloc que l’éditeur ne sait pas
                    encore représenter (liste de pastilles, publications, carte partenaire…).
                    L’ouvrir à l’édition ferait disparaître ce bloc à l’enregistrement.
                  </Message>
                </div>
              ) : (
                <Champ id="p-form" label={<>Diplômes &amp; formations — une par ligne, <code style={CODE}>année | intitulé | groupe</code></>}>
                  <textarea rows={6} style={MONO} value={draft.formationsTexte} onChange={(e) => maj("formationsTexte", e.target.value)} />
                </Champ>
              )}

              {/* ── Tarifs ── */}
              {fd && fd.tarifs.length > 0 && !fd.tarifsComplet ? (
                <div>
                  <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, color: "#003850" }}>Tarifs</p>
                  <Message ton="info">Section verrouillée : elle contient un bloc non représentable par l’éditeur.</Message>
                </div>
              ) : (
                <>
                  <Champ id="p-tarifs-titre" label="Titre de la section tarifs">
                    <input
                      placeholder={fd?.tarifsTitre || "Tarifs"}
                      value={draft.tarifs_titre ?? ""}
                      onChange={(e) => maj("tarifs_titre", e.target.value || null)}
                    />
                  </Champ>
                  <Champ id="p-tarifs" label={<>Tarifs — une prestation par ligne, <code style={CODE}>titre | prix | mention | description | lien</code></>}>
                    <textarea rows={5} style={MONO} value={draft.tarifsTexte} onChange={(e) => maj("tarifsTexte", e.target.value)} />
                  </Champ>
                </>
              )}

              <Champ
                id="p-chips"
                label={<>Puces de la fiche — une par ligne, <code style={CODE}>icône | texte</code></>}
                aide={fiche?.chips?.length ? <>Vide → <span style={{ color: "#003850" }}>{fiche.chips.map((c) => c.text).join(" · ")}</span></> : undefined}
              >
                <textarea rows={3} style={MONO}
                  value={draft.chipsTexte} onChange={(e) => maj("chipsTexte", e.target.value)}
                  placeholder={"map-pin | Biarritz · Ahetze\nlanguages | Français · anglais"} />
              </Champ>

              <div className="ad-barre-actions" style={{ background: "#fff" }}>
                <Bouton enCours={occupe} onClick={() => void enregistrer()}>
                  Enregistrer
                </Bouton>
                <a href={`/equipe/${slug}`} target="_blank" rel="noopener noreferrer" className="ad-bouton ad-bouton--secondaire">
                  Voir la fiche
                  <ExternalLink aria-hidden="true" size={18} />
                  <span className="sr-only">(nouvel onglet)</span>
                </a>
                {retouches.has(slug) && (
                  <Bouton variante="danger" className="ad-pousse-droite" onClick={() => setDraft(brouillonPour(slug))}>
                    Tout vider
                  </Bouton>
                )}
              </div>
            </div>
          )}
        </Carte>
      </div>
    </Page>
  );
}
