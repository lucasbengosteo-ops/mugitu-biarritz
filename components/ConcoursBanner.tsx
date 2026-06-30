"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";

/**
 * Bannière visuelle "Jeu concours" affichée sous le hero de la home.
 *
 * - countdown : avant la deadline
 * - results : pendant 7 jours après
 * - hidden : ensuite
 */

const DEADLINE_MS = Date.parse("2026-05-24T13:00:00Z");
const RESULTS_VISIBLE_UNTIL_MS = DEADLINE_MS + 7 * 86_400_000;

type Mode = "countdown" | "results" | "hidden";

interface ConcoursBannerProps {
  dict: Dict;
  locale: Locale;
}

export default function ConcoursBanner({ dict, locale }: ConcoursBannerProps) {
  const [mode, setMode] = useState<Mode>("hidden");
  const t = dict.concoursBanner;

  useEffect(() => {
    const id = setTimeout(() => {
      const now = Date.now();
      if (now >= RESULTS_VISIBLE_UNTIL_MS) setMode("hidden");
      else if (now >= DEADLINE_MS) setMode("results");
      else setMode("countdown");
    }, 0);
    return () => clearTimeout(id);
  }, []);

  if (mode === "hidden") return null;

  const isResults = mode === "results";
  const contestHref = localePath(locale, "/concours-avirun-2026");
  const targetHref = isResults ? `${contestHref}#resultats` : contestHref;

  return (
    <section
      aria-labelledby="concours-banner-title"
      className="relative overflow-hidden bg-[#0A5560] text-white"
    >
      <Image
        src="/hero-avirun-2026.avif"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center opacity-35"
      />
      <div
        aria-hidden
        className="absolute -top-20 -right-16 w-[360px] h-[360px] rounded-full bg-[#F47B3F]/30 blur-3xl mix-blend-screen pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -left-16 w-[360px] h-[360px] rounded-full bg-[#EB5582]/25 blur-3xl mix-blend-screen pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#0A5560]/85 via-[#0A5560]/70 to-[#0A5560]/80"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
        <div className="flex-1 text-center sm:text-left">
          <span className="inline-block uppercase tracking-[0.18em] text-xs font-semibold text-[#F3D58C] mb-2">
            {isResults ? t.eyebrowResults : t.eyebrowCountdown}
          </span>
          <h2
            id="concours-banner-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-2"
          >
            {isResults ? (
              <>
                {t.titleResultsPrefix}
                <span className="bg-gradient-to-r from-[#F47B3F] to-[#EB5582] bg-clip-text text-transparent">
                  {t.titleResultsHighlight}
                </span>
                {t.titleResultsSuffix}
              </>
            ) : (
              <>
                {t.titleCountdownPrefix}
                <span className="bg-gradient-to-r from-[#F47B3F] to-[#EB5582] bg-clip-text text-transparent">
                  {t.titleCountdownHighlight}
                </span>
                {t.titleCountdownSuffix}
              </>
            )}
          </h2>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-xl">
            {isResults ? t.bodyResults : t.bodyCountdown}
          </p>
        </div>

        <div className="flex-shrink-0">
          <Link
            href={targetHref}
            className="inline-block px-7 py-3.5 rounded-full bg-[#F47B3F] text-white font-semibold hover:bg-[#e06a2e] transition-colors duration-200 text-sm sm:text-base shadow-lg whitespace-nowrap"
          >
            {isResults ? t.ctaResults : t.ctaCountdown}
          </Link>
        </div>
      </div>
    </section>
  );
}
