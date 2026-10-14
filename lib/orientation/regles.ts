import { construireCarte, POURQUOI_DEFAUT } from "./cartes.ts";
import type { Catalogue } from "./catalogue.ts";
import { prerempli } from "./depuis.ts";
import type { Carte, MetierId, MotifId, Reponses, SportChoixId, ZoneId } from "./types.ts";

/**
 * Les règles écrites à la main : alertes, détresse, et la table fixe qui
 * répond sans IA. Rien ici ne dépend du réseau.
 */

export function normaliser(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/**
 * Mots d'alerte, comparés au texte normalisé. Liste volontairement large :
 * un faux positif coûte un écran d'alerte. À faire relire par Basile.
 */
export const MOTS_ALERTE = [
  "thoracique",
  "poitrine",
  "oppression",
  "essouffl",
  "malaise",
  "perte de connaissance",
  "evanoui",
  "paralys",
  "perte de force",
  "plus de force",
  "fourmill",
  "engourdi",
  "incontinence",
  "uriner",
  "fievre",
  "deformation",
  "deforme",
  "ne peux plus poser",
  "impossible de poser",
  "impossible de marcher",
  "os qui sort",
  "douleur la nuit",
  "douleur nocturne",
];

/** Formulations de détresse : affichent le 3114, quel que soit le motif. */
export const MOTS_DETRESSE = [
  "suicid",
  "en finir",
  "me tuer",
  "mourir",
  "plus envie de vivre",
  "me faire du mal",
  "me blesser expres",
  "scarif",
  "disparaitre",
];

export function detecterAlerte(r: Reponses): "signe" | "mot" | null {
  if (r.signes) return "signe";
  const t = normaliser(r.texte);
  return MOTS_ALERTE.some((m) => t.includes(m)) ? "mot" : null;
}

export function detecterDetresse(texte: string): boolean {
  const t = normaliser(texte);
  return MOTS_DETRESSE.some((m) => t.includes(m));
}

const PAR_ZONE: Record<ZoneId, MetierId[]> = {
  cou: ["osteo", "kine", "medecin"],
  epaule: ["kine", "osteo", "medecin"],
  "bras-coude-main": ["kine", "osteo", "medecin"],
  dos: ["osteo", "kine", "medecin"],
  "hanche-aine": ["kine", "osteo", "medecin"],
  cuisse: ["kine", "medecin", "osteo"],
  genou: ["kine", "medecin", "osteo"],
  "jambe-mollet": ["kine", "medecin", "podologie"],
  "cheville-pied": ["kine", "podologie", "medecin"],
  autre: ["medecin", "kine", "osteo"],
};

const PAR_MOTIF: Record<Exclude<MotifId, "douleur">, MetierId[]> = {
  reprise: ["kine", "prepa", "medecin"],
  performance: ["prepa", "nutrition", "kine"],
  mental: ["psy"],
  nutrition: ["nutrition"],
  bilan: ["medecin", "prepa", "kine"],
};

/** Méthodes qu'on peut citer selon le motif ; filtrées ensuite par praticien et par métier. */
const METHODES_PAR_MOTIF: Record<MotifId, string[]> = {
  douleur: ["dry-needling", "allyane", "electrostimulation"],
  reprise: ["bfr", "electrostimulation", "testing-vald", "preparation-physique"],
  performance: ["preparation-physique", "testing-vald", "bfr"],
  mental: ["emdr"],
  nutrition: [],
  bilan: ["testing-vald"],
};

const PAGES_PAR_MOTIF: Partial<Record<MotifId, string[]>> = {
  reprise: ["bilan-retour-au-sport"],
  performance: ["bilan-pre-saison"],
  bilan: ["bilan-pre-saison"],
};

/** Praticiens à mettre en tête selon le sport. */
const AFFINITES_SPORT: Partial<Record<SportChoixId, string[]>> = {
  "trail-et-course": ["julien-blamont", "baptiste-caparros"],
  danse: ["jean-baptiste-colombie", "clement-cofourain", "mailys-bersier"],
  rugby: ["hugo-daminato"],
};

function ordonner(praticiens: string[], sport: SportChoixId | null): string[] {
  const avant = (sport && AFFINITES_SPORT[sport]) || [];
  return [...praticiens].sort((a, b) => Number(avant.includes(b)) - Number(avant.includes(a)));
}

export function metiersPour(r: Reponses): MetierId[] {
  let liste: MetierId[] = r.motif === "douleur" ? [...PAR_ZONE[r.zone ?? "autre"]] : [...PAR_MOTIF[r.motif]];
  if (r.motif === "bilan" && r.sport === "trail-et-course") {
    // Un coureur qui demande un bilan veut d'abord une analyse de foulée.
    liste = ["kine", "prepa", "medecin"];
  }
  if (r.motif === "douleur" && r.anciennete === "plus-6-semaines") {
    liste = ["medecin", ...liste.filter((m) => m !== "medecin")];
  }
  const p = prerempli(r.depuis);
  if (p?.metier) liste = [p.metier, ...liste.filter((m) => m !== p.metier)];
  return liste.slice(0, 3);
}

/** La table fixe : une à trois cartes, sans IA. */
export function correspondance(r: Reponses, cat: Catalogue): Carte[] {
  const coureur = r.sport === "trail-et-course";
  // Pour un coureur, la méthode propre à la course passe en tête.
  // Les actes médicaux ne sont cités que pour une douleur installée depuis plus de six semaines.
  const installee = r.motif === "douleur" && r.anciennete === "plus-6-semaines";
  const methodes = [
    ...(coureur ? ["clinique-du-coureur"] : []),
    ...METHODES_PAR_MOTIF[r.motif],
    ...(installee ? ["infiltrations", "mesotherapie"] : []),
  ];
  const p = prerempli(r.depuis);
  const pages = [
    ...(p && cat.pages[p.slug] ? [p.slug] : []),
    ...(PAGES_PAR_MOTIF[r.motif] ?? []),
    ...(coureur && r.motif === "bilan" ? ["analyse-de-foulee"] : []),
    ...(r.sport && cat.pages[r.sport] ? [r.sport] : []),
  ];
  const cartes: Carte[] = [];
  for (const metier of metiersPour(r)) {
    const praticiens = ordonner(cat.metiers[metier].praticiens, r.sport);
    const carte = construireCarte(cat, metier, { praticiens, methodes, pages }, POURQUOI_DEFAUT[metier]);
    if (carte) cartes.push(carte);
  }
  return cartes;
}
