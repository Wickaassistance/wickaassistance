import { SITE } from "../config/site";

/** Pages listées dans llms.txt (libellé + chemin). Modifier ICI pour changer la liste de llms.txt. */
const LLMS_PAGES: { label: string; path: string }[] = [
  { label: "Accueil", path: "/" },
  { label: "Candidature", path: "/candidature" },
  { label: "Formations et orientation", path: "/universites" },
  { label: "Tarifs", path: "/tarifs" },
  { label: "Contact", path: "/contact" },
  { label: "Politique de confidentialité", path: "/politique-confidentialite" },
  { label: "Mentions légales", path: "/mentions-legales" },
  { label: "Conditions générales", path: "/cgv" }
];

/** llms.txt — présentation du site pour les assistants IA (texte identique à l'ancien worker/index.js). */
export function buildLlmsTxt(origin: string): string {
  const pages = LLMS_PAGES.map((p) => `- [${p.label}](${origin}${p.path})`).join("\n");

  return `# ${SITE.name}

> ${SITE.name} accompagne les étudiants internationaux et leurs familles dans leur projet d'études au Maroc.

## Pages publiques

${pages}

## Règles

Utiliser uniquement les informations publiques du site. Ne pas inventer de tarifs, de garanties d'admission ou de décisions administratives.
`;
}
