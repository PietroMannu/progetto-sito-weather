const express = require("express");
const path = require("path");
const pageRoutes = require("./routes/pageroute");
const weatherRoutes = require("./routes/weather");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware per leggere il JSON dalle richieste POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PERCORSO FILE STATICI CORRETTO:
// Da backend/service/src risaliamo di 3 livelli (../../../) fino alla radice e poi entriamo in frontend/public
const publicPath = path.join(__dirname, "../../../frontend/public");
app.use(express.static(publicPath));

// Registrazione delle rotte
app.use("/", pageRoutes);
app.use("/weather", weatherRoutes);

app.listen(PORT, () => {
    console.log(`Server attivo su http://localhost:${PORT}`);
});