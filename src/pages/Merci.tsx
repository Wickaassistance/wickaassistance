export const merciMeta = {
  title: "Merci | Candidature reçue | Wicka Assistance",
  description:
    "Votre candidature a été reçue par Wicka Assistance. Un conseiller reviendra vers vous pour la suite de votre projet d’études au Maroc.",
  keywords: "candidature reçue, études Maroc, Wicka Assistance"
};

/** Script de la page (récapitulatif lu dans sessionStorage) — copié à l'identique. */
const thanksScript = `
    (function () {
      var data = null;
      try { data = JSON.parse(sessionStorage.getItem('wickaApplication') || 'null'); } catch (e) {}

      var recap = document.getElementById('thanksRecap');
      var title = document.getElementById('thanksTitle');
      var lead = document.getElementById('thanksLead');

      if (data && data.fullName) {
        var first = String(data.fullName).trim().split(' ')[0];
        if (first) title.innerHTML = 'Merci ' + first + ' ! 🎉';
        lead.textContent = 'Votre candidature a bien été transmise. Merci pour votre confiance.';

        recap.style.display = 'block';
        recap.innerHTML =
          '<div class="summary-row"><strong>Nom complet :</strong> <span>' + esc(data.fullName) + '</span></div>' +
          '<div class="summary-row"><strong>Pays :</strong> <span>' + esc(data.country) + '</span></div>' +
          '<div class="summary-row"><strong>Filière visée :</strong> <span>' + esc(data.studyDomain) + '</span></div>' +
          '<div class="summary-row"><strong>Université :</strong> <span>' + esc(data.targetUniversity) + '</span></div>' +
          '<div class="summary-row"><strong>Formule :</strong> <span>' + esc(data.selectedPack) + '</span></div>' +
          '<div class="summary-row"><strong>Navette aéroport :</strong> <span>' + esc(data.airportTransfer) + '</span></div>';
      }

      function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
          return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
      }
    })();
  `;

export const Merci = () => (
  <>
    <div class="thanks-page">
      <section class="thanks-main">
        <div class="container">
          <div class="thanks-card">
            <div class="thanks-check">
              <i class="fas fa-check"></i>
            </div>
            <h1 id="thanksTitle">Merci ! 🎉</h1>
            <p class="lead" id="thanksLead">
              Votre candidature a bien été enregistrée. Un conseiller Wicka Assistance vous contacte sous 24h.
            </p>

            <div class="thanks-recap" id="thanksRecap" style="display:none;"></div>

            <div class="thanks-steps">
              <div class="thanks-step">
                <div class="thanks-step-num">1</div>
                <div>
                  <h4>Finalisez sur WhatsApp maintenant</h4>
                  <p>
                    Envoyez votre récap à notre conseiller pour un traitement prioritaire et bloquer votre tarif promo
                    −50%.
                  </p>
                </div>
              </div>
              <div class="thanks-step">
                <div class="thanks-step-num">2</div>
                <div>
                  <h4>Étude de votre dossier</h4>
                  <p>Nous analysons votre profil et sélectionnons les meilleures universités privées pour vous.</p>
                </div>
              </div>
              <div class="thanks-step">
                <div class="thanks-step-num">3</div>
                <div>
                  <h4>Traitement de votre dossier</h4>
                  <p>Vous recevez votre évaluation et votre devis dans votre monnaie locale.</p>
                </div>
              </div>
            </div>

            <div class="thanks-actions">
              <a href="/" class="btn-secondary btn-full">
                <i class="fas fa-arrow-left"></i> <span>Retour à l'accueil</span>
              </a>
            </div>

            <p class="thanks-note">
              <i class="fas fa-lock"></i> Vos données sont confidentielles et ne servent qu'aux démarches d'admission.
            </p>
          </div>
        </div>
      </section>
    </div>

    <script dangerouslySetInnerHTML={{ __html: thanksScript }} />
  </>
);
