import type { Context } from "hono";
import { env } from "hono/adapter";

/** Variables d'environnement utilisées par le site (Cloudflare : c.env, Vercel : process.env). */
export type Env = {
  /**
   * Adresse(s) publique(s) du site : 1 à 3 URL séparées par une virgule (ou ; | espace).
   * Ex : "https://wickaassistance.com,https://wickaassistance.wickaassistance.workers.dev"
   * Le site utilise celle qui correspond au domaine visité. Vide = origine de la requête.
   */
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

/**
 * Transforme "https://a.com, https://b.workers.dev" en ["https://a.com", "https://b.workers.dev"].
 * Séparateurs acceptés : virgule, point-virgule, barre verticale, espace, retour à la ligne.
 * Ajoute https:// si absent, retire le chemin et le slash final, supprime les doublons, 3 adresses max.
 */
export function parseSiteUrls(raw?: string | null): string[] {
  const out: string[] = [];
  for (const part of String(raw ?? "").split(/[\s,;|]+/)) {
    const value = part.trim();
    if (!value) continue;
    try {
      const origin = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`).origin;
      if (!out.includes(origin)) out.push(origin);
    } catch {
      // adresse invalide : ignorée
    }
  }
  return out.slice(0, 3);
}

const stripWww = (host: string) => host.replace(/^www\./i, "");

/** Toutes les adresses configurées dans PUBLIC_SITE_URL (liste vide si non renseignée). */
export function siteOrigins(c: Context): string[] {
  return parseSiteUrls(getEnv(c).PUBLIC_SITE_URL);
}

/**
 * Origine publique du site (sans slash final) :
 * - si le domaine visité fait partie de PUBLIC_SITE_URL -> cette adresse (.com ou workers.dev)
 * - sinon (variable vide, localhost, aperçu Vercel...) -> l'origine de la requête, donc toujours une URL qui fonctionne.
 */
export function siteOrigin(c: Context): string {
  const request = new URL(c.req.url);
  const match = siteOrigins(c).find(
    (origin) => stripWww(new URL(origin).host) === stripWww(request.host)
  );
  return match ?? request.origin;
}
