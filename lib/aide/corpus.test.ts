import { test } from "node:test";
import assert from "node:assert/strict";
import { getInstitutionnel } from "../institutionnel.ts";
import { KLUB } from "../klub.ts";
import { construireCorpus, decouper, nombreDeMots } from "./corpus.ts";

const faqHtml = getInstitutionnel("faq").bodyHtml;
const zone = getInstitutionnel("zone-intervention");
const corpus = construireCorpus({
  faqHtml,
  pages: [
    { id: "acces", titre: "Venir au cabinet", lien: "/zone-intervention", html: zone.bodyHtml },
    { id: "klub", titre: "Le Mugi Klub", lien: "/mugi-klub", html: KLUB.bodyHtml },
  ],
  tarifs: [{ praticien: "x", nom: "X", fiche: "/equipe/x", lignes: [{ titre: "Séance d'ostéopathie", prix: "60 €", mention: "sur rendez-vous" }] }],
});

test("le corpus réel tient sous 12 000 mots", () => {
  assert.ok(nombreDeMots(corpus) < 12000, String(nombreDeMots(corpus)));
});

test("chaque passage a un identifiant unique, un texte et un lien interne", () => {
  assert.equal(new Set(corpus.map((p) => p.id)).size, corpus.length);
  for (const p of corpus) {
    assert.ok(p.texte.length >= 20, p.id);
    assert.ok(p.lien.startsWith("/"), p.id);
  }
});

test("la FAQ et les tarifs sont dans le corpus", () => {
  assert.ok(corpus.some((p) => p.id.startsWith("faq-") && p.lien === "/faq"));
  assert.ok(corpus.some((p) => p.id === "tarifs-x" && p.texte.includes("60 €")));
});

test("une page est découpée à chaque titre de niveau 2", () => {
  const p = decouper({ id: "t", titre: "Test", lien: "/t", html: "<h2>Un</h2><p>" + "a ".repeat(30) + "</p><h2>Deux</h2><p>" + "b ".repeat(30) + "</p>" });
  assert.deepEqual(p.map((x) => x.id), ["t-un", "t-deux"]);
});
