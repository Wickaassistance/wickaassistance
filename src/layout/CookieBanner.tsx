/** Bannière de consentement (stockage local uniquement). Logique : public/js/main.js → initCookieBanner(). */
export const CookieBanner = () => (
  <aside
    class="cookie-banner"
    data-cookie-banner
    role="dialog"
    aria-labelledby="cookie-title"
    aria-describedby="cookie-description"
    hidden
  >
    <div class="cookie-banner-content">
      <p class="cookie-banner-title" id="cookie-title">
        Votre confidentialité compte
      </p>
      <p id="cookie-description">
        Nous utilisons uniquement le stockage local nécessaire pour mémoriser votre choix. Aucun cookie publicitaire ou
        outil de suivi n’est installé.
      </p>
      <a href="/politique-confidentialite#cookies">En savoir plus</a>
    </div>
    <div class="cookie-banner-actions">
      <button type="button" class="btn-secondary cookie-choice" data-cookie-choice="reject">
        Refuser
      </button>
      <button type="button" class="btn-primary cookie-choice" data-cookie-choice="accept">
        Accepter
      </button>
    </div>
  </aside>
);
