/* ============================================================
   IMMOPLUS — script.js
   - Sticky header + logo inversion
   - Hamburger menu mobile
   - Hero slider automatique
   - Filtres de biens (onglets + dropdowns)
   - Scroll reveal animations
   - Navigation active au scroll
   - Modale détail de bien
   - Validation formulaires
   - Smooth scroll
   ============================================================ */

'use strict';

/* ── Données des biens (pour la modale) ────────────────────── */
const properties = {
    1: {
        img:      'appart.png',
        title:    'Appartement Luxe — Dakar',
        location: 'Dakar, Plateau',
        desc:     'Magnifique appartement moderne avec vue panoramique sur la mer. Entièrement meublé et équipé haut de gamme : cuisine aménagée, climatisation, parking sécurisé, gardien. Idéal pour une location longue ou courte durée en plein cœur de Dakar.',
        features: ['🛏 3 chambres', '🚿 2 salles de bain', '📐 120 m²', '🚗 Parking', '❄️ Climatisation'],
        price:    '250 000 FCFA / mois',
        wa:       'https://wa.me/221XXXXXXXXX?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20l%27appartement%20Luxe%20%C3%A0%20Dakar',
    },
    2: {
        img:      'villa.png',
        title:    'Villa Prestige — Saly',
        location: 'Saly Portudal, front de mer',
        desc:     'Splendide villa avec piscine privée, jardin tropical soigné et accès direct à la plage de Saly. Comprend 5 chambres en suite, salle de jeux, cuisine extérieure et personnel de maison disponible sur demande.',
        features: ['🛏 5 chambres', '🚿 4 salles de bain', '📐 350 m²', '🏊 Piscine privée', '🌴 Jardin tropical'],
        price:    '500 000 FCFA / semaine',
        wa:       'https://wa.me/221XXXXXXXXX?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20la%20Villa%20Prestige%20%C3%A0%20Saly',
    },
    3: {
        img:      'hotel.png',
        title:    'Hôtel Boutique — Saly',
        location: 'Saly Portudal, bord de mer',
        desc:     'Hôtel de charme de 20 suites en bord de mer. Dispose d\'un restaurant gastronomique, piscine à débordement, spa, salle de conférence et navette aéroport. Idéal pour événements privés ou séjours d\'exception.',
        features: ['🏨 20 suites', '🍽 Restaurant', '🏊 Piscine', '💆 Spa', '🏢 Salle conférence'],
        price:    'Prix sur demande',
        wa:       'https://wa.me/221XXXXXXXXX?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20l%27H%C3%B4tel%20Boutique%20%C3%A0%20Saly',
    },
    4: {
        img:      'resi.png',
        title:    'Résidence de Luxe — Saly',
        location: 'Saly Portudal, résidence fermée',
        desc:     'Magnifique résidence dans une enceinte sécurisée avec gardiennage 24h/24. Comprend 4 chambres, salon lumineux, terrasse panoramique, piscine commune et espaces verts luxuriants. Accès à la plage en quelques minutes.',
        features: ['🛏 4 chambres', '🔒 Gardiennage 24h', '📐 200 m²', '🏊 Piscine commune', '🌿 Espaces verts'],
        price:    'Prix sur demande',
        wa:       'https://wa.me/221XXXXXXXXX?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20la%20R%C3%A9sidence%20de%20Luxe%20%C3%A0%20Saly',
    },
};

/* ── DOM ready ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initHamburger();
    initHeroSlider();
    initScrollReveal();
    initNavHighlight();
    initFilterTabs();
    initSearchBar();
    initModals();
    initForms();
    initSmoothScroll();
});

/* ── 1. Sticky header ───────────────────────────────────────── */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ── 2. Hamburger menu ──────────────────────────────────────── */
function initHamburger() {
    const btn = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        btn.classList.toggle('open', isOpen);
        btn.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fermer en cliquant sur un lien
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Fermer en cliquant en dehors
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !btn.contains(e.target)) {
            nav.classList.remove('open');
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

/* ── 3. Hero slider ─────────────────────────────────────────── */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots   = document.querySelectorAll('.dot');
    if (!slides.length) return;

    let current  = 0;
    let interval = null;

    const goTo = (idx) => {
        slides[current].classList.remove('active');
        dots[current]?.classList.remove('active');
        current = idx;
        slides[current].classList.add('active');
        dots[current]?.classList.add('active');
    };

    const next = () => goTo((current + 1) % slides.length);

    const startAuto = () => { interval = setInterval(next, 5000); };
    const stopAuto  = () => clearInterval(interval);

    // Dot clicks
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            stopAuto();
            goTo(parseInt(dot.dataset.idx, 10));
            startAuto();
        });
    });

    startAuto();
}

/* ── 4. Scroll reveal ───────────────────────────────────────── */
function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Décalage léger par card
                const delay = entry.target.closest('.cards-grid')
                    ? [...entry.target.parentElement.children].indexOf(entry.target) * 80
                    : 0;
                setTimeout(() => entry.target.classList.add('visible'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    els.forEach(el => observer.observe(el));
}

/* ── 5. Nav active link au scroll ───────────────────────────── */
function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-link');
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { threshold: 0.35 });

    sections.forEach(s => observer.observe(s));
}

