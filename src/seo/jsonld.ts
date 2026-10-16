import { SITE } from "../config/site";

/** Données structurées schema.org (EducationalOrganization) de la page d'accueil. */
export function organizationJsonLd(origin: string) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE.name,
    url: `${origin}/`,
    logo: `${origin}${SITE.logo}`,
    description: "Orientation et accompagnement des étudiants internationaux pour leurs études au Maroc.",
    areaServed: ["Maroc", "Afrique de l’Ouest", "Afrique centrale", "France"],
    availableLanguage: ["fr"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: SITE.email,
      telephone: `+${SITE.phoneRaw}`,
      availableLanguage: "French"
    },
    sameAs: [`https://wa.me/${SITE.phoneRaw}`]
  };
}
