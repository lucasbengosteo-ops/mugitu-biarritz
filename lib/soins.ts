/**
 * Pages « Nos soins » — le hub et les 6 disciplines, extraits des maquettes
 * du projet Claude Design.
 *
 * Même parti que lib/methodes.ts et lib/fiches.ts : hero structuré, corps en
 * HTML statique versionné issu du bundle de design (jamais de saisie
 * utilisateur — c'est ce qui rend `dangerouslySetInnerHTML` acceptable).
 */

export type SoinPage = {
  slug: string;
  title: string;
  eyebrow: string;
  lead: string;
  crumb: string;
  /** Fil d'Ariane, hors élément courant. */
  trail: { label: string; href: string }[];
  cta: string;
  bodyHtml: string;
};

/** Le hub /nos-soins : toutes les portes d'entrée vers les soins. */
export const NOS_SOINS: Omit<SoinPage, "slug"> = {
  title: `Par quelle porte<br>entrer ?`,
  eyebrow: `Tous nos soins`,
  lead: ``,
  crumb: `Nos soins`,
  trail: [{ label: `Accueil`, href: "/" }],
  cta: "/equipe",
  bodyHtml: `<section id="disciplines" style="max-width:1140px;margin:0 auto;padding:clamp(60px,8vw,100px) clamp(20px,5vw,40px);">
  <div style="margin-bottom:34px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Les disciplines</p>
    <h2 style="margin:0 0 12px;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Sept métiers sous le même toit</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Si vous savez déjà qui vous voulez consulter, c'est le chemin le plus court.</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/soins/medecine-du-sport" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Médecine du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Consultation, bilans et traumatologie du sport.</p></a>
    <a href="/soins/osteopathie" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Ostéopathie</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Thérapie manuelle et remise en mouvement.</p></a>
    <a href="/soins/kinesitherapie-du-sport" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Kinésithérapie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Rééducation active et réathlétisation.</p></a>
    <a href="/soins/podologie" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Podologie</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Appuis, semelles et chaussage.</p></a>
    <a href="/soins/nutrition-du-sport" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Nutrition du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Énergie disponible, apports, récupération.</p></a>
    <a href="/soins/psychologie" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Psychologie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Stress, confiance, préparation mentale.</p></a>
    <a href="/methodes/preparation-physique" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Préparation physique</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Coaching individuel, small group, réathlétisation.</p></a>
  </div>
</section>

<section id="pathologies" style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:34px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Les pathologies</p>
      <h2 style="margin:0 0 12px;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Vous avez mal quelque part</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Chaque page explique l'origine de la douleur, comment on la diagnostique, ce qui la traite réellement et en combien de temps.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;">
      <a href="/pathologies/tendinopathie-achille" style="background:#fff;border-radius:16px;padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:16px;font-weight:700;color:#003850;">Tendinopathie d'Achille</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">Douleur du tendon chez le coureur.</p></a>
      <a href="/pathologies/syndrome-rotulien" style="background:#fff;border-radius:16px;padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:16px;font-weight:700;color:#003850;">Syndrome rotulien</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">Le genou du coureur, en descente.</p></a>
      <a href="/pathologies/entorse-de-cheville" style="background:#fff;border-radius:16px;padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:16px;font-weight:700;color:#003850;">Entorse de cheville</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">Délais réels et reprise du sport.</p></a>
      <a href="/pathologies/lombalgie-du-sportif" style="background:#fff;border-radius:16px;padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:16px;font-weight:700;color:#003850;">Lombalgie du sportif</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">Le mal de dos et le mouvement.</p></a>
      <a href="/pathologies/epaule-du-surfeur" style="background:#fff;border-radius:16px;padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:16px;font-weight:700;color:#003850;">Épaule du surfeur</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">Tendinopathie de la coiffe et rame.</p></a>
      <a href="/pathologies/pubalgie" style="background:#fff;border-radius:16px;padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:16px;font-weight:700;color:#003850;">Pubalgie</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">La douleur d'aine qui traîne.</p></a>
      <a href="/pathologies/lesion-ischio-jambiers" style="background:#fff;border-radius:16px;padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:16px;font-weight:700;color:#003850;">Ischio-jambiers</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">Du claquage au retour au sprint.</p></a>
      <a href="/pathologies/reeducation-lca" style="background:#fff;border-radius:16px;padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:16px;font-weight:700;color:#003850;">Rééducation du LCA</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">Les critères de retour au sport.</p></a>
      <a href="/pathologies/aponevrosite-plantaire" style="background:#fff;border-radius:16px;padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:16px;font-weight:700;color:#003850;">Aponévrosite plantaire</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">La douleur du premier pas.</p></a>
      <a href="/pathologies/periostite-tibiale" style="background:#fff;border-radius:16px;padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:16px;font-weight:700;color:#003850;">Périostite tibiale</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">Gérer la charge avant le repos.</p></a>
      <a href="/pathologies/epicondylite" style="background:#fff;border-radius:16px;padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:16px;font-weight:700;color:#003850;">Épicondylite</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">Le coude du joueur et du manuel.</p></a>
      <a href="/pathologies/fracture-de-fatigue" style="background:#fff;border-radius:16px;padding:20px 22px;box-shadow:0 2px 14px rgba(60,40,30,.05);text-decoration:none;display:block;"><h3 style="margin:0 0 5px;font-size:16px;font-weight:700;color:#003850;">Fracture de fatigue</h3><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(51,51,52,.6);">Les signes à ne pas laisser passer.</p></a>
    </div>
  </div>
</section>

<section id="sports" style="max-width:1140px;margin:0 auto;padding:clamp(60px,8vw,100px) clamp(20px,5vw,40px);">
  <div style="margin-bottom:34px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Par sport</p>
    <h2 style="margin:0 0 12px;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Votre pratique, ses contraintes</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Les blessures typiques de chaque discipline, et comment nous accompagnons la saison.</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px;">
    <a href="/sports/surf" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Surf</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Épaule de rame, dos, take-off.</p></a>
    <a href="/sports/trail-et-course" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Trail et course</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Charge, surcharge et objectifs.</p></a>
    <a href="/sports/rugby" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Rugby</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Contacts, sprints, retour au jeu.</p></a>
    <a href="/sports/pelote-basque" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Pelote basque</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Main, coude et asymétries.</p></a>
    <a href="/sports/danse" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Danse</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Cheville, hanche, répétition.</p></a>
  </div>
</section>

<section id="bilans" style="background:#003850;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:34px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Bilans et tests</p>
      <h2 style="margin:0 0 12px;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#fff;">Mesurer avant de décider</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(255,255,255,.68);">Quatre bilans, chacun avec un déroulé clair et un compte rendu écrit.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
      <a href="/soins/analyse-de-foulee" style="background:rgba(255,255,255,.06);border-radius:18px;padding:24px;text-decoration:none;display:block;transition:background .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#fff;">Analyse de foulée</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.62);">Vidéo, mesures et plan de progression.</p></a>
      <a href="/methodes/testing-vald" style="background:rgba(255,255,255,.06);border-radius:18px;padding:24px;text-decoration:none;display:block;transition:background .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#fff;">Testing de force</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.62);">Asymétries et ratios chiffrés.</p></a>
      <a href="/soins/bilan-retour-au-sport" style="background:rgba(255,255,255,.06);border-radius:18px;padding:24px;text-decoration:none;display:block;transition:background .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#fff;">Bilan retour au sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.62);">Les critères avant de reprendre.</p></a>
      <a href="/soins/bilan-pre-saison" style="background:rgba(255,255,255,.06);border-radius:18px;padding:24px;text-decoration:none;display:block;transition:background .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#fff;">Bilan de pré-saison</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.62);">La visite du sportif, élargie.</p></a>
    </div>
  </div>
</section>

<section id="methodes" style="max-width:1140px;margin:0 auto;padding:clamp(60px,8vw,100px) clamp(20px,5vw,40px);">
  <div style="margin-bottom:34px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Méthodes et technologies</p>
    <h2 style="margin:0 0 12px;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Les outils qu'on utilise</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Des méthodes certifiées et des technologies de mesure, au service du parcours de soin.</p>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <a href="/methodes/allyane" style="padding:11px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:14px;font-weight:600;text-decoration:none;">Méthode Allyane®</a>
    <a href="/methodes/clinique-du-coureur" style="padding:11px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:14px;font-weight:600;text-decoration:none;">La Clinique du Coureur®</a>
    <a href="/methodes/testing-vald" style="padding:11px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:14px;font-weight:600;text-decoration:none;">Testing Vald®</a>
    <a href="/methodes/emdr" style="padding:11px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:14px;font-weight:600;text-decoration:none;">EMDR</a>
    <a href="/methodes/dry-needling" style="padding:11px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:14px;font-weight:600;text-decoration:none;">Dry needling</a>
    <a href="/methodes/electrostimulation" style="padding:11px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:14px;font-weight:600;text-decoration:none;">Électrostimulation</a>
    <a href="/methodes/bfr" style="padding:11px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:14px;font-weight:600;text-decoration:none;">Entraînement BFR</a>
    <a href="/methodes/infiltrations" style="padding:11px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:14px;font-weight:600;text-decoration:none;">Infiltrations</a>
    <a href="/methodes/mesotherapie" style="padding:11px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:14px;font-weight:600;text-decoration:none;">Mésothérapie</a>
    <a href="/methodes/preparation-physique" style="padding:11px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:14px;font-weight:600;text-decoration:none;">Préparation physique</a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:24px;padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:clamp(24px,3.4vw,34px);font-weight:700;letter-spacing:-.025em;">Vous ne savez pas par où commencer ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Décrivez votre motif, nous vous orientons vers le bon praticien. Cabinet Mugitu, 3 avenue Kléber à Biarritz.</p>
    <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">
      <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:999px;background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
      <a href="/zone-intervention" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:999px;background:rgba(255,255,255,.1);color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Venir au cabinet</a>
    </div>
  </div>
</section>`,
};

