import type { Child } from "hono/jsx";
import { getPromo, waLink } from "../config/site";

export const homeMeta = {
  title: "Étudier au Maroc | Admission, Visa et Orientation",
  description:
    "Préparez vos études au Maroc avec un accompagnement personnalisé : orientation, admission, visa étudiant, tarifs et accueil des étudiants internationaux."
};

const advantages: { icon: string; title: string; text: string }[] = [
  {
    icon: "fas fa-shield-alt",
    title: "Sécurité et Stabilité Totale",
    text: "Le Maroc bénéficie d'une stabilité institutionnelle et d'une sécurité publique reconnues internationalement. Les étudiants y vivent et se déplacent en toute tranquillité, de jour comme de nuit."
  },
  {
    icon: "fas fa-graduation-cap",
    title: "Diplômes Reconnus et Doubles Diplômes",
    text: "Système LMD (Licence, Master, Doctorat). Les grandes écoles partenaires délivrent des diplômes reconnus par l'État marocain et des doubles diplômes avec la France, l'Europe et les USA."
  },
  {
    icon: "fas fa-train",
    title: "Infrastructures Modernes et TGV Al Boraq",
    text: "Réseaux de transports ultra modernes : TGV reliant Tanger, Rabat et Casablanca à 320 km/h, lignes de tramways urbains modernes et aéroports internationaux reliés à toute l'Afrique."
  },
  {
    icon: "fas fa-handshake",
    title: "Hospitalité et Climat Ensoleillé",
    text: "Une culture d'accueil chaleureuse pour plus de 25 000 étudiants internationaux africains. Aucune rupture linguistique pour les francophones et un climat ensoleillé 300 jours par an."
  },
  {
    icon: "fas fa-coins",
    title: "Budget Maîtrisé et 3x Moins Cher",
    text: "Une qualité d'enseignement équivalente aux meilleures universités européennes pour un coût global de scolarité et de vie 3 à 4 fois inférieur à la France, au Canada ou aux USA."
  },
  {
    icon: "fas fa-briefcase",
    title: "Hub Économique et Stages Garantis",
    text: "Véritable carrefour économique abritant les sièges régionaux de multinationales en finance (Casablanca Finance City), aéronautique, intelligence artificielle et énergies renouvelables."
  }
];

/**
 * Cartes « Explorez nos Services ».
 * Fonction (et non constante) car le texte de la carte Tarifs dépend de l'état de la promo
 * (voir getPromo() dans src/config/site.ts).
 */
const buildExplore = (
  promoActive: boolean
): { href: string; icon: string; title: string; text: Child; link: string; accent?: boolean }[] => [
  {
    href: "/universites",
    icon: "fas fa-university",
    title: "Universités Privées",
    text: "15 grandes écoles reconnues par l'État, avec photos, filières et mini-descriptions.",
    link: "Voir les universités"
  },
  {
    href: "/tarifs",
    icon: "fas fa-tags",
    title: "Tarifs, Simulateur et Packs",
    text: promoActive ? (
      <>
        Tarifs par pays en <strong>promo −50%</strong>, simulateur de budget et formules d'assistance.
      </>
    ) : (
      "Tarifs par pays, simulateur de budget et formules d'assistance."
    ),
    link: "Voir les tarifs"
  },
  {
    href: "/candidature",
    icon: "fas fa-paper-plane",
    title: "Déposer ma Candidature",
    text: promoActive
      ? "Formulaire en 4 étapes. Réponse d'un conseiller sous 24h et tarif promo bloqué."
      : "Formulaire en 4 étapes. Réponse d'un conseiller sous 24h.",
    link: "Postuler maintenant",
    accent: true
  }
];

