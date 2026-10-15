"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { House, X } from "lucide-react";
import type { ArticleAide } from "@/lib/aide/types";
import Bulle from "./Bulle";
import { CONVERSATION_VIDE, ORIENTATION_DEPART, nouvelId, type Conversation, type Message } from "./conversation";
import { chargerArticles } from "./envoi";
import OngletAccueil from "./OngletAccueil";
import OngletArticles, { type VueArticles } from "./OngletArticles";
import OngletMessages, { QUESTION_ORIENTATION } from "./OngletMessages";

type Onglet = "accueil" | "messages" | "articles";

/** Pages sans widget : le back-office, le stand des jeux, le paiement du Klub. */
const EXCLUS = ["/admin", "/jeux/stand", "/mugi-klub/paiement", "/mugi-klub/annulation"];

function exclu(chemin: string): boolean {
  return EXCLUS.some((p) => chemin === p || chemin.startsWith(`${p}/`));
}

const TELEPHONE = "(max-width: 699px)";
function abonner(rappel: () => void): () => void {
  const m = window.matchMedia(TELEPHONE);
  m.addEventListener("change", rappel);
  return () => m.removeEventListener("change", rappel);
}
const surTelephone = () => window.matchMedia(TELEPHONE).matches;

const FOCUSABLES = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex="0"]';

/**
 * Le widget d'aide : une bulle en bas à droite et un panneau à trois
 * onglets. Monté une fois dans la mise en page racine, son état survit aux
 * navigations entre pages.
 */
