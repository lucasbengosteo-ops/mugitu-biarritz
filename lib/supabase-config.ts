/**
 * Coordonnées du projet Supabase de l’app, partagées par la lecture publique
 * des articles (lib/articles.ts) et par le back-office (client navigateur).
 *
 * La clé « anon » est publique par conception : c’est la RLS qui protège.
 * Elle est reprise ici en repli pour que le site build même sans variables
 * d’environnement — convention déjà retenue sur ce projet.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://nuehdfyscqnkckudkqhe.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZWhkZnlzY3Fua2NrdWRrcWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MTUxNzEsImV4cCI6MjA5MDQ5MTE3MX0.uPuFsTq2lYBL3rw29NNSK6fC0f-1ZtycLuQQhIY058w";
