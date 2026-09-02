import type { ContentPage } from "./content-page";

/** Les 12 pages pathologie, servies sous /pathologies/<slug>. */
export const PATHOLOGIES: ContentPage[] = [
  {
    slug: "reeducation-lca",
    title: `Rééducation après rupture du LCA : les critères de retour au sport`,
    eyebrow: `Pathologie · genou`,
    lead: ``,
    crumb: `Rééducation du LCA`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    size: "m",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:var(--sect-tight) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:var(--r-l);padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Le diagnostic</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Le traitement</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Quand consulter vite</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Un ligament, mais surtout un genou à reconstruire</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">La rupture du ligament croisé antérieur survient le plus souvent sans contact, sur un changement de direction ou une réception. Le genou part en dedans, le ligament cède. Craquement, gonflement rapide, sensation d'instabilité : le tableau est souvent typique.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">L'opération n'est pas systématique. Elle se discute selon le sport pratiqué, l'âge, les lésions associées et l'instabilité ressentie au quotidien. Dans tous les cas, la rééducation fait le résultat, opéré ou non.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">La vraie difficulté n'est pas la cicatrisation du greffon mais la reconstruction de la force, du contrôle et de la confiance. C'est ce que mesurent les tests de retour au sport, et c'est là que se joue le risque de récidive.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:var(--r-l);padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#003850;">Ce qui structure le parcours</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une durée moyenne de neuf à douze mois avant le sport de pivot.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Un objectif de force du quadriceps à plus de 90 % du côté sain.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une batterie de sauts, mesurée et comparée.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">La confiance dans le genou, évaluée par questionnaire.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Le parcours</p>
      <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Les quatre étapes de la rééducation</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Opéré ou non, le chemin suit la même logique : récupérer un genou calme, puis fort, puis explosif, puis fiable.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Pré-opératoire</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Faire dégonfler, retrouver l'extension complète et un quadriceps qui répond. Un genou bien préparé récupère nettement mieux après.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Phase précoce</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Mobilité, réveil du quadriceps, marche normale sans boiterie. Le BFR permet de charger le muscle avec des charges légères.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Phase de force</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Musculation lourde, unilatérale, sur plusieurs mois. C'est la phase la plus longue et la plus souvent écourtée.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Phase de réathlétisation</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Pliométrie, changements de direction, gestes du sport, puis tests de retour au terrain.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">La décision</p>
    <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Sur quoi on autorise la reprise</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Le retour au sport de pivot se décide sur des critères mesurés, jamais sur une date isolée.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Critère 1</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">La force</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Force du quadriceps et des ischio-jambiers à plus de 90 % du côté sain, mesurée au dynamomètre. C'est le critère le plus souvent manquant au moment où le sportif se sent prêt.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Dynamomètre</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Symétrie > 90 %</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Quadriceps</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Critère 2</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Les sauts</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Batterie de hop tests : saut simple, triple, saut latéral, avec une symétrie et une qualité d'amorti comparables des deux côtés.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Hop tests</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Amorti</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Contrôle du genou</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Critère 3</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">La confiance</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Questionnaire de confiance et d'appréhension. Un genou fort mais redouté expose autant à la récidive qu'un genou faible.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Questionnaire ACL-RSI</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Appréhension</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Décision partagée</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">Le testing complet se fait au cabinet : voir <a href="/methodes/testing-vald" style="font-weight:600;">le testing de force</a> et <a href="/methodes/bfr" style="font-weight:600;">l'entraînement BFR</a> pour les phases précoces.</p>
</section>

<section id="science" style="background:#003850;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#fff;">Sur quoi repose cette prise en charge</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Grindem et al. · BJSM 2016</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Retarder le retour au sport au-delà de neuf mois et valider des critères de force réduit fortement le risque de nouvelle rupture.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Cohorte de Delaware-Oslo.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Br J Sports Med</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Chaque mois gagné avant le neuvième mois augmente sensiblement le risque de récidive chez les sportifs de pivot.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Études de suivi post-reconstruction.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Kyritsis et al.</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Ne pas remplir les critères de retour au sport multiplie le risque de nouvelle rupture chez les footballeurs professionnels.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Cohorte Aspetar.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:var(--h2-s);font-weight:700;letter-spacing:-.02em;color:#003850;">Quand reconsulter rapidement</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Pendant la rééducation, ces signes justifient un avis sans attendre la séance suivante.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Un genou qui regonfle brutalement après une séance ou une reprise.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une sensation de dérobement ou de blocage articulaire.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une perte d'extension complète qui s'installe.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur nocturne, une fièvre ou une rougeur autour des cicatrices.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Un mollet douloureux et gonflé, qui doit faire écarter une phlébite.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu'on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Faut-il forcément se faire opérer ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Non. Certains sportifs, notamment hors sports de pivot, retrouvent un genou stable sans chirurgie. La décision se prend au cas par cas, après une phase de rééducation.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Quand puis-je recourir en ligne droite ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">En général autour du troisième ou quatrième mois, si le genou est calme, l'extension complète et le quadriceps suffisant.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Pourquoi neuf mois minimum ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Parce que le risque de nouvelle rupture chute nettement au-delà, et que la force met ce temps à revenir chez la plupart des sportifs.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Le BFR sert-il vraiment ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Oui, en phase précoce : il permet de gagner du muscle avec des charges légères, quand le genou ne supporte pas encore les charges lourdes.</p></div>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="background:#fff;border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);box-shadow:0 6px 28px rgba(60,40,30,.08);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px;align-items:center;">
    <div style="display:flex;gap:18px;align-items:center;">
      <img src="/jb-colombie.jpg" alt="Jean-Baptiste Colombié, Kinésithérapeute du sport" style="width:78px;height:78px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
      <div>
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Écrit et validé par</p>
        <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#003850;">Jean-Baptiste Colombié</p>
        <p style="margin:0 0 8px;font-size:14px;color:rgba(51,51,52,.6);">Kinésithérapeute du sport</p>
        <a href="/equipe/jean-baptiste-colombie" style="font-size:14px;font-weight:600;text-decoration:none;">Voir sa fiche →</a>
      </div>
    </div>
    <div>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par le Dr Basile Carcassonne, médecin du sport, pour la partie décision chirurgicale et lésions associées.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour : 28 août 2026 · prochaine revue : février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d'information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/methodes/testing-vald" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Testing de force</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Les mesures qui autorisent la reprise.</p></a>
    <a href="/methodes/bfr" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Entraînement BFR</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Gagner du muscle en phase précoce.</p></a>
    <a href="/soins/bilan-retour-au-sport" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Bilan retour au sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">La batterie complète, en une séance.</p></a>
    <a href="/methodes/allyane" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Méthode Allyane®</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Réveiller un quadriceps qui ne répond pas.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:var(--r-xl);padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:var(--h2-m);font-weight:700;letter-spacing:-.025em;">Une reprise après LCA à sécuriser ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Testing complet et décision partagée au cabinet Mugitu, 3 avenue Kléber à Biarritz.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
  {
    slug: "tendinopathie-achille",
    title: `Tendinopathie d'Achille : symptômes, traitement et retour à la course`,
    eyebrow: `Pathologie · tendon`,
    lead: ``,
    crumb: `Tendinopathie d'Achille`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    size: "m",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:var(--sect-tight) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:var(--r-l);padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Le diagnostic</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Le traitement</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Quand consulter vite</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Un tendon dépassé, pas un tendon enflammé</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">La tendinopathie d'Achille apparaît quand la charge demandée au tendon dépasse, semaine après semaine, sa capacité à s'adapter. Le terme « tendinite » est trompeur : il s'agit d'un remaniement du tissu, pas d'une inflammation classique. C'est pour cela que le repos seul soulage sans réparer.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">On distingue deux localisations, qui ne se traitent pas tout à fait pareil : la forme <strong style="color:#003850;">corporéale</strong>, deux à six centimètres au-dessus du talon, et la forme <strong style="color:#003850;">d'insertion</strong>, au contact de l'os, plus sensible aux étirements et aux montées.</p>
      <p style="margin:0;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Les déclencheurs qu'on retrouve le plus souvent en consultation : une augmentation brutale du volume ou du dénivelé, un changement de chaussures, une reprise après coupure, du travail en côte, une raideur de cheville ou un mollet faible.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:var(--r-l);padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#003850;">Les signes qui parlent</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une raideur douloureuse aux premiers pas du matin, qui se dissipe en marchant.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une douleur qui s'échauffe au début de la sortie, puis revient après.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Un point précis douloureux au pincement du tendon.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><circle cx="12" cy="12" r="3"/><line x1="3" x2="9" y1="12" y2="12"/><line x1="15" x2="21" y1="12" y2="12"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Parfois un épaississement palpable, ou une gêne à la montée sur la pointe.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Au cabinet</p>
      <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Comment on pose le diagnostic</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Une consultation de trente à quarante-cinq minutes suffit dans la grande majorité des cas. L'imagerie n'arrive qu'en cas de doute.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'histoire de la charge</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Volume des dernières semaines, dénivelé, chaussures, sommeil, coupures. C'est là que se trouve presque toujours la cause.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'examen clinique</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Palpation localisée, mobilité de la cheville, test de montée sur pointe unipodale, recherche d'une cause différente.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Une mesure de départ</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Nombre de répétitions au mollet, force au dynamomètre, échelle de douleur. Le chiffre du jour 1 sert de référence pour la suite.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'imagerie si besoin</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Échographie en cas de suspicion de rupture partielle, de douleur atypique, ou d'évolution qui ne suit pas le plan.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Le traitement</p>
    <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Trois phases, une seule logique : recharger</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Le renforcement du triceps sural est le traitement de référence. Tout le reste — talonnette, massage, ondes de choc — accompagne, mais ne remplace pas.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:minmax(160px,.5fr) minmax(240px,2fr);gap:22px;align-items:start;">
      <div><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 1 · 1 à 3 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Calmer sans arrêter</h3></div>
      <div><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">On réduit ce qui pique — côtes, fractionné, gros volumes — sans supprimer la course si elle reste sous le seuil de douleur toléré. On installe le travail isométrique du mollet, qui apaise souvent la douleur dès les premières séances.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Isométrie</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Ajustement de charge</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Talonnette temporaire</span></div></div>
    </div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:minmax(160px,.5fr) minmax(240px,2fr);gap:22px;align-items:start;">
      <div><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 2 · 4 à 12 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Reconstruire la capacité</h3></div>
      <div><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Renforcement lourd et lent, genou tendu puis genou fléchi, trois séances par semaine. La charge augmente quand la douleur du lendemain matin reste stable. C'est la phase la plus longue et la plus décisive : elle demande de la régularité plus que de l'intensité.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Heavy slow resistance</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Mobilité cheville</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Suivi chiffré</span></div></div>
    </div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:minmax(160px,.5fr) minmax(240px,2fr);gap:22px;align-items:start;">
      <div><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 3 · dès 8 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Retrouver l'élasticité</h3></div>
      <div><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Sauts, rebonds, puis reprise structurée de la course : plat d'abord, allure facile, volume rendu progressivement. Le dénivelé et le fractionné reviennent en dernier. Une analyse de foulée sert souvent ici à corriger ce qui a déclenché la blessure.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Pliométrie</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Retour à la course</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Analyse de foulée</span></div></div>
    </div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">En cas d'évolution qui stagne, d'autres options se discutent au cas par cas : ondes de choc, mésothérapie, ou infiltration dans des situations précises. Elles se placent en complément du renforcement, jamais à sa place. Voir <a href="/methodes/mesotherapie" style="font-weight:600;">la mésothérapie</a> et <a href="/methodes/infiltrations" style="font-weight:600;">les infiltrations</a>.</p>
</section>

<section id="science" style="background:#003850;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#fff;">Sur quoi repose cette prise en charge</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;">
        <span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Alfredson · 1998</span>
        <p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Le protocole excentrique du mollet a montré, le premier, qu'un tendon douloureux s'améliore en étant chargé plutôt qu'épargné.</p>
        <p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Travail fondateur sur la tendinopathie corporéale.</p>
      </div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;">
        <span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Beyer et al. · AJSM 2015</span>
        <p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Le renforcement lourd et lent obtient des résultats comparables à l'excentrique, avec une meilleure adhésion des patients au programme.</p>
        <p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Essai randomisé, suivi à 12 mois.</p>
      </div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;">
        <span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Silbernagel et al. · 2007</span>
        <p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Poursuivre la course sous un seuil de douleur acceptable ne compromet pas la récupération par rapport à l'arrêt complet.</p>
        <p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Base du modèle « douleur tolérable » utilisé au cabinet.</p>
      </div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:var(--h2-s);font-weight:700;letter-spacing:-.02em;color:#003850;">Quand consulter sans attendre</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Ces situations sortent du cadre de la tendinopathie et demandent un avis médical rapide.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur brutale en pleine foulée, avec sensation de coup de fouet ou de claquement.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">L'impossibilité de monter sur la pointe du pied ou de marcher normalement.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Un creux palpable dans le trajet du tendon, un gonflement important ou un hématome.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">De la fièvre, une rougeur chaude, ou une douleur nocturne permanente.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une prise récente de fluoroquinolones, antibiotiques associés à un risque tendineux.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu'on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Combien de temps dure une tendinopathie d'Achille ?</h3>
        <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Une forme récente s'améliore souvent en six à douze semaines de renforcement progressif. Une forme installée depuis plusieurs mois demande généralement trois à six mois de travail régulier. La régularité pèse plus lourd que l'intensité.</p>
      </div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Faut-il arrêter complètement de courir ?</h3>
        <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Rarement. On ajuste le volume et l'intensité pour rester sous le seuil douloureux plutôt que d'arrêter, car le repos complet déconditionne le tendon et rend la reprise plus difficile.</p>
      </div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Une échographie est-elle nécessaire ?</h3>
        <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Le diagnostic est clinique. L'imagerie sert surtout à écarter une rupture partielle ou une autre cause quand l'évolution ne suit pas le plan. L'aspect du tendon à l'écran ne prédit pas la douleur.</p>
      </div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Les semelles ou les talonnettes soignent-elles le tendon ?</h3>
        <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Elles peuvent soulager pendant la phase douloureuse et faciliter le retour à l'activité. Elles ne remplacent pas le renforcement, qui reste le traitement de fond. Voir <a href="/soins/podologie" style="font-weight:600;">la podologie du sport</a>.</p>
      </div>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="background:#fff;border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);box-shadow:0 6px 28px rgba(60,40,30,.08);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px;align-items:center;">
    <div style="display:flex;gap:18px;align-items:center;">
      <img src="/basile-carcassonne.jpg" alt="Dr Basile Carcassonne, médecin du sport" style="width:78px;height:78px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
      <div>
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Écrit et validé par</p>
        <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#003850;">Dr Basile Carcassonne</p>
        <p style="margin:0 0 8px;font-size:14px;color:rgba(51,51,52,.6);">Médecin du sport · traumatologie</p>
        <a href="/equipe/basile-carcassonne" style="font-size:14px;font-weight:600;text-decoration:none;">Voir sa fiche →</a>
      </div>
    </div>
    <div>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par Jean-Baptiste Colombié, kinésithérapeute du sport, pour la partie rééducation et retour à la course.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour : 28 août 2026 · prochaine revue : février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d'information. Elle ne remplace pas une consultation : chaque tendon, chaque histoire d'entraînement est différente.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/methodes/clinique-du-coureur" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover">
      <h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">La Clinique du Coureur®</h3>
      <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Analyse de foulée et gestion de la charge d'entraînement.</p>
    </a>
    <a href="/methodes/testing-vald" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover">
      <h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Testing de force</h3>
      <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Mesurer les asymétries pour décider du retour au sport.</p>
    </a>
    <a href="/soins/osteopathie" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover">
      <h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Ostéopathie du sport</h3>
      <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Mobilité de cheville et travail des chaînes postérieures.</p>
    </a>
    <a href="/soins/medecine-du-sport" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover">
      <h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Médecine du sport</h3>
      <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Consultation et suivi de la traumatologie au cabinet.</p>
    </a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:var(--r-xl);padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:var(--h2-m);font-weight:700;letter-spacing:-.025em;">Une douleur d'Achille qui traîne ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Consultation au cabinet Mugitu, 3 avenue Kléber à Biarritz. Bilan, plan de charge et suivi chiffré dès la première séance.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
  {
    slug: "pubalgie",
    title: `Pubalgie : comprendre une douleur qui traîne`,
    eyebrow: `Pathologie · pubis`,
    lead: ``,
    crumb: `Pubalgie`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    size: "m",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:var(--sect-tight) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:var(--r-l);padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Le diagnostic</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Le traitement</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Quand consulter vite</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Un carrefour de contraintes</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Le pubis est le point de rencontre des adducteurs, des abdominaux et des muscles profonds du bassin. Dans les sports de changement de direction, de frappe et de contact, cette zone encaisse des forces contraires à chaque appui. Quand la charge dépasse la capacité, la douleur s'installe.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">On parle aujourd'hui de douleur inguinale liée au sport, en distinguant l'atteinte des adducteurs — la plus fréquente — de celle du pubis, du psoas ou de la paroi abdominale. Ces formes se mélangent souvent chez un même sportif.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">C'est une blessure de patience. Comptez huit à seize semaines de rééducation active pour une forme installée, avec une reprise progressive et non un arrêt suivi d'un retour brutal.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:var(--r-l);padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#003850;">Les signes qui parlent</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une douleur d'aine, souvent d'un seul côté, difficile à localiser précisément.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Elle réapparaît à l'accélération, au changement d'appui, à la frappe.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une raideur douloureuse le lendemain des matchs et au lever.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"/><path d="m2.5 21.5 1.4-1.4"/><path d="m20.1 3.9 1.4-1.4"/><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"/><path d="m9.6 14.4 4.8-4.8"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une faiblesse à la contraction des adducteurs, jambes serrées.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Au cabinet</p>
      <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Trouver quelle structure parle</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">L'examen clinique oriente vers une des grandes formes. L'imagerie sert à écarter les diagnostics à ne pas manquer, pas à confirmer la pubalgie.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'histoire du sportif</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Poste, volume, reprise de saison, matchs enchaînés, antécédents de lésion des adducteurs.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">La palpation ciblée</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Insertion des adducteurs, pubis, canal inguinal, psoas : chaque zone donne une orientation différente.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Les tests de force</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Adduction résistée, squeeze test, comparaison des deux côtés au dynamomètre.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Les diagnostics à écarter</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Fracture de fatigue de la branche pubienne, pathologie de hanche, hernie, cause urologique ou gynécologique.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Le traitement</p>
    <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Renforcer les adducteurs, pas les étirer</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Le renforcement progressif des adducteurs est le traitement de référence. Le repos seul soulage puis la douleur revient dès la reprise.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 1 · 2 à 4 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Baisser l'irritabilité</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">On retire temporairement les gestes déclencheurs — sprints, frappes, changements de direction — sans arrêter toute activité. Isométries d'adduction et travail du tronc en douceur.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Isométrie adducteurs</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Gainage</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Ajustement de charge</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 2 · 4 à 10 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Charger progressivement</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Renforcement excentrique et concentrique des adducteurs, type protocole Copenhague, associé au travail des abdominaux profonds et des fessiers. Trois séances par semaine.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Copenhagen adduction</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Fessiers</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Tronc</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 3 · dès 8 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Retour au terrain</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Réintroduction des courses, appuis, frappes puis contacts, dans cet ordre. Les critères de reprise sont un squeeze test indolore et une force d'adduction symétrique.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Course</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Appuis</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Retour au jeu</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">Chez le rugbyman, la pubalgie s'inscrit souvent dans une saison trop dense : voir <a href="/sports/rugby" style="font-weight:600;">le suivi des rugbymen</a> et <a href="/methodes/testing-vald" style="font-weight:600;">le testing de force</a> pour objectiver la reprise.</p>
</section>

<section id="science" style="background:#003850;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#fff;">Sur quoi repose cette prise en charge</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Doha agreement · 2015</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Un consensus international a établi la terminologie actuelle des douleurs inguinales du sportif, par entité clinique plutôt que par le mot pubalgie.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Accord d'experts, Doha.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Hölmich et al. · Lancet</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Un programme actif de renforcement des adducteurs donne de bien meilleurs résultats que le traitement passif.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Essai randomisé sur la douleur d'adducteurs.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Br J Sports Med</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Le protocole Copenhagen adduction réduit l'incidence des blessures d'aine dans les sports collectifs.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Essais de prévention en football.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:var(--h2-s);font-weight:700;letter-spacing:-.02em;color:#003850;">Quand consulter sans attendre</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Ces signes évoquent autre chose qu'une pubalgie.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur brutale avec impossibilité d'appui après un geste violent.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une masse ou un renflement dans l'aine, surtout à la toux.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">De la fièvre, des brûlures urinaires, du sang dans les urines.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur qui empire au repos et la nuit.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Un blocage de hanche ou une boiterie qui s'installe.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu'on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Faut-il opérer une pubalgie ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Rarement, et jamais en première intention. La chirurgie ne se discute qu'après plusieurs mois de rééducation active bien conduite et sans résultat.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Les étirements aident-ils ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Peu, et ils irritent parfois la zone. Le renforcement progressif est bien mieux documenté.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Combien de temps d'arrêt ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">On évite l'arrêt complet. La reprise du sport se fait par paliers, en général entre huit et seize semaines selon l'ancienneté.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Pourquoi ça revient chaque saison ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Le plus souvent parce que la reprise a été décidée sur la disparition de la douleur, sans avoir retrouvé la force d'adduction du côté sain.</p></div>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="background:#fff;border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);box-shadow:0 6px 28px rgba(60,40,30,.08);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px;align-items:center;">
    <div style="display:flex;gap:18px;align-items:center;">
      <img src="/jb-colombie.jpg" alt="Jean-Baptiste Colombié, Kinésithérapeute du sport" style="width:78px;height:78px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
      <div>
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Écrit et validé par</p>
        <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#003850;">Jean-Baptiste Colombié</p>
        <p style="margin:0 0 8px;font-size:14px;color:rgba(51,51,52,.6);">Kinésithérapeute du sport</p>
        <a href="/equipe/jean-baptiste-colombie" style="font-size:14px;font-weight:600;text-decoration:none;">Voir sa fiche →</a>
      </div>
    </div>
    <div>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par le Dr Basile Carcassonne, médecin du sport, pour la partie diagnostic différentiel et imagerie.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour : 28 août 2026 · prochaine revue : février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d'information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/sports/rugby" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Suivi des rugbymen</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Traumatologie de contact et charge de saison.</p></a>
    <a href="/methodes/testing-vald" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Testing de force</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Objectiver la symétrie avant le retour au jeu.</p></a>
    <a href="/methodes/preparation-physique" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Préparation physique</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Reconstruire une base de force sur l'intersaison.</p></a>
    <a href="/soins/medecine-du-sport" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Médecine du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Consultation et imagerie quand c'est utile.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:var(--r-xl);padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:var(--h2-m);font-weight:700;letter-spacing:-.025em;">Une douleur d'aine qui dure ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Bilan clinique et programme de renforcement au cabinet Mugitu, 3 avenue Kléber à Biarritz.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
  {
    slug: "entorse-de-cheville",
    title: `Entorse de cheville : délais réels et reprise du sport`,
    eyebrow: `Pathologie · cheville`,
    lead: ``,
    crumb: `Entorse de cheville`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    size: "m",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:var(--sect-tight) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:var(--r-l);padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Le diagnostic</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Le traitement</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Quand consulter vite</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Une cheville qui perd ses repères</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">L'entorse correspond à l'étirement ou à la rupture des ligaments latéraux de la cheville, le plus souvent lors d'une torsion du pied vers l'intérieur. La douleur et le gonflement des premiers jours ne disent pas grand-chose de la gravité réelle.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Ce qui compte davantage, c'est ce qui reste après : la cheville perd une partie de ses informations sensorielles. Le pied réagit moins vite aux déséquilibres, et c'est cette perte de proprioception, plus que le ligament lui-même, qui explique les récidives.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Une entorse bien prise en charge se rééduque en quatre à huit semaines. Une entorse laissée à elle-même laisse souvent une instabilité chronique qui dure des années.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:var(--r-l);padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#003850;">Ce qu'on évalue</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">La capacité à poser le pied et à faire quatre pas juste après le traumatisme.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">La douleur à la palpation des malléoles et du bord externe du pied.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Le gonflement et l'hématome, qui n'indiquent pas la gravité à eux seuls.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M12 2v20"/><path d="m15 19-3 3-3-3"/><path d="m19 9 3 3-3 3"/><path d="M2 12h20"/><path d="m5 9-3 3 3 3"/><path d="m9 5 3-3 3 3"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">La stabilité des ligaments, testée une fois la douleur calmée.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Au cabinet</p>
      <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Radio ou pas radio ?</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Les critères d'Ottawa permettent de décider sans imagerie inutile. Ils sont fiables et utilisés partout.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Les critères d'Ottawa</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Radiographie si douleur osseuse sur les malléoles ou certains os du pied, ou impossibilité de faire quatre pas.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'examen ligamentaire</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Tests de tiroir et de varus, souvent plus informatifs après quelques jours, quand la douleur a diminué.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">La recherche de pièges</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Fracture du 5e métatarsien, lésion des ligaments tibio-fibulaires, atteinte du tendon fibulaire.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Le bilan fonctionnel</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Équilibre unipodal, montée sur pointe, sauts. C'est lui qui pilotera la reprise.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Le traitement</p>
    <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Bouger tôt, rééduquer longtemps</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Le repos strict n'est plus recommandé. La mise en charge précoce protégée accélère la récupération, et la proprioception prévient la récidive.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 1 · 3 à 7 jours</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Protéger et remettre en charge</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Protection relative, glace si elle soulage, compression, surélévation. On remarche dès que possible, avec une attelle ou un strap si nécessaire. L'appui précoce est un facteur de bonne récupération.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Protection</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Appui précoce</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Attelle</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 2 · 1 à 4 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Mobilité et force</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Récupération de la flexion de cheville, renforcement des fibulaires et du triceps, travail de l'équilibre sur une jambe, d'abord au sol puis sur surface instable.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Mobilité</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Fibulaires</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Proprioception</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 3 · 4 à 8 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Retour au terrain</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Sauts, changements de direction, gestes du sport pratiqué. La reprise se décide sur des critères de force et d'équilibre, pas sur un délai au calendrier.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Pliométrie</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Appuis</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Retour au sport</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">Les entorses répétées justifient un bilan complet : voir <a href="/methodes/testing-vald" style="font-weight:600;">le testing de force</a> et <a href="/soins/podologie" style="font-weight:600;">la podologie du sport</a> pour la statique du pied.</p>
</section>

<section id="science" style="background:#003850;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#fff;">Sur quoi repose cette prise en charge</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Ottawa Ankle Rules · BMJ</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Ces critères cliniques détectent la quasi-totalité des fractures et évitent une majorité de radiographies inutiles.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Règles validées sur de larges cohortes.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Br J Sports Med · 2018</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">L'entraînement proprioceptif réduit d'environ moitié le risque de récidive après une première entorse.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Consensus international sur l'entorse latérale.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Cochrane</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">La mobilisation précoce donne de meilleurs résultats fonctionnels que l'immobilisation prolongée dans les entorses bénignes à modérées.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Revues comparant immobilisation et traitement fonctionnel.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:var(--h2-s);font-weight:700;letter-spacing:-.02em;color:#003850;">Quand consulter sans attendre</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Ces situations demandent un avis rapide et souvent une imagerie.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">L'impossibilité de poser le pied et de faire quatre pas.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur osseuse marquée sur une malléole ou sur le bord externe du pied.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une déformation visible de la cheville.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Un gonflement énorme et immédiat, avec un hématome étendu.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une cheville qui reste instable et lâche plusieurs semaines après.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu'on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Combien de temps avant de reprendre le sport ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Deux à quatre semaines pour une entorse bénigne, six à huit pour une forme sévère. La décision se prend sur des tests, pas sur une date.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Faut-il immobiliser la cheville ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Rarement de façon stricte. Une protection courte peut aider les premiers jours, mais la mise en charge précoce donne de meilleurs résultats.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Le strapping sert-il à quelque chose ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Oui, en reprise et pour les sports à pivot : il diminue le risque de récidive sur les premiers mois. Il ne remplace pas la rééducation.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Pourquoi ma cheville se tord-elle encore ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">C'est le signe d'une instabilité chronique, liée à un déficit de proprioception et de force. Elle se rééduque, même des années après.</p></div>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="background:#fff;border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);box-shadow:0 6px 28px rgba(60,40,30,.08);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px;align-items:center;">
    <div style="display:flex;gap:18px;align-items:center;">
      <img src="/basile-carcassonne.jpg" alt="Dr Basile Carcassonne, Médecin du sport · traumatologie" style="width:78px;height:78px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
      <div>
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Écrit et validé par</p>
        <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#003850;">Dr Basile Carcassonne</p>
        <p style="margin:0 0 8px;font-size:14px;color:rgba(51,51,52,.6);">Médecin du sport · traumatologie</p>
        <a href="/equipe/basile-carcassonne" style="font-size:14px;font-weight:600;text-decoration:none;">Voir sa fiche →</a>
      </div>
    </div>
    <div>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par Jean-Baptiste Colombié, kinésithérapeute du sport, pour la partie rééducation et retour au terrain.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour : 28 août 2026 · prochaine revue : février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d'information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/soins/podologie" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Podologie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Statique du pied, semelles et appuis.</p></a>
    <a href="/methodes/testing-vald" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Testing de force</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Objectiver la force et l'équilibre avant la reprise.</p></a>
    <a href="/soins/medecine-du-sport" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Médecine du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Consultation et suivi de la traumatologie.</p></a>
    <a href="/soins/kinesitherapie-du-sport" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Kinésithérapie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">La rééducation active de la cheville.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:var(--r-xl);padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:var(--h2-m);font-weight:700;letter-spacing:-.025em;">Une cheville qui se tord trop souvent ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Bilan complet et programme de proprioception au cabinet Mugitu, 3 avenue Kléber à Biarritz.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
  {
    slug: "lesion-ischio-jambiers",
    title: `Lésion des ischio-jambiers : du diagnostic au sprint`,
    eyebrow: `Pathologie · muscle`,
    lead: ``,
    crumb: `Ischio-jambiers`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    size: "m",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:var(--sect-tight) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:var(--r-l);padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Le diagnostic</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Le traitement</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Quand consulter vite</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Un muscle surpris en pleine vitesse</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">La lésion survient le plus souvent en fin de phase d'élan du sprint, quand les ischio-jambiers freinent l'extension du genou en se contractant tout en s'allongeant. Le muscle cède là où il travaille le plus fort. La douleur est brutale, parfois accompagnée d'un claquement.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">La gravité se mesure sur l'étendue de la lésion et sur sa localisation. Une atteinte proche du tendon proximal met plus de temps à cicatriser qu'une lésion en plein corps musculaire, à taille égale.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Les délais annoncés varient beaucoup, de dix jours à plusieurs mois. Ce qui prédit le mieux le retour au sport, ce n'est pas l'imagerie mais la récupération de la force et de l'indolence sur les tests.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:var(--r-l);padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#003850;">Ce qu'on évalue</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Le mécanisme : sprint, changement d'appui, étirement brutal.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">La localisation précise de la douleur sur le trajet du muscle.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">La présence d'un hématome ou d'une dépression palpable.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">La force en flexion de genou, comparée au côté sain.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Au cabinet</p>
      <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Évaluer sans surinterpréter</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">L'examen clinique classe la lésion. L'échographie précise l'étendue quand cela change la prise en charge ou les délais annoncés.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Le récit du geste</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Sprint lancé, démarrage, étirement, contact : le mécanisme oriente déjà le pronostic.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'examen musculaire</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Palpation du trajet, distance à la tubérosité ischiatique, tests de force et d'allongement.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'échographie si utile</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">À distance de la blessure, pour préciser l'étendue ou écarter une désinsertion tendineuse.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">La mesure de force</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Dynamomètre en flexion de genou et test nordique. Ces chiffres pilotent toute la reprise.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Le traitement</p>
    <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Charger tôt, sprinter tard</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">La rééducation repose sur le renforcement excentrique en amplitude longue, puis sur une réintroduction très progressive de la vitesse.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 1 · 3 à 7 jours</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Protéger et remobiliser</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Protection courte, marche normale dès que possible, contractions douces et sans douleur. On évite les étirements agressifs, qui retardent la cicatrisation.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Protection courte</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Mobilisation douce</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Pas d'étirement forcé</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 2 · 1 à 5 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Renforcer en longueur</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Excentrique progressif — nordic hamstring, extensions de hanche, travail en amplitude longue — associé au renforcement du tronc et des fessiers. La charge augmente chaque semaine tant que la douleur reste absente.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Nordic hamstring</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Amplitude longue</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Fessiers</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 3 · dès 3 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Remonter la vitesse</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Réintroduction graduée de la course puis du sprint, par paliers de pourcentage de vitesse maximale. Le sprint à pleine vitesse est le dernier critère validé avant la compétition.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Course</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Sprint progressif</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Retour au sport</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">Le nordic hamstring, maintenu en entretien, reste le geste préventif le mieux documenté du sport collectif : voir <a href="/methodes/preparation-physique" style="font-weight:600;">la préparation physique</a>.</p>
</section>

<section id="science" style="background:#003850;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#fff;">Sur quoi repose cette prise en charge</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Br J Sports Med · 2019</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Le nordic hamstring réduit d'environ moitié le risque de lésion des ischio-jambiers dans les équipes qui l'appliquent réellement.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Méta-analyses des programmes de prévention.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Askling et al. · 2013</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Un protocole privilégiant les exercices en amplitude longue raccourcit le délai de retour au sport par rapport à un protocole conventionnel.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Essai randomisé chez footballeurs.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">AJSM</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Les déficits de force résiduels au moment de la reprise sont associés à un risque accru de récidive.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Études de suivi post-lésionnel.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:var(--h2-s);font-weight:700;letter-spacing:-.02em;color:#003850;">Quand consulter sans attendre</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Ces situations font suspecter une lésion sévère.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur brutale avec impossibilité de marcher normalement.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Un hématome étendu et une dépression palpable dans le muscle.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur très haute, au contact de l'os du bassin, chez un sportif jeune.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une perte de force massive persistant au-delà de quelques jours.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Des fourmillements ou une douleur descendant dans le mollet et le pied.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu'on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Combien de temps avant de rejouer ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">De deux semaines pour une atteinte mineure à plus de deux mois pour une lésion proche du tendon. La date se décide sur les tests de force et de sprint, pas sur le calendrier.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Faut-il une échographie ou une IRM ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Utile quand la lésion semble importante ou que le délai annoncé compte, par exemple en compétition. Elle n'est pas indispensable dans les formes bénignes.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Peut-on s'étirer ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Pas fortement dans les premières semaines. On préfère le renforcement en amplitude longue, mieux toléré et plus efficace.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Pourquoi ça récidive ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Le plus souvent à cause d'une reprise avant récupération complète de la force excentrique et d'une exposition au sprint trop tardive dans la rééducation.</p></div>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="background:#fff;border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);box-shadow:0 6px 28px rgba(60,40,30,.08);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px;align-items:center;">
    <div style="display:flex;gap:18px;align-items:center;">
      <img src="/basile-carcassonne.jpg" alt="Dr Basile Carcassonne, Médecin du sport · traumatologie" style="width:78px;height:78px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
      <div>
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Écrit et validé par</p>
        <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#003850;">Dr Basile Carcassonne</p>
        <p style="margin:0 0 8px;font-size:14px;color:rgba(51,51,52,.6);">Médecin du sport · traumatologie</p>
        <a href="/equipe/basile-carcassonne" style="font-size:14px;font-weight:600;text-decoration:none;">Voir sa fiche →</a>
      </div>
    </div>
    <div>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par Jean-Baptiste Colombié, kinésithérapeute du sport, pour la rééducation et le retour au sprint.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour : 28 août 2026 · prochaine revue : février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d'information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/methodes/testing-vald" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Testing de force</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Mesurer la force et les asymétries avant la reprise.</p></a>
    <a href="/methodes/preparation-physique" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Préparation physique</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Nordic hamstring et prévention en entretien.</p></a>
    <a href="/sports/rugby" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Suivi des rugbymen</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Sprints, contacts et densité de matchs.</p></a>
    <a href="/methodes/bfr" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Entraînement BFR</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Maintenir la masse musculaire en phase précoce.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:var(--r-xl);padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:var(--h2-m);font-weight:700;letter-spacing:-.025em;">Un ischio qui a lâché ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Bilan clinique et protocole de retour au sprint au cabinet Mugitu, Biarritz.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
  {
    slug: "periostite-tibiale",
    title: `Périostite tibiale : gérer la charge avant le repos`,
    eyebrow: `Pathologie · jambe`,
    lead: ``,
    crumb: `Périostite tibiale`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    size: "m",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:var(--sect-tight) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:var(--r-l);padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Le diagnostic</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Le traitement</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Quand consulter vite</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">L'os qui proteste</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Le syndrome de stress tibial médial, appelé périostite, correspond à une souffrance du bord interne du tibia sous l'effet des impacts répétés. La douleur est diffuse, s'étend sur plusieurs centimètres, et apparaît d'abord en début de sortie avant de s'échauffer.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">C'est presque toujours une histoire de charge : reprise après coupure, passage sur route dure, augmentation rapide du kilométrage, ou changement de chaussures. Une faiblesse du mollet et une cadence basse aggravent l'impact à chaque foulée.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">La distinction avec la fracture de fatigue est essentielle. Une douleur qui devient très localisée, présente au repos et à la marche, doit faire changer de diagnostic et d'attitude.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:var(--r-l);padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#003850;">Les signes qui parlent</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une douleur étalée sur plusieurs centimètres du bord interne du tibia.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Elle s'échauffe en début de sortie, puis revient après l'effort.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Un lien net avec une hausse récente du volume ou du dénivelé.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">À l'inverse, un point exquis d'un centimètre doit faire penser à une fracture de fatigue.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Au cabinet</p>
      <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Périostite ou fracture de fatigue ?</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">La distinction se fait d'abord cliniquement. En cas de doute, l'imagerie tranche, car la conduite à tenir n'est pas la même.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">La cartographie de la douleur</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Étendue et localisation précise à la palpation : diffuse oriente vers la périostite, ponctuelle vers l'os.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'histoire d'entraînement</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Volume des six dernières semaines, surface, chaussures, dénivelé, reprise après arrêt.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Les facteurs associés</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Force du mollet, mobilité de cheville, cadence de course, statique du pied, statut nutritionnel.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'imagerie si doute</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">IRM en cas de suspicion de fracture de fatigue : la radiographie est souvent normale au début.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Le traitement</p>
    <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Réduire l'impact, renforcer le mollet</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Le traitement tient en deux volets : baisser temporairement la charge d'impact, et augmenter la capacité de la jambe à l'encaisser.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 1 · 1 à 3 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Baisser l'impact</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Réduction du volume de course, bascule partielle sur vélo ou natation, surfaces plus souples. On garde de l'activité : l'arrêt total fait perdre la capacité osseuse et musculaire.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Volume réduit</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Cross-training</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Surface souple</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 2 · 3 à 8 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Construire la jambe</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Renforcement du triceps et des muscles du pied, travail en charge progressive, puis sauts légers. On augmente aussi la cadence de course de quelques pas par minute pour diminuer l'impact.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Mollet</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Pied</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Cadence</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 3 · dès 6 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Remonter le kilométrage</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Progression du volume par paliers modestes, une variable à la fois. Le dénivelé et les surfaces dures reviennent en dernier.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Progression</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Une variable à la fois</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Suivi</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">L'analyse de foulée aide à réduire durablement l'impact : voir <a href="/methodes/clinique-du-coureur" style="font-weight:600;">La Clinique du Coureur®</a>. Chez les coureuses, une périostite récidivante justifie un bilan nutritionnel et hormonal.</p>
</section>

<section id="science" style="background:#003850;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#fff;">Sur quoi repose cette prise en charge</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Br J Sports Med</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Le facteur de risque le plus constant du stress tibial médial est une augmentation rapide de la charge d'entraînement.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Revues sur les blessures du coureur.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Med Sci Sports Exerc · 2011</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Augmenter la cadence de course réduit les forces d'impact et les charges sur le membre inférieur.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Heiderscheit et al.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Sports Med</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Le renforcement du triceps sural et les exercices en charge améliorent la tolérance osseuse aux impacts répétés.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Travaux sur l'adaptation osseuse à la charge.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:var(--h2-s);font-weight:700;letter-spacing:-.02em;color:#003850;">Quand consulter sans attendre</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Ces signes évoquent une fracture de fatigue plutôt qu'une périostite.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur très localisée, sur moins de deux centimètres, exquise à la pression.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur présente à la marche, voire au repos et la nuit.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur qui apparaît de plus en plus tôt dans la sortie, séance après séance.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Un gonflement local ou une chaleur sur le tibia.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Chez une coureuse : des règles absentes ou irrégulières associées.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu'on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Dois-je arrêter complètement de courir ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Rarement. On réduit fortement le volume et l'impact plutôt que d'arrêter, sauf si la douleur persiste à la marche.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Combien de temps ça dure ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Quatre à huit semaines dans les formes récentes, plus longtemps si la douleur traîne depuis des mois.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Les semelles règlent-elles le problème ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Elles peuvent aider sur certains pieds, mais la gestion de la charge et le renforcement restent le traitement principal.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Comment éviter la récidive ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">En progressant lentement, une variable à la fois, et en gardant un renforcement du mollet toute l'année.</p></div>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="background:#fff;border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);box-shadow:0 6px 28px rgba(60,40,30,.08);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px;align-items:center;">
    <div style="display:flex;gap:18px;align-items:center;">
      <img src="/jb-colombie.jpg" alt="Jean-Baptiste Colombié, Kinésithérapeute du sport" style="width:78px;height:78px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
      <div>
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Écrit et validé par</p>
        <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#003850;">Jean-Baptiste Colombié</p>
        <p style="margin:0 0 8px;font-size:14px;color:rgba(51,51,52,.6);">Kinésithérapeute du sport</p>
        <a href="/equipe/jean-baptiste-colombie" style="font-size:14px;font-weight:600;text-decoration:none;">Voir sa fiche →</a>
      </div>
    </div>
    <div>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par le Dr Basile Carcassonne, médecin du sport, pour la distinction avec la fracture de fatigue.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour : 28 août 2026 · prochaine revue : février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d'information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/pathologies/fracture-de-fatigue" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Fracture de fatigue</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Le diagnostic à ne pas manquer.</p></a>
    <a href="/methodes/clinique-du-coureur" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">La Clinique du Coureur®</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Analyse de foulée et charge d'entraînement.</p></a>
    <a href="/sports/trail-et-course" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Trail et course à pied</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Préparer une saison sans casse.</p></a>
    <a href="/soins/podologie" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Podologie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Appuis, chaussage et semelles.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:var(--r-xl);padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:var(--h2-m);font-weight:700;letter-spacing:-.025em;">Des tibias qui brûlent à chaque sortie ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Bilan et plan de charge au cabinet Mugitu, 3 avenue Kléber à Biarritz.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
  {
    slug: "syndrome-rotulien",
    title: `Syndrome rotulien : pourquoi le genou du coureur fait mal`,
    eyebrow: `Pathologie · genou`,
    lead: ``,
    crumb: `Syndrome rotulien`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    size: "m",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:var(--sect-tight) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:var(--r-l);padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Le diagnostic</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Le traitement</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Quand consulter vite</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Un problème de charge, pas de rotule mal placée</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Le syndrome fémoro-patellaire désigne une douleur à l'avant du genou, autour ou sous la rotule, sans lésion visible. Longtemps expliqué par un « mauvais alignement » de la rotule, il est aujourd'hui compris comme un déséquilibre entre ce qu'on demande à l'articulation et ce qu'elle sait encaisser.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Les facteurs qu'on retrouve le plus souvent : une hausse rapide du volume ou du dénivelé négatif, un quadriceps et des fessiers sous-développés par rapport à la charge, une cadence de course basse, ou une reprise après plusieurs semaines d'arrêt.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Bonne nouvelle : c'est une douleur qui ne détruit rien. Le cartilage n'est pas « usé » et le pronostic est bon, à condition de traiter la cause plutôt que le symptôme.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:var(--r-l);padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#003850;">Les signes qui parlent</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une douleur en descente d'escalier ou de sentier, plus qu'en montée.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M5 18v2"/><path d="M19 18v2"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Le « signe du cinéma » : gêne après une longue position assise, genou plié.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une douleur diffuse, difficile à montrer du doigt, autour de la rotule.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Des craquements ou des sensations d'accrochage, souvent sans gravité.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Au cabinet</p>
      <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Comment on pose le diagnostic</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Le diagnostic est clinique. L'imagerie n'a d'intérêt qu'en cas de blocage, de gonflement important ou de traumatisme.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'histoire de la charge</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Kilométrage, dénivelé, changement de terrain ou de chaussures, reprise. La cause est presque toujours là.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'examen du genou</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Localisation de la douleur, mobilité, tests de compression fémoro-patellaire, recherche d'un épanchement.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Le contrôle en charge</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Squat unipodal, descente de marche : on regarde le genou rentrer en dedans et le bassin s'affaisser.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Une mesure de départ</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Force du quadriceps et des abducteurs au dynamomètre, échelle de douleur. Le chiffre initial sert de référence.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Le traitement</p>
    <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Renforcer la hanche autant que le genou</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Le traitement de référence associe renforcement du quadriceps, travail des fessiers et ajustement de la charge d'entraînement. La rééducation dure typiquement six à douze semaines.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 1 · 1 à 3 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Faire baisser l'irritabilité</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">On réduit ce qui provoque la douleur — descentes, escaliers, longues sorties — sans arrêter l'activité. Le travail isométrique du quadriceps est bien toléré et soulage souvent dès la première semaine.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Isométrie</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Ajustement de charge</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Cadence de course</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 2 · 3 à 10 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Reconstruire la force</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Renforcement progressif du quadriceps sur amplitude tolérée, puis travail des abducteurs et rotateurs de hanche. Deux à trois séances par semaine, avec une charge qui augmente tant que la douleur du lendemain reste stable.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Quadriceps</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Fessiers</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Contrôle moteur</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 3 · dès 6 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Revenir à la course</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Reprise sur terrain plat, allure facile, volume rendu progressivement. Une cadence légèrement plus élevée réduit la charge au genou et facilite souvent la reprise. Le dénivelé négatif revient en dernier.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Retour à la course</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Cadence</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Pliométrie</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">Une analyse de foulée aide à identifier ce qui a déclenché la blessure : voir <a href="/methodes/clinique-du-coureur" style="font-weight:600;">La Clinique du Coureur®</a>. Des semelles peuvent soulager transitoirement — voir <a href="/soins/podologie" style="font-weight:600;">la podologie du sport</a>.</p>
</section>

<section id="science" style="background:#003850;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#fff;">Sur quoi repose cette prise en charge</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Consensus international · 2016</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Le renforcement combiné hanche et genou soulage mieux la douleur que le travail du genou seul.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Manchester Patellofemoral Pain Consensus.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Br J Sports Med · 2015</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Aucune preuve solide ne soutient l'idée d'un mauvais alignement rotulien à corriger ; la charge est le facteur central.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Revues sur les facteurs de risque fémoro-patellaires.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Med Sci Sports Exerc · 2011</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Augmenter la cadence d'environ 10 % réduit nettement les charges au genou pendant la course.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Heiderscheit et al.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:var(--h2-s);font-weight:700;letter-spacing:-.02em;color:#003850;">Quand consulter sans attendre</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Ces signes évoquent autre chose qu'un syndrome rotulien.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Un genou qui gonfle rapidement après un traumatisme ou une torsion.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Un blocage du genou, ou une sensation qu'il se dérobe.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur nocturne permanente, une fièvre ou une rougeur chaude.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur très localisée sur l'os, qui empire à chaque appui.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu'on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Puis-je continuer à courir ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Le plus souvent oui, en réduisant le volume, en évitant les descentes et en restant sous un seuil de douleur acceptable qui disparaît dans les 24 heures.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Faut-il une radio ou une IRM ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Pas en première intention. L'imagerie ne montre généralement rien et n'oriente pas le traitement, sauf traumatisme ou blocage.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Combien de temps pour aller mieux ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Six à douze semaines dans la majorité des cas, avec un renforcement régulier. Les formes anciennes demandent plus de patience.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Le vélo est-il autorisé ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Souvent oui, en réglant la selle un peu haute et en évitant les gros braquets et les montées longues au début.</p></div>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="background:#fff;border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);box-shadow:0 6px 28px rgba(60,40,30,.08);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px;align-items:center;">
    <div style="display:flex;gap:18px;align-items:center;">
      <img src="/jb-colombie.jpg" alt="Jean-Baptiste Colombié, Kinésithérapeute du sport" style="width:78px;height:78px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
      <div>
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Écrit et validé par</p>
        <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#003850;">Jean-Baptiste Colombié</p>
        <p style="margin:0 0 8px;font-size:14px;color:rgba(51,51,52,.6);">Kinésithérapeute du sport</p>
        <a href="/equipe/jean-baptiste-colombie" style="font-size:14px;font-weight:600;text-decoration:none;">Voir sa fiche →</a>
      </div>
    </div>
    <div>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par le Dr Basile Carcassonne, médecin du sport, pour la partie diagnostic différentiel.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour : 28 août 2026 · prochaine revue : février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d'information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/methodes/clinique-du-coureur" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">La Clinique du Coureur®</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Analyse de foulée et gestion de la charge d'entraînement.</p></a>
    <a href="/pathologies/tendinopathie-achille" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Tendinopathie d'Achille</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">L'autre grande blessure de surcharge du coureur.</p></a>
    <a href="/methodes/testing-vald" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Testing de force</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Mesurer les asymétries quadriceps et fessiers.</p></a>
    <a href="/soins/kinesitherapie-du-sport" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Kinésithérapie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">La rééducation active au cabinet.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:var(--r-xl);padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:var(--h2-m);font-weight:700;letter-spacing:-.025em;">Un genou qui pique en descente ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Bilan, plan de renforcement et suivi chiffré au cabinet Mugitu, 3 avenue Kléber à Biarritz.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
  {
    slug: "epicondylite",
    title: `Épicondylite : pourquoi le repos seul ne suffit pas`,
    eyebrow: `Pathologie · coude`,
    lead: ``,
    crumb: `Épicondylite`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    size: "m",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:var(--sect-tight) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:var(--r-l);padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Le diagnostic</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Le traitement</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Quand consulter vite</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Un tendon sous-préparé, pas un coude usé</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">L'épicondylite, ou tennis elbow, est une tendinopathie des muscles extenseurs du poignet, à leur insertion sur la face externe du coude. Elle concerne autant les joueurs de raquette et de pelote que les métiers manuels et le travail sur clavier.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Comme pour les autres tendons, le mécanisme est un décalage entre la charge demandée et la capacité du tissu. Le mot en -ite est trompeur : il n'y a généralement pas d'inflammation à combattre, mais une capacité à reconstruire.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Le pronostic est bon, mais la patience est de mise : la plupart des épicondylites mettent trois à six mois à passer, et les récidives viennent des reprises trop rapides.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:var(--r-l);padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#003850;">Les signes qui parlent</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une douleur externe du coude à la poignée de main ou en tenant une tasse.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Elle augmente en extension du poignet contre résistance.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Un point douloureux précis sur l'épicondyle latéral.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"/><path d="m2.5 21.5 1.4-1.4"/><path d="m20.1 3.9 1.4-1.4"/><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"/><path d="m9.6 14.4 4.8-4.8"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une perte de force de préhension, souvent nette au dynamomètre.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Au cabinet</p>
      <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Confirmer, et écarter le reste</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Le diagnostic est clinique. L'enjeu est surtout d'éliminer une origine cervicale ou une atteinte nerveuse, fréquemment confondues.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'histoire des gestes</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Sport de raquette, pelote, bricolage, travail répétitif, changement récent de matériel ou de charge.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'examen du coude</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Palpation de l'épicondyle, tests d'extension résistée du poignet et du majeur.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Le contrôle cervical et nerveux</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Rachis cervical, trajet du nerf radial : deux causes de douleur externe du coude à ne pas manquer.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">La force de préhension</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Mesure au dynamomètre, comparée au côté sain. Elle sert de référence pour suivre les progrès.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Le traitement</p>
    <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Charger le tendon, progressivement</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Le renforcement progressif des extenseurs du poignet est le traitement de fond. Les gestes passifs soulagent, mais ne suffisent jamais seuls.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 1 · 1 à 3 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Calmer</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Adaptation temporaire des gestes provoquants, isométries d'extension du poignet, éventuellement une bracelet épicondylien pour les tâches obligatoires.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Isométrie</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Adaptation des gestes</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Bracelet</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 2 · 3 à 12 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Renforcer</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Renforcement excentrique et lourd-lent des extenseurs, puis de toute la chaîne épaule-scapula, très souvent déficitaire. Trois séances par semaine, sur plusieurs mois.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Excentrique</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Chaîne scapulaire</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Préhension</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 3 · dès 8 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Retour aux gestes</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Reprise progressive du sport ou du travail manuel, avec vérification du matériel : taille de manche, tension de cordage, poste de travail.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Matériel</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Reprise graduée</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Entretien</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">Quand la douleur résiste au-delà de six mois de renforcement bien conduit, d'autres options se discutent : voir <a href="/methodes/mesotherapie" style="font-weight:600;">la mésothérapie</a>, <a href="/methodes/dry-needling" style="font-weight:600;">le dry needling</a> ou <a href="/methodes/infiltrations" style="font-weight:600;">les infiltrations</a>.</p>
</section>

<section id="science" style="background:#003850;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#fff;">Sur quoi repose cette prise en charge</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">BMJ · 2006 (Bisset)</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">À un an, la rééducation active donne de meilleurs résultats que l'infiltration de corticoïdes, qui soulage à court terme mais expose à plus de rechutes.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Essai randomisé, trois bras.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Coombes et al. · JAMA 2013</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">L'infiltration de corticoïdes est associée à un taux de récidive plus élevé à un an que l'abstention.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Essai randomisé contrôlé.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Br J Sports Med</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Les programmes de renforcement progressif améliorent durablement la douleur et la force de préhension.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Revues sur la tendinopathie latérale du coude.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:var(--h2-s);font-weight:700;letter-spacing:-.02em;color:#003850;">Quand consulter sans attendre</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Ces signes évoquent une autre origine que le tendon.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Des fourmillements ou une perte de force dans la main.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur qui descend du cou vers le bras.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Un coude gonflé, chaud et rouge, ou de la fièvre.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur apparue brutalement après un traumatisme.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Un blocage du coude ou une perte d'extension.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu'on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Combien de temps ça dure ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Trois à six mois en moyenne avec un renforcement régulier. Les formes anciennes peuvent demander davantage.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Faut-il arrêter le sport ou le travail ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">On adapte plutôt qu'on arrête : réduire les gestes les plus provoquants tout en continuant à charger le tendon en séance.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Le bracelet épicondylien est-il utile ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Il soulage certains gestes obligatoires à court terme. Ce n'est pas un traitement, plutôt une béquille temporaire.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Et l'infiltration ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Elle soulage vite mais expose à plus de récidives à un an. Elle se discute au cas par cas, jamais comme première réponse.</p></div>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="background:#fff;border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);box-shadow:0 6px 28px rgba(60,40,30,.08);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px;align-items:center;">
    <div style="display:flex;gap:18px;align-items:center;">
      <img src="/lucas-bengoechea.jpg" alt="Lucas Bengoechea, Ostéopathe D.O. du sport" style="width:78px;height:78px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
      <div>
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Écrit et validé par</p>
        <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#003850;">Lucas Bengoechea</p>
        <p style="margin:0 0 8px;font-size:14px;color:rgba(51,51,52,.6);">Ostéopathe D.O. du sport</p>
        <a href="/equipe/lucas-bengoechea" style="font-size:14px;font-weight:600;text-decoration:none;">Voir sa fiche →</a>
      </div>
    </div>
    <div>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par le Dr Basile Carcassonne, médecin du sport, pour les options médicales et le diagnostic différentiel.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour : 28 août 2026 · prochaine revue : février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d'information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/sports/pelote-basque" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Pelote basque</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Main, poignet et coude du pelotari.</p></a>
    <a href="/methodes/dry-needling" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Dry needling</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Une option d'appoint sur les tensions musculaires.</p></a>
    <a href="/methodes/mesotherapie" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Mésothérapie</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Micro-injections locales sur les formes qui traînent.</p></a>
    <a href="/soins/osteopathie" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Ostéopathie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Coude, épaule et rachis cervical.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:var(--r-xl);padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:var(--h2-m);font-weight:700;letter-spacing:-.025em;">Un coude qui gêne à chaque geste ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Bilan et programme de renforcement au cabinet Mugitu, 3 avenue Kléber à Biarritz.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
  {
    slug: "aponevrosite-plantaire",
    title: `Aponévrosite plantaire : la douleur du premier pas`,
    eyebrow: `Pathologie · pied`,
    lead: ``,
    crumb: `Aponévrosite plantaire`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    size: "m",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:var(--sect-tight) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:var(--r-l);padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Le diagnostic</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Le traitement</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Quand consulter vite</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Une lame fibreuse débordée</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">L'aponévrose plantaire est une lame fibreuse tendue sous le pied, du talon aux orteils. Elle encaisse la charge à chaque appui. Quand la sollicitation augmente plus vite que sa capacité d'adaptation, elle devient douloureuse à son insertion sur le calcanéum.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">On parle souvent d'épine calcanéenne à cause de la radiographie. Cette petite excroissance osseuse est très fréquente chez des personnes sans douleur : elle est un témoin, pas la cause. La retirer ne règle rien.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Les facteurs habituels : reprise de course, augmentation du dénivelé, station debout prolongée, changement de chaussures, mollet raide, prise de poids récente.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:var(--r-l);padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#003850;">Les signes qui parlent</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une douleur vive aux premiers pas du matin, qui s'estompe après quelques minutes.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Elle revient en fin de journée ou après une station debout prolongée.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Un point douloureux précis sous le talon, à la palpation.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M12 2v20"/><path d="m8 18 4 4 4-4"/><path d="m8 6 4-4 4 4"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une raideur du mollet et une flexion de cheville limitée, très souvent associées.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Au cabinet</p>
      <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Un diagnostic clinique</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">L'histoire et la palpation suffisent presque toujours. L'imagerie ne sert qu'à écarter les autres causes de douleur de talon.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'histoire de la charge</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Kilométrage, terrain, chaussures, métier debout, poids, ancienneté de la douleur.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'examen du pied</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Palpation de l'insertion, mise en tension de l'aponévrose, mobilité de la cheville et du gros orteil.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Les causes à écarter</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Fracture de fatigue du calcanéum, atteinte du nerf, tendinopathie d'Achille d'insertion, cause rhumatologique.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Le bilan des appuis</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Statique et dynamique du pied, force du triceps et des muscles intrinsèques.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Le traitement</p>
    <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Charger le pied, étirer le mollet, gérer la charge</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Aucune solution miracle : c'est l'association d'un renforcement progressif, d'un travail du mollet et d'une gestion de la charge qui fait la différence, sur plusieurs mois.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 1 · 2 à 6 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Soulager</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Réduction temporaire de la course et de la station debout prolongée, travail de mobilité du mollet, éventuellement une talonnette ou une semelle de confort. Auto-massage plantaire avant le lever.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Mobilité mollet</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Semelle de confort</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Ajustement de charge</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 2 · 6 à 16 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Renforcer en charge</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Renforcement lourd et lent du triceps et de l'aponévrose, orteils surélevés, tous les deux jours. C'est le protocole le mieux documenté et il demande de la constance.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Heavy slow resistance</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Triceps sural</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Muscles intrinsèques</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 3 · dès 3 mois</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Reprendre la course</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Retour progressif au volume, surfaces souples d'abord, dénivelé en dernier. Le travail de renforcement continue en entretien pendant la reprise.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Reprise progressive</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Entretien</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Chaussage</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">Le bilan podologique aide sur les appuis et le chaussage : voir <a href="/soins/podologie" style="font-weight:600;">la podologie du sport</a>. Les ondes de choc et la <a href="/methodes/mesotherapie" style="font-weight:600;">mésothérapie</a> se discutent sur les formes qui traînent, en complément.</p>
</section>

<section id="science" style="background:#003850;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#fff;">Sur quoi repose cette prise en charge</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Rathleff et al. · 2015</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Le renforcement lourd et lent du pied améliore la douleur plus vite que les seuls étirements à trois mois.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Essai randomisé sur la fasciite plantaire.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">JOSPT · guidelines</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Les recommandations placent le travail manuel, les étirements et le renforcement en première ligne, avant tout geste invasif.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Recommandations de pratique clinique.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Radiologie</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">L'épine calcanéenne est présente chez une part importante de personnes sans aucune douleur de talon.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Études d'imagerie en population générale.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:var(--h2-s);font-weight:700;letter-spacing:-.02em;color:#003850;">Quand consulter sans attendre</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Ces signes orientent vers un autre diagnostic.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur de talon apparue brutalement après un saut ou une chute.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur qui empire à chaque appui, jour après jour, sans accalmie matinale.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Des fourmillements ou des décharges dans le pied.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Un talon rouge, chaud et gonflé, ou de la fièvre.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Des douleurs articulaires multiples associées, notamment le matin.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu'on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Combien de temps ça dure ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Souvent trois à six mois, parfois davantage. La douleur diminue progressivement, avec des hauts et des bas normaux.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Faut-il des semelles ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Elles soulagent souvent pendant la phase douloureuse et facilitent la reprise. Elles ne remplacent pas le renforcement.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Peut-on continuer à courir ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">En volume réduit, si la douleur reste modérée et revient à la normale le lendemain. Sinon on bascule temporairement sur vélo ou natation.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Une infiltration est-elle utile ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Elle peut soulager à court terme dans certaines situations, mais elle ne traite pas la cause et se discute au cas par cas avec le médecin.</p></div>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="background:#fff;border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);box-shadow:0 6px 28px rgba(60,40,30,.08);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px;align-items:center;">
    <div style="display:flex;gap:18px;align-items:center;">
      <img src="/basile-carcassonne.jpg" alt="Dr Basile Carcassonne, Médecin du sport · traumatologie" style="width:78px;height:78px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
      <div>
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Écrit et validé par</p>
        <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#003850;">Dr Basile Carcassonne</p>
        <p style="margin:0 0 8px;font-size:14px;color:rgba(51,51,52,.6);">Médecin du sport · traumatologie</p>
        <a href="/equipe/basile-carcassonne" style="font-size:14px;font-weight:600;text-decoration:none;">Voir sa fiche →</a>
      </div>
    </div>
    <div>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par Jean-Baptiste Colombié, kinésithérapeute du sport, pour la partie renforcement et reprise de course.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour : 28 août 2026 · prochaine revue : février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d'information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/soins/podologie" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Podologie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Appuis, semelles et chaussage.</p></a>
    <a href="/pathologies/tendinopathie-achille" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Tendinopathie d'Achille</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">L'autre grande douleur du talon.</p></a>
    <a href="/methodes/clinique-du-coureur" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">La Clinique du Coureur®</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Analyse de foulée et gestion de la charge.</p></a>
    <a href="/methodes/mesotherapie" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Mésothérapie</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Une option d'appoint sur les formes qui traînent.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:var(--r-xl);padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:var(--h2-m);font-weight:700;letter-spacing:-.025em;">Un talon qui vous réveille chaque matin ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Bilan du pied et programme de renforcement au cabinet Mugitu, 3 avenue Kléber à Biarritz.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
  {
    slug: "fracture-de-fatigue",
    title: `Fracture de fatigue : les signes à ne pas laisser passer`,
    eyebrow: `Pathologie · os`,
    lead: ``,
    crumb: `Fracture de fatigue`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    size: "m",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:var(--sect-tight) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:var(--r-l);padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Le diagnostic</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Le traitement</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Quand consulter vite</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Un os qui n'a pas eu le temps de s'adapter</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">L'os se remodèle en permanence en réponse à la charge. Quand les impacts s'accumulent plus vite que la reconstruction, une fissure microscopique apparaît, puis s'étend. C'est la fracture de fatigue, ou fracture de stress.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Elle touche surtout le tibia, les métatarsiens, le calcanéum, plus rarement le col fémoral, le sacrum ou la branche pubienne. Ces trois dernières localisations sont dites à risque : elles imposent une prise en charge stricte et rapide.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Au-delà de la charge, l'énergie disponible compte énormément. Une alimentation insuffisante par rapport à la dépense, des règles absentes ou irrégulières, une densité osseuse basse : ce sont des facteurs majeurs, souvent négligés.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:var(--r-l);padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#003850;">Ce qui doit alerter</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une douleur très localisée, qu'on peut montrer du bout du doigt.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Elle apparaît de plus en plus tôt dans l'effort, séance après séance.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Elle finit par gêner la marche, puis persiste au repos.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une douleur nocturne, ou une douleur au simple sautillement sur place.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Au cabinet</p>
      <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Confirmer vite, sans perdre de temps</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">La radiographie est souvent normale les premières semaines. Devant une suspicion, l'IRM est l'examen de référence.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'histoire de la charge</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Progression du volume, changement de surface ou de chaussures, reprise après arrêt, cumul de compétitions.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'examen ciblé</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Palpation osseuse, tests d'appui monopodal et de saut, recherche d'une douleur reproductible au même point.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'imagerie</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">IRM en première intention devant une suspicion : elle détecte l'œdème osseux avant tout trait visible en radio.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Le bilan des causes</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Alimentation, cycle menstruel, densité osseuse, vitamine D, antécédents de fractures : indispensable en cas de récidive.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Le traitement</p>
    <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Décharger, puis recharger</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Le principe est simple : retirer la contrainte le temps de la consolidation, maintenir la condition physique, puis remonter la charge par paliers.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 1 · 2 à 8 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Mise en décharge</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Arrêt des impacts, avec parfois des béquilles ou une botte selon la localisation. Les sites à risque, comme le col fémoral ou le sacrum, imposent une prudence particulière et un avis spécialisé.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Décharge</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Avis spécialisé</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Consolidation</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 2 · en parallèle</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Maintenir la condition</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Vélo, natation, renforcement sans impact, travail du haut du corps. On corrige en même temps les causes : apports alimentaires, sommeil, planification de la charge.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Cross-training</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Nutrition</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Sommeil</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 3 · après validation</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Retour aux impacts</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Reprise en marche-course, puis course continue, avec des paliers courts et une règle simple : aucune douleur pendant, ni le lendemain.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Marche-course</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Paliers</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Zéro douleur</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">Le versant nutritionnel est central chez les sportifs d'endurance : un bilan avec la diététicienne du cabinet fait partie de la prise en charge, tout comme le suivi de la charge en <a href="/methodes/preparation-physique" style="font-weight:600;">préparation physique</a>.</p>
</section>

<section id="science" style="background:#003850;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#fff;">Sur quoi repose cette prise en charge</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Br J Sports Med · RED-S</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Un déficit énergétique relatif au sport augmente le risque de fracture de stress, chez les femmes comme chez les hommes.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Déclarations de consensus du CIO.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">AJSM</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">L'IRM détecte les fractures de stress bien plus tôt que la radiographie, souvent normale au stade précoce.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Études comparatives d'imagerie.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Sports Health</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Les fractures de sites à risque exposent à des complications et justifient une prise en charge distincte des sites à faible risque.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Classifications par localisation.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:var(--h2-s);font-weight:700;letter-spacing:-.02em;color:#003850;">Quand consulter sans attendre</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Une suspicion de fracture de fatigue est en soi un motif de consultation rapide.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur osseuse ponctuelle, qui persiste à la marche ou au repos.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur d'aine ou de hanche à l'appui chez un coureur : le col fémoral impose un avis urgent.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur lombo-fessière profonde à l'appui monopodal.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur nocturne qui empêche de dormir.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Des antécédents de fractures de fatigue répétées ou une aménorrhée.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu'on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Combien de temps d'arrêt des impacts ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Six à huit semaines en moyenne pour un site à faible risque, davantage pour le col fémoral ou le sacrum. La reprise se valide cliniquement.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Une radio suffit-elle ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Souvent non : elle est normale les premières semaines. L'IRM est l'examen de référence en cas de suspicion.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Puis-je continuer le vélo ou la natation ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Oui dans la plupart des cas, tant qu'il n'y a pas de douleur. C'est même recommandé pour garder la condition.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Pourquoi j'en fais plusieurs ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Cela oriente vers un déficit énergétique, un problème hormonal ou une densité osseuse basse. Un bilan complet s'impose.</p></div>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="background:#fff;border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);box-shadow:0 6px 28px rgba(60,40,30,.08);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px;align-items:center;">
    <div style="display:flex;gap:18px;align-items:center;">
      <img src="/basile-carcassonne.jpg" alt="Dr Basile Carcassonne, Médecin du sport · traumatologie" style="width:78px;height:78px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
      <div>
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Écrit et validé par</p>
        <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#003850;">Dr Basile Carcassonne</p>
        <p style="margin:0 0 8px;font-size:14px;color:rgba(51,51,52,.6);">Médecin du sport · traumatologie</p>
        <a href="/equipe/basile-carcassonne" style="font-size:14px;font-weight:600;text-decoration:none;">Voir sa fiche →</a>
      </div>
    </div>
    <div>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par Jean-Baptiste Colombié, kinésithérapeute du sport, pour la reprise progressive des impacts.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour : 28 août 2026 · prochaine revue : février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d'information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/pathologies/periostite-tibiale" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Périostite tibiale</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Le stade d'avant, à ne pas confondre.</p></a>
    <a href="/soins/nutrition-du-sport" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Nutrition du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Énergie disponible et santé osseuse.</p></a>
    <a href="/sports/trail-et-course" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Trail et course à pied</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Planifier une saison sans surcharge.</p></a>
    <a href="/soins/medecine-du-sport" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Médecine du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Consultation, imagerie et suivi.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:var(--r-xl);padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:var(--h2-m);font-weight:700;letter-spacing:-.025em;">Une douleur osseuse qui s'aggrave ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Consultation rapide et orientation vers l'imagerie au cabinet Mugitu, Biarritz.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
  {
    slug: "lombalgie-du-sportif",
    title: `Lombalgie du sportif : bouger reste le traitement`,
    eyebrow: `Pathologie · rachis`,
    lead: ``,
    crumb: `Lombalgie du sportif`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    size: "m",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:var(--sect-tight) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:var(--r-l);padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Le diagnostic</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Le traitement</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Quand consulter vite</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Un dos sensible, pas un dos abîmé</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">La grande majorité des lombalgies sont dites communes : aucune structure précise n'est en cause, et l'imagerie ne change rien à la prise en charge. Chez le sportif, la douleur arrive presque toujours après un pic de charge, un manque de sommeil, une période de stress, ou un retour d'entraînement trop rapide.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Les images font plus de dégâts que les disques : discopathies et « pincements » sont fréquents chez des gens qui n'ont jamais mal. Un compte rendu inquiétant peut à lui seul entretenir la douleur et l'évitement.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Le pronostic est bon. La plupart des épisodes s'améliorent nettement en quatre à six semaines, à condition de continuer à bouger et de reprendre progressivement.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:var(--r-l);padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#003850;">Ce qu'on regarde</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Ce qui a changé dans les trois semaines : volume, charge, sommeil, stress.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M12 2v20"/><path d="m15 19-3 3-3-3"/><path d="m19 9 3 3-3 3"/><path d="M2 12h20"/><path d="m5 9-3 3 3 3"/><path d="m9 5 3-3 3 3"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Les mouvements qui soulagent et ceux qui aggravent.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">La présence ou non d'une douleur irradiant dans la jambe.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Les signaux d'alerte, rares mais à écarter systématiquement.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Au cabinet</p>
      <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qui est utile, ce qui ne l'est pas</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">L'objectif de la consultation est d'écarter les rares causes graves, puis de rassurer et de remettre en mouvement.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'entretien</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Histoire de la douleur, charge d'entraînement, antécédents, retentissement sur le sommeil et l'humeur.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'examen clinique</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Mobilité du rachis, testing neurologique si douleur dans la jambe, palpation, tests de contrôle du tronc.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Les signaux d'alerte</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Traumatisme, fièvre, perte de poids, trouble sphinctérien, déficit moteur : c'est ce qui déclencherait une imagerie.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Pas d'imagerie systématique</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">En l'absence de signal d'alerte, radio et IRM n'améliorent pas l'évolution et augmentent l'inquiétude.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Le traitement</p>
    <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Reprendre, charger, renforcer</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Aucune technique ne surpasse les autres. Ce qui fonctionne : rester actif, retrouver confiance dans les mouvements, et renforcer progressivement le tronc et les hanches.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 1 · quelques jours</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Passer le cap douloureux</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">On garde une activité adaptée plutôt que le lit. Thérapie manuelle et mobilisations peuvent soulager à court terme et faciliter la remise en mouvement, sans être un traitement de fond.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Rester actif</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Thérapie manuelle</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Explications</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 2 · 2 à 8 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Réexposer au mouvement</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">On revient sur les mouvements évités — flexion, rotation, port de charge — par doses progressives. Le renforcement du tronc, des fessiers et des ischio-jambiers reprend en parallèle.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Réexposition</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Renforcement</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Mobilité de hanche</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 3 · dès 6 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Remonter la charge sportive</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Retour aux gestes du sport, puis à l'intensité. On planifie la progression semaine par semaine, avec une marge : la récidive vient presque toujours d'une reprise trop rapide.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Charge d'entraînement</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Gestes spécifiques</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Prévention</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">Le sommeil, le stress et la charge globale pèsent lourd sur une lombalgie qui traîne. Un accompagnement <a href="/soins/psychologie" style="font-weight:600;">psychologique du sportif</a> a toute sa place dans les formes persistantes.</p>
</section>

<section id="science" style="background:#003850;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#fff;">Sur quoi repose cette prise en charge</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">The Lancet · 2018</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Le repos et l'imagerie systématique sont identifiés comme des pratiques à abandonner dans la lombalgie commune.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Série sur la prise en charge du mal de dos.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Cochrane</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">L'exercice thérapeutique réduit la douleur et l'incapacité dans la lombalgie chronique, quelle que soit la modalité choisie.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Revues sur exercice et lombalgie.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Spine J</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Discopathies et protrusions sont très fréquentes chez des personnes sans aucune douleur, et augmentent avec l'âge.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Études d'imagerie chez sujets asymptomatiques.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:var(--h2-s);font-weight:700;letter-spacing:-.02em;color:#003850;">Quand consulter sans attendre</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Ces signes, rares, sortent du cadre de la lombalgie commune.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Un traumatisme violent, une chute de hauteur.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une perte de force dans une jambe, ou une insensibilité qui s'étend.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Des troubles urinaires ou une anesthésie de la région périnéale.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">De la fièvre, une perte de poids inexpliquée, un antécédent de cancer.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur nocturne permanente que rien ne soulage.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu'on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Faut-il arrêter le sport ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Presque jamais complètement. On adapte l'intensité et les mouvements qui piquent, en gardant une activité quotidienne.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Une IRM va-t-elle m'aider ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">En l'absence de signal d'alerte, non. Elle montre souvent des images normales pour l'âge, sans lien avec la douleur, et retarde la reprise.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Est-ce que je peux soulever des poids ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Oui, c'est même un objectif. On repart de charges légères avec une technique maîtrisée, puis on remonte.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Ma hernie discale va-t-elle disparaître ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Souvent, oui : une partie des hernies régresse spontanément en quelques mois, et la douleur s'améliore avant l'image.</p></div>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="background:#fff;border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);box-shadow:0 6px 28px rgba(60,40,30,.08);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px;align-items:center;">
    <div style="display:flex;gap:18px;align-items:center;">
      <img src="/lucas-bengoechea.jpg" alt="Lucas Bengoechea, Ostéopathe D.O. du sport" style="width:78px;height:78px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
      <div>
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Écrit et validé par</p>
        <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#003850;">Lucas Bengoechea</p>
        <p style="margin:0 0 8px;font-size:14px;color:rgba(51,51,52,.6);">Ostéopathe D.O. du sport</p>
        <a href="/equipe/lucas-bengoechea" style="font-size:14px;font-weight:600;text-decoration:none;">Voir sa fiche →</a>
      </div>
    </div>
    <div>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par le Dr Basile Carcassonne, médecin du sport, pour la partie signaux d'alerte et imagerie.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour : 28 août 2026 · prochaine revue : février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d'information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/soins/osteopathie" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Ostéopathie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Thérapie manuelle et remise en mouvement.</p></a>
    <a href="/soins/kinesitherapie-du-sport" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Kinésithérapie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Renforcement du tronc et réexposition progressive.</p></a>
    <a href="/soins/psychologie" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Psychologie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Stress, sommeil et douleur qui persiste.</p></a>
    <a href="/methodes/preparation-physique" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Préparation physique</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Reconstruire une base de force durable.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:var(--r-xl);padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:var(--h2-m);font-weight:700;letter-spacing:-.025em;">Un dos qui bloque votre saison ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Consultation, plan de réexposition et renforcement au cabinet Mugitu, 3 avenue Kléber à Biarritz.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
  {
    slug: "epaule-du-surfeur",
    title: `Épaule du surfeur : tendinopathie de la coiffe et retour à l'eau`,
    eyebrow: `Pathologie · épaule`,
    lead: ``,
    crumb: `Épaule du surfeur`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    size: "m",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:var(--sect-tight) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:var(--r-l);padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Le diagnostic</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Le traitement</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Quand consulter vite</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Une épaule qui rame plus qu'elle ne peut</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Une session de surf, c'est beaucoup de rame et peu de vagues. L'épaule enchaîne des milliers de cycles en position haute, souvent après un hiver sans renforcement. La coiffe des rotateurs finit par ne plus suivre : la douleur apparaît d'abord en fin de session, puis de plus en plus tôt.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Le terme « conflit sous-acromial » a longtemps servi à tout expliquer. On parle aujourd'hui de douleur d'épaule liée à la coiffe, un problème de capacité et de charge plutôt qu'un os qui frotte. Cela change tout : on renforce au lieu d'opérer.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">S'ajoutent les facteurs propres au surf : une posture de rame en hyperextension lombaire, une mobilité thoracique limitée, et des périodes de forte densité de sessions quand la houle est là.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:var(--r-l);padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#003850;">Les signes qui parlent</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une douleur qui apparaît en fin de session, puis de plus en plus tôt.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une gêne bras au-dessus de la tête, ou pour attraper quelque chose en hauteur.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une douleur pour dormir sur le côté atteint.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"/><path d="m2.5 21.5 1.4-1.4"/><path d="m20.1 3.9 1.4-1.4"/><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"/><path d="m9.6 14.4 4.8-4.8"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une perte de force en rotation externe, souvent silencieuse.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Au cabinet</p>
      <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Comment on pose le diagnostic</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">L'examen clinique suffit dans la plupart des cas. On cherche surtout à distinguer une tendinopathie d'une vraie rupture ou d'une instabilité.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'histoire des sessions</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Fréquence, durée, houle des dernières semaines, matériel, travail à côté, sommeil.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">L'examen de l'épaule</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Amplitudes actives et passives, tests de la coiffe, recherche d'une instabilité ou d'une atteinte du long biceps.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">La mobilité en amont</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Rachis thoracique, scapula, hanche : une épaule douloureuse compense souvent une raideur plus bas.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">La force chiffrée</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Rotation externe et interne au dynamomètre, ratio entre les deux épaules. C'est la référence du suivi.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Le traitement</p>
    <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Renforcer la coiffe, réorganiser les sessions</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Le renforcement progressif est le traitement de référence. La chirurgie ne concerne qu'une minorité de situations, après un traitement conservateur bien mené.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 1 · 1 à 3 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Calmer sans arrêter l'eau</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">On réduit le volume de rame plutôt que de sortir de l'eau : sessions plus courtes, spots moins engagés, éventuellement une planche plus volumineuse. Isométries de rotation externe et travail de mobilité thoracique.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Isométrie</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Volume de rame</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Mobilité thoracique</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 2 · 3 à 10 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Construire la capacité</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Renforcement de la coiffe et des stabilisateurs de scapula, deux à trois fois par semaine, avec une charge qui progresse. On ajoute le travail de tirage et de gainage antérieur, très sollicité à la rame.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Coiffe</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Scapula</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Tirage</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Phase 3 · dès 8 semaines</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Retour aux sessions longues</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Remontée progressive du temps de rame et de la densité de sessions. On garde deux séances de renforcement par semaine en entretien pendant la saison de houle.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Reprise progressive</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Entretien</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Prévention</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">Une épaule qui ne progresse pas malgré trois mois de renforcement justifie un avis médical et parfois une imagerie : voir <a href="/soins/medecine-du-sport" style="font-weight:600;">la médecine du sport</a>. Sur les gestes très déficitaires, la <a href="/methodes/allyane" style="font-weight:600;">méthode Allyane®</a> peut aider à débloquer la commande motrice.</p>
</section>

<section id="science" style="background:#003850;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#fff;">Sur quoi repose cette prise en charge</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Br J Sports Med · 2019</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Chez les patients avec douleur d'épaule liée à la coiffe, l'exercice progressif obtient des résultats comparables à la chirurgie de décompression.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Essais et revues sur la décompression sous-acromiale.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">The Lancet · 2018 (CSAW)</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">La décompression arthroscopique n'apporte pas de bénéfice cliniquement significatif par rapport à une intervention placebo.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Essai randomisé contrôlé.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">J Sci Med Sport</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Chez les surfeurs, la charge de rame et les déficits de rotation externe sont les facteurs les plus associés à la douleur d'épaule.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Études épidémiologiques sur le surf.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:var(--h2-s);font-weight:700;letter-spacing:-.02em;color:#003850;">Quand consulter sans attendre</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Ces situations demandent un avis médical rapide.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une impossibilité brutale de lever le bras après une chute ou un wipeout.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une déformation de l'épaule, ou une sensation qu'elle est sortie.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une perte de force massive et rapide, avec fonte musculaire visible.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur nocturne permanente, une fièvre, une rougeur chaude.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu'on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Dois-je arrêter le surf ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Rarement. On réduit la durée et l'engagement des sessions plutôt que d'arrêter, en restant sous un seuil de douleur qui disparaît le lendemain.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Combien de temps pour aller mieux ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Six à douze semaines de renforcement régulier dans la plupart des cas. Les épaules douloureuses depuis plus d'un an demandent trois à six mois.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Faut-il une IRM ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Pas d'emblée. Beaucoup de coiffes présentent des anomalies sans douleur ; l'imagerie sert quand l'évolution ne suit pas ou en cas de suspicion de rupture.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">La musculation aggrave-t-elle l'épaule ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Bien dosée, c'est le traitement. Ce sont les charges trop lourdes trop tôt, et les développés en fin d'amplitude, qui posent problème.</p></div>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="background:#fff;border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);box-shadow:0 6px 28px rgba(60,40,30,.08);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px;align-items:center;">
    <div style="display:flex;gap:18px;align-items:center;">
      <img src="/lucas-bengoechea.jpg" alt="Lucas Bengoechea, Ostéopathe D.O. du sport" style="width:78px;height:78px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
      <div>
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Écrit et validé par</p>
        <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#003850;">Lucas Bengoechea</p>
        <p style="margin:0 0 8px;font-size:14px;color:rgba(51,51,52,.6);">Ostéopathe D.O. du sport</p>
        <a href="/equipe/lucas-bengoechea" style="font-size:14px;font-weight:600;text-decoration:none;">Voir sa fiche →</a>
      </div>
    </div>
    <div>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par Jean-Baptiste Colombié, kinésithérapeute du sport, pour la partie renforcement et charge de rame.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour : 28 août 2026 · prochaine revue : février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d'information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/sports/surf" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Suivi des surfeurs</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Épaule, dos, genou : les blessures propres au surf.</p></a>
    <a href="/methodes/allyane" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Méthode Allyane®</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Débloquer une commande motrice inhibée.</p></a>
    <a href="/methodes/testing-vald" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Testing de force</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Ratios de rotation et asymétries chiffrées.</p></a>
    <a href="/soins/osteopathie" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Ostéopathie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Mobilité thoracique et scapulaire.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:var(--r-xl);padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:var(--h2-m);font-weight:700;letter-spacing:-.025em;">Une épaule qui pique à la rame ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Bilan de l'épaule et plan de renforcement au cabinet Mugitu, 3 avenue Kléber à Biarritz.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
];

export function getPathologie(slug: string): ContentPage | undefined {
  return PATHOLOGIES.find((p) => p.slug === slug);
}
