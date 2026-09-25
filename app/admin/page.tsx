import type { Metadata } from "next";
import TableauDeBord from "@/components/admin/TableauDeBord";

export const metadata: Metadata = {
  title: "Back-office Mugitu",
};

export default function AdminPage() {
  return <TableauDeBord />;
}
