import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CountdownTimer from "./CountdownTimer";
import WinnersAnnouncement from "./WinnersAnnouncement";
import type { Dict, Locale } from "@/lib/i18n";

// --- Configuration partagée ----------------------------------------------
// Date de fin du concours : 24 mai 2026 à 15h00 heure de Paris (= 13h UTC).
const DEADLINE_ISO = "2026-05-24T13:00:00Z";

const INSTAGRAM_POST_URL = "https://www.instagram.com/p/DYrPI2DiNiv/";
const MUGITU_INSTAGRAM_URL = "https://www.instagram.com/mugitu_biarritz/";
const JULIEN_INSTAGRAM_URL = "https://www.instagram.com/jublamont_lacliniqueducoureur/";
const JULIEN_DOCTOLIB_URL = "https://www.doctolib.fr/osteopathe/biarritz/julien-blamont";
// -------------------------------------------------------------------------

function Step({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4 sm:gap-5">
      <div
        aria-hidden
        className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#F47B3F] to-[#EB5582] text-white font-bold text-lg sm:text-xl flex items-center justify-center shadow-md"
      >
        {index}
      </div>
      <div className="flex-1 pt-1 sm:pt-1.5">
        <h3 className="text-base sm:text-lg font-semibold text-[#0A5560] mb-1">{title}</h3>
        <div className="text-sm sm:text-base text-[#333334]/85 leading-relaxed">
          {children}
        </div>
      </div>
    </li>
  );
}

interface ConcoursPageContentProps {
  dict: Dict;
  locale: Locale;
}

/**
 * Contenu partagé entre la page concours française (`/concours-avirun-2026`)
 * et basque (`/eu/concours-avirun-2026`). Seules les chaînes de caractères
 * changent via le `dict` ; la structure et les couleurs sont identiques.
 */
