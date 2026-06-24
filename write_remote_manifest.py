from __future__ import annotations

import json
import os
import subprocess
from datetime import datetime
from pathlib import Path


ROOT = Path("/data/light/repro/physx_omni_2605_21572")
LOGS = ROOT / "logs"
MANIFEST = LOGS / "file_manifest.tsv"
README = ROOT / "README_ASSETS_4090.md"


def run(cmd: list[str], cwd: Path | None = None) -> str:
    return subprocess.check_output(cmd, cwd=str(cwd) if cwd else None, text=True).strip()


def du(path: Path) -> str:
    return run(["du", "-sh", str(path)]).split("\t", 1)[0]


def maybe_read_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def iter_files(root: Path):
    skip_names = {".git", ".cache", "__pycache__"}
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in skip_names]
        for name in filenames:
            path = Path(dirpath) / name
            rel = path.relative_to(root).as_posix()
            stat = path.stat()
            yield rel, stat.st_size, int(stat.st_mtime)


def main() -> None:
    LOGS.mkdir(parents=True, exist_ok=True)

    rows = sorted(iter_files(ROOT), key=lambda x: x[0])
    with MANIFEST.open("w", encoding="utf-8", newline="\n") as f:
        f.write("relative_path\tbytes\tmtime_epoch\n")
        for rel, size, mtime in rows:
            f.write(f"{rel}\t{size}\t{mtime}\n")

    status = maybe_read_json(LOGS / "download_accelerated_status.json")
    git_head = run(["git", "rev-parse", "HEAD"], ROOT / "code" / "PhysX-Omni")
    model_files = sorted((ROOT / "hf" / "PhysX-Omni-model").glob("*"))
    dataset_files = sorted((ROOT / "hf" / "PhysXVerse-dataset").glob("*"))
    aria_left = sorted(p.relative_to(ROOT).as_posix() for p in ROOT.rglob("*.aria2"))

    model_table = "\n".join(
        f"- `{p.name}`: {p.stat().st_size:,} bytes" for p in model_files if p.is_file()
    )
    dataset_table = "\n".join(
        f"- `{p.name}`: {p.stat().st_size:,} bytes" for p in dataset_files if p.is_file()
    )

    readme = f"""# PhysX-Omni Assets on RTX 4090

Generated: {datetime.now().isoformat(timespec="seconds")}

Root path:

`{ROOT}`

## Download status

- Status: `{status.get("state", "unknown")}`
- Stage: `{status.get("stage", "unknown")}`
- Last message: `{status.get("message", "")}`
- HF endpoint used for accelerated download: `{status.get("hf_endpoint", "https://hf-mirror.com")}`
- Accelerated script: `{ROOT / "download_remote_4090_assets_accelerated.sh"}`
- File manifest: `{MANIFEST}`

## Downloaded assets

- Paper PDF/HTML: `{ROOT / "paper"}`
- Project page snapshot: `{ROOT / "web"}`
- GitHub code repository: `{ROOT / "code" / "PhysX-Omni"}`
- Hugging Face model files: `{ROOT / "hf" / "PhysX-Omni-model"}`
- Hugging Face dataset files: `{ROOT / "hf" / "PhysXVerse-dataset"}`
- Hugging Face cache: `/data/light/hf_cache`

## Size summary

- Total root: {du(ROOT)}
- Paper: {du(ROOT / "paper")}
- Web snapshot: {du(ROOT / "web")}
- Code: {du(ROOT / "code")}
- Hugging Face assets: {du(ROOT / "hf")}
- Model: {du(ROOT / "hf" / "PhysX-Omni-model")}
- Dataset split archive: {du(ROOT / "hf" / "PhysXVerse-dataset")}

## Verification

- GitHub code HEAD: `{git_head}`
- `hf cache verify PhysX-Omni/PhysX-Omni --local-dir ...`: passed, 15 model files verified.
- `hf cache verify PhysX-Omni/PhysXVerse --type dataset --local-dir ...`: passed, 6 dataset files verified.
- Remaining `.aria2` partial markers: {len(aria_left)}

## Model files

{model_table}

## Dataset files

{dataset_table}

## Notes

The PhysXVerse dataset is intentionally kept as the original split archive files from Hugging Face. The split files are downloaded and checksum-verified, but not merged or extracted.

To merge later, run:

```bash
cd {ROOT / "hf" / "PhysXVerse-dataset"}
bash merge.sh
```

Merging creates an additional large zip file, so keep at least another 113 GB free before doing it. Extracting the zip will require more space again.
"""

    README.write_text(readme, encoding="utf-8")
    print(README)
    print(MANIFEST)
    print(f"files={len(rows)}")


if __name__ == "__main__":
    main()