const steps: { n: string; title: string; text: Child; tagIcon: string; tag: string; tagClass?: string }[] = [
  {
    n: "01",
    title: "Bilan Scolaire Personnalisé",
    text: "Étude personnalisée des relevés de notes et sélection ciblée des meilleures universités privées (UEMF, ESTEM, UIASS, EMSI...).",
    tagIcon: "far fa-clock",
    tag: "24h - 48h"
  },
  {
    n: "02",
    title: "Dépôt et Suivi des Dossiers",
    text: "Constitution optimisée du dossier, lettres de motivation percutantes et soumission directe auprès des directions des admissions.",
    tagIcon: "far fa-clock",
    tag: "3 à 7 jours"
  },
  {
    n: "03",
    title: "Lettre d'Admission Officielle",
    text: "Délivrance de l'attestation officielle d'admission validée par le Ministère de l'Enseignement Supérieur du Maroc.",
    tagIcon: "fas fa-check-circle",
    tag: "Suivi personnalisé",
    tagClass: "text-rose"
  },
  {
    n: "04",
    title: "Visa, Carte Consulaire et Ambassade",
    text: (
      <>
        Constitution du dossier de <strong>carte consulaire</strong> et accompagnement jusqu'au dépôt à l'
        <strong>ambassade / consulat du Maroc</strong> (prise en charge financière, casier, attestation).
      </>
    ),
    tagIcon: "fas fa-passport",
    tag: "Suivi consulaire"
  },
  {
    n: "05",
    title: "Navette, Installation et Carte de Séjour",
    text: (
      <>
        Accueil avec chauffeur privé à l'atterrissage, transfert vers la ville d'accueil, carte SIM 4G et{" "}
        <strong>prise en charge du dossier de Carte de Séjour jusqu'à son obtention</strong>.
      </>
    ),
    tagIcon: "fas fa-car-side",
    tag: "Sécurité VIP",
    tagClass: "text-success"
  }
];

const values: { icon: string; title: string; text: string }[] = [
  {
    icon: "fas fa-user-check",
    title: "Contact Direct Parents",
    text: "Points d'étape réguliers par appel ou visio WhatsApp avec les parents."
  },
  {
    icon: "fas fa-certificate",
    title: "Partenariats Privés Agréés",
    text: "Accès direct aux jurys d'admission (UEMF, ESTEM, UIASS, EMSI, UIR...)."
  },
  {
    icon: "fas fa-file-contract",
    title: "Contrat et Reçu Officiel",
    text: "Paiements locaux sécurisés avec facture et reçu officiel immédiat."
  },
  {
    icon: "fas fa-car",
    title: "Prise en Charge Réelle",
    text: "Un chauffeur et un conseiller dédiés dès la descente de l'avion."
  }
];

const successPhotos = [
  { src: "/assets/uni/student-grad.jpg", alt: "Étudiante diplômée au Maroc", icon: "fas fa-graduation-cap", caption: "Diplômée et fière" },
  { src: "/assets/uni/student-grad-2.jpg", alt: "Jeune diplômé au Maroc", icon: "fas fa-award", caption: "Master en poche" },
  { src: "/assets/uni/student-portrait.jpg", alt: "Étudiant sur son campus", icon: "fas fa-user-graduate", caption: "Sur son campus" }
];

