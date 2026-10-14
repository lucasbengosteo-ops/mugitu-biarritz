import assert from "node:assert/strict";
import test from "node:test";
import { parisVersUtc, presenceEnIcs } from "./calendrier.ts";
import type { Absence, Exception, Voeu } from "./types.ts";

const MOI = "u-moi";
const AUTRE = "u-autre";
const MAINTENANT = new Date("2026-07-01T09:00:00Z");

const voeu = (id: string, user: string, salle: string, jour: number, moment: string, statut: Voeu["statut"] = "valide"): Voeu => ({
  id,
  user_id: user,
  salle,
  jour,
  moment,
  statut,
  decide_par: null,
  decide_le: null,
});

const exc = (jour: string, salle: string, moment: string, user: string): Exception => ({
  id: `x-${jour}-${salle}-${moment}`,
  jour,
  salle,
  moment,
  user_id: user,
  echange_id: "e1",
});

const abs = (user: string, du: string, au: string): Absence => ({ id: `a-${du}`, user_id: user, du, au, motif: null });

/** Les événements du fichier, chacun en dictionnaire de ses propriétés (lignes dépliées). */
function evenements(ics: string): Record<string, string>[] {
  const deplie = ics.replace(/\r\n /g, "");
  return [...deplie.matchAll(/BEGIN:VEVENT\r\n([\s\S]*?)END:VEVENT/g)].map((m) =>
    Object.fromEntries(
      m[1]
        .split("\r\n")
        .filter(Boolean)
        .map((l) => [l.slice(0, l.indexOf(":")), l.slice(l.indexOf(":") + 1)]),
    ),
  );
}

const ics = (entree: Partial<Parameters<typeof presenceEnIcs>[0]>) =>
  presenceEnIcs({
    userId: MOI,
    voeux: [],
    exceptions: [],
    absences: [],
    depuis: "2026-07-14",
    maintenant: MAINTENANT,
    ...entree,
  });

test("en-tête du calendrier", () => {
  const texte = ics({});
  assert.match(texte, /^BEGIN:VCALENDAR\r\nVERSION:2\.0\r\nPRODID:/);
  assert.ok(texte.includes("\r\nX-WR-CALNAME:Mugitu · ma présence\r\n"));
  assert.ok(texte.includes("\r\nX-WR-TIMEZONE:Europe/Paris\r\n"));
  assert.ok(texte.endsWith("END:VCALENDAR\r\n"));
  assert.equal(evenements(texte).length, 0);
});

test("une demi-journée accordée, chaque semaine pendant 8 semaines", () => {
  const ev = evenements(ics({ voeux: [voeu("v1", MOI, "sua", 2, "matin")] }));
  assert.equal(ev.length, 8);
  assert.equal(ev[0].SUMMARY, "Sua · cabinet Mugitu");
  assert.equal(ev[0].LOCATION, "3 avenue Kléber\\, 64200 Biarritz");
  assert.equal(ev[0].UID, `agenda-${MOI}-2026-07-14-matin-sua@mugitu-biarritz.fr`);
  assert.equal(ev[0].DTSTAMP, "20260701T090000Z");
  assert.equal(ev[7].UID, `agenda-${MOI}-2026-09-01-matin-sua@mugitu-biarritz.fr`);
});

test("depuis un jeudi, le fichier part du lundi de la semaine", () => {
  const ev = evenements(ics({ voeux: [voeu("v1", MOI, "sua", 1, "aprem")], depuis: "2026-07-16", semaines: 1 }));
  assert.deepEqual(ev.map((e) => e.UID), [`agenda-${MOI}-2026-07-13-aprem-sua@mugitu-biarritz.fr`]);
});

test("un mardi de juillet est en heure d'été (UTC+2)", () => {
  const ev = evenements(
    ics({ voeux: [voeu("v1", MOI, "sua", 2, "matin"), voeu("v2", MOI, "ura", 2, "aprem")], semaines: 1 }),
  );
  assert.equal(ev.length, 2);
  assert.equal(ev[0].DTSTART, "20260714T060000Z"); // 8 h à Paris
  assert.equal(ev[0].DTEND, "20260714T120000Z"); // 14 h
  assert.equal(ev[1].DTSTART, "20260714T120000Z"); // 14 h
  assert.equal(ev[1].DTEND, "20260714T180000Z"); // 20 h
});

test("un mardi de décembre est en heure d'hiver (UTC+1)", () => {
  const ev = evenements(
    ics({
      voeux: [voeu("v1", MOI, "sua", 2, "matin"), voeu("v2", MOI, "ura", 2, "aprem")],
      depuis: "2026-12-15",
      semaines: 1,
    }),
  );
  assert.equal(ev[0].DTSTART, "20261215T070000Z");
  assert.equal(ev[0].DTEND, "20261215T130000Z");
  assert.equal(ev[1].DTSTART, "20261215T130000Z");
  assert.equal(ev[1].DTEND, "20261215T190000Z");
});

