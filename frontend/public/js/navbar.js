// Va incluso in ogni pagina al posto dello script inline che faceva fetch della navbar
async function loadNavbar() {
  const container = document.getElementById("navbar");
  if (!container) return; // Guard clause

  // 1. Inserisce l'HTML della navbar
  const html = await (await fetch("/api/v1/components/navbar.html")).text();
  container.innerHTML = html;

  // 2. Elementi del DOM per la gestione dell'autenticazione
  const authArea = document.getElementById("auth-area");
  const userWelcome = document.getElementById("user-welcome");

  try {
    const response = await fetch("/api/v1/auth/me");

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const user = await response.json();

    if (user.authenticated) {
      // 3A. Inserisce il saluto a SINISTRA affianco a MyApp
      if (userWelcome) {
        userWelcome.textContent = `Ciao ${user.firstName}`;
      }

      // 3B. Inserisce SOLO il pulsante Logout a DESTRA
      authArea.replaceChildren(); 
      
      const logout = document.createElement("a");
      logout.href = "/api/v1/auth/logout";
      logout.textContent = "Logout";

      authArea.append(logout);
    }
  } catch (err) {
    console.error("Impossibile verificare l'autenticazione:", err);
  }
}

window.addEventListener("DOMContentLoaded", loadNavbar);