from __future__ import annotations

import json
import re
from pathlib import Path


VIEWER_ROOT = Path(__file__).resolve().parent
ASSET_ROOT = VIEWER_ROOT.parent
OUT = VIEWER_ROOT / "materials-data.js"


def generated_at() -> str:
    status_path = ASSET_ROOT / "PROJECT_STATUS.json"
    if status_path.is_file():
        status = json.loads(status_path.read_text(encoding="utf-8"))
        return str(status.get("status_date") or "unknown")
    return "unknown"


def relpath(path: Path) -> str:
    return path.relative_to(ASSET_ROOT).as_posix()


def href_for(path: Path) -> str:
    rel = relpath(path)
    if rel.startswith("official_viewer/"):
        return rel.removeprefix("official_viewer/")
    return "../" + rel


def group_for(rel: str) -> str:
    if rel.startswith("learning_materials/paper_reading/"):
        return "主线精读 Step 1-7"
    if rel.startswith("learning_materials/physx_omni_step8_deepdives/"):
        return "Step 8 概念逐项精讲"
    if rel.startswith("learning_materials/physx_omni_step9_reviewer/"):
        return "Step 9 审稿人质疑"
    if rel.startswith("learning_materials/physx_omni_step10_technical_experiments/"):
        return "Step 10 技术实验回答"
    if rel.startswith("learning_materials/reproduction/"):
        return "复现记录与实测"
    if rel.startswith("learning_materials/supporting_notes/"):
        return "支撑笔记与矩阵"
    if rel.startswith("code/PhysX-Omni/benchmark/"):
        return "官方代码 Bench"
    if rel.startswith("code/PhysX-Omni/"):
        return "官方代码文档"
    if rel.startswith("author_sources/"):
        return "论文源码与图表"
    if rel.startswith("official_viewer/"):
        return "前端查看器"
    return "项目入口与交付说明"


def title_from_markdown(text: str, fallback: str) -> str:
    for line in text.splitlines():
        match = re.match(r"^\s{0,3}#\s+(.+?)\s*$", line)
        if match:
            return re.sub(r"\s+#*$", "", match.group(1)).strip()
    return fallback


def heading_outline(text: str, limit: int = 12) -> list[dict[str, object]]:
    outline: list[dict[str, object]] = []
    for line in text.splitlines():
        match = re.match(r"^\s{0,3}(#{1,3})\s+(.+?)\s*$", line)
        if not match:
            continue
        outline.append(
            {
                "level": len(match.group(1)),
                "text": re.sub(r"\s+#*$", "", match.group(2)).strip(),
            }
        )
        if len(outline) >= limit:
            break
    return outline


def excerpt_from_markdown(text: str, limit: int = 420) -> str:
    chunks: list[str] = []
    in_fence = False
    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        if not stripped or stripped.startswith("#") or stripped.startswith("|"):
            continue
        if re.match(r"^[-*]\s*$", stripped):
            continue
        chunks.append(stripped)
        if sum(len(item) for item in chunks) >= limit:
            break
    excerpt = " ".join(chunks)
    excerpt = re.sub(r"\s+", " ", excerpt).strip()
    return excerpt[:limit].rstrip()


def markdown_entry(path: Path) -> dict[str, object]:
    text = path.read_text(encoding="utf-8", errors="replace")
    rel = relpath(path)
    lines = text.count("\n") + (1 if text else 0)
    stable_bytes = len(text.encode("utf-8"))
    return {
        "type": "markdown",
        "group": group_for(rel),
        "title": title_from_markdown(text, path.stem),
        "relPath": rel,
        "href": href_for(path),
        "lines": lines,
        "bytes": stable_bytes,
        "outline": heading_outline(text),
        "excerpt": excerpt_from_markdown(text),
    }


def notebook_entry(path: Path) -> dict[str, object]:
    rel = relpath(path)
    raw_text = path.read_text(encoding="utf-8", errors="replace")
    data = json.loads(raw_text)
    markdown_cells = 0
    code_cells = 0
    merged_markdown: list[str] = []
    for cell in data.get("cells", []):
        cell_type = cell.get("cell_type")
        if cell_type == "markdown":
            markdown_cells += 1
            source = cell.get("source", [])
            merged_markdown.append("".join(source) if isinstance(source, list) else str(source))
        elif cell_type == "code":
            code_cells += 1
    text = "\n\n".join(merged_markdown)
    return {
        "type": "notebook",
        "group": group_for(rel),
        "title": title_from_markdown(text, path.stem),
        "relPath": rel,
        "href": href_for(path),
        "markdownCells": markdown_cells,
        "codeCells": code_cells,
        "bytes": len(raw_text.encode("utf-8")),
        "outline": heading_outline(text),
        "excerpt": excerpt_from_markdown(text),
    }


def main() -> None:
    docs: list[dict[str, object]] = []
    for path in sorted(ASSET_ROOT.rglob("*.md")):
        if "__pycache__" in path.parts:
            continue
        docs.append(markdown_entry(path))
    for path in sorted((ASSET_ROOT / "learning_materials").rglob("*.ipynb")):
        docs.append(notebook_entry(path))

    groups: dict[str, int] = {}
    for doc in docs:
        groups[doc["group"]] = groups.get(doc["group"], 0) + 1

    payload = {
        "generatedAt": generated_at(),
        "assetRoot": ".",
        "counts": {
            "documents": len(docs),
            "markdown": sum(1 for item in docs if item["type"] == "markdown"),
            "notebooks": sum(1 for item in docs if item["type"] == "notebook"),
        },
        "groups": groups,
        "documents": docs,
    }
    text = "window.PHYSX_OMNI_LIBRARY = "
    text += json.dumps(payload, ensure_ascii=False, indent=2)
    text += ";\n"
    OUT.write_text(text, encoding="utf-8")
    print(f"wrote {OUT} with {len(docs)} documents")


if __name__ == "__main__":
    main()
