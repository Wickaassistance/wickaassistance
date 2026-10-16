import type { PageDef } from "../pages";

const xmlEscape = (value: string) =>
  value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[ch] as string);

/** sitemap.xml — généré à partir du registre des pages (priorité et fréquence définies par page). */
export function buildSitemapXml(origin: string, pages: PageDef[]): string {
  const urls = pages
    .filter((p) => !p.noindex)
    .map(
      (p) =>
        `  <url><loc>${xmlEscape(origin + p.path)}</loc><priority>${p.priority}</priority><changefreq>${p.changefreq}</changefreq></url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
