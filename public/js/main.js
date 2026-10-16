/**
 * Wicka Assistance - Scripts et Logique Interactive (Version Enrichie)
 * Tarifs par Pays, Simulateur, Filtre Universités d'Élite, Transport Aéroport et Formulaire
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialisations
  initNavigation();
  initCounters();
  initCountryPricingSwitcher();
  initUniversityFilters();
  initBudgetSimulator();
  initMultiStepForm();
  initContactForm();
  initFaqAccordion();
  initTestimonials();
  initModals();
  initPromoCountdown();
  initCookieBanner();
});

/* ============================================================
   COMPTE À REBOURS PROMOTION
   ============================================================ */
function initPromoCountdown() {
  const el = document.getElementById('promoCountdown');
  if (!el) return;
  const deadline = new Date(el.getAttribute('data-deadline')).getTime();
  const dEl = document.getElementById('pcDays');
  const hEl = document.getElementById('pcHours');
  const mEl = document.getElementById('pcMins');
  const sEl = document.getElementById('pcSecs');
  const pad = (n) => String(n).padStart(2, '0');

  const tick = () => {
    let diff = deadline - Date.now();
    if (diff < 0) diff = 0;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    if (dEl) dEl.innerText = pad(d);
    if (hEl) hEl.innerText = pad(h);
    if (mEl) mEl.innerText = pad(m);
    if (sEl) sEl.innerText = pad(s);
  };

  tick();
  setInterval(tick, 1000);
}

/* ============================================================
   1. NAVIGATION et HEADER
   ============================================================ */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileToggle && mobileMenu) {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('no-scroll', isOpen);
    });

    const mobileClose = document.getElementById('mobileMenuClose');
    if (mobileClose) {
      mobileClose.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      });
    }

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // Navigation par ancres : on s'appuie sur le défilement NATIF du navigateur
  // (html { scroll-behavior: smooth; scroll-padding-top } gère l'offset du header fixe).
  // C'est bien plus fiable que le scroll JS manuel, surtout pendant le chargement des images.
  // On neutralise seulement les liens vides "#" (icônes sociales placeholder).
  document.querySelectorAll('a[href="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => e.preventDefault());
  });
}

/* ============================================================
   2. COMPTEURS ANIMÉS (STATS HERO)
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.counter-value');
  let animated = false;

  const runAnimation = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      const prefix = counter.getAttribute('data-prefix') || '';
      const duration = 1800;
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const stepIncrement = target / totalSteps;
      let current = 0;

      const timer = setInterval(() => {
        current += stepIncrement;
        if (current >= target) {
          counter.innerText = prefix + target.toLocaleString('fr-FR') + suffix;
          clearInterval(timer);
        } else {
          counter.innerText = prefix + Math.floor(current).toLocaleString('fr-FR') + suffix;
        }
      }, stepTime);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        runAnimation();
        animated = true;
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.querySelector('.hero-stats-bar');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ============================================================
   3. SÉLECTEUR INTERACTIF DE TARIFS PAR PAYS
   ============================================================ */
