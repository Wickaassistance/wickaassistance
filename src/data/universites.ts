// src/data/universites.ts
//
// Règle de la page : on n'affiche que des informations vérifiées (sites officiels, presse).
// - `siteWeb` : lien vers le site de l'établissement (bouton « Visiter le site officiel »).
// - `filieres` : programmes relevés sur les sites des établissements ou dans la presse.
// - `reconnaissance` : conservé dans les données, non affiché sur la page.
// - Aucun frais de scolarité n'est stocké ici : ils changent chaque année.

export type Domaine =
  | "sante"
  | "ingenierie"
  | "management"
  | "architecture"
  | "droit-sciences-po"
  | "sciences-humaines";

export type Ville =
  | "casablanca"
  | "rabat"
  | "fes"
  | "marrakech"
  | "tanger"
  | "benguerir"
  | "ifrane";

export const DOMAINES: Record<Domaine, string> = {
  sante: "Santé : médecine, pharmacie, dentaire",
  ingenierie: "Ingénierie et numérique",
  management: "Management et finance",
  architecture: "Architecture et design",
  "droit-sciences-po": "Droit et sciences politiques",
  "sciences-humaines": "Sciences humaines, communication et langues",
};

export const VILLES: Record<Ville, string> = {
  casablanca: "Casablanca",
  rabat: "Rabat / Salé",
  fes: "Fès",
  marrakech: "Marrakech",
  tanger: "Tanger",
  benguerir: "Ben Guérir",
  ifrane: "Ifrane",
};

/** Dernière année universitaire couverte par la reconnaissance, dans une ville donnée. */
export interface Reconnaissance {
  ville: Ville;
  jusqua: string; // ex. "2026/2027"
}

export interface Etablissement {
  slug: string;
  nom: string;
  sigle: string;
  type: "universite" | "ecole";
  villes: Ville[];
  domaines: Domaine[];
  filieres: string[];
  siteWeb: string;
  reconnaissance: Reconnaissance[];
}

export const SOURCE = {
  liste: "Liste ministérielle des établissements reconnus par l'État (enssup.gov.ma), version mai 2026",
  verifieLe: "2026-10-18",
  anneeReference: "2026/2027",
} as const;

/** Vrai si la période de reconnaissance enregistrée est antérieure à l'année de référence. */
export const aConfirmer = (e: Etablissement): boolean =>
  e.reconnaissance.some((r) => r.jusqua < SOURCE.anneeReference);