/* ── 6. Filtres par onglets ─────────────────────────────────── */
function initFilterTabs() {
    const tabs      = document.querySelectorAll('.tab');
    const cards     = document.querySelectorAll('.property-card');
    const noResults = document.getElementById('noResults');
    const resetBtn  = document.getElementById('resetFilter');

    if (!tabs.length) return;

    const applyFilter = (filter) => {
        let visible = 0;
        cards.forEach(card => {
            const loc  = card.dataset.location;
            const type = card.dataset.type;
            const show = filter === 'all' || loc === filter || type === filter;
            card.classList.toggle('hidden', !show);
            if (show) visible++;
        });
        if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Sync dropdowns
            const f = tab.dataset.filter;
            syncDropdown('f-location', f);
            syncDropdown('f-type', f);

            applyFilter(f);
        });
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            tabs[0]?.click();
        });
    }
}

/* ── 7. Barre de recherche ──────────────────────────────────── */
function initSearchBar() {
    const btnSearch = document.getElementById('btnSearch');
    if (!btnSearch) return;

    btnSearch.addEventListener('click', () => {
        const loc  = document.getElementById('f-location')?.value || 'all';
        const type = document.getElementById('f-type')?.value    || 'all';

        const cards     = document.querySelectorAll('.property-card');
        const noResults = document.getElementById('noResults');
        const tabs      = document.querySelectorAll('.tab');
        tabs.forEach(t => t.classList.remove('active'));

        let visible = 0;

        cards.forEach(card => {
            const cardLoc  = card.dataset.location;
            const cardType = card.dataset.type;
            const matchLoc  = loc  === 'all' || cardLoc  === loc;
            const matchType = type === 'all' || cardType === type;
            const show = matchLoc && matchType;
            card.classList.toggle('hidden', !show);
            if (show) visible++;
        });

        if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';

        // Scroll to section
        document.getElementById('biens')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

function syncDropdown(id, filter) {
    const sel = document.getElementById(id);
    if (!sel) return;
    const opts = [...sel.options];
    const match = opts.find(o => o.value === filter);
    if (match) sel.value = filter;
    else sel.value = 'all';
}

/* ── 8. Modale détail ───────────────────────────────────────── */
function initModals() {
    const overlay = document.getElementById('modalOverlay');
    const modal   = document.getElementById('modal');
    const body    = document.getElementById('modalBody');
    const close   = document.getElementById('modalClose');
    if (!overlay || !modal) return;

    const openModal = (id) => {
        const p = properties[id];
        if (!p) return;

        body.innerHTML = `
            <img src="${p.img}" alt="${p.title}">
            <h2>${p.title}</h2>
            <p class="modal-loc">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${p.location}
            </p>
            <p class="modal-desc">${p.desc}</p>
            <div class="modal-features">
                ${p.features.map(f => `<span class="modal-feat">${f}</span>`).join('')}
            </div>
            <p class="modal-price">${p.price} <span>— prix indicatif</span></p>
            <div class="modal-actions">
                <a href="${p.wa}" target="_blank" rel="noopener" class="btn-wa-lg">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    Contacter sur WhatsApp
                </a>
                <a href="#reservation" class="btn-primary" id="modalResaLink">Demander une réservation</a>
            </div>
        `;

        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Lien réservation depuis la modale
        document.getElementById('modalResaLink')?.addEventListener('click', closeModal);
    };

    const closeModal = () => {
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    // Délégation : boutons "Voir les détails"
    document.getElementById('cardsGrid')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-details');
        if (btn) openModal(parseInt(btn.dataset.id, 10));
    });

    close?.addEventListener('click', closeModal);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

/* ── 9. Validation & soumission formulaires ─────────────────── */
function initForms() {
    validateForm('resForm',     'resSuccess',     handleResSubmit);
    validateForm('contactForm', 'contactSuccess', handleContactSubmit);
}

function validateForm(formId, successId, onValid) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (runValidation(form)) {
            onValid(form, successId);
        }
    });

    // Validation en temps réel à la perte de focus
    form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) validateField(field);
        });
    });
}

function runValidation(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
        if (!validateField(field)) valid = false;
    });
    return valid;
}

function validateField(field) {
    const err = field.parentElement.querySelector('.err');
    let msg = '';

    if (field.required && !field.value.trim()) {
        msg = 'Ce champ est obligatoire.';
    } else if (field.type === 'email' && field.value.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
            msg = 'Adresse email invalide.';
        }
    } else if (field.type === 'tel' && field.value.trim()) {
        if (!/^\+?[\d\s\-]{7,20}$/.test(field.value.trim())) {
            msg = 'Numéro de téléphone invalide.';
        }
    }

    field.classList.toggle('error', !!msg);
    if (err) err.textContent = msg;
    return !msg;
}

function handleResSubmit(form, successId) {
    form.style.display = 'none';
    showSuccess(successId);
    setTimeout(() => {
        form.reset();
        form.style.display = '';
        document.getElementById(successId)?.classList.remove('show');
    }, 6000);
}

function handleContactSubmit(form, successId) {
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Envoi en cours…'; }

    setTimeout(() => {
        showSuccess(successId);
        form.reset();
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Envoyer le message';
        }
        setTimeout(() => document.getElementById(successId)?.classList.remove('show'), 6000);
    }, 800);
}

function showSuccess(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('show');
}

/* ── 10. Smooth scroll ──────────────────────────────────────── */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
}
