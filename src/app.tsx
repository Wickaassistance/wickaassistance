import { Hono } from "hono";
import { raw } from "hono/html";
import type { FC } from "hono/jsx";
import type { AppEnv } from "./types";
import { siteOrigin } from "./lib/env";
import { requireSameOrigin, securityHeaders } from "./lib/security";
import { rateLimit } from "./lib/rate-limit";
import { seo } from "./routes/seo";
import { sendEmailHandler } from "./routes/send-email";
import { pages } from "./pages";
import { NotFound, notFoundMeta } from "./pages/NotFound";
import { Layout } from "./layout/Layout";

/**
 * Application unique, partagée par Cloudflare Workers (src/worker.ts) et Vercel (api/index.ts).
 */
const app = new Hono<AppEnv>();

type PageProps = {
  origin: string;
  path: string;
  title: string;
  description: string;
  keywords?: string;
  noindex?: boolean;
  structuredData?: boolean;
  canonical?: boolean;
  Component: FC;
};

/** Rend une page dans le gabarit commun (header + footer identiques partout). */
const renderPage = ({ Component, ...meta }: PageProps) => (
  <>
    {raw("<!DOCTYPE html>")}
    <Layout {...meta}>
      <Component />
    </Layout>
  </>
);

app.use("*", securityHeaders);
app.use("*", async (c, next) => {
  c.set("origin", siteOrigin(c));
  await next();
});

// /xxx.html -> /xxx (anciennes URLs) et /index.html -> /
app.get("*", async (c, next) => {
  const { pathname, search } = new URL(c.req.url);
  if (pathname.endsWith(".html")) {
    const clean = pathname.replace(/\.html$/, "").replace(/^\/index$/, "/") || "/";
    return c.redirect(clean + search, 301);
  }
  await next();
});

// API : méthode (405) -> limite de débit (429) -> origine (403) -> traitement
app.all(
  "/api/send-email",
  async (c, next) => {
    if (c.req.method !== "POST") return c.json({ error: "Méthode non autorisée." }, 405);
    await next();
  },
  rateLimit(8, 60_000),
  requireSameOrigin,
  sendEmailHandler
);

// SEO : sitemap.xml, robots.txt, llms.txt (contenu dans src/seo/)
app.route("/", seo);

// Pages (registre dans src/pages/index.tsx)
for (const page of pages) {
  app.get(page.path, (c) => c.html(renderPage({ ...page, origin: c.get("origin"), path: page.path })));
}

// 404 : fichiers statiques introuvables (images, css, js…) -> réponse simple ; sinon page 404 complète
app.notFound((c) => {
  if (/\.[a-z0-9]+$/i.test(c.req.path)) return c.text("Not found", 404);
  return c.html(
    renderPage({ ...notFoundMeta, origin: c.get("origin"), path: c.req.path, noindex: true, canonical: false, Component: NotFound }),
    404
  );
});

export default app;
