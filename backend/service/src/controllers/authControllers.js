// Gestione della registrazione
exports.register = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Compila tutti i campi richiesti." });
  }

  // Risposta temporanea di successo
  return res.status(201).json({ message: "Registrazione avvenuta con successo!" });
};

// Gestione del login
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Inserisci email e password." });
  }

  // Risposta temporanea di successo
  return res.status(200).json({ message: "Login effettuato con successo!" });
};