from __future__ import annotations

import csv
import importlib.util
import json
import math
import re
import xml.etree.ElementTree as ET
from collections import Counter
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "physx_omni_step10_technical_experiments"
RESULT_DIR = OUT_DIR / "results"
PHYSX_OUTPUTS = Path(r"C:\Users\robot\physx_outputs")
REPO = ROOT / "physx-omni-assets" / "code" / "PhysX-Omni"
STEP9_REPORT = ROOT / "physx_omni_step9_reviewer" / "reviewer_audit_report.json"


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8", errors="replace"))


def maybe_read_json(path: Path) -> dict[str, Any] | None:
    if not path.exists():
        return None
    return read_json(path)


def summarize_repro_outputs() -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    if not PHYSX_OUTPUTS.exists():
        return rows
    for d in sorted([p for p in PHYSX_OUTPUTS.iterdir() if p.is_dir()]):
        summary = maybe_read_json(d / "repro_summary.json")
        mesh_report = maybe_read_json(d / "lowmem_mesh_report.json")
        file_names = sorted([p.name for p in d.iterdir() if p.is_file()])
        row: dict[str, Any] = {
            "name": d.name,
            "path": str(d),
            "files": file_names,
            "has_basic_info_json": (d / "basic_info.json").exists(),
            "has_urdf": (d / "basic.urdf").exists(),
            "has_mjcf_xml": (d / "basic.xml").exists(),
            "has_voxel_projection": (d / "voxel_projection.png").exists(),
        }
        if summary:
            parts = summary.get("parts", [])
            voxel_counts = [int(p.get("voxel_count", 0) or 0) for p in parts]
            coord_chars = [int(p.get("coord_text_chars", 0) or 0) for p in parts]
            row.update(
                {
                    "status": summary.get("status"),
                    "elapsed_sec": summary.get("elapsed_sec"),
                    "detected_parts": summary.get("detected_parts"),
                    "parts_to_run": summary.get("parts_to_run"),
                    "total_voxels": summary.get("total_voxels"),
                    "nonzero_voxel_parts": sum(1 for v in voxel_counts if v > 0),
                    "zero_voxel_parts": sum(1 for v in voxel_counts if v == 0),
                    "voxel_counts": voxel_counts,
                    "coord_text_chars": coord_chars,
                    "remote_image": summary.get("image"),
                    "remote_output_dir": summary.get("output_dir"),
                }
            )
        if mesh_report:
            mesh = mesh_report.get("mesh", {})
            row.update(
                {
                    "mesh_status": mesh_report.get("status"),
                    "mesh_elapsed_sec": mesh_report.get("elapsed_sec"),
                    "mesh_voxels": mesh_report.get("voxels"),
                    "mesh_vertices": mesh.get("vertices"),
                    "mesh_faces": mesh.get("faces"),
                    "mesh_peak_mib": max(
                        [float(s.get("max_allocated_mib", 0.0) or 0.0) for s in mesh_report.get("snapshots", [])]
                        or [0.0]
                    ),
                }
            )
        rows.append(row)
    return rows


def parse_urdf(path: Path) -> dict[str, Any]:
    root = ET.parse(path).getroot()
    links = root.findall("link")
    joints = root.findall("joint")
    masses: list[float] = []
    inertias: list[tuple[tuple[str, str | None], ...]] = []
    limits: list[dict[str, str]] = []
    friction_attrs: list[tuple[str, str, str]] = []
    for elem in root.iter():
        for k, v in elem.attrib.items():
            if "friction" in k.lower():
                friction_attrs.append((elem.tag, k, v))
    for link in links:
        inertial = link.find("inertial")
        if inertial is None:
            continue
        mass = inertial.find("mass")
        if mass is not None and "value" in mass.attrib:
            try:
                masses.append(float(mass.attrib["value"]))
            except ValueError:
                pass
        inertia = inertial.find("inertia")
        if inertia is not None:
            inertias.append(tuple((k, inertia.attrib.get(k)) for k in sorted(inertia.attrib)))
    for joint in joints:
        limit = joint.find("limit")
        if limit is not None:
            limits.append(dict(limit.attrib))
    return {
        "file": str(path),
        "links": len(links),
        "joints": len(joints),
        "joint_types": dict(Counter(j.attrib.get("type", "") for j in joints)),
        "mass_count": len(masses),
        "unique_masses": sorted(set(masses)),
        "all_mass_is_one": bool(masses) and all(abs(m - 1.0) < 1e-9 for m in masses),
        "inertia_count": len(inertias),
        "unique_inertia_count": len(set(inertias)),
        "limit_count": len(limits),
        "limit_examples": limits[:6],
        "friction_attr_count": len(friction_attrs),
        "friction_attrs": friction_attrs[:10],
    }


