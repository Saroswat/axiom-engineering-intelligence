[CmdletBinding()]
param(
  [ValidateSet("demo", "ollama", "openai")]
  [string]$Provider = "ollama",
  [string]$Model = "qwen2.5-coder:7b",
  [int]$Port = 5173,
  [switch]$SkipInstall,
  [switch]$SkipModelPull
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot

function Write-Step([string]$Message) {
  Write-Host "`n[Axiom] $Message" -ForegroundColor Cyan
}

function Refresh-Path {
  $machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
  $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
  $env:Path = "$machinePath;$userPath"
}

Write-Host @"

     A X I O M
  Engineering Intelligence

"@ -ForegroundColor Blue

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
  if ($SkipInstall) {
    throw "Node.js 22 or newer is required. Install it from https://nodejs.org/"
  }
  $winget = Get-Command winget -ErrorAction SilentlyContinue
  if (-not $winget) {
    throw "Node.js is missing and winget is unavailable. Install Node.js 22+ from https://nodejs.org/"
  }
  Write-Step "Installing Node.js LTS"
  winget install --id OpenJS.NodeJS.LTS --exact --accept-package-agreements --accept-source-agreements
  Refresh-Path
}

$nodeMajor = [int]((& node --version).TrimStart("v").Split(".")[0])
if ($nodeMajor -lt 22) {
  throw "Axiom requires Node.js 22 or newer. Current version: $(& node --version)"
}

if ($Provider -eq "ollama") {
  $ollama = Get-Command ollama -ErrorAction SilentlyContinue
  if (-not $ollama) {
    if ($SkipInstall) {
      throw "Ollama is required for local AI. Install it from https://ollama.com/download/windows"
    }
    Write-Step "Installing Ollama for private, local AI"
    Invoke-RestMethod https://ollama.com/install.ps1 | Invoke-Expression
    Refresh-Path
    $ollama = Get-Command ollama -ErrorAction SilentlyContinue
    if (-not $ollama) {
      throw "Ollama installed but is not yet available. Open a new PowerShell window and run this script again."
    }
  }

  try {
    Invoke-RestMethod "http://127.0.0.1:11434/api/tags" -TimeoutSec 2 | Out-Null
  } catch {
    Write-Step "Starting the local AI service"
    Start-Process -FilePath $ollama.Source -ArgumentList "serve" -WindowStyle Hidden
    Start-Sleep -Seconds 3
  }

  if (-not $SkipModelPull) {
    Write-Step "Preparing local coding model: $Model"
    & ollama pull $Model
  }
}

$envLines = @(
  "AI_PROVIDER=$Provider",
  "OLLAMA_BASE_URL=http://127.0.0.1:11434",
  "OLLAMA_MODEL=$Model",
  "OPENAI_MODEL=gpt-5.6-sol"
)
Set-Content -LiteralPath ".env.local" -Value $envLines -Encoding utf8

if (-not (Test-Path "node_modules")) {
  Write-Step "Installing application dependencies"
  npm install --no-audit --no-fund
}

Write-Step "Starting Axiom at http://localhost:$Port"
Write-Host "Press Ctrl+C to stop.`n" -ForegroundColor DarkGray
npm run dev -- --host 127.0.0.1 --port $Port
