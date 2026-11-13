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
    try {
      const res = await fetch("/api/v1/auth/me");

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const userData = await res.json();
      jsonContainer.textContent = JSON.stringify(userData, null, 2);
      jsonContainer.style.display = "block";
    } catch (err) {
      console.error("Errore recupero dati account Google:", err);
      jsonContainer.textContent = JSON.stringify(
        { error: "Impossibile recuperare i dati del tuo account Google", dettagli: err.message },
        null,
        2
      );
      jsonContainer.style.display = "block";
    }
  });
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", loadWelcomeGif);
} else {
  loadWelcomeGif();
}