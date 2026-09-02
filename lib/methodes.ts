/**
 * Pages « Méthodes & technologies » — extraites des maquettes
 * « Methode *.dc.html » du projet Claude Design.
 *
 * Même parti que les fiches praticien (cf. lib/fiches.ts) : le hero est
 * structuré car identique d'une méthode à l'autre, le corps reste en HTML
 * statique versionné (chaque méthode a ses propres sections).
 *
 * ⚠️ HTML statique issu du bundle de design, jamais d'une saisie utilisateur
 * — c'est ce qui rend `dangerouslySetInnerHTML` acceptable ici.
 */

export type Methode = {
  /** Segment d'URL : /methodes/<slug>. */
  slug: string;
  /** Titre du hero — peut contenir un <br> de mise en forme. */
  title: string;
  /** Libellé court au-dessus du titre. */
  eyebrow: string;
  /** Chapô du hero (HTML : contient des <strong>). */
  lead: string;
  /** Dernier élément du fil d'Ariane. */
  crumb: string;
  /** Destination du bouton « Prendre rendez-vous ». */
  cta: string;
  bodyHtml: string;
};

export const METHODES: Methode[] = [
  {
    slug: "allyane",
    title: `Thérapie<br>Allyane®`,
    eyebrow: `Méthode certifiée · by Galmeon`,
    lead: `Retrouvez une motricité optimale grâce à une méthode de reprogrammation neuro-motrice validée scientifiquement, utilisée par plus de 500 praticiens certifiés en Europe.`,
    crumb: `Thérapie Allyane®`,
    cta: "/equipe",
    bodyHtml: `<!-- ░░ C'EST QUOI ░░ -->
<section style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,60px);align-items:center;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Qu'est-ce que la Thérapie Allyane ?</p>
      <h2 style="margin:0 0 18px;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Rééduquer le signal, pas seulement le muscle</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">La Thérapie Allyane est une technique de <strong style="color:#003850;">reprogrammation neuro-motrice</strong> développée en France. Elle utilise l'<strong style="color:#003850;">Alpha2move</strong>, un dispositif médical de classe I qui émet des sons de basse fréquence, combinés à un travail d'imagerie mentale guidé par le praticien.</p>
      <p style="margin:0;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">Après une blessure ou une chirurgie, le cerveau peut « verrouiller » certains muscles par réflexe de protection — c'est l'<strong style="color:#003850;">inhibition musculaire arthrogénique (AMI)</strong>. La rééducation classique travaille le muscle ; Allyane agit directement sur le signal nerveux pour restaurer un schéma moteur physiologique.</p>
    </div>
    <div style="border-radius:20px;overflow:hidden;aspect-ratio:4/3;box-shadow:0 14px 44px rgba(60,40,30,.14);"><img src="/allyane-session.png" alt="Séance de thérapie Allyane au cabinet Mugitu" style="width:100%;height:100%;object-fit:cover;" /></div>
  </div>
</section>

<!-- ░░ PROTOCOLE ░░ -->
<section style="background:#003850;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:46px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Protocole en 3 séances</p>
      <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#fff;">Un parcours structuré, des résultats durables</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;">
      <div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:28px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;"><span style="font-size:28px;font-weight:800;color:#04A49B;letter-spacing:-.02em;">01</span><span style="padding:5px 12px;border-radius:999px;background:rgba(4,164,155,.18);color:#04A49B;font-size:12px;font-weight:600;">1h</span></div>
        <h3 style="margin:0 0 12px;font-size:19px;font-weight:700;color:#fff;">Le Bilan</h3>
        <ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:8px;">
          <li style="font-size:14px;line-height:1.55;color:rgba(255,255,255,.7);">Anamnèse poussée et définition des objectifs</li>
          <li style="font-size:14px;line-height:1.55;color:rgba(255,255,255,.7);">Tests isométriques ciblés avec la technologie Vald®</li>
          <li style="font-size:14px;line-height:1.55;color:rgba(255,255,255,.7);">Vidéos « avant » du schéma moteur pathologique</li>
          <li style="font-size:14px;line-height:1.55;color:rgba(255,255,255,.7);">Compte rendu clair pour le patient et l'équipe médicale</li>
          <li style="font-size:14px;line-height:1.55;color:rgba(255,255,255,.7);">Exercices d'activation via l'application Andrew®</li>
        </ul>
      </div>
      <div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:28px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;"><span style="font-size:28px;font-weight:800;color:#04A49B;letter-spacing:-.02em;">02</span><span style="padding:5px 12px;border-radius:999px;background:rgba(4,164,155,.18);color:#04A49B;font-size:12px;font-weight:600;">1h – 1h30</span></div>
        <h3 style="margin:0 0 12px;font-size:19px;font-weight:700;color:#fff;">La Reprogrammation neuro-motrice</h3>
        <ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:8px;">
          <li style="font-size:14px;line-height:1.55;color:rgba(255,255,255,.7);">Relâchement général en pleine conscience</li>
          <li style="font-size:14px;line-height:1.55;color:rgba(255,255,255,.7);">Création et ancrage du schéma moteur corrigé (visualisation + sons basse fréquence)</li>
          <li style="font-size:14px;line-height:1.55;color:rgba(255,255,255,.7);">Re-testing avec vidéo « après » pour constater les changements immédiats</li>
          <li style="font-size:14px;line-height:1.55;color:rgba(255,255,255,.7);">Bilan de séance et compte rendu détaillé</li>
        </ul>
      </div>
      <div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:28px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;"><span style="font-size:28px;font-weight:800;color:#04A49B;letter-spacing:-.02em;">03</span><span style="padding:5px 12px;border-radius:999px;background:rgba(4,164,155,.18);color:#04A49B;font-size:12px;font-weight:600;">À 1 mois</span></div>
        <h3 style="margin:0 0 12px;font-size:19px;font-weight:700;color:#fff;">Le Bilan final</h3>
        <ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:8px;">
          <li style="font-size:14px;line-height:1.55;color:rgba(255,255,255,.7);">Re-testing de force isométrique (technologie Vald®)</li>
          <li style="font-size:14px;line-height:1.55;color:rgba(255,255,255,.7);">Validation des objectifs avec le patient</li>
          <li style="font-size:14px;line-height:1.55;color:rgba(255,255,255,.7);">Conseils de suivi de la prise en charge</li>
          <li style="font-size:14px;line-height:1.55;color:rgba(255,255,255,.7);">Compte rendu complété et transmis à l'équipe médicale</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- ░░ INDICATIONS ░░ -->
<section style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <div style="text-align:center;margin-bottom:40px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Pour qui ?</p>
    <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Indications thérapeutiques</h2>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;">
    <div style="background:#fff;border-radius:16px;padding:22px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 6px;font-size:16px;font-weight:700;color:#003850;">Genou</h3><p style="margin:0;font-size:13px;line-height:1.55;color:rgba(51,51,52,.62);">Post-LCA, prothèse, ménisque, levée des inhibitions du quadriceps.</p></div>
    <div style="background:#fff;border-radius:16px;padding:22px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 6px;font-size:16px;font-weight:700;color:#003850;">Épaule</h3><p style="margin:0;font-size:13px;line-height:1.55;color:rgba(51,51,52,.62);">Post-chirurgie, capsulite, déficits de mobilité active.</p></div>
    <div style="background:#fff;border-radius:16px;padding:22px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 6px;font-size:16px;font-weight:700;color:#003850;">Hanche</h3><p style="margin:0;font-size:13px;line-height:1.55;color:rgba(51,51,52,.62);">Post-prothèse, conflit fémoro-acétabulaire, boiterie persistante.</p></div>
    <div style="background:#fff;border-radius:16px;padding:22px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 6px;font-size:16px;font-weight:700;color:#003850;">Cheville</h3><p style="margin:0;font-size:13px;line-height:1.55;color:rgba(51,51,52,.62);">Instabilité chronique, entorses récidivantes, déficits proprioceptifs.</p></div>
    <div style="background:#fff;border-radius:16px;padding:22px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 6px;font-size:16px;font-weight:700;color:#003850;">Tronc</h3><p style="margin:0;font-size:13px;line-height:1.55;color:rgba(51,51,52,.62);">Lombalgies chroniques, raideurs post-opératoires.</p></div>
    <div style="background:#fff;border-radius:16px;padding:22px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 6px;font-size:16px;font-weight:700;color:#003850;">Coude</h3><p style="margin:0;font-size:13px;line-height:1.55;color:rgba(51,51,52,.62);">Épicondylite, raideurs post-traumatiques, instabilités.</p></div>
    <div style="background:#fff;border-radius:16px;padding:22px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 6px;font-size:16px;font-weight:700;color:#003850;">Main</h3><p style="margin:0;font-size:13px;line-height:1.55;color:rgba(51,51,52,.62);">Raideurs post-fracture, syndrome du canal carpien, dystonie.</p></div>
    <div style="background:#fff;border-radius:16px;padding:22px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><h3 style="margin:0 0 6px;font-size:16px;font-weight:700;color:#003850;">Atteintes neurologiques</h3><p style="margin:0;font-size:13px;line-height:1.55;color:rgba(51,51,52,.62);">AVC, sclérose en plaques, troubles moteurs centraux.</p></div>
  </div>
  <p style="margin:22px 0 0;font-size:12px;line-height:1.5;color:rgba(51,51,52,.4);">*Dos Anjos T, et al. <em>Neuromotor Treatment of Arthrogenic Muscle Inhibition After Knee Injury or Surgery.</em> Sports Health. 2023.</p>
</section>

<!-- ░░ CTA PRATICIEN ░░ -->
<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:24px;padding:clamp(28px,4vw,44px);color:#fff;">
    <div style="max-width:520px;margin-bottom:28px;">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#04A49B;font-weight:600;">Deux praticiens certifiés Allyane®</p>
      <h2 style="margin:0 0 12px;font-size:clamp(22px,3vw,30px);font-weight:700;letter-spacing:-.02em;">Prêt à retrouver votre mobilité ?</h2>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(255,255,255,.65);">Prenez rendez-vous au cabinet Mugitu (Biarritz) selon la zone concernée.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      <div style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:16px 18px;">
        <img src="/lucas-bengoechea.jpg" alt="Lucas Bengoechea" style="width:52px;height:52px;border-radius:50%;object-fit:cover;object-position:center 25%;flex:0 0 auto;" />
        <div style="flex:1;min-width:110px;line-height:1.3;"><p style="margin:0;font-size:15px;font-weight:700;">Lucas Bengoechea</p><p style="margin:0 0 2px;font-size:13px;color:rgba(255,255,255,.6);">Ostéopathe D.O.</p><p style="margin:0;font-size:12px;color:#04A49B;font-weight:600;">Spécialiste épaule</p></div>
        <a href="https://www.doctolib.fr/osteopathe/ahetze/lucas-bengoechea" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:11px 18px;border-radius:999px;background:#04A49B;color:#fff;font-size:13px;font-weight:600;text-decoration:none;flex:0 0 auto;">RDV <span>↗</span></a>
      </div>
      <div style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:16px 18px;">
        <img src="/jb-colombie.jpg" alt="Jean-Baptiste Colombié" style="width:52px;height:52px;border-radius:50%;object-fit:cover;object-position:center 25%;flex:0 0 auto;" />
        <div style="flex:1;min-width:110px;line-height:1.3;"><p style="margin:0;font-size:15px;font-weight:700;">Jean-Baptiste Colombié</p><p style="margin:0 0 2px;font-size:13px;color:rgba(255,255,255,.6);">Kinésithérapeute du sport</p><p style="margin:0;font-size:12px;color:#04A49B;font-weight:600;">Spécialiste cheville</p></div>
        <a href="https://www.doctolib.fr/masseur-kinesitherapeute/biarritz/jean-baptiste-colombie" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:11px 18px;border-radius:999px;background:#04A49B;color:#fff;font-size:13px;font-weight:600;text-decoration:none;flex:0 0 auto;">RDV <span>↗</span></a>
      </div>
    </div>
  </div>
</section>

<section style="background:#FDF8F4;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);"><div style="max-width:960px;margin:0 auto;"><div style="text-align:center;margin-bottom:40px;"><p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p><h2 style="font-family:'Bricolage Grotesque','Helvetica Neue',Helvetica,Arial,sans-serif;margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Études &amp; preuves</h2></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;"><div style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:11px;font-weight:700;margin-bottom:12px;">Sports Health · 2023</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">La reprogrammation neuro-motrice améliore l'activation et la fonction musculaire après lésion ou chirurgie du genou (inhibition arthrogénique).</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">Dos Anjos T, et al. — AMI du genou.</p></div><div style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(243,190,121,.2);color:#a16207;font-size:11px;font-weight:700;margin-bottom:12px;">Méthode récente</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">Approche récente : les données cliniques continuent de s'étoffer et sont recueillies au fil des prises en charge.</p><a href="https://www.galmeon.com/etudes-scientifiques/" target="_blank" rel="noopener noreferrer" style="margin:auto 0 0;font-size:12px;color:#04A49B;text-decoration:none;font-weight:600;">Études scientifiques — Galmeon ↗</a></div></div><p style="margin:26px auto 0;max-width:640px;text-align:center;font-size:12px;line-height:1.6;color:rgba(51,51,52,.45);">Références fournies à titre informatif. Les résultats varient selon les personnes et les indications ; un avis professionnel reste nécessaire.</p></div></section>`,
  },
  {
    slug: "bfr",
    title: `BFR`,
    eyebrow: `Blood Flow Restriction`,
    lead: `Gagner en force et en masse musculaire à <strong style="color:#fff;font-weight:600;">faible charge</strong>, en restreignant partiellement le flux sanguin. Un levier précieux quand le lourd est impossible.`,
    crumb: `BFR`,
    cta: "/equipe",
    bodyHtml: `<!-- ░░ C'EST QUOI ░░ -->
<section style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,60px);align-items:center;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">La méthode</p>
      <h2 style="margin:0 0 18px;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Progresser sans charge lourde</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">Le <strong style="color:#003850;">Blood Flow Restriction</strong> consiste à placer un brassard calibré à la racine du membre pour réduire partiellement le retour veineux pendant l'exercice. Le muscle travaille alors « comme sous charge lourde » avec des charges légères (20 à 30 % du maximum).</p>
      <p style="margin:0;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">Résultat : des gains de force et de volume comparables à un entraînement lourd, tout en <strong style="color:#003850;">épargnant les articulations et les tissus en cours de cicatrisation</strong>. C'est un outil de choix en début de rééducation.</p>
    </div>
    <div style="border-radius:20px;overflow:hidden;aspect-ratio:4/3;box-shadow:0 14px 44px rgba(60,40,30,.14);"><img src="/bfr.webp" alt="Entraînement BFR" style="width:100%;height:100%;object-fit:cover;" /></div>
  </div>
</section>

<!-- ░░ BÉNÉFICES ░░ -->
<section style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:46px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Pourquoi ça marche</p>
      <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Les bénéfices du BFR</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><div style="width:46px;height:46px;border-radius:12px;background:rgba(4,164,155,.1);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:23px;height:23px;color:#04A49B;"><path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"/><path d="M16 8 2 22"/><path d="M17.5 15H9"/></svg></div><h3 style="margin:0 0 7px;font-size:17px;font-weight:700;color:#003850;">Charges légères</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.65);">Des gains de force sans contraindre les articulations ni les greffes.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><div style="width:46px;height:46px;border-radius:12px;background:rgba(4,164,155,.1);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:23px;height:23px;color:#04A49B;"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg></div><h3 style="margin:0 0 7px;font-size:17px;font-weight:700;color:#003850;">Reprise précoce</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.65);">Lutter contre la fonte musculaire dès les premières semaines post-op.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><div style="width:46px;height:46px;border-radius:12px;background:rgba(4,164,155,.1);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:23px;height:23px;color:#04A49B;"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg></div><h3 style="margin:0 0 7px;font-size:17px;font-weight:700;color:#003850;">Pression calibrée</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.65);">Une occlusion mesurée et personnalisée, encadrée par le praticien.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><div style="width:46px;height:46px;border-radius:12px;background:rgba(4,164,155,.1);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:23px;height:23px;color:#04A49B;"><path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/></svg></div><h3 style="margin:0 0 7px;font-size:17px;font-weight:700;color:#003850;">Force &amp; volume</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.65);">Une hypertrophie et une force proches d'un travail à charge lourde.</p></div>
    </div>
  </div>
</section>

<!-- ░░ INDICATIONS ░░ -->
<section style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <div style="text-align:center;margin-bottom:40px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Pour qui ?</p>
    <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Indications principales</h2>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;max-width:760px;margin:0 auto;">
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Post-chirurgie (LCA, prothèse…)</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Reprise après blessure</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Lutte contre l'amyotrophie</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Tendinopathies</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Renforcement à faible impact</span>
  </div>
</section>

<!-- ░░ CTA PRATICIENS ░░ -->
<section style="max-width:1100px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:24px;padding:clamp(28px,4vw,44px);color:#fff;">
    <div style="max-width:560px;margin-bottom:28px;">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#04A49B;font-weight:600;">BFR au cabinet</p>
      <h2 style="margin:0 0 12px;font-size:clamp(22px,3vw,30px);font-weight:700;letter-spacing:-.02em;">Qui encadre le BFR ?</h2>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(255,255,255,.65);">Toujours sous supervision, intégré à votre programme de rééducation ou de préparation.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;">
      <a href="/equipe/jean-baptiste-colombie" style="display:flex;align-items:center;gap:13px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px 16px;text-decoration:none;transition:background .2s;" class="mg-inline-hover">
        <img src="/jb-colombie.jpg" alt="Jean-Baptiste Colombié" style="width:48px;height:48px;border-radius:50%;object-fit:cover;object-position:center 25%;flex:0 0 auto;" />
        <div style="min-width:0;"><p style="margin:0;font-size:14px;font-weight:700;color:#fff;">Jean-Baptiste Colombié</p><p style="margin:0;font-size:12px;color:#04A49B;">Kiné du sport</p></div>
      </a>
      <a href="/equipe/clement-cofourain" style="display:flex;align-items:center;gap:13px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px 16px;text-decoration:none;transition:background .2s;" class="mg-inline-hover">
        <img src="/clement-cofourain.jpg" alt="Clément Cofourain" style="width:48px;height:48px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
        <div style="min-width:0;"><p style="margin:0;font-size:14px;font-weight:700;color:#fff;">Clément Cofourain</p><p style="margin:0;font-size:12px;color:#04A49B;">Kiné du sport</p></div>
      </a>
      <a href="/equipe/hugo-daminato" style="display:flex;align-items:center;gap:13px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px 16px;text-decoration:none;transition:background .2s;" class="mg-inline-hover">
        <img src="/hugo-daminato.png" alt="Hugo Daminato" style="width:48px;height:48px;border-radius:50%;object-fit:cover;object-position:center 20%;flex:0 0 auto;" />
        <div style="min-width:0;"><p style="margin:0;font-size:14px;font-weight:700;color:#fff;">Hugo Daminato</p><p style="margin:0;font-size:12px;color:#04A49B;">Préparateur physique</p></div>
      </a>
    </div>
  </div>
</section>

<section style="background:#FDF8F4;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);"><div style="max-width:960px;margin:0 auto;"><div style="text-align:center;margin-bottom:40px;"><p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p><h2 style="font-family:'Bricolage Grotesque','Helvetica Neue',Helvetica,Arial,sans-serif;margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Études &amp; preuves</h2></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;"><div style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:11px;font-weight:700;margin-bottom:12px;">Br J Sports Med · 2017</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">L'entraînement à faible charge en restriction du flux sanguin produit des gains de force comparables au travail lourd.</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">Hughes et al. — méta-analyse.</p></div><div style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:11px;font-weight:700;margin-bottom:12px;">Rééducation</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">En rééducation, le BFR augmente force et masse musculaire avec des charges bien tolérées par les tissus en cicatrisation.</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">Revues sur le BFR en réathlétisation.</p></div></div><p style="margin:26px auto 0;max-width:640px;text-align:center;font-size:12px;line-height:1.6;color:rgba(51,51,52,.45);">Références fournies à titre informatif. Les résultats varient selon les personnes et les indications ; un avis professionnel reste nécessaire.</p></div></section>`,
  },
  {
    slug: "clinique-du-coureur",
    title: `La Clinique<br>du Coureur®`,
    eyebrow: `Méthode certifiée · Référence internationale`,
    lead: `L'approche fondée sur la preuve pour courir plus, mieux et sans se blesser.`,
    crumb: `La Clinique du Coureur®`,
    cta: "/equipe",
    bodyHtml: `<!-- ░░ C'EST QUOI ░░ -->
<section style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,60px);align-items:center;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">La méthode</p>
      <h2 style="margin:0 0 18px;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">La course, décryptée par la science</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">La Clinique du Coureur® est une référence internationale fondée par Blaise Dubois. Son approche repose sur la preuve scientifique plutôt que sur les idées reçues.</p>
      <p style="margin:0;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">On analyse votre <strong style="color:#003850;">foulée</strong>, votre <strong style="color:#003850;">charge d'entraînement</strong> et vos antécédents pour bâtir une progression qui protège autant qu'elle performe.</p>
    </div>
    <div style="border-radius:20px;overflow:hidden;aspect-ratio:4/3;box-shadow:0 14px 44px rgba(60,40,30,.14);background:#0b1c26;"><img src="/clinique-coureur-analyse.png" alt="La Clinique du Coureur®" style="width:100%;height:100%;object-fit:cover;" /></div>
  </div>
</section>

<!-- ░░ DÉROULÉ ░░ -->
<section style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:46px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Le déroulé</p>
      <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Du bilan au plan de course</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;">
      <div style="background:#fff;border-radius:18px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Bilan du coureur</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.65);">Historique, objectifs et analyse de la charge d'entraînement.</p></div>
      <div style="background:#fff;border-radius:18px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Analyse de foulée</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.65);">Captation vidéo et mesures : cadence, attaque, contact au sol.</p></div>
      <div style="background:#fff;border-radius:18px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Plan de progression</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.65);">Éducatifs, renforcement et programmation personnalisée.</p></div>
    </div>
  </div>
</section>

<!-- ░░ INDICATIONS ░░ -->
<section style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <div style="text-align:center;margin-bottom:40px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Pour qui ?</p>
    <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Indications principales</h2>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;max-width:760px;margin:0 auto;">
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Douleurs du coureur</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Retour à la course</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Optimisation de la foulée</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Prévention des blessures</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Choix de chaussures</span>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:24px;padding:clamp(28px,4vw,44px);color:#fff;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:28px;align-items:center;">
    <div>
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#04A49B;font-weight:600;">Praticien certifié La Clinique du Coureur®</p>
      <h2 style="margin:0 0 12px;font-size:clamp(22px,3vw,30px);font-weight:700;letter-spacing:-.02em;">Prenez rendez-vous</h2>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(255,255,255,.65);">Julien Blamont vous accompagne, du bilan du coureur au retour à la performance.</p>
    </div>
    <div style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:16px 18px;">
      <img src="/julien-blamont.jpg" alt="Julien Blamont" style="width:52px;height:52px;border-radius:50%;object-fit:cover;object-position:center 25%;flex:0 0 auto;" />
      <div style="flex:1;min-width:120px;line-height:1.3;"><p style="margin:0;font-size:15px;font-weight:700;">Julien Blamont</p><p style="margin:0;font-size:13px;color:rgba(255,255,255,.6);">Kinésithérapeute du sport</p></div>
      <a href="https://www.doctolib.fr/osteopathe/biarritz/julien-blamont" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:11px 18px;border-radius:999px;background:#04A49B;color:#fff;font-size:13px;font-weight:600;text-decoration:none;flex:0 0 auto;">RDV <span>↗</span></a>
    </div>
  </div>
</section>
<section style="background:#FDF8F4;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);"><div style="max-width:960px;margin:0 auto;"><div style="text-align:center;margin-bottom:40px;"><p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p><h2 style="font-family:'Bricolage Grotesque','Helvetica Neue',Helvetica,Arial,sans-serif;margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Études &amp; preuves</h2></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;"><div style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:11px;font-weight:700;margin-bottom:12px;">Med Sci Sports Exerc · 2011</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">Augmenter la cadence d'environ 10 % réduit nettement les charges au genou et à la hanche pendant la course.</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">Heiderscheit et al. — manipulation de la cadence.</p></div><div style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:11px;font-weight:700;margin-bottom:12px;">JOSPT · 2020</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">La rééducation de la course (gait retraining) diminue la douleur et améliore la biomécanique dans les blessures de surcharge.</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">Revues sur le running retraining.</p></div><div style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:11px;font-weight:700;margin-bottom:12px;">Br J Sports Med</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">La progressivité et la gestion de la charge d'entraînement sont parmi les leviers les plus efficaces de prévention des blessures du coureur.</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">Consensus sur la charge d'entraînement.</p></div></div><p style="margin:26px auto 0;max-width:640px;text-align:center;font-size:12px;line-height:1.6;color:rgba(51,51,52,.45);">Références fournies à titre informatif. Les résultats varient selon les personnes et les indications ; un avis professionnel reste nécessaire.</p></div></section>`,
  },
  {
    slug: "dry-needling",
    title: `Dry Needling<br>& Cupping`,
    eyebrow: `Techniques manuelles`,
    lead: `Des techniques manuelles ciblées pour relâcher les tensions musculaires profondes et accélérer la récupération.`,
    crumb: `Dry Needling & Cupping`,
    cta: "/equipe",
    bodyHtml: `<!-- ░░ C'EST QUOI ░░ -->
<section style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,60px);align-items:center;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">La méthode</p>
      <h2 style="margin:0 0 18px;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Cibler la tension à sa source</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">Le dry needling utilise de fines aiguilles de puncture sèche pour relâcher les points trigger — ces nœuds musculaires responsables de douleurs et de raideurs.</p>
      <p style="margin:0;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">Associé au <strong style="color:#003850;">cupping</strong> (ventouses), il améliore la circulation locale, la mobilité et accélère la récupération.</p>
    </div>
    <div style="border-radius:20px;overflow:hidden;aspect-ratio:4/3;box-shadow:0 14px 44px rgba(60,40,30,.14);"><img src="/dry-needling.jpg" alt="Dry Needling & Cupping" style="width:100%;height:100%;object-fit:cover;" /></div>
  </div>
</section>

<!-- ░░ LES DEUX TECHNIQUES ░░ -->
<section style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:46px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Deux approches complémentaires</p>
      <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Puncture sèche &amp; ventouses</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:22px;">
      <div style="background:#fff;border-radius:20px;padding:clamp(26px,3.5vw,38px);box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <div style="width:52px;height:52px;border-radius:14px;background:rgba(4,164,155,.12);display:flex;align-items:center;justify-content:center;margin-bottom:20px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:26px;height:26px;color:#04A49B;"><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/></svg></div>
        <h3 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#003850;letter-spacing:-.01em;">Dry Needling</h3>
        <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">De fines aiguilles de puncture sèche (sans produit) stimulent le point trigger au cœur du muscle. La secousse locale provoque un relâchement réflexe : la tension tombe, la douleur diminue et l'amplitude revient.</p>
        <ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px;">
          <li style="display:flex;gap:10px;font-size:14px;color:rgba(51,51,52,.72);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:#04A49B;width:18px;height:18px;flex:0 0 auto;margin-top:2px;"><path d="M20 6 9 17l-5-5"/></svg>Contractures et points trigger profonds</li>
          <li style="display:flex;gap:10px;font-size:14px;color:rgba(51,51,52,.72);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:#04A49B;width:18px;height:18px;flex:0 0 auto;margin-top:2px;"><path d="M20 6 9 17l-5-5"/></svg>Douleurs myofasciales persistantes</li>
          <li style="display:flex;gap:10px;font-size:14px;color:rgba(51,51,52,.72);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:#04A49B;width:18px;height:18px;flex:0 0 auto;margin-top:2px;"><path d="M20 6 9 17l-5-5"/></svg>Gain d'amplitude immédiat</li>
        </ul>
      </div>
      <div style="background:#fff;border-radius:20px;padding:clamp(26px,3.5vw,38px);box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <div style="width:52px;height:52px;border-radius:14px;background:rgba(238,128,108,.14);display:flex;align-items:center;justify-content:center;margin-bottom:20px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:26px;height:26px;color:#EE806C;"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></svg></div>
        <h3 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#003850;letter-spacing:-.01em;">Cupping — ventouses</h3>
        <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.7);">Les ventouses créent une aspiration qui décolle les tissus, stimule la circulation locale et draine. Idéal en récupération et sur les grandes zones musculaires sollicitées par l'effort.</p>
        <ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px;">
          <li style="display:flex;gap:10px;font-size:14px;color:rgba(51,51,52,.72);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:#04A49B;width:18px;height:18px;flex:0 0 auto;margin-top:2px;"><path d="M20 6 9 17l-5-5"/></svg>Récupération après l'effort</li>
          <li style="display:flex;gap:10px;font-size:14px;color:rgba(51,51,52,.72);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:#04A49B;width:18px;height:18px;flex:0 0 auto;margin-top:2px;"><path d="M20 6 9 17l-5-5"/></svg>Tensions diffuses (dos, mollets, cuisses)</li>
          <li style="display:flex;gap:10px;font-size:14px;color:rgba(51,51,52,.72);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:#04A49B;width:18px;height:18px;flex:0 0 auto;margin-top:2px;"><path d="M20 6 9 17l-5-5"/></svg>Circulation &amp; drainage</li>
        </ul>
      </div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;margin-top:32px;">
      <div style="display:flex;align-items:center;gap:10px;background:#fff;border-radius:14px;padding:14px 20px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:20px;height:20px;color:#04A49B;"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg><span style="font-size:14px;color:rgba(51,51,52,.75);">Aiguilles stériles à usage unique</span></div>
      <div style="display:flex;align-items:center;gap:10px;background:#fff;border-radius:14px;padding:14px 20px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:20px;height:20px;color:#04A49B;"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span style="font-size:14px;color:rgba(51,51,52,.75);">Intégré à une séance de kiné</span></div>
      <div style="display:flex;align-items:center;gap:10px;background:#fff;border-radius:14px;padding:14px 20px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:20px;height:20px;color:#04A49B;"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg><span style="font-size:14px;color:rgba(51,51,52,.75);">Praticiens formés &amp; diplômés</span></div>
    </div>
  </div>
</section>

<!-- ░░ INDICATIONS ░░ -->
<section style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <div style="text-align:center;margin-bottom:40px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Pour qui ?</p>
    <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Indications principales</h2>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;max-width:760px;margin:0 auto;">
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Points trigger / contractures</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Tensions musculaires</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Tendinopathies</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Récupération</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Mobilité limitée</span>
  </div>
</section>

<section style="max-width:1100px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:24px;padding:clamp(28px,4vw,44px);color:#fff;">
    <div style="max-width:560px;margin-bottom:28px;">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#04A49B;font-weight:600;">Techniques manuelles</p>
      <h2 style="margin:0 0 12px;font-size:clamp(22px,3vw,30px);font-weight:700;letter-spacing:-.02em;">Qui pratique au cabinet ?</h2>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(255,255,255,.65);"><strong style="color:#fff;">Dry needling</strong> : Jean-Baptiste. <strong style="color:#fff;">Cupping</strong> : Jean-Baptiste, Clément et Lucas. Prenez rendez-vous avec le praticien de votre choix.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;">
      <a href="/equipe/jean-baptiste-colombie" style="display:flex;align-items:center;gap:13px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px 16px;text-decoration:none;transition:background .2s;" class="mg-inline-hover">
        <img src="/jb-colombie.jpg" alt="Jean-Baptiste Colombié" style="width:48px;height:48px;border-radius:50%;object-fit:cover;object-position:center 25%;flex:0 0 auto;" />
        <div style="min-width:0;"><p style="margin:0;font-size:14px;font-weight:700;color:#fff;">Jean-Baptiste Colombié</p><p style="margin:0;font-size:12px;color:#04A49B;">Dry needling &amp; cupping</p></div>
      </a>
      <a href="/equipe/clement-cofourain" style="display:flex;align-items:center;gap:13px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px 16px;text-decoration:none;transition:background .2s;" class="mg-inline-hover">
        <img src="/clement-cofourain.jpg" alt="Clément Cofourain" style="width:48px;height:48px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
        <div style="min-width:0;"><p style="margin:0;font-size:14px;font-weight:700;color:#fff;">Clément Cofourain</p><p style="margin:0;font-size:12px;color:#04A49B;">Cupping</p></div>
      </a>
      <a href="/equipe/lucas-bengoechea" style="display:flex;align-items:center;gap:13px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px 16px;text-decoration:none;transition:background .2s;" class="mg-inline-hover">
        <img src="/lucas-bengoechea.jpg" alt="Lucas Bengoechea" style="width:48px;height:48px;border-radius:50%;object-fit:cover;object-position:center 25%;flex:0 0 auto;" />
        <div style="min-width:0;"><p style="margin:0;font-size:14px;font-weight:700;color:#fff;">Lucas Bengoechea</p><p style="margin:0;font-size:12px;color:#04A49B;">Cupping</p></div>
      </a>
    </div>
  </div>
</section>
<section style="background:#FDF8F4;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);"><div style="max-width:960px;margin:0 auto;"><div style="text-align:center;margin-bottom:40px;"><p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p><h2 style="font-family:'Bricolage Grotesque','Helvetica Neue',Helvetica,Arial,sans-serif;margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Études &amp; preuves</h2></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;"><div style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:11px;font-weight:700;margin-bottom:12px;">JOSPT · 2013</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">Le dry needling réduit la douleur des points trigger myofasciaux à court terme.</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">Kietrys et al. — méta-analyse.</p></div><div style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:11px;font-weight:700;margin-bottom:12px;">Revues systématiques</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">Associé à la rééducation, il améliore douleur et amplitude sur les douleurs musculo-squelettiques.</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">Revues sur le dry needling.</p></div></div><p style="margin:26px auto 0;max-width:640px;text-align:center;font-size:12px;line-height:1.6;color:rgba(51,51,52,.45);">Références fournies à titre informatif. Les résultats varient selon les personnes et les indications ; un avis professionnel reste nécessaire.</p></div></section>`,
  },
  {
    slug: "emdr",
    title: `Thérapie<br>EMDR`,
    eyebrow: `Approche psychologique`,
    lead: `Une approche psychologique pour dépasser le traumatisme, l'appréhension et le stress liés à la blessure.`,
    crumb: `Thérapie EMDR`,
    cta: "/equipe",
    bodyHtml: `<!-- ░░ C'EST QUOI ░░ -->
<section style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,60px);align-items:center;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">La méthode</p>
      <h2 style="margin:0 0 18px;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Dénouer ce que le corps garde en mémoire</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">L'EMDR (désensibilisation et retraitement par les mouvements oculaires) aide à traiter les chocs psychologiques : blessure traumatisante, chute, appréhension de la reprise.</p>
      <p style="margin:0;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">Par des <strong style="color:#003850;">stimulations bilatérales</strong>, le cerveau retraite le souvenir douloureux et en réduit la charge émotionnelle.</p>
    </div>
    <div style="border-radius:20px;overflow:hidden;aspect-ratio:4/3;box-shadow:0 14px 44px rgba(60,40,30,.14);"><img src="/emdr.webp" alt="Thérapie EMDR" style="width:100%;height:100%;object-fit:cover;" /></div>
  </div>
</section>

<!-- ░░ DÉROULÉ ░░ -->
<section style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:46px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Le déroulé</p>
      <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Un protocole en trois phases</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;">
      <div style="background:#fff;border-radius:18px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">1</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Anamnèse</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.65);">Identification des événements et des objectifs thérapeutiques.</p></div>
      <div style="background:#fff;border-radius:18px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">2</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Désensibilisation</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.65);">Stimulations bilatérales (mouvements oculaires) guidées.</p></div>
      <div style="background:#fff;border-radius:18px;padding:28px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#04A49B;color:#fff;font-size:16px;font-weight:800;margin-bottom:16px;">3</span><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#003850;">Ancrage</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.65);">Installation de ressources positives et consolidation.</p></div>
    </div>
  </div>
</section>

<!-- ░░ INDICATIONS ░░ -->
<section style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <div style="text-align:center;margin-bottom:40px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Pour qui ?</p>
    <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Indications principales</h2>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;max-width:760px;margin:0 auto;">
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Traumatisme sportif</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Blocage post-blessure</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Gestion du stress & de l'anxiété</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Appréhension de la reprise</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Troubles du sommeil</span>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:24px;padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <p style="margin:0 0 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#04A49B;font-weight:600;">Sur rendez-vous</p>
    <h2 style="margin:0 0 12px;font-size:clamp(22px,3vw,30px);font-weight:700;letter-spacing:-.02em;">Prenez rendez-vous</h2>
    <p style="margin:0 auto 24px;max-width:460px;font-size:15px;line-height:1.6;color:rgba(255,255,255,.65);">L'EMDR est pratiquée sur rendez-vous au cabinet. Contactez-nous pour être orienté vers le bon praticien.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:14px 30px;border-radius:999px;background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Contacter le cabinet <span>↗</span></a>
  </div>
</section>
<section style="background:#FDF8F4;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);"><div style="max-width:960px;margin:0 auto;"><div style="text-align:center;margin-bottom:40px;"><p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p><h2 style="font-family:'Bricolage Grotesque','Helvetica Neue',Helvetica,Arial,sans-serif;margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Études &amp; preuves</h2></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;"><div style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:11px;font-weight:700;margin-bottom:12px;">OMS · 2013</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">L'EMDR est recommandée par l'Organisation mondiale de la santé pour le traitement de l'état de stress post-traumatique.</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">Recommandations OMS sur le TSPT.</p></div><div style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:11px;font-weight:700;margin-bottom:12px;">NICE · 2018</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">Les recommandations britanniques (NICE) placent l'EMDR parmi les thérapies de première intention du trauma.</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">NICE Guidelines — PTSD.</p></div><div style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:11px;font-weight:700;margin-bottom:12px;">Méta-analyses</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">Les méta-analyses rapportent une réduction significative des symptômes de trauma après thérapie EMDR.</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">Revues systématiques sur l'EMDR.</p></div></div><p style="margin:26px auto 0;max-width:640px;text-align:center;font-size:12px;line-height:1.6;color:rgba(51,51,52,.45);">Références fournies à titre informatif. Les résultats varient selon les personnes et les indications ; un avis professionnel reste nécessaire.</p></div></section>`,
  },
  {
    slug: "electrostimulation",
    title: `Électro-<br>stimulation`,
    eyebrow: `Technologie · Compex®`,
    lead: `Stimuler le muscle par impulsions électriques pour renforcer, récupérer et prévenir — un complément précis de la rééducation et de la préparation.`,
    crumb: `Électrostimulation`,
    cta: "/equipe",
    bodyHtml: `<!-- ░░ C'EST QUOI ░░ -->
<section style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,60px);align-items:center;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">La méthode</p>
      <h2 style="margin:0 0 18px;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Faire travailler le muscle, autrement</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">L'électrostimulation <strong style="color:#003850;">Compex®</strong> envoie de fines impulsions électriques qui provoquent une contraction musculaire, sans commande volontaire. On cible précisément un muscle affaibli ou inhibé, même quand le mouvement actif reste limité.</p>
      <p style="margin:0;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">Selon le programme choisi — renforcement, endurance, récupération ou antidouleur (TENS) — la fréquence et l'intensité s'adaptent à l'objectif. C'est un outil de plus au service de la rééducation et de la performance.</p>
      <p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:rgba(51,51,52,.5);">Compex® est un pionnier suisse de l'électrostimulation depuis 1986, reconnu pour la précision de ses programmes.</p>
    </div>
    <div style="border-radius:20px;overflow:hidden;aspect-ratio:4/3;box-shadow:0 14px 44px rgba(60,40,30,.14);"><img src="/electrostimulation.png" alt="Électrostimulation Compex" style="width:100%;height:100%;object-fit:cover;" /></div>
  </div>
</section>

<!-- ░░ PROGRAMMES ░░ -->
<section style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:46px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ses usages</p>
      <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Quatre familles de programmes</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><div style="width:46px;height:46px;border-radius:12px;background:rgba(4,164,155,.1);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:23px;height:23px;color:#04A49B;"><path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"/><path d="m2.5 21.5 1.4-1.4"/><path d="m20.1 3.9 1.4-1.4"/><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"/><path d="m9.6 14.4 4.8-4.8"/></svg></div><h3 style="margin:0 0 7px;font-size:17px;font-weight:700;color:#003850;">Renforcement</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.65);">Réveiller et renforcer un muscle affaibli après blessure ou chirurgie.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><div style="width:46px;height:46px;border-radius:12px;background:rgba(4,164,155,.1);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:23px;height:23px;color:#04A49B;"><path d="m11 7-3 5h4l-3 5"/><path d="M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935"/><path d="M22 14v-4"/><path d="M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936"/></svg></div><h3 style="margin:0 0 7px;font-size:17px;font-weight:700;color:#003850;">Récupération</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.65);">Favoriser le drainage et réduire les courbatures après l'effort.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><div style="width:46px;height:46px;border-radius:12px;background:rgba(4,164,155,.1);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:23px;height:23px;color:#04A49B;"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg></div><h3 style="margin:0 0 7px;font-size:17px;font-weight:700;color:#003850;">Endurance &amp; prépa</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.65);">Compléter la préparation physique et le travail de fond.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><div style="width:46px;height:46px;border-radius:12px;background:rgba(4,164,155,.1);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:23px;height:23px;color:#04A49B;"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/><path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg></div><h3 style="margin:0 0 7px;font-size:17px;font-weight:700;color:#003850;">Antidouleur (TENS)</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.65);">Soulager les douleurs par stimulation nerveuse transcutanée.</p></div>
    </div>
  </div>
</section>

<!-- ░░ INDICATIONS ░░ -->
<section style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <div style="text-align:center;margin-bottom:40px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Pour qui ?</p>
    <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Indications principales</h2>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;max-width:760px;margin:0 auto;">
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Amyotrophie post-blessure</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Récupération musculaire</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Renforcement ciblé</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Préparation physique</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Gestion de la douleur</span>
  </div>
</section>

<!-- ░░ CTA PRATICIENS ░░ -->
<section style="max-width:1100px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:24px;padding:clamp(28px,4vw,44px);color:#fff;">
    <div style="max-width:560px;margin-bottom:28px;">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#04A49B;font-weight:600;">Compex® au cabinet</p>
      <h2 style="margin:0 0 12px;font-size:clamp(22px,3vw,30px);font-weight:700;letter-spacing:-.02em;">Qui pratique l'électrostimulation ?</h2>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(255,255,255,.65);">Intégrée à vos séances de kinésithérapie et de préparation physique.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;">
      <a href="/equipe/jean-baptiste-colombie" style="display:flex;align-items:center;gap:13px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px 16px;text-decoration:none;transition:background .2s;" class="mg-inline-hover">
        <img src="/jb-colombie.jpg" alt="Jean-Baptiste Colombié" style="width:48px;height:48px;border-radius:50%;object-fit:cover;object-position:center 25%;flex:0 0 auto;" />
        <div style="min-width:0;"><p style="margin:0;font-size:14px;font-weight:700;color:#fff;">Jean-Baptiste Colombié</p><p style="margin:0;font-size:12px;color:#04A49B;">Kiné du sport</p></div>
      </a>
      <a href="/equipe/clement-cofourain" style="display:flex;align-items:center;gap:13px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px 16px;text-decoration:none;transition:background .2s;" class="mg-inline-hover">
        <img src="/clement-cofourain.jpg" alt="Clément Cofourain" style="width:48px;height:48px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
        <div style="min-width:0;"><p style="margin:0;font-size:14px;font-weight:700;color:#fff;">Clément Cofourain</p><p style="margin:0;font-size:12px;color:#04A49B;">Kiné du sport</p></div>
      </a>
      <a href="/equipe/hugo-daminato" style="display:flex;align-items:center;gap:13px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px 16px;text-decoration:none;transition:background .2s;" class="mg-inline-hover">
        <img src="/hugo-daminato.png" alt="Hugo Daminato" style="width:48px;height:48px;border-radius:50%;object-fit:cover;object-position:center 20%;flex:0 0 auto;" />
        <div style="min-width:0;"><p style="margin:0;font-size:14px;font-weight:700;color:#fff;">Hugo Daminato</p><p style="margin:0;font-size:12px;color:#04A49B;">Préparateur physique</p></div>
      </a>
    </div>
  </div>
</section>

<section style="background:#FDF8F4;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);"><div style="max-width:960px;margin:0 auto;"><div style="text-align:center;margin-bottom:40px;"><p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p><h2 style="font-family:'Bricolage Grotesque','Helvetica Neue',Helvetica,Arial,sans-serif;margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Études &amp; preuves</h2></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;"><div style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:11px;font-weight:700;margin-bottom:12px;">Rééducation du genou</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">L'électrostimulation neuromusculaire aide à renforcer le quadriceps et à limiter la fonte musculaire après chirurgie du genou.</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">Revues sur la NMES post-opératoire.</p></div><div style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:11px;font-weight:700;margin-bottom:12px;">Performance</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">En complément de l'entraînement volontaire, l'EMS peut améliorer la force chez le sportif.</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">Revues sur l'EMS et la force musculaire.</p></div></div><p style="margin:26px auto 0;max-width:640px;text-align:center;font-size:12px;line-height:1.6;color:rgba(51,51,52,.45);">Références fournies à titre informatif. Les résultats varient selon les personnes et les indications ; un avis professionnel reste nécessaire.</p></div></section>`,
  },
  {
    slug: "infiltrations",
    title: `Infiltrations`,
    eyebrow: `Médecine du sport · geste médical`,
    lead: `PRP, viscosupplémentation et corticoïdes, réalisés au cabinet par le médecin du sport, après un <strong style="color:#fff;font-weight:600;">examen clinique précis</strong>.`,
    crumb: `Infiltrations`,
    cta: "/equipe",
    bodyHtml: `<!-- ░░ C'EST QUOI ░░ -->
<section style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <div style="max-width:760px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Le principe</p>
    <h2 style="margin:0 0 18px;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Le bon produit, au bon endroit</h2>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">Une infiltration consiste à injecter un produit directement dans l'articulation, le tendon ou la zone à traiter. Au cabinet, elles sont réalisées par le médecin du sport après un <strong style="color:#003850;">examen clinique précis</strong>, qui détermine la structure à cibler et le produit adapté.</p>
    <p style="margin:0;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">Selon la pathologie, plusieurs produits sont possibles — chacun avec une indication propre.</p>
  </div>
</section>

<!-- ░░ LES 3 TYPES ░░ -->
<section style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:46px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Trois approches</p>
      <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Quel produit, pour quoi ?</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:22px;">
      <div style="background:#fff;border-radius:20px;padding:clamp(26px,3.5vw,36px);box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <div style="width:52px;height:52px;border-radius:14px;background:rgba(238,128,108,.14);display:flex;align-items:center;justify-content:center;margin-bottom:18px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:26px;height:26px;color:#EE806C;"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg></div>
        <h3 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#003850;letter-spacing:-.01em;">PRP</h3>
        <p style="margin:0 0 14px;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:rgba(51,51,52,.45);">Plasma riche en plaquettes</p>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.7);">On prélève votre sang, on le centrifuge pour concentrer les plaquettes et leurs facteurs de croissance, puis on réinjecte ce concentré. Objectif : <strong style="color:#003850;">stimuler la cicatrisation naturelle</strong> des tendons et cartilages.</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Tendinopathies</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Arthrose débutante</span></div>
      </div>
      <div style="background:#fff;border-radius:20px;padding:clamp(26px,3.5vw,36px);box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <div style="width:52px;height:52px;border-radius:14px;background:rgba(4,164,155,.12);display:flex;align-items:center;justify-content:center;margin-bottom:18px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:26px;height:26px;color:#04A49B;"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg></div>
        <h3 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#003850;letter-spacing:-.01em;">Viscosupplémentation</h3>
        <p style="margin:0 0 14px;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:rgba(51,51,52,.45);">Acide hyaluronique</p>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.7);">Injection d'acide hyaluronique qui agit comme un <strong style="color:#003850;">lubrifiant et amortisseur</strong> de l'articulation. Améliore le confort et la mobilité dans l'arthrose.</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Arthrose</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Genou, hanche…</span></div>
      </div>
      <div style="background:#fff;border-radius:20px;padding:clamp(26px,3.5vw,36px);box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <div style="width:52px;height:52px;border-radius:14px;background:rgba(243,190,121,.18);display:flex;align-items:center;justify-content:center;margin-bottom:18px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:26px;height:26px;color:#d49a40;"><path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/></svg></div>
        <h3 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#003850;letter-spacing:-.01em;">Corticoïdes</h3>
        <p style="margin:0 0 14px;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:rgba(51,51,52,.45);">Anti-inflammatoire</p>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.7);">Puissant anti-inflammatoire local qui <strong style="color:#003850;">calme rapidement la douleur</strong> et l'inflammation, pour débloquer une situation aiguë et permettre la rééducation.</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px;"><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Douleur aiguë</span><span style="padding:5px 11px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:12px;font-weight:600;">Inflammation</span></div>
      </div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;margin-top:32px;">
      <div style="display:flex;align-items:center;gap:10px;background:#fff;border-radius:14px;padding:14px 20px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:20px;height:20px;color:#04A49B;"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></svg><span style="font-size:14px;color:rgba(51,51,52,.75);">Geste réalisé par le médecin du sport</span></div>
      <div style="display:flex;align-items:center;gap:10px;background:#fff;border-radius:14px;padding:14px 20px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:20px;height:20px;color:#04A49B;"><path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/></svg><span style="font-size:14px;color:rgba(51,51,52,.75);">Réalisé par un médecin du sport</span></div>
      <div style="display:flex;align-items:center;gap:10px;background:#fff;border-radius:14px;padding:14px 20px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:20px;height:20px;color:#04A49B;"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg><span style="font-size:14px;color:rgba(51,51,52,.75);">Coordonné avec la rééducation</span></div>
    </div>
  </div>
</section>

<!-- ░░ CTA PRATICIEN ░░ -->
<section style="max-width:900px;margin:0 auto;padding:clamp(56px,8vw,90px) clamp(20px,5vw,24px);">
  <div style="background:#003850;border-radius:24px;padding:clamp(28px,4vw,44px);color:#fff;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:28px;align-items:center;">
    <div>
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#04A49B;font-weight:600;">Sur rendez-vous</p>
      <h2 style="margin:0 0 12px;font-size:clamp(22px,3vw,30px);font-weight:700;letter-spacing:-.02em;">Un avis médical d'abord</h2>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(255,255,255,.65);">Le choix du produit se décide en consultation, après examen et, si besoin, imagerie. Prenez rendez-vous avec le médecin du sport.</p>
    </div>
    <div style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:16px 18px;">
      <img src="/basile-carcassonne.jpg" alt="Dr Basile Carcassonne" style="width:52px;height:52px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
      <div style="flex:1;min-width:120px;line-height:1.3;"><p style="margin:0;font-size:15px;font-weight:700;">Dr Basile Carcassonne</p><p style="margin:0;font-size:13px;color:rgba(255,255,255,.6);">Médecin du sport</p></div>
      <a href="https://www.doctolib.fr/medecin-du-sport/cambo-les-bains/basile-carcassonne?pid=practice-746000" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:11px 18px;border-radius:999px;background:#04A49B;color:#fff;font-size:13px;font-weight:600;text-decoration:none;flex:0 0 auto;">RDV <span>↗</span></a>
    </div>
  </div>
  <p style="margin:22px auto 0;max-width:640px;text-align:center;font-size:12px;line-height:1.6;color:rgba(51,51,52,.45);">Information générale ne se substituant pas à une consultation médicale. Les indications, bénéfices et risques sont évalués individuellement par le médecin.</p>
</section>

<section style="background:#fff;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);"><div style="max-width:960px;margin:0 auto;"><div style="text-align:center;margin-bottom:40px;"><p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p><h2 style="font-family:'Bricolage Grotesque','Helvetica Neue',Helvetica,Arial,sans-serif;margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Études &amp; preuves</h2></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;"><div style="background:#FDF8F4;border-radius:18px;padding:24px;display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(238,128,108,.15);color:#c2410c;font-size:11px;font-weight:700;margin-bottom:12px;">PRP</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">Le PRP améliore douleur et fonction dans la gonarthrose légère à modérée, avec un effet souvent durable à moyen terme.</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">Méta-analyses sur le PRP intra-articulaire.</p></div><div style="background:#FDF8F4;border-radius:18px;padding:24px;display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.12);color:#04A49B;font-size:11px;font-weight:700;margin-bottom:12px;">Viscosupplémentation</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">L'acide hyaluronique intra-articulaire apporte un soulagement dans l'arthrose du genou.</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">Revues Cochrane sur la viscosupplémentation.</p></div><div style="background:#FDF8F4;border-radius:18px;padding:24px;display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(243,190,121,.2);color:#a16207;font-size:11px;font-weight:700;margin-bottom:12px;">Corticoïdes</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">Les corticoïdes procurent un soulagement rapide, à court terme, des douleurs inflammatoires.</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">Revues sur l'infiltration de corticoïdes.</p></div></div><p style="margin:26px auto 0;max-width:640px;text-align:center;font-size:12px;line-height:1.6;color:rgba(51,51,52,.45);">Références fournies à titre informatif. Le choix du produit et l'évaluation bénéfice/risque relèvent d'une consultation médicale.</p></div></section>`,
  },
  {
    slug: "mesotherapie",
    title: `Mésothérapie`,
    eyebrow: `Médecine du sport`,
    lead: `De <strong style="color:#fff;font-weight:600;">micro-injections superficielles</strong>, au plus près de la douleur. Peu de produit, ciblé localement, pour un effet là où il faut.`,
    crumb: `Mésothérapie`,
    cta: "/equipe",
    bodyHtml: `<!-- ░░ C'EST QUOI ░░ -->
<section style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <div style="max-width:760px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Le principe</p>
    <h2 style="margin:0 0 18px;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">« Peu, rarement, au bon endroit »</h2>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">La mésothérapie consiste à injecter de <strong style="color:#003850;">très petites quantités de produit</strong> juste sous la peau, au plus près de la zone douloureuse. Les médicaments diffusent localement et progressivement, ce qui permet d'agir efficacement avec des doses réduites et peu d'effets généraux.</p>
    <p style="margin:0;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">C'est une technique douce, particulièrement utile sur les <strong style="color:#003850;">douleurs musculo-tendineuses du sportif</strong>, souvent en complément de la rééducation.</p>
  </div>
</section>

<!-- ░░ BÉNÉFICES ░░ -->
<section style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:46px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Pourquoi ça marche</p>
      <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Les atouts de la mésothérapie</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><div style="width:46px;height:46px;border-radius:12px;background:rgba(4,164,155,.1);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:23px;height:23px;color:#04A49B;"><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></svg></div><h3 style="margin:0 0 7px;font-size:17px;font-weight:700;color:#003850;">Action locale</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.65);">Le produit reste concentré sur la zone traitée, au plus près de la douleur.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><div style="width:46px;height:46px;border-radius:12px;background:rgba(4,164,155,.1);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:23px;height:23px;color:#04A49B;"><path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"/><path d="M16 8 2 22"/><path d="M17.5 15H9"/></svg></div><h3 style="margin:0 0 7px;font-size:17px;font-weight:700;color:#003850;">Faibles doses</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.65);">Peu de produit, donc moins d'effets généraux qu'une prise classique.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><div style="width:46px;height:46px;border-radius:12px;background:rgba(4,164,155,.1);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:23px;height:23px;color:#04A49B;"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg></div><h3 style="margin:0 0 7px;font-size:17px;font-weight:700;color:#003850;">Séance rapide</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.65);">Quelques minutes en consultation, reprise d'activité quasi immédiate.</p></div>
      <div style="background:#fff;border-radius:18px;padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);"><div style="width:46px;height:46px;border-radius:12px;background:rgba(4,164,155,.1);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:23px;height:23px;color:#04A49B;"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></div><h3 style="margin:0 0 7px;font-size:17px;font-weight:700;color:#003850;">Complémentaire</h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.65);">S'intègre au parcours de soin, en appui de la kinésithérapie.</p></div>
    </div>
  </div>
</section>

<!-- ░░ INDICATIONS ░░ -->
<section style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <div style="text-align:center;margin-bottom:40px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Pour qui ?</p>
    <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Indications principales</h2>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;max-width:760px;margin:0 auto;">
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Tendinopathies</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Douleurs musculaires</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Entorses &amp; contractures</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Douleurs cervicales &amp; lombaires</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Récupération sportive</span>
  </div>
</section>

<!-- ░░ CTA PRATICIEN ░░ -->
<section style="max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:24px;padding:clamp(28px,4vw,44px);color:#fff;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:28px;align-items:center;">
    <div>
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#04A49B;font-weight:600;">Sur rendez-vous</p>
      <h2 style="margin:0 0 12px;font-size:clamp(22px,3vw,30px);font-weight:700;letter-spacing:-.02em;">Prenez rendez-vous</h2>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(255,255,255,.65);">La mésothérapie est réalisée par le médecin du sport, après évaluation de votre douleur.</p>
    </div>
    <div style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:16px 18px;">
      <img src="/basile-carcassonne.jpg" alt="Dr Basile Carcassonne" style="width:52px;height:52px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
      <div style="flex:1;min-width:120px;line-height:1.3;"><p style="margin:0;font-size:15px;font-weight:700;">Dr Basile Carcassonne</p><p style="margin:0;font-size:13px;color:rgba(255,255,255,.6);">Médecin du sport</p></div>
      <a href="https://www.doctolib.fr/medecin-du-sport/cambo-les-bains/basile-carcassonne?pid=practice-746000" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:11px 18px;border-radius:999px;background:#04A49B;color:#fff;font-size:13px;font-weight:600;text-decoration:none;flex:0 0 auto;">RDV <span>↗</span></a>
    </div>
  </div>
  <p style="margin:22px auto 0;max-width:640px;text-align:center;font-size:12px;line-height:1.6;color:rgba(51,51,52,.45);">Information générale ne se substituant pas à une consultation médicale. Les indications et contre-indications sont évaluées individuellement par le médecin.</p>
</section>

<section style="background:#fff;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);"><div style="max-width:960px;margin:0 auto;"><div style="text-align:center;margin-bottom:40px;"><p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p><h2 style="font-family:'Bricolage Grotesque','Helvetica Neue',Helvetica,Arial,sans-serif;margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Études &amp; preuves</h2></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;"><div style="background:#FDF8F4;border-radius:18px;padding:24px;display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:11px;font-weight:700;margin-bottom:12px;">Douleurs musculo-squelettiques</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">Plusieurs études suggèrent un bénéfice de la mésothérapie sur les douleurs musculo-squelettiques, avec des doses de médicament réduites.</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">Revues sur la mésothérapie antalgique.</p></div><div style="background:#FDF8F4;border-radius:18px;padding:24px;display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(243,190,121,.2);color:#a16207;font-size:11px;font-weight:700;margin-bottom:12px;">Niveau de preuve</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">Le niveau de preuve reste limité : la mésothérapie s'utilise en complément d'une prise en charge globale, jamais isolément.</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">Position prudente, fondée sur les données actuelles.</p></div></div><p style="margin:26px auto 0;max-width:640px;text-align:center;font-size:12px;line-height:1.6;color:rgba(51,51,52,.45);">Références fournies à titre informatif. Les indications sont évaluées individuellement par le médecin.</p></div></section>`,
  },
  {
    slug: "preparation-physique",
    title: `Préparation physique<br>&amp; coaching sportif`,
    eyebrow: `Performance &amp; coaching`,
    lead: `Développer sa force, sa résistance et sa technique — <strong style="color:#fff;font-weight:600;">selon sa discipline et ses objectifs</strong>. En individuel, en petit groupe ou à distance.`,
    crumb: `Préparation physique`,
    cta: "/equipe",
    bodyHtml: `<!-- ░░ LES FORMULES ░░ -->
<section style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <div style="text-align:center;margin-bottom:46px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Nos approches</p>
    <h2 style="font-family:'Bricolage Grotesque','Helvetica Neue',Helvetica,Arial,sans-serif;margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Une prépa pour chaque sportif</h2>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;">
    <article style="background:#fff;border-radius:20px;padding:clamp(26px,3.4vw,34px);box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;">
      <div style="width:52px;height:52px;border-radius:14px;background:rgba(4,164,155,.1);display:flex;align-items:center;justify-content:center;margin-bottom:18px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:26px;height:26px;color:#04A49B;"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div>
      <h3 style="margin:0 0 8px;font-size:19px;font-weight:700;color:#003850;letter-spacing:-.01em;">Préparation physique du danseur</h3>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);flex:1;">Renforcement, mobilité et prévention adaptés aux exigences de la danse : sauts, en-dehors, gainage et contrôle.</p>
      <a href="/equipe/jean-baptiste-colombie" style="display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:#04A49B;text-decoration:none;">Avec Jean-Baptiste <span>→</span></a>
    </article>
    <article style="background:#fff;border-radius:20px;padding:clamp(26px,3.4vw,34px);box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;">
      <div style="width:52px;height:52px;border-radius:14px;background:rgba(4,164,155,.1);display:flex;align-items:center;justify-content:center;margin-bottom:18px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:26px;height:26px;color:#04A49B;"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg></div>
      <h3 style="margin:0 0 8px;font-size:19px;font-weight:700;color:#003850;letter-spacing:-.01em;">Préparation physique du coureur</h3>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);flex:1;">Renforcement spécifique, économie de course et prévention des blessures pour progresser sur route et trail.</p>
      <a href="/equipe/marine-vignaud" style="display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:#04A49B;text-decoration:none;">Avec Marine <span>→</span></a>
    </article>
    <article style="background:#fff;border-radius:20px;padding:clamp(26px,3.4vw,34px);box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;">
      <div style="width:52px;height:52px;border-radius:14px;background:rgba(4,164,155,.1);display:flex;align-items:center;justify-content:center;margin-bottom:18px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:26px;height:26px;color:#04A49B;"><path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"/><path d="m2.5 21.5 1.4-1.4"/><path d="m20.1 3.9 1.4-1.4"/><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"/><path d="m9.6 14.4 4.8-4.8"/></svg></div>
      <h3 style="margin:0 0 8px;font-size:19px;font-weight:700;color:#003850;letter-spacing:-.01em;">Préparation physique générale</h3>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.65;color:rgba(51,51,52,.65);flex:1;">Remise en forme, force et condition physique pour tous — du retour à l'activité à la performance.</p>
      <a href="/equipe/hugo-daminato" style="display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:#04A49B;text-decoration:none;">Avec Marine &amp; Hugo <span>→</span></a>
    </article>
    <article style="background:linear-gradient(150deg,#013242,#0A556B);border-radius:20px;padding:clamp(26px,3.4vw,34px);box-shadow:0 4px 20px rgba(0,40,56,.18);display:flex;flex-direction:column;color:#fff;">
      <div style="width:52px;height:52px;border-radius:14px;background:rgba(4,164,155,.22);display:flex;align-items:center;justify-content:center;margin-bottom:18px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:26px;height:26px;color:#04A49B;"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg></div>
      <h3 style="margin:0 0 8px;font-size:19px;font-weight:700;letter-spacing:-.01em;">Coaching sportif / santé à distance</h3>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.65;color:rgba(255,255,255,.72);flex:1;">Programmes personnalisés suivis à distance via l'application <strong style="color:#fff;">Andrew coach</strong> : exercices en vidéo, suivi et adaptation continue.</p>
      <a href="https://andrew.care" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:#fff;text-decoration:none;">Découvrir Andrew coach <span>↗</span></a>
    </article>
  </div>
</section>

<!-- ░░ TARIFS ░░ -->
<section style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,48px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:46px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Tarifs</p>
      <h2 style="font-family:'Bricolage Grotesque','Helvetica Neue',Helvetica,Arial,sans-serif;margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Nos formules de prépa physique</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
      <a class="pp-form" href="/equipe">
        <img class="pp-bg" src="/hugo-daminato.png" alt="Coaching personnalisé" />
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(1,30,42,.95) 0%,rgba(1,30,42,.5) 46%,rgba(1,30,42,.05) 100%);"></div>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:22px;">
          <div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px;"><h3 style="margin:0;font-size:18px;font-weight:700;color:#fff;letter-spacing:-.01em;">Coaching personnalisé</h3><span style="font-size:22px;font-weight:800;color:#fff;">40 €/h</span></div>
          <p class="pp-desc" style="font-size:13px;line-height:1.6;color:rgba(255,255,255,.85);">En solo 40 €/h · en duo 60 €/h. 1 h de séance + 30 min de préparation, avec votre coach.</p>
          <span style="margin-top:14px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:11px 16px;border-radius:999px;background:#04A49B;color:#fff;font-size:13px;font-weight:600;">Réserver ma séance <span>↗</span></span>
        </div>
      </a>
      <a class="pp-form" href="/mugi-klub#planning">
        <img class="pp-bg" src="/mugi-klub.jpg" alt="Small group" />
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(1,30,42,.95) 0%,rgba(1,30,42,.5) 46%,rgba(1,30,42,.05) 100%);"></div>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:22px;">
          <div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px;"><h3 style="margin:0;font-size:18px;font-weight:700;color:#fff;letter-spacing:-.01em;">Small group</h3><span style="font-size:22px;font-weight:800;color:#fff;">15 €</span></div>
          <p class="pp-desc" style="font-size:13px;line-height:1.6;color:rgba(255,255,255,.85);">15 €/séance · séance d'essai 10 € · essai en duo 15 €. Petit groupe (4-5), au Mugi Klub.</p>
          <span style="margin-top:14px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:11px 16px;border-radius:999px;background:#04A49B;color:#fff;font-size:13px;font-weight:600;">Voir le planning <span>↗</span></span>
        </div>
      </a>
      <a class="pp-form" href="mailto:contact@mugitu-biarritz.fr?subject=Devis%20coaching%20%C3%A0%20domicile">
        <img class="pp-bg" src="/prepa-domicile.jpg" alt="Séance à domicile" />
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(1,30,42,.95) 0%,rgba(1,30,42,.5) 46%,rgba(1,30,42,.05) 100%);"></div>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:22px;">
          <div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px;"><h3 style="margin:0;font-size:18px;font-weight:700;color:#fff;letter-spacing:-.01em;">Séance à domicile</h3><span style="font-size:20px;font-weight:800;color:#fff;">Sur devis</span></div>
          <p class="pp-desc" style="font-size:13px;line-height:1.6;color:rgba(255,255,255,.85);">Coaching à votre domicile, selon vos disponibilités et vos objectifs. Devis personnalisé.</p>
          <span style="margin-top:14px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:11px 16px;border-radius:999px;background:#04A49B;color:#fff;font-size:13px;font-weight:600;">Demander un devis <span>↗</span></span>
        </div>
      </a>
      <a class="pp-form" href="https://andrew.care" target="_blank" rel="noopener noreferrer">
        <img class="pp-bg" src="/coaching-distance.jpg" alt="Coaching santé à distance" />
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(1,30,42,.96) 0%,rgba(1,30,42,.6) 46%,rgba(1,30,42,.15) 100%);"></div>
        <span style="position:absolute;top:16px;right:16px;z-index:2;padding:5px 12px;border-radius:999px;background:#F3BE79;color:#3a2a10;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">À distance</span>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:22px;">
          <div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px;"><h3 style="margin:0;font-size:18px;font-weight:700;color:#fff;letter-spacing:-.01em;">Coaching santé à distance</h3><span style="font-size:20px;font-weight:800;color:#fff;">Dès 20 €/mois</span></div>
          <p class="pp-desc" style="font-size:13px;line-height:1.6;color:rgba(255,255,255,.85);">Avec nos ostéopathes via Andrew Coach, sur devis. Formules : mobilité générale · renforcement du dos · retour au sport.</p>
          <span style="margin-top:14px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:11px 16px;border-radius:999px;background:#04A49B;color:#fff;font-size:13px;font-weight:600;">Découvrir Andrew Coach <span>↗</span></span>
        </div>
      </a>
    </div>
    <p style="margin:26px 0 0;text-align:center;font-size:13px;color:rgba(51,51,52,.55);">Survolez une formule pour le détail. Séances individuelles avec un coach · small groups via le planning du Mugi Klub · domicile et coaching à distance sur devis.</p>
  </div>
</section>

<!-- ░░ SMALL GROUPS / KLUB ░░ -->
<section style="max-width:1000px;margin:0 auto;padding:clamp(56px,8vw,100px) clamp(20px,5vw,40px);">
  <div style="background:linear-gradient(150deg,#04A49B,#0A556B);border-radius:24px;padding:clamp(30px,5vw,52px);color:#fff;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:28px;align-items:center;">
    <div>
      <div style="width:52px;height:52px;border-radius:14px;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;margin-bottom:18px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:26px;height:26px;color:#fff;"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg></div>
      <h2 style="font-family:'Bricolage Grotesque','Helvetica Neue',Helvetica,Arial,sans-serif;margin:0 0 12px;font-size:clamp(24px,3.4vw,34px);font-weight:800;letter-spacing:-.02em;">Les small groups du Mugi Klub</h2>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(255,255,255,.8);">Retrouvez tous les créneaux de préparation physique collective — Run Club, renfo, mobilité — dans le planning du Mugi Klub.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <a href="/mugi-klub#planning" style="display:inline-flex;align-items:center;gap:8px;padding:15px 28px;border-radius:999px;background:#fff;color:#003850;font-size:15px;font-weight:600;text-decoration:none;">Voir le planning <span>↗</span></a>
      <a href="/mugi-klub#tarifs" style="display:inline-flex;align-items:center;gap:8px;padding:15px 28px;border-radius:999px;border:1px solid rgba(255,255,255,.4);color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Tarifs du Klub <span>↗</span></a>
    </div>
  </div>
</section>

<!-- ░░ CTA PRATICIENS ░░ -->
<section style="max-width:1100px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:24px;padding:clamp(28px,4vw,44px);color:#fff;">
    <div style="max-width:560px;margin-bottom:28px;">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#04A49B;font-weight:600;">L'équipe prépa physique</p>
      <h2 style="font-family:'Bricolage Grotesque','Helvetica Neue',Helvetica,Arial,sans-serif;margin:0 0 12px;font-size:clamp(22px,3vw,30px);font-weight:700;letter-spacing:-.02em;">Qui vous accompagne ?</h2>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(255,255,255,.65);">Choisissez votre coach selon votre discipline et vos objectifs.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;">
      <a href="/equipe/jean-baptiste-colombie" style="display:flex;align-items:center;gap:13px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px 16px;text-decoration:none;transition:background .2s;" class="mg-inline-hover"><img src="/jb-colombie.jpg" alt="Jean-Baptiste Colombié" style="width:48px;height:48px;border-radius:50%;object-fit:cover;object-position:center 25%;flex:0 0 auto;" /><div style="min-width:0;"><p style="margin:0;font-size:14px;font-weight:700;color:#fff;">Jean-Baptiste Colombié</p><p style="margin:0;font-size:12px;color:#04A49B;">Danseur</p></div></a>
      <a href="/equipe/marine-vignaud" style="display:flex;align-items:center;gap:13px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px 16px;text-decoration:none;transition:background .2s;" class="mg-inline-hover"><img src="/marine-vignaud.png" alt="Marine Vignaud" style="width:48px;height:48px;border-radius:50%;object-fit:cover;object-position:center 20%;flex:0 0 auto;" /><div style="min-width:0;"><p style="margin:0;font-size:14px;font-weight:700;color:#fff;">Marine Vignaud</p><p style="margin:0;font-size:12px;color:#04A49B;">Coureur · général</p></div></a>
      <a href="/equipe/hugo-daminato" style="display:flex;align-items:center;gap:13px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px 16px;text-decoration:none;transition:background .2s;" class="mg-inline-hover"><img src="/hugo-daminato.png" alt="Hugo Daminato" style="width:48px;height:48px;border-radius:50%;object-fit:cover;object-position:center 20%;flex:0 0 auto;" /><div style="min-width:0;"><p style="margin:0;font-size:14px;font-weight:700;color:#fff;">Hugo Daminato</p><p style="margin:0;font-size:12px;color:#04A49B;">Général</p></div></a>
    </div>
  </div>
</section>`,
  },
  {
    slug: "testing-vald",
    title: `Testing<br>du sportif`,
    eyebrow: `Technologie · by Vald®`,
    lead: `La mesure objective de la force et des asymétries, pour un retour au sport décidé sur des données — pas au ressenti.`,
    crumb: `Testing du sportif`,
    cta: "/equipe",
    bodyHtml: `<!-- ░░ C'EST QUOI ░░ -->
<section style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,60px);align-items:center;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">La méthode</p>
      <h2 style="margin:0 0 18px;font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-.025em;color:#003850;">Objectiver la performance et le risque</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">Le testing Vald® mesure précisément la force et les asymétries musculaires à l'aide de capteurs de référence utilisés dans le sport professionnel.</p>
      <p style="margin:0;font-size:16px;line-height:1.7;color:rgba(51,51,52,.7);">Fini l'à-peu-près : on obtient des <strong style="color:#003850;">données chiffrées</strong> pour décider du retour au sport et suivre la progression séance après séance.</p>
    </div>
    <div style="border-radius:20px;overflow:hidden;aspect-ratio:4/3;box-shadow:0 14px 44px rgba(60,40,30,.14);background:#f2f0ee;"><img src="/vald-forcedecks.webp" alt="Plateformes de force VALD ForceDecks" style="width:100%;height:100%;object-fit:contain;" /></div>
  </div>
</section>

<!-- ░░ TESTS POSSIBLES ░░ -->
<section style="background:#F5EDE4;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:46px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Les tests disponibles</p>
      <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce que l'on peut mesurer</h2>
    </div>
    <div class="vt-scroll">
      <div class="vt-card"><img src="/vald-forcedecks.webp" alt="Saut &amp; puissance" style="background:#0b1c26;object-fit:contain;" /><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(1,30,42,.96) 0%,rgba(1,30,42,.5) 42%,rgba(1,30,42,.1) 100%);"></div><div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:24px;"><span style="font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#04A49B;margin-bottom:8px;">ForceDecks</span><h3 style="margin:0;font-size:20px;font-weight:700;color:#fff;letter-spacing:-.01em;">Saut &amp; puissance</h3><p class="vt-desc" style="margin:10px 0 0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.85);">Countermovement jump, squat jump, drop jump : hauteur, puissance et asymétries gauche/droite.</p></div></div>

      <div class="vt-card"><img src="/vald-forceframe-1.webp" alt="Force isométrique" /><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(1,30,42,.96) 0%,rgba(1,30,42,.5) 42%,rgba(1,30,42,.1) 100%);"></div><div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:24px;"><span style="font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#04A49B;margin-bottom:8px;">ForceFrame</span><h3 style="margin:0;font-size:20px;font-weight:700;color:#fff;letter-spacing:-.01em;">Force isométrique max</h3><p class="vt-desc" style="margin:10px 0 0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.85);">Hanche, genou, épaule, tronc : force maximale et déficits par groupe musculaire.</p></div></div>

      <div class="vt-card"><img src="/vald-forceframe-2.webp" alt="Ratios &amp; asymétries" /><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(1,30,42,.96) 0%,rgba(1,30,42,.5) 42%,rgba(1,30,42,.1) 100%);"></div><div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:24px;"><span style="font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#04A49B;margin-bottom:8px;">ForceFrame</span><h3 style="margin:0;font-size:20px;font-weight:700;color:#fff;letter-spacing:-.01em;">Ratios &amp; asymétries</h3><p class="vt-desc" style="margin:10px 0 0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.85);">Ratios ischios/quadriceps et comparaison membre sain / membre lésé — clés du retour au sport.</p></div></div>

      <div class="vt-card"><img src="/vald-equilibre.jpg" alt="Équilibre &amp; stabilité" style="background:#0b1c26;object-position:center;" /><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(1,30,42,.96) 0%,rgba(1,30,42,.5) 42%,rgba(1,30,42,.1) 100%);"></div><div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:24px;"><span style="font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#04A49B;margin-bottom:8px;">ForceDecks</span><h3 style="margin:0;font-size:20px;font-weight:700;color:#fff;letter-spacing:-.01em;">Équilibre &amp; stabilité</h3><p class="vt-desc" style="margin:10px 0 0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.85);">Contrôle postural et appui unipodal pour évaluer la stabilité et le risque de blessure.</p></div></div>

      <div class="vt-card"><img src="/vald-dynamo.webp" alt="Amplitude articulaire" style="background:#f2f0ee;object-fit:contain;" /><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(1,30,42,.96) 0%,rgba(1,30,42,.5) 42%,rgba(1,30,42,.1) 100%);"></div><div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:24px;"><span style="font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#04A49B;margin-bottom:8px;">DynaMo</span><h3 style="margin:0;font-size:20px;font-weight:700;color:#fff;letter-spacing:-.01em;">Amplitude articulaire</h3><p class="vt-desc" style="margin:10px 0 0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.85);">Mobilité et force en tout point de l'amplitude, au cabinet comme au bord du terrain.</p></div></div>

      <div class="vt-card"><img src="/vald-valdhub.webp" alt="Suivi dans le temps ValdHub" style="background:#f2f0ee;object-fit:cover;object-position:top center;" /><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(1,30,42,.96) 0%,rgba(1,30,42,.5) 42%,rgba(1,30,42,.05) 100%);"></div><div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:24px;"><span style="font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#04A49B;margin-bottom:8px;">ValdHub</span><h3 style="margin:0;font-size:20px;font-weight:700;color:#fff;letter-spacing:-.01em;">Suivi dans le temps</h3><p class="vt-desc" style="margin:10px 0 0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.85);">Comparaison aux normes et évolution séance après séance, centralisées sur ValdHub.</p></div></div>
    </div>
  </div>
</section>

<!-- ░░ TECHNOLOGIES VALD ░░ -->
<section style="background:#003850;padding:clamp(60px,9vw,110px) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:14px;">
      <img src="/vald-logo.webp" alt="VALD" style="height:46px;width:auto;margin-bottom:20px;" />
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Les appareils VALD®</p>
      <h2 style="margin:0 auto;max-width:640px;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#fff;">Les technologies de référence du sport professionnel</h2>
    </div>
    <p style="margin:0 auto 44px;max-width:600px;text-align:center;font-size:15px;line-height:1.65;color:rgba(255,255,255,.65);">Utilisées par les meilleures équipes et cliniques du monde, les solutions VALD objectivent la force, la puissance et le mouvement — et centralisent vos données pour un suivi fiable dans le temps.</p>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;">
      <a href="https://valdhealth.com/fr/products/forcedecks" target="_blank" rel="noopener noreferrer" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;text-decoration:none;transition:transform .2s,background .2s;" class="mg-inline-hover">
        <div style="aspect-ratio:16/10;background:#0b1c26;overflow:hidden;"><img src="/vald-forcedecks.webp" alt="VALD ForceDecks" style="width:100%;height:100%;object-fit:contain;" /></div>
        <div style="padding:24px;"><h3 style="margin:0 0 8px;font-size:19px;font-weight:700;color:#fff;">ForceDecks <span style="font-size:13px;color:#04A49B;">↗</span></h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.65);">Plateformes de force jumelées : sauts, équilibre, puissance et asymétries gauche/droite mesurés au millimètre — le test de référence du retour au sport.</p></div>
      </a>

      <a href="https://valdhealth.com/fr/products/forceframe" target="_blank" rel="noopener noreferrer" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;text-decoration:none;transition:transform .2s,background .2s;" class="mg-inline-hover">
        <div style="aspect-ratio:16/10;background:#0b1c26;overflow:hidden;"><img src="/vald-forceframe-1.webp" alt="VALD ForceFrame" style="width:100%;height:100%;object-fit:cover;" /></div>
        <div style="padding:24px;"><h3 style="margin:0 0 8px;font-size:19px;font-weight:700;color:#fff;">ForceFrame <span style="font-size:13px;color:#04A49B;">↗</span></h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.65);">Cadre de testing isométrique : force maximale, ratios musculaires et asymétries sur une large batterie de tests (hanche, genou, épaule…).</p></div>
      </a>

      <a href="https://valdhealth.com/fr/products/dynamo" target="_blank" rel="noopener noreferrer" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;text-decoration:none;transition:transform .2s,background .2s;" class="mg-inline-hover">
        <div style="aspect-ratio:16/10;background:#0b1c26;overflow:hidden;"><img src="/vald-forceframe-2.webp" alt="VALD DynaMo" style="width:100%;height:100%;object-fit:cover;" /></div>
        <div style="padding:24px;"><h3 style="margin:0 0 8px;font-size:19px;font-weight:700;color:#fff;">DynaMo <span style="font-size:13px;color:#04A49B;">↗</span></h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.65);">Dynamomètre portable et polyvalent : force et amplitude articulaire mesurées partout, du cabinet au bord du terrain.</p></div>
      </a>

      <a href="https://valdhealth.com/fr/products/valdhub" target="_blank" rel="noopener noreferrer" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;text-decoration:none;transition:transform .2s,background .2s;" class="mg-inline-hover">
        <div style="aspect-ratio:16/10;background:linear-gradient(150deg,#0A556B,#04A49B);display:flex;align-items:center;justify-content:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:52px;height:52px;color:rgba(255,255,255,.9);"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/></svg></div>
        <div style="padding:24px;"><h3 style="margin:0 0 8px;font-size:19px;font-weight:700;color:#fff;">ValdHub <span style="font-size:13px;color:#04A49B;">↗</span></h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.65);">La plateforme cloud qui centralise toutes vos données : comparaison aux normes, suivi longitudinal et partage avec l'équipe médicale.</p></div>
      </a>

      <a href="https://valdhealth.com/fr/products/movehealth" target="_blank" rel="noopener noreferrer" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;text-decoration:none;transition:transform .2s,background .2s;" class="mg-inline-hover">
        <div style="aspect-ratio:16/10;background:linear-gradient(150deg,#0A556B,#04A49B);display:flex;align-items:center;justify-content:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:52px;height:52px;color:rgba(255,255,255,.9);"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/></svg></div>
        <div style="padding:24px;"><h3 style="margin:0 0 8px;font-size:19px;font-weight:700;color:#fff;">MoveHealth <span style="font-size:13px;color:#04A49B;">↗</span></h3><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.65);">Évaluation de la mobilité et de l'amplitude par capture vidéo : une analyse objective du mouvement, sans capteur.</p></div>
      </a>

      <article style="background:linear-gradient(150deg,#04A49B,#0A556B);border-radius:20px;padding:28px;display:flex;flex-direction:column;justify-content:center;">
        <div style="width:48px;height:48px;border-radius:13px;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:24px;height:24px;color:#fff;"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg></div>
        <h3 style="margin:0 0 8px;font-size:19px;font-weight:700;color:#fff;">Un plateau technique complet</h3>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:rgba(255,255,255,.8);">Mugitu met la technologie VALD au service de votre bilan et de votre retour au sport.</p>
        <a href="/equipe" style="display:inline-flex;align-self:flex-start;align-items:center;gap:8px;padding:12px 22px;border-radius:999px;background:#fff;color:#003850;font-size:14px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
      </article>
    </div>
  </div>
</section>

<!-- ░░ INDICATIONS ░░ -->
<section style="max-width:1140px;margin:0 auto;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);">
  <div style="text-align:center;margin-bottom:40px;">
    <p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Pour qui ?</p>
    <h2 style="margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Indications principales</h2>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;max-width:760px;margin:0 auto;">
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Retour au sport post-blessure</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Détection d'asymétries</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Suivi de force</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Prévention</span>
    <span style="padding:10px 20px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:15px;font-weight:600;">Bilan de performance</span>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,24px) clamp(56px,8vw,90px);">
  <div style="background:#003850;border-radius:24px;padding:clamp(28px,4vw,44px);color:#fff;">
    <div style="max-width:560px;margin-bottom:28px;">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#04A49B;font-weight:600;">Testing du sportif · Vald®</p>
      <h2 style="margin:0 0 12px;font-size:clamp(22px,3vw,30px);font-weight:700;letter-spacing:-.02em;">Qui réalise votre bilan ?</h2>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(255,255,255,.65);">Cinq praticiens de la Mugi Team réalisent les bilans Vald® au cabinet. Prenez rendez-vous avec celui de votre choix.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;">
      <a href="/equipe/jean-baptiste-colombie" style="display:flex;align-items:center;gap:13px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px 16px;text-decoration:none;transition:background .2s;" class="mg-inline-hover">
        <img src="/jb-colombie.jpg" alt="Jean-Baptiste Colombié" style="width:48px;height:48px;border-radius:50%;object-fit:cover;object-position:center 25%;flex:0 0 auto;" />
        <div style="min-width:0;"><p style="margin:0;font-size:14px;font-weight:700;color:#fff;">Jean-Baptiste Colombié</p><p style="margin:0;font-size:12px;color:rgba(255,255,255,.6);">Kiné du sport</p></div>
      </a>
      <a href="/equipe/lucas-bengoechea" style="display:flex;align-items:center;gap:13px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px 16px;text-decoration:none;transition:background .2s;" class="mg-inline-hover">
        <img src="/lucas-bengoechea.jpg" alt="Lucas Bengoechea" style="width:48px;height:48px;border-radius:50%;object-fit:cover;object-position:center 25%;flex:0 0 auto;" />
        <div style="min-width:0;"><p style="margin:0;font-size:14px;font-weight:700;color:#fff;">Lucas Bengoechea</p><p style="margin:0;font-size:12px;color:rgba(255,255,255,.6);">Ostéopathe du sport</p></div>
      </a>
      <a href="/equipe/clement-cofourain" style="display:flex;align-items:center;gap:13px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px 16px;text-decoration:none;transition:background .2s;" class="mg-inline-hover">
        <img src="/clement-cofourain.jpg" alt="Clément Cofourain" style="width:48px;height:48px;border-radius:50%;object-fit:cover;object-position:center 18%;flex:0 0 auto;" />
        <div style="min-width:0;"><p style="margin:0;font-size:14px;font-weight:700;color:#fff;">Clément Cofourain</p><p style="margin:0;font-size:12px;color:rgba(255,255,255,.6);">Kiné du sport</p></div>
      </a>
      <a href="/equipe/marine-vignaud" style="display:flex;align-items:center;gap:13px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px 16px;text-decoration:none;transition:background .2s;" class="mg-inline-hover">
        <img src="/marine-vignaud.png" alt="Marine Vignaud" style="width:48px;height:48px;border-radius:50%;object-fit:cover;object-position:center 20%;flex:0 0 auto;" />
        <div style="min-width:0;"><p style="margin:0;font-size:14px;font-weight:700;color:#fff;">Marine Vignaud</p><p style="margin:0;font-size:12px;color:rgba(255,255,255,.6);">Ostéo &amp; prépa physique</p></div>
      </a>
      <a href="/equipe/hugo-daminato" style="display:flex;align-items:center;gap:13px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px 16px;text-decoration:none;transition:background .2s;" class="mg-inline-hover">
        <img src="/hugo-daminato.png" alt="Hugo Daminato" style="width:48px;height:48px;border-radius:50%;object-fit:cover;object-position:center 20%;flex:0 0 auto;" />
        <div style="min-width:0;"><p style="margin:0;font-size:14px;font-weight:700;color:#fff;">Hugo Daminato</p><p style="margin:0;font-size:12px;color:rgba(255,255,255,.6);">Préparateur physique</p></div>
      </a>
      <a href="/equipe" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#04A49B;border-radius:16px;padding:14px 16px;text-decoration:none;font-size:14px;font-weight:600;color:#fff;transition:background .2s;" class="mg-inline-hover">Voir tous les créneaux <span>↗</span></a>
    </div>
  </div>
</section>
<section style="background:#FDF8F4;padding:clamp(50px,7vw,90px) clamp(20px,5vw,40px);"><div style="max-width:960px;margin:0 auto;"><div style="text-align:center;margin-bottom:40px;"><p style="margin:0 0 12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#04A49B;">Ce que dit la science</p><h2 style="font-family:'Bricolage Grotesque','Helvetica Neue',Helvetica,Arial,sans-serif;margin:0;font-size:clamp(26px,4.2vw,40px);font-weight:700;letter-spacing:-.025em;color:#003850;">Études &amp; preuves</h2></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;"><div style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:11px;font-weight:700;margin-bottom:12px;">Br J Sports Med · 2016</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">Respecter des critères de force et de symétrie avant le retour au sport réduit fortement le risque de re-rupture du LCA.</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">Grindem et al. — critères de retour au sport.</p></div><div style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:11px;font-weight:700;margin-bottom:12px;">Sports Medicine</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">Une asymétrie de force marquée entre les deux membres est associée à un risque accru de blessure et de récidive.</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">Revues sur les asymétries musculaires.</p></div><div style="background:#fff;border-radius:18px;padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);display:flex;flex-direction:column;"><span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:rgba(4,164,155,.1);color:#04A49B;font-size:11px;font-weight:700;margin-bottom:12px;">Fiabilité</span><p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#003850;font-weight:500;">Les dynamomètres et plateformes de force fournissent des mesures fiables et reproductibles pour objectiver la force.</p><p style="margin:auto 0 0;font-size:12px;color:rgba(51,51,52,.5);">Études de reproductibilité (ForceDecks / dynamométrie).</p></div></div><p style="margin:26px auto 0;max-width:640px;text-align:center;font-size:12px;line-height:1.6;color:rgba(51,51,52,.45);">Références fournies à titre informatif. Les résultats varient selon les personnes et les indications ; un avis professionnel reste nécessaire.</p></div></section>`,
  },
];

