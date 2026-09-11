"use client";

import Link from "next/link";
import { useId, useState, useSyncExternalStore } from "react";
import { dossard, JEUX, type JeuId } from "@/lib/jeux";
import { EXTERNAL, ROUTES } from "@/lib/routes";

/**
 * Formulaire d'inscription aux jeux du stand, pensé pour un téléphone tenu
 * d'une main dans une halle bruyante : gros champs, grosses cases, une seule
 * colonne, et le numéro de dossard en très grand à la fin.
 *
 * Le dernier numéro obtenu est gardé sur le téléphone. Quelqu'un qui ferme
 * l'onglet par erreur le retrouve en rouvrant la page — et un couple qui
 * s'inscrit sur le même téléphone voit simplement le dernier.
 */

const CLE_LOCALE = "mugitu-jeux-dernier";

function lireDernier(): string | null {
  try {
    return window.localStorage.getItem(CLE_LOCALE);
  } catch {
    return null;
  }
}

function abonner(rappel: () => void) {
  window.addEventListener("storage", rappel);
  window.addEventListener("mugitu-jeux", rappel);
  return () => {
    window.removeEventListener("storage", rappel);
    window.removeEventListener("mugitu-jeux", rappel);
  };
}

function memoriser(numero: number, prenom: string) {
  try {
    window.localStorage.setItem(CLE_LOCALE, JSON.stringify({ numero, prenom }));
  } catch {
    /* navigation privée : on s'en passe */
  }
  window.dispatchEvent(new Event("mugitu-jeux"));
}

const BLEU = "#003850";
const TEAL = "#04A49B";

const champStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 15px",
  borderRadius: "var(--r-s)",
  border: "1px solid rgba(0,56,80,.18)",
  background: "#fff",
  color: BLEU,
  font: "inherit",
  fontSize: 16, // 16 px : en dessous, iOS zoome sur le champ
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: BLEU,
  marginBottom: 7,
};

