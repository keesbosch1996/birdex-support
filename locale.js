// Country-based default only. Explicit language links take precedence; no storage.
(async () => {
  const initialURL = window.location.href;
  const choice = new URLSearchParams(window.location.search).get('lang');
  const dutch = document.querySelector('a[hreflang="nl"]');
  const publicHost = ['koekoekapp.com', 'www.koekoekapp.com'].includes(window.location.hostname);
  function showDutch() {
    const destination = new URL(dutch.getAttribute('href'), window.location.href);
    destination.search = window.location.search;
    destination.hash = window.location.hash;
    window.location.replace(destination.href);
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
  async function chooseDefaultLanguage() {
    // A Dutch URL is an explicit choice. Invitations retain their no-network policy.
    if (document.documentElement.lang !== 'en' || choice === 'en' || !dutch) return false;
    if (choice === 'nl') { showDutch(); return true; }
    if (document.body.classList.contains('invitation-site') || !publicHost) return false;
    try {
      const response = await fetch('https://koekoek-flock.kb-innovationsbv.workers.dev/website-language', {
        credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store', signal: AbortSignal.timeout(1500),
      });
      if (!response.ok) return false;
      const result = await response.json();
      // Do not interrupt navigation that happened while the country request ran.
      if (result.language === 'nl' && window.location.href === initialURL) { showDutch(); return true; }
    } catch {
      // Unknown country, blocked request or timeout: keep the English default.
    }
    return false;
  }
  // Count only the final page, never both sides of an automatic language redirect.
  if (await chooseDefaultLanguage()) return;
  const analytics = document.querySelector('meta[name="koekoek-web-analytics"]');
  if (!publicHost || !analytics || document.body.classList.contains('invitation-site')) return;
  const beacon = document.createElement('script');
  beacon.type = 'module';
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  beacon.setAttribute('data-cf-beacon', JSON.stringify({ token: analytics.content }));
  document.head.appendChild(beacon);
})();
