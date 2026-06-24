$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$hf = "C:\Users\robot\AppData\Local\Programs\Python\Python312\Scripts\hf.exe"
$logs = Join-Path $root "logs"
$modelDir = Join-Path $root "hf\PhysX-Omni-model"
$datasetDir = Join-Path $root "hf\PhysXVerse-dataset"
$statusPath = Join-Path $logs "hf_download_status.json"
$logPath = Join-Path $logs "hf_download.log"

New-Item -ItemType Directory -Force -Path $logs, $modelDir, $datasetDir | Out-Null

function Write-Status {
    param(
        [string] $Stage,
        [string] $State,
        [string] $Message
    )
    $payload = [ordered]@{
        timestamp = (Get-Date).ToString("o")
        stage = $Stage
        state = $State
        message = $Message
        model_dir = $modelDir
        dataset_dir = $datasetDir
    }
    $payload | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $statusPath -Encoding UTF8
}

function Invoke-HfDownload {
    param(
        [string] $Repo,
        [string] $RepoType,
        [string] $LocalDir,
        [string] $Stage
    )
    Write-Status -Stage $Stage -State "running" -Message "Downloading $Repo"
    "[$((Get-Date).ToString("o"))] START $Stage $Repo" | Add-Content -LiteralPath $logPath -Encoding UTF8
    if ($RepoType -eq "model") {
        & $hf download $Repo --local-dir $LocalDir --max-workers 8 2>&1 | Add-Content -LiteralPath $logPath -Encoding UTF8
    } else {
        & $hf download $Repo --type $RepoType --local-dir $LocalDir --max-workers 8 2>&1 | Add-Content -LiteralPath $logPath -Encoding UTF8
    }
    if ($LASTEXITCODE -ne 0) {
        throw "hf download failed for $Repo with exit code $LASTEXITCODE"
    }
    "[$((Get-Date).ToString("o"))] DONE $Stage $Repo" | Add-Content -LiteralPath $logPath -Encoding UTF8
    Write-Status -Stage $Stage -State "completed" -Message "Downloaded $Repo"
}

try {
    Write-Status -Stage "init" -State "running" -Message "Starting Hugging Face asset downloads"
    Invoke-HfDownload -Repo "PhysX-Omni/PhysX-Omni" -RepoType "model" -LocalDir $modelDir -Stage "model"
    Invoke-HfDownload -Repo "PhysX-Omni/PhysXVerse" -RepoType "dataset" -LocalDir $datasetDir -Stage "dataset"
    Write-Status -Stage "all" -State "completed" -Message "All Hugging Face assets downloaded"
    exit 0
} catch {
    $message = $_.Exception.Message
    "[$((Get-Date).ToString("o"))] ERROR $message" | Add-Content -LiteralPath $logPath -Encoding UTF8
    Write-Status -Stage "error" -State "failed" -Message $message
    exit 1
}
