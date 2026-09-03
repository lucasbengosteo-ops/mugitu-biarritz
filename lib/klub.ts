/**
 * Page « Le Mugi Klub » : planning hebdomadaire, tarifs et communauté.
 *
 * ⚠️ Le tunnel de paiement de la maquette a été **volontairement exclu** à
 * l’extraction : il collectait numéro de carte, expiration et CVC dans un
 * formulaire qui n’encaissait rien (`// simulate Stripe PaymentIntent`) et
 * écrivait l'« adhésion » dans le localStorage. Les boutons d’achat pointent
 * vers /contact en attendant un vrai encaissement.
 */
export const KLUB = {
  eyebrow: `La communauté Mugitu`,
  title: `Le Mugi<br>Klub`,
  /* Cran de titre (cf. globals.css, --h1-*). `as const` : sans lui
     TypeScript élargit en `string` et le hero refuse la valeur. */
  size: "xl" as const,
  lead: ``,
  /**
   * Enveloppe de la section planning (titre, filtres, barre d'outils, grille
   * vide). Les colonnes de jour sont générées depuis `klub_events` par
   * `renderColonnes()` et injectées ici — d'où la fonction plutôt qu'une
   * chaîne : le contenu de la grille vient de la base, pas de la maquette.
   */
  planningShell: (colonnes: string) => `<!-- ░░ PLANNING ░░ -->
<section id="planning" style="padding:var(--sect-base) clamp(16px,4vw,48px);max-width:1320px;margin:0 auto;">
  <div style="display:flex;flex-wrap:wrap;gap:18px;align-items:flex-end;justify-content:space-between;margin-bottom:28px;">
    <div>
      <p style="margin:0 0 10px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Cette semaine</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Le planning</h2>
    </div>
    <!-- filters -->
    <div id="mk-filters" style="display:flex;flex-wrap:wrap;gap:8px;">
      <button class="mk-filter" data-type="all" style="padding:9px 16px;border-radius:var(--r-pill);border:1px solid #04A49B;background:#04A49B;color:#fff;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .18s;">Tout</button>
      <button class="mk-filter" data-type="small" style="padding:9px 16px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.18);background:transparent;color:#003850;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .18s;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#04A49B;margin-right:7px;"></span>Small groups</button>
      <button class="mk-filter" data-type="atelier" style="padding:9px 16px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.18);background:transparent;color:#003850;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .18s;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#d49a40;margin-right:7px;"></span>Ateliers</button>
      <button class="mk-filter" data-type="conf" style="padding:9px 16px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.18);background:transparent;color:#003850;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .18s;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#003850;margin-right:7px;"></span>Conférences</button>
      <button class="mk-filter" data-type="soiree" style="padding:9px 16px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.18);background:transparent;color:#003850;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .18s;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#EE806C;margin-right:7px;"></span>Soirées</button>
    </div>
  </div>

  <!-- week nav + mobile day tabs -->
  <div id="mk-toolbar" style="display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:20px;">
    <div style="display:flex;align-items:center;gap:10px;">
      <button id="mk-prev" aria-label="Semaine précédente" style="width:38px;height:38px;border-radius:50%;border:1px solid rgba(0,56,80,.18);background:#fff;color:#003850;font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .18s;" class="mg-inline-hover">‹</button>
      <span id="mk-range" style="min-width:210px;text-align:center;font-size:15px;font-weight:600;color:#003850;">—</span>
      <button id="mk-next" aria-label="Semaine suivante" style="width:38px;height:38px;border-radius:50%;border:1px solid rgba(0,56,80,.18);background:#fff;color:#003850;font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .18s;" class="mg-inline-hover">›</button>
      <button id="mk-today" style="margin-left:4px;padding:9px 16px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.18);background:transparent;color:#003850;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .18s;" class="mg-inline-hover">Aujourd’hui</button>
    </div>
    <div id="mk-daytabs" style="display:none;gap:6px;overflow-x:auto;max-width:100%;padding-bottom:2px;"></div>
  </div>

  <div id="mk-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;align-items:start;">

    ${colonnes}

  </div>

</section>

`,

  /** Modale de séance, tarifs et CTA — statiques. */
  bodyHtml: `<!-- ░░ SESSION MODAL ░░ -->
<div id="mk-modal" style="position:fixed;inset:0;z-index:160;display:none;align-items:center;justify-content:center;padding:20px;">
  <div id="mk-modal-bg" style="position:absolute;inset:0;background:rgba(1,30,42,.55);backdrop-filter:blur(3px);opacity:0;transition:opacity .3s;"></div>
  <div id="mk-modal-card" style="position:relative;width:min(440px,100%);background:#fff;border-radius:var(--r-l);box-shadow:0 30px 80px rgba(0,20,30,.4);overflow:hidden;transform:translateY(14px) scale(.98);opacity:0;transition:transform .32s cubic-bezier(.16,1,.3,1),opacity .3s;">
    <div id="mk-modal-head" style="padding:26px 28px 22px;color:#fff;position:relative;background:#04A49B;">
      <button id="mk-modal-close" aria-label="Fermer" style="position:absolute;top:18px;right:18px;width:32px;height:32px;border-radius:50%;border:none;background:rgba(255,255,255,.18);color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;">×</button>
      <span id="mk-modal-type" style="display:inline-block;padding:5px 12px;border-radius:var(--r-pill);background:rgba(255,255,255,.2);font-size:10px;font-weight:700;letter-spacing:var(--ls-label);text-transform:uppercase;margin-bottom:14px;">—</span>
      <h3 id="mk-modal-title" style="margin:0;font-size:var(--h3-l);font-weight:700;letter-spacing:-.01em;line-height:1.15;">—</h3>
    </div>
    <div style="padding:24px 28px 28px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px;">
        <div style="display:flex;gap:10px;align-items:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg><div><p id="mk-modal-day" style="margin:0;font-size:13px;font-weight:600;color:#003850;">—</p><p id="mk-modal-time" style="margin:0;font-size:12px;color:rgba(51,51,52,.55);">—</p></div></div>
        <div style="display:flex;gap:10px;align-items:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><div><p id="mk-modal-coach" style="margin:0;font-size:13px;font-weight:600;color:#003850;">—</p><p id="mk-modal-level" style="margin:0;font-size:12px;color:rgba(51,51,52,.55);">—</p></div></div>
      </div>
      <p id="mk-modal-desc" style="margin:0 0 20px;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">—</p>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:14px;">
        <span id="mk-modal-spots" style="font-size:13px;font-weight:600;color:#1F8A5B;">—</span>
        <a id="mk-modal-book" href="https://app.mugitu.pro" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:7px;padding:13px 26px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:14px;font-weight:600;text-decoration:none;transition:background .2s;" class="mg-inline-hover">Réserver <span>↗</span></a>
      </div>
    </div>
  </div>
</div>

<!-- ░░ TARIFS ░░ -->
<section id="tarifs" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,48px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:48px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Rejoindre le Klub</p>
      <h2 style="margin:0;font-size:var(--h2-xl);font-weight:700;letter-spacing:-.025em;color:#003850;">Les tarifs</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px;align-items:stretch;">
      <div style="display:flex;flex-direction:column;background:#fff;border-radius:var(--r-l);box-shadow:0 6px 28px rgba(60,40,30,.07);padding:32px;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;color:rgba(51,51,52,.5);font-weight:600;">Découverte</p>
        <h3 style="margin:0 0 14px;font-size:var(--h3-l);font-weight:700;color:#003850;">Séance d’essai</h3>
        <p style="margin:0 0 22px;font-size:38px;font-weight:800;color:#003850;letter-spacing:-.02em;">15€<span style="font-size:14px;font-weight:500;color:rgba(51,51,52,.5);"> / séance</span></p>
        <ul style="margin:0 0 26px;padding:0;list-style:none;display:flex;flex-direction:column;gap:11px;flex:1;">
          <li style="display:flex;gap:10px;font-size:14px;color:rgba(51,51,52,.72);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:#04A49B;width:18px;height:18px;flex:0 0 auto;"><path d="M20 6 9 17l-5-5"/></svg>1 small group au choix</li>
          <li style="display:flex;gap:10px;font-size:14px;color:rgba(51,51,52,.72);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:#04A49B;width:18px;height:18px;flex:0 0 auto;"><path d="M20 6 9 17l-5-5"/></svg>Sans engagement</li>
          <li style="display:flex;gap:10px;font-size:14px;color:rgba(51,51,52,.72);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:#04A49B;width:18px;height:18px;flex:0 0 auto;"><path d="M20 6 9 17l-5-5"/></svg>Bilan d’orientation offert</li>
        </ul>
        <a href="/contact" style="text-align:center;padding:13px;border-radius:var(--r-pill);border:1px solid #003850;color:#003850;font-size:14px;font-weight:600;text-decoration:none;transition:background .2s,color .2s;" class="mg-inline-hover">Réserver l’essai</a>
      </div>

      <div style="display:flex;flex-direction:column;background:#003850;border-radius:var(--r-l);box-shadow:0 14px 40px rgba(0,40,56,.25);padding:32px;position:relative;">
        <span style="position:absolute;top:20px;right:20px;padding:5px 12px;border-radius:var(--r-pill);background:#F3BE79;color:#3a2a10;font-size:10px;font-weight:700;letter-spacing:var(--ls-label);text-transform:uppercase;">Populaire</span>
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;color:rgba(255,255,255,.55);font-weight:600;">Le Klub</p>
        <h3 style="margin:0 0 14px;font-size:var(--h3-l);font-weight:700;color:#fff;">Abonnement illimité</h3>
        <p style="margin:0 0 22px;font-size:38px;font-weight:800;color:#fff;letter-spacing:-.02em;">59€<span style="font-size:14px;font-weight:500;color:rgba(255,255,255,.5);"> / mois</span></p>
        <ul style="margin:0 0 26px;padding:0;list-style:none;display:flex;flex-direction:column;gap:11px;flex:1;">
          <li style="display:flex;gap:10px;font-size:14px;color:rgba(255,255,255,.82);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:#04A49B;width:18px;height:18px;flex:0 0 auto;"><path d="M20 6 9 17l-5-5"/></svg>Small groups &amp; ateliers illimités</li>
          <li style="display:flex;gap:10px;font-size:14px;color:rgba(255,255,255,.82);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:#04A49B;width:18px;height:18px;flex:0 0 auto;"><path d="M20 6 9 17l-5-5"/></svg>Conférences offertes</li>
          <li style="display:flex;gap:10px;font-size:14px;color:rgba(255,255,255,.82);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:#04A49B;width:18px;height:18px;flex:0 0 auto;"><path d="M20 6 9 17l-5-5"/></svg>Accès soirées &amp; sauna</li>
          <li style="display:flex;gap:10px;font-size:14px;color:rgba(255,255,255,.82);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:#04A49B;width:18px;height:18px;flex:0 0 auto;"><path d="M20 6 9 17l-5-5"/></svg>−10% sur les soins</li>
        </ul>
        <a href="/contact" style="text-align:center;padding:13px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:14px;font-weight:600;text-decoration:none;transition:background .2s;" class="mg-inline-hover">Rejoindre le Klub</a>
      </div>

      <div style="display:flex;flex-direction:column;background:#fff;border-radius:var(--r-l);box-shadow:0 6px 28px rgba(60,40,30,.07);padding:32px;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;color:rgba(51,51,52,.5);font-weight:600;">Flexible</p>
        <h3 style="margin:0 0 14px;font-size:var(--h3-l);font-weight:700;color:#003850;">Carte 10 séances</h3>
        <p style="margin:0 0 22px;font-size:38px;font-weight:800;color:#003850;letter-spacing:-.02em;">120€<span style="font-size:14px;font-weight:500;color:rgba(51,51,52,.5);"> / carte</span></p>
        <ul style="margin:0 0 26px;padding:0;list-style:none;display:flex;flex-direction:column;gap:11px;flex:1;">
          <li style="display:flex;gap:10px;font-size:14px;color:rgba(51,51,52,.72);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:#04A49B;width:18px;height:18px;flex:0 0 auto;"><path d="M20 6 9 17l-5-5"/></svg>10 small groups ou ateliers</li>
          <li style="display:flex;gap:10px;font-size:14px;color:rgba(51,51,52,.72);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:#04A49B;width:18px;height:18px;flex:0 0 auto;"><path d="M20 6 9 17l-5-5"/></svg>Valable 6 mois</li>
          <li style="display:flex;gap:10px;font-size:14px;color:rgba(51,51,52,.72);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:#04A49B;width:18px;height:18px;flex:0 0 auto;"><path d="M20 6 9 17l-5-5"/></svg>Partageable en duo</li>
        </ul>
        <a href="/contact" style="text-align:center;padding:13px;border-radius:var(--r-pill);border:1px solid #003850;color:#003850;font-size:14px;font-weight:600;text-decoration:none;transition:background .2s,color .2s;" class="mg-inline-hover">Acheter la carte</a>
      </div>
    </div>
    <p style="margin:30px 0 0;text-align:center;font-size:13px;color:rgba(51,51,52,.5);">Conférences seules&nbsp;: accès libre pour les membres du Klub · 10€ pour les non-membres.</p>
  </div>
</section>

<!-- ░░ CTA ░░ -->
<section style="background:#003850;padding:var(--sect-base) clamp(20px,5vw,48px);text-align:center;">
  <div style="max-width:760px;margin:0 auto;">
    <div style="width:56px;height:56px;border-radius:var(--r-m);background:rgba(4,164,155,.18);display:flex;align-items:center;justify-content:center;margin:0 auto 22px;animation:mk-float 4s ease-in-out infinite;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:#04A49B;width:28px;height:28px;"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg></div>
    <h2 style="margin:0 0 16px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.02em;color:#fff;">Le mouvement, ça se partage</h2>
    <p style="margin:0 0 30px;font-size:16px;line-height:1.6;color:rgba(255,255,255,.7);">Rejoignez la communauté Mugitu et réservez votre première session dès cette semaine.</p>
    <a href="/contact" style="display:inline-flex;align-items:center;gap:8px;padding:15px 32px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;transition:background .2s,transform .15s;" class="mg-inline-hover">Rejoindre le Mugi Klub <span>↗</span></a>
  </div>
</section>

<!-- ░░ CHECKOUT (Stripe-style) ░░ -->`,
};
