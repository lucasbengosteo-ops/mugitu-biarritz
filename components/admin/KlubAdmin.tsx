"use client";

import { useCallback, useRef, useState } from "react";
import KlubCreneaux from "./klub/KlubCreneaux";
import KlubMailsEnErreur from "./klub/KlubMailsEnErreur";
import KlubSeances from "./klub/KlubSeances";
import { bouton } from "./klub/styles";

/**
 * Back-office du Mugi Klub. La RLS ne donne aux praticiens que la lecture ;
 * chaque écriture passe par une fonction `klub_admin_*` qui vérifie leurs
 * droits et applique les règles de places et de mails.
 */

type Onglet = "seances" | "creneaux";

export default function KlubAdmin() {
  const [onglet, setOnglet] = useState<Onglet>("seances");
  const [message, setMessage] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const minuterieMessage = useRef<number | null>(null);

  const notifier = useCallback((m: string) => {
    setMessage(m);
    // Un nouveau message repart pour 6 s : l'ancien délai ne doit pas l'effacer.
    if (minuterieMessage.current !== null) window.clearTimeout(minuterieMessage.current);
    minuterieMessage.current = window.setTimeout(() => setMessage(null), 6000);
  }, []);

  const rafraichir = useCallback(() => setVersion((v) => v + 1), []);

  const ongletStyle = (o: Onglet): React.CSSProperties => ({
    ...bouton("contour", true),
    color: onglet === o ? "#04A49B" : "#003850",
    background: onglet === o ? "rgba(4,164,155,.12)" : "transparent",
    borderColor: onglet === o ? "rgba(4,164,155,.4)" : "rgba(0,56,80,.18)",
  });

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "clamp(14px,3vw,24px) clamp(14px,3vw,24px) 0" }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#003850" }}>Mugi Klub</h1>
        <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
          <button type="button" onClick={() => setOnglet("seances")} aria-pressed={onglet === "seances"} style={ongletStyle("seances")}>
            Séances
          </button>
          <button type="button" onClick={() => setOnglet("creneaux")} aria-pressed={onglet === "creneaux"} style={ongletStyle("creneaux")}>
            Créneaux
          </button>
        </div>
      </div>

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
    </>
  );
}
