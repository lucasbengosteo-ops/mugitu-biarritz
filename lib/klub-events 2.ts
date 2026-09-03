import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./supabase-config";

/**
 * Programme du Mugi Klub, éditable depuis /admin/mugi-klub.
 *
 * Le planning est rendu **côté serveur en HTML**, avec exactement le même
 * balisage que la maquette d'origine : `components/site/MugiKlubPlanning.tsx`
 * pilote ensuite ce DOM (filtres, onglets de jour, navigation de semaine,
 * modale). Générer le balisage plutôt que réécrire le composant évite de
 * retoucher 330 lignes de logique client qui fonctionnent déjà.
 */

export const KLUB_REVALIDATE = 300;

export type KlubEvent = {
  id: string;
  /** 1 = lundi … 7 = dimanche. */
  jour: number;
  /** `HH:MM:SS` renvoyé par Postgres. */
  heure: string;
  type: "small" | "atelier" | "conf" | "soiree";
  titre: string;
  intervenant: string;
  duree_min: number | null;
  /** Libellé libre : « 3 places », « Accès Klub », « Ouvert ». */
  places: string;
  description: string;
  lien: string;
  actif: boolean;
};

export const KLUB_JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"] as const;

export const KLUB_TYPES = [
  { value: "small", label: "Small group" },
  { value: "atelier", label: "Atelier" },
  { value: "conf", label: "Conférence" },
  { value: "soiree", label: "Soirée" },
] as const;

/** Habillage de chaque type, repris à l'identique de la maquette. */
const STYLE = {
  small: { bg: "#fff", bord: "#04A49B", texte: "#003850", meta: "rgba(51,51,52,.55)", label: "Small group", accent: "#04A49B", cta: "#04A49B" },
  atelier: { bg: "#fff", bord: "#d49a40", texte: "#003850", meta: "rgba(51,51,52,.55)", label: "Atelier", accent: "#d49a40", cta: "#04A49B" },
  conf: { bg: "#003850", bord: "#F3BE79", texte: "#fff", meta: "rgba(255,255,255,.6)", label: "Conférence", accent: "#F3BE79", cta: "#fff" },
  soiree: { bg: "#fff", bord: "#EE806C", texte: "#003850", meta: "rgba(51,51,52,.55)", label: "Soirée", accent: "#EE806C", cta: "#04A49B" },
} as const;

/**
 * Le libellé du bouton suit la nature de la place, pas le type de séance :
 * un nombre de places se réserve, un accès ouvert se rejoint. La maquette
 * faisait déjà cette distinction — « Afterwork » (Ouvert) affichait
 * « S’inscrire » là où « Récup & Sauna » (8 places) affichait « Réserver ».
 */
function libelleCta(places: string): string {
  return /\d\s*place/i.test(places) ? "Réserver" : "S’inscrire";
}

function echappe(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** `07:30:00` → `07:30`. */
function heureCourte(h: string): string {
  return h.slice(0, 5);
}

/**
 * Couleur du libellé de places : rouge quand il ne reste presque rien, doré
 * sur les cartes sombres, vert sinon. Même règle que la modale.
 */
function couleurPlaces(places: string, type: KlubEvent["type"]): string {
  if (type === "conf") return "#F3BE79";
  if (/^[12] place/.test(places)) return "#C2410C";
  return "#1F8A5B";
}

function carte(e: KlubEvent): string {
  const s = STYLE[e.type];
  const ombre = e.type === "conf" ? "rgba(60,40,30,.1)" : "rgba(60,40,30,.06)";
  const meta = [e.intervenant, e.duree_min ? `${e.duree_min} min` : ""].filter(Boolean).join(" · ");
  // data-desc : la modale lisait jusqu'ici un dictionnaire figé côté client.
  return `<article class="mk-sess" data-type="${e.type}" data-desc="${echappe(e.description)}" style="border-radius:var(--r-m);background:${s.bg};box-shadow:0 3px 16px ${ombre};border-left:3px solid ${s.bord};padding:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;"><span style="font-size:14px;font-weight:700;color:${s.texte};">${heureCourte(e.heure)}</span><span style="font-size:10px;font-weight:600;letter-spacing:var(--ls-label);text-transform:uppercase;color:${s.accent};">${s.label}</span></div>
        <h3 style="margin:0 0 5px;font-size:var(--h3-s);font-weight:600;color:${s.texte};line-height:1.25;">${echappe(e.titre)}</h3>
        <p style="margin:0 0 10px;font-size:12px;color:${s.meta};">${echappe(meta)}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;"><span style="font-size:11px;color:${couleurPlaces(e.places, e.type)};font-weight:600;">${echappe(e.places)}</span><a href="${echappe(e.lien)}" target="_blank" rel="noopener noreferrer" style="font-size:12px;font-weight:600;color:${s.cta};text-decoration:none;">${libelleCta(e.places)} →</a></div>
      </article>`;
}

/**
 * Les six colonnes de jour de `#mk-grid`. Les dates affichées dans les
 * en-têtes sont réécrites côté client à chaque changement de semaine : on ne
 * pose ici qu'un gabarit.
 */
export function renderColonnes(events: KlubEvent[]): string {
  return KLUB_JOURS.map((nom, i) => {
    const duJour = events
      .filter((e) => e.jour === i + 1)
      .sort((a, b) => a.heure.localeCompare(b.heure))
      .map(carte)
      .join("\n      ");
    return `<!-- ${nom.toUpperCase()} -->
    <div class="mk-day" style="display:flex;flex-direction:column;gap:12px;">
      <div style="display:flex;align-items:baseline;gap:8px;padding:0 4px 10px;border-bottom:2px solid rgba(0,56,80,.1);"><span style="font-size:16px;font-weight:700;color:#003850;">${nom}</span><span style="font-size:12px;color:rgba(51,51,52,.45);"></span></div>
      ${duJour}
    </div>`;
  }).join("\n\n    ");
}

async function query<T>(path: string): Promise<T[]> {
  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      next: { revalidate: KLUB_REVALIDATE },
    });
  } catch (cause) {
    throw new Error(`[klub] Supabase injoignable (${path})`, { cause });
  }
  if (!res.ok) throw new Error(`[klub] Supabase a répondu ${res.status} (${path})`);
  return (await res.json()) as T[];
}

/** Le programme affiché publiquement, trié pour le rendu. */
export async function getKlubEvents(): Promise<KlubEvent[]> {
  return query<KlubEvent>("klub_events?select=*&actif=eq.true&order=jour.asc,heure.asc");
}
