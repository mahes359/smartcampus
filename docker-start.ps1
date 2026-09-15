# SmartCampus - Docker Startup Script
Param (
    [switch]$All,
    [switch]$Core,
    [switch]$Tools,
    [switch]$Build
)

# Ensure Docker is in PATH
$userPath = [System.Environment]::GetEnvironmentVariable("Path","User")
$machinePath = [System.Environment]::GetEnvironmentVariable("Path","Machine")
$env:Path = "$machinePath;$userPath"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       SMARTCAMPUS - DOCKER ECOSYSTEM LAUNCHER          " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

# Check if Docker is responding
$dockerTest = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker is not running. Please open Docker Desktop first." -ForegroundColor Red
    exit 1
}

$profiles = @()
if ($All) {
    Write-Host "Mode: FULL CAMPUS STACK (PostgreSQL + 22 Microservices + Frontend)" -ForegroundColor Green
    $profiles += "--profile all"
} else {
    Write-Host "Mode: CORE STACK (PostgreSQL + Eureka + Gateway + Auth + College + Frontend)" -ForegroundColor Green
    $profiles += "--profile core"
}

if ($Tools) {
    Write-Host "Enabling Tools (pgAdmin on port 5050)..." -ForegroundColor Yellow
    $profiles += "--profile tools"
}

$buildFlag = ""
if ($Build) {
    $buildFlag = "--build"
}

$cmd = "docker compose $($profiles -join ' ') up -d $buildFlag"
Write-Host "Executing: $cmd`n" -ForegroundColor DarkGray
Invoke-Expression $cmd

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "  Web Application:   http://localhost:5173" -ForegroundColor Yellow
Write-Host "  API Gateway:       http://localhost:8080" -ForegroundColor Yellow
Write-Host "  Eureka Registry:   http://localhost:8761" -ForegroundColor Yellow
if ($Tools) {
    Write-Host "  pgAdmin Web GUI:   http://localhost:5050 (admin@smartcampus.edu / admin)" -ForegroundColor Yellow
}
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "All containers started in background. Use 'docker compose ps' to check status." -ForegroundColor Green
