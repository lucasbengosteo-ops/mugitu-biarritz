import { test } from "node:test";
import assert from "node:assert/strict";
import { lireQuestion, lireReponseIA, validerReponse, TEXTE_INCONNU } from "./validation.ts";
import type { Passage } from "./types.ts";

const C: Passage[] = [
  { id: "faq-faut-il-une-ordonnance", titre: "Faut-il une ordonnance ?", texte: "…", lien: "/faq" },
  { id: "acces-parking", titre: "Venir au cabinet — Se garer", texte: "…", lien: "/zone-intervention" },
];

test("lireQuestion coupe à 500 caractères, garde les deux derniers échanges, nettoie la page", () => {
  const q = lireQuestion({ texte: "x".repeat(600), page: "javascript:alert(1)", historique: [1, 2, 3].map((i) => ({ question: `q${i}`, reponse: `r${i}` })) });
  assert.ok(q);
  assert.equal(q.texte.length, 500);
  assert.equal(q.page, "/");
  assert.deepEqual(q.historique.map((e) => e.question), ["q2", "q3"]);
});

test("lireQuestion refuse une question vide", () => {
  assert.equal(lireQuestion({ texte: "   " }), null);
  assert.equal(lireQuestion(null), null);
});

test("lireReponseIA refuse un type inconnu ou un JSON mal formé", () => {
  assert.equal(lireReponseIA("pas du json"), null);
  assert.equal(lireReponseIA(JSON.stringify({ type: "poeme", texte: "x" })), null);
});

test("une réponse valide garde ses sources connues, sans doublon de page", () => {
  const v = validerReponse({ type: "reponse", texte: "Oui, pour la kinésithérapie.", sources: ["faq-faut-il-une-ordonnance", "inconnue", "faq-faut-il-une-ordonnance"] }, C);
  assert.equal(v.type, "reponse");
  assert.deepEqual(v.sources, [{ titre: "Faut-il une ordonnance ?", lien: "/faq" }]);
});

test("une réponse sans source valide devient « inconnu »", () => {
  const v = validerReponse({ type: "reponse", texte: "Le parking est gratuit.", sources: ["invente"] }, C);
  assert.equal(v.type, "inconnu");
  assert.equal(v.texte, TEXTE_INCONNU);
});

test("un texte trop long, médical ou en écriture inclusive devient « inconnu »", () => {
  for (const t of ["a".repeat(700), "Prenez du paracétamol.", "Un·e praticien·ne vous reçoit."]) {
    assert.equal(validerReponse({ type: "reponse", texte: t, sources: ["acces-parking"] }, C).type, "inconnu", t);
  }
});

test("une question médicale reçoit le message prévu, sans source", () => {
  const v = validerReponse({ type: "medical", texte: "Mettez de la glace.", sources: [] }, C);
  assert.equal(v.type, "medical");
  assert.ok(!v.texte.includes("glace"));
});
