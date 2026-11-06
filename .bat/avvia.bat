@echo off
REM Autorisoluzione del percorso
cd /d "%~dp0"
if exist "..\backend" cd ..

set "ROOT_DIR=%CD%"

echo ========================================
echo    AVVIO MICROSERVIZI BACKEND
echo ========================================

REM -------------------------------------------------------
REM RILEVAMENTO PYTHON (Percorso individuato da VS Code)
REM -------------------------------------------------------
set "PYTHON_EXE="

REM 1. Cerca l'ambiente virtuale nella radice del progetto (.venv o venv)
if exist "%ROOT_DIR%\.venv\Scripts\python.exe" (
    set "PYTHON_EXE=%ROOT_DIR%\.venv\Scripts\python.exe"
) else if exist "%ROOT_DIR%\venv\Scripts\python.exe" (
    set "PYTHON_EXE=%ROOT_DIR%\venv\Scripts\python.exe"
) else if exist "%ROOT_DIR%\backend\wanted-service\.venv\Scripts\python.exe" (
    set "PYTHON_EXE=%ROOT_DIR%\backend\wanted-service\.venv\Scripts\python.exe"
)

REM 2. Fallback su installazioni globali utente se .venv non viene trovato
if not defined PYTHON_EXE (
    for /d %%d in ("%LOCALAPPDATA%\Programs\Python\Python*") do (
        if exist "%%d\python.exe" set "PYTHON_EXE=%%d\python.exe"
    )
)

REM 1. Avvio SERVICE (Porta 3000)
echo [1/4] Avvio Service...
start /B cmd /c "cd /d "%ROOT_DIR%\backend\service" && node src\server.js"
timeout /t 2 /nobreak >nul

REM 2. Avvio AUTH-SERVICE (Porta 3001)
echo [2/4] Avvio Auth-Service...
start /B cmd /c "cd /d "%ROOT_DIR%\backend\auth-service" && node src\authserver.js"
timeout /t 2 /nobreak >nul

REM 3. Avvio WANTED-SERVICE (Python - Porta 3002)
echo [3/4] Avvio Wanted-Service (Python)...
if defined PYTHON_EXE (
    start /B cmd /c "cd /d "%ROOT_DIR%\backend\wanted-service" && "%PYTHON_EXE%" server.py"
) else (
    echo [ERRORE] Impossibile trovare l'interprete Python in .venv!
)
timeout /t 2 /nobreak >nul

REM 4. Avvio GATEWAY (Porta 4000)
echo [4/4] Avvio Gateway...
start /B cmd /c "cd /d "%ROOT_DIR%\backend\gateway" && node src\gateway.js"
timeout /t 2 /nobreak >nul

echo.
echo Servizi avviati in background!
echo Apertura del browser in corso...
echo.

start http://localhost:4000/api/v1/wanted/

pause