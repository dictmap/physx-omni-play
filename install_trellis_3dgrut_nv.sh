#!/usr/bin/env bash
set -euo pipefail
cd /data/light/repro/physx_omni_2605_21572/code/PhysX-Omni
bash setup.sh --basic --xformers --spconv --nvdiffrast