/** Les 6 pages de discipline, servies sous /soins/<slug>. */
export const SOINS: SoinPage[] = [
  {
    slug: "kinesitherapie-du-sport",
    title: `Kinésithérapie du sport : de la blessure à la performance`,
    eyebrow: `Discipline · kinésithérapie`,
    lead: ``,
    crumb: `Kinésithérapie du sport`,
    trail: [{ label: `Accueil`, href: "/" }, { label: `Nos soins`, href: "/nos-soins" }],
    cta: "/equipe",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:clamp(40px,5vw,56px) clamp(20px,5vw,40px) 0;">
  <div style="background:#fff;border-radius:18px;padding:22px 26px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-wrap:wrap;gap:10px 26px;align-items:center;">
    <span style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:rgba(51,51,52,.42);">Sur cette page</span>
    <a href="#comprendre" style="font-size:14px;font-weight:600;text-decoration:none;">Comprendre</a>
    <a href="#diagnostic" style="font-size:14px;font-weight:600;text-decoration:none;">Le déroulé</a>
    <a href="#traitement" style="font-size:14px;font-weight:600;text-decoration:none;">Notre approche</a>
    <a href="#science" style="font-size:14px;font-weight:600;text-decoration:none;">Ce que dit la science</a>
    <a href="#urgence" style="font-size:14px;font-weight:600;text-decoration:none;">Bon à savoir</a>
    <a href="#faq" style="font-size:14px;font-weight:600;text-decoration:none;">FAQ</a>
  </div>
</section>

<section id="comprendre" style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,80px) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Comprendre</p>
      <h2 style="margin:0 0 18px;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Rééduquer, c'est recharger</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">La kinésithérapie du sport ne se limite pas à faire disparaître une douleur. Elle vise à reconstruire la capacité du tissu blessé à encaisser la charge du sport pratiqué, puis à ramener le sportif à son niveau d'avant, voire au-dessus.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Concrètement, cela veut dire des séances actives, avec du matériel, de la charge et des mesures, plutôt que des soins passifs enchaînés. Les techniques manuelles ont leur place, en accompagnement, pas comme traitement principal.</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:rgba(51,51,52,.7);">Le plateau technique de 50 m² du cabinet permet de faire cette transition sans changer de lieu : on passe de la table à la barre, du renforcement au sprint, dans la même prise en charge.</p>
    </div>
    <div style="background:#F5EDE4;border-radius:20px;padding:28px;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#003850;">Pour qui</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Après une blessure, opérée ou non, du premier jour au retour au sport.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Pour une douleur chronique qui revient à chaque reprise.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Pour préparer un objectif ou combler un déficit identifié.</p></div>
        <div style="display:flex;gap:12px;align-items:flex-start;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;margin-top:2px;"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.72);">Pour un suivi de saison, individuel ou en club.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="diagnostic" style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Le déroulé</p>
      <h2 style="margin:0 0 14px;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Comment se passe une prise en charge</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Une première séance de bilan, puis des séances rythmées par des mesures plutôt que par un nombre décidé à l'avance.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Le bilan initial</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Histoire de la blessure, charge d'entraînement, examen, mesures de force et de mobilité, objectifs concrets.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Le plan de charge</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Un programme écrit, avec ce qui se fait en séance et ce qui se fait seul entre les séances. C'est là que se joue le résultat.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Les points d'étape</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Remesure régulière : force, sauts, douleur. On ajuste la progression sur des chiffres, pas sur une impression.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">4</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Le retour au sport</h3><p style="margin:0;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Réathlétisation sur le plateau, gestes spécifiques, puis validation par une batterie de tests.</p></div>
    </div>
  </div>
