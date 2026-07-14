from __future__ import annotations

import argparse
import math
from pathlib import Path
import sys

import bpy
from mathutils import Matrix, Vector

sys.path.insert(0, str(Path(__file__).resolve().parent))

from render_true_physx_video import (
    bounds,
    clear_scene,
    import_glbs,
    look_at,
    mesh_objects,
    repo_path,
    setup_materials,
)


def part_index(obj: bpy.types.Object) -> int | None:
    if not obj.name.startswith("part_"):
        return None
    try:
        return int(obj.name.split("_")[1])
    except (IndexError, ValueError):
        return None


def center_scene_keep_parts(objects: list[bpy.types.Object]) -> None:
    mins, maxs = bounds(objects)
    center = (mins + maxs) * 0.5
    for obj in objects:
        obj.location -= center


def group_by_part(objects: list[bpy.types.Object]) -> dict[int, list[bpy.types.Object]]:
    parts: dict[int, list[bpy.types.Object]] = {}
    for obj in mesh_objects(objects):
        idx = part_index(obj)
        if idx is not None:
            parts.setdefault(idx, []).append(obj)
    return parts


def bbox_for_objects(objects: list[bpy.types.Object]) -> tuple[Vector, Vector]:
    return bounds(objects)


def rotate_objects_about_pivot(
    objects: list[bpy.types.Object],
    pivot: Vector,
    axis: str,
    angle_deg: float,
) -> None:
    angle = math.radians(angle_deg)
    axis_vec = {
        "X": Vector((1, 0, 0)),
        "Y": Vector((0, 1, 0)),
        "Z": Vector((0, 0, 1)),
    }[axis]
    rot = Matrix.Rotation(angle, 4, axis_vec)
    for obj in objects:
        obj.matrix_world = Matrix.Translation(pivot) @ rot @ Matrix.Translation(-pivot) @ obj.matrix_world


def setup_camera(objects: list[bpy.types.Object], out: Path) -> None:
    mins, maxs = bounds(objects)
    diagonal = max((maxs - mins).length, 1.0)
    bpy.ops.object.light_add(type="AREA", location=(0.0, -3.2, 4.0))
    key = bpy.context.object
    key.data.energy = 650
    key.data.size = 5.0
    bpy.ops.object.camera_add(location=(1.85, -2.45, 1.05))
    camera = bpy.context.object
    look_at(camera, Vector((0, 0, 0)))
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = diagonal * 1.35
    bpy.context.scene.camera = camera
    bpy.context.scene.render.engine = "BLENDER_EEVEE_NEXT"
    bpy.context.scene.eevee.taa_render_samples = 24
    bpy.context.scene.render.resolution_x = 1280
    bpy.context.scene.render.resolution_y = 720
    bpy.context.scene.render.filepath = str(out)
    bpy.context.scene.render.image_settings.file_format = "PNG"
    bpy.context.scene.render.image_settings.color_mode = "RGB"
    bpy.context.scene.world = bpy.context.scene.world or bpy.data.worlds.new("World")
    bpy.context.scene.world.color = (0.92, 0.94, 0.96)


def render_candidate(glb_root: Path, out: Path, pivot_side: str, axis: str, angle_deg: float) -> None:
    clear_scene()
    objects = import_glbs(glb_root)
    center_scene_keep_parts(objects)
    setup_materials(objects, clean_materials=True)
    parts = group_by_part(objects)
    door = parts.get(1, [])
    if not door:
        raise RuntimeError("part 1 Door was not imported")
    dmin, dmax = bbox_for_objects(door)
    pivot = Vector(
        (
            dmin.x if "xmin" in pivot_side else dmax.x if "xmax" in pivot_side else (dmin.x + dmax.x) * 0.5,
            dmin.y if "ymin" in pivot_side else dmax.y if "ymax" in pivot_side else (dmin.y + dmax.y) * 0.5,
            dmin.z if "zmin" in pivot_side else dmax.z if "zmax" in pivot_side else (dmin.z + dmax.z) * 0.5,
        )
    )
    rotate_objects_about_pivot(door, pivot, axis, angle_deg)
    setup_camera(objects, out)
    bpy.ops.render.render(write_still=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--glb-root", required=True)
    parser.add_argument("--out-dir", required=True)
    args = parser.parse_args(sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:])
    glb_root = repo_path(args.glb_root)
    out_dir = repo_path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    candidates = [
        ("identity", "center", "Z", 0),
        ("z_xmin_p90", "xmin", "Z", 90),
        ("z_xmin_n90", "xmin", "Z", -90),
        ("z_xmax_p90", "xmax", "Z", 90),
        ("z_xmax_n90", "xmax", "Z", -90),
        ("x_ymin_p90", "ymin", "X", 90),
        ("x_ymin_n90", "ymin", "X", -90),
        ("y_xmin_p90", "xmin", "Y", 90),
        ("y_xmin_n90", "xmin", "Y", -90),
    ]
    for name, pivot_side, axis, angle in candidates:
        render_candidate(glb_root, out_dir / f"{name}.png", pivot_side, axis, angle)


if __name__ == "__main__":
    main()
