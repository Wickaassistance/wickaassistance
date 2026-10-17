/**
 * Wicka Assistance - Section TikTok
 *
 * 1) IMAGE : la carte affiche d'abord l'aperçu réel (assets/images/tiktok-preview.jpg).
 *    Si ce fichier n'existe pas (ou ne charge pas), on affiche UNE FOIS l'image de secours
 *    déjà présente dans le dépôt (attribut data-fallback-src). Dès que le vrai fichier existe,
 *    l'image de secours n'est plus jamais utilisée.
 *
 * 2) VIDÉO : la vidéo n'est chargée qu'au clic sur ▶ (aucun script ni traceur TikTok au chargement).
 *    - Lien vidéo valide (…/video/123456…) : le clic lance le lecteur TikTok dans la page.
 *    - Lien vidéo absent ou invalide (placeholder) : le ▶ est masqué et la carte ouvre le profil TikTok.
 *    - Ctrl/Cmd/Maj + clic : ouvre simplement TikTok dans un nouvel onglet.
 *
 * Nécessite : frame-src https://www.tiktok.com dans la CSP (worker/index.js).
 */
document.addEventListener('DOMContentLoaded', () => {
  const link = document.querySelector('[data-tiktok-play]');
  if (!link) return;

  const card = link.closest('.tiktok-card');
  const img = link.querySelector('img');

  /* ---------- 1) Image : vraie image d'abord, secours seulement si elle manque ---------- */
  if (img) {
    const fallback = img.getAttribute('data-fallback-src');
    let fallbackUsed = false;

    const useFallback = () => {
      if (!fallback || fallbackUsed) return;
      fallbackUsed = true;
      img.src = fallback;
      img.alt = 'Vie étudiante au Maroc';
    };

    img.addEventListener('error', useFallback);
    // L'erreur a pu se produire avant que le script soit prêt
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) useFallback();
  }

  /* ---------- 2) Vidéo : valide = lecteur au clic, sinon on renvoie vers le profil ---------- */
  const match = (link.getAttribute('href') || '').match(/\/video\/(\d+)/);

  if (!match) {
    const profile = link.getAttribute('data-profile-url');
    if (profile) link.setAttribute('href', profile);
    if (card) card.classList.add('is-no-video');
    link.setAttribute('aria-label', 'Voir notre compte TikTok');
    return;
  }

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
