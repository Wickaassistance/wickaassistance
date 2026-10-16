import type { FC } from "hono/jsx";
import { Home, homeMeta } from "./Home";
import { Candidature, candidatureMeta } from "./Candidature";
import { Universites, universitesMeta } from "./Universites";
import { Tarifs, tarifsMeta } from "./Tarifs";
import { Contact, contactMeta } from "./Contact";
import { MentionsLegales, mentionsLegalesMeta } from "./MentionsLegales";
import { PolitiqueConfidentialite, politiqueConfidentialiteMeta } from "./PolitiqueConfidentialite";
import { Cgv, cgvMeta } from "./Cgv";
import { Merci, merciMeta } from "./Merci";

export type PageDef = {
  path: string;
  title: string;
  description: string;
  keywords?: string;
  /** Priorité dans sitemap.xml. */
  priority: string;
  /** Fréquence dans sitemap.xml. */
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  /** Page exclue du sitemap et interdite dans robots.txt. */
  noindex?: boolean;
  /** Données structurées JSON-LD (défaut : false, accueil uniquement). */
  structuredData?: boolean;
  Component: FC;
};

/**
 * Registre des pages. Toutes utilisent le même gabarit (src/layout/Layout.tsx : header + footer communs).
 * Pour ajouter une page :
 *  1. créer src/pages/MaPage.tsx (export du composant + de ses métadonnées)
 *  2. l'ajouter ici : elle est alors servie et ajoutée au sitemap.
 *  3. (optionnel) l'ajouter dans src/seo/llms.ts
 * La page 404 (src/pages/NotFound.tsx) n'est pas dans ce registre : elle est servie par app.notFound.
 */
export const pages: PageDef[] = [
  { path: "/", priority: "1.0", changefreq: "monthly", structuredData: true, Component: Home, ...homeMeta },
  { path: "/candidature", priority: "0.9", changefreq: "monthly", Component: Candidature, ...candidatureMeta },
  { path: "/universites", priority: "0.8", changefreq: "monthly", Component: Universites, ...universitesMeta },
  { path: "/tarifs", priority: "0.8", changefreq: "monthly", Component: Tarifs, ...tarifsMeta },
  { path: "/contact", priority: "0.6", changefreq: "monthly", Component: Contact, ...contactMeta },
  { path: "/mentions-legales", priority: "0.2", changefreq: "monthly", Component: MentionsLegales, ...mentionsLegalesMeta },
  {
    path: "/politique-confidentialite",
    priority: "0.2",
    changefreq: "monthly",
    Component: PolitiqueConfidentialite,
    ...politiqueConfidentialiteMeta
  },
  { path: "/cgv", priority: "0.2", changefreq: "monthly", Component: Cgv, ...cgvMeta },
  { path: "/merci", priority: "0.1", changefreq: "never", noindex: true, Component: Merci, ...merciMeta }
];
