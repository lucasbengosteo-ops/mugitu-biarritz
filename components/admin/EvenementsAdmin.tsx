"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import { useAccesCourant } from "@/lib/admin/acces";
import { ECHEANCE_JEUX_ALBA, EVENEMENTS } from "@/lib/evenements";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Badge, Bouton, Carte, Message, Page, type TonMessage } from "./ui";

/**
 * Annuaire des événements. Lecture pour toute l'équipe ; la suppression des
 * données des jeux est réservée aux super-admins, et la base le vérifie.
 */

type EtatJeux = { participants: number; scores: number; tirages: number };

export default function EvenementsAdmin() {
  const acces = useAccesCourant();
  const [jeux, setJeux] = useState<EtatJeux | null>(null);
  const [message, setMessage] = useState<{ ton: TonMessage; texte: string } | null>(null);
  const [occupe, setOccupe] = useState(false);

  const charger = useCallback(async () => {
    const { data, error } = await supabaseBrowser().rpc("site_jeux_alba_etat");
    if (error) {
      setMessage({ ton: "erreur", texte: `État des jeux illisible : ${error.message}` });
      return;
    }
    setJeux(data as EtatJeux);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(t);
  }, [charger]);

  const supprimer = async () => {
    if (!jeux) return;
    const total = jeux.participants + jeux.scores + jeux.tirages;
    if (!window.confirm(`Supprimer définitivement les ${total} lignes des jeux de l’Alba ? Cette action est irréversible.`)) return;
    setOccupe(true);
    const { error } = await supabaseBrowser().rpc("site_supprimer_jeux_alba");
    setOccupe(false);
    if (error) {
      setMessage({ ton: "erreur", texte: `Suppression refusée : ${error.message}` });
      return;
    }
    setMessage({ ton: "succes", texte: "Données des jeux supprimées." });
    await charger();
  };

  const mention: React.CSSProperties = { margin: 0, fontSize: 15, lineHeight: 1.5, color: "rgba(0,56,80,.78)" };

  return (
    <Page
      titre="Événements"
      intro="Les stands passés et leurs outils. Une entrée s’ajoute dans le code, au moment où un nouveau stand se prépare."
    >
      <div style={{ maxWidth: 820, display: "flex", flexDirection: "column", gap: 16 }}>
        {message && <Message ton={message.ton}>{message.texte}</Message>}

        {EVENEMENTS.map((e) => (
          <Carte key={e.id} titre={e.nom}>
            <p className="ad-rangee" style={{ margin: "-6px 0 0", fontSize: 14, color: "rgba(0,56,80,.78)" }}>
              <span>{e.dates}</span>
              {e.passe && <Badge ton="neutre">Passé</Badge>}
            </p>
            <p style={{ margin: "10px 0 14px", fontSize: 15, lineHeight: 1.6, color: "#003850" }}>{e.resume}</p>

            <div className="ad-rangee">
              {e.liens.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ad-bouton ad-bouton--secondaire ad-bouton--petite"
                >
                  {l.label}
                  <ExternalLink aria-hidden="true" size={16} />
                  <span className="sr-only">(nouvel onglet)</span>
                </a>
              ))}
            </div>

            {e.donnees === "jeux-alba" && (
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(0,56,80,.1)" }}>
                {jeux === null ? (
                  <p style={mention}>Lecture de l’état des données…</p>
                ) : jeux.participants + jeux.scores + jeux.tirages === 0 ? (
                  <p style={mention}>Les données des jeux ont été supprimées, comme l’annonçait le règlement.</p>
                ) : (
                  <>
                    <p style={{ margin: "0 0 6px", fontSize: 15, color: "#003850" }}>
                      {jeux.participants} participants, {jeux.scores} scores, {jeux.tirages} tirages encore en base.
                    </p>
                    <p style={{ margin: "0 0 12px", fontSize: 14, color: "#8a5a10" }}>
                      Le règlement annonce leur suppression au plus tard le {ECHEANCE_JEUX_ALBA}.
                    </p>
                    {acces.estSuperAdmin && (
                      <Bouton variante="danger" icone={Trash2} enCours={occupe} onClick={() => void supprimer()}>
                        Supprimer les données des jeux
                      </Bouton>
                    )}
                  </>
                )}
              </div>
            )}
          </Carte>
        ))}
      </div>
    </Page>
  );
}
