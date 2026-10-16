export const contactMeta = {
  title: "Contact | Étudier au Maroc avec Wicka Assistance",
  description:
    "Une question sur les études, l’admission, le visa ou la vie étudiante au Maroc ? Contactez l’équipe Wicka Assistance.",
  keywords:
    "contact études Maroc, conseiller étudiant Maroc, admission internationale, visa étudiant Maroc, orientation scolaire, Wicka Assistance"
};

export const Contact = () => (
  <section class="application-section">
    <div class="container">
      <div class="section-header">
        <span class="section-badge">
          <i class="fas fa-envelope"></i> Nous contacter
        </span>
        <h1 class="section-title">Parlons de votre projet</h1>
        <p class="section-subtitle">Envoyez-nous votre demande.</p>
      </div>
      <div class="app-form-box contact-box">
        <form id="contactForm" novalidate>
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label" for="contactName">
                Nom complet *
              </label>
              <input class="form-input" id="contactName" name="name" type="text" minlength={2} maxlength={100} required />
              <small class="field-message" data-error-for="contactName"></small>
            </div>
            <div class="form-group">
              <label class="form-label" for="contactEmail">
                Adresse e-mail *
              </label>
              <input
                class="form-input"
                id="contactEmail"
                name="email"
                type="email"
                maxlength={160}
                autocomplete="email"
                required
              />
              <small class="field-message" data-error-for="contactEmail"></small>
            </div>
          </div>
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label" for="contactPhone">
                Téléphone / WhatsApp *
              </label>
              <input
                class="form-input"
                id="contactPhone"
                name="phone"
                type="tel"
                inputmode="tel"
                maxlength={25}
                placeholder="+221 77 000 00 00"
                required
              />
              <small class="field-message" data-error-for="contactPhone"></small>
            </div>
            <div class="form-group">
              <label class="form-label" for="contactSubject">
                Sujet *
              </label>
              <input
                class="form-input"
                id="contactSubject"
                name="subject"
                type="text"
                minlength={3}
                maxlength={160}
                required
              />
              <small class="field-message" data-error-for="contactSubject"></small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="contactMessage">
              Votre message *
            </label>
            <textarea
              class="form-input"
              id="contactMessage"
              name="message"
              rows={7}
              minlength={10}
              maxlength={4000}
              required
            ></textarea>
            <small class="field-message" data-error-for="contactMessage"></small>
          </div>
          <label class="legal-consent">
            <input id="contactConsent" name="consent" value="accepted" type="checkbox" required />{" "}
            <span>
              J’accepte que mes données soient utilisées pour répondre à ma demande, conformément à la{" "}
              <a href="/politique-confidentialite">politique de confidentialité</a>.
            </span>
          </label>
          <button class="btn-primary btn-full" type="submit" id="contactSubmit">
            <i class="fas fa-paper-plane"></i> Envoyer mon message
          </button>
          <p class="form-status" id="contactStatus" role="status" aria-live="polite"></p>
        </form>
      </div>
      <p class="legal-back">
        <a href="/">
          <i class="fas fa-arrow-left"></i> Retour à l’accueil
        </a>
      </p>
    </div>
  </section>
);
