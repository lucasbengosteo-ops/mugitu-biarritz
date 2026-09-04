/**
 * Vue structurée des fiches praticien, EXTRAITE du HTML de `fiches.ts`.
 *
 * Sert à pré-remplir le back-office. La base ne stocke que ce qu'on modifie,
 * et une fiche non retouchée continue de rendre son HTML d'origine : la
 * régénération — donc l'éventuelle régression — n'a lieu qu'à la première
 * retouche, section par section.
 *
 * Fichier généré — le régénérer plutôt que l'éditer à la main.
 */

/** `groupe` sépare plusieurs listes dans la même section (« Autres formations »). */
export type Formation = { annee: string; intitule: string; groupe: string };
export type Tarif = { titre: string; prix: string; mention: string; texte: string; lien: string };
export type Coordonnees = { tel?: string; email?: string; instagram?: string; linkedin?: string; site?: string };

export type FicheData = {
  contact: Coordonnees;
  specialites: string[];
  langues: string[];
  formations: Formation[];
  /**
   * `false` quand la section contient un bloc que ce modèle ne sait pas
   * représenter — chez Ophélie Hubert, une liste de pastilles « Actes
   * pratiqués ». L'édition est alors refusée : mieux vaut une section
   * verrouillée qu'un contenu effacé sans que personne s'en aperçoive.
   */
  formationsComplet: boolean;
  tarifs: Tarif[];
  /** Le titre varie : « Tarifs » ici, « Types de consultation » ailleurs. */
  tarifsTitre: string;
  tarifsComplet: boolean;
};

