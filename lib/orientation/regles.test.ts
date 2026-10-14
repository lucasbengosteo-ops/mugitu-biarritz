import { test } from "node:test";
import assert from "node:assert/strict";
import { TEAM } from "../team.ts";
import { METHODE_CARDS } from "../methodes.ts";
import { PATHOLOGIES } from "../pathologies.ts";
import { SPORTS } from "../sports.ts";
import { construireCatalogue } from "./catalogue.ts";
import { correspondance, detecterAlerte, detecterDetresse, normaliser } from "./regles.ts";
import { MOTIFS, ZONES, type Reponses } from "./types.ts";

const cat = construireCatalogue({ equipe: TEAM, methodes: METHODE_CARDS, pathologies: PATHOLOGIES, sports: SPORTS });
const base: Reponses = {
  motif: "douleur",
  zone: "genou",
  anciennete: "1-6-semaines",
  sport: "aucun",
  signes: false,
  texte: "",
  depuis: null,
  consentement: false,
};

test("normaliser retire accents et majuscules", () => {
  assert.equal(normaliser("Fièvre ÉLEVÉE"), "fievre elevee");
});

test("un signe déclaré arrête le parcours", () => {
  assert.equal(detecterAlerte({ ...base, signes: true }), "signe");
});

test("un mot d'alerte dans le texte arrête le parcours, accents et majuscules compris", () => {
  for (const t of ["J'ai une DOULEUR THORACIQUE", "fièvre depuis hier", "je ne peux plus poser le pied", "perte de force dans la jambe"]) {
    assert.equal(detecterAlerte({ ...base, texte: t }), "mot", t);
  }
});

test("un texte ordinaire ne déclenche rien", () => {
  assert.equal(detecterAlerte({ ...base, texte: "douleur au genou en courant depuis trois semaines" }), null);
});

test("les idées suicidaires sont repérées, quel que soit le motif", () => {
  for (const t of ["j'ai envie d'en finir", "je pense au suicide", "Je veux me faire du mal"]) {
    assert.equal(detecterDetresse(t), true, t);
  }
  assert.equal(detecterDetresse("stress avant les compétitions"), false);
});

test("la table fixe répond pour chaque motif et chaque zone", () => {
  for (const m of MOTIFS) {
    for (const z of ZONES) {
      const cartes = correspondance({ ...base, motif: m.id, zone: z.id }, cat);
      assert.ok(cartes.length >= 1 && cartes.length <= 3, `${m.id}/${z.id}`);
      for (const c of cartes) assert.ok(c.praticiens.length >= 1, `${m.id}/${z.id}/${c.metier}`);
    }
  }
});

test("une douleur de plus de six semaines met le médecin du sport en tête", () => {
  const cartes = correspondance({ ...base, anciennete: "plus-6-semaines" }, cat);
  assert.equal(cartes[0].metier, "medecin");
});

test("le motif mental mène à la psychologie", () => {
  assert.equal(correspondance({ ...base, motif: "mental", zone: null }, cat)[0].metier, "psy");
});

test("une page de soin d'origine passe en tête", () => {
  assert.equal(correspondance({ ...base, depuis: "podologie" }, cat)[0].metier, "podologie");
});

test("un coureur voit la Clinique du Coureur sur la carte du kiné", () => {
  const cartes = correspondance({ ...base, zone: "genou", sport: "trail-et-course" }, cat);
  const kine = cartes.find((c) => c.metier === "kine");
  assert.ok(kine?.methodes.some((m) => m.slug === "clinique-du-coureur"));
});

test("les actes médicaux ne sortent que sur la carte du médecin", () => {
  for (const m of MOTIFS) {
    for (const c of correspondance({ ...base, motif: m.id }, cat)) {
      if (c.metier !== "medecin") assert.ok(c.methodes.every((x) => !x.acteMedical), `${m.id}/${c.metier}`);
    }
  }
});

test("la préparation physique propose le Mugi Klub", () => {
  const prepa = correspondance({ ...base, motif: "performance", zone: null }, cat).find((c) => c.metier === "prepa");
  assert.ok(prepa && prepa.klub.length > 0);
});
