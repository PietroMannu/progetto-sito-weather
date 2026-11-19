const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { PORT, MONGO_URI, DB_NAME } = require("../config/env");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/", userRoutes);

// Prima mi collego al database, poi apro la porta
mongoose
    .connect(MONGO_URI, { dbName: DB_NAME })
    .then(() => {
        console.log(`Connesso a MongoDB, database "${DB_NAME}"`);
        app.listen(PORT, () => {
            console.log(`Persistance-service attivo su http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("Connessione a MongoDB fallita:", err.message);
        process.exit(1);
    });
