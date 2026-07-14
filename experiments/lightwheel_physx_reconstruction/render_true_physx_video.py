from __future__ import annotations

import argparse
import math
from pathlib import Path
import sys

import bpy
from mathutils import Vector


REPO_ROOT = Path(__file__).resolve().parents[2]


def repo_path(path: str | Path) -> Path:
    value = Path(path)
    if value.is_absolute():
        return value
    return REPO_ROOT / value


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def import_glbs(glb_root: Path) -> list[bpy.types.Object]:
    imported: list[bpy.types.Object] = []
    for glb in sorted(glb_root.glob("objs/*/*.glb"), key=lambda p: int(p.parent.name)):
        before = set(bpy.data.objects)
        bpy.ops.import_scene.gltf(filepath=str(glb))
        new_objects = [obj for obj in bpy.data.objects if obj not in before]
        for obj in new_objects:
            obj.name = f"part_{glb.parent.name}_{obj.name}"
        imported.extend(new_objects)
    return imported


def mesh_objects(objects: list[bpy.types.Object]) -> list[bpy.types.Object]:
    return [obj for obj in objects if obj.type == "MESH"]


def bounds(objects: list[bpy.types.Object]) -> tuple[Vector, Vector]:
    mins = Vector((math.inf, math.inf, math.inf))
    maxs = Vector((-math.inf, -math.inf, -math.inf))
    for obj in mesh_objects(objects):
        for corner in obj.bound_box:
            world = obj.matrix_world @ Vector(corner)
            mins.x = min(mins.x, world.x)
            mins.y = min(mins.y, world.y)
            mins.z = min(mins.z, world.z)
            maxs.x = max(maxs.x, world.x)
            maxs.y = max(maxs.y, world.y)
            maxs.z = max(maxs.z, world.z)
    return mins, maxs


def center_scene(objects: list[bpy.types.Object]) -> bpy.types.Object:
    mins, maxs = bounds(objects)
    center = (mins + maxs) * 0.5

    root = bpy.data.objects.new("physx_omni_current_version", None)
    bpy.context.collection.objects.link(root)
    for obj in objects:
        if obj.parent is None:
            obj.parent = root
        obj.location -= center
    return root


def look_at(obj: bpy.types.Object, target: Vector) -> None:
    direction = target - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def setup_camera_and_lights(objects: list[bpy.types.Object]) -> None:
    mins, maxs = bounds(objects)
    size = maxs - mins
    diagonal = max(size.length, 1.0)

    bpy.ops.object.light_add(type="AREA", location=(0.0, -3.2, 4.0))
    key = bpy.context.object
    key.name = "large_softbox"
    key.data.energy = 650
    key.data.size = 5.0

    bpy.ops.object.light_add(type="POINT", location=(-2.2, 2.4, 1.8))
    fill = bpy.context.object
    fill.name = "soft_fill"
    fill.data.energy = 55

    bpy.ops.object.camera_add(location=(1.85, -2.45, 1.05))
    camera = bpy.context.object
    look_at(camera, Vector((0, 0, 0)))
    camera.data.lens = 45
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = diagonal * 1.35
    bpy.context.scene.camera = camera

    bpy.context.scene.world = bpy.context.scene.world or bpy.data.worlds.new("World")
    bpy.context.scene.world.color = (0.92, 0.94, 0.96)


def material_for_part(part_idx: int, clean: bool) -> bpy.types.Material:
    if clean:
        colors = [
            (0.74, 0.76, 0.75, 1.0),
            (0.55, 0.68, 0.72, 0.62),
            (0.18, 0.22, 0.27, 1.0),
            (0.06, 0.06, 0.06, 1.0),
            (0.06, 0.06, 0.06, 1.0),
            (0.06, 0.06, 0.06, 1.0),
            (0.06, 0.06, 0.06, 1.0),
        ]
        mat = bpy.data.materials.new(f"clean_part_{part_idx}")
        mat.diffuse_color = colors[part_idx % len(colors)]
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        if bsdf:
            bsdf.inputs["Base Color"].default_value = colors[part_idx % len(colors)]
            bsdf.inputs["Roughness"].default_value = 0.64
            bsdf.inputs["Metallic"].default_value = 0.0
            if part_idx == 1:
                bsdf.inputs["Alpha"].default_value = 0.56
                mat.blend_method = "BLEND"
                mat.use_screen_refraction = True
        return mat

    palette = [
        (0.72, 0.76, 0.80, 1.0),
        (0.18, 0.24, 0.32, 1.0),
        (0.96, 0.76, 0.28, 1.0),
        (0.12, 0.12, 0.12, 1.0),
        (0.10, 0.10, 0.10, 1.0),
        (0.10, 0.10, 0.10, 1.0),
        (0.10, 0.10, 0.10, 1.0),
    ]
    mat = bpy.data.materials.new(f"part_{part_idx}_fallback")
    mat.diffuse_color = palette[part_idx % len(palette)]
    return mat


