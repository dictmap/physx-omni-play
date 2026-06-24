#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.local/bin:$PATH"

ROOT="${PHYSX_OMNI_ROOT:-/data/light/repro/physx_omni_2605_21572}"
HF_BIN="${HF_BIN:-hf}"
export HF_HOME="${HF_HOME:-/data/light/hf_cache}"
export HF_XET_CACHE="${HF_XET_CACHE:-$HF_HOME/xet}"

if ! command -v "$HF_BIN" >/dev/null 2>&1; then
  echo "Hugging Face CLI not found: $HF_BIN. Install huggingface_hub[cli] or set HF_BIN." >&2
  exit 127
fi

mkdir -p "$ROOT"/{paper,web,code,hf,logs} "$HF_HOME" "$HF_XET_CACHE"

LOG="$ROOT/logs/download_assets.log"
STATUS="$ROOT/logs/download_status.json"

write_status() {
  local stage="$1"
  local state="$2"
  local message="$3"
  cat > "$STATUS" <<JSON
{"timestamp":"$(date -Is)","stage":"$stage","state":"$state","message":"$message","root":"$ROOT","hf_home":"$HF_HOME"}
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

write_status "init" "running" "starting"
echo "[$(date -Is)] PhysX-Omni asset download started" >> "$LOG"

run_logged "paper_pdf" curl -L --retry 5 --connect-timeout 30 -o "$ROOT/paper/2605.21572v1.pdf" "https://arxiv.org/pdf/2605.21572v1"
run_logged "paper_html" curl -L --retry 5 --connect-timeout 30 -o "$ROOT/paper/2605.21572v1.html" "https://arxiv.org/html/2605.21572v1"
run_logged "project_page" curl -L --retry 5 --connect-timeout 30 -o "$ROOT/web/project-page.html" "https://physx-omni.github.io/"

if [ -d "$ROOT/code/PhysX-Omni/.git" ]; then
  run_logged "code_update" git -C "$ROOT/code/PhysX-Omni" pull --ff-only
else
  run_logged "code_clone" git clone --recurse-submodules "https://github.com/physx-omni/PhysX-Omni.git" "$ROOT/code/PhysX-Omni"
fi

run_logged "hf_version" "$HF_BIN" version
run_logged "model_download" "$HF_BIN" download "PhysX-Omni/PhysX-Omni" --local-dir "$ROOT/hf/PhysX-Omni-model" --max-workers 8
run_logged "dataset_download" "$HF_BIN" download "PhysX-Omni/PhysXVerse" --type dataset --local-dir "$ROOT/hf/PhysXVerse-dataset" --max-workers 8

write_status "all" "completed" "all assets downloaded"
echo "[$(date -Is)] PhysX-Omni asset download completed" >> "$LOG"
