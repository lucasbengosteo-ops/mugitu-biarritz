"use client";

import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import AdminLogin from "./AdminLogin";
import AdminNav from "./AdminNav";
import KlubCreneaux from "./klub/KlubCreneaux";
import KlubMailsEnErreur from "./klub/KlubMailsEnErreur";
import KlubSeances from "./klub/KlubSeances";
import { bouton } from "./klub/styles";

/**
 * Back-office du Mugi Klub. La RLS ne donne aux praticiens que la lecture ;
 * chaque écriture passe par une fonction `klub_admin_*` qui vérifie leurs
 * droits et applique les règles de places et de mails.
 */

type Etat = "chargement" | "deconnecte" | "pret";
type Onglet = "seances" | "creneaux";

export default function KlubAdmin() {
  const [etat, setEtat] = useState<Etat>("chargement");
  const [onglet, setOnglet] = useState<Onglet>("seances");
  const [message, setMessage] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const verifier = useCallback(async () => {
    const { data } = await supabaseBrowser().auth.getSession();
    setEtat(data.session ? "pret" : "deconnecte");
  }, []);

  useEffect(() => {
    // Même motif que les autres back-offices : abonnement à la session, et
    // premier chargement par un timeout (lint React Compiler).
    const { data } = supabaseBrowser().auth.onAuthStateChange(() => {
      void verifier();
    });
    const initial = window.setTimeout(() => void verifier(), 0);
    return () => {
      data.subscription.unsubscribe();
      window.clearTimeout(initial);
    };
  }, [verifier]);

  const notifier = useCallback((m: string) => {
    setMessage(m);
    window.setTimeout(() => setMessage(null), 6000);
  }, []);

  const rafraichir = useCallback(() => setVersion((v) => v + 1), []);

  if (etat === "chargement") {
    return <p style={{ padding: 40, fontSize: 15, color: "rgba(51,51,52,.6)" }}>Chargement…</p>;
  }
  if (etat === "deconnecte") {
    return <AdminLogin titre="Mugi Klub" onSignedIn={() => void verifier()} />;
  }

  const ongletStyle = (o: Onglet): React.CSSProperties => ({
    ...bouton("contour", true),
    color: onglet === o ? "#003850" : "rgba(255,255,255,.75)",
    background: onglet === o ? "#fff" : "transparent",
    borderColor: "rgba(255,255,255,.3)",
  });

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
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={() => setOnglet("seances")} style={ongletStyle("seances")}>
            Séances
          </button>
          <button type="button" onClick={() => setOnglet("creneaux")} style={ongletStyle("creneaux")}>
            Créneaux
          </button>
        </div>
        <button
          type="button"
          onClick={() => void supabaseBrowser().auth.signOut()}
          style={{ ...bouton("contour", true), marginLeft: "auto", color: "#fff", borderColor: "rgba(255,255,255,.3)" }}
        >
          Se déconnecter
        </button>
      </header>

      {message && (
        <p role="status" style={{ margin: 0, padding: "12px clamp(16px,4vw,32px)", background: "rgba(4,164,155,.12)", color: "#036b66", fontSize: 14, fontWeight: 600 }}>
          {message}
        </p>
      )}

      <div style={{ padding: "clamp(16px,3vw,28px)", display: "flex", flexDirection: "column", gap: 20 }}>
        <KlubMailsEnErreur version={version} notifier={notifier} rafraichir={rafraichir} />
        {onglet === "seances" ? (
          <KlubSeances version={version} notifier={notifier} rafraichir={rafraichir} />
        ) : (
          <KlubCreneaux version={version} notifier={notifier} rafraichir={rafraichir} />
        )}
      </div>
    </div>
  );
}
