#!/usr/bin/env bash
set -euo pipefail

# Quality reproduction entrypoint for the RTX 4090 Linux host.
#
# Defaults match the current 4090 reproduction:
#   ROOT=/data/light/repro/physx_omni_2605_21572
#   ENV=/home/yjl/anaconda3/envs/3dgrut_nv
#
# Example:
#   bash reproduce_quality.sh
#   RUN_BASE=/data/light/repro/physx_omni_2605_21572/repro_runs/user_case bash reproduce_quality.sh

ROOT="${ROOT:-/data/light/repro/physx_omni_2605_21572}"
ENV="${ENV:-/home/yjl/anaconda3/envs/3dgrut_nv}"
REPO="${REPO:-$ROOT/code/PhysX-Omni}"
RUN_BASE="${RUN_BASE:-$ROOT/repro_runs/vlm_full}"
RANGE="${RANGE:-1}"
INDEX="${INDEX:-0}"
DINO_LOCAL_REPO="${DINO_LOCAL_REPO:-$ROOT/hf/dinov2}"
HF_ENDPOINT="${HF_ENDPOINT:-https://hf-mirror.com}"

export SPCONV_ALGO="${SPCONV_ALGO:-native}"
export ATTN_BACKEND="${ATTN_BACKEND:-xformers}"
export DINO_LOCAL_REPO
export HF_ENDPOINT
export PYTHONPATH="$REPO:${PYTHONPATH:-}"

if [[ ! -x "$ENV/bin/python" ]]; then
  echo "Missing Python env: $ENV/bin/python" >&2
  exit 2
fi

if [[ ! -d "$REPO" ]]; then
  echo "Missing PhysX-Omni repo: $REPO" >&2
  exit 2
fi

if [[ ! -d "$RUN_BASE" ]]; then
  echo "Missing run base: $RUN_BASE" >&2
  echo "Run 1vlm_demo.py first or set RUN_BASE to an existing VLM output base." >&2
  exit 2
fi

cd "$REPO"

echo "[1/3] environment"
"$ENV/bin/python" - <<'PY'
import torch
print("torch", torch.__version__)
print("cuda", torch.cuda.is_available())
print("device", torch.cuda.get_device_name(0) if torch.cuda.is_available() else "cpu")
PY

echo "[2/3] geometry decode"
"$ENV/bin/python" 2infer_geo.py \
  --index "$INDEX" \
  --range "$RANGE" \
  --outputpath "$RUN_BASE"

echo "[3/3] URDF/MJCF update"
"$ENV/bin/python" 3jsongen_update.py \
  --basepath "$RUN_BASE"

echo "done: $RUN_BASE"
