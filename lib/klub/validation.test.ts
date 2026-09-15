import assert from "node:assert/strict";
import { test } from "node:test";
import { codeErreur, ERREURS } from "./erreurs.ts";
import { normaliserTelephone, UUID, verifierCoordonnees } from "./validation.ts";

const ok = { prenom: "Ana", nom: "Test", email: "ana@example.com", telephone: "06 12 34 56 78" };

test("coordonnées valides", () => {
  assert.equal(verifierCoordonnees(ok), null);
  assert.equal(verifierCoordonnees({ ...ok, telephone: "+33 6 12 34 56 78" }), null);
});

test("chaque problème a son code", () => {
  assert.equal(verifierCoordonnees({ ...ok, nom: "  " }), "KLUB_NOM");
  assert.equal(verifierCoordonnees({ ...ok, email: "ana@" }), "KLUB_EMAIL");
  assert.equal(verifierCoordonnees({ ...ok, telephone: "0612" }), "KLUB_TELEPHONE");
});

test("normalisation du téléphone", () => {
  assert.equal(normaliserTelephone("06.12-34 (56) 78"), "0612345678");
});

test("identifiant de séance", () => {
  assert.ok(UUID.test("3f2b8c1e-9a4d-4c7e-8b1a-2d3e4f5a6b7c"));
  assert.ok(!UUID.test("pas-un-uuid"));
});

test("codes lus dans les erreurs PostgREST", () => {
  assert.equal(codeErreur({ message: "KLUB_COMMENCEE" }), "KLUB_COMMENCEE");
  assert.equal(codeErreur(null), null);
  for (const code of ["KLUB_NOM", "KLUB_EMAIL", "KLUB_TELEPHONE", "KLUB_SEANCE", "KLUB_COMMENCEE", "KLUB_LIBRE"]) {
    assert.ok(ERREURS[code], code);
  }
});