export default function ConcoursPageContent({ dict, locale }: ConcoursPageContentProps) {
  const c = dict.concoursPage;
  return (
    <>
      <Nav dict={dict} locale={locale} />

      <main className="pt-16">
        {/* HERO — charte Avirun (teal profond + orange/rose) */}
        <section className="relative overflow-hidden bg-[#0A5560] text-white">
          <Image
            src="/hero-avirun-2026.avif"
            alt={c.posterAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-40"
          />
          <div
            aria-hidden
            className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-[#F47B3F]/35 blur-3xl mix-blend-screen pointer-events-none"
          />
          <div
            aria-hidden
            className="absolute -bottom-40 -left-24 w-[520px] h-[520px] rounded-full bg-[#EB5582]/30 blur-3xl mix-blend-screen pointer-events-none"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-[#0A5560]/85 via-[#0A5560]/70 to-[#0A5560]/85"
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <span className="inline-block uppercase tracking-[0.2em] text-xs sm:text-sm font-semibold text-[#F3D58C] mb-4 reveal">
              {c.heroEyebrow}
            </span>

            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5 reveal"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="bg-gradient-to-r from-[#F47B3F] to-[#EB5582] bg-clip-text text-transparent">
                {c.heroTitleHighlight}
              </span>
              <br />
              {c.heroTitleRest}
            </h1>

            <p
              className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed reveal"
              style={{ animationDelay: "0.2s" }}
              dangerouslySetInnerHTML={{ __html: c.heroBody }}
            />

            <div className="mb-10 reveal" style={{ animationDelay: "0.3s" }}>
              <CountdownTimer deadline={DEADLINE_ISO} dict={dict} />
              <p className="text-xs sm:text-sm text-white/60 mt-3">
                {c.heroDeadlineNote}
              </p>
            </div>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal"
              style={{ animationDelay: "0.4s" }}
            >
              <a
                href="#resultats"
                className="px-8 py-3.5 rounded-full bg-[#F47B3F] text-white font-semibold hover:bg-[#e06a2e] transition-colors duration-200 text-sm sm:text-base shadow-lg"
              >
                {c.heroCtaWinners}
              </a>
              <a
                href={INSTAGRAM_POST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors duration-200 text-sm sm:text-base"
              >
                {c.heroCtaPost}
              </a>
            </div>
          </div>
        </section>

        {/* RÉSULTATS — annonce des 5 gagnant·es */}
        <WinnersAnnouncement dict={dict} />

        {/* POSTER OFFICIEL (archive) */}
        <section className="bg-[#F3D58C]/20 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block uppercase tracking-[0.18em] text-xs font-semibold text-[#EB5582] mb-3">
              {c.posterEyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A5560] mb-6 leading-tight">
              {c.posterTitle}
            </h2>
            <a
              href={INSTAGRAM_POST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group"
              aria-label={c.posterAria}
            >
              <Image
                src="/concours-avirun-poster.png"
                alt={c.posterAlt}
                width={1856}
                height={2304}
                sizes="(min-width: 768px) 400px, 80vw"
                className="rounded-2xl shadow-2xl ring-1 ring-black/10 max-w-[280px] sm:max-w-[360px] w-full h-auto transition-transform duration-300 group-hover:scale-[1.02] mx-auto"
              />
            </a>
            <p className="text-sm text-[#333334]/70 mt-5 max-w-md mx-auto">
              {c.posterCaption}
            </p>
          </div>
        </section>

        {/* COMMENT PARTICIPER — archivé en passé */}
        <section
          id="comment-participer"
          className="bg-white py-16 sm:py-20 scroll-mt-20"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="inline-block uppercase tracking-[0.18em] text-xs font-semibold text-[#EB5582] mb-3 text-center w-full">
              {c.stepsEyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A5560] text-center mb-3">
              {c.stepsTitle}
            </h2>
            <p className="text-center text-[#333334]/75 mb-12 max-w-xl mx-auto">
              {c.stepsLead}
            </p>

            <ol className="space-y-8">
              <Step index={1} title={c.step1Title}>
                {c.step1BodyPrefix}
                <a
                  href={MUGITU_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#EB5582] hover:underline"
                >
                  @mugitu_biarritz
                </a>
                {c.step1BodyAnd}
                <a
                  href={JULIEN_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#EB5582] hover:underline"
                >
                  @jublamont_lacliniqueducoureur
                </a>
                {c.step1BodySuffix}
              </Step>

              <Step index={2} title={c.step2Title}>
                {c.step2BodyPrefix}
                <a
                  href={INSTAGRAM_POST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#EB5582] hover:underline"
                >
                  {c.step2BodyLinkLabel}
                </a>
                {c.step2BodySuffix}
              </Step>

              <Step index={3} title={c.step3Title}>
                <span dangerouslySetInnerHTML={{ __html: c.step3Body }} />
              </Step>
            </ol>

            <div className="mt-12 text-center">
              <a
                href="#resultats"
                className="inline-block px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F47B3F] to-[#EB5582] text-white font-semibold hover:opacity-90 transition-opacity duration-200 text-sm sm:text-base shadow-md"
              >
                {c.stepsBottomCta}
              </a>
            </div>
          </div>
        </section>

        {/* DOTATION */}
        <section className="relative overflow-hidden bg-[#0A5560] text-white py-16 sm:py-20">
          <div
            aria-hidden
            className="absolute -top-20 -left-20 w-[320px] h-[320px] rounded-full bg-[#F47B3F]/15 blur-3xl pointer-events-none"
          />
          <div
            aria-hidden
            className="absolute -bottom-20 -right-20 w-[320px] h-[320px] rounded-full bg-[#EB5582]/15 blur-3xl pointer-events-none"
          />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 gap-10 items-start">
            <div>
              <span className="inline-block uppercase tracking-[0.2em] text-xs font-semibold text-[#F3D58C] mb-3">
                {c.dotationEyebrow}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mb-5">
                <span className="bg-gradient-to-r from-[#F47B3F] to-[#EB5582] bg-clip-text text-transparent">
                  {c.dotationTitleHighlight}
                </span>
                {c.dotationTitleRest}
                <span className="block text-base font-normal text-white/70 mt-1">
                  {c.dotationTitleSub}
                </span>
              </h2>
              <p className="text-white/85 leading-relaxed mb-4">{c.dotationBody1}</p>
              <p className="text-white/85 leading-relaxed">{c.dotationBody2}</p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-[#F3D58C] mb-4">
                {c.julienCardTitle}
              </h3>
              <ul className="space-y-3 text-sm sm:text-base text-white/85 mb-5">
                {c.julienCardBullets.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span aria-hidden className="text-[#F47B3F]">→</span>
                    {b}
                  </li>
                ))}
              </ul>
              <a
                href={JULIEN_DOCTOLIB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-full bg-white text-[#0A5560] font-semibold text-sm hover:bg-[#F3D58C] transition-colors"
              >
                {c.julienCardCta}
              </a>
            </div>
          </div>
        </section>

        {/* RÈGLEMENT */}
        <section className="bg-[#F3D58C]/15 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0A5560] mb-6">
              {c.ruleTitle}
            </h2>
            <div className="space-y-3 text-sm text-[#333334]/85 leading-relaxed">
              <p>
                <strong>{c.ruleOrganizerLabel}</strong> {c.ruleOrganizer}
              </p>
              <p>
                <strong>{c.ruleDurationLabel}</strong> {c.ruleDuration}
              </p>
              <p>
                <strong>{c.ruleConditionsLabel}</strong> {c.ruleConditions}
              </p>
              <p>
                <strong>{c.ruleDotationLabel}</strong> {c.ruleDotation}
              </p>
              <p>
                <strong>{c.ruleDrawLabel}</strong> {c.ruleDraw}
              </p>
              <p>
                <strong>{c.rulePrivacyLabel}</strong> {c.rulePrivacy}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer dict={dict} locale={locale} />
    </>
  );
}
