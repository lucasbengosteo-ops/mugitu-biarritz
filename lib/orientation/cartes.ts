import { KLUB } from "./metiers.ts";
import type { Catalogue } from "./catalogue.ts";
import type { Carte, MetierId } from "./types.ts";

/** La phrase « pourquoi » par défaut d'un métier, quand l'IA ne fournit rien d'utilisable. */
export const POURQUOI_DEFAUT: Record<MetierId, string> = {
  kine: "Pour examiner la zone douloureuse, traiter et guider la reprise par des exercices adaptés.",
  osteo: "Pour un examen global et un traitement manuel, en lien avec le reste de l’équipe.",
  medecin: "Pour un avis médical, des examens si besoin, et coordonner la prise en charge.",
  psy: "Pour parler de ce que vous traversez avec une psychologue qui connaît le sport.",
  nutrition: "Pour adapter votre alimentation à votre sport et à vos objectifs.",
  podologie: "Pour examiner l’appui du pied et proposer des semelles si elles sont utiles.",
  prepa: "Pour construire un programme qui prépare votre corps à la charge de votre sport.",
};

/**
 * Construit une carte depuis des identifiants déjà vérifiés. Ce qui n'est
 * pas dans le catalogue est ignoré ici aussi : la fonction ne fait jamais
 * confiance à son appelant.
 */
export function construireCarte(
  cat: Catalogue,
  metier: MetierId,
  ids: { praticiens: string[]; methodes: string[]; pages: string[] },
  pourquoi: string,
): Carte | null {
  const m = cat.metiers[metier];
  const praticiens = ids.praticiens
    .filter((s, i, t) => t.indexOf(s) === i)
    .map((s) => cat.praticiens[s])
    .filter((p) => p && p.metiers.includes(metier))
    .slice(0, 3);
  if (praticiens.length === 0) return null;
  const garde = new Set(praticiens.map((p) => p.slug));
  const methodes = ids.methodes
    .filter((s, i, t) => t.indexOf(s) === i)
    .map((s) => cat.methodes[s])
    .filter((x) => x && x.praticiens.some((p) => garde.has(p)) && (!x.acteMedical || metier === "medecin"))
    .slice(0, 4);
  const pages = ids.pages
    .filter((s, i, t) => t.indexOf(s) === i)
    .map((s) => cat.pages[s])
    .filter(Boolean)
    .slice(0, 3);
  return {
    metier,
    titre: m.titre,
    lien: m.lien,
    pourquoi,
    praticiens: praticiens.map((p) => ({
      slug: p.slug,
      nom: p.nom,
      role: p.role,
      photo: p.photo,
      objectPosition: p.objectPosition,
      fiche: p.fiche,
      reservation: p.reservation,
    })),
    methodes: methodes.map((x) => ({ slug: x.slug, titre: x.titre, lien: x.lien, acteMedical: x.acteMedical })),
    pages: pages.map((p) => ({ titre: p.titre, lien: p.lien })),
    klub: metier === "prepa" ? KLUB : [],
  };
}
