// Browser-language routing only: no cookies, storage, analytics or requests.
(() => {
  const englishChoice = new URLSearchParams(window.location.search).get('lang') === 'en';
  const preferred = (navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
  const dutch = document.querySelector('link[rel="alternate"][hreflang="nl"]');
  if (document.documentElement.lang === 'en' && !englishChoice && /^nl(?:-|$)/.test(preferred) && dutch) {
    const destination = new URL(dutch.getAttribute('href'), window.location.href);
    destination.hash = window.location.hash;
    window.location.replace(destination.href);
    return;
  }
  // Keep a private invitation fragment intact when changing language.
  function updateLanguageLinks() {
    for (const link of document.querySelectorAll('a[hreflang]')) {
      const destination = new URL(link.getAttribute('href'), window.location.href);
      destination.hash = window.location.hash;
      link.href = destination.href;
    }
  }
  window.addEventListener('hashchange', updateLanguageLinks);
  updateLanguageLinks();
})();
