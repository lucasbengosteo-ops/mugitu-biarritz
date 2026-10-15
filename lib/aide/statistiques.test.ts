import { test } from "node:test";
import assert from "node:assert/strict";
import { questionsParSemaine, sourcesFrequentes, type LigneQuestion } from "./statistiques.ts";

const l = (cree_le: string, x: Partial<LigneQuestion> = {}): LigneQuestion => ({
  id: cree_le, cree_le, type: "reponse", sources: ["/faq"], page: "/", utile: null, consentement: false, ...x,
});

test("questionsParSemaine compte questions, sans réponse et réponses utiles, semaine la plus récente d'abord", () => {
  assert.deepEqual(
    questionsParSemaine([
      l("2026-10-12T08:00:00Z", { utile: true }),
      l("2026-10-13T08:00:00Z", { type: "inconnu", sources: [] }),
      l("2026-10-19T08:00:00Z", { utile: false }),
    ]),
    [
      { semaine: "2026-10-19", total: 1, sansReponse: 0, utiles: 0, votes: 1 },
      { semaine: "2026-10-12", total: 2, sansReponse: 1, utiles: 1, votes: 1 },
    ],
  );
});

test("sourcesFrequentes compte chaque page citée", () => {
  assert.deepEqual(sourcesFrequentes([l("a", { sources: ["/faq", "/contact"] }), l("b", { sources: ["/faq"] })]), [
    { valeur: "/faq", nombre: 2 },
    { valeur: "/contact", nombre: 1 },
  ]);
});