def setup_materials(objects: list[bpy.types.Object], clean_materials: bool = False) -> None:
    for obj in mesh_objects(objects):
        part_idx = 0
        if obj.name.startswith("part_"):
            try:
                part_idx = int(obj.name.split("_")[1])
            except (IndexError, ValueError):
                part_idx = 0
        if obj.data.materials and not clean_materials:
            continue
        obj.data.materials.clear()
        mat = material_for_part(part_idx, clean_materials)
        obj.data.materials.append(mat)


def animate(root: bpy.types.Object, frame_count: int) -> None:
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = frame_count
    root.rotation_euler = (0, 0, 0)
    root.keyframe_insert(data_path="rotation_euler", frame=1)
    root.rotation_euler = (0, 0, math.tau)
    root.keyframe_insert(data_path="rotation_euler", frame=frame_count)
    if root.animation_data and root.animation_data.action:
        for fc in root.animation_data.action.fcurves:
            for kp in fc.keyframe_points:
                kp.interpolation = "LINEAR"


def setup_render(output: Path, frame_count: int, fps: int, frame_dir: Path | None = None) -> None:
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE_NEXT"
    scene.eevee.taa_render_samples = 24
    scene.render.resolution_x = 1280
    scene.render.resolution_y = 720
    scene.render.fps = fps
    scene.frame_start = 1
    scene.frame_end = frame_count
    scene.render.film_transparent = False
    if frame_dir is not None:
        frame_dir.mkdir(parents=True, exist_ok=True)
        scene.render.filepath = str(frame_dir / "frame_")
        scene.render.image_settings.file_format = "PNG"
        scene.render.image_settings.color_mode = "RGB"
    else:
        scene.render.filepath = str(output)
        scene.render.image_settings.file_format = "FFMPEG"
        scene.render.ffmpeg.format = "MPEG4"
        scene.render.ffmpeg.codec = "H264"
        scene.render.ffmpeg.constant_rate_factor = "MEDIUM"
        scene.render.ffmpeg.ffmpeg_preset = "GOOD"


def render_video(
    glb_root: Path,
    output: Path,
    frame_count: int,
    fps: int,
    frame_dir: Path | None = None,
    save_blend: bool = False,
    clean_materials: bool = False,
) -> None:
    clear_scene()
    objects = import_glbs(glb_root)
    if not mesh_objects(objects):
        raise RuntimeError(f"No mesh objects imported from {glb_root}")
    root = center_scene(objects)
    setup_materials(objects, clean_materials)
    setup_camera_and_lights(objects)
    animate(root, frame_count)
    setup_render(output, frame_count, fps, frame_dir)
    if save_blend:
        bpy.ops.wm.save_as_mainfile(filepath=str(output.with_suffix(".blend")))
    bpy.ops.render.render(animation=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--glb-root", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--frames", type=int, default=72)
    parser.add_argument("--fps", type=int, default=24)
    parser.add_argument("--frame-dir")
    parser.add_argument("--save-blend", action="store_true")
    parser.add_argument("--clean-materials", action="store_true")
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:]
    args = parser.parse_args(argv)
    render_video(
        repo_path(args.glb_root),
        repo_path(args.output),
        args.frames,
        args.fps,
        repo_path(args.frame_dir) if args.frame_dir else None,
        args.save_blend,
        args.clean_materials,
    )


if __name__ == "__main__":
    main()
