import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ajouterJours,
  cleJour,
  dateHeure,
  dateLongue,
  depuisChampDateHeure,
  etatPlaces,
  heure,
  lundiDe,
  rang,
  semaines,
  versChampDateHeure,
} from "./format.ts";
import type { SeancePublique } from "./types.ts";

test("heure et date de Paris en heure d'été", () => {
  assert.equal(heure("2026-09-22T10:30:00Z"), "12 h 30");
  assert.equal(dateLongue("2026-09-22T10:30:00Z"), "mardi 22 septembre");
  assert.equal(dateHeure("2026-09-22T10:30:00Z"), "mardi 22 septembre à 12 h 30");
});

test("heure de Paris en heure d'hiver", () => {
  assert.equal(heure("2026-11-03T11:30:00Z"), "12 h 30");
  assert.equal(heure("2026-11-03T08:05:00Z"), "9 h 05");
});

test("la clé de jour suit Paris, pas UTC", () => {
  assert.equal(cleJour("2026-09-21T22:30:00Z"), "2026-09-22");
});

test("semaines à partir d'aujourd'hui", () => {
  assert.equal(lundiDe("2026-09-16"), "2026-09-14");
  assert.equal(lundiDe("2026-09-20"), "2026-09-14");
  assert.equal(ajouterJours("2026-10-30", 3), "2026-11-02");
  const s = semaines("2026-09-16", 4);
  assert.equal(s.length, 4);
  assert.deepEqual(s[0], { debut: "2026-09-14", fin: "2026-09-20", libelle: "14 sept. – 20 sept." });
  assert.equal(s[3].debut, "2026-10-05");
});

test("rang lisible", () => {
  assert.equal(rang(1), "1ʳᵉ");
  assert.equal(rang(3), "3ᵉ");
});

const base: SeancePublique = {
  id: "x",
  debut: "2026-09-22T10:30:00Z",
  duree_min: 45,
  type: "small",
  titre: "Renfo",
  description: "",
  intervenant: "Hugo",
  prix_libelle: "15 €",
  inscription_requise: true,
  capacite: 5,
  statut: "publiee",
  places_restantes: 3,
  nb_attente: 0,
};
const avant = "2026-09-20T08:00:00Z";

test("état des places", () => {
  assert.deepEqual(etatPlaces(base, avant), { texte: "3 places sur 5", ton: "ok" });
  assert.deepEqual(etatPlaces({ ...base, places_restantes: 1 }, avant), { texte: "1 place sur 5", ton: "peu" });
  assert.equal(etatPlaces({ ...base, places_restantes: 0 }, avant).ton, "complet");
  assert.equal(
    etatPlaces({ ...base, inscription_requise: false, capacite: null, places_restantes: null }, avant).texte,
    "Entrée libre",
  );
  assert.equal(etatPlaces({ ...base, statut: "annulee" }, avant).texte, "Annulée");
  assert.equal(etatPlaces(base, "2026-09-22T11:00:00Z").texte, "En cours");
  assert.equal(etatPlaces(base, "2026-09-22T11:20:00Z").texte, "Terminée");
});

test("champ datetime-local en heure de Paris", () => {
  assert.equal(versChampDateHeure("2026-09-22T10:30:00Z"), "2026-09-22T12:30");
  assert.equal(depuisChampDateHeure("2026-09-22T12:30"), "2026-09-22T10:30:00.000Z");
  assert.equal(depuisChampDateHeure("2026-11-03T12:30"), "2026-11-03T11:30:00.000Z");
});
