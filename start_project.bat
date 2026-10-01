@echo off
title ReBuild Circular Construction Platform Launcher
echo ========================================================
echo Starting ReBuild Platform Services...
echo ========================================================
echo.

echo [1/3] Launching AI Computer Vision Model Server (Port 5001)...
start "ReBuild - AI Inference Server (Port 5001)" cmd /k "cd /d "%~dp0ai_training" && python inference_server.py"

timeout /t 2 /nobreak >nul

echo [2/3] Launching Node.js REST API Backend (Port 8000)...
start "ReBuild - Backend REST API (Port 8000)" cmd /k "cd /d "%~dp0backend" && npm start"

timeout /t 2 /nobreak >nul

echo [3/3] Launching Angular Frontend Dev Server (Port 4200)...
start "ReBuild - Frontend Web App (Port 4200)" cmd /k "cd /d "%~dp0frontend" && npm start"

echo.
echo ========================================================
echo All 3 services have been launched in separate windows!
echo - Frontend App:   http://localhost:4200
echo - Backend API:    http://localhost:8000
echo - AI Inference:   http://127.0.0.1:5001
echo ========================================================
echo Once the Angular server finishes compiling, open:
echo   http://localhost:4200
echo.
pause
