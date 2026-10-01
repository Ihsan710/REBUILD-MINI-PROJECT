# ReBuild Circular Construction Platform - PowerShell Launcher
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "========================================================" -ForegroundColor Green
Write-Host "Starting ReBuild Platform Services..." -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green

Write-Host "[1/3] Launching AI Inference Server (Port 5001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\ai_training'; python inference_server.py"

Start-Sleep -Seconds 2

Write-Host "[2/3] Launching Node.js REST API (Port 8000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\backend'; npm start"

Start-Sleep -Seconds 2

Write-Host "[3/3] Launching Angular Frontend (Port 4200)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\frontend'; npm start"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "All 3 services have been launched in separate windows!" -ForegroundColor Green
Write-Host "  • Frontend App:   http://localhost:4200" -ForegroundColor Yellow
Write-Host "  • Backend API:    http://localhost:8000" -ForegroundColor Yellow
Write-Host "  • AI Inference:   http://127.0.0.1:5001" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Green
Write-Host "Wait a few seconds for Angular to finish compiling, then open http://localhost:4200 in your browser." -ForegroundColor White
