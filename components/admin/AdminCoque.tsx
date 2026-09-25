"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AccesContexte, useAcces } from "@/lib/admin/acces";
import { supabaseBrowser } from "@/lib/supabase-browser";
import AdminLogin from "./AdminLogin";
import PanneauAdmin from "./PanneauAdmin";

/**
 * Coque du back-office : session, panneau, menu de téléphone.
 *
 * Elle porte l'écran de connexion pour tout l'admin — les écrans n'ont plus
 * qu'à afficher leur contenu. Les droits sont calculés ici une fois et
 * passés aux écrans par le contexte.
 */

const LARGEUR = 196;

export default function AdminCoque({ children }: { children: React.ReactNode }) {
  const acces = useAcces();
  const chemin = usePathname() ?? "/admin";
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [etroit, setEtroit] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const suivre = () => setEtroit(mq.matches);
    suivre();
    mq.addEventListener("change", suivre);
    return () => mq.removeEventListener("change", suivre);
  }, []);

  useEffect(() => {
    const echap = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOuvert(false);
    };
    window.addEventListener("keydown", echap);
    return () => window.removeEventListener("keydown", echap);
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
      onNaviguer={() => setMenuOuvert(false)}
      onDeconnexion={() => void supabaseBrowser().auth.signOut()}
    />
  );

  return (
    <AccesContexte.Provider value={acces}>
      <div style={{ minHeight: "100vh", background: "#FDF8F4", display: "flex" }}>
        {etroit ? (
          <>
            {menuOuvert && (
              <>
                <div
                  onClick={() => setMenuOuvert(false)}
                  style={{ position: "fixed", inset: 0, background: "rgba(0,20,28,.45)", zIndex: 40 }}
                />
                <div style={{ position: "fixed", top: 0, bottom: 0, left: 0, width: LARGEUR, background: "#fff", borderRight: "1px solid rgba(0,56,80,.1)", zIndex: 41 }}>
                  {panneau}
                </div>
              </>
            )}
          </>
        ) : (
          <aside style={{ width: LARGEUR, flex: `0 0 ${LARGEUR}px`, background: "#fff", borderRight: "1px solid rgba(0,56,80,.1)", position: "sticky", top: 0, height: "100vh" }}>
            {panneau}
          </aside>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          {etroit && (
            <button
              type="button"
              onClick={() => setMenuOuvert(true)}
              aria-label="Ouvrir le menu"
              style={{ margin: "12px 0 0 12px", padding: "8px 14px", borderRadius: 999, border: "1px solid rgba(0,56,80,.16)", background: "#fff", font: "inherit", fontSize: 14, cursor: "pointer" }}
            >
              ☰ Menu
            </button>
          )}
          {children}
        </div>
      </div>
    </AccesContexte.Provider>
  );
}
