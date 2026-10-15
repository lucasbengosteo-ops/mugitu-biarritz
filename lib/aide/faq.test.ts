import { test } from "node:test";
import assert from "node:assert/strict";
import { getInstitutionnel } from "../institutionnel.ts";
import { extraireFaq } from "./faq.ts";

test("la FAQ du site donne ses huit questions, chacune avec sa réponse", () => {
  const faq = extraireFaq(getInstitutionnel("faq").bodyHtml);
  assert.equal(faq.length, 8);
  for (const q of faq) {
    assert.ok(q.question.length > 5 && q.question.endsWith("?"), q.question);
    assert.ok(q.reponse.length > 20, q.question);
    assert.ok(!/[<>]/.test(q.question + q.reponse), q.question);
  }
});

test("chaque question a un identifiant unique", () => {
  const faq = extraireFaq(getInstitutionnel("faq").bodyHtml);
  assert.equal(new Set(faq.map((q) => q.id)).size, faq.length);
});
