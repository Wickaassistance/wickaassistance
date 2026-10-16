import { waLink } from "../config/site";

export const tarifsMeta = {
  title: "Tarifs études au Maroc | Packs et accompagnement",
  description:
    "Découvrez les tarifs d’accompagnement pour étudier au Maroc : orientation, admission, visa, accueil et services adaptés à votre pays.",
  keywords:
    "tarifs études Maroc, prix admission Maroc, accompagnement étudiant, pack admission, visa étudiant Maroc, coût études Maroc, Wicka Assistance"
};

export const Tarifs = () => (
  <>
    {/* ===== TARIFS PAR PAYS ===== */}
    <section class="pricing-section" id="tarifs-pays">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">
            <i class="fas fa-globe-africa"></i> Transparence Financière Internationale
          </span>
          <h2 class="section-title">Tarifs Adaptés Selon le Pays du Candidat</h2>
          <p class="section-subtitle">
            Sélectionnez votre pays de résidence pour afficher nos tarifs dans votre devise locale ainsi que les moyens de
            paiement disponibles (Wave, Orange Money, MTN MoMo, Airtel, Virement...).
          </p>
        </div>

        {/* Widget Sélecteur de Pays */}
        <div class="country-pricing-widget">
          <div class="promo-ribbon-bar">
            <span class="promo-flame">🔥</span>
            <div class="promo-ribbon-text">
              <strong>PROMOTION DE LANCEMENT −50%</strong>
              <span>Tarifs de lancement à durée limitée. Le prix est bloqué et garanti dès la signature de votre contrat.</span>
              <span class="promo-places" id="promoPlaces">
                <i class="fas fa-fire"></i> Plus que <b>14 places</b> à ce tarif promotionnel
              </span>
            </div>
            <span class="promo-badge-pct">-50%</span>
          </div>

          <div class="country-selector-bar">
            <label class="country-selector-label" for="pricingCountrySelect">
              <i class="fas fa-map-pin text-rose"></i> Choisissez votre pays de résidence :
            </label>

            <div class="country-pills-wrap">
              <button type="button" class="country-pill-btn active" data-country="senegal">
                Sénégal 🇸🇳
              </button>
              <button type="button" class="country-pill-btn" data-country="ivory_coast">
                Côte d'Ivoire 🇨🇮
              </button>
              <button type="button" class="country-pill-btn" data-country="cameroon">
                Cameroun 🇨🇲
              </button>
              <button type="button" class="country-pill-btn" data-country="gabon">
                Gabon 🇬🇦
              </button>
              <button type="button" class="country-pill-btn" data-country="guinea">
                Guinée 🇬🇳
              </button>
              <button type="button" class="country-pill-btn" data-country="congo">
                Congo / RDC 🇨🇬 🇨🇩
              </button>
              <button type="button" class="country-pill-btn" data-country="diaspora_europe">
                France / Diaspora 🇫🇷 🇪🇺
              </button>
              <button type="button" class="country-pill-btn" data-country="maroc">
                Maroc (Sur place) 🇲🇦
              </button>
            </div>

            <select id="pricingCountrySelect" style="display: none;">
              <option value="senegal" selected>
                Sénégal
              </option>
              <option value="ivory_coast">Côte d'Ivoire</option>
              <option value="cameroon">Cameroun</option>
              <option value="gabon">Gabon</option>
              <option value="guinea">Guinée</option>
              <option value="congo">Congo</option>
              <option value="diaspora_europe">France / Diaspora</option>
              <option value="maroc">Maroc</option>
            </select>
          </div>

          {/* Affichage dynamique du prix par pays */}
          <div class="country-display-grid">
            {/* Pack Admission */}
            <div class="country-pack-col">
              <div>
                <span class="badge-rose-soft">⭐ Le Plus Populaire</span>
                <h3 class="country-pack-title">Pack Admission Réussie</h3>
                <p style="font-size: 0.85rem; color: var(--slate-600);">
                  Dépôt de 3 à 5 candidatures universitaires + Suivi jusqu'à la Lettre d'Admission Officielle + Aide
                  Bourse + Dossier Carte Consulaire (ambassade) + Attestation Visa.
                </p>
                <div class="country-pack-price" id="countryOutAdmissionPrice">
                  60 000 FCFA
                </div>
              </div>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary btn-full btn-order-pack"
                data-pack="Pack Admission"
              >
                <i class="fab fa-whatsapp"></i> Souscrire dans mon Pays
              </a>
            </div>

            {/* Pack VIP et Navette */}
            <div
              class="country-pack-col"
              style="border-color: var(--rose-600); background: linear-gradient(180deg, #ffffff 0%, #fff7f9 100%);"
            >
              <div>
                <span class="badge-rose-soft" style="background-color: var(--rose-700); color: var(--white);">
                  🚗 Navette Aéroport et VIP
                </span>
                <h3 class="country-pack-title">Pack VIP All-Inclusive et Navette</h3>
                <p style="font-size: 0.85rem; color: var(--slate-600);">
                  Admission garantie + Dossier Visa et <strong>Carte Consulaire jusqu'à l'ambassade</strong> +{" "}
                  <strong>Navette aéroport privée sécurisée</strong> + Carte SIM 4G + <strong>Carte de Séjour</strong>{" "}
                  jusqu'à l'obtention.
                </p>
                <div class="country-pack-price" id="countryOutVipPrice">
                  120 000 FCFA
                </div>
              </div>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary btn-full btn-order-pack"
                data-pack="Pack VIP All-Inclusive"
              >
                <i class="fab fa-whatsapp"></i> Réserver le Pack VIP et Navette
              </a>
            </div>
          </div>

          {/* Moyens de paiement par pays */}
          <div class="payment-methods-wrap">
            <span class="payment-methods-label">
              <i class="fas fa-wallet text-rose"></i> Moyens de paiement acceptés localement :
            </span>
            <div class="payment-chips-list" id="countryOutPaymentMethods">
              <span class="payment-method-chip">
                <i class="fas fa-check-circle text-rose"></i> Wave
              </span>
              <span class="payment-method-chip">
                <i class="fas fa-check-circle text-rose"></i> Orange Money
              </span>
              <span class="payment-method-chip">
                <i class="fas fa-check-circle text-rose"></i> Virement Bancaire
              </span>
            </div>
            <p id="countryOutNote" style="font-size: 0.82rem; color: var(--slate-500); margin-top: 10px;">
              Paiement local sans frais de change via Wave / Orange Money. Reçu officiel et contrat délivrés
              instantanément.
            </p>
            <p class="promo-disclaimer">
              <i class="fas fa-circle-info"></i> Prix promotionnels de lancement, susceptibles d'évoluer à tout moment.
              Tarif garanti dès la signature du contrat.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* ===== SIMULATEUR ===== */}
    <section class="simulator-section" id="simulateur">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">
            <i class="fas fa-calculator"></i> Étude de Coût Réel
          </span>
          <h2 class="section-title">Simulateur de Budget de Vie Étudiante au Maroc</h2>
          <p class="section-subtitle">
            Estimez le budget mensuel nécessaire pour vivre confortablement selon la ville choisie (Fès, Casablanca,
            Rabat, Marrakech, Tanger) et convertissez instantanément les montants.
          </p>
        </div>

        <div class="simulator-card-wrapper">
          <div class="simulator-grid">
            <div class="sim-controls-panel">
              {/* Photo de la ville sélectionnée */}
              <div class="sim-city-photo">
                <img id="simCityPhoto" src="/assets/uni/casablanca.jpg" alt="Ville marocaine" loading="lazy" />
                <span id="simCityPhotoLabel" class="sim-city-photo-label">
                  <i class="fas fa-map-marker-alt"></i> Casablanca
                </span>
              </div>

              {/* Choix de la ville */}
              <div class="sim-control-group">
                <label class="sim-label" for="simCitySelect">
                  <i class="fas fa-map-marker-alt text-rose"></i> 1. Ville marocaine d'accueil :
                </label>
                <select id="simCitySelect" class="sim-select-styled">
                  <option value="casablanca" selected>
                    Casablanca (Pôle Économique et Métropole)
                  </option>
                  <option value="rabat">Rabat (Capitale Verte et Cité d'Excellence)</option>
                  <option value="fes">Fès (Campus Euromed et Coût Très Abordable)</option>
                  <option value="marrakech">Marrakech (Cadre de Vie Ensoleillé et Dynamique)</option>
                  <option value="tanger">Tanger (Pôle Industriel et Ouvert sur l'Europe)</option>
                  <option value="ifrane">Ifrane (Campus Al Akhawayn et Coût le Plus Bas)</option>
                </select>
              </div>

              {/* Choix type d'établissement */}
              <div class="sim-control-group">
                <label class="sim-label">
                  <i class="fas fa-graduation-cap text-rose"></i> 2. Catégorie d'établissement visé :
                </label>
                <div class="sim-radio-cards">
                  <label class="sim-radio-card">
                    <input type="radio" name="simUniType" value="prive_standard" checked />
                    <div class="sim-radio-content">
                      <i class="fas fa-award"></i>
                      <span>Grande École Privée</span>
                      <small style="font-size: 0.72rem; color: var(--slate-500);">ESTEM, EMSI, Mundia (42k-50k DH)</small>
                    </div>
                  </label>
                  <label class="sim-radio-card">
                    <input type="radio" name="simUniType" value="prive_excellence" />
                    <div class="sim-radio-content">
                      <i class="fas fa-star"></i>
                      <span>Pôle d'Élite et Santé</span>
                      <small style="font-size: 0.72rem; color: var(--slate-500);">UEMF, UIASS, UIR, UM6P</small>
                    </div>
                  </label>
                  <label class="sim-radio-card">
                    <input type="radio" name="simUniType" value="public_assiste" />
                    <div class="sim-radio-content">
                      <i class="fas fa-landmark"></i>
                      <span>Faculté Publique</span>
                      <small style="font-size: 0.72rem; color: var(--slate-500);">Frais symboliques</small>
                    </div>
                  </label>
                </div>
              </div>

              {/* Avantages de la ville */}
              <div style="background-color: var(--rose-soft); border: 1px solid var(--rose-200); border-radius: var(--radius-md); padding: 16px; margin-top: 10px;">
                <strong style="color: var(--rose-900); font-size: 0.88rem;">
                  <i class="fas fa-info-circle"></i> Spécificité de cette ville :
                </strong>
                <p id="simCityAdvantages" style="font-size: 0.85rem; color: var(--slate-700); margin-top: 4px;">
                  Immense vivier de stages, sièges de multinationales, transports 24/7.
                </p>
              </div>
            </div>

            {/* Output Panel */}
            <div class="sim-results-panel">
              <div>
                <div class="sim-results-header">
                  <div>
                    <h3>Estimation du Budget</h3>
                    <span id="simCityBadgeLabel" style="font-size: 0.78rem; color: var(--rose-200);">
                      Pôle Économique et Cosmopolite
                    </span>
                  </div>
                  <div class="currency-chips-wrap">
                    <button type="button" class="currency-chip active" data-currency="MAD">
                      MAD
                    </button>
                    <button type="button" class="currency-chip" data-currency="XOF">
                      FCFA
                    </button>
                    <button type="button" class="currency-chip" data-currency="EUR">
                      EUR
                    </button>
                    <button type="button" class="currency-chip" data-currency="USD">
                      USD
                    </button>
                  </div>
                  <select id="simCurrencySelect" style="display:none;">
                    <option value="MAD" selected>
                      MAD
                    </option>
                    <option value="XOF">XOF</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>

                <div class="sim-breakdown-list">
                  <div class="sim-breakdown-item">
                    <span>
                      <i class="fas fa-utensils"></i> Alimentation et Courses :
                    </span>
                    <strong id="simOutFood">1 300 DH</strong>
                  </div>
                  <div class="sim-breakdown-item">
                    <span>
                      <i class="fas fa-train"></i> Transport (Tramway/Taxis) et Forfait 4G :
                    </span>
                    <strong id="simOutTransport">250 DH</strong>
                  </div>
                  <div class="sim-breakdown-item">
                    <span>
                      <i class="fas fa-book"></i> Fournitures et Loisirs :
                    </span>
                    <strong id="simOutLifestyle">450 DH</strong>
                  </div>
                </div>

                <div class="sim-total-highlight">
                  <span class="sim-total-label">Budget de Vie Mensuel Conseillé :</span>
                  <div class="sim-total-val" id="simOutMonthlyLiving">
                    2 000 DH / mois
                  </div>
                </div>

                <div
                  class="sim-breakdown-item"
                  style="border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 12px; margin-bottom: 8px;"
                >
                  <span>Frais Scolarité Université (Annuel) :</span>
                  <strong id="simOutTuitionYear" style="color: var(--gold-light);">
                    46 000 DH / an
                  </strong>
                </div>
                <div class="sim-breakdown-item">
                  <span>Grand Total Annuel Estimé (Vie 10 mois + École) :</span>
                  <strong id="simOutGrandTotalYear" style="color: var(--white); font-size: 1.15rem;">
                    66 000 DH / an
                  </strong>
                </div>
              </div>

              <a
                href="/candidature"
                class="btn-primary btn-full"
                style="margin-top: 20px; background: var(--white); color: var(--rose-900);"
              >
                <span>Faire Évaluer Mon Dossier</span>
                <i class="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ===== PACKS ===== */}
    <section class="pricing-section" id="packs">
      <div class="container">
        <div class="section-header">
          <span class="section-badge badge-promo">
            <i class="fas fa-fire"></i> Promo Lancement −50%
          </span>
          <h2 class="section-title">Choisissez la Formule Adaptée à Votre Projet</h2>
          <p class="section-subtitle">
            Profitez de nos <strong>tarifs promotionnels de lancement</strong> — parmi les plus accessibles du marché —
            payables localement dans votre devise (Wave, Orange Money, MTN, Virement).
          </p>
        </div>

        <div class="pricing-grid">
          {/* Pack 1 */}
          <div class="pricing-card">
            <div class="pack-header">
              <span class="badge-rose-soft">Pour démarrer</span>
              <h3 class="pack-name">Pack Diagnostic et Orientation</h3>
              <p style="font-size: 0.85rem; color: var(--slate-500);">Analyse de dossier et sélection des universités</p>
              <div class="pack-price-box">
                <span class="pack-price-old">590 DH</span>
                <span class="pack-price">290 DH</span>
                <span class="pack-price-cut">−51%</span>
              </div>
              <span class="pack-subprice">🔥 Prix PROMO de lancement · ~18 000 FCFA / 27 € · Sans engagement</span>
            </div>

            <ul class="pack-features-list">
              <li>
                <i class="fas fa-check-circle"></i> Audit approfondi des relevés de notes de l'élève
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Recommandation personnalisée de 3 universités privées
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Estimation précise des frais de scolarité par ville
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Guide complet sur la vie et la sécurité au Maroc
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Entretien d'orientation de 30 min avec un expert
              </li>
            </ul>

            <a
              href={waLink("Bonjour Wicka, je souhaite souscrire au Pack Diagnostic et Orientation (290 DH).")}
              target="_blank"
              rel="noopener noreferrer"
              class="btn-secondary btn-full"
            >
              <i class="fab fa-whatsapp text-rose"></i> <span>Souscrire au Diagnostic</span>
            </a>
          </div>

          {/* Pack 2 (Featured) */}
          <div class="pricing-card featured">
            <span class="pricing-badge-popular">⭐ Pack recommandé</span>
            <div class="pack-header">
              <span class="badge-rose-soft" style="background-color: var(--rose-700); color: var(--white);">
                Admission Garantie
              </span>
              <h3 class="pack-name" style="margin-top: 8px;">
                Pack Admission Réussie
              </h3>
              <p style="font-size: 0.85rem; color: var(--slate-500);">Admission officielle dans l'université privée ciblée</p>
              <div class="pack-price-box">
                <span class="pack-price-old">1 990 DH</span>
                <span class="pack-price">990 DH</span>
                <span class="pack-price-cut">−50%</span>
              </div>
              <span class="pack-subprice">🔥 Prix PROMO de lancement · ~60 000 FCFA / 92 € (Wave, Orange Money)</span>
            </div>

            <ul class="pack-features-list">
              <li>
                <i class="fas fa-check-circle"></i> <strong>Toutes les prestations du Pack Orientation</strong>
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Dépôt prioritaire de 3 à 5 candidatures universitaires
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Rédaction et optimisation de CV et lettres de motivation
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Préparation personnalisée aux oraux d'admission
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Suivi direct jusqu'à la Lettre d'Admission Officielle
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Assistance pour les demandes de bourses d'études
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Constitution du dossier de <strong>Carte Consulaire</strong> auprès de
                l'ambassade du Maroc
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Délivrance de l'attestation officielle pour le visa
              </li>
            </ul>

            <a
              href={waLink("Bonjour Wicka, je souhaite souscrire au Pack Admission Réussie.")}
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary btn-full"
            >
              <i class="fab fa-whatsapp"></i> Choisir le Pack Admission
            </a>
          </div>

          {/* Pack 3 VIP */}
          <div class="pricing-card">
            <div class="pack-header">
              <span class="badge-rose-soft" style="background-color: var(--gold-light); color: var(--gold);">
                🚗 Navette et Sérénité Totale
              </span>
              <h3 class="pack-name">Pack VIP et Navette Aéroport</h3>
              <p style="font-size: 0.85rem; color: var(--slate-500);">Prise en charge complète dès l'atterrissage</p>
              <div class="pack-price-box">
                <span class="pack-price-old">3 890 DH</span>
                <span class="pack-price">1 990 DH</span>
                <span class="pack-price-cut">−49%</span>
              </div>
              <span class="pack-subprice">🔥 Prix PROMO de lancement · ~120 000 FCFA / 185 € (chauffeur inclus)</span>
            </div>

            <ul class="pack-features-list">
              <li>
                <i class="fas fa-check-circle"></i> <strong>Toutes les prestations du Pack Admission Réussie</strong>
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Montage et validation du dossier consulaire de Visa
              </li>
              <li>
                <i class="fas fa-check-circle"></i> <strong>🏛️ Carte Consulaire :</strong> accompagnement complet jusqu'au
                dépôt à l'ambassade du Maroc
              </li>
              <li>
                <i class="fas fa-check-circle"></i> <strong>🚗 Navette Aéroport Privée Sécurisée</strong> : Chauffeur dédié
                à l'arrivée vers votre ville (Casablanca, Rabat, Fès, Marrakech, Tanger, Ifrane)
              </li>
              <li>
                <i class="fas fa-check-circle"></i> <strong>📱 Carte SIM 4G locale</strong> avec forfait internet remise en
                main propre
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Accompagnement pour l'ouverture de compte bancaire
              </li>
              <li>
                <i class="fas fa-check-circle"></i> <strong>📑 Carte de Séjour :</strong> prise en charge intégrale du
                dossier jusqu'à l'obtention du titre
              </li>
              <li>
                <i class="fas fa-check-circle"></i> Ligne d'assistance prioritaire 7j/7 pour rassurer les parents
              </li>
            </ul>

            <a
              href={waLink("Bonjour Wicka, je souhaite réserver le Pack VIP avec Navette Aéroport.")}
              target="_blank"
              rel="noopener noreferrer"
              class="btn-secondary btn-full"
            >
              <i class="fab fa-whatsapp text-rose"></i> Choisir le Pack VIP et Navette
            </a>
          </div>
        </div>

        <p class="promo-disclaimer promo-disclaimer-center">
          <i class="fas fa-circle-info"></i> Offre promotionnelle de lancement à durée et places limitées. Les tarifs
          affichés sont susceptibles d'évoluer à tout moment ; votre prix est bloqué et garanti dès la signature du contrat.
        </p>
      </div>
    </section>
  </>
);
