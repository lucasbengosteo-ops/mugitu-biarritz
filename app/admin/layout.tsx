import type { Metadata } from "next";
import AdminCoque from "@/components/admin/AdminCoque";

export const metadata: Metadata = {
  // Un back-office n’a rien à faire dans les moteurs de recherche.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminCoque>{children}</AdminCoque>;
}
