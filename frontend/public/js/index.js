async function loadWelcomeGif() {
  try {
    const response = await fetch("/api/v1/auth/me");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const user = await response.json();
    console.log("Risposta API auth:", user);

    if (!user || user.authenticated === false) {
      return;
    }

    // 1. Mostra la GIF di benvenuto
    const welcomeContent = document.getElementById("welcome-content");
    if (welcomeContent) {
      const box = document.createElement("div");
      box.className = "welcome-box";

      const img = document.createElement("img");
      img.src = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWd2dXh3aWNodGwxcWEzajU1ZmdtbnpvamVyem9lNGV1cG1kamJzayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/6g5FvDTFnQHaXw5UNV/giphy.gif";
      img.alt = "Welcome Gif";

      box.appendChild(img);
      welcomeContent.appendChild(box);
    }

    // 2. Attiva il pulsante per il servizio Persistence
    setupJsonButton();

  } catch (err) {
    console.error("Errore durante il caricamento della GIF:", err);
  }
}

function setupJsonButton() {
  const btn = document.getElementById("show-json-btn");
  const jsonContainer = document.getElementById("json-container");

  if (!btn || !jsonContainer) return;


  btn.style.display = "inline-block"; // con questo il pulsante è ben visibile.

  // Al click, chiama il servizio Persistence
  btn.addEventListener("click", async () => {
    try {
      //aspetto la chiamata al fetch per il servizio Persistence
      const res = await fetch("/api/v1/persistence");
      // se ho risposta negativa, lancio un errore
      if (!res.ok) {
        throw new Error(`Errore Persistence: HTTP ${res.status}`);
      }
      // se la risposta è positiva, converto in JSON
      const persistenceData = await res.json();

      // Mostra il JSON formattato
      jsonContainer.textContent = JSON.stringify(persistenceData, null, 2);
      jsonContainer.style.display = "block";
    } catch (err) {
      console.error("Errore recupero dati Persistence:", err);
      jsonContainer.textContent = JSON.stringify({ error: "Impossibile recuperare i dati dal servizio Persistence" }, null, 2);
      jsonContainer.style.display = "block";
    }
  });
}

// Esegue il codice al caricamento del DOM
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", loadWelcomeGif);
} else {
  loadWelcomeGif();
}