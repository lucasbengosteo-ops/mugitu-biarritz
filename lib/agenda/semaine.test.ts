import assert from "node:assert/strict";
import test from "node:test";
import {
  absentLe,
  dateDuJour,
  decalerSemaine,
  libelleSemaine,
  lundiDe,
  personnesAbsentes,
} from "./semaine.ts";

const abs = (user: string, du: string, au: string) => ({ id: `${user}-${du}`, user_id: user, du, au, motif: null });

test("lundiDe ramène au lundi de la semaine", () => {
  // 2026-09-26 est un samedi ; son lundi est le 21.
  assert.equal(lundiDe("2026-09-26"), "2026-09-21");
  assert.equal(lundiDe("2026-09-21"), "2026-09-21");
  // Un dimanche appartient à la semaine qui commence la veille.
  assert.equal(lundiDe("2026-09-27"), "2026-09-21");
});

test("dateDuJour projette un jour de 1 à 5 sur une date", () => {
  assert.equal(dateDuJour("2026-09-21", 1), "2026-09-21");
  assert.equal(dateDuJour("2026-09-21", 5), "2026-09-25");
});

test("dateDuJour franchit un changement de mois", () => {
  assert.equal(dateDuJour("2026-09-28", 5), "2026-10-02");
});

test("absentLe couvre les bornes de la plage", () => {
  const a = [abs("u1", "2026-07-13", "2026-07-26")];
  assert.equal(absentLe(a, "u1", "2026-07-13"), true);
  assert.equal(absentLe(a, "u1", "2026-07-26"), true);
  assert.equal(absentLe(a, "u1", "2026-07-20"), true);
  assert.equal(absentLe(a, "u1", "2026-07-12"), false);
  assert.equal(absentLe(a, "u1", "2026-07-27"), false);
});

test("absentLe ne confond pas deux personnes", () => {
  const a = [abs("u1", "2026-07-13", "2026-07-26")];
  assert.equal(absentLe(a, "u2", "2026-07-20"), false);
});

test("des plages qui se chevauchent ne cassent rien", () => {
  const a = [abs("u1", "2026-08-03", "2026-08-16"), abs("u1", "2026-08-10", "2026-08-20")];
  assert.equal(absentLe(a, "u1", "2026-08-18"), true);
  assert.equal(absentLe(a, "u1", "2026-08-21"), false);
});

test("personnesAbsentes liste qui manque dans la semaine", () => {
  const a = [abs("u1", "2026-09-23", "2026-09-23"), abs("u2", "2026-10-05", "2026-10-09")];
  assert.deepEqual(personnesAbsentes(a, "2026-09-21"), ["u1"]);
  assert.deepEqual(personnesAbsentes(a, "2026-10-05"), ["u2"]);
  assert.deepEqual(personnesAbsentes(a, "2026-11-02"), []);
});

test("decalerSemaine avance et recule d’un multiple de sept jours", () => {
  assert.equal(decalerSemaine("2026-09-21", 1), "2026-09-28");
  assert.equal(decalerSemaine("2026-09-21", -1), "2026-09-14");
  assert.equal(decalerSemaine("2026-09-21", 0), "2026-09-21");
  // Franchir un changement de mois et une heure d’été.
  assert.equal(decalerSemaine("2026-10-26", 1), "2026-11-02");
});

test("libelleSemaine nomme la semaine sans ambiguïté", () => {
  assert.equal(libelleSemaine("2026-09-21"), "21 – 25 septembre 2026");
  assert.equal(libelleSemaine("2026-09-28"), "28 septembre – 2 octobre 2026");
});
