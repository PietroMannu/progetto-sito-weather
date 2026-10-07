exports.getWeather = async (req, res) => {
    const city = req.body.city;
    console.log(city);

    // API key per OpenWeatherMap
    const apiKey = "baa41cb831f286c23f6f5298f4b50031";

    try {
        // Chiamata API meteo
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=it`
        );

        const data = await response.json();

        // Se la città non esiste
        if (data.cod !== 200) {
            return res.json({
                error: true,
                message: "Città non trovata"
            });
        }

        // Risposta JSON pulita inviata al client
        res.json({
            city: data.name,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            temperature: data.main.temp,
            humidity: data.main.humidity,
            wind: data.wind.speed
        });

    } catch (err) {
        console.error(err);
        res.json({
            error: true,
            message: "Errore nel server"
        });
    }
};