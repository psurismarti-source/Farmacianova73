/* ==========================================
   FARMÀCIA NOVA 73 · main.js
   Funcionalitats: Nav, Forms, Animacions,
   Cookies, WhatsApp, Lead Magnet
   ========================================== */

'use strict';

// ---- FIX ROOT-RELATIVE LINKS ON file:// ----
// Many pages use href="/es/..." etc. That works on a web server, but breaks when opening
// the site locally with file:// (it points to disk root). This rewrites those links to
// absolute file URLs rooted at the local "farmanova73" folder.
(function fixFileProtocolRootLinks() {
  if (window.location.protocol !== 'file:') return;

  const marker = '/farmanova73/';
  const fullHref = window.location.href;
  const idx = fullHref.indexOf(marker);
  if (idx === -1) return;

  const base = fullHref.slice(0, idx + marker.length); // file:///.../farmanova73/
  document.querySelectorAll('a[href^="/"]').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('/')) return;
    a.href = new URL(href.slice(1), base).href;
  });
})();

// ---- NAV / HEADER ----
(function initNav() {
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');

  // Scroll → shadow
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  function openMenu() {
    menu.classList.add('open');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Hamburger toggle (visible on BOTH desktop and mobile)
  if (toggle && menu) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });
  }

  // Close on clicking any link inside the menu
  if (menu) {
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (menu && menu.classList.contains('open')) {
      if (!menu.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
        closeMenu();
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu && menu.classList.contains('open')) {
      closeMenu();
      toggle.focus();
    }
  });

  // Active link highlighting (auto-detect current page)
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .nav-contacte-desktop, .nav-contacte-mobile').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href && href.includes(currentPath) && currentPath !== '') {
      link.classList.add('active');
    }
  });
})();

