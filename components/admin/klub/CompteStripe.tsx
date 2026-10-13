"use client";

import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Bouton, Carte, Message } from "../ui";

type Etat = "chargement" | "a_relier" | "verification" | "pret" | "erreur";

type Props = { notifier: (m: string) => void };

async function jeton(): Promise<string | null> {
  const { data } = await supabaseBrowser().auth.getSession();
  return data.session?.access_token ?? null;
}

/**
 * Carte « Encaisser en ligne », en tête du Mugi Klub : chaque praticien y
 * relie son compte Stripe et suit son état. L'état vient des notifications
 * de Stripe (`account.updated`) côté serveur ; cette carte ne fait que les
 * refléter, au chargement et au retour du parcours Stripe.
 */
export default function CompteStripe({ notifier }: Props) {
  const [etat, setEtat] = useState<Etat>("chargement");
  const [occupe, setOccupe] = useState(false);

  const charger = useCallback(async () => {
    const t = await jeton();
    if (!t) return;
    const res = await fetch("/api/stripe/compte", { headers: { Authorization: `Bearer ${t}` }, cache: "no-store" });
    const corps = await res.json().catch(() => null);
    if (!res.ok || !corps?.ok) {
      setEtat("erreur");
      return;
    }
    setEtat(corps.etat as Etat);
  }, []);

  useEffect(() => {
    // Même motif que le reste de l'admin : le premier chargement passe par
    // un timeout (lint React Compiler), pas un `setState` dans le corps de l'effet.
    const initial = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(initial);
  }, [charger]);

  const relier = async () => {
    const t = await jeton();
    if (!t) return notifier("Session expirée : reconnectez-vous.");
    setOccupe(true);
    const res = await fetch("/api/stripe/compte", { method: "POST", headers: { Authorization: `Bearer ${t}` } });
    const corps = await res.json().catch(() => null);
    setOccupe(false);
    if (!res.ok || !corps?.ok || typeof corps.url !== "string") {
      notifier(corps?.message ?? "La liaison avec Stripe a échoué. Réessayez dans quelques instants.");
      return;
    }
    window.location.href = corps.url;
  };

  const texte: React.CSSProperties = { margin: 0, fontSize: 15, lineHeight: 1.5, color: "#003850" };

  return (
    <Carte titre="Encaisser en ligne">
      <p style={{ ...texte, margin: "-4px 0 14px", color: "rgba(0,56,80,.78)" }}>
        L’argent des inscriptions arrive sur votre compte Stripe. Mugitu ne prend aucune part.
      </p>

      {etat === "chargement" && <p style={{ ...texte, color: "rgba(0,56,80,.78)" }}>Chargement…</p>}

      {etat === "erreur" && <Message ton="erreur">État du compte Stripe indisponible pour le moment.</Message>}

      {etat === "a_relier" && (
        <Bouton enCours={occupe} onClick={() => void relier()}>
          Relier mon compte Stripe
        </Bouton>
      )}

      {etat === "verification" && (
        <>
          <p style={{ ...texte, margin: "0 0 10px" }}>Stripe vérifie votre compte.</p>
          <Bouton variante="secondaire" enCours={occupe} onClick={() => void relier()}>
            Reprendre la vérification
          </Bouton>
        </>
      )}

      {etat === "pret" && <p style={texte}>Les inscriptions à vos séances payantes se paient en ligne.</p>}
    </Carte>
  );
}
