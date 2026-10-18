import { TIKTOK } from "../config/tiktok";

/**
 * Section « Suivez-nous sur TikTok » de la page d'accueil.
 * - Sans vidéo (TIKTOK.videoId vide) : seul le bloc texte et les boutons sont affichés,
 *   aucune image, aucune carte, aucun script.
 * - Avec vidéo : la carte d'aperçu s'affiche (fond dégradé rose + bouton ▶, sans image de secours).
 *   La vidéo ne se charge qu'au clic sur ▶ (public/js/tiktok.js), aucune requête vers TikTok
 *   au chargement de la page.
 * Le CSS et le JS sont chargés ici pour ne pas modifier le Layout.
 */
export const TikTokSection = () => {
  const hasVideo = Boolean(TIKTOK.videoId);

  return (
    <>
      <link rel="stylesheet" href="/css/tiktok.css" />

      <section class="tiktok-section" id="tiktok">
        <div class="container">
          <div class={hasVideo ? "tiktok-grid" : "tiktok-grid is-text-only"}>
            <div class="tiktok-text">
              <span class="section-badge">
                <i class="fab fa-tiktok"></i> Suivez-nous sur TikTok
              </span>
              <h2 class="section-title">La vie étudiante au Maroc, racontée par notre gérante</h2>
              <p>
                Le compte TikTok <span class="tiktok-handle">@{TIKTOK.handle}</span> est celui de la gérante de Wicka
                Assistance, visage de la société. Elle vit et étudie elle-même au Maroc : vous y découvrez son
                quotidien, sans mise en scène.
              </p>
              <p>
                Campus, logement, budget, ambiance en ville, mais aussi conseils concrets sur les démarches
                d'admission et de visa : une façon simple de vous projeter avant de partir.
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

            {hasVideo && (
              <div class="tiktok-visual">
                <div class="tiktok-card">
                  <a
                    href={TIKTOK.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="tiktok-play"
                    data-tiktok-play=""
                    aria-label="Lire la vidéo TikTok"
                  >
                    <img
                      src={TIKTOK.previewSrc}
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
                  En lançant la vidéo, vous chargez le lecteur TikTok, soumis à la politique de confidentialité de
                  TikTok.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {hasVideo && <script src="/js/tiktok.js" defer></script>}
    </>
  );
};
