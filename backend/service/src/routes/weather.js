const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");

// Rotta POST per il meteo che invoca il controller
router.post("/", weatherController.getWeather);

module.exports = router;