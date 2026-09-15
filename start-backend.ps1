# SmartCampus Microservices - Backend Startup Script
Param (
    [switch]$All,
    [switch]$Core
)

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $baseDir "backend"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "     SMARTCAMPUS - BACKEND MICROSERVICES LAUNCHER      " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

# Check if PostgreSQL is accessible
Write-Host "[1/4] Checking Database Connectivity..." -ForegroundColor Green
$pgTest = Test-NetConnection -ComputerName localhost -Port 5432 -WarningAction SilentlyContinue
if ($pgTest.TcpTestSucceeded) {
    Write-Host " -> PostgreSQL is active on port 5432." -ForegroundColor Green
} else {
    Write-Host " -> WARNING: PostgreSQL is not responding on port 5432." -ForegroundColor Yellow
    Write-Host "    Make sure PostgreSQL service is running before starting database services." -ForegroundColor Yellow
}

# Define Services
$coreServices = @(
    @{ Name = "eureka-server";   Port = 8761; Delay = 8 },
    @{ Name = "api-gateway";     Port = 8080; Delay = 5 },
    @{ Name = "auth-service";    Port = 8090; Delay = 3 },
    @{ Name = "college-service"; Port = 8091; Delay = 3 }
)

$domainServices = @(
    @{ Name = "student-service";      Port = 8092; Delay = 2 },
    @{ Name = "faculty-service";      Port = 8093; Delay = 2 },
    @{ Name = "course-service";       Port = 8094; Delay = 2 },
    @{ Name = "enrollment-service";   Port = 8095; Delay = 2 },
    @{ Name = "attendance-service";   Port = 8096; Delay = 2 },
    @{ Name = "exam-service";         Port = 8097; Delay = 2 },
    @{ Name = "timetable-service";    Port = 8098; Delay = 2 },
    @{ Name = "fee-service";          Port = 8099; Delay = 2 },
    @{ Name = "library-service";      Port = 8100; Delay = 2 },
    @{ Name = "hostel-service";       Port = 8101; Delay = 2 },
    @{ Name = "transport-service";    Port = 8102; Delay = 2 },
    @{ Name = "leave-service";        Port = 8103; Delay = 2 },
    @{ Name = "placement-service";    Port = 8104; Delay = 2 },
    @{ Name = "event-service";        Port = 8105; Delay = 2 },
    @{ Name = "notification-service"; Port = 8106; Delay = 2 },
    @{ Name = "document-service";     Port = 8107; Delay = 2 },
    @{ Name = "helpdesk-service";     Port = 8108; Delay = 2 },
    @{ Name = "report-service";       Port = 8109; Delay = 2 }
)

$launchList = $coreServices
if ($All -or (-not $Core)) {
    $launchList += $domainServices
}

Write-Host "`n[2/4] Starting Microservices in proper order..." -ForegroundColor Green

foreach ($svc in $launchList) {
    $svcPath = Join-Path $backendDir $svc.Name
    if (Test-Path $svcPath) {
        Write-Host " -> Launching $($svc.Name) on port $($svc.Port)..." -ForegroundColor Cyan
        $startCmd = "Set-Location '$svcPath'; Write-Host 'Starting $($svc.Name) on port $($svc.Port)...' -ForegroundColor Cyan; mvn spring-boot:run"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", $startCmd
        Start-Sleep -Seconds $svc.Delay
    } else {
        Write-Host " -> Directory not found: $svcPath" -ForegroundColor Red
    }
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " Eureka Dashboard: http://localhost:8761" -ForegroundColor Yellow
Write-Host " API Gateway:      http://localhost:8080" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "All backend services initiated in individual terminal windows." -ForegroundColor Green
