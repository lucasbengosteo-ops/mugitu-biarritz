import assert from "node:assert/strict";
import test from "node:test";
import { etatPriseEnMain, type Donnees } from "./prise-en-main.ts";

const vierge: Donnees = {
  aUnVoeu: false,
  aUneAbsence: false,
  aUnArticle: false,
  cochees: [],
  masquee: false,
  estGerant: false,
};

test("un compte neuf a quatre étapes, toutes ouvertes", () => {
  const e = etatPriseEnMain(vierge);
  assert.equal(e.etapes.length, 4);
  assert.equal(e.etapes.every((x) => !x.faite), true);
  assert.equal(e.terminee, false);
  assert.equal(e.visible, true);
});

test("un vœu ferme l’étape de l’agenda", () => {
  const e = etatPriseEnMain({ ...vierge, aUnVoeu: true });
  assert.equal(e.etapes.find((x) => x.id === "agenda")?.faite, true);
  assert.equal(e.terminee, false);
});

test("une absence ferme la sienne, et la coche aussi", () => {
  assert.equal(
    etatPriseEnMain({ ...vierge, aUneAbsence: true }).etapes.find((x) => x.id === "absences")?.faite,
    true,
  );
  assert.equal(
    etatPriseEnMain({ ...vierge, cochees: ["absences"] }).etapes.find((x) => x.id === "absences")?.faite,
    true,
  );
});

test("un article ferme la sienne, et « pas pour moi » aussi", () => {
  assert.equal(
    etatPriseEnMain({ ...vierge, aUnArticle: true }).etapes.find((x) => x.id === "article")?.faite,
    true,
  );
  assert.equal(
    etatPriseEnMain({ ...vierge, cochees: ["article"] }).etapes.find((x) => x.id === "article")?.faite,
    true,
  );
});

test("l’étape du Klub ne se ferme qu’à la main", () => {
  const e = etatPriseEnMain({ ...vierge, aUnVoeu: true, aUneAbsence: true, aUnArticle: true });
  assert.equal(e.etapes.find((x) => x.id === "klub")?.faite, false);
  assert.equal(e.terminee, false);
});

test("les quatre fermées donnent terminée", () => {
  const e = etatPriseEnMain({
    ...vierge,
    aUnVoeu: true,
    aUneAbsence: true,
    aUnArticle: true,
    cochees: ["klub"],
  });
  assert.equal(e.terminee, true);
});

test("une carte masquée n’est plus visible, même inachevée", () => {
  const e = etatPriseEnMain({ ...vierge, masquee: true });
  assert.equal(e.visible, false);
  assert.equal(e.terminee, false);
});

test("un gérant a une cinquième étape, les autres non", () => {
  assert.equal(etatPriseEnMain({ ...vierge, estGerant: true }).etapes.length, 5);
  assert.equal(
    etatPriseEnMain({ ...vierge, estGerant: true }).etapes.some((x) => x.id === "recap"),
    true,
  );
  assert.equal(etatPriseEnMain(vierge).etapes.some((x) => x.id === "recap"), false);
});

test("une coche orpheline ne casse rien", () => {
  const e = etatPriseEnMain({ ...vierge, cochees: ["etape-supprimee-il-y-a-six-mois"] });
  assert.equal(e.etapes.length, 4);
  assert.equal(e.terminee, false);
});

test("seules les étapes cochables le sont", () => {
  const e = etatPriseEnMain(vierge);
  assert.equal(e.etapes.find((x) => x.id === "agenda")?.cochable, false);
  assert.equal(e.etapes.find((x) => x.id === "klub")?.cochable, true);
});