function initCountryPricingSwitcher() {
  const countrySelect = document.getElementById('pricingCountrySelect');
  const countryPills = document.querySelectorAll('.country-pill-btn');
  const outAdmissionPrice = document.getElementById('countryOutAdmissionPrice');
  const outVipPrice = document.getElementById('countryOutVipPrice');
  const outPaymentMethods = document.getElementById('countryOutPaymentMethods');
  const outCountryNote = document.getElementById('countryOutNote');
  const outCountryTitle = document.getElementById('countryOutTitle');

  if (!window.WICKA_DATA || !window.WICKA_DATA.countryPricings) return;

  const updateCountryView = (countryKey) => {
    const data = window.WICKA_DATA.countryPricings[countryKey] || window.WICKA_DATA.countryPricings.senegal;

    const priceMarkup = (oldP, newP) => {
      const oldHtml = oldP ? `<span class="price-old">${oldP}</span>` : '';
      return `${oldHtml}<span class="price-now">${newP}</span><span class="price-promo-tag">PROMO -50%</span>`;
    };

    if (outCountryTitle) outCountryTitle.innerText = `Tarifs et Moyens de Paiement pour : ${data.name}`;
    if (outAdmissionPrice) outAdmissionPrice.innerHTML = priceMarkup(data.packAdmissionOld, data.packAdmission);
    if (outVipPrice) outVipPrice.innerHTML = priceMarkup(data.packVIPOld, data.packVIP);
    if (outCountryNote) outCountryNote.innerText = data.note;

    if (outPaymentMethods) {
      outPaymentMethods.innerHTML = data.paymentMethods.map(m => `
        <span class="payment-method-chip"><i class="fas fa-check-circle text-rose"></i> ${m}</span>
      `).join('');
    }

    // Update buttons in pricing cards as well
    document.querySelectorAll('.btn-order-pack').forEach(btn => {
      const packType = btn.getAttribute('data-pack');
      const waMsg = encodeURIComponent(`Bonjour Wicka Assistance ! Je réside en/au ${data.name} et je souhaite souscrire au ${packType} (${packType === 'Pack Admission' ? data.packAdmission : data.packVIP}).`);
      btn.href = `https://wa.me/212789095498?text=${waMsg}`;
    });
  };

  if (countrySelect) {
    countrySelect.addEventListener('change', (e) => {
      const val = e.target.value;
      countryPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-country') === val));
      updateCountryView(val);
    });
  }

  countryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      countryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const val = pill.getAttribute('data-country');
      if (countrySelect) countrySelect.value = val;
      updateCountryView(val);
    });
  });

  // Init with default (Senegal or first)
  updateCountryView('senegal');
}

/* ============================================================
   4. FILTRES et RECHERCHE DES UNIVERSITÉS D'ÉLITE
   ============================================================ */