def parse_mjcf(path: Path) -> dict[str, Any]:
    root = ET.parse(path).getroot()
    geoms = root.findall(".//geom")
    joints = root.findall(".//joint")
    densities = [g.attrib["density"] for g in geoms if "density" in g.attrib]
    geom_masses = [g.attrib["mass"] for g in geoms if "mass" in g.attrib]
    body_inertias = [b.attrib["inertia"] for b in root.findall(".//body") if "inertia" in b.attrib]
    friction_attrs: list[tuple[str, str, str]] = []
    for elem in root.iter():
        for k, v in elem.attrib.items():
            if "friction" in k.lower():
                friction_attrs.append((elem.tag, k, v))
    return {
        "file": str(path),
        "geoms": len(geoms),
        "joints": len(joints),
        "joint_types": dict(Counter(j.attrib.get("type", "") for j in joints)),
        "density_count": len(densities),
        "unique_densities": sorted(set(densities)),
        "geom_mass_attr_count": len(geom_masses),
        "body_inertia_attr_count": len(body_inertias),
        "friction_attr_count": len(friction_attrs),
        "friction_attrs": friction_attrs[:10],
    }


def audit_physics_files() -> dict[str, Any]:
    audits: dict[str, Any] = {}
    if not PHYSX_OUTPUTS.exists():
        return audits
    for d in sorted([p for p in PHYSX_OUTPUTS.iterdir() if p.is_dir()]):
        item: dict[str, Any] = {}
        if (d / "basic.urdf").exists():
            item["urdf"] = parse_urdf(d / "basic.urdf")
        if (d / "basic.xml").exists():
            item["mjcf_xml"] = parse_mjcf(d / "basic.xml")
        if (d / "basic_info.json").exists():
            info = read_json(d / "basic_info.json")
            parts = info.get("parts", [])
            item["basic_info"] = {
                "object": info.get("object") or info.get("object_name"),
                "category": info.get("category"),
                "dimension": info.get("dimension"),
                "part_count": len(parts),
                "materials": [p.get("material") for p in parts],
                "density_values": [p.get("density") for p in parts],
                "youngs_modulus_gpa_values": [
                    p.get("youngs_modulus")
                    or p.get("Young's Modulus (GPa)")
                    or p.get("Youngs Modulus (GPa)")
                    for p in parts
                ],
                "poisson_ratio_values": [p.get("poisson_ratio") or p.get("Poisson's Ratio") for p in parts],
                "group_info_type": type(info.get("group_info")).__name__,
                "group_info_count": len(info.get("group_info", {})) if isinstance(info.get("group_info"), dict) else None,
            }
        if item:
            audits[d.name] = item
    return audits


