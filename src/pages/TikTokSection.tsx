import { TIKTOK } from "../config/tiktok";

/**
 * Section « Suivez-nous sur TikTok » de la page d'accueil.
 * - Aperçu local (aucune requête vers TikTok au chargement de la page).
 * - La vidéo ne se charge qu'au clic sur ▶ (public/js/tiktok.js).
 * - Si l'aperçu réel est introuvable, l'image de secours du dépôt s'affiche (data-fallback-src).
 * Le CSS et le JS sont chargés ici pour ne pas modifier le Layout.
 */
export const TikTokSection = () => (
  <>
    <link rel="stylesheet" href="/css/tiktok.css" />

    <section class="tiktok-section" id="tiktok">
      <div class="container">
        <div class="tiktok-grid">
          <div class="tiktok-text">
            <span class="section-badge">
              <i class="fab fa-tiktok"></i> Suivez-nous sur TikTok
            </span>
            <h2 class="section-title">Découvrez la vie étudiante au Maroc en vidéo</h2>
            <p>
              Campus, quotidien des étudiants, conseils d'admission et de visa : retrouvez toutes nos vidéos sur TikTok{" "}
              <span class="tiktok-handle">@{TIKTOK.handle}</span>.
            </p>
            <div class="tiktok-actions">
              <a href={TIKTOK.profileUrl} target="_blank" rel="noopener noreferrer" class="btn-tiktok">
                <i class="fab fa-tiktok"></i> Voir sur TikTok
              </a>
              <a href={TIKTOK.profileUrl} target="_blank" rel="noopener noreferrer" class="btn-secondary">
                <i class="fas fa-user-plus"></i> Suivre le compte
              </a>
            </div>
          </div>

          <div class="tiktok-visual">
            <div class="tiktok-card">
              <a
                href={TIKTOK.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="tiktok-play"
                data-tiktok-play=""
                data-profile-url={TIKTOK.profileUrl}
                aria-label="Lire la vidéo TikTok"
              >
                <img
                  src={TIKTOK.previewSrc}
                  data-fallback-src={TIKTOK.fallbackSrc}
                  alt="Aperçu de notre dernière vidéo TikTok"
                  width="540"
                  height="960"
                  loading="lazy"
                />
                <span class="tiktok-play-btn">
                  <i class="fas fa-play"></i>
                </span>
                <span class="tiktok-card-tag">
                  <i class="fab fa-tiktok"></i> @{TIKTOK.handle}
                </span>
              </a>
            </div>
            <p class="tiktok-note">
              En lançant la vidéo, vous chargez le lecteur TikTok, soumis à la politique de confidentialité de TikTok.
            </p>
          </div>
        </div>
      </div>
    </section>

    <script src="/js/tiktok.js" defer></script>
  </>
);
