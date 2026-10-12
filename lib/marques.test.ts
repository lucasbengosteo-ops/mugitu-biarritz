import assert from "node:assert/strict";
import test from "node:test";
import { lireTexte } from "./marques.ts";

test("un texte brut reste un paragraphe identique", () => {
  assert.deepEqual(lireTexte("Bonjour le monde."), [
    { type: "paragraphe", morceaux: [{ texte: "Bonjour le monde." }] },
  ]);
});

test("une ligne vide sépare deux paragraphes", () => {
  const b = lireTexte("Un.\n\nDeux.");
  assert.equal(b.length, 2);
  assert.equal(b[1].type, "paragraphe");
});

test("le gras et l’italique", () => {
  const [b] = lireTexte("Un **mot fort** et un *mot léger*.");
  assert.equal(b.type, "paragraphe");
  if (b.type !== "paragraphe") return;
  assert.deepEqual(b.morceaux, [
    { texte: "Un " },
    { texte: "mot fort", gras: true },
    { texte: " et un " },
    { texte: "mot léger", italique: true },
    { texte: "." },
  ]);
});

test("un lien https et un lien interne", () => {
  const [b] = lireTexte("Voir [le guide](https://exemple.fr/guide) ou [l’équipe](/equipe).");
  if (b.type !== "paragraphe") return assert.fail("paragraphe attendu");
  assert.deepEqual(b.morceaux, [
    { texte: "Voir " },
    { texte: "le guide", href: "https://exemple.fr/guide" },
    { texte: " ou " },
    { texte: "l’équipe", href: "/equipe" },
    { texte: "." },
  ]);
});

test("un lien dangereux ou en http reste du texte", () => {
  for (const url of ["javascript:alert(1)", "http://exemple.fr", "//exemple.fr"]) {
    const [b] = lireTexte(`[clic](${url})`);
    if (b.type !== "paragraphe") return assert.fail("paragraphe attendu");
    assert.equal(b.morceaux.some((m) => m.href), false, url);
    assert.equal(b.morceaux.map((m) => m.texte).join(""), `[clic](${url})`, url);
  }
});

test("des lignes qui commencent toutes par un tiret font une liste", () => {
  const [b] = lireTexte("- douleur en fin de rame\n- **raideur** le matin");
  assert.equal(b.type, "liste");
  if (b.type !== "liste") return;
  assert.equal(b.items.length, 2);
  assert.deepEqual(b.items[1], [{ texte: "raideur", gras: true }, { texte: " le matin" }]);
});

test("un tiret isolé au milieu d’un paragraphe ne fait pas une liste", () => {
  const [b] = lireTexte("Voici :\n- un\n- deux");
  assert.equal(b.type, "paragraphe");
});

test("la reconnaissance automatique continue de marcher", () => {
  const [b] = lireTexte("Suivez @mugitu et mugitu-biarritz.fr");
  if (b.type !== "paragraphe") return assert.fail("paragraphe attendu");
  assert.deepEqual(
    b.morceaux.filter((m) => m.href).map((m) => m.href),
    ["https://www.instagram.com/mugitu/", "https://mugitu-biarritz.fr"],
  );
});

test("un lien écrit entre crochets l’emporte sur la reconnaissance automatique", () => {
  const [b] = lireTexte("[notre site](https://mugitu-biarritz.fr)");
  if (b.type !== "paragraphe") return assert.fail("paragraphe attendu");
  assert.deepEqual(b.morceaux, [{ texte: "notre site", href: "https://mugitu-biarritz.fr" }]);
});

test("une étoile seule et un tiret bas restent du texte", () => {
  const [b] = lireTexte("3 * 4 font 12, mot_clé");
  if (b.type !== "paragraphe") return assert.fail("paragraphe attendu");
  assert.equal(b.morceaux.map((m) => m.texte).join(""), "3 * 4 font 12, mot_clé");
  assert.equal(b.morceaux.some((m) => m.gras || m.italique), false);
});

test("un texte vide ne produit rien", () => {
  assert.deepEqual(lireTexte(""), []);
  assert.deepEqual(lireTexte("   \n\n  "), []);
});

test("le point qui clôt la phrase reste hors du pseudo Instagram", () => {
  const [b] = lireTexte("Suivez @mugitu.");
  if (b.type !== "paragraphe") return assert.fail("paragraphe attendu");
  assert.deepEqual(b.morceaux, [
    { texte: "Suivez " },
    { texte: "@mugitu", href: "https://www.instagram.com/mugitu/" },
    { texte: "." },
  ]);
});
