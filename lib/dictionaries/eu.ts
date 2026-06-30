import type fr from "./fr";

/**
 * Euskara — dictionnaire basque.
 *
 * Traduction validée par des locutrices natives (Aintzane & Lutxi),
 * cf. Google Doc partagé par Lucas. La structure doit rester strictement
 * identique à fr.ts (TypeScript le vérifie).
 *
 * NB : les sections concours (concoursStrip, concoursBanner, concoursPage,
 * winners) ne sont PAS couvertes par le doc et restent en traduction Claude
 * non validée — à relire ultérieurement.
 */
const eu: typeof fr = {
  meta: {
    locale: "Euskara",
    localeShort: "EU",
    altLocale: "Français",
    altLocaleShort: "FR",
    switchAriaLabel: "Frantsesera aldatu",
  },

  nav: {
    mugitu: "Mugitu",
    services: "Zerbitzuak",
    team: "Taldea",
    app: "App",
    contest: "Lehiaketa",
    contact: "Harremana",
    bookAppointment: "Hitzorduak",
    menuLabel: "Menua",
  },

  hero: {
    title: "Mugitu — Mugimenduaren etxea",
    subtitle: "Kirol errendimendu eta arta gunea Miarritzen.",
    disciplines:
      "Kiroleko kinesiterapeutak, medikuak, osteopatak, psikologoak, gorputz eta buruzko prestatzaileak.",
    ctaBook: "Hitzordu bat hartu",
    ctaTeam: "Taldea ezagutu",
    stats: [
      { value: "9", label: "Aditu" },
      { value: "3", label: "Diziplina" },
      { value: "360°", label: "Kirolariaren segipena" },
    ],
    scrollHint: "Beherago",
  },

  histoire: {
    eyebrow: "Etimologia eta historia",
    title: "Zergatik Mugitu?",
    word: "mugitu",
    wordCaption: "Euskara · aditza",
    definitionLabel: "Definizioa",
    definitionShort: "« Mugitu, higitu, kantitu »",
    definitionLong:
      "Euskaraz mugitu — mugimendua, mugitzeko akzioa. Mugitzea, Euskal Herriko kulturan barneratua den sustrai azkar bat da, kirol, indar eta noberaren gainditze lurralde batean.",
    cards: [
      {
        emoji: "🏔️",
        title: "Tokiko egitura",
        body: "Miarritzen sortua, Euskal Herriko kostaldean — surf, errugbi, trail, dantza eta pilota lurraldea. Lurraldeko nortasun kirolariarekin bat egiten duen izena.",
      },
      {
        emoji: "🤝",
        title: "Ikuspegi bateratua",
        body: "Proiektua problematika baten ondorioz sortu da: zauritua den kirolari batek ber lekuan eta dozier batekin baizik elkar lanean ari diren kinesiterapeuta, mediku eta artatzaileak merezi ditu.",
      },
      {
        emoji: "🎯",
        title: "Mugimenduaren etxea",
        body: "Arta gune bat baino gehiago, etxe bat. Kirolariek eta artatzaileek ber filosofia partekatzen duten gunea: mugimendua beti posible, iraunkorra eta eraginkorra izan dadin.",
      },
    ],
  },

  services: {
    eyebrow: "Proposatzen duguna",
    title: "Gure zerbitzuak",
    items: [
      {
        key: "kine",
        title: "Kiroleko kinesiterapia",
        description:
          "Berreziketa funtzionala eta segipen pertsonalizatua maila guztietako kirolarientzat. Muskulu-, tendoi- eta artikulazio-zaurien artatzea.",
      },
      {
        key: "medecine",
        title: "Kiroleko medikuntza",
        description:
          "Kontsulta mediko berezitua, kirolariaren osasun azterketa bilana, ziurtagiri medikoak eta kirol errendimenduaren segipena. Traumatologia eta prebentzio medikuntza.",
      },
      {
        key: "osteo",
        title: "Kiroleko osteopatia",
        description:
          "Ikuspegi orokorra eta eskuzkoa, mugikortasuna, indarberritze eta errendimendua hobetzeko. Berreziketa-zainketen osagarri ezin hobea.",
      },
      {
        key: "prepa",
        title: "Gorputz eta buru prestatzea",
        description:
          "Buruaren eta fisikoaren prestakuntza baita kirolera itzultzeko bakarkako programa bereziak. Athletic training, zaurien prebentzioa eta gaitasun atletikoen optimizazioa.",
      },
    ],
  },

  team: {
    eyebrow: "Diziplina anitzeko",
    title: "Gure taldea",
    bookCta: "Doctolib bidez hitzordua hartu",
    members: {
      lucas: {
        role: "Kirol osteoterapeuta",
        bio: "Kirolarien zaintzan espezializatutako osteopata. Allyane® terapian praktikatzaile ziurtatua.",
        specialties: [
          "Kiroleko osteopatia",
          "Allyane® terapia",
          "Korrikalariaren segipena",
          "Endometriosia",
        ],
      },
      basile: {
        role: "Kirol medikua",
        bio: "Goi-mailako kirolarien segipena egiten duen kirol medikua. Kirol traumatologian, mesoterapian eta PRP infiltrazioetan espezializatua.",
        specialties: [
          "Goi-mailako kirolarien segipena",
          "Kirol traumatologia",
          "Mesoterapia · PRP",
        ],
      },
      clement: {
        role: "Kirol kinesiterapeuta",
        bio: "Kirol kinesiterapeuta eta athletic trainer. Haur kirolarien eta dantzarien zaintzan espezializatua.",
        specialties: ["Athletic trainer", "Haur kirolaria", "Dantzariaren segipena"],
      },
      julien: {
        role: "Kirol kinesiterapeuta",
        bio: "La Clinique du Coureur erakundean prestatutako kirol kinesiterapeuta. Lasterkariaren segipenean, urrats analisian eta lasterketa-zaurien prebentzioan espezializatua.",
        specialties: [
          "La Clinique du Coureur",
          "Urrats analisia",
          "Lasterkariaren segipena",
          "Zaurien prebentzioa",
        ],
      },
      jb: {
        role: "Kirol kinesiterapeuta",
        bio: "Kirol kinesiterapeuta eta prestatzaile fisikoa. Allyane® praktikatzailea, dantzariaren espezialista.",
        specialties: [
          "Allyane® terapia",
          "Dry needling",
          "Berrathletizazioa",
          "Dantzariaren segipena",
        ],
      },
    },
  },

  allyane: {
    eyebrow: "Metodo egiaztatua",
    title: "Allyane® terapia",
    description:
      "Allyane® terapia inhibizio muskular post-traumatikoak baztertzeko neuromotrizitatea ber programatzearen inguruko metodo bat da. Emaitzak saio 1 eta 3 artean ikusgarriak.",
    indicationsLabel: "Adierazpenak",
    indications: [
      "Kirurgia lotailuak",
      "Kirolari lotutako traumak",
      "Min kronikoak",
      "Ebakuntza geroko berreskuratzea",
    ],
    cta: "Gehiago jakin",
    certifiedLabel: "Sendagile ziurtatuak",
  },

  cliniqueCoureur: {
    eyebrow: "Metodo egiaztatua",
    titleSr: "La Clinique du Coureur",
    subtitle: "Lasterkariaren segipenaren erreferentzia internazionala",
    description:
      "Blaise Dubois (Quebec) sortutako metodoa, trebaketen kargaren programazio zorrotza eta proba zientifikoan oinarritua. Julien Blamont, kirol kinesiterapeuta Miarritzeko « Mugitu » zentroko <strong>sendagile ziurtatua</strong> da eta lasterkazaleak eta goi-mailako lasterkariak laguntzen ditu.",
    expertisesLabel: "Gaitasunak",
    expertises: [
      "Urrats analisia",
      "Lasterkariaren bilana",
      "Zauria eta geroko itzultzea korrikara",
      "Zaurien prebentzioa",
      "Kargaren programazioa",
    ],
    ctaBook: "Hitzordu bat hartu Julienekin",
    ctaLearn: "Gehiago jakin",
    photoCaptionName: "Julien Blamont",
    photoCaptionRole: "Kirol kinesiterapeuta · Mugitu Miarritze",
    certifiedBadge: "La Clinique du Coureur-eko sendagile ziurtatua",
  },

  appMugitu: {
    eyebrow: "Sendagileentako tresnak",
    title: "Desberdintasuna egiten duen segipena",
    descriptionLead: "app.mugitu.pro",
    descriptionRest:
      " — Kiroleko sendagileentzat sortutako pazienteen segipen plataforma. Dozierrak, saioak, bilanak: behar den guztia kalitate oneko laguntza eskaintzeko.",
    chips: [
      "HDS ostatzea",
      "Flow kontsultazioa",
      "Segipenaren roadmap",
      "Allyane® terapia",
      "Sendagileen arteko mezularitza",
      "Bilanak & analisiak",
    ],
    features: [
      {
        key: "sessions",
        title: "Saioen segipena",
        description:
          "Historia osoa, kontsulta-oharrak eta bilakaera klinikoa klik batean.",
      },
      {
        key: "performance",
        title: "Errendimenduen monitoringa",
        description:
          "Aginte-koadro pertsonalizatuak kirolari bakoitzaren aurrerapena jarraitzeko.",
      },
      {
        key: "dossier",
        title: "Pazienteen dozier digitala",
        description: "Agiriak, azterketak eta errezetak zentralizatuak eta seguruak.",
      },
      {
        key: "coord",
        title: "Taldeen koordinazioa",
        description:
          "Partekatu dozierra kinesiterapeuta, mediku eta artatzailearen artean zaintza koordinaturako.",
      },
    ],
    ctaApp: "Aplikaziora iritsi",
    ctaDemo: "Erakuspen bat eskatu",
    mockupAlt: "app.mugitu.pro interfazea laptop eta mugikorrean",
    badgeHdsTitle: "HDS ostatzea",
    badgeHdsSub: "Osasun datu ziurtatuak",
    badgeFlowTitle: "Flow kontsultazioa",
    badgeFlowSub: "Pauso-pausoko bidea",
    badgeRoadmapTitle: "Segipenaren roadmap",
    badgeRoadmapSub: "Pazientearen bide osoaren ikuspegia",
    patientsCounter: "1785 paziente segituak",
  },

  andrew: {
    eyebrow: "Urrunetik segipena",
    titlePre: "Luzatu saioa honekin:",
    description:
      "Gure sendagileek birgaitze programak agintzen dituzte <strong>Andrew®</strong>-ren gainean, pazienteari bere etxetik lan egiten segitzen permititzen duen telefono aplikazioa — bideoekin, behatzearen segipenarekin baita sendagilearekin zuzenezko mezularitzarekin.",
    features: [
      {
        key: "video",
        title: "Ariketak bideoz",
        description:
          "Programa pertsonalizatuak aginduekin bideoz, beti eskuragarria telefono baten gainean.",
      },
      {
        key: "observance",
        title: "Behatzearen segipena",
        description:
          "Denboran bertan ikusi zure pazienteen atxikimendua haien birgaitze programari.",
      },
      {
        key: "reminders",
        title: "Berriz deitze automatikoak",
        description:
          "Jakinarazte argiak saioen arteko erregulartasuna mantentzeko.",
      },
      {
        key: "mobile",
        title: "Telefono aplikazioa",
        description:
          "iOS eta Android-etan eskuragarria. Pazienteak bere programa direktuki atxemaiten du bere telefono gainean.",
      },
    ],
    cta: "Andrew® deskubritu",
    ctaSub: "iOS eta Android-etan eskuragarri",
    observanceLabel: "Behaketa",
    observanceValue: "%87",
    activeProgramLabel: "Programa aktiboa",
    mockupAlt: "Andrew aplikazioa — gomendaturiko ariketak",
  },

  contact: {
    eyebrow: "Helbidea & hitzorduak",
    title: "Gugana nola heldu",
    addressLabel: "Helbidea",
    address: "3 Kléber etorbidea, 64200 Biarritz",
    emailLabel: "Mail",
    hoursLabel: "Ordutegia",
    hours: "Astelehenetik ostiralera: 8ak — 19ak",
    bookOnlineLabel: "Linean erreserbatu",
    orWrite: "Edo idatz iezaguzu",
    practitioners: {
      lucas: { name: "Lucas Bengoechea", role: "Kirol osteoterapeuta" },
      basile: { name: "Dr Basile Carcassonne", role: "Kirol medikua" },
      julien: { name: "Julien Blamont", role: "Kirol kinesiterapeuta" },
      jb: { name: "Jean-Baptiste Colombié", role: "Kirol kinesiterapeuta" },
    },
    mapTitle: "Mugitu Miarritze kokapena",
  },

  footer: {
    tagline: "Mugimenduaren etxea",
    address: "3 Kléber etorbidea, 64200 Biarritz",
    legalLinks: {
      mentions: "Lege-oharrak",
      privacy: "Pribatasun politika",
    },
    practitionerSpace: "Sendagileen espazioa →",
    copyright: "© 2026 Mugitu · 3 Kléber etorbidea, Biarritz",
  },

  concoursStrip: {
    countdownPrefix: "🏃",
    countdownTitle: "5 oin-pausoaren analisi",
    countdownSuffix: "irabazteko",
    countdownDeadline: "amaiera:",
    countdownCta: "Parte hartu →",
    resultsPrefix: "🏆",
    resultsTitle: "5 irabazleak",
    resultsBody: "Avirun lehiaketa: ",
    resultsBodyAfter: " iragarri dira",
    resultsCta: "Emaitzak ikusi →",
    ariaLabelCountdown: "Avirun 2K26 lehiaketa ikusi",
    ariaLabelResults: "Avirun 2K26 lehiaketako irabazleak ikusi",
  },

  concoursBanner: {
    eyebrowCountdown: "Lehiaketa · Avirun 2K26",
    eyebrowResults: "🏆 Lehiaketa · emaitzak",
    titleCountdownPrefix: "",
    titleCountdownHighlight: "5 oin-pausoaren analisi",
    titleCountdownSuffix: " irabazteko",
    titleResultsPrefix: "",
    titleResultsHighlight: "5 irabazleak",
    titleResultsSuffix: " iragarri dira",
    bodyCountdown:
      "Julien Blamontekin, La Clinique du Coureur-en prestatutako kinesiterapeuta. Saiatu zure zortea maiatzaren 24a baino lehen, 15:00etan.",
    bodyResults:
      "Zozketa 2026ko maiatzaren 24an egin zen, @app_sorteos_ok bidez ziurtatua. Zorionak Julien Blamontekin oin-pausoaren analisia irabazi duten 5 pertsonei!",
    ctaCountdown: "Parte hartzen dut →",
    ctaResults: "Irabazleak ikusi →",
  },

  concoursPage: {
    metaTitle: "Avirun 2K26 lehiaketaren emaitzak — Mugitu Biarritz",
    metaDescription:
      "Ezagutu Mugitu × Avirun 2K26 lehiaketako 5 irabazleak. Julien Blamontekin oin-pausoaren analisi bat irabazi dute, La Clinique du Coureur-en prestatutako kinesiterapeuta. Ziurtatutako zozketa.",
    ogTitle: "Avirun 2K26 lehiaketaren emaitzak — 5 irabazle iragarriak",
    ogDescription:
      "Mugitu × Avirun 2K26 lehiaketako 5 irabazleak zozketatu dira. Ikusi nork irabazi duen oin-pausoaren analisi bat Julien Blamontekin.",
    heroEyebrow: "Lehiaketa · Avirun 2K26",
    heroTitleHighlight: "5 oin-pausoaren analisi",
    heroTitleRest: "irabazteko Julien Blamontekin",
    heroBody:
      "La Clinique du Coureur-en prestatutako kinesiterapeuta, Julienek zure oin-pausoa aztertzen du eraginkortasunez korritzeko eta zauriak saihesteko. Avirun 2K26 dela eta, Mugituk <strong>5 analisi oso</strong> eskaintzen ditu Biarritzeko kontsultan (unitate balioa: 70 €).",
    heroDeadlineNote:
      "Zozketa 2026ko maiatzaren 24an egin zen, 15:00etan (Paris ordua)",
    heroCtaWinners: "Irabazleak ikusi",
    heroCtaPost: "Instagrameko argitalpena ikusi",
    countdownEnded:
      "Lehiaketa amaitu da. Eskerrik asko denoi parte hartzeagatik!",
    countdownDaysLabel: "Egunak",
    countdownHoursLabel: "Orduak",
    countdownMinutesLabel: "Minutuak",
    countdownSecondsLabel: "Segundoak",
    countdownAriaLabel: "Lehiaketa amaitzeko geratzen den denbora",
    posterEyebrow: "Lehiaketaren irudia",
    posterTitle: "Lehiaketaren oroigarria",
    posterAlt:
      "Avirun 2K26 lehiaketaren irudi ofiziala — 5 oin-pausoaren analisi irabazteko",
    posterCaption:
      "Jatorrizko Instagrameko argitalpena artxibo gisa eskuragarri dago.",
    posterAria: "Lehiaketaren argitalpena Instagramen ikusi",
    stepsEyebrow: "Oroitzeko",
    stepsTitle: "Nola parte hartu behar zen",
    stepsLead:
      "Hiru urrats Instagramen, 2026ko maiatzaren 24a baino lehen, 15:00etan. Zozketa dagoeneko egin da.",
    step1Title: "Bi kontuetara harpidetu",
    step1BodyPrefix: "Jarraitu ",
    step1BodyAnd: " eta ",
    step1BodySuffix: " Instagramen.",
    step2Title: "Argitalpena 'like' eman eta story-an partekatu",
    step2BodyPrefix: "'Like' eman ",
    step2BodyLinkLabel: "lehiaketako argitalpenari",
    step2BodySuffix: " eta partekatu zure Instagrameko story-an.",
    step3Title: "Iruzkindu bi pertsona etiketatuz",
    step3Body:
      "Argitalpenaren azpian, iruzkin bat utzi <strong>bi lagun</strong> etiketatuz, Biarritzera korrika egitera eramango zenituzkeen pertsonak. Iruzkin bakoitza = parte-hartze bat.",
    stepsBottomCta: "Irabazleak ikusi →",
    dotationEyebrow: "Saria",
    dotationTitleHighlight: "5 oin-pausoaren analisi",
    dotationTitleRest: " oso",
    dotationTitleSub: "Unitate balioa: 70 € · Mugitu Biarritzen",
    dotationBody1:
      "Kontsultan korritze-tapizean filmatua, oin-pausoaren analisiari esker zure gorputzak nola kolpeak xurgatzen, bultzatzen eta koordinatzen den uler dezakezu korrikaldian zehar.",
    dotationBody2:
      "Ondoren Julienek gomendio pertsonalizatuak emango dizkizu: ariketak, drill-ak, doikuntza teknikoak — minik gabe aurrera egiteko.",
    julienCardTitle: "Julien Blamont",
    julienCardBullets: [
      "Kirol kinesiterapeuta Mugitu Biarritz kontsultan",
      "La Clinique du Coureur-en prestatua (Blaise Dubois)",
      "Korrikalari hasiberrien eta adituen jarraipena",
    ],
    julienCardCta: "Julienekin Doctolib bidez hitzordua hartu →",
    ruleTitle: "Lehiaketaren araudia",
    ruleOrganizerLabel: "Antolatzailea:",
    ruleOrganizer: "Mugitu Biarritz, 3 Kléber etorbidea, 64200 Biarritz.",
    ruleDurationLabel: "Iraupena:",
    ruleDuration:
      "2026ko maiatzaren 24ra arte, igandean, 15:00etan (Paris ordua).",
    ruleConditionsLabel: "Parte hartzeko baldintzak:",
    ruleConditions:
      "adin nagusikoa izan edo legezko ordezkari baten baimena izan, Frantzia metropolitarrean bizi, @mugitu_biarritz eta @jublamont_lacliniqueducoureur kontuak Instagramen jarraitu, lehiaketaren argitalpenari 'like' eman eta story-an partekatu, eta argitalpena iruzkindu bi pertsona etiketatuz.",
    ruleDotationLabel: "Saria:",
    ruleDotation:
      "bost (5) oin-pausoaren analisi oso Mugitu Biarritz kontsultan Julien Blamontekin, unitate balioa 70 €, ados jarrita finkatutako hitzordua, ezin trukatuzkoak, ezin lagatzekoak, ezin itzultzekoak.",
    ruleDrawLabel: "Zozketa:",
    ruleDraw:
      "bost (5) irabazle zozketatu dira balio osoko parte-hartzeen artean eta haiekin harremanetan jarri da Instagrameko mezu pribatu bidez, amaieratik 7 eguneko epean.",
    rulePrivacyLabel: "Datu pertsonalak:",
    rulePrivacy:
      "lehiaketa hau Instagramekikoa ez da, eta sare sozial horrek ez du inolako ardurarik. Mugituk ez du irabazlearen Instagrameko kontuaz aparteko daturik biltzen, hitzordua antolatzeko soilik.",
  },

  winners: {
    eyebrow: "Lehiaketa amaitua · Zozketa egindakoa",
    title: "Eta irabazleak hauek dira…",
    body:
      "Zorionak bostoi! @mugitu_biarritz kontutik mezu pribatua jasoko duzue Instagramen, Julien Blamontekin oin-pausoaren analisirako zuen hitzordua finkatzeko.",
    seeProfile: "Instagrameko profila ikusi",
    certifLabel: "Zozketa ziurtatua",
    certifBodyPrefix: "2026ko maiatzaren 24an egina, ",
    certifBodySeparator: " bidez — ",
    certifCodePrefix: "Kodea ",
  },
};

export default eu;
