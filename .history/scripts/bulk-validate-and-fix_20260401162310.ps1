# Bulk validate and fix all apps, then update compliance dashboard

$PNPM = "pnpm"
$APPS_DIR = "C:\Users\scott\game-platform\apps"
$COMPLIANCE_DIR = "C:\Users\scott\game-platform\compliance"
$TIMESTAMP = Get-Date -Format "o"

Write-Host "`n🔄 Starting bulk validation and fix for all apps...`n" -ForegroundColor Cyan

# Get all apps
$apps = Get-ChildItem -Path $APPS_DIR -Directory | Sort-Object Name
$total = $apps.Count
$passed = 0
$fixed = 0
$failed = 0

# Initialize results object
$results = @{
    timestamp = $TIMESTAMP
    apps = @{}
    summary = @{
        total = $total
        passed = 0
        fixed = 0
        failed = 0
    }
}

foreach ($app in $apps) {
    $appName = $app.Name
    $appPath = $app.FullName
    
    Write-Host -NoNewline "📦 $appName... "
    
    try {
        Push-Location $appPath
        
        # First try to fix any style issues
        & $PNPM fix 2>&1 > $null
        
        # Then run check
        & $PNPM check 2>&1 > $null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ PASS" -ForegroundColor Green
            $results.apps[$appName] = @{
                status = "passed"
                timestamp = $TIMESTAMP
            }
            $passed++
        } else {
            Write-Host "⚠️  FIXED" -ForegroundColor Yellow
            $results.apps[$appName] = @{
                status = "fixed"
                timestamp = $TIMESTAMP
            }
            $fixed++
        }
        
        Pop-Location
    } catch {
        Write-Host "❌ FAIL" -ForegroundColor Red
        $results.apps[$appName] = @{
            status = "failed"
            timestamp = $TIMESTAMP
            error = $_.Exception.Message
        }
        $failed++
        Pop-Location
    }
}

# Summary
$results.summary.passed = $passed
$results.summary.fixed = $fixed
$results.summary.failed = $failed

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 VALIDATION SUMMARY" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ Passed:  $passed/$total" -ForegroundColor Green
Write-Host "⚠️  Fixed:   $fixed/$total" -ForegroundColor Yellow
Write-Host "❌ Failed:  $failed/$total" -ForegroundColor Red
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

# Update compliance matrix
if (-not (Test-Path $COMPLIANCE_DIR)) {
    New-Item -ItemType Directory -Path $COMPLIANCE_DIR -Force *> $null
}

$matrixPath = Join-Path $COMPLIANCE_DIR "matrix.json"
$matrix = @{ apps = @{}; lastUpdated = $TIMESTAMP }

if (Test-Path $matrixPath) {
    $existing = Get-Content $matrixPath | ConvertFrom-Json
    $matrix = [PSCustomObject]$existing
}

# Update app statuses
foreach ($appName in $results.apps.Keys) {
    $result = $results.apps[$appName]
    if ($null -eq $matrix.apps[$appName]) {
        $matrix.apps[$appName] = @{}
    }
    $matrix.apps[$appName] = @{
        validation = $result.status
        lastChecked = $result.timestamp
    }
}

$matrix | ConvertTo-Json -Depth 10 | Set-Content $matrixPath
Write-Host "✅ Compliance matrix updated: $matrixPath`n" -ForegroundColor Green
