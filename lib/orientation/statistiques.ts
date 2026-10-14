/** Agrégats de la page « Par où commencer » du back-office. Sans import. */

export type LigneParcours = {
  id: string;
  cree_le: string;
  motif: string;
  zone: string | null;
  anciennete: string | null;
  sport: string | null;
  depuis: string | null;
  alerte: string;
  source: string;
  suggestions: { metier: string; praticiens: string[] }[];
  clic_type: string | null;
  clic_cible: string | null;
  clic_le: string | null;
  consentement: boolean;
};

export type Semaine = { semaine: string; total: number; reservation: number; alerte: number; sansIA: number };

/** Le lundi (AAAA-MM-JJ) de la semaine d'un instant, à l'heure de Paris. */
export function lundiParis(iso: string): string {
  const jour = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date(iso));
  const d = new Date(`${jour}T12:00:00Z`);
  const decalage = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - decalage);
  return d.toISOString().slice(0, 10);
}

/** Semaine par semaine, la plus récente d'abord. */
export function parSemaine(lignes: LigneParcours[]): Semaine[] {
  const m = new Map<string, Semaine>();
  for (const x of lignes) {
    const k = lundiParis(x.cree_le);
    const s = m.get(k) ?? { semaine: k, total: 0, reservation: 0, alerte: 0, sansIA: 0 };
    s.total++;
    if (x.clic_type === "reservation") s.reservation++;
    if (x.alerte !== "aucune") s.alerte++;
    if (x.source !== "ia") s.sansIA++;
    m.set(k, s);
  }
  return [...m.values()].sort((a, b) => b.semaine.localeCompare(a.semaine));
}

export function frequences(
  lignes: LigneParcours[],
  cle: (l: LigneParcours) => string | null,
): { valeur: string; nombre: number }[] {
  const m = new Map<string, number>();
  for (const x of lignes) {
    const v = cle(x);
    if (v) m.set(v, (m.get(v) ?? 0) + 1);
  }
  return [...m.entries()].map(([valeur, nombre]) => ({ valeur, nombre })).sort((a, b) => b.nombre - a.nombre || a.valeur.localeCompare(b.valeur));
}
