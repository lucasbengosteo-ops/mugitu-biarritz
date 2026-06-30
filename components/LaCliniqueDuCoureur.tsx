import Image from "next/image";
import type { Dict } from "@/lib/i18n";

interface LaCliniqueDuCoureurProps {
  dict: Dict;
}

const JULIEN_DOCTOLIB_URL =
  "https://www.doctolib.fr/osteopathe/biarritz/julien-blamont";
const CLINIQUE_URL = "https://lacliniqueducoureur.com";

/**
 * Section dédiée à La Clinique du Coureur (palette Mugitu navy + teal),
 * mettant en avant Julien Blamont, kinésithérapeute certifié.
 */
export default function LaCliniqueDuCoureur({ dict }: LaCliniqueDuCoureurProps) {
  const d = dict.cliniqueCoureur;
  return (
    <section
      id="clinique-coureur"
      className="py-20 sm:py-28 bg-[#003850] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: text */}
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#04A49B]/20 text-[#04A49B] text-xs font-semibold uppercase tracking-wider mb-5">
              {d.eyebrow}
            </span>

            {/* Le logo officiel sert de titre visuel ; le H2 reste pour le
                SEO et les lecteurs d'écran via sr-only. */}
            <h2 className="mb-3">
              <span className="sr-only">{d.titleSr}</span>
              <Image
                src="/logo-clinique-coureur.png"
                alt=""
                width={1920}
                height={796}
                className="h-16 sm:h-20 w-auto brightness-0 invert"
                aria-hidden
              />
            </h2>
            <p className="text-[#04A49B] text-sm font-semibold mb-6">
              {d.subtitle}
            </p>

            <p
              className="text-white/70 text-base leading-relaxed mb-8"
              dangerouslySetInnerHTML={{ __html: d.description }}
            />

            {/* Expertises */}
            <div className="mb-8">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-4">
                {d.expertisesLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {d.expertises.map((item) => (
                  <span
                    key={item}
                    className="px-4 py-1.5 rounded-full bg-white/10 text-white/85 text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={JULIEN_DOCTOLIB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#04A49B] text-white text-sm font-semibold hover:bg-[#038d85] transition-colors duration-200"
              >
                {d.ctaBook}
                <span aria-hidden="true">→</span>
              </a>
              <a
                href={CLINIQUE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-colors duration-200"
              >
                {d.ctaLearn}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Right: photo + badge */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-full aspect-[4/5] max-w-sm rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/julien-blamont.jpg"
                alt={d.photoCaptionName}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 80vw, 400px"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-white font-semibold text-sm">
                  {d.photoCaptionName}
                </p>
                <p className="text-white/80 text-xs">{d.photoCaptionRole}</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-3 bg-white/10 rounded-xl px-5 py-3">
              <span aria-hidden className="text-lg leading-none">
                🏃
              </span>
              <span className="text-white/80 text-sm">{d.certifiedBadge}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
