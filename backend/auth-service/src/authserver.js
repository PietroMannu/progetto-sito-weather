const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const express = require("express");
const session = require("express-session");
const passport = require("../config/passport");
const env = require("../config/env");
const googleAuthRoutes = require("./routes/authRoutes");

const app = express();

// app.use(
//   session({
//     secret: "super-secret-key",
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// Siamo dietro al gateway (reverse proxy): serve per i cookie "secure" in produzione
app.set("trust proxy", 1);

app.use(
  session({
    secret: env.SESSION_SECRET, // non più hardcoded nel codice
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // il JS del browser non può leggere il cookie
      sameSite: "lax", // necessario per il ritorno da Google (navigazione top-level)
      secure: env.NODE_ENV === "production", // solo HTTPS in produzione
      maxAge: 1000 * 60 * 60 * 8, // 8 ore
    },
    // NB: senza "store" usa MemoryStore, ok per sviluppo ma NON per produzione
    // (si svuota a ogni riavvio e non scala su più istanze: usare Redis o simili)
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", googleAuthRoutes);

app.listen(env.AUTH_PORT, () => {
  console.log(`Auth Server avviato sulla porta ${env.AUTH_PORT}`);
});
