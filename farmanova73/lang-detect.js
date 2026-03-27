// lang-detect.js
// Detects the browser language and redirects automatically ONLY on the first visit to the root.

(function() {
  const marker = '/farmanova73/';
  const isFile = window.location.protocol === 'file:';
  const path = window.location.pathname;
  const maybeRelPath = isFile && path.includes(marker) ? path.slice(path.indexOf(marker) + marker.length - 1) : path; // "/index.html" or "/es/index.html"

  // Persist user's language based on the section they are visiting.
  // This prevents jumping to another language when returning to the home page.
  if (maybeRelPath.startsWith('/es/')) {
    localStorage.setItem('user_lang', 'es');
  } else if (maybeRelPath.startsWith('/en/')) {
    localStorage.setItem('user_lang', 'en');
  } else if (maybeRelPath.startsWith('/fr/')) {
    localStorage.setItem('user_lang', 'fr');
  } else if (maybeRelPath !== '/' && maybeRelPath !== '/index.html') {
    // Any non-root path outside /es, /en, /fr is Catalan content.
    localStorage.setItem('user_lang', 'ca');
  }

  // Redirect logic applies only on root.
  if (maybeRelPath !== '/' && maybeRelPath !== '/index.html') return;

  // Check if user has already manually chosen a language
  const userLang = localStorage.getItem('user_lang');
  
  if (!userLang) {
    // Detect browser language
    const browserLang = navigator.language.slice(0, 2).toLowerCase();
    
    // Check if it matches any of our supported targets (es, en, fr)
    // Catalan (ca) is default, so no redirect needed
    if (['es', 'en', 'fr'].includes(browserLang)) {
      if (isFile && path.includes(marker)) {
        const base = window.location.href.slice(0, window.location.href.indexOf(marker) + marker.length);
        window.location.replace(new URL(browserLang + '/index.html', base).href);
      } else {
        window.location.replace('/' + browserLang + '/index.html');
      }
    }
  }
})();
