# Test NeuroFleetX Authentication
$headers = @{'Content-Type'='application/json'}

Write-Host "`n=== Testing NeuroFleetX Backend ===" -ForegroundColor Cyan

# Test 1: Register
Write-Host "`n1. Registering user..." -ForegroundColor Yellow
$registerBody = '{"email":"navaroj0923@gmail.com","password":"test123","fullName":"Navaro Test","gender":"Male","role":"FLEET_MANAGER"}'

try {
    $result = Invoke-RestMethod -Uri http://localhost:8081/api/auth/register -Method POST -Headers $headers -Body $registerBody
    Write-Host "✓ Registration successful: $($result.message)" -ForegroundColor Green
} catch {
    Write-Host "✓ User likely already exists" -ForegroundColor Yellow
}

# Test 2: Login
Write-Host "`n2. Testing login..." -ForegroundColor Yellow
$loginBody = '{"email":"navaroj0923@gmail.com","password":"test123","role":"FLEET_MANAGER"}'

try {
    $loginResult = Invoke-RestMethod -Uri http://localhost:8081/api/auth/login -Method POST -Headers $headers -Body $loginBody
    Write-Host "✓✓✓ LOGIN SUCCESSFUL! ✓✓✓" -ForegroundColor Green
    Write-Host "  Email: $($loginResult.email)" -ForegroundColor White
    Write-Host "  Role: $($loginResult.role)" -ForegroundColor White
    Write-Host "  Name: $($loginResult.fullName)" -ForegroundColor White
    Write-Host "  Token: $($loginResult.token.Substring(0,40))..." -ForegroundColor Gray
    Write-Host "`nYou can now try logging in from the browser!" -ForegroundColor Green
} catch {
    Write-Host "✗ Login failed" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n" -NoNewline
