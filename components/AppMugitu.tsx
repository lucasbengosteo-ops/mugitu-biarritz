import Image from "next/image";
import {
  ClipboardList,
  TrendingUp,
  FileText,
  Users,
  Shield,
  GitBranch,
  Map,
  Zap,
  MessageSquare,
  BarChart2,
  type LucideIcon,
} from "lucide-react";
import type { Dict } from "@/lib/i18n";

interface AppMugituProps {
  dict: Dict;
}

const FEATURE_ICONS: Record<string, LucideIcon> = {
  sessions: ClipboardList,
  performance: TrendingUp,
  dossier: FileText,
  coord: Users,
};

const CHIP_META = [
  { icon: Shield, color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" },
  { icon: GitBranch, color: "text-[#04A49B] border-[#04A49B]/30 bg-[#04A49B]/10" },
  { icon: Map, color: "text-violet-400 border-violet-400/30 bg-violet-400/10" },
  { icon: Zap, color: "text-amber-400 border-amber-400/30 bg-amber-400/10" },
  { icon: MessageSquare, color: "text-sky-400 border-sky-400/30 bg-sky-400/10" },
  { icon: BarChart2, color: "text-pink-400 border-pink-400/30 bg-pink-400/10" },
];

export default function AppMugitu({ dict }: AppMugituProps) {
  const d = dict.appMugitu;
  return (
    <section id="app" className="py-20 sm:py-28 bg-[#333334] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#04A49B]/20 text-[#04A49B] text-xs font-semibold uppercase tracking-wider mb-5">
            {d.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            {d.title}
          </h2>
          <p className="text-white/60 text-base leading-relaxed max-w-2xl mx-auto">
            <strong className="text-white">{d.descriptionLead}</strong>
            {d.descriptionRest}
          </p>

          {/* Feature chips row */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {d.chips.map((label, i) => {
              const meta = CHIP_META[i];
              if (!meta) return null;
              const Icon = meta.icon;
              return (
                <span
                  key={label}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${meta.color}`}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                  {label}
                </span>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {d.features.map(({ key, title, description }) => {
              const Icon = FEATURE_ICONS[key] ?? ClipboardList;
              return (
                <div
                  key={key}
                  className="rounded-xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 hover:border-[#04A49B]/30 transition-all duration-200"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#04A49B]/15 mb-4">
                    <Icon className="w-5 h-5 text-[#04A49B]" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-white text-sm font-semibold mb-1.5">
                    {title}
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed">
                    {description}
                  </p>
                </div>
              );
            })}

            {/* CTA */}
            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 mt-2">
              <a
                href="https://app.mugitu.pro"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#04A49B] text-white text-sm font-semibold hover:bg-[#038d85] transition-colors duration-200"
              >
                {d.ctaApp}
                <span aria-hidden="true">→</span>
              </a>
              <a
                href="mailto:contact@mugitu-biarritz.fr"
                className="flex-1 flex items-center justify-center px-6 py-3 rounded-full border border-white/20 text-white/80 text-sm font-semibold hover:bg-white/10 transition-colors duration-200"
              >
                {d.ctaDemo}
              </a>
            </div>
          </div>

          {/* Right: mockup with floating badges */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 bg-[#04A49B]/10 blur-3xl rounded-full scale-75 pointer-events-none" />
            <div className="relative w-full max-w-lg">
              {/* Top-left: HDS badge */}
              <div className="float-a absolute -top-5 -left-2 sm:-left-8 z-10 flex items-center gap-2 bg-[#1a2a35] border border-emerald-400/25 rounded-xl px-3 py-2 shadow-lg">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-400/15">
                  <Shield className="w-4 h-4 text-emerald-400" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold leading-none">
                    {d.badgeHdsTitle}
                  </p>
                  <p className="text-white/40 text-[10px] mt-0.5">
                    {d.badgeHdsSub}
                  </p>
                </div>
              </div>

              {/* Top-right: Flow badge */}
              <div className="float-b absolute -top-5 right-0 z-10 flex items-center gap-2 bg-[#1a2a35] border border-[#04A49B]/25 rounded-xl px-3 py-2 shadow-lg">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#04A49B]/15">
                  <GitBranch className="w-4 h-4 text-[#04A49B]" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold leading-none">
                    {d.badgeFlowTitle}
                  </p>
                  <p className="text-white/40 text-[10px] mt-0.5">
                    {d.badgeFlowSub}
                  </p>
                </div>
              </div>

              {/* Mockup image */}
              <Image
                src="/mockup-app-pro.png"
                alt={d.mockupAlt}
                width={640}
                height={480}
                className="w-full h-auto drop-shadow-2xl mt-6"
              />

              {/* Bottom-left: Roadmap badge */}
              <div className="float-c absolute bottom-10 -left-2 sm:-left-8 z-10 flex items-center gap-2 bg-[#1a2a35] border border-violet-400/25 rounded-xl px-3 py-2 shadow-lg">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-400/15">
                  <Map className="w-4 h-4 text-violet-400" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold leading-none">
                    {d.badgeRoadmapTitle}
                  </p>
                  <p className="text-white/40 text-[10px] mt-0.5">
                    {d.badgeRoadmapSub}
                  </p>
                </div>
              </div>

              {/* Bottom-right: patients counter */}
              <div className="absolute bottom-4 right-2 z-10 bg-white rounded-xl px-4 py-2.5 shadow-xl flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                <span className="text-[#003850] text-xs font-semibold">
                  {d.patientsCounter}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
