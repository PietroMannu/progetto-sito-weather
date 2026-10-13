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

    // URL dell'icona ufficiale di OpenWeatherMap
    const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

    // Mostra i dettagli meteo con l'immagine
    box.innerHTML = `
        <div class="weather-response-box subtitle">
            <img src="${iconUrl}" alt="${data.description}" style="width: 80px; height: 80px;">
            <br>
            <strong>${data.city}</strong><br>
            <span style="text-transform: capitalize;">${data.description}</span><br>
            Temperatura: ${data.temperature}°C<br>
            Umidità: ${data.humidity}%<br>
            Vento: ${data.wind} m/s
        </div>
    `;
});