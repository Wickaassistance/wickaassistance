import type { Child } from "hono/jsx";
import { Head } from "./Head";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingActions } from "./FloatingActions";
import { CookieBanner } from "./CookieBanner";

export type LayoutProps = {
  origin: string;
  path: string;
  title: string;
  description: string;
  keywords?: string;
  noindex?: boolean;
  /** Ajoute les données structurées JSON-LD (accueil uniquement). */
  structuredData?: boolean;
  /** Émet <link rel="canonical"> et og:url (défaut : true). */
  canonical?: boolean;
  children?: Child;
};

/**
 * Gabarit UNIQUE de toutes les pages (y compris la page 404) :
 * <head> SEO + bandeau promo + header + <main> + footer + WhatsApp flottant + modals + scripts + bannière cookies.
 * Header, footer et modals ne sont écrits qu'à un seul endroit (src/layout/).
 */
export const Layout = ({ origin, path, title, description, keywords, noindex, structuredData, canonical, children }: LayoutProps) => (
  <html lang="fr">
    <Head
      origin={origin}
      path={path}
      title={title}
      description={description}
      keywords={keywords}
      noindex={noindex}
      structuredData={structuredData}
      canonical={canonical}
    />
    <body>
      <Header path={path} />
      <main>{children}</main>
      <Footer />
      <FloatingActions />
      <script src="/js/data.js"></script>
      <script src="/js/main.js"></script>
      <CookieBanner />
    </body>
  </html>
);
