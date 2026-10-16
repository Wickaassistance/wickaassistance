import { FOOTER_LINKS, FOOTER_SCHOOLS, SITE, SOCIAL_LINKS, waLink } from "../config/site";

/** Footer commun à toutes les pages. Liens et coordonnées : config/site.ts. */
export const Footer = () => (
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="brand-logo">
            <img class="brand-image" src={SITE.logo} alt={SITE.name} width="52" height="44" />
            <div class="brand-text-wrap">
              <span class="brand-title">
                WICKA<span class="text-rose">.</span>
              </span>
              <span class="brand-subtitle">
                {SITE.tagline}
              </span>
            </div>
          </div>
          <p>
            Cabinet d'orientation, d'admission en grandes écoles privées et de navette VIP pour les étudiants
            internationaux au Maroc.
          </p>
          <div class="footer-social-links">
            {SOCIAL_LINKS.map((s) => (
              <a href={s.href} class="social-icon-btn" aria-label={s.label}>
                <i class={s.icon}></i>
              </a>
            ))}
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              class="social-icon-btn"
              aria-label="WhatsApp"
            >
              <i class="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>

        <div>
          <h4 class="footer-col-title">Navigation</h4>
          <ul class="footer-links-list">
            {FOOTER_LINKS.map((l) => (
              <li>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 class="footer-col-title">Grandes Écoles Privées</h4>
          <ul class="footer-links-list">
            {FOOTER_SCHOOLS.map((l) => (
              <li>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 class="footer-col-title">Contact & Bureaux au Maroc</h4>
          <div class="footer-contact-info">
            {SITE.offices.map((o) => (
              <div class="contact-line">
                <i class="fas fa-map-marker-alt"></i>
                <span>
                  <strong>{o.city} :</strong> {o.address}
                </span>
              </div>
            ))}
            <div class="contact-line">
              <i class="fab fa-whatsapp"></i>
              <a href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
            <div class="contact-line">
              <i class="far fa-envelope"></i>
              <span>{SITE.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom-bar">
        <span>© {SITE.copyrightYear} {SITE.name}. Tous droits réservés.</span>
      </div>
    </div>
  </footer>
);
