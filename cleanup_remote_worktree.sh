#!/usr/bin/env bash
set -euo pipefail

# Clean transient runtime files in the remote PhysX-Omni worktree.
# Default is dry-run. Use --apply to delete.
#
# Kept intentionally:
#   - decoder_each.py and trellis/pipelines/trellis_image_to_3d.py modifications
#   - reproduction outputs under /data/light/repro/physx_omni_2605_21572/repro_runs
#   - downloaded model/data assets

MODE="${1:---dry-run}"
ROOT="${ROOT:-/data/light/repro/physx_omni_2605_21572}"
REPO="${REPO:-$ROOT/code/PhysX-Omni}"

if [[ "$MODE" != "--dry-run" && "$MODE" != "--apply" ]]; then
  echo "Usage: bash cleanup_remote_worktree.sh [--dry-run|--apply]" >&2
  exit 2
fi

cd "$REPO"

mapfile -t CANDIDATES < <(
  {
    find trellis -type d -name __pycache__ -print
    find trellis -type f -name "*.pyc" -print
    printf '%s\n' exp_2infer.log exp_3urdf.log decoder_each.py.bak_formats trellis/pipelines/trellis_image_to_3d.py.bak_dino_local
  } | awk 'NF' | sort -u
)

TRACKED=()
UNTRACKED=()
for target in "${CANDIDATES[@]}"; do
  [[ -e "$target" ]] || continue
  if [[ -d "$target" ]]; then
    while IFS= read -r file; do
      [[ -n "$file" ]] || continue
      if git ls-files --error-unmatch "$file" >/dev/null 2>&1; then
        TRACKED+=("$file")
      else
        UNTRACKED+=("$file")
      fi
    done < <(find "$target" -type f)
  else
    if git ls-files --error-unmatch "$target" >/dev/null 2>&1; then
      TRACKED+=("$target")
    else
      UNTRACKED+=("$target")
    fi
  fi
done

mapfile -t TRACKED < <(printf '%s\n' "${TRACKED[@]}" | awk 'NF' | sort -u)
mapfile -t UNTRACKED < <(printf '%s\n' "${UNTRACKED[@]}" | awk 'NF' | sort -u)

if [[ "$MODE" == "--dry-run" ]]; then
  printf '[dry-run restore tracked] %s\n' "${TRACKED[@]}"
  printf '[dry-run remove untracked] %s\n' "${UNTRACKED[@]}"
  echo "tracked_count=${#TRACKED[@]}"
  echo "untracked_count=${#UNTRACKED[@]}"
  exit 0
fi

for target in "${TRACKED[@]}"; do
  git restore -- "$target"
  echo "restored $target"
done

for target in "${UNTRACKED[@]}"; do
  rm -f -- "$target"
  echo "removed $target"
done

find trellis -type d -name __pycache__ -empty -delete

echo "remaining git status:"
git status --short
