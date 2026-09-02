import type { ContentPage } from "./content-page";

/** Les 5 pages sport, servies sous /sports/<slug>. */
export const SPORTS: ContentPage[] = [
  {
    slug: "surf",
    title: `Surf : soigner et préparer les corps qui rament`,
    eyebrow: `Par sport · surf`,
    lead: ``,
    crumb: `Surf`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    titleSize: "clamp(32px,5.2vw,64px)",
    titleLineHeight: "1.03",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:clamp(40px,5vw,56px) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:18px;padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Les blessures typiques</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Notre accompagnement</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Quand consulter</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,80px) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Beaucoup de rame, peu de vagues</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Une session type, c'est quatre-vingts pour cent de rame, un peu de take-off et quelques secondes debout. Le corps du surfeur se construit donc autour d'une épaule très sollicitée en position haute, d'un rachis lombaire en extension prolongée, et de jambes qui encaissent des appuis explosifs mais rares.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">À cela s'ajoute une saisonnalité brutale : quand la houle arrive, la densité de sessions explose en quelques jours. La blessure vient rarement du geste, presque toujours de ce pic de charge sur un corps désentraîné.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">L'eau froide, les longues attentes et le travail à côté complètent le tableau. Un suivi qui ignore ces réalités passe à côté de la cause.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:20px;padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#003850;">Ce qu'on regarde d'abord</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Le nombre de sessions par semaine et leur durée réelle.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">La mobilité thoracique et la force de rotation d'épaule.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M12 2v20"/><path d="m8 18 4 4 4-4"/><path d="m8 6 4-4 4 4"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">La tolérance du rachis lombaire à l'extension.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"/><path d="m2.5 21.5 1.4-1.4"/><path d="m20.1 3.9 1.4-1.4"/><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"/><path d="m9.6 14.4 4.8-4.8"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Ce qui est fait à terre, ou pas, entre les sessions.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ce qu'on voit le plus</p>
      <h2 style="margin:0 0 14px;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Les blessures typiques du surf</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Quatre motifs représentent l'essentiel des consultations de surfeurs au cabinet.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Épaule de rame</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Tendinopathie de la coiffe, liée au volume de rame et à un déficit de rotation externe. Le motif numéro un.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Lombalgie d'extension</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Douleur basse liée à la position de rame prolongée et à une faiblesse du tronc et des fessiers.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Genou au take-off</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Douleur fémoro-patellaire ou entorse, sur des appuis explosifs mal préparés.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Cervicalgies et traumatismes</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Cou en hyperextension, chocs avec la planche, entorses de cheville sur les réceptions.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:clamp(60px,8vw,100px) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Notre accompagnement</p>
    <h2 style="margin:0 0 14px;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Trois moments dans la saison</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Nous travaillons avec les surfeurs sur l'année plutôt que sur l'épisode douloureux.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Avant la saison de houle</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Préparer l'épaule</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Bilan de mobilité et de force, programme de renforcement de la coiffe et du tronc, deux séances par semaine. C'est le moment où l'on gagne le plus.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Bilan</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Coiffe</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Tronc</span></div></div></div>
    <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Pendant la saison</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Encaisser les pics</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Suivi ostéopathique et kiné à la demande, ajustement du volume de sessions, entretien du renforcement même quand la houle est bonne.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Ostéopathie</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Entretien</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Gestion du volume</span></div></div></div>
    <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Après une blessure</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Revenir à l'eau</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Rééducation progressive puis reprise graduée : sessions courtes, spots calmes, planche plus volumineuse au début, jusqu'au retour au niveau habituel.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Rééducation</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Reprise graduée</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Testing</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">Voir aussi <a href="/pathologies/epaule-du-surfeur" style="font-weight:600;">l'épaule du surfeur</a> et <a href="/pathologies/lombalgie-du-sportif" style="font-weight:600;">la lombalgie du sportif</a>, les deux pages les plus consultées par les surfeurs.</p>
</section>

<section id="science" style="background:#003850;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#fff;">Ce que montrent les données sur le surf</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:18px;padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">J Sci Med Sport</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Les blessures chroniques du surf touchent en majorité l'épaule et le rachis lombaire, devant les traumatismes aigus.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Études épidémiologiques sur surfeurs récréatifs et compétiteurs.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:18px;padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Sports Med</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Les traumatismes aigus concernent surtout le contact avec sa propre planche, tête et membres inférieurs en tête.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Revues sur les blessures du surf.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:18px;padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Br J Sports Med</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Les hausses rapides de charge d'entraînement augmentent le risque de blessure dans la plupart des sports étudiés.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Travaux sur le ratio charge aiguë / charge chronique.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:clamp(60px,8vw,100px) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:24px;padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:clamp(22px,3vw,30px);font-weight:700;letter-spacing:-.02em;color:#003850;">Quand consulter rapidement</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Certaines situations après une session ne s'attendent pas.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Un choc à la tête avec perte de connaissance, confusion ou vomissements.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une épaule qui reste bloquée ou déformée après une chute.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une plaie profonde, notamment par un aileron.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une gêne respiratoire ou une douleur thoracique après un wipeout violent.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur de cheville avec impossibilité d'appui.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu'on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Faut-il faire de la musculation pour surfer ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Deux séances courtes par semaine, centrées sur la coiffe, le tirage et le tronc, changent nettement la tolérance à la rame.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Je surfe seulement en vacances, je dois me préparer ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">C'est justement le profil le plus exposé : quatre à six semaines de renforcement avant un séjour intensif suffisent à réduire les ennuis.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">L'ostéopathie suffit-elle ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Elle soulage vite et facilite la remise en mouvement, mais elle se combine au renforcement pour tenir dans la durée.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Quand reprendre après une blessure d'épaule ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Quand la force de rotation est revenue et que la rame est indolore sur une session courte. On remonte ensuite le volume par paliers.</p></div>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:clamp(60px,8vw,90px) clamp(20px,5vw,40px);">
  <div style="background:#fff;border-radius:24px;padding:clamp(26px,4vw,40px);box-shadow:0 6px 28px rgba(60,40,30,.08);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px;align-items:center;">
    <div style="display:flex;gap:18px;align-items:center;">
      <img src="/lucas-bengoechea.jpg" alt="Lucas Bengoechea, Ostéopathe D.O. du sport" style="width:78px;height:78px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
      <div>
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Écrit et validé par</p>
        <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#003850;">Lucas Bengoechea</p>
        <p style="margin:0 0 8px;font-size:14px;color:rgba(51,51,52,.6);">Ostéopathe D.O. du sport</p>
        <a href="/equipe/lucas-bengoechea" style="font-size:14px;font-weight:600;text-decoration:none;">Voir sa fiche →</a>
      </div>
    </div>
    <div>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par Jean-Baptiste Colombié, kinésithérapeute du sport, pour la partie préparation physique.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour : 28 août 2026 · prochaine revue : février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d'information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/pathologies/epaule-du-surfeur" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Épaule du surfeur</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Le motif de consultation numéro un.</p></a>
    <a href="/pathologies/lombalgie-du-sportif" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Lombalgie du sportif</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Le dos en position de rame.</p></a>
    <a href="/methodes/preparation-physique" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Préparation physique</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Renforcement à terre entre les sessions.</p></a>
    <a href="/soins/osteopathie" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Ostéopathie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Mobilité thoracique et récupération.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:24px;padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:clamp(24px,3.4vw,34px);font-weight:700;letter-spacing:-.025em;">Surfeur à Biarritz ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Bilan, soin et préparation à la saison de houle au cabinet Mugitu, 3 avenue Kléber.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:999px;background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
  {
    slug: "rugby",
    title: `Rugby : encaisser la saison, revenir au jeu au bon moment`,
    eyebrow: `Par sport · rugby`,
    lead: ``,
    crumb: `Rugby`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    titleSize: "clamp(32px,5.2vw,64px)",
    titleLineHeight: "1.03",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:clamp(40px,5vw,56px) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:18px;padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Les blessures typiques</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Notre accompagnement</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Quand consulter</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,80px) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Deux types de blessures, deux logiques</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">D'un côté, la traumatologie de contact : entorses, luxations d'épaule, contusions, commotions. Elle est imprévisible, et se gère par la qualité de la prise en charge immédiate et du retour au jeu.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">De l'autre, les blessures de surcharge : pubalgie, ischio-jambiers, tendinopathies. Elles s'installent sur des semaines de matchs enchaînés et de récupération insuffisante, et se préviennent réellement.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Le calendrier amateur est particulier : peu de temps d'entraînement, beaucoup de matchs, et souvent un travail à plein temps à côté. La planification doit partir de cette réalité, pas d'un modèle professionnel.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:20px;padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#003850;">Ce qu'on regarde d'abord</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">La densité de matchs et le temps de récupération réel entre deux.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Le volume de sprint, souvent absent à l'entraînement puis maximal en match.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"/><path d="m2.5 21.5 1.4-1.4"/><path d="m20.1 3.9 1.4-1.4"/><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"/><path d="m9.6 14.4 4.8-4.8"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">La force des ischio-jambiers et des adducteurs, mesurée.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Les antécédents de commotion, systématiquement recherchés.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ce qu'on voit le plus</p>
      <h2 style="margin:0 0 14px;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Les blessures typiques du rugby</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Quatre motifs dominent les consultations de rugbymen au cabinet.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Pubalgie</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Douleur d'aine installée, souvent depuis plusieurs mois, chez les joueurs de ligne comme d'avant.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Lésion des ischio-jambiers</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Le classique du sprint lancé, avec un risque élevé de récidive si la reprise est précipitée.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Épaule de contact</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Luxations, subluxations et instabilité après plaquage, qui demandent une décision claire sur la reprise.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Commotion cérébrale</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Protocole de retour au jeu par paliers, non négociable, quelle que soit la pression du calendrier.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:clamp(60px,8vw,100px) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Notre accompagnement</p>
    <h2 style="margin:0 0 14px;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Sur la saison, pas seulement sur la blessure</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Nous travaillons avec les joueurs et les clubs du secteur, de la présaison au retour au jeu.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Présaison</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Construire la base</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Testing de force, protocole nordic hamstring et Copenhagen adduction, travail du cou et de l'épaule. C'est la période où la prévention est la plus rentable.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Testing</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Nordic hamstring</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Cou et épaule</span></div></div></div>
    <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">En saison</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Encaisser la densité</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Suivi kiné et ostéopathique entre les matchs, entretien de la force malgré le calendrier, gestion des petites douleurs avant qu'elles n'arrêtent le joueur.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Récupération</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Entretien de force</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Suivi hebdomadaire</span></div></div></div>
    <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Retour de blessure</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Décider sur des critères</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Reprise validée par des mesures de force et des tests de terrain, pas par la seule disparition de la douleur ni par l'importance du match à venir.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Critères chiffrés</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Tests de terrain</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Décision partagée</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">Voir <a href="/pathologies/pubalgie" style="font-weight:600;">la pubalgie</a>, <a href="/pathologies/lesion-ischio-jambiers" style="font-weight:600;">les lésions d'ischio-jambiers</a> et <a href="/soins/bilan-retour-au-sport" style="font-weight:600;">le bilan de retour au sport</a>.</p>
</section>

<section id="science" style="background:#003850;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#fff;">Ce que montrent les données sur le rugby</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:18px;padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Br J Sports Med</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Le rugby présente une des incidences de blessures les plus élevées des sports collectifs, avec le plaquage comme mécanisme principal.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Études de surveillance des blessures en rugby.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:18px;padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">BJSM · nordic hamstring</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Les programmes de nordic hamstring réduisent d'environ moitié les lésions d'ischio-jambiers quand ils sont réellement appliqués.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Méta-analyses en sports collectifs.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:18px;padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Consensus commotion</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Le retour au jeu après commotion suit une progression par paliers, avec au minimum plusieurs jours sans symptôme.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Déclarations de consensus internationales.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:clamp(60px,8vw,100px) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:24px;padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:clamp(22px,3vw,30px);font-weight:700;letter-spacing:-.02em;color:#003850;">Quand consulter en urgence</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Après un match ou un entraînement, ces signes imposent un avis immédiat.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Toute suspicion de commotion : confusion, amnésie, maux de tête, troubles visuels.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une épaule déformée ou bloquée après un plaquage.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur cervicale avec fourmillements dans les bras.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur abdominale intense après un choc.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une impossibilité d'appui sur une jambe après une torsion.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu'on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Quand reprendre après une commotion ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Après une période sans symptôme puis une progression par paliers validée médicalement. Jamais sur la seule sensation d'aller mieux.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Faut-il opérer une épaule qui se déboîte ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Cela dépend du nombre d'épisodes, du poste et de l'âge. La décision se prend avec un chirurgien, après bilan et rééducation.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Comment éviter la pubalgie ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Renforcement régulier des adducteurs en présaison et en entretien, et attention aux reprises brutales après coupure.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Le club peut-il travailler avec vous ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Oui, nous accompagnons des clubs du secteur : testing de présaison, suivi collectif et protocoles de retour au jeu.</p></div>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:clamp(60px,8vw,90px) clamp(20px,5vw,40px);">
  <div style="background:#fff;border-radius:24px;padding:clamp(26px,4vw,40px);box-shadow:0 6px 28px rgba(60,40,30,.08);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px;align-items:center;">
    <div style="display:flex;gap:18px;align-items:center;">
      <img src="/basile-carcassonne.jpg" alt="Dr Basile Carcassonne, Médecin du sport · traumatologie" style="width:78px;height:78px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
      <div>
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Écrit et validé par</p>
        <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#003850;">Dr Basile Carcassonne</p>
        <p style="margin:0 0 8px;font-size:14px;color:rgba(51,51,52,.6);">Médecin du sport · traumatologie</p>
        <a href="/equipe/basile-carcassonne" style="font-size:14px;font-weight:600;text-decoration:none;">Voir sa fiche →</a>
      </div>
    </div>
    <div>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par Jean-Baptiste Colombié, kinésithérapeute du sport, pour la prévention et le retour au terrain.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour : 28 août 2026 · prochaine revue : février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d'information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/pathologies/pubalgie" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Pubalgie</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">La douleur d'aine qui traîne toute la saison.</p></a>
    <a href="/pathologies/lesion-ischio-jambiers" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Ischio-jambiers</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Du claquage au retour au sprint.</p></a>
    <a href="/soins/bilan-retour-au-sport" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Bilan retour au sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Les critères avant de rejouer.</p></a>
    <a href="/methodes/preparation-physique" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Préparation physique</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Présaison et entretien de force.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:24px;padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:clamp(24px,3.4vw,34px);font-weight:700;letter-spacing:-.025em;">Joueur ou club du Pays basque ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Testing de présaison, suivi et retour au jeu au cabinet Mugitu, 3 avenue Kléber à Biarritz.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:999px;background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
  {
    slug: "trail-et-course",
    title: `Trail et course à pied : courir plus sans casser`,
    eyebrow: `Par sport · course`,
    lead: ``,
    crumb: `Trail et course`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    titleSize: "clamp(32px,5.2vw,64px)",
    titleLineHeight: "1.03",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:clamp(40px,5vw,56px) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:18px;padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Les blessures typiques</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Notre accompagnement</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Quand consulter</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,80px) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">La charge avant la technique</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Courir, c'est répéter le même impact des milliers de fois. Le corps s'y adapte très bien, à condition qu'on lui laisse le temps. La grande majorité des blessures de course sont des blessures de surcharge : tendon, os ou articulation dépassés par un volume monté trop vite.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">En trail s'ajoutent le dénivelé négatif, très exigeant pour les quadriceps et les tendons, et des sorties longues qui creusent la dette de récupération. Beaucoup de coureurs progressent en volume et en dénivelé en même temps, ce qui multiplie les contraintes.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">La technique de course compte, mais elle vient après. Une cadence plus élevée et un chaussage adapté aident, sans jamais compenser une planification trop agressive.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:20px;padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#003850;">Ce qu'on regarde d'abord</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">L'évolution du volume et du dénivelé sur les six dernières semaines.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Le sommeil et la récupération entre les sorties.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"/><path d="m2.5 21.5 1.4-1.4"/><path d="m20.1 3.9 1.4-1.4"/><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"/><path d="m9.6 14.4 4.8-4.8"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">La présence, ou non, de renforcement dans la semaine.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">La cadence, le chaussage et le terrain habituel.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ce qu'on voit le plus</p>
      <h2 style="margin:0 0 14px;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Les blessures typiques du coureur</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Quatre motifs couvrent l'essentiel des consultations de coureurs au cabinet.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Tendinopathie d'Achille</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Raideur matinale et douleur en début de sortie, souvent après une hausse de dénivelé.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Syndrome rotulien</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Douleur diffuse à l'avant du genou, marquée en descente et après une position assise prolongée.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Périostite tibiale</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Douleur diffuse du bord interne du tibia, typique des reprises sur route dure.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Aponévrosite plantaire</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Douleur sous le talon aux premiers pas du matin, longue à passer.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:clamp(60px,8vw,100px) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Notre accompagnement</p>
    <h2 style="margin:0 0 14px;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Du bilan à l'objectif</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Nous suivons les coureurs sur un cycle complet, pas seulement quand ça fait mal.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Au départ</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Le bilan du coureur</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Histoire d'entraînement, analyse de foulée en vidéo, mesures de force et de mobilité. On repart avec un diagnostic de charge plutôt qu'une liste d'étirements.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Analyse de foulée</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Testing</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Historique</span></div></div></div>
    <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Pendant la préparation</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Planifier la progression</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Construction de la montée en charge vers l'objectif, avec des paliers et des semaines allégées. Le renforcement s'intègre à la semaine plutôt qu'il ne s'ajoute.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Planification</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Renforcement</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Semaines allégées</span></div></div></div>
    <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">En cas de blessure</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Continuer à s'entraîner autrement</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">On adapte plutôt qu'on arrête : cross-training, travail de force, reprise en marche-course quand c'est nécessaire, retour progressif au volume.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Adaptation</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Cross-training</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Retour à la course</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">Le bilan complet se fait selon <a href="/methodes/clinique-du-coureur" style="font-weight:600;">La Clinique du Coureur®</a>, avec <a href="/methodes/testing-vald" style="font-weight:600;">un testing de force</a> chiffré si nécessaire.</p>
</section>

<section id="science" style="background:#003850;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#fff;">Ce que montrent les données sur la course</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:18px;padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Br J Sports Med</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Les blessures de surcharge dominent largement chez les coureurs, loin devant les traumatismes.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Revues épidémiologiques sur la course à pied.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:18px;padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Med Sci Sports Exerc · 2011</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Augmenter la cadence d'environ 10 % réduit nettement les charges au genou et à la hanche.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Heiderscheit et al.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:18px;padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Sports Med</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Le renforcement musculaire réduit le risque de blessure de surcharge, davantage que les étirements.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Méta-analyses sur la prévention.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:clamp(60px,8vw,100px) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:24px;padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:clamp(22px,3vw,30px);font-weight:700;letter-spacing:-.02em;color:#003850;">Quand consulter rapidement</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Certaines douleurs de coureur ne relèvent pas de la simple gestion de charge.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur osseuse très localisée, qui persiste à la marche.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur d'aine à l'appui : le col fémoral impose un avis rapide.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur qui apparaît de plus en plus tôt à chaque sortie.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Un gonflement articulaire après une sortie.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Chez la coureuse : des règles absentes ou irrégulières.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu'on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">À quelle vitesse augmenter mon volume ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Il n'y a pas de règle universelle. On progresse par paliers, une variable à la fois — volume ou dénivelé, pas les deux — avec des semaines allégées régulières.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Faut-il changer de chaussures ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Souvent non. Le confort ressenti reste le meilleur guide, et un changement brutal de type de chaussure est en soi un facteur de blessure.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Le renforcement fait-il perdre en légèreté ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Non. Deux séances courtes par semaine améliorent l'économie de course et la tolérance aux impacts.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Puis-je courir avec une douleur ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Si elle reste faible, ne s'aggrave pas pendant la sortie et disparaît le lendemain, souvent oui, en volume réduit. Sinon, on consulte.</p></div>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:clamp(60px,8vw,90px) clamp(20px,5vw,40px);">
  <div style="background:#fff;border-radius:24px;padding:clamp(26px,4vw,40px);box-shadow:0 6px 28px rgba(60,40,30,.08);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px;align-items:center;">
    <div style="display:flex;gap:18px;align-items:center;">
      <img src="/jb-colombie.jpg" alt="Jean-Baptiste Colombié, Kinésithérapeute du sport" style="width:78px;height:78px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
      <div>
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Écrit et validé par</p>
        <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#003850;">Jean-Baptiste Colombié</p>
        <p style="margin:0 0 8px;font-size:14px;color:rgba(51,51,52,.6);">Kinésithérapeute du sport</p>
        <a href="/equipe/jean-baptiste-colombie" style="font-size:14px;font-weight:600;text-decoration:none;">Voir sa fiche →</a>
      </div>
    </div>
    <div>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par le Dr Basile Carcassonne, médecin du sport, pour les signaux d'alerte osseux.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour : 28 août 2026 · prochaine revue : février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d'information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/methodes/clinique-du-coureur" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">La Clinique du Coureur®</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Analyse de foulée et gestion de la charge.</p></a>
    <a href="/pathologies/tendinopathie-achille" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Tendinopathie d'Achille</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">La blessure la plus fréquente du coureur.</p></a>
    <a href="/pathologies/syndrome-rotulien" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Syndrome rotulien</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Le genou qui pique en descente.</p></a>
    <a href="/soins/analyse-de-foulee" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Analyse de foulée</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Le bilan filmé, en une séance.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:24px;padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:clamp(24px,3.4vw,34px);font-weight:700;letter-spacing:-.025em;">Un objectif à préparer, une douleur qui traîne ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Bilan du coureur et analyse de foulée au cabinet Mugitu, 3 avenue Kléber à Biarritz.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:999px;background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
  {
    slug: "danse",
    title: `Danse : suivre des corps qui répètent`,
    eyebrow: `Par sport · danse`,
    lead: ``,
    crumb: `Danse`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    titleSize: "clamp(32px,5.2vw,64px)",
    titleLineHeight: "1.03",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:clamp(40px,5vw,56px) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:18px;padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Les blessures typiques</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Notre accompagnement</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Quand consulter</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,80px) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">La répétition avant l'impact</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Le danseur ne subit pas les chocs du sport collectif, mais il répète des amplitudes extrêmes des centaines de fois par jour, souvent sur un seul appui. La cheville, la hanche et le rachis lombaire encaissent l'essentiel de cette charge cumulée.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Le calendrier ne ressemble à aucun autre : séries de représentations, créations, reprises de répertoire, tournées. Les pics de charge ne sont pas planifiés comme dans le sport, et la culture du milieu pousse souvent à danser malgré la douleur.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">S'ajoutent des enjeux de poids, d'image et de pression esthétique. Un suivi de danseur qui ne prend pas en compte l'alimentation et le mental passe à côté d'une partie du problème.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:20px;padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#003850;">Ce qu'on regarde d'abord</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Le nombre d'heures de répétition et de représentation par semaine.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M12 2v20"/><path d="m15 19-3 3-3-3"/><path d="m19 9 3 3-3 3"/><path d="M2 12h20"/><path d="m5 9-3 3 3 3"/><path d="m9 5 3-3 3 3"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">La mobilité de hanche et de cheville, et la façon dont elle est utilisée.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"/><path d="m2.5 21.5 1.4-1.4"/><path d="m20.1 3.9 1.4-1.4"/><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"/><path d="m9.6 14.4 4.8-4.8"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">La force du mollet et des fessiers, très souvent sous-développée.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">L'alimentation, le sommeil et le rapport au corps.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ce qu'on voit le plus</p>
      <h2 style="margin:0 0 14px;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Les blessures typiques du danseur</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Quatre motifs reviennent le plus souvent chez les danseurs que nous suivons.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Cheville et pied</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Tendinopathies, conflits postérieurs, entorses à répétition, douleurs des orteils en pointes.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Hanche</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Douleurs antérieures, conflits fémoro-acétabulaires, tendinopathies du psoas et des fessiers.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Rachis lombaire</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Douleurs d'extension et de rotation, liées aux cambrés et aux portés.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Fractures de fatigue</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Métatarsiens et tibia, souvent sur fond de déficit énergétique.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:clamp(60px,8vw,100px) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Notre accompagnement</p>
    <h2 style="margin:0 0 14px;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Renforcer sans rigidifier</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Le danseur craint souvent que la musculation lui fasse perdre en amplitude. C'est l'inverse : la force protège l'amplitude.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Bilan</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Mesurer amplitude et force</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Mobilité de hanche et de cheville, force du mollet et des fessiers, contrôle sur un appui. On identifie les amplitudes utilisées sans contrôle musculaire.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Mobilité</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Force</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Contrôle unipodal</span></div></div></div>
    <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Programme</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Construire la capacité</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Renforcement du mollet en amplitude complète, travail des fessiers et du tronc, pliométrie légère. Deux à trois séances courtes par semaine, compatibles avec les répétitions.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Mollet</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Fessiers</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Pliométrie</span></div></div></div>
    <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Autour des représentations</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Accompagner les pics</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Suivi rapproché pendant les séries, thérapie manuelle, récupération, ajustement quand la douleur apparaît. Préparation mentale et suivi nutritionnel si besoin.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Récupération</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Préparation mentale</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Nutrition</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">Le suivi peut associer <a href="/soins/psychologie" style="font-weight:600;">la psychologie du sport</a> et <a href="/soins/nutrition-du-sport" style="font-weight:600;">la nutrition</a>, deux dimensions centrales chez le danseur.</p>
</section>

<section id="science" style="background:#003850;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#fff;">Ce que montrent les données sur la danse</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:18px;padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">J Dance Med Sci</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Les blessures de surcharge du membre inférieur, cheville et pied en tête, dominent chez les danseurs professionnels.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Études de surveillance en compagnies.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:18px;padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Br J Sports Med · RED-S</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Le déficit énergétique relatif au sport est particulièrement fréquent dans les disciplines esthétiques.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Consensus du CIO.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:18px;padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Sports Med</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Le renforcement n'altère pas la souplesse et améliore la tolérance à la charge chez le danseur.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Travaux sur la préparation physique en danse.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:clamp(60px,8vw,100px) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:24px;padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:clamp(22px,3vw,30px);font-weight:700;letter-spacing:-.02em;color:#003850;">Quand consulter rapidement</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Ces signes ne doivent pas être absorbés par la série de représentations.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur osseuse localisée du pied ou du tibia qui persiste à la marche.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une cheville qui se tord à répétition ou reste instable.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Un blocage de hanche, ou une douleur d'aine à chaque relevé.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une perte de poids rapide, une fatigue inhabituelle, des règles absentes.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur lombaire avec irradiation dans la jambe.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu'on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">La musculation va-t-elle me raidir ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Non. Un renforcement travaillé en amplitude complète maintient la souplesse et améliore le contrôle des grandes amplitudes.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Puis-je continuer à danser avec une douleur ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Une douleur légère qui ne s'aggrave pas peut être compatible avec une charge adaptée. Une douleur osseuse ou qui augmente, non.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Suivez-vous les danseurs professionnels ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Oui, avec un suivi calé sur le calendrier des créations et des représentations.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Le suivi nutritionnel est-il systématique ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Il est proposé, pas imposé. C'est souvent un levier important, notamment en cas de blessures répétées.</p></div>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:clamp(60px,8vw,90px) clamp(20px,5vw,40px);">
  <div style="background:#fff;border-radius:24px;padding:clamp(26px,4vw,40px);box-shadow:0 6px 28px rgba(60,40,30,.08);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px;align-items:center;">
    <div style="display:flex;gap:18px;align-items:center;">
      <img src="/jb-colombie.jpg" alt="Jean-Baptiste Colombié, Kinésithérapeute du sport" style="width:78px;height:78px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
      <div>
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Écrit et validé par</p>
        <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#003850;">Jean-Baptiste Colombié</p>
        <p style="margin:0 0 8px;font-size:14px;color:rgba(51,51,52,.6);">Kinésithérapeute du sport</p>
        <a href="/equipe/jean-baptiste-colombie" style="font-size:14px;font-weight:600;text-decoration:none;">Voir sa fiche →</a>
      </div>
    </div>
    <div>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par Marie Boura, psychologue du sport, pour la partie accompagnement mental et rapport au corps.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour : 28 août 2026 · prochaine revue : février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d'information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/soins/nutrition-du-sport" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Nutrition du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Énergie disponible et santé osseuse.</p></a>
    <a href="/soins/psychologie" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Psychologie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Pression esthétique, stress et confiance.</p></a>
    <a href="/pathologies/fracture-de-fatigue" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Fracture de fatigue</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Le diagnostic à ne pas manquer.</p></a>
    <a href="/soins/kinesitherapie-du-sport" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Kinésithérapie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Renforcement adapté au danseur.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:24px;padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:clamp(24px,3.4vw,34px);font-weight:700;letter-spacing:-.025em;">Danseur, professionnel ou en formation ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Bilan, suivi de saison et accompagnement complet au cabinet Mugitu, Biarritz.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:999px;background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
  {
    slug: "pelote-basque",
    title: `Pelote basque : soigner la main, équilibrer le corps`,
    eyebrow: `Par sport · pelote`,
    lead: ``,
    crumb: `Pelote basque`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    titleSize: "clamp(32px,5.2vw,64px)",
    titleLineHeight: "1.03",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:clamp(40px,5vw,56px) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:18px;padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Les blessures typiques</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Notre accompagnement</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Quand consulter</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,80px) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Un corps construit d'un seul côté</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">La pelote impose des impacts répétés sur une seule main, des rotations violentes du tronc et des appuis latéraux explosifs contre le mur. Le corps du pelotari se développe naturellement de façon asymétrique, et c'est cette asymétrie qui finit par coûter cher.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Selon la spécialité — main nue, pala, chistera, grand gant — les contraintes changent. La main nue expose aux traumatismes directs et aux douleurs osseuses de la paume. Les spécialités avec instrument déplacent la charge vers le coude et l'épaule.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Le calendrier de compétition et les entraînements en trinquet, souvent le soir après le travail, laissent peu de place à la récupération et au renforcement compensatoire.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:20px;padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#003850;">Ce qu'on regarde d'abord</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">L'état de la main : œdème, douleurs osseuses, sensibilité de la paume.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">L'écart de mobilité et de force entre les deux épaules.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M12 2v20"/><path d="m15 19-3 3-3-3"/><path d="m19 9 3 3-3 3"/><path d="M2 12h20"/><path d="m5 9-3 3 3 3"/><path d="m9 5 3-3 3 3"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">La rotation du tronc et la mobilité de hanche du côté d'appui.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Le volume de parties et le temps de récupération entre elles.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ce qu'on voit le plus</p>
      <h2 style="margin:0 0 14px;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Les blessures typiques de la pelote</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Quatre motifs reviennent régulièrement chez les pelotaris que nous suivons.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Main et poignet</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Contusions répétées, douleurs osseuses, atteintes des tendons du poignet, en particulier en main nue.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Épaule dominante</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Tendinopathie de la coiffe et déficit de rotation, liés au geste répété à haute vitesse.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Coude</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Épicondylite et douleurs d'insertion, plus fréquentes avec pala et instruments.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Rachis et hanche</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Lombalgies de rotation et douleurs de hanche du côté d'appui, souvent négligées.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:clamp(60px,8vw,100px) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Notre accompagnement</p>
    <h2 style="margin:0 0 14px;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Compenser l'asymétrie</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">L'objectif n'est pas de supprimer l'asymétrie, qui fait partie du sport, mais d'éviter qu'elle ne devienne un déficit.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Bilan initial</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Mesurer les écarts</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Force et mobilité comparées des deux côtés, état de la main, testing de rotation d'épaule et de hanche. On chiffre ce qui n'est habituellement qu'une impression.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Testing bilatéral</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Mobilité</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">État de la main</span></div></div></div>
    <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Programme d'entretien</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Renforcer le côté faible</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Travail du côté non dominant, renforcement de la coiffe et des rotateurs, mobilité thoracique et de hanche. Deux séances courtes par semaine suffisent.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Côté non dominant</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Coiffe</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Mobilité</span></div></div></div>
    <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Pendant la saison</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Protéger la main</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Soin des mains, adaptation du volume de parties, ostéopathie et thérapie manuelle entre les échéances, gestion des douleurs avant qu'elles n'arrêtent le joueur.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Soin des mains</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Ostéopathie</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Charge</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">Voir <a href="/pathologies/epicondylite" style="font-weight:600;">l'épicondylite</a> et <a href="/methodes/testing-vald" style="font-weight:600;">le testing de force</a> pour chiffrer les asymétries.</p>
</section>

<section id="science" style="background:#003850;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#fff;">Ce qu'on sait, et ce qu'on ne sait pas</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:18px;padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Littérature limitée</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">La pelote basque reste peu étudiée : les recommandations s'appuient largement sur les sports de raquette et de lancer.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Constat partagé par les praticiens du Pays basque.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:18px;padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Sports de lancer · BJSM</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Les déficits de rotation d'épaule du côté dominant sont associés à un risque accru de blessure.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Travaux sur baseball, handball et tennis.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:18px;padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Br J Sports Med</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Le renforcement régulier de la coiffe réduit les blessures d'épaule dans les sports de lancer.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Programmes de prévention en handball.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:clamp(60px,8vw,100px) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:24px;padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:clamp(22px,3vw,30px);font-weight:700;letter-spacing:-.02em;color:#003850;">Quand consulter rapidement</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">En pelote, certaines douleurs de main ne doivent pas attendre.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une douleur osseuse persistante de la paume ou d'un doigt après un impact.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Un doigt déformé, bloqué, ou impossible à plier.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une perte de sensibilité ou des fourmillements dans la main.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une épaule bloquée après une chute contre le mur.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une main qui reste gonflée et chaude plusieurs jours.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu'on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Les douleurs de main sont-elles inévitables ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Une part de contrainte est inhérente au jeu, mais une douleur osseuse qui persiste plusieurs jours n'est pas normale et doit être examinée.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Faut-il travailler le côté non dominant ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Oui, en entretien. Ce n'est pas pour jouer des deux mains, mais pour éviter que l'écart de force ne devienne une source de blessure.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Combien de temps d'arrêt après une épicondylite ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">On adapte plutôt qu'on arrête, avec un renforcement progressif sur trois à six mois.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Suivez-vous les joueurs en compétition ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Oui, avec un suivi adapté au calendrier des parties et aux échéances importantes.</p></div>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:clamp(60px,8vw,90px) clamp(20px,5vw,40px);">
  <div style="background:#fff;border-radius:24px;padding:clamp(26px,4vw,40px);box-shadow:0 6px 28px rgba(60,40,30,.08);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px;align-items:center;">
    <div style="display:flex;gap:18px;align-items:center;">
      <img src="/lucas-bengoechea.jpg" alt="Lucas Bengoechea, Ostéopathe D.O. du sport" style="width:78px;height:78px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
      <div>
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Écrit et validé par</p>
        <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#003850;">Lucas Bengoechea</p>
        <p style="margin:0 0 8px;font-size:14px;color:rgba(51,51,52,.6);">Ostéopathe D.O. du sport</p>
        <a href="/equipe/lucas-bengoechea" style="font-size:14px;font-weight:600;text-decoration:none;">Voir sa fiche →</a>
      </div>
    </div>
    <div>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par Jean-Baptiste Colombié, kinésithérapeute du sport, pour la partie renforcement et asymétries.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour : 28 août 2026 · prochaine revue : février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d'information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/pathologies/epicondylite" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Épicondylite</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">La douleur externe du coude.</p></a>
    <a href="/soins/osteopathie" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Ostéopathie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Mobilité thoracique, hanche et rachis.</p></a>
    <a href="/methodes/testing-vald" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Testing de force</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Chiffrer les écarts entre les deux côtés.</p></a>
    <a href="/methodes/preparation-physique" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Préparation physique</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Le travail compensatoire hors trinquet.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:24px;padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:clamp(24px,3.4vw,34px);font-weight:700;letter-spacing:-.025em;">Pelotari au Pays basque ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Bilan d'asymétries et suivi de saison au cabinet Mugitu, 3 avenue Kléber à Biarritz.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:999px;background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
];

export function getSport(slug: string): ContentPage | undefined {
  return SPORTS.find((p) => p.slug === slug);
}
