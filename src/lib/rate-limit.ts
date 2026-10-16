import type { MiddlewareHandler } from "hono";

type Window = { startedAt: number; count: number };

// Mémoire par instance (suffisant pour un formulaire de contact).
const windows = new Map<string, Window>();

function clientKey(c: Parameters<MiddlewareHandler>[0]): string {
  return (
    c.req.header("CF-Connecting-IP") ||
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
    c.req.header("x-real-ip") ||
    "unknown"
  );
}

/** Limite le nombre de requêtes par IP et par fenêtre de temps. */
export function rateLimit(max = 8, windowMs = 60_000): MiddlewareHandler {
  return async (c, next) => {
    const now = Date.now();
    const key = clientKey(c);

    if (windows.size > 10_000) {
      for (const [k, v] of windows) {
        if (now - v.startedAt >= windowMs) windows.delete(k);
      }
    }

    const current = windows.get(key);
    if (!current || now - current.startedAt >= windowMs) {
      windows.set(key, { startedAt: now, count: 1 });
    } else {
      current.count += 1;
      if (current.count > max) {
        c.header("retry-after", String(Math.ceil(windowMs / 1000)));
        return c.json({ error: "Trop de demandes. Réessayez plus tard." }, 429);
      }
    }
    await next();
  };
}
