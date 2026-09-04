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
  contact: Coordonnees | null;
  specialites: string[] | null;
  langues: string[] | null;
  formations: Formation[] | null;
  tarifs: Tarif[] | null;
  tarifs_titre: string | null;
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
  const f = fusionner(fiche, {
    name: o.name, badge: o.badge, quote: o.quote, photo: o.photo,
    objectPosition: o.photo_focus, booking: o.booking,
    chips: o.chips && o.chips.length ? o.chips : null,
  });

  // Chaque section n'est régénérée que si la base en porte une version.
  let main = f.mainHtml;
  if (o.formations?.length) main = remplacerSection(main, "parcours", renderFormations(o.formations));
  if (o.tarifs?.length) main = remplacerSection(main, "tarifs", renderTarifs(o.tarifs, o.tarifs_titre ?? "Tarifs"));

  let rail = f.railHtml;
  if (o.contact && Object.keys(o.contact).length) {
    rail = rail.replace(
      /<p style="margin:0;font-size:12px;line-height:1\.5;color:rgba\(51,51,52,\.62\);"><strong[^>]*>Contact<\/strong>[\s\S]*?<\/p>/,
      renderContactRail(o.contact),
    );
  }
  if (o.specialites?.length) {
    rail = rail.replace(
      /<p style="margin:0;font-size:12px;line-height:1\.5;color:rgba\(51,51,52,\.62\);"><strong[^>]*>Spécialités<\/strong>[\s\S]*?<\/p>/,
      renderSpecialites(o.specialites),
    );
  }

  // Les langues vivent dans les puces du hero, aux côtés des lieux.
  const chips = o.langues?.length
    ? [...f.chips.filter((c) => c.icon !== "languages"), { icon: "languages", text: o.langues.join(" · ") }]
    : f.chips;

  return { ...f, mainHtml: main, railHtml: rail, chips };
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

/* ══════════════════════════════════════════════════════════════════════
   RENDU DES SECTIONS RETOUCHÉES

   Une section n'est régénérée que si la base porte une valeur pour elle.
   Sinon le HTML d'origine de `fiches.ts` passe intact : la régression
   possible est prise section par section, à la première retouche.
   ══════════════════════════════════════════════════════════════════════ */

import type { Coordonnees, Formation, Tarif } from "./fiches-data";

