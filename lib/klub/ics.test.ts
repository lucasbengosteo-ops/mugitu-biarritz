import assert from "node:assert/strict";
import { test } from "node:test";
import { genererIcs } from "./ics.ts";

const evenement = {
  uid: "abc",
  debut: "2026-09-22T10:30:00Z",
  dureeMin: 45,
  titre: "Renfo, mobilité; cœur",
  description: "Ligne 1\nLigne 2",
  lieu: "3 avenue Kléber, 64200 Biarritz",
  url: "https://mugitu-biarritz.fr/mugi-klub",
};

test("structure et horaires en UTC", () => {
  const ics = genererIcs(evenement, new Date("2026-09-15T08:00:00Z"));
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.ok(ics.includes("UID:abc@mugitu-biarritz.fr\r\n"));
  assert.ok(ics.includes("DTSTAMP:20260915T080000Z\r\n"));
  assert.ok(ics.includes("SEQUENCE:1789459200\r\n"));
  assert.ok(ics.includes("DTSTART:20260922T103000Z\r\n"));
  assert.ok(ics.includes("DTEND:20260922T111500Z\r\n"));
  assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
});

test("échappement des caractères réservés", () => {
  const ics = genererIcs(evenement, new Date("2026-09-15T08:00:00Z"));
  assert.ok(ics.includes("SUMMARY:Renfo\\, mobilité\\; cœur\r\n"));
  assert.ok(ics.includes("DESCRIPTION:Ligne 1\\nLigne 2\r\n"));
  assert.ok(genererIcs({ ...evenement, description: "a\rb" }, new Date("2026-09-15T08:00:00Z")).includes(
    "DESCRIPTION:a\\nb\r\n",
  ));
});

test("aucune ligne ne dépasse 75 octets", () => {
  const ics = genererIcs({ ...evenement, description: "é".repeat(200) }, new Date("2026-09-15T08:00:00Z"));
  const enc = new TextEncoder();
  for (const ligne of ics.split("\r\n")) assert.ok(enc.encode(ligne).length <= 75, ligne);
  assert.ok(ics.includes("\r\n é"));
});
