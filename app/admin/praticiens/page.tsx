import type { Metadata } from "next";
import PraticiensAdmin from "@/components/admin/PraticiensAdmin";

export const metadata: Metadata = {
  title: "Back-office — Pages praticien",
  // Un back-office n’a rien à faire dans les moteurs de recherche.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Retouches des pages praticien.
 *
 * Page publique au sens HTTP : c’est la session Supabase et la RLS de
 * `practitioner_overrides` qui contrôlent l’accès.
 */
export default function AdminPraticiensPage() {
  return <PraticiensAdmin />;
}
