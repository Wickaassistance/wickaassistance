import type { Child } from "hono/jsx";
import { getPromo, waLink } from "../config/site";
import { TikTokSection } from "./TikTokSection";

export const homeMeta = {
  title: "Étudier au Maroc | Admission, Visa et Orientation",
  description:
    "Préparez vos études au Maroc avec un accompagnement personnalisé : orientation, admission, visa étudiant, tarifs et accueil des étudiants internationaux."
};

const advantages: { icon: string; title: string; text: string }[] = [
  {
    icon: "fas fa-shield-alt",
    title: "Un cadre de vie sûr et stable",
    text: "Le Maroc est l'une des destinations les plus stables d'Afrique pour les étudiants internationaux, avec une vie étudiante animée dans des villes modernes."
  },
  {
    icon: "fas fa-graduation-cap",
    title: "Des diplômes reconnus",
    text: "Système LMD (Licence, Master, Doctorat), établissements reconnus par l'État et, dans certaines écoles, des doubles diplômes avec des universités européennes ou nord-américaines."
  },
  {
    icon: "fas fa-train",
    title: "Des villes bien connectées",
    // À VÉRIFIER avant publication : durée du trajet TGV Al Boraq Tanger–Casablanca (environ 2 h 10)
    text: "Tramways, TGV Al Boraq (environ 2 h 10 entre Tanger et Casablanca) et aéroports internationaux reliés à de nombreuses capitales africaines."
  },
  {
    icon: "fas fa-handshake",
    title: "Un accueil chaleureux, sans barrière de langue",
    // À VÉRIFIER avant publication : nombre d'étudiants internationaux (25 000 à 30 000)
    text: "Enseignement en français et communauté étudiante africaine importante (environ 25 000 à 30 000 étudiants internationaux), dans un climat doux et ensoleillé."
  },
  {
    icon: "fas fa-coins",
    title: "Un niveau de vie agréable, à moindre coût",
    // À VÉRIFIER avant publication : scolarité (à partir de 30 000 MAD/an) et budget de vie (3 500 à 6 000 MAD/mois)
    text: "Scolarité en école privée à partir d'environ 30 000 MAD par an et budget de vie d'environ 3 500 à 6 000 MAD par mois, logement compris. C'est nettement moins cher que la France, le Canada ou les États-Unis."
  },
  {
    icon: "fas fa-briefcase",
    title: "Un tremplin professionnel",
    text: "Casablanca Finance City, aéronautique, énergies renouvelables, numérique : des secteurs qui recrutent, avec des stages proposés par de nombreuses écoles."
  }
];

/**
 * Cartes « Lancez votre projet en 3 étapes ».
 * Fonction (et non constante) car le texte de la carte Tarifs dépend de l'état de la promo
 * (voir getPromo() dans src/config/site.ts).
 */
const buildExplore = (
  promoActive: boolean,
  rentree: string
): { href: string; icon: string; title: string; text: Child; link: string; accent?: boolean }[] => [
  {
    href: "/universites",
    icon: "fas fa-university",
    title: "Choisir mon école",
    text: "Découvrez les grandes écoles privées reconnues par l'État, leurs filières et leurs villes.",
    link: "Voir les universités au Maroc"
  },
  {
    href: "/tarifs",
    icon: "fas fa-tags",
    title: "Estimer mon budget",
    text: promoActive ? (
      <>
        Tarifs par pays, simulateur de budget et formules d'accompagnement.
        <span class="promo-only">
          {" "}
          Offre de lancement <strong>−50 %</strong> pour la rentrée {rentree}.
        </span>
      </>
    ) : (
      "Tarifs par pays, simulateur de budget et formules d'accompagnement."
    ),
    link: "Voir les tarifs"
  },
  {
    href: "/candidature",
    icon: "fas fa-paper-plane",
    title: "Déposer ma candidature",
    text: "Un formulaire en 4 étapes, puis un conseiller vous répond sous 72 h maximum.",
    link: "Déposer ma candidature",
    accent: true
  }
];

