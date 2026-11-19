function initMoviesPage() {
  const grid = document.getElementById("movies-grid");
  const statusEl = document.getElementById("status");
  const headingEl = document.getElementById("results-heading");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");

  const trailerBox = document.getElementById("trailer-box");
  const trailerTitle = document.getElementById("trailer-title");
  const trailerFrame = document.getElementById("trailer-frame");
  const closeTrailerBtn = document.getElementById("close-trailer");

  const posterModal = document.getElementById("poster-modal");
  const closePosterModalBtn = document.getElementById("close-poster-modal");
  const modalPosterImg = document.getElementById("modal-poster-img");
  const modalTitle = document.getElementById("modal-title");
  const modalMeta = document.getElementById("modal-meta");
  const modalDesc = document.getElementById("modal-desc");
  const modalTrailerBtn = document.getElementById("modal-trailer-btn");
  const modalTmdbLink = document.getElementById("modal-tmdb-link");

  let activeModalMovie = null;

  if (!grid || !statusEl || !headingEl || !searchForm || !searchInput) {
    return;
  }

  function closeTrailer() {
    trailerFrame.src = "";
    trailerBox.style.display = "none";
  }

  closeTrailerBtn.addEventListener("click", closeTrailer);

  function closePosterModal() {
    posterModal.classList.remove("open");
    activeModalMovie = null;
  }

  closePosterModalBtn.addEventListener("click", closePosterModal);
  posterModal.addEventListener("click", e => {
    if (e.target === posterModal) closePosterModal();
  });
  window.addEventListener("keydown", e => {
    if (e.key === "Escape") closePosterModal();
  });

  function openPosterModal(movie) {
    activeModalMovie = movie;
    modalPosterImg.src = movie.posterFull || movie.poster || "";
    modalPosterImg.alt = movie.title || "Locandina";
    modalTitle.textContent = movie.title || "";
    modalMeta.textContent = [movie.originalTitle, movie.year, movie.rating].filter(Boolean).join(" • ");
    modalDesc.textContent = movie.description || "";
    if (movie.tmdbUrl) {
      modalTmdbLink.href = movie.tmdbUrl;
      modalTmdbLink.style.display = "inline-flex";
    } else {
      modalTmdbLink.style.display = "none";
    }
    posterModal.classList.add("open");
  }

  modalTrailerBtn.addEventListener("click", () => {
    if (!activeModalMovie) return;
    const movie = activeModalMovie;
    closePosterModal();
    loadAndPlayTrailer(movie, modalTrailerBtn);
  });

  async function loadAndPlayTrailer(movie, triggerBtn) {
    if (!movie || !movie.id) return;
    const originalText = triggerBtn ? triggerBtn.textContent : "";
    if (triggerBtn) {
      triggerBtn.disabled = true;
      triggerBtn.textContent = "Caricamento...";
    }

    try {
      const res = await fetch(`/api/v1/movies/trailer?id=${encodeURIComponent(movie.id)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore recupero trailer");

      if (!data.found || !data.embedUrl) {
        statusEl.style.display = "block";
        statusEl.textContent = `Nessun trailer disponibile per "${movie.title}".`;
        statusEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      statusEl.style.display = "none";
      trailerTitle.textContent = `Trailer: ${movie.title} (${data.name})`;
      trailerFrame.src = data.embedUrl;
      trailerBox.style.display = "block";
      trailerBox.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err) {
      statusEl.style.display = "block";
      statusEl.textContent = "Errore trailer: " + err.message;
    } finally {
      if (triggerBtn) {
        triggerBtn.disabled = false;
        triggerBtn.textContent = originalText;
      }
    }
  }

  function createMovieCard(movie) {
    const card = document.createElement("article");
    card.className = "card";

    // Locandina cliccabile per ingrandimento e scheda completa
    const posterWrap = document.createElement("div");
    posterWrap.className = "poster-wrapper";
    posterWrap.title = "Clicca per ingrandire la locandina e leggere la trama completa";
    posterWrap.addEventListener("click", () => openPosterModal(movie));

    const img = document.createElement("img");
    img.src = movie.poster || "";
    img.alt = movie.title || "Locandina film";
    img.loading = "lazy";
    posterWrap.appendChild(img);

    const badge = document.createElement("span");
    badge.className = "poster-badge";
    badge.textContent = "Ingrandisci";
    posterWrap.appendChild(badge);

    card.appendChild(posterWrap);

    const body = document.createElement("div");
    body.className = "card-body";

    const titleEl = document.createElement("h3");
    titleEl.className = "card-title";
    titleEl.textContent = movie.title || "Titolo non disponibile";
    body.appendChild(titleEl);

    const metaEl = document.createElement("div");
    metaEl.className = "card-meta";
    metaEl.textContent = [movie.year, movie.rating].filter(Boolean).join(" • ") || "Scheda Film";
    body.appendChild(metaEl);

    const descEl = document.createElement("p");
    descEl.className = "card-desc";
    descEl.textContent = movie.description || "";
    body.appendChild(descEl);

    const actionsEl = document.createElement("div");
    actionsEl.className = "card-actions";

    const watchBtn = document.createElement("button");
    watchBtn.type = "button";
    watchBtn.className = "btn";
    watchBtn.textContent = "▶ Trailer";
    watchBtn.addEventListener("click", () => loadAndPlayTrailer(movie, watchBtn));
    actionsEl.appendChild(watchBtn);

    const detailsBtn = document.createElement("button");
    detailsBtn.type = "button";
    detailsBtn.className = "btn-outline";
    detailsBtn.textContent = "Scheda";
    detailsBtn.addEventListener("click", () => openPosterModal(movie));
    actionsEl.appendChild(detailsBtn);

    body.appendChild(actionsEl);
    card.appendChild(body);
    return card;
  }

  function renderMovies(movies) {
    grid.innerHTML = "";
    if (!movies || movies.length === 0) {
      statusEl.style.display = "block";
      statusEl.textContent = "Nessun film trovato per questa ricerca.";
      return;
    }

    statusEl.style.display = "none";
    movies.forEach(movie => {
      grid.appendChild(createMovieCard(movie));
    });
  }

  async function loadDailyMovies() {
    headingEl.textContent = "Film del Giorno";
    statusEl.style.display = "block";
    statusEl.textContent = "Caricamento Film del Giorno...";
    try {
      const res = await fetch("/api/v1/movies/today");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore server");
      renderMovies(data.results || []);
    } catch (err) {
      statusEl.textContent = "Errore: " + err.message;
    }
  }

  async function performSearch(query) {
    headingEl.textContent = `Risultati per "${query}"`;
    statusEl.style.display = "block";
    statusEl.textContent = "Ricerca in corso...";
    grid.innerHTML = "";
    try {
      const res = await fetch(`/api/v1/movies/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore durante la ricerca");
      renderMovies(data.results || []);
    } catch (err) {
      statusEl.textContent = "Errore: " + err.message;
    }
  }

  searchForm.addEventListener("submit", e => {
    e.preventDefault();
    const q = searchInput.value.trim();
    if (q) performSearch(q);
  });

  document.querySelectorAll(".suggestions button").forEach(btn => {
    btn.addEventListener("click", () => {
      const q = btn.getAttribute("data-q");
      searchInput.value = q;
      performSearch(q);
    });
  });

  loadDailyMovies();
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initMoviesPage);
} else {
  initMoviesPage();
}