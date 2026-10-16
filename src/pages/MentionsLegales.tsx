export const mentionsLegalesMeta = {
  title: "Mentions légales | Wicka Assistance",
  description:
    "Consultez les mentions légales du site Wicka Assistance, service d’orientation et d’accompagnement pour les études au Maroc.",
  keywords: "mentions légales Wicka Assistance, études Maroc, accompagnement étudiant"
};

export const MentionsLegales = () => (
  <section class="application-section brand-light-section">
    <div class="container">
      <div class="section-header">
        <span class="section-badge">
          <i class="fas fa-scale-balanced"></i> Informations légales
        </span>
        <h1 class="section-title">Mentions légales</h1>
        <p class="section-subtitle">Les informations essentielles concernant le site Wicka Assistance.</p>
      </div>
      <article class="app-form-box legal-content">
        <h2>Éditeur du site</h2>
        <p>
          Le site Wicka Assistance est édité par Wicka Assistance, service d’accompagnement et d’orientation pour les
          étudiants internationaux souhaitant étudier au Maroc.
        </p>
        <p>
          Contact : <a href="mailto:wickaassistance@gmail.com">wickaassistance@gmail.com</a> — WhatsApp :{" "}
          <a href="https://wa.me/212789095498">+212 7 89 09 54 98</a>.
        </p>
        <h2>Hébergement</h2>
        <p>
          Le site est déployé sur l’infrastructure Cloudflare Workers, avec mise en cache et distribution mondiale des
          ressources statiques. L’hébergement peut évoluer sans modifier les présentes informations essentielles. La
          version et le domaine effectivement utilisés sont ceux indiqués dans la barre d’adresse du navigateur.
        </p>
        <h2>Responsabilité</h2>
        <p>
          Les informations publiées sont fournies à titre informatif. Wicka Assistance accompagne les démarches, mais ne
          garantit pas l’admission, l’obtention d’un visa, d’une bourse ou d’un document administratif.
        </p>
        <p>
          Lorsque l’établissement demande un examen ou un concours d’entrée, la décision dépend de l’établissement et du
          résultat obtenu par l’étudiant.
        </p>
        <h2>Propriété intellectuelle</h2>
        <p>
          Les textes, éléments graphiques, logos et contenus du site ne peuvent pas être reproduits ou réutilisés sans
          autorisation, sauf dispositions légales applicables.
        </p>
        <p class="legal-updated">Dernière mise à jour : 15 octobre 2026.</p>
      </article>
      <p class="legal-back">
        <a href="/">
          <i class="fas fa-arrow-left"></i> Retour à l’accueil
        </a>
      </p>
    </div>
  </section>
);
