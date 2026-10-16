// Point d'entrée Vercel (vercel.json redirige toutes les routes vers /api).
// Cloudflare utilise séparément src/worker.ts et son runtime Worker.
import app from "../src/app";

type VercelRequest = {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  [key: string]: unknown;
};

type VercelResponse = {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(body?: string | Uint8Array): void;
};

export const config = { runtime: "nodejs" };

/** Adaptateur Node.js Vercel -> Fetch API utilisée par Hono. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const forwardedHost = req.headers["x-forwarded-host"];
  const host = forwardedHost || req.headers.host || "localhost";
  const protocol = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto || "https";
  const hostValue = Array.isArray(host) ? host[0] : host;
  const requestUrl = new URL(req.url || "/", `${protocol}://${hostValue}`);

  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (value !== undefined) headers.set(name, Array.isArray(value) ? value.join(", ") : value);
  }

  const method = (req.method || "GET").toUpperCase();
  const init: RequestInit = {
    method,
    headers,
    body: method === "GET" || method === "HEAD" ? undefined : (req as unknown as BodyInit)
  };
  // Node.js exige duplex=half lorsqu'un flux de requête est utilisé comme body.
  (init as RequestInit & { duplex?: "half" }).duplex = "half";

  const response = await app.fetch(new Request(requestUrl, init));
  res.statusCode = response.status;
  response.headers.forEach((value, name) => res.setHeader(name, value));
  res.end(new Uint8Array(await response.arrayBuffer()));
}