function initUniversityFilters() {
  const container = document.getElementById('universitiesGrid');
  const domainTabs = document.querySelectorAll('.filter-tab-btn');
  const citySelect = document.getElementById('cityFilterSelect');
  const searchInput = document.getElementById('universitySearchInput');
  const resultsCount = document.getElementById('universitiesCount');

  if (!container || !window.WICKA_DATA) return;

  let currentDomain = 'all';
  let currentCity = 'all';
  let searchQuery = '';

  const renderUniversities = () => {
    const list = window.WICKA_DATA.universities.filter(uni => {
      const matchDomain = (currentDomain === 'all' || uni.domain === currentDomain);
      const matchCity = (currentCity === 'all' || uni.city === currentCity);
      const matchSearch = searchQuery === '' ||
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.popularPrograms.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
        uni.domainLabel.toLowerCase().includes(searchQuery.toLowerCase());

      return matchDomain && matchCity && matchSearch;
    });

    if (resultsCount) {
      resultsCount.innerText = `${list.length} université${list.length > 1 ? 's et grandes écoles d\'excellence trouvées' : ' trouvée'}`;
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-universities">
          <div class="empty-icon"><i class="fas fa-university"></i></div>
          <h3>Aucune université ne correspond exactement à vos critères</h3>
          <p>Nos conseillers ont accès à plus de 45 partenariats non listés. Contactez-nous pour une orientation personnalisée !</p>
          <a href="#candidature" class="btn-primary btn-sm">Demander un avis sur-mesure</a>
        </div>
      `;
      return;
    }

    const cityPhotos = {
      casablanca: 'assets/uni/casablanca.jpg',
      rabat: 'assets/uni/rabat.jpg',
      fes: 'assets/uni/fes.jpg',
      marrakech: 'assets/uni/marrakech.jpg',
      tanger: 'assets/uni/tanger.jpg',
      ifrane: 'assets/uni/ifrane.jpg'
    };

    container.innerHTML = list.map(uni => {
      const tagsHtml = uni.tags.map(t => `<span class="uni-tag">${escapeHtml(t)}</span>`).join('');
      const programsHtml = uni.popularPrograms.map(p => `<li><i class="fas fa-check-circle text-rose"></i> ${p}</li>`).join('');
      const photo = cityPhotos[uni.city] || 'assets/uni/campus1.jpg';

      return `
        <div class="university-card" data-domain="${uni.domain}" data-city="${uni.city}">
          <div class="uni-card-media">
            <img src="${photo}" alt="${escapeHtml(uni.cityName)}" loading="lazy" />
            <span class="uni-media-city"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(uni.cityName)}</span>
          </div>
          <div class="uni-card-header">
            <div class="uni-badge-top">
              <span class="uni-city-badge"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(uni.cityName)}</span>
              <span class="uni-type-badge">${escapeHtml(uni.type)}</span>
            </div>
            <h3 class="uni-name">${escapeHtml(uni.name)}</h3>
            <p class="uni-domain-label"><i class="fas fa-graduation-cap"></i> ${escapeHtml(uni.domainLabel)}</p>
          </div>

          <div class="uni-card-body">
            <div class="uni-tags-wrap">
              ${tagsHtml}
            </div>
            <p class="uni-desc">${escapeHtml(uni.description)}</p>

            <div class="uni-programs-box">
              <h4>Formations Phares :</h4>
              <ul>${programsHtml}</ul>
            </div>

            <div class="uni-meta-grid uni-meta-grid-single">
              <div class="meta-item">
                <span class="meta-label">Frais indicatifs :</span>
                <span class="meta-value">${escapeHtml(uni.tuition)}</span>
              </div>
            </div>
          </div>

          <div class="uni-card-footer">
            <button class="btn-select-uni" data-uni-name="${escapeHtml(uni.shortName)}" data-uni-domain="${escapeHtml(uni.domain)}">
              <span>Choisir cette université</span>
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
    container.querySelectorAll('.btn-select-uni').forEach((button) => {
      button.addEventListener('click', () => selectUniversityForApply(button.dataset.uniName || '', button.dataset.uniDomain || ''));
    });
  };

  domainTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      domainTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentDomain = tab.getAttribute('data-domain');
      renderUniversities();
    });
  });

  if (citySelect) {
    citySelect.addEventListener('change', (e) => {
      currentCity = e.target.value;
      renderUniversities();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderUniversities();
    });
  }

  renderUniversities();
}

window.selectUniversityForApply = function(uniName, domain) {
  const formSection = document.getElementById('candidature');

  // Site multi-pages : si le formulaire n'est pas sur cette page, on mémorise
  // le choix et on redirige vers la page Candidature (préremplissage au chargement).
  if (!formSection) {
    try {
      sessionStorage.setItem('wickaPreselect', JSON.stringify({ uni: uniName, domain: domain }));
    } catch (e) { /* stockage indisponible */ }
    window.location.href = '/candidature';
    return;
  }

  const headerOffset = 92;
  const elementPosition = formSection.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

  const uniInput = document.getElementById('formTargetUniversity');
  if (uniInput) {
    uniInput.value = uniName;
  }

  const domainSelect = document.getElementById('formStudyDomain');
  if (domainSelect && domain && domain !== 'all') {
    domainSelect.value = domain;
  }

  showToastNotification(`🎯 Université "${uniName}" sélectionnée dans votre formulaire de candidature !`);
};

/* ============================================================
   5. SIMULATEUR DE BUDGET et ÉTUDE SUR LA VIE AU MAROC
   ============================================================ */