export default function JeuxInscription() {
  const dernierBrut = useSyncExternalStore(abonner, lireDernier, () => null);
  const dernier = (() => {
    try {
      return dernierBrut ? (JSON.parse(dernierBrut) as { numero: number; prenom: string }) : null;
    } catch {
      return null;
    }
  })();

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [jeux, setJeux] = useState<JeuId[]>([]);
  const [categorie, setCategorie] = useState<"F" | "H" | "">("");
  const [instagram, setInstagram] = useState("");
  const [suit, setSuit] = useState(false);
  const [reglement, setReglement] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [piege, setPiege] = useState("");

  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const [resultat, setResultat] = useState<{ numero: number; prenom: string; jeux: JeuId[] } | null>(null);

  const id = useId();
  const grip = jeux.includes("grip");

  function basculer(j: JeuId) {
    setJeux((l) => (l.includes(j) ? l.filter((x) => x !== j) : [...l, j]));
  }

  async function valider(e: React.FormEvent) {
    e.preventDefault();
    if (envoi) return;

    // Les mêmes règles que côté base, vérifiées ici pour un retour immédiat.
    if (!prenom.trim() || !nom.trim()) return setErreur("Indiquez votre prénom et votre nom.");
    if (!/^\S+@\S+\.\S{2,}$/.test(email.trim())) return setErreur("Cette adresse e-mail ne semble pas valide.");
    if (jeux.length === 0) return setErreur("Choisissez au moins un jeu.");
    if (grip && !categorie) return setErreur("Pour le Grip, précisez le classement : femmes ou hommes.");
    if (!suit) return setErreur("La participation suppose de suivre @mugitu_biarritz sur Instagram.");
    if (!reglement) return setErreur("Il faut accepter le règlement pour participer.");

    setErreur("");
    setEnvoi(true);
    try {
      const res = await fetch("/api/jeux/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom,
          nom,
          email,
          instagram,
          suitInstagram: suit,
          categorie: grip ? categorie : null,
          jeux,
          reglement,
          newsletter,
          site: piege,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; numero?: number; message?: string };
      if (res.ok && data.ok && typeof data.numero === "number") {
        memoriser(data.numero, prenom.trim());
        setResultat({ numero: data.numero, prenom: prenom.trim(), jeux });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setErreur(data.message ?? "L’inscription n’a pas pu être enregistrée.");
      }
    } catch {
      setErreur("Connexion impossible. Vérifiez le réseau et réessayez.");
    } finally {
      setEnvoi(false);
    }
  }

  function autreInscription() {
    setResultat(null);
    setPrenom("");
    setNom("");
    setEmail("");
    setJeux([]);
    setCategorie("");
    setInstagram("");
    setSuit(false);
    setReglement(false);
    setNewsletter(false);
  }

  // ─── Écran de confirmation ────────────────────────────────────────────
  if (resultat) {
    return (
      <div style={{ textAlign: "center" }} role="status">
        <p style={{ margin: "0 0 6px", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 700, color: TEAL }}>
          Participation validée
        </p>
        <p style={{ margin: "0 0 18px", fontSize: 18, color: BLEU, fontWeight: 600 }}>Bravo {resultat.prenom}, votre numéro :</p>
        <p
          style={{
            margin: "0 auto 18px",
            fontSize: "clamp(84px,28vw,140px)",
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: "-.04em",
            color: BLEU,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {dossard(resultat.numero)}
        </p>
        <p style={{ margin: "0 auto 24px", maxWidth: 340, fontSize: 16, lineHeight: 1.55, color: "rgba(51,51,52,.75)" }}>
          Montrez ce numéro au Mugitu Hub avant chaque épreuve. Faites une capture d’écran pour le garder sous la main.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 28 }}>
          {resultat.jeux.map((j) => {
            const jeu = JEUX.find((x) => x.id === j);
            return (
              <span key={j} style={{ padding: "8px 14px", borderRadius: "var(--r-pill)", background: "rgba(4,164,155,.12)", color: TEAL, fontSize: 14, fontWeight: 700 }}>
                {jeu?.nom}
              </span>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 340, margin: "0 auto" }}>
          <a
            href={EXTERNAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", padding: "15px 20px", borderRadius: "var(--r-pill)", background: TEAL, color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none" }}
          >
            Voir @mugitu_biarritz sur Instagram
          </a>
          <button
            type="button"
            onClick={autreInscription}
            style={{ padding: "15px 20px", borderRadius: "var(--r-pill)", border: "1px solid rgba(0,56,80,.2)", background: "#fff", color: BLEU, font: "inherit", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
          >
            Inscrire une autre personne
          </button>
        </div>
      </div>
    );
  }

  // ─── Formulaire ───────────────────────────────────────────────────────
  return (
    <form onSubmit={valider} noValidate>
      {dernier && (
        <div style={{ marginBottom: 22, padding: "12px 15px", borderRadius: "var(--r-m)", background: "rgba(4,164,155,.1)", border: "1px solid rgba(4,164,155,.28)", fontSize: 14, color: BLEU }}>
          Déjà inscrit·e sur ce téléphone : <strong>{dernier.prenom}</strong>, numéro{" "}
          <strong style={{ fontVariantNumeric: "tabular-nums" }}>{dossard(dernier.numero)}</strong>. Pour ajouter un jeu, réinscrivez-vous avec la même adresse : le numéro ne change pas.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 14 }}>
        <div>
          <label htmlFor={`${id}-prenom`} style={labelStyle}>Prénom</label>
          <input id={`${id}-prenom`} autoComplete="given-name" value={prenom} onChange={(e) => setPrenom(e.target.value)} style={champStyle} />
        </div>
        <div>
          <label htmlFor={`${id}-nom`} style={labelStyle}>Nom</label>
          <input id={`${id}-nom`} autoComplete="family-name" value={nom} onChange={(e) => setNom(e.target.value)} style={champStyle} />
        </div>
      </div>

      <div style={{ marginBottom: 26 }}>
        <label htmlFor={`${id}-email`} style={labelStyle}>E-mail</label>
        <input
          id={`${id}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="vous@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={champStyle}
        />
        <p style={{ margin: "7px 0 0", fontSize: 12.5, color: "rgba(51,51,52,.55)" }}>Pour vous prévenir si vous gagnez.</p>
      </div>

      <fieldset style={{ border: "none", padding: 0, margin: "0 0 22px" }}>
        <legend style={{ ...labelStyle, fontSize: 15, marginBottom: 12 }}>Vos jeux <span style={{ fontWeight: 400, color: "rgba(51,51,52,.55)" }}>— un ou plusieurs</span></legend>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {JEUX.map((j) => {
            const coche = jeux.includes(j.id);
            return (
              <label
                key={j.id}
                style={{
                  display: "flex",
                  gap: 13,
                  alignItems: "flex-start",
                  padding: "15px 16px",
                  borderRadius: "var(--r-m)",
                  background: coche ? "rgba(4,164,155,.08)" : "#fff",
                  border: `1.5px solid ${coche ? TEAL : "rgba(0,56,80,.14)"}`,
                  cursor: "pointer",
                  transition: "background .15s, border-color .15s",
                }}
              >
                <input type="checkbox" checked={coche} onChange={() => basculer(j.id)} style={{ width: 22, height: 22, marginTop: 1, accentColor: TEAL, flex: "0 0 auto" }} />
                <span>
                  <span style={{ display: "block", fontSize: 16, fontWeight: 700, color: BLEU }}>
                    {j.nom} <span style={{ fontWeight: 500, fontSize: 13, color: "rgba(51,51,52,.5)" }}>· {j.outil}</span>
                  </span>
                  <span style={{ display: "block", marginTop: 3, fontSize: 14, lineHeight: 1.5, color: "rgba(51,51,52,.7)" }}>{j.accroche}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {grip && (
        <fieldset style={{ border: "none", padding: 0, margin: "0 0 24px" }}>
          <legend style={labelStyle}>Classement du Grip</legend>
          <div style={{ display: "flex", gap: 10 }}>
            {(
              [
                ["F", "Femmes"],
                ["H", "Hommes"],
              ] as const
            ).map(([v, l]) => (
              <label
                key={v}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "13px 12px",
                  borderRadius: "var(--r-m)",
                  border: `1.5px solid ${categorie === v ? TEAL : "rgba(0,56,80,.14)"}`,
                  background: categorie === v ? "rgba(4,164,155,.08)" : "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  color: BLEU,
                  cursor: "pointer",
                }}
              >
                <input type="radio" name={`${id}-categorie`} checked={categorie === v} onChange={() => setCategorie(v)} style={{ accentColor: TEAL }} />
                {l}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div style={{ padding: "16px", borderRadius: "var(--r-m)", background: "#fff", border: "1px solid rgba(0,56,80,.12)", marginBottom: 16 }}>
        <label style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
          <input type="checkbox" checked={suit} onChange={(e) => setSuit(e.target.checked)} style={{ width: 22, height: 22, marginTop: 1, accentColor: TEAL, flex: "0 0 auto" }} />
          <span style={{ fontSize: 15, lineHeight: 1.5, color: BLEU }}>
            Je suis <strong>@mugitu_biarritz</strong> sur Instagram
          </span>
        </label>
        <a
          href={EXTERNAL.instagram}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block", margin: "10px 0 0 34px", fontSize: 14, fontWeight: 600, color: TEAL, textDecoration: "none" }}
        >
          Pas encore ? S’abonner maintenant ↗
        </a>
        <div style={{ margin: "14px 0 0 34px" }}>
          <label htmlFor={`${id}-insta`} style={{ ...labelStyle, fontWeight: 500, color: "rgba(51,51,52,.7)" }}>
            Votre pseudo Instagram <span style={{ color: "rgba(51,51,52,.45)" }}>(facultatif)</span>
          </label>
          <input
            id={`${id}-insta`}
            autoCapitalize="none"
            autoCorrect="off"
            placeholder="@votre_pseudo"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            style={champStyle}
          />
        </div>
      </div>

      <label style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14, cursor: "pointer" }}>
        <input type="checkbox" checked={reglement} onChange={(e) => setReglement(e.target.checked)} style={{ width: 22, height: 22, marginTop: 1, accentColor: TEAL, flex: "0 0 auto" }} />
        <span style={{ fontSize: 14.5, lineHeight: 1.5, color: BLEU }}>
          J’accepte le{" "}
          <Link href={ROUTES.jeuxReglement} target="_blank" style={{ color: TEAL, fontWeight: 600 }}>
            règlement des jeux
          </Link>
        </span>
      </label>

      <label style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 24, cursor: "pointer" }}>
        <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} style={{ width: 22, height: 22, marginTop: 1, accentColor: TEAL, flex: "0 0 auto" }} />
        <span style={{ fontSize: 14.5, lineHeight: 1.5, color: "rgba(51,51,52,.75)" }}>
          Je veux aussi recevoir la lettre Mugitu, une fois par mois <span style={{ color: "rgba(51,51,52,.45)" }}>(facultatif)</span>
        </span>
      </label>

      {/* Champ piège : jamais affiché, jamais annoncé aux lecteurs d'écran. */}
      <input
        type="text"
        name="site"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={piege}
        onChange={(e) => setPiege(e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      {erreur && (
        <p role="alert" style={{ margin: "0 0 16px", padding: "12px 14px", borderRadius: "var(--r-s)", background: "rgba(158,68,51,.08)", color: "#9E4433", fontSize: 14.5, lineHeight: 1.5 }}>
          {erreur}
        </p>
      )}

      <button
        type="submit"
        disabled={envoi}
        style={{
          width: "100%",
          padding: "17px 20px",
          border: "none",
          borderRadius: "var(--r-pill)",
          background: TEAL,
          color: "#fff",
          font: "inherit",
          fontSize: 17,
          fontWeight: 700,
          cursor: envoi ? "default" : "pointer",
          opacity: envoi ? 0.6 : 1,
          boxShadow: "0 10px 26px rgba(4,164,155,.28)",
        }}
      >
        {envoi ? "Inscription…" : "Valider ma participation"}
      </button>
    </form>
  );
}
