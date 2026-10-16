import type { PageDef } from "../pages";

/** robots.txt — généré à partir du registre des pages (les pages `noindex` sont interdites). */
export function buildRobotsTxt(origin: string, pages: PageDef[]): string {
  const blocked = pages.filter((p) => p.noindex).map((p) => `Disallow: ${p.path}`);
  return ["User-agent: *", "Allow: /", "Disallow: /api/", ...blocked, "", `Sitemap: ${origin}/sitemap.xml`, ""].join("\n");
}
