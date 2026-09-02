import type { ContentPage } from "./content-page";

/**
 * Pages « Nos soins » : le hub, les 6 disciplines et les 3 bilans.
 * Disciplines et bilans partagent la route /soins/<slug>.
 */

/** Le hub /nos-soins : toutes les portes d’entrée vers les soins. */
export const NOS_SOINS: Omit<ContentPage, "slug"> = {
  title: `Par quelle porte<br>entrer ?`,
  eyebrow: `Tous nos soins`,
  lead: ``,
  crumb: `Nos soins`,
  trail: [{ label: `Accueil`, href: "/" }],
  cta: "/equipe",
  size: "m",
  bodyHtml: `<section id="disciplines" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="margin-bottom:34px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Les disciplines</p>
    <h2 style="margin:0 0 12px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Sept métiers sous le même toit</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Si vous savez déjà qui vous voulez consulter, c’est le chemin le plus court.</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/soins/medecine-du-sport" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Médecine du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Consultation, bilans et traumatologie du sport.</p></a>
    <a href="/soins/osteopathie" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Ostéopathie</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Thérapie manuelle et remise en mouvement.</p></a>
    <a href="/soins/kinesitherapie-du-sport" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Kinésithérapie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Rééducation active et réathlétisation.</p></a>
    <a href="/soins/podologie" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Podologie</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Appuis, semelles et chaussage.</p></a>
    <a href="/soins/nutrition-du-sport" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Nutrition du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Énergie disponible, apports, récupération.</p></a>
    <a href="/soins/psychologie" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Psychologie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Stress, confiance, préparation mentale.</p></a>
    <a href="/methodes/preparation-physique" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Préparation physique</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Coaching individuel, small group, réathlétisation.</p></a>
  </div>
</section>

<section id="pathologies" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:34px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Les pathologies</p>
      <h2 style="margin:0 0 12px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Vous avez mal quelque part</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Chaque page explique l’origine de la douleur, comment on la diagnostique, ce qui la traite réellement et en combien de temps.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;">
      <a href="/pathologies/tendinopathie-achille" style="background:#fff;border-radius:var(--r-m);padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:var(--h3-s);font-weight:700;color:#003850;">Tendinopathie d’Achille</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">Douleur du tendon chez le coureur.</p></a>
      <a href="/pathologies/syndrome-rotulien" style="background:#fff;border-radius:var(--r-m);padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:var(--h3-s);font-weight:700;color:#003850;">Syndrome rotulien</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">Le genou du coureur, en descente.</p></a>
      <a href="/pathologies/entorse-de-cheville" style="background:#fff;border-radius:var(--r-m);padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:var(--h3-s);font-weight:700;color:#003850;">Entorse de cheville</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">Délais réels et reprise du sport.</p></a>
      <a href="/pathologies/lombalgie-du-sportif" style="background:#fff;border-radius:var(--r-m);padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:var(--h3-s);font-weight:700;color:#003850;">Lombalgie du sportif</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">Le mal de dos et le mouvement.</p></a>
      <a href="/pathologies/epaule-du-surfeur" style="background:#fff;border-radius:var(--r-m);padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:var(--h3-s);font-weight:700;color:#003850;">Épaule du surfeur</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">Tendinopathie de la coiffe et rame.</p></a>
      <a href="/pathologies/pubalgie" style="background:#fff;border-radius:var(--r-m);padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:var(--h3-s);font-weight:700;color:#003850;">Pubalgie</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">La douleur d’aine qui traîne.</p></a>
      <a href="/pathologies/lesion-ischio-jambiers" style="background:#fff;border-radius:var(--r-m);padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:var(--h3-s);font-weight:700;color:#003850;">Ischio-jambiers</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">Du claquage au retour au sprint.</p></a>
      <a href="/pathologies/reeducation-lca" style="background:#fff;border-radius:var(--r-m);padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:var(--h3-s);font-weight:700;color:#003850;">Rééducation du LCA</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">Les critères de retour au sport.</p></a>
      <a href="/pathologies/aponevrosite-plantaire" style="background:#fff;border-radius:var(--r-m);padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:var(--h3-s);font-weight:700;color:#003850;">Aponévrosite plantaire</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">La douleur du premier pas.</p></a>
      <a href="/pathologies/periostite-tibiale" style="background:#fff;border-radius:var(--r-m);padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:var(--h3-s);font-weight:700;color:#003850;">Périostite tibiale</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">Gérer la charge avant le repos.</p></a>
      <a href="/pathologies/epicondylite" style="background:#fff;border-radius:var(--r-m);padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:var(--h3-s);font-weight:700;color:#003850;">Épicondylite</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">Le coude du joueur et du manuel.</p></a>
      <a href="/pathologies/fracture-de-fatigue" style="background:#fff;border-radius:var(--r-m);padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:var(--h3-s);font-weight:700;color:#003850;">Fracture de fatigue</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">Les signes à ne pas laisser passer.</p></a>
    </div>
  </div>
</section>

<section id="sports" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="margin-bottom:34px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Par sport</p>
    <h2 style="margin:0 0 12px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Votre pratique, ses contraintes</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Les blessures typiques de chaque discipline, et comment nous accompagnons la saison.</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px;">
    <a href="/sports/surf" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Surf</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Épaule de rame, dos, take-off.</p></a>
    <a href="/sports/trail-et-course" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Trail et course</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Charge, surcharge et objectifs.</p></a>
    <a href="/sports/rugby" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Rugby</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Contacts, sprints, retour au jeu.</p></a>
    <a href="/sports/pelote-basque" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Pelote basque</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Main, coude et asymétries.</p></a>
    <a href="/sports/danse" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Danse</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Cheville, hanche, répétition.</p></a>
  </div>
</section>

<section id="bilans" style="background:#003850;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:34px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Bilans et tests</p>
      <h2 style="margin:0 0 12px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#fff;">Mesurer avant de décider</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(255,255,255,.68);">Quatre bilans, chacun avec un déroulé clair et un compte rendu écrit.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
      <a href="/soins/analyse-de-foulee" style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:24px;text-decoration:none;display:block;transition:background .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#fff;">Analyse de foulée</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.62);">Vidéo, mesures et plan de progression.</p></a>
      <a href="/methodes/testing-vald" style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:24px;text-decoration:none;display:block;transition:background .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#fff;">Testing de force</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.62);">Asymétries et ratios chiffrés.</p></a>
      <a href="/soins/bilan-retour-au-sport" style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:24px;text-decoration:none;display:block;transition:background .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#fff;">Bilan retour au sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.62);">Les critères avant de reprendre.</p></a>
      <a href="/soins/bilan-pre-saison" style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:24px;text-decoration:none;display:block;transition:background .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#fff;">Bilan de pré-saison</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.62);">La visite du sportif, élargie.</p></a>
    </div>
  </div>
</section>

<section id="methodes" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="margin-bottom:34px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Méthodes et technologies</p>
    <h2 style="margin:0 0 12px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Les outils qu’on utilise</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Des méthodes certifiées et des technologies de mesure, au service du parcours de soin.</p>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <a href="/methodes/allyane" style="padding:11px 20px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:14px;font-weight:600;text-decoration:none;">Méthode Allyane®</a>
    <a href="/methodes/clinique-du-coureur" style="padding:11px 20px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:14px;font-weight:600;text-decoration:none;">La Clinique du Coureur®</a>
    <a href="/methodes/testing-vald" style="padding:11px 20px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:14px;font-weight:600;text-decoration:none;">Testing Vald®</a>
    <a href="/methodes/emdr" style="padding:11px 20px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:14px;font-weight:600;text-decoration:none;">EMDR</a>
    <a href="/methodes/dry-needling" style="padding:11px 20px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:14px;font-weight:600;text-decoration:none;">Dry needling</a>
    <a href="/methodes/electrostimulation" style="padding:11px 20px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:14px;font-weight:600;text-decoration:none;">Électrostimulation</a>
    <a href="/methodes/bfr" style="padding:11px 20px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:14px;font-weight:600;text-decoration:none;">Entraînement BFR</a>
    <a href="/methodes/infiltrations" style="padding:11px 20px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:14px;font-weight:600;text-decoration:none;">Infiltrations</a>
    <a href="/methodes/mesotherapie" style="padding:11px 20px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:14px;font-weight:600;text-decoration:none;">Mésothérapie</a>
    <a href="/methodes/preparation-physique" style="padding:11px 20px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:14px;font-weight:600;text-decoration:none;">Préparation physique</a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:var(--r-xl);padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:var(--h2-m);font-weight:700;letter-spacing:-.025em;">Vous ne savez pas par où commencer ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Décrivez votre motif, nous vous orientons vers le bon praticien. Cabinet Mugitu, 3 avenue Kléber à Biarritz.</p>
    <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">
      <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
      <a href="/zone-intervention" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:var(--r-pill);background:rgba(255,255,255,.1);color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Venir au cabinet</a>
    </div>
  </div>
</section>`,
};

