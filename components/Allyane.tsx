import Image from "next/image";

const indications = [
  "Chirurgie ligamentaire",
  "Traumatismes sportifs",
  "Douleurs chroniques",
  "Récupération post-op",
];

export default function Allyane() {
  return (
    <section id="allyane" className="py-20 sm:py-28 bg-[#003850]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: text */}
          <div>
            {/* Badge */}
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#04A49B]/20 text-[#04A49B] text-xs font-semibold uppercase tracking-wider mb-5">
              Méthode certifiée
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">
              Thérapie Allyane®
            </h2>

            <p className="text-white/70 text-base leading-relaxed mb-8">
              La thérapie Allyane® est une approche de reprogrammation neuromotrice
              qui permet de lever les inhibitions musculaires post-traumatiques.
              Résultats en 1 à 3 séances.
            </p>

            {/* Indications */}
            <div className="mb-8">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-4">
                Indications
              </p>
              <div className="flex flex-wrap gap-2">
                {indications.map((item) => (
                  <span
                    key={item}
                    className="px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <a
              href="https://www.allyane.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-colors duration-200"
            >
              En savoir plus
              <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* Right: image + logo */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/allyane-session.png"
                alt="Séance de thérapie Allyane"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-5 py-3">
              <Image
                src="/logo-allyane.svg"
                alt="Logo Allyane"
                width={100}
                height={32}
                className="brightness-0 invert h-8 w-auto"
              />
              <span className="text-white/60 text-sm">Praticiens certifiés</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
