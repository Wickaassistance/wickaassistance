import { getPromo, waLink } from "../config/site";

export const tarifsMeta = {
  title: "Tarifs études au Maroc | Packs et accompagnement",
  description:
    "Tarifs des packs d'accompagnement pour étudier au Maroc : orientation, admission, démarches de visa et accueil. Prix par pays et simulateur de budget.",
  keywords:
    "tarifs études Maroc, prix admission Maroc, accompagnement étudiant, pack admission, visa étudiant Maroc, coût études Maroc, Wicka Assistance"
};

/**
 * Prix d'un pack.
 * PROMO (1er août → 15 novembre, UTC) : prix barré + prix promo + badge de réduction.
 * Hors promo : uniquement le prix plein.
 * Le prix affiché porte data-full-text (prix plein) : si la promo se termine pendant la visite,
 * js/main.js (showFullTexts) remplace le prix promo par le prix plein et retire les .promo-only.
 */
const PackPrice = ({ active, full, promo, cut }: { active: boolean; full: string; promo: string; cut: string }) => (
  <div class="pack-price-box">
    {active && <span class="pack-price-old promo-only">{full}</span>}
    <span class="pack-price" data-full-text={full}>
      {active ? promo : full}
    </span>
    {active && <span class="pack-price-cut promo-only">{cut}</span>}
  </div>
);

/** Questions fréquentes : affichées dans la page ET injectées en JSON-LD (FAQPage). */
const TARIFS_FAQ = [
  {
    q: "Wicka Assistance garantit-il mon admission ?",
    a: "Non. L'admission est décidée par chaque établissement. Wicka vous conseille, prépare et dépose vos candidatures, puis suit leur avancement jusqu'à la décision des universités."
  },
  {
    q: "Faut-il un visa pour étudier au Maroc ?",
    a: "Cela dépend de votre nationalité : certains pays sont exemptés de visa, d'autres non. Wicka vous accompagne dans la procédure qui correspond à votre situation. Les décisions relèvent des autorités compétentes."
  },
  {
    q: "Qui dépose la demande de carte de séjour ?",
    a: "Le dépôt est effectué par l'étudiant à la préfecture. Wicka l'accompagne dans la préparation de son dossier et dans ses démarches."
  },
  {
    q: "Que couvrent les tarifs affichés ?",
    a: "Les tarifs correspondent aux prestations d'accompagnement de Wicka Assistance. Les frais de scolarité de l'établissement, le billet d'avion et les frais administratifs officiels ne sont pas inclus."
  },
  {
    q: "Comment puis-je payer depuis mon pays ?",
    a: "Le paiement se fait localement selon votre pays : Wave, Orange Money, MTN, Airtel ou virement bancaire. Un contrat et un reçu vous sont remis lors du règlement."
  }
];

