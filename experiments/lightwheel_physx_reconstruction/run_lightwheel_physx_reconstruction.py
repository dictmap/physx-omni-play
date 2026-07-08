from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import shutil
import subprocess
import sys
import time
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont
from pxr import Gf, Sdf, Usd, UsdGeom, UsdPhysics, UsdShade


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_LIGHTWHEEL_ROOT = Path(
    r"C:\Users\robot\Documents\workplace\test\Lightwheel_OpenSource\Manipulation"
)
DEFAULT_ASSETS = [
    "Blender010",
    "Dishwasher036",
    "Microwave047",
    "Oven038",
    "Refrigerator038",
]
TEXT_LIMIT_LINES = 180


@dataclass
class BodyInfo:
    original_path: str
    generated_path: str
    name: str
    center: tuple[float, float, float]
    size: tuple[float, float, float]
    schemas: list[str]


@dataclass
class JointInfo:
    original_path: str
    generated_path: str
    type_name: str
    body0: str | None
    body1: str | None
    axis: str | None
    lower: float | None
    upper: float | None


def fail(message: str) -> None:
    raise SystemExit(message)


def safe_name(value: str) -> str:
    value = re.sub(r"[^A-Za-z0-9_]+", "_", value)
    value = value.strip("_")
    return value or "item"


