import assert from "node:assert/strict";
import test from "node:test";
import {
  DELAI_RESERVATION_MIN,
  DUREE_SESSION_MIN,
  finGardeAttente,
  finSessionPaiement,
  libellePrix,
  prixAffiche,
  remboursable,
} from "./paiement.ts";

test("le prix s'affiche en euros, sans centimes inutiles", () => {
  assert.equal(libellePrix(1500), "15 €");
  assert.equal(libellePrix(1250), "12,50 €");
  assert.equal(libellePrix(0), "Gratuit");
});

test("le prix saisi l'emporte sur le libellé libre", () => {
  assert.equal(prixAffiche({ prix_centimes: 1500, prix_libelle: "15 € la séance" }), "15 €");
  assert.equal(prixAffiche({ prix_centimes: null, prix_libelle: "Prix libre" }), "Prix libre");
  assert.equal(prixAffiche({ prix_centimes: null, prix_libelle: "" }), "");
});

test("remboursable jusqu'à 24 h avant, pas après", () => {
  const debut = "2026-10-20T18:00:00Z";
  assert.equal(remboursable(debut, new Date("2026-10-19T17:59:00Z")), true);
  assert.equal(remboursable(debut, new Date("2026-10-19T18:00:00Z")), false);
  assert.equal(remboursable(debut, new Date("2026-10-20T12:00:00Z")), false);
});

test("la place libérée est gardée 6 h, jamais au-delà du début", () => {
  const maintenant = new Date("2026-10-20T08:00:00Z");
  assert.equal(finGardeAttente(maintenant, "2026-10-21T08:00:00Z").toISOString(), "2026-10-20T14:00:00.000Z");
  assert.equal(finGardeAttente(maintenant, "2026-10-20T11:00:00Z").toISOString(), "2026-10-20T11:00:00.000Z");
});

test("la réservation pendant le paiement dure plus que la session Stripe", () => {
  assert.ok(DELAI_RESERVATION_MIN > 31);
});

test("la session Stripe dure DUREE_SESSION_MIN quand la réservation est plus large", () => {
  const maintenant = new Date("2026-10-20T08:00:00Z");
  assert.equal(
    finSessionPaiement(maintenant, "2026-10-20T08:40:00Z").toISOString(),
    new Date(maintenant.getTime() + DUREE_SESSION_MIN * 60_000).toISOString(),
  );
});

test("la session Stripe ne dépasse pas l'expiration de la réservation si elle est plus proche", () => {
  const maintenant = new Date("2026-10-20T08:00:00Z");
  // Réservation dans 30 min 30 s : plus proche que DUREE_SESSION_MIN (31 min),
  // mais toujours au-dessus du minimum Stripe (30 min).
  assert.equal(finSessionPaiement(maintenant, "2026-10-20T08:30:30Z").toISOString(), "2026-10-20T08:30:30.000Z");
});

test("la session Stripe ne descend jamais sous le minimum de 30 minutes, même au-delà de la réservation", () => {
  const maintenant = new Date("2026-10-20T08:00:00Z");
  // Réservation dans 10 min : sous le minimum Stripe, la session dure plus
  // longtemps que la réservation (un paiement tardif se rembourse).
  assert.equal(finSessionPaiement(maintenant, "2026-10-20T08:10:00Z").toISOString(), "2026-10-20T08:30:00.000Z");
});
