@echo off
REM Autorisoluzione del percorso (funziona sia nella radice che dentro la cartella .bat)
cd /d "%~dp0"
if exist "..\backend" cd ..

set "ROOT_DIR=%CD%"

echo ========================================
echo   AVVIO MICROSERVIZI BACKEND
echo ========================================

REM 1. Avvio SERVICE (Porta 3000)
echo [1/3] Avvio Service...
start "Service (3000)" cmd /k "cd /d "%ROOT_DIR%\backend\service" && node src\server.js"
timeout /t 2 /nobreak >nul

REM 2. Avvio GATEWAY (Porta 4000)
echo [2/3] Avvio Gateway...
start "Gateway (4000)" cmd /k "cd /d "%ROOT_DIR%\backend\gateway" && node src\gateway.js"
timeout /t 2 /nobreak >nul

REM 3. Avvio WANTED-SERVICE (Python - Porta 3002)
echo [3/3] Avvio Wanted-Service (Python)...
start "Wanted Service (3002)" cmd /k "cd /d "%ROOT_DIR%\backend\wanted-service" && python server.py"

echo.
echo Servizi avviati!
echo Apri nel browser: http://localhost:4000/api/v1/wanted/
echo.
pause