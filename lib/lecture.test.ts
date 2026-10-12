import assert from "node:assert/strict";
import test from "node:test";
import { tempsDeLecture } from "./lecture.ts";

const vide = { chapo: "", sections: [], cas: null, exercice: null, faq: [] };

test("un article vide se lit en une minute", () => {
  assert.equal(tempsDeLecture(vide), 1);
});

test("environ 220 mots par minute, sections, cas et FAQ compris", () => {
  const mots = (n: number) => Array.from({ length: n }, () => "mot").join(" ");
  assert.equal(
    tempsDeLecture({
      ...vide,
      chapo: mots(20),
      sections: [{ h: "Titre", p: [mots(300), mots(100)] }],
      cas: mots(20),
      faq: [{ q: "Question", a: mots(0) }],
    }),
    2,
  );
});
