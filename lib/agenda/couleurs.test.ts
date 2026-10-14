import assert from "node:assert/strict";
import test from "node:test";
import { couleursParPersonne, initiales, PALETTE } from "./couleurs.ts";

/**
 * Formule WCAG de luminance relative, reprise ici pour vérifier la palette
 * par calcul plutôt qu'à l'œil. https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function luminanceRelative(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const canal = (c: number) => {
    const cs = c / 255;
    return cs <= 0.03928 ? cs / 12.92 : ((cs + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

function ratioContraste(hex1: string, hex2: string): number {
  const l1 = luminanceRelative(hex1);
  const l2 = luminanceRelative(hex2);
  const [clair, sombre] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (clair + 0.05) / (sombre + 0.05);
}

test("chaque teinte de la palette atteint 4,5:1 avec sa couleur de texte", () => {
  for (const { fond, texte } of PALETTE) {
    const ratio = ratioContraste(fond, texte);
    assert.ok(ratio >= 4.5, `${fond}/${texte} = ${ratio.toFixed(2)}:1, attendu ≥ 4,5:1`);
  }
});

test("initiales : prénom composé puis nom", () => {
  assert.equal(initiales("Jean-Baptiste Colombié"), "JBC");
});

test("initiales : deux mots simples", () => {
  assert.equal(initiales("Lucas Bengosteo"), "LB");
});

test("initiales : une seule partie", () => {
  assert.equal(initiales("Madonna"), "M");
});

test("initiales : nom vide", () => {
  assert.equal(initiales(""), "?");
  assert.equal(initiales("   "), "?");
});

test("initiales : jamais plus de trois lettres", () => {
  assert.equal(initiales("Jean-Baptiste-Marie Dupont Delacroix"), "JBM");
});

test("couleursParPersonne : même entrée, mêmes couleurs", () => {
  const personnes = [
    { id: "1", nom: "Lucas Bengosteo" },
    { id: "2", nom: "Jean-Baptiste Colombié" },
    { id: "3", nom: "Marie Dupont" },
  ];
  const a = couleursParPersonne(personnes);
  const b = couleursParPersonne(personnes);
  assert.deepEqual(a, b);
});

test("couleursParPersonne : l'ordre d'entrée ne change rien", () => {
  const personnes = [
    { id: "1", nom: "Lucas Bengosteo" },
    { id: "2", nom: "Jean-Baptiste Colombié" },
    { id: "3", nom: "Marie Dupont" },
  ];
  const direct = couleursParPersonne(personnes);
  const inverse = couleursParPersonne([...personnes].reverse());
  assert.deepEqual(direct, inverse);
});

test("couleursParPersonne : ordre alphabétique fr, sans accent ni casse", () => {
  const personnes = [
    { id: "e", nom: "émilie Dupont" },
    { id: "a", nom: "Antoine Martin" },
  ];
  const c = couleursParPersonne(personnes);
  // Antoine (a) vient avant émilie (e) dans l'ordre alphabétique fr.
  assert.deepEqual(c.a, PALETTE[0]);
  assert.deepEqual(c.e, PALETTE[1]);
});

test("couleursParPersonne : la 11e personne reprend la 1re teinte", () => {
  const personnes = Array.from({ length: 11 }, (_, i) => ({
    id: `p${i}`,
    // noms déjà en ordre alphabétique : a, b, c, …
    nom: String.fromCharCode(97 + i),
  }));
  const c = couleursParPersonne(personnes);
  assert.deepEqual(c.p0, PALETTE[0]);
  assert.deepEqual(c.p10, PALETTE[0]);
  assert.deepEqual(c.p1, PALETTE[1]);
});
