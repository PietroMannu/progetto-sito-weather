//raccolgo qui tutte le routes delle pages, ossia i percorsi ut
//in altri termini tutti i get saranno raccolti qui

const express = require("express");
const router = express.Router();
const paths = require("../../config/paths");
const path = require("path");

// HOME
router.get("/", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "index.html"));
});

// LOGIN
router.get("/login", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "login.html"));
});

// ABOUT
router.get("/about", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "about.html"));
});

// SIGNIN
router.get("/signin", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "signin.html"));
});

// WEATHER
router.get("/weather", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "weather.html"));
});

module.exports = router;


// --- ROTTE POST (Gestiscono i form inviati) ---

// Gestione invio del form di Login (Risolve Foto 1)
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log("Richiesta di login ricevuta per:", email);
    res.json({ success: true, message: "Login effettuato con successo!" });
});

// Gestione invio del form di Registrazione
router.post("/signin", (req, res) => {
    console.log("Richiesta di registrazione ricevuta:", req.body);
    res.json({ success: true, message: "Registrazione completata!" });
});

module.exports = router;