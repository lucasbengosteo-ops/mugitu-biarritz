import { normaliser } from "../orientation/regles.ts";
import { QUESTION_MAX, TYPES_REPONSE, type Echange, type Passage, type Question, type Source, type TypeReponse } from "./types.ts";

const CHEMIN = /^\/[a-zA-Z0-9/_\-.?=&#]{0,200}$/;

/** Le corps de `POST /api/aide/question`. Null si quelque chose ne va pas. */
export function lireQuestion(b: unknown): Question | null {
  if (!b || typeof b !== "object") return null;
  const o = b as Record<string, unknown>;
  const texte = typeof o.texte === "string" ? o.texte.trim().slice(0, QUESTION_MAX) : "";
  if (!texte) return null;
  const historique: Echange[] = Array.isArray(o.historique)
    ? o.historique
        .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
        .map((e) => ({
          question: typeof e.question === "string" ? e.question.slice(0, QUESTION_MAX) : "",
          reponse: typeof e.reponse === "string" ? e.reponse.slice(0, 700) : "",
        }))
        .filter((e) => e.question && e.reponse)
        .slice(-2)
    : [];
  return {
    texte,
    consentement: o.consentement === true,
    page: typeof o.page === "string" && CHEMIN.test(o.page) ? o.page : "/",
    historique,
  };
}

export type ReponseIA = { type: TypeReponse; texte: string; sources: string[] };

/** Le texte renvoyé par Mistral. Null si ce n'est pas la forme attendue. */
export function lireReponseIA(brut: string): ReponseIA | null {
  let o: unknown;
  try {
    o = JSON.parse(brut);
  } catch {
    return null;
  }
  if (!o || typeof o !== "object") return null;
  const r = o as Record<string, unknown>;
  const type = r.type;
  if (typeof type !== "string" || !["reponse", "inconnu", "medical", "orientation"].includes(type)) return null;
  return {
    type: type as TypeReponse,
    texte: typeof r.texte === "string" ? r.texte : "",
    sources: Array.isArray(r.sources) ? r.sources.filter((s): s is string => typeof s === "string") : [],
  };
}

/** Ce que la réponse ne doit jamais dire : avis médical, médicament. */
const INTERDITS = [
  "diagnostic",
  "vous avez un",
  "vous avez une",
  "vous souffrez",
  "medicament",
  "ibuprof",
  "paracetamol",
  "doliprane",
  "anti-inflammatoire",
  "antalgique",
  "glace",
];

export const TEXTE_REPONSE_MAX = 600;

export const TEXTE_INCONNU =
  "Je n’ai pas cette information. Vous pouvez écrire au cabinet, l’équipe vous répondra.";
export const TEXTE_MEDICAL =
  "Je ne peux pas donner d’avis médical. Je peux vous aider à trouver qui consulter au cabinet.";

export const SOURCES_INCONNU: Source[] = [
  { titre: "Questions fréquentes", lien: "/faq" },
  { titre: "Nous contacter", lien: "/contact" },
];

/** Ne garde que ce que le corpus connaît ; une réponse sans source valide devient « inconnu ». */
export function validerReponse(r: ReponseIA, corpus: Passage[]): { type: TypeReponse; texte: string; sources: Source[] } {
  if (r.type === "medical") return { type: "medical", texte: TEXTE_MEDICAL, sources: [] };
  if (r.type === "orientation") return { type: "orientation", texte: TEXTE_MEDICAL, sources: [] };
  const inconnu = { type: "inconnu" as const, texte: TEXTE_INCONNU, sources: SOURCES_INCONNU };
  if (r.type !== "reponse") return inconnu;

  const parId = new Map(corpus.map((p) => [p.id, p]));
  const vus = new Set<string>();
  const sources: Source[] = [];
  for (const id of r.sources) {
    const p = parId.get(id);
    if (!p || vus.has(p.lien)) continue;
    vus.add(p.lien);
    sources.push({ titre: p.titre.split(" — ")[0], lien: p.lien });
  }
  const texte = r.texte.replace(/\s+/g, " ").trim();
  const n = normaliser(texte).replace(/’/g, "'");
  if (sources.length === 0 || !texte || texte.length > TEXTE_REPONSE_MAX || texte.includes("·") || INTERDITS.some((m) => n.includes(m))) {
    return inconnu;
  }
  return { type: "reponse", texte, sources: sources.slice(0, 3) };
}

export const estType = (t: string): t is TypeReponse => (TYPES_REPONSE as readonly string[]).includes(t);
