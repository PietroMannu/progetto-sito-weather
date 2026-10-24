const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { GOOGLE_CLIENT_ID, JWT_SECRET } = require("../../config/env");

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
    const { credential } = req.body;

    if (!credential) {
        return res.status(400).json({ message: "Token Google mancante." });
    }

    try {
        // Google verifica firma, scadenza e che il token sia destinato alla tua app
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();

        const user = {
            googleId: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture
        };

        // TODO: persistence-service (cerca/crea utente per googleId)

        const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({
            message: "Login effettuato con successo!",
            token,
            user
        });
    } catch (err) {
        console.error("Verifica token Google fallita:", err.message);
        return res.status(401).json({ message: "Token Google non valido." });
    }
};