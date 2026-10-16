export const politiqueConfidentialiteMeta = {
  title: "Politique de confidentialité | Wicka Assistance",
  description:
    "Découvrez comment Wicka Assistance collecte, utilise et protège les données transmises via ses formulaires de contact et de candidature.",
  keywords: "politique confidentialité étudiant, données personnelles, formulaires études Maroc, Wicka Assistance"
};

export const PolitiqueConfidentialite = () => (
  <section class="application-section brand-light-section">
    <div class="container">
      <div class="section-header">
        <span class="section-badge">
          <i class="fas fa-lock"></i> Vos données
        </span>
        <h1 class="section-title">Politique de confidentialité</h1>
        <p class="section-subtitle">Une information claire sur l’utilisation des données transmises par les formulaires.</p>
      </div>
      <article class="app-form-box legal-content">
        <h2>Données collectées</h2>
        <p>
          Lorsque vous utilisez le formulaire de contact ou de candidature, nous pouvons recevoir les informations que
          vous saisissez : identité, coordonnées, pays, projet d’études et préférences de suivi.
        </p>
        <h2>Finalités</h2>
        <p>
          Ces données servent uniquement à répondre à votre demande, étudier votre projet, vous recontacter et vous
          envoyer la confirmation de réception de votre message ou candidature.
        </p>
        <h2>Transmission et conservation</h2>
        <p>
          Les messages peuvent être transmis par l’intermédiaire du service d’envoi d’e-mails Brevo à l’adresse de Wicka
          Assistance et à l’adresse fournie par l’utilisateur. Le site ne vend pas vos données et ne les utilise pas pour
          une finalité étrangère à votre demande.
        </p>
        <p>
          La durée de conservation doit rester limitée au temps nécessaire au traitement et au suivi de la demande, sous
          réserve des obligations applicables.
        </p>
        <h2>Vos droits</h2>
        <p>
          Vous pouvez demander l’accès, la rectification ou la suppression de vos données en écrivant à{" "}
          <a href="mailto:wickaassistance@gmail.com">wickaassistance@gmail.com</a>.
        </p>
        <h2>Sécurité</h2>
        <p>
          Ne transmettez pas de document sensible ou de pièce d’identité par le formulaire sans demande explicite d’un
          conseiller. Les informations envoyées doivent être exactes et limitées à ce qui est nécessaire.
        </p>
        <h2 id="cookies">Cookies et stockage local</h2>
        <p>
          Le site n’utilise pas de cookie publicitaire, de cookie de suivi ou d’outil d’analyse comportementale. La
          bannière de confidentialité mémorise uniquement votre choix dans le stockage local de votre navigateur afin de
          ne pas vous être présentée à chaque visite. Vous pouvez effacer cette préférence depuis les réglages de votre
          navigateur.
        </p>
        <p>
          Les ressources externes éventuellement chargées, comme la bibliothèque d’icônes ou les polices, peuvent
          recevoir des informations techniques nécessaires à leur fonctionnement selon leurs propres politiques. Aucun
          service externe n’est utilisé pour suivre votre navigation à des fins publicitaires.
        </p>
        <p class="legal-updated">Dernière mise à jour : 15 octobre 2026.</p>
      </article>
    </div>
  </section>
);
