export default function Histoire() {
  return (
    <section id="histoire" className="py-20 sm:py-28 bg-[#003850]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#04A49B]/20 text-[#04A49B] text-xs font-semibold uppercase tracking-wider mb-5">
            Étymologie & Histoire
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Pourquoi Mugitu ?
          </h2>
        </div>

        {/* Etymology block */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 sm:p-10 mb-10">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Word */}
            <div className="flex-shrink-0 text-center sm:text-left">
              <p className="text-6xl sm:text-7xl font-bold text-[#04A49B] tracking-tight leading-none">
                mugitu
              </p>
              <p className="text-white/40 text-sm mt-2 italic">Basque · verbe</p>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px self-stretch bg-white/10" />
            <div className="sm:hidden h-px w-full bg-white/10" />

            {/* Definition */}
            <div className="flex-1">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Définition</p>
              <p className="text-white text-xl font-light leading-relaxed mb-4">
                « Se mouvoir, bouger, être en mouvement »
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                Du basque <em>mugitu</em> — mouvement, déplacement, action de bouger.
                Une racine profondément ancrée dans la culture du Pays Basque,
                terre de sport, d&apos;effort et de dépassement de soi.
              </p>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <div className="text-[#04A49B] text-2xl mb-4">🏔️</div>
            <h3 className="text-white font-semibold mb-2">Ancrage local</h3>
            <p className="text-white/55 text-sm leading-relaxed">
              Né à Biarritz, au cœur du Pays Basque — terre de surf, de rugby, de trail
              et de pelote. Un nom qui résonne avec l&apos;identité sportive de la région.
            </p>
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <div className="text-[#04A49B] text-2xl mb-4">🤝</div>
            <h3 className="text-white font-semibold mb-2">Vision pluridisciplinaire</h3>
            <p className="text-white/55 text-sm leading-relaxed">
              Le projet est né d&apos;un constat : le sportif blessé mérite une prise en charge
              coordonnée entre kiné, médecin et ostéo — sous le même toit, avec le même dossier.
            </p>
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <div className="text-[#04A49B] text-2xl mb-4">🎯</div>
            <h3 className="text-white font-semibold mb-2">La maison du mouvement</h3>
            <p className="text-white/55 text-sm leading-relaxed">
              Plus qu&apos;un cabinet, une maison. Un lieu où praticiens et sportifs partagent
              la même philosophie : que le mouvement soit toujours possible, durable et performant.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
