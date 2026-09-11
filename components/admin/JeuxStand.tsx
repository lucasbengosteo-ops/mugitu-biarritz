"use client";

import { useCallback, useEffect, useId, useState, useSyncExternalStore } from "react";
import { codeErreur, dossard, ERREURS, jeuParId, JEUX, type Jeu, type JeuId } from "@/lib/jeux";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase-config";

/**
 * Poste de saisie du stand, sur téléphone.
 *
 * Le geste de base : taper un numéro, choisir le jeu, entrer la mesure,
 * enregistrer. Tout le reste — recherche par nom, suppression d'un essai,
 * classements — est là pour les cas où ce geste ne suffit pas.
 *
 * Chaque appel passe la clé du stand à une fonction Postgres qui la vérifie.
 * Rien n'est lisible sans elle, et l'adresse e-mail des participants n'est
 * jamais renvoyée ici.
 */

// ─── Clé et prénom gardés sur le téléphone ─────────────────────────────────

const CLE_LOCALE = "mugitu-jeux-stand";
type Poste = { cle: string; prenom: string };

function lirePoste(): string | null {
  try {
    return window.localStorage.getItem(CLE_LOCALE);
  } catch {
    return null;
  }
}

function abonner(rappel: () => void) {
  window.addEventListener("storage", rappel);
  window.addEventListener("mugitu-stand", rappel);
  return () => {
    window.removeEventListener("storage", rappel);
    window.removeEventListener("mugitu-stand", rappel);
  };
}

function ecrirePoste(p: Poste | null) {
  try {
    if (p) window.localStorage.setItem(CLE_LOCALE, JSON.stringify(p));
    else window.localStorage.removeItem(CLE_LOCALE);
  } catch {
    /* navigation privée : la clé ne survivra pas à l'onglet */
  }
  window.dispatchEvent(new Event("mugitu-stand"));
}

// ─── Appels aux fonctions Postgres ────────────────────────────────────────

class ErreurStand extends Error {}

async function rpc<T>(nom: string, args: Record<string, unknown>): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${nom}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
    });
  } catch {
    throw new ErreurStand("Pas de réseau. Réessayez dans un instant.");
  }
  const corps = await res.json().catch(() => null);
  if (!res.ok) {
    const code = codeErreur(corps);
    throw new ErreurStand((code && ERREURS[code]) || "Le serveur a refusé la demande.");
  }
  return corps as T;
}

// ─── Types des réponses ───────────────────────────────────────────────────

type Score = { id: string; jeu: JeuId; valeur: number; annonce: number | null; saisi_par: string | null; le: string };
type Fiche = {
  numero: number;
  prenom: string;
  nom: string;
  instagram: string | null;
  categorie: "F" | "H" | null;
  jeux: JeuId[];
  scores: Score[];
};
type Ligne = { rang: number; numero: number; nom: string; valeur: number; annonce: number | null; score: number };
type Classement = { inscrits: number; essais: number; tableaux: Record<string, Ligne[]> };

// ─── Utilitaires d'affichage ──────────────────────────────────────────────

const BLEU = "#003850";
const TEAL = "#04A49B";
const ROUGE = "#9E4433";

const nombre = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 2 });

/** Les téléphones français tapent « 34,5 ». */
function lireNombre(s: string): number | null {
  const v = Number(s.trim().replace(/\s/g, "").replace(",", "."));
  return s.trim() !== "" && Number.isFinite(v) && v >= 0 && v < 10000 ? v : null;
}

function valeurAffichee(j: Jeu | undefined, s: { valeur: number; annonce: number | null }) {
  if (!j) return nombre(s.valeur);
  if (j.id === "pari") return `${nombre(s.valeur)} pour ${nombre(s.annonce ?? 0)} annoncé · écart ${nombre(Math.abs(s.valeur - (s.annonce ?? 0)))}`;
  return `${nombre(s.valeur)} ${j.unite}`.trim();
}

