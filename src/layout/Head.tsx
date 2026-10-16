import { SITE } from "../config/site";
import { organizationJsonLd } from "../seo/jsonld";

export type HeadProps = {
  origin: string;
  path: string;
  title: string;
  description: string;
  keywords?: string;
  noindex?: boolean;
  /** Émet <link rel="canonical"> et og:url. Défaut : true (désactivé pour la page 404). */
  canonical?: boolean;
  /** Ajoute les données structurées JSON-LD. Défaut : false (accueil uniquement). */
  structuredData?: boolean;
};

/** <head> SEO commun : meta, canonical, Open Graph, Twitter, polices, feuilles de style, JSON-LD. */
export const Head = ({ origin, path, title, description, keywords, noindex, structuredData = false, canonical: withCanonical = true }: HeadProps) => {
  const canonical = `${origin}${path}`;
  const image = `${origin}${SITE.ogImage}`;

  return (
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords ?? SITE.defaultKeywords} />
      <meta name="author" content={SITE.name} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <meta name="theme-color" content={SITE.themeColor} />
      <link rel="icon" type="image/png" href={SITE.logo} />
      <link rel="apple-touch-icon" href={SITE.logo} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content={SITE.locale} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {withCanonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:alt" content="Étudiants internationaux préparant leurs études au Maroc" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {withCanonical && <link rel="canonical" href={canonical} />}

      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      />
      <link rel="stylesheet" href="/css/style.css" />
      <link rel="stylesheet" href="/css/responsive.css" />

      {structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(origin)) }} />
      )}
    </head>
  );
};
