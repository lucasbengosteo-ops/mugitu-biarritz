import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/logo-full-white.png"
      >
        <source src="/hero-sport.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">
        {/* Logo complet blanc */}
        <div className="mb-6 reveal">
          <Image
            src="/logo-full-white.png"
            alt="Mugitu — La maison du mouvement"
            width={420}
            height={150}
            className="w-64 sm:w-96 h-auto"
            priority
          />
        </div>

        {/* Subtitle */}
        <h1
          className="text-white/85 text-lg sm:text-xl font-light leading-relaxed mb-10 reveal"
          style={{ animationDelay: "0.2s" }}
        >
          Centre pluridisciplinaire de kinésithérapie du sport,<br className="hidden sm:block" />
          médecine du sport et ostéopathie à Biarritz.
        </h1>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 reveal"
          style={{ animationDelay: "0.35s" }}
        >
          <a
            href="#contact"
            className="px-8 py-3.5 rounded-full bg-[#04A49B] text-white font-semibold hover:bg-[#038d85] transition-colors duration-200 text-sm"
          >
            Prendre rendez-vous
          </a>
          <a
            href="#equipe"
            className="px-8 py-3.5 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors duration-200 text-sm"
          >
            Découvrir l&apos;équipe
          </a>
        </div>
      </div>

      {/* Stats bar */}
      <div
        className="relative z-10 w-full max-w-3xl mx-auto px-6 mt-14 reveal"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="grid grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {[
            { value: "4", label: "Spécialistes" },
            { value: "3", label: "Disciplines" },
            { value: "360°", label: "Suivi sportif" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center py-4 bg-white/5 hover:bg-white/10 transition-colors duration-200"
            >
              <span className="text-2xl font-bold text-white">{value}</span>
              <span className="text-white/50 text-xs uppercase tracking-wider mt-0.5">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 fade-in" style={{ animationDelay: "1s" }}>
        <span className="text-white/40 text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
