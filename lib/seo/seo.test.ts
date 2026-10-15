import assert from "node:assert/strict";
import test from "node:test";
import { seoContenu } from "../content-meta.ts";
import { extraireFaq } from "../aide/faq.ts";
import { FICHES } from "../fiches.ts";
import { FICHE_DATA } from "../fiches-data.ts";
import { getInstitutionnel } from "../institutionnel.ts";
import { jsonLdScript } from "../json-ld.ts";
import { METHODES } from "../methodes.ts";
import { PATHOLOGIES } from "../pathologies.ts";
import { planDuSite } from "../site/plan.ts";
import { SOINS } from "../soins.ts";
import { SPORTS } from "../sports.ts";
import { TEAM } from "../team.ts";
import { filAriane, pageFaq, pageMedicale, praticien } from "./donnees-structurees.ts";
import { pageDeReference } from "./doublons.ts";
import { SEO, SUFFIXE, titreFiche } from "./pages.ts";

const SITE = "https://www.mugitu-biarritz.fr";
const LISTES = { pathologies: PATHOLOGIES, sports: SPORTS };

/** Les chemins du plan du site, hors actualités (elles viennent de la base). */
const chemins = planDuSite({
  site: SITE,
  articles: [],
  fiches: FICHES,
  soins: SOINS,
  pathologies: PATHOLOGIES,
  sports: SPORTS,
  methodes: METHODES,
}).map((e) => e.url.slice(SITE.length) || "/");

const CONTENUS: [string, { slug: string; title: string; lead: string }[]][] = [
  ["/soins", SOINS],
  ["/pathologies", PATHOLOGIES],
  ["/sports", SPORTS],
  ["/methodes", METHODES],
];

/** Le <title> complet que la page publiera, calculé comme elle le fait. */
function titreDe(chemin: string): string {
  const fiche = /^\/equipe\/(.+)$/.exec(chemin);
  if (fiche) return titreFiche(fiche[1], FICHES.find((f) => f.slug === fiche[1])!.name);
  for (const [prefixe, liste] of CONTENUS) {
    const page = liste.find((p) => `${prefixe}/${p.slug}` === chemin);
    if (page) return seoContenu(page, chemin).title;
  }
  const seo = SEO[chemin];
  assert.ok(seo, `pas de titre pour ${chemin} dans lib/seo/pages.ts`);
  return seo.titre;
}

test("le plan du site couvre bien toutes les familles de pages", () => {
  for (const c of ["/", "/eu", "/faq", "/equipe/lucas-bengoechea", "/pathologies/pubalgie", "/methodes/galmeon"]) {
    assert.ok(chemins.includes(c), c);
  }
});

test("chaque titre tient en 60 caractères, 65 au plus", () => {
  const longs = chemins.map((c) => [c, titreDe(c)] as const).filter(([, t]) => t.length > 60);
  for (const [c, t] of longs) assert.ok(t.length <= 65, `${c} : ${t.length} « ${t} »`);
  assert.ok(longs.length <= 3, `trop de titres au-delà de 60 : ${longs.map(([c]) => c).join(", ")}`);
});

test("chaque titre finit par la marque courte, une seule fois", () => {
  for (const c of chemins) {
    const t = titreDe(c);
    assert.ok(t.endsWith(SUFFIXE), `${c} : « ${t} »`);
    assert.equal(t.match(/Mugitu/g)?.length, 1, `${c} : « ${t} »`);
  }
});

