// Point d'entrée Cloudflare Workers (wrangler.toml : main = "src/worker.ts")
import app from "./app";
import { sendMonthlyBrevoCheck, type BrevoEnv } from "./cron/brevo-keepalive";

export default {
  // Requêtes HTTP : l'application Hono
  fetch: app.fetch,

  // Cron (wrangler.toml : [triggers] crons) : e-mail de contrôle Brevo une fois par mois
  async scheduled(
    _event: unknown,
    env: BrevoEnv,
    ctx: { waitUntil(promise: Promise<unknown>): void }
  ) {
    ctx.waitUntil(sendMonthlyBrevoCheck(env));
  },
};
 