export function getMethode(slug: string): Methode | undefined {
  return METHODES.find((m) => m.slug === slug);
}

/**
 * Cartes de méthode réutilisées à deux endroits : le panneau « Nos soins »
 * du mega-menu et la page d'index /methodes. Source unique pour éviter que
 * les deux divergent.
 */
export type MethodeCard = {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  objectPosition?: string;
};

export const METHODE_CARDS: MethodeCard[] = [
  { slug: "allyane", title: "Thérapie Allyane®", subtitle: "by Galmeon", image: "/allyane-session.png" },
  { slug: "clinique-du-coureur", title: "La Clinique du Coureur®", subtitle: "Suivi & analyse de foulée", image: "/clinique-coureur-analyse.png" },
  { slug: "testing-vald", title: "Testing du sportif", subtitle: "by Vald®", image: "/vald-forceframe-testing.webp" },
  { slug: "emdr", title: "Thérapie EMDR", subtitle: "Gestion du trauma & du stress", image: "/emdr.webp" },
  { slug: "dry-needling", title: "Dry Needling & Cupping", subtitle: "Techniques manuelles ciblées", image: "/dry-needling.jpg" },
  { slug: "electrostimulation", title: "Électrostimulation", subtitle: "Compex® · renfort & récup", image: "/electrostimulation.png" },
  { slug: "bfr", title: "BFR", subtitle: "Blood Flow Restriction", image: "/bfr.webp" },
  { slug: "preparation-physique", title: "Préparation physique", subtitle: "Coaching & small groups", image: "/prepa-physique-small-group.jpeg", objectPosition: "center 40%" },
  { slug: "infiltrations", title: "Infiltrations", subtitle: "PRP · viscosupplémentation · corticoïdes", image: "/infiltrations.jpeg" },
  { slug: "mesotherapie", title: "Mésothérapie", subtitle: "Micro-injections locales", image: "/mesotherapie.jpeg", objectPosition: "center 35%" },
];
