document.getElementById("weather-form").addEventListener("submit", async function(e) {
    e.preventDefault(); // evita il reload della pagina

    const city = document.getElementById("city-input").value;

    const res = await fetch("/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city })
    });

    const data = await res.json();

    const box = document.getElementById("weather-result");
    box.style.display = "block";

    // Se la città non esiste o c'è un errore
    if (data.error) {
        box.innerHTML = `
            <div class="weather-response-box subtitle">
                ${data.message}
            </div>
        `;
        return;
    }

    // Mostra i dettagli meteo
    box.innerHTML = `
        <div class="weather-response-box subtitle">
            <strong>${data.city}</strong><br>
            ${data.description}<br>
            Temperatura: ${data.temperature}°C<br>
            Umidità: ${data.humidity}%<br>
            Vento: ${data.wind} m/s
        </div>
    `;
});