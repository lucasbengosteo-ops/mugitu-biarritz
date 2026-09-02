/**
 * La Mugi Team — source unique des praticiens.
 *
 * Alimente à la fois la page /equipe (grille + filtres) et les fiches
 * individuelles /equipe/[slug]. Données extraites des maquettes
 * « Mugi Team.dc.html » et « Fiche *.dc.html » du projet Claude Design.
 */

/** Catégories utilisées par les filtres de la page équipe. */
export const TEAM_CATEGORIES = [
  { key: "all", label: "Tous" },
  { key: "osteo", label: "Ostéopathie" },
  { key: "kine", label: "Kinésithérapie" },
  { key: "medecin", label: "Médecine du sport" },
  { key: "psy", label: "Psychologie" },
  { key: "nutrition", label: "Nutrition" },
  { key: "podologie", label: "Podologie" },
  { key: "prepa", label: "Préparation physique" },
] as const;

export type TeamCategory = (typeof TEAM_CATEGORIES)[number]["key"];

export type Practitioner = {
  slug: string;
  name: string;
  /** Intitulé court affiché en eyebrow sur la carte. */
  role: string;
  photo: string;
  /** object-position de la photo, réglé au cas par cas dans la maquette. */
  objectPosition: string;
  /** Résumé affiché au survol de la carte. */
  bio: string;
  tags: string[];
  cats: Exclude<TeamCategory, "all">[];
  /** Lien de réservation (Doctolib, Calendly ou mailto selon le praticien). */
  booking: string;
};

