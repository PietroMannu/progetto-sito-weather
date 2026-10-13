const { getWeather } = require("../utils/apiClient");
const { WEATHER_API_KEY } = require("../utils/constants");
const { logInfo, logError } = require("../utils/logger");
const { normalizeWeather } = require("../utils/normalizeWeather");
const { validateCity } = require("../utils/validateCity");

exports.getWeather = async (req, res) => {
    // Supporta sia richieste POST (req.body) che GET (req.query)
    const city = req.body?.city || req.query?.city;

    // 1. Validazione dell'input con validateCity
    if (!validateCity(city)) {
        logError(`Città non valida o non inserita: "${city}"`);
        return res.status(400).json({
            error: true,
            message: "Inserisci un nome di città valido."
        });
    }

    try {
        logInfo(`Richiesta meteo ricevuta per: ${city}`);

        // 2. Chiamata API esterna tramite apiClient e la chiave da constants
        const data = await getWeather(city, WEATHER_API_KEY);

        // Se OpenWeather restituisce un errore (es. città non trovata)
        if (data.cod !== 200 && data.cod !== "200") {
            logError(`Città non trovata su OpenWeather: ${city}`);
            return res.status(404).json({
                error: true,
                message: "Città non trovata."
            });
        }

        // 3. Pulizia del JSON con normalizeWeather
        const cleanData = normalizeWeather(data);

        logInfo(`Meteo recuperato con successo per: ${city}`);
        return res.json(cleanData);

    } catch (err) {
        logError(`Errore del server durante il recupero del meteo: ${err.message}`);
        return res.status(500).json({
            error: true,
            message: "Errore interno del server"
        });
    }
};