</section>

<section id="traitement" style="max-width:1140px;margin:0 auto;padding:clamp(60px,8vw,100px) clamp(20px,5vw,40px);">
  <div style="margin-bottom:40px;max-width:660px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Notre approche</p>
    <h2 style="margin:0 0 14px;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Trois principes de travail</h2>
    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Ce qui structure toutes nos prises en charge, quelle que soit la blessure.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Principe 1</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">Le sportif est acteur</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Une part importante du travail se fait entre les séances. Nous expliquons ce qui se passe, pourquoi tel exercice, et ce que la douleur signifie ou non. Un patient qui comprend adhère et progresse.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Éducation</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Travail entre séances</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Autonomie</span></div></div></div>
    <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Principe 2</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">On mesure</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Force au dynamomètre, sauts, mobilité. Sans chiffres, on décide de la reprise sur une sensation, et c'est la première cause de récidive.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Dynamomètre</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Hop tests</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Suivi</span></div></div></div>
    <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;align-items:start;"><div style="flex:0 0 auto;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#04A49B;">Principe 3</p><h3 style="margin:0;font-size:20px;font-weight:700;color:#003850;">On va jusqu'au bout</h3></div><div style="grid-column:span 2;min-width:240px;"><p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">La rééducation ne s'arrête pas quand la douleur disparaît. Elle s'arrête quand le sportif a retrouvé sa capacité à encaisser son sport, tests à l'appui.</p><div style="display:flex;flex-wrap:wrap;gap:7px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Réathlétisation</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Critères de sortie</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Prévention</span></div></div></div>
  </div>
  <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">Selon les besoins, la prise en charge s'appuie sur <a href="/methodes/testing-vald" style="font-weight:600;">le testing de force</a>, <a href="/methodes/bfr" style="font-weight:600;">le BFR</a>, <a href="/methodes/allyane" style="font-weight:600;">Allyane®</a> ou <a href="/methodes/dry-needling" style="font-weight:600;">le dry needling</a>.</p>
