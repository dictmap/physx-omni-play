from __future__ import annotations

import re
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]

HTML_FILES = [
    "index.html",
    "official_viewer/index.html",
]

MARKDOWN_FILES = [
    "README.md",
    "official_viewer/README.md",
    "RELEASE_CHECKLIST.md",
]

PUBLIC_TEXT_FILES = [
    *HTML_FILES,
    *MARKDOWN_FILES,
    "download_hf_assets.ps1",
    "download_remote_4090_assets.sh",
    "download_remote_4090_assets_accelerated.sh",
]

PERSONAL_PATH_PATTERNS = [
    re.compile(r"C:[\\/]+Users[\\/]+robot[\\/]+Documents", re.I),
    re.compile(r"C:[\\/]+Users[\\/]+robot[\\/]+AppData", re.I),
    re.compile(r"C:[\\/]+Users[\\/]+robot[\\/]+xwechat_files", re.I),
]

HTML_REF_RE = re.compile(r"""(?:href|src)=["']([^"']+)["']""", re.I)
MD_LINK_RE = re.compile(r"""!?\[[^\]]*\]\(([^)]+)\)""")


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    raise SystemExit(1)


def is_external(target: str) -> bool:
    parsed = urlsplit(target)
    return bool(parsed.scheme or parsed.netloc)


def validate_inside_repo(path: Path, source: str, target: str) -> None:
    resolved = path.resolve()
    try:
        resolved.relative_to(ROOT.resolve())
    except ValueError:
        fail(f"{source} links outside the repository: {target}")
    if not resolved.exists():
        fail(f"{source} links to a missing local target: {target}")


def iter_local_refs(text: str, pattern: re.Pattern[str]) -> list[str]:
    refs: list[str] = []
    for match in pattern.finditer(text):
        target = match.group(1).strip()
        if not target or target.startswith("#") or is_external(target):
            continue
        path = unquote(urlsplit(target).path)
        if not path:
            continue
        refs.append(path)
    return refs


def validate_html_links(rel: str) -> None:
    path = ROOT / rel
    text = path.read_text(encoding="utf-8")
    for target in iter_local_refs(text, HTML_REF_RE):
        validate_inside_repo(path.parent / target, rel, target)


def validate_markdown_links(rel: str) -> None:
    path = ROOT / rel
    text = path.read_text(encoding="utf-8")
    for target in iter_local_refs(text, MD_LINK_RE):
        validate_inside_repo(path.parent / target, rel, target)


def validate_public_text_portability() -> None:
    for rel in PUBLIC_TEXT_FILES:
        text = (ROOT / rel).read_text(encoding="utf-8", errors="ignore")
        for pattern in PERSONAL_PATH_PATTERNS:
            if pattern.search(text):
                fail(f"public entry file contains a personal machine path: {rel}")


def validate_download_script_portability() -> None:
    win_script = (ROOT / "download_hf_assets.ps1").read_text(encoding="utf-8")
    remote_script = (ROOT / "download_remote_4090_assets.sh").read_text(encoding="utf-8")
    accel_script = (ROOT / "download_remote_4090_assets_accelerated.sh").read_text(encoding="utf-8")

    if "AppData\\Local\\Programs\\Python" in win_script:
        fail("download_hf_assets.ps1 still hardcodes a local Python installation")
    if "Resolve-HfCli" not in win_script or "HF_BIN" not in win_script:
        fail("download_hf_assets.ps1 must resolve hf from PATH or HF_BIN")
    for rel, text in [
        ("download_remote_4090_assets.sh", remote_script),
        ("download_remote_4090_assets_accelerated.sh", accel_script),
    ]:
        if 'ROOT="/data/light/repro/physx_omni_2605_21572"' in text:
            fail(f"{rel} still hardcodes the remote root without PHYSX_OMNI_ROOT")
        if "PHYSX_OMNI_ROOT" not in text or "HF_HOME" not in text or "HF_XET_CACHE" not in text:
            fail(f"{rel} must expose root and Hugging Face cache overrides")


def main() -> None:
    validate_public_text_portability()
    validate_download_script_portability()
    for rel in HTML_FILES:
        validate_html_links(rel)
    for rel in MARKDOWN_FILES:
        validate_markdown_links(rel)
    print("PUBLIC LINK AUDIT PASSED")


if __name__ == "__main__":
    main()
