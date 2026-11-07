<#
.SYNOPSIS
    Legion Theme Auto-Setup Helper
#>

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   ⚡ Legion Battlestation Setup Helper    " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$docsPath = [Environment]::GetFolderPath("MyDocuments")
$rainmeterSkins = Join-Path $docsPath "Rainmeter\Skins"

Write-Host "[*] Checking Rainmeter skins directory..." -ForegroundColor Yellow
if (-not (Test-Path $rainmeterSkins)) {
    Write-Host "[!] Rainmeter Skins folder not found. Please install Rainmeter first from https://www.rainmeter.net" -ForegroundColor Red
} else {
    Write-Host "[+] Rainmeter directory located at: $rainmeterSkins" -ForegroundColor Green
}

Write-Host "`n[*] Setup check complete. Follow the instructions in INSTALL.md to finish your setup!" -ForegroundColor Green
