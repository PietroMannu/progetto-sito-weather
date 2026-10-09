const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");

// Definizione delle rotte POST per l'autenticazione
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;