function initBudgetSimulator() {
  const citySelect = document.getElementById('simCitySelect');
  const uniTypeRadios = document.querySelectorAll('input[name="simUniType"]');
  const currencySelect = document.getElementById('simCurrencySelect');

  const outFood = document.getElementById('simOutFood');
  const outTransport = document.getElementById('simOutTransport');
  const outLifestyle = document.getElementById('simOutLifestyle');
  const outMonthlyLiving = document.getElementById('simOutMonthlyLiving');
  const outTuitionYear = document.getElementById('simOutTuitionYear');
  const outGrandTotalYear = document.getElementById('simOutGrandTotalYear');
  const cityBadgeLabel = document.getElementById('simCityBadgeLabel');
  const cityAdvantagesLabel = document.getElementById('simCityAdvantages');
  const cityPhoto = document.getElementById('simCityPhoto');
  const cityPhotoLabel = document.getElementById('simCityPhotoLabel');

  if (!citySelect || !window.WICKA_DATA) return;

  const calculateBudget = () => {
    const selectedCityKey = citySelect.value || 'casablanca';
    const cityData = window.WICKA_DATA.citiesCost[selectedCityKey] || window.WICKA_DATA.citiesCost.casablanca;

    // Type d'école
    let selectedUniType = 'prive_standard';
    uniTypeRadios.forEach(r => { if (r.checked) selectedUniType = r.value; });

    let annualTuitionMAD = 48000;
    if (selectedUniType === 'prive_excellence') annualTuitionMAD = 68000;
    if (selectedUniType === 'prive_standard') annualTuitionMAD = 46000;
    if (selectedUniType === 'public_assiste') annualTuitionMAD = 3500;

    const foodCostMAD = cityData.food;
    const transportCostMAD = cityData.transport;
    const lifestyleCostMAD = cityData.lifestyle;

    const monthlyLivingMAD = foodCostMAD + transportCostMAD + lifestyleCostMAD;
    const annualLivingMAD = monthlyLivingMAD * 10;
    const grandTotalYearMAD = annualLivingMAD + annualTuitionMAD;

    // Currency Conversion
    const currentCurKey = currencySelect ? currencySelect.value : 'MAD';
    let rate = 1;
    let symbol = "DH";

    if (currentCurKey === 'XOF') { rate = 60.5; symbol = "FCFA"; }
    else if (currentCurKey === 'EUR') { rate = 0.092; symbol = "€"; }
    else if (currentCurKey === 'USD') { rate = 0.10; symbol = "$"; }

    const formatCur = (madAmount) => {
      const converted = Math.round(madAmount * rate);
      return `${converted.toLocaleString('fr-FR')} ${symbol}`;
    };

    if (cityBadgeLabel) cityBadgeLabel.innerText = cityData.badge;
    if (cityAdvantagesLabel) cityAdvantagesLabel.innerText = cityData.advantages;
    if (cityPhoto) cityPhoto.src = `assets/uni/${selectedCityKey}.jpg`;
    if (cityPhotoLabel) cityPhotoLabel.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${cityData.name}`;
    if (outFood) outFood.innerText = formatCur(foodCostMAD);
    if (outTransport) outTransport.innerText = formatCur(transportCostMAD);
    if (outLifestyle) outLifestyle.innerText = formatCur(lifestyleCostMAD);
    if (outMonthlyLiving) outMonthlyLiving.innerText = formatCur(monthlyLivingMAD);
    if (outTuitionYear) outTuitionYear.innerText = formatCur(annualTuitionMAD);
    if (outGrandTotalYear) outGrandTotalYear.innerText = formatCur(grandTotalYearMAD);
  };

  citySelect.addEventListener('change', calculateBudget);
  uniTypeRadios.forEach(r => r.addEventListener('change', calculateBudget));
  if (currencySelect) currencySelect.addEventListener('change', calculateBudget);

  const currencyChips = document.querySelectorAll('.currency-chip');
  currencyChips.forEach(chip => {
    chip.addEventListener('click', () => {
      currencyChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const cur = chip.getAttribute('data-currency');
      if (currencySelect) {
        currencySelect.value = cur;
        calculateBudget();
      }
    });
  });

  calculateBudget();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || '').trim());
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function isValidPhone(value) {
  const raw = String(value || '').trim();
  const digits = raw.replace(/\D/g, '');
  return /^[+\d\s().-]+$/.test(raw) && digits.length >= 8 && digits.length <= 15;
}

function validateContactValue(input) {
  const value = input.value.trim();
  if (input.required && !value) return 'Ce champ est obligatoire.';
  if (input.type === 'email' && value && !isValidEmail(value)) return 'Adresse e-mail invalide.';
  if (input.type === 'tel' && value && !isValidPhone(value)) return 'Numéro de téléphone invalide.';
  if (input.minLength > 0 && value.length < input.minLength) return `Minimum ${input.minLength} caractères.`;
  return '';
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = document.getElementById('contactStatus');
  const submit = document.getElementById('contactSubmit');
  const fields = [...form.querySelectorAll('input:not([type="checkbox"]), textarea')];
  const showFieldError = (input) => {
    const error = validateContactValue(input);
    input.classList.toggle('field-error', Boolean(error));
    const message = form.querySelector(`[data-error-for="${input.id}"]`);
    if (message) message.textContent = error;
    return !error;
  };
  fields.forEach((input) => input.addEventListener('blur', () => showFieldError(input)));
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const valid = fields.every(showFieldError);
    const consent = document.getElementById('contactConsent');
    if (consent && !consent.checked) {
      if (status) status.textContent = 'Veuillez accepter la politique de confidentialité.';
      return;
    }
    if (!valid) {
      if (status) status.textContent = 'Veuillez corriger les champs signalés.';
      return;
    }
    if (submit) { submit.disabled = true; submit.classList.add('is-loading'); }
    if (status) status.textContent = 'Envoi en cours…';
    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      const response = await fetch('/api/send-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', ...payload })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Impossible d’envoyer le message.');
      form.reset();
      if (status) status.textContent = 'Votre message a bien été envoyé. Merci.';
    } catch (error) {
      if (status) status.textContent = error.message || 'Une erreur est survenue. Réessayez.';
    } finally {
      if (submit) { submit.disabled = false; submit.classList.remove('is-loading'); }
    }
  });
}

/* ============================================================
   6. FORMULAIRE DE CANDIDATURE MULTI-ÉTAPES
   ============================================================ */
function initMultiStepForm() {
  const form = document.getElementById('multiStepApplicationForm');
  if (!form) return;

  // Préremplissage si l'utilisateur a choisi une université sur la page Universités
  try {
    const pre = JSON.parse(sessionStorage.getItem('wickaPreselect') || 'null');
    if (pre) {
      const u = form.querySelector('#formTargetUniversity');
      if (u && pre.uni) u.value = pre.uni;
      const d = form.querySelector('#formStudyDomain');
      if (d && pre.domain && pre.domain !== 'all') d.value = pre.domain;
      sessionStorage.removeItem('wickaPreselect');
    }
  } catch (e) { /* stockage indisponible */ }

  const steps = form.querySelectorAll('.form-step-panel');
  const stepIndicators = document.querySelectorAll('.step-indicator-item');
  const progressBar = document.getElementById('formProgressBar');
  let currentStep = 1;
  const totalSteps = steps.length;

  const updateStepUI = (stepNumber) => {
    steps.forEach(s => s.classList.remove('active'));
    stepIndicators.forEach((ind, index) => {
      ind.classList.remove('active', 'completed');
      if (index + 1 < stepNumber) {
        ind.classList.add('completed');
      } else if (index + 1 === stepNumber) {
        ind.classList.add('active');
      }
    });

    const activePanel = form.querySelector(`.form-step-panel[data-step="${stepNumber}"]`);
    if (activePanel) {
      activePanel.classList.add('active');
    }

    if (progressBar) {
      const progressPercent = ((stepNumber - 1) / (totalSteps - 1)) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }
  };

  const validateStep = (step) => {
    const activePanel = form.querySelector(`.form-step-panel[data-step="${step}"]`);
    if (!activePanel) return true;

    const requiredInputs = [...activePanel.querySelectorAll('[required]')];
    const radioNames = [...new Set(requiredInputs.filter(input => input.type === 'radio').map(input => input.name).filter(Boolean))];
    let isValid = true;
    let firstInvalid = null;

    requiredInputs.forEach(input => {
      input.classList.remove('field-error');
      if (input.type === 'radio') return;
      const value = String(input.value || '').trim();
      let invalid = input.required && (input.type === 'checkbox' ? !input.checked : !value);
      if (!invalid && input.type === 'email' && !isValidEmail(value)) invalid = true;
      if (!invalid && input.type === 'tel' && !isValidPhone(value)) invalid = true;
      if (!invalid && input.minLength > 0 && value.length < input.minLength) invalid = true;
      if (invalid) {
        input.classList.add('field-error');
        firstInvalid ||= input;
        isValid = false;
      }
    });

    radioNames.forEach(name => {
      const group = [...activePanel.querySelectorAll(`input[type="radio"][name="${CSS.escape(name)}"]`)];
      const groupIsValid = group.some(input => input.checked);
      group.forEach(input => input.classList.toggle('field-error', !groupIsValid));
      if (!groupIsValid) {
        firstInvalid ||= group[0];
        isValid = false;
      }
    });

    if (!isValid) {
      showToastNotification('Veuillez compléter les champs obligatoires signalés.', 'warning');
      firstInvalid?.focus({ preventScroll: false });
    }
    return isValid;
  };

  form.querySelectorAll('.btn-next-step').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
          currentStep++;
          updateStepUI(currentStep);
        }
      }
    });
  });

  form.querySelectorAll('.btn-prev-step').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentStep > 1) {
        currentStep--;
        updateStepUI(currentStep);
      }
    });
  });

  stepIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      const targetStep = index + 1;
      if (targetStep < currentStep) {
        currentStep = targetStep;
        updateStepUI(currentStep);
      } else if (targetStep === currentStep + 1 && validateStep(currentStep)) {
        currentStep = targetStep;
        updateStepUI(currentStep);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    const formData = {
      fullName: form.querySelector('#formFullName')?.value.trim() || '',
      country: form.querySelector('#formCountry')?.value || '',
      whatsapp: form.querySelector('#formWhatsapp')?.value.trim() || '',
      email: form.querySelector('#formEmail')?.value.trim() || '',
      currentLevel: form.querySelector('#formCurrentLevel')?.value || '',
      bacSeries: form.querySelector('#formBacSeries')?.value || '',
      studyDomain: form.querySelector('#formStudyDomain')?.selectedOptions?.[0]?.text || form.querySelector('#formStudyDomain')?.value || '',
      targetCity: form.querySelector('#formTargetCity')?.value || '',
      targetUniversity: form.querySelector('#formTargetUniversity')?.value || 'Recommandation Wicka',
      selectedPack: form.querySelector('input[name="formPackChoice"]:checked')?.value || 'Pack Admission Réussie',
      airportTransfer: form.querySelector('input[name="formAirportTransfer"]:checked')?.value || 'Oui, navette avec chauffeur privé demandée',
      notes: form.querySelector('#formNotes')?.value.trim() || '',
      consent: form.querySelector('#applicationConsent')?.checked ? 'accepted' : ''
    };
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) { submitButton.disabled = true; submitButton.classList.add('is-loading'); }
    showToastNotification('Envoi de votre candidature en cours…');
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'candidature', ...formData })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Impossible d’envoyer la candidature.');
      try { sessionStorage.setItem('wickaApplication', JSON.stringify(formData)); } catch (error) { /* stockage indisponible */ }
      const whatsappMessage = `Bonjour Wicka Assistance ! Je viens de soumettre ma candidature.\n\nNom : ${formData.fullName}\nPays : ${formData.country}\nWhatsApp : ${formData.whatsapp}\nFilière : ${formData.studyDomain}\nUniversité : ${formData.targetUniversity}\nFormule : ${formData.selectedPack}\n\nMerci de m’indiquer la suite des démarches.`;
      window.location.href = `https://wa.me/212789095498?text=${encodeURIComponent(whatsappMessage)}`;
    } catch (error) {
      showToastNotification(error.message || 'Une erreur est survenue. Réessayez.', 'warning');
      if (submitButton) { submitButton.disabled = false; submitButton.classList.remove('is-loading'); }
    }
  });
}