def sha256_short(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()[:16]


def stage_counts(stage: Usd.Stage) -> dict[str, Any]:
    counts: Counter[str] = Counter()
    joint_types: Counter[str] = Counter()
    applied_schema_counts: Counter[str] = Counter()
    texture_refs: list[str] = []

    for prim in stage.Traverse():
        counts["prim"] += 1
        type_name = prim.GetTypeName() or "Unknown"
        counts[f"type:{type_name}"] += 1
        if type_name == "Mesh":
            counts["mesh"] += 1
        if type_name == "Material":
            counts["material"] += 1
        if type_name in {"PhysicsFixedJoint", "PhysicsRevoluteJoint", "PhysicsPrismaticJoint"}:
            counts["joint"] += 1
            joint_types[type_name] += 1
        for schema in prim.GetAppliedSchemas():
            applied_schema_counts[schema] += 1
            if schema == "PhysicsCollisionAPI":
                counts["collision"] += 1
            elif schema == "PhysicsRigidBodyAPI":
                counts["rigid_body"] += 1
            elif schema == "PhysicsMassAPI":
                counts["mass_api"] += 1

        for attr in prim.GetAttributes():
            value = attr.Get()
            if isinstance(value, Sdf.AssetPath) and value.path:
                texture_refs.append(value.path)

    default_prim = stage.GetDefaultPrim()
    return {
        "default_prim": str(default_prim.GetPath()) if default_prim else None,
        "meters_per_unit": UsdGeom.GetStageMetersPerUnit(stage),
        "up_axis": str(UsdGeom.GetStageUpAxis(stage)),
        "counts": dict(counts),
        "joint_types": dict(joint_types),
        "applied_schema_counts": dict(applied_schema_counts),
        "texture_ref_count": len(texture_refs),
        "texture_refs_sample": sorted(set(texture_refs))[:12],
    }


def attr_float(prim: Usd.Prim, attr_name: str) -> float | None:
    attr = prim.GetAttribute(attr_name)
    if not attr:
        return None
    value = attr.Get()
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def rel_target(prim: Usd.Prim, rel_name: str) -> str | None:
    rel = prim.GetRelationship(rel_name)
    if not rel:
        return None
    targets = rel.GetTargets()
    return str(targets[0]) if targets else None


def extract_bodies_and_joints(stage: Usd.Stage, asset_name: str) -> tuple[list[BodyInfo], list[JointInfo]]:
    bbox_cache = UsdGeom.BBoxCache(
        Usd.TimeCode.Default(),
        [UsdGeom.Tokens.default_, UsdGeom.Tokens.render],
        useExtentsHint=True,
    )
    bodies: list[BodyInfo] = []
    root = stage.GetPrimAtPath("/root")
    if not root:
        root = stage.GetDefaultPrim()

    candidate_prims: list[Usd.Prim] = []
    excluded_root_children = {"looks", "physics", "physicsscene", "joints"}
    for prim in stage.Traverse():
        schemas = prim.GetAppliedSchemas()
        path = str(prim.GetPath())
        lower_name = prim.GetName().lower()
        if prim.GetParent() == root and lower_name in excluded_root_children:
            continue
        if "PhysicsRigidBodyAPI" in schemas:
            candidate_prims.append(prim)
        elif prim.GetParent() == root and path not in {"/root/Looks"} and prim.GetTypeName() in {"Xform", "Scope"}:
            if not lower_name.endswith("joint"):
                candidate_prims.append(prim)

    seen: set[str] = set()
    for prim in candidate_prims:
        original_path = str(prim.GetPath())
        if original_path in seen:
            continue
        seen.add(original_path)
        try:
            aligned_range = bbox_cache.ComputeWorldBound(prim).ComputeAlignedRange()
            min_pt = aligned_range.GetMin()
            max_pt = aligned_range.GetMax()
            center = tuple(float((min_pt[i] + max_pt[i]) * 0.5) for i in range(3))
            size = tuple(max(float(max_pt[i] - min_pt[i]), 0.05) for i in range(3))
        except Exception:
            center = (0.0, 0.0, 0.0)
            size = (0.35, 0.35, 0.35)
        name = safe_name(prim.GetName())
        generated_path = f"/root/{safe_name(asset_name)}_{name}"
        bodies.append(
            BodyInfo(
                original_path=original_path,
                generated_path=generated_path,
                name=name,
                center=center,
                size=size,
                schemas=list(prim.GetAppliedSchemas()),
            )
        )

    body_map = {item.original_path: item.generated_path for item in bodies}
    joints: list[JointInfo] = []
    for prim in stage.Traverse():
        type_name = prim.GetTypeName()
        if type_name not in {"PhysicsFixedJoint", "PhysicsRevoluteJoint", "PhysicsPrismaticJoint"}:
            continue
        original_path = str(prim.GetPath())
        suffix = safe_name(original_path.replace("/root/", "").replace("/", "_"))
        generated_path = f"/root/Joints/{suffix}"
        axis_attr = prim.GetAttribute("axis")
        axis_value = axis_attr.Get() if axis_attr else None
        body0 = rel_target(prim, "physics:body0")
        body1 = rel_target(prim, "physics:body1")
        joints.append(
            JointInfo(
                original_path=original_path,
                generated_path=generated_path,
                type_name=type_name,
                body0=body_map.get(body0 or "", body0),
                body1=body_map.get(body1 or "", body1),
                axis=str(axis_value) if axis_value is not None else None,
                lower=attr_float(prim, "physics:lowerLimit"),
                upper=attr_float(prim, "physics:upperLimit"),
            )
        )
    return bodies, joints


def make_material(stage: Usd.Stage, path: str, color: tuple[float, float, float]) -> UsdShade.Material:
    material = UsdShade.Material.Define(stage, path)
    shader = UsdShade.Shader.Define(stage, f"{path}/PreviewSurface")
    shader.CreateIdAttr("UsdPreviewSurface")
    shader.CreateInput("diffuseColor", Sdf.ValueTypeNames.Color3f).Set(Gf.Vec3f(*color))
    shader.CreateInput("roughness", Sdf.ValueTypeNames.Float).Set(0.65)
    material.CreateSurfaceOutput().ConnectToSource(shader.ConnectableAPI(), "surface")
    return material


def define_box_mesh(stage: Usd.Stage, path: str, size: tuple[float, float, float]) -> UsdGeom.Mesh:
    sx, sy, sz = (max(float(value), 0.01) * 0.5 for value in size)
    points = [
        Gf.Vec3f(-sx, -sy, -sz),
        Gf.Vec3f(sx, -sy, -sz),
        Gf.Vec3f(sx, sy, -sz),
        Gf.Vec3f(-sx, sy, -sz),
        Gf.Vec3f(-sx, -sy, sz),
        Gf.Vec3f(sx, -sy, sz),
        Gf.Vec3f(sx, sy, sz),
        Gf.Vec3f(-sx, sy, sz),
    ]
    face_vertex_counts = [4, 4, 4, 4, 4, 4]
    face_vertex_indices = [
        0,
        1,
        2,
        3,
        4,
        7,
        6,
        5,
        0,
        4,
        5,
        1,
        1,
        5,
        6,
        2,
        2,
        6,
        7,
        3,
        3,
        7,
        4,
        0,
    ]
    mesh = UsdGeom.Mesh.Define(stage, path)
    mesh.CreatePointsAttr(points)
    mesh.CreateFaceVertexCountsAttr(face_vertex_counts)
    mesh.CreateFaceVertexIndicesAttr(face_vertex_indices)
    mesh.CreateSubdivisionSchemeAttr(UsdGeom.Tokens.none)
    return mesh


def write_generated_proxy_usda(
    asset_name: str,
    original_usd: Path,
    bodies: list[BodyInfo],
    joints: list[JointInfo],
    out_path: Path,
) -> None:
    stage = Usd.Stage.CreateNew(str(out_path))
    UsdGeom.SetStageMetersPerUnit(stage, 1.0)
    UsdGeom.SetStageUpAxis(stage, UsdGeom.Tokens.z)
    stage.SetTimeCodesPerSecond(24)

    root = UsdGeom.Xform.Define(stage, "/root").GetPrim()
    stage.SetDefaultPrim(root)
    root.SetMetadata("kind", "component")
    root.SetAssetInfoByKey("name", f"{asset_name}_physx_omni_structural_proxy")
    root.SetAssetInfoByKey("source_lightwheel_usd", str(original_usd))
    root.SetAssetInfoByKey("reconstruction_mode", "usd_structural_proxy_not_vlm_decoder_output")
    UsdPhysics.ArticulationRootAPI.Apply(root)
    UsdPhysics.Scene.Define(stage, "/root/PhysicsScene")

    looks = UsdGeom.Scope.Define(stage, "/root/Looks")
    material = make_material(stage, "/root/Looks/ProxyBodyMaterial", (0.45, 0.62, 0.80))
    collision_material = make_material(stage, "/root/Looks/CollisionProxyMaterial", (0.95, 0.72, 0.28))
    UsdGeom.Scope.Define(stage, "/root/Joints")

    for body in bodies:
        xform = UsdGeom.Xform.Define(stage, body.generated_path)
        xform.AddTranslateOp().Set(Gf.Vec3d(*body.center))
        UsdPhysics.RigidBodyAPI.Apply(xform.GetPrim())
        mass = UsdPhysics.MassAPI.Apply(xform.GetPrim())
        mass.CreateMassAttr(max(0.1, round((body.size[0] * body.size[1] * body.size[2]) * 10.0, 4)))

        visuals = UsdGeom.Scope.Define(stage, f"{body.generated_path}/Visuals")
        visual_mesh = define_box_mesh(stage, f"{body.generated_path}/Visuals/{body.name}_bbox_mesh", body.size)
        UsdGeom.Imageable(visual_mesh.GetPrim()).CreatePurposeAttr(UsdGeom.Tokens.render)
        UsdShade.MaterialBindingAPI.Apply(visual_mesh.GetPrim()).Bind(material)
        _ = visuals

        collisions = UsdGeom.Scope.Define(stage, f"{body.generated_path}/Collisions")
        collision_cube = UsdGeom.Cube.Define(stage, f"{body.generated_path}/Collisions/{body.name}_collision_proxy")
        collision_cube.CreateSizeAttr(1.0)
        collision_cube.AddScaleOp().Set(Gf.Vec3f(*body.size))
        UsdGeom.Imageable(collision_cube.GetPrim()).CreatePurposeAttr(UsdGeom.Tokens.proxy)
        UsdGeom.Imageable(collision_cube.GetPrim()).CreateVisibilityAttr(UsdGeom.Tokens.invisible)
        UsdPhysics.CollisionAPI.Apply(collision_cube.GetPrim())
        UsdShade.MaterialBindingAPI.Apply(collision_cube.GetPrim()).Bind(collision_material)
        _ = collisions

    for joint in joints:
        joint_path = Sdf.Path(joint.generated_path)
        if joint.type_name == "PhysicsFixedJoint":
            joint_prim = UsdPhysics.FixedJoint.Define(stage, joint_path)
        elif joint.type_name == "PhysicsRevoluteJoint":
            joint_prim = UsdPhysics.RevoluteJoint.Define(stage, joint_path)
            if joint.axis:
                joint_prim.CreateAxisAttr(joint.axis)
            if joint.lower is not None:
                joint_prim.CreateLowerLimitAttr(joint.lower)
            if joint.upper is not None:
                joint_prim.CreateUpperLimitAttr(joint.upper)
        elif joint.type_name == "PhysicsPrismaticJoint":
            joint_prim = UsdPhysics.PrismaticJoint.Define(stage, joint_path)
            if joint.axis:
                joint_prim.CreateAxisAttr(joint.axis)
            if joint.lower is not None:
                joint_prim.CreateLowerLimitAttr(joint.lower)
            if joint.upper is not None:
                joint_prim.CreateUpperLimitAttr(joint.upper)
        else:
            continue
        if joint.body0:
            joint_prim.CreateBody0Rel().SetTargets([Sdf.Path(joint.body0)])
        if joint.body1:
            joint_prim.CreateBody1Rel().SetTargets([Sdf.Path(joint.body1)])

    stage.GetRootLayer().Save()


def stage_text_excerpt(stage: Usd.Stage, out_path: Path, limit_lines: int = TEXT_LIMIT_LINES) -> dict[str, Any]:
    text = stage.ExportToString()
    lines = text.splitlines()
    excerpt = "\n".join(lines[:limit_lines])
    if len(lines) > limit_lines:
        excerpt += f"\n# ... 截断：完整 stage 导出共 {len(lines)} 行，本实验只嵌入前 {limit_lines} 行。"
    out_path.write_text(excerpt + "\n", encoding="utf-8")
    return {"line_count": len(lines), "excerpt_path": str(out_path), "excerpt": excerpt}


def try_usdrecord(usd_path: Path, out_png: Path) -> dict[str, Any]:
    usdrecord = shutil.which("usdrecord") or shutil.which("usdrecord.cmd")
    if not usdrecord:
        return {"status": "missing_tool", "command": ["usdrecord"], "elapsed_sec": 0.0}
    cmd = [
        usdrecord,
        "--disableGpu",
        "--imageWidth",
        "512",
        str(usd_path),
        str(out_png),
    ]
    started = time.time()
    try:
        proc = subprocess.run(
            cmd,
            cwd=ROOT,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=45,
        )
    except FileNotFoundError:
        return {"status": "missing_tool", "command": cmd, "elapsed_sec": 0.0}
    except subprocess.TimeoutExpired as exc:
        return {
            "status": "timeout",
            "command": cmd,
            "elapsed_sec": round(time.time() - started, 2),
            "stdout": exc.stdout or "",
            "stderr": exc.stderr or "",
        }
    return {
        "status": "success" if proc.returncode == 0 and out_png.is_file() else "failed",
        "returncode": proc.returncode,
        "command": cmd,
        "elapsed_sec": round(time.time() - started, 2),
        "stdout_tail": proc.stdout[-1600:],
        "stderr_tail": proc.stderr[-1600:],
        "image": str(out_png) if out_png.is_file() else None,
    }


def write_fallback_projection(asset_name: str, bodies: list[BodyInfo], out_png: Path) -> None:
    width, height = 900, 560
    image = Image.new("RGB", (width, height), (18, 23, 31))
    draw = ImageDraw.Draw(image)

    def load_font(size: int) -> ImageFont.ImageFont:
        for font_path in [
            r"C:\Windows\Fonts\msyh.ttc",
            r"C:\Windows\Fonts\simhei.ttf",
            r"C:\Windows\Fonts\arial.ttf",
        ]:
            try:
                return ImageFont.truetype(font_path, size)
            except OSError:
                continue
        return ImageFont.load_default()

    font = load_font(18)
    small = load_font(13)

    draw.text((24, 18), f"{asset_name} USD 结构投影（非真实渲染）", fill=(238, 243, 248), font=font)
    draw.text((24, 46), "usdrecord 在本机无 renderer plugin 时使用该 fallback；仅用于检查 body bbox 与部件覆盖。", fill=(168, 182, 198), font=small)

    if not bodies:
        draw.text((24, 100), "未提取到 body。", fill=(228, 182, 64), font=font)
        image.save(out_png)
        return

    xs = [b.center[0] for b in bodies]
    zs = [b.center[2] for b in bodies]
    sx = [b.size[0] for b in bodies]
    sz = [b.size[2] for b in bodies]
    min_x = min(x - s * 0.5 for x, s in zip(xs, sx))
    max_x = max(x + s * 0.5 for x, s in zip(xs, sx))
    min_z = min(z - s * 0.5 for z, s in zip(zs, sz))
    max_z = max(z + s * 0.5 for z, s in zip(zs, sz))
    span_x = max(max_x - min_x, 1e-3)
    span_z = max(max_z - min_z, 1e-3)

    colors = [
        (95, 208, 196),
        (228, 182, 64),
        (121, 168, 255),
        (238, 130, 116),
        (170, 142, 242),
        (141, 212, 126),
    ]

    left, top, plot_w, plot_h = 70, 92, 760, 390
    draw.rectangle((left, top, left + plot_w, top + plot_h), outline=(64, 78, 94), width=1)
    for i, body in enumerate(bodies):
        color = colors[i % len(colors)]
        cx = left + ((body.center[0] - min_x) / span_x) * plot_w
        cz = top + plot_h - ((body.center[2] - min_z) / span_z) * plot_h
        bw = max(8, (body.size[0] / span_x) * plot_w)
        bh = max(8, (body.size[2] / span_z) * plot_h)
        rect = (cx - bw * 0.5, cz - bh * 0.5, cx + bw * 0.5, cz + bh * 0.5)
        draw.rectangle(rect, outline=color, width=2)
        draw.text((rect[0] + 3, rect[1] + 3), body.name[:22], fill=color, font=small)

    draw.text((24, 510), f"body={len(bodies)}；坐标投影：X-Z；碰撞/材质/真实外观请以 USD 和 HTML 对比表为准。", fill=(168, 182, 198), font=small)
    image.save(out_png)


def rel(path: Path, base: Path) -> str:
    return path.relative_to(base).as_posix()


def compare_counts(original: dict[str, Any], generated: dict[str, Any]) -> dict[str, Any]:
    keys = ["prim", "mesh", "material", "collision", "rigid_body", "mass_api", "joint"]
    rows = []
    for key in keys:
        o = int(original["counts"].get(key, 0))
        g = int(generated["counts"].get(key, 0))
        rows.append(
            {
                "metric": key,
                "original": o,
                "generated": g,
                "delta": g - o,
                "ratio": round(g / o, 3) if o else None,
            }
        )
    joint_types = sorted(set(original["joint_types"]) | set(generated["joint_types"]))
    joint_rows = []
    for key in joint_types:
        o = int(original["joint_types"].get(key, 0))
        g = int(generated["joint_types"].get(key, 0))
        joint_rows.append({"type": key, "original": o, "generated": g, "delta": g - o})
    return {"count_rows": rows, "joint_rows": joint_rows}


def html_table(headers: list[str], rows: list[dict[str, Any]]) -> str:
    cells = ["<table><thead><tr>"]
    for header in headers:
        cells.append(f"<th>{html.escape(header)}</th>")
    cells.append("</tr></thead><tbody>")
    for row in rows:
        cells.append("<tr>")
        for header in headers:
            value = row.get(header, "")
            cells.append(f"<td>{html.escape(str(value))}</td>")
        cells.append("</tr>")
    cells.append("</tbody></table>")
    return "".join(cells)


def write_html_report(out_dir: Path, summary: dict[str, Any]) -> Path:
    asset_sections: list[str] = []
    overview_rows: list[dict[str, Any]] = []
    for asset in summary["assets"]:
        comparison = asset["comparison"]
        original = asset["original"]
        generated = asset["generated"]
        overview_rows.append(
            {
                "asset": asset["asset_name"],
                "original_mesh": original["counts"].get("mesh", 0),
                "generated_mesh": generated["counts"].get("mesh", 0),
                "original_joint": original["counts"].get("joint", 0),
                "generated_joint": generated["counts"].get("joint", 0),
                "generated_usda": asset["generated_usda_rel"],
                "physx_status": asset["physx_omni_attempt"]["status"],
            }
        )

        count_rows = [
            {
                "metric": row["metric"],
                "original": row["original"],
                "generated": row["generated"],
                "delta": row["delta"],
                "ratio": "" if row["ratio"] is None else row["ratio"],
            }
            for row in comparison["count_rows"]
        ]
        joint_rows = [
            {
                "type": row["type"],
                "original": row["original"],
                "generated": row["generated"],
                "delta": row["delta"],
            }
            for row in comparison["joint_rows"]
        ]

        original_excerpt = Path(asset["original_excerpt_path"]).read_text(encoding="utf-8")
        generated_text = Path(asset["generated_usda"]).read_text(encoding="utf-8")
        projection = asset["projection_rel"]
        render_status = asset["render_attempt"]["status"]
        render_error = asset["render_attempt"].get("stderr_tail") or asset["render_attempt"].get("stdout_tail") or ""

        asset_sections.append(
            f"""
            <section class="asset">
              <h2>{html.escape(asset['asset_name'])}</h2>
              <div class="asset-grid">
                <div>
                  <img src="{html.escape(projection)}" alt="{html.escape(asset['asset_name'])} 结构投影" />
                  <p class="muted">预览来源：{html.escape(asset['projection_kind'])}；usdrecord 状态：<code>{html.escape(render_status)}</code></p>
                </div>
                <div>
                  <h3>路径与状态</h3>
                  <p><b>原始 USD：</b><code>{html.escape(asset['original_usd'])}</code></p>
                  <p><b>生成 USDA：</b><a href="{html.escape(asset['generated_usda_rel'])}">{html.escape(asset['generated_usda_rel'])}</a></p>
                  <p><b>原始 SHA256：</b><code>{html.escape(asset['source_sha256_short'])}</code></p>
                  <p><b>PhysX-Omni 模型重建：</b><code>{html.escape(asset['physx_omni_attempt']['status'])}</code></p>
                  <p class="warning">{html.escape(asset['physx_omni_attempt']['message'])}</p>
                </div>
              </div>
              <h3>数量对比</h3>
              {html_table(['metric', 'original', 'generated', 'delta', 'ratio'], count_rows)}
              <h3>关节类型对比</h3>
              {html_table(['type', 'original', 'generated', 'delta'], joint_rows)}
              <h3>生成解释</h3>
              <ul>
                <li>生成 USDA 是本分支的结构化 proxy：它从 Lightwheel USD 提取 body bbox、刚体和 joint skeleton，再写成可读 USDA。</li>
                <li>它不是 PhysX-Omni VLM/decoder 的真实输出；真实 PhysX-Omni 需要条件图、模型权重和 4090 运行环境。</li>
                <li>本 proxy 用来建立 USD->PhysX-Omni 实验 harness、HTML 对比和质量基线，不能声称高保真重建成功。</li>
              </ul>
              <details>
                <summary>原始 USD 文本摘录（由 pxr Stage.ExportToString 生成，已截断）</summary>
                <pre>{html.escape(original_excerpt)}</pre>
              </details>
              <details>
                <summary>生成 USDA 全文</summary>
                <pre>{html.escape(generated_text)}</pre>
              </details>
              <details>
                <summary>usdrecord/渲染尝试输出</summary>
                <pre>{html.escape(render_error or json.dumps(asset['render_attempt'], ensure_ascii=False, indent=2))}</pre>
              </details>
            </section>
            """
        )

    style = """
    :root { color-scheme: light; --bg:#f6f8fb; --panel:#ffffff; --ink:#17202a; --muted:#627386; --line:#d9e1ea; --accent:#205e8a; --warn:#a15d00; }
    * { box-sizing: border-box; }
    body { margin:0; background:var(--bg); color:var(--ink); font-family: Inter, "Microsoft YaHei", system-ui, sans-serif; line-height:1.55; }
    header, main { width:min(1180px, calc(100% - 32px)); margin:0 auto; }
    header { padding:32px 0 18px; }
    h1 { margin:0 0 10px; font-size:34px; }
    h2 { margin-top:0; }
    code { background:#edf2f7; border:1px solid var(--line); border-radius:5px; padding:1px 5px; }
    .summary, .asset { background:var(--panel); border:1px solid var(--line); border-radius:8px; padding:18px; margin:18px 0; }
    .asset-grid { display:grid; grid-template-columns: minmax(320px, 0.9fr) minmax(320px, 1.1fr); gap:18px; align-items:start; }
    img { width:100%; border:1px solid var(--line); border-radius:6px; background:#111827; }
    table { width:100%; border-collapse: collapse; margin:10px 0 18px; font-size:14px; }
    th, td { text-align:left; border-bottom:1px solid var(--line); padding:8px 9px; vertical-align:top; }
    th { background:#edf2f7; }
    pre { white-space:pre-wrap; overflow:auto; max-height:520px; background:#101820; color:#ecf4ff; padding:14px; border-radius:6px; font-size:12px; }
    .muted { color:var(--muted); }
    .warning { color:var(--warn); font-weight:600; }
    @media (max-width: 820px) { .asset-grid { grid-template-columns:1fr; } }
    """
    html_text = f"""<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Lightwheel -> PhysX-Omni 重建实验</title>
    <style>{style}</style>
  </head>
  <body>
    <header>
      <h1>Lightwheel 多资产输入 -> PhysX-Omni 重建分支实验</h1>
      <p class="muted">生成时间：{html.escape(summary['generated_at'])}；样本数：{len(summary['assets'])}；分支目标：建立 Lightwheel USD 输入、生成 USDA 输出和详细对比 HTML 的可复跑 harness。</p>
    </header>
    <main>
      <section class="summary">
        <h2>实验结论边界</h2>
        <ul>
          <li>已完成：读取多个 Lightwheel 原始 USD，抽取结构/关节/材质/碰撞统计，生成可打开的结构 proxy USDA，并生成本 HTML 对比报告。</li>
          <li>未完成：真实 PhysX-Omni VLM/decoder 重建没有执行，因为本地 `hf/PhysX-Omni-model` 只有缓存元数据，没有模型权重；`usdrecord` 本机也缺 renderer plugin，无法生成真实条件渲染图。</li>
          <li>当前生成 USDA 不能声称为 PhysX-Omni 论文方法成功结果，只能作为分支 harness 和 USD-to-reconstruction proxy baseline。</li>
        </ul>
        <h2>总览</h2>
        {html_table(['asset', 'original_mesh', 'generated_mesh', 'original_joint', 'generated_joint', 'generated_usda', 'physx_status'], overview_rows)}
      </section>
      {''.join(asset_sections)}
    </main>
  </body>
</html>
"""
    report_path = out_dir / "index.html"
    report_path.write_text(html_text, encoding="utf-8")
    return report_path


def run(args: argparse.Namespace) -> dict[str, Any]:
    lightwheel_root = Path(args.lightwheel_root)
    if not lightwheel_root.is_dir():
        fail(f"Lightwheel root not found: {lightwheel_root}")
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    model_dir = ROOT / "hf" / "PhysX-Omni-model"
    model_files = [p for p in model_dir.rglob("*") if p.is_file()] if model_dir.is_dir() else []
    has_real_model = any(p.suffix in {".safetensors", ".bin"} for p in model_files)

    summary: dict[str, Any] = {
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "lightwheel_root": str(lightwheel_root),
        "physx_omni_repo": str(ROOT / "code" / "PhysX-Omni"),
        "physx_omni_model_dir": str(model_dir),
        "physx_omni_model_file_count": len(model_files),
        "physx_omni_has_real_weight_file": has_real_model,
        "assets": [],
    }

    for asset_name in args.assets:
        usd_path = lightwheel_root / asset_name / f"{asset_name}.usd"
        if not usd_path.is_file():
            fail(f"Missing Lightwheel USD for {asset_name}: {usd_path}")
        asset_out = out_dir / asset_name
        asset_out.mkdir(parents=True, exist_ok=True)
        stage = Usd.Stage.Open(str(usd_path))
        if stage is None:
            fail(f"Failed to open USD: {usd_path}")

        original_counts = stage_counts(stage)
        bodies, joints = extract_bodies_and_joints(stage, asset_name)

        original_excerpt = stage_text_excerpt(stage, asset_out / "original_usd_excerpt.usda.txt")
        generated_usda = asset_out / f"{asset_name}_physx_omni_structural_proxy.usda"
        write_generated_proxy_usda(asset_name, usd_path, bodies, joints, generated_usda)
        generated_stage = Usd.Stage.Open(str(generated_usda))
        generated_counts = stage_counts(generated_stage)

        render_png = asset_out / f"{asset_name}_usdrecord.png"
        render_attempt = try_usdrecord(usd_path, render_png) if args.try_usdrecord else {"status": "skipped"}
        if render_attempt.get("status") == "success" and render_png.is_file():
            projection_png = render_png
            projection_kind = "usdrecord"
        else:
            projection_png = asset_out / f"{asset_name}_bbox_projection.png"
            write_fallback_projection(asset_name, bodies, projection_png)
            projection_kind = "bbox_projection_fallback"

        physx_attempt = {
            "status": "not_run_missing_model_weights" if not has_real_model else "not_run_requires_gpu_pipeline",
            "message": (
                "本地 hf/PhysX-Omni-model 没有 safetensors/bin 权重文件，无法执行 1vlm_demo.py / 2infer_geo.py。"
                if not has_real_model
                else "检测到模型文件，但当前脚本只完成 USD harness；真实 VLM/decoder 需要 4090 环境运行。"
            ),
            "intended_commands": [
                "python run_vlm_repro_one.py --repo code/PhysX-Omni --model-path hf/PhysX-Omni-model --image <condition_image> --output-root <run_dir> --mode 4bit",
                "bash reproduce_quality.sh RUN_BASE=<vlm_output_root>",
            ],
        }

        asset_summary = {
            "asset_name": asset_name,
            "original_usd": str(usd_path),
            "source_sha256_short": sha256_short(usd_path),
            "source_size_bytes": usd_path.stat().st_size,
            "original": original_counts,
            "generated": generated_counts,
            "bodies_extracted": [body.__dict__ for body in bodies],
            "joints_extracted": [joint.__dict__ for joint in joints],
            "generated_usda": str(generated_usda),
            "generated_usda_rel": rel(generated_usda, out_dir),
            "original_excerpt_path": str(Path(original_excerpt["excerpt_path"])),
            "projection": str(projection_png),
            "projection_rel": rel(projection_png, out_dir),
            "projection_kind": projection_kind,
            "render_attempt": render_attempt,
            "physx_omni_attempt": physx_attempt,
            "comparison": compare_counts(original_counts, generated_counts),
        }
        (asset_out / "asset_comparison.json").write_text(
            json.dumps(asset_summary, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        summary["assets"].append(asset_summary)

    summary_path = out_dir / "summary.json"
    summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    report_path = write_html_report(out_dir, summary)
    summary["summary_path"] = str(summary_path)
    summary["html_report"] = str(report_path)
    summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    return summary


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lightwheel-root", default=str(DEFAULT_LIGHTWHEEL_ROOT))
    parser.add_argument("--out", default=str(ROOT / "experiments" / "lightwheel_physx_reconstruction" / "run_latest"))
    parser.add_argument("--assets", nargs="+", default=DEFAULT_ASSETS)
    parser.add_argument("--try-usdrecord", action="store_true")
    args = parser.parse_args()
    summary = run(args)
    print(json.dumps({"html_report": summary["html_report"], "assets": [a["asset_name"] for a in summary["assets"]]}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
