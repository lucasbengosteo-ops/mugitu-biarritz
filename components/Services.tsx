import { Activity, Stethoscope, HeartPulse, Dumbbell, type LucideIcon } from "lucide-react";
import type { Dict } from "@/lib/i18n";

interface ServicesProps {
  dict: Dict;
}

// Mapping clé → icône + couleur (les chaînes proviennent du dict).
const META: Record<string, { icon: LucideIcon; color: keyof typeof colorMap }> = {
  kine: { icon: Activity, color: "teal" },
  medecine: { icon: Stethoscope, color: "navy" },
  osteo: { icon: HeartPulse, color: "coral" },
  prepa: { icon: Dumbbell, color: "gold" },
};

const colorMap = {
  teal:  { bg: "hover:bg-[#04A49B]/5",  iconBg: "bg-[#04A49B]/10",  text: "text-[#04A49B]",  border: "hover:border-[#04A49B]/40" },
  navy:  { bg: "hover:bg-[#003850]/5",  iconBg: "bg-[#003850]/10",  text: "text-[#003850]",  border: "hover:border-[#003850]/40" },
  coral: { bg: "hover:bg-[#EE806C]/5",  iconBg: "bg-[#EE806C]/10",  text: "text-[#EE806C]",  border: "hover:border-[#EE806C]/40" },
  gold:  { bg: "hover:bg-[#F3BE79]/10", iconBg: "bg-[#F3BE79]/15",  text: "text-[#d49a40]",  border: "hover:border-[#F3BE79]/50" },
} as const;

export default function Services({ dict }: ServicesProps) {
  return (
    <section id="services" className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#04A49B] text-sm uppercase tracking-widest font-semibold mb-3">
            {dict.services.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#003850] tracking-tight">
            {dict.services.title}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {dict.services.items.map(({ key, title, description }) => {
            const meta = META[key];
            if (!meta) return null;
            const Icon = meta.icon;
            const c = colorMap[meta.color];
            return (
              <div
                key={key}
                className={`group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-lg ${c.bg} ${c.border} transition-all duration-200`}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${c.iconBg} mb-5 transition-colors duration-200`}
                >
                  <Icon className={`w-6 h-6 ${c.text}`} strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-semibold text-[#003850] mb-2">
                  {title}
                </h3>
                <p className="text-[#333334]/70 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
