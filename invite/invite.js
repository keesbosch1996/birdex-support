// No request contains the invitation code: it stays in the URL fragment and
// is passed to the native app only after the recipient chooses Open Koekoek.
function showInvitation() {
  const code = window.location.hash.slice(1);
  const dutch = document.documentElement.lang === 'nl';
  const valid = /^[0-9a-f]{32}$/i.test(code);
  document.getElementById('invitation').hidden = !valid;
  document.getElementById('invalid-invite').hidden = valid;
  const open = document.getElementById('open-app');
  open.removeAttribute('href');
  document.getElementById('invite-code').textContent = '';
  document.getElementById('copy-status').textContent = '';
  if (!valid) return;
  const token = code.toLowerCase();
  open.href = 'koekoek://invite/' + token;
  document.getElementById('invite-code').textContent = token;
  document.getElementById('copy-code').onclick = async () => {
    try {
      await navigator.clipboard.writeText(token);
      document.getElementById('copy-status').textContent = dutch ? 'Gekopieerd. Plak de code in Koekoek om verder te gaan.' : 'Copied. Paste it into Koekoek to continue.';
    } catch {
      document.getElementById('copy-status').textContent = dutch ? 'Selecteer en kopieer de code hierboven en plak deze in Koekoek.' : 'Select the code above and copy it, then paste it into Koekoek.';
    }
  };
}
window.addEventListener('hashchange', showInvitation);
showInvitation();
