import { Hono } from "hono";
import type { AppEnv } from "../types";
import { pages } from "../pages";
import { buildRobotsTxt } from "../seo/robots";
import { buildSitemapXml } from "../seo/sitemap";
import { buildLlmsTxt } from "../seo/llms";

/** Routes /sitemap.xml, /robots.txt et /llms.txt (le contenu est dans src/seo/). */
export const seo = new Hono<AppEnv>();

const CACHE = "public, max-age=300";

seo.get("/sitemap.xml", (c) =>
  c.body(buildSitemapXml(c.get("origin"), pages), 200, {
    "content-type": "application/xml; charset=UTF-8",
    "cache-control": CACHE
  })
);

seo.get("/robots.txt", (c) =>
  c.body(buildRobotsTxt(c.get("origin"), pages), 200, {
    "content-type": "text/plain; charset=UTF-8",
    "cache-control": CACHE
  })
);

seo.get("/llms.txt", (c) =>
  c.body(buildLlmsTxt(c.get("origin")), 200, {
    "content-type": "text/plain; charset=UTF-8",
    "cache-control": CACHE
  })
);
