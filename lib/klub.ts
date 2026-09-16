/**
 * Page « Le Mugi Klub » : hero et contenu statique sous le planning.
 *
 * Le planning vient de la base (components/site/klub/KlubPlanning.tsx). Les
 * tarifs reprennent ceux de la page Préparation physique (lib/methodes.ts) :
 * 15 € la séance, 15 € la séance d'essai, 25 € l'essai en duo, groupes de 4
 * à 5. Aucun paiement en ligne : tout se règle sur place.
 */
export const KLUB = {
  eyebrow: `La communauté Mugitu`,
  title: `Le Mugi<br>Klub`,
  /* Cran de titre (cf. globals.css, --h1-*). `as const` : sans lui
     TypeScript élargit en `string` et le hero refuse la valeur. */
  size: "xl" as const,
  lead: ``,

  bodyHtml: `<!-- ░░ TARIFS ░░ -->
<section id="tarifs" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,48px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:48px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Small groups</p>
      <h2 style="margin:0;font-size:var(--h2-xl);font-weight:700;letter-spacing:-.025em;color:#003850;">Les tarifs</h2>
      <p style="margin:14px auto 0;max-width:560px;font-size:15px;line-height:1.6;color:rgba(51,51,52,.7);">Des groupes de 4 à 5 personnes. Vous réservez votre place en ligne et vous payez sur place, au centre.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px;align-items:stretch;">
      <div style="display:flex;flex-direction:column;background:#fff;border-radius:var(--r-l);box-shadow:0 6px 28px rgba(60,40,30,.07);padding:32px;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;color:rgba(51,51,52,.5);font-weight:600;">Découverte</p>
        <h3 style="margin:0 0 14px;font-size:var(--h3-l);font-weight:700;color:#003850;">Séance d’essai</h3>
        <p style="margin:0 0 22px;font-size:38px;font-weight:800;color:#003850;letter-spacing:-.02em;">15&nbsp;€<span style="font-size:14px;font-weight:500;color:rgba(51,51,52,.5);"> / séance</span></p>
        <ul style="margin:0 0 26px;padding:0;list-style:none;display:flex;flex-direction:column;gap:11px;flex:1;">
          <li style="font-size:14px;color:rgba(51,51,52,.72);">Votre première séance de small group</li>
          <li style="font-size:14px;color:rgba(51,51,52,.72);">Sans engagement</li>
        </ul>
        <a href="#planning" style="text-align:center;padding:13px;border-radius:var(--r-pill);border:1px solid #003850;color:#003850;font-size:14px;font-weight:600;text-decoration:none;" class="mg-inline-hover">Choisir une séance</a>
      </div>

      <div style="display:flex;flex-direction:column;background:#003850;border-radius:var(--r-l);box-shadow:0 14px 40px rgba(0,40,56,.25);padding:32px;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;color:rgba(255,255,255,.55);font-weight:600;">Le Klub</p>
        <h3 style="margin:0 0 14px;font-size:var(--h3-l);font-weight:700;color:#fff;">Small group</h3>
        <p style="margin:0 0 22px;font-size:38px;font-weight:800;color:#fff;letter-spacing:-.02em;">15&nbsp;€<span style="font-size:14px;font-weight:500;color:rgba(255,255,255,.5);"> / séance</span></p>
        <ul style="margin:0 0 26px;padding:0;list-style:none;display:flex;flex-direction:column;gap:11px;flex:1;">
          <li style="font-size:14px;color:rgba(255,255,255,.82);">4 à 5 personnes par séance</li>
          <li style="font-size:14px;color:rgba(255,255,255,.82);">Encadré par la Mugi Team</li>
          <li style="font-size:14px;color:rgba(255,255,255,.82);">Place réservée en ligne</li>
        </ul>
        <a href="#planning" style="text-align:center;padding:13px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:14px;font-weight:600;text-decoration:none;" class="mg-inline-hover">Voir le planning</a>
      </div>

      <div style="display:flex;flex-direction:column;background:#fff;border-radius:var(--r-l);box-shadow:0 6px 28px rgba(60,40,30,.07);padding:32px;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;color:rgba(51,51,52,.5);font-weight:600;">À deux</p>
        <h3 style="margin:0 0 14px;font-size:var(--h3-l);font-weight:700;color:#003850;">Essai en duo</h3>
        <p style="margin:0 0 22px;font-size:38px;font-weight:800;color:#003850;letter-spacing:-.02em;">25&nbsp;€<span style="font-size:14px;font-weight:500;color:rgba(51,51,52,.5);"> / duo</span></p>
        <ul style="margin:0 0 26px;padding:0;list-style:none;display:flex;flex-direction:column;gap:11px;flex:1;">
          <li style="font-size:14px;color:rgba(51,51,52,.72);">Une première séance avec la personne de votre choix</li>
          <li style="font-size:14px;color:rgba(51,51,52,.72);">Chacun s’inscrit de son côté sur le planning</li>
        </ul>
        <a href="#planning" style="text-align:center;padding:13px;border-radius:var(--r-pill);border:1px solid #003850;color:#003850;font-size:14px;font-weight:600;text-decoration:none;" class="mg-inline-hover">Choisir une séance</a>
      </div>
    </div>
    <p style="margin:30px 0 0;text-align:center;font-size:13px;color:rgba(51,51,52,.5);">Pour un atelier ou une conférence, le tarif est indiqué sur la page de la séance.</p>
  </div>
</section>

<!-- ░░ CTA ░░ -->
<section style="background:#003850;padding:var(--sect-base) clamp(20px,5vw,48px);text-align:center;">
  <div style="max-width:760px;margin:0 auto;">
    <h2 style="margin:0 0 16px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.02em;color:#fff;">Le mouvement, ça se partage</h2>
    <p style="margin:0 0 30px;font-size:16px;line-height:1.6;color:rgba(255,255,255,.7);">Choisissez une séance dans le planning et réservez votre place en ligne.</p>
    <a href="#planning" style="display:inline-flex;align-items:center;gap:8px;padding:15px 32px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;" class="mg-inline-hover">Voir le planning</a>
  </div>
</section>`,
};
