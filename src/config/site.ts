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
  promo: {
    tag: "🔥 PROMO -50%",
    text: "📢 Offre de lancement Rentrée 2026-2027 : packs d'admission à prix cassés — places & tarifs limités !",
    stickyLabel: "Postuler (Promo −50%)",
    // Date de fin du compte à rebours (format ISO). À mettre à jour pour prolonger la promo.
    deadline: "2026-09-30T23:59:59"
  }
} as const;

/** Lien WhatsApp avec message pré-rempli (optionnel). */
export function waLink(text?: string): string {
  const base = `https://wa.me/${SITE.phoneRaw}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export type NavLink = { label: string; href: string };

/** Menu principal (desktop + mobile). */
export const NAV_LINKS: NavLink[] = [
  { label: "Accueil", href: "/" },
  { label: "Espace Parents", href: "/#parents" },
  { label: "Universités", href: "/universites" },
  { label: "Tarifs par Pays", href: "/tarifs" },
  { label: "Simulateur de Budget", href: "/tarifs#simulateur" },
  { label: "Packs & Navette", href: "/tarifs#packs" },
  { label: "Avis", href: "/#avis" },
  { label: "FAQ", href: "/#faq" }
];

/** Colonne « Navigation » du footer. */
export const FOOTER_LINKS: NavLink[] = [
  { label: "Accueil", href: "/" },
  { label: "Espace Parents", href: "/#parents" },
  { label: "Universités Privées", href: "/universites" },
  { label: "Tarifs par Pays", href: "/tarifs" },
  { label: "Packs & Navette Aéroport", href: "/tarifs#packs" },
  { label: "Avis & Témoignages", href: "/#avis" },
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
  { label: "UIR Rabat & UM6P", href: "/universites" }
];

/** Réseaux sociaux du footer ("#" = lien à renseigner). */
export const SOCIAL_LINKS = [
  { label: "Facebook", icon: "fab fa-facebook-f", href: "#" },
  { label: "Instagram", icon: "fab fa-instagram", href: "#" },
  { label: "LinkedIn", icon: "fab fa-linkedin-in", href: "#" }
] as const;
