"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Apple,
  ArrowLeft,
  Bandage,
  Brain,
  CalendarCheck,
  ClipboardCheck,
  Info,
  RotateCcw,
  Search,
  ShieldCheck,
  Timer,
  TrendingUp,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { prerempli, type Prerempli } from "@/lib/orientation/depuis";
import {
  ANCIENNETES,
  MOTIFS,
  SIGNES_ALERTE,
  SPORTS_CHOIX,
  TEXTE_MAX,
  ZONES,
  demandeSignes,
  demandeZone,
  type AncienneteId,
  type MotifId,
  type Reponses,
  type ReponseOrientation,
  type SportChoixId,
  type ZoneId,
} from "@/lib/orientation/types";
import { EXTERNAL, ROUTES } from "@/lib/routes";
import { TEAM, TEAM_CATEGORIES } from "@/lib/team";
import CarteResultat from "./CarteResultat";
import Choix from "./Choix";
import EcranAlerte from "./EcranAlerte";
import { demanderOrientation } from "./envoi";

type Etape =
  | "motif"
  | "zone"
  | "anciennete"
  | "sport"
  | "signes"
  | "texte"
  | "envoi"
  | "resultat"
  | "alerte"
  | "erreur"
  | "trop";

const OUI_NON = [
  { id: "oui", label: "Oui, au moins un de ces signes" },
  { id: "non", label: "Non, aucun" },
] as const;

const ICONES_MOTIF: Record<MotifId, LucideIcon> = {
  douleur: Bandage,
  reprise: Undo2,
  performance: TrendingUp,
  mental: Brain,
  nutrition: Apple,
  bilan: ClipboardCheck,
};

/** Quelques visages de l'équipe, pour dire qui est derrière l'outil. */
const VISAGES = TEAM.slice(0, 6);
const NB_METIERS = TEAM_CATEGORIES.length - 1;

const QUESTIONS: Etape[] = ["motif", "zone", "anciennete", "sport", "signes", "texte"];

/** Les questions du parcours pour ce motif, dans l'ordre. */
function questionsDu(motif: MotifId | null): Etape[] {
  const m = motif ?? "douleur";
  return QUESTIONS.filter(
    (e) => ((e !== "zone" && e !== "anciennete") || demandeZone(m)) && (e !== "signes" || demandeSignes(m)),
  );
}

/** L'étape qui suit une question, selon le motif et ce qui est déjà prérempli. */
function suivante(etape: Etape, motif: MotifId, zoneConnue: boolean): Etape {
  switch (etape) {
    case "motif":
      if (!demandeZone(motif)) return "sport";
      return zoneConnue ? "anciennete" : "zone";
    case "zone":
      return "anciennete";
    case "anciennete":
      return "sport";
    case "sport":
      return demandeSignes(motif) ? "signes" : "texte";
    default:
      return "texte";
  }
}

function etapeDeDepart(pre: Prerempli | null): Etape {
  return pre?.motif ? suivante("motif", pre.motif, Boolean(pre.zone)) : "motif";
}

/**
 * La section « Par où commencer ? » lit `?depuis=` dans l'adresse. Le
 * composant est rendu de nouveau quand la page d'origine change.
 */
export default function ParOuCommencer() {
  const depuis = useSearchParams().get("depuis");
  return <Parcours key={depuis ?? ""} depuis={depuis} />;
}

/**
 * Le parcours lui-même. Exporté seul pour servir de rendu statique (sans
 * `?depuis=`) en attendant que l'adresse soit lue dans le navigateur.
 */
