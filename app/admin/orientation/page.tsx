import type { Metadata } from "next";
import { Suspense } from "react";
import OrientationAdmin from "@/components/admin/orientation/OrientationAdmin";

export const metadata: Metadata = {
  title: "Back-office — Par où commencer",
  // Un back-office n’a rien à faire dans les moteurs de recherche.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminOrientationPage() {
  // L'onglet actif est lu dans l'adresse (`useSearchParams`) : la page est
  // prérendue, Next demande une frontière `Suspense` autour de ce qui la lit.
  return (
    <Suspense fallback={<p className="ad-page">Chargement…</p>}>
      <OrientationAdmin />
    </Suspense>
  );
}
