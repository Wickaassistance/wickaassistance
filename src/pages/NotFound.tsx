import { waLink } from "../config/site";

export const notFoundMeta = {
  title: "Page introuvable | Wicka Assistance",
  description: "La page demandée n'existe pas ou a été déplacée. Retrouvez nos universités, nos tarifs ou contactez un conseiller Wicka Assistance."
};

/** Page 404 : même gabarit (header + footer) que toutes les autres pages. Servie par app.notFound (src/app.tsx). */
export const NotFound = () => (
  <section class="notfound-section" id="page-introuvable">
    <div class="container">
      <div class="notfound-card">
        <span class="section-badge">
          <i class="fas fa-compass"></i> Erreur 404
        </span>
        <div class="notfound-code">404</div>
        <h1 class="section-title">Page introuvable</h1>
        <p class="section-subtitle">
          La page que vous cherchez n'existe pas ou a été déplacée. Explorez nos universités ou
          échangez directement avec un conseiller.
        </p>
        <div class="notfound-actions">
          <a href="/universites" class="btn-secondary">
            <i class="fas fa-university"></i>
            <span>Voir les universités</span>
          </a>
          <a
            href={waLink("Bonjour Wicka Assistance, je souhaite des informations pour étudier au Maroc.")}
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary"
          >
            <i class="fab fa-whatsapp text-rose"></i>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  </section>
);