/** Meilleur essai d'un jeu, dans le même sens que le classement. */
function meilleur(j: Jeu, scores: Score[]): Score | null {
  const liste = scores.filter((s) => s.jeu === j.id);
  if (!liste.length) return null;
  const note = (s: Score) => (j.id === "pari" ? Math.abs(s.valeur - (s.annonce ?? 0)) : s.valeur);
  return liste.reduce((a, b) => (j.gagne === "haut" ? (note(b) > note(a) ? b : a) : note(b) < note(a) ? b : a));
}

const heure = (iso: string) => new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

const bouton = (fond: string, texte = "#fff"): React.CSSProperties => ({
  padding: "14px 18px",
  border: "none",
  borderRadius: "var(--r-pill)",
  background: fond,
  color: texte,
  font: "inherit",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
});

const champ: React.CSSProperties = {
  width: "100%",
  padding: "14px 15px",
  borderRadius: "var(--r-s)",
  border: "1px solid rgba(0,56,80,.2)",
  background: "#fff",
  color: BLEU,
  font: "inherit",
  fontSize: 18,
};

// ─── Composant ────────────────────────────────────────────────────────────

export default function JeuxStand({ cleUrl }: { cleUrl: string | null }) {
  const brut = useSyncExternalStore(abonner, lirePoste, () => null);
  const poste: Poste | null = (() => {
    try {
      return brut ? (JSON.parse(brut) as Poste) : null;
    } catch {
      return null;
    }
  })();

  if (!poste) return <Activation cleUrl={cleUrl} />;
  return <PosteActif poste={poste} />;
}

// ─── Activation du téléphone ──────────────────────────────────────────────

function Activation({ cleUrl }: { cleUrl: string | null }) {
  const [prenom, setPrenom] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const id = useId();

  async function activer(e: React.FormEvent) {
    e.preventDefault();
    if (!cleUrl) return;
    if (!prenom.trim()) return setErreur("Indiquez votre prénom : il accompagne chaque score saisi.");
    setEnvoi(true);
    setErreur("");
    try {
      const ok = await rpc<boolean>("jeux_cle_valide", { p_cle: cleUrl });
      if (!ok) {
        setErreur(ERREURS.JEUX_CLE);
        return;
      }
      // La clé quitte la barre d'adresse : elle ne doit pas se retrouver
      // partagée dans une capture d'écran ou dans l'historique.
      window.history.replaceState(null, "", "/jeux/stand");
      ecrirePoste({ cle: cleUrl, prenom: prenom.trim() });
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Activation impossible.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <Cadre>
      <p style={{ margin: "0 0 8px", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 700, color: TEAL }}>
        Stand Mugitu
      </p>
      <h1 style={{ margin: "0 0 14px", fontSize: 28, fontWeight: 800, letterSpacing: "-.02em", color: BLEU }}>Poste de saisie</h1>

      {cleUrl ? (
        <form onSubmit={activer}>
          <p style={{ margin: "0 0 18px", fontSize: 15.5, lineHeight: 1.6, color: "rgba(51,51,52,.75)" }}>
            Ce téléphone va devenir un poste de saisie des scores pour le week-end.
          </p>
          <label htmlFor={`${id}-p`} style={{ display: "block", fontSize: 13, fontWeight: 600, color: BLEU, marginBottom: 7 }}>
            Votre prénom
          </label>
          <input id={`${id}-p`} autoComplete="given-name" value={prenom} onChange={(e) => setPrenom(e.target.value)} style={{ ...champ, marginBottom: 16 }} />
          {erreur && <p style={{ margin: "0 0 14px", color: ROUGE, fontSize: 14.5 }}>{erreur}</p>}
          <button type="submit" disabled={envoi} style={{ ...bouton(TEAL), width: "100%", opacity: envoi ? 0.6 : 1 }}>
            {envoi ? "Vérification…" : "Activer ce téléphone"}
          </button>
        </form>
      ) : (
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: "rgba(51,51,52,.75)" }}>
          Ouvrez le lien du stand — le QR code remis à l’équipe — pour activer ce téléphone.
        </p>
      )}
    </Cadre>
  );
}

