# Script para configurar Quality Gates en SonarQube
param(
    [string]$SonarUrl = "http://localhost:9000",
    [string]$Token = "",
    [string]$ProjectKey = "parking-vulnerable-app"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configurador de Quality Gates" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ([string]::IsNullOrEmpty($Token)) {
    Write-Host "Por favor, ingresa tu token de SonarQube:" -ForegroundColor Yellow
    $Token = Read-Host "Token"
}

$headers = @{
    Authorization = "Bearer $Token"
}

$qualityGateName = "Parking-Security-Quality-Gate"

Write-Host "1. Verificando conexion con SonarQube..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$SonarUrl/api/system/status" -Method Get -Headers $headers
    Write-Host "   Conectado a SonarQube" -ForegroundColor Green
}
catch {
    Write-Host "   Error: No se puede conectar a SonarQube" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "2. Buscando Quality Gate existente..." -ForegroundColor Yellow
try {
    $existingGates = Invoke-RestMethod -Uri "$SonarUrl/api/qualitygates/list" -Method Get -Headers $headers
    $existingGate = $existingGates.qualitygates | Where-Object { $_.name -eq $qualityGateName }
    
    if ($existingGate) {
        Write-Host "   Quality Gate '$qualityGateName' ya existe (ID: $($existingGate.id))" -ForegroundColor Yellow
        $qualityGateId = $existingGate.id
    }
    else {
        Write-Host "   No existe, se creara uno nuevo" -ForegroundColor Green
        $qualityGateId = $null
    }
}
catch {
    Write-Host "   Error al buscar Quality Gates" -ForegroundColor Red
    exit 1
}

if (-not $qualityGateId) {
    Write-Host ""
    Write-Host "3. Creando nuevo Quality Gate..." -ForegroundColor Yellow
    try {
        $createResponse = Invoke-RestMethod -Uri "$SonarUrl/api/qualitygates/create?name=$qualityGateName" -Method Post -Headers $headers
        $qualityGateId = $createResponse.id
        Write-Host "   Quality Gate creado (ID: $qualityGateId)" -ForegroundColor Green
    }
    catch {
        Write-Host "   Error al crear Quality Gate" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "4. Configurando condiciones del Quality Gate..." -ForegroundColor Yellow

$conditions = @(
    @{ metric = "new_security_rating"; op = "GT"; error = "1" },
    @{ metric = "new_reliability_rating"; op = "GT"; error = "1" },
    @{ metric = "new_maintainability_rating"; op = "GT"; error = "1" },
    @{ metric = "new_coverage"; op = "LT"; error = "80" },
    @{ metric = "new_duplicated_lines_density"; op = "GT"; error = "3" },
    @{ metric = "new_security_hotspots_reviewed"; op = "LT"; error = "100" },
    @{ metric = "new_vulnerabilities"; op = "GT"; error = "0" },
    @{ metric = "new_bugs"; op = "GT"; error = "0" },
    @{ metric = "new_code_smells"; op = "GT"; error = "50" },
    @{ metric = "blocker_violations"; op = "GT"; error = "0" },
    @{ metric = "critical_violations"; op = "GT"; error = "0" }
)

$successCount = 0
$errorCount = 0

foreach ($condition in $conditions) {
    try {
        $body = @{
            gateId = $qualityGateId
            metric = $condition.metric
            op = $condition.op
            error = $condition.error
        }
        
        Invoke-RestMethod -Uri "$SonarUrl/api/qualitygates/create_condition" -Method Post -Headers $headers -Body $body | Out-Null
        Write-Host "   $($condition.metric)" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host "   Error: $($condition.metric)" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host ""
Write-Host "5. Asociando Quality Gate al proyecto..." -ForegroundColor Yellow
try {
    $body = @{
        projectKey = $ProjectKey
        gateName = $qualityGateName
    }
    Invoke-RestMethod -Uri "$SonarUrl/api/qualitygates/select" -Method Post -Headers $headers -Body $body | Out-Null
    Write-Host "   Quality Gate asociado al proyecto '$ProjectKey'" -ForegroundColor Green
}
catch {
    Write-Host "   Error al asociar Quality Gate" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CONFIGURACION COMPLETADA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Condiciones configuradas: $successCount" -ForegroundColor Green
if ($errorCount -gt 0) {
    Write-Host "Errores: $errorCount" -ForegroundColor Red
}
Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Yellow
Write-Host "1. Verifica en: $SonarUrl/quality_gates" -ForegroundColor White
Write-Host "2. Ejecuta analisis: .\run-sonar-scan.bat" -ForegroundColor White
Write-Host "3. Revisa resultados: $SonarUrl/dashboard?id=$ProjectKey" -ForegroundColor White
Write-Host ""
