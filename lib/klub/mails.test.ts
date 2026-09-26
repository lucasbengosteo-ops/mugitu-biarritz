import assert from "node:assert/strict";
import { test } from "node:test";
import { composer } from "./mails.ts";
import type { Inscription, Seance, TypeMail } from "./types.ts";

const site = "https://mugitu-biarritz.fr";
const seance: Seance = {
  id: "s1", creneau_id: null, debut: "2026-09-22T10:30:00Z", statut: "publiee", modifiee: false,
  type: "small", titre: "Renfo <b>", description: "", intervenant: "Hugo", intervenant_email: "hugo@example.com",
  duree_min: 45, capacite: 5, prix_libelle: "15 €", inscription_requise: true,
  reservation_url: null, reservation_libelle: null,
};
const ana: Inscription = {
  id: "i1", seance_id: "s1", prenom: "Ana", nom: "Test", email: "ana@example.com", telephone: "0612345678",
  premiere_seance: true, statut: "confirmee", present: false, origine: "site", jeton: "a".repeat(64),
  created_at: "2026-09-15T08:00:00Z",
};

test("confirmation", () => {
  const m = composer({ type: "confirmation", site, seance, inscription: ana });
  assert.equal(m.destinataire.email, "ana@example.com");
  assert.ok(m.sujet.includes("mardi 22 septembre à 12 h 30"), m.sujet);
  assert.ok(m.html.includes(`/mugi-klub/annulation?jeton=${"a".repeat(64)}`));
  assert.ok(m.html.includes("Renfo &lt;b&gt;"));
  assert.ok(!m.html.includes("Renfo <b>"));
  assert.ok(m.texte.startsWith("Bonjour Ana,"));
  assert.equal(m.ics, true);
});

test("attente avec le rang", () => {
  const m = composer({ type: "attente", site, seance, inscription: { ...ana, statut: "attente" }, rang: 2 });
  assert.ok(m.texte.includes("2ᵉ sur la liste d’attente"), m.texte);
  assert.equal(m.ics, false);
});

test("liste intervenant", () => {
  const m = composer({ type: "liste_intervenant", site, seance, confirmes: [ana], attente: [] });
  assert.equal(m.destinataire.email, "hugo@example.com");
  assert.ok(m.html.includes("0612345678"));
  assert.ok(m.texte.includes("première séance"));
});

test("séance modifiée pour une personne en liste d’attente", () => {
  const m = composer({ type: "seance_modifiee", site, seance, inscription: { ...ana, statut: "attente" } });
  assert.equal(m.ics, false);
  assert.ok(m.html.includes("Quitter la liste d’attente"), m.html);
});

test("chaque type a un sujet et un texte", () => {
  const types: TypeMail[] = ["confirmation", "attente", "promotion", "annulation", "rappel", "seance_modifiee", "seance_annulee"];
  for (const type of types) {
    const m = composer({ type, site, seance, inscription: ana, rang: 1 });
    assert.ok(m.sujet.length > 10 && m.texte.length > 40, type);
  }
});
