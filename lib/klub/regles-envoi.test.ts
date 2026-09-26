import assert from "node:assert/strict";
import { test } from "node:test";
import { adresseDeTest, delaiNouvelleTentative, doitPartir, type MailComplet } from "./regles-envoi.ts";
import type { Inscription, Seance } from "./types.ts";

const seance: Seance = {
  id: "s1", creneau_id: null, debut: "2026-09-22T10:30:00Z", statut: "publiee", modifiee: false,
  type: "small", titre: "Renfo", description: "", intervenant: "Hugo", intervenant_email: "hugo@example.com",
  duree_min: 45, capacite: 5, prix_libelle: "15 €", inscription_requise: true,
  reservation_url: null, reservation_libelle: null, image: null, image_focus: "50% 50%",
};
const inscription: Inscription = {
  id: "i1", seance_id: "s1", prenom: "Ana", nom: "Test", email: "ana@example.com", telephone: "0612345678",
  premiere_seance: false, statut: "confirmee", present: false, origine: "site", jeton: "a".repeat(64),
  created_at: "2026-09-15T08:00:00Z",
};
const mail = (m: Partial<MailComplet>): MailComplet => ({
  id: "m1", type: "confirmation", inscription_id: "i1", seance_id: "s1", envoyer_apres: "", statut: "en_cours",
  tentatives: 1, derniere_erreur: null, created_at: "", inscription, seance, ...m,
});
const avant = new Date("2026-09-20T08:00:00Z");

test("confirmation, rappel, promotion : seulement pour une place confirmée à venir", () => {
  assert.equal(doitPartir(mail({}), avant), true);
  assert.equal(doitPartir(mail({ type: "rappel", inscription: { ...inscription, statut: "annulee" } }), avant), false);
  assert.equal(doitPartir(mail({ type: "promotion", seance: { ...seance, statut: "annulee" } }), avant), false);
  assert.equal(doitPartir(mail({}), new Date("2026-09-22T11:00:00Z")), false);
});

test("attente, annulation, séance annulée, liste intervenant", () => {
  assert.equal(doitPartir(mail({ type: "attente", inscription: { ...inscription, statut: "attente" } }), avant), true);
  assert.equal(doitPartir(mail({ type: "attente" }), avant), false);
  assert.equal(doitPartir(mail({ type: "annulation", inscription: { ...inscription, statut: "annulee" } }), avant), true);
  assert.equal(doitPartir(mail({ type: "seance_annulee", seance: { ...seance, statut: "annulee" } }), avant), true);
  assert.equal(doitPartir(mail({ type: "liste_intervenant", inscription: null }), avant), true);
  assert.equal(doitPartir(mail({ type: "liste_intervenant", inscription: null, seance: { ...seance, intervenant_email: null } }), avant), false);
  assert.equal(doitPartir(mail({ seance: null }), avant), false);
  assert.equal(
    doitPartir(mail({ type: "seance_modifiee", inscription: { ...inscription, statut: "attente" } }), avant),
    true,
  );
  assert.equal(doitPartir(mail({ type: "annulation", inscription: { ...inscription, statut: "confirmee" } }), avant), false);
});

test("rappel : seulement la veille, heure de Paris", () => {
  const rappel = (m: Partial<MailComplet> = {}) => mail({ type: "rappel", ...m });
  // 2026-09-21T21:30:00Z = 23:30 à Paris le 21 → veille de la séance (22).
  assert.equal(doitPartir(rappel(), new Date("2026-09-21T21:30:00Z")), true);
  // 2026-09-21T22:30:00Z = 00:30 à Paris le 22 → jour même, plus la veille.
  assert.equal(doitPartir(rappel(), new Date("2026-09-21T22:30:00Z")), false);
  // Séance plus tard le même jour (22) : pas « demain ».
  assert.equal(doitPartir(rappel(), new Date("2026-09-22T06:00:00Z")), false);
  // Séance dans 2 jours.
  assert.equal(doitPartir(rappel(), avant), false);
});

test("adresses de test et délais de relance", () => {
  assert.equal(adresseDeTest("ana@example.com"), true);
  assert.equal(adresseDeTest("ana@gmail.com"), false);
  assert.deepEqual([1, 2, 3, 4].map(delaiNouvelleTentative), [1, 5, 15, null]);
});
