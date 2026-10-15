import assert from "node:assert/strict";
import test from "node:test";
import { planDuSite } from "./plan.ts";

const SITE = "https://www.mugitu-biarritz.fr";
const plan = planDuSite({
  site: SITE,
  articles: [
    { slug: "reprise-apres-ete", date: "2026-09-01", publish_at: null },
    { slug: "trail", date: "2026-09-02", publish_at: "2026-09-10T08:00:00+00:00" },
  ],
  fiches: [{ slug: "lucas-bengoechea" }],
  soins: [{ slug: "osteopathie" }],
  pathologies: [{ slug: "pubalgie" }],
  sports: [{ slug: "surf" }],
  methodes: [{ slug: "galmeon" }],
});
const urls = plan.map((e) => e.url);

test("toutes les adresses partent du www, l'accueil sans barre finale", () => {
  assert.ok(urls.every((u) => u.startsWith(`${SITE}`)));
  assert.ok(urls.includes(SITE));
  assert.ok(!urls.includes(`${SITE}/`));
});

test("aucune adresse en double", () => {
  assert.equal(new Set(urls).size, urls.length);
});

test("les contenus sont listés à leur adresse", () => {
  for (const chemin of ["/actualites/trail", "/equipe/lucas-bengoechea", "/soins/osteopathie", "/pathologies/pubalgie", "/sports/surf", "/methodes/galmeon"]) {
    assert.ok(urls.includes(`${SITE}${chemin}`), chemin);
  }
});

test("un article prend sa date de mise en ligne, sinon sa date", () => {
  const date = (slug: string) => plan.find((e) => e.url.endsWith(`/actualites/${slug}`))?.lastModified;
  assert.equal(date("trail"), "2026-09-10T08:00:00+00:00");
  assert.equal(date("reprise-apres-ete"), "2026-09-01");
});

test("la page de préparation individuelle est listée", () => {
  assert.ok(urls.includes(`${SITE}/mugi-klub/preparation-individuelle`));
});

test("les pages non indexables restent dehors", () => {
  for (const exclu of ["/admin", "/mon-espace", "/jeux", "/newsletter", "/mugi-klub/annulation", "/mugi-klub/seance"]) {
    assert.ok(!urls.some((u) => u.startsWith(`${SITE}${exclu}`)), exclu);
  }
});

test("français et basque se désignent l'un l'autre", () => {
  const eu = plan.find((e) => e.url === `${SITE}/eu`);
  const fr = plan.find((e) => e.url === SITE);
  const attendu = { fr: SITE, eu: `${SITE}/eu` };
  assert.deepEqual(eu?.alternates?.languages, attendu);
  assert.deepEqual(fr?.alternates?.languages, attendu);
});

test("une actualité qui doublonne une page de soin sort du plan", () => {
  const p = planDuSite({
    site: SITE,
    articles: [{ slug: "pubalgie", date: "2026-09-01", publish_at: null }],
    fiches: [],
    soins: [],
    pathologies: [{ slug: "pubalgie" }],
    sports: [],
    methodes: [],
  }).map((e) => e.url);
  assert.ok(!p.includes(`${SITE}/actualites/pubalgie`));
  assert.ok(p.includes(`${SITE}/pathologies/pubalgie`));
});
