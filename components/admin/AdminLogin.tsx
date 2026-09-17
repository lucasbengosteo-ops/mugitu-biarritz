"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

/**
 * Connexion au back-office.
 *
 * Par défaut, un code à usage unique est envoyé par e-mail : les praticiens
 * n’ont pas de mot de passe à retenir. Un code plutôt qu'un lien : aucun
 * lien à cliquer (les outils de suivi des clics et les antivirus de
 * messagerie les cassent), et on peut lire le mail sur un autre appareil.
 * Le mot de passe reste possible pour les comptes qui en ont un.
 *
 * `shouldCreateUser: false` : un code ne part que vers un compte existant.
 * La réponse affichée est la même dans tous les cas, pour ne pas révéler
 * quelles adresses ont un compte.
 */

type Mode = "lien" | "mot-de-passe";

export default function AdminLogin({
  onSignedIn,
  /** Section visée : le même écran sert plusieurs back-offices. */
  titre = "Actualités Mugitu",
}: {
  onSignedIn: () => void;
  titre?: string;
}) {
  const [mode, setMode] = useState<Mode>("lien");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [lienEnvoye, setLienEnvoye] = useState(false);
  const [code, setCode] = useState("");
  const [envoi, setEnvoi] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setEnvoi(true);

    if (mode === "lien" && lienEnvoye) {
      const token = code.replace(/\s/g, "");
      const sb = supabaseBrowser();
      let { error } = await sb.auth.verifyOtp({ email: email.trim(), token, type: "email" });
      if (error) ({ error } = await sb.auth.verifyOtp({ email: email.trim(), token, type: "magiclink" }));
      setEnvoi(false);
      if (error) {
        setErreur("Code incorrect ou expiré. Demandez-en un nouveau si besoin.");
        return;
      }
      onSignedIn();
      return;
    }

    if (mode === "lien") {
      const { error } = await supabaseBrowser().auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: false },
      });
      setEnvoi(false);
      // Une adresse sans compte renvoie aussi une erreur : on ne la montre pas.
      if (error && error.status === 429) {
        setErreur("Trop de demandes. Réessayez dans quelques minutes.");
        return;
      }
      if (error) console.warn("[admin] code de connexion", error.message);
      setLienEnvoye(true);
      return;
    }

    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password });
    setEnvoi(false);
    if (error) {
      // On reste volontairement évasif : ne pas révéler si l’adresse existe.
      setErreur("Identifiants refusés.");
      return;
    }
    onSignedIn();
  }

  function changerMode(m: Mode) {
    setMode(m);
    setErreur(null);
    setLienEnvoye(false);
    setCode("");
  }

  const champ: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(0,56,80,.16)",
    background: "#fff",
    font: "inherit",
    fontSize: 15,
    color: "#003850",
  };

  const lienSecondaire: React.CSSProperties = {
    alignSelf: "center",
    padding: 0,
    border: "none",
    background: "none",
    font: "inherit",
    fontSize: 13,
    fontWeight: 600,
    color: "#04A49B",
    cursor: "pointer",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "linear-gradient(160deg,#013242,#003850 55%,#0A556B)",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "min(420px,100%)",
          background: "#fff",
          borderRadius: 22,
          padding: "clamp(26px,4vw,38px)",
          boxShadow: "0 24px 60px rgba(0,0,0,.28)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <p style={{ margin: 0, fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", fontWeight: 600, color: "#04A49B" }}>
          Back-office
        </p>
        <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, letterSpacing: "-.02em", color: "#003850" }}>
          {titre}
        </h1>

        {lienEnvoye ? (
          <>
            <p role="status" style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "rgba(51,51,52,.75)" }}>
              Si <strong style={{ color: "#003850" }}>{email.trim()}</strong> a un compte, un code vient de partir par e-mail
              (pensez aux indésirables). Il est valable une heure.
            </p>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#003850" }}>
              Code reçu
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{ ...champ, marginTop: 6, fontSize: 22, letterSpacing: ".3em", textAlign: "center" }}
              />
            </label>
            {erreur && (
              <p role="alert" style={{ margin: 0, fontSize: 13, color: "#c2543c", fontWeight: 600 }}>
                {erreur}
              </p>
            )}
            <button
              type="submit"
              disabled={envoi}
              style={{
                marginTop: 4,
                padding: "13px 20px",
                borderRadius: 999,
                border: "none",
                background: envoi ? "rgba(4,164,155,.5)" : "#04A49B",
                color: "#fff",
                font: "inherit",
                fontSize: 15,
                fontWeight: 600,
                cursor: envoi ? "default" : "pointer",
              }}
            >
              {envoi ? "Vérification…" : "Se connecter"}
            </button>
            <button type="button" onClick={() => changerMode("lien")} style={lienSecondaire}>
              Changer d’adresse ou renvoyer un code
            </button>
          </>
        ) : (
          <>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#003850" }}>
              E-mail
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ ...champ, marginTop: 6 }}
              />
            </label>

            {mode === "mot-de-passe" && (
              <label style={{ fontSize: 13, fontWeight: 600, color: "#003850" }}>
                Mot de passe
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...champ, marginTop: 6 }}
                />
              </label>
            )}

            {erreur && (
              <p role="alert" style={{ margin: 0, fontSize: 13, color: "#c2543c", fontWeight: 600 }}>
                {erreur}
              </p>
            )}

            <button
              type="submit"
              disabled={envoi}
              style={{
                marginTop: 4,
                padding: "13px 20px",
                borderRadius: 999,
                border: "none",
                background: envoi ? "rgba(4,164,155,.5)" : "#04A49B",
                color: "#fff",
                font: "inherit",
                fontSize: 15,
                fontWeight: 600,
                cursor: envoi ? "default" : "pointer",
              }}
            >
              {mode === "lien" ? (envoi ? "Envoi…" : "Recevoir un code de connexion") : envoi ? "Connexion…" : "Se connecter"}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => changerMode(mode === "lien" ? "mot-de-passe" : "lien")}
          style={lienSecondaire}
        >
          {mode === "lien" ? "Se connecter avec un mot de passe" : "Recevoir plutôt un code par e-mail"}
        </button>
      </form>
    </main>
  );
}
