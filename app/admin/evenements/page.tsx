import type { Metadata } from "next";
import EvenementsAdmin from "@/components/admin/EvenementsAdmin";

export const metadata: Metadata = {
  title: "Back-office — Événements",
};

export default function AdminEvenementsPage() {
  return <EvenementsAdmin />;
}
