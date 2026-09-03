"use client";

import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import AdminLogin from "./AdminLogin";
import AdminNav from "./AdminNav";
import ImageDrop from "./ImageDrop";
import { TEAM } from "@/lib/team";
import { getFiche } from "@/lib/fiches";
import type { PractitionerOverride } from "@/lib/practitioners";

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

type Etat = "chargement" | "deconnecte" | "pret";

type Brouillon = PractitionerOverride & { chipsTexte: string; tagsTexte: string };

const CHAMP: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(0,56,80,.18)",
  font: "inherit",
  fontSize: 14,
  color: "#003850",
  background: "#fff",
};

const LABEL: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "rgba(51,51,52,.6)",
  marginBottom: 6,
};

function vide(o: PractitionerOverride): boolean {
  return (
    !o.name && !o.role && !o.badge && !o.quote && !o.photo && !o.photo_focus &&
    !o.booking && !o.bio && !(o.tags?.length) && !(o.chips?.length)
  );
}

function brouillonPour(slug: string, o?: PractitionerOverride): Brouillon {
  const base: PractitionerOverride = o ?? {
    slug, name: null, role: null, badge: null, quote: null, photo: null,
    photo_focus: null, booking: null, bio: null, tags: null, chips: null,
  };
  return {
    ...base,
    tagsTexte: (base.tags ?? []).join(", "),
    chipsTexte: (base.chips ?? []).map((c) => `${c.icon} | ${c.text}`).join("\n"),
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
    <div>
      <label style={LABEL} htmlFor={id}>{label}</label>
      {aire ? (
        <textarea id={id} rows={3} style={{ ...CHAMP, resize: "vertical" }} value={valeur} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} style={CHAMP} value={valeur} onChange={(e) => onChange(e.target.value)} />
      )}
      {valeurCode && (
        <p style={{ margin: "5px 0 0", fontSize: 12, color: "rgba(51,51,52,.5)" }}>
          Vide → <span style={{ color: "rgba(51,51,52,.75)" }}>{valeurCode}</span>
        </p>
      )}
    </div>
  );
}