function ech(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Remplace `<section id="x">…</section>` dans un corps de fiche. */
export function remplacerSection(html: string, id: string, nouveau: string): string {
  const re = new RegExp(`<section id="${id}"[\\s\\S]*?</section>`);
  return re.test(html) ? html.replace(re, nouveau) : html;
}

const BRICOLAGE = "font-family:'Bricolage Grotesque','Helvetica Neue',Helvetica,Arial,sans-serif;";

export function renderFormations(items: Formation[]): string {
  const ligne = (f: Formation) =>
        `<div style="display:flex;gap:16px;align-items:baseline;padding:16px 0;border-bottom:1px solid rgba(0,56,80,.1);">` +
        `<span style="${BRICOLAGE}flex:0 0 auto;min-width:52px;font-size:15px;font-weight:700;color:#04A49B;font-variant-numeric:tabular-nums;">${ech(f.annee)}</span>` +
        `<span style="font-size:15px;line-height:1.5;color:#003850;font-weight:600;">${ech(f.intitule)}</span></div>`;

  // Les lignes se suivent par groupe : un intertitre ouvre chaque groupe
  // nommé. Sans cela, deux listes distinctes seraient fusionnées en une.
  const groupes: { titre: string; items: Formation[] }[] = [];
  for (const f of items) {
    const dernier = groupes[groupes.length - 1];
    if (dernier && dernier.titre === f.groupe) dernier.items.push(f);
    else groupes.push({ titre: f.groupe, items: [f] });
  }
  const lignes = groupes
    .map((g) =>
      (g.titre
        ? `<p style="margin:30px 0 12px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.5);">${ech(g.titre)}</p><div style="display:flex;flex-direction:column;gap:2px;">`
        : "") +
      g.items.map(ligne).join("") +
      (g.titre ? "</div>" : ""),
    )
    .join("");
  return `<section id="parcours" style="scroll-margin-top:120px;padding:var(--sect-xtight) 0 0;">
  <p style="margin:0 0 6px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Parcours</p>
  <h2 style="${BRICOLAGE}margin:0 0 24px;font-size:var(--h2-m);font-weight:700;letter-spacing:-.025em;color:#003850;">Diplômes &amp; formations</h2>
  <div style="display:flex;flex-direction:column;gap:2px;">${lignes}</div>
</section>`;
}

export function renderTarifs(items: Tarif[], titre = "Tarifs"): string {
  const cartes = items
    .map((t) => {
      const prix = t.prix
        ? `<span style="${BRICOLAGE}flex:0 0 auto;font-size:18px;font-weight:800;color:#04A49B;white-space:nowrap;">${ech(t.prix)}</span>`
        : "";
      const mention = t.mention
        ? `<p style="margin:0 0 12px;font-size:12px;font-weight:600;letter-spacing:var(--ls-label);text-transform:uppercase;color:rgba(51,51,52,.45);">${ech(t.mention)}</p>`
        : "";
      const lien = t.lien
        ? `<a href="${ech(t.lien)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 18px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:13px;font-weight:600;text-decoration:none;">Réserver ↗</a>`
        : "";
      return (
        `<div style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;">` +
        `<div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:8px;">` +
        `<h3 style="${BRICOLAGE}margin:0;font-size:var(--h3-m);font-weight:700;color:#003850;letter-spacing:-.01em;">${ech(t.titre)}</h3>${prix}</div>` +
        mention +
        `<p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:rgba(51,51,52,.7);flex:1;">${ech(t.texte)}</p>${lien}</div>`
      );
    })
    .join("");
  return `<section id="tarifs" style="scroll-margin-top:120px;margin:clamp(32px,4vw,44px) 0 0;padding:clamp(32px,4vw,44px);border-radius:var(--r-l);background:#F5EDE4;">
  <div style="margin-bottom:26px;"><p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Réserver</p><h2 style="${BRICOLAGE}margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">${ech(titre)}</h2></div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;">${cartes}
  </div>
</section>`;
}

/** Bloc « Contact » du rail : téléphone, e-mail, réseaux. */
export function renderContactRail(c: Coordonnees): string {
  const l: string[] = [];
  if (c.tel) l.push(`<a href="tel:${ech(c.tel)}" style="text-decoration:none;">${ech(formatTel(c.tel))}</a>`);
  if (c.email) l.push(`<a href="mailto:${ech(c.email)}" style="text-decoration:none;word-break:break-all;">${ech(c.email)}</a>`);
  for (const [cle, prefixe] of [["instagram", "@"], ["linkedin", ""], ["site", ""]] as const) {
    const url = c[cle];
    if (!url) continue;
    const libelle = cle === "instagram" ? prefixe + url.replace(/\/$/, "").split("/").pop() : url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    l.push(`<a href="${ech(url)}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;word-break:break-all;">${ech(libelle)}</a>`);
  }
  return `<p style="margin:0;font-size:12px;line-height:1.5;color:rgba(51,51,52,.62);"><strong style="color:#003850;">Contact</strong><br>${l.join("<br>")}</p>`;
}

/** `+33636922653` → `06 36 92 26 53`. */
function formatTel(t: string): string {
  const n = t.replace(/\s/g, "").replace(/^\+33/, "0");
  return /^0\d{9}$/.test(n) ? n.replace(/(\d{2})(?=\d)/g, "$1 ").trim() : t;
}

/** Ligne « Spécialités » du rail. */
export function renderSpecialites(items: string[]): string {
  return `<p style="margin:0;font-size:12px;line-height:1.5;color:rgba(51,51,52,.62);"><strong style="color:#003850;">Spécialités</strong><br>${items.map(ech).join(" · ")}</p>`;
}
