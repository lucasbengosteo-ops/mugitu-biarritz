import assert from "node:assert/strict";
import test from "node:test";
import { filtrerJours, preparerPlanning } from "./planning.ts";
import type { KlubType, SeancePublique } from "./types.ts";

let n = 0;
const s = (debut: string, type: KlubType = "small", statut: "publiee" | "annulee" = "publiee"): SeancePublique => ({
  id: `s${++n}`,
  debut,
  statut,
  type,
  titre: "Prépa des danseurs",
  description: "",
  intervenant: "Jean-Baptiste",
  duree_min: 60,
  capacite: 12,
  prix_libelle: "15 €",
  inscription_requise: true,
  reservation_url: null,
  reservation_libelle: null,
  image: null,
  image_focus: "50% 50%",
  places_restantes: 12,
  nb_attente: 0,
});

// Lundi 28 septembre 2026, minuit UTC.
const MAINTENANT = "2026-09-28T00:00:00Z";

test("sans séance, rien à la une et aucun filtre", () => {
  const p = preparerPlanning([], MAINTENANT);
  assert.equal(p.aLaUne, null);
  assert.deepEqual(p.jours, []);
  assert.equal(p.afficherFiltres, false);
});

test("la séance à la une est la prochaine à venir", () => {
  const a = s("2026-10-02T06:00:00Z");
  const b = s("2026-09-28T06:00:00Z");
  assert.equal(preparerPlanning([a, b], MAINTENANT).aLaUne?.id, b.id);
});

test("une séance passée n’est ni à la une ni dans la liste", () => {
  const passee = s("2026-09-25T06:00:00Z");
  const avenir = s("2026-10-02T06:00:00Z");
  const p = preparerPlanning([passee, avenir], MAINTENANT);
  assert.equal(p.aLaUne?.id, avenir.id);
  assert.equal(p.jours.flatMap((j) => j.seances).some((x) => x.id === passee.id), false);
});

test("une séance annulée et déjà passée disparaît aussi", () => {
  const annuleePassee = s("2026-09-21T06:00:00Z", "small", "annulee");
  const avenir = s("2026-10-02T06:00:00Z");
  const p = preparerPlanning([annuleePassee, avenir], MAINTENANT);
  assert.equal(p.jours.flatMap((j) => j.seances).some((x) => x.id === annuleePassee.id), false);
  assert.deepEqual(p.types, [{ type: "small", nombre: 1 }]);
});

test("une séance en cours n’est pas à la une", () => {
  // Commencée à 23 h 30 UTC la veille, une heure : encore en cours à minuit.
  const enCours = s("2026-09-27T23:30:00Z");
  const suivante = s("2026-10-02T06:00:00Z");
  const p = preparerPlanning([enCours, suivante], MAINTENANT);
  assert.equal(p.aLaUne?.id, suivante.id);
});

test("une séance annulée n’est pas à la une, mais reste dans la liste", () => {
  const annulee = s("2026-09-28T06:00:00Z", "small", "annulee");
  const suivante = s("2026-10-02T06:00:00Z");
  const p = preparerPlanning([annulee, suivante], MAINTENANT);
  assert.equal(p.aLaUne?.id, suivante.id);
  assert.equal(p.jours.flatMap((j) => j.seances).some((x) => x.id === annulee.id), true);
});

test("la séance à la une n’est pas répétée dans la liste", () => {
  const a = s("2026-09-28T06:00:00Z");
  const b = s("2026-10-02T06:00:00Z");
  const p = preparerPlanning([a, b], MAINTENANT);
  assert.equal(p.jours.flatMap((j) => j.seances).some((x) => x.id === a.id), false);
});

test("la liste est groupée par jour, dans l’ordre", () => {
  const ouverture = s("2026-09-28T06:00:00Z");
  const matin = s("2026-10-02T06:00:00Z");
  const soir = s("2026-10-02T16:00:00Z");
  const lundi = s("2026-10-05T06:00:00Z");
  const p = preparerPlanning([lundi, soir, ouverture, matin], MAINTENANT);
  assert.deepEqual(
    p.jours.map((j) => j.cle),
    ["2026-10-02", "2026-10-05"],
  );
  assert.deepEqual(
    p.jours[0].seances.map((x) => x.id),
    [matin.id, soir.id],
  );
});

test("un seul type : pas de filtres", () => {
  const p = preparerPlanning([s("2026-09-28T06:00:00Z"), s("2026-10-02T06:00:00Z")], MAINTENANT);
  assert.deepEqual(p.types, [{ type: "small", nombre: 2 }]);
  assert.equal(p.afficherFiltres, false);
});

test("deux types : les filtres apparaissent, dans l’ordre des types", () => {
  const p = preparerPlanning(
    [s("2026-09-29T16:00:00Z", "atelier"), s("2026-09-28T06:00:00Z", "small"), s("2026-10-02T06:00:00Z", "small")],
    MAINTENANT,
  );
  assert.deepEqual(p.types, [
    { type: "small", nombre: 2 },
    { type: "atelier", nombre: 1 },
  ]);
  assert.equal(p.afficherFiltres, true);
});

test("filtrer par type retire les jours devenus vides", () => {
  const p = preparerPlanning(
    [s("2026-09-28T06:00:00Z"), s("2026-09-30T16:00:00Z", "atelier"), s("2026-10-02T06:00:00Z", "small")],
    MAINTENANT,
  );
  const ateliers = filtrerJours(p.jours, "atelier");
  assert.deepEqual(
    ateliers.map((j) => j.cle),
    ["2026-09-30"],
  );
  assert.deepEqual(filtrerJours(p.jours, null), p.jours);
});