test("les jours du changement d'heure", () => {
  // Dimanche 29 mars 2026 : passage à l'heure d'été à 2 h.
  assert.equal(parisVersUtc("2026-03-28", "08:00").toISOString(), "2026-03-28T07:00:00.000Z");
  assert.equal(parisVersUtc("2026-03-29", "08:00").toISOString(), "2026-03-29T06:00:00.000Z");
  // Dimanche 25 octobre 2026 : retour à l'heure d'hiver à 3 h.
  assert.equal(parisVersUtc("2026-10-24", "20:00").toISOString(), "2026-10-24T18:00:00.000Z");
  assert.equal(parisVersUtc("2026-10-25", "08:00").toISOString(), "2026-10-25T07:00:00.000Z");
});

test("le calcul du décalage concorde avec la base des fuseaux, jour par jour", () => {
  const paris = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  for (const an of [2026, 2027, 2030]) {
    for (let t = Date.UTC(an, 0, 1); t < Date.UTC(an + 1, 0, 1); t += 86_400_000) {
      const date = new Date(t).toISOString().slice(0, 10);
      for (const heure of ["08:00", "14:00", "20:00"]) {
        const instant = parisVersUtc(date, heure);
        assert.equal(paris.format(instant), heure, `${date} ${heure}`);
        assert.equal(
          new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(instant),
          date,
          `${date} ${heure} change de jour`,
        );
      }
    }
  }
});

test("une case reçue par échange ponctuel y figure, à cette date seulement", () => {
  const ev = evenements(
    ics({
      voeux: [voeu("v1", AUTRE, "lurra", 4, "matin")],
      exceptions: [exc("2026-07-23", "lurra", "matin", MOI)],
    }),
  );
  assert.deepEqual(ev.map((e) => e.UID), [`agenda-${MOI}-2026-07-23-matin-lurra@mugitu-biarritz.fr`]);
  assert.equal(ev[0].SUMMARY, "Lurra · cabinet Mugitu");
});

test("une case cédée par échange n'y figure pas ce jour-là", () => {
  const ev = evenements(
    ics({
      voeux: [voeu("v1", MOI, "sua", 2, "matin")],
      exceptions: [exc("2026-07-21", "sua", "matin", AUTRE)],
    }),
  );
  assert.equal(ev.length, 7);
  assert.ok(!ev.some((e) => e.UID.includes("2026-07-21")));
  assert.ok(ev.some((e) => e.UID.includes("2026-07-28")));
});

test("un jour de congé n'y figure pas, bornes comprises", () => {
  const ev = evenements(
    ics({
      voeux: [voeu("v1", MOI, "sua", 2, "matin"), voeu("v2", MOI, "sua", 4, "matin")],
      absences: [abs(MOI, "2026-07-21", "2026-07-30"), abs(AUTRE, "2026-08-04", "2026-08-04")],
    }),
  );
  const dates = ev.map((e) => e.UID.slice(`agenda-${MOI}-`.length, `agenda-${MOI}-`.length + 10));
  for (const exclue of ["2026-07-21", "2026-07-23", "2026-07-28", "2026-07-30"]) assert.ok(!dates.includes(exclue), exclue);
  assert.ok(dates.includes("2026-07-16"));
  assert.ok(dates.includes("2026-08-04"), "le congé d'un autre ne retire rien");
  assert.equal(ev.length, 12);
});

test("ni les demandes en attente ni les cases des autres", () => {
  const ev = evenements(
    ics({
      voeux: [
        voeu("v1", MOI, "sua", 2, "matin", "propose"),
        voeu("v2", MOI, "ura", 3, "matin", "refuse"),
        voeu("v3", AUTRE, "etera", 5, "aprem"),
        voeu("v4", MOI, "airea", 1, "matin", "retrait_demande"),
      ],
      semaines: 1,
    }),
  );
  // Un retrait demandé ne libère rien tant qu'il n'est pas tranché.
  assert.deepEqual(ev.map((e) => e.UID), [`agenda-${MOI}-2026-07-13-matin-airea@mugitu-biarritz.fr`]);
});

test("lignes terminées par CRLF, jamais de saut de ligne nu", () => {
  const texte = ics({ voeux: [voeu("v1", MOI, "sua", 2, "matin")] });
  assert.ok(texte.endsWith("\r\n"));
  assert.ok(!/[^\r]\n/.test(texte), "saut de ligne sans retour chariot");
  assert.ok(!/\r[^\n]/.test(texte), "retour chariot isolé");
});

test("pliage à 75 octets", () => {
  const texte = ics({
    voeux: [voeu("v1", MOI, "sua", 2, "matin")],
    nomSalle: () => "Salle à l'étage, côté océan, celle où l'on reçoit les sportifs",
    semaines: 1,
  });
  const enc = new TextEncoder();
  for (const ligne of texte.split("\r\n")) assert.ok(enc.encode(ligne).length <= 75, ligne);
  assert.ok(/\r\n [^\r]/.test(texte), "aucune ligne pliée");
  assert.equal(
    evenements(texte)[0].SUMMARY,
    "Salle à l'étage\\, côté océan\\, celle où l'on reçoit les sportifs · cabinet Mugitu",
  );
});
