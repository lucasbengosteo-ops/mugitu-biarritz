"use client";

import { useRef, useState } from "react";
import { CalendarPlus, Copy } from "lucide-react";
import { Bouton, Carte, Champ, Message } from "@/components/admin/ui";
import { appeler } from "./rpc";

/**
 * « Ajouter à mon calendrier » : l'adresse privée qui abonne l'agenda
 * personnel (Google, iPhone, Outlook) à sa présence au cabinet.
 *
 * Le jeton n'est demandé qu'au clic : la fonction le crée à la première
 * demande. « Changer d'adresse » en tire un nouveau, ce qui coupe l'ancien.
 */

const SITE = "https://www.mugitu-biarritz.fr";

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
    <Carte titre="Mon calendrier">
      <p className="ad-agenda-texte" style={{ margin: "0 0 12px" }}>
        Vos demi-journées au cabinet dans votre propre agenda, sur les huit semaines à venir. Congés et échanges
        compris ; la mise à jour se fait seule.
      </p>

      {url === null ? (
        <Bouton icone={CalendarPlus} enCours={occupe} onClick={() => void obtenir(false)}>
          {occupe ? "Un instant…" : "Ajouter à mon calendrier"}
        </Bouton>
      ) : (
        <>
          <Champ label="Votre adresse privée" aide="Gardez-la pour vous : qui la connaît voit vos jours de présence.">
            {(attrs) => (
              <div className="ad-agenda-adresse">
                <input
                  {...attrs}
                  ref={champ}
                  type="text"
                  readOnly
                  value={url}
                  onFocus={(e) => e.currentTarget.select()}
                />
                <Bouton icone={Copy} onClick={() => void copier()}>
                  Copier
                </Bouton>
              </div>
            )}
          </Champ>

          <ul className="ad-agenda-aide">
            <li>
              <strong>Google Agenda</strong> (sur ordinateur) : « Autres agendas » → « À partir de l’URL », puis
              collez l’adresse.
            </li>
            <li>
              <strong>iPhone</strong> :{" "}
              <a href={url.replace(/^https?:\/\//, "webcal://")} className="ad-agenda-lien">
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
            <div role="group" aria-label="Changer d’adresse" className="ad-agenda-bloc ad-agenda-bloc--attente">
              <p className="ad-agenda-texte" style={{ margin: "0 0 10px" }}>
                Une nouvelle adresse sera créée et l’ancienne adresse cessera de fonctionner : les calendriers abonnés
                devront l’être à nouveau.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <Bouton enCours={occupe} onClick={() => void obtenir(true)}>
                  {occupe ? "Un instant…" : "Changer d’adresse"}
                </Bouton>
                <Bouton variante="secondaire" onClick={() => setConfirmer(false)}>
                  Annuler
                </Bouton>
              </div>
            </div>
          ) : (
            <Bouton variante="secondaire" onClick={() => setConfirmer(true)}>
              Changer d’adresse
            </Bouton>
          )}
        </>
      )}

      {/* `Message` porte son rôle (status ou alert) et paraît au moment du geste : il est annoncé. */}
      <div style={{ marginTop: info || erreur ? 12 : 0 }}>
        {erreur ? <Message ton="erreur">{erreur}</Message> : info ? <Message ton="succes">{info}</Message> : null}
      </div>
    </Carte>
  );
}
