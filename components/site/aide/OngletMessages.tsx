"use client";

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import Link from "next/link";
import { Compass, SendHorizontal } from "lucide-react";
import { QUESTION_MAX, type ReponseAide } from "@/lib/aide/types";
import { TEXTE_MAX, demandeZone, type Reponses } from "@/lib/orientation/types";
import { ROUTES } from "@/lib/routes";
import { demanderOrientation } from "../orientation/envoi";
import {
  etapeSuivante,
  historique,
  nouvelId,
  type Conversation,
  type EtapeOrientation,
  type EtatOrientation,
  type Message,
} from "./conversation";
import { poserQuestion, voter } from "./envoi";
import OrientationChat from "./OrientationChat";

export const QUESTION_ORIENTATION = "Je ne sais pas qui consulter";

const QUESTIONS_PRETES = [
  QUESTION_ORIENTATION,
  "Faut-il une ordonnance ?",
  "Est-ce remboursé ?",
  "Comment venir au cabinet ?",
  "C’est quoi le Mugi Klub ?",
];

export default function OngletMessages({
  conv,
  setConv,
  consentement,
  setConsentement,
  lancerOrientation,
}: {
  conv: Conversation;
  setConv: Dispatch<SetStateAction<Conversation>>;
  consentement: boolean;
  setConsentement: (v: boolean) => void;
  /** Démarre « Par où commencer ? » dans la discussion. */
  lancerOrientation: (texteVisiteur?: string) => void;
}) {
  const [saisie, setSaisie] = useState("");
  const liste = useRef<HTMLDivElement>(null);
  const champ = useRef<HTMLTextAreaElement>(null);
  const etapeTexte = conv.orientation?.etape === "texte";

  // Chaque nouveau message : la liste descend en bas ; si le focus a été
  // perdu (la pastille touchée a disparu), il va à la première réponse
  // proposée, ou au champ de saisie.
  const nb = conv.messages.length;
  useEffect(() => {
    const el = liste.current;
    if (!el) return;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: reduit ? "auto" : "smooth" });
    const actif = document.activeElement;
    if (nb > 0 && (!actif || actif === document.body)) {
      const pastille = el.querySelector<HTMLButtonElement>("[data-wa-reponse]");
      (pastille ?? champ.current)?.focus({ preventScroll: true });
    }
  }, [nb, conv.attente]);

  function reponses(o: EtatOrientation, signes: boolean, texte: string): Reponses | null {
    if (!o.motif) return null;
    const avecZone = demandeZone(o.motif);
    return {
      motif: o.motif,
      zone: avecZone ? o.zone : null,
      anciennete: avecZone ? o.anciennete : null,
      sport: o.sport,
      signes,
      texte: signes ? "" : texte.trim().slice(0, TEXTE_MAX),
      depuis: null,
      consentement,
    };
  }

  function choisir(etape: EtapeOrientation, id: string, label: string) {
    const o = conv.orientation;
    if (!o || o.etape !== etape) return;
    const visiteur: Message = { id: nouvelId(), de: "visiteur", texte: label };
    if (etape === "signes" && id === "oui") {
      // L'alerte s'affiche tout de suite ; les réponses partent quand même,
      // pour la mesure, sans attendre.
      setConv((c) => ({
        ...c,
        orientation: null,
        messages: [...c.messages, visiteur, { id: nouvelId(), de: "cabinet", genre: "orientation-alerte" }],
      }));
      const r = reponses(o, true, "");
      if (r) void demanderOrientation(r);
      return;
    }
    let suite: EtatOrientation;
    switch (etape) {
      case "motif":
        suite = { ...o, motif: id as EtatOrientation["motif"], etape: etapeSuivante("motif", id as NonNullable<EtatOrientation["motif"]>) };
        break;
      case "zone":
        suite = { ...o, zone: id as EtatOrientation["zone"], etape: "anciennete" };
        break;
      case "anciennete":
        suite = { ...o, anciennete: id as EtatOrientation["anciennete"], etape: "sport" };
        break;
      case "sport":
        suite = { ...o, sport: id as EtatOrientation["sport"], etape: o.motif ? etapeSuivante("sport", o.motif) : "texte" };
        break;
      default:
        suite = { ...o, etape: "texte" };
    }
    setConv((c) => ({
      ...c,
      orientation: suite,
      messages: [...c.messages, visiteur, { id: nouvelId(), de: "cabinet", genre: "orientation-question", etape: suite.etape }],
    }));
  }

  async function envoyerOrientation(texte: string) {
    const o = conv.orientation;
    const r = o ? reponses(o, false, texte) : null;
    if (!r) return;
    const visiteur: Message[] = texte.trim() ? [{ id: nouvelId(), de: "visiteur", texte: texte.trim() }] : [];
    setConv((c) => ({ ...c, orientation: null, attente: true, messages: [...c.messages, ...visiteur] }));
    const res = await demanderOrientation(r);
    let m: Message;
    if (res === "trop") m = { id: nouvelId(), de: "cabinet", genre: "orientation-trop" };
    else if (res === null || (res.etat !== "alerte" && res.cartes.length === 0))
      m = { id: nouvelId(), de: "cabinet", genre: "orientation-panne" };
    else if (res.etat === "alerte") m = { id: nouvelId(), de: "cabinet", genre: "orientation-alerte" };
    else m = { id: nouvelId(), de: "cabinet", genre: "orientation-resultat", resultat: res };
    setConv((c) => ({ ...c, attente: false, messages: [...c.messages, m] }));
  }

  async function poser(brut: string) {
    const texte = brut.trim().slice(0, QUESTION_MAX);
    if (!texte || conv.attente) return;
    setSaisie("");
    if (etapeTexte) {
      void envoyerOrientation(texte);
      return;
    }
    if (texte === QUESTION_ORIENTATION) {
      lancerOrientation(texte);
      return;
    }
    const hist = historique(conv.messages);
    // Une question écrite pendant le parcours l'interrompt.
    setConv((c) => ({
      ...c,
      orientation: null,
      attente: true,
      messages: [...c.messages, { id: nouvelId(), de: "visiteur", texte }],
    }));
    const r = await poserQuestion(texte, consentement, hist);
    const m: Message =
      r === "trop"
        ? { id: nouvelId(), de: "cabinet", genre: "trop" }
        : r === null
          ? { id: nouvelId(), de: "cabinet", genre: "panne" }
          : { id: nouvelId(), de: "cabinet", genre: "aide", question: texte, reponse: r, vote: null };
    setConv((c) => ({ ...c, attente: false, messages: [...c.messages, m] }));
  }

  function noter(id: number, utile: boolean) {
    const m = conv.messages.find((x) => x.id === id);
    if (!m || m.de !== "cabinet" || m.genre !== "aide" || m.vote !== null) return;
    voter(m.reponse.id, utile);
    setConv((c) => ({
      ...c,
      messages: c.messages.map((x) => (x.id === id && x.de === "cabinet" && x.genre === "aide" ? { ...x, vote: utile } : x)),
    }));
  }

  // La dernière question d'orientation posée est celle qui attend sa réponse.
  let derniereQuestion = -1;
  if (conv.orientation) {
    for (const m of conv.messages) {
      if (m.de === "cabinet" && m.genre === "orientation-question") derniereQuestion = m.id;
    }
  }

  return (
    <div className="wa-messages">
      <div ref={liste} className="wa-fil" aria-live="polite" aria-busy={conv.attente}>
        <div className="wa-ligne wa-ligne--cabinet">
          <div className="wa-bulle-msg wa-bulle-msg--cabinet">
            <p>Comment pouvons-nous vous aider&nbsp;?</p>
          </div>
        </div>

        {conv.messages.length === 0 && (
          <div className="wa-pastilles" role="group" aria-label="Questions fréquentes">
            {QUESTIONS_PRETES.map((q) => (
              <button key={q} type="button" className="wa-pastille" onClick={() => void poser(q)}>
                {q}
              </button>
            ))}
          </div>
        )}

        {conv.messages.map((m) => {
          if (m.de === "visiteur") {
            return (
              <div key={m.id} className="wa-ligne wa-ligne--visiteur">
                <div className="wa-bulle-msg wa-bulle-msg--visiteur">
                  <p>{m.texte}</p>
                </div>
              </div>
            );
          }
          switch (m.genre) {
            case "aide":
              return (
                <ReponseCabinet
                  key={m.id}
                  reponse={m.reponse}
                  vote={m.vote}
                  onVoter={(utile) => noter(m.id, utile)}
                  onOrienter={() => lancerOrientation()}
                />
              );
            case "panne":
              return (
                <div key={m.id} className="wa-ligne wa-ligne--cabinet">
                  <div className="wa-bulle-msg wa-bulle-msg--cabinet">
                    <p>Le service ne répond pas pour le moment.</p>
                  </div>
                </div>
              );
            case "trop":
              return (
                <div key={m.id} className="wa-ligne wa-ligne--cabinet">
                  <div className="wa-bulle-msg wa-bulle-msg--cabinet">
                    <p>Trop de questions depuis cette connexion. Réessayez dans une heure.</p>
                  </div>
                </div>
              );
            default:
              return (
                <OrientationChat
                  key={m.id}
                  message={m}
                  actif={m.id === derniereQuestion}
                  onChoisir={choisir}
                  onPasser={() => void envoyerOrientation("")}
                  onRecommencer={() => lancerOrientation()}
                />
              );
          }
        })}

        {conv.attente && (
          <div className="wa-ligne wa-ligne--cabinet">
            <div className="wa-bulle-msg wa-bulle-msg--cabinet wa-attente">
              <span className="wa-sr">Réponse en cours</span>
              <span className="wa-points" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </div>
          </div>
        )}
      </div>

      <form
        className="wa-saisie"
        onSubmit={(e) => {
          e.preventDefault();
          void poser(saisie);
        }}
      >
        <div className="wa-saisie-ligne">
          <label htmlFor="wa-question" className="wa-sr">
            {etapeTexte ? "Ce qui vous gêne, en quelques mots" : "Votre question"}
          </label>
          <textarea
            ref={champ}
            id="wa-question"
            className="wa-champ"
            rows={1}
            maxLength={QUESTION_MAX}
            value={saisie}
            placeholder={etapeTexte ? "En quelques mots…" : "Votre question…"}
            aria-describedby="wa-mention"
            onChange={(e) => setSaisie(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                void poser(saisie);
              }
            }}
          />
          <button
            type="submit"
            className="wa-envoyer"
            aria-label="Envoyer"
            disabled={conv.attente || saisie.trim() === ""}
          >
            <SendHorizontal aria-hidden="true" size={20} />
          </button>
        </div>
        <p id="wa-mention" className="wa-mention">
          Ne donnez pas votre nom ni vos coordonnées.
        </p>
        <div className="wa-consentement">
          <input
            id="wa-consentement"
            type="checkbox"
            checked={consentement}
            onChange={(e) => setConsentement(e.target.checked)}
          />
          <p>
            <label htmlFor="wa-consentement">Aider Mugitu à améliorer l’outil</label>&nbsp;: mes questions sont
            gardées 90&nbsp;jours, sans mon nom. <Link href={ROUTES.confidentialite}>Confidentialité</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

