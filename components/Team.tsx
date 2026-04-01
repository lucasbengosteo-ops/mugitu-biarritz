import Image from "next/image";

const team = [
  {
    name: "Lucas Bengoechea",
    role: "Ostéopathe du sport",
    photo: "/lucas-bengoechea.jpg",
    bio: "Ostéopathe spécialisé dans la prise en charge du sportif. Praticien certifié Thérapie Allyane®.",
    doctolib: "https://www.doctolib.fr/osteopathe/ahetze/lucas-bengoechea",
    external: false,
  },
  {
    name: "Dr Basile Carcassonne",
    role: "Médecin du sport",
    photo: "/basile-carcassonne.jpg",
    bio: "Médecin généraliste, diplômé en traumatologie du sport. Suivi de sportifs amateurs et haut niveau.",
    doctolib:
      "https://www.doctolib.fr/medecin-du-sport/cambo-les-bains/basile-carcassonne?pid=practice-746000",
    external: false,
  },
  {
    name: "Clément Cofourain",
    role: "Kinésithérapeute du sport",
    photo: "/clement-cofourain.jpg",
    bio: "Kinésithérapeute du sport et athletic trainer. Spécialiste de la prise en charge pédiatrique du sportif et du danseur.",
    doctolib: null,
    external: false,
  },
  {
    name: "Jean-Baptiste Colombié",
    role: "Kinésithérapeute du sport",
    photo: "https://media.doctolib.com/image/upload/q_auto:eco,f_auto,w_400,h_400,c_fill,g_face/qbqpjsigcsmfxen080mi.jpg",
    bio: "Kinésithérapeute du sport et préparateur physique. Praticien Allyane®, spécialiste du danseur.",
    doctolib:
      "https://www.doctolib.fr/masseur-kinesitherapeute/biarritz/jean-baptiste-colombie",
    external: true,
  },
];

export default function Team() {
  return (
    <section id="equipe" className="py-20 sm:py-28 bg-[#F5EDE4]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#04A49B] text-sm uppercase tracking-widest font-semibold mb-3">
            Pluridisciplinaire
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#003850] tracking-tight">
            Notre équipe
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {team.map(({ name, role, photo, bio, doctolib, external }) => (
            <div
              key={name}
              className="flex flex-col items-center text-center bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Photo */}
              <div className="relative w-28 h-28 rounded-full overflow-hidden mb-5 ring-4 ring-[#04A49B]/20">
                <Image
                  src={photo}
                  alt={`Photo de ${name}`}
                  fill
                  className="object-cover"
                  unoptimized={external}
                  sizes="112px"
                />
              </div>

              {/* Name & role */}
              <h3 className="text-lg font-bold text-[#003850] mb-1">{name}</h3>
              <p className="text-[#04A49B] text-sm font-semibold mb-3">{role}</p>

              {/* Bio */}
              <p className="text-[#333334]/70 text-sm leading-relaxed mb-5">{bio}</p>

              {/* Doctolib button */}
              {doctolib && (
                <a
                  href={doctolib}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto px-5 py-2.5 rounded-full border border-[#04A49B] text-[#04A49B] text-sm font-semibold hover:bg-[#04A49B] hover:text-white transition-colors duration-200"
                >
                  Prendre RDV sur Doctolib
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
