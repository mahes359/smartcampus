# SmartCampus Frontend - Vite Dev Server Launcher
$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $baseDir "frontend"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "         SMARTCAMPUS - FRONTEND UI LAUNCHER             " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

if (-not (Test-Path (Join-Path $frontendDir "node_modules"))) {
    Write-Host "Installing frontend dependencies first (npm install)..." -ForegroundColor Yellow
    Set-Location $frontendDir
    npm install
}

Write-Host "Starting Vite development server..." -ForegroundColor Green
Set-Location $frontendDir
npm run dev
