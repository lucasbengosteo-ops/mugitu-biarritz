/**
 * Accès en lecture aux articles du blog (table `articles` du projet Supabase
 * de l'app, cf. mémoire projet).
 *
 * On interroge PostgREST directement avec `fetch` : pas besoin du SDK
 * Supabase pour de la lecture publique, et ça garde le bundle léger.
 * La clé « anon » est publique par conception — c'est la RLS qui protège :
 * elle ne laisse voir que les articles réellement en ligne.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://nuehdfyscqnkckudkqhe.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZWhkZnlzY3Fua2NrdWRrcWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MTUxNzEsImV4cCI6MjA5MDQ5MTE3MX0.uPuFsTq2lYBL3rw29NNSK6fC0f-1ZtycLuQQhIY058w";

/** Revalidation ISR : publier un article n'exige pas de redéploiement. */
export const ARTICLES_REVALIDATE = 300;

export type ArticleAuthor = { name: string; job?: string; photo?: string; fiche?: string };
export type ArticleSection = { h: string; p: string[] };
export type ArticleFaq = { q: string; a: string };
export type ArticleStat = { value: string; label: string };
export type ArticleExercice = { title?: string; body?: string; video?: string };

export type Article = {
  slug: string;
  title: string;
  eyebrow: string | null;
  category: string;
  chapo: string;
  cover: string | null;
  tags: string[];
  author: ArticleAuthor;
  date: string;
  status: string;
  publish_at: string | null;
  featured: boolean;
  read_mins: number | null;
  sections: ArticleSection[];
  faq: ArticleFaq[];
  cas: string | null;
  exercice: ArticleExercice | null;
  stats: ArticleStat[];
  seo: { title?: string; desc?: string } | null;
};

/** Colonnes de la liste : on évite de rapatrier le corps des articles. */
const LIST_COLUMNS =
  "slug,title,eyebrow,category,chapo,cover,tags,author,date,publish_at,featured,read_mins";

export type ArticleCard = Pick<
  Article,
  "slug" | "title" | "eyebrow" | "category" | "chapo" | "cover" | "tags" | "author" | "date" | "publish_at" | "featured" | "read_mins"
>;

async function query<T>(path: string): Promise<T[]> {
  // On laisse volontairement remonter les erreurs plutôt que de rendre une
  // liste vide : avec l'ISR, une revalidation qui échoue fait resservir la
  // dernière page valide, alors qu'un tableau vide remplacerait un blog qui
  // marche par une page « aucun article ». Au build, l'échec est bruyant —
  // ce qu'on veut aussi.
  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      next: { revalidate: ARTICLES_REVALIDATE },
    });
  } catch (cause) {
    throw new Error(`[articles] Supabase injoignable (${path})`, { cause });
  }
  if (!res.ok) {
    throw new Error(`[articles] Supabase a répondu ${res.status} (${path})`);
  }
  return (await res.json()) as T[];
}

/** Articles en ligne, du plus récent au plus ancien. */
export async function listArticles(): Promise<ArticleCard[]> {
  return query<ArticleCard>(`articles?select=${LIST_COLUMNS}&order=publish_at.desc.nullslast,date.desc`);
}

/** Un article complet, ou null s'il n'existe pas ou n'est pas en ligne. */
export async function getArticle(slug: string): Promise<Article | null> {
  const rows = await query<Article>(`articles?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return rows[0] ?? null;
}

/** Date d'affichage : « 28 août 2026 ». */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  const mois = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  return `${d.getDate()} ${mois[d.getMonth()]} ${d.getFullYear()}`;
}

/** Date de référence d'un article : sa programmation si elle existe. */
export function articleDate(a: { publish_at: string | null; date: string }): string {
  return a.publish_at ?? a.date;
}
