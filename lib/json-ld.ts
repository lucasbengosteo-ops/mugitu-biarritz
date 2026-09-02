/**
 * Sérialise un objet JSON-LD pour injection dans une balise <script>.
 *
 * `JSON.stringify` seul n’échappe pas `</script>` : une chaîne contenant cette
 * séquence refermerait la balise et permettrait d’exécuter du script arbitraire.
 * Le risque est réel dès lors que la donnée vient de la base (titres d’articles
 * saisis via le back-office). On échappe donc `<` en `<`, ce qui reste du
 * JSON valide et neutralise la sortie de balise.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
