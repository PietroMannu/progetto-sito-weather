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
    secret: env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Metti true solo se usi HTTPS in produzione
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Monta le rotte sulla radice perché authProxy rimuove "/api/v1/auth"
app.use("/", googleAuthRoutes);

app.listen(env.AUTH_PORT, () => {
  console.log(`Auth service attivo su http://localhost:${env.AUTH_PORT}`);
});