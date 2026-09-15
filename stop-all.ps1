# SmartCampus - Graceful Service Shutdown Script
Write-Host "Stopping all running Java (Spring Boot) and Node (Vite) processes..." -ForegroundColor Yellow

# Kill running java processes related to smartcampus
$javaProcesses = Get-Process java -ErrorAction SilentlyContinue
if ($javaProcesses) {
    Write-Host "Terminating $($javaProcesses.Count) Java backend process(es)..." -ForegroundColor Cyan
    Stop-Process -Name java -Force -ErrorAction SilentlyContinue
}

# Kill running vite/node dev processes if needed
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Terminating Node/Vite process(es)..." -ForegroundColor Cyan
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
}

Write-Host "All SmartCampus processes stopped." -ForegroundColor Green
