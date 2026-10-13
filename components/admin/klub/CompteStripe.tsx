"use client";

import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { bouton, CARTE, TITRE_SECTION } from "./styles";

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

  return (
    <section style={CARTE}>
      <p style={TITRE_SECTION}>Encaisser en ligne</p>
      <p style={{ margin: "0 0 14px", fontSize: 13.5, color: "rgba(51,51,52,.7)" }}>
        L’argent des inscriptions arrive sur votre compte Stripe. Mugitu ne prend aucune part.
      </p>

      {etat === "chargement" && <p style={{ margin: 0, fontSize: 14, color: "rgba(51,51,52,.6)" }}>Chargement…</p>}

      {etat === "erreur" && <p style={{ margin: 0, fontSize: 14, color: "#9E4433" }}>État du compte Stripe indisponible pour le moment.</p>}

      {etat === "a_relier" && (
        <button type="button" disabled={occupe} onClick={() => void relier()} style={bouton("plein")}>
          Relier mon compte Stripe
        </button>
      )}

      {etat === "verification" && (
        <>
          <p style={{ margin: "0 0 10px", fontSize: 14, color: "#003850" }}>Stripe vérifie votre compte.</p>
          <button type="button" disabled={occupe} onClick={() => void relier()} style={bouton("contour")}>
            Reprendre la vérification
          </button>
        </>
      )}

      {etat === "pret" && (
        <p style={{ margin: 0, fontSize: 14, color: "#003850" }}>
          Les inscriptions à vos séances payantes se paient en ligne.
        </p>
      )}
    </section>
  );
}
