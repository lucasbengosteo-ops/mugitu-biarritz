/**
 * Table de routage du site — refonte 2026.
 *
 * Le projet Claude Design référence les pages par nom de fichier
 * (« Nos Soins.dc.html »). Cette table est la traduction unique de ces
 * maquettes vers les routes Next réelles : les composants n’écrivent
 * jamais une URL en dur, ils passent par ROUTES.
 *
 * ⚠️ Toutes les pages ne sont pas encore construites (livraison par phases).
 * Ajouter la route ici AVANT de créer la page évite d’avoir à repasser
 * sur le Header/Footer à chaque nouvelle page.
 */
export const ROUTES = {
  home: "/",

  // Le centre
  esprit: "/esprit-mugitu",
  team: "/equipe",
  klub: "/mugi-klub",
  ambassadeurs: "/ambassadeurs",
  actualites: "/actualites",
  espace: "/mon-espace",
  espacePraticien: "/espace-praticien",
  zone: "/zone-intervention",

  // Soins
  soins: "/nos-soins",
  soinsPathologies: "/nos-soins#pathologies",
  soinsSports: "/nos-soins#sports",
  soinsBilans: "/nos-soins#bilans",
  medecineSport: "/soins/medecine-du-sport",
  osteopathie: "/soins/osteopathie",
  psychologie: "/soins/psychologie",
  nutrition: "/soins/nutrition-du-sport",
  podologie: "/soins/podologie",
  kine: "/soins/kinesitherapie-du-sport",

  // Méthodes & technologies
  methodes: "/methodes",
  allyane: "/methodes/allyane",
  cliniqueCoureur: "/methodes/clinique-du-coureur",
  testingVald: "/methodes/testing-vald",
  emdr: "/methodes/emdr",
  dryNeedling: "/methodes/dry-needling",
  electrostimulation: "/methodes/electrostimulation",
  bfr: "/methodes/bfr",
  prepaPhysique: "/methodes/preparation-physique",
  infiltrations: "/methodes/infiltrations",
  mesotherapie: "/methodes/mesotherapie",

  // Utiles
  contact: "/contact",
  rdv: "/equipe",
  faq: "/faq",
  mentions: "/mentions-legales",
  confidentialite: "/confidentialite",
} as const;

/** Article du blog : /actualites/<slug>. */
export function articlePath(slug: string): string {
  return `${ROUTES.actualites}/${slug}`;
}

/** Fiche individuelle d’un praticien : /equipe/<slug>. */
export function practitionerPath(slug: string): string {
  return `${ROUTES.team}/${slug}`;
}

/** Liens externes (hors site). */
export const EXTERNAL = {
  appPraticien: "https://app.mugitu.pro",
  instagram: "https://www.instagram.com/mugitu_biarritz/",
  googleReview: "https://g.page/r/Cah2XghYjGO1EBM/review",
  email: "contact@mugitu-biarritz.fr",
} as const;
