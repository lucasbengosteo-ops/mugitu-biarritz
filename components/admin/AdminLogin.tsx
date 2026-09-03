"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

/**
 * Connexion au back-office, par e-mail et mot de passe.
 *
 * Les magic links ne sont pas proposés : le pipeline e-mail du projet n’est
 * pas encore branché (chantier Brevo). Le jour où il le sera, ajouter
 * `signInWithOtp` ici suffira.
 */
export default function AdminLogin({
  onSignedIn,
  /** Section visée : le même écran sert plusieurs back-offices. */
  titre = "Actualités Mugitu",
}: {
  onSignedIn: () => void;
  titre?: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setEnvoi(true);
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password });
    setEnvoi(false);
    if (error) {
      // On reste volontairement évasif : ne pas révéler si l’adresse existe.
      setErreur("Identifiants refusés.");
      return;
    }
    onSignedIn();
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
          {envoi ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </main>
  );
}
