const express = require("express");
const router = express.Router();
const path = require("path");

const publicPath = path.join(__dirname, "../../../../frontend/public");

// --- ROTTE GET (Servono le pagine HTML) ---
router.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

router.get("/login", (req, res) => {
    res.sendFile(path.join(publicPath, "login.html"));
});

router.get("/about", (req, res) => {
    res.sendFile(path.join(publicPath, "about.html"));
});

// Nota: Usa 'signin.html' o 'signin.html' in base a come è chiamato il file nella cartella public
router.get("/signin", (req, res) => {
    res.sendFile(path.join(publicPath, "signin.html")); 
});

router.get("/weather", (req, res) => {
    res.sendFile(path.join(publicPath, "weather.html"));
});


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