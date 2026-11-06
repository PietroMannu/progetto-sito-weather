async function loadNavbarUser() {
  const welcomeEl = document.getElementById('user-welcome');
  if (!welcomeEl) return;

  try {
    const response = await fetch('/api/v1/auth/me', { credentials: 'include' });
    if (!response.ok) return;

    const data = await response.json();
    const user = data?.user || {};
    const fullName = [user.firstName, user.lastName]
      .filter(Boolean)
      .join(' ')
      || user.displayName
      || user.name
      || 'Utente';

    welcomeEl.textContent = `Benvenuto ${fullName}`;
  } catch (error) {
    console.log('Utente non autenticato:', error.message);
  }
}

async function loadNavbar() {
  const navbarRoot = document.getElementById('navbar');
  if (!navbarRoot) return;

  try {
    const response = await fetch('/api/v1/components/navbar.html');
    if (!response.ok) return;

    const html = await response.text();
    navbarRoot.innerHTML = html;
    await loadNavbarUser();
  } catch (error) {
    console.error('Errore nel caricamento della navbar:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('navbar')) {
    loadNavbar();
  }
});

window.loadNavbar = loadNavbar;
window.loadNavbarUser = loadNavbarUser;