/** Une réponse du cabinet, selon son type. */
function ReponseCabinet({
  reponse,
  vote,
  onVoter,
  onOrienter,
}: {
  reponse: ReponseAide;
  vote: boolean | null;
  onVoter: (utile: boolean) => void;
  onOrienter: () => void;
}) {
  if (reponse.type === "alerte" || reponse.type === "detresse") {
    const numeros = reponse.type === "alerte" ? ["15", "112"] : ["3114", "15"];
    return (
      <div className="wa-ligne wa-ligne--cabinet">
        <div className="wa-encadre" role="alert">
          <p>{reponse.texte}</p>
          <div className="wa-appels">
            {numeros.map((n) => (
              <a key={n} href={`tel:${n}`} className="wa-appel">
                Appeler le {n}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const sources =
    reponse.sources.length > 0
      ? reponse.sources
      : reponse.type === "inconnu"
        ? [
            { titre: "Questions fréquentes", lien: ROUTES.faq },
            { titre: "Nous contacter", lien: ROUTES.contact },
          ]
        : [];

  return (
    <div className="wa-ligne wa-ligne--cabinet">
      <div className="wa-bulle-msg wa-bulle-msg--cabinet">
        <p>{reponse.texte}</p>
        {(reponse.type === "medical" || reponse.type === "orientation") && (
          <button type="button" className="wa-bouton" onClick={onOrienter}>
            <Compass aria-hidden="true" size={18} />
            Trouver qui consulter
          </button>
        )}
        {sources.length > 0 && (
          <div className="wa-sources">
            {reponse.type === "reponse" && <p className="wa-sources-titre">Source&nbsp;:</p>}
            <ul>
              {sources.map((s) => (
                <li key={s.lien + s.titre}>
                  <Link href={s.lien}>{s.titre}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {reponse.type === "reponse" && (
          <div className="wa-vote">
            {vote === null ? (
              <>
                <span>Cette réponse vous a aidé&nbsp;?</span>
                <button type="button" className="wa-vote-bouton" onClick={() => onVoter(true)}>
                  Oui
                </button>
                <span aria-hidden="true">·</span>
                <button type="button" className="wa-vote-bouton" onClick={() => onVoter(false)}>
                  Non
                </button>
              </>
            ) : (
              <span role="status">Merci</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
