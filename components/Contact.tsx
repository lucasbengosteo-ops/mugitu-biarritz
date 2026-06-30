import type { Dict } from "@/lib/i18n";

interface ContactProps {
  dict: Dict;
}

// Données structurelles partagées
const PRACTITIONER_HREFS = {
  lucas: "https://www.doctolib.fr/osteopathe/ahetze/lucas-bengoechea",
  basile:
    "https://www.doctolib.fr/medecin-du-sport/cambo-les-bains/basile-carcassonne?pid=practice-746000",
  julien: "https://www.doctolib.fr/osteopathe/biarritz/julien-blamont",
  jb: "https://www.doctolib.fr/masseur-kinesitherapeute/biarritz/jean-baptiste-colombie",
} as const;

const PRACTITIONER_ORDER: Array<keyof typeof PRACTITIONER_HREFS> = [
  "lucas",
  "basile",
  "julien",
  "jb",
];

export default function Contact({ dict }: ContactProps) {
  const d = dict.contact;
  return (
    <section id="contact" className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#04A49B] text-sm uppercase tracking-widest font-semibold mb-3">
            {d.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#003850] tracking-tight">
            {d.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: infos + map */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl bg-[#F5EDE4] p-6 space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-[#04A49B] text-lg mt-0.5">📍</span>
                <div>
                  <p className="font-semibold text-[#003850]">{d.addressLabel}</p>
                  <p className="text-[#333334]/70 text-sm">{d.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#04A49B] text-lg mt-0.5">✉️</span>
                <div>
                  <p className="font-semibold text-[#003850]">{d.emailLabel}</p>
                  <a
                    href="mailto:contact@mugitu-biarritz.fr"
                    className="text-[#04A49B] text-sm hover:underline"
                  >
                    contact@mugitu-biarritz.fr
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#04A49B] text-lg mt-0.5">🕐</span>
                <div>
                  <p className="font-semibold text-[#003850]">{d.hoursLabel}</p>
                  <p className="text-[#333334]/70 text-sm">{d.hours}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-64">
              <iframe
                src="https://maps.google.com/maps?q=3+avenue+Kl%C3%A9ber%2C+64200+Biarritz&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={d.mapTitle}
              />
            </div>
          </div>

          {/* Right: Doctolib buttons */}
          <div className="flex flex-col gap-5">
            <p className="text-[#333334]/60 text-sm uppercase tracking-widest font-semibold">
              {d.bookOnlineLabel}
            </p>

            <div className="flex flex-col gap-3">
              {PRACTITIONER_ORDER.map((key) => {
                const p = d.practitioners[key];
                return (
                  <a
                    key={key}
                    href={PRACTITIONER_HREFS[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-6 py-4 rounded-xl border border-[#04A49B]/30 hover:border-[#04A49B] hover:bg-[#04A49B]/5 transition-all duration-200 group"
                  >
                    <div>
                      <p className="font-semibold text-[#003850] text-sm">{p.name}</p>
                      <p className="text-[#04A49B] text-xs">{p.role}</p>
                    </div>
                    <span className="text-[#04A49B] font-bold text-lg group-hover:translate-x-1 transition-transform duration-200">
                      →
                    </span>
                  </a>
                );
              })}
            </div>

            <div className="mt-4 p-5 rounded-xl bg-[#003850]/5 text-center">
              <p className="text-[#333334]/60 text-sm mb-2">{d.orWrite}</p>
              <a
                href="mailto:contact@mugitu-biarritz.fr"
                className="text-[#003850] font-bold text-base hover:text-[#04A49B] transition-colors duration-200"
              >
                contact@mugitu-biarritz.fr
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
