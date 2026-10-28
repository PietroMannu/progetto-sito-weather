@echo off
REM Mettere questo file nella cartella principale del progetto (accanto a "backend")
REM Ogni servizio si apre in una sua finestra di terminale.

start "Service (3000)" cmd /k "cd /d %~dp0backend\service && node src\server.js"
start "Gateway (4000)" cmd /k "cd /d %~dp0backend\gateway && node src\gateway.js"

REM Servizio FBI (Python): serve per la pagina "FBI Wanted". Cancella la riga se non ti serve.
start "Wanted (3002)" cmd /k "cd /d %~dp0backend\wanted-service && python server.py"

REM Auth-service: ancora incompleto, attivalo togliendo REM quando sarà pronto.
REM start "Auth (3001)" cmd /k "cd /d %~dp0backend\auth-service && node src\authserver.js"

echo Servizi avviati. Apri http://localhost:4000/api/v1/wanted/
