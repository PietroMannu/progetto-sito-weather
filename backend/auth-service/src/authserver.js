const express = require("express");
const { AUTH_PORT } = require("../config/env");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

app.use("/", authRoutes);

app.listen(AUTH_PORT, () => {
    console.log(`Auth Service avviato sulla porta ${AUTH_PORT}`);
});