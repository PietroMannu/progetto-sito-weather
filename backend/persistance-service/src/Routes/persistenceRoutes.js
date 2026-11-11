const express = require("express");
const env = require("../../config/env");
const router = express.Router();


router .get('/api/data', (req, res) => {
  res.json({
    service: "PersistenceService",
    status: "ok",
    timestamp: new Date().toISOString(),
    payload: {
      message: "Dati recuperati con successo dal database di persistenza!",
      totalRecords: 12,
      database: "connected"
    }
  });
});

module.exports = router;