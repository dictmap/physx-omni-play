from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    raise SystemExit(1)


def require_file(rel: str) -> Path:
    path = ROOT / rel
    if not path.is_file():
        fail(f"missing required file: {rel}")
    if path.stat().st_size <= 0:
        fail(f"empty required file: {rel}")
    return path


def require_dir(rel: str) -> Path:
    path = ROOT / rel
    if not path.is_dir():
        fail(f"missing required directory: {rel}")
    return path


def load_materials_data() -> dict:
    path = require_file("official_viewer/materials-data.js")
    text = path.read_text(encoding="utf-8")
    match = re.match(r"^window\.PHYSX_OMNI_LIBRARY\s*=\s*(.*);\s*$", text, re.S)
    if not match:
        fail("materials-data.js does not define window.PHYSX_OMNI_LIBRARY")
    return json.loads(match.group(1))


def count_markdown_files() -> int:
    return sum(
        1
        for path in ROOT.rglob("*.md")
        if "__pycache__" not in path.parts
    )


def count_learning_notebooks() -> int:
    base = ROOT / "learning_materials"
    return sum(1 for _ in base.rglob("*.ipynb"))


def validate_required_files() -> None:
    required = [
        ".gitattributes",
        ".github/workflows/quality.yml",
        ".gitignore",
        ".nojekyll",
        "index.html",
        "README.md",
        "LEARNING_INDEX.md",
        "PROJECT_QUALITY_STANDARD.md",
        "PROJECT_STATUS.json",
        "SOURCE_MANIFEST.json",
        "REMOTE_EVIDENCE_MANIFEST.md",
        "RELEASE_CHECKLIST.md",
        "reproduce_quality.sh",
        "physx_omni_repro_quality.patch",
        "official_viewer/index.html",
        "official_viewer/styles.css",
        "official_viewer/teaching.js",
        "official_viewer/boot-viewer.js",
        "official_viewer/viewer.js",
        "official_viewer/build_materials_data.py",
        "official_viewer/materials-data.js",
        "learning_materials/README.md",
        "learning_materials/reproduction/physx_omni_current_delivery_report.md",
        "learning_materials/reproduction/physx-omni-official-demo-full-repro-report.md",
        "learning_materials/reproduction/physx-omni-next-steps-and-mms-body-focus.md",
        "learning_materials/paper_reading/physx_omni_paper_code_assets_deep_reading_step1.md",
        "learning_materials/paper_reading/physx_omni_paper_author_deep_reading_step2.md",
        "learning_materials/paper_reading/physx_omni_paper_core_innovations_step3.md",
        "learning_materials/paper_reading/physx_omni_paper_baselines_experiments_step4.md",
        "learning_materials/paper_reading/physx_omni_paper_bench_step5.md",
        "learning_materials/paper_reading/physx_omni_paper_datasets_step6.md",
        "learning_materials/paper_reading/physx_omni_paper_competitor_landscape_step7.md",
        "learning_materials/physx_omni_step8_deepdives/00_index.md",
        "learning_materials/physx_omni_step9_reviewer/00_reviewer_soul_questions.md",
        "learning_materials/physx_omni_step10_technical_experiments/00_technical_experiment_answer.md",
        "learning_materials/physx_omni_step10_technical_experiments/results/step10_experiment_results.json",
        "paper/2605.21572v1.pdf",
        "paper/2605.21572v1.html",
        "code/PhysX-Omni/1vlm_demo.py",
        "code/PhysX-Omni/2infer_geo.py",
        "code/PhysX-Omni/decoder_each.py",
        "code/PhysX-Omni/3jsongen_update.py",
        "scripts/audit_publish_ready.py",
    ]
    for rel in required:
        require_file(rel)

    for rel in [
        "official_viewer/assets/parts",
        "official_viewer/assets/mms/parts",
        "author_sources/src/figure",
        "learning_materials/supporting_notes",
    ]:
        require_dir(rel)


def validate_json_files() -> None:
    for rel in [
        "PROJECT_STATUS.json",
        "SOURCE_MANIFEST.json",
        "learning_materials/physx_omni_step10_technical_experiments/results/step10_experiment_results.json",
        "official_viewer/assets/basic_info.json",
    ]:
        json.loads(require_file(rel).read_text(encoding="utf-8"))


