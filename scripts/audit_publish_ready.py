from __future__ import annotations

import argparse
import json
import re
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


TEXT_SUFFIXES = {
    ".cff",
    ".css",
    ".html",
    ".js",
    ".json",
    ".md",
    ".ps1",
    ".py",
    ".sh",
    ".tex",
    ".txt",
    ".yaml",
    ".yml",
}

SECRET_PATTERNS = [
    re.compile(r"BEGIN (?:OPENSSH|RSA|EC|DSA) PRIVATE KEY"),
    re.compile(r"github_pat_[A-Za-z0-9_]{20,}"),
    re.compile(r"ghp_[A-Za-z0-9]{20,}"),
    re.compile(r"hf_[A-Za-z0-9]{25,}"),
    re.compile(r"sk-[A-Za-z0-9]{20,}"),
    re.compile(r"OPENAI_API_KEY\s*=\s*['\"]?sk-[A-Za-z0-9]"),
    re.compile("4f0c" + "4471292a"),
]

REQUIRED_FILES = [
    ".github/workflows/quality.yml",
    ".gitignore",
    ".gitattributes",
    ".nojekyll",
    "CITATION.cff",
    "index.html",
    "README.md",
    "LEARNING_INDEX.md",
    "PROJECT_QUALITY_STANDARD.md",
    "PROJECT_STATUS.json",
    "SOURCE_MANIFEST.json",
    "REMOTE_EVIDENCE_MANIFEST.md",
    "RELEASE_CHECKLIST.md",
    "official_viewer/index.html",
    "official_viewer/materials-data.js",
    "scripts/validate_physx_omni_quality.py",
    "scripts/audit_publish_ready.py",
]

FORBIDDEN_TRACKED_PREFIXES = [
    "hf/",
    "logs/",
    "code/PhysX-Omni/.git/",
    "code/PhysX-Omni/benchmark/tiny_example/generated/",
]


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    raise SystemExit(1)


def run_git(args: list[str]) -> list[str]:
    result = subprocess.run(
        ["git", *args],
        cwd=ROOT,
        check=True,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    return [line.strip() for line in result.stdout.splitlines() if line.strip()]


def tracked_files() -> list[Path]:
    try:
        return [ROOT / line for line in run_git(["ls-files"])]
    except (subprocess.CalledProcessError, FileNotFoundError):
        return [
            path
            for path in ROOT.rglob("*")
            if path.is_file()
            and ".git" not in path.parts
            and "hf" not in path.parts
            and "logs" not in path.parts
        ]


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def require_files() -> None:
    for item in REQUIRED_FILES:
        path = ROOT / item
        if not path.is_file():
            fail(f"missing publish-ready file: {item}")


def validate_json() -> None:
    status = json.loads((ROOT / "PROJECT_STATUS.json").read_text(encoding="utf-8"))
    source = json.loads((ROOT / "SOURCE_MANIFEST.json").read_text(encoding="utf-8"))
    if status.get("quality_status") != "通过":
        fail("PROJECT_STATUS.json quality_status is not 通过")
    if source.get("reference_style", {}).get("repository") != "https://github.com/dictmap/roboplay":
        fail("SOURCE_MANIFEST.json missing roboplay reference style")
    if source.get("official_code", {}).get("upstream_commit") != "46fa1cd":
        fail("SOURCE_MANIFEST.json missing official code snapshot commit")


def validate_tracked_set(files: list[Path], max_file_mb: float) -> None:
    max_bytes = int(max_file_mb * 1024 * 1024)
    for path in files:
        item = rel(path)
        for prefix in FORBIDDEN_TRACKED_PREFIXES:
            if item.startswith(prefix):
                fail(f"forbidden tracked path: {item}")
        if "__pycache__" in path.parts:
            fail(f"tracked Python cache: {item}")
        if path.stat().st_size > max_bytes:
            fail(f"tracked file exceeds {max_file_mb:.1f} MB: {item}")


def validate_secret_scan(files: list[Path]) -> None:
    for path in files:
        if path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        for pattern in SECRET_PATTERNS:
            if pattern.search(text):
                fail(f"possible secret matched by {pattern.pattern!r}: {rel(path)}")


def validate_readme_links() -> None:
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    required_phrases = [
        "https://github.com/dictmap/physx-omni-play",
        "index.html",
        "RELEASE_CHECKLIST.md",
        "scripts/audit_publish_ready.py",
    ]
    for phrase in required_phrases:
        if phrase not in readme:
            fail(f"README.md missing public publish phrase: {phrase}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--max-file-mb", type=float, default=95.0)
    args = parser.parse_args()

    require_files()
    validate_json()
    files = tracked_files()
    validate_tracked_set(files, args.max_file_mb)
    validate_secret_scan(files)
    validate_readme_links()
    print("PUBLISH AUDIT PASSED")


if __name__ == "__main__":
    main()