export const TEAM: Practitioner[] = [
  {
    slug: "lucas-bengoechea",
    name: "Lucas Bengoechea",
    role: "Ostéopathe du sport",
    photo: "/lucas-bengoechea.jpg",
    objectPosition: "center 25%",
    bio: "Ostéopathe du sport. Certifié Allyane®, spécialiste de l’épaule et du suivi du coureur.",
    tags: ["Allyane®", "Épaule"],
    cats: ["osteo"],
    booking: "https://www.doctolib.fr/osteopathe/ahetze/lucas-bengoechea",
  },
  {
    slug: "basile-carcassonne",
    name: "Dr Basile Carcassonne",
    role: "Médecin du sport",
    photo: "/basile-carcassonne.jpg",
    objectPosition: "center 18%",
    bio: "Médecin du sport spécialisé en traumatologie : bilans, infiltrations, mésothérapie et PRP.",
    tags: ["Traumatologie", "PRP"],
    cats: ["medecin"],
    booking: "https://www.doctolib.fr/medecin-du-sport/cambo-les-bains/basile-carcassonne?pid=practice-746000",
  },
  {
    slug: "jean-baptiste-colombie",
    name: "Jean-Baptiste Colombié",
    role: "Kinésithérapeute du sport",
    photo: "/jb-colombie.jpg",
    objectPosition: "center 25%",
    bio: "Kiné du sport. Suivi du danseur, préparation physique et Allyane® (spécialiste cheville).",
    tags: ["Kiné du danseur", "Cheville"],
    cats: ["kine", "prepa"],
    booking: "https://www.doctolib.fr/masseur-kinesitherapeute/biarritz/jean-baptiste-colombie",
  },
  {
    slug: "julien-blamont",
    name: "Julien Blamont",
    role: "Kinésithérapeute du sport",
    photo: "/julien-blamont.jpg",
    objectPosition: "center 22%",
    bio: "Kiné du sport certifié La Clinique du Coureur®. Analyse de foulée et prévention des blessures.",
    tags: ["Clinique du Coureur®", "Foulée"],
    cats: ["kine"],
    booking: "https://www.doctolib.fr/osteopathe/biarritz/julien-blamont",
  },
  {
    slug: "clement-cofourain",
    name: "Clément Cofourain",
    role: "Kinésithérapeute du sport",
    photo: "/clement-cofourain.jpg",
    objectPosition: "center 18%",
    bio: "Kiné du sport et athletic trainer. Du jeune sportif au danseur, du retour de blessure à la performance.",
    tags: ["Athletic trainer", "Suivi du danseur"],
    cats: ["kine", "prepa"],
    booking: "mailto:contact@mugitu-biarritz.fr?subject=RDV%20avec%20Cl%C3%A9ment%20Cofourain",
  },
  {
    slug: "marie-boura",
    name: "Marie Boura",
    role: "Psychologue du sport",
    photo: "/marie-boura.jpg",
    objectPosition: "center 20%",
    bio: "Psychologue clinicienne et du sport, préparatrice mentale : stress, confiance, routines de performance.",
    tags: ["Préparation mentale", "Clinique"],
    cats: ["psy"],
    booking: "https://www.doctolib.fr/psychologue/anglet/marie-boura",
  },
  {
    slug: "mailys-bersier",
    name: "Maïlys Bersier",
    role: "Psychologue — EMDR",
    photo: "/mailys-bersier.jpg",
    objectPosition: "center 20%",
    bio: "Psychologue clinicienne, praticienne EMDR. Consultations adultes et ateliers de danse-thérapie.",
    tags: ["EMDR", "Danse-thérapie"],
    cats: ["psy"],
    booking: "https://www.doctolib.fr/psychologue/anglet/mailys-bersier",
  },
  {
    slug: "marine-vignaud",
    name: "Marine Vignaud",
    role: "Ostéopathe & prépa physique",
    photo: "/marine-vignaud.png",
    objectPosition: "center 20%",
    bio: "Ostéopathe D.O. et préparatrice physique à Saint-Jean-de-Luz : course, rugby, haltérophilie, retour au sport.",
    tags: ["Ostéopathie", "Prépa physique"],
    cats: ["osteo", "prepa"],
    booking: "https://www.doctolib.fr/osteopathe/saint-jean-de-luz/marine-vignaud",
  },
  {
    slug: "hugo-daminato",
    name: "Hugo Daminato",
    role: "Préparateur physique",
    photo: "/hugo-daminato.png",
    objectPosition: "center 20%",
    bio: "Préparateur physique (Master STAPS EOPS), spécialiste réathlétisation et rugby. Individuel, groupe, cours collectifs.",
    tags: ["Réathlétisation", "Rugby"],
    cats: ["prepa"],
    booking: "mailto:hugo.daminato@gmail.com?subject=RDV%20pr%C3%A9paration%20physique%20Mugitu",
  },
  {
    slug: "ihintza-larralde",
    name: "Ihintza Larralde",
    role: "Diététicienne du sport",
    photo: "/ihintza-larralde.webp",
    objectPosition: "center 30%",
    bio: "Diététicienne du sport, bilingue FR/basque. Nutrition sportive au cabinet, en visio et à domicile.",
    tags: ["Nutrition", "FR · Euskara"],
    cats: ["nutrition"],
    booking: "https://www.doctolib.fr/dieteticien/cambo-les-bains/ihintza-larralde",
  },
  {
    slug: "johanna-marmiesse",
    name: "Johanna Marmiesse",
    role: "Diététicienne — à distance",
    photo: "/johanna-marmiesse.webp",
    objectPosition: "center 25%",
    bio: "Diététicienne du sport en visio, spécialiste nutrition de l’endurance et préparation marathon.",
    tags: ["Endurance", "À distance"],
    cats: ["nutrition"],
    booking: "https://calendly.com/johannamarmiesse/30min",
  },
  {
    slug: "ophelie-hubert",
    name: "Ophélie Hubert",
    role: "Pédicure-podologue du sport",
    photo: "/ophelie-hubert.webp",
    objectPosition: "center 25%",
    bio: "Pédicure-podologue du sport, accréditée La Clinique du Coureur®. Bilan postural, semelles sur mesure et suivi du coureur.",
    tags: ["Podologie", "Semelles"],
    cats: ["podologie"],
    booking: "https://www.doctolib.fr/pedicure-podologue/biarritz/ophelie-hubert",
  },
  {
    slug: "baptiste-caparros",
    name: "Baptiste Caparros",
    role: "Kinésithérapeute du sport",
    photo: "/baptiste-caparros.webp",
    objectPosition: "center 22%",
    bio: "Kiné du sport et coach École de Trail. Formé à La Clinique du Coureur®, il planifie l’entraînement pour éviter la blessure avant qu’elle n’arrive.",
    tags: ["Trail", "Coaching course", "Clinique du Coureur"],
    cats: ["kine"],
    booking: "https://www.doctolib.fr/masseur-kinesitherapeute/cambo-les-bains/baptiste-caparros",
  },
];

/** Retrouve un praticien par son slug d’URL. */
export function getPractitioner(slug: string): Practitioner | undefined {
  return TEAM.find((p) => p.slug === slug);
}

/** Nombre de praticiens par catégorie, pour les compteurs des filtres. */
export function countByCategory(cat: TeamCategory): number {
  return cat === "all" ? TEAM.length : TEAM.filter((p) => p.cats.includes(cat)).length;
}
