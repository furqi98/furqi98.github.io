# Publish this site to GitHub Pages as https://<username>.github.io
#
#   .\deploy.ps1 -User yourgithubusername
#
# First run: creates the repo on GitHub (if gh is installed), pushes, and
# turns Pages on. Later runs: commits any changes and pushes them.
#
# Requires git. The GitHub CLI (gh) is optional but does the repo creation
# and Pages setup for you — install with:  winget install GitHub.cli

param(
    [Parameter(Mandatory = $true)][string]$User,
    [string]$Message = "Update site"
)

# Not "Stop": native commands write probes to stderr, which under Stop become
# terminating errors in Windows PowerShell 5.1. Exit codes are checked instead.
$ErrorActionPreference = "Continue"
Set-Location $PSScriptRoot

$repo = "$User.github.io"
$url  = "https://github.com/$User/$repo.git"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "git not found. Install it with: winget install Git.Git"
    exit 1
}

if (-not (Test-Path ".git")) { git init -q }

# Make sure we are on main
$branch = git rev-parse --abbrev-ref HEAD 2>$null
if ($branch -ne "main") { git branch -M main }

git add -A
$staged = git diff --cached --name-only
if ($staged) {
    git commit -q -m $Message
    Write-Host "Committed: $Message" -ForegroundColor Green
} else {
    Write-Host "No changes to commit." -ForegroundColor DarkGray
}

# Point at the right remote
$existing = git remote get-url origin 2>$null
if (-not $existing) {
    git remote add origin $url
} elseif ($existing -ne $url) {
    git remote set-url origin $url
}

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    $env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" +
                [Environment]::GetEnvironmentVariable("Path","User")
    $fallback = "C:\Program Files\GitHub CLI"
    if (Test-Path "$fallback\gh.exe") { $env:Path = "$fallback;$env:Path" }
}
$gh = Get-Command gh -ErrorAction SilentlyContinue

# Create the repo if it does not exist yet
if ($gh) {
    gh repo view "$User/$repo" --json name | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Creating github.com/$User/$repo ..." -ForegroundColor Cyan
        gh repo create "$User/$repo" --public --source=. --remote=origin --push
        Write-Host "Enabling GitHub Pages ..." -ForegroundColor Cyan
        try {
            gh api -X POST "repos/$User/$repo/pages" -f "source[branch]=main" -f "source[path]=/" | Out-Null
        } catch {
            Write-Host "  (Pages may already be on, or needs enabling in Settings > Pages)" -ForegroundColor DarkYellow
        }
        Write-Host ""
        Write-Host "Live shortly at https://$User.github.io" -ForegroundColor Green
        exit 0
    }
}

Write-Host "Pushing to $url ..." -ForegroundColor Cyan
git push -u origin main

Write-Host ""
Write-Host "Pushed. Live at https://$User.github.io" -ForegroundColor Green
if (-not $gh) {
    Write-Host ""
    Write-Host "If this is the first push, turn Pages on once:" -ForegroundColor Yellow
    Write-Host "  github.com/$User/$repo  ->  Settings  ->  Pages" -ForegroundColor Yellow
    Write-Host "  Source: Deploy from a branch  |  Branch: main  |  Folder: / (root)  ->  Save" -ForegroundColor Yellow
}
