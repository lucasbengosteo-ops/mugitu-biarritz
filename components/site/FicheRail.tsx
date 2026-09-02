"use client";

import { useEffect } from "react";

/**
 * Rail latéral d’une fiche praticien.
 *
 * La mise en page responsive est faite en CSS (cf. `.lb-layout` / `.lb-rail`
 * dans globals.css) ; ce composant ne gère que le surlignage du lien
 * correspondant à la section visible. Comme le HTML extrait porte des styles
 * inline, l’état actif est appliqué en inline lui aussi — une classe serait
 * écrasée par la spécificité.
 */
export default function FicheRail({ html }: { html: string }) {
  useEffect(() => {
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".lb-link"));
    if (!links.length) return;
    const ids = links.map((l) => l.dataset.t).filter(Boolean) as string[];
    let current: string | null = null;

    const mark = (cur: string) => {
      links.forEach((l) => {
        const on = l.dataset.t === cur;
        l.style.borderLeftColor = on ? "#04A49B" : "transparent";
        l.style.color = on ? "#003850" : "rgba(51,51,52,.6)";
        l.style.fontWeight = on ? "600" : "400";
      });
    };

    const update = () => {
      let cur = ids[0];
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 200) cur = id;
      });
      if (cur !== current) {
        current = cur;
        mark(cur);
      }
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [html]);

  return <aside className="lb-rail" dangerouslySetInnerHTML={{ __html: html }} />;
}
