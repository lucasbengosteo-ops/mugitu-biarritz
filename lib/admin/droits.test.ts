import assert from "node:assert/strict";
import { test } from "node:test";
import { peutModifierArticle, peutSupprimerArticle, rubriquesVisibles, type Acces } from "./droits.ts";

const equipe: Acces = { etat: "pret", userId: "u1", prenom: "Hugo", estEquipe: true, estSuperAdmin: false };
const patron: Acces = { etat: "pret", userId: "u2", prenom: "Lucas", estEquipe: true, estSuperAdmin: true };
const inconnu: Acces = { etat: "pret", userId: "u3", prenom: "", estEquipe: false, estSuperAdmin: false };

test("un praticien ne modifie que ses articles", () => {
  assert.equal(peutModifierArticle(equipe, "u1"), true);
  assert.equal(peutModifierArticle(equipe, "u2"), false);
  assert.equal(peutModifierArticle(equipe, null), false);
});

test("un super-admin modifie tout, y compris un article sans propriétaire", () => {
  assert.equal(peutModifierArticle(patron, "u1"), true);
  assert.equal(peutModifierArticle(patron, null), true);
});

test("hors équipe, aucun droit", () => {
  assert.equal(peutModifierArticle(inconnu, "u3"), false);
  assert.equal(peutSupprimerArticle(inconnu, "u3"), false);
});

test("la suppression suit la modification", () => {
  assert.equal(peutSupprimerArticle(equipe, "u1"), true);
  assert.equal(peutSupprimerArticle(equipe, "u2"), false);
  assert.equal(peutSupprimerArticle(patron, "u1"), true);
});

test("les rubriques dépendent des droits", () => {
  assert.deepEqual(
    rubriquesVisibles(equipe).map((r) => r.href),
    ["/admin", "/admin/actualites", "/admin/mugi-klub", "/admin/agenda", "/admin/evenements"],
  );
  assert.ok(rubriquesVisibles(patron).some((r) => r.href === "/admin/praticiens"));
  assert.deepEqual(rubriquesVisibles(inconnu), []);
});

test("l’agenda est ouvert", () => {
  const agenda = rubriquesVisibles(equipe).find((r) => r.href === "/admin/agenda");
  assert.equal(agenda?.bientot, undefined);
});
