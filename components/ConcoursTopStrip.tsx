"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Bandeau promo "Jeu concours" affiché tout en haut du site (au-dessus
 * de la Nav). Hauteur 44 px sur desktop, fluide sur mobile.
 *
 * Trois états :
 * - Avant la deadline : "🏃 5 analyses de foulée à gagner · clôture dans Xj"
 * - Après la deadline et tant qu'on garde l'annonce visible (7 jours) :
 *   "🏆 Gagnant·es annoncé·es · voir les résultats"
 * - Au-delà : masqué.
 *
 * Toujours masqué sur la page /concours-avirun-2026 (pas redondant).
 */

const DEADLINE_MS = Date.parse("2026-05-24T13:00:00Z"); // 15h00 Paris en mai
// On laisse le bandeau "résultats" affiché 7 jours après la deadline,
// puis on l'enlève pour ne pas polluer le site indéfiniment.
const RESULTS_VISIBLE_UNTIL_MS = DEADLINE_MS + 7 * 86_400_000;

type Mode = "countdown" | "results" | "hidden";

export default function ConcoursTopStrip() {
  const pathname = usePathname();
  const [mode, setMode] = useState<Mode>("countdown");
  const [countdown, setCountdown] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      const now = Date.now();
      if (now >= RESULTS_VISIBLE_UNTIL_MS) {
        setMode("hidden");
        return;
      }
      if (now >= DEADLINE_MS) {
        setMode("results");
        return;
      }
      const remaining = DEADLINE_MS - now;
      const days = Math.floor(remaining / 86_400_000);
      const hours = Math.floor((remaining / 3_600_000) % 24);
      setCountdown(days > 0 ? `${days}j ${hours}h` : `${hours}h`);
      setMode("countdown");
    }
    // setState différé d'un tick (react-hooks/set-state-in-effect)
    const initial = setTimeout(update, 0);
    const interval = setInterval(update, 60_000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  // Pas la peine d'afficher le bandeau quand on est déjà sur la page concours
  if (pathname === "/concours-avirun-2026") return null;
  if (mode === "hidden") return null;

  if (mode === "results") {
    return (
      <Link
        href="/concours-avirun-2026#resultats"
        className="fixed top-0 left-0 right-0 z-[60] h-11 flex items-center justify-center gap-2 sm:gap-3 px-4 text-xs sm:text-sm text-white shadow-md hover:opacity-95 transition-opacity whitespace-nowrap overflow-hidden"
        style={{ background: "linear-gradient(90deg, #F47B3F 0%, #EB5582 100%)" }}
        aria-label="Voir les gagnant·es du concours Avirun 2K26"
      >
        <span aria-hidden className="text-sm sm:text-base">🏆</span>
        <span className="font-medium">
          Concours Avirun&nbsp;: <strong className="font-bold">les 5 gagnant·es</strong> sont annoncé·es
        </span>
        <span className="font-bold underline underline-offset-2 ml-1">
          Voir les résultats →
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/concours-avirun-2026"
      className="fixed top-0 left-0 right-0 z-[60] h-11 flex items-center justify-center gap-2 sm:gap-3 px-4 text-xs sm:text-sm text-white shadow-md hover:opacity-95 transition-opacity whitespace-nowrap overflow-hidden"
      style={{ background: "linear-gradient(90deg, #F47B3F 0%, #EB5582 100%)" }}
      aria-label="Voir le jeu concours Avirun 2K26"
    >
      <span aria-hidden className="text-sm sm:text-base">🏃</span>
      <span className="font-medium">
        <strong className="font-bold">5 analyses de foulée</strong> à gagner
      </span>
      {countdown && (
        <span className="hidden sm:inline opacity-90 text-[11px] uppercase tracking-wider">
          · clôture dans {countdown}
        </span>
      )}
      <span className="font-bold underline underline-offset-2 ml-1">
        Je participe →
      </span>
    </Link>
  );
}
