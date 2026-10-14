"use client";

import { useCallback, useRef, useState } from "react";
import CompteStripe from "./klub/CompteStripe";
import KlubCreneaux from "./klub/KlubCreneaux";
import KlubMailsEnErreur from "./klub/KlubMailsEnErreur";
import KlubRemboursementsEnErreur from "./klub/KlubRemboursementsEnErreur";
import KlubSeances from "./klub/KlubSeances";
import { Message, Onglets, Page, ongletId } from "./ui";

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

  return (
    <Page titre="Mugi Klub" intro="Les séances du Klub, leurs inscrits, et les créneaux qui reviennent chaque semaine.">
      <div className="ad-annonce">
        {message ? (
          <div>
            <Message ton="info">{message}</Message>
          </div>
        ) : null}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <CompteStripe notifier={notifier} />
        <KlubMailsEnErreur version={version} notifier={notifier} rafraichir={rafraichir} />
        <KlubRemboursementsEnErreur version={version} notifier={notifier} />
        <div>
          <Onglets
            label="Mugi Klub"
            panneauId="klub-panneau"
            onglets={[
              { id: "seances", label: "Séances" },
              { id: "creneaux", label: "Créneaux" },
            ]}
            actif={onglet}
            onChange={setOnglet}
          />
          <div id="klub-panneau" role="tabpanel" aria-labelledby={ongletId("klub-panneau", onglet)}>
            {onglet === "seances" ? (
              <KlubSeances version={version} notifier={notifier} rafraichir={rafraichir} />
            ) : (
              <KlubCreneaux version={version} notifier={notifier} rafraichir={rafraichir} />
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}
