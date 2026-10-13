/**
 * Le plan du site donné aux moteurs (sitemap.xml).
 *
 * N'y figurent que les pages indexables. Restent dehors, à dessein :
 * - le back-office et l'espace patient ;
 * - les jeux du stand, la newsletter et l'annulation Klub, marqués noindex ;
 * - les pages de séance du Klub : elles vivent quelques semaines puis
 *   passent en noindex, et le planning /mugi-klub, lui listé, y mène.
 *
 * Pur et sans alias : lu tel quel par `node --test`. Les listes de contenu
 * sont passées par app/sitemap.ts.
 */

export type EntreePlan = {
  url: string;
  lastModified?: string;
  alternates?: { languages: Record<string, string> };
};

type Contenus = {
  site: string;
  articles: { slug: string; date: string; publish_at: string | null }[];
  fiches: { slug: string }[];
  soins: { slug: string }[];
  pathologies: { slug: string }[];
  sports: { slug: string }[];
  methodes: { slug: string }[];
};

const PAGES = [
  "/",
  "/esprit-mugitu",
  "/equipe",
  "/mugi-klub",
  "/mugi-klub/preparation-individuelle",
  "/ambassadeurs",
  "/actualites",
  "/zone-intervention",
  "/nos-soins",
  "/methodes",
  "/contact",
  "/faq",
  "/mentions-legales",
  "/confidentialite",
];

/** Les pages qui existent en français et en basque. */
const BILINGUES: [string, string][] = [
  ["/", "/eu"],
  ["/concours-avirun-2026", "/eu/concours-avirun-2026"],
];

export function planDuSite(c: Contenus): EntreePlan[] {
  const url = (chemin: string) => (chemin === "/" ? c.site : `${c.site}${chemin}`);
  const sous = (prefixe: string, liste: { slug: string }[]) => liste.map((x) => ({ url: url(`${prefixe}/${x.slug}`) }));

  const langues = new Map<string, Record<string, string>>();
  for (const [fr, eu] of BILINGUES) {
    const paire = { fr: url(fr), eu: url(eu) };
    langues.set(fr, paire);
    langues.set(eu, paire);
  }
  const avecLangues = (chemin: string): EntreePlan => {
    const l = langues.get(chemin);
    return l ? { url: url(chemin), alternates: { languages: l } } : { url: url(chemin) };
  };

  const fixes = [...new Set([...PAGES, ...BILINGUES.flat()])].map(avecLangues);

  return [
    ...fixes,
    ...c.articles.map((a) => ({ url: url(`/actualites/${a.slug}`), lastModified: a.publish_at ?? a.date })),
    ...sous("/equipe", c.fiches),
    ...sous("/soins", c.soins),
    ...sous("/pathologies", c.pathologies),
    ...sous("/sports", c.sports),
    ...sous("/methodes", c.methodes),
  ];
}
