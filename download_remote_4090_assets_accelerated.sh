#!/usr/bin/env bash
set -euo pipefail

ROOT="/data/light/repro/physx_omni_2605_21572"
HF_BIN="${HF_BIN:-$HOME/.local/bin/hf}"
HF_ENDPOINT_VALUE="${HF_ENDPOINT_VALUE:-https://hf-mirror.com}"

export PATH="$HOME/.local/bin:$PATH"
export HF_ENDPOINT="$HF_ENDPOINT_VALUE"
export HF_HOME="/data/light/hf_cache"
export HF_XET_CACHE="/data/light/hf_cache/xet"

mkdir -p "$ROOT"/{paper,web,code,hf,logs} "$ROOT/hf/PhysX-Omni-model" "$ROOT/hf/PhysXVerse-dataset" "$HF_HOME" "$HF_XET_CACHE"

LOG="$ROOT/logs/download_accelerated.log"
STATUS="$ROOT/logs/download_accelerated_status.json"
URLS="$ROOT/logs/aria2_urls.txt"

write_status() {
  local stage="$1"
  local state="$2"
  local message="$3"
  cat > "$STATUS" <<JSON
{"timestamp":"$(date -Is)","stage":"$stage","state":"$state","message":"$message","root":"$ROOT","hf_endpoint":"$HF_ENDPOINT"}
JSON
}

run_logged() {
  local stage="$1"
  shift
  write_status "$stage" "running" "$*"
  {
    echo "[$(date -Is)] START $stage"
    echo "COMMAND: $*"
    "$@"
    echo "[$(date -Is)] DONE $stage"
  } >> "$LOG" 2>&1
}

write_status "init" "running" "starting accelerated download"
echo "[$(date -Is)] PhysX-Omni accelerated asset download started" >> "$LOG"

run_logged "paper_pdf" curl -L --retry 5 --connect-timeout 30 -o "$ROOT/paper/2605.21572v1.pdf" "https://arxiv.org/pdf/2605.21572v1"
run_logged "paper_html" curl -L --retry 5 --connect-timeout 30 -o "$ROOT/paper/2605.21572v1.html" "https://arxiv.org/html/2605.21572v1"
run_logged "project_page" curl -L --retry 5 --connect-timeout 30 -o "$ROOT/web/project-page.html" "https://physx-omni.github.io/"

if [ -d "$ROOT/code/PhysX-Omni/.git" ]; then
  run_logged "code_update" git -C "$ROOT/code/PhysX-Omni" pull --ff-only
else
  run_logged "code_clone" git clone --recurse-submodules "https://github.com/physx-omni/PhysX-Omni.git" "$ROOT/code/PhysX-Omni"
fi

run_logged "hf_version" "$HF_BIN" version

run_logged "model_small_files" "$HF_BIN" download "PhysX-Omni/PhysX-Omni" \
  --local-dir "$ROOT/hf/PhysX-Omni-model" \
  --exclude "*.safetensors" \
  --max-workers 8

run_logged "dataset_small_files" "$HF_BIN" download "PhysX-Omni/PhysXVerse" \
  --type dataset \
  --local-dir "$ROOT/hf/PhysXVerse-dataset" \
  --exclude "PhysXVerse.zip.part_*" \
  --max-workers 8

cat > "$URLS" <<EOF_URLS
https://hf-mirror.com/PhysX-Omni/PhysX-Omni/resolve/main/model-00001-of-00004.safetensors
  dir=$ROOT/hf/PhysX-Omni-model
  out=model-00001-of-00004.safetensors
https://hf-mirror.com/PhysX-Omni/PhysX-Omni/resolve/main/model-00002-of-00004.safetensors
  dir=$ROOT/hf/PhysX-Omni-model
  out=model-00002-of-00004.safetensors
https://hf-mirror.com/PhysX-Omni/PhysX-Omni/resolve/main/model-00003-of-00004.safetensors
  dir=$ROOT/hf/PhysX-Omni-model
  out=model-00003-of-00004.safetensors
https://hf-mirror.com/PhysX-Omni/PhysX-Omni/resolve/main/model-00004-of-00004.safetensors
  dir=$ROOT/hf/PhysX-Omni-model
  out=model-00004-of-00004.safetensors
https://hf-mirror.com/datasets/PhysX-Omni/PhysXVerse/resolve/main/PhysXVerse.zip.part_aa
  dir=$ROOT/hf/PhysXVerse-dataset
  out=PhysXVerse.zip.part_aa
https://hf-mirror.com/datasets/PhysX-Omni/PhysXVerse/resolve/main/PhysXVerse.zip.part_ab
  dir=$ROOT/hf/PhysXVerse-dataset
  out=PhysXVerse.zip.part_ab
https://hf-mirror.com/datasets/PhysX-Omni/PhysXVerse/resolve/main/PhysXVerse.zip.part_ac
  dir=$ROOT/hf/PhysXVerse-dataset
  out=PhysXVerse.zip.part_ac
EOF_URLS

write_status "aria2_large_files" "running" "aria2c large model and dataset files"
{
  echo "[$(date -Is)] START aria2_large_files"
  aria2c \
    --input-file="$URLS" \
    --continue=true \
    --max-concurrent-downloads=4 \
    --max-connection-per-server=16 \
    --split=16 \
    --min-split-size=1M \
    --file-allocation=none \
    --allow-overwrite=true \
    --auto-file-renaming=false \
    --retry-wait=10 \
    --max-tries=0 \
    --timeout=60 \
    --connect-timeout=30 \
    --summary-interval=30 \
    --console-log-level=notice \
    --log="$ROOT/logs/aria2_large_files.log" \
    --log-level=notice
  echo "[$(date -Is)] DONE aria2_large_files"
} >> "$LOG" 2>&1

write_status "all" "completed" "all assets downloaded"
echo "[$(date -Is)] PhysX-Omni accelerated asset download completed" >> "$LOG"
