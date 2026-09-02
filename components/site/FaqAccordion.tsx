"use client";

import { useEffect, useRef } from "react";

/**
 * Rend le corps de la FAQ et branche l’accordéon.
 *
 * Le HTML extrait porte déjà les classes `.faq-item` / `.faq-q` et le CSS
 * réagit à l’attribut `data-open` (cf. globals.css) : ce composant ne fait
 * que basculer cet attribut au clic.
 */
export default function FaqAccordion({ html }: { html: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(".faq-item"));
    const cleanups = items.map((item) => {
      const btn = item.querySelector<HTMLElement>(".faq-q");
      if (!btn) return () => {};
      const toggle = () => {
        item.dataset.open = item.dataset.open === "1" ? "0" : "1";
        btn.setAttribute("aria-expanded", item.dataset.open === "1" ? "true" : "false");
      };
      // La maquette ouvre déjà certaines réponses : on part de son état.
      btn.setAttribute("aria-expanded", item.dataset.open === "1" ? "true" : "false");
      btn.addEventListener("click", toggle);
      return () => btn.removeEventListener("click", toggle);
    });
    return () => cleanups.forEach((fn) => fn());
  }, [html]);

  return <div ref={root} dangerouslySetInnerHTML={{ __html: html }} />;
}