function showSubmissionSuccessModal(data) {
  const modal = document.getElementById('successModal');
  const detailsBox = document.getElementById('modalStudentSummary');
  const whatsappBtn = document.getElementById('modalWhatsappRedirect');

  if (detailsBox) {
    detailsBox.innerHTML = `
      <div class="summary-row"><strong>Nom complet :</strong> <span>${data.fullName}</span></div>
      <div class="summary-row"><strong>Pays de résidence :</strong> <span>${data.country}</span></div>
      <div class="summary-row"><strong>Numéro WhatsApp :</strong> <span>${data.whatsapp}</span></div>
      <div class="summary-row"><strong>Filière visée :</strong> <span>${data.studyDomain}</span></div>
      <div class="summary-row"><strong>Université :</strong> <span>${data.targetUniversity}</span></div>
      <div class="summary-row"><strong>Pack choisi :</strong> <span class="badge-rose-soft">${data.selectedPack}</span></div>
      <div class="summary-row"><strong>Navette aéroport :</strong> <span>${data.airportTransfer}</span></div>
    `;
  }

  if (whatsappBtn) {
    const waText = encodeURIComponent(
      `Bonjour Wicka Assistance ! 👋\nJe viens de soumettre ma candidature pour étudier au Maroc.\n\n` +
      `👤 Nom : ${data.fullName}\n` +
      `🌍 Pays : ${data.country}\n` +
      `🎓 Niveau : ${data.currentLevel} (${data.bacSeries})\n` +
      `📚 Filière : ${data.studyDomain}\n` +
      `🏫 Établissement : ${data.targetUniversity}\n` +
      `📦 Formule : ${data.selectedPack}\n` +
      `🚗 Navette Aéroport : ${data.airportTransfer}\n\n` +
      `Merci de m'indiquer la suite des démarches !`
    );
    whatsappBtn.href = `https://wa.me/212789095498?text=${waText}`;
  }

  if (modal) {
    modal.classList.add('active');
    document.body.classList.add('no-scroll');
  }
}

