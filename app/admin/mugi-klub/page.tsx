import type { Metadata } from "next";
import KlubAdmin from "@/components/admin/KlubAdmin";

export const metadata: Metadata = {
  title: "Back-office — Mugi Klub",
  // Un back-office n’a rien à faire dans les moteurs de recherche.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Back-office du programme Mugi Klub.
 *
 * Page publique au sens HTTP : c’est la session Supabase et la RLS de
 * `klub_events` qui contrôlent l’accès. Sans session, seul l’écran de
 * connexion est rendu ; sans droits praticien, PostgREST refuse l’écriture.
 */
export default function AdminMugiKlubPage() {
  return <KlubAdmin />;
}
