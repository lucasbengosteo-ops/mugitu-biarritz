import { practitionerPath } from "../routes.ts";
import { METHODES_PRATICIENS, ACTES_MEDICAUX } from "./methodes-praticiens.ts";
import { METIERS, PAGES_SOINS } from "./metiers.ts";
import { METIER_IDS, type MetierId } from "./types.ts";

/**
 * Le catalogue : tout ce que l'orientation a le droit de proposer.
 * Construit à partir des données du site passées en paramètre, pour rester
 * testable sans réseau ; `catalogue-site.ts` lui donne les vraies.
 */

export type PraticienSource = {
  slug: string;
  name: string;
  role: string;
  photo: string;
  objectPosition: string;
  booking: string;
  tags: string[];
  cats: string[];
};
export type MethodeSource = { slug: string; title: string; subtitle: string };
export type PageSource = { slug: string; crumb: string };

export type PraticienCatalogue = {
  slug: string;
  nom: string;
  role: string;
  photo: string;
  objectPosition: string;
  fiche: string;
  reservation: string;
  tags: string[];
  metiers: MetierId[];
};
export type MethodeCatalogue = {
  slug: string;
  titre: string;
  sousTitre: string;
  lien: string;
  praticiens: string[];
  acteMedical: boolean;
};
export type PageCatalogue = { slug: string; titre: string; lien: string; type: "pathologie" | "soin" | "sport" };
export type MetierCatalogue = { id: MetierId; titre: string; lien: string; praticiens: string[] };

export type Catalogue = {
  metiers: Record<MetierId, MetierCatalogue>;
  praticiens: Record<string, PraticienCatalogue>;
  methodes: Record<string, MethodeCatalogue>;
  pages: Record<string, PageCatalogue>;
};

const estMetier = (c: string): c is MetierId => (METIER_IDS as readonly string[]).includes(c);

export function construireCatalogue(src: {
  equipe: PraticienSource[];
  methodes: MethodeSource[];
  pathologies: PageSource[];
  sports: PageSource[];
}): Catalogue {
  const praticiens: Record<string, PraticienCatalogue> = {};
  for (const p of src.equipe) {
    praticiens[p.slug] = {
      slug: p.slug,
      nom: p.name,
      role: p.role,
      photo: p.photo,
      objectPosition: p.objectPosition,
      fiche: practitionerPath(p.slug),
      reservation: p.booking,
      tags: p.tags,
      metiers: p.cats.filter(estMetier),
    };
  }

  const metiers = {} as Record<MetierId, MetierCatalogue>;
  for (const id of METIER_IDS) {
    metiers[id] = {
      id,
      ...METIERS[id],
      praticiens: Object.values(praticiens)
        .filter((p) => p.metiers.includes(id))
        .map((p) => p.slug),
    };
  }

  const methodes: Record<string, MethodeCatalogue> = {};
  for (const m of src.methodes) {
    methodes[m.slug] = {
      slug: m.slug,
      titre: m.title,
      sousTitre: m.subtitle,
      lien: `/methodes/${m.slug}`,
      praticiens: (METHODES_PRATICIENS[m.slug] ?? []).filter((s) => s in praticiens),
      acteMedical: (ACTES_MEDICAUX as readonly string[]).includes(m.slug),
    };
  }

  const pages: Record<string, PageCatalogue> = {};
  for (const p of src.pathologies) {
    pages[p.slug] = { slug: p.slug, titre: sansBalises(p.crumb), lien: `/pathologies/${p.slug}`, type: "pathologie" };
  }
  for (const p of src.sports) {
    pages[p.slug] = { slug: p.slug, titre: sansBalises(p.crumb), lien: `/sports/${p.slug}`, type: "sport" };
  }
  for (const [slug, l] of Object.entries(PAGES_SOINS)) {
    pages[slug] = { slug, titre: l.titre, lien: l.lien, type: "soin" };
  }

  return { metiers, praticiens, methodes, pages };
}

function sansBalises(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}
