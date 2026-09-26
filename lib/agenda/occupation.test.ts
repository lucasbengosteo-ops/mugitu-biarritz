import assert from "node:assert/strict";
import test from "node:test";
import { occupantALaDate } from "./occupation.ts";
import type { Absence, Exception, Voeu } from "./types.ts";

const voeu = (id: string, user: string, jour: number): Voeu => ({
  id,
  user_id: user,
  salle: "sua",
  jour,
  moment: "matin",
  statut: "valide",
  decide_par: null,
  decide_le: null,
});

const exc = (jour: string, user: string): Exception => ({
  id: `x-${jour}`,
  jour,
  salle: "sua",
  moment: "matin",
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

// Semaine du lundi 21 septembre 2026 ; le mardi est le 22.
const LUNDI = "2026-09-21";

test("sans rien, la case est libre", () => {
  const o = occupantALaDate([], [], [], "sua", 2, "matin", LUNDI);
  assert.equal(o.userId, null);
  assert.equal(o.absent, false);
  assert.equal(o.origine, "libre");
});

test("le vœu accordé tient la case", () => {
  const o = occupantALaDate([voeu("1", "u1", 2)], [], [], "sua", 2, "matin", LUNDI);
  assert.equal(o.userId, "u1");
  assert.equal(o.origine, "voeu");
});

test("une exception écrase le vœu à sa date", () => {
  const o = occupantALaDate([voeu("1", "u1", 2)], [exc("2026-09-22", "u2")], [], "sua", 2, "matin", LUNDI);
  assert.equal(o.userId, "u2");
  assert.equal(o.origine, "exception");
});

test("une exception d’une autre semaine ne change rien", () => {
  const o = occupantALaDate([voeu("1", "u1", 2)], [exc("2026-09-29", "u2")], [], "sua", 2, "matin", LUNDI);
  assert.equal(o.userId, "u1");
  assert.equal(o.origine, "voeu");
});

test("une exception d’un autre jour de la semaine ne change rien", () => {
  const o = occupantALaDate([voeu("1", "u1", 2)], [exc("2026-09-23", "u2")], [], "sua", 2, "matin", LUNDI);
  assert.equal(o.userId, "u1");
});

test("un titulaire absent garde sa case, mais l’écran le dit", () => {
  const o = occupantALaDate([voeu("1", "u1", 2)], [], [abs("u1", "2026-09-21", "2026-09-25")], "sua", 2, "matin", LUNDI);
  assert.equal(o.userId, "u1");
  assert.equal(o.absent, true);
});

test("l’absence suit l’occupant réel, pas le titulaire du vœu", () => {
  // u2 prend la case par exception, et c'est u2 qui est absent.
  const o = occupantALaDate(
    [voeu("1", "u1", 2)],
    [exc("2026-09-22", "u2")],
    [abs("u2", "2026-09-22", "2026-09-22")],
    "sua",
    2,
    "matin",
    LUNDI,
  );
  assert.equal(o.userId, "u2");
  assert.equal(o.absent, true);
});

test("un vœu seulement proposé ne tient pas la case", () => {
  const propose = { ...voeu("1", "u1", 2), statut: "propose" as const };
  const o = occupantALaDate([propose], [], [], "sua", 2, "matin", LUNDI);
  assert.equal(o.userId, null);
  assert.equal(o.origine, "libre");
});

test("un retrait demandé tient encore la case", () => {
  const retrait = { ...voeu("1", "u1", 2), statut: "retrait_demande" as const };
  const o = occupantALaDate([retrait], [], [], "sua", 2, "matin", LUNDI);
  assert.equal(o.userId, "u1");
});
