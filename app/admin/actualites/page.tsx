import type { Metadata } from "next";
import ArticleAdmin from "@/components/admin/ArticleAdmin";

export const metadata: Metadata = {
  title: "Back-office — Actualités",
  // Un back-office n'a rien à faire dans les moteurs de recherche.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Back-office des actualités.
 *
 * La page est publique au sens HTTP — c'est la session Supabase et la RLS de
 * la table `articles` qui contrôlent réellement l'accès. Sans session, on ne
 * voit que l'écran de connexion ; sans droits, PostgREST refuse l'écriture.
 */
export default function AdminActualitesPage() {
  return <ArticleAdmin />;
}
