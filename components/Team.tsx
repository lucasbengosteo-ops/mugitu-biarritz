import Image from "next/image";
import type { Dict } from "@/lib/i18n";

interface TeamProps {
  dict: Dict;
}

// Données structurelles partagées (non traduisibles : noms propres, photos,
// liens Doctolib). Les rôles, bios et spécialités viennent du dict.
const MEMBERS = [
  {
    key: "lucas" as const,
    name: "Lucas Bengoechea",
    photo: "/lucas-bengoechea.jpg",
    doctolib: "https://www.doctolib.fr/osteopathe/ahetze/lucas-bengoechea",
    external: false,
  },
  {
    key: "basile" as const,
    name: "Dr Basile Carcassonne",
    photo: "/basile-carcassonne.jpg",
    doctolib:
      "https://www.doctolib.fr/medecin-du-sport/cambo-les-bains/basile-carcassonne?pid=practice-746000",
    external: false,
  },
  {
    key: "clement" as const,
    name: "Clément Cofourain",
    photo: "/clement-cofourain.jpg",
    doctolib: null,
    external: false,
  },
  {
    key: "julien" as const,
    name: "Julien Blamont",
    photo: "/julien-blamont.jpg",
    doctolib: "https://www.doctolib.fr/osteopathe/biarritz/julien-blamont",
    external: false,
  },
  {
    key: "jb" as const,
    name: "Jean-Baptiste Colombié",
    photo:
      "https://media.doctolib.com/image/upload/q_auto:eco,f_auto,w_400,h_400,c_fill,g_face/qbqpjsigcsmfxen080mi.jpg",
    doctolib:
      "https://www.doctolib.fr/masseur-kinesitherapeute/biarritz/jean-baptiste-colombie",
    external: true,
  },
];

export default function Team({ dict }: TeamProps) {
  return (
    <section id="equipe" className="py-20 sm:py-28 bg-[#F5EDE4]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#04A49B] text-sm uppercase tracking-widest font-semibold mb-3">
            {dict.team.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#003850] tracking-tight">
            {dict.team.title}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {MEMBERS.map(({ key, name, photo, doctolib, external }) => {
            const t = dict.team.members[key];
            return (
              <div
                key={key}
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
                <p className="text-[#04A49B] text-sm font-semibold mb-3">
                  {t.role}
                </p>

                {/* Bio */}
                <p className="text-[#333334]/70 text-sm leading-relaxed mb-4">
                  {t.bio}
                </p>

                {/* Specialties badges */}
                {t.specialties && t.specialties.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-5">
                    {t.specialties.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-full bg-[#003850]/8 text-[#003850] text-xs font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Doctolib button */}
                {doctolib && (
                  <a
                    href={doctolib}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto px-5 py-2.5 rounded-full border border-[#04A49B] text-[#04A49B] text-sm font-semibold hover:bg-[#04A49B] hover:text-white transition-colors duration-200"
                  >
                    {dict.team.bookCta}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
