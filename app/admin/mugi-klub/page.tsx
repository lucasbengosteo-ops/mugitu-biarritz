import type { Metadata } from "next";
import KlubAdmin from "@/components/admin/KlubAdmin";

export const metadata: Metadata = {
  title: "Back-office — Mugi Klub",
  // Un back-office n’a rien à faire dans les moteurs de recherche.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Back-office du Mugi Klub.
 *
 * Page publique au sens HTTP : la session Supabase, la RLS des tables klub_*
 * (lecture praticiens) et les contrôles des fonctions klub_admin_* protègent
 * les données. Sans session, seul l'écran de connexion est rendu.
 */
export default function AdminMugiKlubPage() {
  return <KlubAdmin />;
}
