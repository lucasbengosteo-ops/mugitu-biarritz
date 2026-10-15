/**
 * Balises <title> et meta description des pages publiques, par chemin.
 *
 * Le titre affiché dans la page (le <h1> du hero) vit avec le contenu ; ce
 * qui est ici ne sert qu'aux moteurs et aux partages. Règles :
 * - titre complet, marque comprise, de 60 caractères au plus (65 quand c'est
 *   impossible), mot-clé principal en tête, « Biarritz » sur les pages
 *   locales, marque courte « Mugitu » en fin ;
 * - il est posé en `title.absolute` : le modèle du layout ne s'y ajoute pas ;
 * - description de 70 à 160 caractères quand le chapô de la page est vide
 *   ou ne convient pas.
 *
 * Pur et sans alias : lu tel quel par `node --test` (voir pages.test.ts).
 */

export const MARQUE = "Mugitu";

/** Suffixe des titres : la marque courte. */
export const SUFFIXE = ` | ${MARQUE}`;

export type SeoPage = { titre: string; description?: string };

export const SEO: Record<string, SeoPage> = {
  /* ── Pages fixes ── */
  "/": { titre: "Centre médical et paramédical du sport à Biarritz | Mugitu" },
  "/eu": { titre: "Kirol kinesiterapia, medikuntza eta osteopatia | Mugitu" },
  "/esprit-mugitu": { titre: "Le cabinet, ses salles et son matériel à Biarritz | Mugitu" },
  "/equipe": { titre: "La Mugi Team, praticiens du sport à Biarritz | Mugitu" },
  "/mugi-klub": { titre: "Mugi Klub : small groups et ateliers à Biarritz | Mugitu" },
  "/mugi-klub/preparation-individuelle": { titre: "Préparation physique individuelle à Biarritz | Mugitu" },
  "/ambassadeurs": { titre: "Les ambassadeurs du cabinet à Biarritz | Mugitu" },
  "/actualites": { titre: "Actualités et conseils sport-santé | Mugitu" },
  "/zone-intervention": { titre: "Venir au cabinet, 3 avenue Kléber à Biarritz | Mugitu" },
  "/nos-soins": { titre: "Soins du sportif à Biarritz : disciplines et bilans | Mugitu" },
  "/methodes": { titre: "Méthodes et technologies de soin à Biarritz | Mugitu" },
  "/contact": { titre: "Contact et rendez-vous à Biarritz | Mugitu" },
  "/faq": { titre: "Questions fréquentes sur le cabinet | Mugitu" },
  "/mentions-legales": { titre: "Mentions légales | Mugitu" },
  "/confidentialite": { titre: "Politique de confidentialité | Mugitu" },
  "/concours-avirun-2026": { titre: "Résultats du jeu concours Avirun 2K26 | Mugitu" },
  "/eu/concours-avirun-2026": { titre: "Avirun 2K26 lehiaketaren emaitzak | Mugitu" },

  /* ── Pathologies ── */
  "/pathologies/reeducation-lca": {
    titre: "Rééducation du LCA et retour au sport à Biarritz | Mugitu",
    description:
      "Rupture du ligament croisé antérieur : rééducation en quatre phases, force du quadriceps mesurée et tests de retour au sport, au cabinet Mugitu à Biarritz.",
  },
  "/pathologies/tendinopathie-achille": {
    titre: "Tendinopathie d’Achille : traitement à Biarritz | Mugitu",
    description:
      "Tendinopathie d’Achille : raideur du matin, douleur en début de sortie. Diagnostic, renforcement du mollet et reprise de la course au cabinet de Biarritz.",
  },
  "/pathologies/pubalgie": {
    titre: "Pubalgie du sportif : traitement à Biarritz | Mugitu",
    description:
      "Pubalgie du sportif : douleur d’aine, examen ciblé et renforcement progressif des adducteurs sur huit à seize semaines, au cabinet Mugitu à Biarritz.",
  },
  "/pathologies/entorse-de-cheville": {
    titre: "Entorse de cheville : rééducation à Biarritz | Mugitu",
    description:
      "Entorse de cheville : critères d’Ottawa, appui précoce et proprioception pour éviter la récidive. Rééducation en quatre à huit semaines à Biarritz.",
  },
  "/pathologies/lesion-ischio-jambiers": {
    titre: "Lésion des ischio-jambiers : soins à Biarritz | Mugitu",
    description:
      "Lésion des ischio-jambiers : examen, échographie si utile, renforcement excentrique puis retour progressif au sprint, au cabinet Mugitu à Biarritz.",
  },
  "/pathologies/periostite-tibiale": {
    titre: "Périostite tibiale : traitement à Biarritz | Mugitu",
    description:
      "Périostite tibiale du coureur : écarter la fracture de fatigue, réduire l’impact et renforcer le mollet avant de remonter le kilométrage, à Biarritz.",
  },
  "/pathologies/syndrome-rotulien": {
    titre: "Syndrome rotulien : traitement à Biarritz | Mugitu",
    description:
      "Syndrome rotulien : douleur à l’avant du genou en descente. Renforcement du quadriceps et des fessiers, ajustement de la charge, au cabinet de Biarritz.",
  },
  "/pathologies/epicondylite": {
    titre: "Épicondylite (tennis elbow) : soins à Biarritz | Mugitu",
    description:
      "Épicondylite ou tennis elbow : douleur externe du coude chez les joueurs de raquette et de pelote. Renforcement progressif du tendon, à Biarritz.",
  },
  "/pathologies/aponevrosite-plantaire": {
    titre: "Aponévrosite plantaire : traitement à Biarritz | Mugitu",
    description:
      "Aponévrosite plantaire : douleur du talon aux premiers pas du matin. Renforcement du pied, travail du mollet et gestion de la charge, à Biarritz.",
  },
  "/pathologies/fracture-de-fatigue": {
    titre: "Fracture de fatigue du sportif à Biarritz | Mugitu",
    description:
      "Fracture de fatigue : signes d’alerte, imagerie, mise en décharge puis reprise par paliers. Énergie disponible et densité osseuse évaluées à Biarritz.",
  },
  "/pathologies/lombalgie-du-sportif": {
    titre: "Lombalgie du sportif : traitement à Biarritz | Mugitu",
    description:
      "Lombalgie du sportif : rester actif, reprendre confiance dans le mouvement, renforcer tronc et hanches. Prise en charge au cabinet Mugitu à Biarritz.",
  },
  "/pathologies/epaule-du-surfeur": {
    titre: "Épaule du surfeur : traitement à Biarritz | Mugitu",
    description:
      "Épaule du surfeur : tendinopathie de la coiffe liée au volume de rame. Renforcement, mobilité thoracique et reprise de l’eau, au cabinet de Biarritz.",
  },

  /* ── Sports ── */
  "/sports/surf": {
    titre: "Surf : soins et prévention des blessures à Biarritz | Mugitu",
    description:
      "Surf à Biarritz : épaule de rame, lombalgie d’extension, genou au take-off. Soins, renforcement à terre et gestion des pics de sessions au cabinet Mugitu.",
  },
  "/sports/rugby": {
    titre: "Rugby : soins et retour au jeu à Biarritz | Mugitu",
    description:
      "Rugby : pubalgie, ischio-jambiers, épaule de contact, commotions. Soins, mesures de force et retour au jeu planifié, au cabinet Mugitu à Biarritz.",
  },
  "/sports/trail-et-course": {
    titre: "Trail et course à pied : suivi à Biarritz | Mugitu",
    description:
      "Trail et course à pied : tendon d’Achille, genou, périostite. Suivi de la charge, renforcement et analyse de foulée au cabinet Mugitu à Biarritz.",
  },
  "/sports/danse": {
    titre: "Danse : soins et prévention à Biarritz | Mugitu",
    description:
      "Danse : cheville, hanche et dos soumis à la répétition. Soins, renforcement, alimentation et préparation mentale pour la scène, au cabinet de Biarritz.",
  },
  "/sports/pelote-basque": {
    titre: "Pelote basque : soins et prévention à Biarritz | Mugitu",
    description:
      "Pelote basque : main, poignet, épaule dominante et asymétries du corps. Soins et renforcement compensatoire au cabinet Mugitu, avenue Kléber à Biarritz.",
  },

  /* ── Soins et bilans ── */
  "/soins/kinesitherapie-du-sport": {
    titre: "Kinésithérapie du sport à Biarritz | Mugitu",
    description:
      "Kinésithérapie du sport à Biarritz : bilan initial, plan de charge écrit et séances actives sur un plateau technique de 50 m², jusqu’au retour au sport.",
  },
  "/soins/medecine-du-sport": { titre: "Médecine du sport et rééducation à Biarritz | Mugitu" },
  "/soins/osteopathie": { titre: "Ostéopathe du sport à Biarritz | Mugitu" },
  "/soins/podologie": { titre: "Podologue du sport à Biarritz | Mugitu" },
  "/soins/psychologie": { titre: "Psychologue du sport à Biarritz | Mugitu" },
  "/soins/nutrition-du-sport": { titre: "Diététique et nutrition du sport à Biarritz | Mugitu" },
  "/soins/bilan-pre-saison": {
    titre: "Bilan de pré-saison du sportif à Biarritz | Mugitu",
    description:
      "Bilan de pré-saison à Biarritz : entretien médical, examen clinique, ECG selon le profil et mesures de force, en individuel ou en club. Durée : une heure.",
  },
  "/soins/bilan-retour-au-sport": {
    titre: "Bilan de retour au sport à Biarritz | Mugitu",
    description:
      "Bilan de retour au sport à Biarritz : force au dynamomètre, sauts, tests spécifiques et confiance, comparés à des seuils reconnus. Compte rendu remis.",
  },
  "/soins/analyse-de-foulee": {
    titre: "Analyse de foulée à Biarritz | Mugitu",
    description:
      "Analyse de foulée à Biarritz : entretien, bilan physique et vidéo de course sur tapis et au sol, pour comprendre une blessure ou préparer un objectif.",
  },

  /* ── Méthodes ── */
  "/methodes/galmeon": { titre: "Thérapie Galmeon à Biarritz | Mugitu" },
  "/methodes/bfr": { titre: "BFR, renforcement à faible charge à Biarritz | Mugitu" },
  "/methodes/clinique-du-coureur": { titre: "La Clinique du Coureur à Biarritz | Mugitu" },
  "/methodes/dry-needling": { titre: "Dry needling et cupping à Biarritz | Mugitu" },
  "/methodes/emdr": { titre: "Thérapie EMDR et blessure sportive à Biarritz | Mugitu" },
  "/methodes/electrostimulation": { titre: "Électrostimulation à Biarritz | Mugitu" },
  "/methodes/infiltrations": { titre: "Infiltrations et PRP à Biarritz | Mugitu" },
  "/methodes/mesotherapie": { titre: "Mésothérapie du sportif à Biarritz | Mugitu" },
  "/methodes/preparation-physique": { titre: "Préparation physique et coaching à Biarritz | Mugitu" },
  "/methodes/testing-vald": { titre: "Testing de force du sportif à Biarritz | Mugitu" },
};

