$ErrorActionPreference = "Stop"
& (Join-Path $PSScriptRoot "run.ps1") -Provider demo -SkipInstall -SkipModelPull
