/**
 * Page « Nos ambassadeurs ». Son hero suit le motif de /esprit-mugitu
 * (retour à l’accueil + barre de statistiques) et non le hero commun des
 * pages de contenu, d’où ce module dédié.
 */
export const AMBASSADEURS = {
  eyebrow: `Ils nous font confiance`,
  title: `Nos ambassadeurs`,
  /* Cran de titre (cf. globals.css, --h1-*). `as const` : sans lui
     TypeScript élargit en `string` et le hero refuse la valeur. */
  size: "xl" as const,
  lead: `Des sportifs du Pays Basque et d’ailleurs, du surf de gros au trail et à la danse contemporaine, qui s’entraînent, récupèrent et performent avec la Mugi Team.`,
  stats: [{ value: `3`, label: `Ambassadeurs` }, { value: `3`, label: `Disciplines` }, { value: `1`, label: `Maison, 3 av. Kléber` }],
  bodyHtml: `<!-- ░░ AMBASSADEURS ░░ -->
<section style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;">

    <article style="position:relative;border-radius:var(--r-l);overflow:hidden;aspect-ratio:3/4;box-shadow:0 6px 28px rgba(60,40,30,.1);grid-column:span 1;">
      <img src="/athlete-surf.jpg" alt="Matt Etxebarne, surfeur de grosses vagues en foil" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" />
      <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,30,42,.95) 0%,rgba(0,30,42,.4) 50%,transparent 78%);"></div>
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:26px;">
        <p style="margin:0 0 12px;font-size:14px;line-height:1.55;color:rgba(255,255,255,.92);">Originaire de Bidart, il a chaussé son premier foil à 16 ans. Depuis, il charge Belharra, Nazaré et Jaws, où il a signé l’une des plus grosses vagues jamais surfées en foil.</p>
        <p style="margin:0;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;color:#04A49B;font-weight:600;">Surf de gros · foil</p>
        <h3 style="margin:2px 0 0;font-size:var(--h3-l);font-weight:700;color:#fff;">Matt Etxebarne</h3>
      </div>
    </article>

    <article style="position:relative;border-radius:var(--r-l);overflow:hidden;aspect-ratio:3/4;box-shadow:0 6px 28px rgba(60,40,30,.1);background:#012A3A;">
      <img src="/damien-san-martin.jpg" alt="Damien San Martin, traileur hendayais" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 30%;" />
      <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,30,42,.95) 0%,rgba(0,30,42,.4) 50%,transparent 78%);pointer-events:none;"></div>
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:26px;pointer-events:none;">
        <p style="margin:0 0 12px;font-size:14px;line-height:1.55;color:rgba(255,255,255,.92);">Traileur hendayais, habitué des gros dénivelés. En août 2025, il a relié Saint-Jean-Pied-de-Port à Hendaye par le GR10 — 100 km et plus de 5 000 m de D+ — au profit de l’association Peio 7, contre la mort subite du sportif.</p>
        <p style="margin:0;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;color:#04A49B;font-weight:600;">Trail · ultra</p>
        <h3 style="margin:2px 0 0;font-size:var(--h3-l);font-weight:700;color:#fff;">Damien San Martin</h3>
      </div>
    </article>

    <article style="position:relative;border-radius:var(--r-l);overflow:hidden;aspect-ratio:3/4;box-shadow:0 6px 28px rgba(60,40,30,.1);">
      <img src="/athlete-danse.jpg" alt="Ibawa" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" />
      <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,30,42,.95) 0%,rgba(0,30,42,.4) 50%,transparent 78%);"></div>
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:26px;">
        <p style="margin:0 0 12px;font-size:14px;line-height:1.55;color:rgba(255,255,255,.92);">Quatuor de la scène chorégraphique émergente du Pays Basque — Lou Cisnal, Amélie Delaunay, Elisa Picq et Marine Postel. Lauréates du Tremplin Corps et Graphie et du Grand Prix de la Chorégraphie Émergente, elles ont créé <em>Gaua</em> pour Le Temps d’Aimer la Danse.</p>
        <p style="margin:0;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;color:#04A49B;font-weight:600;">Danse contemporaine</p>
        <h3 style="margin:2px 0 0;font-size:var(--h3-l);font-weight:700;color:#fff;">Collectif Ibawa</h3>
      </div>
    </article>

    <article style="border-radius:var(--r-l);background:linear-gradient(150deg,#003850,#0A556B);box-shadow:0 6px 28px rgba(0,40,56,.18);display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:32px;aspect-ratio:3/4;color:#fff;">
      <div style="width:52px;height:52px;border-radius:var(--r-m);background:rgba(4,164,155,.2);display:flex;align-items:center;justify-content:center;margin-bottom:18px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:26px;height:26px;color:#04A49B;"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><path d="M12 18v-2h-.5"/></svg></div>
      <h3 style="margin:0 0 10px;font-size:var(--h3-l);font-weight:700;">Devenir ambassadeur</h3>
      <p style="margin:0 0 22px;font-size:13px;line-height:1.55;color:rgba(255,255,255,.65);">Sportif engagé, club ou collectif&nbsp;? Rejoignez la communauté Mugitu.</p>
      <a href="mailto:contact@mugitu-biarritz.fr" style="padding:12px 24px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:14px;font-weight:600;text-decoration:none;">Nous contacter ↗</a>
    </article>

  </div>
</section>

<!-- ░░ FOOTER ░░ -->`,
};
