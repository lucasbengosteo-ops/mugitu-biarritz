/**
 * Fichier agenda joint aux mails de confirmation (RFC 5545). Les heures sont
 * écrites en UTC : chaque agenda les affiche dans le fuseau de son utilisateur.
 */

export type EvenementIcs = {
  uid: string;
  debut: string;
  dureeMin: number;
  titre: string;
  description: string;
  lieu: string;
  url: string;
};

const horodatage = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const echapper = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Coupe une ligne à 75 octets ; les lignes de suite commencent par une espace. */
function plier(ligne: string): string {
  const enc = new TextEncoder();
  const lignes: string[] = [];
  let courant = "";
  let octets = 0;
  for (const car of ligne) {
    const n = enc.encode(car).length;
    const limite = lignes.length === 0 ? 75 : 74;
    if (octets + n > limite) {
      lignes.push(courant);
      courant = "";
      octets = 0;
    }
    courant += car;
    octets += n;
  }
  lignes.push(courant);
  return lignes.join("\r\n ");
}

export function genererIcs(e: EvenementIcs, maintenant: Date = new Date()): string {
  const debut = new Date(e.debut);
  const fin = new Date(debut.getTime() + e.dureeMin * 60_000);
  const lignes = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mugitu Biarritz//Mugi Klub//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.uid}@mugitu-biarritz.fr`,
    `DTSTAMP:${horodatage(maintenant)}`,
    `DTSTART:${horodatage(debut)}`,
    `DTEND:${horodatage(fin)}`,
    `SUMMARY:${echapper(e.titre)}`,
    `DESCRIPTION:${echapper(e.description)}`,
    `LOCATION:${echapper(e.lieu)}`,
    `URL:${e.url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lignes.map(plier).join("\r\n") + "\r\n";
}
