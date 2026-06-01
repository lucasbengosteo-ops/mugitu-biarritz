import type { Dict } from "@/lib/i18n";

interface HistoireProps {
  dict: Dict;
}

export default function Histoire({ dict }: HistoireProps) {
  const d = dict.histoire;
  return (
    <section id="histoire" className="py-20 sm:py-28 bg-[#003850]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#04A49B]/20 text-[#04A49B] text-xs font-semibold uppercase tracking-wider mb-5">
            {d.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {d.title}
          </h2>
        </div>

        {/* Etymology block */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 sm:p-10 mb-10">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Word */}
            <div className="flex-shrink-0 text-center sm:text-left">
              <p className="text-6xl sm:text-7xl font-bold text-[#04A49B] tracking-tight leading-none">
                {d.word}
              </p>
              <p className="text-white/40 text-sm mt-2 italic">
                {d.wordCaption}
              </p>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px self-stretch bg-white/10" />
            <div className="sm:hidden h-px w-full bg-white/10" />

            {/* Definition */}
            <div className="flex-1">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-3">
                {d.definitionLabel}
              </p>
              <p className="text-white text-xl font-light leading-relaxed mb-4">
                {d.definitionShort}
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                {d.definitionLong}
              </p>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {d.cards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl bg-white/5 border border-white/10 p-6"
            >
              <div className="text-[#04A49B] text-2xl mb-4">{card.emoji}</div>
              <h3 className="text-white font-semibold mb-2">{card.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