def validate_materials_index() -> None:
    data = load_materials_data()
    docs = data.get("documents", [])
    counts = data.get("counts", {})
    status = json.loads(require_file("PROJECT_STATUS.json").read_text(encoding="utf-8"))
    status_viewer = status.get("viewer", {})

    if len(docs) < 90:
        fail(f"materials-data.js indexes too few documents: {len(docs)}")
    if data.get("assetRoot") != ".":
        fail("materials-data.js must use a portable assetRoot, not a local absolute path")
    if counts.get("documents") != len(docs):
        fail("materials-data.js document count does not match documents length")
    if counts.get("markdown") != count_markdown_files():
        fail(
            "materials-data.js markdown count is stale; run official_viewer/build_materials_data.py"
        )
    if counts.get("notebooks") != count_learning_notebooks():
        fail(
            "materials-data.js notebook count is stale; run official_viewer/build_materials_data.py"
        )
    if status_viewer.get("teaching_documents_indexed") != counts.get("documents"):
        fail("PROJECT_STATUS.json teaching_documents_indexed is stale")
    if status_viewer.get("markdown_documents") != counts.get("markdown"):
        fail("PROJECT_STATUS.json markdown_documents is stale")
    if status_viewer.get("notebooks") != counts.get("notebooks"):
        fail("PROJECT_STATUS.json notebooks count is stale")

    groups = data.get("groups", {})
    for group in [
        "主线精读 Step 1-7",
        "Step 8 概念逐项精讲",
        "Step 9 审稿人质疑",
        "Step 10 技术实验回答",
        "复现记录与实测",
        "支撑笔记与矩阵",
    ]:
        if groups.get(group, 0) <= 0:
            fail(f"materials-data.js missing group: {group}")

    for doc in docs:
        rel = doc.get("relPath")
        if not rel:
            fail("materials-data.js contains a document without relPath")
        if not (ROOT / rel).is_file():
            fail(f"materials-data.js references missing document: {rel}")
        if not doc.get("title"):
            fail(f"materials-data.js document missing title: {rel}")
        if doc.get("type") not in {"markdown", "notebook"}:
            fail(f"materials-data.js document has invalid type: {rel}")


def validate_viewer_assets() -> None:
    official_parts = sorted((ROOT / "official_viewer/assets/parts").glob("*.glb"))
    mms_parts = sorted((ROOT / "official_viewer/assets/mms/parts").glob("*.glb"))
    if len(official_parts) != 7:
        fail(f"expected 7 official GLB parts, found {len(official_parts)}")
    if len(mms_parts) != 3:
        fail(f"expected 3 M&M's GLB parts, found {len(mms_parts)}")
    for path in official_parts + mms_parts:
        if path.stat().st_size <= 1024:
            fail(f"GLB asset looks too small: {path.relative_to(ROOT)}")

    for rel in [
        "official_viewer/assets/cond_img.png",
        "official_viewer/assets/mms/cond_img.png",
        "official_viewer/assets/mms/voxel_projection.png",
        "official_viewer/assets/evidence/official_7part_mesh_preview.png",
    ]:
        require_file(rel)


def validate_viewer_structure() -> None:
    index = require_file("official_viewer/index.html").read_text(encoding="utf-8")
    order = [
        "./materials-data.js",
        "./teaching.js",
        "importmap",
        "./boot-viewer.js",
    ]
    positions = [index.find(item) for item in order]
    if any(pos < 0 for pos in positions):
        fail("index.html missing one or more viewer scripts")
    if positions != sorted(positions):
        fail("index.html script order is wrong; teaching data must load before the viewer boot script")

    teaching = require_file("official_viewer/teaching.js").read_text(encoding="utf-8")
    boot = require_file("official_viewer/boot-viewer.js").read_text(encoding="utf-8")
    viewer = require_file("official_viewer/viewer.js").read_text(encoding="utf-8")
    if "file:// 直开模式" not in teaching:
        fail("teaching.js does not contain file:// fallback notice")
    if 'location.protocol === "file:"' not in boot:
        fail("boot-viewer.js must skip Three.js module loading in file:// mode")
    if './viewer.js' not in boot:
        fail("boot-viewer.js does not load viewer.js in HTTP mode")
    if '<script type="module" src="./viewer.js"' in index:
        fail("index.html must not directly load viewer.js; use boot-viewer.js for file:// fallback")
    for duplicated_name in ["const roadmap", "const codeCards", "const reviewerQuestions", "PHYSX_OMNI_LIBRARY"]:
        if duplicated_name in viewer:
            fail(f"viewer.js still contains teaching-layer data: {duplicated_name}")
    if 'from "three"' not in viewer:
        fail("viewer.js no longer imports Three.js")
    if "MeshBasicMaterial" not in viewer:
        fail("viewer.js should use inspection-friendly material rendering")


def validate_no_generated_cache() -> None:
    cache_dirs = [
        path
        for path in ROOT.rglob("__pycache__")
        if path.is_dir()
        and ".git" not in path.parts
    ]
    if cache_dirs:
        fail(
            "generated __pycache__ exists in project tree: "
            + ", ".join(str(path.relative_to(ROOT)) for path in cache_dirs)
        )


def main() -> None:
    validate_required_files()
    validate_json_files()
    validate_materials_index()
    validate_viewer_assets()
    validate_viewer_structure()
    validate_no_generated_cache()
    print("QUALITY CHECK PASSED")


if __name__ == "__main__":
    main()
