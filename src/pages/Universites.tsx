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

// Design autonome : tout le CSS de la page est ici (classes préfixées « uv- »),
// il ne dépend pas de la feuille de style globale et ne la modifie pas.
const styles = `
.uv{--ink:#0f172a;--muted:#64748b;--line:#e8ecf2;--bg:#f7f8fb;--accent:#be185d;--accent-d:#9d174d;background:var(--bg);color:var(--ink)}
.uv *{box-sizing:border-box}
.uv-wrap{max-width:1200px;margin:0 auto;padding:0 20px}

.uv-hero{padding:72px 0 36px;text-align:center;background:linear-gradient(180deg,#fff,var(--bg))}
.uv-eyebrow{display:inline-block;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:var(--accent);background:#fdf2f8;padding:6px 14px;border-radius:999px}
.uv-hero h1{font-size:clamp(1.9rem,4.5vw,3rem);line-height:1.15;margin:18px auto 14px;max-width:760px;font-weight:800;letter-spacing:-.02em}
.uv-hero p{color:var(--muted);max-width:680px;margin:0 auto;font-size:1.05rem;line-height:1.7}

.uv-search{position:relative;max-width:560px;margin:8px auto 20px}
.uv-search svg{position:absolute;left:18px;top:50%;transform:translateY(-50%);color:var(--muted)}
.uv-search input{width:100%;height:54px;padding:0 20px 0 50px;border:1px solid var(--line);border-radius:999px;background:#fff;font-size:1rem;box-shadow:0 4px 18px rgba(15,23,42,.05);outline:none;color:var(--ink)}
.uv-search input:focus{border-color:var(--accent);box-shadow:0 0 0 4px rgba(190,24,93,.12)}

.uv-count{text-align:center;color:var(--muted);font-size:.92rem;margin:8px 0 28px}

.uv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,310px),1fr));gap:28px;padding-bottom:56px}
.uv-card{display:flex;flex-direction:column;background:#fff;border:1px solid var(--line);border-radius:20px;overflow:hidden;box-shadow:0 2px 6px rgba(15,23,42,.04);transition:transform .25s,box-shadow .25s}
.uv-card:hover{transform:translateY(-4px);box-shadow:0 18px 40px rgba(15,23,42,.1)}
.uv-card[hidden]{display:none}

.uv-media{position:relative;aspect-ratio:16/10;background:linear-gradient(135deg,#1e293b,#be185d);overflow:hidden}
.uv-media img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s}
.uv-card:hover .uv-media img{transform:scale(1.04)}
.uv-media::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(15,23,42,.6))}
.uv-city{position:absolute;left:16px;bottom:12px;z-index:1;display:inline-flex;align-items:center;gap:6px;color:#fff;font-size:.85rem;font-weight:600}
.uv-type{position:absolute;right:14px;top:14px;z-index:1;background:rgba(255,255,255,.95);color:var(--ink);font-size:.75rem;font-weight:700;padding:6px 12px;border-radius:999px}

.uv-body{padding:24px 24px 8px;flex:1}
.uv-name{font-size:1.18rem;line-height:1.35;margin:0 0 4px;font-weight:700}
.uv-sigle{color:var(--accent);font-weight:700;font-size:.9rem;letter-spacing:.04em}
.uv-tags{display:flex;flex-wrap:wrap;gap:6px;margin:14px 0 18px}
.uv-tag{font-size:.76rem;color:#475569;background:#f1f5f9;padding:5px 10px;border-radius:999px}
.uv-list{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.uv-list li{position:relative;padding-left:20px;font-size:.92rem;line-height:1.5;color:#334155}
.uv-list li::before{content:"";position:absolute;left:0;top:.6em;width:7px;height:7px;border-radius:50%;background:var(--accent)}
.uv-list .uv-more{color:var(--muted)}
.uv-list .uv-more::before{background:#cbd5e1}

.uv-price{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:4px 12px;margin:16px 24px 0;padding-top:16px;border-top:1px solid var(--line)}
.uv-price-label{font-size:.8rem;color:var(--muted)}
.uv-price-value{font-size:.98rem;font-weight:700;color:var(--ink)}

.uv-actions{display:grid;gap:10px;padding:20px 24px 24px}
.uv-btn{display:flex;align-items:center;justify-content:center;gap:8px;min-height:46px;padding:0 18px;border-radius:12px;font-weight:600;font-size:.95rem;text-decoration:none;transition:.2s;cursor:pointer}
.uv-btn-ghost{border:1.5px solid var(--line);color:var(--ink);background:#fff}
.uv-btn-ghost:hover{border-color:var(--ink)}
.uv-btn-main{background:var(--accent);color:#fff;border:1.5px solid var(--accent)}
.uv-btn-main:hover{background:var(--accent-d);border-color:var(--accent-d)}

.uv-foot{text-align:center;color:var(--muted);font-size:.9rem;padding:0 0 48px}

@media (max-width:700px){
  .uv-hero{padding:48px 0 24px}
  .uv-grid{gap:22px}
}
`;

// Filtre côté navigateur : la liste est déjà dans le HTML (visible par Google),
// le script ne fait que masquer ou afficher les cartes.
const filterScript = String.raw`
(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll(".uv-card"));
  var search = document.getElementById("universitySearchInput");
  var count = document.getElementById("universitiesCount");

  function norm(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function apply() {
    var q = norm(search.value.trim());
    var shown = 0;
    cards.forEach(function (card) {
      var ok = !q || norm(card.getAttribute("data-search")).indexOf(q) !== -1;
      card.hidden = !ok;
      if (ok) shown++;
    });
    count.textContent =
      shown === 0
        ? "Aucun établissement ne correspond. Essayez un autre filtre."
        : shown + (shown > 1 ? " établissements" : " établissement");
  }

  search.addEventListener("input", apply);
  apply();
})();
`;

