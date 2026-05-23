"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Mugitu", href: "/#histoire" },
  { label: "Services", href: "/#services" },
  { label: "Équipe", href: "/#equipe" },
  { label: "App", href: "/#app" },
  { label: "Concours", href: "/concours-avirun-2026", highlight: true },
  { label: "Contact", href: "/#contact" },
];

// Synchronisé avec ConcoursTopStrip — quand le bandeau du haut est
// affiché, on pousse la Nav de 44 px vers le bas pour ne pas le masquer.
const CONCOURS_DEADLINE_MS = Date.parse("2026-05-24T13:00:00Z");

export default function Nav() {
  const [scrolledState, setScrolledState] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Seule la home a un hero sombre full-screen qui rend la nav transparente
  // lisible. Sur toutes les autres pages, on force l'état "scrolled" pour
  // garantir un fond blanc et du texte foncé visible dès le haut.
  const isHome = pathname === "/";
  const scrolled = !isHome || scrolledState;

  // Le bandeau "Jeu concours" est visible partout sauf sur la page concours,
  // et tant qu'on n'a pas dépassé la deadline. Quand il est visible, on
  // décale la Nav vers le bas pour ne pas le recouvrir.
  // Initialisé à `true` pour matcher le rendu SSR du bandeau ; l'effet
  // suivant le passe à `false` si on a dépassé la deadline.
  const isContestPage = pathname === "/concours-avirun-2026";
  const [stripActive, setStripActive] = useState(true);
  const stripVisible = !isContestPage && stripActive;

  useEffect(() => {
    const check = () => {
      setStripActive(Date.now() < CONCOURS_DEADLINE_MS);
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

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        stripVisible ? "top-11" : "top-0"
      } ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
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
                  {link.highlight ? "🏃 " : ""}{link.label}
                </a>
              );
            })}
            <a
              href="#contact"
              className="ml-2 px-5 py-2 rounded-full bg-[#04A49B] text-white text-sm font-semibold hover:bg-[#038d85] transition-colors duration-200"
            >
              Prendre RDV
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden flex flex-col gap-1.5 p-2 transition-colors duration-300 ${
              scrolled ? "text-[#333334]" : "text-white"
            }`}
            aria-label="Menu"
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
              {link.highlight ? "🏃 " : ""}{link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-2 px-5 py-2.5 rounded-full bg-[#04A49B] text-white text-sm font-semibold text-center hover:bg-[#038d85] transition-colors"
          >
            Prendre RDV
          </a>
        </nav>
      </div>
    </header>
  );
}
