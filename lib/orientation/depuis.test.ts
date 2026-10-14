import { test } from "node:test";
import assert from "node:assert/strict";
import { prerempli } from "./depuis.ts";

test("une pathologie donne motif et zone", () => {
  assert.deepEqual(prerempli("tendinopathie-achille"), { motif: "douleur", zone: "cheville-pied", slug: "tendinopathie-achille" });
});

test("un soin donne un métier", () => {
  assert.deepEqual(prerempli("osteopathie"), { metier: "osteo", slug: "osteopathie" });
});

test("un slug inconnu ou mal formé ne donne rien", () => {
  assert.equal(prerempli("inconnu"), null);
  assert.equal(prerempli("<script>"), null);
  assert.equal(prerempli(null), null);
});
