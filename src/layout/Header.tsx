import { NAV_LINKS, SITE, waLink } from "../config/site";

const Brand = () => (
  <>
    <img class="brand-image" src={SITE.logo} alt={SITE.name} width="52" height="44" />
    <div class="brand-text-wrap">
      <span class="brand-title">
        WICKA<span class="text-rose">.</span>
      </span>
      <span class="brand-subtitle">{SITE.tagline}</span>
    </div>
  </>
);

/** Bandeau promo + header + menu mobile. Le menu se modifie dans config/site.ts (NAV_LINKS). */
export const Header = ({ path }: { path: string }) => (
  <>
    <div class="top-notice-bar">
      <div class="container notice-content">
        <div class="notice-left">
          <span class="notice-tag">{SITE.promo.tag}</span>
          <span>{SITE.promo.text}</span>
        </div>
        <div class="notice-right">
          <a href={waLink()} target="_blank" rel="noopener noreferrer" class="notice-contact">
            <i class="fab fa-whatsapp text-rose-300"></i> {SITE.phone}
          </a>
          <a href={`mailto:${SITE.email}`} class="notice-contact">
            <i class="far fa-envelope"></i> {SITE.email}
          </a>
        </div>
      </div>
    </div>

    <header class="site-header" id="siteHeader">
      <div class="container">
        <nav class="navbar" aria-label="Navigation principale">
          <a href="/" class="brand-logo">
            <Brand />
          </a>

          <ul class="nav-links">
            {NAV_LINKS.map((link) => (
              <li>
                <a href={link.href} class={link.href === path ? "nav-link active" : "nav-link"}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div class="nav-actions">
            <button type="button" class="nav-callback-btn" id="triggerCallbackModal">
              <i class="fas fa-phone-alt"></i>
              <span>Être Rappelé</span>
            </button>
            <a href="/candidature" class="btn-primary btn-sm">
              <i class="fas fa-paper-plane"></i>
              <span>Postuler</span>
            </a>
            <button type="button" class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Ouvrir le menu">
              <i class="fas fa-bars"></i>
            </button>
          </div>
        </nav>
      </div>
    </header>

    <div class="mobile-menu-drawer" id="mobileMenu">
      <div class="drawer-header">
        <div class="brand-logo">
          <Brand />
        </div>
        <button type="button" class="drawer-close-btn" id="mobileMenuClose" aria-label="Fermer le menu">
          ×
        </button>
      </div>
      <div class="mobile-nav-links">
        {NAV_LINKS.map((link) => (
          <a href={link.href} class="mobile-nav-link">
            {link.label} <i class="fas fa-chevron-right"></i>
          </a>
        ))}
      </div>
      <div style="margin-top: auto; display: flex; flex-direction: column; gap: 12px;">
        <a href="/candidature" class="btn-primary btn-full mobile-nav-link">
          <i class="fas fa-paper-plane"></i> Démarrer ma Candidature
        </a>
        <a href={waLink()} target="_blank" rel="noopener noreferrer" class="btn-secondary btn-full">
          <i class="fab fa-whatsapp text-rose"></i> Conseiller WhatsApp Direct ({SITE.phone})
        </a>
      </div>
    </div>
  </>
);
