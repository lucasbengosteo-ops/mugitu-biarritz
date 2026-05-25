"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Bannière visuelle "Jeu concours Avirun 2K26" affichée sous le hero
 * de la home.
 *
 * Trois états :
 * - Avant la deadline : "5 analyses de foulée à gagner" + CTA "Je participe"
 * - Après la deadline, pendant 7 jours : "Les 5 gagnant·es sont
 *   annoncé·es" + CTA "Voir les résultats"
 * - Au-delà : masquée.
 */

const DEADLINE_MS = Date.parse("2026-05-24T13:00:00Z"); // 15h00 Paris en mai
const RESULTS_VISIBLE_UNTIL_MS = DEADLINE_MS + 7 * 86_400_000;

type Mode = "countdown" | "results" | "hidden";

export default function ConcoursBanner() {
  const [mode, setMode] = useState<Mode>("hidden");

  useEffect(() => {
    // setState différé d'un tick pour satisfaire react-hooks/set-state-in-effect.
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
      {/* Halos signature Avirun */}
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
            {isResults
              ? "🏆 Jeu concours · résultats"
              : "Jeu concours · Avirun 2K26"}
          </span>
          <h2
            id="concours-banner-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-2"
          >
            {isResults ? (
              <>
                Les{" "}
                <span className="bg-gradient-to-r from-[#F47B3F] to-[#EB5582] bg-clip-text text-transparent">
                  5 gagnant·es
                </span>{" "}
                sont annoncé·es
              </>
            ) : (
              <>
                <span className="bg-gradient-to-r from-[#F47B3F] to-[#EB5582] bg-clip-text text-transparent">
                  5 analyses de foulée
                </span>{" "}
                à gagner
              </>
            )}
          </h2>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-xl">
            {isResults
              ? "Tirage au sort effectué le 24 mai 2026, certifié via @app_sorteos_ok. Bravo aux 5 gagnant·es de l'analyse de foulée avec Julien Blamont !"
              : "Avec Julien Blamont, kinésithérapeute formé à La Clinique du Coureur. Tentez votre chance avant le 24 mai à 15h."}
          </p>
        </div>

        <div className="flex-shrink-0">
          <Link
            href={isResults ? "/concours-avirun-2026#resultats" : "/concours-avirun-2026"}
            className="inline-block px-7 py-3.5 rounded-full bg-[#F47B3F] text-white font-semibold hover:bg-[#e06a2e] transition-colors duration-200 text-sm sm:text-base shadow-lg whitespace-nowrap"
          >
            {isResults ? "Voir les gagnant·es →" : "Je participe →"}
          </Link>
        </div>
      </div>
    </section>
  );
}
