import type { Metadata } from "next";
import AgendaAdmin from "@/components/admin/agenda/AgendaAdmin";

export const metadata: Metadata = {
  title: "Back-office — Agenda du cabinet",
  // Un back-office n’a rien à faire dans les moteurs de recherche.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminAgendaPage() {
  return <AgendaAdmin />;
}
