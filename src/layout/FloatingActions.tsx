import { SITE, getPromo, waLink } from "../config/site";

/**
 * WhatsApp flottant, barre CTA mobile et modals (rappel + confirmation).
 * La bannière cookies est dans CookieBanner.tsx.
 *
 * PROMO : le libellé « Postuler (Promo −50%) » de la barre mobile n'est affiché que du
 * 1er août au 15 novembre (UTC). Hors période : « Postuler maintenant ».
 * data-full-text : js/main.js remplace le libellé promo par celui-ci à l'échéance (voir README).
 */
export const FloatingActions = () => {
  const promo = getPromo();
  const stickyFull = "Postuler maintenant";

  return (
    <>
      <a
        href={waLink("Bonjour Wicka Assistance, je souhaite des informations pour étudier au Maroc.")}
        target="_blank"
        rel="noopener noreferrer"
        class="floating-whatsapp-btn"
        aria-label="Contacter sur WhatsApp"
      >
        <i class="fab fa-whatsapp"></i>
        <span class="wa-badge-online" title="Conseiller WhatsApp en ligne"></span>
      </a>

      <div class="mobile-sticky-cta">
        <a href="/candidature" class="msc-btn msc-primary">
          <i class="fas fa-paper-plane"></i>{" "}
          <span data-full-text={stickyFull}>{promo.active ? SITE.promo.stickyLabel : stickyFull}</span>
        </a>
        <a
          href={waLink("Bonjour Wicka, je souhaite des infos pour étudier au Maroc.")}
          target="_blank"
          rel="noopener noreferrer"
          class="msc-btn msc-wa"
        >
          <i class="fab fa-whatsapp"></i> WhatsApp
        </a>
      </div>

      <div class="modal-wrapper" id="callbackModal">
        <div class="modal-backdrop"></div>
        <div class="modal-card">
          <button type="button" class="modal-close-btn" aria-label="Fermer">
            ×
          </button>
          <div class="modal-icon-success">
            <i class="fas fa-phone-volume"></i>
          </div>
          <h3 style="font-size: 1.4rem; margin-bottom: 8px;">Être Rappelé par un Conseiller</h3>
          <p style="font-size: 0.9rem; color: var(--slate-600); margin-bottom: 24px;">
            Indiquez votre numéro WhatsApp pour qu'un conseiller d'orientation vous contacte sous 30 minutes.
          </p>

          <form id="callbackQuickForm">
            <div class="form-group" style="text-align: left;">
              <label class="form-label" style="font-size: 0.85rem;">
                Votre Numéro WhatsApp avec indicatif :
              </label>
              <input type="tel" class="form-input" placeholder="Ex: +221 77... ou +225 07..." required />
            </div>
            <button type="submit" class="btn-primary btn-full">
              <i class="fas fa-headset"></i> Demander à être Rappelé
            </button>
          </form>
        </div>
      </div>

      <div class="modal-wrapper" id="successModal">
        <div class="modal-backdrop"></div>
        <div class="modal-card" style="max-width: 580px;">
          <button type="button" class="modal-close-btn" aria-label="Fermer">
            ×
          </button>
          <div class="modal-icon-success" style="background-color: var(--success-bg); color: var(--success);">
            <i class="fas fa-check-circle"></i>
          </div>
          <h3 style="font-size: 1.5rem; margin-bottom: 8px;">Candidature Enregistrée avec Succès !</h3>
          <p style="font-size: 0.9rem; color: var(--slate-600);">
            Félicitations ! Votre dossier a été transmis aux conseillers de {SITE.name}.
          </p>

          <div class="modal-student-summary" id="modalStudentSummary"></div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            <a
              id="modalWhatsappRedirect"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary btn-full"
              style="background: #25D366; border-color: #25D366;"
            >
              <i class="fab fa-whatsapp"></i>
              <span>WhatsApp</span>
            </a>
            <button type="button" class="btn-secondary btn-full modal-close-btn-action">
              <span>Fermer cette fenêtre</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
