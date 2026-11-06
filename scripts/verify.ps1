$ErrorActionPreference = 'Stop'

$flutterBin = 'C:\src\flutter\bin'
$gitBin = 'C:\Program Files\Git\cmd'
$nodeBin = 'C:\Program Files\nodejs'
$env:Path = "$flutterBin;$gitBin;$nodeBin;$env:Path"

Write-Host 'Checking Flutter frontend...' -ForegroundColor Cyan
Push-Location (Join-Path $PSScriptRoot '..\apps\flutter_app')
flutter pub get
flutter analyze
flutter test
Pop-Location

Write-Host 'Checking backend...' -ForegroundColor Cyan
Push-Location (Join-Path $PSScriptRoot '..\backend')
npm run typecheck
npm test
Pop-Location

Write-Host 'PSyncQ validation passed.' -ForegroundColor Green
