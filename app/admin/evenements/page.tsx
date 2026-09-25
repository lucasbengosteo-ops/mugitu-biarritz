import type { Metadata } from "next";
import EvenementsAdmin from "@/components/admin/EvenementsAdmin";

export const metadata: Metadata = {
  title: "Back-office — Événements",
  // Un back-office n’a rien à faire dans les moteurs de recherche.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminEvenementsPage() {
  return <EvenementsAdmin />;
}
