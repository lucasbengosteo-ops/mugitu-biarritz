import { CONTACT } from "@/lib/contact";
import { FICHE_DATA } from "@/lib/fiches-data";
import { getInstitutionnel } from "@/lib/institutionnel";
import { KLUB } from "@/lib/klub";
import { equipeAvecOverrides, getOverrides } from "@/lib/practitioners";
import { practitionerPath } from "@/lib/routes";
import { NOS_SOINS } from "@/lib/soins";
import { construireCorpus } from "./corpus";
import type { Passage } from "./types";

/**
 * Le corpus réel des réponses pratiques. Serveur seulement (lit les
 * retouches des fiches). Les données structurées de app/layout.tsx
 * (téléphone, horaires) n'en font pas partie : elles ne sont pas vérifiées.
 */
export async function corpusDuSite(): Promise<Passage[]> {
  const overrides = await getOverrides();
  const equipe = equipeAvecOverrides(overrides);
  const tarifs = equipe.map((p) => {
    const o = overrides.find((x) => x.slug === p.slug);
    const lignes = o?.tarifs ?? FICHE_DATA[p.slug]?.tarifs ?? [];
    return { praticien: p.slug, nom: p.name, fiche: practitionerPath(p.slug), lignes };
  });
  return construireCorpus({
    faqHtml: getInstitutionnel("faq").bodyHtml,
    pages: [
      { id: "acces", titre: "Venir au cabinet", lien: "/zone-intervention", html: getInstitutionnel("zone-intervention").bodyHtml },
      { id: "contact", titre: "Nous contacter", lien: "/contact", html: CONTACT.bodyHtml },
      { id: "soins", titre: "Nos soins", lien: "/nos-soins", html: NOS_SOINS.bodyHtml },
      { id: "klub", titre: "Le Mugi Klub", lien: "/mugi-klub", html: KLUB.bodyHtml },
      {
        // Page composée à partir du planning (prix par créneau) : on n'en
        // reprend que ce qui ne change pas ; les tarifs restent sur la page.
        id: "klub-individuel",
        titre: "Préparation individuelle du Mugi Klub",
        lien: "/mugi-klub/preparation-individuelle",
        html: "<p>Des séances de préparation physique pour soi, seul ou à deux, avec Hugo (préparation physique générale), Baptiste (course à pied et trail) et Jean-Baptiste (préparation des danseurs). Un bilan de 30 minutes offert est conseillé avant la première séance. Les créneaux et les tarifs de chaque préparateur sont affichés sur la page de la préparation individuelle, où l’on réserve.</p>",
      },
    ],
    tarifs,
  });
}
