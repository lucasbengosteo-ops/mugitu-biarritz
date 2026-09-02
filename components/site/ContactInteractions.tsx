"use client";

import { useEffect, useRef } from "react";

/**
 * Rend le corps de la page Contact et rebranche ses deux comportements,
 * repris tels quels de la maquette :
 *
 *  1. le filtre de l’annuaire (`.ct-filter` → `.ct-card`) ;
 *  2. le formulaire, qui ne poste rien : il compose un `mailto:` adressé au
 *     praticien concerné quand le motif est « rendez-vous », sinon à
 *     l’adresse générale.
 */

/** Praticiens joignables directement, sinon l’adresse générale du cabinet. */
const DIRECT: Record<string, string> = { "Hugo Daminato": "hugo.daminato@gmail.com" };
const FALLBACK = "contact@mugitu-biarritz.fr";

const MOTIF_LABELS: Record<string, string> = {
  rdv: "Rendez-vous",
  klub: "Mugi Klub",
  tarifs: "Tarifs et remboursements",
  pro: "Partenariat",
  recrutement: "Candidature Mugi Team",
  presse: "Presse",
  autre: "Demande",
};

export default function ContactInteractions({ html }: { html: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const cleanups: (() => void)[] = [];

    // ── 1. Filtre de l’annuaire ──────────────────────────────────
    const btns = Array.from(el.querySelectorAll<HTMLElement>(".ct-filter"));
    const cards = Array.from(el.querySelectorAll<HTMLElement>(".ct-card"));
    const empty = el.querySelector<HTMLElement>("#ct-empty");

    const setActive = (b: HTMLElement, on: boolean) => {
      b.style.background = on ? "#003850" : "transparent";
      b.style.color = on ? "#fff" : "#003850";
      b.style.borderColor = on ? "transparent" : "rgba(0,56,80,.14)";
      const n = b.querySelector<HTMLElement>("span");
      if (n) n.style.opacity = on ? ".55" : ".45";
      b.setAttribute("aria-pressed", on ? "true" : "false");
    };

    btns.forEach((b) => {
      const onClick = () => {
        const cat = b.getAttribute("data-cat");
        btns.forEach((o) => setActive(o, o === b));
        let shown = 0;
        cards.forEach((c) => {
          const list = (c.getAttribute("data-cat") || "").split(" ");
          const show = cat === "all" || list.indexOf(cat ?? "") !== -1;
          c.style.display = show ? "" : "none";
          if (show) shown++;
        });
        if (empty) empty.style.display = shown ? "none" : "block";
      };
      b.addEventListener("click", onClick);
      cleanups.push(() => b.removeEventListener("click", onClick));
    });

    // ── 2. Formulaire → mailto ───────────────────────────────────
    const motif = el.querySelector<HTMLSelectElement>("#ct-motif");
    const prat = el.querySelector<HTMLSelectElement>("#ct-prat");
    const pratWrap = el.querySelector<HTMLElement>("#ct-prat-wrap");
    const route = el.querySelector<HTMLElement>("#ct-route");
    const form = el.querySelector<HTMLFormElement>("#ct-form");

    if (motif && prat && pratWrap && route && form) {
      const needsPrat = () => motif.value === "rdv";
      const recipient = () => (needsPrat() && DIRECT[prat.value]) || FALLBACK;
      const sync = () => {
        pratWrap.style.display = needsPrat() ? "" : "none";
        const who = needsPrat() && prat.value ? " · " + prat.value : "";
        route.textContent = "Destinataire : " + recipient() + who;
      };

      const onSubmit = (e: Event) => {
        e.preventDefault();
        const val = (id: string) => el.querySelector<HTMLInputElement | HTMLTextAreaElement>(id)?.value.trim() ?? "";
        const nom = val("#ct-nom");
        const email = val("#ct-email");
        const msg = val("#ct-msg");
        const who = needsPrat() && prat.value ? prat.value : "";
        const subject =
          MOTIF_LABELS[motif.value] + (who ? " — " + who : "") + (nom ? " — " + nom : "");
        const body = [
          nom ? "Nom : " + nom : "",
          email ? "E-mail : " + email : "",
          who ? "Praticien souhaité : " + who : "",
          "",
          msg,
        ]
          .filter((l, i) => l !== "" || i === 3)
          .join("\n");
        window.location.href =
          "mailto:" + recipient() + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      };

      motif.addEventListener("change", sync);
      prat.addEventListener("change", sync);
      form.addEventListener("submit", onSubmit);
      sync();
      cleanups.push(() => {
        motif.removeEventListener("change", sync);
        prat.removeEventListener("change", sync);
        form.removeEventListener("submit", onSubmit);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, [html]);

  return <div ref={root} dangerouslySetInnerHTML={{ __html: html }} />;
}
