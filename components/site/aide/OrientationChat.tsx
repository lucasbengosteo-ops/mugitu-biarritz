"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Phone, RotateCcw } from "lucide-react";
import {
  ANCIENNETES,
  MOTIFS,
  SIGNES_ALERTE,
  SPORTS_CHOIX,
  ZONES,
  type Carte,
  type ReponseOrientation,
} from "@/lib/orientation/types";
import { EXTERNAL, ROUTES } from "@/lib/routes";
import { noterClic } from "../orientation/envoi";
import type { EtapeOrientation, Message } from "./conversation";

/**
 * « Par où commencer ? » dans la discussion : chaque question arrive en
 * message du cabinet, les réponses sont des pastilles. L'enchaînement est
 * celui de la section de l'accueil (`etapeSuivante`), la route la même.
 */

export const OUI_NON = [
  { id: "oui", label: "Oui, au moins un de ces signes" },
  { id: "non", label: "Non, aucun" },
] as const;

const QUESTIONS: Record<EtapeOrientation, string> = {
  motif: "Qu’est-ce qui vous amène ?",
  zone: "Où avez-vous mal ?",
  anciennete: "Depuis quand ?",
  sport: "Quel sport pratiquez-vous ?",
  signes: "Avez-vous l’un de ces signes ?",
  texte: "En quelques mots (facultatif) : ce qui vous gêne, depuis quand, ce que vous aimeriez reprendre.",
};

export function optionsDe(etape: EtapeOrientation): readonly { id: string; label: string }[] {
  switch (etape) {
    case "motif":
      return MOTIFS;
    case "zone":
      return ZONES;
    case "anciennete":
      return ANCIENNETES;
    case "sport":
      return SPORTS_CHOIX;
    case "signes":
      return OUI_NON;
    default:
      return [];
  }
}

type MessageOrientation = Extract<
  Message,
  { genre: "orientation-question" | "orientation-alerte" | "orientation-panne" | "orientation-trop" | "orientation-resultat" }
>;