export function Parcours({ depuis }: { depuis: string | null }) {
  const [pre, setPre] = useState<Prerempli | null>(() => prerempli(depuis));
  const [etape, setEtape] = useState<Etape>(() => etapeDeDepart(pre));
  const [historique, setHistorique] = useState<Etape[]>([]);
  const [motif, setMotif] = useState<MotifId | null>(pre?.motif ?? null);
  const [zone, setZone] = useState<ZoneId | null>(pre?.zone ?? null);
  const [anciennete, setAnciennete] = useState<AncienneteId | null>(null);
  const [sport, setSport] = useState<SportChoixId | null>(null);
  const [texte, setTexte] = useState("");
  const [consentement, setConsentement] = useState(false);
  const [resultat, setResultat] = useState<ReponseOrientation | null>(null);
  /** Compte les changements d'étape : le focus ne bouge pas au chargement. */
  const [pas, setPas] = useState(0);

  const racine = useRef<HTMLDivElement>(null);
  const titre = useRef<HTMLHeadingElement>(null);

  // À chaque étape : la section remonte à son haut s'il est sorti de
  // l'écran, puis le focus va au titre de l'étape.
  useEffect(() => {
    if (pas === 0) return;
    const section = racine.current?.closest("section") ?? racine.current;
    let defile = false;
    if (section && section.getBoundingClientRect().top < 0) {
      const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      section.scrollIntoView({ block: "start", behavior: reduit ? "auto" : "smooth" });
      defile = true;
    }
    titre.current?.focus({ preventScroll: defile });
  }, [pas]);

  function aller(prochaine: Etape, empiler = true) {
    if (empiler) setHistorique((h) => [...h, etape]);
    setEtape(prochaine);
    setPas((p) => p + 1);
  }

  function retour() {
    const precedente = historique[historique.length - 1];
    if (!precedente) return;
    setHistorique((h) => h.slice(0, -1));
    setEtape(precedente);
    setPas((p) => p + 1);
  }

  function recommencer() {
    // On repart de zéro, sans le contexte de la page d'origine : s'il était
    // faux, c'est le seul moyen d'en sortir.
    setPre(null);
    setMotif(null);
    setZone(null);
    setAnciennete(null);
    setSport(null);
    setTexte("");
    setResultat(null);
    setHistorique([]);
    setEtape("motif");
    setPas((p) => p + 1);
  }

  function reponses(signes: boolean): Reponses | null {
    if (!motif) return null;
    const avecZone = demandeZone(motif);
    return {
      motif,
      zone: avecZone ? zone : null,
      anciennete: avecZone ? anciennete : null,
      sport,
      signes,
      texte: signes ? "" : texte.trim().slice(0, TEXTE_MAX),
      depuis: pre?.slug ?? null,
      consentement,
    };
  }

  async function envoyer() {
    const r = reponses(false);
    if (!r) return;
    aller("envoi", false);
    const res = await demanderOrientation(r);
    if (res === "trop") {
      aller("trop", false);
    } else if (res === null || (res.etat !== "alerte" && res.cartes.length === 0)) {
      aller("erreur", false);
    } else if (res.etat === "alerte") {
      setResultat(res);
      aller("alerte", false);
    } else {
      setResultat(res);
      aller("resultat", false);
    }
  }

  function signaler() {
    // L'écran d'alerte s'affiche tout de suite ; les réponses partent quand
    // même, pour la mesure, sans attendre la réponse.
    const r = reponses(true);
    aller("alerte");
    if (r) void demanderOrientation(r);
  }

  const enCours = etape === "envoi";
  const question = QUESTIONS.includes(etape);
  const suite = questionsDu(motif);
  const rang = suite.indexOf(etape) + 1;

  return (
    <div ref={racine} className="po-racine">
      <header className="po-entete">
        <p className="po-surtitre">Orientation</p>
        <h2 id="po-titre" className="po-titre">
          Par où commencer&nbsp;?
        </h2>
        <p className="po-chapo">Quelques questions, et nous vous indiquons qui voir au cabinet.</p>
        <div className="po-equipe">
          <div className="po-visages" aria-hidden="true">
            {VISAGES.map((p) => (
              <Image
                key={p.slug}
                src={p.photo}
                alt=""
                width={44}
                height={44}
                className="po-visage"
                style={{ objectPosition: p.objectPosition }}
              />
            ))}
          </div>
          <p className="po-equipe-texte">
            <strong>{TEAM.length} praticiens</strong>, {NB_METIERS} métiers du sport, un seul cabinet.
          </p>
        </div>
        <ul className="po-atouts">
          <li>
            <Timer aria-hidden="true" size={18} />
            Une réponse en moins d’une minute
          </li>
          <li>
            <CalendarCheck aria-hidden="true" size={18} />
            Les praticiens du cabinet, avec leur lien de rendez-vous
          </li>
          <li>
            <ShieldCheck aria-hidden="true" size={18} />
            Sans inscription, sans votre nom
          </li>
        </ul>
        <p className="po-avertissement">
          <Info aria-hidden="true" size={18} />
          <span>
            Cet outil vous oriente, il ne pose pas de diagnostic. En cas d’urgence&nbsp;: <a href="tel:15">15</a> ou{" "}
            <a href="tel:112">112</a>.
          </span>
        </p>
        <div className="po-consentement">
          <input
            id="po-consentement"
            type="checkbox"
            checked={consentement}
            onChange={(e) => setConsentement(e.target.checked)}
          />
          <p>
            <label htmlFor="po-consentement">
              Aider Mugitu à améliorer l’outil&nbsp;: mes réponses écrites sont gardées 90 jours, sans mon nom.
            </label>{" "}
            <Link href={ROUTES.confidentialite}>Confidentialité</Link>
          </p>
        </div>
      </header>

      <div className="po-panneau">
        {question && rang > 0 ? (
          <div className="po-progression">
            <p className="po-progression-texte">
              Étape {rang} sur {suite.length}
            </p>
            <div
              className="po-progression-barre"
              role="progressbar"
              aria-label="Avancement"
              aria-valuemin={1}
              aria-valuemax={suite.length}
              aria-valuenow={rang}
            >
              <span style={{ width: `${(rang / suite.length) * 100}%` }} />
            </div>
          </div>
        ) : null}
        {pre && question ? (
          <p className="po-contexte">Vous venez d’une page du site&nbsp;: nous avons repris votre contexte.</p>
        ) : null}

        {etape === "motif" && (
          <Choix
            titre="Qu’est-ce qui vous amène ?"
            options={MOTIFS}
            icones={ICONES_MOTIF}
            courant={motif}
            titreRef={titre}
            onChoisir={(m) => {
              setMotif(m);
              aller(suivante("motif", m, false));
            }}
          />
        )}

        {etape === "zone" && (
          <Choix
            titre="Où avez-vous mal ?"
            options={ZONES}
            courant={zone}
            titreRef={titre}
            onChoisir={(z) => {
              setZone(z);
              aller("anciennete");
            }}
          />
        )}

        {etape === "anciennete" && (
          <Choix
            titre="Depuis quand ?"
            options={ANCIENNETES}
            courant={anciennete}
            titreRef={titre}
            onChoisir={(a) => {
              setAnciennete(a);
              aller("sport");
            }}
          />
        )}

        {etape === "sport" && motif && (
          <Choix
            titre="Quel sport pratiquez-vous ?"
            options={SPORTS_CHOIX}
            courant={sport}
            titreRef={titre}
            onChoisir={(s) => {
              setSport(s);
              aller(suivante("sport", motif, true));
            }}
          />
        )}

        {etape === "signes" && (
          <Choix
            titre="Avez-vous l’un de ces signes ?"
            options={OUI_NON}
            titreRef={titre}
            aide={
              <ul className="po-signes">
                {SIGNES_ALERTE.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            }
            onChoisir={(v) => (v === "oui" ? signaler() : aller("texte"))}
          />
        )}

        {etape === "texte" && (
          <form
            className="po-choix"
            onSubmit={(e) => {
              e.preventDefault();
              void envoyer();
            }}
          >
            <h3 ref={titre} tabIndex={-1} className="po-question">
              <label htmlFor="po-texte">En quelques mots (facultatif)</label>
            </h3>
            <p id="po-texte-aide" className="po-aide">
              Ce qui vous gêne, depuis quand, ce que vous aimeriez reprendre. Ne donnez pas votre nom ni vos coordonnées.
            </p>
            <textarea
              id="po-texte"
              className="po-texte"
              rows={4}
              maxLength={TEXTE_MAX}
              value={texte}
              aria-describedby="po-texte-aide po-compteur"
              onChange={(e) => setTexte(e.target.value)}
            />
            <p id="po-compteur" className="po-compteur">
              {texte.length} / {TEXTE_MAX} caractères
            </p>
            <button type="submit" className="po-envoyer">
              <Search aria-hidden="true" size={18} />
              Voir qui consulter
            </button>
          </form>
        )}

        {question && historique.length > 0 ? (
          <button type="button" className="po-lien-bouton po-retour" onClick={retour}>
            <ArrowLeft aria-hidden="true" size={16} />
            Retour
          </button>
        ) : null}

        {etape === "alerte" && <EcranAlerte onRecommencer={recommencer} titreRef={titre} />}

        <div className="po-resultat" aria-live="polite" aria-busy={enCours}>
          {enCours && (
            <p className="po-attente">
              <span className="po-roue" aria-hidden="true" />
              Je cherche les bons praticiens…
            </p>
          )}

          {etape === "erreur" && (
            <div className="po-message">
              <h3 ref={titre} tabIndex={-1} className="po-question">
                Le service ne répond pas pour le moment
              </h3>
              <p>
                Vous pouvez consulter l’équipe ou nous écrire à{" "}
                <a href={`mailto:${EXTERNAL.email}`}>{EXTERNAL.email}</a>.
              </p>
              <div className="po-actions">
                <Link href={ROUTES.team} className="po-envoyer">
                  Voir l’équipe
                </Link>
                <button type="button" className="po-lien-bouton" onClick={() => void envoyer()}>
                  Réessayer
                </button>
              </div>
            </div>
          )}

          {etape === "trop" && (
            <div className="po-message">
              <h3 ref={titre} tabIndex={-1} className="po-question">
                Trop de demandes depuis cette connexion
              </h3>
              <p>Réessayez dans une heure. En attendant, l’équipe et ses spécialités sont présentées sur la page de l’équipe.</p>
              <div className="po-actions">
                <Link href={ROUTES.team} className="po-envoyer">
                  Voir l’équipe
                </Link>
              </div>
            </div>
          )}

          {etape === "resultat" && resultat && (
            <div className="po-suggestions">
              {resultat.etat === "detresse" && (
                <div className="po-detresse">
                  <p>
                    Si vous pensez au suicide, parlez-en&nbsp;: le <a href="tel:3114">3114</a> répond jour et nuit,
                    gratuitement. En cas de danger immédiat, appelez le <a href="tel:15">15</a>.
                  </p>
                </div>
              )}
              <h3 ref={titre} tabIndex={-1} className="po-question">
                Qui consulter au cabinet
              </h3>
              <div className="po-cartes">
                {resultat.cartes.map((c) => (
                  <CarteResultat key={c.metier} carte={c} parcours={resultat.id} />
                ))}
              </div>
              <div className="po-actions">
                <button
                  type="button"
                  className="po-lien-bouton"
                  onClick={() => {
                    setEtape("texte");
                    setPas((p) => p + 1);
                  }}
                >
                  Ce n’est pas tout à fait ça&nbsp;? Précisez
                </button>
                <button type="button" className="po-lien-bouton" onClick={recommencer}>
                  <RotateCcw aria-hidden="true" size={16} />
                  Recommencer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
