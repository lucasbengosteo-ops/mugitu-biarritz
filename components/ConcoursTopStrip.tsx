"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { detectLocale, getDict, localePath } from "@/lib/i18n";

/**
 * Bandeau slim "Jeu concours" tout en haut (au-dessus de la Nav).
 *
 * Trois états selon la date :
 * - Avant la deadline : countdown
 * - Pendant 7 jours après : "Gagnant·es annoncé·es"
 * - Au-delà : masqué
 *
 * Masqué aussi sur les pages concours elles-mêmes.
 *
 * Composant rendu globalement dans layout.tsx → il détecte sa propre locale
 * via le pathname (pas de props depuis le layout).
 */

const DEADLINE_MS = Date.parse("2026-05-24T13:00:00Z"); // 15h00 Paris en mai
const RESULTS_VISIBLE_UNTIL_MS = DEADLINE_MS + 7 * 86_400_000;

type Mode = "countdown" | "results" | "hidden";

export default function ConcoursTopStrip() {
  const pathname = usePathname();
  const [mode, setMode] = useState<Mode>("countdown");
  const [countdown, setCountdown] = useState<string | null>(null);

  const locale = detectLocale(pathname || "/");
  const dict = getDict(locale);
  const t = dict.concoursStrip;

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
    const initial = setTimeout(update, 0);
    const interval = setInterval(update, 60_000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  // Pas la peine d'afficher le bandeau sur la page concours
  const isContestPage =
    pathname === "/concours-avirun-2026" ||
    pathname === "/eu/concours-avirun-2026";
  if (isContestPage) return null;
  if (mode === "hidden") return null;

  const contestHref = localePath(locale, "/concours-avirun-2026");
  const resultsHref = `${contestHref}#resultats`;

  if (mode === "results") {
    return (
      <Link
        href={resultsHref}
        className="fixed top-0 left-0 right-0 z-[60] h-11 flex items-center justify-center gap-2 sm:gap-3 px-4 text-xs sm:text-sm text-white shadow-md hover:opacity-95 transition-opacity whitespace-nowrap overflow-hidden"
        style={{ background: "linear-gradient(90deg, #F47B3F 0%, #EB5582 100%)" }}
        aria-label={t.ariaLabelResults}
      >
        <span aria-hidden className="text-sm sm:text-base">{t.resultsPrefix}</span>
        <span className="font-medium">
          {t.resultsBody}
          <strong className="font-bold">{t.resultsTitle}</strong>
          {t.resultsBodyAfter}
        </span>
        <span className="font-bold underline underline-offset-2 ml-1">
          {t.resultsCta}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={contestHref}
      className="fixed top-0 left-0 right-0 z-[60] h-11 flex items-center justify-center gap-2 sm:gap-3 px-4 text-xs sm:text-sm text-white shadow-md hover:opacity-95 transition-opacity whitespace-nowrap overflow-hidden"
      style={{ background: "linear-gradient(90deg, #F47B3F 0%, #EB5582 100%)" }}
      aria-label={t.ariaLabelCountdown}
    >
      <span aria-hidden className="text-sm sm:text-base">{t.countdownPrefix}</span>
      <span className="font-medium">
        <strong className="font-bold">{t.countdownTitle}</strong> {t.countdownSuffix}
      </span>
      {countdown && (
        <span className="hidden sm:inline opacity-90 text-[11px] uppercase tracking-wider">
          · {t.countdownDeadline} {countdown}
        </span>
      )}
      <span className="font-bold underline underline-offset-2 ml-1">
        {t.countdownCta}
      </span>
    </Link>
  );
}