// ─── Poste actif ──────────────────────────────────────────────────────────

function PosteActif({ poste }: { poste: Poste }) {
  const [onglet, setOnglet] = useState<"saisie" | "classements">("saisie");

  // Un téléphone déjà activé qui rouvre le lien du stand : la clé ne reste pas
  // affichée dans la barre d'adresse.
  useEffect(() => {
    if (window.location.search.includes("cle=")) window.history.replaceState(null, "", "/jeux/stand");
  }, []);

  function desactiver() {
    if (window.confirm("Désactiver ce téléphone ? Il faudra rouvrir le lien du stand pour saisir à nouveau.")) ecrirePoste(null);
  }

  return (
    <Cadre large>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <p style={{ margin: 0, fontSize: 13.5, color: "rgba(51,51,52,.6)" }}>
          Stand Mugitu · saisie par <strong style={{ color: BLEU }}>{poste.prenom}</strong>
        </p>
        <button type="button" onClick={desactiver} style={{ background: "none", border: "none", padding: 4, font: "inherit", fontSize: 13, color: "rgba(51,51,52,.5)", cursor: "pointer", textDecoration: "underline" }}>
          Désactiver
        </button>
      </div>

      <div role="tablist" style={{ display: "flex", gap: 6, padding: 5, borderRadius: "var(--r-pill)", background: "rgba(0,56,80,.07)", marginBottom: 22 }}>
        {(
          [
            ["saisie", "Saisie"],
            ["classements", "Classements"],
          ] as const
        ).map(([v, l]) => (
          <button
            key={v}
            role="tab"
            aria-selected={onglet === v}
            type="button"
            onClick={() => setOnglet(v)}
            style={{
              flex: 1,
              padding: "12px 10px",
              border: "none",
              borderRadius: "var(--r-pill)",
              background: onglet === v ? "#fff" : "transparent",
              boxShadow: onglet === v ? "0 2px 8px rgba(0,56,80,.12)" : "none",
              color: BLEU,
              font: "inherit",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {onglet === "saisie" ? <Saisie poste={poste} /> : <Classements cle={poste.cle} />}
    </Cadre>
  );
}

// ─── Saisie ───────────────────────────────────────────────────────────────

function Saisie({ poste }: { poste: Poste }) {
  const [numero, setNumero] = useState("");
  const [fiche, setFiche] = useState<Fiche | null>(null);
  const [jeu, setJeu] = useState<JeuId | null>(null);
  const [valeur, setValeur] = useState("");
  const [annonce, setAnnonce] = useState("");
  const [categorie, setCategorie] = useState<"F" | "H" | "">("");
  const [recherche, setRecherche] = useState("");
  const [resultats, setResultats] = useState<{ numero: number; prenom: string; nom: string }[] | null>(null);
  const [message, setMessage] = useState<{ ton: "ok" | "erreur"; texte: string } | null>(null);
  const [occupe, setOccupe] = useState(false);
  const id = useId();

  // Ne touche pas au message : après un enregistrement, la fiche se recharge
  // et le « Enregistré » doit rester affiché.
  const ouvrir = useCallback(
    async (n: number) => {
      setOccupe(true);
      try {
        const f = await rpc<Fiche | null>("jeux_fiche", { p_cle: poste.cle, p_numero: n });
        if (!f) {
          setFiche(null);
          setMessage({ ton: "erreur", texte: `Aucun participant ne porte le numéro ${dossard(n)}.` });
          return;
        }
        setFiche(f);
        setResultats(null);
        setNumero(String(f.numero));
        setCategorie(f.categorie ?? "");
        // Un seul jeu choisi : on le présélectionne, c'est le cas le plus courant.
        setJeu((j) => (j && f.jeux.includes(j) ? j : f.jeux.length === 1 ? f.jeux[0] : null));
      } catch (err) {
        setMessage({ ton: "erreur", texte: err instanceof Error ? err.message : "Erreur." });
      } finally {
        setOccupe(false);
      }
    },
    [poste.cle],
  );

  function chercherNumero(e: React.FormEvent) {
    e.preventDefault();
    const n = parseInt(numero, 10);
    if (Number.isFinite(n) && n > 0) {
      setMessage(null);
      void ouvrir(n);
    }
  }

  async function chercherNom(e: React.FormEvent) {
    e.preventDefault();
    if (recherche.trim().length < 2) return;
    setOccupe(true);
    try {
      setResultats(await rpc("jeux_recherche", { p_cle: poste.cle, p_q: recherche }));
    } catch (err) {
      setMessage({ ton: "erreur", texte: err instanceof Error ? err.message : "Erreur." });
    } finally {
      setOccupe(false);
    }
  }

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    if (!fiche || !jeu) return;
    const j = jeuParId(jeu)!;
    const v = lireNombre(valeur);
    if (v === null) return setMessage({ ton: "erreur", texte: "Mesure invalide — un nombre, par exemple 34,5." });
    let a: number | null = null;
    if (jeu === "pari") {
      a = lireNombre(annonce);
      if (a === null) return setMessage({ ton: "erreur", texte: "Pour le Pari, il faut aussi le chiffre annoncé." });
    }
    if (jeu === "grip" && !categorie) return setMessage({ ton: "erreur", texte: "Choisissez le classement : femmes ou hommes." });

    setOccupe(true);
    try {
      await rpc("jeux_saisir", {
        p_cle: poste.cle,
        p_numero: fiche.numero,
        p_jeu: jeu,
        p_valeur: v,
        p_annonce: a,
        p_categorie: jeu === "grip" ? categorie : null,
        p_saisi_par: poste.prenom,
      });
      setMessage({ ton: "ok", texte: `Enregistré : ${j.nom}, ${valeurAffichee(j, { valeur: v, annonce: a })} pour ${fiche.prenom}.` });
      setValeur("");
      setAnnonce("");
      await ouvrir(fiche.numero);
    } catch (err) {
      setMessage({ ton: "erreur", texte: err instanceof Error ? err.message : "Erreur." });
    } finally {
      setOccupe(false);
    }
  }

  async function supprimer(s: Score) {
    if (!fiche) return;
    const j = jeuParId(s.jeu);
    if (!window.confirm(`Supprimer l’essai ${j?.nom} · ${valeurAffichee(j, s)} ?`)) return;
    setOccupe(true);
    try {
      await rpc("jeux_supprimer_score", { p_cle: poste.cle, p_score: s.id });
      setMessage({ ton: "ok", texte: "Essai supprimé." });
      await ouvrir(fiche.numero);
    } catch (err) {
      setMessage({ ton: "erreur", texte: err instanceof Error ? err.message : "Erreur." });
    } finally {
      setOccupe(false);
    }
  }

  function autre() {
    setFiche(null);
    setNumero("");
    setJeu(null);
    setValeur("");
    setAnnonce("");
    setMessage(null);
  }

  const jeuActif = jeu ? jeuParId(jeu) : undefined;

  return (
    <div>
      {/* Numéro */}
      <form onSubmit={chercherNumero} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <label htmlFor={`${id}-n`} className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
          Numéro du participant
        </label>
        <input
          id={`${id}-n`}
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="N° du participant"
          value={numero}
          onChange={(e) => setNumero(e.target.value.replace(/\D/g, ""))}
          style={{ ...champ, fontSize: 24, fontWeight: 800, letterSpacing: ".04em", fontVariantNumeric: "tabular-nums" }}
        />
        <button type="submit" disabled={occupe || !numero} style={{ ...bouton(BLEU), flex: "0 0 auto", opacity: occupe || !numero ? 0.5 : 1 }}>
          Ouvrir
        </button>
      </form>

      {!fiche && (
        <details style={{ marginBottom: 16 }}>
          <summary style={{ cursor: "pointer", fontSize: 14, fontWeight: 600, color: TEAL, padding: "6px 0" }}>Numéro oublié ? Chercher par nom</summary>
          <form onSubmit={chercherNom} style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <input placeholder="Prénom ou nom" value={recherche} onChange={(e) => setRecherche(e.target.value)} style={{ ...champ, fontSize: 16 }} />
            <button type="submit" disabled={occupe} style={{ ...bouton(TEAL), flex: "0 0 auto" }}>
              Chercher
            </button>
          </form>
          {resultats && (
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              {resultats.length === 0 && <p style={{ margin: 0, fontSize: 14, color: "rgba(51,51,52,.6)" }}>Personne à ce nom.</p>}
              {resultats.map((r) => (
                <button
                  key={r.numero}
                  type="button"
                  onClick={() => {
                    setMessage(null);
                    void ouvrir(r.numero);
                  }}
                  style={{ display: "flex", justifyContent: "space-between", padding: "12px 14px", borderRadius: "var(--r-s)", border: "1px solid rgba(0,56,80,.14)", background: "#fff", font: "inherit", fontSize: 15, color: BLEU, cursor: "pointer", textAlign: "left" }}
                >
                  <span>
                    {r.prenom} {r.nom}
                  </span>
                  <strong style={{ fontVariantNumeric: "tabular-nums" }}>{dossard(r.numero)}</strong>
                </button>
              ))}
            </div>
          )}
        </details>
      )}

      {message && (
        <p
          role={message.ton === "erreur" ? "alert" : "status"}
          style={{
            margin: "0 0 16px",
            padding: "12px 14px",
            borderRadius: "var(--r-s)",
            background: message.ton === "ok" ? "rgba(4,164,155,.12)" : "rgba(158,68,51,.09)",
            color: message.ton === "ok" ? "#036D67" : ROUGE,
            fontSize: 15,
            fontWeight: 600,
            lineHeight: 1.45,
          }}
        >
          {message.texte}
        </p>
      )}

      {/* Fiche */}
      {fiche && (
        <div style={{ background: "#fff", borderRadius: "var(--r-l)", padding: 18, boxShadow: "0 4px 20px rgba(60,40,30,.07)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-.02em", color: BLEU, fontVariantNumeric: "tabular-nums" }}>{dossard(fiche.numero)}</span>
            <span style={{ fontSize: 19, fontWeight: 700, color: BLEU }}>
              {fiche.prenom} {fiche.nom}
            </span>
          </div>
          <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "rgba(51,51,52,.6)" }}>
            {fiche.instagram ? `@${fiche.instagram}` : "Pseudo Instagram non indiqué"}
            {fiche.categorie ? ` · Grip ${fiche.categorie === "F" ? "femmes" : "hommes"}` : ""}
          </p>

          {/* Choix du jeu : les quatre, ceux choisis à l'inscription en premier. */}
          <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: BLEU }}>Jeu</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
            {[...JEUX].sort((a, b) => Number(fiche.jeux.includes(b.id)) - Number(fiche.jeux.includes(a.id))).map((j) => {
              const actif = jeu === j.id;
              const choisi = fiche.jeux.includes(j.id);
              const top = meilleur(j, fiche.scores);
              return (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => {
                    setJeu(j.id);
                    setMessage(null);
                  }}
                  style={{
                    padding: "12px 10px",
                    borderRadius: "var(--r-m)",
                    border: `2px solid ${actif ? TEAL : choisi ? "rgba(4,164,155,.35)" : "rgba(0,56,80,.12)"}`,
                    background: actif ? "rgba(4,164,155,.1)" : "#fff",
                    font: "inherit",
                    color: BLEU,
                    cursor: "pointer",
                    textAlign: "left",
                    opacity: choisi || actif ? 1 : 0.7,
                  }}
                >
                  <span style={{ display: "block", fontSize: 15, fontWeight: 700 }}>{j.nom}</span>
                  <span style={{ display: "block", fontSize: 12, color: "rgba(51,51,52,.6)", marginTop: 2 }}>
                    {top ? `Meilleur : ${valeurAffichee(j, top).split(" · ")[0]}` : choisi ? "Pas encore d’essai" : "Non choisi"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Saisie de la mesure */}
          {jeuActif && (
            <form onSubmit={enregistrer}>
              {jeuActif.id === "grip" && (
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  {(
                    [
                      ["F", "Femmes"],
                      ["H", "Hommes"],
                    ] as const
                  ).map(([v, l]) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setCategorie(v)}
                      style={{ flex: 1, padding: "11px", borderRadius: "var(--r-m)", border: `2px solid ${categorie === v ? TEAL : "rgba(0,56,80,.14)"}`, background: categorie === v ? "rgba(4,164,155,.1)" : "#fff", font: "inherit", fontSize: 15, fontWeight: 700, color: BLEU, cursor: "pointer" }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}

              {jeuActif.id === "pari" && (
                <div style={{ marginBottom: 12 }}>
                  <label htmlFor={`${id}-a`} style={{ display: "block", fontSize: 13, fontWeight: 600, color: BLEU, marginBottom: 6 }}>
                    Chiffre annoncé
                  </label>
                  <input id={`${id}-a`} inputMode="decimal" value={annonce} onChange={(e) => setAnnonce(e.target.value)} style={champ} />
                </div>
              )}

              <label htmlFor={`${id}-v`} style={{ display: "block", fontSize: 13, fontWeight: 600, color: BLEU, marginBottom: 6 }}>
                {jeuActif.champ}
              </label>
              <input id={`${id}-v`} inputMode="decimal" value={valeur} onChange={(e) => setValeur(e.target.value)} style={{ ...champ, fontSize: 22, fontWeight: 700, marginBottom: 12 }} />

              <button type="submit" disabled={occupe} style={{ ...bouton(TEAL), width: "100%", fontSize: 17, opacity: occupe ? 0.6 : 1 }}>
                {occupe ? "Enregistrement…" : `Enregistrer l’essai — ${jeuActif.nom}`}
              </button>
            </form>
          )}

          {/* Essais déjà saisis */}
          {fiche.scores.length > 0 && (
            <div style={{ marginTop: 20, borderTop: "1px solid rgba(0,56,80,.1)", paddingTop: 14 }}>
              <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: BLEU }}>Essais enregistrés</p>
              {fiche.scores.map((s) => {
                const j = jeuParId(s.jeu);
                return (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "9px 0", borderBottom: "1px solid rgba(0,56,80,.06)" }}>
                    <span style={{ fontSize: 14, color: BLEU }}>
                      <strong>{j?.nom}</strong> · {valeurAffichee(j, s)}
                      <span style={{ display: "block", fontSize: 12, color: "rgba(51,51,52,.5)" }}>
                        {heure(s.le)}
                        {s.saisi_par ? ` · ${s.saisi_par}` : ""}
                      </span>
                    </span>
                    <button type="button" onClick={() => void supprimer(s)} style={{ background: "none", border: "none", padding: 6, font: "inherit", fontSize: 13, color: ROUGE, cursor: "pointer" }}>
                      Supprimer
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <button type="button" onClick={autre} style={{ ...bouton("rgba(0,56,80,.08)", BLEU), width: "100%", marginTop: 18 }}>
            Participant suivant
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Classements ──────────────────────────────────────────────────────────

const TABLEAUX: { cle: string; titre: string; jeu: JeuId }[] = [
  { cle: "grip_F", titre: "Grip — femmes", jeu: "grip" },
  { cle: "grip_H", titre: "Grip — hommes", jeu: "grip" },
  { cle: "symetrie", titre: "Symétrie", jeu: "symetrie" },
  { cle: "detente", titre: "Détente", jeu: "detente" },
  { cle: "pari", titre: "Pari", jeu: "pari" },
];

function Classements({ cle }: { cle: string }) {
  const [donnees, setDonnees] = useState<Classement | null>(null);
  const [erreur, setErreur] = useState("");
  const [maj, setMaj] = useState<Date | null>(null);

  const charger = useCallback(async () => {
    try {
      const c = await rpc<Classement>("jeux_classement", { p_cle: cle });
      setDonnees(c);
      setErreur("");
      setMaj(new Date());
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur.");
    }
  }, [cle]);

  // Rafraîchi toutes les 30 secondes tant que l'onglet est ouvert.
  useEffect(() => {
    const premier = setTimeout(() => void charger(), 0);
    const t = setInterval(() => {
      if (document.visibilityState === "visible") void charger();
    }, 30_000);
    return () => {
      clearTimeout(premier);
      clearInterval(t);
    };
  }, [charger]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 14, color: "rgba(51,51,52,.65)" }}>
          {donnees ? (
            <>
              <strong style={{ color: BLEU }}>{donnees.inscrits}</strong> inscrits · <strong style={{ color: BLEU }}>{donnees.essais}</strong> essais
            </>
          ) : (
            "Chargement…"
          )}
        </p>
        <button type="button" onClick={() => void charger()} style={{ ...bouton("rgba(0,56,80,.08)", BLEU), padding: "9px 14px", fontSize: 14 }}>
          Actualiser
        </button>
      </div>
      {maj && <p style={{ margin: "-8px 0 16px", fontSize: 12, color: "rgba(51,51,52,.45)" }}>Mis à jour à {maj.toLocaleTimeString("fr-FR")}</p>}
      {erreur && <p style={{ margin: "0 0 14px", color: ROUGE, fontSize: 14.5 }}>{erreur}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {TABLEAUX.map((t) => {
          const j = jeuParId(t.jeu)!;
          const lignes = donnees?.tableaux[t.cle] ?? [];
          return (
            <section key={t.cle} style={{ background: "#fff", borderRadius: "var(--r-l)", padding: "16px 18px", boxShadow: "0 4px 20px rgba(60,40,30,.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: BLEU }}>{t.titre}</h2>
                <span style={{ fontSize: 12, color: "rgba(51,51,52,.5)" }}>{j.gagne === "haut" ? "le plus haut gagne" : "le plus bas gagne"}</span>
              </div>
              {lignes.length === 0 ? (
                <p style={{ margin: 0, fontSize: 14, color: "rgba(51,51,52,.5)" }}>Aucun essai pour l’instant.</p>
              ) : (
                <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {lignes.map((l) => (
                    <li
                      key={l.numero}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "28px 1fr auto",
                        gap: 10,
                        alignItems: "baseline",
                        padding: "8px 0",
                        borderBottom: "1px solid rgba(0,56,80,.06)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      <span style={{ fontSize: 15, fontWeight: 800, color: l.rang === 1 ? TEAL : "rgba(51,51,52,.45)" }}>{l.rang}</span>
                      <span style={{ fontSize: 15, color: BLEU, fontWeight: l.rang <= 3 ? 700 : 500 }}>
                        {l.nom} <span style={{ fontSize: 12, color: "rgba(51,51,52,.45)", fontWeight: 500 }}>n°{dossard(l.numero)}</span>
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: BLEU }}>
                        {t.jeu === "pari" ? `écart ${nombre(l.score)}` : `${nombre(l.valeur)} ${j.unite}`}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mise en page commune ─────────────────────────────────────────────────

function Cadre({ children, large = false }: { children: React.ReactNode; large?: boolean }) {
  return (
    <main style={{ minHeight: "100svh", background: "#FDF8F4", padding: "clamp(18px,4vw,32px) clamp(14px,4vw,24px) 60px" }}>
      <div style={{ maxWidth: large ? 620 : 440, margin: "0 auto" }}>{children}</div>
    </main>
  );
}
