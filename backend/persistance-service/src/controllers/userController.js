const User = require("../models/User");

const isNonEmptyString = v => typeof v === "string" && v.trim().length > 0;

// POST /users/me -> salva o aggiorna l'utente descritto dal TOKEN (non dal body)
exports.saveMe = async (req, res) => {
    const { googleId, displayName, name, email } = req.user;

    if (!isNonEmptyString(googleId) || !isNonEmptyString(email)) {
        return res.status(400).json({ message: "Il token non contiene googleId ed email." });
    }

    try {
        const user = await User.findOneAndUpdate(
            { googleId },
            { displayName: displayName || name || "", email, lastLogin: new Date() },
            { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
        ).select("-_id -__v").lean();

        return res.status(200).json({ message: "Utente salvato.", user });
    } catch (err) {
        console.error("Errore salvataggio utente:", err.message);
        return res.status(500).json({ message: "Errore interno del server." });
    }
};

// GET /users/me -> solo l'utente del token
exports.getMe = async (req, res) => {
    try {
        const user = await User.findOne({ googleId: req.user.googleId })
            .select("-_id -__v")
            .lean();

        if (!user) {
            return res.status(404).json({ message: "Utente non trovato." });
        }
        return res.status(200).json(user);
    } catch (err) {
        console.error("Errore lettura utente:", err.message);
        return res.status(500).json({ message: "Errore interno del server." });
    }
};
