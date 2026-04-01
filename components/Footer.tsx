import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#003850] text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <Image
                src="/logo-mini-navy.png"
                alt="Mugitu logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain brightness-0 invert"
              />
              <span className="font-semibold text-lg">Mugitu</span>
            </div>
            <p className="text-white/50 text-sm">La maison du mouvement</p>
            <p className="text-white/40 text-xs">3 av. Kléber, 64200 Biarritz</p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 text-sm">
              <Link
                href="/mentions-legales"
                className="text-white/50 hover:text-white transition-colors duration-200"
              >
                Mentions légales
              </Link>
              <span className="text-white/20">·</span>
              <Link
                href="/politique-confidentialite"
                className="text-white/50 hover:text-white transition-colors duration-200"
              >
                Politique de confidentialité
              </Link>
            </div>
            <a
              href="https://app.mugitu.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#04A49B] text-sm hover:text-[#04A49B]/80 transition-colors duration-200"
            >
              Espace praticien →
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-white/30 text-xs">
            © 2025 Mugitu · 3 av. Kléber, Biarritz
          </p>
        </div>
      </div>
    </footer>
  );
}
