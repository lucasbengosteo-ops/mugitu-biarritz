import type fr from "./fr";

/**
 * Euskara — dictionnaire basque.
 *
 * Traduction réalisée par un non-natif (Claude). Voir
 * lib/dictionaries/TRANSLATION_REVIEW.md pour les points à valider par
 * un·e locuteur·rice natif·ve. La structure doit rester strictement
 * identique à fr.ts (TypeScript le vérifie).
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
    bookAppointment: "Hitzordua hartu",
    menuLabel: "Menua",
  },

  hero: {
    title: "Mugitu — Mugimenduaren etxea",
    subtitle:
      "Kirol kinesiterapia, kirol medikuntza eta osteopatia gunea Biarritzen.",
    ctaBook: "Hitzordua hartu",
    ctaTeam: "Taldea ezagutu",
    stats: [
      { value: "4", label: "Espezialistak" },
      { value: "3", label: "Diziplinak" },
      { value: "360°", label: "Kirol jarraipena" },
    ],
    scrollHint: "Beherago",
  },

  histoire: {
    eyebrow: "Etimologia eta Historia",
    title: "Zergatik Mugitu?",
    word: "mugitu",
    wordCaption: "Euskara · aditza",
    definitionLabel: "Definizioa",
    definitionShort: "« Mugitu, lekuz aldatu, mugimenduan egon »",
    definitionLong:
      "Euskaraz mugitu — mugimendua, lekuz aldatzea, mugitzeko ekintza. Euskal Herriko kulturan sakon errotutako hitza, kirolaren, ahaleginaren eta auto-gainditzearen lurraldekoa.",
    cards: [
      {
        emoji: "🏔️",
        title: "Tokian errotua",
        body: "Biarritzen sortua, Euskal Herriaren bihotzean — surfaren, errugbiaren, mendi-lasterketaren eta pilotaren lurraldea. Eskualdearen kirol nortasunarekin bat datorren izena.",
      },
      {
        emoji: "🤝",
        title: "Diziplina anitzeko ikuspegia",
        body: "Egitasmoak iturri argia du: kirolari zauritua merezi du kinesiterapeuta, medikua eta osteopataren arteko zaintza koordinatua — teilatu beraren azpian, espediente berarekin.",
      },
      {
        emoji: "🎯",
        title: "Mugimenduaren etxea",
        body: "Kontsulta soil bat baino gehiago, etxe bat. Praktikatzaileek eta kirolariek filosofia bera partekatzen duten lekua: mugimendua beti posible, iraunkor eta eraginkor izan dadin.",
      },
    ],
  },

  services: {
    eyebrow: "Eskaintzen duguna",
    title: "Gure zerbitzuak",
    items: [
      {
        key: "kine",
        title: "Kirol kinesiterapia",
        description:
          "Berreziketa funtzionala eta jarraipen pertsonalizatua maila guztietako kirolarientzat. Muskulu-, tendoi- eta artikulazio-zaurien zaintza.",
      },
      {
        key: "medecine",
        title: "Kirol medikuntza",
        description:
          "Kontsulta mediko espezializatua, kirolariaren osasun azterketa, ziurtagiri medikoak eta errendimenduaren jarraipena. Traumatologia eta prebentzio medikuntza.",
      },
      {
        key: "osteo",
        title: "Kirol osteopatia",
        description:
          "Ikuspegi orokorra eta eskuzkoa, mugikortasuna, errekuperazioa eta errendimendua hobetzeko. Berreziketa-zainketen osagarri ezin hobea.",
      },
      {
        key: "prepa",
        title: "Prestakuntza fisikoa",
        description:
          "Prestakuntza fisikoaren eta kirolera itzultzeko programa indibidualizatuak. Athletic training, zaurien prebentzioa eta gaitasun atletikoen optimizazioa.",
      },
    ],
  },

  team: {
    eyebrow: "Diziplina anitzeko",
    title: "Gure taldea",
    bookCta: "Doctolib bidez hitzordua hartu",
    members: {
      lucas: {
        role: "Kirol osteopata",
        bio: "Kirolarien zaintzan espezializatutako osteopata. Allyane® terapian praktikatzaile ziurtatua.",
        specialties: [
          "Kirol osteopatia",
          "Allyane® terapia",
          "Korrikalariaren jarraipena",
          "Endometriosia",
        ],
      },
      basile: {
        role: "Kirol medikua",
        bio: "Goi-mailako kirolarien jarraipena egiten duen kirol medikua. Kirol traumatologian, mesoterapian eta PRP infiltrazioetan espezializatua.",
        specialties: [
          "Goi-mailako kirolarien jarraipena",
          "Kirol traumatologia",
          "Mesoterapia · PRP",
        ],
      },
      clement: {
        role: "Kirol kinesiterapeuta",
        bio: "Kirol kinesiterapeuta eta athletic trainer. Haur kirolarien eta dantzarien zaintzan espezializatua.",
        specialties: ["Athletic trainer", "Haur kirolaria", "Dantzariaren jarraipena"],
      },
      julien: {
        role: "Kirol kinesiterapeuta",
        bio: "La Clinique du Coureur erakundean prestatutako kirol kinesiterapeuta. Korrikalariaren jarraipenean, oin-pausoaren analisian eta lasterketa-zaurien prebentzioan espezializatua.",
        specialties: [
          "La Clinique du Coureur",
          "Oin-pausoaren analisia",
          "Korrikalariaren jarraipena",
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
          "Dantzariaren jarraipena",
        ],
      },
    },
  },

  allyane: {
    eyebrow: "Metodo ziurtatua",
    title: "Allyane® terapia",
    description:
      "Allyane® terapia neuromotorearen birprogramatze ikuspegia da, traumaren ondorengo muskulu-inhibizioak kentzeko aukera ematen duena. Emaitzak 1etik 3rako saiotan.",
    indicationsLabel: "Indikazioak",
    indications: [
      "Loturen kirurgia",
      "Kirol traumatismoak",
      "Min kronikoak",
      "Ebakuntza ondorengo errekuperazioa",
    ],
    cta: "Gehiago jakin",
    certifiedLabel: "Praktikatzaile ziurtatuak",
  },

  cliniqueCoureur: {
    eyebrow: "Metodo ziurtatua",
    titleSr: "La Clinique du Coureur",
    subtitle: "Korrikalariaren jarraipenaren nazioarteko erreferentzia",
    description:
      "Blaise Duboisek (Quebec) sortutako ikuspegia, ebidentzia zientifikoan eta entrenamendu-kargaren programazio zorrotzean oinarritua. Julien Blamont, Mugitu Biarritzeko kirol kinesiterapeuta, <strong>praktikatzaile ziurtatua</strong> da eta korrikalari hasiberriei zein adituei laguntzen die.",
    expertisesLabel: "Espezialitateak",
    expertises: [
      "Oin-pausoaren analisia",
      "Korrikalariaren azterketa",
      "Zauriaren ondorengo korrikara itzultzea",
      "Zaurien prebentzioa",
      "Kargaren programazioa",
    ],
    ctaBook: "Julienekin hitzordua hartu",
    ctaLearn: "Gehiago jakin",
    photoCaptionName: "Julien Blamont",
    photoCaptionRole: "Kirol kinesiterapeuta · Mugitu Biarritz",
    certifiedBadge: "La Clinique du Coureur praktikatzaile ziurtatua",
  },

  appMugitu: {
    eyebrow: "Praktikatzaileentzako tresna",
    title: "Aldea egiten duen jarraipena",
    descriptionLead: "app.mugitu.pro",
    descriptionRest:
      " — kirol praktikatzaileentzat garatutako gaixoen jarraipen plataforma. Espedienteak, saioak, azterketak: kalitatezko laguntzarako behar den oro.",
    chips: [
      "HDS ostalaritza",
      "Kontsulta-fluxua",
      "Jarraipen-ibilbidea",
      "Allyane® terapia",
      "Praktikatzaile arteko mezularitza",
      "Azterketak eta analitikak",
    ],
    features: [
      {
        key: "sessions",
        title: "Saioen jarraipena",
        description:
          "Historia osoa, kontsulta-oharrak eta bilakaera klinikoa klik batean.",
      },
      {
        key: "performance",
        title: "Errendimendu-monitorizazioa",
        description:
          "Aginte-koadro pertsonalizatuak kirolari bakoitzaren aurrerapena jarraitzeko.",
      },
      {
        key: "dossier",
        title: "Gaixoaren espediente digitala",
        description: "Agiriak, azterketak eta errezetak zentralizatuak eta seguruak.",
      },
      {
        key: "coord",
        title: "Talde-koordinazioa",
        description:
          "Partekatu espedientea kinesiterapeuta, medikua eta osteopataren artean zaintza koordinaturako.",
      },
    ],
    ctaApp: "Aplikaziora sartu",
    ctaDemo: "Demoa eskatu",
    mockupAlt: "app.mugitu.pro interfazea laptop eta mugikorrean",
    badgeHdsTitle: "HDS ostalaritza",
    badgeHdsSub: "Osasun datu ziurtatuak",
    badgeFlowTitle: "Kontsulta-fluxua",
    badgeFlowSub: "Pauso-pausoko bidea",
    badgeRoadmapTitle: "Jarraipen-ibilbidea",
    badgeRoadmapSub: "Gaixoaren bide osoaren ikuspegia",
    patientsCounter: "1785 gaixo jarraituak",
  },

  andrew: {
    eyebrow: "Urruneko jarraipena",
    titlePre: "Luzatu saioa honekin:",
    description:
      "Gure praktikatzaileek <strong>Andrew®</strong> aplikazioan errezetatzen dituzte berreziketa-programak, gaixoak etxean lana jarraitu ahal izan dezan — bideoekin, atxikidura-jarraipenarekin eta praktikatzailearekin zuzeneko mezularitzarekin.",
    features: [
      {
        key: "video",
        title: "Bideo bidezko ariketak",
        description:
          "Programa pertsonalizatuak bideo-jarraibideekin, edozein unetan eskuragarri mugikorrean.",
      },
      {
        key: "observance",
        title: "Atxikidura jarraipena",
        description:
          "Ikusi denbora errealean gaixoek berreziketa-programari nola eusten dioten.",
      },
      {
        key: "reminders",
        title: "Gogorarazpen automatikoak",
        description:
          "Jakinarazpen adimendunak saioen arteko erregulartasunari eusteko.",
      },
      {
        key: "mobile",
        title: "Mugikorreko aplikazioa",
        description:
          "iOS eta Android-en eskuragarri. Gaixoak bere programa zuzenean mugikorrean aurkitzen du.",
      },
    ],
    cta: "Andrew® ezagutu",
    ctaSub: "iOS eta Android-en eskuragarri",
    observanceLabel: "Atxikidura",
    observanceValue: "%87",
    activeProgramLabel: "Programa aktiboa",
    mockupAlt: "Andrew aplikazioa — gomendaturiko ariketak",
  },

  contact: {
    eyebrow: "Helbidea eta hitzordua",
    title: "Gugana nola heldu",
    addressLabel: "Helbidea",
    address: "3 Kléber etorbidea, 64200 Biarritz",
    emailLabel: "Helbide elektronikoa",
    hoursLabel: "Ordutegia",
    hours: "Astelehena — Ostirala: 8:00 — 19:00",
    bookOnlineLabel: "Sarean hitzordua hartu",
    orWrite: "Edo idatz iezaguzu",
    practitioners: {
      lucas: { name: "Lucas Bengoechea", role: "Kirol osteopata" },
      basile: { name: "Dr Basile Carcassonne", role: "Kirol medikua" },
      julien: { name: "Julien Blamont", role: "Kirol kinesiterapeuta" },
      jb: { name: "Jean-Baptiste Colombié", role: "Kirol kinesiterapeuta" },
    },
    mapTitle: "Mugitu Biarritz kokapena",
  },

  footer: {
    tagline: "Mugimenduaren etxea",
    address: "3 Kléber etorbidea, 64200 Biarritz",
    legalLinks: {
      mentions: "Lege-oharrak",
      privacy: "Pribatutasun politika",
    },
    practitionerSpace: "Praktikatzaileen gunea →",
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