// Photos de ville (dossier public/assets/uni) ; si une photo manque, le dégradé de la carte s'affiche.
const PHOTOS_VILLES: Record<string, string> = {
  casablanca: "/assets/uni/casablanca.jpg",
  rabat: "/assets/uni/rabat.jpg",
  fes: "/assets/uni/fes.jpg",
  marrakech: "/assets/uni/marrakech.jpg",
  tanger: "/assets/uni/tanger.jpg",
  ifrane: "/assets/uni/ifrane.jpg",
};

// Nombre de formations affichées sur la carte (le reste est résumé en « + N autres »).
const FORMATIONS_VISIBLES = 3;

// Frais indicatifs affichés sur la carte, repris de l'ancien data.js (clé = slug de src/data/universites.ts).
// À vérifier avant publication : ils changent chaque année. Sans entrée, la carte affiche « Sur demande ».
const FRAIS: Record<string, string> = {
  uemf: "À partir de 50 000 DH/an",
  estem: "À partir de 42 000 DH/an",
  uiass: "Selon la faculté",
  esca: "À partir de 62 000 DH/an",
  um6p: "Sur dossier (bourses disponibles)",
  uir: "À partir de 65 000 DH/an",
  emsi: "À partir de 42 000 DH/an",
  mundiapolis: "À partir de 48 000 DH/an",
  uic: "À partir de 52 000 DH/an",
  hem: "À partir de 55 000 DH/an",
  aui: "À partir de 70 000 DH/an",
  um6ss: "Selon la faculté",
  upm: "À partir de 45 000 DH/an",
  upf: "À partir de 44 000 DH/an",
  isga: "À partir de 38 000 DH/an",
};

const Pin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const Carte = ({ e }: { e: Etablissement }) => {
  const villes = e.villes.map((v) => VILLES[v]);
  const domaines = e.domaines.map((d) => DOMAINES[d]);
  const searchText = [e.nom, e.sigle, ...villes, ...e.filieres, ...domaines].join(" ");
  const photo = PHOTOS_VILLES[e.villes[0]];
  const visibles = e.filieres.slice(0, FORMATIONS_VISIBLES);
  const cachees = e.filieres.length - visibles.length;
  const frais = FRAIS[e.slug] ?? "Sur demande";

  return (
    <article
      class="uv-card"
      data-search={searchText}
      data-cities={e.villes.join(" ")}
      data-domains={e.domaines.join(" ")}
    >
      <div class="uv-media">
        {photo && <img src={photo} alt={villes.join(", ")} loading="lazy" onerror="this.style.display='none'" />}
        <span class="uv-type">{e.type === "universite" ? "Université" : "École"}</span>
        <span class="uv-city">
          <Pin /> {villes.join(", ")}
        </span>
      </div>

      <div class="uv-body">
        <h3 class="uv-name">{e.nom}</h3>
        <span class="uv-sigle">{e.sigle}</span>

        <div class="uv-tags">
          {domaines.map((d) => (
            <span class="uv-tag">{d.split(":")[0]}</span>
          ))}
        </div>

        {visibles.length > 0 && (
          <ul class="uv-list">
            {visibles.map((f) => (
              <li>{f}</li>
            ))}
            {cachees > 0 && (
              <li class="uv-more">
                + {cachees} autre{cachees > 1 ? "s" : ""} formation{cachees > 1 ? "s" : ""} sur le site officiel
              </li>
            )}
          </ul>
        )}
      </div>

      <div class="uv-price">
        <span class="uv-price-label">Frais indicatifs</span>
        <strong class="uv-price-value">{frais}</strong>
      </div>

      <div class="uv-actions">
        <a href={e.siteWeb} target="_blank" rel="noopener noreferrer" class="uv-btn uv-btn-ghost">
          Visiter le site officiel ↗
        </a>
        <a
          href={waLink(`Bonjour Wicka, je souhaite des informations sur ${e.nom} (${e.sigle}).`)}
          target="_blank"
          rel="noopener noreferrer"
          class="uv-btn uv-btn-main"
        >
          Demander des informations
        </a>
      </div>
    </article>
  );
};

export const Universites = () => (
  <>
    <style dangerouslySetInnerHTML={{ __html: styles }} />
    <div class="uv" id="universites">
      <section class="uv-hero">
        <div class="uv-wrap">
          <span class="uv-eyebrow">Études au Maroc</span>
          <h1>Universités et écoles au Maroc</h1>
          <p>
            Wicka Assistance prend en charge votre candidature, votre inscription et le suivi de votre dossier
            auprès des universités et écoles du Maroc, dont celles présentées ci-dessous. L'admission est décidée
            par chaque établissement.
          </p>
        </div>
      </section>

      <div class="uv-wrap">
        <div class="uv-search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="text"
            id="universitySearchInput"
            aria-label="Rechercher un établissement ou une filière"
            placeholder="Rechercher une école ou une filière (ex. UEMF, pharmacie)"
          />
        </div>

        <div class="uv-count" id="universitiesCount" aria-live="polite">
          {ETABLISSEMENTS.length} établissements
        </div>

        <div class="uv-grid" id="universitiesGrid">
          {ETABLISSEMENTS.map((e) => (
            <Carte e={e} />
          ))}
        </div>

        <p class="uv-foot">
          Programmes et frais de scolarité : consultez le site de l'établissement ou demandez-nous les informations
          à jour.
        </p>

      </div>
    </div>

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