export default function PraticiensAdmin() {
  const [etat, setEtat] = useState<Etat>("chargement");
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
    if (!session.session) {
      setEtat("deconnecte");
      return;
    }
    const { data, error } = await sb.from("practitioner_overrides").select("*");
    if (error) notifier(`Lecture impossible : ${error.message}`);
    const liste = (data ?? []) as PractitionerOverride[];
    setOverrides(liste);
    setDraft((d) => d ?? brouillonPour(TEAM[0]?.slug ?? "", liste.find((o) => o.slug === TEAM[0]?.slug)));
    setEtat("pret");
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

  if (etat === "chargement") {
    return <p style={{ padding: 40, fontSize: 15, color: "rgba(51,51,52,.6)" }}>Chargement…</p>;
  }
  if (etat === "deconnecte") {
    return <AdminLogin titre="Pages praticien" onSignedIn={() => void charger()} />;
  }

  const maj = <K extends keyof Brouillon>(k: K, v: Brouillon[K]) =>
    setDraft((d) => (d ? { ...d, [k]: v } : d));

  const base = TEAM.find((p) => p.slug === slug);
  const fiche = getFiche(slug);
  const retouches = new Set(overrides.map((o) => o.slug));

  return (
    <div style={{ minHeight: "100vh", background: "#FDF8F4" }}>
      <header style={{ background: "#003850", color: "#fff", padding: "18px clamp(16px,4vw,32px)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#04A49B", fontWeight: 700 }}>Back-office</p>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Pages praticien</p>
        </div>
        <AdminNav courant="/admin/praticiens" />
        <div style={{ marginLeft: "auto" }}>
          <button type="button" onClick={() => void supabaseBrowser().auth.signOut()}
            style={{ padding: "9px 18px", borderRadius: 999, border: "1px solid rgba(255,255,255,.3)", background: "transparent", color: "#fff", font: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Se déconnecter
          </button>
        </div>
      </header>

      <p style={{ margin: 0, padding: "10px clamp(16px,4vw,32px)", background: "rgba(4,164,155,.1)", color: "#036b66", fontSize: 13.5, fontWeight: 600 }}>
        Chaque champ laissé vide garde la valeur du site. On ne saisit ici que ce qu’on veut changer.
      </p>

      {message && (
        <p role="status" style={{ margin: 0, padding: "12px clamp(16px,4vw,32px)", background: "rgba(4,164,155,.12)", color: "#036b66", fontSize: 14, fontWeight: 600 }}>
          {message}
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,280px) minmax(0,1fr)", gap: 20, padding: "clamp(16px,3vw,28px)", alignItems: "start" }}>
        <aside style={{ background: "#fff", borderRadius: 16, padding: 12, boxShadow: "0 3px 16px rgba(60,40,30,.06)", position: "sticky", top: 16 }}>
          {TEAM.map((p) => (
            <button key={p.slug} type="button" onClick={() => choisir(p.slug)}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                padding: "9px 10px", marginBottom: 3, borderRadius: 10,
                border: "1px solid", borderColor: slug === p.slug ? "#04A49B" : "transparent",
                background: slug === p.slug ? "rgba(4,164,155,.07)" : "transparent",
                font: "inherit", cursor: "pointer",
              }}>
              <span style={{ fontSize: 13.5, color: "#003850", flex: 1 }}>{p.name}</span>
              {retouches.has(p.slug) && (
                <span title="Retouché" aria-label="Retouché" style={{ width: 7, height: 7, borderRadius: "50%", background: "#04A49B" }} />
              )}
            </button>
          ))}
        </aside>

        <section style={{ background: "#fff", borderRadius: 16, padding: "clamp(16px,2.5vw,26px)", boxShadow: "0 3px 16px rgba(60,40,30,.06)" }}>
          {!draft || !base ? (
            <p style={{ margin: 0, fontSize: 15, color: "rgba(51,51,52,.6)" }}>Choisissez un praticien.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <p style={LABEL}>Photo</p>
                <ImageDrop
                  dossier="praticiens"
                  valeur={draft.photo || base.photo}
                  onChange={(url) => maj("photo", url === base.photo ? null : url)}
                  focus={draft.photo_focus || base.objectPosition || "50% 50%"}
                  onFocusChange={(f) => maj("photo_focus", f)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
                <Retouche id="p-name" label="Nom affiché" valeur={draft.name ?? ""} valeurCode={base.name} onChange={(v) => maj("name", v || null)} />
                <Retouche id="p-role" label="Intitulé court (carte d’équipe)" valeur={draft.role ?? ""} valeurCode={base.role} onChange={(v) => maj("role", v || null)} />
                <Retouche id="p-badge" label="Intitulé long (fiche)" valeur={draft.badge ?? ""} valeurCode={fiche?.badge} onChange={(v) => maj("badge", v || null)} />
                <Retouche id="p-booking" label="Lien de réservation" valeur={draft.booking ?? ""} valeurCode={base.booking} onChange={(v) => maj("booking", v || null)} />
              </div>

              <Retouche id="p-quote" label="Citation (guillemets compris)" valeur={draft.quote ?? ""} valeurCode={fiche?.quote.replace(/&nbsp;/g, " ")} onChange={(v) => maj("quote", v || null)} />
              <Retouche id="p-bio" label="Résumé affiché au survol de la carte" valeur={draft.bio ?? ""} valeurCode={base.bio} onChange={(v) => maj("bio", v || null)} aire />

              <div>
                <label style={LABEL} htmlFor="p-tags">Mots-clés (séparés par des virgules)</label>
                <input id="p-tags" style={CHAMP} value={draft.tagsTexte} onChange={(e) => maj("tagsTexte", e.target.value)} />
                <p style={{ margin: "5px 0 0", fontSize: 12, color: "rgba(51,51,52,.5)" }}>
                  Vide → <span style={{ color: "rgba(51,51,52,.75)" }}>{base.tags.join(", ")}</span>
                </p>
              </div>

              <div>
                <label style={LABEL} htmlFor="p-chips">Puces de la fiche — une par ligne, <code>icône | texte</code></label>
                <textarea id="p-chips" rows={3} style={{ ...CHAMP, resize: "vertical", fontFamily: "ui-monospace, monospace", fontSize: 13 }}
                  value={draft.chipsTexte} onChange={(e) => maj("chipsTexte", e.target.value)}
                  placeholder={"map-pin | Biarritz · Ahetze\nlanguages | Français · anglais"} />
                {fiche?.chips?.length ? (
                  <p style={{ margin: "5px 0 0", fontSize: 12, color: "rgba(51,51,52,.5)" }}>
                    Vide → <span style={{ color: "rgba(51,51,52,.75)" }}>{fiche.chips.map((c) => c.text).join(" · ")}</span>
                  </p>
                ) : null}
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 4 }}>
                <button type="button" disabled={occupe} onClick={() => void enregistrer()}
                  style={{ padding: "11px 22px", borderRadius: 999, border: "none", background: "#04A49B", color: "#fff", font: "inherit", fontSize: 14.5, fontWeight: 600, cursor: occupe ? "wait" : "pointer" }}>
                  {occupe ? "…" : "Enregistrer"}
                </button>
                <a href={`/equipe/${slug}`} target="_blank" rel="noopener noreferrer"
                  style={{ padding: "11px 22px", borderRadius: 999, border: "1px solid rgba(0,56,80,.18)", color: "#003850", font: "inherit", fontSize: 14.5, fontWeight: 600, textDecoration: "none" }}>
                  Voir la fiche ↗
                </a>
                {retouches.has(slug) && (
                  <button type="button" onClick={() => setDraft(brouillonPour(slug))}
                    style={{ marginLeft: "auto", padding: "11px 22px", borderRadius: 999, border: "1px solid rgba(194,65,12,.35)", background: "transparent", color: "#C2410C", font: "inherit", fontSize: 14.5, fontWeight: 600, cursor: "pointer" }}>
                    Tout vider
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
