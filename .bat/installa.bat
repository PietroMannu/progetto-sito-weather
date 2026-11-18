@echo off
REM Autorisoluzione del percorso (funziona sia nella radice che dentro la cartella .bat)
cd /d "%~dp0"
if exist "..\backend" cd ..

set "ROOT_DIR=%CD%"

echo ========================================
echo    INSTALLAZIONE SERVICE
echo ========================================
cd /d "%ROOT_DIR%\backend\service"
call npm install -y

echo.
echo ========================================
echo    INSTALLAZIONE GATEWAY
echo ========================================
cd /d "%ROOT_DIR%\backend\gateway"
call npm install -y
call npm install dotenv
call npm install http-proxy-middleware

echo.
echo ========================================
echo    INSTALLAZIONE AUTH-SERVICE
echo ========================================
cd /d "%ROOT_DIR%\backend\auth-service"
call npm install -y
call npm install express axios dotenv passport passport-google-oauth20 express-session jsonwebtoken

echo.
echo ========================================
echo    INSTALLAZIONE PERSISTANCE-SERVICE
echo ========================================
cd /d "%ROOT_DIR%\backend\persistance-service"
if not exist package.json call npm init -y
call npm install -y
call npm install express dotenv mongoose jsonwebtoken cookie-parser

echo.
echo ========================================
echo    INSTALLAZIONE COMPLETATA!
echo ========================================
pause