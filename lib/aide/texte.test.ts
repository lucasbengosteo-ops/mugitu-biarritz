import { test } from "node:test";
import assert from "node:assert/strict";
import { sansBalises, slugifier } from "./texte.ts";

test("sansBalises retire les balises et décode les entités courantes", () => {
  assert.equal(sansBalises("<p>Médecine du sport &amp; rééducation&nbsp;: <strong>oui</strong></p>"), "Médecine du sport & rééducation : oui");
});

test("sansBalises garde une espace entre deux blocs", () => {
  assert.equal(sansBalises("<p>Un</p><p>Deux</p>"), "Un Deux");
});

test("slugifier", () => {
  assert.equal(slugifier("Faut-il une ordonnance ?"), "faut-il-une-ordonnance");
  assert.equal(slugifier("Les small groups, c’est combien ?"), "les-small-groups-c-est-combien");
});
