const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/env");

// Lascia passare solo chi ha un JWT valido (header Bearer oppure cookie "token")
module.exports = function requireAuth(req, res, next) {
    const header = req.headers.authorization || "";
    const bearer = header.startsWith("Bearer ") ? header.slice(7) : null;
    const token = bearer || req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Autenticazione richiesta." });
    }

    try {
        req.user = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token non valido o scaduto." });
    }
};
