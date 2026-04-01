import { Activity, Stethoscope, HeartPulse, Dumbbell } from "lucide-react";

const services = [
  {
    icon: Activity,
    title: "Kinésithérapie du sport",
    description:
      "Rééducation fonctionnelle et suivi personnalisé pour les sportifs de tous niveaux. Prise en charge des blessures musculaires, tendineuses et articulaires.",
  },
  {
    icon: Stethoscope,
    title: "Médecine du sport",
    description:
      "Consultation médicale spécialisée, bilan de santé du sportif, certificats médicaux et suivi de performance. Traumatologie et médecine préventive.",
  },
  {
    icon: HeartPulse,
    title: "Ostéopathie du sport",
    description:
      "Approche globale et manuelle pour améliorer la mobilité, la récupération et les performances. Idéale en complément des soins de rééducation.",
  },
  {
    icon: Dumbbell,
    title: "Préparation physique",
    description:
      "Programmes individualisés de préparation physique et de retour au sport. Athletic training, prévention des blessures et optimisation des capacités athlétiques.",
  },
];

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
          {services.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md hover:border-[#04A49B]/30 transition-all duration-200"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#04A49B]/10 mb-5 group-hover:bg-[#04A49B]/20 transition-colors duration-200">
                <Icon className="w-6 h-6 text-[#04A49B]" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-semibold text-[#003850] mb-2">{title}</h3>
              <p className="text-[#333334]/70 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
