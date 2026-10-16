export const candidatureMeta = {
  title: "Candidature pour étudier au Maroc | Wicka Assistance",
  description:
    "Déposez votre candidature pour étudier au Maroc et recevez une orientation personnalisée, une estimation des démarches et un suivi par un conseiller.",
  keywords:
    "candidature études Maroc, admission étudiant Maroc, dossier étudiant international, orientation post-bac Maroc, visa étudiant, accompagnement admission, Wicka Assistance"
};

export const Candidature = () => (
  <section class="application-section" id="candidature">
    <div class="container">
      <div class="section-header">
        <span class="section-badge" style="background-color: rgba(225, 29, 72, 0.2); color: var(--rose-300);">
          <i class="fas fa-paper-plane"></i> Session d'Admission 2026-2027
        </span>
        <h2 class="section-title">Formulaire de Candidature Officiel</h2>
        <p class="section-subtitle">
          Remplissez ce formulaire pour recevoir l'évaluation de votre dossier et votre devis dans votre monnaie locale.
        </p>
      </div>

      {/* Carte de réassurance (photo étudiants) */}
      <div class="apply-reassure">
        <div class="apply-reassure-photo">
          <img
            src="/assets/uni/student-grad.jpg"
            alt="Étudiante diplômée accompagnée par Wicka Assistance"
            loading="lazy"
          />
          <span class="apply-reassure-badge">
            <i class="fas fa-circle-check"></i> Admission confirmée
          </span>
        </div>
        <div class="apply-reassure-text">
          <span class="section-badge" style="margin-bottom: 12px;">
            <i class="fas fa-user-graduate"></i> Ils l'ont fait avant vous
          </span>
          <h3>Vous aussi, réussissez votre projet d'études au Maroc.</h3>
          <p>
            Rejoignez les <strong>+520 étudiants déjà placés</strong> dans les meilleures universités privées du Maroc.
            Remplissez le formulaire ci-dessous : un conseiller vous répond en 24h et bloque votre tarif promo.
          </p>
          <div class="apply-reassure-chips">
            <span>
              <i class="fas fa-user-graduate"></i> +520 étudiants placés
            </span>
            <span>
              <i class="fas fa-passport"></i> 98% de visa obtenu
            </span>
            <span>
              <i class="fas fa-car-side"></i> Navette aéroport incluse
            </span>
          </div>
        </div>
      </div>

      <div class="app-form-box">
        <div class="form-step-indicators">
          <div class="form-progress-track">
            <div class="form-progress-bar" id="formProgressBar"></div>
          </div>

          <div class="step-indicator-item active" data-step="1">
            <div class="step-indicator-circle">1</div>
            <span class="step-indicator-label">Profil Scolaire</span>
          </div>
          <div class="step-indicator-item" data-step="2">
            <div class="step-indicator-circle">2</div>
            <span class="step-indicator-label">Projet Maroc</span>
          </div>
          <div class="step-indicator-item" data-step="3">
            <div class="step-indicator-circle">3</div>
            <span class="step-indicator-label">Formule & Navette</span>
          </div>
          <div class="step-indicator-item" data-step="4">
            <div class="step-indicator-circle">4</div>
            <span class="step-indicator-label">Coordonnées</span>
          </div>
        </div>

        <form id="multiStepApplicationForm">
          {/* Step 1 */}
          <div class="form-step-panel active" data-step="1">
            <h3 class="panel-heading">
              <i class="fas fa-user-graduate text-rose"></i> Étape 1 : Profil Scolaire de l'Étudiant
            </h3>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label" for="formFullName">
                  Nom & Prénom de l'étudiant *
                </label>
                <input type="text" id="formFullName" class="form-input" placeholder="Ex: Moussa Traoré" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="formCountry">
                  Pays de résidence actuel *
                </label>
                <select id="formCountry" class="form-select" required>
                  <option value="" disabled selected>
                    Sélectionnez votre pays...
                  </option>
                  <option value="Sénégal 🇸🇳">Sénégal 🇸🇳</option>
                  <option value="Côte d'Ivoire 🇨🇮">Côte d'Ivoire 🇨🇮</option>
                  <option value="Cameroun 🇨🇲">Cameroun 🇨🇲</option>
                  <option value="Gabon 🇬🇦">Gabon 🇬🇦</option>
                  <option value="Guinée 🇬🇳">Guinée 🇬🇳</option>
                  <option value="Congo 🇨🇬">Congo (Brazzaville) 🇨🇬</option>
                  <option value="RDC 🇨🇩">RD Congo (Kinshasa) 🇨🇩</option>
                  <option value="Mali 🇲🇱">Mali 🇲🇱</option>
                  <option value="Togo 🇹🇬">Togo 🇹🇬</option>
                  <option value="Bénin 🇧🇯">Bénin 🇧🇯</option>
                  <option value="Tchad 🇹🇩">Tchad 🇹🇩</option>
                  <option value="Burkina Faso 🇧🇫">Burkina Faso 🇧🇫</option>
                  <option value="France / Diaspora 🇫🇷">France / Europe / Diaspora 🇫🇷</option>
                  <option value="Autre pays">Autre pays</option>
                </select>
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label" for="formCurrentLevel">
                  Niveau d'études préparé ou obtenu *
                </label>
                <select id="formCurrentLevel" class="form-select" required>
                  <option value="Terminale / Baccalauréat 2026 en cours">Terminale / Baccalauréat 2026 en cours</option>
                  <option value="Bachelier (Bac déjà en poche)">Bachelier (Bac déjà en poche)</option>
                  <option value="Bac+1 / Bac+2 (Licence en cours)">Bac+1 / Bac+2 (Licence en cours)</option>
                  <option value="Licence / Bachelor (Bac+3 validé)">Licence / Bachelor (Bac+3 validé)</option>
                  <option value="Master ou diplôme supérieur">Master ou diplôme supérieur</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="formBacSeries">
                  Série du Bac & Mention obtenue ou visée *
                </label>
                <input
                  type="text"
                  id="formBacSeries"
                  class="form-input"
                  placeholder="Ex: Série S2 / C / D / G2 / SES - Mention Bien"
                  required
                />
              </div>
            </div>

            <div class="form-buttons-row" style="justify-content: flex-end;">
              <button type="button" class="btn-primary btn-next-step">
                <span>Continuer : Mon Projet au Maroc</span>
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div class="form-step-panel" data-step="2">
            <h3 class="panel-heading">
              <i class="fas fa-book-open text-rose"></i> Étape 2 : Votre Projet d'Études au Maroc
            </h3>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label" for="formStudyDomain">
                  Filière d'études souhaitée *
                </label>
                <select id="formStudyDomain" class="form-select" required>
                  <option value="medecine">Médecine Générale, Dentaire ou Pharmacie</option>
                  <option value="ingenierie" selected>
                    Génie Informatique, IA, Big Data & Cybersécurité
                  </option>
                  <option value="business">Management, Audit, Finance, Supply Chain & Commerce</option>
                  <option value="architecture">Architecture, Urbanisme & Design</option>
                  <option value="droit">Droit International des Affaires & Sciences Politiques</option>
                  <option value="autre">Autre filière / Je souhaite être conseillé</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="formTargetCity">
                  Ville marocaine de préférence *
                </label>
                <select id="formTargetCity" class="form-select" required>
                  <option value="Fès (Euromed)">Fès (Campus Euromed UEMF)</option>
                  <option value="Casablanca" selected>
                    Casablanca (ESTEM, EMSI, ESCA, UIC, Mundia)
                  </option>
                  <option value="Rabat">Rabat (UIASS Santé, UIR, UM6P)</option>
                  <option value="Marrakech">Marrakech</option>
                  <option value="Tanger">Tanger</option>
                  <option value="Au meilleur campus">Au meilleur campus selon mon profil</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="formTargetUniversity">
                Université Privée ciblée (Facultatif)
              </label>
              <input
                type="text"
                id="formTargetUniversity"
                class="form-input"
                placeholder="Ex: UEMF Euromed, ESTEM Casa, UIASS, EMSI, UIR ou 'Laissez Wicka me conseiller'"
              />
            </div>

            <div class="form-buttons-row">
              <button type="button" class="btn-secondary btn-prev-step">
                <i class="fas fa-arrow-left"></i> <span>Retour</span>
              </button>
              <button type="button" class="btn-primary btn-next-step">
                <span>Continuer : Formule & Navette</span>
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div class="form-step-panel" data-step="3">
            <h3 class="panel-heading">
              <i class="fas fa-cubes text-rose"></i> Étape 3 : Formule d'Assistance & Navette Aéroport
            </h3>

            <div class="form-group">
              <label class="form-label">Choisissez votre formule :</label>
              <div class="sim-radio-cards application-pack-options" style="grid-template-columns: 1fr 1fr 1fr;">
                <label class="sim-radio-card">
                  <input type="radio" name="formPackChoice" value="Pack Diagnostic & Orientation (290 DH)" />
                  <div class="sim-radio-content">
                    <i class="fas fa-compass"></i>
                    <span>Diagnostic</span>
                    <small style="color: var(--rose-700); font-weight: 700;">290 DH</small>
                  </div>
                </label>
                <label class="sim-radio-card">
                  <input type="radio" name="formPackChoice" value="Pack Admission Réussie" checked />
                  <div class="sim-radio-content">
                    <i class="fas fa-certificate"></i>
                    <span>Pack Admission</span>
                    <small style="color: var(--rose-700); font-weight: 700;">⭐ Recommandé</small>
                  </div>
                </label>
                <label class="sim-radio-card">
                  <input type="radio" name="formPackChoice" value="Pack VIP & Navette Aéroport" />
                  <div class="sim-radio-content">
                    <i class="fas fa-car-side"></i>
                    <span>VIP & Navette</span>
                    <small style="color: var(--rose-700); font-weight: 700;">Chauffeur Privé</small>
                  </div>
                </label>
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Souhaitez-vous la Navette Aéroport Privée sécurisée avec chauffeur ?</label>
                <div class="airport-transfer-options" style="display: flex; gap: 20px; margin-top: 10px;">
                  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                    <input type="radio" name="formAirportTransfer" value="Oui, navette avec chauffeur demandée" checked />
                    <span>Oui, transfert direct vers ma ville</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                    <input type="radio" name="formAirportTransfer" value="Non, j'ai mes propres moyens de transport" />
                    <span>Non, j'ai déjà mes propres moyens</span>
                  </label>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="formNotes">
                  Précisions éventuelles ou questions des parents
                </label>
                <textarea
                  id="formNotes"
                  class="form-textarea"
                  rows={2}
                  placeholder="Bourse, budget annuel maximum, date d'arrivée souhaitée..."
                ></textarea>
              </div>
            </div>

            <div class="form-buttons-row">
              <button type="button" class="btn-secondary btn-prev-step">
                <i class="fas fa-arrow-left"></i> <span>Retour</span>
              </button>
              <button type="button" class="btn-primary btn-next-step">
                <span>Continuer : Coordonnées de Contact</span>
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>

          {/* Step 4 */}
          <div class="form-step-panel" data-step="4">
            <h3 class="panel-heading">
              <i class="fas fa-phone-alt text-rose"></i> Étape 4 : Vos Coordonnées pour l'Envoi du Bilan
            </h3>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label" for="formWhatsapp">
                  Numéro WhatsApp (avec indicatif pays) *
                </label>
                <input
                  type="tel"
                  id="formWhatsapp"
                  class="form-input"
                  placeholder="Ex: +221 77 123 45 67 ou +225 07..."
                  required
                />
                <small style="color: var(--slate-500); font-size: 0.76rem;">
                  Nos conseillers vous contacteront directement sur WhatsApp pour l'envoi de la grille d'admissibilité.
                </small>
              </div>

              <div class="form-group">
                <label class="form-label" for="formEmail">
                  Adresse Email de contact *
                </label>
                <input type="email" id="formEmail" class="form-input" placeholder="votre.email@gmail.com" required />
              </div>
            </div>

            <label class="legal-consent">
              <input id="applicationConsent" name="consent" value="accepted" type="checkbox" required />{" "}
              <span>
                J’accepte que mes données soient utilisées pour traiter ma candidature, conformément à la{" "}
                <a href="/politique-confidentialite">politique de confidentialité</a>.
              </span>
            </label>
            <div style="background-color: var(--rose-50); border: 1px solid var(--rose-200); border-radius: var(--radius-md); padding: 14px 18px; margin-bottom: 20px; font-size: 0.85rem; color: var(--rose-900);">
              <i class="fas fa-lock"></i> <strong>Engagement de confidentialité :</strong> Vos données sont protégées et
              ne servent qu'aux procédures officielles d'admission universitaire.
            </div>

            <div class="form-buttons-row">
              <button type="button" class="btn-secondary btn-prev-step">
                <i class="fas fa-arrow-left"></i> <span>Retour</span>
              </button>
              <button type="submit" class="btn-primary" style="padding: 16px 36px; font-size: 1.05rem;">
                <i class="fas fa-check-circle"></i>
                <span>Soumettre ma Candidature Officielle</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
);
