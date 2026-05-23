"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Bannière visuelle "Jeu concours Avirun 2K26".
 *
 * - Affichée sous le hero de la home (pas en sticky), avec l'image Avirun
 *   comme fond.
 * - Auto-masquée après la date de fin du concours.
 */

const DEADLINE_MS = Date.parse("2026-05-24T13:00:00Z"); // 15h00 Paris en mai

export default function ConcoursBanner() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    // setState différé d'un tick pour satisfaire react-hooks/set-state-in-effect.
    const id = setTimeout(() => {
      if (Date.now() < DEADLINE_MS) setActive(true);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  if (!active) return null;

  return (
    <section
      aria-labelledby="concours-banner-title"
      className="relative overflow-hidden bg-[#003850] text-white"
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
        className="absolute inset-0 bg-gradient-to-r from-[#003850]/85 via-[#003850]/70 to-[#04A49B]/80"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
        <div className="flex-1 text-center sm:text-left">
          <span className="inline-block uppercase tracking-[0.18em] text-xs font-semibold text-[#F3BE79] mb-2">
            Jeu concours · Avirun 2K26
          </span>
          <h2
            id="concours-banner-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-2"
          >
            <span className="text-[#F3BE79]">5 analyses de foulée</span> à gagner
          </h2>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-xl">
            Avec Julien Blamont, kinésithérapeute formé à La Clinique du
            Coureur. Tentez votre chance avant le 24 mai à 15h.
          </p>
        </div>

        <div className="flex-shrink-0">
          <Link
            href="/concours-avirun-2026"
            className="inline-block px-7 py-3.5 rounded-full bg-[#F3BE79] text-[#003850] font-semibold hover:bg-[#f0b265] transition-colors duration-200 text-sm sm:text-base shadow-lg whitespace-nowrap"
          >
            Je participe →
          </Link>
        </div>
      </div>
    </section>
  );
}