</section>

<section id="science" style="background:#003850;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:40px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p>
      <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#fff;">Sur quoi repose cette approche</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,.06);border-radius:18px;padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Br J Sports Med</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Les prises en charge actives, centrées sur l'exercice, obtiennent de meilleurs résultats à moyen terme que les traitements passifs dans la plupart des pathologies musculo-squelettiques.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Revues sur la rééducation musculo-squelettique.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:18px;padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Grindem et al. · 2016</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Valider des critères de force avant la reprise réduit fortement le risque de nouvelle blessure.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Cohorte de Delaware-Oslo.</p></div>
      <div style="background:rgba(255,255,255,.06);border-radius:18px;padding:26px;"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.2);color:#5fd6cf;font-size:11px;font-weight:700;margin-bottom:14px;">Sports Med</span><p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#fff;font-weight:500;">Le renforcement musculaire est le moyen de prévention des blessures le mieux documenté, devant les étirements et la proprioception seule.</p><p style="margin:0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.5);">Méta-analyses sur la prévention.</p></div>
    </div>
  </div>
</section>

<section id="urgence" style="max-width:1140px;margin:0 auto;padding:clamp(60px,8vw,100px) clamp(20px,5vw,40px);">
  <div style="background:rgba(238,128,108,.1);border-radius:24px;padding:clamp(26px,4vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;align-items:start;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:28px;height:28px;color:#EE806C;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <h2 style="margin:14px 0 12px;font-size:clamp(22px,3vw,30px);font-weight:700;letter-spacing:-.02em;color:#003850;">Bon à savoir</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Quelques points pratiques avant la première séance.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Une prescription médicale reste nécessaire au remboursement des séances de kinésithérapie.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Venez en tenue de sport : la première séance comporte des tests physiques.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Apportez vos comptes rendus d'imagerie et de chirurgie si vous en avez.</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.75);">Le nombre de séances n'est pas fixé à l'avance : il dépend des mesures d'étape.</p>
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
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Faut-il une ordonnance ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Elle reste nécessaire pour le remboursement. Vous pouvez consulter sans, dans un cadre non remboursé.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Combien de séances faut-il ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Cela dépend de la blessure et de vos objectifs. Nous fixons des points d'étape chiffrés plutôt qu'un nombre de séances décidé au départ.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Kiné ou ostéo, qui consulter ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">L'ostéopathie soulage et remet en mouvement, la kinésithérapie reconstruit la capacité dans la durée. Les deux se complètent, et nous travaillons ensemble au cabinet.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 10px;font-size:18px;font-weight:700;color:#003850;">Puis-je continuer mon sport pendant la rééducation ?</h3><p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Le plus souvent oui, sous une forme adaptée. L'arrêt complet est rarement la meilleure option.</p></div>
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
      <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);">Relu par le Dr Basile Carcassonne, médecin du sport, pour la coordination du parcours de soin.</p>
      <p style="margin:0 0 10px;font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour : 28 août 2026 · prochaine revue : février 2027.</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Cette page a une visée d'information. Elle ne remplace pas une consultation.</p>
    </div>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,40px) clamp(50px,7vw,80px);">
  <p style="margin:0 0 20px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">À lire ensuite</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
    <a href="/soins/bilan-retour-au-sport" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Bilan retour au sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Les critères avant de reprendre.</p></a>
    <a href="/methodes/testing-vald" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Testing de force</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Les mesures qui pilotent la progression.</p></a>
    <a href="/methodes/preparation-physique" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Préparation physique</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">La suite logique de la rééducation.</p></a>
    <a href="/soins/osteopathie" style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;display:block;transition:transform .2s;" class="mg-inline-hover"><h3 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#003850;">Ostéopathie du sport</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">L'approche complémentaire au cabinet.</p></a>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:24px;padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:clamp(24px,3.4vw,34px);font-weight:700;letter-spacing:-.025em;">Une rééducation à mener jusqu'au bout ?</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Bilan initial et plan de charge au cabinet Mugitu, 3 avenue Kléber à Biarritz.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:999px;background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
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
    bodyHtml: `<section style="max-width:820px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">La discipline</p>
  <h2 style="margin:0 0 18px;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Du diagnostic au retour au sport</h2>
  <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">La <strong style="color:#003850;">médecine du sport</strong> pose le diagnostic, traite les pathologies (traumatologie, tendinopathies, douleurs chroniques) et coordonne le parcours de soin. Les infiltrations, la mésothérapie et le PRP complètent l'arsenal thérapeutique.</p>
  <p style="margin:0 0 22px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">La <strong style="color:#003850;">rééducation</strong> prend le relais avec les kinésithérapeutes du sport : restaurer la mobilité, la force et la fonction, jusqu'au retour à la performance — le tout sur un dossier partagé.</p>
  <div style="display:flex;flex-wrap:wrap;gap:9px;">
    <span style="padding:8px 16px;border-radius:999px;background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Traumatologie</span>
    <span style="padding:8px 16px;border-radius:999px;background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Bilan clinique</span>
    <span style="padding:8px 16px;border-radius:999px;background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Rééducation fonctionnelle</span>
    <span style="padding:8px 16px;border-radius:999px;background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Retour au sport</span>
  </div>
</section>

<section style="background:#F5EDE4;padding:clamp(56px,8vw,100px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:32px;"><p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">L'équipe</p><h2 style="margin:0;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Praticiens concernés</h2></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
      <a href="/equipe/basile-carcassonne" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:16px;padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/basile-carcassonne.jpg" alt="Dr Basile Carcassonne" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Dr Basile Carcassonne</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Médecin du sport</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
      <a href="/equipe/julien-blamont" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:16px;padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/julien-blamont.jpg" alt="Julien Blamont" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 22%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Julien Blamont</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Kinésithérapeute du sport</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
      <a href="/equipe/jean-baptiste-colombie" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:16px;padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/jb-colombie.jpg" alt="Jean-Baptiste Colombié" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 25%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Jean-Baptiste Colombié</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Kinésithérapeute du sport</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
      <a href="/equipe/clement-cofourain" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:16px;padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/clement-cofourain.jpg" alt="Clément Cofourain" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Clément Cofourain</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Kinésithérapeute du sport</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
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
    bodyHtml: `<section style="max-width:820px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">La discipline</p>
  <h2 style="margin:0 0 18px;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Soigner le mouvement dans sa globalité</h2>
  <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">L'<strong style="color:#003850;">ostéopathie du sport</strong> traite les restrictions de mobilité et les déséquilibres qui limitent le geste sportif. Par des techniques manuelles douces, elle améliore l'amplitude articulaire, la récupération et le confort.</p>
  <p style="margin:0 0 22px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">Elle s'intègre naturellement au parcours Mugitu : en complément de la rééducation, de la préparation physique et des méthodes comme Allyane®.</p>
  <div style="display:flex;flex-wrap:wrap;gap:9px;">
    <span style="padding:8px 16px;border-radius:999px;background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Mobilité articulaire</span>
    <span style="padding:8px 16px;border-radius:999px;background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Récupération</span>
    <span style="padding:8px 16px;border-radius:999px;background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Prévention</span>
    <span style="padding:8px 16px;border-radius:999px;background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Douleurs chroniques</span>
  </div>
