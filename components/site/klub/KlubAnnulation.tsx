"use client";

import { useState } from "react";

/** Bouton d'annulation : ouvrir le lien du mail ne suffit pas, il faut cliquer. */
export default function KlubAnnulation({
  jeton,
  prenom,
  titre,
  quand,
  attente,
}: {
  jeton: string;
  prenom: string;
  titre: string;
  quand: string;
  attente: boolean;
}) {
  const [etat, setEtat] = useState<"pret" | "envoi" | "annulee" | "deja" | "erreur">("pret");
  const [message, setMessage] = useState("");

  const h1: React.CSSProperties = { margin: "0 0 14px", fontSize: "var(--h2-s)", fontWeight: 700, color: "#003850", lineHeight: 1.2 };
  const p: React.CSSProperties = { margin: "0 0 22px", fontSize: 16, lineHeight: 1.6, color: "rgba(51,51,52,.75)" };

  async function annuler() {
    setEtat("envoi");
    try {
      const res = await fetch("/api/klub/annulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jeton }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; resultat?: string; message?: string };
      if (res.ok && data.ok && data.resultat === "annulee") {
        setEtat("annulee");
        return;
      }
      if (res.ok && data.ok && data.resultat === "deja") {
        setEtat("deja");
        return;
      }
      setMessage(
        data.resultat === "passee"
          ? "La séance a déjà commencé : l’inscription ne peut plus être annulée."
          : data.resultat === "seance_annulee"
            ? "Cette séance a été annulée par l’équipe. Vous n’avez rien à faire."
            : data.resultat === "inconnu"
              ? "Ce lien n’est plus valable."
              : (data.message ?? "L’annulation n’a pas pu être enregistrée. Réessayez ou écrivez-nous."),
      );
      setEtat("erreur");
    } catch {
      setMessage("Connexion impossible. Vérifiez le réseau et réessayez.");
      setEtat("erreur");
    }
  }

  if (etat === "annulee") {
    return (
      <div role="status">
        <h1 style={h1}>{attente ? "Vous avez quitté la liste d’attente" : "Votre place est libérée"}</h1>
        <p style={p}>Merci de nous avoir prévenus. Un mail de confirmation vous est envoyé.</p>
      </div>
    );
  }

  if (etat === "deja") {
    return (
      <div role="status">
        <h1 style={h1}>Inscription déjà annulée</h1>
        <p style={p}>Cette inscription est déjà annulée. Vous n’avez rien d’autre à faire.</p>
      </div>
    );
  }

  return (
    <>
      <h1 style={h1}>Bonjour {prenom}</h1>
      <p style={p}>
        {attente
          ? `Vous êtes sur la liste d’attente pour « ${titre} », ${quand}.`
          : `Vous avez une place pour « ${titre} », ${quand}.`}
      </p>
      {etat === "erreur" && (
        <p role="alert" style={{ margin: "0 0 16px", padding: "12px 14px", borderRadius: "var(--r-s)", background: "rgba(158,68,51,.08)", color: "#9E4433", fontSize: 14.5 }}>
          {message}
        </p>
      )}
      <button
        type="button"
        disabled={etat === "envoi"}
        onClick={() => void annuler()}
        style={{
          padding: "15px 28px",
          borderRadius: "var(--r-pill)",
          border: "none",
          background: "#04A49B",
          color: "#fff",
          font: "inherit",
          fontSize: 16,
          fontWeight: 700,
          cursor: etat === "envoi" ? "default" : "pointer",
          opacity: etat === "envoi" ? 0.6 : 1,
        }}
      >
        {etat === "envoi" ? "Envoi…" : attente ? "Quitter la liste d’attente" : "Libérer ma place"}
      </button>
    </>
  );
}