def projection_bbox_metrics(path: Path) -> dict[str, Any]:
    image = Image.open(path).convert("RGB")
    arr = np.asarray(image)
    # Blue/cyan voxel dots have low red and high green/blue; white labels are excluded.
    mask = ((arr[:, :, 0] < 90) & ((arr[:, :, 1] > 90) | (arr[:, :, 2] > 90))).astype(np.uint8)
    h, w = mask.shape
    panel_ranges = {
        "XY_left": (0, w // 3),
        "XZ_middle": (w // 3, 2 * w // 3),
        "YZ_right": (2 * w // 3, w),
    }

    def bbox_for(m: np.ndarray) -> dict[str, Any] | None:
        ys, xs = np.where(m > 0)
        if len(xs) == 0:
            return None
        width = int(xs.max() - xs.min() + 1)
        height = int(ys.max() - ys.min() + 1)
        return {
            "x0": int(xs.min()),
            "y0": int(ys.min()),
            "x1": int(xs.max()),
            "y1": int(ys.max()),
            "width": width,
            "height": height,
            "height_over_width": round(height / max(width, 1), 4),
            "colored_pixels": int(m.sum()),
        }

    def components_for(m: np.ndarray) -> list[dict[str, Any]]:
        # Dilation connects dotted voxel grids into components.
        dilated = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(size=9))
        dm = (np.asarray(dilated) > 0).astype(np.uint8)
        try:
            from scipy import ndimage  # type: ignore

            labels, count = ndimage.label(dm)
            comps = []
            for label in range(1, count + 1):
                comp = labels == label
                raw_overlap = int((comp & (m > 0)).sum())
                if raw_overlap < 10:
                    continue
                box = bbox_for(comp.astype(np.uint8))
                if box:
                    box["raw_colored_pixels"] = raw_overlap
                    comps.append(box)
            comps.sort(key=lambda b: b["raw_colored_pixels"], reverse=True)
            return comps[:6]
        except Exception:
            box = bbox_for(dm)
            return [box] if box else []

    panels: dict[str, Any] = {}
    for name, (x0, x1) in panel_ranges.items():
        pm = mask[:, x0:x1]
        panels[name] = {
            "overall_bbox": bbox_for(pm),
            "components": components_for(pm),
        }
    return {"file": str(path), "image_size": [w, h], "panels": panels}


def source_image_metrics() -> list[dict[str, Any]]:
    preprocess_dir = PHYSX_OUTPUTS / "mms_yellow_preprocessed"
    rows = []
    for path in sorted(preprocess_dir.glob("*.jpg")):
        img = Image.open(path)
        w, h = img.size
        rows.append({"file": str(path), "name": path.name, "width": w, "height": h, "height_over_width": round(h / w, 4)})
    return rows


def summarize_projection_outputs() -> dict[str, Any]:
    out: dict[str, Any] = {"source_crops": source_image_metrics(), "voxel_projections": {}}
    for name in ["mms_yellow", "mms_yellow_body_focus", "official_demo_full"]:
        path = PHYSX_OUTPUTS / name / "voxel_projection.png"
        if path.exists():
            out["voxel_projections"][name] = projection_bbox_metrics(path)
    return out


def runs_for_slice(slice2d: np.ndarray) -> list[tuple[int, int]]:
    flat = slice2d.reshape(-1).astype(np.uint8)
    if flat.size == 0 or flat.sum() == 0:
        return []
    diff = np.diff(np.concatenate([[0], flat, [0]]))
    starts = np.where(diff == 1)[0]
    ends = np.where(diff == -1)[0]
    return [(int(s), int(e - s)) for s, e in zip(starts, ends)]


def rle_stats(mask: np.ndarray) -> dict[str, Any]:
    n = int(mask.shape[0])
    total_runs = 0
    char_count = 0
    signatures = []
    nonempty_slices = 0
    max_runs_per_slice = 0
    for z in range(n):
        runs = runs_for_slice(mask[z])
        if runs:
            nonempty_slices += 1
        max_runs_per_slice = max(max_runs_per_slice, len(runs))
        total_runs += len(runs)
        sig = tuple(runs)
        signatures.append(sig)
        for s, length in runs:
            char_count += len(str(s)) + 1 + len(str(length)) + 1
    unique_sigs = len(set(signatures))
    return {
        "grid": n,
        "occupied_voxels": int(mask.sum()),
        "occupancy_ratio": round(float(mask.mean()), 6),
        "total_runs": int(total_runs),
        "max_runs_per_slice": int(max_runs_per_slice),
        "nonempty_slices": int(nonempty_slices),
        "unique_slice_signatures": int(unique_sigs),
        "unique_slice_ratio": round(unique_sigs / max(n, 1), 4),
        "rle_char_count_proxy": int(char_count),
        "approx_tokens_char_div4": round(char_count / 4.0, 1),
        "exceeds_20000_token_proxy": bool((char_count / 4.0) > 20000),
    }


def make_shape(n: int, shape: str, rng: np.random.Generator) -> np.ndarray:
    z, y, x = np.indices((n, n, n))
    c = (n - 1) / 2.0
    r = n * 0.32
    if shape == "solid_cylinder":
        return (((x - c) ** 2 + (y - c) ** 2 <= r**2) & (z >= n * 0.1) & (z <= n * 0.9))
    if shape == "hollow_cylinder_shell":
        rr = (x - c) ** 2 + (y - c) ** 2
        return ((rr <= r**2) & (rr >= (r * 0.72) ** 2) & (z >= n * 0.1) & (z <= n * 0.9))
    if shape == "thin_diagonal_wires":
        return (
            (np.abs(x - z) <= 1) & (np.abs(y - c) <= 1)
        ) | (
            (np.abs(y - z) <= 1) & (np.abs(x - c) <= 1)
        )
    if shape == "checkerboard_dense":
        return ((x + y + z) % 2) == 0
    if shape == "random_5pct":
        return rng.random((n, n, n)) < 0.05
    raise ValueError(shape)


def rle_stress_test() -> list[dict[str, Any]]:
    rng = np.random.default_rng(1234)
    rows = []
    for n in [32, 64, 128]:
        for shape in ["solid_cylinder", "hollow_cylinder_shell", "thin_diagonal_wires", "checkerboard_dense", "random_5pct"]:
            mask = make_shape(n, shape, rng)
            row = {"shape": shape, **rle_stats(mask)}
            rows.append(row)
    return rows


def prompt_and_benchmark_audit() -> dict[str, Any]:
    readme = (REPO / "benchmark" / "README.md").read_text(encoding="utf-8", errors="replace")
    vlm = (REPO / "benchmark" / "code" / "vlm" / "multi.py").read_text(encoding="utf-8", errors="replace")
    prompt_dir = REPO / "benchmark" / "prompts"
    keywords = [
        "category priors",
        "common everyday dimensions",
        "common sense",
        "material physics",
        "common material",
        "uncertainty",
        "image-based material priors",
        "likely_motion",
        "observed_state",
    ]
    prompt_counts: dict[str, int] = {}
    prompt_examples: dict[str, list[dict[str, Any]]] = {}
    for p in sorted(prompt_dir.glob("*.yaml")):
        hits = []
        text = p.read_text(encoding="utf-8", errors="replace")
        for i, line in enumerate(text.splitlines(), 1):
            if any(k.lower() in line.lower() for k in keywords):
                hits.append({"line": i, "text": line.strip()})
        prompt_counts[p.name] = len(hits)
        prompt_examples[p.name] = hits[:8]

    tiny_summary = []
    tiny_path = REPO / "benchmark" / "tiny_example" / "generated" / "benchmark_results" / "summary.csv"
    if tiny_path.exists():
        with tiny_path.open("r", encoding="utf-8", newline="") as f:
            tiny_summary = list(csv.DictReader(f))
    return {
        "default_judge_mentions": len(re.findall(r"Qwen/Qwen3\.5-122B-A10B", readme + "\n" + vlm)),
        "temperature_none_mentions": vlm.count("temperature=None") + vlm.count('"temperature": None'),
        "auto_score_mentions": vlm.count("AutoScore") + vlm.count("score=0"),
        "prompt_prior_hit_counts": prompt_counts,
        "prompt_prior_examples": prompt_examples,
        "tiny_benchmark_summary": tiny_summary,
    }


def simulator_availability() -> dict[str, Any]:
    packages = ["mujoco", "genesis", "isaacsim", "omni", "pxr"]
    return {pkg: importlib.util.find_spec(pkg) is not None for pkg in packages}


def mujoco_smoke_test() -> dict[str, Any]:
    xml_path = PHYSX_OUTPUTS / "official_demo_full" / "basic.xml"
    result: dict[str, Any] = {"xml": str(xml_path), "xml_exists": xml_path.exists()}
    if not xml_path.exists():
        result["status"] = "missing_xml"
        return result
    if importlib.util.find_spec("mujoco") is None:
        result["status"] = "mujoco_not_installed"
        return result
    try:
        import mujoco  # type: ignore

        model = mujoco.MjModel.from_xml_path(str(xml_path))
        data = mujoco.MjData(model)
        for _ in range(200):
            mujoco.mj_step(model, data)
        result.update(
            {
                "status": "success",
                "nq": int(model.nq),
                "nv": int(model.nv),
                "nbody": int(model.nbody),
                "ngeom": int(model.ngeom),
                "njnt": int(model.njnt),
                "final_time": float(data.time),
                "qpos_sample": [float(x) for x in data.qpos[: min(8, len(data.qpos))]],
                "qvel_abs_max": float(np.max(np.abs(data.qvel))) if len(data.qvel) else 0.0,
            }
        )
    except Exception as exc:
        result.update({"status": "failed", "error": repr(exc)})
    return result


def load_step9_summary() -> dict[str, Any]:
    if not STEP9_REPORT.exists():
        return {}
    data = read_json(STEP9_REPORT)
    return {
        "default_judge_mentions_step9": data.get("default_judge_mentions"),
        "urdf_unique_masses_step9": data.get("urdf_audit", {}).get("unique_masses"),
        "urdf_unique_inertia_count_step9": data.get("urdf_audit", {}).get("unique_inertia_count"),
        "rle_audit_hit_counts_step9": data.get("rle_audit_hit_counts"),
    }


def main() -> None:
    RESULT_DIR.mkdir(parents=True, exist_ok=True)
    results = {
        "paper": "https://arxiv.org/abs/2605.21572v1",
        "code": "https://github.com/physx-omni/PhysX-Omni",
        "local_repo": str(REPO),
        "physx_outputs": str(PHYSX_OUTPUTS),
        "repro_outputs": summarize_repro_outputs(),
        "physics_file_audit": audit_physics_files(),
        "projection_analysis": summarize_projection_outputs(),
        "rle_stress_test": rle_stress_test(),
        "prompt_and_benchmark_audit": prompt_and_benchmark_audit(),
        "simulator_availability": simulator_availability(),
        "mujoco_smoke_test": mujoco_smoke_test(),
        "step9_reviewer_audit_summary": load_step9_summary(),
    }
    (RESULT_DIR / "step10_experiment_results.json").write_text(
        json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(json.dumps({
        "result": str(RESULT_DIR / "step10_experiment_results.json"),
        "repro_output_count": len(results["repro_outputs"]),
        "physics_audit_count": len(results["physics_file_audit"]),
        "rle_rows": len(results["rle_stress_test"]),
        "simulator_availability": results["simulator_availability"],
        "mujoco_smoke_test": results["mujoco_smoke_test"].get("status"),
    }, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
