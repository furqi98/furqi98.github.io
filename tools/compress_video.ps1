param(
    [Parameter(Mandatory = $true)][string]$In,
    [Parameter(Mandatory = $true)][string]$Out,
    [int]$Seconds = 0,
    [string]$Start = "00:00:00",
    [int]$Height = 720,
    [int]$Crf = 28
)

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Error "ffmpeg not found on PATH. Install it with: winget install Gyan.FFmpeg"
    exit 1
}

$outDir = Split-Path -Parent $Out
if ($outDir -and -not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

$args = @("-y", "-ss", $Start, "-i", $In)
if ($Seconds -gt 0) { $args += @("-t", "$Seconds") }
$args += @(
    "-vf", "scale=-2:$Height",
    "-c:v", "libx264", "-crf", "$Crf", "-preset", "slow",
    "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-an",
    $Out
)

Write-Host "Encoding -> $Out"
& ffmpeg @args

if ($LASTEXITCODE -eq 0) {
    $sizeIn  = [math]::Round((Get-Item $In).Length  / 1MB, 1)
    $sizeOut = [math]::Round((Get-Item $Out).Length / 1MB, 1)
    Write-Host ""
    Write-Host "Done.  $sizeIn MB  ->  $sizeOut MB" -ForegroundColor Green
    Write-Host "Also grab a poster frame:" -ForegroundColor DarkGray
    Write-Host "  ffmpeg -ss 5 -i `"$Out`" -frames:v 1 -q:v 3 poster.jpg" -ForegroundColor DarkGray
}