export const FICHE_DATA: Record<string, FicheData> = {
  "baptiste-caparros": {
    "contact": {
      "instagram": "https://www.instagram.com/runwithbat/"
    },
    "specialites": [
      "Kinésithérapie du sport",
      "Trail & course à pied",
      "Coach École de Trail"
    ],
    "langues": [],
    "formations": [
      {
        "annee": "2017",
        "intitule": "D.U. Préparation physique et réathlétisation — Université d’Évry-Val-d’Essonne",
        "groupe": ""
      },
      {
        "annee": "2015",
        "intitule": "Diplôme d’État de masseur-kinésithérapeute (MKDE) — École Boris Dolto EFOM, Paris",
        "groupe": ""
      },
      {
        "annee": "2022",
        "intitule": "Expert 2.0 — La Clinique du Coureur",
        "groupe": "Autres formations"
      },
      {
        "annee": "2021",
        "intitule": "Cours 1.8 Nutrition et micronutrition sportives pour les sports d’endurance — La Clinique du Coureur",
        "groupe": "Autres formations"
      },
      {
        "annee": "2021",
        "intitule": "Cours 1.3 Prise en charge du pied du coureur — La Clinique du Coureur",
        "groupe": "Autres formations"
      },
      {
        "annee": "2021",
        "intitule": "Cours 1.2 Exercices thérapeutiques en course à pied — La Clinique du Coureur",
        "groupe": "Autres formations"
      },
      {
        "annee": "2021",
        "intitule": "Cours 1.1 Diagnostics et traitements des blessures du coureur, aspects pratiques — La Clinique du Coureur",
        "groupe": "Autres formations"
      },
      {
        "annee": "2020",
        "intitule": "Cours 1.10 PEACE & LOVE, prise en charge des blessures aiguës — La Clinique du Coureur",
        "groupe": "Autres formations"
      },
      {
        "annee": "2018",
        "intitule": "Cours 1.7 Principes et planification d’entraînement — La Clinique du Coureur",
        "groupe": "Autres formations"
      },
      {
        "annee": "2017",
        "intitule": "Cours 1.0 Nouveautés dans la prévention des blessures en course à pied — La Clinique du Coureur",
        "groupe": "Autres formations"
      },
      {
        "annee": "2015",
        "intitule": "Certificat d’études complémentaires en kinésithérapie du sport (CECKS) — SFMKS",
        "groupe": "Autres formations"
      }
    ],
    "formationsComplet": true,
    "tarifs": [
      {
        "titre": "Séance de kinésithérapie",
        "prix": "16 à 25 €",
        "mention": "Sur prescription",
        "texte": "Rééducation active et thérapie manuelle, remboursée par l’Assurance maladie selon votre situation.",
        "lien": "https://www.doctolib.fr/masseur-kinesitherapeute/cambo-les-bains/baptiste-caparros"
      },
      {
        "titre": "Séance de kinésithérapie sans ordonnance",
        "prix": "30 €",
        "mention": "",
        "texte": "Accès direct, sans prescription médicale préalable.",
        "lien": "https://www.doctolib.fr/masseur-kinesitherapeute/cambo-les-bains/baptiste-caparros"
      },
      {
        "titre": "Bilan de course à pied",
        "prix": "50 €",
        "mention": "Évaluation, conseils, programme",
        "texte": "Analyse de votre foulée et de votre charge d’entraînement, avec des programmes adaptés à vos objectifs.",
        "lien": "https://www.doctolib.fr/masseur-kinesitherapeute/cambo-les-bains/baptiste-caparros"
      },
      {
        "titre": "Massage de récupération sportive + pressothérapie",
        "prix": "40 €",
        "mention": "20 min + 20 min",
        "texte": "Séance de récupération après compétition ou grosse charge d’entraînement.",
        "lien": "https://www.doctolib.fr/masseur-kinesitherapeute/cambo-les-bains/baptiste-caparros"
      }
    ],
    "tarifsTitre": "Tarifs",
    "tarifsComplet": true
  },
  "basile-carcassonne": {
    "contact": {},
    "specialites": [
      "Traumatologie",
      "infiltrations",
      "PRP",
      "mésothérapie"
    ],
    "langues": [
      "Français"
    ],
    "formations": [
      {
        "annee": "2025",
        "intitule": "C.E.S. Capacité de médecine et biologie du sport — Université Toulouse 3 Paul Sabatier",
        "groupe": ""
      },
      {
        "annee": "2024",
        "intitule": "D.I.U. Traumatologie du sport — Université Sorbonne Paris Nord",
        "groupe": ""
      },
      {
        "annee": "2021",
        "intitule": "D.E.S. Médecine générale — Université de Bordeaux",
        "groupe": ""
      }
    ],
    "formationsComplet": false,
    "tarifs": [],
    "tarifsTitre": "Tarifs",
    "tarifsComplet": true
  },
  "clement-cofourain": {
    "contact": {
      "email": "contact@mugitu-biarritz.fr"
    },
    "specialites": [
      "Athletic trainer",
      "Suivi du danseur",
      "Pédiatrie sportive"
    ],
    "langues": [
      "Français"
    ],
    "formations": [],
    "formationsComplet": true,
    "tarifs": [],
    "tarifsTitre": "Tarifs",
    "tarifsComplet": true
  },
  "hugo-daminato": {
    "contact": {
      "email": "hugo.daminato@gmail.com"
    },
    "specialites": [
      "Préparation physique",
      "Réathlétisation",
      "Prévention des blessures"
    ],
    "langues": [
      "Français",
      "Anglais",
      "Espagnol"
    ],
    "formations": [
      {
        "annee": "2024",
        "intitule": "Certificat Fédéral Rugby à 7",
        "groupe": ""
      },
      {
        "annee": "2023",
        "intitule": "DEJEPS Rugby à XV",
        "groupe": ""
      },
      {
        "annee": "2021",
        "intitule": "Master STAPS EOPS — Entraînement & Optimisation de la Performance",
        "groupe": ""
      },
      {
        "annee": "2019",
        "intitule": "BNSSA",
        "groupe": ""
      },
      {
        "annee": "2019",
        "intitule": "PSE2 — Premiers Secours en Équipe",
        "groupe": ""
      }
    ],
    "formationsComplet": true,
    "tarifs": [],
    "tarifsTitre": "Tarifs",
    "tarifsComplet": true
  },
  "ihintza-larralde": {
    "contact": {
      "instagram": "https://www.instagram.com/ihintza.diet/"
    },
    "specialites": [
      "Nutrition du sport",
      "Nutrition de l’endurance",
      "Bilan nutritionnel"
    ],
    "langues": [
      "Français",
      "Euskara"
    ],
    "formations": [
      {
        "annee": "2026",
        "intitule": "Formation Nutrition du sportif — Professions de santé et du sport",
        "groupe": ""
      },
      {
        "annee": "2026",
        "intitule": "Éducation Thérapeutique du Patient (ETP)",
        "groupe": ""
      },
      {
        "annee": "2025",
        "intitule": "BTS Diététique",
        "groupe": ""
      }
    ],
    "formationsComplet": true,
    "tarifs": [],
    "tarifsTitre": "Tarifs",
    "tarifsComplet": true
  },
  "jean-baptiste-colombie": {
    "contact": {
      "email": "jbc.kine@gmail.com",
      "instagram": "https://www.instagram.com/jb_colombie/"
    },
    "specialites": [
      "Kiné du danseur",
      "Préparateur physique",
      "Allyane®"
    ],
    "langues": [
      "Français"
    ],
    "formations": [
      {
        "annee": "2007",
        "intitule": "Diplôme d’État de masseur-kinésithérapeute (MKDE) — ENKRE, Saint-Maurice",
        "groupe": ""
      },
      {
        "annee": "2022",
        "intitule": "Hanche du danseur — Susan Mayes, EBP",
        "groupe": "Autres formations"
      },
      {
        "annee": "2022",
        "intitule": "Cheville du danseur — Susan Mayes, EBP",
        "groupe": "Autres formations"
      },
      {
        "annee": "2019",
        "intitule": "Reprogrammation neuromotrice — Allyane",
        "groupe": "Autres formations"
      },
      {
        "annee": "2019",
        "intitule": "Dry needling, trigger points — David G. Simons Academy",
        "groupe": "Autres formations"
      },
      {
        "annee": "2017",
        "intitule": "Méthode CGE, concept global de l’épaule — TM Institute",
        "groupe": "Autres formations"
      },
      {
        "annee": "2014",
        "intitule": "Préparation physique et réathlétisation — SFMKS",
        "groupe": "Autres formations"
      },
      {
        "annee": "2014",
        "intitule": "Physio tape — K-Tapping",
        "groupe": "Autres formations"
      },
      {
        "annee": "2013",
        "intitule": "Méthode Busquet des chaînes physiologiques — Busquet",
        "groupe": "Autres formations"
      },
      {
        "annee": "2010",
        "intitule": "Thérapie intégrative du sport — Kinésport",
        "groupe": "Autres formations"
      },
      {
        "annee": "2009",
        "intitule": "Kinésithérapie du sport — Kinésport",
        "groupe": "Autres formations"
      }
    ],
    "formationsComplet": false,
    "tarifs": [],
    "tarifsTitre": "Tarifs",
    "tarifsComplet": true
  },
  "johanna-marmiesse": {
    "contact": {
      "tel": "+33608370220",
      "email": "johannamarmiesse@gmail.com",
      "instagram": "https://www.instagram.com/ma.psydiet/"
    },
    "specialites": [
      "Nutrition du sport",
      "Nutrition de l’endurance",
      "Préparation course / marathon"
    ],
    "langues": [
      "Français"
    ],
    "formations": [],
    "formationsComplet": true,
    "tarifs": [],
    "tarifsTitre": "Tarifs",
    "tarifsComplet": true
  },
  "julien-blamont": {
    "contact": {},
    "specialites": [
      "Kinésithérapie du sport",
      "La Clinique du Coureur®",
      "Analyse de foulée"
    ],
    "langues": [
      "Français"
    ],
    "formations": [
      {
        "annee": "2020",
        "intitule": "D.U. Ostéopathie — Collège Ostéopathique du Pays Basque",
        "groupe": ""
      },
      {
        "annee": "2025",
        "intitule": "Formation La Clinique du Coureur",
        "groupe": "Autres formations"
      }
    ],
    "formationsComplet": false,
    "tarifs": [
      {
        "titre": "Première consultation d’ostéopathie",
        "prix": "65 €",
        "mention": "Adulte et sportif",
        "texte": "Bilan complet, traitement manuel et conseils adaptés à votre pratique. Même tarif pour la consultation sportif.",
        "lien": "https://www.doctolib.fr/osteopathe/biarritz/julien-blamont"
      },
      {
        "titre": "Consultation de suivi d’ostéopathie",
        "prix": "65 €",
        "mention": "Adulte et sportif",
        "texte": "Séance de suivi pour ajuster le traitement et accompagner la reprise.",
        "lien": "https://www.doctolib.fr/osteopathe/biarritz/julien-blamont"
      },
      {
        "titre": "Analyse de foulée",
        "prix": "70 €",
        "mention": "Course à pied",
        "texte": "Analyse vidéo de votre foulée, cadence et appuis, avec des pistes concrètes de correction.",
        "lien": "https://www.doctolib.fr/osteopathe/biarritz/julien-blamont"
      },
      {
        "titre": "Actes de kinésithérapie",
        "prix": "Conventionné",
        "mention": "Sur prescription",
        "texte": "Séances de kinésithérapie remboursées par l’Assurance maladie selon votre situation.",
        "lien": "https://www.doctolib.fr/osteopathe/biarritz/julien-blamont"
      }
    ],
    "tarifsTitre": "Types de consultation",
    "tarifsComplet": true
  },
  "lucas-bengoechea": {
    "contact": {
      "tel": "+33636922653",
      "email": "lucas@mugitu-biarritz.fr",
      "instagram": "https://www.instagram.com/lebaskosteo/"
    },
    "specialites": [],
    "langues": [
      "Français",
      "anglais",
      "espagnol"
    ],
    "formations": [
      {
        "annee": "2021",
        "intitule": "Diplôme d’Ostéopathe (D.O.) — Collège Ostéopathique du Pays Basque",
        "groupe": ""
      },
      {
        "annee": "2025",
        "intitule": "Prévention des risques suicidaires — Association SPS",
        "groupe": "Autres formations"
      },
      {
        "annee": "2025",
        "intitule": "Prise en charge de l’épaule — Agence EBP",
        "groupe": "Autres formations"
      },
      {
        "annee": "2024",
        "intitule": "Neuroscience de la douleur — Laurent Fabre",
        "groupe": "Autres formations"
      },
      {
        "annee": "2024",
        "intitule": "MOOC Santé environnementale — Université de Bordeaux",
        "groupe": "Autres formations"
      },
      {
        "annee": "2024",
        "intitule": "Le pied du coureur — Matthieu Bandres-Gonzales",
        "groupe": "Autres formations"
      },
      {
        "annee": "2024",
        "intitule": "L’accompagnement du coureur — Matthieu Bandres-Gonzales",
        "groupe": "Autres formations"
      },
      {
        "annee": "2024",
        "intitule": "Formation bruxisme — Isabelle Hue",
        "groupe": "Autres formations"
      },
      {
        "annee": "2023",
        "intitule": "Méthode Allyane — Académie Allyane",
        "groupe": "Autres formations"
      },
      {
        "annee": "2023",
        "intitule": "Initiation à la nutrition ayurvédique — AVP Ayurvedic Hospital, Coimbatore (Inde)",
        "groupe": "Autres formations"
      },
      {
        "annee": "2022",
        "intitule": "Thérapie des ventouses — OMT Training",
        "groupe": "Autres formations"
      },
      {
        "annee": "2022",
        "intitule": "Techniques structurelles anglaises — David Tatton",
        "groupe": "Autres formations"
      }
    ],
    "formationsComplet": true,
    "tarifs": [],
    "tarifsTitre": "Tarifs",
    "tarifsComplet": true
  },
  "mailys-bersier": {
    "contact": {},
    "specialites": [
      "Psychologie clinique",
      "EMDR",
      "Psychotraumatologie"
    ],
    "langues": [
      "Français"
    ],
    "formations": [
      {
        "annee": "2026",
        "intitule": "Certification de praticienne EMDR — Niveau I (ATHMA)",
        "groupe": ""
      },
      {
        "annee": "2019",
        "intitule": "Master Psychologie — parcours Ingénieries et recherches psychosociales, Université de Bordeaux (titre de Psychologue)",
        "groupe": ""
      }
    ],
    "formationsComplet": false,
    "tarifs": [],
    "tarifsTitre": "Tarifs",
    "tarifsComplet": true
  },
  "marie-boura": {
    "contact": {
      "instagram": "https://www.instagram.com/mb_psydusport/"
    },
    "specialites": [
      "Préparation mentale",
      "Gestion du stress et des émotions",
      "Confiance en soi"
    ],
    "langues": [
      "Français",
      "Anglais"
    ],
    "formations": [
      {
        "annee": "—",
        "intitule": "Master 2 Psychologie clinique — Université Paul Valéry Montpellier III",
        "groupe": ""
      },
      {
        "annee": "2019",
        "intitule": "Formation Préparation mentale — Trans Faire",
        "groupe": ""
      }
    ],
    "formationsComplet": true,
    "tarifs": [],
    "tarifsTitre": "Tarifs",
    "tarifsComplet": true
  },
  "marine-vignaud": {
    "contact": {
      "instagram": "https://www.instagram.com/optimouv.therapie/"
    },
    "specialites": [
      "Ostéopathie du sport",
      "Préparation physique",
      "Course à pied"
    ],
    "langues": [
      "Français"
    ],
    "formations": [
      {
        "annee": "2025",
        "intitule": "Diplôme d’Ostéopathe (D.O.) — Institut Toulousain d’Ostéopathie",
        "groupe": ""
      },
      {
        "annee": "2025",
        "intitule": "Techniques structurelles en minimums leviers et composantes multiples : rachis et bassin — CFPCO",
        "groupe": ""
      },
      {
        "annee": "2020",
        "intitule": "Master STAPS Entraînement et optimisation de la performance sportive (EOPS), parcours EPPMMS — Université de Pau et des Pays de l’Adour",
        "groupe": ""
      },
      {
        "annee": "2018",
        "intitule": "Licence STAPS Entraînement sportif — Université de Bordeaux",
        "groupe": ""
      }
    ],
    "formationsComplet": false,
    "tarifs": [],
    "tarifsTitre": "Tarifs",
    "tarifsComplet": true
  },
  "ophelie-hubert": {
    "contact": {},
    "specialites": [
      "Bilan podologique",
      "Bilan postural",
      "Posturologie"
    ],
    "langues": [],
    "formations": [
      {
        "annee": "2019",
        "intitule": "Diplôme d’État de pédicure-podologue — IFPP, Bordeaux",
        "groupe": ""
      },
      {
        "annee": "2024",
        "intitule": "Diplôme Posturologie-posturopodie — Connaissance et évolution",
        "groupe": "Autres formations"
      },
      {
        "annee": "2024",
        "intitule": "Course au féminin — La Clinique du Coureur",
        "groupe": "Autres formations"
      },
      {
        "annee": "2023",
        "intitule": "Traitements des blessures en course à pied — La Clinique du Coureur",
        "groupe": "Autres formations"
      },
      {
        "annee": "2023",
        "intitule": "Principes et planification d’entraînement — La Clinique du Coureur",
        "groupe": "Autres formations"
      },
      {
        "annee": "2023",
        "intitule": "Nutrition sportive, de la performance à la désadaptation — La Clinique du Coureur",
        "groupe": "Autres formations"
      },
      {
        "annee": "2023",
        "intitule": "École de trail — Running éducation",
        "groupe": "Autres formations"
      },
      {
        "annee": "2022",
        "intitule": "Taping — Connaissance et évolution",
        "groupe": "Autres formations"
      },
      {
        "annee": "2021",
        "intitule": "Prévention des blessures en course à pied — La Clinique du Coureur",
        "groupe": "Autres formations"
      },
      {
        "annee": "2020",
        "intitule": "Stabilométrie — Atlantic Posturo",
        "groupe": "Autres formations"
      },
      {
        "annee": "2020",
        "intitule": "Posturologie, cursus de 4 ans — Connaissance et évolution",
        "groupe": "Autres formations"
      }
    ],
    "formationsComplet": false,
    "tarifs": [
      {
        "titre": "Soin de pédicurie complet",
        "prix": "42 €",
        "mention": "",
        "texte": "Soin complet du pied : ongles, cors, callosités.",
        "lien": "https://www.doctolib.fr/pedicure-podologue/biarritz/ophelie-hubert"
      },
      {
        "titre": "Soin sur motif seul",
        "prix": "37 €",
        "mention": "",
        "texte": "Ongle incarné, cor, verrue ou autre motif isolé.",
        "lien": "https://www.doctolib.fr/pedicure-podologue/biarritz/ophelie-hubert"
      },
      {
        "titre": "Bilan podologique et postural",
        "prix": "65 €",
        "mention": "",
        "texte": "Bilan complet, avec plateformes de force en support de diagnostic.",
        "lien": "https://www.doctolib.fr/pedicure-podologue/biarritz/ophelie-hubert"
      },
      {
        "titre": "Bilan du coureur",
        "prix": "65 €",
        "mention": "",
        "texte": "Analyse de la course à pied sur tapis, pieds nus et chaussé, et conseils de chaussage.",
        "lien": "https://www.doctolib.fr/pedicure-podologue/biarritz/ophelie-hubert"
      },
      {
        "titre": "Orthèses plantaires sur mesure",
        "prix": "95 à 105 €",
        "mention": "",
        "texte": "Semelles classiques, thermoformées ou posturales.",
        "lien": "https://www.doctolib.fr/pedicure-podologue/biarritz/ophelie-hubert"
      },
      {
        "titre": "Orthoplastie / orthonyxie",
        "prix": "20 à 40 €",
        "mention": "",
        "texte": "Petits appareillages pour corriger un orteil ou un ongle.",
        "lien": "https://www.doctolib.fr/pedicure-podologue/biarritz/ophelie-hubert"
      },
      {
        "titre": "Verrues plantaires",
        "prix": "20 €",
        "mention": "",
        "texte": "Traitement des verrues plantaires.",
        "lien": "https://www.doctolib.fr/pedicure-podologue/biarritz/ophelie-hubert"
      }
    ],
    "tarifsTitre": "Tarifs",
    "tarifsComplet": true
  }
};
