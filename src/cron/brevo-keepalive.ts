// src/cron/brevo-keepalive.ts
// Envoie 1 e-mail de contrôle par mois via l'API Brevo (Cloudflare Workers, cron).
// Variables lues : BREVO_API_KEY, BREVO_FROM_EMAIL, BREVO_FROM_NAME (optionnel),
//                  BREVO_COMPANY_EMAIL, BREVO_LOGO_URL (optionnel), PUBLIC_SITE_URL (optionnel)
//
// URL du site : le cron n'a pas de requête, donc il lit PUBLIC_SITE_URL (1 à 3 adresses séparées
// par des virgules), teste chaque adresse dans l'ordre et utilise la première qui répond.
// Si aucune ne répond : workers.dev (il existe tant que le Worker est déployé).
// Un domaine inexistant ou en panne ne bloque JAMAIS l'envoi de l'e-mail.

import { parseSiteUrls } from "../lib/env";

export interface BrevoEnv {
  BREVO_API_KEY: string;
  BREVO_FROM_EMAIL: string;
  BREVO_FROM_NAME?: string;
  BREVO_COMPANY_EMAIL: string;
  BREVO_LOGO_URL?: string;
  /** 1 à 3 adresses du site séparées par des virgules. */
  PUBLIC_SITE_URL?: string;
}

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const MAX_ATTEMPTS = 3;

const COM_URL = "https://wickaassistance.com";
const WORKERS_DEV_URL = "https://wickaassistance.wickaassistance.workers.dev";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Une adresse est "vivante" si elle répond (toute réponse < 500) avant le délai. */
async function isReachable(url: string, timeoutMs = 5000): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
    });
    return res.status < 500;
  } catch {
    return false;
  }
}

/** Retourne la première adresse du site qui fonctionne ; workers.dev en dernier recours. */
export async function resolveSiteUrl(env: BrevoEnv): Promise<string> {
  const configured = parseSiteUrls(env.PUBLIC_SITE_URL);
  const candidates = configured.length > 0 ? configured : [COM_URL, WORKERS_DEV_URL];

  for (const url of candidates) {
    if (await isReachable(url)) return url;
    console.warn(`[brevo-cron] ${url} ne répond pas, essai de l'adresse suivante`);
  }
  return WORKERS_DEV_URL;
}

function buildHtml(site: string, logoUrl: string, dateFr: string): string {
  return `<!doctype html>
<html lang="fr">
  <body style="font-family:Arial,Helvetica,sans-serif;color:#1e293b;line-height:1.6">
    <img src="${logoUrl}" alt="Wicka Assistance" height="48" style="margin-bottom:16px">
    <h2 style="color:#9f1239;margin:0 0 12px">Contrôle mensuel : envoi d'e-mails opérationnel</h2>
    <p>Bonjour,</p>
    <p>Ce message automatique confirme que l'API Brevo et la configuration d'envoi
       du site <strong>${site}</strong> fonctionnent correctement.</p>
    <p><strong>Date du contrôle :</strong> ${dateFr}</p>
    <p style="font-size:13px;color:#64748b">Aucune action n'est requise.
       Si vous ne recevez plus ce message chaque mois, vérifiez la clé API Brevo
       et les variables du Worker.</p>
  </body>
</html>`;
}

export async function sendMonthlyBrevoCheck(env: BrevoEnv): Promise<void> {
  const required = ["BREVO_API_KEY", "BREVO_FROM_EMAIL", "BREVO_COMPANY_EMAIL"] as const;
  const missing = required.filter((k) => !env[k]);
  if (missing.length > 0) {
    throw new Error(`[brevo-cron] Variables manquantes : ${missing.join(", ")}`);
  }

  const site = await resolveSiteUrl(env);

  // Le logo configuré n'est utilisé que s'il appartient à l'adresse qui fonctionne ;
  // sinon on le reconstruit à partir de cette adresse.
  const configuredLogo = env.BREVO_LOGO_URL?.trim();
  const logoUrl =
    configuredLogo && configuredLogo.startsWith(site)
      ? configuredLogo
      : `${site}/assets/images/logo.png`;

  const dateFr = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Africa/Casablanca",
  }).format(new Date());

  const payload = {
    sender: {
      name: env.BREVO_FROM_NAME || "Wicka Assistance",
      email: env.BREVO_FROM_EMAIL,
    },
    to: [{ email: env.BREVO_COMPANY_EMAIL }],
    subject: "✅ Contrôle mensuel Brevo : Wicka Assistance",
    htmlContent: buildHtml(site, logoUrl, dateFr),
    tags: ["cron-monthly-check"],
  };

  let lastError = "";
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(BREVO_ENDPOINT, {
        method: "POST",
        headers: {
          "api-key": env.BREVO_API_KEY,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = (await res.json().catch(() => ({}))) as { messageId?: string };
        console.log(
          `[brevo-cron] OK (tentative ${attempt}) site=${site} messageId=${data.messageId ?? "n/a"}`
        );
        return;
      }

      lastError = `HTTP ${res.status} ${await res.text()}`;
      // 4xx (sauf 429) : inutile de réessayer (clé invalide, expéditeur non validé...)
      if (res.status >= 400 && res.status < 500 && res.status !== 429) break;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }

    console.warn(`[brevo-cron] Échec tentative ${attempt}/${MAX_ATTEMPTS} : ${lastError}`);
    if (attempt < MAX_ATTEMPTS) await sleep(attempt * 2000);
  }

  // On lève l'erreur pour que Cloudflare marque l'exécution du cron en échec (visible dans Observability).
  throw new Error(`[brevo-cron] Échec définitif : ${lastError}`);
}
