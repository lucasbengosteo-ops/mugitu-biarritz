import { test } from "node:test";
import assert from "node:assert/strict";
import { frequences, parSemaine, type LigneParcours } from "./statistiques.ts";

const l = (cree_le: string, x: Partial<LigneParcours> = {}): LigneParcours => ({
  id: cree_le,
  cree_le,
  motif: "douleur",
  zone: "genou",
  anciennete: null,
  sport: "surf",
  depuis: null,
  alerte: "aucune",
  source: "ia",
  suggestions: [{ metier: "kine", praticiens: ["julien-blamont"] }],
  clic_type: null,
  clic_cible: null,
  clic_le: null,
  consentement: false,
  ...x,
});

test("parSemaine regroupe par lundi, heure de Paris, et compte réservations, alertes et table fixe", () => {
  const s = parSemaine([
    l("2026-10-12T08:00:00Z", { clic_type: "reservation" }),
    l("2026-10-14T08:00:00Z", { alerte: "signe" }),
    l("2026-10-18T21:30:00Z", { source: "repli" }), // dimanche 23 h 30 à Paris : même semaine
    l("2026-10-19T08:00:00Z", { source: "regles" }),
  ]);
  assert.deepEqual(s, [
    { semaine: "2026-10-19", total: 1, reservation: 0, alerte: 0, sansIA: 1 },
    { semaine: "2026-10-12", total: 3, reservation: 1, alerte: 1, sansIA: 1 },
  ]);
});

test("frequences trie par nombre décroissant et ignore les valeurs vides", () => {
  const f = frequences([l("a", { zone: "genou" }), l("b", { zone: "dos" }), l("c", { zone: "genou" }), l("d", { zone: null })], (x) => x.zone);
  assert.deepEqual(f, [
    { valeur: "genou", nombre: 2 },
    { valeur: "dos", nombre: 1 },
  ]);
});
