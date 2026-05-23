import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CountdownTimer from "./CountdownTimer";
import ParticipantsCounter from "./ParticipantsCounter";

// --- Configuration du concours -------------------------------------------
// Date de fin : 24 mai 2026 à 15h00 heure de Paris.
// On l'exprime en UTC pour éviter toute ambiguïté de fuseau côté client.
// Paris en mai = UTC+2 → 15h00 Paris = 13h00 UTC.
const DEADLINE_ISO = "2026-05-24T13:00:00Z";

const INSTAGRAM_POST_URL = "https://www.instagram.com/p/DYrPI2DiNiv/";
const MUGITU_INSTAGRAM_URL = "https://www.instagram.com/mugitu_biarritz/";
const JULIEN_INSTAGRAM_URL = "https://www.instagram.com/jublamont_lacliniqueducoureur/";
// -------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Jeu concours Avirun 2K26 — 5 analyses de foulée à gagner",
  description:
    "Tentez de gagner l'une des 5 analyses de foulée (valeur 70 €) avec Julien Blamont, kinésithérapeute formé à La Clinique du Coureur, à l'occasion de l'Avirun 2K26. Jeu concours ouvert jusqu'au 24 mai 2026.",
  alternates: { canonical: "https://mugitu-biarritz.fr/concours-avirun-2026" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://mugitu-biarritz.fr/concours-avirun-2026",
    siteName: "Mugitu Biarritz",
    title: "5 analyses de foulée à gagner avec Julien Blamont — Avirun 2K26",
    description:
      "Jeu concours Mugitu × Avirun 2K26 : 5 analyses de foulée à gagner avec Julien Blamont, kinésithérapeute formé à La Clinique du Coureur.",
    images: [{ url: "/hero-avirun-2026.avif", width: 1920, height: 600, alt: "Concours Avirun 2K26" }],
  },
  twitter: { card: "summary_large_image" },
};

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
        className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#04A49B] text-white font-bold text-lg sm:text-xl flex items-center justify-center shadow-md"
      >
        {index}
      </div>
      <div className="flex-1 pt-1 sm:pt-1.5">
        <h3 className="text-base sm:text-lg font-semibold text-[#003850] mb-1">{title}</h3>
        <div className="text-sm sm:text-base text-[#333334]/85 leading-relaxed">{children}</div>
      </div>
    </li>
  );
}

