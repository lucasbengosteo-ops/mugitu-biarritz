/**
 * Dictionnaire français — tous les textes affichés sur le site.
 *
 * Structure organisée par section pour rester maintenable. La typesafety
 * est dérivée automatiquement de ce fichier via `Dict = typeof fr` dans
 * lib/i18n.ts → si tu ajoutes une clé ici, il faut l'ajouter aussi dans
 * eu.ts sinon TypeScript râle.
 */
const fr = {
  meta: {
    locale: "Français",
    localeShort: "FR",
    altLocale: "Euskara",
    altLocaleShort: "EU",
    switchAriaLabel: "Passer en basque (euskara)",
  },

  nav: {
    mugitu: "Mugitu",
    services: "Services",
    team: "Équipe",
    app: "App",
    contest: "Concours",
    contact: "Contact",
    bookAppointment: "Prendre RDV",
    menuLabel: "Menu",
  },

  hero: {
    title: "Mugitu — La maison du mouvement",
    subtitle:
      "Centre pluridisciplinaire de kinésithérapie du sport, médecine du sport et ostéopathie à Biarritz.",
    disciplines:
      "Kinésithérapeutes, médecins, ostéopathes, psychologues et préparateurs physiques et mentaux du sport.",
    ctaBook: "Prendre rendez-vous",
    ctaTeam: "Découvrir l'équipe",
    stats: [
      { value: "9", label: "Spécialistes" },
      { value: "3", label: "Disciplines" },
      { value: "360°", label: "Suivi sportif" },
    ],
    scrollHint: "Scroll",
  },

  histoire: {
    eyebrow: "Étymologie & Histoire",
    title: "Pourquoi Mugitu ?",
    word: "mugitu",
    wordCaption: "Basque · verbe",
    definitionLabel: "Définition",
    definitionShort: "« Se mouvoir, bouger, être en mouvement »",
    definitionLong:
      "Du basque mugitu — mouvement, déplacement, action de bouger. Une racine profondément ancrée dans la culture du Pays Basque, terre de sport, d'effort et de dépassement de soi.",
    cards: [
      {
        emoji: "🏔️",
        title: "Ancrage local",
        body: "Né à Biarritz, au cœur du Pays Basque — terre de surf, de rugby, de trail et de pelote. Un nom qui résonne avec l'identité sportive de la région.",
      },
      {
        emoji: "🤝",
        title: "Vision pluridisciplinaire",
        body: "Le projet est né d'un constat : le sportif blessé mérite une prise en charge coordonnée entre kiné, médecin et ostéo — sous le même toit, avec le même dossier.",
      },
      {
        emoji: "🎯",
        title: "La maison du mouvement",
        body: "Plus qu'un cabinet, une maison. Un lieu où praticiens et sportifs partagent la même philosophie : que le mouvement soit toujours possible, durable et performant.",
      },
    ],
  },

  services: {
    eyebrow: "Ce que nous proposons",
    title: "Nos services",
    items: [
      {
        key: "kine",
        title: "Kinésithérapie du sport",
        description:
          "Rééducation fonctionnelle et suivi personnalisé pour les sportifs de tous niveaux. Prise en charge des blessures musculaires, tendineuses et articulaires.",
      },
      {
        key: "medecine",
        title: "Médecine du sport",
        description:
          "Consultation médicale spécialisée, bilan de santé du sportif, certificats médicaux et suivi de performance. Traumatologie et médecine préventive.",
      },
      {
        key: "osteo",
        title: "Ostéopathie du sport",
        description:
          "Approche globale et manuelle pour améliorer la mobilité, la récupération et les performances. Idéale en complément des soins de rééducation.",
      },
      {
        key: "prepa",
        title: "Préparation physique",
        description:
          "Programmes individualisés de préparation physique et de retour au sport. Athletic training, prévention des blessures et optimisation des capacités athlétiques.",
      },
    ],
  },

  team: {
    eyebrow: "Pluridisciplinaire",
    title: "Notre équipe",
    bookCta: "Prendre RDV sur Doctolib",
    members: {
      lucas: {
        role: "Ostéopathe du sport",
        bio: "Ostéopathe spécialisé dans la prise en charge du sportif. Praticien certifié Thérapie Allyane®.",
        specialties: [
          "Ostéopathie du sport",
          "Thérapie Allyane®",
          "Suivi du coureur",
          "Endométriose",
        ],
      },
      basile: {
        role: "Médecin du sport",
        bio: "Médecin du sport assurant le suivi de sportifs de haut niveau. Spécialiste en traumatologie du sport, mésothérapie et infiltrations PRP.",
        specialties: [
          "Suivi sportifs haut niveau",
          "Traumatologie du sport",
          "Mésothérapie · PRP",
        ],
      },
      clement: {
        role: "Kinésithérapeute du sport",
        bio: "Kinésithérapeute du sport et athletic trainer. Spécialiste de la prise en charge pédiatrique du sportif et du danseur.",
        specialties: ["Athletic trainer", "Pédiatrie sportive", "Suivi du danseur"],
      },
      julien: {
        role: "Kinésithérapeute du sport",
        bio: "Kinésithérapeute du sport formé par La Clinique du Coureur. Spécialiste du suivi du coureur, de l'analyse de foulée et de la prévention des blessures de course à pied.",
        specialties: [
          "La Clinique du Coureur",
          "Analyse de foulée",
          "Suivi du coureur",
          "Prévention des blessures",
        ],
      },
      jb: {
        role: "Kinésithérapeute du sport",
        bio: "Kinésithérapeute du sport et préparateur physique. Praticien Allyane®, spécialiste du danseur.",
        specialties: [
          "Thérapie Allyane®",
          "Dry needling",
          "Réathlétisation",
          "Suivi du danseur",
        ],
      },
    },
  },

  allyane: {
    eyebrow: "Méthode certifiée",
    title: "Thérapie Allyane®",
    description:
      "La thérapie Allyane® est une approche de reprogrammation neuromotrice qui permet de lever les inhibitions musculaires post-traumatiques. Résultats en 1 à 3 séances.",
    indicationsLabel: "Indications",
    indications: [
      "Chirurgie ligamentaire",
      "Traumatismes sportifs",
      "Douleurs chroniques",
      "Récupération post-op",
    ],
    cta: "En savoir plus",
    certifiedLabel: "Praticiens certifiés",
  },

  cliniqueCoureur: {
    eyebrow: "Méthode certifiée",
    titleSr: "La Clinique du Coureur",
    subtitle: "Référence internationale du suivi du coureur",
    description:
      "Approche fondée par Blaise Dubois (Québec), basée sur la preuve scientifique et la programmation rigoureuse de la charge d'entraînement. Julien Blamont, kinésithérapeute du sport à Mugitu Biarritz, est <strong>praticien certifié</strong> et accompagne les coureurs amateurs comme confirmés.",
    expertisesLabel: "Expertises",
    expertises: [
      "Analyse de foulée",
      "Bilan du coureur",
      "Retour à la course post-blessure",
      "Prévention des blessures",
      "Programmation de la charge",
    ],
    ctaBook: "Prendre RDV avec Julien",
    ctaLearn: "En savoir plus",
    photoCaptionName: "Julien Blamont",
    photoCaptionRole: "Kinésithérapeute du sport · Mugitu Biarritz",
    certifiedBadge: "Praticien certifié La Clinique du Coureur",
  },

  appMugitu: {
    eyebrow: "Outil exclusif praticiens",
    title: "Le suivi qui fait la différence",
    descriptionLead: "app.mugitu.pro",
    descriptionRest:
      " — notre plateforme de suivi patient développée pour les praticiens du sport. Dossiers, séances, bilans : tout ce qu'il faut pour un accompagnement vraiment qualitatif.",
    chips: [
      "Hébergement HDS",
      "Flow consultation",
      "Roadmap de suivi",
      "Thérapie Allyane®",
      "Messagerie inter-praticiens",
      "Bilans & analytics",
    ],
    features: [
      {
        key: "sessions",
        title: "Suivi de séances",
        description:
          "Historique complet, notes de consultation et évolution clinique en un clic.",
      },
      {
        key: "performance",
        title: "Monitoring performance",
        description:
          "Tableaux de bord personnalisés pour suivre la progression de chaque sportif.",
      },
      {
        key: "dossier",
        title: "Dossier patient digital",
        description: "Documents, bilans et ordonnances centralisés et sécurisés.",
      },
      {
        key: "coord",
        title: "Coordination d'équipe",
        description:
          "Partagez le dossier entre kiné, médecin et ostéo pour une prise en charge coordonnée.",
      },
    ],
    ctaApp: "Accéder à l'app",
    ctaDemo: "Demander une démo",
    mockupAlt: "Interface app.mugitu.pro sur laptop et mobile",
    badgeHdsTitle: "Hébergement HDS",
    badgeHdsSub: "Données de santé certifiées",
    badgeFlowTitle: "Flow consultation",
    badgeFlowSub: "Parcours guidé",
    badgeRoadmapTitle: "Roadmap de suivi",
    badgeRoadmapSub: "Vision parcours patient",
    patientsCounter: "1785 patients suivis",
  },

  andrew: {
    eyebrow: "Suivi à distance",
    titlePre: "Prolongez la séance avec",
    description:
      "Nos praticiens prescrivent des programmes de rééducation sur <strong>Andrew®</strong>, l'application mobile qui permet au patient de continuer son travail chez lui — avec vidéos, suivi d'observance et messagerie directe avec le praticien.",
    features: [
      {
        key: "video",
        title: "Exercices en vidéo",
        description:
          "Programmes personnalisés avec instructions vidéo, accessibles à tout moment sur smartphone.",
      },
      {
        key: "observance",
        title: "Suivi de l'observance",
        description:
          "Visualisez en temps réel l'adhésion de vos patients à leur programme de rééducation.",
      },
      {
        key: "reminders",
        title: "Rappels automatiques",
        description:
          "Notifications intelligentes pour maintenir la régularité entre les séances.",
      },
      {
        key: "mobile",
        title: "Application mobile",
        description:
          "Disponible sur iOS et Android. Le patient retrouve son programme directement sur son téléphone.",
      },
    ],
    cta: "Découvrir Andrew®",
    ctaSub: "Disponible iOS & Android",
    observanceLabel: "Observance",
    observanceValue: "87%",
    activeProgramLabel: "Programme actif",
    mockupAlt: "Application Andrew — exercices recommandés",
  },

  contact: {
    eyebrow: "Adresse & rendez-vous",
    title: "Nous trouver",
    addressLabel: "Adresse",
    address: "3 avenue Kléber, 64200 Biarritz",
    emailLabel: "Email",
    hoursLabel: "Horaires",
    hours: "Lundi — Vendredi : 8h00 — 19h00",
    bookOnlineLabel: "Réserver en ligne",
    orWrite: "Ou écrivez-nous",
    practitioners: {
      lucas: { name: "Lucas Bengoechea", role: "Ostéopathe du sport" },
      basile: { name: "Dr Basile Carcassonne", role: "Médecin du sport" },
      julien: { name: "Julien Blamont", role: "Kinésithérapeute du sport" },
      jb: { name: "Jean-Baptiste Colombié", role: "Kinésithérapeute du sport" },
    },
    mapTitle: "Localisation Mugitu Biarritz",
  },

  footer: {
    tagline: "La maison du mouvement",
    address: "3 av. Kléber, 64200 Biarritz",
    legalLinks: {
      mentions: "Mentions légales",
      privacy: "Politique de confidentialité",
    },
    practitionerSpace: "Espace praticien →",
    copyright: "© 2026 Mugitu · 3 av. Kléber, Biarritz",
  },

  concoursStrip: {
    countdownPrefix: "🏃",
    countdownTitle: "5 analyses de foulée",
    countdownSuffix: "à gagner",
    countdownDeadline: "clôture dans",
    countdownCta: "Je participe →",
    resultsPrefix: "🏆",
    resultsTitle: "les 5 gagnant·es",
    resultsBody: "Concours Avirun : ",
    resultsBodyAfter: " sont annoncé·es",
    resultsCta: "Voir les résultats →",
    ariaLabelCountdown: "Voir le jeu concours Avirun 2K26",
    ariaLabelResults: "Voir les gagnant·es du concours Avirun 2K26",
  },

  concoursBanner: {
    eyebrowCountdown: "Jeu concours · Avirun 2K26",
    eyebrowResults: "🏆 Jeu concours · résultats",
    titleCountdownPrefix: "",
    titleCountdownHighlight: "5 analyses de foulée",
    titleCountdownSuffix: " à gagner",
    titleResultsPrefix: "Les ",
    titleResultsHighlight: "5 gagnant·es",
    titleResultsSuffix: " sont annoncé·es",
    bodyCountdown:
      "Avec Julien Blamont, kinésithérapeute formé à La Clinique du Coureur. Tentez votre chance avant le 24 mai à 15h.",
    bodyResults:
      "Tirage au sort effectué le 24 mai 2026, certifié via @app_sorteos_ok. Bravo aux 5 gagnant·es de l'analyse de foulée avec Julien Blamont !",
    ctaCountdown: "Je participe →",
    ctaResults: "Voir les gagnant·es →",
  },

  concoursPage: {
    metaTitle: "Résultats du jeu concours Avirun 2K26 — Mugitu Biarritz",
    metaDescription:
      "Découvrez les 5 gagnant·es du jeu concours Mugitu × Avirun 2K26 qui remportent une analyse de foulée avec Julien Blamont, kinésithérapeute formé à La Clinique du Coureur. Tirage au sort certifié.",
    ogTitle: "Résultats du concours Avirun 2K26 — 5 gagnant·es annoncé·es",
    ogDescription:
      "Les 5 gagnant·es du concours Mugitu × Avirun 2K26 ont été tiré·es au sort. Découvrez qui remporte une analyse de foulée avec Julien Blamont.",
    heroEyebrow: "Jeu concours · Avirun 2K26",
    heroTitleHighlight: "5 analyses de foulée",
    heroTitleRest: "à gagner avec Julien Blamont",
    heroBody:
      "Kinésithérapeute formé à La Clinique du Coureur, Julien décortique votre foulée pour courir plus efficacement et limiter les blessures. À l'occasion de l'Avirun 2K26, Mugitu offre <strong>5 analyses complètes</strong> au cabinet de Biarritz (valeur unitaire 70 €).",
    heroDeadlineNote: "Tirage au sort effectué le 24 mai 2026 à 15h00 (heure de Paris)",
    heroCtaWinners: "Voir les gagnant·es",
    heroCtaPost: "Voir le post Instagram",
    countdownEnded:
      "Le concours est terminé. Merci à toutes et tous pour votre participation !",
    countdownDaysLabel: "Jours",
    countdownHoursLabel: "Heures",
    countdownMinutesLabel: "Minutes",
    countdownSecondsLabel: "Secondes",
    countdownAriaLabel: "Temps restant avant la fin du concours",
    posterEyebrow: "Le visuel du concours",
    posterTitle: "Souvenir du concours",
    posterAlt:
      "Visuel officiel du jeu concours Avirun 2K26 — 5 analyses de foulée à gagner",
    posterCaption: "Le post Instagram d'origine reste accessible pour archive.",
    posterAria: "Voir le post du concours sur Instagram",
    stepsEyebrow: "Pour mémoire",
    stepsTitle: "Comment il fallait participer",
    stepsLead:
      "Trois étapes à réaliser sur Instagram avant le 24 mai 2026 à 15h00. Le tirage au sort a maintenant été effectué.",
    step1Title: "S'abonner aux deux comptes",
    step1BodyPrefix: "Suivre ",
    step1BodyAnd: " et ",
    step1BodySuffix: " sur Instagram.",
    step2Title: "Liker le post et le partager en story",
    step2BodyPrefix: "Aimer ",
    step2BodyLinkLabel: "le post du concours",
    step2BodySuffix: " et le partager en story sur son compte Instagram.",
    step3Title: "Commenter en taguant deux personnes",
    step3Body:
      "Sous le post, ajouter un commentaire en taguant <strong>deux ami·es</strong> que vous voudriez emmener courir à Biarritz. Chaque commentaire = une participation.",
    stepsBottomCta: "Voir les gagnant·es →",
    dotationEyebrow: "La dotation",
    dotationTitleHighlight: "5 analyses de foulée",
    dotationTitleRest: " complètes",
    dotationTitleSub: "Valeur unitaire 70 € · à Mugitu Biarritz",
    dotationBody1:
      "Filmée en cabinet sur tapis de course, l'analyse de foulée permet de comprendre comment votre corps absorbe les chocs, propulse et se coordonne pendant la course.",
    dotationBody2:
      "Julien vous transmet ensuite des recommandations personnalisées : exercices, drills, ajustements techniques — pour progresser sans vous blesser.",
    julienCardTitle: "Julien Blamont",
    julienCardBullets: [
      "Kinésithérapeute du sport au cabinet Mugitu Biarritz",
      "Formé à La Clinique du Coureur (Blaise Dubois)",
      "Suivi de coureurs amateurs et confirmés",
    ],
    julienCardCta: "Prendre RDV avec Julien sur Doctolib →",
    ruleTitle: "Règlement du jeu",
    ruleOrganizerLabel: "Organisateur :",
    ruleOrganizer: "Mugitu Biarritz, 3 avenue Kléber, 64200 Biarritz.",
    ruleDurationLabel: "Durée :",
    ruleDuration: "jusqu'au dimanche 24 mai 2026 à 15h00 (heure de Paris).",
    ruleConditionsLabel: "Conditions de participation :",
    ruleConditions:
      "être majeur ou disposer de l'accord d'un représentant légal, résider en France métropolitaine, suivre @mugitu_biarritz et @jublamont_lacliniqueducoureur sur Instagram, liker et partager le post du concours en story, et commenter le post en taguant deux personnes.",
    ruleDotationLabel: "Dotation :",
    ruleDotation:
      "cinq (5) analyses de foulée complètes au cabinet Mugitu Biarritz avec Julien Blamont, d'une valeur unitaire de 70 €, rendez-vous fixé d'un commun accord, non échangeables, non cessibles, non remboursables.",
    ruleDrawLabel: "Tirage au sort :",
    ruleDraw:
      "cinq (5) gagnant·es ont été tiré·es au sort parmi les participations valides et contacté·es par message privé sur Instagram dans les 7 jours suivant la clôture.",
    rulePrivacyLabel: "Données personnelles :",
    rulePrivacy:
      "ce jeu est indépendant d'Instagram, qui ne peut être tenu pour responsable. Aucune donnée n'est collectée par Mugitu en dehors du compte Instagram du ou de la gagnant·e, pour organiser le rendez-vous.",
  },

  winners: {
    eyebrow: "Concours terminé · Tirage au sort effectué",
    title: "Et les gagnant·es sont…",
    body:
      "Bravo à vous cinq ! Vous recevrez un message privé sur Instagram depuis @mugitu_biarritz pour caler votre rendez-vous d'analyse de foulée avec Julien Blamont.",
    seeProfile: "Voir le profil Instagram",
    certifLabel: "Tirage au sort certifié",
    certifBodyPrefix: "Effectué le 24 mai 2026 via ",
    certifBodySeparator: " — ",
    certifCodePrefix: "Code ",
  },
};

export default fr;
