//gestione della sessione --> express-session +passport
const passport = require("passport");
const env = require("./env");
// lo scopo della libreria è gestire l'autenticazione e mantenere l'identità dell'utente.
// Permette di autenticarsi tramite account Google.
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Registrazione della strategia Google in Passport
passport.use(
  new GoogleStrategy(
    {
      //dati ottenuti dal file .env
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/google/callback",
    },
    // Google restituisce i dati dell'utente autenticato.
    async (accessToken, refreshToken, profile, done) => {
      try {
        const fullName = profile.displayName || "";
        const nameParts = fullName.split(" ").filter(Boolean);
        const user = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name?.givenName || nameParts[0] || "utente",
          lastName: profile.name?.familyName || nameParts.slice(1).join(" ") || "",
          email: profile.emails?.[0]?.value,
        };
        // Comunica a Passport che l'autenticazione è andata a buon fine e restituisce l'user
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

//quando l'utente si autentica express-session genera una sessione,
//con serializeUser ci mettiamo dentro le info di user
passport.serializeUser((user, done) => {
  done(null, user);
});

//deserializeUser() recupera l'utente dalla sessione a ogni richiesta
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