export default function ConcoursAvirun2026Page() {
  return (
    <>
      <Nav />

      <main className="pt-16">
        {/* ------------------------------------------------------------- */}
        {/* HERO                                                          */}
        {/* ------------------------------------------------------------- */}
        <section className="relative overflow-hidden bg-[#003850] text-white">
          {/* Image de fond Avirun — coureur en pleine foulée */}
          <Image
            src="/hero-avirun-2026.avif"
            alt="Coureur Avirun 2026 — analyse de foulée Mugitu Biarritz"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-40"
          />

          {/* Overlay dégradé pour garantir la lisibilité du texte */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-[#003850]/85 via-[#003850]/70 to-[#04A49B]/85"
          />

          {/* Texture points subtile */}
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
            <span
              className="inline-block uppercase tracking-[0.2em] text-xs sm:text-sm font-semibold text-[#F3BE79] mb-4 reveal"
            >
              Jeu concours · Avirun 2K26
            </span>

            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5 reveal"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="text-[#F3BE79]">5 analyses de foulée</span><br />
              à gagner avec Julien Blamont
            </h1>

            <p
              className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed reveal"
              style={{ animationDelay: "0.2s" }}
            >
              Kinésithérapeute formé à La Clinique du Coureur, Julien
              décortique votre foulée pour courir plus efficacement et limiter
              les blessures. À l&apos;occasion de l&apos;Avirun 2K26, Mugitu
              offre <strong>5 analyses complètes</strong> au cabinet de
              Biarritz (valeur unitaire&nbsp;70&nbsp;€).
            </p>

            <div className="mb-10 reveal" style={{ animationDelay: "0.3s" }}>
              <CountdownTimer deadline={DEADLINE_ISO} />
              <p className="text-xs sm:text-sm text-white/60 mt-3">
                Fin du concours : dimanche 24 mai 2026 à 15h00 (heure de Paris)
              </p>
            </div>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal"
              style={{ animationDelay: "0.4s" }}
            >
              <a
                href={INSTAGRAM_POST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-full bg-[#F3BE79] text-[#003850] font-semibold hover:bg-[#f0b265] transition-colors duration-200 text-sm sm:text-base shadow-lg"
              >
                Participer sur Instagram
              </a>
              <a
                href="#comment-participer"
                className="px-8 py-3.5 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors duration-200 text-sm sm:text-base"
              >
                Voir les conditions
              </a>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* PARTICIPANTS COUNTER                                          */}
        {/* ------------------------------------------------------------- */}
        <section className="bg-[#E8D8C8]/40 py-10 sm:py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <ParticipantsCounter />
            <p className="text-sm text-[#333334]/70 mt-4 max-w-md mx-auto">
              Chaque commentaire valide sur le post Instagram du concours
              compte pour une participation.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* COMMENT PARTICIPER                                            */}
        {/* ------------------------------------------------------------- */}
        <section
          id="comment-participer"
          className="bg-white py-16 sm:py-20 scroll-mt-20"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#003850] text-center mb-3">
              Comment participer&nbsp;?
            </h2>
            <p className="text-center text-[#333334]/75 mb-12 max-w-xl mx-auto">
              Trois étapes simples, à réaliser depuis votre compte Instagram
              avant le 24 mai à 15h00.
            </p>

            <ol className="space-y-8">
              <Step index={1} title="S'abonner aux deux comptes">
                Suivez{" "}
                <a
                  href={MUGITU_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#04A49B] hover:underline"
                >
                  @mugitu_biarritz
                </a>{" "}
                et{" "}
                <a
                  href={JULIEN_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#04A49B] hover:underline"
                >
                  @jublamont_lacliniqueducoureur
                </a>{" "}
                sur Instagram.
              </Step>

              <Step index={2} title="Liker le post et le partager en story">
                Aimez{" "}
                <a
                  href={INSTAGRAM_POST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#04A49B] hover:underline"
                >
                  le post du concours
                </a>{" "}
                et partagez-le en story sur votre compte Instagram.
              </Step>

              <Step index={3} title="Commenter en taguant deux personnes">
                Sous le post, ajoutez un commentaire en taguant{" "}
                <strong>deux ami·es</strong> que vous voudriez emmener courir
                à Biarritz. Chaque commentaire = une participation.
              </Step>
            </ol>

            <div className="mt-12 text-center">
              <a
                href={INSTAGRAM_POST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3.5 rounded-full bg-[#04A49B] text-white font-semibold hover:bg-[#038d85] transition-colors duration-200 text-sm sm:text-base"
              >
                Ouvrir le post sur Instagram
              </a>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* À PROPOS DE LA DOTATION                                       */}
        {/* ------------------------------------------------------------- */}
        <section className="bg-[#003850] text-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 gap-10 items-start">
            <div>
              <span className="inline-block uppercase tracking-[0.2em] text-xs font-semibold text-[#F3BE79] mb-3">
                La dotation
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mb-5">
                5 analyses de foulée complètes
                <span className="block text-base font-normal text-white/70 mt-1">
                  Valeur unitaire&nbsp;70&nbsp;€ · à Mugitu Biarritz
                </span>
              </h2>
              <p className="text-white/85 leading-relaxed mb-4">
                Filmée en cabinet sur tapis de course, l&apos;analyse de
                foulée permet de comprendre comment votre corps absorbe les
                chocs, propulse et se coordonne pendant la course.
              </p>
              <p className="text-white/85 leading-relaxed">
                Julien vous transmet ensuite des recommandations
                personnalisées : exercices, drills, ajustements techniques —
                pour progresser sans vous blesser.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[#F3BE79] mb-4">
                Julien Blamont
              </h3>
              <ul className="space-y-3 text-sm sm:text-base text-white/85">
                <li className="flex gap-3">
                  <span aria-hidden className="text-[#04A49B]">→</span>
                  Kinésithérapeute du sport au cabinet Mugitu Biarritz
                </li>
                <li className="flex gap-3">
                  <span aria-hidden className="text-[#04A49B]">→</span>
                  Formé à La Clinique du Coureur (Blaise Dubois)
                </li>
                <li className="flex gap-3">
                  <span aria-hidden className="text-[#04A49B]">→</span>
                  Suivi de coureurs amateurs et confirmés
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* RÈGLEMENT (mentions légales)                                  */}
        {/* ------------------------------------------------------------- */}
        <section className="bg-[#E8D8C8]/20 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#003850] mb-6">
              Règlement du jeu
            </h2>
            <div className="space-y-3 text-sm text-[#333334]/85 leading-relaxed">
              <p>
                <strong>Organisateur&nbsp;:</strong> Mugitu Biarritz, 3 avenue
                Kléber, 64200 Biarritz.
              </p>
              <p>
                <strong>Durée&nbsp;:</strong> jusqu&apos;au dimanche 24 mai
                2026 à 15h00 (heure de Paris).
              </p>
              <p>
                <strong>Conditions de participation&nbsp;:</strong> être majeur
                ou disposer de l&apos;accord d&apos;un représentant légal,
                résider en France métropolitaine, suivre @mugitu_biarritz et
                @jublamont_lacliniqueducoureur sur Instagram, liker et partager
                le post du concours en story, et commenter le post en taguant
                deux personnes.
              </p>
              <p>
                <strong>Dotation&nbsp;:</strong> cinq (5) analyses de foulée
                complètes au cabinet Mugitu Biarritz avec Julien Blamont,
                d&apos;une valeur unitaire de 70&nbsp;€ (rendez-vous fixé
                d&apos;un commun accord, non échangeables, non cessibles, non
                remboursables).
              </p>
              <p>
                <strong>Tirage au sort&nbsp;:</strong> cinq (5) gagnant·es
                seront tiré·es au sort parmi les participations valides et
                contacté·es par message privé sur Instagram dans les 7 jours
                suivant la clôture.
              </p>
              <p>
                <strong>Données personnelles&nbsp;:</strong> ce jeu est
                indépendant d&apos;Instagram, qui ne peut être tenu pour
                responsable. Aucune donnée n&apos;est collectée par Mugitu en
                dehors du compte Instagram du ou de la gagnant·e, pour
                organiser le rendez-vous.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
