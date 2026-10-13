import assert from "node:assert/strict";
import test from "node:test";
import { TYPES_INDIVIDUELS, libelleTarifs, montantReservation, preparateurs } from "./individuel.ts";

test("le montant d'une réservation, seul ou à deux", () => {
  assert.equal(montantReservation({ prix_centimes: 4000, prix_duo_centimes: 3000 }, false), 4000);
  assert.equal(montantReservation({ prix_centimes: 4000, prix_duo_centimes: 3000 }, true), 6000);
  assert.equal(montantReservation({ prix_centimes: 4000, prix_duo_centimes: null }, true), null);
  assert.equal(montantReservation({ prix_centimes: null, prix_duo_centimes: null }, false), null);
});

test("le libellé des tarifs", () => {
  assert.equal(libelleTarifs({ prix_centimes: 4000, prix_duo_centimes: 3000 }), "40 € la séance · 30 € par personne à deux");
  assert.equal(libelleTarifs({ prix_centimes: 4000, prix_duo_centimes: null }), "40 € la séance");
  assert.equal(libelleTarifs({ prix_centimes: null, prix_duo_centimes: null }), "");
});

test("les nouveaux types sont reconnus", () => {
  assert.deepEqual([...TYPES_INDIVIDUELS].sort(), ["bilan", "individuel"]);
});

test("les préparateurs : groupés par intervenant, triés par prochain créneau, tarifs du prochain individuel", () => {
  const s = (id: string, intervenant: string, type: "individuel" | "bilan", debut: string, prix: number | null = null) => ({
    id, intervenant, type, debut, prix_centimes: prix, prix_duo_centimes: prix ? 3000 : null,
  });
  const p = preparateurs([
    s("1", "Hugo Daminato", "bilan", "2026-10-20T08:00:00Z"),
    s("2", "Baptiste Caparros", "individuel", "2026-10-19T08:00:00Z", 4500),
    s("3", "Hugo Daminato", "individuel", "2026-10-21T08:00:00Z", 4000),
  ]);
  assert.deepEqual(p.map((x) => x.intervenant), ["Baptiste Caparros", "Hugo Daminato"]);
  assert.equal(p[1].seances.length, 2);
  assert.deepEqual(p[1].tarifs, { prix_centimes: 4000, prix_duo_centimes: 3000 });
});
