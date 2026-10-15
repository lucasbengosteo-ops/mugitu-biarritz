import { test } from "node:test";
import assert from "node:assert/strict";
import { chercher } from "./recherche.ts";
import type { ArticleAide } from "./types.ts";

const A: ArticleAide[] = [
  { rubrique: "faq", titre: "Faut-il une ordonnance ?", lien: "/faq", texte: "Pour la kinésithérapie, oui." },
  { rubrique: "pathologies", titre: "Tendinopathie d’Achille", lien: "/pathologies/tendinopathie-achille", texte: "Douleur au talon chez le coureur." },
  { rubrique: "actualites", titre: "Le genou du skieur", lien: "/actualites/genou", texte: "Ordonnance et rééducation." },
];

test("la recherche ignore accents et majuscules", () => {
  assert.equal(chercher(A, "KINESITHERAPIE")[0].lien, "/faq");
});

test("le titre passe avant le texte", () => {
  assert.deepEqual(chercher(A, "ordonnance").map((a) => a.lien), ["/faq", "/actualites/genou"]);
});

test("tous les mots doivent être présents", () => {
  assert.deepEqual(chercher(A, "talon coureur").map((a) => a.lien), ["/pathologies/tendinopathie-achille"]);
  assert.deepEqual(chercher(A, "talon skieur"), []);
});

test("une requête vide ne rend rien", () => {
  assert.deepEqual(chercher(A, " "), []);
});