export default function OrientationChat({
  message,
  actif,
  onChoisir,
  onPasser,
  onRecommencer,
}: {
  message: MessageOrientation;
  /** Cette question attend sa réponse : ses pastilles s'affichent. */
  actif: boolean;
  onChoisir: (etape: EtapeOrientation, id: string, label: string) => void;
  /** À la dernière question : voir le résultat sans rien écrire. */
  onPasser: () => void;
  onRecommencer: () => void;
}) {
  switch (message.genre) {
    case "orientation-question": {
      const options = optionsDe(message.etape);
      return (
        <>
          <div className="wa-ligne wa-ligne--cabinet">
            <div className="wa-bulle-msg wa-bulle-msg--cabinet">
              <p>{QUESTIONS[message.etape]}</p>
              {message.etape === "signes" && (
                <ul className="wa-signes">
                  {SIGNES_ALERTE.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
              {message.etape === "texte" && actif && (
                <p className="wa-bulle-aide">Écrivez-le dans le champ en bas, ou passez cette étape.</p>
              )}
            </div>
          </div>
          {actif && (
            <div className="wa-pastilles" role="group" aria-label={QUESTIONS[message.etape]}>
              {options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className="wa-pastille"
                  data-wa-reponse=""
                  onClick={() => onChoisir(message.etape, o.id, o.label)}
                >
                  {o.label}
                </button>
              ))}
              {message.etape === "texte" && (
                <button type="button" className="wa-pastille" data-wa-reponse="" onClick={onPasser}>
                  Voir qui consulter
                </button>
              )}
            </div>
          )}
        </>
      );
    }
    case "orientation-alerte":
      return (
        <div className="wa-ligne wa-ligne--cabinet">
          <div className="wa-encadre" role="alert">
            <p className="wa-encadre-titre">
              <Phone aria-hidden="true" size={18} /> Demandez un avis médical rapidement
            </p>
            <p>
              Ce que vous décrivez demande un avis médical rapide&nbsp;: consultez votre médecin traitant ou un service
              d’urgence aujourd’hui. En cas d’urgence, appelez&nbsp;:
            </p>
            <div className="wa-appels">
              <a href="tel:15" className="wa-appel">
                Appeler le 15
              </a>
              <a href="tel:112" className="wa-appel">
                Appeler le 112
              </a>
            </div>
            <button type="button" className="wa-lien-bouton" onClick={onRecommencer}>
              <RotateCcw aria-hidden="true" size={15} />
              Recommencer
            </button>
          </div>
        </div>
      );
    case "orientation-panne":
      return (
        <div className="wa-ligne wa-ligne--cabinet">
          <div className="wa-bulle-msg wa-bulle-msg--cabinet">
            <p>
              Le service ne répond pas pour le moment. L’équipe et ses spécialités sont présentées sur la{" "}
              <Link href={ROUTES.team}>page de l’équipe</Link>, et vous pouvez nous écrire à{" "}
              <a href={`mailto:${EXTERNAL.email}`}>{EXTERNAL.email}</a>.
            </p>
          </div>
        </div>
      );
    case "orientation-trop":
      return (
        <div className="wa-ligne wa-ligne--cabinet">
          <div className="wa-bulle-msg wa-bulle-msg--cabinet">
            <p>
              Trop de demandes depuis cette connexion. Réessayez dans une heure. En attendant, voyez la{" "}
              <Link href={ROUTES.team}>page de l’équipe</Link>.
            </p>
          </div>
        </div>
      );
    case "orientation-resultat":
      return <Resultat resultat={message.resultat} onRecommencer={onRecommencer} />;
  }
}

function Resultat({ resultat, onRecommencer }: { resultat: ReponseOrientation; onRecommencer: () => void }) {
  return (
    <div className="wa-ligne wa-ligne--cabinet wa-ligne--large">
      <div className="wa-resultat">
        {resultat.etat === "detresse" && (
          <div className="wa-encadre">
            <p>
              Si vous pensez au suicide, parlez-en&nbsp;: le <a href="tel:3114">3114</a> répond jour et nuit,
              gratuitement. En cas de danger immédiat, appelez le <a href="tel:15">15</a>.
            </p>
          </div>
        )}
        <p className="wa-resultat-titre">Qui consulter au cabinet</p>
        {resultat.cartes.map((c) => (
          <CarteCompacte key={c.metier} carte={c} parcours={resultat.id} />
        ))}
        <button type="button" className="wa-lien-bouton" onClick={onRecommencer}>
          <RotateCcw aria-hidden="true" size={15} />
          Recommencer
        </button>
      </div>
    </div>
  );
}

/** Une carte du résultat, en petit : le métier, ses praticiens, leur lien de rendez-vous. */
function CarteCompacte({ carte, parcours }: { carte: Carte; parcours: string | null }) {
  return (
    <article className="wa-carte">
      <h4 className="wa-carte-titre">
        <Link href={carte.lien} onClick={() => noterClic(parcours, "page", carte.lien)}>
          {carte.titre}
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </h4>
      <p className="wa-carte-pourquoi">{carte.pourquoi}</p>
      <ul className="wa-praticiens">
        {carte.praticiens.map((p) => (
          <li key={p.slug} className="wa-praticien">
            <Image
              src={p.photo}
              alt=""
              width={40}
              height={40}
              sizes="40px"
              className="wa-photo"
              style={{ objectPosition: p.objectPosition }}
            />
            <div className="wa-praticien-texte">
              <Link href={p.fiche} className="wa-praticien-nom" onClick={() => noterClic(parcours, "page", p.fiche)}>
                {p.nom}
              </Link>
              <span className="wa-praticien-role">{p.role}</span>
              <a
                href={p.reservation}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-rdv"
                onClick={() => noterClic(parcours, "reservation", p.slug)}
              >
                <CalendarCheck aria-hidden="true" size={16} />
                Prendre rendez-vous<span className="wa-sr"> avec {p.nom} (nouvel onglet)</span>
              </a>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
