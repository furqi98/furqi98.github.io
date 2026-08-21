# Compress a flight recording into a web-friendly clip.
#
# Only needed if you decide to host video files yourself instead of using
# YouTube. Requires ffmpeg on PATH:  winget install Gyan.FFmpeg
#
# Usage:
#   .\compress_video.ps1 -In "..\..\airsim scripts\survey_rag\survey_data\survey_flight.mp4" -Out "..\assets\video\survey.mp4"
#   .\compress_video.ps1 -In in.mp4 -Out out.mp4 -Seconds 45 -Start 00:01:30
#
# A 380 MB raw capture typically lands around 8-15 MB at 720p, which is
# fine to commit and serve from any static host.

param(
    [Parameter(Mandatory = $true)][string]$In,
    [Parameter(Mandatory = $true)][string]$Out,
    [int]$Seconds = 0,            # 0 = whole file
    [string]$Start = "00:00:00",  # trim start point
    [int]$Height = 720,           # output height; 1080 for more detail
    [int]$Crf = 28                # lower = better quality, bigger file (23-30 sensible)
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
    "-movflags", "+faststart",     # lets playback start before the full download
    "-an",                         # drop audio; sim captures have none worth keeping
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
