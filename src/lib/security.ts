import type { MiddlewareHandler } from "hono";

const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "img-src 'self' data: https:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
  "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
  "script-src 'self' 'unsafe-inline'",
  // Lecteur TikTok : autorisé uniquement en iframe, et chargé seulement après un clic du visiteur (public/js/tiktok.js)
  "frame-src https://www.tiktok.com",
  "connect-src 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests"
].join("; ");

/** En-têtes de sécurité appliqués à toutes les réponses du Worker. */
export const securityHeaders: MiddlewareHandler = async (c, next) => {
  c.header("x-content-type-options", "nosniff");
  c.header("referrer-policy", "strict-origin-when-cross-origin");
  c.header("permissions-policy", "camera=(), microphone=(), geolocation=()");
  c.header("x-frame-options", "SAMEORIGIN");
  c.header("content-security-policy", CSP);
  await next();
};

/**
 * Refuse (403) les requêtes dont l'en-tête Origin ne correspond pas au site.
 * Origines acceptées :
 *  - l'origine du site calculée par siteOrigin() (ex : https://wickaassistance.com),
 *  - l'origine réelle de la requête (ex : https://www.wickaassistance.com ou le domaine workers.dev).
 * Ainsi les formulaires fonctionnent sur chaque domaine du site (.com, www, workers.dev),
 * tandis qu'un site tiers reste refusé.
 */
export const requireSameOrigin: MiddlewareHandler = async (c, next) => {
  const originHeader = c.req.header("Origin");
  if (originHeader) {
    const allowed = new Set<string>([c.get("origin"), new URL(c.req.url).origin]);
    if (!allowed.has(originHeader)) {
      return c.json({ error: "Origine non autorisée." }, 403);
    }
  }
  await next();
};
