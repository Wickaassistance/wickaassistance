/**
 * Configuration TikTok : SEUL endroit à modifier pour changer le compte, la vidéo ou l'aperçu.
 * Utilisé par la section d'accueil (pages/TikTokSection.tsx), le footer (layout/Footer.tsx)
 * et les données structurées (seo/jsonld.ts).
 */
const handle = "willou_osean"; // sans le @
const videoId = ""; // numéro à la fin du lien .../video/123456... ; laisser "" s'il n'y a pas de vidéo

const profileUrl = `https://www.tiktok.com/@${handle}`;

export const TIKTOK = {
  handle,
  videoId,
  profileUrl,
  /** Lien de la vidéo ; sans vidéo, la carte ouvre le profil. */
  videoUrl: videoId ? `${profileUrl}/video/${videoId}` : profileUrl,
  /** Aperçu réel à déposer dans public/assets/images/. */
  previewSrc: "/assets/images/tiktok-preview.jpg",
  /** Image déjà présente dans le dépôt : affichée seulement si l'aperçu réel est introuvable. */
  fallbackSrc: "/assets/uni/student-portrait.jpg"
} as const;
