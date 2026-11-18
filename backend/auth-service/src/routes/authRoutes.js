const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const env = require("../../config/env");
const router = express.Router();

//Avvia il login: redirect verso google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", //forza la scelta dell'account
  })
);

// Google rimanda qui. Se il login riesce:
// 1. creo un token firmato con i dati dell'utente
// 2. lo mando al persistance-service che salva/aggiorna l'utente su MongoDB
// 3. do lo stesso token al browser in un cookie, così potrà leggere i suoi dati
// 4. riporto il browser sul sito
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${env.FRONTEND_URL}`,
  }),
  async (req, res) => {
    const token = jwt.sign(
      {
        googleId: req.user.googleId,
        displayName: req.user.displayName,
        email: req.user.email,
      },
      env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // chiamata da server a server: salva (o aggiorna) l'utente nel database
    try {
      const r = await fetch(`${env.PERSISTENCE_URL}/users/me`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) throw new Error(`persistence ha risposto ${r.status}`);
      console.log(`Utente salvato nel database: ${req.user.email}`);
    } catch (err) {
      // il login prosegue comunque, ma l'errore resta nei log
      console.error("Salvataggio utente fallito:", err.message);
    }

    // cookie non leggibile da JavaScript (httpOnly), scade come la sessione
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // metti true solo con HTTPS in produzione
      maxAge: 60 * 60 * 1000,
    });

    res.redirect(env.FRONTEND_URL);
  }
);
//lo scopo è: login fallisce --> restituzione alla home con navbar non modificata
//login va a buon fine restituzione alla home con navbar aggiornata

// Usata dalla navbar: restituisce solo ciò che serve all'interfaccia
router.get("/me", (req, res) => {
  // risposta dipendente dalla sessione: mai in cache
  res.set("Cache-Control", "no-store");

  if (!req.isAuthenticated()) { //json non autenticato
    return res.json({ authenticated: false });
  }
  res.json({ //json autenticato
    authenticated: true,
    firstName: req.user.firstName,
  });
});

// Distruggiamo la sessione che abbiamo costruito. Lato Server la sessione non esiste più
// La sessione su google però rimane aperta.
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.clearCookie("token"); // cancella anche il token per il persistence
      res.redirect(env.FRONTEND_URL);
    });
  });
});

module.exports = router;
