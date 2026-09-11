import type { Metadata } from "next";
import NewsletterMessage from "@/components/site/NewsletterMessage";
import { rpc } from "@/lib/newsletter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Désinscription",
  robots: { index: false, follow: false },
};

/**
 * Désinscription en un clic : le lien du mail suffit, sans mot de passe ni
 * formulaire à valider. C'est une obligation, et c'est aussi la façon de ne
 * pas finir en plainte pour spam.
 */
export default async function DesinscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ jeton?: string }>;
}) {
  const { jeton } = await searchParams;

  const resultat = jeton ? await rpc<string>("newsletter_desabonner", { p_jeton: jeton }) : null;

  if (resultat === "desabonne") {
    return (
      <NewsletterMessage
        eyebrow="La lettre Mugitu"
        titre="Vous êtes désinscrit"
        texte="Vous ne recevrez plus la lettre. Votre adresse est conservée uniquement pour éviter de vous réinscrire par erreur."
        ton="neutre"
      />
    );
  }

  return (
    <NewsletterMessage
      eyebrow="La lettre Mugitu"
      titre="Ce lien n’est plus valable"
      texte="Si vous receviez encore la lettre, utilisez le lien de désinscription du dernier message reçu, ou écrivez-nous."
      ton="neutre"
    />
  );
}
