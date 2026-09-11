import type { Metadata } from "next";
import NewsletterMessage from "@/components/site/NewsletterMessage";
import { rpc } from "@/lib/newsletter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Confirmation d’inscription",
  robots: { index: false, follow: false },
};

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ jeton?: string }>;
}) {
  const { jeton } = await searchParams;

  const resultat = jeton ? await rpc<string>("newsletter_confirmer", { p_jeton: jeton }) : null;

  if (resultat === "confirme") {
    return (
      <NewsletterMessage
        eyebrow="La lettre Mugitu"
        titre="Votre inscription est confirmée"
        texte="Vous recevrez les nouveaux articles, le planning du Mugi Klub et nos rendez-vous, une fois par mois. Chaque message contient un lien de désinscription."
      />
    );
  }

  if (resultat === "desabonne") {
    return (
      <NewsletterMessage
        eyebrow="La lettre Mugitu"
        titre="Cette adresse s’était désinscrite"
        texte="Pour la réinscrire, utilisez le formulaire en bas de n’importe quelle page du site."
        ton="neutre"
      />
    );
  }

  return (
    <NewsletterMessage
      eyebrow="La lettre Mugitu"
      titre="Ce lien n’est plus valable"
      texte="Il a peut-être déjà servi, ou il est incomplet. Réinscrivez-vous depuis le formulaire en bas de n’importe quelle page du site."
      ton="neutre"
    />
  );
}
