import type { Metadata } from "next";
import TableauDeBord from "@/components/admin/TableauDeBord";

export const metadata: Metadata = {
  title: "Back-office Mugitu",
  // Un back-office n’a rien à faire dans les moteurs de recherche.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return <TableauDeBord />;
}
