import { FOOTER_LINKS, FOOTER_PROJECTS, LEGAL_LINKS, SITE, SOCIAL_LINKS, waLink } from "../config/site";

/** Footer commun à toutes les pages : contenu court, contacts cliquables et liens légaux regroupés. */
export const Footer = () => (
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="brand-logo">
            <img class="brand-image" src={SITE.logo} alt={SITE.name} width="52" height="44" />
            <div class="brand-text-wrap">
              <span class="brand-title">WICKA<span class="text-rose">.</span></span>
              <span class="brand-subtitle">{SITE.tagline}</span>
            </div>
          </div>
          <p>Accompagnement des étudiants internationaux au Maroc : orientation, inscription, visa, accueil à l'aéroport, carte consulaire et carte de séjour.</p>
          <div class="footer-social-links">
            {SOCIAL_LINKS.map((s) => (
              <a href={s.href} target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label={s.label}>
                <i class={s.icon}></i>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 class="footer-col-title">Navigation</h4>
          <ul class="footer-links-list">
            {FOOTER_LINKS.map((l) => <li><a href={l.href}>{l.label}</a></li>)}
          </ul>
        </div>
        <div>
          <h4 class="footer-col-title">Votre projet</h4>
          <ul class="footer-links-list">
            {FOOTER_PROJECTS.map((l) => <li><a href={l.href}>{l.label}</a></li>)}
          </ul>
        </div>
        <div>
          <h4 class="footer-col-title">Nous contacter</h4>
          <div class="footer-contact-info">
            {SITE.offices.map((o) => (
              <div class="contact-line"><i class="fas fa-map-marker-alt"></i><span><strong>{o.city} :</strong> {o.address}</span></div>
            ))}
            <div class="contact-line"><i class="fab fa-whatsapp"></i><a href={waLink()} target="_blank" rel="noopener noreferrer">{SITE.phone}</a></div>
            <div class="contact-line"><i class="far fa-envelope"></i><a href={`mailto:${SITE.email}`}>{SITE.email}</a></div>
            <p class="footer-response-time">Réponse sous 72 h maximum.</p>
          </div>
        </div>
      </div>
      <div class="footer-bottom-bar">
        <span class="footer-copyright">© {SITE.copyrightYear} {SITE.name}. Tous droits réservés.</span>
        <nav class="footer-legal-links" aria-label="Informations légales">
          {LEGAL_LINKS.map((l) => <a href={l.href}>{l.label}</a>)}
        </nav>
      </div>
    </div>
  </footer>
);