/** Le titre complet d'un chemin connu, ou `undefined`. */
export function titreDe(chemin: string): string | undefined {
  return SEO[chemin]?.titre;
}

/**
 * Le métier tel qu'il figure dans le <title> d'une fiche praticien, avec le
 * lieu quand il s'applique. Plus court que l'intitulé de la fiche : le titre
 * doit tenir dans 60 caractères avec le nom.
 */
const METIERS: Record<string, string> = {
  "lucas-bengoechea": "ostéopathe du sport à Biarritz",
  "basile-carcassonne": "médecin du sport à Biarritz",
  "jean-baptiste-colombie": "kiné du sport à Biarritz",
  "julien-blamont": "ostéopathe et kiné à Biarritz",
  "clement-cofourain": "kiné du sport à Biarritz",
  "marie-boura": "psychologue du sport à Biarritz",
  "mailys-bersier": "psychologue EMDR à Biarritz",
  "marine-vignaud": "ostéopathe du sport à Biarritz",
  "hugo-daminato": "préparation physique à Biarritz",
  "ihintza-larralde": "diététique du sport à Biarritz",
  "johanna-marmiesse": "diététique du sport à distance",
  "ophelie-hubert": "podologue du sport à Biarritz",
  "baptiste-caparros": "coach de trail à Biarritz",
};

/**
 * Titre d'une fiche praticien. Le nom vient de la fiche (il peut être
 * retouché depuis le back-office) : si l'ensemble dépasse 60 caractères, le
 * métier tombe plutôt que la marque.
 */
export function titreFiche(slug: string, nom: string): string {
  const metier = METIERS[slug];
  const complet = metier ? `${nom}, ${metier}${SUFFIXE}` : `${nom}${SUFFIXE}`;
  return complet.length <= 60 ? complet : `${nom}${SUFFIXE}`;
}
