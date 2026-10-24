const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware"); //definizione reverse proxy
const config = require("../config/env");

const app = express();

// Proxy verso il service
// quello che si ottiene qui è l'api versioning + endpoint hiding -> convenzione google, paypal, github microsoft ecc
// significa che l'utente vada a digita per servizio /api/v1/ (es: /api/v1/weather per accedere al weather service)
// in realta la parte finale è estratta dal servizio proxy per il pathRewrite ed il service vede solo /weather
// significa nascondere gli endpoint all'utente con l'introduzione di elementi non facilmente risalibili
// vanno cambiati anche endpoint della pagina statica .nav che ridefinisce i percorsi nascosti e nel file
// weather.js che costituisce il dom js ///// va infine modificato il post togliendo l'action per delegare l'azione di redirect al gateway

/*quindi questi per esempio sono quelli veri del service: http://localhost:3000/signin,
questi quelli mascherati: http://localhost:4000/api/v1/signin*/


app.use("/api/v1/auth", createProxyMiddleware({
    target: config.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathWrite: {
            "^/api/v1/auth": ""
    }

}));

app.use("/api/v1", createProxyMiddleware({ //tutte le richieste api vengono gestite qui
    target: config.SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        "^/api/v1": ""
    }
}));

app.listen(config.GATEWAY_PORT, () => {
    console.log(`Gateway attivo su http://localhost:${config.GATEWAY_PORT}/api/v1`);
});
