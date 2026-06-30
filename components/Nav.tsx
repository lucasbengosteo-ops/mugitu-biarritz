"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dict, Locale } from "@/lib/i18n";
import { localePath, swapLocalePath, detectLocale } from "@/lib/i18n";

// Synchronisé avec ConcoursTopStrip — quand le bandeau du haut est
// affiché, on pousse la Nav de 44 px vers le bas pour ne pas le masquer.
// Le bandeau reste visible avant la deadline ET pendant 7 jours après
// (mode "résultats annoncés"), puis disparaît.
const CONCOURS_DEADLINE_MS = Date.parse("2026-05-24T13:00:00Z");
const CONCOURS_STRIP_HIDE_MS = CONCOURS_DEADLINE_MS + 7 * 86_400_000;

interface NavProps {
  dict: Dict;
  locale: Locale;
}

interface LangSwitcherProps {
  dict: Dict;
  currentLocale: Locale;
  otherLocalePath: string;
  scrolled: boolean;
  onNavigate?: () => void;
}

function LangSwitcher({
  dict,
  currentLocale,
  otherLocalePath,
  scrolled,
  onNavigate,
}: LangSwitcherProps) {
  return (
    <Link
      href={otherLocalePath}
      hrefLang={currentLocale === "fr" ? "eu" : "fr"}
      aria-label={dict.meta.switchAriaLabel}
      onClick={onNavigate}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200 ${
        scrolled
          ? "border-[#003850]/20 text-[#003850]/80 hover:border-[#04A49B] hover:text-[#04A49B]"
          : "border-white/40 text-white/85 hover:border-white hover:text-white"
      }`}
    >
      <span className="opacity-50">{dict.meta.localeShort}</span>
      <span aria-hidden>↔</span>
      <span>{dict.meta.altLocaleShort}</span>
    </Link>
  );
}

export default function Nav({ dict, locale }: NavProps) {
  const [scrolledState, setScrolledState] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Détection de la home (compatible FR et EU)
  const isHome = pathname === "/" || pathname === "/eu" || pathname === "/eu/";
  const scrolled = !isHome || scrolledState;

  // Le bandeau "Jeu concours" est visible partout sauf sur les pages concours,
  // tant qu'on reste dans la fenêtre d'affichage. Quand il est visible, on
  // décale la Nav vers le bas pour ne pas le recouvrir.
  const isContestPage =
    pathname === "/concours-avirun-2026" ||
    pathname === "/eu/concours-avirun-2026";
  const [stripActive, setStripActive] = useState(true);
  const stripVisible = !isContestPage && stripActive;

  // Le switcher renvoie sur le pathname équivalent dans l'autre langue.
  const otherLocalePath = swapLocalePath(pathname || "/");
  const currentLocale = detectLocale(pathname || "/");

  // Liens de navigation calculés à partir du dict + locale
  const navLinks = [
    { label: dict.nav.mugitu, href: localePath(locale, "/") + "#histoire" },
    { label: dict.nav.services, href: localePath(locale, "/") + "#services" },
    { label: dict.nav.team, href: localePath(locale, "/") + "#equipe" },
    { label: dict.nav.app, href: localePath(locale, "/") + "#app" },
    {
      label: dict.nav.contest,
      href: localePath(locale, "/concours-avirun-2026"),
      highlight: true,
    },
    { label: dict.nav.contact, href: localePath(locale, "/") + "#contact" },
  ];

  // Lien "Prendre RDV" → vers la section contact de la page courante (ou
  // home si on est sur une page sans section #contact, ce qui rebascule sur
  // la home dans la bonne langue).
  const bookAppointmentHref = localePath(locale, "/") + "#contact";

  useEffect(() => {
    const check = () => {
      setStripActive(Date.now() < CONCOURS_STRIP_HIDE_MS);
    };
    const id = setTimeout(check, 0);
    const interval = setInterval(check, 60_000);
    return () => {
      clearTimeout(id);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => {
      setScrolledState(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const switcherProps = {
    dict,
    currentLocale,
    otherLocalePath,
    scrolled,
  };

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        stripVisible ? "top-11" : "top-0"
      } ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={localePath(locale, "/")} className="flex items-center">
            <Image
              src={scrolled ? "/logo-mini-navy.png" : "/logo-full-white.png"}
              alt="Mugitu logo"
              width={120}
              height={36}
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const baseColor = scrolled ? "text-[#333334]" : "text-white/80";
              const highlightColor = scrolled ? "text-[#EE806C]" : "text-[#F3BE79]";
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-300 hover:text-[#04A49B] ${
                    link.highlight ? `${highlightColor} font-semibold` : baseColor
                  }`}
                >
                  {link.highlight ? "🏃 " : ""}
                  {link.label}
                </a>
              );
            })}
            <LangSwitcher {...switcherProps} />
            <a
              href={bookAppointmentHref}
              className="ml-1 px-5 py-2 rounded-full bg-[#04A49B] text-white text-sm font-semibold hover:bg-[#038d85] transition-colors duration-200"
            >
              {dict.nav.bookAppointment}
            </a>
          </nav>

          {/* Mobile : LangSwitcher + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <LangSwitcher {...switcherProps} />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`flex flex-col gap-1.5 p-2 transition-colors duration-300 ${
                scrolled ? "text-[#333334]" : "text-white"
              }`}
              aria-label={dict.nav.menuLabel}
            >
              <span
                className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        } bg-white shadow-lg`}
      >
        <nav className="flex flex-col px-4 py-4 gap-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium py-2 border-b border-gray-100 hover:text-[#04A49B] ${
                link.highlight ? "text-[#EE806C] font-semibold" : "text-[#333334]"
              }`}
            >
              {link.highlight ? "🏃 " : ""}
              {link.label}
            </a>
          ))}
          <a
            href={bookAppointmentHref}
            onClick={() => setMenuOpen(false)}
            className="mt-2 px-5 py-2.5 rounded-full bg-[#04A49B] text-white text-sm font-semibold text-center hover:bg-[#038d85] transition-colors"
          >
            {dict.nav.bookAppointment}
          </a>
        </nav>
      </div>
    </header>
  );
}
