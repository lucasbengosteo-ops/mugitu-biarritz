"use client";

import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import AdminLogin from "./AdminLogin";
import AdminNav from "./AdminNav";
import { KLUB_JOURS, KLUB_TYPES, type KlubEvent } from "@/lib/klub-events";

/**
 * Back-office du programme Mugi Klub.
 *
 * Comme pour les actualités, l'autorisation réelle est la RLS de
 * `klub_events` : l'interface ne fait que refléter ce que PostgREST
 * acceptera. Un créneau désactivé reste en base mais disparaît du site —
 * on annule une séance sans perdre son texte.
 */

type Etat = "chargement" | "deconnecte" | "pret";

const COULEUR_TYPE: Record<string, string> = {
  small: "#04A49B",
  atelier: "#d49a40",
  conf: "#003850",
  soiree: "#EE806C",
};

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

function nouveauCreneau(): KlubEvent {
  return {
    id: crypto.randomUUID(),
    jour: 1,
    heure: "12:30:00",
    type: "small",
    titre: "",
    intervenant: "",
    duree_min: 45,
    places: "",
    description: "",
    lien: "https://app.mugitu.pro",
    actif: true,
  };
}

export default function KlubAdmin() {
  const [etat, setEtat] = useState<Etat>("chargement");
  const [events, setEvents] = useState<KlubEvent[]>([]);
  const [draft, setDraft] = useState<KlubEvent | null>(null);
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
    // Le back-office montre AUSSI les créneaux désactivés, que la lecture
    // publique masque : c'est là qu'on les réactive.
    const { data, error } = await sb.from("klub_events").select("*").order("jour").order("heure");
    if (error) notifier(`Lecture impossible : ${error.message}`);
    setEvents((data ?? []) as KlubEvent[]);
    setEtat("pret");
  }, []);

  useEffect(() => {
    // Même motif que le back-office des actualités : on s'abonne à la session
    // plutôt que d'appeler `charger()` dans le corps de l'effet (interdit par
    // le lint React Compiler), et le premier chargement passe par un timeout.
    const { data } = supabaseBrowser().auth.onAuthStateChange(() => {
      void charger();
    });
    const initial = window.setTimeout(() => void charger(), 0);
    return () => {
      data.subscription.unsubscribe();
      window.clearTimeout(initial);
    };
  }, [charger]);

  const enregistrer = async () => {
    if (!draft) return;
    if (!draft.titre.trim()) {
      notifier("Le titre est obligatoire.");
      return;
    }
    setOccupe(true);
    const { error } = await supabaseBrowser().from("klub_events").upsert(draft, { onConflict: "id" });
    setOccupe(false);
    if (error) {
      notifier(`Enregistrement refusé : ${error.message}`);
      return;
    }
    notifier("Créneau enregistré.");
    setDraft(null);
    void charger();
  };

  const supprimer = async () => {
    if (!draft) return;
    if (!window.confirm(`Supprimer définitivement « ${draft.titre} » ?`)) return;
    setOccupe(true);
    const { error } = await supabaseBrowser().from("klub_events").delete().eq("id", draft.id);
    setOccupe(false);
    if (error) {
      notifier(`Suppression refusée : ${error.message}`);
      return;
    }
    notifier("Créneau supprimé.");
    setDraft(null);
    void charger();
  };

  if (etat === "chargement") {
    return <p style={{ padding: 40, fontSize: 15, color: "rgba(51,51,52,.6)" }}>Chargement…</p>;
  }
  if (etat === "deconnecte") {
    return <AdminLogin titre="Mugi Klub" onSignedIn={() => void charger()} />;
  }

  const maj = <K extends keyof KlubEvent>(k: K, v: KlubEvent[K]) =>
    setDraft((d) => (d ? { ...d, [k]: v } : d));

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
          <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Mugi Klub</p>
        </div>
        <AdminNav courant="/admin/mugi-klub" />
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setDraft(nouveauCreneau())}
            style={{ padding: "9px 18px", borderRadius: 999, border: "none", background: "#04A49B", color: "#fff", font: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Nouveau créneau
          </button>
          <button
            type="button"
            onClick={() => void supabaseBrowser().auth.signOut()}
            style={{ padding: "9px 18px", borderRadius: 999, border: "1px solid rgba(255,255,255,.3)", background: "transparent", color: "#fff", font: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Se déconnecter
          </button>
        </div>
      </header>

      <p style={{ margin: 0, padding: "10px clamp(16px,4vw,32px)", background: "rgba(243,190,121,.18)", color: "#8a5a10", fontSize: 13.5, fontWeight: 600 }}>
        La page publique affiche un voile « ouverture prochaine » : ces créneaux
        se devinent derrière le flou mais ne sont pas réservables.
      </p>

      {message && (
        <p role="status" style={{ margin: 0, padding: "12px clamp(16px,4vw,32px)", background: "rgba(4,164,155,.12)", color: "#036b66", fontSize: 14, fontWeight: 600 }}>
          {message}
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,360px) minmax(0,1fr)", gap: 20, padding: "clamp(16px,3vw,28px)", alignItems: "start" }}>
        {/* ── Semaine ── */}
        <aside style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 3px 16px rgba(60,40,30,.06)", position: "sticky", top: 16 }}>
          <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(51,51,52,.45)" }}>
            {events.length} créneau{events.length > 1 ? "x" : ""}
          </p>
          {KLUB_JOURS.map((nom, i) => {
            const duJour = events.filter((e) => e.jour === i + 1);
            return (
              <div key={nom} style={{ marginBottom: 14 }}>
                <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: "#003850" }}>{nom}</p>
                {duJour.length === 0 && (
                  <p style={{ margin: 0, fontSize: 12.5, color: "rgba(51,51,52,.4)" }}>—</p>
                )}
                {duJour.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => setDraft(e)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 10px",
                      marginBottom: 4,
                      borderRadius: 10,
                      border: "1px solid",
                      borderColor: draft?.id === e.id ? "#04A49B" : "rgba(0,56,80,.1)",
                      background: draft?.id === e.id ? "rgba(4,164,155,.07)" : "transparent",
                      font: "inherit",
                      cursor: "pointer",
                      opacity: e.actif ? 1 : 0.5,
                    }}
                  >
                    <span aria-hidden="true" style={{ flex: "0 0 auto", width: 8, height: 8, borderRadius: "50%", background: COULEUR_TYPE[e.type] }} />
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#003850", minWidth: 42 }}>{e.heure.slice(0, 5)}</span>
                    <span style={{ fontSize: 13, color: "#003850", flex: 1 }}>{e.titre}</span>
                    {!e.actif && <span style={{ fontSize: 11, color: "rgba(51,51,52,.5)" }}>masqué</span>}
                  </button>
                ))}
              </div>
            );
          })}
        </aside>

        {/* ── Édition ── */}
        <section style={{ background: "#fff", borderRadius: 16, padding: "clamp(16px,2.5vw,26px)", boxShadow: "0 3px 16px rgba(60,40,30,.06)" }}>
          {!draft ? (
            <p style={{ margin: 0, fontSize: 15, color: "rgba(51,51,52,.6)" }}>
              Choisissez un créneau à gauche, ou créez-en un nouveau.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
                <div>
                  <label style={LABEL} htmlFor="k-jour">Jour</label>
                  <select id="k-jour" style={CHAMP} value={draft.jour} onChange={(e) => maj("jour", Number(e.target.value))}>
                    {KLUB_JOURS.map((n, i) => (
                      <option key={n} value={i + 1}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={LABEL} htmlFor="k-heure">Heure</label>
                  <input
                    id="k-heure"
                    type="time"
                    style={CHAMP}
                    value={draft.heure.slice(0, 5)}
                    onChange={(e) => maj("heure", `${e.target.value}:00`)}
                  />
                </div>
                <div>
                  <label style={LABEL} htmlFor="k-type">Type</label>
                  <select id="k-type" style={CHAMP} value={draft.type} onChange={(e) => maj("type", e.target.value as KlubEvent["type"])}>
                    {KLUB_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={LABEL} htmlFor="k-duree">Durée (min)</label>
                  <input
                    id="k-duree"
                    type="number"
                    min={5}
                    step={5}
                    style={CHAMP}
                    value={draft.duree_min ?? ""}
                    onChange={(e) => maj("duree_min", e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
              </div>

              <div>
                <label style={LABEL} htmlFor="k-titre">Titre</label>
                <input id="k-titre" style={CHAMP} value={draft.titre} onChange={(e) => maj("titre", e.target.value)} placeholder="Run Club Mugi" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
                <div>
                  <label style={LABEL} htmlFor="k-inter">Intervenant</label>
                  <input id="k-inter" style={CHAMP} value={draft.intervenant} onChange={(e) => maj("intervenant", e.target.value)} placeholder="Julien" />
                </div>
                <div>
                  <label style={LABEL} htmlFor="k-places">Disponibilité</label>
                  <input id="k-places" style={CHAMP} value={draft.places} onChange={(e) => maj("places", e.target.value)} placeholder="6 places · Ouvert · Accès Klub" />
                  <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(51,51,52,.5)" }}>
                    Un nombre de places affiche « Réserver » ; « Ouvert » ou « Accès Klub » affiche « S’inscrire ».
                  </p>
                </div>
              </div>

              <div>
                <label style={LABEL} htmlFor="k-desc">Description (affichée dans la fiche de séance)</label>
                <textarea id="k-desc" rows={3} style={{ ...CHAMP, resize: "vertical" }} value={draft.description} onChange={(e) => maj("description", e.target.value)} />
              </div>

              <div>
                <label style={LABEL} htmlFor="k-lien">Lien de réservation</label>
                <input id="k-lien" style={CHAMP} value={draft.lien} onChange={(e) => maj("lien", e.target.value)} />
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#003850" }}>
                <input type="checkbox" checked={draft.actif} onChange={(e) => maj("actif", e.target.checked)} />
                Visible sur le site
              </label>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 4 }}>
                <button
                  type="button"
                  disabled={occupe}
                  onClick={() => void enregistrer()}
                  style={{ padding: "11px 22px", borderRadius: 999, border: "none", background: "#04A49B", color: "#fff", font: "inherit", fontSize: 14.5, fontWeight: 600, cursor: occupe ? "wait" : "pointer" }}
                >
                  {occupe ? "…" : "Enregistrer"}
                </button>
                <button
                  type="button"
                  onClick={() => setDraft(null)}
                  style={{ padding: "11px 22px", borderRadius: 999, border: "1px solid rgba(0,56,80,.18)", background: "transparent", color: "#003850", font: "inherit", fontSize: 14.5, fontWeight: 600, cursor: "pointer" }}
                >
                  Annuler
                </button>
                {events.some((e) => e.id === draft.id) && (
                  <button
                    type="button"
                    disabled={occupe}
                    onClick={() => void supprimer()}
                    style={{ marginLeft: "auto", padding: "11px 22px", borderRadius: 999, border: "1px solid rgba(194,65,12,.35)", background: "transparent", color: "#C2410C", font: "inherit", fontSize: 14.5, fontWeight: 600, cursor: "pointer" }}
                  >
                    Supprimer
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