export default function WidgetAide() {
  const chemin = usePathname() ?? "/";
  const cache = exclu(chemin);
  const telephone = useSyncExternalStore(abonner, surTelephone, () => false);

  const [ouvert, setOuvert] = useState(false);
  const [onglet, setOnglet] = useState<Onglet>("accueil");
  const [conv, setConv] = useState<Conversation>(CONVERSATION_VIDE);
  const [consentement, setConsentement] = useState(false);
  /** « jamais » tant que le panneau n'a pas été ouvert ; null pendant le chargement. */
  const [articles, setArticles] = useState<ArticleAide[] | null | "erreur" | "jamais">("jamais");
  const [vue, setVue] = useState<VueArticles>({ rubrique: null, faq: null });
  const [recherche, setRecherche] = useState("");

  const bulle = useRef<HTMLButtonElement>(null);
  const titre = useRef<HTMLHeadingElement>(null);
  const panneau = useRef<HTMLDivElement>(null);
  const dejaOuvert = useRef(false);

  const visible = ouvert && !cache;

  async function charger() {
    setArticles(null);
    const a = await chargerArticles();
    setArticles(a ?? "erreur");
  }

  // Les articles se chargent à la première ouverture du panneau.
  useEffect(() => {
    if (!visible || articles !== "jamais") return;
    const t = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(t);
  });

  // À l'ouverture, le focus va au titre du panneau ; à la fermeture, il
  // revient à la bulle.
  useEffect(() => {
    if (visible) {
      dejaOuvert.current = true;
      titre.current?.focus();
    } else if (dejaOuvert.current) {
      dejaOuvert.current = false;
      bulle.current?.focus({ preventScroll: true });
    }
  }, [visible]);

  // Sur téléphone, le panneau couvre l'écran : la page dessous ne défile pas.
  useEffect(() => {
    if (!visible || !telephone) return;
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = avant;
    };
  }, [visible, telephone]);

  // Échap ferme, où que soit le focus.
  useEffect(() => {
    if (!visible) return;
    const surTouche = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOuvert(false);
    };
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [visible]);

  if (cache) return null;

  function lancerOrientation(texteVisiteur?: string) {
    setOuvert(true);
    setOnglet("messages");
    setConv((c) => {
      const ajout: Message[] = [];
      if (texteVisiteur) ajout.push({ id: nouvelId(), de: "visiteur", texte: texteVisiteur });
      ajout.push({ id: nouvelId(), de: "cabinet", genre: "orientation-question", etape: "motif" });
      return { ...c, orientation: ORIENTATION_DEPART, messages: [...c.messages, ...ajout] };
    });
  }

  function ouvrirFaq(a: ArticleAide) {
    setRecherche("");
    setVue({ rubrique: "faq", faq: a });
    setOnglet("articles");
  }

  // Sur téléphone, le focus reste dans le panneau, qui couvre la page.
  function surToucheTab(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab" || !telephone || !panneau.current) return;
    const liste = Array.from(panneau.current.querySelectorAll<HTMLElement>(FOCUSABLES));
    if (liste.length === 0) return;
    const premier = liste[0];
    const dernier = liste[liste.length - 1];
    if (e.shiftKey && (document.activeElement === premier || document.activeElement === titre.current)) {
      e.preventDefault();
      dernier.focus();
    } else if (!e.shiftKey && document.activeElement === dernier) {
      e.preventDefault();
      premier.focus();
    }
  }

  // Sur téléphone, suivre un lien du site ferme le panneau pour montrer la page.
  function surClic(e: MouseEvent<HTMLDivElement>) {
    if (!telephone) return;
    const lien = (e.target as Element).closest("a");
    if (lien && lien.getAttribute("href")?.startsWith("/")) setOuvert(false);
  }

  function surFlecheOnglets(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const suivant: Onglet = onglet === "messages" ? "articles" : "messages";
    setOnglet(suivant);
    document.getElementById(`wa-onglet-${suivant}`)?.focus();
  }

  return (
    <>
      {visible && (
        <div
          ref={panneau}
          id="wa-panneau"
          className="wa-panneau"
          role="dialog"
          aria-modal={telephone}
          aria-labelledby="wa-titre"
          onKeyDown={surToucheTab}
          onClick={surClic}
        >
          <h2 id="wa-titre" ref={titre} tabIndex={-1} className="wa-sr">
            Aide Mugitu
          </h2>
          <div className="wa-entete">
            <button
              type="button"
              id="wa-onglet-accueil"
              className="wa-maison"
              aria-label="Accueil"
              aria-pressed={onglet === "accueil"}
              onClick={() => setOnglet("accueil")}
            >
              <House aria-hidden="true" size={20} />
            </button>
            <div className="wa-onglets" role="tablist" aria-label="Aide" onKeyDown={surFlecheOnglets}>
              {(["messages", "articles"] as const).map((o) => (
                <button
                  key={o}
                  type="button"
                  role="tab"
                  id={`wa-onglet-${o}`}
                  className="wa-onglet"
                  aria-selected={onglet === o}
                  aria-controls="wa-contenu"
                  tabIndex={onglet === o || (onglet === "accueil" && o === "messages") ? 0 : -1}
                  onClick={() => setOnglet(o)}
                >
                  {o === "messages" ? "Messages" : "Articles"}
                </button>
              ))}
            </div>
            <button type="button" className="wa-fermer" onClick={() => setOuvert(false)}>
              <X aria-hidden="true" size={20} />
              <span className="wa-fermer-texte">Fermer</span>
            </button>
          </div>

          <div
            id="wa-contenu"
            className={`wa-contenu wa-contenu--${onglet}`}
            role={onglet === "accueil" ? undefined : "tabpanel"}
            aria-labelledby={`wa-onglet-${onglet}`}
          >
            {onglet === "accueil" && (
              <OngletAccueil
                articles={articles === "jamais" ? null : articles}
                onOrienter={() => lancerOrientation(QUESTION_ORIENTATION)}
                onOuvrirFaq={ouvrirFaq}
                onVoirArticles={() => {
                  setVue({ rubrique: null, faq: null });
                  setOnglet("articles");
                }}
              />
            )}
            {onglet === "messages" && (
              <OngletMessages
                conv={conv}
                setConv={setConv}
                consentement={consentement}
                setConsentement={setConsentement}
                lancerOrientation={lancerOrientation}
              />
            )}
            {onglet === "articles" && (
              <OngletArticles
                articles={articles === "jamais" ? null : articles}
                vue={vue}
                setVue={setVue}
                recherche={recherche}
                setRecherche={setRecherche}
                onRecharger={() => void charger()}
              />
            )}
          </div>
        </div>
      )}
      <Bulle ouvert={visible} onBasculer={() => setOuvert((o) => !o)} controle="wa-panneau" boutonRef={bulle} />
    </>
  );
}
