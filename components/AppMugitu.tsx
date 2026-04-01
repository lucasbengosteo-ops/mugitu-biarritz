import Image from "next/image";
import { ClipboardList, TrendingUp, FileText, Users } from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "Suivi de séances",
    description: "Historique complet, notes de consultation et évolution clinique en un clic.",
  },
  {
    icon: TrendingUp,
    title: "Monitoring performance",
    description: "Tableaux de bord personnalisés pour suivre la progression de chaque sportif.",
  },
  {
    icon: FileText,
    title: "Dossier patient digital",
    description: "Documents, bilans et ordonnances centralisés et sécurisés.",
  },
  {
    icon: Users,
    title: "Coordination d'équipe",
    description: "Partagez le dossier entre kiné, médecin et ostéo pour une prise en charge coordonnée.",
  },
];

export default function AppMugitu() {
  return (
    <section id="app" className="py-20 sm:py-28 bg-[#333334] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#04A49B]/20 text-[#04A49B] text-xs font-semibold uppercase tracking-wider mb-5">
            Outil exclusif praticiens
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Le suivi qui fait la différence
          </h2>
          <p className="text-white/60 text-base leading-relaxed max-w-2xl mx-auto">
            <strong className="text-white">app.mugitu.pro</strong> — notre plateforme de suivi patient développée pour les praticiens du sport. Dossiers, séances, bilans : tout ce qu&apos;il faut pour un accompagnement vraiment qualitatif.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 hover:border-[#04A49B]/30 transition-all duration-200"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#04A49B]/15 mb-4">
                  <Icon className="w-5 h-5 text-[#04A49B]" strokeWidth={1.75} />
                </div>
                <h3 className="text-white text-sm font-semibold mb-1.5">{title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{description}</p>
              </div>
            ))}

            {/* CTA */}
            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 mt-2">
              <a
                href="https://app.mugitu.pro"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#04A49B] text-white text-sm font-semibold hover:bg-[#038d85] transition-colors duration-200"
              >
                Accéder à l&apos;app
                <span aria-hidden="true">→</span>
              </a>
              <a
                href="mailto:contact@mugitu-biarritz.fr"
                className="flex-1 flex items-center justify-center px-6 py-3 rounded-full border border-white/20 text-white/80 text-sm font-semibold hover:bg-white/10 transition-colors duration-200"
              >
                Demander une démo
              </a>
            </div>
          </div>

          {/* Right: mockup */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Glow */}
            <div className="absolute inset-0 bg-[#04A49B]/10 blur-3xl rounded-full scale-75" />
            <div className="relative w-full max-w-sm lg:max-w-md">
              <Image
                src="/mockup-andrew.png"
                alt="Interface app.mugitu.pro"
                width={480}
                height={360}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl px-4 py-3 shadow-xl flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[#003850] text-xs font-semibold">Suivi en temps réel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
