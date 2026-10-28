@echo off
REM Mettere questo file nella cartella principale del progetto (accanto a "backend")

echo ===== SERVICE =====
cd /d "%~dp0backend\service" || (echo Cartella service non trovata & pause & exit /b 1)
if not exist package.json call npm init -y
call npm install express dotenv

echo.
echo ===== GATEWAY =====
cd /d "%~dp0backend\gateway" || (echo Cartella gateway non trovata & pause & exit /b 1)
if not exist package.json call npm init -y
call npm install express dotenv http-proxy-middleware

echo.
echo Installazione completata.
pause
