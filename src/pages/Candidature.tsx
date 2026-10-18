import { getPromo } from "../config/site";

export const candidatureMeta = {
  title: "Candidature pour étudier au Maroc | Wicka Assistance",
  description:
    "Déposez votre candidature pour étudier au Maroc : un conseiller étudie votre dossier, vous présente la formule adaptée et vous accompagne dans vos démarches.",
  keywords:
    "candidature études Maroc, admission étudiant Maroc, dossier étudiant international, orientation post-bac Maroc, visa étudiant, accompagnement admission, Wicka Assistance"
};

export const Candidature = () => {
  /**
   * Promo et rentrée : évaluées à chaque requête (voir getPromo() dans src/config/site.ts).
   * - promo.rentree : « 2026-2027 » jusqu'au 15 novembre, puis « 2027-2028 ».
   * - promo.active : sert à afficher le prix du Pack Diagnostic (290 DH pendant la promo, 590 DH ensuite).
   */
  const promo = getPromo();
  const diagnosticPrice = promo.active ? "290 DH" : "590 DH";

  return (
    <section class="application-section" id="candidature">
      <div class="container">
        <div class="section-header">
          <span class="section-badge" style="background-color: var(--rose-100); color: var(--rose-800);">
            <i class="fas fa-paper-plane"></i> Session d'admission {promo.rentree}
          </span>
          <h1 class="section-title">Formulaire de candidature</h1>
          <p class="section-subtitle">
            Remplissez ce formulaire pour que nos conseillers étudient votre dossier et vous présentent la formule
            adaptée, avec un tarif dans votre devise locale.
          </p>
        </div>

        {/* Carte de réassurance (photo étudiants) */}
        <div class="apply-reassure">
          <div class="apply-reassure-photo">
            <img src="/assets/uni/student-grad.jpg" alt="Étudiante diplômée au Maroc" loading="lazy" />
            <span class="apply-reassure-badge">
              <i class="fas fa-graduation-cap"></i> Études au Maroc
            </span>
          </div>
          <div class="apply-reassure-text">
            <span class="section-badge" style="margin-bottom: 12px;">
              <i class="fas fa-user-graduate"></i> Votre projet commence ici
            </span>
            <h3>Présentez-nous votre projet d'études au Maroc.</h3>
            <p>
              Remplissez le formulaire ci-dessous en 4 étapes : un conseiller étudie votre profil et vous recontacte
              sous 72 h maximum pour vous présenter la formule d'accompagnement qui correspond à votre projet.
            </p>
            <div class="apply-reassure-chips">
              <span>
                <i class="fas fa-user-graduate"></i> Accompagnement personnalisé
              </span>
              <span>
                <i class="fas fa-passport"></i> Suivi de la procédure de visa, selon votre nationalité
              </span>
              <span>
                <i class="fas fa-car-side"></i> Navette depuis l'aéroport de Casablanca (Pack VIP)
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
              <span class="step-indicator-label">Profil scolaire</span>
            </div>
            <div class="step-indicator-item" data-step="2">
              <div class="step-indicator-circle">2</div>
              <span class="step-indicator-label">Projet Maroc</span>
            </div>
            <div class="step-indicator-item" data-step="3">
              <div class="step-indicator-circle">3</div>
              <span class="step-indicator-label">Formule et navette</span>
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
                <i class="fas fa-user-graduate text-rose"></i> Étape 1 : Profil scolaire de l'étudiant
              </h3>

              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label" for="formFullName">
                    Nom et prénom de l'étudiant *
                  </label>
                  <input type="text" id="formFullName" class="form-input" placeholder="Ex : Moussa Traoré" required />
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
                    <option value="" disabled selected>
                      Sélectionnez votre niveau...
                    </option>
                    <option value="Terminale / Baccalauréat en cours">Terminale / Baccalauréat en cours</option>
                    <option value="Bachelier (Bac déjà en poche)">Bachelier (bac déjà obtenu)</option>
                    <option value="Bac+1 / Bac+2 (Licence en cours)">Bac+1 / Bac+2 (licence en cours)</option>
                    <option value="Licence / Bachelor (Bac+3 validé)">Licence / Bachelor (Bac+3 validé)</option>
                    <option value="Master ou diplôme supérieur">Master ou diplôme supérieur</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label" for="formBacSeries">
                    Série du bac et mention obtenue ou visée *
                  </label>
                  <input
                    type="text"
                    id="formBacSeries"
                    class="form-input"
                    placeholder="Ex : Série S2 / C / D / G2 / SES - Mention Bien"
                    required
                  />
                </div>
              </div>

              <div class="form-buttons-row" style="justify-content: flex-end;">
                <button type="button" class="btn-primary btn-next-step">
                  <span>Continuer : mon projet au Maroc</span>
                  <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div class="form-step-panel" data-step="2">
              <h3 class="panel-heading">
                <i class="fas fa-book-open text-rose"></i> Étape 2 : Votre projet d'études au Maroc
              </h3>

              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label" for="formStudyDomain">
                    Filière d'études souhaitée *
                  </label>
                  <select id="formStudyDomain" class="form-select" required>
                    <option value="" disabled selected>
                      Sélectionnez une filière...
                    </option>
                    <option value="medecine">Médecine générale, dentaire ou pharmacie</option>
                    <option value="ingenierie">Génie informatique, IA, big data et cybersécurité</option>
                    <option value="business">Management, audit, finance, supply chain et commerce</option>
                    <option value="architecture">Architecture, urbanisme et design</option>
                    <option value="droit">Droit international des affaires et sciences politiques</option>
                    <option value="autre">Autre filière / je souhaite être conseillé</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label" for="formTargetCity">
                    Ville marocaine de préférence *
                  </label>
                  <select id="formTargetCity" class="form-select" required>
                    <option value="" disabled selected>
                      Sélectionnez une ville...
                    </option>
                    <option value="Fès (Euromed)">Fès (campus Euromed UEMF)</option>
                    <option value="Casablanca">Casablanca (ESTEM, EMSI, ESCA, UIC, Mundiapolis)</option>
                    <option value="Rabat">Rabat (UIASS, UIR, UM6P)</option>
                    <option value="Marrakech">Marrakech</option>
                    <option value="Tanger">Tanger</option>
                    <option value="Ifrane">Ifrane (Al Akhawayn)</option>
                    <option value="Au meilleur campus">Je souhaite être conseillé selon mon profil</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="formTargetUniversity">
                  Université privée ciblée (facultatif)
                </label>
                <input
                  type="text"
                  id="formTargetUniversity"
                  class="form-input"
                  placeholder="Ex : UEMF Euromed, ESTEM Casablanca, UIASS, EMSI, UIR ou « Je souhaite être conseillé »"
                />
              </div>

              <div class="form-buttons-row">
                <button type="button" class="btn-secondary btn-prev-step">
                  <i class="fas fa-arrow-left"></i> <span>Retour</span>
                </button>
                <button type="button" class="btn-primary btn-next-step">
                  <span>Continuer : formule et navette</span>
                  <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div class="form-step-panel" data-step="3">
              <h3 class="panel-heading">
                <i class="fas fa-cubes text-rose"></i> Étape 3 : Formule d'accompagnement et navette
              </h3>

              <div class="form-group">
                <label class="form-label">Choisissez votre formule :</label>
                <div
                  class="sim-radio-cards application-pack-options"
                  style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));"
                >
                  <label class="sim-radio-card">
                    <input
                      type="radio"
                      name="formPackChoice"
                      value={`Pack Diagnostic et Orientation (${diagnosticPrice})`}
                    />
                    <div class="sim-radio-content">
                      <i class="fas fa-compass"></i>
                      <span>Diagnostic et Orientation</span>
                      <small style="color: var(--rose-700); font-weight: 700;" data-full-text="590 DH">
                        {diagnosticPrice}
                      </small>
                    </div>
                  </label>
                  <label class="sim-radio-card">
                    <input type="radio" name="formPackChoice" value="Pack Admission Réussie" checked />
                    <div class="sim-radio-content">
                      <i class="fas fa-certificate"></i>
                      <span>Admission Réussie</span>
                      <small style="color: var(--rose-700); font-weight: 700;">⭐ Recommandé</small>
                    </div>
                  </label>
                  <label class="sim-radio-card">
                    <input type="radio" name="formPackChoice" value="Pack VIP et Navette Aéroport" />
                    <div class="sim-radio-content">
                      <i class="fas fa-car-side"></i>
                      <span>VIP et Navette Aéroport</span>
                      <small style="color: var(--rose-700); font-weight: 700;">Accompagnement complet</small>
                    </div>
                  </label>
                </div>
              </div>

              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label">
                    Souhaitez-vous la navette privée depuis l'aéroport de Casablanca (incluse dans le Pack VIP) ?
                  </label>
                  <div
                    class="airport-transfer-options"
                    style="display: flex; flex-wrap: wrap; gap: 12px 20px; margin-top: 10px;"
                  >
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                      <input type="radio" name="formAirportTransfer" value="Oui, navette avec chauffeur demandée" checked />
                      <span>Oui, transfert vers ma ville d'études et mon université</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                      <input type="radio" name="formAirportTransfer" value="Non, j'ai mes propres moyens de transport" />
                      <span>Non, j'ai mes propres moyens de transport</span>
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
                  <span>Continuer : coordonnées de contact</span>
                  <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>

            {/* Step 4 */}
            <div class="form-step-panel" data-step="4">
              <h3 class="panel-heading">
                <i class="fas fa-phone-alt text-rose"></i> Étape 4 : Vos coordonnées de contact
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
                    placeholder="Ex : +221 77 123 45 67 ou +225 07..."
                    required
                  />
                  <small style="color: var(--slate-500); font-size: 0.76rem;">
                    Un conseiller vous contactera sur WhatsApp sous 72 h maximum pour vous présenter la suite de votre
                    dossier.
                  </small>
                </div>

                <div class="form-group">
                  <label class="form-label" for="formEmail">
                    Adresse e-mail de contact *
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
                <i class="fas fa-lock"></i> <strong>Confidentialité :</strong> vos données sont utilisées uniquement pour
                traiter votre candidature et vous contacter.
              </div>

              <div class="form-buttons-row">
                <button type="button" class="btn-secondary btn-prev-step">
                  <i class="fas fa-arrow-left"></i> <span>Retour</span>
                </button>
                <button type="submit" class="btn-primary" style="padding: 16px 36px; font-size: 1.05rem;">
                  <i class="fas fa-check-circle"></i>
                  <span>Envoyer ma candidature</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
