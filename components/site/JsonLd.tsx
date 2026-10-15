import { jsonLdScript } from "@/lib/json-ld";

/** Un ou plusieurs blocs JSON-LD, chacun dans sa balise <script>. */
export default function JsonLd({ donnees }: { donnees: unknown[] }) {
  return (
    <>
      {donnees.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(d) }} />
      ))}
    </>
  );
}