// ---- LANG DROPDOWN (tap-friendly, mobile-safe) ----
(function initLangDropdown() {
  const containers = Array.from(document.querySelectorAll('.lang-dropdown-container'));
  if (!containers.length) return;

  function getMenu(container) {
    return container.querySelector('.lang-menu');
  }

  function getButton(container) {
    return container.querySelector('.lang-btn');
  }

  function closeAll(exceptContainer = null) {
    containers.forEach((c) => {
      if (exceptContainer && c === exceptContainer) return;
      const m = getMenu(c);
      const b = getButton(c);
      if (m) m.classList.remove('show');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }

  containers.forEach((container) => {
    const btn = getButton(container);
    const menu = getMenu(container);
    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = menu.classList.contains('show');
      closeAll(container);
      menu.classList.toggle('show', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Close when clicking outside
  document.addEventListener('click', () => closeAll(null));

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeAll(null);
  });
})();


// ---- SCROLL ANIMATIONS ----
(function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Add class to animatable elements
  const targets = document.querySelectorAll(
    '.porta-card, .servei-card, .resseny-card, .pillar, .blog-card, .team-card, .loc-detail, .b2b-service-card'
  );
  targets.forEach((el, i) => {
    el.classList.add('animate-in');
    observer.observe(el);
  });
})();

// ---- COOKIE BANNER (RGPD) ----
(function initCookies() {
  const banner  = document.getElementById('cookie-banner');
  const accept  = document.getElementById('cookie-accept');
  const reject  = document.getElementById('cookie-reject');

  if (!banner) return;

  const consent = localStorage.getItem('fn73_cookie_consent');
  if (!consent) {
    setTimeout(() => banner.classList.add('visible'), 1200);
  }

  function saveCookieChoice(choice) {
    try { localStorage.setItem('fn73_cookie_consent', choice); } catch(e) {}
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 400);
  }

  accept && accept.addEventListener('click', () => saveCookieChoice('all'));
  reject && reject.addEventListener('click', () => saveCookieChoice('essential'));
})();

// ---- FORM: LEAD MAGNET ----
(function initLeadForm() {
  const form = document.getElementById('lead-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="btn-icon">⏳</span> Enviant...';
    btn.disabled = true;

    try {
      // === PLACEHOLDER: Substituir per Formspree / EmailJS real ===
      // const res = await fetch('https://formspree.io/f/YOUR_ID', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      //   body: JSON.stringify(Object.fromEntries(new FormData(form)))
      // });
      // Simulated delay
      await new Promise(r => setTimeout(r, 1200));

      showMessage(form, 'success', '✓ Gràcies! T\'hem enviat el PDF a l\'email. Revisa la safata d\'entrada (i el spam per si de cas).');
      form.reset();
    } catch(err) {
      showMessage(form, 'error', '✗ Hi ha hagut un error. Torna-ho a intentar o contacta\'ns per WhatsApp.');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });
})();

// ---- FORM: RESERVA CITES ----
(function initReservaForm() {
  const form = document.getElementById('reserva-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="btn-icon">⏳</span> Enviant reserva...';
    btn.disabled = true;

    try {
      // === PLACEHOLDER Formspree / EmailJS ===
      await new Promise(r => setTimeout(r, 1200));
      showMessage(form, 'success', '✓ Reserva rebuda! Ens posarem en contacte amb tu en les properes hores per confirmar la cita. Si no ens has sentit, truca\'ns o escriu per WhatsApp.');
      form.reset();
    } catch(err) {
      showMessage(form, 'error', '✗ Error en enviar. Prova per WhatsApp o truca\'ns directament.');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });
})();

// ---- FORM: B2B ----
(function initB2BForm() {
  const form = document.getElementById('b2b-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="btn-icon">⏳</span> Enviant...';
    btn.disabled = true;

    try {
      await new Promise(r => setTimeout(r, 1200));
      showMessage(form, 'success', '✓ Sol·licitud rebuda! Us contactarem en les properes 24h per parlar del vostre projecte.');
      form.reset();
    } catch(err) {
      showMessage(form, 'error', '✗ Error en enviar. Escriviu-nos per email a farmanova@farmanova73.cat.');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });
})();

// ---- HELPERS ----
function validateForm(form) {
  let valid = true;
  const required = form.querySelectorAll('[required]');

  required.forEach(field => {
    const group = field.closest('.form-group') || field.parentElement;
    removeError(group);

    if (!field.value.trim() ||
        (field.type === 'email' && !isValidEmail(field.value)) ||
        (field.type === 'checkbox' && !field.checked)) {
      showError(group, getErrorMsg(field));
      valid = false;
    }
  });

  if (!valid) {
    const firstError = form.querySelector('.field-error');
    if (firstError) {
      const parent = firstError.closest('.form-group');
      if (parent) parent.querySelector('input, select, textarea')?.focus();
    }
  }

  return valid;
}

function getErrorMsg(field) {
  if (field.type === 'checkbox') return 'Cal acceptar per continuar';
  if (field.type === 'email') return 'Introdueix un email vàlid';
  if (field.tagName === 'SELECT') return 'Selecciona una opció';
  return 'Aquest camp és obligatori';
}

function showError(container, msg) {
  const err = document.createElement('span');
  err.className = 'field-error';
  err.textContent = msg;
  err.style.cssText = 'color:#c0392b;font-size:0.78rem;margin-top:0.25rem;display:block;';
  container.appendChild(err);
  const input = container.querySelector('input, select, textarea');
  if (input) input.style.borderColor = '#dc3545';
}

function removeError(container) {
  container.querySelectorAll('.field-error').forEach(e => e.remove());
  const input = container.querySelector('input, select, textarea');
  if (input) input.style.borderColor = '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMessage(form, type, text) {
  let msg = form.querySelector('.form-message');
  if (!msg) {
    msg = document.createElement('div');
    msg.className = 'form-message';
    form.appendChild(msg);
  }
  msg.className = `form-message ${type}`;
  msg.textContent = text;
  msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---- SMOOTH SCROLL for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile menu if open
      const menu = document.getElementById('nav-menu');
      const toggle = document.getElementById('nav-toggle');
      if (menu && menu.classList.contains('open')) {
        menu.classList.remove('open');
        toggle && toggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
});

// ---- Pre-fill form servei from URL param ----
(function prefillServei() {
  const url = new URL(window.location.href);
  const servei = url.searchParams.get('servei');
  if (servei) {
    const select = document.querySelector('#reserva-servei, [name="servei"]');
    if (select) {
      const opts = Array.from(select.options);
      const match = opts.find(o => o.value.toLowerCase().includes(servei.toLowerCase()));
      if (match) select.value = match.value;
    }
  }

  // Also from data-servei button clicks
  document.querySelectorAll('[data-servei]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const servei = btn.getAttribute('data-servei');
      const href = btn.getAttribute('href') || '';
      if (href.includes('#reserva')) {
        sessionStorage.setItem('fn73_servei', servei);
      }
    });
  });

  const savedServei = sessionStorage.getItem('fn73_servei');
  if (savedServei) {
    const select = document.querySelector('#reserva-servei, [name="servei"]');
    if (select) {
      const opts = Array.from(select.options);
      const match = opts.find(o => o.value.toLowerCase().includes(savedServei.toLowerCase()));
      if (match) {
        select.value = match.value;
        sessionStorage.removeItem('fn73_servei');
      }
    }
  }
})();

// ---- TEAM VIDEO ON HOVER ----
(function initVideoHover() {
  document.querySelectorAll('.team-card').forEach(card => {
    const video = card.querySelector('.team-video');
    if (video) {
      card.addEventListener('mouseenter', () => {
        video.play().catch(e => console.warn('Pausa/Play vídeo error:', e));
      });
      card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
      });
    }
  });
})();

// ---- Log que tot va bé ----
console.log('%c⚙️ Farmàcia Nova 73 · farmanova73.cat', 'color:#1a6b3c;font-size:14px;font-weight:bold;');
console.log('%cAl 73, posem el teu motor en solfa.', 'color:#e8a020;font-size:12px;');
