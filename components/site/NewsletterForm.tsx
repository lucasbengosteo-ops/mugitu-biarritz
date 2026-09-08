"use client";

import { useId, useState } from "react";

type Etat = "repos" | "envoi" | "ok" | "erreur";

/**
 * Bloc d'inscription à la newsletter.
 *
 * Deux habillages pour deux fonds : `clair` sur les sections crème du site,
 * `sombre` dans le pied de page navy.
 *
 * `source` remonte le point d'entrée en base — « pied-de-page »,
 * « article:tendinopathie-achille » — pour savoir plus tard ce qui recrute.
 */
export default function NewsletterForm({
  source,
  variante = "clair",
}: {
  source: string;
  variante?: "clair" | "sombre";
}) {
  const [email, setEmail] = useState("");
  const [piege, setPiege] = useState("");
  const [etat, setEtat] = useState<Etat>("repos");
  const [message, setMessage] = useState("");
  const champId = useId();

  const sombre = variante === "sombre";

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    if (etat === "envoi") return;
    setEtat("envoi");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, site: piege }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };

      if (res.ok && data.ok) {
        setEtat("ok");
        setEmail("");
      } else {
        setEtat("erreur");
        setMessage(data.message ?? "L’inscription n’a pas pu être enregistrée.");
      }
    } catch {
      setEtat("erreur");
      setMessage("Connexion impossible. Réessayez dans un instant.");
    }
  }

  const couleurTitre = sombre ? "#fff" : "#003850";
  const couleurTexte = sombre ? "rgba(255,255,255,.7)" : "rgba(51,51,52,.7)";

  if (etat === "ok") {
    return (
      <div
        role="status"
        style={{
          padding: "18px 20px",
          borderRadius: "var(--r-m)",
          background: sombre ? "rgba(4,164,155,.16)" : "rgba(4,164,155,.1)",
          border: `1px solid ${sombre ? "rgba(4,164,155,.4)" : "rgba(4,164,155,.3)"}`,
        }}
      >
        <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: couleurTitre }}>
          C’est noté, merci.
        </p>
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: couleurTexte }}>
          Nous vous écrirons pour confirmer votre inscription avant le premier envoi.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={envoyer} noValidate>
      <label
        htmlFor={champId}
        style={{
          display: "block",
          fontSize: 13.5,
          lineHeight: 1.55,
          color: couleurTexte,
          marginBottom: 10,
        }}
      >
        Les nouveaux articles, le planning du Mugi Klub et nos rendez-vous, une fois par mois.
      </label>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <input
          id={champId}
          type="email"
          required
          autoComplete="email"
          placeholder="vous@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            flex: "1 1 200px",
            minWidth: 0,
            padding: "12px 14px",
            borderRadius: "var(--r-s)",
            border: `1px solid ${sombre ? "rgba(255,255,255,.22)" : "rgba(0,56,80,.16)"}`,
            background: sombre ? "rgba(255,255,255,.06)" : "#FDF8F4",
            color: sombre ? "#fff" : "#003850",
            fontSize: 14,
            font: "inherit",
            fontFamily: "inherit",
          }}
        />

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

        <button
          type="submit"
          disabled={etat === "envoi"}
          style={{
            flex: "0 0 auto",
            cursor: etat === "envoi" ? "default" : "pointer",
            font: "inherit",
            padding: "12px 22px",
            border: "none",
            borderRadius: "var(--r-pill)",
            background: "#04A49B",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            opacity: etat === "envoi" ? 0.6 : 1,
            transition: "background .2s, opacity .2s",
          }}
          className="mg-inline-hover"
        >
          {etat === "envoi" ? "Envoi…" : "S’inscrire"}
        </button>
      </div>

      {etat === "erreur" && (
        <p role="alert" style={{ margin: "10px 0 0", fontSize: 13, color: sombre ? "#FFB4A2" : "#9E4433" }}>
          {message}
        </p>
      )}

      <p
        style={{
          margin: "10px 0 0",
          fontSize: 11.5,
          lineHeight: 1.5,
          color: sombre ? "rgba(255,255,255,.45)" : "rgba(51,51,52,.5)",
        }}
      >
        Désinscription en un clic dans chaque message. Votre adresse ne sert qu’à cet envoi et
        n’est transmise à personne.
      </p>
    </form>
  );
}
