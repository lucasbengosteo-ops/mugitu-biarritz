"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Bandeau promo "Jeu concours" affiché tout en haut du site (au-dessus
 * de la Nav). Hauteur 44 px sur desktop, fluide sur mobile.
 *
 * - Auto-masqué sur la page /concours-avirun-2026 (pas redondant).
 * - Auto-masqué après la deadline 24 mai 2026 15h00 Paris.
 * - Cliquable en intégralité, redirige vers la page concours.
 */

const DEADLINE_MS = Date.parse("2026-05-24T13:00:00Z"); // 15h00 Paris en mai

export default function ConcoursTopStrip() {
  const pathname = usePathname();
  const [active, setActive] = useState(true);
  const [countdown, setCountdown] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      const remaining = DEADLINE_MS - Date.now();
      if (remaining <= 0) {
        setActive(false);
        return;
      }
      const days = Math.floor(remaining / 86_400_000);
      const hours = Math.floor((remaining / 3_600_000) % 24);
      setCountdown(days > 0 ? `${days}j ${hours}h` : `${hours}h`);
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
  if (!active) return null;

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
