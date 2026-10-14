import { test } from "node:test";
import assert from "node:assert/strict";
import { TEAM } from "../team.ts";
import { METHODE_CARDS } from "../methodes.ts";
import { PATHOLOGIES } from "../pathologies.ts";
import { SPORTS } from "../sports.ts";
import { construireCatalogue } from "./catalogue.ts";
import { lireReponseIA, lireReponses, valider } from "./validation.ts";

const cat = construireCatalogue({ equipe: TEAM, methodes: METHODE_CARDS, pathologies: PATHOLOGIES, sports: SPORTS });

test("lireReponses accepte un envoi correct et coupe le texte à 500 caractères", () => {
  const r = lireReponses({ motif: "douleur", zone: "genou", anciennete: "1-6-semaines", sport: "surf", signes: false, texte: "x".repeat(600), depuis: null, consentement: true });
  assert.ok(r);
  assert.equal(r.texte.length, 500);
});

test("lireReponses refuse un motif inconnu ou une zone hors liste", () => {
  assert.equal(lireReponses({ motif: "magie" }), null);
  assert.equal(lireReponses({ motif: "douleur", zone: "nez", anciennete: null, sport: null, signes: false, texte: "", depuis: null, consentement: false }), null);
});

test("lireReponseIA rejette un JSON mal formé ou sans suggestions", () => {
  assert.equal(lireReponseIA("pas du json"), null);
  assert.equal(lireReponseIA(JSON.stringify({ alerte: false })), null);
});

test("valider retire les identifiants inconnus et limite à trois cartes", () => {
  const brut = {
    alerte: false,
    suggestions: [
      { metier: "kine", praticiens: ["julien-blamont", "inconnu"], methodes: ["bfr", "fausse"], pages: ["syndrome-rotulien", "nulle-part"], pourquoi: "Pour traiter et guider la reprise." },
      { metier: "inexistant", praticiens: ["julien-blamont"], methodes: [], pages: [], pourquoi: "x" },
      { metier: "osteo", praticiens: ["lucas-bengoechea"], methodes: [], pages: [], pourquoi: "Examen global." },
      { metier: "medecin", praticiens: ["basile-carcassonne"], methodes: ["infiltrations"], pages: [], pourquoi: "Avis médical." },
      { metier: "podologie", praticiens: ["ophelie-hubert"], methodes: [], pages: [], pourquoi: "Appui du pied." },
    ],
  };
  const v = valider(brut, cat);
  assert.equal(v.cartes.length, 3);
  assert.deepEqual(v.cartes[0].praticiens.map((p) => p.slug), ["julien-blamont"]);
  assert.deepEqual(v.cartes[0].pages.map((p) => p.lien), ["/pathologies/syndrome-rotulien"]);
  assert.ok(v.cartes.every((c) => c.metier !== ("inexistant" as string)));
});

test("un praticien qui n'exerce pas le métier proposé est retiré", () => {
  const v = valider({ alerte: false, suggestions: [{ metier: "psy", praticiens: ["hugo-daminato"], methodes: [], pages: [], pourquoi: "x" }] }, cat);
  assert.equal(v.cartes.length, 0);
});

test("un acte médical n'apparaît pas hors de la carte du médecin", () => {
  const v = valider({ alerte: false, suggestions: [{ metier: "kine", praticiens: ["jean-baptiste-colombie"], methodes: ["infiltrations", "bfr"], pages: [], pourquoi: "x" }] }, cat);
  assert.deepEqual(v.cartes[0].methodes.map((m) => m.slug), ["bfr"]);
});

test("un « pourquoi » qui parle de diagnostic ou de médicament est remplacé", () => {
  for (const p of ["Vous avez une tendinopathie.", "Prenez de l'ibuprofène.", "Le diagnostic sera posé."]) {
    const v = valider({ alerte: false, suggestions: [{ metier: "kine", praticiens: ["julien-blamont"], methodes: [], pages: [], pourquoi: p }] }, cat);
    assert.notEqual(v.cartes[0].pourquoi, p, p);
  }
});

test("le « pourquoi » est coupé à 300 caractères", () => {
  const v = valider({ alerte: false, suggestions: [{ metier: "kine", praticiens: ["julien-blamont"], methodes: [], pages: [], pourquoi: "a".repeat(400) }] }, cat);
  assert.ok(v.cartes[0].pourquoi.length <= 300);
});
