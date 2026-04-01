import Image from "next/image";
import { ClipboardList, TrendingUp, FileText, Users, Shield, GitBranch, Map, Zap, MessageSquare, BarChart2 } from "lucide-react";

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

const floatingBadges = [
  {
    icon: Shield,
    label: "Hébergement HDS",
    sub: "Données de santé certifiées",
    color: "text-emerald-400",
    bg: "bg-emerald-400/15 border-emerald-400/20",
    position: "top-0 -left-4 sm:-left-10",
  },
  {
    icon: GitBranch,
    label: "Flow consultation",
    sub: "Parcours guidé étape par étape",
    color: "text-[#04A49B]",
    bg: "bg-[#04A49B]/10 border-[#04A49B]/20",
    position: "top-0 right-0",
  },
  {
    icon: Map,
    label: "Roadmap de suivi",
    sub: "Vision globale du parcours patient",
    color: "text-violet-400",
    bg: "bg-violet-400/10 border-violet-400/20",
    position: "-bottom-2 -left-4 sm:-left-10",
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

          {/* Feature chips row */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              { icon: Shield, label: "Hébergement HDS", color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" },
              { icon: GitBranch, label: "Flow consultation", color: "text-[#04A49B] border-[#04A49B]/30 bg-[#04A49B]/10" },
              { icon: Map, label: "Roadmap de suivi", color: "text-violet-400 border-violet-400/30 bg-violet-400/10" },
              { icon: Zap, label: "Thérapie Allyane®", color: "text-amber-400 border-amber-400/30 bg-amber-400/10" },
              { icon: MessageSquare, label: "Messagerie inter-praticiens", color: "text-sky-400 border-sky-400/30 bg-sky-400/10" },
              { icon: BarChart2, label: "Bilans & analytics", color: "text-pink-400 border-pink-400/30 bg-pink-400/10" },
            ].map(({ icon: Icon, label, color }) => (
              <span
                key={label}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${color}`}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                {label}
              </span>
            ))}
          </div>
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

          {/* Right: mockup with floating badges */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 bg-[#04A49B]/10 blur-3xl rounded-full scale-75 pointer-events-none" />
            <div className="relative w-full max-w-lg">

              {/* Top-left: HDS badge */}
              <div className="absolute -top-5 -left-2 sm:-left-8 z-10 flex items-center gap-2 bg-[#1a2a35] border border-emerald-400/25 rounded-xl px-3 py-2 shadow-lg">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-400/15">
                  <Shield className="w-4 h-4 text-emerald-400" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold leading-none">Hébergement HDS</p>
                  <p className="text-white/40 text-[10px] mt-0.5">Données de santé certifiées</p>
                </div>
              </div>

              {/* Top-right: Flow badge */}
              <div className="absolute -top-5 right-0 z-10 flex items-center gap-2 bg-[#1a2a35] border border-[#04A49B]/25 rounded-xl px-3 py-2 shadow-lg">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#04A49B]/15">
                  <GitBranch className="w-4 h-4 text-[#04A49B]" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold leading-none">Flow consultation</p>
                  <p className="text-white/40 text-[10px] mt-0.5">Parcours guidé</p>
                </div>
              </div>

              {/* Mockup image */}
              <Image
                src="/mockup-app-pro.png"
                alt="Interface app.mugitu.pro sur laptop et mobile"
                width={640}
                height={480}
                className="w-full h-auto drop-shadow-2xl mt-6"
              />

              {/* Bottom-left: Roadmap badge */}
              <div className="absolute bottom-10 -left-2 sm:-left-8 z-10 flex items-center gap-2 bg-[#1a2a35] border border-violet-400/25 rounded-xl px-3 py-2 shadow-lg">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-400/15">
                  <Map className="w-4 h-4 text-violet-400" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold leading-none">Roadmap de suivi</p>
                  <p className="text-white/40 text-[10px] mt-0.5">Vision parcours patient</p>
                </div>
              </div>

              {/* Bottom-right: patients counter */}
              <div className="absolute bottom-4 right-2 z-10 bg-white rounded-xl px-4 py-2.5 shadow-xl flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                <span className="text-[#003850] text-xs font-semibold">1785 patients suivis</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
