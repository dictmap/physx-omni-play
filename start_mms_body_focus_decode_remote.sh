#!/usr/bin/env bash
set -euo pipefail

ROOT=/data/light/repro/physx_omni_2605_21572
ENV=/home/yjl/anaconda3/envs/3dgrut_nv
CASE="$ROOT/repro_runs/user_mms_yellow_body_focus_vlm/mms_yellow_body_focus"
LOG="$CASE/mms_body_focus_lowmem_parts.log"

cd "$ROOT/code/PhysX-Omni"
export PYTHONPATH="$ROOT/code/PhysX-Omni:${PYTHONPATH:-}"
export HF_ENDPOINT="${HF_ENDPOINT:-https://hf-mirror.com}"
nohup "$ENV/bin/python" "$ROOT/run_trellis_lowmem_mesh_parts.py" \
  --case-dir "$CASE" \
  --part-indices 1,2,3 \
  --seed 1 \
  > "$LOG" 2>&1 &

echo $!
