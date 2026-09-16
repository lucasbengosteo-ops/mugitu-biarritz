"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ERREURS } from "@/lib/klub/erreurs";
import { rang } from "@/lib/klub/format";
import { verifierCoordonnees } from "@/lib/klub/validation";
import { ROUTES } from "@/lib/routes";

/**
 * Formulaire d'inscription à une séance. Pas de compte : prénom, nom,
 * e-mail, téléphone. Le mail de confirmation porte le lien d'annulation.
 */

const BLEU = "#003850";
const TEAL = "#04A49B";

const champ: React.CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: "var(--r-s)",
  border: "1px solid rgba(0,56,80,.18)",
  background: "#fff",
  color: BLEU,
  font: "inherit",
  fontSize: 16, // en dessous, iOS zoome sur le champ
};

const label: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: BLEU, marginBottom: 7 };

const erreurChampStyle: React.CSSProperties = { margin: "6px 0 0", fontSize: 12.5, lineHeight: 1.5, color: "#9E4433" };

type Resultat = { statut: "confirmee" | "attente"; rang: number | null };
type ChampCoordonnees = "prenom" | "nom" | "email" | "telephone";

export default function KlubFormulaire({
  seanceId,
  quand,
  complet,
  prix,
  promotionPossible,
}: {
  seanceId: string;
  quand: string;
  complet: boolean;
  prix: string;
  promotionPossible: boolean;
}) {
  const router = useRouter();
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [premiere, setPremiere] = useState(false);
  const [piege, setPiege] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const [champErreurs, setChampErreurs] = useState<Partial<Record<ChampCoordonnees, string>>>({});
  const [resultat, setResultat] = useState<Resultat | null>(null);
  const id = useId();

  const prenomRef = useRef<HTMLInputElement>(null);
  const nomRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const telephoneRef = useRef<HTMLInputElement>(null);
  const succesRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (resultat) succesRef.current?.focus();
  }, [resultat]);

  function effacerErreurChamp(c: ChampCoordonnees) {
    setChampErreurs((courant) => {
      if (!(c in courant)) return courant;
      const copie = { ...courant };
      delete copie[c];
      return copie;
    });
  }

  async function valider(e: React.FormEvent) {
    e.preventDefault();
    if (envoi) return;
    const code = verifierCoordonnees({ prenom, nom, email, telephone });
    if (code) {
      if (code === "KLUB_NOM") {
        if (!nom.trim()) {
          setChampErreurs({ nom: ERREURS.KLUB_NOM });
          nomRef.current?.focus();
        } else {
          setChampErreurs({ prenom: ERREURS.KLUB_NOM });
          prenomRef.current?.focus();
        }
      } else if (code === "KLUB_EMAIL") {
        setChampErreurs({ email: ERREURS.KLUB_EMAIL });
        emailRef.current?.focus();
      } else if (code === "KLUB_TELEPHONE") {
        setChampErreurs({ telephone: ERREURS.KLUB_TELEPHONE });
        telephoneRef.current?.focus();
      }
      setErreur("");
      return;
    }

    setChampErreurs({});
    setErreur("");
    setEnvoi(true);
    try {
      const res = await fetch("/api/klub/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seance: seanceId, prenom, nom, email, telephone, premiere, site: piege }),
      });
      const data = (await res.json().catch(() => ({}))) as Partial<Resultat> & { ok?: boolean; message?: string };
      if (res.ok && data.ok && data.statut) {
        setResultat({ statut: data.statut, rang: data.rang ?? null });
        router.refresh();
      } else {
        setErreur(data.message ?? "L’inscription n’a pas pu être enregistrée.");
      }
    } catch {
      setErreur("Connexion impossible. Vérifiez le réseau et réessayez.");
    } finally {
      setEnvoi(false);
    }
  }

  function autrePersonne() {
    setResultat(null);
    setPrenom("");
    setNom("");
    setEmail("");
    setTelephone("");
    setPremiere(false);
  }

  if (resultat) {
    const confirmee = resultat.statut === "confirmee";
    return (
      <div role="status">
        <p style={{ margin: "0 0 8px", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 700, color: TEAL }}>
          {confirmee ? "Place réservée" : "Liste d’attente"}
        </p>
        <h2
          ref={succesRef}
          tabIndex={-1}
          style={{ margin: "0 0 14px", fontSize: "var(--h3-l)", fontWeight: 700, color: BLEU, lineHeight: 1.25, outline: "none" }}
        >
          {confirmee ? `C’est noté pour ${quand}` : `Vous êtes ${rang(resultat.rang ?? 1)} sur la liste d’attente`}
        </h2>
        <p style={{ margin: "0 0 22px", fontSize: 15, lineHeight: 1.6, color: "rgba(51,51,52,.75)" }}>
          {confirmee
            ? `Un mail de confirmation part vers ${email.trim()}, avec le lien pour libérer votre place si besoin. Le paiement se fait sur place.`
            : `Si une place se libère plus de deux heures avant le début, elle vous revient et vous recevez un mail. Un mail de confirmation part vers ${email.trim()}.`}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link
            href={`${ROUTES.klub}#planning`}
            style={{ padding: "13px 22px", borderRadius: "var(--r-pill)", background: TEAL, color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none" }}
          >
            Voir les autres séances
          </Link>
          <button
            type="button"
            onClick={autrePersonne}
            style={{ padding: "13px 22px", borderRadius: "var(--r-pill)", border: "1px solid rgba(0,56,80,.2)", background: "#fff", color: BLEU, font: "inherit", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
          >
            Inscrire une autre personne
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={valider} noValidate>
      {complet && (
        <p style={{ margin: "0 0 18px", padding: "12px 14px", borderRadius: "var(--r-m)", background: "rgba(243,190,121,.2)", color: "#8a5a10", fontSize: 14, lineHeight: 1.5 }}>
          {promotionPossible
            ? "La séance est complète : vous serez inscrit·e sur la liste d’attente."
            : "La séance est complète et commence dans moins de deux heures : une place libérée ne sera plus attribuée automatiquement."}
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 14 }}>
        <div>
          <label htmlFor={`${id}-prenom`} style={label}>Prénom</label>
          <input
            id={`${id}-prenom`}
            ref={prenomRef}
            autoComplete="given-name"
            value={prenom}
            onChange={(e) => {
              setPrenom(e.target.value);
              effacerErreurChamp("prenom");
            }}
            aria-invalid={champErreurs.prenom ? true : undefined}
            aria-describedby={champErreurs.prenom ? `${id}-prenom-err` : undefined}
            style={champ}
          />
          {champErreurs.prenom && (
            <p id={`${id}-prenom-err`} role="alert" style={erreurChampStyle}>
              {champErreurs.prenom}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-nom`} style={label}>Nom</label>
          <input
            id={`${id}-nom`}
            ref={nomRef}
            autoComplete="family-name"
            value={nom}
            onChange={(e) => {
              setNom(e.target.value);
              effacerErreurChamp("nom");
            }}
            aria-invalid={champErreurs.nom ? true : undefined}
            aria-describedby={champErreurs.nom ? `${id}-nom-err` : undefined}
            style={champ}
          />
          {champErreurs.nom && (
            <p id={`${id}-nom-err`} role="alert" style={erreurChampStyle}>
              {champErreurs.nom}
            </p>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label htmlFor={`${id}-email`} style={label}>E-mail</label>
        <input
          id={`${id}-email`}
          ref={emailRef}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            effacerErreurChamp("email");
          }}
          aria-invalid={champErreurs.email ? true : undefined}
          aria-describedby={champErreurs.email ? `${id}-email-err` : undefined}
          style={champ}
        />
        {champErreurs.email && (
          <p id={`${id}-email-err`} role="alert" style={erreurChampStyle}>
            {champErreurs.email}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 18 }}>
        <label htmlFor={`${id}-tel`} style={label}>Téléphone</label>
        <input
          id={`${id}-tel`}
          ref={telephoneRef}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={telephone}
          onChange={(e) => {
            setTelephone(e.target.value);
            effacerErreurChamp("telephone");
          }}
          aria-invalid={champErreurs.telephone ? true : undefined}
          aria-describedby={champErreurs.telephone ? `${id}-tel-err` : undefined}
          style={champ}
        />
        {champErreurs.telephone && (
          <p id={`${id}-tel-err`} role="alert" style={erreurChampStyle}>
            {champErreurs.telephone}
          </p>
        )}
        <p style={{ margin: "7px 0 0", fontSize: 12.5, color: "rgba(51,51,52,.55)" }}>Pour vous joindre en cas d’imprévu le jour même.</p>
      </div>

      <label style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={premiere}
          onChange={(e) => setPremiere(e.target.checked)}
          style={{ width: 20, height: 20, marginTop: 1, accentColor: TEAL, flex: "0 0 auto" }}
        />
        <span style={{ fontSize: 14.5, lineHeight: 1.5, color: BLEU }}>C’est ma première séance au Klub</span>
      </label>

      {/* Champ piège : jamais affiché, jamais annoncé aux lecteurs d'écran. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <input
          type="text"
          name="site"
          tabIndex={-1}
          autoComplete="off"
          value={piege}
          onChange={(e) => setPiege(e.target.value)}
        />
      </div>

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
          padding: "16px 20px",
          border: "none",
          borderRadius: "var(--r-pill)",
          background: TEAL,
          color: "#fff",
          font: "inherit",
          fontSize: 16,
          fontWeight: 700,
          cursor: envoi ? "default" : "pointer",
          opacity: envoi ? 0.6 : 1,
        }}
      >
        {envoi ? "Envoi…" : complet ? "Rejoindre la liste d’attente" : "Réserver ma place"}
      </button>

      <p style={{ margin: "14px 0 0", fontSize: 12.5, lineHeight: 1.6, color: "rgba(51,51,52,.55)" }}>
        Le paiement se fait sur place{prix ? ` (${prix})` : ""}. Vos coordonnées servent uniquement à organiser la séance :{" "}
        <Link href={ROUTES.confidentialite} style={{ color: TEAL, fontWeight: 600 }}>
          politique de confidentialité
        </Link>
        .
      </p>
    </form>
  );
}
