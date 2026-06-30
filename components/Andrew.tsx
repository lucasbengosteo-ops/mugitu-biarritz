import Image from "next/image";
import { Smartphone, Video, BarChart2, Bell, type LucideIcon } from "lucide-react";
import type { Dict } from "@/lib/i18n";

interface AndrewProps {
  dict: Dict;
}

const FEATURE_ICONS: Record<string, LucideIcon> = {
  video: Video,
  observance: BarChart2,
  reminders: Bell,
  mobile: Smartphone,
};

export default function Andrew({ dict }: AndrewProps) {
  const d = dict.andrew;
  return (
    <section id="andrew" className="py-20 sm:py-28 bg-[#FDF8F4] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E8603C]/15 text-[#E8603C] text-xs font-semibold uppercase tracking-wider mb-5">
            {d.eyebrow}
          </span>
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#003850] tracking-tight">
              {d.titlePre}
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
          <p
            className="text-[#333334]/60 text-base leading-relaxed max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{ __html: d.description }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: phone mockup */}
          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-[#E8603C]/10 blur-3xl rounded-full scale-75 pointer-events-none" />
            <div className="relative">
              <Image
                src="/andrew-app-screenshot.webp"
                alt={d.mockupAlt}
                width={300}
                height={580}
                className="w-64 sm:w-72 h-auto drop-shadow-2xl"
              />
              {/* Floating stat */}
              <div className="absolute -right-6 top-12 bg-white rounded-2xl px-4 py-3 shadow-xl border border-[#E8603C]/10">
                <p className="text-[10px] text-[#333334]/50 uppercase tracking-wider mb-0.5">
                  {d.observanceLabel}
                </p>
                <p className="text-xl font-bold text-[#E8603C]">{d.observanceValue}</p>
              </div>
              {/* Floating tag */}
              <div className="absolute -left-6 bottom-16 bg-white rounded-2xl px-4 py-3 shadow-xl border border-[#E8603C]/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#E8603C] animate-pulse" />
                <span className="text-xs font-semibold text-[#003850]">
                  {d.activeProgramLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Right: features */}
          <div className="space-y-5">
            {d.features.map(({ key, title, description }) => {
              const Icon = FEATURE_ICONS[key] ?? Video;
              return (
                <div
                  key={key}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#E8603C]/10 hover:border-[#E8603C]/30 hover:shadow-sm transition-all duration-200"
                >
                  <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#E8603C]/10">
                    <Icon className="w-5 h-5 text-[#E8603C]" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-[#003850] text-sm font-semibold mb-1">
                      {title}
                    </h3>
                    <p className="text-[#333334]/55 text-xs leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              );
            })}

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://andrew.care"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E8603C] text-white text-sm font-semibold hover:bg-[#d4522f] transition-colors duration-200"
              >
                {d.cta}
                <span aria-hidden="true">→</span>
              </a>
              <span className="text-xs text-[#333334]/40">{d.ctaSub}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
