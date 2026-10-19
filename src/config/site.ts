/**
 * Configuration centrale du site.
 * Téléphone, e-mail, adresses, promo et liens de navigation : tout se modifie ICI.
 */

export const SITE = {
  name: "Wicka Assistance",
  tagline: "Assistance Maroc",
  phone: "+212 7 89 09 54 98",
  phoneRaw: "212789095498",
  email: "wickaassistance@gmail.com",
  logo: "/assets/images/logo.png",
  ogImage: "/assets/images/og-share.jpg",
  locale: "fr_FR",
  themeColor: "#9f1239",
  /** Année affichée dans le copyright du footer (valeur fixe, comme sur le site d'origine). */
  copyrightYear: 2026,
  defaultKeywords:
    "étudier au Maroc, admission Maroc, orientation étudiant, visa étudiant Maroc, études supérieures Maroc, accompagnement étudiant, Wicka Assistance",
  offices: [
    { city: "Casablanca", address: "Bd d'Anfa, Maarif" },
    { city: "Rabat", address: "Avenue de France, Agdal" }
  ],
  /**
   * Libellés fixes de la promo. Les dates et l'état (active / masquée) ne sont PAS ici :
   * ils sont calculés automatiquement par getPromo() ci-dessous.
   */
  promo: {
    tag: "🔥 PROMO -50%",
    stickyLabel: "Postuler (Promo −50%)"
  }
} as const;

/* -------------------------------------------------------------------------- */
/*  PROMO −50% : RÈGLE ANNUELLE AUTOMATIQUE (fuseau GMT+0 / UTC)              */
/* -------------------------------------------------------------------------- */
/**
 * Règle :
 *  - La promo est VISIBLE du 1er août 00:00:00 au 15 novembre 23:59:59 (UTC) de chaque année.
 *  - Le compte à rebours vise toujours le 15 novembre de l'année en cours.
 *  - Du 16 novembre au 31 juillet : le compte à rebours, les boutons/offres de réduction,
 *    le bandeau promo du header et les libellés « Promo −50% » ne sont PAS rendus.
 *  - Le 1er août suivant, tout réapparaît automatiquement (aucune modification manuelle).
 *
 * Utilisation (côté serveur, à chaque requête) :
 *    const promo = getPromo();
 *    {promo.active && <div class="promo-only" data-promo-deadline={promo.deadline}>…</div>}
 *
 * Règle d'équipe : tout nouvel élément lié à la promo doit
 *  1. être conditionné par `promo.active`,
 *  2. porter la classe CSS `promo-only` (le JS client la retire si l'échéance passe pendant la visite).
 *
 * Remarque : le Maroc est en GMT+1 la majeure partie de l'année. La fin « 23:59:59 UTC »
 * correspond donc à 00:59:59 le 16 novembre à Casablanca. Pour finir à minuit locale,
 * remplacer 23, 59, 59 par 22, 59, 59 dans `end` ci-dessous.
 */
export type PromoState = {
  /** true uniquement entre le 1er août et le 15 novembre (UTC). */
  active: boolean;
  /** Fin du compte à rebours (ISO 8601 UTC) : 15 novembre de l'année en cours. */
  deadline: string;
  /** Rentrée visée, ex. « 2026-2027 ». Passe à l'année suivante après le 15 novembre. */
  rentree: string;
  /** Texte du bandeau promo du header (à utiliser dans Header.tsx / Layout.tsx). */
  text: string;
};

export function getPromo(now: Date = new Date()): PromoState {
  const y = now.getUTCFullYear();
  const start = Date.UTC(y, 7, 1, 0, 0, 0); // 1er août (mois 7 = août, base 0)
  const end = Date.UTC(y, 10, 15, 23, 59, 59); // 15 novembre (mois 10 = novembre)
  const t = now.getTime();

  const ref = t > end ? y + 1 : y; // après le 15 nov., on vise la rentrée suivante
  const rentree = `${ref}-${ref + 1}`;

  return {
    active: t >= start && t <= end,
    deadline: new Date(end).toISOString(),
    rentree,
    text: `📢 Offre de lancement Rentrée ${rentree} : packs d'admission à prix cassés — places et tarifs limités !`
  };
}

/** Lien WhatsApp avec message pré-rempli (optionnel). */
export function waLink(text?: string): string {
  const base = `https://wa.me/${SITE.phoneRaw}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export type NavLink = { label: string; href: string };

/** Menu principal (desktop + mobile) : liens essentiels uniquement. */
export const NAV_LINKS: NavLink[] = [
  { label: "Accueil", href: "/" },
  { label: "Parents", href: "/#parents" },
  { label: "Universités", href: "/universites" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "Contact", href: "/contact" }
];
/** Colonne « Navigation » du footer. */
export const FOOTER_LINKS: NavLink[] = [
  { label: "Accueil", href: "/" },
  { label: "Espace Parents", href: "/#parents" },
  { label: "Universités Privées", href: "/universites" },
  { label: "Tarifs par Pays", href: "/tarifs" },
  { label: "Packs et Navette Aéroport", href: "/tarifs#packs" },
  { label: "Avis et Témoignages", href: "/#avis" },
  { label: "Contact", href: "/contact" },
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/politique-confidentialite" },
  { label: "CGV", href: "/cgv" }
];

/** Colonne « Grandes Écoles Privées » du footer. */
export const FOOTER_SCHOOLS: NavLink[] = [
  { label: "UEMF Euromed Fès", href: "/universites" },
  { label: "ESTEM Casablanca", href: "/universites" },
  { label: "UIASS Santé Rabat", href: "/universites" },
  { label: "ESCA Management CFC", href: "/universites" },
  { label: "EMSI Maroc (Honoris)", href: "/universites" },
  { label: "UIR Rabat et UM6P", href: "/universites" }
];

/** Réseaux sociaux affichés dans le footer : uniquement TikTok et WhatsApp. */
export const SOCIAL_LINKS = [
  { label: "WhatsApp", icon: "fab fa-whatsapp", href: "https://wa.me/212789095498" },
  { label: "TikTok", icon: "fab fa-tiktok", href: "https://www.tiktok.com/@willou_osean" }
] as const;
