import { sansBalises, slugifier } from "./texte.ts";

export type QuestionFaq = { id: string; question: string; reponse: string };

/**
 * Les questions de la page FAQ. Le HTML de la maquette pose chaque question
 * dans `.faq-q` et sa réponse dans `.faq-a` (voir `lib/institutionnel.ts`).
 */
export function extraireFaq(html: string): QuestionFaq[] {
  const items = html.split(/<div class="faq-item"/).slice(1);
  return items.map((bloc) => {
    const q = /<button class="faq-q"[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/.exec(bloc)?.[1] ?? "";
    const a = /<div class="faq-a">([\s\S]*?)<\/div>/.exec(bloc)?.[1] ?? "";
    const question = sansBalises(q);
    return { id: `faq-${slugifier(question)}`, question, reponse: sansBalises(a) };
  });
}