export const Home = () => {
  /**
   * PROMO −50% : évaluée à CHAQUE requête (rendu serveur).
   * Active du 1er août au 15 novembre (UTC), masquée le reste de l'année.
   * Règle complète : getPromo() dans src/config/site.ts et section « Promo » du README.
   * Tout élément promo ci-dessous est conditionné par `promo.active` et porte la classe `promo-only`.
   */
  const promo = getPromo();
  const explore = buildExplore(promo.active);

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
                <span>Admissions Garanties dans les Meilleures Universités Privées du Maroc</span>
              </div>

              <h1 class="hero-headline">
                Sécurisez les Études de Votre Enfant dans les <span class="text-gradient-rose">Grandes Écoles Privées</span>{" "}
                du Maroc.
              </h1>

              <p class="hero-description">
                Wicka Assistance garantit l'admission de votre enfant dans des institutions prestigieuses reconnues par
                l'État (<strong>UEMF Euromed Fès, ESTEM Casa, UIASS, UM6P, UIR, EMSI</strong>), gère l'intégralité du
                dossier consulaire de visa et assure le{" "}
                <strong>transport sécurisé avec chauffeur privé dès la sortie de l'aéroport</strong>.
              </p>

              <div class="hero-cta-group">
                <a href="/candidature" class="btn-primary">
                  <i class="fas fa-graduation-cap"></i>
                  <span>Démarrer la Candidature {promo.rentree}</span>
                </a>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" class="btn-secondary">
                  <i class="fab fa-whatsapp text-rose"></i>
                  <span>WhatsApp</span>
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
                  <strong>Accompagnement dédié aux étudiants</strong>
                  <span>Plébiscité par les parents d'élèves pour son sérieux et sa transparence</span>
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
                  <i class="fas fa-user-shield"></i> Espace Confiance Parents
                </span>
                <h3>Chers Parents : Pourquoi le Maroc est le Meilleur Choix d'Avenir pour Votre Enfant</h3>
                <p>
                  Envoyer son enfant étudier à l'étranger est une décision majeure. Le Royaume du Maroc s'impose
                  aujourd'hui comme le <strong>1er pôle universitaire d'excellence en Afrique</strong> : une stabilité
                  politique exemplaire, une sécurité totale, un climat bienveillant et des campus modernes accrédités
                  aux standards internationaux.
                </p>
              </div>
              <div class="parents-contact-cta">
                <h4>Une Question pour Votre Enfant ?</h4>
                <p>Échangez en direct avec un conseiller senior par appel ou visio WhatsApp.</p>
                <a
                  href={waLink("Bonjour Wicka Assistance, je suis un parent et je souhaite des informations pour mon enfant.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-primary btn-full"
                  style="background: #25D366; border-color: #25D366;"
                >
                  <i class="fab fa-whatsapp"></i> WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div class="section-header">
            <span class="section-badge">
              <i class="fas fa-chart-line"></i> Étude et Analyse
            </span>
            <h2 class="section-title">Les 6 Grands Atouts du Maroc pour les Études Supérieures</h2>
            <p class="section-subtitle">
              Une analyse objective des opportunités académiques, du cadre de vie et de l'insertion professionnelle au
              Royaume du Maroc.
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
            <h2 class="section-title">Explorez nos Services</h2>
            <p class="section-subtitle">
              Découvrez les universités partenaires, comparez les tarifs dans votre devise, puis déposez votre
              candidature.
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
              <i class="fas fa-road"></i> Rigueur et Zéro Faux Pas
            </span>
            <h2 class="section-title">Le Parcours d'Admission en 5 Étapes</h2>
            <p class="section-subtitle">
              Un protocole transparent et éprouvé pour garantir l'admission de l'étudiant et rassurer ses parents à
              chaque étape.
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
                alt="Équipe de conseillers Wicka Assistance à Casablanca"
                class="about-main-img"
              />
              <div class="about-experience-badge">
                <i class="fas fa-shield-alt exp-years" aria-hidden="true"></i>
                <span class="exp-text">Sérieux et Transparence</span>
              </div>
            </div>

            <div class="about-content">
              <span class="section-badge">
                <i class="fas fa-shield-alt"></i> À Propos de Nous
              </span>
              <h2 class="section-title">Une Équipe Passionnée Basée à Casablanca et Rabat</h2>
              <p class="section-subtitle" style="text-align: left; margin-bottom: 20px;">
                Wicka Assistance est un cabinet spécialisé dans la mobilité universitaire et l'orientation stratégique
                des étudiants internationaux vers le Maroc.
              </p>
              <p style="color: var(--slate-600); line-height: 1.7; font-size: 0.95rem;">
                Contrairement aux démarcheurs informels, nous entretenons des liens institutionnels directs avec les
                directions des admissions des universités privées les plus renommées. Nous assurons un suivi juridique
                et consulaire rigoureux pour faire de chaque projet d'études une réussite éclatante.
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
                <span>WhatsApp</span>
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
              <i class="fas fa-star"></i> Retours d'Expérience
            </span>
            <h2 class="section-title">Ce Que Disent les Étudiants et Leurs Parents</h2>
            <p class="section-subtitle">
              Des témoignages réels d'étudiants du Sénégal, de Côte d'Ivoire, du Cameroun et du Gabon admis avec succès
              dans les plus grandes écoles marocaines.
            </p>
          </div>

          <div class="testimonials-grid" id="testimonialsGrid"></div>
        </div>
      </section>

      {/* ===== RÉUSSITES ===== */}
      <section class="success-band">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">
              <i class="fas fa-heart"></i> Une nouvelle vie vous attend
            </span>
            <h2 class="section-title">Épanouissez-vous sur les campus marocains</h2>
            <p class="section-subtitle">
              Étudiants heureux, diplômés fiers : construisez votre avenir au Maroc avec un accompagnement personnalisé.
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
              <i class="fas fa-paper-plane"></i> Je veux réussir moi aussi
            </a>
            <a
              href={waLink("Bonjour Wicka, je veux réussir mes études au Maroc comme vos étudiants.")}
              target="_blank"
              rel="noopener noreferrer"
              class="btn-secondary"
            >
              <i class="fab fa-whatsapp text-rose"></i> En parler sur WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ===== CTA PHOTO + COMPTE À REBOURS (compte à rebours visible seulement si promo active) ===== */}
      <section
        class="cta-photo-band"
        style="background-image: linear-gradient(115deg, rgba(76,5,25,0.92) 0%, rgba(159,18,57,0.82) 55%, rgba(190,18,60,0.7) 100%), url('/assets/uni/tanger.jpg');"
      >
        <div class="container">
          <div class="cta-photo-content">
            <span class="cta-band-kicker light">
              <i class="fas fa-graduation-cap"></i> Rentrée {promo.rentree}
              {promo.active && <> · Il reste peu de places</>}
            </span>
            <h2>Votre avenir au Maroc commence par un simple message.</h2>
            <p>
              Admission garantie, visa, carte consulaire jusqu'à l'ambassade, navette aéroport et carte de séjour : on
              s'occupe de tout. Parlez à un conseiller dès maintenant.
            </p>

            {/*
              Compte à rebours : rendu UNIQUEMENT du 1er août au 15 novembre (UTC).
              Le JS (js/main.js) lit data-promo-deadline et retire tous les .promo-only à l'échéance.
            */}
            {promo.active && (
              <div class="promo-countdown promo-only" id="promoCountdown" data-promo-deadline={promo.deadline}>
                <span class="pc-label">
                  <i class="fas fa-hourglass-half"></i> Fin de la PROMO −50% dans :
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
                <i class="fab fa-whatsapp"></i> Discuter avec un conseiller
              </a>
              <a href="/candidature" class="btn-cta-ghost btn-cta-lg light">
                <i class="fas fa-rocket"></i> Je démarre ma candidature
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
              <i class="fas fa-question-circle"></i> Questions Clés
            </span>
            <h2 class="section-title">Foire Aux Questions Parents et Candidats</h2>
            <p class="section-subtitle">
              Tout savoir sur les admissions en universités privées, les visas, le transport sécurisé et le coût de la
              vie au Maroc.
            </p>
          </div>

          <div class="faq-accordion-wrap" id="faqAccordionContainer"></div>

          <div class="faq-cta-box">
            <div>
              <h3>Une autre question ? Un conseiller vous répond en quelques minutes.</h3>
              <p>
                {promo.active
                  ? "Ne restez pas dans le doute : profitez de la promo −50% avant la fin du compte à rebours."
                  : "Ne restez pas dans le doute : un conseiller vous accompagne à chaque étape de votre projet."}
              </p>
            </div>
            <div class="faq-cta-actions">
              <a
                href={waLink("Bonjour Wicka, j'ai une question avant de souscrire.")}
                target="_blank"
                rel="noopener noreferrer"
                class="btn-cta-white"
              >
                <i class="fab fa-whatsapp"></i> Poser ma question sur WhatsApp
              </a>
              <a href="/candidature" class="btn-cta-ghost">
                <i class="fas fa-paper-plane"></i> Postuler maintenant
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
