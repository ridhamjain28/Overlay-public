# Overlay Windows installer bootstrap
$ErrorActionPreference = 'Stop'
$ReleaseTag = 'v0.1.1'
$AssetName = 'Overlay-Setup-0.1.1.exe'
$DownloadUrl = "https://github.com/ridhamjain28/Overlay-public/releases/download/$ReleaseTag/$AssetName"
$OutPath = Join-Path $env:TEMP $AssetName

Write-Host 'Overlay installer'
Write-Host "Downloading $AssetName ..."
try {
  Invoke-WebRequest -Uri $DownloadUrl -OutFile $OutPath -UseBasicParsing
} catch {
  Write-Host "Download failed: $($_.Exception.Message)"
  Write-Host "Open https://github.com/ridhamjain28/Overlay-public/releases/tag/$ReleaseTag"
  exit 1
}

$bytes = (Get-Item $OutPath).Length
Write-Host ("Saved to {0} ({1:N1} MB)" -f $OutPath, ($bytes / 1MB))
Write-Host 'Starting the installer. SmartScreen may warn (unsigned) — More info, then Run anyway.'
Start-Process -FilePath $OutPath