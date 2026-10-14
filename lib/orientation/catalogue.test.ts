import { test } from "node:test";
import assert from "node:assert/strict";
import { TEAM } from "../team.ts";
import { METHODE_CARDS } from "../methodes.ts";
import { PATHOLOGIES } from "../pathologies.ts";
import { SPORTS } from "../sports.ts";
import { construireCatalogue } from "./catalogue.ts";
import { METHODES_PRATICIENS } from "./methodes-praticiens.ts";
import { METIER_IDS } from "./types.ts";
import { prerempli } from "./depuis.ts";

const cat = construireCatalogue({ equipe: TEAM, methodes: METHODE_CARDS, pathologies: PATHOLOGIES, sports: SPORTS });

test("chaque méthode du site a au moins un praticien", () => {
  for (const m of Object.values(cat.methodes)) {
    assert.ok(m.praticiens.length > 0, `${m.slug} sans praticien`);
  }
});

test("la table des méthodes ne cite que des praticiens et des méthodes qui existent", () => {
  for (const [methode, praticiens] of Object.entries(METHODES_PRATICIENS)) {
    assert.ok(methode in cat.methodes, `méthode inconnue ${methode}`);
    for (const p of praticiens) assert.ok(p in cat.praticiens, `praticien inconnu ${p}`);
  }
});

test("chaque métier a au moins un praticien", () => {
  for (const id of METIER_IDS) assert.ok(cat.metiers[id].praticiens.length > 0, id);
});

test("les actes médicaux sont marqués", () => {
  assert.equal(cat.methodes.infiltrations.acteMedical, true);
  assert.equal(cat.methodes.mesotherapie.acteMedical, true);
  assert.equal(cat.methodes.bfr.acteMedical, false);
});

test("chaque pathologie préremplie existe dans le catalogue", () => {
  for (const p of PATHOLOGIES) {
    assert.ok(prerempli(p.slug), `${p.slug} sans préremplissage`);
    assert.ok(cat.pages[p.slug], `${p.slug} absente du catalogue`);
  }
});
