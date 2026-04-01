import Image from "next/image";
import { Smartphone, Video, BarChart2, Bell } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Exercices en vidéo",
    description: "Programmes personnalisés avec instructions vidéo, accessibles à tout moment sur smartphone.",
  },
  {
    icon: BarChart2,
    title: "Suivi de l'observance",
    description: "Visualisez en temps réel l'adhésion de vos patients à leur programme de rééducation.",
  },
  {
    icon: Bell,
    title: "Rappels automatiques",
    description: "Notifications intelligentes pour maintenir la régularité entre les séances.",
  },
  {
    icon: Smartphone,
    title: "Application mobile",
    description: "Disponible sur iOS et Android. Le patient retrouve son programme directement sur son téléphone.",
  },
];

export default function Andrew() {
  return (
    <section id="andrew" className="py-20 sm:py-28 bg-[#FDF8F4] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E8603C]/15 text-[#E8603C] text-xs font-semibold uppercase tracking-wider mb-5">
            Suivi à distance
          </span>
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#003850] tracking-tight">
              Prolongez la séance avec
            </h2>
          </div>
          <div className="flex justify-center mb-5">
            <Image
              src="/logo-andrew.png"
              alt="Andrew"
              width={160}
              height={48}
              className="h-10 w-auto"
            />
          </div>
          <p className="text-[#333334]/60 text-base leading-relaxed max-w-2xl mx-auto">
            Nos praticiens prescrivent des programmes de rééducation sur <strong className="text-[#333334]">Andrew®</strong>, l'application mobile qui permet au patient de continuer son travail chez lui — avec vidéos, suivi d'observance et messagerie directe avec le praticien.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: phone mockup */}
          <div className="relative flex justify-center">
            {/* Glow blob */}
            <div className="absolute inset-0 bg-[#E8603C]/10 blur-3xl rounded-full scale-75 pointer-events-none" />
            <div className="relative">
              <Image
                src="/andrew-app-screenshot.webp"
                alt="Application Andrew — exercices recommandés"
                width={300}
                height={580}
                className="w-64 sm:w-72 h-auto drop-shadow-2xl"
              />
              {/* Floating stat */}
              <div className="absolute -right-6 top-12 bg-white rounded-2xl px-4 py-3 shadow-xl border border-[#E8603C]/10">
                <p className="text-[10px] text-[#333334]/50 uppercase tracking-wider mb-0.5">Observance</p>
                <p className="text-xl font-bold text-[#E8603C]">87%</p>
              </div>
              {/* Floating tag */}
              <div className="absolute -left-6 bottom-16 bg-white rounded-2xl px-4 py-3 shadow-xl border border-[#E8603C]/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#E8603C] animate-pulse" />
                <span className="text-xs font-semibold text-[#003850]">Programme actif</span>
              </div>
            </div>
          </div>

          {/* Right: features */}
          <div className="space-y-5">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#E8603C]/10 hover:border-[#E8603C]/30 hover:shadow-sm transition-all duration-200"
              >
                <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#E8603C]/10">
                  <Icon className="w-5 h-5 text-[#E8603C]" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-[#003850] text-sm font-semibold mb-1">{title}</h3>
                  <p className="text-[#333334]/55 text-xs leading-relaxed">{description}</p>
                </div>
              </div>
            ))}

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://andrew.care"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E8603C] text-white text-sm font-semibold hover:bg-[#d4522f] transition-colors duration-200"
              >
                Découvrir Andrew®
                <span aria-hidden="true">→</span>
              </a>
              <span className="text-xs text-[#333334]/40">Disponible iOS & Android</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
