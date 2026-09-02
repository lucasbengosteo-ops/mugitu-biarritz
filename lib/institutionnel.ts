import type { ContentPage } from "./content-page";

/**
 * Pages institutionnelles : FAQ, mentions légales, confidentialité et zone
 * d’intervention. Même gabarit que les autres pages de contenu.
 */
export const INSTITUTIONNEL: ContentPage[] = [
  {
    slug: "faq",
    title: `Questions fréquentes`,
    eyebrow: `On vous répond`,
    lead: `Rendez-vous, soins, Mugi Klub, tarifs, app patient : tout ce qu’il faut savoir avant de pousser la porte de la maison du mouvement.`,
    crumb: `FAQ`,
    trail: [{ label: `Accueil`, href: "/" }],
    cta: "/equipe",
    size: "l",
    bodyHtml: `<!-- FAQ -->
<section style="max-width:820px;margin:0 auto;padding:var(--sect-tight) clamp(20px,5vw,40px);">

  <p style="margin:0 0 16px;font-size:12px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:600;color:#04A49B;">Rendez-vous &amp; soins</p>
  <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:40px;">
    <div class="faq-item" data-open="1" style="background:#fff;border-radius:var(--r-m);box-shadow:0 3px 16px rgba(60,40,30,.06);overflow:hidden;">
      <button class="faq-q" style="width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;background:transparent;border:none;cursor:pointer;text-align:left;font-family:inherit;"><span style="font-size:16px;font-weight:700;color:#003850;">Comment prendre rendez-vous ?</span><span class="faq-chev" style="flex:0 0 auto;width:22px;height:22px;position:relative;transition:transform .3s;"><span style="position:absolute;top:10px;left:4px;width:14px;height:2px;background:#04A49B;"></span><span style="position:absolute;top:4px;left:10px;width:2px;height:14px;background:#04A49B;"></span></span></button>
      <div class="faq-a"><p style="margin:0;padding:0 24px 22px;font-size:14px;line-height:1.7;color:rgba(51,51,52,.7);">La réservation se fait en ligne depuis la page <a href="/equipe" style="color:#04A49B;text-decoration:none;font-weight:600;">Prendre rendez-vous</a> : choisissez votre praticien et son créneau sur Doctolib. Pour les nouveaux praticiens, la réservation se fait par e-mail en attendant leur agenda en ligne.</p></div>
    </div>
    <div class="faq-item" data-open="0" style="background:#fff;border-radius:var(--r-m);box-shadow:0 3px 16px rgba(60,40,30,.06);overflow:hidden;">
      <button class="faq-q" style="width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;background:transparent;border:none;cursor:pointer;text-align:left;font-family:inherit;"><span style="font-size:16px;font-weight:700;color:#003850;">Faut-il être sportif pour consulter ?</span><span class="faq-chev" style="flex:0 0 auto;width:22px;height:22px;position:relative;transition:transform .3s;"><span style="position:absolute;top:10px;left:4px;width:14px;height:2px;background:#04A49B;"></span><span style="position:absolute;top:4px;left:10px;width:2px;height:14px;background:#04A49B;"></span></span></button>
      <div class="faq-a"><p style="margin:0;padding:0 24px 22px;font-size:14px;line-height:1.7;color:rgba(51,51,52,.7);">Pas du tout. Nous accompagnons tous les niveaux, du sédentaire qui reprend une activité à l’athlète élite. La démarche « sport-santé » s’adresse aussi aux personnes qui veulent bouger sans se blesser.</p></div>
    </div>
    <div class="faq-item" data-open="0" style="background:#fff;border-radius:var(--r-m);box-shadow:0 3px 16px rgba(60,40,30,.06);overflow:hidden;">
      <button class="faq-q" style="width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;background:transparent;border:none;cursor:pointer;text-align:left;font-family:inherit;"><span style="font-size:16px;font-weight:700;color:#003850;">Quels soins proposez-vous ?</span><span class="faq-chev" style="flex:0 0 auto;width:22px;height:22px;position:relative;transition:transform .3s;"><span style="position:absolute;top:10px;left:4px;width:14px;height:2px;background:#04A49B;"></span><span style="position:absolute;top:4px;left:10px;width:2px;height:14px;background:#04A49B;"></span></span></button>
      <div class="faq-a"><p style="margin:0;padding:0 24px 22px;font-size:14px;line-height:1.7;color:rgba(51,51,52,.7);">Médecine du sport &amp; rééducation, ostéopathie, kinésithérapie, psychologie, coaching / préparation physique, nutrition et podologie. Nous proposons aussi des méthodes de pointe&nbsp;: Allyane®, La Clinique du Coureur®, testing Vald®, EMDR, dry needling &amp; cupping. Voir <a href="/methodes" style="color:#04A49B;text-decoration:none;font-weight:600;">Nos soins</a>.</p></div>
    </div>
    <div class="faq-item" data-open="0" style="background:#fff;border-radius:var(--r-m);box-shadow:0 3px 16px rgba(60,40,30,.06);overflow:hidden;">
      <button class="faq-q" style="width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;background:transparent;border:none;cursor:pointer;text-align:left;font-family:inherit;"><span style="font-size:16px;font-weight:700;color:#003850;">Les séances sont-elles remboursées ?</span><span class="faq-chev" style="flex:0 0 auto;width:22px;height:22px;position:relative;transition:transform .3s;"><span style="position:absolute;top:10px;left:4px;width:14px;height:2px;background:#04A49B;"></span><span style="position:absolute;top:4px;left:10px;width:2px;height:14px;background:#04A49B;"></span></span></button>
      <div class="faq-a"><p style="margin:0;padding:0 24px 22px;font-size:14px;line-height:1.7;color:rgba(51,51,52,.7);">La kinésithérapie sur prescription et les consultations de médecine du sport sont prises en charge par l’Assurance Maladie selon les règles en vigueur. L’ostéopathie, la préparation physique, la nutrition et certaines méthodes ne sont pas remboursées par la Sécurité sociale, mais peuvent l’être partiellement par votre mutuelle. N’hésitez pas à nous demander un devis.</p></div>
    </div>
  </div>

  <p style="margin:0 0 16px;font-size:12px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:600;color:#04A49B;">Le Mugi Klub</p>
  <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:40px;">
    <div class="faq-item" data-open="0" style="background:#fff;border-radius:var(--r-m);box-shadow:0 3px 16px rgba(60,40,30,.06);overflow:hidden;">
      <button class="faq-q" style="width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;background:transparent;border:none;cursor:pointer;text-align:left;font-family:inherit;"><span style="font-size:16px;font-weight:700;color:#003850;">Qu’est-ce que le Mugi Klub ?</span><span class="faq-chev" style="flex:0 0 auto;width:22px;height:22px;position:relative;transition:transform .3s;"><span style="position:absolute;top:10px;left:4px;width:14px;height:2px;background:#04A49B;"></span><span style="position:absolute;top:4px;left:10px;width:2px;height:14px;background:#04A49B;"></span></span></button>
      <div class="faq-a"><p style="margin:0;padding:0 24px 22px;font-size:14px;line-height:1.7;color:rgba(51,51,52,.7);">C’est la communauté Mugitu&nbsp;: des small groups, ateliers, conférences et soirées encadrés par nos praticiens. On y entretient sa forme, on apprend et on partage. Voir le <a href="/mugi-klub" style="color:#04A49B;text-decoration:none;font-weight:600;">planning et les tarifs</a>.</p></div>
    </div>
    <div class="faq-item" data-open="0" style="background:#fff;border-radius:var(--r-m);box-shadow:0 3px 16px rgba(60,40,30,.06);overflow:hidden;">
      <button class="faq-q" style="width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;background:transparent;border:none;cursor:pointer;text-align:left;font-family:inherit;"><span style="font-size:16px;font-weight:700;color:#003850;">Comment fonctionnent les crédits ?</span><span class="faq-chev" style="flex:0 0 auto;width:22px;height:22px;position:relative;transition:transform .3s;"><span style="position:absolute;top:10px;left:4px;width:14px;height:2px;background:#04A49B;"></span><span style="position:absolute;top:4px;left:10px;width:2px;height:14px;background:#04A49B;"></span></span></button>
      <div class="faq-a"><p style="margin:0;padding:0 24px 22px;font-size:14px;line-height:1.7;color:rgba(51,51,52,.7);">Chaque achat (séance d’essai, carte 10 séances) crédite votre compte membre. Une inscription à une activité consomme un crédit ; l’abonnement Klub illimité donne un accès sans décompte. Vous gérez tout depuis <a href="/mon-espace" style="color:#04A49B;text-decoration:none;font-weight:600;">Mon espace</a>.</p></div>
    </div>
  </div>

  <p style="margin:0 0 16px;font-size:12px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:600;color:#04A49B;">Espace &amp; app</p>
  <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:44px;">
    <div class="faq-item" data-open="0" style="background:#fff;border-radius:var(--r-m);box-shadow:0 3px 16px rgba(60,40,30,.06);overflow:hidden;">
      <button class="faq-q" style="width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;background:transparent;border:none;cursor:pointer;text-align:left;font-family:inherit;"><span style="font-size:16px;font-weight:700;color:#003850;">À quoi sert mon espace membre ?</span><span class="faq-chev" style="flex:0 0 auto;width:22px;height:22px;position:relative;transition:transform .3s;"><span style="position:absolute;top:10px;left:4px;width:14px;height:2px;background:#04A49B;"></span><span style="position:absolute;top:4px;left:10px;width:2px;height:14px;background:#04A49B;"></span></span></button>
      <div class="faq-a"><p style="margin:0;padding:0 24px 22px;font-size:14px;line-height:1.7;color:rgba(51,51,52,.7);">Il centralise vos crédits, rendez-vous, inscriptions au Klub, auto-tests santé, articles et votre profil (antécédents, objectifs…). Plus votre profil est complet, mieux vos praticiens vous accompagnent.</p></div>
    </div>
    <div class="faq-item" data-open="0" style="background:#fff;border-radius:var(--r-m);box-shadow:0 3px 16px rgba(60,40,30,.06);overflow:hidden;">
      <button class="faq-q" style="width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;background:transparent;border:none;cursor:pointer;text-align:left;font-family:inherit;"><span style="font-size:16px;font-weight:700;color:#003850;">Mes données de santé sont-elles protégées ?</span><span class="faq-chev" style="flex:0 0 auto;width:22px;height:22px;position:relative;transition:transform .3s;"><span style="position:absolute;top:10px;left:4px;width:14px;height:2px;background:#04A49B;"></span><span style="position:absolute;top:4px;left:10px;width:2px;height:14px;background:#04A49B;"></span></span></button>
      <div class="faq-a"><p style="margin:0;padding:0 24px 22px;font-size:14px;line-height:1.7;color:rgba(51,51,52,.7);">Oui. Les données sont hébergées chez un hébergeur de données de santé (HDS) agréé, chiffrées, et vous gérez vos consentements de partage. Voir notre <a href="/confidentialite" style="color:#04A49B;text-decoration:none;font-weight:600;">politique de confidentialité</a>.</p></div>
    </div>
  </div>

  <!-- contact -->
  <div style="background:#003850;border-radius:var(--r-l);padding:clamp(28px,4vw,40px);text-align:center;color:#fff;">
    <h2 style="margin:0 0 10px;font-size:var(--h2-s);font-weight:700;letter-spacing:-.01em;">Une autre question ?</h2>
    <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:rgba(255,255,255,.65);">Écrivez-nous, on vous répond rapidement.</p>
    <a href="mailto:contact@mugitu-biarritz.fr" style="display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">contact@mugitu-biarritz.fr <span>↗</span></a>
  </div>
</section>`,
  },
  {
    slug: "mentions-legales",
    title: `Mentions légales`,
    eyebrow: ``,
    lead: ``,
    crumb: `Mentions légales`,
    trail: [{ label: `Accueil`, href: "/" }],
    cta: "/equipe",
    size: "l",
    bodyHtml: `<section class="lg" style="max-width:820px;margin:0 auto;padding:var(--sect-tight) clamp(20px,5vw,40px);">
  <p style="font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour&nbsp;: 1er juillet 2026</p>

  <h2>Éditeur du site</h2>
  <p>Le site <strong>mugitu-biarritz.fr</strong> est édité par <strong>Mugitu — la maison du mouvement</strong>, cabinet pluridisciplinaire de santé et de performance du sportif.<br>Adresse&nbsp;: 3 avenue Kléber, 64200 Biarritz, France.<br>E-mail&nbsp;: <a href="mailto:contact@mugitu-biarritz.fr">contact@mugitu-biarritz.fr</a></p>
  <p><em>Les informations légales complètes (forme juridique, capital, SIRET, n° RCS, TVA intracommunautaire, directeur de la publication) seront précisées ici.</em></p>

  <h2>Hébergement</h2>
  <p>Le site est hébergé par son prestataire d’hébergement web. Les données de santé traitées via l’application <strong>app.mugitu.pro</strong> sont hébergées chez un <strong>hébergeur de données de santé (HDS)</strong> agréé conformément à l’article L.1111-8 du Code de la santé publique.</p>

  <h2>Praticiens</h2>
  <p>Les praticiens exerçant au sein de Mugitu sont des professionnels de santé et du sport indépendants, inscrits, le cas échéant, à leur ordre professionnel et disposant des diplômes requis pour l’exercice de leur activité. Chaque praticien est responsable de ses actes et de ses informations professionnelles.</p>

  <h2>Propriété intellectuelle</h2>
  <p>L’ensemble des contenus du site (textes, logos, marque « Mugitu », visuels, mise en page) est protégé par le droit de la propriété intellectuelle. Les marques et logos de partenaires (Allyane®, La Clinique du Coureur®, VALD®, Andrew®) appartiennent à leurs titulaires respectifs et sont utilisés à des fins d’information. Toute reproduction non autorisée est interdite.</p>

  <h2>Responsabilité</h2>
  <p>Les informations présentes sur ce site sont fournies à titre indicatif et ne se substituent en aucun cas à une consultation ou à un avis médical personnalisé. Les auto-tests proposés dans l’espace membre sont indicatifs. En cas de douleur aiguë ou d’urgence, consultez un professionnel de santé.</p>

  <h2>Liens externes</h2>
  <p>Le site peut contenir des liens vers des sites tiers (Doctolib, partenaires…). Mugitu n’exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.</p>

  <h2>Contact</h2>
  <p>Pour toute question relative au site ou à ces mentions, écrivez-nous à <a href="mailto:contact@mugitu-biarritz.fr">contact@mugitu-biarritz.fr</a>.</p>

  <p style="margin-top:28px;"><a href="/confidentialite" style="font-weight:600;">Politique de confidentialité</a></p>
</section>`,
  },
  {
    slug: "confidentialite",
    title: `Politique de confidentialité`,
    eyebrow: ``,
    lead: ``,
    crumb: `Confidentialité`,
    trail: [{ label: `Accueil`, href: "/" }],
    cta: "/equipe",
    size: "l",
    bodyHtml: `<section class="lg" style="max-width:820px;margin:0 auto;padding:var(--sect-tight) clamp(20px,5vw,40px);">
  <p style="font-size:13px;color:rgba(51,51,52,.5);">Dernière mise à jour&nbsp;: 1er juillet 2026</p>
  <p>Mugitu accorde une importance essentielle à la protection de vos données personnelles et de santé. Cette politique explique quelles données nous traitons, pourquoi, et quels sont vos droits, conformément au Règlement général sur la protection des données (RGPD).</p>

  <h2>Responsable du traitement</h2>
  <p>Mugitu — la maison du mouvement, 3 avenue Kléber, 64200 Biarritz. Contact&nbsp;: <a href="mailto:contact@mugitu-biarritz.fr">contact@mugitu-biarritz.fr</a>.</p>

  <h2>Données que nous traitons</h2>
  <ul>
    <li><strong>Identité &amp; contact</strong> : nom, e-mail, téléphone, adresse, date de naissance.</li>
    <li><strong>Données de profil sportif</strong> : sports pratiqués, club, niveau, objectifs.</li>
    <li><strong>Données de santé</strong> : antécédents, blessures, traitements, allergies, bilans et résultats de tests — traitées uniquement dans le cadre du suivi par vos praticiens.</li>
    <li><strong>Données d’usage</strong> : réservations, crédits, achats et factures de l’espace membre.</li>
  </ul>

  <h2>Finalités &amp; base légale</h2>
  <p>Vos données sont traitées pour&nbsp;: assurer votre prise en charge et le suivi de soin (exécution du contrat de soin et intérêt vital / consentement pour les données de santé), gérer vos rendez-vous et abonnements, et — avec votre accord — vous adresser des communications. Les données de santé ne sont accessibles qu’aux praticiens que vous consultez.</p>

  <h2>Hébergement des données de santé</h2>
  <p>Les données de santé sont hébergées chez un <strong>hébergeur de données de santé (HDS)</strong> agréé, en France, avec chiffrement et traçabilité des accès, conformément à la réglementation applicable.</p>

  <h2>Consentements</h2>
  <p>Depuis votre <a href="/mon-espace">espace membre</a>, vous contrôlez vos consentements&nbsp;: partage du dossier avec la Mugi Team, partage des données d’objets connectés (à venir), et communications. Vous pouvez les modifier à tout moment.</p>

  <h2>Durée de conservation</h2>
  <p>Les données de santé sont conservées conformément aux obligations légales applicables aux dossiers de santé. Les autres données sont conservées le temps nécessaire à la relation, puis supprimées ou anonymisées.</p>

  <h2>Vos droits</h2>
  <p>Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité de vos données. Pour les exercer, écrivez à <a href="mailto:contact@mugitu-biarritz.fr">contact@mugitu-biarritz.fr</a>. Vous pouvez également introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">cnil.fr</a>).</p>

  <h2>Cookies</h2>
  <p>Le site peut utiliser des cookies strictement nécessaires à son fonctionnement et, le cas échéant, des cookies de mesure d’audience soumis à votre consentement.</p>

  <p style="margin-top:28px;"><a href="/mentions-legales" style="font-weight:600;">Mentions légales</a></p>
</section>`,
  },
  {
    slug: "ambassadeurs",
    title: `Nos ambassadeurs`,
    eyebrow: `Ils nous font confiance`,
    lead: `Des sportifs du Pays Basque et d’ailleurs, du surf de gros au trail et à la danse contemporaine, qui s’entraînent, récupèrent et performent avec la Mugi Team.`,
    crumb: ``,
    trail: [],
    cta: "/equipe",
    size: "xl",
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
  },
  {
    slug: "zone-intervention",
    title: `Venir au cabinet Mugitu, 3 avenue Kléber à Biarritz`,
    eyebrow: `Biarritz · Côte basque`,
    lead: `Nous recevons des sportifs de tout le BAB et de la côte, d’Anglet à Saint-Jean-de-Luz. Voici comment venir, où se garer, et à quels horaires.`,
    crumb: `Venir au cabinet`,
    trail: [{ label: `Accueil`, href: "/" }],
    cta: "/equipe",
    size: "l",
    bodyHtml: `<section style="max-width:1140px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
    <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:24px;height:24px;color:#04A49B;"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
      <h2 style="margin:14px 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">L’adresse</h2>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.68);">3 avenue Kléber<br>64200 Biarritz</p>
    </div>
    <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:24px;height:24px;color:#04A49B;"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      <h2 style="margin:14px 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Les horaires</h2>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.68);">Du lundi au vendredi, 8h – 20h<br>Samedi matin, 9h – 13h</p>
    </div>
    <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:24px;height:24px;color:#04A49B;"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
      <h2 style="margin:14px 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Le stationnement</h2>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.68);">Stationnement gratuit devant le cabinet et dans les rues adjacentes.</p>
    </div>
    <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:24px;height:24px;color:#04A49B;"><circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/></svg>
      <h2 style="margin:14px 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">L’accès</h2>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(51,51,52,.68);">Cabinet de plain-pied, accessible aux personnes à mobilité réduite.</p>
    </div>
  </div>
</section>

<section style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:38px;max-width:660px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Depuis chez vous</p>
      <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Combien de temps pour venir</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.65);">Des temps de trajet en voiture, hors heures de pointe. Comptez dix à quinze minutes de plus le matin et en fin d’après-midi l’été.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <p style="margin:0 0 6px;font-size:26px;font-weight:800;color:#003850;letter-spacing:-.02em;">5 min</p>
        <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Depuis Biarritz centre</h3>
        <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Accessible à pied ou à vélo depuis la Milady et la Côte des Basques.</p>
      </div>
      <div style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <p style="margin:0 0 6px;font-size:26px;font-weight:800;color:#003850;letter-spacing:-.02em;">10 min</p>
        <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Depuis Anglet</h3>
        <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Par la RD810 ou le bord de mer, selon la saison et le trafic.</p>
      </div>
      <div style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <p style="margin:0 0 6px;font-size:26px;font-weight:800;color:#003850;letter-spacing:-.02em;">20 min</p>
        <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Depuis Bayonne</h3>
        <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Par l’A63 ou la RD810. Le trajet double facilement aux heures de pointe.</p>
      </div>
      <div style="background:#fff;border-radius:var(--r-l);padding:24px;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <p style="margin:0 0 6px;font-size:26px;font-weight:800;color:#003850;letter-spacing:-.02em;">20 min</p>
        <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;">Depuis Saint-Jean-de-Luz</h3>
        <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.62);">Par l’A63. Marine Vignaud reçoit également à Saint-Jean-de-Luz.</p>
      </div>
    </div>
    <p style="margin:26px 0 0;max-width:760px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.6);">En transports&nbsp;: lignes de bus Txik Txak desservant Biarritz depuis Bayonne et Anglet, arrêt à quelques minutes à pied. La gare de Biarritz est à environ dix minutes en voiture.</p>
  </div>
</section>

<section style="max-width:1140px;margin:0 auto;padding:var(--sect-ample) clamp(20px,5vw,40px);">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:clamp(24px,4vw,50px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Sur place</p>
      <h2 style="margin:0 0 14px;font-size:var(--h2-m);font-weight:700;letter-spacing:-.025em;color:#003850;">Ce que vous trouvez au cabinet</h2>
      <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">120 m² organisés autour de cinq salles nommées d’après les éléments basques, et d’un plateau technique de 50 m² dédié à la réathlétisation et aux small groups.</p>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Médecine du sport, ostéopathie, kinésithérapie, podologie, nutrition et psychologie du sport se pratiquent sous le même toit, ce qui permet de croiser les regards sur un même dossier.</p>
      <div style="margin-top:22px;"><a href="/esprit-mugitu" style="display:inline-flex;align-items:center;gap:8px;font-size:15px;font-weight:600;text-decoration:none;">Découvrir le lieu <span>→</span></a></div>
    </div>
    <div style="border-radius:var(--r-l);overflow:hidden;box-shadow:0 14px 44px rgba(60,40,30,.14);">
      <img src="/salle-accueil.jpg" alt="L’accueil et le plateau technique du cabinet Mugitu à Biarritz" style="display:block;width:100%;height:clamp(240px,32vw,380px);object-fit:cover;object-position:center 60%;" />
    </div>
  </div>
</section>

<section style="background:#003850;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:1140px;margin:0 auto;">
    <div style="margin-bottom:36px;max-width:620px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Le tissu sportif local</p>
      <h2 style="margin:0 0 14px;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#fff;">Les sports qu’on suit ici</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(255,255,255,.68);">La Côte basque a ses disciplines, et elles ont leurs blessures. Nous suivons ces pratiques toute l’année, en individuel comme avec les clubs du secteur.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px;">
      <a href="/sports/surf" style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:24px;text-decoration:none;display:block;transition:background .2s;" class="mg-inline-hover">
        <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#fff;">Surf</h3>
        <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.62);">Épaule de rame, dos, genou au take-off.</p>
      </a>
      <a href="/sports/trail-et-course" style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:24px;text-decoration:none;display:block;transition:background .2s;" class="mg-inline-hover">
        <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#fff;">Trail et course</h3>
        <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.62);">Des sentiers de la Rhune au littoral.</p>
      </a>
      <a href="/sports/rugby" style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:24px;text-decoration:none;display:block;transition:background .2s;" class="mg-inline-hover">
        <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#fff;">Rugby</h3>
        <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.62);">Contacts, sprints et densité de matchs.</p>
      </a>
      <a href="/sports/pelote-basque" style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:24px;text-decoration:none;display:block;transition:background .2s;" class="mg-inline-hover">
        <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#fff;">Pelote basque</h3>
        <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.62);">Main, poignet et épaule dominante.</p>
      </a>
      <a href="/sports/danse" style="background:rgba(255,255,255,.06);border-radius:var(--r-l);padding:24px;text-decoration:none;display:block;transition:background .2s;" class="mg-inline-hover">
        <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#fff;">Danse</h3>
        <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.62);">Cheville, hanche et charge de répétition.</p>
      </a>
    </div>
  </div>
</section>

<section style="background:#F5EDE4;padding:var(--sect-ample) clamp(20px,5vw,64px);">
  <div style="max-width:860px;margin:0 auto;">
    <div style="margin-bottom:36px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-eyebrow);text-transform:uppercase;font-weight:600;color:#04A49B;">Questions pratiques</p>
      <h2 style="margin:0;font-size:var(--h2-l);font-weight:700;letter-spacing:-.025em;color:#003850;">Avant de venir</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <h3 style="margin:0 0 10px;font-size:var(--h3-m);font-weight:700;color:#003850;">Comment prendre rendez-vous ?</h3>
        <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">En ligne, praticien par praticien, depuis <a href="/equipe" style="font-weight:600;">la page de la Mugi Team</a>. Chaque fiche indique les motifs de consultation et les créneaux disponibles.</p>
      </div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <h3 style="margin:0 0 10px;font-size:var(--h3-m);font-weight:700;color:#003850;">Faut-il une ordonnance ?</h3>
        <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Pas pour l’ostéopathie, la podologie, la nutrition ou la psychologie. Pour la kinésithérapie, une prescription reste nécessaire au remboursement.</p>
      </div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <h3 style="margin:0 0 10px;font-size:var(--h3-m);font-weight:700;color:#003850;">Que faut-il apporter ?</h3>
        <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Une tenue de sport, vos examens d’imagerie si vous en avez, et vos chaussures de course pour tout motif lié à la course à pied.</p>
      </div>
      <div style="background:#fff;border-radius:var(--r-l);padding:26px;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <h3 style="margin:0 0 10px;font-size:var(--h3-m);font-weight:700;color:#003850;">Vous déplacez-vous sur les clubs ?</h3>
        <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(51,51,52,.68);">Nous intervenons auprès de clubs du secteur pour des sessions de testing et de suivi collectif. Contactez-nous pour en discuter.</p>
      </div>
    </div>
  </div>
</section>

<section style="max-width:900px;margin:0 auto;padding:var(--sect-base) clamp(20px,5vw,24px);">
  <div style="background:#003850;border-radius:var(--r-xl);padding:clamp(28px,4vw,44px);color:#fff;text-align:center;">
    <h2 style="margin:0 0 12px;font-size:var(--h2-m);font-weight:700;letter-spacing:-.025em;">On vous attend avenue Kléber</h2>
    <p style="margin:0 auto 26px;max-width:480px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.7);">Choisissez le praticien qui correspond à votre motif, et réservez votre créneau en ligne.</p>
    <a href="/equipe" style="display:inline-flex;align-items:center;gap:8px;padding:15px 30px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">Prendre rendez-vous <span>↗</span></a>
  </div>
</section>`,
  },
];

export function getInstitutionnel(slug: string): ContentPage {
  const page = INSTITUTIONNEL.find((p) => p.slug === slug);
  if (!page) throw new Error(`Page institutionnelle inconnue : ${slug}`);
  return page;
}
