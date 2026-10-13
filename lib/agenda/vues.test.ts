import assert from "node:assert/strict";
import test from "node:test";
import { casesLibres, numeroJour, presenceDuJour, semaineDePersonne } from "./vues.ts";
import type { Absence, Exception, Voeu } from "./types.ts";

const voeu = (
  id: string,
  user: string,
  salle: string,
  jour: number,
  moment: string,
  statut: Voeu["statut"] = "valide",
): Voeu => ({
  id,
  user_id: user,
  salle,
  jour,
  moment,
  statut,
  decide_par: null,
  decide_le: null,
});

const exc = (jourDate: string, salle: string, moment: string, user: string): Exception => ({
  id: `x-${jourDate}-${salle}-${moment}`,
  jour: jourDate,
  salle,
  moment,
  user_id: user,
  echange_id: null,
});

const abs = (user: string, du: string, au: string): Absence => ({
  id: `a-${user}-${du}`,
  user_id: user,
  du,
  au,
  motif: null,
});

// Semaine du lundi 21 septembre 2026 ; le mardi est le 22, le dimanche le 27.
const LUNDI = "2026-09-21";

test("numeroJour : 1 = lundi … 7 = dimanche", () => {
  assert.equal(numeroJour("2026-09-21"), 1);
  assert.equal(numeroJour("2026-09-22"), 2);
  assert.equal(numeroJour("2026-09-27"), 7);
});

test("presenceDuJour : une case tenue par un vœu apparaît avec son occupant", () => {
  const voeux = [voeu("1", "u1", "sua", 2, "matin")];
  const r = presenceDuJour(voeux, [], [], "2026-09-22");
  const c = r.cases.find((x) => x.salle === "sua" && x.moment === "matin");
  assert.equal(c?.userId, "u1");
  assert.equal(c?.origine, "voeu");
  assert.equal(c?.absent, false);
});

test("presenceDuJour : une exception remplace l'occupant du jour", () => {
  const voeux = [voeu("1", "u1", "sua", 2, "matin")];
  const exceptions = [exc("2026-09-22", "sua", "matin", "u2")];
  const r = presenceDuJour(voeux, exceptions, [], "2026-09-22");
  const c = r.cases.find((x) => x.salle === "sua" && x.moment === "matin");
  assert.equal(c?.userId, "u2");
  assert.equal(c?.origine, "exception");
});

test("presenceDuJour : un congé marque absent sans libérer la case", () => {
  const voeux = [voeu("1", "u1", "sua", 2, "matin")];
  const absences = [abs("u1", "2026-09-22", "2026-09-22")];
  const r = presenceDuJour(voeux, [], absences, "2026-09-22");
  const c = r.cases.find((x) => x.salle === "sua" && x.moment === "matin");
  assert.equal(c?.userId, "u1");
  assert.equal(c?.absent, true);
});

test("presenceDuJour : couvre bien les 5 salles × 2 moments", () => {
  const r = presenceDuJour([], [], [], "2026-09-22");
  assert.equal(r.cases.length, 10);
});

test("presenceDuJour : absents liste qui tient une case de la semaine type et est en congé ce jour-là", () => {
  const voeux = [voeu("1", "u1", "sua", 2, "matin")];
  const absences = [abs("u1", "2026-09-22", "2026-09-22")];
  const r = presenceDuJour(voeux, [], absences, "2026-09-22");
  assert.deepEqual(r.absents, ["u1"]);
});

test("presenceDuJour : absents ignore un congé sans aucune case tenue dans la semaine type", () => {
  // u2 n'a aucun vœu : il n'a rien à « tenir », donc il n'apparaît pas en absent du cabinet.
  const voeux = [voeu("1", "u1", "sua", 2, "matin")];
  const absences = [abs("u2", "2026-09-22", "2026-09-22")];
  const r = presenceDuJour(voeux, [], absences, "2026-09-22");
  assert.deepEqual(r.absents, []);
});

test("semaineDePersonne : place la personne au bon jour et au bon moment", () => {
  const voeux = [voeu("1", "u1", "sua", 2, "matin"), voeu("2", "u1", "ura", 2, "aprem")];
  const r = semaineDePersonne("u1", voeux, [], [], LUNDI);
  assert.equal(r.length, 7);
  const mardi = r.find((j) => j.jour === 2);
  assert.deepEqual(mardi?.matin, { salle: "sua", origine: "voeu" });
  assert.deepEqual(mardi?.aprem, { salle: "ura", origine: "voeu" });
  assert.equal(mardi?.date, "2026-09-22");
  const lundi = r.find((j) => j.jour === 1);
  assert.equal(lundi?.matin, null);
  assert.equal(lundi?.aprem, null);
});

test("semaineDePersonne : une exception reçue apparaît pour cette personne", () => {
  const voeux = [voeu("1", "u1", "sua", 2, "matin")];
  const exceptions = [exc("2026-09-22", "sua", "matin", "u2")];
  const r = semaineDePersonne("u2", voeux, exceptions, [], LUNDI);
  const mardi = r.find((j) => j.jour === 2);
  assert.deepEqual(mardi?.matin, { salle: "sua", origine: "exception" });
});

test("semaineDePersonne : marque absent le jour du congé", () => {
  const voeux = [voeu("1", "u1", "sua", 2, "matin")];
  const absences = [abs("u1", "2026-09-22", "2026-09-22")];
  const r = semaineDePersonne("u1", voeux, [], absences, LUNDI);
  const mardi = r.find((j) => j.jour === 2);
  assert.equal(mardi?.absent, true);
  const mercredi = r.find((j) => j.jour === 3);
  assert.equal(mercredi?.absent, false);
});

test("casesLibres : une case sans occupant est libre, sans demande", () => {
  const r = casesLibres([], [], [], LUNDI);
  // 5 salles × 2 moments × 7 jours, tout est libre.
  assert.equal(r.length, 70);
  assert.ok(r.every((c) => c.demandes === 0));
});

test("casesLibres : une case tenue n'apparaît pas", () => {
  const voeux = [voeu("1", "u1", "sua", 2, "matin")];
  const r = casesLibres(voeux, [], [], LUNDI);
  assert.equal(r.length, 69);
  assert.equal(
    r.find((c) => c.salle === "sua" && c.jour === 2 && c.moment === "matin"),
    undefined,
  );
});

test("casesLibres : une case libre avec une demande en attente compte sa demande", () => {
  const voeux = [voeu("1", "u1", "sua", 2, "matin", "propose")];
  const r = casesLibres(voeux, [], [], LUNDI);
  const libre = r.find((c) => c.salle === "sua" && c.jour === 2 && c.moment === "matin");
  assert.equal(libre?.demandes, 1);
});

test("casesLibres : porte la date de la bonne semaine", () => {
  const r = casesLibres([], [], [], LUNDI);
  const dimanche = r.find((c) => c.jour === 7 && c.salle === "sua" && c.moment === "matin");
  assert.equal(dimanche?.date, "2026-09-27");
});
