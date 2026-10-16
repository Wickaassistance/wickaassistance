import type { Context } from "hono";
import { env } from "hono/adapter";

/** Variables d'environnement utilisées par le site (Cloudflare : c.env, Vercel : process.env). */
export type Env = {
  /** Domaine canonique public, sans slash final. Vide = origine de la requête. */
  PUBLIC_SITE_URL?: string;
  /** Brevo : clé API (secret). */
  BREVO_API_KEY?: string;
  /** Brevo : adresse expéditrice vérifiée. */
  BREVO_FROM_EMAIL?: string;
  /** Brevo : nom affiché par l'expéditeur. */
  BREVO_FROM_NAME?: string;
  /** Adresse de réception de l'entreprise. */
  BREVO_COMPANY_EMAIL?: string;
  /** URL absolue du logo affiché dans les e-mails. */
  BREVO_LOGO_URL?: string;
};

/** Lit les variables sur Cloudflare ET sur Vercel avec le même code. */
export function getEnv(c: Context): Env {
  return env<Env>(c);
}

/** Origine publique du site (sans slash final). */
export function siteOrigin(c: Context): string {
  const configured = getEnv(c).PUBLIC_SITE_URL;
  return String(configured || new URL(c.req.url).origin)
    .trim()
    .replace(/\/+$/, "");
}
