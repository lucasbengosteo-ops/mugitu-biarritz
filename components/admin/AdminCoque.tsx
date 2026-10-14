"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { AccesContexte, useAcces } from "@/lib/admin/acces";
import { supabaseBrowser } from "@/lib/supabase-browser";
import AdminLogin from "./AdminLogin";
import PanneauAdmin, { rubriqueCourante } from "./PanneauAdmin";

/**
 * Coque du back-office : session, panneau, menu de téléphone.
 *
 * Elle porte l'écran de connexion pour tout l'admin — les écrans n'ont plus
 * qu'à afficher leur contenu. Les droits sont calculés ici une fois et
 * passés aux écrans par le contexte.
 *
 * Ordinateur (≥ 1024 px) : le panneau latéral, collant. Téléphone et
 * tablette : une barre d'en-tête collante et un tiroir. Le choix se fait en
 * CSS (`.ad-masque-tel`, `.ad-masque-ordi`) : le HTML du serveur porte les
 * deux, rien ne saute au chargement. Le JavaScript ne gère que le tiroir.
 */

/** Largeur à partir de laquelle le panneau latéral remplace le tiroir (globals.css). */
const ORDINATEUR = "(min-width: 1024px)";

export default function AdminCoque({ children }: { children: React.ReactNode }) {
  const acces = useAcces();
  const chemin = usePathname() ?? "/admin";
  const [menuOuvert, setMenuOuvert] = useState(false);
  const idTiroir = useId();
  const boutonMenu = useRef<HTMLButtonElement>(null);
  const boutonFermer = useRef<HTMLButtonElement>(null);
  /** Rendre le focus au bouton du menu à la fermeture du tiroir. */
  const rendreFocus = useRef(false);

  const ouvrir = () => {
    rendreFocus.current = true;
    setMenuOuvert(true);
  };
  const fermer = useCallback(() => setMenuOuvert(false), []);

  // Focus dans le tiroir à l'ouverture, rendu au bouton à la fermeture. Après
  // le rendu seulement : tant que le tiroir est ouvert, le reste de la page
  // est `inert` et ne peut pas recevoir le focus.
  useEffect(() => {
    if (menuOuvert) {
      boutonFermer.current?.focus();
    } else if (rendreFocus.current) {
      rendreFocus.current = false;
      boutonMenu.current?.focus();
    }
  }, [menuOuvert]);

  useEffect(() => {
    if (!menuOuvert) return;
    const echap = (e: KeyboardEvent) => {
      if (e.key === "Escape") fermer();
    };
    window.addEventListener("keydown", echap);
    return () => window.removeEventListener("keydown", echap);
  }, [menuOuvert, fermer]);

  // Passé sur ordinateur, le tiroir n'a plus de sens : le CSS le masque, on
  // le ferme pour que la page ne reste pas `inert`.
  useEffect(() => {
    const mq = window.matchMedia(ORDINATEUR);
    const suivre = () => {
      if (!mq.matches) return;
      rendreFocus.current = false;
      setMenuOuvert(false);
    };
    mq.addEventListener("change", suivre);
    return () => mq.removeEventListener("change", suivre);
  }, []);

  if (acces.etat === "chargement") {
    return <p style={{ padding: 40, fontSize: 15, color: "rgba(51,51,52,.6)" }}>Chargement…</p>;
  }
  if (acces.etat === "deconnecte") {
    return <AdminLogin titre="Back-office Mugitu" onSignedIn={acces.recharger} />;
  }
  if (!acces.estEquipe) {
    return (
      <main style={{ padding: 40, maxWidth: 520 }}>
        <h1 style={{ fontSize: 20, color: "#003850" }}>Ce compte n’a pas accès au back-office</h1>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(51,51,52,.7)" }}>
          Demandez à Lucas ou à Jean-Baptiste de vous ouvrir l’accès, ou connectez-vous avec une autre adresse.
        </p>
        <button
          type="button"
          onClick={() => void supabaseBrowser().auth.signOut()}
          style={{ padding: "10px 20px", borderRadius: 999, border: "1px solid rgba(0,56,80,.2)", background: "#fff", font: "inherit", fontSize: 14, cursor: "pointer" }}
        >
          Se déconnecter
        </button>
      </main>
    );
  }

  const panneau = (
    <PanneauAdmin
      acces={acces}
      chemin={chemin}
      onNaviguer={fermer}
      onDeconnexion={() => void supabaseBrowser().auth.signOut()}
    />
  );
  const titre = rubriqueCourante(acces, chemin)?.label ?? "Back-office";

  return (
    <AccesContexte.Provider value={acces}>
      <div className="ad-coque">
        <aside className="ad-coque-panneau ad-masque-tel">{panneau}</aside>

        <div className="ad-coque-contenu" inert={menuOuvert || undefined}>
          <header className="ad-barre ad-masque-ordi">
            <button
              ref={boutonMenu}
              type="button"
              className="ad-bouton-icone"
              onClick={ouvrir}
              aria-label="Ouvrir le menu"
              aria-expanded={menuOuvert}
              aria-controls={menuOuvert ? idTiroir : undefined}
            >
              <Menu aria-hidden="true" size={24} strokeWidth={1.75} />
            </button>
            <span aria-hidden="true" style={{ flex: "none", fontSize: 17, fontWeight: 800, color: "#003850" }}>
              mugitu
            </span>
            <span aria-hidden="true" style={{ flex: "none", width: 1, height: 20, background: "rgba(0,56,80,.18)" }} />
            <p className="ad-barre-titre">{titre}</p>
          </header>
          {children}
        </div>

        {menuOuvert ? (
          <>
            <div className="ad-voile ad-masque-ordi" onClick={fermer} aria-hidden="true" />
            <div id={idTiroir} className="ad-tiroir ad-masque-ordi" role="dialog" aria-modal="true" aria-label="Menu du back-office">
              <button ref={boutonFermer} type="button" className="ad-bouton-icone ad-tiroir-fermer" onClick={fermer}>
                <X aria-hidden="true" size={20} strokeWidth={1.75} />
                Fermer
              </button>
              {panneau}
            </div>
          </>
        ) : null}
      </div>
    </AccesContexte.Provider>
  );
}