export const Tarifs = () => {
  /**
   * PROMO −50% : évaluée à chaque requête (voir getPromo() dans src/config/site.ts et README).
   * Hors période (16 nov. → 31 juil.) : ruban, badges, prix barrés et mentions promo ne sont pas rendus.
   */
  const promo = getPromo();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: TARIFS_FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a }
    }))
  };

  return (
    <>
      {/* ===== TARIFS PAR PAYS ===== */}
      <section class="pricing-section" id="tarifs-pays">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">
              <i class="fas fa-globe-africa"></i> Tarifs par pays
            </span>
            <h1 class="section-title">Tarifs d'accompagnement pour étudier au Maroc</h1>
            <p class="section-subtitle">
              Sélectionnez votre pays de résidence pour afficher nos tarifs dans votre devise locale ainsi que les moyens
              de paiement disponibles (Wave, Orange Money, MTN MoMo, Airtel, virement...).
            </p>
          </div>

          {/* Widget Sélecteur de Pays */}
          <div class="country-pricing-widget">
            {/* Ruban promo : uniquement pendant la période promo */}
            {promo.active && (
              <div class="promo-ribbon-bar promo-only">
                <span class="promo-flame">🔥</span>
                <div class="promo-ribbon-text">
                  <strong>OFFRE DE LANCEMENT −50%</strong>
                  <span>
                    Tarifs réduits valables jusqu'au 15 novembre. Le tarif est confirmé dès la signature de votre
                    contrat.
                  </span>
                </div>
                <span class="promo-badge-pct">-50%</span>
              </div>
            )}

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
                  Maroc (sur place) 🇲🇦
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

            {/* Affichage dynamique du prix par pays (rempli par js/main.js : prix promo ou prix pleins) */}
            <div class="country-display-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
              {/* Pack Diagnostic (prix en dirhams, identique pour tous les pays) */}
              <div class="country-pack-col">
                <div>
                  <span class="badge-rose-soft">Pour démarrer</span>
                  <h3 class="country-pack-title">Pack Diagnostic et Orientation</h3>
                  <p style="font-size: 0.85rem; color: var(--slate-600);">
                    Analyse de votre dossier scolaire, recommandation de 3 universités adaptées à votre profil et entretien
                    d'orientation avec un conseiller.
                  </p>
                  <PackPrice active={promo.active} full="590 DH" promo="290 DH" cut="−51%" />
                  <span class="pack-subprice" data-full-text="Environ 36 000 FCFA / 54 €">
                    {promo.active ? "Environ 18 000 FCFA / 27 €" : "Environ 36 000 FCFA / 54 €"}
                  </span>
                </div>
                <a
                  href={waLink(
                    `Bonjour Wicka, je souhaite souscrire au Pack Diagnostic et Orientation (${promo.active ? "290" : "590"} DH).`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-secondary btn-full"
                >
                  <i class="fab fa-whatsapp text-rose"></i> <span>Souscrire au Diagnostic</span>
                </a>
              </div>

              {/* Pack Admission */}
              <div class="country-pack-col">
                <div>
                  <span class="badge-rose-soft">⭐ Le plus choisi</span>
                  <h3 class="country-pack-title">Pack Admission Réussie</h3>
                  <p style="font-size: 0.85rem; color: var(--slate-600);">
                    Dépôt de 3 à 5 candidatures universitaires, suivi jusqu'à la décision des universités,
                    accompagnement pour la demande de bourse et pour le dossier de carte consulaire.
                  </p>
                  <div class="country-pack-price" id="countryOutAdmissionPrice">
                    {promo.active ? "60 000 FCFA" : "120 000 FCFA"}
                  </div>
                </div>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-primary btn-full btn-order-pack"
                  data-pack="Pack Admission"
                >
                  <i class="fab fa-whatsapp"></i> Souscrire dans mon pays
                </a>
              </div>

              {/* Pack VIP et Navette */}
              <div
                class="country-pack-col"
                style="border-color: var(--rose-600); background: linear-gradient(180deg, #ffffff 0%, #fff7f9 100%);"
              >
                <div>
                  <span class="badge-rose-soft" style="background-color: var(--rose-700); color: var(--white);">
                    🚗 Accompagnement complet et navette
                  </span>
                  <h3 class="country-pack-title">Pack VIP et Navette Aéroport</h3>
                  <p style="font-size: 0.85rem; color: var(--slate-600);">
                    Toutes les prestations du Pack Admission, plus le suivi de la procédure de visa, l'accueil à
                    l'aéroport de Casablanca avec chauffeur privé, une carte SIM 4G et l'accompagnement pour la carte de
                    séjour.
                  </p>
                  <div class="country-pack-price" id="countryOutVipPrice">
                    {promo.active ? "120 000 FCFA" : "235 000 FCFA"}
                  </div>
                </div>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-primary btn-full btn-order-pack"
                  data-pack="Pack VIP All-Inclusive"
                >
                  <i class="fab fa-whatsapp"></i> Réserver le Pack VIP
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
                  <i class="fas fa-check-circle text-rose"></i> Virement bancaire
                </span>
              </div>
              <p id="countryOutNote" style="font-size: 0.82rem; color: var(--slate-500); margin-top: 10px;">
                Paiement local sans frais de change via Wave ou Orange Money. Un contrat et un reçu vous sont remis lors
                du règlement.
              </p>
              {promo.active && (
                <p class="promo-disclaimer promo-only">
                  <i class="fas fa-circle-info"></i> Tarifs de lancement valables jusqu'au 15 novembre. Le tarif est
                  confirmé dès la signature de votre contrat.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SIMULATEUR ===== */}
      <section class="simulator-section" id="simulateur">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">
              <i class="fas fa-calculator"></i> Budget étudiant
            </span>
            <h2 class="section-title">Simulateur de budget de vie étudiante au Maroc</h2>
            <p class="section-subtitle">
              Obtenez une estimation indicative de votre budget mensuel et annuel selon la ville d'études (Fès,
              Casablanca, Rabat, Marrakech, Tanger, Ifrane) et convertissez les montants dans votre devise.
            </p>
          </div>

          <div class="simulator-card-wrapper">
            <div class="simulator-grid">
              <div class="sim-controls-panel">
                {/* Photo de la ville sélectionnée */}
                <div class="sim-city-photo">
                  <img id="simCityPhoto" src="/assets/uni/casablanca.jpg" alt="Ville d'accueil au Maroc" loading="lazy" />
                  <span id="simCityPhotoLabel" class="sim-city-photo-label">
                    <i class="fas fa-map-marker-alt"></i> Casablanca
                  </span>
                </div>

                {/* Choix de la ville */}
                <div class="sim-control-group">
                  <label class="sim-label" for="simCitySelect">
                    <i class="fas fa-map-marker-alt text-rose"></i> 1. Ville d'études :
                  </label>
                  <select id="simCitySelect" class="sim-select-styled">
                    <option value="casablanca" selected>
                      Casablanca
                    </option>
                    <option value="rabat">Rabat</option>
                    <option value="fes">Fès</option>
                    <option value="marrakech">Marrakech</option>
                    <option value="tanger">Tanger</option>
                    <option value="ifrane">Ifrane</option>
                  </select>
                </div>

                {/* Choix type d'établissement */}
                <div class="sim-control-group">
                  <label class="sim-label">
                    <i class="fas fa-graduation-cap text-rose"></i> 2. Type d'établissement visé :
                  </label>
                  <div class="sim-radio-cards">
                    <label class="sim-radio-card">
                      <input type="radio" name="simUniType" value="prive_standard" checked />
                      <div class="sim-radio-content">
                        <i class="fas fa-award"></i>
                        <span>Grande école privée</span>
                        <small style="font-size: 0.72rem; color: var(--slate-500);">
                          Exemples : ESTEM, EMSI, Mundia (environ 42 000 à 50 000 DH par an)
                        </small>
                      </div>
                    </label>
                    <label class="sim-radio-card">
                      <input type="radio" name="simUniType" value="prive_excellence" />
                      <div class="sim-radio-content">
                        <i class="fas fa-star"></i>
                        <span>Pôles universitaires et santé</span>
                        <small style="font-size: 0.72rem; color: var(--slate-500);">
                          Exemples : UEMF, UIASS, UIR, UM6P
                        </small>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Spécificités de la ville (texte rempli par js/main.js) */}
                <div style="background-color: var(--rose-soft); border: 1px solid var(--rose-200); border-radius: var(--radius-md); padding: 16px; margin-top: 10px;">
                  <strong style="color: var(--rose-900); font-size: 0.88rem;">
                    <i class="fas fa-info-circle"></i> À propos de cette ville :
                  </strong>
                  <p id="simCityAdvantages" style="font-size: 0.85rem; color: var(--slate-700); margin-top: 4px;">
                    Grande métropole économique avec de nombreuses entreprises et des possibilités de stages.
                  </p>
                </div>
              </div>

              {/* Output Panel */}
              <div class="sim-results-panel">
                <div>
                  <div class="sim-results-header">
                    <div>
                      <h3>Estimation du budget</h3>
                      <span id="simCityBadgeLabel" style="font-size: 0.78rem; color: var(--rose-200);">
                        Casablanca
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
                        <i class="fas fa-utensils"></i> Alimentation et courses :
                      </span>
                      <strong id="simOutFood">1 300 DH</strong>
                    </div>
                    <div class="sim-breakdown-item">
                      <span>
                        <i class="fas fa-train"></i> Transport et forfait 4G :
                      </span>
                      <strong id="simOutTransport">250 DH</strong>
                    </div>
                    <div class="sim-breakdown-item">
                      <span>
                        <i class="fas fa-book"></i> Fournitures et loisirs :
                      </span>
                      <strong id="simOutLifestyle">450 DH</strong>
                    </div>
                  </div>

                  <div class="sim-total-highlight">
                    <span class="sim-total-label">Budget de vie mensuel estimé :</span>
                    <div class="sim-total-val" id="simOutMonthlyLiving">
                      2 000 DH / mois
                    </div>
                  </div>

                  <div
                    class="sim-breakdown-item"
                    style="border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 12px; margin-bottom: 8px;"
                  >
                    <span>Frais de scolarité indicatifs (annuel) :</span>
                    <strong id="simOutTuitionYear" style="color: var(--gold-light);">
                      46 000 DH / an
                    </strong>
                  </div>
                  <div class="sim-breakdown-item">
                    <span>Total annuel estimé (vie sur 10 mois + scolarité) :</span>
                    <strong id="simOutGrandTotalYear" style="color: var(--white); font-size: 1.15rem;">
                      66 000 DH / an
                    </strong>
                  </div>
                  <p style="font-size: 0.75rem; opacity: 0.8; margin-top: 12px;">
                    Estimations indicatives : les montants réels varient selon l'établissement, le logement et le mode de
                    vie.
                  </p>
                </div>

                <a
                  href="/candidature"
                  class="btn-primary btn-full"
                  style="margin-top: 20px; background: var(--white); color: var(--rose-900);"
                >
                  <span>Faire évaluer mon dossier</span>
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
            {promo.active ? (
              <span class="section-badge badge-promo promo-only">
                <i class="fas fa-fire"></i> Offre de lancement −50%
              </span>
            ) : (
              <span class="section-badge">
                <i class="fas fa-tags"></i> Nos formules
              </span>
            )}
            <h2 class="section-title">Choisissez la formule adaptée à votre projet</h2>
            <p class="section-subtitle">
              {promo.active ? (
                <>
                  Trois formules d'accompagnement, à <strong>tarif de lancement jusqu'au 15 novembre</strong>, payables
                  localement dans votre devise (Wave, Orange Money, MTN, virement).
                </>
              ) : (
                <>
                  Trois formules d'accompagnement, payables localement dans votre devise (Wave, Orange Money, MTN,
                  virement).
                </>
              )}
            </p>
          </div>

          <div class="pricing-grid">
            {/* Pack 1 */}
            <div class="pricing-card">
              <div class="pack-header">
                <span class="badge-rose-soft">Pour démarrer</span>
                <h3 class="pack-name">Pack Diagnostic et Orientation</h3>
                <p style="font-size: 0.85rem; color: var(--slate-500);">Analyse de votre dossier et choix des universités</p>
                <PackPrice active={promo.active} full="590 DH" promo="290 DH" cut="−51%" />
                <span class="pack-subprice" data-full-text="Prix standard · environ 36 000 FCFA / 54 € · Sans engagement">
                  {promo.active
                    ? "Tarif de lancement · environ 18 000 FCFA / 27 € · Sans engagement"
                    : "Prix standard · environ 36 000 FCFA / 54 € · Sans engagement"}
                </span>
              </div>

              <ul class="pack-features-list">
                <li>
                  <i class="fas fa-check-circle"></i> Analyse de vos relevés de notes
                </li>
                <li>
                  <i class="fas fa-check-circle"></i> Recommandation de 3 universités privées adaptées à votre profil
                </li>
                <li>
                  <i class="fas fa-check-circle"></i> Estimation des frais de scolarité selon la ville
                </li>
                <li>
                  <i class="fas fa-check-circle"></i> Guide pratique sur la vie au Maroc
                </li>
                <li>
                  <i class="fas fa-check-circle"></i> Entretien d'orientation de 30 minutes avec un conseiller
                </li>
              </ul>

              <a
                href={waLink(
                  `Bonjour Wicka, je souhaite souscrire au Pack Diagnostic et Orientation (${promo.active ? "290" : "590"} DH).`
                )}
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
                  Accompagnement à l'admission
                </span>
                <h3 class="pack-name" style="margin-top: 8px;">
                  Pack Admission Réussie
                </h3>
                <p style="font-size: 0.85rem; color: var(--slate-500);">
                  Candidatures et suivi jusqu'à la décision des universités
                </p>
                <PackPrice active={promo.active} full="1 990 DH" promo="990 DH" cut="−50%" />
                <span
                  class="pack-subprice"
                  data-full-text="Prix standard · environ 120 000 FCFA / 185 € (Wave, Orange Money)"
                >
                  {promo.active
                    ? "Tarif de lancement · environ 60 000 FCFA / 92 € (Wave, Orange Money)"
                    : "Prix standard · environ 120 000 FCFA / 185 € (Wave, Orange Money)"}
                </span>
              </div>

              <ul class="pack-features-list">
                <li>
                  <i class="fas fa-check-circle"></i> <strong>Toutes les prestations du Pack Diagnostic et Orientation</strong>
                </li>
                <li>
                  <i class="fas fa-check-circle"></i> Préparation et dépôt de 3 à 5 candidatures universitaires
                </li>
                <li>
                  <i class="fas fa-check-circle"></i> Aide à la rédaction du CV et des lettres de motivation
                </li>
                <li>
                  <i class="fas fa-check-circle"></i> Accompagnement pour les tests et examens exigés par certaines
                  universités
                </li>
                <li>
                  <i class="fas fa-check-circle"></i> Suivi de vos candidatures jusqu'à la décision des universités
                </li>
                <li>
                  <i class="fas fa-check-circle"></i> Accompagnement dans votre demande de bourse d'études (dossier
                  déposé par l'étudiant)
                </li>
                <li>
                  <i class="fas fa-check-circle"></i> Aide au montage et au dépôt du dossier de <strong>carte consulaire</strong>
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
                  🚗 Accompagnement complet et navette
                </span>
                <h3 class="pack-name">Pack VIP et Navette Aéroport</h3>
                <p style="font-size: 0.85rem; color: var(--slate-500);">De l'admission à votre installation au Maroc</p>
                <PackPrice active={promo.active} full="3 890 DH" promo="1 990 DH" cut="−49%" />
                <span
                  class="pack-subprice"
                  data-full-text="Prix standard · environ 235 000 FCFA / 360 € (chauffeur inclus)"
                >
                  {promo.active
                    ? "Tarif de lancement · environ 120 000 FCFA / 185 € (chauffeur inclus)"
                    : "Prix standard · environ 235 000 FCFA / 360 € (chauffeur inclus)"}
                </span>
              </div>

              <ul class="pack-features-list">
                <li>
                  <i class="fas fa-check-circle"></i> <strong>Toutes les prestations du Pack Admission Réussie</strong>
                </li>
                <li>
                  <i class="fas fa-check-circle"></i> Suivi et accompagnement de la procédure de visa, selon votre
                  nationalité
                </li>
                <li>
                  <i class="fas fa-check-circle"></i> <strong>Carte consulaire :</strong> accompagnement pour le montage et
                  le dépôt du dossier
                </li>
                <li>
                  <i class="fas fa-check-circle"></i> <strong>Navette aéroport :</strong> accueil à l'aéroport de
                  Casablanca avec chauffeur privé et transfert vers votre ville et votre université
                </li>
                <li>
                  <i class="fas fa-check-circle"></i> <strong>Carte SIM 4G locale</strong> avec forfait internet, remise à
                  l'arrivée
                </li>
                <li>
                  <i class="fas fa-check-circle"></i> Suivi et accompagnement pour l'ouverture d'un compte étudiant dans
                  une banque de la place
                </li>
                <li>
                  <i class="fas fa-check-circle"></i> <strong>Carte de séjour :</strong> accompagnement dans la préparation
                  du dossier (dépôt effectué par l'étudiant à la préfecture)
                </li>
                <li>
                  <i class="fas fa-check-circle"></i> Ligne d'assistance prioritaire pour l'étudiant et ses parents
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

          {promo.active ? (
            <p class="promo-disclaimer promo-disclaimer-center promo-only">
              <i class="fas fa-circle-info"></i> Tarifs de lancement valables jusqu'au 15 novembre. Le tarif est confirmé
              dès la signature de votre contrat. Les décisions de visa, de carte consulaire et de carte de séjour relèvent
              des autorités compétentes.
            </p>
          ) : (
            <p class="promo-disclaimer promo-disclaimer-center">
              <i class="fas fa-circle-info"></i> Le tarif est confirmé dès la signature de votre contrat. Les décisions de
              visa, de carte consulaire et de carte de séjour relèvent des autorités compétentes.
            </p>
          )}
        </div>
      </section>

      {/* ===== QUESTIONS FRÉQUENTES ===== */}
      <section class="pricing-section" id="faq-tarifs">
        <div class="container" style="max-width: 820px;">
          <div class="section-header">
            <span class="section-badge">
              <i class="fas fa-circle-question"></i> Questions fréquentes
            </span>
            <h2 class="section-title">Vos questions sur nos tarifs et notre accompagnement</h2>
          </div>

          {TARIFS_FAQ.map((item) => (
            <details style="background: var(--white); border: 1px solid #e2e8f0; border-radius: var(--radius-md); padding: 14px 18px; margin-bottom: 10px;">
              <summary style="cursor: pointer; font-weight: 600; color: var(--rose-900); line-height: 1.4;">
                {item.q}
              </summary>
              <p style="margin-top: 10px; font-size: 0.92rem; color: var(--slate-600); line-height: 1.6;">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
};
