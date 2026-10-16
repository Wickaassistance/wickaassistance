import { waLink } from "../config/site";

export const universitesMeta = {
  title: "Universités privées au Maroc | Orientation",
  description:
    "Comparez les filières, les villes et les parcours d’études au Maroc avec un accompagnement personnalisé pour choisir une formation adaptée à votre projet.",
  keywords:
    "universités privées Maroc, études supérieures Maroc, formations Maroc, orientation universitaire, filières Maroc, étudiant international"
};

export const Universites = () => (
  <>
    <section class="universities-section" id="universites">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">
            <i class="fas fa-university"></i> Universités Privées d'Excellence
          </span>
          <h2 class="section-title">Grandes Écoles et Universités Privées Partenaires</h2>
          <p class="section-subtitle">
            Wicka Assistance travaille exclusivement avec les meilleures institutions privées accréditées par l'État
            marocain :{" "}
            <strong>
              UEMF Euromed Fès, Al Akhawayn Ifrane, UM6SS, UM6P, ESCA, UIASS, UIR, ESTEM, EMSI, UPM Marrakech, UPF Fès,
              ISGA
            </strong>{" "}
            et bien d'autres. Chaque fiche inclut une mini-description pour vous aider à choisir.
          </p>
        </div>

        {/* Filter Bar */}
        <div class="filter-bar-wrapper">
          <div class="filter-top-row">
            <div class="search-input-wrap">
              <i class="fas fa-search"></i>
              <input
                type="text"
                id="universitySearchInput"
                placeholder="Rechercher une école, un diplôme (ex: Euromed Fès, ESTEM, Pharmacie, IA, Aérospatiale, Médecine)..."
              />
            </div>
            <div class="city-select-wrap">
              <select id="cityFilterSelect">
                <option value="all">Toutes les Villes</option>
                <option value="casablanca">Casablanca</option>
                <option value="rabat">Rabat / Salé</option>
                <option value="fes">Fès (Euromed)</option>
                <option value="marrakech">Marrakech</option>
                <option value="tanger">Tanger</option>
                <option value="ifrane">Ifrane (Al Akhawayn)</option>
              </select>
            </div>
          </div>

          <div class="filter-tabs-row">
            <button type="button" class="filter-tab-btn active" data-domain="all">
              Toutes les Filières
            </button>
            <button type="button" class="filter-tab-btn" data-domain="medecine">
              🩺 Médecine et Pharmacie (UIASS, UIC)
            </button>
            <button type="button" class="filter-tab-btn" data-domain="ingenierie">
              💻 Ingénierie et IA (Euromed, EMSI, UIR)
            </button>
            <button type="button" class="filter-tab-btn" data-domain="business">
              📈 Business et Finance (ESTEM, ESCA, HEM)
            </button>
            <button type="button" class="filter-tab-btn" data-domain="architecture">
              🏛️ Architecture et Urbanisme
            </button>
            <button type="button" class="filter-tab-btn" data-domain="droit">
              ⚖️ Droit et Sciences Politiques
            </button>
          </div>
        </div>

        <div class="universities-count-bar" id="universitiesCount">
          Chargement des établissements...
        </div>

        {/* Dynamic Grid */}
        <div class="universities-grid" id="universitiesGrid">
          {/* Rendered dynamically by js/main.js from js/data.js */}
        </div>
      </div>
    </section>

    <section class="cta-band">
      <div class="container">
        <div class="cta-band-inner">
          <div class="cta-band-glow"></div>
          <div class="cta-band-text">
            <span class="cta-band-kicker">
              <i class="fas fa-bolt"></i> Places limitées · Promo −50%
            </span>
            <h2>Vous hésitez entre plusieurs écoles ? Ne perdez pas votre place.</h2>
            <p>
              Un conseiller Wicka analyse votre dossier et vous réserve une admission dans la meilleure université privée
              pour votre profil — en 24h.
            </p>
            <div class="cta-band-trust">
              <span>
                <i class="fas fa-circle-check"></i> Réponse en 24h
              </span>
              <span>
                <i class="fas fa-circle-check"></i> Suivi des démarches visa
              </span>
              <span>
                <i class="fas fa-circle-check"></i> Paiement local sécurisé
              </span>
            </div>
          </div>
          <div class="cta-band-actions">
            <a
              href={waLink("Bonjour Wicka, je veux réserver ma place étudiant au Maroc (Promo).")}
              target="_blank"
              rel="noopener noreferrer"
              class="btn-cta-white"
            >
              <i class="fab fa-whatsapp"></i> Réserver ma place maintenant
            </a>
            <a href="/candidature" class="btn-cta-ghost">
              <i class="fas fa-paper-plane"></i> Faire évaluer mon dossier
            </a>
            <span class="cta-band-microcopy">🔒 Sans engagement · Réponse d'un conseiller sous 30 min</span>
          </div>
        </div>
      </div>
    </section>
  </>
);
