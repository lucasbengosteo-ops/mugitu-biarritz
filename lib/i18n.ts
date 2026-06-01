import fr from "./dictionaries/fr";
import eu from "./dictionaries/eu";

export const LOCALES = ["fr", "eu"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export type Dict = typeof fr;

const DICTIONARIES: Record<Locale, Dict> = { fr, eu };

export function getDict(locale: Locale): Dict {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

/**
 * Renvoie un chemin préfixé par la locale si nécessaire.
 *  - localePath("fr", "/") → "/"
 *  - localePath("fr", "/concours-avirun-2026") → "/concours-avirun-2026"
 *  - localePath("eu", "/") → "/eu"
 *  - localePath("eu", "/concours-avirun-2026") → "/eu/concours-avirun-2026"
 *
 * Le français (locale par défaut) reste à la racine pour préserver
 * les URLs existantes et le SEO.
 */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

/**
 * Détecte la locale courante à partir d'un pathname.
 *  - "/" → "fr"
 *  - "/concours-avirun-2026" → "fr"
 *  - "/eu" → "eu"
 *  - "/eu/concours-avirun-2026" → "eu"
 */
export function detectLocale(pathname: string): Locale {
  if (pathname === "/eu" || pathname.startsWith("/eu/")) return "eu";
  return "fr";
}

/**
 * Renvoie le pathname équivalent dans l'autre locale, utile pour le
 * bouton de bascule FR/EU.
 *  - swapLocalePath("/") → "/eu"
 *  - swapLocalePath("/concours-avirun-2026") → "/eu/concours-avirun-2026"
 *  - swapLocalePath("/eu") → "/"
 *  - swapLocalePath("/eu/concours-avirun-2026") → "/concours-avirun-2026"
 */
export function swapLocalePath(pathname: string): string {
  const current = detectLocale(pathname);
  if (current === "eu") {
    const stripped = pathname.replace(/^\/eu/, "");
    return stripped === "" ? "/" : stripped;
  }
  return pathname === "/" ? "/eu" : `/eu${pathname}`;
}
