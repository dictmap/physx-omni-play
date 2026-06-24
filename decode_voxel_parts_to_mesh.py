#!/usr/bin/env python3
"""Decode PhysX-Omni ind_*.npy voxel parts into simple mesh artifacts.

This is a fallback geometry decoder for inspection when TRELLIS weights are not
available. It uses marching cubes over the generated 64^3 voxel grid and should
be reported as voxel-derived geometry, not textured TRELLIS output.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import numpy as np
import trimesh
from skimage import measure


COLORS = [
    [255, 201, 87, 255],
    [108, 192, 255, 255],
    [142, 227, 111, 255],
    [255, 138, 122, 255],
    [197, 164, 255, 255],
    [122, 215, 196, 255],
    [245, 166, 91, 255],
]


def sorted_ind_files(case_dir: Path) -> list[tuple[int, Path]]:
    items: list[tuple[int, Path]] = []
    pattern = re.compile(r"ind_(\d+)\.npy$")
    for path in case_dir.iterdir():
        match = pattern.match(path.name)
        if match:
            items.append((int(match.group(1)), path))
    return sorted(items, key=lambda item: item[0])


def mesh_from_voxels(coords_xyz: np.ndarray, color: list[int]) -> trimesh.Trimesh:
    if len(coords_xyz) == 0:
        raise ValueError("empty voxel part")
    grid = np.zeros((66, 66, 66), dtype=np.float32)
    coords = coords_xyz.astype(np.int64) + 1
    coords = coords[(coords[:, 0] >= 0) & (coords[:, 0] < 66) & (coords[:, 1] >= 0) & (coords[:, 1] < 66) & (coords[:, 2] >= 0) & (coords[:, 2] < 66)]
    grid[coords[:, 0], coords[:, 1], coords[:, 2]] = 1.0
    verts, faces, _normals, _values = measure.marching_cubes(grid, level=0.5)
    verts = verts - 1.0
    mesh = trimesh.Trimesh(vertices=verts, faces=faces, process=False)
    mesh.visual.vertex_colors = np.tile(np.asarray(color, dtype=np.uint8), (len(mesh.vertices), 1))
    return mesh


def bbox_report(coords: np.ndarray) -> dict:
    if len(coords) == 0:
        return {"voxel_count": 0}
    mn = coords.min(axis=0)
    mx = coords.max(axis=0)
    dims = mx - mn + 1
    return {
        "voxel_count": int(len(coords)),
        "min_xyz": mn.astype(int).tolist(),
        "max_xyz": mx.astype(int).tolist(),
        "dims_xyz": dims.astype(int).tolist(),
        "z_over_max_xy": round(float(dims[2] / max(dims[0], dims[1], 1)), 4),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--case-dir", required=True)
    parser.add_argument("--out-dir", default=None)
    args = parser.parse_args()

    case_dir = Path(args.case_dir)
    out_dir = Path(args.out_dir) if args.out_dir else case_dir / "voxel_mesh_fallback"
    parts_dir = out_dir / "parts"
    parts_dir.mkdir(parents=True, exist_ok=True)

    scene = trimesh.Scene()
    report = {
        "case_dir": str(case_dir),
        "out_dir": str(out_dir),
        "decoder": "skimage.measure.marching_cubes over generated 64^3 voxels",
        "is_trellis_decode": False,
        "parts": [],
    }

    all_coords = []
    for part_id, path in sorted_ind_files(case_dir):
        coords = np.load(path)
        part_report = {"part_id": part_id, "file": str(path), **bbox_report(coords)}
        if len(coords) == 0:
            part_report["status"] = "empty"
            report["parts"].append(part_report)
            continue

        color = COLORS[part_id % len(COLORS)]
        mesh = mesh_from_voxels(coords, color)
        stem = f"part_{part_id}"
        part_path = parts_dir / str(part_id)
        part_path.mkdir(parents=True, exist_ok=True)
        glb = part_path / f"{stem}.glb"
        obj = part_path / f"{stem}.obj"
        ply = part_path / f"{stem}.ply"
        mesh.export(glb)
        mesh.export(obj)
        mesh.export(ply)
        scene.add_geometry(mesh, node_name=stem, geom_name=stem)
        all_coords.append(coords)
        part_report.update(
            {
                "status": "success",
                "vertices": int(len(mesh.vertices)),
                "faces": int(len(mesh.faces)),
                "glb": str(glb),
                "obj": str(obj),
                "ply": str(ply),
            }
        )
        report["parts"].append(part_report)

    if all_coords:
        combined_coords = np.concatenate(all_coords, axis=0)
        report["combined_bbox"] = bbox_report(combined_coords)
        combined_glb = out_dir / "mms_yellow_body_focus_voxel_mesh_combined.glb"
        scene.export(combined_glb)
        report["combined_glb"] = str(combined_glb)

    report["success_count"] = sum(1 for p in report["parts"] if p.get("status") == "success")
    report_path = out_dir / "voxel_mesh_fallback_report.json"
    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0 if report["success_count"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
