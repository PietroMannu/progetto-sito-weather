const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

// Variabili obbligatorie: se manca una, il servizio non parte
const requiredVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "JWT_SECRET",
  "SESSION_SECRET",
];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`La variabile ${key} non è definita nel file .env`);
    process.exit(1);
  }
});

module.exports = {
  AUTH_PORT: parseInt(process.env.AUTH_PORT || "3001", 10),
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:4000/api/v1/",
  PERSISTENCE_URL: process.env.PERSISTENCE_URL || "http://localhost:5001",
};