/** Disciplines et bilans, servis sous /soins/<slug>. */
export const SOINS: ContentPage[] = [
  {
    slug: "kinesitherapie-du-sport",
    title: `Kinésithérapie du sport : de la blessure à la performance`,
    eyebrow: `Discipline · kinésithérapie`,
    lead: ``,
    crumb: `Kinésithérapie du sport`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    size: "l",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:var(--sect-tight) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:var(--r-l);padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Le déroulé</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Notre approche</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Bon à savoir</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Rééduquer, c’est recharger</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">La kinésithérapie du sport ne se limite pas à faire disparaître une douleur. Elle vise à reconstruire la capacité du tissu blessé à encaisser la charge du sport pratiqué, puis à ramener le sportif à son niveau d’avant, voire au-dessus.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Concrètement, cela veut dire des séances actives, avec du matériel, de la charge et des mesures, plutôt que des soins passifs enchaînés. Les techniques manuelles ont leur place, en accompagnement, pas comme traitement principal.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Le plateau technique de 50 m² du cabinet permet de faire cette transition sans changer de lieu&nbsp;: on passe de la table à la barre, du renforcement au sprint, dans la même prise en charge.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:var(--r-l);padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#003850;">Pour qui</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Après une blessure, opérée ou non, du premier jour au retour au sport.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Pour une douleur chronique qui revient à chaque reprise.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Pour préparer un objectif ou combler un déficit identifié.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Pour un suivi de saison, individuel ou en club.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Le déroulé</p>
      <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Comment se passe une prise en charge</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Une première séance de bilan, puis des séances rythmées par des mesures plutôt que par un nombre décidé à l’avance.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Le bilan initial</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Histoire de la blessure, charge d’entraînement, examen, mesures de force et de mobilité, objectifs concrets.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Le plan de charge</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Un programme écrit, avec ce qui se fait en séance et ce qui se fait seul entre les séances. C’est là que se joue le résultat.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Les points d’étape</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Remesure régulière&nbsp;: force, sauts, douleur. On ajuste la progression sur des chiffres, pas sur une impression.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Le retour au sport</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Réathlétisation sur le plateau, gestes spécifiques, puis validation par une batterie de tests.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Notre approche</p>
    <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Trois principes de travail</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Ce qui structure toutes nos prises en charge, quelle que soit la blessure.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Principe 1</p><h3 style="margin:0;font-size:var(--h3-l);font-weight:700;color:#003850;">Le sportif est acteur</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Une part importante du travail se fait entre les séances. Nous expliquons ce qui se passe, pourquoi tel exercice, et ce que la douleur signifie ou non. Un patient qui comprend adhère et progresse.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Éducation</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Travail entre séances</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Autonomie</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Principe 2</p><h3 style="margin:0;font-size:var(--h3-l);font-weight:700;color:#003850;">On mesure</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Force au dynamomètre, sauts, mobilité. Sans chiffres, on décide de la reprise sur une sensation, et c’est la première cause de récidive.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Dynamomètre</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Hop tests</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Suivi</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Principe 3</p><h3 style="margin:0;font-size:var(--h3-l);font-weight:700;color:#003850;">On va jusqu’au bout</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">La rééducation ne s’arrête pas quand la douleur disparaît. Elle s’arrête quand le sportif a retrouvé sa capacité à encaisser son sport, tests à l’appui.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Réathlétisation</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Critères de sortie</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Prévention</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">Selon les besoins, la prise en charge s’appuie sur <a href="/methodes/testing-vald" style="font-weight:600;">le testing de force</a>, <a href="/methodes/bfr" style="font-weight:600;">le BFR</a>, <a href="/methodes/allyane" style="font-weight:600;">Allyane®</a> ou <a href="/methodes/dry-needling" style="font-weight:600;">le dry needling</a>.</p>
</section>

<section id="science" style="background:#003850;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#fff;">Sur quoi repose cette approche</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Br J Sports Med</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Les prises en charge actives, centrées sur l’exercice, obtiennent de meilleurs résultats à moyen terme que les traitements passifs dans la plupart des pathologies musculo-squelettiques.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Revues sur la rééducation musculo-squelettique.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Grindem et al. · 2016</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Valider des critères de force avant la reprise réduit fortement le risque de nouvelle blessure.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Cohorte de Delaware-Oslo.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Sports Med</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Le renforcement musculaire est le moyen de prévention des blessures le mieux documenté, devant les étirements et la proprioception seule.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Méta-analyses sur la prévention.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:var(--h2-s);font-weight:700;letter-spacing:-.02em;color:#003850;">Bon à savoir</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Quelques points pratiques avant la première séance.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une prescription médicale reste nécessaire au remboursement des séances de kinésithérapie.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Venez en tenue de sport&nbsp;: la première séance comporte des tests physiques.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Apportez vos comptes rendus d’imagerie et de chirurgie si vous en avez.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Le nombre de séances n’est pas fixé à l’avance&nbsp;: il dépend des mesures d’étape.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu’on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:var(--h3-m);font-weight:700;color:#003850;">Faut-il une ordonnance ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Elle reste nécessaire pour le remboursement. Vous pouvez consulter sans, dans un cadre non remboursé.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:var(--h3-m);font-weight:700;color:#003850;">Combien de séances faut-il ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Cela dépend de la blessure et de vos objectifs. Nous fixons des points d’étape chiffrés plutôt qu’un nombre de séances décidé au départ.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:var(--h3-m);font-weight:700;color:#003850;">Kiné ou ostéo, qui consulter ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">L’ostéopathie soulage et remet en mouvement, la kinésithérapie reconstruit la capacité dans la durée. Les deux se complètent, et nous travaillons ensemble au cabinet.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:var(--h3-m);font-weight:700;color:#003850;">Puis-je continuer mon sport pendant la rééducation ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Le plus souvent oui, sous une forme adaptée. L’arrêt complet est rarement la meilleure option.</p></div>
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
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par le Dr Basile Carcassonne, médecin du sport, pour la coordination du parcours de soin.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour&nbsp;: 28 août 2026 · prochaine revue&nbsp;: février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d’information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/soins/bilan-retour-au-sport" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Bilan retour au sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Les critères avant de reprendre.</p></a>
    <a href="/methodes/testing-vald" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Testing de force</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Les mesures qui pilotent la progression.</p></a>
    <a href="/methodes/preparation-physique" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Préparation physique</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">La suite logique de la rééducation.</p></a>
    <a href="/soins/osteopathie" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Ostéopathie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">L’approche complémentaire au cabinet.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:var(--r-xl);padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:var(--h2-m);font-weight:700;letter-spacing:-.025em;">Une rééducation à mener jusqu’au bout ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Bilan initial et plan de charge au cabinet Mugitu, 3 avenue Kléber à Biarritz.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
  {
    slug: "medecine-du-sport",
    title: `Médecine du sport<br>&amp; Rééducation`,
    eyebrow: `Discipline`,
    lead: `Diagnostiquer, traiter et rééduquer la blessure du sportif — du bilan médical au retour sur le terrain.`,
    crumb: `Médecine du sport &amp; Rééducation`,
    trail: [{ label: `Accueil`, href: "/" }],
    cta: "/equipe",
    size: "l",
    bodyHtml: `<section style="max-width:820px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">La discipline</p>
  <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Du diagnostic au retour au sport</h2>
  <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">La <strong style="color:#003850;">médecine du sport</strong> pose le diagnostic, traite les pathologies (traumatologie, tendinopathies, douleurs chroniques) et coordonne le parcours de soin. Les infiltrations, la mésothérapie et le PRP complètent l’arsenal thérapeutique.</p>
  <p style="margin:0 0 22px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">La <strong style="color:#003850;">rééducation</strong> prend le relais avec les kinésithérapeutes du sport&nbsp;: restaurer la mobilité, la force et la fonction, jusqu’au retour à la performance — le tout sur un dossier partagé.</p>
  <div style="display:flex;flex-wrap:wrap;gap:9px;">
    <span style="padding:8px 16px;border-radius:var(--r-pill);background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Traumatologie</span>
    <span style="padding:8px 16px;border-radius:var(--r-pill);background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Bilan clinique</span>
    <span style="padding:8px 16px;border-radius:var(--r-pill);background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Rééducation fonctionnelle</span>
    <span style="padding:8px 16px;border-radius:var(--r-pill);background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Retour au sport</span>
  </div>
</section>

<section style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:32px;"><p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">L’équipe</p><h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Praticiens concernés</h2></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
      <a href="/equipe/basile-carcassonne" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:var(--r-m);padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/basile-carcassonne.jpg" alt="Dr Basile Carcassonne" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Dr Basile Carcassonne</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Médecin du sport</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
      <a href="/equipe/julien-blamont" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:var(--r-m);padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/julien-blamont.jpg" alt="Julien Blamont" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 22%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Julien Blamont</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Kinésithérapeute du sport</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
      <a href="/equipe/jean-baptiste-colombie" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:var(--r-m);padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/jb-colombie.jpg" alt="Jean-Baptiste Colombié" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 25%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Jean-Baptiste Colombié</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Kinésithérapeute du sport</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
      <a href="/equipe/clement-cofourain" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:var(--r-m);padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/clement-cofourain.jpg" alt="Clément Cofourain" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Clément Cofourain</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Kinésithérapeute du sport</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
    </div>
  </div>
</section>`,
  },
  {
    slug: "osteopathie",
    title: `Ostéopathie`,
    eyebrow: `Discipline`,
    lead: `Une approche manuelle et globale du corps, pour lever les tensions, restaurer la mobilité et soutenir la performance.`,
    crumb: `Ostéopathie`,
    trail: [{ label: `Accueil`, href: "/" }],
    cta: "/equipe",
    size: "l",
    bodyHtml: `<section style="max-width:820px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">La discipline</p>
  <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Soigner le mouvement dans sa globalité</h2>
  <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">L'<strong style="color:#003850;">ostéopathie du sport</strong> traite les restrictions de mobilité et les déséquilibres qui limitent le geste sportif. Par des techniques manuelles douces, elle améliore l’amplitude articulaire, la récupération et le confort.</p>
  <p style="margin:0 0 22px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">Elle s’intègre naturellement au parcours Mugitu&nbsp;: en complément de la rééducation, de la préparation physique et des méthodes comme Allyane®.</p>
  <div style="display:flex;flex-wrap:wrap;gap:9px;">
    <span style="padding:8px 16px;border-radius:var(--r-pill);background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Mobilité articulaire</span>
    <span style="padding:8px 16px;border-radius:var(--r-pill);background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Récupération</span>
    <span style="padding:8px 16px;border-radius:var(--r-pill);background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Prévention</span>
    <span style="padding:8px 16px;border-radius:var(--r-pill);background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Douleurs chroniques</span>
  </div>
</section>

<section style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:32px;"><p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">L’équipe</p><h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Praticiens concernés</h2></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
      <a href="/equipe/lucas-bengoechea" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:var(--r-m);padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/lucas-bengoechea.jpg" alt="Lucas Bengoechea" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 22%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Lucas Bengoechea</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Ostéopathe du sport</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
      <a href="/equipe/marine-vignaud" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:var(--r-m);padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/marine-vignaud.png" alt="Marine Vignaud" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 20%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Marine Vignaud</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Ostéopathe &amp; prépa physique</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
    </div>
  </div>
</section>`,
  },
  {
    slug: "podologie",
    title: `Podologie`,
    eyebrow: `Discipline · atelier Ura`,
    lead: `Le pied, fondation du mouvement : analyse posturale, semelles sur mesure et suivi du coureur, à l’atelier Ura.`,
    crumb: `Podologie`,
    trail: [{ label: `Accueil`, href: "/" }],
    cta: "/equipe",
    size: "l",
    bodyHtml: `<section style="max-width:820px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">La discipline</p>
  <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Le pied, fondation du geste</h2>
  <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">La <strong style="color:#003850;">podologie du sport</strong> analyse la posture et l’appui pour corriger ce qui, plus haut dans la chaîne, génère douleurs et blessures. Elle conçoit des <strong style="color:#003850;">semelles orthopédiques sur mesure</strong> et accompagne le coureur — en lien étroit avec l’analyse de foulée.</p>
  <p style="margin:0 0 22px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">Les consultations se déroulent à l’atelier <strong style="color:#003850;">Ura</strong>, dédié à la podologie et au studio podcast.</p>
  <div style="display:flex;flex-wrap:wrap;gap:9px;">
    <span style="padding:8px 16px;border-radius:var(--r-pill);background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Analyse posturale</span>
    <span style="padding:8px 16px;border-radius:var(--r-pill);background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Semelles sur mesure</span>
    <span style="padding:8px 16px;border-radius:var(--r-pill);background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Suivi du coureur</span>
  </div>
</section>

<section style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:32px;"><p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">L’équipe</p><h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Praticienne concernée</h2></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
      <a href="/equipe/ophelie-hubert" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:var(--r-m);padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/ophelie-hubert.webp" alt="Ophélie Hubert" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 25%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Ophélie Hubert</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Pédicure-podologue du sport</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
    </div>
  </div>
</section>`,
  },
  {
    slug: "psychologie",
    title: `Psychologie`,
    eyebrow: `Discipline`,
    lead: `La performance et le bien-être se jouent aussi dans la tête : préparation mentale, gestion du stress et accompagnement clinique.`,
    crumb: `Psychologie`,
    trail: [{ label: `Accueil`, href: "/" }],
    cta: "/equipe",
    size: "l",
    bodyHtml: `<section style="max-width:820px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">La discipline</p>
  <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Le mental, pièce maîtresse</h2>
  <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">La <strong style="color:#003850;">psychologie du sport</strong> accompagne la préparation mentale (stress, confiance, routines de performance) et le retour après blessure. En parallèle, un suivi de <strong style="color:#003850;">psychologie clinique</strong> et la <strong style="color:#003850;">thérapie EMDR</strong> aident à dépasser trauma et blocages.</p>
  <p style="margin:0 0 22px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">Un accompagnement humain, confidentiel, au cabinet ou en visioconférence.</p>
  <div style="display:flex;flex-wrap:wrap;gap:9px;">
    <span style="padding:8px 16px;border-radius:var(--r-pill);background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Préparation mentale</span>
    <span style="padding:8px 16px;border-radius:var(--r-pill);background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Gestion du stress</span>
    <span style="padding:8px 16px;border-radius:var(--r-pill);background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">EMDR</span>
    <span style="padding:8px 16px;border-radius:var(--r-pill);background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Psychologie clinique</span>
  </div>
</section>

<section style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:32px;"><p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">L’équipe</p><h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Praticiennes concernées</h2></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
      <a href="/equipe/marie-boura" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:var(--r-m);padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/marie-boura.jpg" alt="Marie Boura" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 20%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Marie Boura</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Psychologue du sport &amp; préparation mentale</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
      <a href="/equipe/mailys-bersier" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:var(--r-m);padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/mailys-bersier.jpg" alt="Maïlys Bersier" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 20%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Maïlys Bersier</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Psychologue clinicienne — EMDR</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
    </div>
  </div>
</section>`,
  },
  {
    slug: "nutrition-du-sport",
    title: `Nutrition du sport`,
    eyebrow: `Discipline`,
    lead: `L’alimentation est notre meilleur carburant : une approche personnalisée, sans restriction, au service de la santé et de la performance.`,
    crumb: `Nutrition du sport`,
    trail: [{ label: `Accueil`, href: "/" }],
    cta: "/equipe",
    size: "l",
    bodyHtml: `<section style="max-width:820px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">La discipline</p>
  <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Bien manger pour mieux bouger</h2>
  <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">La <strong style="color:#003850;">nutrition du sport</strong> optimise l’énergie, la récupération et la composition corporelle&nbsp;: que manger avant, pendant et après l’effort, comment s’hydrater, comment préparer une compétition d’endurance.</p>
  <p style="margin:0 0 22px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">Une approche fondée sur la preuve et le plaisir, sans restriction ni culpabilisation — au cabinet, en visioconférence ou à domicile.</p>
  <div style="display:flex;flex-wrap:wrap;gap:9px;">
    <span style="padding:8px 16px;border-radius:var(--r-pill);background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Alimentation à l’effort</span>
    <span style="padding:8px 16px;border-radius:var(--r-pill);background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Endurance &amp; marathon</span>
    <span style="padding:8px 16px;border-radius:var(--r-pill);background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Composition corporelle</span>
    <span style="padding:8px 16px;border-radius:var(--r-pill);background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Visio &amp; domicile</span>
  </div>
</section>

<section style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:32px;"><p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">L’équipe</p><h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Praticiennes concernées</h2></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
      <a href="/equipe/ihintza-larralde" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:var(--r-m);padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/ihintza-larralde.webp" alt="Ihintza Larralde" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 30%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Ihintza Larralde</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Diététicienne du sport · FR/Euskara</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
      <a href="/equipe/johanna-marmiesse" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:var(--r-m);padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/johanna-marmiesse.webp" alt="Johanna Marmiesse" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 25%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Johanna Marmiesse</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Diététicienne du sport · à distance</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
    </div>
  </div>
</section>`,
  },
  {
    slug: "bilan-pre-saison",
    title: `Bilan de pré-saison : partir sur des bases connues`,
    eyebrow: `Bilan · avant la saison`,
    lead: ``,
    crumb: `Bilan de pré-saison`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    size: "m",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:var(--sect-tight) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:var(--r-l);padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Le déroulé</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Les volets du bilan</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Les limites</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Le bon moment pour agir</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">La pré-saison est la seule période de l’année où l’on peut construire sans être pris par le calendrier. C’est là que les déficits se comblent, que les blessures anciennes se soldent, et que la charge des mois à venir se planifie.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Le bilan couvre trois plans&nbsp;: médical, physique et, quand c’est pertinent, nutritionnel et mental. L’objectif est de savoir d’où vous partez, chiffres à l’appui, plutôt que de le découvrir à la première blessure.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Il s’adresse aux sportifs de loisir comme aux compétiteurs, individuellement ou par équipe pour les clubs du secteur.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:var(--r-l);padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#003850;">Pour qui</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Avant une reprise de saison ou une préparation d’objectif.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Après une saison marquée par plusieurs blessures.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Pour un certificat de non contre-indication en compétition.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Pour un club, en format collectif sur une demi-journée.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Le déroulé</p>
      <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Une consultation en quatre temps</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Comptez une heure environ, en tenue de sport, avec vos éventuels examens antérieurs.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">L’entretien médical</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Antécédents, blessures passées, traitements, sommeil, charge de la saison écoulée, symptômes à l’effort.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">L’examen clinique</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Cardio-vasculaire, articulaire, ECG selon les recommandations et le profil, orientation vers des examens complémentaires si nécessaire.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Les mesures physiques</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Force au dynamomètre, mobilité, tests de saut et d’équilibre, comparaison entre les deux côtés.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">La synthèse</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Compte rendu écrit, certificat si tout est en ordre, et les deux ou trois priorités à travailler avant la reprise.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Les volets</p>
    <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Trois plans, une même saison</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Selon votre profil, le bilan peut associer plusieurs praticiens du cabinet sur la même journée.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Volet 1</p><h3 style="margin:0;font-size:var(--h3-l);font-weight:700;color:#003850;">Médical</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Aptitude, dépistage cardio-vasculaire, gestion des pathologies chroniques et des traitements. C’est le socle, et le seul volet qui peut conclure à une contre-indication.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Aptitude</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Cardio-vasculaire</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Certificat</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Volet 2</p><h3 style="margin:0;font-size:var(--h3-l);font-weight:700;color:#003850;">Physique</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Testing de force et de mobilité, identification des asymétries et des déficits, programme de préparation physique pour les semaines qui précèdent la reprise.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Testing</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Asymétries</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Programme</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Volet 3</p><h3 style="margin:0;font-size:var(--h3-l);font-weight:700;color:#003850;">Nutrition et mental</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Apports et énergie disponible, hydratation, sommeil, gestion du stress et objectifs de saison. Proposés selon le profil et la discipline.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Énergie disponible</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Sommeil</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Objectifs</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">Le volet physique s’appuie sur <a href="/methodes/testing-vald" style="font-weight:600;">le testing de force</a>. Les volets complémentaires font intervenir <a href="/soins/nutrition-du-sport" style="font-weight:600;">la nutrition du sport</a> et <a href="/soins/psychologie" style="font-weight:600;">la psychologie du sport</a>.</p>
</section>

<section id="science" style="background:#003850;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#fff;">Sur quoi repose ce bilan</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Recommandations françaises</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">La visite de non contre-indication repose sur un interrogatoire et un examen clinique standardisés, avec ECG selon l’âge et le niveau de pratique.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Recommandations des sociétés savantes de cardiologie du sport.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Br J Sports Med</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Les antécédents de blessure sont le facteur prédictif le plus constant de nouvelle blessure sur la saison suivante.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Revues sur les facteurs de risque en sport.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Br J Sports Med · RED-S</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Le dépistage du déficit énergétique relatif au sport est recommandé chez les sportifs d’endurance et les disciplines esthétiques.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Consensus du CIO.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:var(--h2-s);font-weight:700;letter-spacing:-.02em;color:#003850;">Ce que ce bilan ne fait pas</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Un bilan de pré-saison éclaire une trajectoire, il ne la garantit pas.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Il ne prédit pas les blessures&nbsp;: il identifie des facteurs de risque modifiables.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Il ne remplace pas un avis cardiologique spécialisé quand celui-ci est indiqué.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Il ne dispense pas d’une consultation en cours de saison si un symptôme apparaît.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Un certificat ne vaut que pour la situation constatée le jour de l’examen.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu’on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:var(--h3-m);font-weight:700;color:#003850;">Le certificat est-il délivré le jour même ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Oui, si l’examen ne relève rien qui justifie un avis complémentaire. Sinon, nous vous orientons avant de conclure.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:var(--h3-m);font-weight:700;color:#003850;">Un ECG est-il systématique ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Il est proposé selon l’âge, le niveau de pratique et les antécédents, conformément aux recommandations en vigueur.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:var(--h3-m);font-weight:700;color:#003850;">Peut-on venir en équipe ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Oui. Nous organisons des sessions collectives pour les clubs du secteur, sur une demi-journée.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:var(--h3-m);font-weight:700;color:#003850;">Est-ce remboursé ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">La consultation médicale relève du cadre habituel. Les volets complémentaires dépendent de votre mutuelle&nbsp;: nous en parlons à la prise de rendez-vous.</p></div>
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
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par Jean-Baptiste Colombié, kinésithérapeute du sport, pour le volet testing et préparation physique.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour&nbsp;: 28 août 2026 · prochaine revue&nbsp;: février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d’information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/methodes/testing-vald" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Testing de force</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Les mesures du volet physique.</p></a>
    <a href="/soins/nutrition-du-sport" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Nutrition du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Énergie disponible et apports de saison.</p></a>
    <a href="/soins/psychologie" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Psychologie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Objectifs, stress et préparation mentale.</p></a>
    <a href="/soins/medecine-du-sport" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Médecine du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">La consultation médicale au cabinet.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:var(--r-xl);padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:var(--h2-m);font-weight:700;letter-spacing:-.025em;">La saison commence bientôt ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Bilan de pré-saison individuel ou en équipe au cabinet Mugitu, 3 avenue Kléber à Biarritz.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
  {
    slug: "bilan-retour-au-sport",
    title: `Bilan de retour au sport : décider sur des chiffres`,
    eyebrow: `Bilan · après blessure`,
    lead: ``,
    crumb: `Bilan retour au sport`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    size: "m",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:var(--sect-tight) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:var(--r-l);padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Le déroulé</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Ce qu’on mesure</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Les limites</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">La sensation arrive avant la capacité</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Après une blessure sérieuse, la douleur disparaît bien avant que la force et le contrôle ne soient revenus. C’est ce décalage qui explique la majorité des récidives&nbsp;: le sportif se sent prêt, son membre ne l’est pas encore.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Le bilan de retour au sport sert à combler cet écart d’information. On mesure la force, la qualité des sauts, la symétrie entre les deux côtés et le niveau de confiance, puis on compare à des seuils reconnus.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Le résultat n’est pas un feu vert ou rouge automatique. C’est une base de discussion entre vous, le praticien et, si besoin, l’entraîneur ou le chirurgien.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:var(--r-l);padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#003850;">Pour qui</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Après une reconstruction du ligament croisé antérieur.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Après une lésion musculaire, notamment des ischio-jambiers.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Après des entorses de cheville répétées.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Avant une reprise de compétition, en cas de doute.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Le déroulé</p>
      <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Une séance, quatre familles de tests</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Comptez environ une heure, en tenue de sport. Le compte rendu est remis avec les valeurs et les seuils.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Force isométrique</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Quadriceps, ischio-jambiers, adducteurs, mollet selon la blessure, mesurés au dynamomètre et comparés au côté sain.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Sauts et amortis</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Batterie de hop tests&nbsp;: saut simple, triple, latéral, avec analyse de la qualité de réception.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Tests spécifiques</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Course, changements de direction, gestes propres à votre sport, réalisés sur le plateau technique.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Confiance et appréhension</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Questionnaire validé&nbsp;: un membre fort mais redouté expose autant à la récidive qu’un membre faible.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Ce qu’on mesure</p>
    <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Les seuils qui font référence</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Trois familles de critères, à valider ensemble plutôt que séparément.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Critère 1</p><h3 style="margin:0;font-size:var(--h3-l);font-weight:700;color:#003850;">Symétrie de force</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Objectif classique&nbsp;: plus de 90 % du côté sain en force isométrique. C’est le critère le plus souvent manquant au moment où le sportif se sent prêt à reprendre.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Dynamomètre</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Ratio > 90 %</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Comparaison bilatérale</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Critère 2</p><h3 style="margin:0;font-size:var(--h3-l);font-weight:700;color:#003850;">Qualité des sauts</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Symétrie des distances mais aussi qualité de l’amorti et du contrôle du genou. Un saut équivalent en distance peut être très différent en qualité.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Hop tests</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Amorti</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Contrôle</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Critère 3</p><h3 style="margin:0;font-size:var(--h3-l);font-weight:700;color:#003850;">Confiance</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Score au questionnaire d’appréhension. Un score bas oriente vers un travail progressif d’exposition, parfois avec un accompagnement psychologique.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Questionnaire</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Appréhension</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Exposition graduée</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">Les mesures sont réalisées avec <a href="/methodes/testing-vald" style="font-weight:600;">le matériel de testing du cabinet</a>. Voir aussi <a href="/pathologies/reeducation-lca" style="font-weight:600;">la rééducation du LCA</a>.</p>
</section>

<section id="science" style="background:#003850;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#fff;">Sur quoi reposent ces critères</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Grindem et al. · BJSM 2016</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Valider des critères de force et retarder la reprise réduit fortement le risque de nouvelle rupture du LCA.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Cohorte de Delaware-Oslo.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Kyritsis et al.</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Ne pas remplir les critères de retour au sport multiplie le risque de récidive chez les footballeurs professionnels.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Cohorte Aspetar.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">AJSM</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Les déficits de force résiduels au moment de la reprise sont associés à un risque accru de nouvelle lésion musculaire.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Études de suivi post-lésionnel.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:var(--h2-s);font-weight:700;letter-spacing:-.02em;color:#003850;">Ce que ce bilan ne fait pas</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Un test reste un test&nbsp;: il éclaire une décision, il ne la remplace pas.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Il ne garantit pas l’absence de récidive&nbsp;: il réduit un risque, il ne l’annule pas.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Il ne remplace pas l’avis du chirurgien après une opération.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Il ne dispense pas de la progression sur le terrain, entraînements avant matchs.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Il n’a de sens qu’à distance suffisante de la blessure&nbsp;: trop tôt, il ne mesure rien d’utile.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu’on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:var(--h3-m);font-weight:700;color:#003850;">Quand faire ce bilan ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Généralement à partir du sixième mois après une reconstruction du LCA, ou en fin de rééducation pour une lésion musculaire.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:var(--h3-m);font-weight:700;color:#003850;">Combien de temps dure la séance ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Environ une heure, avec un compte rendu chiffré remis ensuite et partageable avec votre chirurgien ou votre entraîneur.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:var(--h3-m);font-weight:700;color:#003850;">Que se passe-t-il si je ne passe pas les seuils ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">On identifie précisément ce qui manque et on construit le programme des semaines suivantes. Le bilan se refait ensuite.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:var(--h3-m);font-weight:700;color:#003850;">Est-ce utile hors haut niveau ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Oui. Le risque de récidive concerne d’abord les sportifs amateurs, qui reprennent souvent sans aucune mesure.</p></div>
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
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par le Dr Basile Carcassonne, médecin du sport, pour la coordination avec l’avis chirurgical.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour&nbsp;: 28 août 2026 · prochaine revue&nbsp;: février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d’information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/pathologies/reeducation-lca" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Rééducation du LCA</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Le parcours complet, étape par étape.</p></a>
    <a href="/methodes/testing-vald" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Testing de force</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Le matériel et les mesures utilisées.</p></a>
    <a href="/pathologies/lesion-ischio-jambiers" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Ischio-jambiers</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Retour au sprint après lésion musculaire.</p></a>
    <a href="/methodes/preparation-physique" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Préparation physique</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Combler les déficits identifiés.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:var(--r-xl);padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:var(--h2-m);font-weight:700;letter-spacing:-.025em;">Prêt à reprendre, vraiment ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Bilan de retour au sport chiffré au cabinet Mugitu, 3 avenue Kléber à Biarritz.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
  {
    slug: "analyse-de-foulee",
    title: `Analyse de foulée : comprendre comment vous courez`,
    eyebrow: `Bilan · course à pied`,
    lead: ``,
    crumb: `Analyse de foulée`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    size: "m",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:var(--sect-tight) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:var(--r-l);padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Le déroulé</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Ce qu’on mesure</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Les limites</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce n’est pas une leçon de technique</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">L’objectif n’est pas de vous apprendre à courir « correctement ». Il n’existe pas de foulée idéale&nbsp;: ce qui compte, c’est l’adéquation entre votre façon de courir, votre charge d’entraînement et ce que votre corps encaisse aujourd’hui.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Une analyse de foulée sert donc à deux choses&nbsp;: comprendre pourquoi une douleur revient toujours au même endroit, et identifier les quelques ajustements — cadence, chaussage, planification, renforcement — qui feront réellement la différence.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Elle s’adresse autant au coureur blessé qu’au coureur en bonne santé qui prépare un objectif ou augmente son volume.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:var(--r-l);padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#003850;">Pour qui</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une blessure de course qui revient toujours au même endroit.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Un premier dossard, un trail long, un changement d’objectif.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Une hausse de volume prévue dans les mois qui viennent.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Un doute sur le chaussage ou le passage au minimaliste.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Le déroulé</p>
      <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Une séance en quatre temps</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Comptez une heure trente au cabinet, en tenue de course, avec vos chaussures habituelles.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">L’entretien</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Historique d’entraînement, objectifs, blessures passées, contraintes de vie. C’est la partie la plus informative de la séance.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Le bilan physique</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Mobilité, force du mollet, des quadriceps et des fessiers, tests de saut et d’appui unipodal, mesures au dynamomètre.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">La captation vidéo</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Course sur tapis et au sol, filmée sous plusieurs angles, à différentes allures. Analyse image par image avec vous.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Le plan de progression</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Un compte rendu écrit&nbsp;: ce qu’on ajuste, les exercices prioritaires, et la progression de charge sur les semaines à venir.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Ce qu’on mesure</p>
    <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Les paramètres qui comptent vraiment</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">On ne mesure pas tout ce qui est mesurable, seulement ce qui change la décision.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Paramètre 1</p><h3 style="margin:0;font-size:var(--h3-l);font-weight:700;color:#003850;">La cadence</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Le nombre de pas par minute conditionne directement les charges au genou et à la hanche. C’est le levier le plus simple à ajuster et l’un des plus efficaces.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Pas par minute</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Charges articulaires</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Ajustement simple</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Paramètre 2</p><h3 style="margin:0;font-size:var(--h3-l);font-weight:700;color:#003850;">La charge d’entraînement</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Volume, dénivelé, densité des séances sur les six dernières semaines. La cause de la blessure est presque toujours ici, pas dans la vidéo.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Volume</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Dénivelé</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Progression</span></div></div></div>
    <div style="background:#fff;border-radius:var(--r-l);padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:700;color:#04A49B;">Paramètre 3</p><h3 style="margin:0;font-size:var(--h3-l);font-weight:700;color:#003850;">La capacité musculaire</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Force du mollet, des quadriceps, tolérance aux sauts. C’est ce qui détermine combien votre corps peut encaisser d’impacts.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Force du mollet</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Sauts</span><span style="padding:5px 11px;border-radius:var(--r-pill);background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Symétrie</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">Le bilan s’appuie sur la méthode <a href="/methodes/clinique-du-coureur" style="font-weight:600;">La Clinique du Coureur®</a>. Les mesures de force peuvent être complétées par <a href="/methodes/testing-vald" style="font-weight:600;">un testing instrumenté</a>.</p>
</section>

<section id="science" style="background:#003850;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#fff;">Sur quoi repose le bilan</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Med Sci Sports Exerc · 2011</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Augmenter la cadence d’environ 10 % réduit nettement les charges au genou et à la hanche.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Heiderscheit et al.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Br J Sports Med</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">La progression de charge est le facteur modifiable le plus associé aux blessures de course.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Revues sur les blessures du coureur.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:var(--r-pill);background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">JOSPT</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">La rééducation de la course diminue la douleur et améliore la biomécanique dans les blessures de surcharge.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Revues sur le gait retraining.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:var(--r-xl);padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:var(--h2-s);font-weight:700;letter-spacing:-.02em;color:#003850;">Ce que ce bilan ne fait pas</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Autant le dire clairement&nbsp;: l’analyse de foulée n’est pas une réponse à tout.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Elle ne pose pas de diagnostic médical&nbsp;: une douleur osseuse suspecte relève d’une consultation médicale.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Elle ne transforme pas une foulée en une autre&nbsp;: les changements sont ciblés et progressifs.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Elle ne remplace pas le renforcement, qui reste le travail de fond.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Elle ne garantit pas l’absence de blessure&nbsp;: elle réduit les facteurs de risque modifiables.</p>
    </div>
  </div>
</section>

<section id="faq" style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Questions fréquentes</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce qu’on nous demande en consultation</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:var(--h3-m);font-weight:700;color:#003850;">Combien de temps dure la séance ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Environ une heure trente, avec un compte rendu écrit remis ensuite.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:var(--h3-m);font-weight:700;color:#003850;">Que dois-je apporter ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Votre tenue de course, vos chaussures habituelles — y compris les anciennes paires — et l’historique de vos dernières semaines d’entraînement.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:var(--h3-m);font-weight:700;color:#003850;">Faut-il être blessé pour venir ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Non. Beaucoup de coureurs viennent avant une première grosse échéance ou une hausse de volume.</p></div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:var(--h3-m);font-weight:700;color:#003850;">Est-ce remboursé ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Une partie peut l’être selon le cadre de la séance et votre mutuelle. Nous en parlons à la prise de rendez-vous.</p></div>
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
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par le Dr Basile Carcassonne, médecin du sport, pour les critères d’orientation médicale.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour&nbsp;: 28 août 2026 · prochaine revue&nbsp;: février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d’information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/methodes/clinique-du-coureur" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">La Clinique du Coureur®</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">La méthode sur laquelle s’appuie le bilan.</p></a>
    <a href="/sports/trail-et-course" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Trail et course à pied</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Le suivi du coureur sur la saison.</p></a>
    <a href="/pathologies/tendinopathie-achille" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Tendinopathie d’Achille</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">La blessure la plus fréquente du coureur.</p></a>
    <a href="/soins/podologie" style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Podologie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Appuis, chaussage et semelles.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:var(--r-xl);padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:var(--h2-m);font-weight:700;letter-spacing:-.025em;">Envie de comprendre votre foulée ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Analyse de foulée filmée et plan de progression au cabinet Mugitu, 3 avenue Kléber à Biarritz.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
];

export function getSoin(slug: string): ContentPage | undefined {
  return SOINS.find((s) => s.slug === slug);
}
