import Image from "next/image";

const expertises = [
  "Analyse de foulée",
  "Bilan du coureur",
  "Retour à la course post-blessure",
  "Prévention des blessures",
  "Programmation de la charge",
];

const JULIEN_DOCTOLIB_URL =
  "https://www.doctolib.fr/osteopathe/biarritz/julien-blamont";
const CLINIQUE_URL = "https://lacliniqueducoureur.com";

/**
 * Section dédiée à La Clinique du Coureur, formation/certification
 * internationale en prise en charge du coureur (fondée par Blaise Dubois,
 * Québec). Met en avant Julien Blamont, praticien certifié, et son lien
 * de prise de RDV en ligne.
 *
 * Reprend la structure visuelle d'Allyane (section sombre, 2 colonnes,
 * badge "praticien certifié") mais avec une palette forêt/coureur pour
 * différencier les deux partenariats.
 */
export default function LaCliniqueDuCoureur() {
  return (
    <section
      id="clinique-coureur"
      className="py-20 sm:py-28 bg-[#1E3D2F] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: text */}
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F47B3F]/20 text-[#F3D58C] text-xs font-semibold uppercase tracking-wider mb-5">
              Méthode certifiée
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
              La Clinique du Coureur
            </h2>
            <p className="text-[#F3D58C] text-sm font-semibold mb-6">
              Référence internationale du suivi du coureur
            </p>

            <p className="text-white/70 text-base leading-relaxed mb-8">
              Approche fondée par Blaise Dubois (Québec), basée sur la
              preuve scientifique et la programmation rigoureuse de la
              charge d&apos;entraînement. Julien Blamont, kinésithérapeute
              du sport à Mugitu Biarritz, est <strong className="text-white">praticien certifié</strong>
              {" "}et accompagne les coureurs amateurs comme confirmés.
            </p>

            {/* Expertises */}
            <div className="mb-8">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-4">
                Expertises
              </p>
              <div className="flex flex-wrap gap-2">
                {expertises.map((item) => (
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
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#F47B3F] text-white text-sm font-semibold hover:bg-[#e06a2e] transition-colors duration-200"
              >
                Prendre RDV avec Julien
                <span aria-hidden="true">→</span>
              </a>
              <a
                href={CLINIQUE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-colors duration-200"
              >
                En savoir plus
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Right: photo + badge */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-full aspect-[4/5] max-w-sm rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/julien-blamont.jpg"
                alt="Julien Blamont, kinésithérapeute du sport et praticien certifié La Clinique du Coureur"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 80vw, 400px"
              />
              {/* Gradient subtle en bas pour intégrer la légende */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-white font-semibold text-sm">
                  Julien Blamont
                </p>
                <p className="text-white/80 text-xs">
                  Kinésithérapeute du sport · Mugitu Biarritz
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-3 bg-white/10 rounded-xl px-5 py-3">
              <span
                aria-hidden
                className="text-lg leading-none"
              >
                🏃
              </span>
              <span className="text-white/80 text-sm">
                Praticien certifié La Clinique du Coureur
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
