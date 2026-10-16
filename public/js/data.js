/**
 * Wicka Assistance - Données du site web (Version Enrichie et Spécial Parents)
 * Universités privées d'excellence, Tarifs par Pays, Étude de vie au Maroc et Transport Aéroport
 */

const WICKA_DATA = {
  // Coordonnées officielles
  contact: {
    phone: "+212 7 89 09 54 98",
    phoneRaw: "212789095498",
    whatsappLink: "https://wa.me/212789095498",
    email: "wickaassistance@gmail.com",
    addressCasa: "Boulevard d'Anfa, Maarif, Casablanca - Maroc",
    addressRabat: "Avenue de France, Agdal, Rabat - Maroc"
  },

  // Bandeau Promotion Rentrée (affiché sur tout le site)
  promo: {
    active: true,
    label: "PROMO RENTRÉE 2026-2027",
    discount: "-50%",
    deadline: "Offre de lancement à durée limitée",
    disclaimer: "Tarifs promotionnels de lancement, susceptibles d'évoluer à tout moment. Le prix est bloqué et garanti dès la signature de votre contrat."
  },

  // Taux de conversion et Grille par pays (prix promotionnels + prix barrés d'origine)
  countryPricings: {
    senegal: {
      name: "Sénégal 🇸🇳",
      currency: "XOF",
      symbol: "FCFA",
      rate: 60.5,
      paymentMethods: ["Wave", "Orange Money", "Virement CBAO/SGBS", "Western Union"],
      packAdmissionOld: "120 000 FCFA",
      packAdmission: "60 000 FCFA",
      packVIPOld: "235 000 FCFA",
      packVIP: "120 000 FCFA",
      note: "Paiement local sans frais de change via Wave / Orange Money. Réglable en 2 tranches."
    },
    ivory_coast: {
      name: "Côte d'Ivoire 🇨🇮",
      currency: "XOF",
      symbol: "FCFA",
      rate: 60.5,
      paymentMethods: ["Wave CI", "Orange Money", "MTN MoMo", "Moov Money", "Virement"],
      packAdmissionOld: "120 000 FCFA",
      packAdmission: "60 000 FCFA",
      packVIPOld: "235 000 FCFA",
      packVIP: "120 000 FCFA",
      note: "Disponible en règlement échelonné en 2 tranches sans frais."
    },
    cameroon: {
      name: "Cameroun 🇨🇲",
      currency: "XAF",
      symbol: "FCFA",
      rate: 60.5,
      paymentMethods: ["MTN Mobile Money", "Orange Money", "Virement Express", "MoneyGram"],
      packAdmissionOld: "120 000 FCFA",
      packAdmission: "60 000 FCFA",
      packVIPOld: "235 000 FCFA",
      packVIP: "120 000 FCFA",
      note: "Suivi consulaire rigoureux pour le visa d'études à Douala / Yaoundé."
    },
    gabon: {
      name: "Gabon 🇬🇦",
      currency: "XAF",
      symbol: "FCFA",
      rate: 60.5,
      paymentMethods: ["Airtel Money", "Moov Money", "Virement BGFI Bank", "Western Union"],
      packAdmissionOld: "120 000 FCFA",
      packAdmission: "60 000 FCFA",
      packVIPOld: "235 000 FCFA",
      packVIP: "120 000 FCFA",
      note: "Assistance rapide pour l'équivalence du Bac gabonais."
    },
    guinea: {
      name: "Guinée 🇬🇳",
      currency: "GNF",
      symbol: "GNF / USD",
      rate: 850,
      paymentMethods: ["Orange Money Guinée", "Virement Ecobank", "Western Union"],
      packAdmissionOld: "1 700 000 GNF",
      packAdmission: "850 000 GNF (~92 €)",
      packVIPOld: "3 300 000 GNF",
      packVIP: "1 700 000 GNF (~185 €)",
      note: "Accompagnement complet depuis Conakry."
    },
    congo: {
      name: "Congo et RDC 🇨🇬 🇨🇩",
      currency: "USD",
      symbol: "$ / FCFA",
      rate: 0.10,
      paymentMethods: ["Airtel Money", "M-Pesa", "Virement Rawbank / BGFI", "Western Union"],
      packAdmissionOld: "195 $",
      packAdmission: "99 $ (~60 000 FCFA)",
      packVIPOld: "385 $",
      packVIP: "199 $ (~120 000 FCFA)",
      note: "Transfert sécurisé avec reçu officiel instantané."
    },
    diaspora_europe: {
      name: "France / Europe / Diaspora 🇫🇷 🇪🇺",
      currency: "EUR",
      symbol: "€",
      rate: 0.092,
      paymentMethods: ["Virement SEPA", "Carte Bancaire", "PayPal Sécurisé"],
      packAdmissionOld: "185 €",
      packAdmission: "92 €",
      packVIPOld: "360 €",
      packVIP: "185 €",
      note: "Facture professionnelle aux normes européennes."
    },
    maroc: {
      name: "Maroc (Sur place) 🇲🇦",
      currency: "MAD",
      symbol: "DH",
      rate: 1,
      paymentMethods: ["Versement Bancaire Attijari / BMCE / CIH", "Espèces en agence"],
      packAdmissionOld: "1 990 DH",
      packAdmission: "990 DH",
      packVIPOld: "3 890 DH",
      packVIP: "1 990 DH",
      note: "Reçu et contrat signés dans nos bureaux à Casablanca ou Rabat."
    }
  },

  // Données pour le simulateur de coût de la vie par ville (en MAD par mois)
  citiesCost: {
    casablanca: {
      name: "Casablanca",
      food: 1300,
      transport: 250,
      lifestyle: 450,
      badge: "Pôle Économique et Cosmopolite (Stages et Emplois)",
      tram: "Réseau Tramway et Busway moderne",
      advantages: "Immense vivier de stages, sièges de multinationales, transports 24/7."
    },
    rabat: {
      name: "Rabat",
      food: 1200,
      transport: 200,
      lifestyle: 400,
      badge: "Capitale Verte et Cité Universitaire d'Excellence",
      tram: "Tramway reliant Rabat et Salé, ville calme et ultra sécurisée",
      advantages: "Atmosphère paisible, ministères, bibliothèques nationales, sécurité maximale."
    },
    fes: {
      name: "Fès",
      food: 950,
      transport: 150,
      lifestyle: 300,
      badge: "Capitale Spirituelle et Pôle Académique Euromed",
      tram: "Réseau de bus et taxis très abordables",
      advantages: "Coût de la vie très bas, campus Euromed ultra moderne, riche patrimoine."
    },
    marrakech: {
      name: "Marrakech",
      food: 1100,
      transport: 180,
      lifestyle: 350,
      badge: "Cadre de Vie Idéal, Climat Ensoleillé et Dynamique",
      tram: "Bus à haut niveau de service et transports fluides",
      advantages: "Cadre agréable, écoles de commerce et tourisme prestigieuses, aéroport international."
    },
    tanger: {
      name: "Tanger",
      food: 1150,
      transport: 200,
      lifestyle: 350,
      badge: "Pôle Industriel, Tech et Proche de l'Europe",
      tram: "TGV Al Boraq vers Rabat et Casa en 1h20",
      advantages: "Tanger Med, usines automobiles/aéronautiques, ouvert sur le monde."
    },
    ifrane: {
      name: "Ifrane",
      food: 900,
      transport: 120,
      lifestyle: 280,
      badge: "Campus d'Élite Al Akhawayn et Cadre Nature",
      tram: "Petite ville sécurisée, tout accessible à pied",
      advantages: "La « petite Suisse marocaine » : campus américain, air pur, sécurité totale et vie étudiante dynamique."
    }
  },

  // Domaines d'études
  domains: [
    { id: "all", label: "Toutes les filières", icon: "academic-cap" },
    { id: "medecine", label: "Médecine et Santé", icon: "heart" },
    { id: "ingenierie", label: "Ingénierie et Informatique", icon: "cpu" },
    { id: "business", label: "Business et Management", icon: "chart-bar" },
    { id: "architecture", label: "Architecture et Design", icon: "cube" },
    { id: "droit", label: "Droit et Sciences Politiques", icon: "scale" }
  ],

  // Universités et Grandes Écoles privées réputées au Maroc
  universities: [
    {
      id: "euromed_fes",
      name: "UEMF - Université Euro-Méditerranéenne de Fès (Euromed)",
      shortName: "Euromed Fès (UEMF)",
      city: "fes",
      cityName: "Fès",
      domain: "ingenierie",
      domainLabel: "Ingénierie, Pharmacie, IA et Architecture",
      type: "Excellence et Partenariat Union pour la Méditerranée",
      tuition: "À partir de 50 000 DH/an",
      tuitionYearMAD: 58000,
      recognized: "Diplômes Reconnus par l'État Marocain et l'Europe",
      tags: ["Campus Éco-responsable", "Laboratoires 3D et Robotique", "Bourses d'Excellence"],
      description: "Placée sous la Haute Présidence d'Honneur de Sa Majesté le Roi Mohammed VI, l'UEMF est un pôle d'excellence réunissant des étudiants de plus de 30 nationalités avec des doubles diplômes européens.",
      popularPrograms: ["École d'Ingénierie Digitale et IA (EIDIA)", "Faculté de Pharmacie", "École d'Architecture et Urbanisme (EMADU)"]
    },
    {
      id: "estem_casa",
      name: "ESTEM Casablanca - École Supérieure des Technologies et de Management",
      shortName: "ESTEM Casablanca",
      city: "casablanca",
      cityName: "Casablanca (Centre d'Affaires)",
      domain: "business",
      domainLabel: "Management, Supply Chain et Informatique",
      type: "Grande École Privée Reconnue par l'État",
      tuition: "À partir de 42 000 DH/an",
      tuitionYearMAD: 46000,
      recognized: "Équivalence Diplômes État et Doubles Diplômes France",
      tags: ["Partenariats Écoles Françaises", "Classes Prépa et Masters"],
      description: "Institution réputée à Casablanca formant depuis plus de 20 ans des managers et des ingénieurs très demandés sur le marché de l'emploi marocain et international.",
      popularPrograms: ["Audit, Finance et Contrôle de Gestion", "Génie Logiciel et Big Data", "Supply Chain et Commerce International"]
    },
    {
      id: "uiass_rabat",
      name: "UIASS - Université Internationale Abulcasis des Sciences de la Santé",
      shortName: "UIASS Rabat",
      city: "rabat",
      cityName: "Rabat (Cité Hospitalière)",
      domain: "medecine",
      domainLabel: "Médecine, Dentaire, Pharmacie et Santé",
      type: "Fondation Cheikh Zaïd - Reconnue par l'État",
      tuition: "Frais selon Faculté (Santé)",
      tuitionYearMAD: 85000,
      recognized: "Diplôme d'État de Docteur et Spécialités",
      tags: ["Hôpital Universitaire Intégré", "Équipements Chirurgicaux de Pointe", "Internat Médical"],
      description: "Pôle médical d'excellence adossé à l'Hôpital Universitaire Cheikh Zaïd de Rabat, offrant une formation clinique intensive de rang mondial.",
      popularPrograms: ["Doctorat en Médecine Générale", "Médecine Dentaire", "Faculté de Pharmacie", "Sciences Infirmières"]
    },
    {
      id: "esca_casa",
      name: "ESCA École de Management Casablanca",
      shortName: "ESCA Management",
      city: "casablanca",
      cityName: "Casablanca (Casablanca Finance City)",
      domain: "business",
      domainLabel: "Business, Finance, Audit et Marketing",
      type: "Accréditée AACSB",
      tuition: "À partir de 62 000 DH/an",
      tuitionYearMAD: 65000,
      recognized: "1ère Business School d'Afrique Francophone",
      tags: ["Campus CFC Ultra Moderne", "Réseau International 120+ universités", "Carrières Mondiales"],
      description: "L'ESCA est située au cœur du quartier financier Casablanca Finance City et propose des formations en management adaptées aux enjeux du marché national et international.",
      popularPrograms: ["Grande École en Management (PGE)", "Finance de Marché et Corporate", "Marketing Digital et IA"]
    },
    {
      id: "um6p",
      name: "UM6P - Université Mohammed VI Polytechnique",
      shortName: "UM6P",
      city: "rabat",
      cityName: "Rabat / Benguerir",
      domain: "ingenierie",
      domainLabel: "Ingénierie, IA, Green Tech et Gouvernance",
      type: "Excellence et Recherche Mondiale",
      tuition: "Bourses disponibles et Sur dossier",
      tuitionYearMAD: 75000,
      recognized: "Reconnaissance Internationale et État",
      tags: ["Campus 5 étoiles", "Supercalculateur IA Toubkal", "Bourses d'Excellence"],
      description: "L'un des campus les plus avancés au monde, axé sur l'intelligence artificielle, l'agriculture durable, les sciences des matériaux et l'entrepreneuriat.",
      popularPrograms: ["School of Computer Science (UM6P-CS)", "Africa Business School", "School of Collective Intelligence"]
    },
    {
      id: "uir",
      name: "UIR - Université Internationale de Rabat",
      shortName: "UIR",
      city: "rabat",
      cityName: "Rabat (Technopolis)",
      domain: "ingenierie",
      domainLabel: "Ingénierie, Aérospatiale, Droit et Santé",
      type: "Partenariat Public-Privé de Référence",
      tuition: "À partir de 65 000 DH/an",
      tuitionYearMAD: 72000,
      recognized: "Doubles Diplômes France / USA / Belgique",
      tags: ["Campus Américain 20 Hectares", "Rabat Business School AACSB", "Faculté de Santé"],
      description: "Une université de rang mondial dotée d'infrastructures sportives et académiques exceptionnelles, formant les futurs leaders du continent.",
      popularPrograms: ["Ingénierie Aérospatiale et Automobile", "Faculté Internationale de Médecine Dentaire", "Sciences Po Rabat"]
    },
    {
      id: "emsi",
      name: "EMSI - École Marocaine des Sciences de l'Ingénieur",
      shortName: "EMSI Maroc",
      city: "casablanca",
      cityName: "Casablanca, Rabat, Marrakech, Tanger",
      domain: "ingenierie",
      domainLabel: "Génie Informatique, Réseaux, IA et BTP",
      type: "1ère École d'Ingénieurs Privée du Maroc (Honoris)",
      tuition: "À partir de 42 000 DH/an",
      tuitionYearMAD: 46000,
      recognized: "Diplôme d'Ingénieur Reconnu par l'État",
      tags: ["Multiples Brevets Mondiaux", "Laboratoire SMARTiLab"],
      description: "Leader incontesté de l'ingénierie appliquée avec plus de 38 ans de savoir-faire et des milliers de lauréats en poste en Afrique et en Europe.",
      popularPrograms: ["Génie Informatique et Cybersécurité", "Ingénierie Financière", "Génie Civil et BTP"]
    },
    {
      id: "mundiapolis",
      name: "Université Mundiapolis Casablanca",
      shortName: "Mundiapolis Casa",
      city: "casablanca",
      cityName: "Casablanca",
      domain: "business",
      domainLabel: "Business, Santé, Ingénierie et Droit",
      type: "Reconnue par l'État (Réseau Honoris)",
      tuition: "À partir de 48 000 DH/an",
      tuitionYearMAD: 55000,
      recognized: "Équivalence Diplômes État Marocain",
      tags: ["Campus Intégré de 3 Hectares", "Faculté des Sciences de Santé", "Alternance"],
      description: "Un environnement stimulant alliant rigueur académique et accompagnement carrières pour une intégration professionnelle réussie.",
      popularPrograms: ["Mundiapolis Business School", "Kinésithérapie et Orthophonie", "Génie Industriel"]
    },
    {
      id: "uic",
      name: "UIC - Université Internationale de Casablanca",
      shortName: "UIC Bouskoura",
      city: "casablanca",
      cityName: "Casablanca (Bouskoura)",
      domain: "medecine",
      domainLabel: "Faculté de Santé, Ingénierie et Droit",
      type: "Campus Résidentiel Écologique",
      tuition: "À partir de 52 000 DH/an",
      tuitionYearMAD: 68000,
      recognized: "Diplômes Reconnus par l'État",
      tags: ["Clinique Dentaire et Médicale", "10 Hectares d'Espaces Verts", "Réseau Panafricain"],
      description: "Offre une formation pluridisciplinaire d'élite dans un cadre naturel sécurisé et moderne à l'entrée de Casablanca.",
      popularPrograms: ["Médecine Dentaire et Pharmacie", "Génie Biomédical", "Droit International des Affaires"]
    },
    {
      id: "hem_maroc",
      name: "HEM Business School (LCI Éducation)",
      shortName: "HEM Business School",
      city: "casablanca",
      cityName: "Casablanca, Rabat, Marrakech, Fès, Tanger",
      domain: "business",
      domainLabel: "Management, Finance, RH et Marketing",
      type: "Membre du Réseau Canadien LCI Éducation",
      tuition: "À partir de 55 000 DH/an",
      tuitionYearMAD: 60000,
      recognized: "Diplômes Reconnus par l'État (Bac+5)",
      tags: ["35 ans d'Histoire", "Partenariats Écoles Françaises et Canadiennes", "Réseau Alumni Puissant"],
      description: "L'une des écoles de gestion les plus prestigieuses et historiques du Maroc, reconnue pour son encadrement humain et son excellence.",
      popularPrograms: ["Programme Grande École (PGE)", "Finance et Ingénierie Financière", "Marketing et Communication"]
    },
    {
      id: "aui_ifrane",
      name: "Al Akhawayn University in Ifrane (AUI)",
      shortName: "Al Akhawayn Ifrane",
      city: "ifrane",
      cityName: "Ifrane (Campus Américain)",
      domain: "business",
      domainLabel: "Business, Ingénierie et Sciences Humaines (programmes en anglais)",
      type: "Système Américain (Accréditation US) - Reconnue par l'État",
      tuition: "À partir de 70 000 DH/an",
      tuitionYearMAD: 80000,
      recognized: "Diplômes anglophones reconnus aux États-Unis et au Maroc",
      tags: ["Campus anglophone", "Échanges USA et Europe", "Cadre Nature Sécurisé"],
      description: "La seule université marocaine sur le modèle américain (crédits, liberal arts, tout en anglais). Un campus d'élite à Ifrane, idéal pour viser ensuite les USA, le Canada et l'international.",
      popularPrograms: ["School of Business Administration (SBA)", "School of Science et Engineering", "Communication et Relations Internationales"]
    },
    {
      id: "um6ss_casa",
      name: "UM6SS - Université Mohammed VI des Sciences de la Santé",
      shortName: "UM6SS Casablanca",
      city: "casablanca",
      cityName: "Casablanca (Cité de la Santé)",
      domain: "medecine",
      domainLabel: "Médecine, Pharmacie, Dentaire et Ingénierie Biomédicale",
      type: "Fondation Mohammed VI - Reconnue par l'État",
      tuition: "Frais selon Faculté (Santé)",
      tuitionYearMAD: 90000,
      recognized: "Diplôme d'État de Docteur et Hôpitaux Universitaires intégrés",
      tags: ["CHU et Simulation Médicale", "Recherche Biomédicale", "Standards Internationaux"],
      description: "Pôle santé de référence adossé à ses propres hôpitaux universitaires et centres de simulation ultramodernes à Casablanca. Un choix d'excellence pour la médecine et les métiers de la santé.",
      popularPrograms: ["Médecine Générale", "Pharmacie et Médecine Dentaire", "Ingénierie et Sciences Biomédicales"]
    },
    {
      id: "upm_marrakech",
      name: "UPM - Université Privée de Marrakech",
      shortName: "UPM Marrakech",
      city: "marrakech",
      cityName: "Marrakech (Route de l'Ourika)",
      domain: "ingenierie",
      domainLabel: "Ingénierie, Business, Santé et Aéronautique",
      type: "Reconnue par l'État Marocain",
      tuition: "À partir de 45 000 DH/an",
      tuitionYearMAD: 52000,
      recognized: "Équivalence Diplômes État et Doubles Diplômes",
      tags: ["Campus Vert 8 Hectares", "Pôle Aéronautique", "Ville Touristique Dynamique"],
      description: "Grande université pluridisciplinaire au cœur de Marrakech, réputée pour ses filières ingénierie, aéronautique et santé dans un cadre de vie ensoleillé et agréable.",
      popularPrograms: ["Génie Informatique et IA", "Maintenance Aéronautique", "Management et Sciences de la Santé"]
    },
    {
      id: "upf_fes",
      name: "UPF - Université Privée de Fès",
      shortName: "UPF Fès",
      city: "fes",
      cityName: "Fès (Route d'Imouzzer)",
      domain: "medecine",
      domainLabel: "Dentaire, Ingénierie, Droit et Management",
      type: "1ère Université Privée de Fès - Reconnue par l'État",
      tuition: "À partir de 44 000 DH/an",
      tuitionYearMAD: 50000,
      recognized: "Équivalence Diplômes État et Formations Accréditées",
      tags: ["Clinique Dentaire Universitaire", "Bon Rapport Qualité/Prix", "Ville Étudiante Abordable"],
      description: "Université privée pionnière à Fès, appréciée pour sa faculté de médecine dentaire et ses filières ingénierie, dans une ville au coût de vie parmi les plus bas du Maroc.",
      popularPrograms: ["Médecine Dentaire", "Génie Informatique et Réseaux", "Droit et Sciences de Gestion"]
    },
    {
      id: "isga",
      name: "ISGA - Institut Supérieur d'Ingénierie et des Affaires",
      shortName: "ISGA",
      city: "rabat",
      cityName: "Rabat, Casablanca, Fès, Marrakech",
      domain: "ingenierie",
      domainLabel: "Génie Informatique, Cybersécurité, Réseaux et Business",
      type: "Grande École Reconnue par l'État (40+ ans)",
      tuition: "À partir de 38 000 DH/an",
      tuitionYearMAD: 42000,
      recognized: "Diplômes Reconnus par l'État et Titres RNCP France",
      tags: ["Titres Français RNCP", "Multi-campus"],
      description: "Réseau historique de grandes écoles présent dans 4 villes, spécialisé en ingénierie informatique et management, avec des titres français reconnus. Excellent tremplin accessible.",
      popularPrograms: ["Ingénierie Informatique et Cybersécurité", "Réseaux et Cloud", "Management et Commerce"]
    }
  ],

  // Les avantages du Maroc pour les études des enfants (Guide Parents et Étudiants)
  moroccoAdvantages: [
    {
      icon: "shield-check",
      title: "Sécurité et Stabilité Exceptionnelles",
      desc: "Le Maroc est l'un des pays les plus sûrs et stables au monde, offrant un environnement d'études paisible où les étudiants peuvent circuler et étudier en toute sérénité."
    },
    {
      icon: "graduation-cap",
      title: "Diplômes Reconnus Internationalement",
      desc: "Système LMD (Licence, Master, Doctorat) avec de nombreux partenariats et doubles diplômes délivrés par de prestigieuses universités françaises, européennes et canadiennes."
    },
    {
      icon: "train",
      title: "Infrastructures Modernes et TGV Al Boraq",
      desc: "Réseau de transports ultra moderne (TGV reliant Tanger, Rabat et Casablanca en un temps record, tramways urbains, aéroports internationaux reliés à toute l'Afrique)."
    },
    {
      icon: "handshake",
      title: "Hospitalité et Climat Chaleureux",
      desc: "Une culture d'accueil légendaire, une grande communauté de plus de 25 000 étudiants internationaux et un climat ensoleillé tout au long de l'année."
    },
    {
      icon: "coins",
      title: "Coût de la Vie et Frais d'Études Maîtrisés",
      desc: "Des études de rang international pour un coût global 3 à 4 fois inférieur à la France, au Canada ou aux États-Unis, sans barrière linguistique pour les francophones."
    },
    {
      icon: "briefcase",
      title: "Pôle Économique et Opportunités de Stages",
      desc: "Hub économique panafricain abritant les sièges régionaux de multinationales en finance, aéronautique, automobile, intelligence artificielle et énergies renouvelables."
    }
  ],

  // Packs de services (Mis à jour : Transport aéroport inclus, logement retiré)
  packs: [
    {
      id: "orientation",
      name: "Pack Diagnostic et Orientation",
      badge: "Pour démarrer",
      price: "290 DH",
      oldPrice: "590 DH",
      equivalentPrice: "~18 000 FCFA / 27 €",
      subprice: "Prix PROMO de lancement · Sans engagement",
      features: [
        "Audit complet du profil et relevés de notes",
        "Sélection stratégique des 3 meilleures universités",
        "Estimation détaillée du budget et des frais de scolarité",
        "Guide complet de la vie étudiante et sécurité au Maroc",
        "Session de questions/réponses de 30 min avec un conseiller"
      ],
      cta: "Souscrire au Diagnostic",
      highlight: false
    },
    {
      id: "admission",
      name: "Pack Admission Réussie",
      badge: "⭐ Pack recommandé",
      price: "990 DH",
      oldPrice: "1 990 DH",
      equivalentPrice: "~60 000 FCFA / 92 €",
      subprice: "Prix PROMO de lancement · Paiement local par pays (Wave, Orange Money, etc.)",
      popular: true,
      features: [
        "Toutes les prestations du Pack Orientation",
        "Dépôt prioritaire de 3 à 5 candidatures universitaires",
        "Optimisation sur-mesure du CV et de la lettre de motivation",
        "Préparation personnalisée aux entretiens oraux d'admission",
        "Suivi direct auprès des jurys jusqu'à la Lettre d'Admission Officielle",
        "Assistance complète pour la demande de bourse universitaire",
        "Constitution du dossier de Carte Consulaire auprès de l'ambassade du Maroc",
        "Délivrance de l'attestation officielle pour la demande de visa"
      ],
      cta: "Choisir le Pack Admission",
      highlight: true
    },
    {
      id: "vip",
      name: "Pack VIP All-Inclusive et Navette Aéroport",
      badge: "Sérénité Totale des Parents et Étudiants",
      price: "1 990 DH",
      oldPrice: "3 890 DH",
      equivalentPrice: "~120 000 FCFA / 185 €",
      subprice: "Prix PROMO de lancement · Prise en charge complète dès l'atterrissage",
      popular: false,
      features: [
        "Toutes les prestations du Pack Admission Réussie",
        "Montage et validation rigoureuse du Dossier Consulaire de Visa",
        "🏛️ Accompagnement complet pour la Carte Consulaire jusqu'au dépôt à l'ambassade du Maroc",
        "🚗 Navette Privée Sécurisée : Accueil à la sortie de l'aéroport et transfert direct avec chauffeur vers votre ville d'affectation (Casablanca, Rabat, Fès, Marrakech, Tanger, Ifrane)",
        "📱 Carte SIM 4G marocaine remise en main propre avec forfait internet",
        "🏦 Accompagnement physique pour l'ouverture du compte bancaire marocain",
        "📑 Prise en charge intégrale du dossier de Carte de Séjour (Titre de séjour) jusqu'à l'obtention",
        "📞 Ligne d'assistance et contact d'urgence 7j/7 pour rassurer les parents"
      ],
      cta: "Choisir le Pack VIP et Navette",
      highlight: false
    }
  ],

  // Avis et témoignages d'étudiants vérifiés
  testimonials: [
    {
      id: "tem_1",
      name: "Mamadou Diop",
      origin: "Dakar, Sénégal 🇸🇳",
      university: "UIR - Université Internationale de Rabat",
      program: "Cycle Ingénieur Aérospatiale et Systèmes Embarqués",
      rating: 5,
      year: "Promotion 2025-2026",
      avatar: "assets/images/student-senegal.jpg",
      quote: "Wicka Assistance a été formidable ! En 2 semaines, j'avais mon admission officielle à l'UIR. Le chauffeur m'attendait directement à la sortie de l'aéroport Mohammed V de Casablanca pour me conduire jusqu'à mon campus à Rabat avec ma carte SIM déjà activée. Mes parents à Dakar étaient totalement sereins !",
      verified: true,
      badge: "Admission et Navette Réussies"
    },
    {
      id: "tem_2",
      name: "Amina Kassi",
      origin: "Abidjan, Côte d'Ivoire 🇨🇮",
      university: "ESTEM Casablanca et UIC",
      program: "Management International et Supply Chain",
      rating: 5,
      year: "Promotion 2025-2026",
      avatar: "assets/images/student-ivory-coast.jpg",
      quote: "Ce que mes parents ont le plus apprécié, c'est la franchise de l'équipe de Wicka. Ils nous ont aidés à comparer les universités comme ESTEM et l'UIC en toute transparence. Le paiement en FCFA par Wave depuis Abidjan a été super simple et sécurisé avec reçu officiel.",
      verified: true,
      badge: "Paiement Wave et Admission"
    },
    {
      id: "tem_3",
      name: "Brice Tchamadeu",
      origin: "Douala, Cameroun 🇨🇲",
      university: "Euromed Fès (UEMF)",
      program: "École d'Ingénierie Digitale et Intelligence Artificielle",
      rating: 5,
      year: "Promotion 2024-2025",
      avatar: "assets/images/student-cameroon.jpg",
      quote: "Partir étudier à l'UEMF à Fès était mon rêve. Wicka Assistance a fait des appels visio avec mon père pour tout expliquer : le transport depuis l'aéroport de Casablanca jusqu'à Fès, la sécurité et les démarches de la carte de séjour. Une agence d'un professionnalisme exemplaire !",
      verified: true,
      badge: "Euromed Fès et Pack VIP"
    },
    {
      id: "tem_4",
      name: "Grace Ondo",
      origin: "Libreville, Gabon 🇬🇦",
      university: "UIASS Rabat (Sciences de la Santé)",
      program: "Faculté des Sciences Médicales et Pharmacie",
      rating: 5,
      year: "Promotion 2025-2026",
      avatar: "assets/images/student-gabon.jpg",
      quote: "L'accompagnement pour l'équivalence de mon Bac gabonais et le dépôt à la faculté de santé à Rabat a été parfait. Je recommande vivement Wicka à tous les bacheliers et parents au Gabon qui cherchent une agence fiable et sérieuse au Maroc.",
      verified: true,
      badge: "Santé et Démarches Réussies"
    }
  ],

  // Questions Fréquentes Spéciales Parents et Étudiants
  faqs: [
    {
      q: "En tant que parent, comment puis-je m'assurer de la sécurité de mon enfant au Maroc ?",
      a: "Le Maroc est réputé pour sa sécurité et sa grande hospitalité. Dès l'atterrissage, notre équipe prend en charge l'étudiant avec notre chauffeur privé qui assure le transfert direct et sécurisé depuis l'aéroport jusqu'à sa ville d'accueil. Nous remettons immédiatement une carte SIM marocaine avec connexion internet pour que l'étudiant puisse appeler ses parents dès les premières minutes."
    },
    {
      q: "Comment fonctionne le service de Transport / Navette Aéroport vers la ville ?",
      a: "Avec notre Pack VIP, dès que vous communiquez votre billet d'avion, notre chauffeur privé vous attend dans le hall des arrivées de l'aéroport avec une pancarte à votre nom. Il vous conduit confortablement en véhicule climatisé jusqu'à votre ville et lieu de résidence à Casablanca, Rabat, Fès, Marrakech ou Tanger."
    },
    {
      q: "Quels sont les modes de paiement acceptés selon mon pays ?",
      a: "Nous facilitons les paiements locaux sans frais cachés : Wave et Orange Money (Sénégal, Côte d'Ivoire, Mali, Guinée), MTN Mobile Money / Moov (Cameroun, Côte d'Ivoire, Bénin), Airtel Money / BGFI (Gabon, Congo), Virement bancaire direct ou Western Union. Un reçu officiel et un contrat d'assistance vous sont immédiatement délivrés."
    },
    {
      q: "Pourquoi choisir des universités privées comme l'UEMF Euromed, l'ESTEM, l'UM6P ou l'UIR ?",
      a: "Ces établissements sont reconnus par l'État marocain et proposent des équipements adaptés ainsi que des partenariats de double diplomation avec des universités en France, aux USA et en Europe. Leurs formations couvrent plusieurs domaines."
    },
    {
      q: "Wicka Assistance s'occupe-t-elle des démarches de visa d'études ?",
      a: "Oui ! Nous fournissons tous les justificatifs officiels requis par le consulat (attestation d'inscription agréée, suivi de dossier consulaire) et nous vous guidons pas à pas pour que votre demande de visa soit acceptée sans encombre dès le premier dépôt."
    },
    {
      q: "Comment contacter directement vos conseillers au Maroc ?",
      a: "Vous pouvez joindre notre équipe 7j/7 directement sur WhatsApp ou par email à wickaassistance@gmail.com. Nous organisons également des rendez-vous téléphoniques ou des visios avec les parents pour répondre à toutes leurs questions."
    }
  ]
};

if (typeof window !== "undefined") {
  window.WICKA_DATA = WICKA_DATA;
}
