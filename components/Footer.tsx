import Image from "next/image";
import Link from "next/link";
import type { Dict, Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";

interface FooterProps {
  dict: Dict;
  locale: Locale;
}

export default function Footer({ dict, locale }: FooterProps) {
  const d = dict.footer;
  return (
    <footer className="bg-[#003850] text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Image
              src="/logo-full-white.png"
              alt="Mugitu logo"
              width={120}
              height={36}
              className="h-8 w-auto object-contain"
            />
            <p className="text-white/50 text-sm">{d.tagline}</p>
            <p className="text-white/40 text-xs">{d.address}</p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 text-sm">
              <Link
                href={localePath(locale, "/mentions-legales")}
                className="text-white/50 hover:text-white transition-colors duration-200"
              >
                {d.legalLinks.mentions}
              </Link>
              <span className="text-white/20">·</span>
              <Link
                href={localePath(locale, "/politique-confidentialite")}
                className="text-white/50 hover:text-white transition-colors duration-200"
              >
                {d.legalLinks.privacy}
              </Link>
            </div>
            <a
              href="https://app.mugitu.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#04A49B] text-sm hover:text-[#04A49B]/80 transition-colors duration-200"
            >
              {d.practitionerSpace}
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-white/30 text-xs">{d.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
