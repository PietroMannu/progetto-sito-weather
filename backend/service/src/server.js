const express = require("express");
const path = require("path");

// Importazione delle routes
const pageRoutes = require("./routes/pageroute");
const weatherRoutes = require("./routes/weather");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware nativi di Express per leggere i dati inviati dal client
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Percorso per i file statici (Frontend)
const publicPath = path.join(__dirname, "../../../frontend/public");
app.use(express.static(publicPath));

// Registrazione delle rotte
app.use("/", pageRoutes);
app.use("/", authRoutes);
app.use("/weather", weatherRoutes);

app.listen(PORT, () => {
  console.log(`Server attivo su http://localhost:${PORT}`);
});