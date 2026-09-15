# SmartCampus - Docker Shutdown Script

$userPath = [System.Environment]::GetEnvironmentVariable("Path","User")
$machinePath = [System.Environment]::GetEnvironmentVariable("Path","Machine")
$env:Path = "$machinePath;$userPath"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       SMARTCAMPUS - STOPPING DOCKER CONTAINERS         " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

docker compose --profile all --profile core --profile tools down

Write-Host "`nAll SmartCampus containers stopped. Database data is preserved in 'postgres_data' volume." -ForegroundColor Green
