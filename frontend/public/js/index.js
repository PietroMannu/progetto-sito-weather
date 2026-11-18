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

    setupJsonButton();
  } catch (err) {
    console.error("Errore durante il caricamento della GIF:", err);
  }
}

function setupJsonButton() {
  const btn = document.getElementById("show-json-btn");
  const jsonContainer = document.getElementById("json-container");

  if (!btn || !jsonContainer) return;

  btn.style.display = "inline-block";

  btn.addEventListener("click", async () => {
    jsonContainer.style.display = "block";
    jsonContainer.textContent = "Caricamento dal database...";

    try {
      // Passa dal gateway -> persistance-service -> MongoDB
      const res = await fetch("/api/v1/persistence/users/me");
      const data = await res.json().catch(() => ({}));

      let result;
      if (res.ok) {
        result = { fonte: "MongoDB (persistance-service)", ...data };
      } else if (res.status === 401) {
        result = {
          errore: "401 - il persistence non ha ricevuto un token valido",
          suggerimento: "Fai logout e poi di nuovo login con Google"
        };
      } else if (res.status === 404) {
        result = {
          errore: "404 - token valido ma utente non trovato nel database",
          suggerimento: "Il salvataggio al login non è avvenuto: controlla il terminale dell'auth-service"
        };
      } else {
        result = { errore: `HTTP ${res.status}`, dettagli: data };
      }

      jsonContainer.textContent = JSON.stringify(result, null, 2);
    } catch (err) {
      console.error("Errore recupero dati dal persistence:", err);
      jsonContainer.textContent = JSON.stringify(
        { errore: "Impossibile contattare il persistence", dettagli: err.message },
        null,
        2
      );
    }
  });
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", loadWelcomeGif);
} else {
  loadWelcomeGif();
}