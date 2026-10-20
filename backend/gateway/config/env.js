require("dotenv").config();

module.exports = {
    SERVICE_URL: process.env.SERVICE_URL || "http://localhost:3000",
    GATEWAY_PORT: parseInt(process.env.GATEWAY_PORT || "4000", 10)
};
//In questo caso il file serve solo per gestire comodamente il numero di porta del gateway, fuori dal codice del server
//qui env non è necessario, si può mettere come non farlo