</section>

<section style="background:#F5EDE4;padding:clamp(56px,8vw,100px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:32px;"><p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">L'équipe</p><h2 style="margin:0;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Praticiens concernés</h2></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
      <a href="/equipe/lucas-bengoechea" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:16px;padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/lucas-bengoechea.jpg" alt="Lucas Bengoechea" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 22%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Lucas Bengoechea</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Ostéopathe du sport</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
      <a href="/equipe/marine-vignaud" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:16px;padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/marine-vignaud.png" alt="Marine Vignaud" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 20%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Marine Vignaud</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Ostéopathe &amp; prépa physique</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
    </div>
  </div>
</section>`,
  },
  {
    slug: "podologie",
    title: `Podologie`,
    eyebrow: `Discipline · atelier Ura`,
    lead: `Le pied, fondation du mouvement : analyse posturale, semelles sur mesure et suivi du coureur, à l'atelier Ura.`,
    crumb: `Podologie`,
    trail: [{ label: `Accueil`, href: "/" }],
    cta: "/equipe",
    bodyHtml: `<section style="max-width:820px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">La discipline</p>
  <h2 style="margin:0 0 18px;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Le pied, fondation du geste</h2>
  <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">La <strong style="color:#003850;">podologie du sport</strong> analyse la posture et l'appui pour corriger ce qui, plus haut dans la chaîne, génère douleurs et blessures. Elle conçoit des <strong style="color:#003850;">semelles orthopédiques sur mesure</strong> et accompagne le coureur — en lien étroit avec l'analyse de foulée.</p>
  <p style="margin:0 0 22px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">Les consultations se déroulent à l'atelier <strong style="color:#003850;">Ura</strong>, dédié à la podologie et au studio podcast.</p>
  <div style="display:flex;flex-wrap:wrap;gap:9px;">
    <span style="padding:8px 16px;border-radius:999px;background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Analyse posturale</span>
    <span style="padding:8px 16px;border-radius:999px;background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Semelles sur mesure</span>
    <span style="padding:8px 16px;border-radius:999px;background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Suivi du coureur</span>
  </div>
</section>

<section style="background:#F5EDE4;padding:clamp(56px,8vw,100px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:32px;"><p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">L'équipe</p><h2 style="margin:0;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Praticienne concernée</h2></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
      <a href="/equipe/ophelie-hubert" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:16px;padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/ophelie-hubert.webp" alt="Ophélie Hubert" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 25%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Ophélie Hubert</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Pédicure-podologue du sport</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
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
    bodyHtml: `<section style="max-width:820px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">La discipline</p>
  <h2 style="margin:0 0 18px;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Le mental, pièce maîtresse</h2>
  <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">La <strong style="color:#003850;">psychologie du sport</strong> accompagne la préparation mentale (stress, confiance, routines de performance) et le retour après blessure. En parallèle, un suivi de <strong style="color:#003850;">psychologie clinique</strong> et la <strong style="color:#003850;">thérapie EMDR</strong> aident à dépasser trauma et blocages.</p>
  <p style="margin:0 0 22px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">Un accompagnement humain, confidentiel, au cabinet ou en visioconférence.</p>
  <div style="display:flex;flex-wrap:wrap;gap:9px;">
    <span style="padding:8px 16px;border-radius:999px;background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Préparation mentale</span>
    <span style="padding:8px 16px;border-radius:999px;background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Gestion du stress</span>
    <span style="padding:8px 16px;border-radius:999px;background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">EMDR</span>
    <span style="padding:8px 16px;border-radius:999px;background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Psychologie clinique</span>
  </div>
