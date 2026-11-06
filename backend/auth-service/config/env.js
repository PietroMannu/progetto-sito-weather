const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

module.exports = {
  AUTH_PORT: parseInt(process.env.AUTH_PORT || "3001"),
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || process.env.JWT_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:4000/api/v1/",
  SESSION_SECRET: process.env.SESSION_SECRET,
};
