const doctolibLinks = [
  {
    name: "Lucas Bengoechea",
    role: "Ostéopathe du sport",
    href: "https://www.doctolib.fr/osteopathe/ahetze/lucas-bengoechea",
  },
  {
    name: "Dr Basile Carcassonne",
    role: "Médecin du sport",
    href: "https://www.doctolib.fr/medecin-du-sport/cambo-les-bains/basile-carcassonne?pid=practice-746000",
  },
  {
    name: "Jean-Baptiste Colombié",
    role: "Kinésithérapeute du sport",
    href: "https://www.doctolib.fr/masseur-kinesitherapeute/biarritz/jean-baptiste-colombie",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#04A49B] text-sm uppercase tracking-widest font-semibold mb-3">
            Adresse & rendez-vous
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#003850] tracking-tight">
            Nous trouver
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: infos + map */}
          <div className="flex flex-col gap-6">
            {/* Infos */}
            <div className="rounded-2xl bg-[#F5EDE4] p-6 space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-[#04A49B] text-lg mt-0.5">📍</span>
                <div>
                  <p className="font-semibold text-[#003850]">Adresse</p>
                  <p className="text-[#333334]/70 text-sm">3 avenue Kléber, 64200 Biarritz</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#04A49B] text-lg mt-0.5">✉️</span>
                <div>
                  <p className="font-semibold text-[#003850]">Email</p>
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
                  <p className="font-semibold text-[#003850]">Horaires</p>
                  <p className="text-[#333334]/70 text-sm">Lundi — Vendredi : 8h00 — 19h00</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2910.123!2d-1.5586!3d43.4832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDI5JzAwLjIiTiAxwrAzMyczMS4wIlc!5e0!3m2!1sfr!2sfr!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation Mugitu Biarritz"
              />
            </div>
          </div>

          {/* Right: Doctolib buttons */}
          <div className="flex flex-col gap-5">
            <p className="text-[#333334]/60 text-sm uppercase tracking-widest font-semibold">
              Réserver en ligne
            </p>

            <div className="flex flex-col gap-3">
              {doctolibLinks.map(({ name, role, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-6 py-4 rounded-xl border border-[#04A49B]/30 hover:border-[#04A49B] hover:bg-[#04A49B]/5 transition-all duration-200 group"
                >
                  <div>
                    <p className="font-semibold text-[#003850] text-sm">{name}</p>
                    <p className="text-[#04A49B] text-xs">{role}</p>
                  </div>
                  <span className="text-[#04A49B] font-bold text-lg group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-4 p-5 rounded-xl bg-[#003850]/5 text-center">
              <p className="text-[#333334]/60 text-sm mb-2">Ou écrivez-nous</p>
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
