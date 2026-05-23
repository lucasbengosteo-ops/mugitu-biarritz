"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Bannière promotionnelle "Jeu concours Avirun 2K26".
 *
 * - Sticky en haut du site, au-dessus de la Nav.
 * - Auto-masquée après la date de fin du concours (24 mai 2026 15h00 Paris).
 * - Fermable par l'utilisateur (mémoire en localStorage le temps de la session).
 */

const DEADLINE_MS = Date.parse("2026-05-24T13:00:00Z"); // 15h00 Paris en mai = UTC+2
const DISMISS_KEY = "mugitu_concours_avirun_dismissed_v1";

export default function ConcoursBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Caché par défaut côté SSR — on décide côté client uniquement.
    // setState différé d'un tick pour satisfaire react-hooks/set-state-in-effect.
    const id = setTimeout(() => {
      if (Date.now() >= DEADLINE_MS) return;
      if (typeof window !== "undefined" && window.sessionStorage.getItem(DISMISS_KEY)) return;
      setVisible(true);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  if (!visible) return null;

  function handleDismiss() {
    setVisible(false);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="relative z-[60] bg-gradient-to-r from-[#003850] via-[#0A556B] to-[#04A49B] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-3 text-center text-sm">
        <span aria-hidden className="text-[#F3BE79]">🏃</span>
        <p className="leading-snug">
          <span className="font-semibold">Jeu concours Avirun 2K26</span>
          <span className="hidden sm:inline">
            {" "}
            — Gagnez une analyse de foulée avec Julien Blamont.
          </span>{" "}
          <Link
            href="/concours-avirun-2026"
            className="underline font-semibold hover:text-[#F3BE79] transition-colors"
          >
            Je participe →
          </Link>
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Fermer la bannière"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-lg leading-none p-1"
        >
          ×
        </button>
      </div>
    </div>
  );
}
