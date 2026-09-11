import type { Metadata } from "next";
import JeuxStand from "@/components/admin/JeuxStand";

export const metadata: Metadata = {
  title: "Stand — saisie des scores",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Outil de saisie du stand. On y arrive par le lien secret du stand
 * (`?cle=…`), une fois par téléphone ; la clé est ensuite gardée sur
 * l'appareil et retirée de la barre d'adresse.
 *
 * Pas de compte praticien ici : la plupart n'en ont pas encore activé. La clé
 * est vérifiée côté base à chaque appel, et elle expire après l'événement.
 */
export default async function JeuxStandPage({ searchParams }: { searchParams: Promise<{ cle?: string }> }) {
  const { cle } = await searchParams;
  return <JeuxStand cleUrl={typeof cle === "string" ? cle : null} />;
}
