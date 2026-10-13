"use client";

import { useRef, useState } from "react";
import { appeler } from "./rpc";

/**
 * « Ajouter à mon calendrier » : l'adresse privée qui abonne l'agenda
 * personnel (Google, iPhone, Outlook) à sa présence au cabinet.
 *
 * Le jeton n'est demandé qu'au clic : la fonction le crée à la première
 * demande. « Changer d'adresse » en tire un nouveau, ce qui coupe l'ancien.
 *
 * Styles en ligne sobres en attendant le socle commun du back-office.
 */

const SITE = "https://www.mugitu-biarritz.fr";

const BLEU = "#003850";
const SARCELLE = "#04A49B";
const GRIS = "rgba(0,56,80,.72)";

const BOUTON: React.CSSProperties = {
  minHeight: 44,
  padding: "0 16px",
  borderRadius: 999,
  border: `1px solid ${SARCELLE}`,
  background: SARCELLE,
  color: "#fff",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

const BOUTON_SECONDAIRE: React.CSSProperties = {
  ...BOUTON,
  background: "#fff",
  color: BLEU,
  border: "1px solid rgba(0,56,80,.25)",
};

/** L'adresse publique en production ; l'origine courante quand on essaie en local. */
function adresse(jeton: string): string {
  const { hostname, origin } = window.location;
  const local = hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".localhost");
  return `${local ? origin : SITE}/api/agenda/calendrier/${jeton}.ics`;
}

export default function AbonnementCalendrier() {
  const [url, setUrl] = useState<string | null>(null);
  const [occupe, setOccupe] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [confirmer, setConfirmer] = useState(false);
  const champ = useRef<HTMLInputElement>(null);

  async function obtenir(nouveau: boolean) {
    setOccupe(true);
    setErreur(null);
    setInfo(null);
    const r = await appeler<string>("agenda_mon_jeton_calendrier", { p_nouveau: nouveau });
    setOccupe(false);
    if (!r.ok || typeof r.data !== "string") {
      setErreur(r.ok ? "L’adresse n’a pas pu être créée." : r.message);
      return;
    }
    setUrl(adresse(r.data));
    setConfirmer(false);
    if (nouveau) setInfo("Nouvelle adresse créée. L’ancienne ne fonctionne plus.");
  }

  async function copier() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setInfo("Adresse copiée.");
    } catch {
      // Presse-papiers refusé (contexte non sécurisé, navigateur ancien) :
      // on sélectionne le texte, il reste à le copier soi-même.
      champ.current?.focus();
      champ.current?.select();
      setInfo("Adresse sélectionnée : copiez-la.");
    }
  }

  return (
    <section
      aria-labelledby="abonnement-calendrier-titre"
      style={{
        background: "#fff",
        border: "1px solid rgba(0,56,80,.12)",
        borderRadius: 14,
        padding: 16,
        margin: "0 0 16px",
        color: BLEU,
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <h2 id="abonnement-calendrier-titre" style={{ margin: "0 0 4px", fontSize: 16 }}>
        Mon calendrier
      </h2>
      <p style={{ margin: "0 0 12px", fontSize: 14, color: GRIS }}>
        Vos demi-journées au cabinet dans votre propre agenda, sur les huit semaines à venir. Congés et échanges
        compris ; la mise à jour se fait seule.
      </p>

      {url === null ? (
        <button type="button" onClick={() => void obtenir(false)} disabled={occupe} style={BOUTON}>
          {occupe ? "Un instant…" : "Ajouter à mon calendrier"}
        </button>
      ) : (
        <>
          <label htmlFor="abonnement-calendrier-adresse" style={{ display: "block", fontSize: 14, fontWeight: 600 }}>
            Votre adresse privée
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "6px 0 8px" }}>
            <input
              id="abonnement-calendrier-adresse"
              ref={champ}
              type="text"
              readOnly
              value={url}
              onFocus={(e) => e.currentTarget.select()}
              style={{
                flex: "1 1 240px",
                minWidth: 0,
                minHeight: 44,
                padding: "0 12px",
                borderRadius: 10,
                border: "1px solid rgba(0,56,80,.25)",
                background: "#FDF8F4",
                color: BLEU,
                fontSize: 14,
                fontFamily: "inherit",
              }}
            />
            <button type="button" onClick={() => void copier()} style={BOUTON}>
              Copier
            </button>
          </div>
          <p style={{ margin: "0 0 12px", fontSize: 12, color: GRIS }}>
            Gardez-la pour vous : qui la connaît voit vos jours de présence.
          </p>

          <ul style={{ margin: "0 0 14px", paddingLeft: 18, fontSize: 14, lineHeight: 1.5 }}>
            <li>
              <strong>Google Agenda</strong> (sur ordinateur) : « Autres agendas » → « À partir de l’URL », puis
              collez l’adresse.
            </li>
            <li>
              <strong>iPhone</strong> :{" "}
              <a href={url.replace(/^https?:\/\//, "webcal://")} style={{ color: SARCELLE, fontWeight: 600 }}>
                touchez ce lien
              </a>
              , puis « S’abonner ».
            </li>
            <li>
              <strong>Outlook</strong> : « Ajouter un calendrier » → « S’abonner à partir du web », puis collez
              l’adresse.
            </li>
          </ul>

          {confirmer ? (
            <div
              role="group"
              aria-label="Changer d’adresse"
              style={{ background: "rgba(243,190,121,.18)", borderRadius: 10, padding: 12 }}
            >
              <p style={{ margin: "0 0 10px", fontSize: 14 }}>
                Une nouvelle adresse sera créée et l’ancienne adresse cessera de fonctionner : les calendriers
                abonnés devront l’être à nouveau.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <button type="button" onClick={() => void obtenir(true)} disabled={occupe} style={BOUTON}>
                  {occupe ? "Un instant…" : "Changer d’adresse"}
                </button>
                <button type="button" onClick={() => setConfirmer(false)} style={BOUTON_SECONDAIRE}>
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmer(true)} style={BOUTON_SECONDAIRE}>
              Changer d’adresse
            </button>
          )}
        </>
      )}

      <p role="status" style={{ margin: info || erreur ? "10px 0 0" : 0, fontSize: 14 }}>
        {erreur ? <span style={{ color: "#9E4433" }}>{erreur}</span> : info}
      </p>
    </section>
  );
}