/* ============================================================
   7. FAQ ACCORDÉON
   ============================================================ */
function initFaqAccordion() {
  const container = document.getElementById('faqAccordionContainer');

  if (!container || !window.WICKA_DATA) return;

  const renderFaqs = (filter = '') => {
    const filteredFaqs = window.WICKA_DATA.faqs;
    container.innerHTML = filteredFaqs.map((faq, index) => {
      const isOpen = index === 0;
      return `
        <div class="faq-item ${isOpen ? 'active' : ''}">
          <button class="faq-question-btn" type="button">
            <span class="faq-q-text">${escapeHtml(faq.q)}</span>
            <span class="faq-icon"><i class="fas fa-chevron-down"></i></span>
          </button>
          <div class="faq-answer-panel" style="${isOpen ? 'max-height: 400px;' : ''}">
            <p>${escapeHtml(faq.a)}</p>
          </div>
        </div>
      `;
    }).join('');

    const items = container.querySelectorAll('.faq-item');
    items.forEach(item => {
      const btn = item.querySelector('.faq-question-btn');
      const panel = item.querySelector('.faq-answer-panel');

      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        items.forEach(other => {
          other.classList.remove('active');
          const otherPanel = other.querySelector('.faq-answer-panel');
          if (otherPanel) otherPanel.style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });
  };

renderFaqs();
}

/* ============================================================
   8. TÉMOIGNAGES et AVIS CLIENTS
   ============================================================ */
function initTestimonials() {
  const container = document.getElementById('testimonialsGrid');
  if (!container || !window.WICKA_DATA) return;

  container.innerHTML = window.WICKA_DATA.testimonials.map(t => {
    const stars = Array(t.rating).fill('<i class="fas fa-star text-gold"></i>').join('');
    return `
      <div class="testimonial-card">
        <div class="tem-header">
          <div class="tem-avatar-wrap">
            <img src="${escapeHtml(t.avatar)}" alt="${escapeHtml(t.name)}" class="tem-avatar" loading="lazy" />
            <span class="tem-verified-check" title="Étudiant vérifié Wicka"><i class="fas fa-check"></i></span>
          </div>
          <div class="tem-info">
            <h4 class="tem-name">${escapeHtml(t.name)}</h4>
            <span class="tem-origin">${escapeHtml(t.origin)}</span>
            <div class="tem-stars">${stars}</div>
          </div>
        </div>
        <div class="tem-badge-pack">${escapeHtml(t.badge)}</div>
        <div class="tem-academic-box">
          <p class="tem-uni"><i class="fas fa-university"></i> ${escapeHtml(t.university)}</p>
          <p class="tem-prog"><i class="fas fa-graduation-cap"></i> ${escapeHtml(t.program)}</p>
        </div>
        <blockquote class="tem-quote">
          "${escapeHtml(t.quote)}"
        </blockquote>
        <div class="tem-footer">
          <span class="tem-year">${escapeHtml(t.year)}</span>
          <span class="tem-status"><i class="fas fa-shield-alt"></i> Témoignage authentique certifié</span>
        </div>
      </div>
    `;
  }).join('');
}

window.showToastNotification = function(msg) {
  let status = document.getElementById('globalFeedbackStatus');
  if (!status) {
    status = document.createElement('div');
    status.id = 'globalFeedbackStatus';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
    document.body.appendChild(status);
  }
  status.textContent = msg;
};

/* ============================================================
   10. MODALS
   ============================================================ */
function initModals() {
  const closeButtons = document.querySelectorAll('.modal-close-btn, .modal-close-btn-action, .modal-backdrop');

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-wrapper').forEach(m => m.classList.remove('active'));
      document.body.classList.remove('no-scroll');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-wrapper').forEach(m => m.classList.remove('active'));
      document.body.classList.remove('no-scroll');
    }
  });

  const callbackTrigger = document.getElementById('triggerCallbackModal');
  const callbackModal = document.getElementById('callbackModal');
  if (callbackTrigger && callbackModal) {
    callbackTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      callbackModal.classList.add('active');
      document.body.classList.add('no-scroll');
    });
  }

  const callbackForm = document.getElementById('callbackQuickForm');
  if (callbackForm) {
    callbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const phoneInput = callbackForm.querySelector('input[type="tel"]');
      const phone = phoneInput?.value.trim() || '';
      if (!isValidPhone(phone)) {
        phoneInput?.classList.add('field-error');
        showToastNotification('Veuillez saisir un numéro valide avec indicatif pays.', 'warning');
        return;
      }
      const button = callbackForm.querySelector('button[type="submit"]');
      if (button) button.disabled = true;
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'callback', phone })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || 'Impossible d’envoyer la demande.');
        if (callbackModal) callbackModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
        callbackForm.reset();
        showToastNotification('Votre demande de rappel a été transmise à Wicka Assistance.');
      } catch (error) {
        showToastNotification(error.message || 'Une erreur est survenue.', 'warning');
      } finally {
        if (button) button.disabled = false;
      }
    });
  }
}


/* ============================================================
   CONSENTEMENT COOKIES / STOCKAGE LOCAL
   ============================================================ */
function initCookieBanner() {
  const banner = document.querySelector('[data-cookie-banner]');
  if (!banner) return;
  const storageKey = 'wicka_cookie_consent';
  let choice = null;
  try { choice = window.localStorage.getItem(storageKey); } catch (_) {}
  if (choice === 'accepted' || choice === 'rejected') {
    banner.hidden = true;
    return;
  }
  banner.hidden = false;
  banner.querySelectorAll('[data-cookie-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      try { window.localStorage.setItem(storageKey, button.dataset.cookieChoice === 'accept' ? 'accepted' : 'rejected'); } catch (_) {}
      banner.hidden = true;
    });
  });
}
