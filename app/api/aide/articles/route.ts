import { NextResponse } from "next/server";
import { extraireFaq } from "@/lib/aide/faq";
import { sansBalises } from "@/lib/aide/texte";
import type { ArticleAide } from "@/lib/aide/types";
import { listArticles } from "@/lib/articles";
import { getInstitutionnel } from "@/lib/institutionnel";
import { PATHOLOGIES } from "@/lib/pathologies";
import { articlePath } from "@/lib/routes";

/** GET /api/aide/articles : la liste de l'onglet Articles (FAQ, pathologies, actualités). */

export const revalidate = 300;

export async function GET() {
  const faq: ArticleAide[] = extraireFaq(getInstitutionnel("faq").bodyHtml).map((q) => ({
    rubrique: "faq",
    titre: q.question,
    lien: "/faq",
    texte: q.reponse,
  }));

  // Les pathologies n'ont pas de chapô (`lead` y est vide dans la maquette) :
  // le titre complet, plus long que `crumb`, en tient lieu de résumé.
  const pathologies: ArticleAide[] = PATHOLOGIES.map((p) => ({
    rubrique: "pathologies",
    titre: sansBalises(p.crumb),
    lien: `/pathologies/${p.slug}`,
    texte: sansBalises(p.title),
  }));

  const cartes = await listArticles();
  const actualites: ArticleAide[] = cartes.map((a) => ({
    rubrique: "actualites",
    titre: a.title,
    lien: articlePath(a.slug),
    texte: a.chapo,
  }));

  const corps: ArticleAide[] = [...faq, ...pathologies, ...actualites];
  return NextResponse.json(corps, { headers: { "Cache-Control": "public, s-maxage=300" } });
}
