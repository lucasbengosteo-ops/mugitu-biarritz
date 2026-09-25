import assert from "node:assert/strict";
import test from "node:test";
import { compteurParPersonne, etatCase, type Voeu } from "./grille.ts";

const v = (id: string, user: string, statut: Voeu["statut"]): Voeu => ({
  id,
  user_id: user,
  salle: "sua",
  jour: 2,
  moment: "matin",
  statut,
  decide_par: null,
  decide_le: null,
});

test("une case vide n’a ni occupant ni conflit", () => {
  const e = etatCase([], "sua", 2, "matin");
  assert.equal(e.occupant, null);
  assert.equal(e.enConflit, false);
  assert.deepEqual(e.demandes, []);
});

test("un vœu accordé occupe la case", () => {
  const e = etatCase([v("1", "u1", "valide")], "sua", 2, "matin");
  assert.equal(e.occupant?.user_id, "u1");
  assert.equal(e.enConflit, false);
});

test("un retrait demandé tient encore la case", () => {
  const e = etatCase([v("1", "u1", "retrait_demande")], "sua", 2, "matin");
  assert.equal(e.occupant?.user_id, "u1");
});

test("deux vœux vivants font un conflit", () => {
  const e = etatCase([v("1", "u1", "valide"), v("2", "u2", "propose")], "sua", 2, "matin");
  assert.equal(e.enConflit, true);
  assert.equal(e.demandes.length, 1);
  assert.equal(e.demandes[0].user_id, "u2");
});

test("un vœu refusé ne fait pas de conflit", () => {
  const e = etatCase([v("1", "u1", "valide"), v("2", "u2", "refuse")], "sua", 2, "matin");
  assert.equal(e.enConflit, false);
  assert.deepEqual(e.demandes, []);
});

test("une case d’une autre salle est ignorée", () => {
  const ailleurs = { ...v("1", "u1", "valide"), salle: "ura" as const };
  const e = etatCase([ailleurs], "sua", 2, "matin");
  assert.equal(e.occupant, null);
});

test("le compteur ne retient que les vœux vivants", () => {
  const voeux = [
    v("1", "u1", "valide"),
    { ...v("2", "u1", "propose"), jour: 3 as const },
    { ...v("3", "u1", "refuse"), jour: 4 as const },
    { ...v("4", "u2", "valide"), jour: 5 as const },
  ];
  assert.deepEqual(compteurParPersonne(voeux), { u1: 2, u2: 1 });
});
