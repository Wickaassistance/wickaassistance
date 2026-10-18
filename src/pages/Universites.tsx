import { waLink } from "../config/site";
import {
  DOMAINES,
  ETABLISSEMENTS,
  VILLES,
  type Etablissement,
} from "../data/universites";

export const universitesMeta = {
  title: "Universités et écoles privées au Maroc | Wicka Assistance",
  description:
    "Découvrez des universités et écoles du Maroc (santé, ingénierie, management, architecture, droit) et faites-vous accompagner pour votre candidature, votre inscription et le suivi de votre dossier.",
};

// Filtre côté navigateur : la liste est déjà dans le HTML (visible par Google),
// le script ne fait que masquer ou afficher les cartes.
const filterScript = String.raw`
(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll(".university-card"));
  var search = document.getElementById("universitySearchInput");
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".filter-tab-btn"));
  var count = document.getElementById("universitiesCount");
  var domain = "all";

  function norm(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function apply() {
    var q = norm(search.value.trim());
    var shown = 0;
    cards.forEach(function (card) {
      var ok =
        (!q || norm(card.getAttribute("data-search")).indexOf(q) !== -1) &&
        (domain === "all" || card.getAttribute("data-domains").split(" ").indexOf(domain) !== -1);
      card.hidden = !ok;
      if (ok) shown++;
    });
    count.textContent =
      shown === 0
        ? "Aucun établissement ne correspond. Essayez un autre filtre."
        : shown + (shown > 1 ? " établissements" : " établissement");
  }

  search.addEventListener("input", apply);
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");
      domain = tab.getAttribute("data-domain");
      apply();
    });
  });
  apply();
})();
`;

const Carte = ({ e }: { e: Etablissement }) => {
  const villes = e.villes.map((v) => VILLES[v]);
  const searchText = [e.nom, e.sigle, ...villes, ...e.filieres, ...e.domaines.map((d) => DOMAINES[d])].join(" ");

  return (
    <article
      class="university-card"
      data-search={searchText}
      data-cities={e.villes.join(" ")}
      data-domains={e.domaines.join(" ")}
    >
      <div class="university-card-body">
        <h3 class="university-name">
          {e.nom} <span class="university-acronym">({e.sigle})</span>
        </h3>
        <p class="university-meta">
          {e.type === "universite" ? "Université" : "École"} · {villes.join(", ")}
        </p>

        <p class="university-domains">{e.domaines.map((d) => DOMAINES[d]).join(" · ")}</p>

        {e.filieres.length > 0 && (
          <ul class="university-filieres">
            {e.filieres.map((f) => (
              <li>{f}</li>
            ))}
          </ul>
        )}
      </div>

      <div class="university-card-actions">
        <a href={e.siteWeb} target="_blank" rel="noopener noreferrer" class="btn-link">
          Visiter le site officiel
        </a>
        <a
          href={waLink(`Bonjour Wicka, je souhaite des informations sur ${e.nom} (${e.sigle}).`)}
          target="_blank"
          rel="noopener noreferrer"
          class="btn-cta-white"
        >
          Demander des informations
        </a>
      </div>
    </article>
  );
};

export const Universites = () => (
  <>
    <section class="universities-section" id="universites">
      <div class="container">
        <div class="section-header">
          <h1 class="section-title">Universités et écoles au Maroc</h1>
          <p class="section-subtitle">
            Wicka Assistance prend en charge votre candidature, votre inscription et le suivi de votre dossier
            auprès des universités et écoles du Maroc, dont celles présentées ci-dessous. L'admission est décidée
            par chaque établissement.
          </p>
        </div>

        <div class="filter-bar-wrapper">
          <div class="filter-top-row">
            <div class="search-input-wrap">
              <input
                type="text"
                id="universitySearchInput"
                aria-label="Rechercher un établissement ou une filière"
                placeholder="Rechercher une école ou une filière (ex. UEMF, pharmacie, architecture)"
              />
            </div>
          </div>

          <div class="filter-tabs-row">
            <button type="button" class="filter-tab-btn active" data-domain="all">
              Toutes les filières
            </button>
            {(Object.keys(DOMAINES) as Array<keyof typeof DOMAINES>).map((d) => (
              <button type="button" class="filter-tab-btn" data-domain={d}>
                {DOMAINES[d]}
              </button>
            ))}
          </div>
        </div>

        <div class="universities-count-bar" id="universitiesCount" aria-live="polite">
          {ETABLISSEMENTS.length} établissements
        </div>

        <div class="universities-grid" id="universitiesGrid">
          {ETABLISSEMENTS.map((e) => (
            <Carte e={e} />
          ))}
        </div>

        <p class="universities-footnote">
          Programmes et frais de scolarité : consultez le site de l'établissement ou demandez-nous les informations
          à jour.
        </p>
      </div>
    </section>

    <section class="cta-band">
      <div class="container">
        <div class="cta-band-inner">
          <div class="cta-band-text">
            <h2>Besoin d'aide pour choisir ?</h2>
            <p>
              Un conseiller étudie votre profil, prépare votre candidature et suit votre dossier auprès de
              l'établissement.
            </p>
          </div>
          <div class="cta-band-actions">
            <a
              href={waLink("Bonjour Wicka, je souhaite être orienté vers une université ou une école au Maroc.")}
              target="_blank"
              rel="noopener noreferrer"
              class="btn-cta-white"
            >
              Parler à un conseiller
            </a>
            <a href="/candidature" class="btn-cta-ghost">
              Envoyer ma candidature
            </a>
            <span class="cta-band-microcopy">Sans engagement</span>
          </div>
        </div>
      </div>
    </section>

    <script dangerouslySetInnerHTML={{ __html: filterScript }} />
  </>
);
