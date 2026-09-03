import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./supabase-config";
import { TEAM, type Practitioner } from "./team";
import { FICHES, type Fiche, type FicheChip } from "./fiches";

/**
 * Retouches éditables des pages praticien.
 *
 * Le code reste la source : `practitioner_overrides` ne fournit que des
 * valeurs de remplacement, colonne par colonne. Une colonne à `null` veut
 * dire « garder ce que dit le code ». Conséquence recherchée : si la table
 * est vide, ou si Supabase est injoignable au build, le site rend exactement
 * ce qu'il rendait avant.
 *
 * Effet de bord utile : `name`, `photo`, la position de la photo et le lien
 * de réservation étaient dupliqués entre `team.ts` et `fiches.ts` et
 * pouvaient diverger. Un même override alimente désormais les deux.
 */

export const PRACTITIONERS_REVALIDATE = 300;

export type PractitionerOverride = {
  slug: string;
  name: string | null;
  role: string | null;
  badge: string | null;
  quote: string | null;
  photo: string | null;
  photo_focus: string | null;
  booking: string | null;
  bio: string | null;
  tags: string[] | null;
  chips: FicheChip[] | null;
};

/** Les champs qu'on peut retoucher, dans l'ordre du formulaire. */
export const CHAMPS_PRATICIEN = [
  { cle: "name", label: "Nom affiché" },
  { cle: "role", label: "Intitulé court (carte d’équipe)" },
  { cle: "badge", label: "Intitulé long (fiche)" },
  { cle: "quote", label: "Citation" },
  { cle: "booking", label: "Lien de réservation" },
  { cle: "bio", label: "Résumé (survol de la carte)" },
] as const;

function vide(v: unknown): boolean {
  return v === null || v === undefined || (typeof v === "string" && v.trim() === "");
}

/** `base` sauf là où l'override dit autre chose. */
function fusionner<T extends object>(base: T, remplacements: Partial<Record<keyof T, unknown>>): T {
  const out = { ...base };
  for (const [k, v] of Object.entries(remplacements)) {
    if (!vide(v)) (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

export function appliquerTeam(o?: PractitionerOverride): Practitioner[] {
  return TEAM.map((p) => (p.slug !== o?.slug ? p : fusionner(p, {
    name: o.name, role: o.role, photo: o.photo, objectPosition: o.photo_focus,
    bio: o.bio, tags: o.tags, booking: o.booking,
  })));
}

/** Applique une table d'overrides (indexée par slug) à toute l'équipe. */
export function equipeAvecOverrides(overrides: PractitionerOverride[]): Practitioner[] {
  const parSlug = new Map(overrides.map((o) => [o.slug, o]));
  return TEAM.map((p) => {
    const o = parSlug.get(p.slug);
    return o
      ? fusionner(p, {
          name: o.name, role: o.role, photo: o.photo, objectPosition: o.photo_focus,
          bio: o.bio, tags: o.tags, booking: o.booking,
        })
      : p;
  });
}

export function ficheAvecOverride(fiche: Fiche, o?: PractitionerOverride): Fiche {
  if (!o) return fiche;
  return fusionner(fiche, {
    name: o.name, badge: o.badge, quote: o.quote, photo: o.photo,
    objectPosition: o.photo_focus, booking: o.booking,
    chips: o.chips && o.chips.length ? o.chips : null,
  });
}

export { FICHES };

async function query<T>(path: string): Promise<T[]> {
  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      next: { revalidate: PRACTITIONERS_REVALIDATE },
    });
  } catch {
    // Volontairement silencieux, contrairement aux articles : une retouche
    // indisponible doit laisser passer la page telle qu'elle est dans le
    // code, pas la faire échouer. Les fiches existent sans la base.
    return [];
  }
  if (!res.ok) return [];
  return (await res.json()) as T[];
}

export async function getOverrides(): Promise<PractitionerOverride[]> {
  return query<PractitionerOverride>("practitioner_overrides?select=*");
}

export async function getOverride(slug: string): Promise<PractitionerOverride | undefined> {
  const r = await query<PractitionerOverride>(
    `practitioner_overrides?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`,
  );
  return r[0];
}
