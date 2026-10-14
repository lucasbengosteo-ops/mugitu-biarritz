import { construireCarte, POURQUOI_DEFAUT } from "./cartes.ts";
import type { Catalogue } from "./catalogue.ts";
import { normaliser } from "./regles.ts";
import {
  ANCIENNETES,
  METIER_IDS,
  MOTIFS,
  SPORTS_CHOIX,
  TEXTE_MAX,
  ZONES,
  type Carte,
  type MetierId,
  type Reponses,
} from "./types.ts";

const dans = <T extends string>(liste: readonly { id: T }[], v: unknown): v is T =>
  typeof v === "string" && liste.some((x) => x.id === v);

/** Lit le corps de `POST /api/orientation`. Null si quelque chose ne va pas. */
export function lireReponses(b: unknown): Reponses | null {
  if (!b || typeof b !== "object") return null;
  const o = b as Record<string, unknown>;
  if (!dans(MOTIFS, o.motif)) return null;
  const zone = o.zone ?? null;
  const anciennete = o.anciennete ?? null;
  const sport = o.sport ?? null;
  if (zone !== null && !dans(ZONES, zone)) return null;
  if (anciennete !== null && !dans(ANCIENNETES, anciennete)) return null;
  if (sport !== null && !dans(SPORTS_CHOIX, sport)) return null;
  const depuis = typeof o.depuis === "string" && /^[a-z0-9-]{1,80}$/.test(o.depuis) ? o.depuis : null;
  return {
    motif: o.motif,
    zone: zone as Reponses["zone"],
    anciennete: anciennete as Reponses["anciennete"],
    sport: sport as Reponses["sport"],
    signes: o.signes === true,
    texte: typeof o.texte === "string" ? o.texte.trim().slice(0, TEXTE_MAX) : "",
    depuis,
    consentement: o.consentement === true,
  };
}

export type SuggestionIA = { metier: string; praticiens: string[]; methodes: string[]; pages: string[]; pourquoi: string };
export type ReponseIA = { alerte: boolean; suggestions: SuggestionIA[] };

const chaines = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

/** Lit le texte renvoyé par Mistral. Null si ce n'est pas la forme attendue. */
export function lireReponseIA(brut: string): ReponseIA | null {
  let o: unknown;
  try {
    o = JSON.parse(brut);
  } catch {
    return null;
  }
  if (!o || typeof o !== "object") return null;
  const r = o as Record<string, unknown>;
  if (!Array.isArray(r.suggestions)) return null;
  return {
    alerte: r.alerte === true,
    suggestions: r.suggestions
      .filter((s): s is Record<string, unknown> => !!s && typeof s === "object")
      .map((s) => ({
        metier: typeof s.metier === "string" ? s.metier : "",
        praticiens: chaines(s.praticiens),
        methodes: chaines(s.methodes),
        pages: chaines(s.pages),
        pourquoi: typeof s.pourquoi === "string" ? s.pourquoi : "",
      })),
  };
}

/** Ce que la phrase « pourquoi » ne doit jamais dire. */
const INTERDITS = [
  "diagnostic",
  "vous avez un",
  "vous avez une",
  "vous souffrez",
  "il s'agit d'un",
  "il s'agit d'une",
  "probablement",
  "certainement",
  "medicament",
  "ibuprof",
  "paracetamol",
  "doliprane",
  "advil",
  "anti-inflammatoire",
  "antalgique",
  "cortico",
  "pommade",
  "glace",
  "repos complet",
  // La personne plutôt que la discipline : la phrase prendrait un genre.
  "le medecin",
  "un medecin",
  "ce medecin",
  "ce kine",
  "ce praticien",
  "cette praticienne",
  "ce professionnel",
  "cette professionnelle",
  "ce specialiste",
];

/** Méthodes réservées à certains sports. */
const METHODES_PAR_SPORT: Record<string, string[]> = {
  "clinique-du-coureur": ["trail-et-course"],
};

function pourquoiSur(p: string, metier: MetierId): string {
  const t = p.replace(/\s+/g, " ").trim();
  if (!t) return POURQUOI_DEFAUT[metier];
  const n = normaliser(t).replace(/’/g, "'");
  if (INTERDITS.some((m) => n.includes(m))) return POURQUOI_DEFAUT[metier];
  // Écriture inclusive (« un·e diététicien·ne ») : on veut une phrase sans marque de genre.
  if (t.includes("·")) return POURQUOI_DEFAUT[metier];
  return t.length > 300 ? `${t.slice(0, 297).trimEnd()}…` : t;
}

/** Au plus deux méthodes par carte quand c'est l'IA qui choisit. */
const METHODES_MAX_IA = 2;

const estMetier = (m: string): m is MetierId => (METIER_IDS as readonly string[]).includes(m);

/** Ne garde que ce que le catalogue connaît ; trois cartes au plus. */
export function valider(r: ReponseIA, cat: Catalogue, sport: string | null = null): { alerte: boolean; cartes: Carte[] } {
  const cartes: Carte[] = [];
  const vus = new Set<string>();
  for (const s of r.suggestions) {
    if (cartes.length === 3) break;
    if (!estMetier(s.metier) || vus.has(s.metier)) continue;
    // L'IA ne propose jamais d'acte médical, et deux méthodes au plus : au-delà,
    // elle en cite qui ne répondent pas à la situation.
    const methodes = s.methodes.filter(
      (m) => cat.methodes[m] && !cat.methodes[m].acteMedical && (!METHODES_PAR_SPORT[m] || (sport !== null && METHODES_PAR_SPORT[m].includes(sport))),
    );
    const carte = construireCarte(cat, s.metier, { ...s, methodes }, pourquoiSur(s.pourquoi, s.metier));
    if (!carte) continue;
    carte.methodes = carte.methodes.slice(0, METHODES_MAX_IA);
    vus.add(s.metier);
    cartes.push(carte);
  }
  return { alerte: r.alerte, cartes };
}