const steps: { n: string; title: string; text: Child; tagIcon: string; tag: string; tagClass?: string }[] = [
  {
    n: "01",
    title: "Bilan scolaire et choix des écoles",
    text: "Nous étudions vos relevés de notes et vous orientons vers les écoles privées reconnues par l'État qui correspondent à votre profil et à votre budget.",
    tagIcon: "far fa-clock",
    tag: "24 à 48 h"
  },
  {
    n: "02",
    title: "Inscription et suivi du dossier",
    text: "Nous constituons votre dossier complet, rédigeons avec vous votre lettre de motivation, réalisons l'inscription et suivons la réponse de l'école.",
    tagIcon: "far fa-clock",
    tag: "3 à 7 jours"
  },
  {
    n: "03",
    title: "Lettre d'admission",
    text: "Une fois l'admission confirmée, l'école ou l'université vous délivre votre lettre d'admission, document indispensable pour la suite.",
    tagIcon: "fas fa-check-circle",
    tag: "Selon l'école",
    tagClass: "text-rose"
  },
  {
    n: "04",
    title: "Visa et préparation du départ",
    // À VÉRIFIER avant publication : le visa est-il requis pour tous les pays ciblés ?
    text: "Nous vous guidons pour réunir les documents demandés (attestation de prise en charge financière, extrait de casier judiciaire, justificatifs) et préparer votre voyage.",
    tagIcon: "fas fa-passport",
    tag: "Selon votre pays"
  },
  {
    n: "05",
    title: "Arrivée, installation et démarches au Maroc",
    text: (
      <>
        Un chauffeur vous accueille à l'aéroport et vous conduit dans votre ville d'accueil, avec une carte SIM 4G. Nous
        vous accompagnons pour la <strong>carte consulaire</strong> auprès de l'ambassade de votre pays, puis nous
        suivons votre dossier de <strong>carte de séjour</strong>.
      </>
    ),
    tagIcon: "fas fa-car-side",
    tag: "Dès l'atterrissage",
    tagClass: "text-success"
  }
];

const values: { icon: string; title: string; text: string }[] = [
  {
    icon: "fas fa-user-check",
    title: "Un conseiller dédié",
    text: "Points réguliers par appel ou visio WhatsApp avec l'étudiant et ses parents."
  },
  {
    icon: "fas fa-clipboard-check",
    title: "Inscription prise en charge",
    text: "Nous réalisons les inscriptions et suivons votre dossier jusqu'à la réponse de l'école."
  },
  {
    icon: "fas fa-file-contract",
    title: "Contrat et reçu officiel",
    text: "Facture et reçu remis immédiatement à chaque paiement."
  },
  {
    icon: "fas fa-car",
    title: "Accueil dès l'atterrissage",
    text: "Un chauffeur vous attend à l'aéroport et un conseiller reste joignable."
  }
];

const successPhotos = [
  {
    src: "/assets/uni/student-grad.jpg",
    alt: "Étudiante diplômée lors d'une remise de diplôme au Maroc",
    icon: "fas fa-graduation-cap",
    caption: "Remise de diplôme"
  },
  {
    src: "/assets/uni/student-grad-2.jpg",
    alt: "Jeune diplômé d'un master au Maroc",
    icon: "fas fa-award",
    caption: "Un master pour lancer sa carrière"
  },
  {
    src: "/assets/uni/student-portrait.jpg",
    alt: "Étudiant sur un campus au Maroc",
    icon: "fas fa-user-graduate",
    caption: "La vie sur un campus marocain"
  }
];