</section>

<section style="background:#F5EDE4;padding:clamp(56px,8vw,100px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:32px;"><p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">L'équipe</p><h2 style="margin:0;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Praticiennes concernées</h2></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
      <a href="/equipe/marie-boura" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:16px;padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/marie-boura.jpg" alt="Marie Boura" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 20%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Marie Boura</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Psychologue du sport &amp; préparation mentale</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
      <a href="/equipe/mailys-bersier" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:16px;padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/mailys-bersier.jpg" alt="Maïlys Bersier" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 20%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Maïlys Bersier</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Psychologue clinicienne — EMDR</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
    </div>
  </div>
</section>`,
  },
  {
    slug: "nutrition-du-sport",
    title: `Nutrition du sport`,
    eyebrow: `Discipline`,
    lead: `L'alimentation est notre meilleur carburant : une approche personnalisée, sans restriction, au service de la santé et de la performance.`,
    crumb: `Nutrition du sport`,
    trail: [{ label: `Accueil`, href: "/" }],
    cta: "/equipe",
    bodyHtml: `<section style="max-width:820px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">La discipline</p>
  <h2 style="margin:0 0 18px;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Bien manger pour mieux bouger</h2>
  <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">La <strong style="color:#003850;">nutrition du sport</strong> optimise l'énergie, la récupération et la composition corporelle : que manger avant, pendant et après l'effort, comment s'hydrater, comment préparer une compétition d'endurance.</p>
  <p style="margin:0 0 22px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">Une approche fondée sur la preuve et le plaisir, sans restriction ni culpabilisation — au cabinet, en visioconférence ou à domicile.</p>
  <div style="display:flex;flex-wrap:wrap;gap:9px;">
    <span style="padding:8px 16px;border-radius:999px;background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Alimentation à l'effort</span>
    <span style="padding:8px 16px;border-radius:999px;background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Endurance &amp; marathon</span>
    <span style="padding:8px 16px;border-radius:999px;background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Composition corporelle</span>
    <span style="padding:8px 16px;border-radius:999px;background:#fff;box-shadow:0 2px 12px rgba(60,40,30,.06);color:#003850;font-size:13px;font-weight:600;">Visio &amp; domicile</span>
  </div>
</section>

<section style="background:#F5EDE4;padding:clamp(56px,8vw,100px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:32px;"><p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">L'équipe</p><h2 style="margin:0;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Praticiennes concernées</h2></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
      <a href="/equipe/ihintza-larralde" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:16px;padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/ihintza-larralde.webp" alt="Ihintza Larralde" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 30%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Ihintza Larralde</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Diététicienne du sport · FR/Euskara</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
      <a href="/equipe/johanna-marmiesse" style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:16px;padding:16px 18px;box-shadow:0 4px 20px rgba(60,40,30,.06);text-decoration:none;transition:transform .2s,box-shadow .2s;" class="mg-inline-hover"><img src="/johanna-marmiesse.webp" alt="Johanna Marmiesse" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 25%;flex:0 0 auto;" /><div style="flex:1;min-width:0;"><p style="margin:0;font-size:16px;font-weight:700;color:#003850;">Johanna Marmiesse</p><p style="margin:1px 0 0;font-size:13px;color:#04A49B;">Diététicienne du sport · à distance</p></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px;color:#04A49B;flex:0 0 auto;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
    </div>
  </div>
</section>`,
  },
];

export function getSoin(slug: string): SoinPage | undefined {
  return SOINS.find((s) => s.slug === slug);
}
