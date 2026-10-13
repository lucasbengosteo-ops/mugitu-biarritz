import assert from "node:assert/strict";
import test from "node:test";
import { IMAGE_PARTAGE, SITE_URL, metaPage, partage } from "./site.ts";

test("une page partagée annonce sa propre adresse, avec l'image par défaut", () => {
  const og = partage("/faq", { title: "Questions fréquentes", description: "Les réponses." }) as Record<string, unknown>;
  assert.equal(og.url, `${SITE_URL}/faq`);
  assert.equal(og.siteName, "Mugitu Biarritz");
  assert.deepEqual(og.images, [IMAGE_PARTAGE]);
});

test("une image propre et un type article sont conservés", () => {
  const og = partage("/actualites/pubalgie", {
    type: "article",
    title: "Pubalgie",
    images: [{ url: "/foot.webp" }],
  }) as Record<string, unknown>;
  assert.equal(og.type, "article");
  assert.deepEqual(og.images, [{ url: "/foot.webp" }]);
});

test("metaPage aligne la canonique et l'og:url", () => {
  const m = metaPage("/contact", { title: "Nous contacter", description: "Écrivez-nous." });
  assert.equal(m.alternates?.canonical, `${SITE_URL}/contact`);
  assert.equal((m.openGraph as Record<string, unknown>).url, `${SITE_URL}/contact`);
  assert.equal((m.openGraph as Record<string, unknown>).title, "Nous contacter");
});