export const ETABLISSEMENTS: Etablissement[] = [
  {
    slug: "uir",
    nom: "Université Internationale de Rabat",
    sigle: "UIR",
    type: "universite",
    villes: ["rabat"],
    domaines: ["ingenierie", "management", "architecture", "droit-sciences-po", "sante", "sciences-humaines"],
    filieres: [
      "Rabat Business School (Programme Grande École)",
      "Sciences Po Rabat (licence en double parcours avec Sciences Po Grenoble)",
      "École de Droit de Rabat",
      "Communication et médias",
      "Informatique et numérique",
      "Ingénierie de l'énergie",
      "Ingénierie aérospatiale et automobile",
      "Architecture",
      "Médecine",
      "Médecine dentaire",
      "Sciences paramédicales",
    ],
    siteWeb: "https://uir.ac.ma",
    reconnaissance: [{ ville: "rabat", jusqua: "2029/2030" }],
  },
  {
    slug: "uemf",
    nom: "Université Euro-Méditerranéenne de Fès",
    sigle: "UEMF",
    type: "universite",
    villes: ["fes"],
    domaines: ["ingenierie", "architecture", "management", "droit-sciences-po", "sante", "sciences-humaines"],
    filieres: [
      "Euromed Polytechnic School (ingénierie)",
      "École d'Ingénierie Digitale et d'Intelligence Artificielle",
      "École d'Architecture, de Design et d'Urbanisme",
      "Euromed Business School",
      "Institut des Sciences Juridiques et Politiques",
      "Faculté des Sciences Humaines et Sociales",
      "Faculté de Pharmacie",
      "Sciences infirmières et techniques de santé",
    ],
    siteWeb: "https://ueuromed.org",
    reconnaissance: [{ ville: "fes", jusqua: "2025/2026" }],
  },
  {
    slug: "um6p",
    nom: "Université Mohammed VI Polytechnique",
    sigle: "UM6P",
    type: "universite",
    villes: ["benguerir", "rabat"],
    domaines: ["ingenierie", "management", "architecture", "sante"],
    filieres: [
      "Africa Business School",
      "EMINES, School of Industrial Management",
      "School of Computer Science",
      "School of Architecture, Planning and Design",
      "School of Agriculture, Fertilization and Environmental Sciences",
      "School of Collective Intelligence",
      "School of Hospitality Business and Management",
      "Faculté des sciences médicales (médecine et pharmacie)",
    ],
    siteWeb: "https://www.um6p.ma",
    reconnaissance: [{ ville: "benguerir", jusqua: "2025/2026" }],
  },
  {
    slug: "aui",
    nom: "Université Al Akhawayn",
    sigle: "AUI",
    type: "universite",
    villes: ["ifrane"],
    domaines: ["ingenierie", "management", "sciences-humaines"],
    filieres: [
      "School of Science and Engineering",
      "School of Business Administration",
      "School of Humanities and Social Sciences",
      "Cursus en anglais, modèle universitaire américain (bachelor et master)",
    ],
    siteWeb: "https://www.aui.ma",
    reconnaissance: [],
  },
  {
    slug: "um6ss",
    nom: "Université Mohammed VI des Sciences de la Santé",
    sigle: "UM6SS",
    type: "universite",
    villes: ["casablanca", "rabat", "marrakech"],
    domaines: ["sante"],
    filieres: [
      "Médecine",
      "Médecine (filière anglophone)",
      "Médecine dentaire",
      "Pharmacie",
      "Médecine vétérinaire",
      "Sciences infirmières et professions de la santé",
      "Ingénieurs en sciences de la santé",
    ],
    siteWeb: "https://www.um6ss.ma",
    reconnaissance: [{ ville: "casablanca", jusqua: "2025/2026" }],
  },
  {
    slug: "uiass",
    nom: "Université Internationale Abulcasis des Sciences de la Santé",
    sigle: "UIASS",
    type: "universite",
    villes: ["rabat"],
    domaines: ["sante", "ingenierie"],
    filieres: [
      "Faculté de Médecine",
      "Faculté de Médecine Dentaire",
      "Faculté de Pharmacie",
      "Sciences infirmières et management hospitalier",
      "Ingénierie et technologies de la santé (ISITS)",
      "École d'Ingénieurs Abulcasis",
    ],
    siteWeb: "https://www.uiass.ma",
    reconnaissance: [{ ville: "rabat", jusqua: "2025/2026" }],
  },
  {
    slug: "uic",
    nom: "Université Internationale de Casablanca",
    sigle: "UIC",
    type: "universite",
    villes: ["casablanca"],
    domaines: ["sante", "ingenierie", "management"],
    filieres: [
      "Faculté de Médecine",
      "Faculté des Sciences de la Santé (kinésithérapie, orthophonie, nutrition et diététique, imagerie médicale, biologie médicale, psychologie)",
      "École d'Ingénierie",
      "Faculté de Commerce et Gestion",
      "Management hôtelier et sportif",
    ],
    siteWeb: "https://uic.ac.ma",
    reconnaissance: [{ ville: "casablanca", jusqua: "2025/2026" }],
  },
  {
    slug: "upm",
    nom: "Université Privée de Marrakech",
    sigle: "UPM",
    type: "universite",
    villes: ["marrakech"],
    domaines: ["sante", "ingenierie", "management", "droit-sciences-po"],
    filieres: [
      "Faculté Privée de Médecine de Marrakech",
      "Faculté des Métiers et Technologies de la Santé",
      "Faculté de Management et Gouvernance (licences et masters, Programme Grande École)",
      "Licence en sciences politiques",
      "École d'Ingénierie et d'Innovation de Marrakech (E2IM)",
      "Faculté de l'Art, Culture et Média-Audiovisuel",
      "Sup de Co Marrakech (commerce et gestion)",
    ],
    siteWeb: "https://www.upm.ac.ma",
    reconnaissance: [{ ville: "marrakech", jusqua: "2025/2026" }],
  },
  {
    slug: "upf",
    nom: "Université Privée de Fès",
    sigle: "UPF",
    type: "universite",
    villes: ["fes"],
    domaines: ["ingenierie", "management", "droit-sciences-po", "architecture", "sante"],
    filieres: [
      "Faculté des Sciences de l'Ingénieur",
      "Fès Business School",
      "Institut des Hautes Études Juridiques et Sociales",
      "École Supérieure des Métiers de l'Architecture d'Intérieur et du Bâtiment",
      "Faculté des Sciences et Techniques de Santé (sciences infirmières, nutrition, laboratoire, psychologie)",
      "Classes préparatoires",
    ],
    siteWeb: "https://www.upf.ac.ma",
    reconnaissance: [{ ville: "fes", jusqua: "2026/2027" }],
  },
  {
    slug: "mundiapolis",
    nom: "Université Mundiapolis",
    sigle: "Mundiapolis",
    type: "universite",
    villes: ["casablanca"],
    domaines: ["ingenierie", "management", "sante"],
    filieres: ["École d'Ingénierie", "Faculté de Management", "Faculté des Sciences de la Santé"],
    siteWeb: "https://mundiapolis.ma",
    reconnaissance: [{ ville: "casablanca", jusqua: "2026/2027" }],
  },
  {
    slug: "emsi",
    nom: "École Marocaine des Sciences de l'Ingénieur",
    sigle: "EMSI",
    type: "ecole",
    villes: ["casablanca", "rabat", "marrakech", "tanger", "fes"],
    domaines: ["ingenierie", "management"],
    filieres: [
      "Ingénierie informatique et réseaux",
      "Ingénierie automatismes et informatique industrielle",
      "Génie électrique et systèmes intelligents",
      "Génie civil, bâtiments et travaux publics",
      "Génie industriel",
      "Ingénierie financière et audit",
    ],
    siteWeb: "https://www.emsi.ma",
    reconnaissance: [
      { ville: "casablanca", jusqua: "2026/2027" },
      { ville: "rabat", jusqua: "2026/2027" },
      { ville: "marrakech", jusqua: "2026/2027" },
      { ville: "tanger", jusqua: "2026/2027" },
    ],
  },
  {
    slug: "estem",
    nom: "ESTEM, École Supérieure en Ingénierie, Management et Génie Civil",
    sigle: "ESTEM",
    type: "ecole",
    villes: ["casablanca"],
    domaines: ["ingenierie", "management"],
    filieres: [
      "Ingénierie de l'information (5 ans)",
      "Ingénierie en sciences de gestion et commerce (5 ans)",
      "Classes préparatoires scientifiques et économiques",
    ],
    siteWeb: "https://www.estem.ma",
    reconnaissance: [{ ville: "casablanca", jusqua: "2026/2027" }],
  },
  {
    slug: "esca",
    nom: "ESCA École de Management",
    sigle: "ESCA",
    type: "ecole",
    villes: ["casablanca"],
    domaines: ["management"],
    filieres: [
      "Programme Grande École (parcours ingénierie financière, entrepreneuriat et innovation, global supply chain management, ressources humaines)",
      "Bachelor : Licence en management des entreprises",
      "Masters spécialisés (transformation digitale, marketing digital)",
    ],
    siteWeb: "https://www.esca.ma",
    reconnaissance: [{ ville: "casablanca", jusqua: "2025/2026" }],
  },
  {
    slug: "hem",
    nom: "Institut des Hautes Études de Management",
    sigle: "HEM",
    type: "ecole",
    villes: ["casablanca", "rabat", "marrakech", "tanger", "fes"],
    domaines: ["management", "ingenierie"],
    filieres: [
      "Programme Grande École Bac+5 Management (double diplomation avec IAE Lyon)",
      "BBA Business Administration (en anglais)",
      "Bachelor en droit des affaires et management",
      "Masters : comptabilité, contrôle et audit ; finance ; marketing ; international business",
      "Master en ingénierie informatique (big data et IA, cybersécurité)",
      "Master en sports management",
    ],
    siteWeb: "https://hem.ac.ma",
    reconnaissance: [{ ville: "casablanca", jusqua: "2026/2027" }],
  },
  {
    slug: "isga",
    nom: "Institut Supérieur d'Ingénierie et des Affaires",
    sigle: "ISGA",
    type: "ecole",
    villes: ["casablanca", "rabat", "fes", "marrakech"],
    domaines: ["ingenierie", "management"],
    filieres: [
      "École de Management (5 ans) : licence en management des entreprises et systèmes digitaux, masters",
      "École d'Ingénieur.e.s (5 ans) : cycle préparatoire de 2 ans, puis cycle ingénieur de 3 ans",
    ],
    // À vérifier : adresse du site officiel non confirmée pendant la recherche.
    siteWeb: "https://www.isga.ma",
    reconnaissance: [
      { ville: "casablanca", jusqua: "2025/2026" },
      { ville: "rabat", jusqua: "2026/2027" },
      { ville: "fes", jusqua: "2026/2027" },
      { ville: "marrakech", jusqua: "2026/2027" },
    ],
  },
  {
    slug: "iga",
    nom: "Institut Supérieur du Génie Appliqué",
    sigle: "IGA",
    type: "ecole",
    villes: ["casablanca"],
    domaines: ["ingenierie", "management"],
    filieres: [
      "École de Management : système d'information et audit, génie financier, marketing et commerce",
      "École d'Ingénierie : réseaux informatiques et sécurité, télécoms et systèmes embarqués, systèmes automatisés et contrôle qualité",
    ],
    siteWeb: "https://www.iga.ac.ma",
    reconnaissance: [{ ville: "casablanca", jusqua: "2026/2027" }],
  },
  {
    slug: "ecc",
    nom: "École Centrale Casablanca",
    sigle: "ECC",
    type: "ecole",
    villes: ["casablanca"],
    domaines: ["ingenierie"],
    filieres: ["Cycle ingénieur généraliste (3 ans)"],
    siteWeb: "https://centrale-casablanca.ma",
    reconnaissance: [{ ville: "casablanca", jusqua: "2025/2026" }],
  },
  {
    slug: "eac",
    nom: "École d'Architecture de Casablanca",
    sigle: "EAC",
    type: "ecole",
    villes: ["casablanca"],
    domaines: ["architecture"],
    filieres: ["Architecture", "Paysage", "Urbanisme", "Master en partenariat avec Sorbonne Université"],
    siteWeb: "https://honoris.net/our-institutions/morocco/ecole-darchitecture-de-casablanca/",
    reconnaissance: [{ ville: "casablanca", jusqua: "2025/2026" }],
  },
];

// Villes réellement présentes dans les données.
export const VILLES_DISPONIBLES: Ville[] = (Object.keys(VILLES) as Ville[]).filter((v) =>
  ETABLISSEMENTS.some((e) => e.villes.includes(v)),
);
