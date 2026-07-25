[CmdletBinding()]
param(
  [string]$RepoUrl = "https://github.com/Saroswat/axiom-engineering-intelligence.git",
  [string]$InstallDirectory = (Join-Path $PWD "axiom-engineering-intelligence"),
  [ValidateSet("demo", "ollama", "openai")]
  [string]$Provider = "ollama",
  [string]$Model = "qwen2.5-coder:7b"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    throw "Git is required. Install it from https://git-scm.com/download/win"
  }
  Write-Host "[Axiom] Installing Git" -ForegroundColor Cyan
  winget install --id Git.Git --exact --accept-package-agreements --accept-source-agreements
  $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
    [Environment]::GetEnvironmentVariable("Path", "User")
}

$resolvedParent = Split-Path -Parent $InstallDirectory
if (-not (Test-Path $resolvedParent)) {
  New-Item -ItemType Directory -Path $resolvedParent -Force | Out-Null
}

if (Test-Path $InstallDirectory) {
  if (-not (Test-Path (Join-Path $InstallDirectory ".git"))) {
    throw "The target directory already exists and is not a Git repository: $InstallDirectory"
  }
  Write-Host "[Axiom] Updating existing installation" -ForegroundColor Cyan
  git -C $InstallDirectory pull --ff-only
} else {
  Write-Host "[Axiom] Downloading Axiom" -ForegroundColor Cyan
  git clone $RepoUrl $InstallDirectory
}

& (Join-Path $InstallDirectory "scripts\run.ps1") -Provider $Provider -Model $Model
