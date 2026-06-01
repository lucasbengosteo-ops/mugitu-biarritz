import { Trophy } from "lucide-react";
import type { Dict } from "@/lib/i18n";

/**
 * Annonce officielle des gagnant·es du concours Avirun 2K26.
 *
 * Données partagées entre les locales : la liste des handles Instagram
 * et le code de certification sont identiques (les pseudos sont des
 * noms propres). Seuls les libellés autour sont traduits.
 */

interface Winner {
  rank: number;
  handle: string;
}

const WINNERS: Winner[] = [
  { rank: 1, handle: "julie_delente" },
  { rank: 2, handle: "rafii7" },
  { rank: 3, handle: "julienmaillartadventure" },
  { rank: 4, handle: "pantxobrs" },
  { rank: 5, handle: "elodype" },
];

const SORTEOS_HANDLE = "app_sorteos_ok";
const SORTEOS_CODE = "KL7GQW8";

function instagramUrl(handle: string) {
  return `https://www.instagram.com/${handle}/`;
}

interface WinnersAnnouncementProps {
  dict: Dict;
}

export default function WinnersAnnouncement({ dict }: WinnersAnnouncementProps) {
  const w = dict.winners;
  return (
    <section
      id="resultats"
      aria-labelledby="resultats-title"
      className="relative overflow-hidden bg-gradient-to-br from-[#F47B3F] via-[#EE6A5C] to-[#EB5582] py-16 sm:py-20 text-white scroll-mt-20"
    >
      {/* Texture points pour signature visuelle Avirun */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/15 backdrop-blur mb-5">
            <Trophy
              className="w-8 h-8 text-[#F3D58C]"
              strokeWidth={1.75}
              aria-hidden
            />
          </div>
          <p className="uppercase tracking-[0.2em] text-xs sm:text-sm font-semibold text-white/85 mb-3">
            {w.eyebrow}
          </p>
          <h2
            id="resultats-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
          >
            {w.title}
          </h2>
          <p className="mt-4 text-white/85 max-w-xl mx-auto leading-relaxed">
            {w.body}
          </p>
        </div>

        {/* Winners list */}
        <ol className="space-y-3 sm:space-y-4 mb-8">
          {WINNERS.map(({ rank, handle }) => (
            <li key={handle}>
              <a
                href={instagramUrl(handle)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 sm:gap-5 rounded-2xl bg-white/12 hover:bg-white/20 backdrop-blur-sm border border-white/15 px-5 py-4 sm:px-6 sm:py-5 transition-colors"
              >
                <span
                  aria-hidden
                  className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-[#EB5582] font-bold text-lg sm:text-xl flex items-center justify-center shadow-md tabular-nums"
                >
                  {rank}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold text-base sm:text-lg break-all">
                    @{handle}
                  </span>
                  <span className="block text-xs sm:text-sm text-white/70 mt-0.5">
                    {w.seeProfile}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="text-white/80 text-xl group-hover:translate-x-1 transition-transform"
                >
                  →
                </span>
              </a>
            </li>
          ))}
        </ol>

        {/* Certification */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-5 sm:p-6 text-center">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-2">
            {w.certifLabel}
          </p>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            {w.certifBodyPrefix}
            <a
              href={instagramUrl(SORTEOS_HANDLE)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-2 hover:text-[#F3D58C]"
            >
              @{SORTEOS_HANDLE}
            </a>
            {w.certifBodySeparator}
            <span className="font-mono text-xs sm:text-sm bg-black/20 rounded px-2 py-0.5 tabular-nums">
              {w.certifCodePrefix}
              {SORTEOS_CODE}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
