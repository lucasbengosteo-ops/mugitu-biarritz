/**
 * Données structurées schema.org des pages publiques.
 *
 * Le `MedicalBusiness` du cabinet est posé une fois dans app/layout.tsx ; ce
 * module ne fabrique que les blocs propres à une page. Les fonctions rendent
 * des objets : la sérialisation passe par `jsonLdScript` (lib/json-ld.ts).
 *
 * Pur et sans alias : lu tel quel par `node --test`.
 */

type Lien = { label: string; href: string };

/** Le cabinet tel qu'il est cité depuis une page (employeur, éditeur). */
export function cabinet(site: string) {
  return {
    "@type": "MedicalBusiness",
    name: "Mugitu — La maison du mouvement",
    url: site,
    address: {
      "@type": "PostalAddress",
      streetAddress: "3 avenue Kléber",
      addressLocality: "Biarritz",
      postalCode: "64200",
      addressCountry: "FR",
    },
  };
}

/** Une adresse absolue à partir d'un chemin du site. */
function absolue(site: string, href: string): string {
  if (/^https?:\/\//.test(href)) return href;
  return href === "/" ? site : `${site}${href}`;
}

/** Libellé lisible : sans HTML ni entité courante. */
function texte(s: string): string {
  return s
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Fil d'Ariane : les étapes du `trail`, puis la page courante. */
export function filAriane(site: string, trail: Lien[], courant: { label: string; chemin: string }) {
  const etapes = [...trail.map((t) => ({ label: t.label, href: t.href })), { label: courant.label, href: courant.chemin }];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: etapes.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: texte(e.label),
      item: absolue(site, e.href),
    })),
  };
}

/** Page d'information médicale consacrée à une pathologie. */
export function pageMedicale(
  site: string,
  p: { chemin: string; titre: string; description: string; pathologie: string },
) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: texte(p.titre),
    description: p.description,
    url: absolue(site, p.chemin),
    inLanguage: "fr-FR",
    about: { "@type": "MedicalCondition", name: texte(p.pathologie) },
    publisher: cabinet(site),
  };
}

/** Page de questions fréquentes. */
export function pageFaq(questions: { question: string; reponse: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.reponse },
    })),
  };
}

/**
 * Un praticien du cabinet. Type `Person` pour tous, médecin compris :
 * `Physician` désigne chez schema.org un cabinet (une organisation), qui ne
 * peut pas porter `worksFor` ni `jobTitle`.
 */
export function praticien(
  site: string,
  p: { chemin: string; nom: string; metier: string; photo?: string; liens?: (string | undefined)[] },
) {
  const sameAs = [...new Set((p.liens ?? []).filter((l): l is string => !!l && /^https?:\/\//.test(l)))];
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: texte(p.nom),
    jobTitle: texte(p.metier),
    url: absolue(site, p.chemin),
    ...(p.photo ? { image: absolue(site, p.photo) } : {}),
    worksFor: cabinet(site),
    ...(sameAs.length ? { sameAs } : {}),
  };
}
