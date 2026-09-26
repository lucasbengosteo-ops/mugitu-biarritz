import assert from "node:assert/strict";
import test from "node:test";
import { habillerRecap } from "./recap.ts";

const CORPS = `Séances créées
- Prépa des danseurs, le 03/10 à 08h00

Articles à relire
- Épaule du surfeur (Hugo Daminato)
`;

test("chaque thème devient un titre, chaque ligne un item", () => {
  const { html, texte } = habillerRecap(CORPS);
  assert.ok(html.includes("Séances créées"));
  assert.ok(html.includes("<li"));
  assert.ok(html.includes("Épaule du surfeur"));
  assert.ok(texte.includes("Séances créées"));
  assert.ok(texte.includes("- Prépa des danseurs, le 03/10 à 08h00"));
});

test("le HTML est échappé", () => {
  const { html } = habillerRecap("Articles publiés\n- <script>alert(1)</script>\n");
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("&lt;script&gt;"));
});

test("un corps vide ne produit aucun thème", () => {
  const { html, texte } = habillerRecap("");
  assert.ok(!html.includes("<li"));
  assert.equal(texte.trim().length > 0, true);
});

test("une ligne sans thème au-dessus n’est pas perdue", () => {
  const { texte } = habillerRecap("- orpheline\n");
  assert.ok(texte.includes("orpheline"));
});
