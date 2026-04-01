import { Activity, Stethoscope, HeartPulse, Dumbbell } from "lucide-react";

const services = [
  {
    icon: Activity,
    color: "teal",
    title: "Kinésithérapie du sport",
    description:
      "Rééducation fonctionnelle et suivi personnalisé pour les sportifs de tous niveaux. Prise en charge des blessures musculaires, tendineuses et articulaires.",
  },
  {
    icon: Stethoscope,
    color: "navy",
    title: "Médecine du sport",
    description:
      "Consultation médicale spécialisée, bilan de santé du sportif, certificats médicaux et suivi de performance. Traumatologie et médecine préventive.",
  },
  {
    icon: HeartPulse,
    color: "coral",
    title: "Ostéopathie du sport",
    description:
      "Approche globale et manuelle pour améliorer la mobilité, la récupération et les performances. Idéale en complément des soins de rééducation.",
  },
  {
    icon: Dumbbell,
    color: "gold",
    title: "Préparation physique",
    description:
      "Programmes individualisés de préparation physique et de retour au sport. Athletic training, prévention des blessures et optimisation des capacités athlétiques.",
  },
];

const colorMap: Record<string, { bg: string; iconBg: string; text: string; border: string }> = {
  teal:  { bg: "hover:bg-[#04A49B]/5",  iconBg: "bg-[#04A49B]/10",  text: "text-[#04A49B]",  border: "hover:border-[#04A49B]/40" },
  navy:  { bg: "hover:bg-[#003850]/5",  iconBg: "bg-[#003850]/10",  text: "text-[#003850]",  border: "hover:border-[#003850]/40" },
  coral: { bg: "hover:bg-[#EE806C]/5",  iconBg: "bg-[#EE806C]/10",  text: "text-[#EE806C]",  border: "hover:border-[#EE806C]/40" },
  gold:  { bg: "hover:bg-[#F3BE79]/10", iconBg: "bg-[#F3BE79]/15",  text: "text-[#d49a40]",  border: "hover:border-[#F3BE79]/50" },
};

export default function Services() {
  return (
    <section id="services" className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#04A49B] text-sm uppercase tracking-widest font-semibold mb-3">
            Ce que nous proposons
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#003850] tracking-tight">
            Nos services
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {services.map(({ icon: Icon, color, title, description }) => {
            const c = colorMap[color];
            return (
              <div
                key={title}
                className={`group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-lg ${c.bg} ${c.border} transition-all duration-200`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${c.iconBg} mb-5 transition-colors duration-200`}>
                  <Icon className={`w-6 h-6 ${c.text}`} strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-semibold text-[#003850] mb-2">{title}</h3>
                <p className="text-[#333334]/70 text-sm leading-relaxed">{description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
