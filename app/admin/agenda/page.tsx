import type { Metadata } from "next";
import { Suspense } from "react";
import AgendaAdmin from "@/components/admin/agenda/AgendaAdmin";

export const metadata: Metadata = {
  title: "Back-office — Agenda du cabinet",
  // Un back-office n’a rien à faire dans les moteurs de recherche.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminAgendaPage() {
  // L'onglet actif est lu dans l'adresse (`useSearchParams`) : la page est
  // prérendue, Next demande une frontière `Suspense` autour de ce qui la lit.
  return (
    <Suspense fallback={<p className="ad-page ad-agenda-texte">Chargement…</p>}>
      <AgendaAdmin />
    </Suspense>
  );
}
