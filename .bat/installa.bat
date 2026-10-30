@echo off
REM Autorisoluzione del percorso (funziona sia nella radice che dentro la cartella .bat)
cd /d "%~dp0"
if exist "..\backend" cd ..

set "ROOT_DIR=%CD%"

echo ========================================
echo   INSTALLAZIONE SERVICE
echo ========================================
cd /d "%ROOT_DIR%\backend\service"
call npm install -y

echo.
echo ========================================
echo   INSTALLAZIONE GATEWAY
echo ========================================
cd /d "%ROOT_DIR%\backend\gateway"
call npm install -y
call npm install dotenv
call npm install http-proxy-middleware

echo.
echo ========================================
echo   INSTALLAZIONE COMPLETATA!
echo ========================================
pause