export const Home = () => {
  /**
   * PROMO −50% : évaluée à CHAQUE requête (rendu serveur).
   * Active du 1er août au 15 novembre (UTC), masquée le reste de l'année.
   * Règle complète : getPromo() dans src/config/site.ts et section « Promo » du README.
   * Tout élément promo ci-dessous est conditionné par `promo.active` et porte la classe `promo-only`.
   */
  const promo = getPromo();
  const explore = buildExplore(promo.active, promo.rentree);

  return (
    <>
      {/* ===== HERO ===== */}
      <section class="hero-section" id="hero">
        <div class="hero-glow-circle-1"></div>
        <div class="hero-glow-circle-2"></div>

        <div class="container">
          <div class="hero-grid">
            <div class="hero-text-content">
              <div class="hero-badge-pill">
                <span class="pulse-dot"></span>
                <span>Admission, visa et accueil au Maroc</span>
              </div>

              <h1 class="hero-headline">
                <span class="text-gradient-rose">Étudier au Maroc</span> : on s'occupe de votre admission, de votre visa et
                de votre arrivée.
              </h1>

              <p class="hero-description">
                Nous constituons votre dossier d'admission dans les grandes écoles privées reconnues par l'État (
                <strong>UEMF, ESTEM, UIR, EMSI, UM6P…</strong>), vous accompagnons pour la carte consulaire et le visa,
                puis vous accueillons à l'aéroport avec un chauffeur dédié.
              </p>

              <div class="hero-cta-group">
                <a href="/candidature" class="btn-primary">
                  <i class="fas fa-graduation-cap"></i>
                  <span>Démarrer ma candidature {promo.rentree}</span>
                </a>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" class="btn-secondary">
                  <i class="fab fa-whatsapp text-rose"></i>
                  <span>Parler à un conseiller</span>
                </a>
              </div>

              <div class="hero-trust-row">
                <div class="trust-avatars-group">
                  <img src="/assets/images/student-senegal.jpg" alt="Étudiant Sénégal" class="trust-avatar" />
                  <img src="/assets/images/student-ivory-coast.jpg" alt="Étudiante Côte d'Ivoire" class="trust-avatar" />
                  <img src="/assets/images/student-cameroon.jpg" alt="Étudiant Cameroun" class="trust-avatar" />
                  <img src="/assets/images/student-gabon.jpg" alt="Étudiante Gabon" class="trust-avatar" />
                </div>
                <div class="trust-text">
                  <strong>Accompagnement de A à Z</strong>
                  <span>de la candidature à la carte de séjour</span>
                </div>
              </div>
            </div>

            <div class="hero-visual-wrap">
              <div class="hero-main-card">
                <img
                  src="/assets/images/hero-students.jpg"
                  alt="Étudiants internationaux heureux sur les campus marocains"
                />
              </div>

              <div class="hero-floating-card-1">
                <div class="floating-icon">
                  <i class="fas fa-car-side"></i>
                </div>
                <div class="floating-info">
                  <h4>Navette Aéroport Privée</h4>
                  <p>Transfert sécurisé vers votre ville</p>
                </div>
              </div>

              <div class="hero-floating-card-2">
                <div class="floating-icon" style="background-color: var(--gold-light); color: var(--gold);">
                  <i class="fas fa-award"></i>
                </div>
                <div class="floating-info">
                  <h4>Diplômes Reconnus</h4>
                  <p>Équivalence d'État et Doubles Diplômes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ESPACE PARENTS ===== */}
      <section class="parents-section" id="parents">
        <div class="container">
          <div class="parents-banner-box">
            <div class="parents-banner-grid">
              <div class="parents-banner-text">
                <span
                  class="section-badge"
                  style="background-color: rgba(255, 255, 255, 0.2); color: var(--white); margin-bottom: 12px;"
                >
                  <i class="fas fa-user-shield"></i> Pour les parents
                </span>
                <h3>Vous confiez votre enfant à quelqu'un : voici comment nous veillons sur lui au Maroc</h3>
                <p>
                  Envoyer son enfant étudier à l'étranger est une grande décision. Le Maroc est une destination sûre et
                  accessible pour les étudiants africains francophones : même langue d'enseignement, niveau de vie
                  agréable, coût des études et de la vie bien inférieur à celui de l'Europe, établissements reconnus par
                  l'État. Chez Wicka Assistance, un conseiller reste votre interlocuteur de l'admission jusqu'à
                  l'obtention de la carte de séjour, avec des points réguliers par appel ou visio WhatsApp.
                </p>
              </div>
              <div class="parents-contact-cta">
                <h4>Une question sur le projet de votre enfant ?</h4>
                <p>Un conseiller vous répond par appel ou visio WhatsApp.</p>
                <a
                  href={waLink("Bonjour Wicka Assistance, je suis un parent et je souhaite des informations pour mon enfant.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-primary btn-full"
                  style="background: #25D366; border-color: #25D366;"
                >
                  <i class="fab fa-whatsapp"></i> Parler à un conseiller
                </a>
              </div>
            </div>
          </div>

          <div class="section-header">
            <span class="section-badge">
              <i class="fas fa-chart-line"></i> Pourquoi le Maroc
            </span>
            <h2 class="section-title">6 raisons de choisir le Maroc pour ses études supérieures</h2>
            <p class="section-subtitle">
              Cadre de vie, diplômes, coût et débouchés : ce qui attire chaque année des milliers d'étudiants africains.
            </p>
          </div>

          <div class="advantages-grid">
            {advantages.map((a) => (
              <div class="advantage-card">
                <div class="advantage-icon-wrap">
                  <i class={a.icon}></i>
                </div>
                <h3 class="advantage-title">{a.title}</h3>
                <p class="advantage-desc">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EXPLOREZ ===== */}
      <section class="explore-section">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">
              <i class="fas fa-compass"></i> Par où commencer ?
            </span>
            <h2 class="section-title">Lancez votre projet d'études au Maroc en 3 étapes</h2>
            <p class="section-subtitle">
              Choisissez votre école, estimez votre budget, puis déposez votre candidature. Nous nous occupons ensuite de
              l'inscription et des démarches.
            </p>
          </div>
          <div class="explore-cards">
            {explore.map((e) => (
              <a href={e.href} class={e.accent ? "explore-card explore-card-accent" : "explore-card"}>
                <div class="explore-icon">
                  <i class={e.icon}></i>
                </div>
                <h3>{e.title}</h3>
                <p>{e.text}</p>
                <span class="explore-link">
                  {e.link} <i class="fas fa-arrow-right"></i>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PARCOURS EN 5 ÉTAPES ===== */}
      <section class="steps-section" id="etapes">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">
              <i class="fas fa-road"></i> Notre méthode
            </span>
            <h2 class="section-title">De la candidature à la carte de séjour : votre parcours en 5 étapes</h2>
            <p class="section-subtitle">
              Un parcours clair, avec un conseiller à vos côtés à chaque étape. L'étudiant et ses parents savent toujours
              où en est le dossier.
            </p>
          </div>

          <div class="steps-timeline-grid">
            {steps.map((s) => (
              <div class="step-card">
                <div>
                  <div class="step-num-badge">{s.n}</div>
                  <h3 class="step-title">{s.title}</h3>
                  <p class="step-desc">{s.text}</p>
                </div>
                <span class={s.tagClass ? `step-footer-tag ${s.tagClass}` : "step-footer-tag"}>
                  <i class={s.tagIcon}></i> {s.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== À PROPOS ===== */}
      <section class="about-section" id="apropos">
        <div class="container">
          <div class="about-grid">
            <div class="about-image-wrapper">
              <img
                src="/assets/images/about-team.jpg"
                alt="Étudiants accompagnés par Wicka Assistance au Maroc"
                class="about-main-img"
              />
              <div class="about-experience-badge">
                <i class="fas fa-shield-alt exp-years" aria-hidden="true"></i>
                <span class="exp-text">Sérieux et Transparence</span>
              </div>
            </div>

            <div class="about-content">
              <span class="section-badge">
                <i class="fas fa-shield-alt"></i> À propos de Wicka Assistance
              </span>
              <h2 class="section-title">
                Une équipe basée à Casablanca et Rabat, à vos côtés avant et après votre arrivée
              </h2>
              <p style="color: var(--slate-600); line-height: 1.7; font-size: 0.95rem;">
                Wicka Assistance accompagne les étudiants internationaux qui veulent étudier au Maroc : orientation,
                inscription dans les écoles privées reconnues par l'État, démarches de visa, accueil à l'aéroport, carte
                consulaire et carte de séjour. Notre équipe est installée au Maroc : nous connaissons les écoles, les
                administrations et les délais. Chaque dossier est suivi par un conseiller identifié, avec un contrat et un
                reçu officiel pour chaque paiement.
              </p>

              <div class="about-values-list">
                {values.map((v) => (
                  <div class="value-item">
                    <div class="value-icon">
                      <i class={v.icon}></i>
                    </div>
                    <div>
                      <h4>{v.title}</h4>
                      <p>{v.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a href={waLink()} target="_blank" rel="noopener noreferrer" class="btn-primary">
                <i class="fab fa-whatsapp"></i>
                <span>Parler à un conseiller</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AVIS (rendu par js/main.js depuis js/data.js) ===== */}
      <section class="testimonials-section" id="avis">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">
              <i class="fas fa-star"></i> Avis et témoignages
            </span>
            <h2 class="section-title">Ce que disent les étudiants et leurs parents</h2>
            <p class="section-subtitle">
              Des étudiants du Sénégal, de Côte d'Ivoire, du Cameroun et du Gabon racontent leur parcours avec Wicka
              Assistance, de l'inscription à l'installation au Maroc.
            </p>
          </div>

          <div class="testimonials-grid" id="testimonialsGrid"></div>
        </div>
      </section>

      {/* ===== GALERIE VIE ÉTUDIANTE ===== */}
      <section class="success-band">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">
              <i class="fas fa-heart"></i> Votre future vie étudiante
            </span>
            <h2 class="section-title">Étudier au Maroc : une nouvelle vie vous attend</h2>
            <p class="section-subtitle">
              Campus modernes, vie étudiante animée, diplôme à la clé : construisez votre avenir au Maroc, avec un
              accompagnement du premier dossier à l'installation.
            </p>
          </div>

          <div class="success-photos">
            {successPhotos.map((p) => (
              <figure class="success-photo">
                <img src={p.src} alt={p.alt} loading="lazy" />
                <figcaption>
                  <i class={p.icon}></i> {p.caption}
                </figcaption>
              </figure>
            ))}
          </div>

          <div class="success-cta">
            <a href="/candidature" class="btn-primary">
              <i class="fas fa-paper-plane"></i> Commencer ma candidature
            </a>
            <a
              href={waLink("Bonjour Wicka, je souhaite des informations pour étudier au Maroc.")}
              target="_blank"
              rel="noopener noreferrer"
              class="btn-secondary"
            >
              <i class="fab fa-whatsapp text-rose"></i> En parler sur WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ===== TIKTOK (aperçu local, vidéo chargée au clic ; config dans src/config/tiktok.ts) ===== */}
      <TikTokSection />

      {/* ===== CTA PHOTO + COMPTE À REBOURS (compte à rebours visible seulement si promo active) ===== */}
      <section
        class="cta-photo-band"
        style="background-image: linear-gradient(115deg, rgba(76,5,25,0.92) 0%, rgba(159,18,57,0.82) 55%, rgba(190,18,60,0.7) 100%), url('/assets/uni/tanger.jpg');"
      >
        <div class="container">
          <div class="cta-photo-content">
            <span class="cta-band-kicker light">
              <i class="fas fa-graduation-cap"></i> Rentrée {promo.rentree}
              {promo.active && <span class="promo-only"> · Offre de lancement −50 %</span>}
            </span>
            <h2>Votre avenir au Maroc commence par un simple message.</h2>
            <p>
              Inscription, visa, accueil à l'aéroport, carte consulaire et carte de séjour : nous vous accompagnons à
              chaque étape. Écrivez à un conseiller dès maintenant, il vous répond sous 72 h maximum.
            </p>

            {/*
              Compte à rebours : rendu UNIQUEMENT du 1er août au 15 novembre (UTC).
              Le JS (js/main.js) lit data-promo-deadline et retire tous les .promo-only à l'échéance.
            */}
            {promo.active && (
              <div class="promo-countdown promo-only" id="promoCountdown" data-promo-deadline={promo.deadline}>
                <span class="pc-label">
                  <i class="fas fa-hourglass-half"></i> L'offre de lancement −50 % se termine dans :
                </span>
                <div class="pc-units">
                  <div>
                    <strong id="pcDays">00</strong>
                    <span>jours</span>
                  </div>
                  <div class="pc-sep">:</div>
                  <div>
                    <strong id="pcHours">00</strong>
                    <span>heures</span>
                  </div>
                  <div class="pc-sep">:</div>
                  <div>
                    <strong id="pcMins">00</strong>
                    <span>min</span>
                  </div>
                  <div class="pc-sep">:</div>
                  <div>
                    <strong id="pcSecs">00</strong>
                    <span>sec</span>
                  </div>
                </div>
              </div>
            )}

            <div class="cta-photo-actions">
              <a
                href={waLink("Bonjour Wicka, je souhaite démarrer mon projet d'études au Maroc dès maintenant.")}
                target="_blank"
                rel="noopener noreferrer"
                class="btn-cta-white btn-cta-lg"
              >
                <i class="fab fa-whatsapp"></i> Parler à un conseiller
              </a>
              <a href="/candidature" class="btn-cta-ghost btn-cta-lg light">
                <i class="fas fa-rocket"></i> Démarrer ma candidature
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ (rendue par js/main.js depuis js/data.js) ===== */}
      <section class="faq-section" id="faq">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">
              <i class="fas fa-question-circle"></i> Questions fréquentes
            </span>
            <h2 class="section-title">Étudier au Maroc : vos questions, nos réponses</h2>
            <p class="section-subtitle">
              Admission, visa, carte consulaire, carte de séjour, budget et accueil : les réponses aux questions que se
              posent les parents et les candidats.
            </p>
          </div>

          <div class="faq-accordion-wrap" id="faqAccordionContainer"></div>

          <div class="faq-cta-box">
            <div>
              <h3>Une autre question ?</h3>
              <p>
                Écrivez-nous sur WhatsApp : un conseiller vous répond sous 72 h maximum. Vous pouvez aussi démarrer
                directement votre candidature.
              </p>
            </div>
            <div class="faq-cta-actions">
              <a
                href={waLink("Bonjour Wicka, j'ai une question avant de déposer ma candidature.")}
                target="_blank"
                rel="noopener noreferrer"
                class="btn-cta-white"
              >
                <i class="fab fa-whatsapp"></i> Poser ma question sur WhatsApp
              </a>
              <a href="/candidature" class="btn-cta-ghost">
                <i class="fas fa-paper-plane"></i> Démarrer ma candidature
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