test("les pages locales nomment Biarritz", () => {
  const locales = chemins.filter((c) => /^\/(soins|pathologies|sports|methodes|equipe)\//.test(c));
  assert.ok(locales.length > 40);
  // Seule exception : la diététicienne qui consulte à distance.
  for (const c of locales.filter((c) => c !== "/equipe/johanna-marmiesse")) {
    assert.match(titreDe(c), /Biarritz/, c);
  }
});

test("chaque page de contenu a une description de 70 à 160 caractères", () => {
  for (const [prefixe, liste] of CONTENUS) {
    for (const page of liste) {
      const chemin = `${prefixe}/${page.slug}`;
      const { description } = seoContenu(page, chemin);
      assert.ok(description.length >= 70 && description.length <= 160, `${chemin} : ${description.length}`);
      assert.ok(!/[<>]|&amp;|&nbsp;/.test(description), chemin);
    }
  }
});

test("la table ne décrit que des pages qui existent", () => {
  for (const chemin of Object.keys(SEO)) assert.ok(chemins.includes(chemin), chemin);
});

test("un article doublon renvoie vers sa page de soin", () => {
  assert.equal(pageDeReference("pubalgie", LISTES), "/pathologies/pubalgie");
  assert.equal(pageDeReference("epaule-du-surfeur", LISTES), "/pathologies/epaule-du-surfeur");
  assert.equal(pageDeReference("surf", LISTES), "/sports/surf");
  assert.equal(pageDeReference("pelote-basque", LISTES), "/sports/pelote-basque");
  assert.equal(pageDeReference("bilan-de-pre-saison", LISTES), "/soins/bilan-pre-saison");
  assert.equal(pageDeReference("bilan-retour-au-sport", LISTES), "/soins/bilan-retour-au-sport");
  assert.equal(pageDeReference("analyse-de-foulee", LISTES), "/soins/analyse-de-foulee");
  assert.equal(pageDeReference("zone-d-intervention", LISTES), "/zone-intervention");
});

test("les 21 doublons connus ont tous une page de référence, qui existe", () => {
  const doublons = [
    ...PATHOLOGIES.map((p) => p.slug),
    ...SPORTS.map((s) => s.slug),
    "bilan-de-pre-saison",
    "bilan-retour-au-sport",
    "analyse-de-foulee",
    "zone-d-intervention",
  ];
  assert.equal(doublons.length, 21);
  for (const slug of doublons) {
    const ref = pageDeReference(slug, LISTES);
    assert.ok(ref && chemins.includes(ref), slug);
  }
});

test("une actualité sans équivalent reste sa propre référence", () => {
  assert.equal(pageDeReference("alba-deep-fitness-race", LISTES), null);
  assert.equal(pageDeReference("osteopathie", LISTES), null);
});

test("le plan du site écarte les actualités doublons et garde les autres", () => {
  const plan = planDuSite({
    site: SITE,
    articles: [
      { slug: "pubalgie", date: "2026-09-01", publish_at: null },
      { slug: "zone-d-intervention", date: "2026-09-01", publish_at: null },
      { slug: "alba-deep-fitness-race", date: "2026-09-02", publish_at: null },
    ],
    fiches: [],
    soins: SOINS,
    pathologies: PATHOLOGIES,
    sports: SPORTS,
    methodes: [],
  }).map((e) => e.url);
  assert.ok(!plan.includes(`${SITE}/actualites/pubalgie`));
  assert.ok(!plan.includes(`${SITE}/actualites/zone-d-intervention`));
  assert.ok(plan.includes(`${SITE}/actualites/alba-deep-fitness-race`));
});

/** Sérialise comme la page, puis relit : le bloc doit être du JSON valide. */
function relire(d: unknown): Record<string, unknown> {
  return JSON.parse(jsonLdScript(d));
}

test("fil d'Ariane de chaque page de contenu : JSON valide, adresses absolues", () => {
  const trailMethodes = [{ label: "Accueil", href: "/" }, { label: "Nos soins", href: "/nos-soins" }];
  const pages = [
    ...SOINS.map((p) => ({ ...p, chemin: `/soins/${p.slug}` })),
    ...PATHOLOGIES.map((p) => ({ ...p, chemin: `/pathologies/${p.slug}` })),
    ...SPORTS.map((p) => ({ ...p, chemin: `/sports/${p.slug}` })),
    ...METHODES.map((p) => ({ ...p, trail: trailMethodes, chemin: `/methodes/${p.slug}` })),
  ];
  for (const p of pages) {
    const b = relire(filAriane(SITE, p.trail, { label: p.crumb, chemin: p.chemin }));
    assert.equal(b["@type"], "BreadcrumbList");
    const items = b.itemListElement as { position: number; name: string; item: string }[];
    assert.equal(items[0].item, SITE, p.chemin);
    assert.equal(items.at(-1)!.item, `${SITE}${p.chemin}`);
    assert.deepEqual(items.map((i) => i.position), items.map((_, i) => i + 1));
    for (const i of items) assert.ok(i.name && !/[<>]|&amp;/.test(i.name), `${p.chemin} : ${i.name}`);
  }
});

test("page de pathologie : MedicalWebPage sur une MedicalCondition", () => {
  for (const p of PATHOLOGIES) {
    const chemin = `/pathologies/${p.slug}`;
    const b = relire(pageMedicale(SITE, { chemin, titre: p.title, description: seoContenu(p, chemin).description, pathologie: p.crumb }));
    assert.equal(b["@type"], "MedicalWebPage");
    assert.deepEqual(b.about, { "@type": "MedicalCondition", name: p.crumb.replace(/&amp;/g, "&") });
    assert.equal(b.url, `${SITE}${chemin}`);
  }
});

test("FAQ : une Question par question réelle, chacune avec sa réponse", () => {
  const faq = extraireFaq(getInstitutionnel("faq").bodyHtml);
  const b = relire(pageFaq(faq));
  assert.equal(b["@type"], "FAQPage");
  const q = b.mainEntity as { "@type": string; name: string; acceptedAnswer: { text: string } }[];
  assert.equal(q.length, faq.length);
  assert.ok(q.length >= 5);
  for (const x of q) {
    assert.equal(x["@type"], "Question");
    assert.ok(x.name.endsWith("?") && x.acceptedAnswer.text.length > 20, x.name);
  }
});

test("fiche praticien : Person rattachée au cabinet, liens absolus seulement", () => {
  for (const f of FICHES) {
    const contact = FICHE_DATA[f.slug]?.contact;
    const b = relire(
      praticien(SITE, {
        chemin: `/equipe/${f.slug}`,
        nom: f.name,
        metier: f.badge,
        photo: f.photo,
        liens: [TEAM.find((t) => t.slug === f.slug)?.website, contact?.site, contact?.instagram, contact?.linkedin, "@pseudo"],
      }),
    );
    assert.equal(b["@type"], "Person");
    assert.equal(b.url, `${SITE}/equipe/${f.slug}`);
    assert.ok(String(b.image).startsWith("https://"), f.slug);
    assert.equal((b.worksFor as Record<string, unknown>)["@type"], "MedicalBusiness");
    for (const l of (b.sameAs as string[] | undefined) ?? []) assert.match(l, /^https:\/\//);
  }
  const lucas = relire(praticien(SITE, { chemin: "/equipe/lucas-bengoechea", nom: "Lucas Bengoechea", metier: "Ostéopathe du sport", liens: ["https://bengoechea-osteopathe.fr", "https://www.instagram.com/lebaskosteo/"] }));
  assert.deepEqual(lucas.sameAs, ["https://bengoechea-osteopathe.fr", "https://www.instagram.com/lebaskosteo/"]);
});

test("une chaîne contenant </script> ne referme pas la balise", () => {
  const s = jsonLdScript(pageFaq([{ question: "</script><b>?", reponse: "x" }]));
  assert.ok(!s.includes("</script>"));
  assert.equal((JSON.parse(s).mainEntity as { name: string }[])[0].name, "</script><b>?");
});
