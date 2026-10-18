/**
 * Wicka Assistance - Section TikTok
 *
 * Ce script n'est chargé que s'il existe une vidéo (config/tiktok.ts : videoId renseigné).
 *
 * La vidéo n'est chargée qu'au clic sur ▶ (aucun script ni traceur TikTok au chargement).
 * - Le clic lance le lecteur TikTok dans la page.
 * - Ctrl/Cmd/Maj + clic : ouvre simplement TikTok dans un nouvel onglet.
 * - Si l'aperçu (assets/images/tiktok-preview.jpg) est introuvable, la carte garde son fond
 *   dégradé rose avec le bouton ▶ (aucune image de secours).
 *
 * Nécessite : frame-src https://www.tiktok.com dans la CSP (worker/index.js).
 */
document.addEventListener('DOMContentLoaded', () => {
  const link = document.querySelector('[data-tiktok-play]');
  if (!link) return;

  const card = link.closest('.tiktok-card');
  const img = link.querySelector('img');

  /* ---------- Image : si l'aperçu est introuvable, on le retire (le fond rose reste) ---------- */
  if (img) {
    const hideImg = () => { img.style.display = 'none'; };
    img.addEventListener('error', hideImg);
    // L'erreur a pu se produire avant que le script soit prêt
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) hideImg();
  }

  /* ---------- Vidéo : lecteur TikTok au clic ---------- */
  const match = (link.getAttribute('href') || '').match(/\/video\/(\d+)/);
  if (!match) return;

  const videoId = match[1];

  link.addEventListener('click', (event) => {
    // Laisse le comportement normal pour Ctrl/Cmd/Maj + clic et clic molette
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) return;
    event.preventDefault();
    if (!card) return;

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.tiktok.com/player/v1/${videoId}?autoplay=1&rel=0&description=1`;
    iframe.title = 'Vidéo TikTok Wicka Assistance';
    iframe.allow = 'autoplay; fullscreen; encrypted-media';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';

    card.replaceChildren(iframe);
  });
});
