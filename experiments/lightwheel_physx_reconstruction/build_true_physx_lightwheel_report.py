from __future__ import annotations

import argparse
from collections import Counter
import html
import json
from pathlib import Path
import re
from typing import Any


def read_json(path: Path) -> dict[str, Any]:
    if not path.is_file():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def read_text(path: Path, limit: int = 80_000) -> str:
    if not path.is_file():
        return ""
    text = path.read_text(encoding="utf-8", errors="replace")
    if len(text) > limit:
        return text[:limit] + f"\n\n... truncated, full file: {path.name}"
    return text


def rel(path: Path, root: Path) -> str:
    return path.relative_to(root).as_posix()


def file_size(path: Path) -> str:
    size = path.stat().st_size
    units = ["B", "KB", "MB", "GB"]
    value = float(size)
    for unit in units:
        if value < 1024 or unit == units[-1]:
            return f"{value:.1f} {unit}" if unit != "B" else f"{int(value)} B"
        value /= 1024
    return f"{size} B"


def pct(value: int | float, total: int | float) -> str:
    if not total:
        return "n/a"
    return f"{(float(value) / float(total) * 100):.2f}%"


def compare_usda_lines(original_usda: Path, proxy_usda: Path) -> dict[str, Any]:
    if not original_usda.is_file() or not proxy_usda.is_file():
        return {"available": False}

    original_lines = original_usda.read_text(encoding="utf-8", errors="replace").splitlines()
    proxy_lines = proxy_usda.read_text(encoding="utf-8", errors="replace").splitlines()
    max_lines = max(len(original_lines), len(proxy_lines))
    min_lines = min(len(original_lines), len(proxy_lines))
    same_position = sum(1 for i in range(min_lines) if original_lines[i] == proxy_lines[i])

    original_counter = Counter(original_lines)
    proxy_counter = Counter(proxy_lines)
    multiset_overlap = sum((original_counter & proxy_counter).values())

    original_nonempty = [line for line in original_lines if line.strip()]
    proxy_nonempty = [line for line in proxy_lines if line.strip()]
    nonempty_overlap = sum((Counter(original_nonempty) & Counter(proxy_nonempty)).values())

    return {
        "available": True,
        "original_lines": len(original_lines),
        "proxy_lines": len(proxy_lines),
        "same_position": same_position,
        "same_position_denominator": max_lines,
        "same_position_rate": pct(same_position, max_lines),
        "multiset_overlap": multiset_overlap,
        "original_multiset_coverage": pct(multiset_overlap, len(original_lines)),
        "proxy_multiset_coverage": pct(multiset_overlap, len(proxy_lines)),
        "original_nonempty_lines": len(original_nonempty),
        "proxy_nonempty_lines": len(proxy_nonempty),
        "nonempty_overlap": nonempty_overlap,
        "original_nonempty_coverage": pct(nonempty_overlap, len(original_nonempty)),
        "proxy_nonempty_coverage": pct(nonempty_overlap, len(proxy_nonempty)),
    }


def line_compare_table(stats: dict[str, Any]) -> str:
    if not stats.get("available"):
        return "<p class=\"muted\">没有可比较的 USDA 文本文件。</p>"

    rows = [
        {
            "metric": "同一行号完全相同",
            "value": f"{stats['same_position']} / {stats['same_position_denominator']} = {stats['same_position_rate']}",
        },
        {
            "metric": "忽略顺序的完全相同行 overlap",
            "value": f"{stats['multiset_overlap']} lines；占原始 {stats['original_multiset_coverage']}，占 proxy {stats['proxy_multiset_coverage']}",
        },
        {
            "metric": "排除空行后的 overlap",
            "value": f"{stats['nonempty_overlap']} lines；占原始非空 {stats['original_nonempty_coverage']}，占 proxy 非空 {stats['proxy_nonempty_coverage']}",
        },
        {
            "metric": "行数",
            "value": f"原始 {stats['original_lines']} lines；proxy {stats['proxy_lines']} lines",
        },
    ]
    return table(["metric", "value"], rows)


def ratio_text(generated: int | float, original: int | float) -> str:
    if not original:
        return "n/a"
    return f"{generated}/{original} = {generated / original:.1%}"


def metric_count(asset: dict[str, Any], side: str, metric: str) -> int:
    return int(asset.get(side, {}).get("counts", {}).get(metric, 0))


def joint_signature(asset: dict[str, Any], side: str) -> str:
    values = asset.get(side, {}).get("joint_types", {})
    if not values:
        return "none"
    return ", ".join(f"{name.replace('Physics', '')}:{count}" for name, count in sorted(values.items()))


def proxy_closeness_rows(asset: dict[str, Any], line_stats: dict[str, Any]) -> list[dict[str, Any]]:
    original_text = line_stats.get("same_position_rate", "n/a")
    original_body = metric_count(asset, "original", "rigid_body")
    generated_body = metric_count(asset, "generated", "rigid_body")
    original_joint = metric_count(asset, "original", "joint")
    generated_joint = metric_count(asset, "generated", "joint")
    original_mesh = metric_count(asset, "original", "mesh")
    generated_mesh = metric_count(asset, "generated", "mesh")
    original_collision = metric_count(asset, "original", "collision")
    generated_collision = metric_count(asset, "generated", "collision")
    original_material = metric_count(asset, "original", "material")
    generated_material = metric_count(asset, "generated", "material")
    original_texture = int(asset.get("original", {}).get("texture_ref_count", 0))
    generated_texture = int(asset.get("generated", {}).get("texture_ref_count", 0))

    return [
        {
            "layer": "USD text identity",
            "evidence": original_text,
            "closeness": "very low",
            "why different": "proxy is regenerated USDA, not a line-preserving export; order, metadata, names and formatting are different.",
        },
        {
            "layer": "articulation graph",
            "evidence": f"rigid bodies {ratio_text(generated_body, original_body)}; joints {ratio_text(generated_joint, original_joint)}",
            "closeness": "high for proxy",
            "why different": "the harness intentionally copies extracted rigid-body and joint topology into a simpler stage.",
        },
        {
            "layer": "joint type mix",
            "evidence": f"original: {joint_signature(asset, 'original')} | proxy: {joint_signature(asset, 'generated')}",
            "closeness": "high for proxy",
            "why different": "type counts are preserved, but axis metadata may be dropped by the proxy writer.",
        },
        {
            "layer": "mesh/body coverage",
            "evidence": ratio_text(generated_mesh, original_mesh),
            "closeness": "medium",
            "why different": "proxy keeps one coarse mesh per extracted body and drops decorative/detail meshes.",
        },
        {
            "layer": "collision detail",
            "evidence": ratio_text(generated_collision, original_collision),
            "closeness": "low",
            "why different": "original Lightwheel assets use many collision proxies; proxy collapses them to one coarse collision per body.",
        },
        {
            "layer": "material and texture",
            "evidence": f"materials {ratio_text(generated_material, original_material)}; texture refs {ratio_text(generated_texture, original_texture)}",
            "closeness": "low",
            "why different": "proxy uses two simple colors and does not preserve the original texture atlas or shader graph.",
        },
    ]


def true_microwave_closeness(asset: dict[str, Any], true_run: dict[str, Any] | None) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    if not true_run:
        return [], []

    basic_info = read_json(true_run["run_dir"] / "basic_info.json")
    parts = basic_info.get("parts", [])
    true_names = [str(part.get("name", "")) for part in parts]
    original_bodies = [body.get("name", "") for body in asset.get("bodies_extracted", [])]
    original_joints = [joint.get("type_name", "") for joint in asset.get("joints_extracted", [])]

    rows = [
        {
            "layer": "object category",
            "evidence": f'VLM object_name="{basic_info.get("object_name", "")}" vs source asset "Microwave047"',
            "closeness": "high",
            "why different": "single rendered view gives enough cues to identify a microwave oven.",
        },
        {
            "layer": "part set",
            "evidence": f"original bodies: {', '.join(original_bodies)} | true parts: {', '.join(true_names)}",
            "closeness": "medium",
            "why different": "Frame and Door are recovered; the original Disc/turntable is missed, while visual Side Controls and four Feet are added.",
        },
        {
            "layer": "joint topology",
            "evidence": f"original joints: {', '.join(original_joints)} | true URDF: one revolute door joint plus fixed static parts",
            "closeness": "medium-low",
            "why different": "door articulation is recovered, but the turntable revolute joint is absent.",
        },
        {
            "layer": "joint axis/range",
            "evidence": "original door axis X, range -90..0 deg; true URDF axis Z, range -pi..0 rad",
            "closeness": "low",
            "why different": "image-to-asset path infers a hinge concept but does not preserve the source USD coordinate frame or exact limits.",
        },
        {
            "layer": "physical parameters",
            "evidence": "URDF mass and inertia are all 1.0; MJCF densities come from VLM material guesses.",
            "closeness": "low",
            "why different": "the run produces plausible defaults, not measured or source-transferred mass, inertia, friction and contact parameters.",
        },
    ]

    return rows, [
        {"missing_from_true": "Microwave047_Disc001 / turntable", "impact": "loses one original revolute DOF and internal rotating part"},
        {"extra_in_true": "Side Controls", "impact": "visually plausible, but not an articulated body in the original USD"},
        {"extra_in_true": "four Feet", "impact": "visually plausible static details; increases part count but not functional articulation"},
        {"mismatch": "door hinge axis/range", "impact": "may look openable, but simulation motion will not match the original USD without post-correction"},
    ]


def parse_collision_prims(path: Path) -> list[dict[str, Any]]:
    if not path.is_file():
        return []
    lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
    collisions = []
    for i, line in enumerate(lines):
        match = re.search(r'def\s+(Cube|Cylinder|Mesh)\s+"([^"]+)"', line)
        if not match:
            continue
        window = "\n".join(lines[i : min(len(lines), i + 5)])
        if "PhysicsCollisionAPI" not in window:
            continue
        collisions.append({"shape": match.group(1), "name": match.group(2), "line": i + 1})
    return collisions


def group_microwave_collision(name: str) -> str:
    if "door" in name:
        return "door"
    if "Disc001" in name:
        return "disc / turntable"
    return "main body"


def shape_counts(items: list[dict[str, Any]]) -> str:
    counts = Counter(item["shape"] for item in items)
    return ", ".join(f"{shape}:{count}" for shape, count in sorted(counts.items())) or "none"


def microwave_collision_breakdown(run_dir: Path) -> list[dict[str, Any]]:
    asset_dir = run_dir / "Microwave047"
    original = parse_collision_prims(asset_dir / "Microwave047_original_export.usda")
    proxy = parse_collision_prims(asset_dir / "Microwave047_physx_omni_structural_proxy.usda")
    original_groups: dict[str, list[dict[str, Any]]] = {"main body": [], "door": [], "disc / turntable": []}
    proxy_groups: dict[str, list[dict[str, Any]]] = {"main body": [], "door": [], "disc / turntable": []}
    for item in original:
        original_groups.setdefault(group_microwave_collision(item["name"]), []).append(item)
    for item in proxy:
        proxy_groups.setdefault(group_microwave_collision(item["name"]), []).append(item)

    notes = {
        "main body": (
            "original uses a cylinder plus multiple thin cubes to approximate shell, side walls and panel surfaces; proxy uses one scaled cube bbox",
            "stable but over-solid: it fills hollow/interior regions and cannot represent openings or thin walls",
        ),
        "door": (
            "original uses many thin cubes around the door/window/frame; proxy uses one slab-like cube bbox",
            "loses frame/window collision detail and can block contacts that should pass through glass/open regions",
        ),
        "disc / turntable": (
            "original turntable collision is a cylinder; proxy keeps the body but changes it to one cube bbox",
            "body-level coverage is retained, but circular contact shape becomes box-like",
        ),
    }

    rows = []
    for group in ["main body", "door", "disc / turntable"]:
        original_items = original_groups.get(group, [])
        proxy_items = proxy_groups.get(group, [])
        difference, impact = notes[group]
        rows.append(
            {
                "group": group,
                "original primitives": f"{len(original_items)} ({shape_counts(original_items)})",
                "proxy primitives": f"{len(proxy_items)} ({shape_counts(proxy_items)})",
                "main difference": difference,
                "simulation impact": impact,
            }
        )
    return rows


def build_difference_analysis(run_dir: Path, assets: list[dict[str, Any]], line_compare_rows: list[dict[str, Any]]) -> dict[str, Any]:
    line_by_asset = {row["asset"]: row for row in line_compare_rows}
    asset_rows = []
    for asset in assets:
        name = asset["asset_name"]
        true_run = collect_true_run(run_dir / name)
        true_rows, true_issues = true_microwave_closeness(asset, true_run)
        asset_rows.append(
            {
                "asset": name,
                "proxy_rows": proxy_closeness_rows(asset, line_by_asset.get(name, {})),
                "true_physx_omni_rows": true_rows,
                "true_physx_omni_issues": true_issues,
            }
        )

    return {
        "reading_guide": "Text-line identity is expected to be very low. The useful closeness question is layered: articulation graph, body scale, mesh detail, joint axes/limits, collision proxies, and physical parameters.",
        "overall": [
            {
                "question": "是否还有提升空间",
                "answer": "有。最大提升空间不是让 USDA 文本行相同，而是把原始 USD 的 body/joint prior、多视角渲染、bbox/scale 对齐、joint axis/limit 后处理和物理参数校准引入 PhysX-Omni 结果。",
            },
            {
                "question": "是否接近",
                "answer": "proxy 在 articulation graph 层接近，在 visual/collision/material 层不接近；4090 真输出在类别和门这个主功能上接近，在 turntable、joint axis/range、物理参数上不接近。",
            },
        ],
        "assets": asset_rows,
        "microwave_collision_breakdown": microwave_collision_breakdown(run_dir),
        "improvement_plan": [
            "Use the source USD body/joint list as constrained prompts or postprocess priors instead of letting VLM freely invent parts.",
            "Render multi-view and open-state images from the source USD, especially front, side, top, and door-open views, to expose hidden turntable/interior parts.",
            "Scale and align generated GLB parts against source body bounding boxes before exporting URDF/MJCF.",
            "Transfer known joint axes, limits, parent/child links from source USD when a source asset exists; use VLM only for missing semantic labels.",
            "Generate collision proxies with convex decomposition or primitive fitting rather than using visual meshes or one coarse cube per body.",
            "Replace default URDF mass/inertia/friction with mesh-derived inertia plus material density, then validate in MuJoCo/Isaac/Genesis.",
        ],
    }


def table(headers: list[str], rows: list[dict[str, Any]]) -> str:
    head = "".join(f"<th>{html.escape(h)}</th>" for h in headers)
    body = []
    for row in rows:
        body.append("<tr>")
        for h in headers:
            body.append(f"<td>{html.escape(str(row.get(h, '')))}</td>")
        body.append("</tr>")
    return f"<table><thead><tr>{head}</tr></thead><tbody>{''.join(body)}</tbody></table>"


def collect_true_run(asset_dir: Path) -> dict[str, Any] | None:
    run_dir = asset_dir / "true_physx_omni_bf16"
    if not run_dir.is_dir():
        return None

    repro = read_json(run_dir / "repro_summary.json")
    basic_info = read_text(run_dir / "basic_info.txt", 20_000)
    glbs = sorted(run_dir.glob("objs/*/*.glb"), key=lambda p: int(p.parent.name))
    objs = sorted(run_dir.glob("objs/*/*.obj"), key=lambda p: int(p.parent.name))
    textures = sorted(run_dir.glob("objs/*/material_0.png"), key=lambda p: int(p.parent.name))
    return {
        "run_dir": run_dir,
        "repro": repro,
        "basic_info": basic_info,
        "glbs": glbs,
        "objs": objs,
        "textures": textures,
        "urdf": run_dir / "basic.urdf",
        "mjcf": run_dir / "basic.xml",
        "condition_image": run_dir / "cond_img.png",
        "voxel_projection": run_dir / "voxel_projection.png",
        "mesh_preview": run_dir / "true_physx_omni_mesh_preview.png",
        "turntable_video": run_dir / "current_version_turntable.mp4",
        "desert": run_dir / "desert.png",
        "vlm_log": run_dir / "logs" / "lightwheel_true_microwave047_bf16_vlm.log",
        "geo_log": run_dir / "logs" / "lightwheel_true_microwave047_bf16_geo_jsongen_dinofix.log",
        "readme": run_dir / "README.md",
    }


def true_run_section(asset_name: str, asset_dir: Path, root: Path) -> str:
    true_run = collect_true_run(asset_dir)
    if not true_run:
        return """
        <section class="true-run pending">
          <h3>4090 真实 PhysX-Omni 输出</h3>
          <p>这个资产还没有跑真实 PhysX-Omni；当前只有结构 proxy 作为 harness 对照。</p>
        </section>
        """

    repro = true_run["repro"]
    parts = repro.get("parts", [])
    part_rows = [
        {
            "part": p.get("part"),
            "voxels": p.get("voxel_count"),
            "coord_chars": p.get("coord_text_chars"),
            "npy": Path(p.get("npy", "")).name if p.get("npy") else "",
            "ply": Path(p.get("ply", "")).name if p.get("ply") else "",
        }
        for p in parts
    ]
    glb_rows = []
    for glb in true_run["glbs"]:
        idx = glb.parent.name
        obj = glb.with_suffix(".obj")
        tex = glb.parent / "material_0.png"
        glb_rows.append(
            {
                "part": idx,
                "GLB": f'<a href="{html.escape(rel(glb, root))}">{html.escape(glb.name)}</a>',
                "GLB size": file_size(glb),
                "OBJ size": file_size(obj) if obj.is_file() else "",
                "texture": f'<a href="{html.escape(rel(tex, root))}">material_0.png</a>' if tex.is_file() else "",
            }
        )

    glb_table = table(["part", "GLB", "GLB size", "OBJ size", "texture"], glb_rows)
    glb_table = html.unescape(glb_table)
    condition = true_run["condition_image"]
    voxel = true_run["voxel_projection"]
    mesh_preview = true_run["mesh_preview"]
    turntable_video = true_run["turntable_video"]
    desert = true_run["desert"]
    urdf = true_run["urdf"]
    mjcf = true_run["mjcf"]
    vlm_log = true_run["vlm_log"]
    geo_log = true_run["geo_log"]
    readme = true_run["readme"]

    metrics = [
        {"metric": "status", "value": repro.get("status")},
        {"metric": "mode", "value": repro.get("mode")},
        {"metric": "detected_parts", "value": repro.get("detected_parts")},
        {"metric": "parts_to_run", "value": repro.get("parts_to_run")},
        {"metric": "total_voxels", "value": repro.get("total_voxels")},
        {"metric": "elapsed_sec", "value": repro.get("elapsed_sec")},
        {"metric": "GLB parts", "value": len(true_run["glbs"])},
        {"metric": "OBJ parts", "value": len(true_run["objs"])},
        {"metric": "texture parts", "value": len(true_run["textures"])},
    ]

    return f"""
    <section class="true-run done">
      <h3>4090 真实 PhysX-Omni 输出</h3>
      <p class="notice">这部分来自 4090 上的官方链路：VLM 生成 basic_info/RLE voxel，随后运行 TRELLIS/DINO 几何解码和 3jsongen_update。它不是本地 bbox proxy。</p>
      <div class="media-grid three">
        <figure>
          <img src="{html.escape(rel(condition, root))}" alt="{html.escape(asset_name)} condition image" />
          <figcaption>输入条件图：原始 Lightwheel USD + 原始 base-color atlas 渲染</figcaption>
        </figure>
        <figure>
          <img src="{html.escape(rel(voxel, root))}" alt="{html.escape(asset_name)} voxel projection" />
          <figcaption>VLM/RLE voxel 投影</figcaption>
        </figure>
        <figure>
          <img src="{html.escape(rel(mesh_preview if mesh_preview.is_file() else desert, root))}" alt="{html.escape(asset_name)} PhysX-Omni mesh preview" />
          <figcaption>7 个真实 GLB 输出合并渲染预览</figcaption>
        </figure>
      </div>
      {"".join([
        f'''
        <figure class="video-panel">
          <video controls preload="metadata" poster="{html.escape(rel(mesh_preview if mesh_preview.is_file() else condition, root))}">
            <source src="{html.escape(rel(turntable_video, root))}" type="video/mp4" />
          </video>
          <figcaption>当前版本旋转视频：Blender 4.5 后台渲染 7 个真实 PhysX-Omni GLB，720p / 24fps / 3s。</figcaption>
        </figure>
        '''
      ]) if turntable_video.is_file() else ""}
      <h4>运行指标</h4>
      {table(["metric", "value"], metrics)}
      <h4>VLM 拆解结果</h4>
      <pre>{html.escape(true_run["basic_info"])}</pre>
      <h4>部件 voxel 统计</h4>
      {table(["part", "voxels", "coord_chars", "npy", "ply"], part_rows)}
      <h4>几何输出</h4>
      {glb_table}
      <h4>URDF / MJCF</h4>
      <p>
        <a href="{html.escape(rel(urdf, root))}">打开 basic.urdf</a>
        <a href="{html.escape(rel(mjcf, root))}">打开 basic.xml</a>
        <a href="{html.escape(rel(vlm_log, root))}">VLM log</a>
        <a href="{html.escape(rel(geo_log, root))}">geometry log</a>
        <a href="{html.escape(rel(desert, root))}">desert.png</a>
        {f'<a href="{html.escape(rel(turntable_video, root))}">current_version_turntable.mp4</a>' if turntable_video.is_file() else ''}
        <a href="{html.escape(rel(readme, root))}">README.md</a>
      </p>
      <div class="code-split">
        <article>
          <h5>basic.urdf</h5>
          <pre>{html.escape(read_text(urdf, 30_000))}</pre>
        </article>
        <article>
          <h5>basic.xml</h5>
          <pre>{html.escape(read_text(mjcf, 30_000))}</pre>
        </article>
      </div>
      <details>
        <summary>边界说明</summary>
        <ul>
          <li>PhysX-Omni 官方脚本输出 GLB/OBJ/URDF/MJCF，不直接输出 USDA；当前页面没有把本地结构 proxy 冒充成真实模型输出。</li>
          <li>远端 4bit 路径因 bitsandbytes metadata 缺失失败，本次用脚本支持的 bf16_offload 跑通。</li>
          <li>远端 usdrecord 缺 Hydra renderer plugin、Blender 3.0 USD import 不可用，所以条件图在本机 Blender 4.5 从原始 USD 渲染后上传到 4090。</li>
        </ul>
      </details>
    </section>
    """


def build_report(run_dir: Path) -> Path:
    summary = read_json(run_dir / "summary.json")
    assets = summary.get("assets", [])
    overview = []
    line_compare_rows = []
    sections = []
    for asset in assets:
        name = asset["asset_name"]
        asset_dir = run_dir / name
        true_run = collect_true_run(asset_dir)
        original_usda = asset_dir / f"{name}_original_export.usda"
        proxy_usda = asset_dir / f"{name}_physx_omni_structural_proxy.usda"
        line_stats = compare_usda_lines(original_usda, proxy_usda)
        projection = Path(asset.get("projection_rel", f"{name}/{name}_bbox_projection.png"))
        if line_stats.get("available"):
            line_compare_rows.append(
                {
                    "asset": name,
                    "original_lines": line_stats["original_lines"],
                    "proxy_lines": line_stats["proxy_lines"],
                    "same_position": line_stats["same_position"],
                    "same_position_denominator": line_stats["same_position_denominator"],
                    "same_position_rate": line_stats["same_position_rate"],
                    "multiset_overlap": line_stats["multiset_overlap"],
                    "original_multiset_coverage": line_stats["original_multiset_coverage"],
                    "proxy_multiset_coverage": line_stats["proxy_multiset_coverage"],
                    "nonempty_overlap": line_stats["nonempty_overlap"],
                    "original_nonempty_coverage": line_stats["original_nonempty_coverage"],
                    "proxy_nonempty_coverage": line_stats["proxy_nonempty_coverage"],
                }
            )
        overview.append(
            {
                "asset": name,
                "Lightwheel meshes": asset["original"]["counts"].get("mesh", 0),
                "Lightwheel joints": asset["original"]["counts"].get("joint", 0),
                "proxy meshes": asset["generated"]["counts"].get("mesh", 0),
                "true status": true_run["repro"].get("status") if true_run else "not_run",
                "true parts": true_run["repro"].get("detected_parts") if true_run else "",
                "true voxels": true_run["repro"].get("total_voxels") if true_run else "",
                "USD same-line": line_stats.get("same_position_rate", ""),
                "proxy line coverage": line_stats.get("proxy_nonempty_coverage", ""),
            }
        )
        sections.append(
            f"""
            <section class="asset">
              <h2>{html.escape(name)}</h2>
              <div class="media-grid two">
                <figure>
                  <img src="{html.escape(projection.as_posix())}" alt="{html.escape(name)} structure projection" />
                  <figcaption>结构投影 / proxy harness 预览</figcaption>
                </figure>
                <div class="status-card">
                  <h3>原始 Lightwheel 资产</h3>
                  <p><b>source:</b> <code>{html.escape(asset['original_usd'])}</code></p>
                  <p><b>sha256:</b> <code>{html.escape(asset['source_sha256_short'])}</code></p>
                  <p><b>mesh / material / collision / joint:</b> {asset['original']['counts'].get('mesh', 0)} / {asset['original']['counts'].get('material', 0)} / {asset['original']['counts'].get('collision', 0)} / {asset['original']['counts'].get('joint', 0)}</p>
                  <p><b>proxy status:</b> 本地结构 proxy 已生成，但只作为对照。</p>
                </div>
              </div>
              {true_run_section(name, asset_dir, run_dir)}
              <details>
                <summary>原始 USD 与结构 proxy 对比</summary>
                <h4>单行完全一样的一致率</h4>
                <p class="muted">比较对象是原始 Lightwheel stage 导出的 USDA 与本地 structural proxy USDA。最严格口径是“同一行号、整行文本完全相同 / 两边最大行数”；这不是语义相似度，也不是 4090 真实 PhysX-Omni GLB/URDF 输出的一致率。</p>
                {line_compare_table(line_stats)}
                <div class="code-split">
                  <article>
                    <h4>原始 Lightwheel USDA 导出</h4>
                    <p><a href="{html.escape(rel(original_usda, run_dir))}">打开完整原始 USDA</a></p>
                    <pre>{html.escape(read_text(original_usda, 45_000))}</pre>
                  </article>
                  <article>
                    <h4>本地 structural proxy USDA</h4>
                    <p><a href="{html.escape(rel(proxy_usda, run_dir))}">打开 proxy USDA</a></p>
                    <pre>{html.escape(read_text(proxy_usda, 45_000))}</pre>
                  </article>
                </div>
              </details>
            </section>
            """
        )

    (run_dir / "usd_line_exact_comparison.json").write_text(
        json.dumps(
            {
                "definition": {
                    "same_position_rate": "same line number exact text match / max(original_lines, proxy_lines)",
                    "multiset_overlap": "exact text line overlap with duplicate counts, ignoring order",
                    "nonempty_overlap": "same as multiset_overlap after dropping blank/whitespace-only lines",
                    "scope": "original exported USDA vs local structural proxy USDA, not the true 4090 PhysX-Omni GLB/URDF output",
                },
                "assets": line_compare_rows,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    difference_analysis = build_difference_analysis(run_dir, assets, line_compare_rows)
    (run_dir / "difference_closeness_analysis.json").write_text(
        json.dumps(difference_analysis, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    microwave_analysis = next(
        (row for row in difference_analysis["assets"] if row["asset"] == "Microwave047"),
        {"proxy_rows": [], "true_physx_omni_rows": [], "true_physx_omni_issues": []},
    )
    microwave_collision_rows = difference_analysis.get("microwave_collision_breakdown", [])
    proxy_detail_html = "\n".join(
        f"""
        <details>
          <summary>{html.escape(row['asset'])} proxy 分层接近度</summary>
          {table(["layer", "evidence", "closeness", "why different"], row["proxy_rows"])}
        </details>
        """
        for row in difference_analysis["assets"]
    )
    improvement_html = "".join(
        f"<li>{html.escape(item)}</li>" for item in difference_analysis["improvement_plan"]
    )

    style = """
    :root { color-scheme: light; --bg:#f5f7fa; --panel:#fff; --ink:#16202a; --muted:#607082; --line:#d8e0e8; --accent:#1b668f; --ok:#0f766e; --warn:#9a6700; }
    * { box-sizing:border-box; }
    body { margin:0; background:var(--bg); color:var(--ink); font-family:Inter, "Microsoft YaHei", system-ui, sans-serif; line-height:1.55; }
    header, main { width:min(1240px, calc(100% - 32px)); margin:0 auto; }
    header { padding:28px 0 12px; }
    h1 { margin:0 0 8px; font-size:32px; }
    h2, h3, h4 { margin:18px 0 10px; }
    h5 { margin:8px 0; font-size:14px; }
    .summary, .asset, .true-run, .status-card { background:var(--panel); border:1px solid var(--line); border-radius:8px; padding:16px; }
    .summary, .asset { margin:16px 0; }
    .true-run { margin:14px 0; }
    .notice { border-left:4px solid var(--ok); background:#ecfdf5; padding:10px 12px; color:#134e4a; }
    .pending { color:var(--warn); }
    .media-grid { display:grid; gap:14px; align-items:start; }
    .media-grid.two { grid-template-columns:minmax(320px, .85fr) minmax(320px, 1.15fr); }
    .media-grid.three { grid-template-columns:repeat(3, minmax(0, 1fr)); }
    figure { margin:0; }
    img { width:100%; border:1px solid var(--line); border-radius:6px; background:#101820; }
    video { width:100%; border:1px solid var(--line); border-radius:6px; background:#101820; display:block; }
    .video-panel { margin:14px 0; }
    figcaption, .muted { color:var(--muted); font-size:13px; margin-top:6px; }
    table { width:100%; border-collapse:collapse; margin:8px 0 16px; font-size:14px; }
    th, td { text-align:left; border-bottom:1px solid var(--line); padding:8px; vertical-align:top; }
    th { background:#edf2f7; }
    pre { white-space:pre-wrap; overflow:auto; max-height:560px; background:#101820; color:#edf6ff; padding:12px; border-radius:6px; font-size:12px; }
    code { background:#edf2f7; border:1px solid var(--line); border-radius:5px; padding:1px 5px; }
    a { color:var(--accent); margin-right:12px; }
    .code-split { display:grid; grid-template-columns:minmax(0, 1fr) minmax(0, 1fr); gap:14px; }
    details { margin-top:14px; }
    summary { cursor:pointer; font-weight:700; }
    @media (max-width: 980px) { .media-grid.two, .media-grid.three, .code-split { grid-template-columns:1fr; } }
    """
    html_text = f"""<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Lightwheel -> PhysX-Omni 真实复现实验</title>
    <style>{style}</style>
  </head>
  <body>
    <header>
      <h1>Lightwheel -> PhysX-Omni 真实复现实验</h1>
      <p class="muted">本页把原始 Lightwheel USD、本地结构 proxy、4090 真实 PhysX-Omni 输出分开展示，避免把 proxy 当成模型结果。</p>
    </header>
    <main>
      <section class="summary">
        <h2>当前结论</h2>
        <p class="notice">Microwave047 已在 4090 上跑通真实 PhysX-Omni：VLM 识别为 Microwave Oven，生成 7 parts、22236 voxels，并完成 7 个 GLB/OBJ、URDF 和 MJCF 后处理。</p>
        {table(["asset", "Lightwheel meshes", "Lightwheel joints", "proxy meshes", "true status", "true parts", "true voxels", "USD same-line", "proxy line coverage"], overview)}
        <h3>USD 单行完全一致率总表</h3>
        <p class="muted">same-line 是同一行号完全相同的最严格比例；proxy line coverage 是排除空行后，proxy 中有多少行能在原始 USDA 中找到完全相同文本。</p>
        {table(["asset", "original_lines", "proxy_lines", "same_position", "same_position_denominator", "same_position_rate", "nonempty_overlap", "original_nonempty_coverage", "proxy_nonempty_coverage"], line_compare_rows)}
        <h3>为什么这个比例这么低</h3>
        <div class="explain">
          <p>这个指标衡量的是 <b>USD 文本身份</b>，不是几何质量、拓扑相似度或物理语义相似度。只要行号、缩进、属性顺序、prim 顺序、注释、metadata 有任何变化，该行就会被判为不一致。</p>
          <p>当前比较对象是 <code>original_export.usda</code> 和本地 <code>structural_proxy.usda</code>。原始 Lightwheel USDA 是完整 composed stage，包含高密度 mesh、材质图、贴图引用、碰撞体、关节、Blender/Omniverse metadata；本地 proxy 是为了做 harness 对照而生成的简化结构文件，重点保留 body/joint 的粗结构，不保留原始 USD 的逐行文本。</p>
          <p>以 <code>Microwave047</code> 为例：原始导出有 768 行，proxy 只有 193 行；同一行号完全相同的只有 3 行，主要是 <code>#usda 1.0</code>、开头括号和空行。原始里有贴图引用、更多 collision proxy 和材质绑定；proxy 则用少量简化 mesh/material 重新表达结构，所以逐行一致率接近 0 是预期结果。</p>
          <p>真实 4090 PhysX-Omni 路径更不是 USD-to-USD 转换器：它从渲染图进入 VLM/RLE voxel，再输出 GLB/OBJ 和 URDF/MJCF。这个过程天然会丢失原始 USD 的行文本、prim 命名、属性顺序和作者层信息。因此后续更应该看几何覆盖、部件拓扑、关节类型、尺度、碰撞和动力学参数，而不是期待 USDA 文本逐行一致。</p>
        </div>
        <h3>差异分解：为什么不一样，是否接近</h3>
        {table(["question", "answer"], difference_analysis["overall"])}
        <h4>Microwave047 的真实 4090 PhysX-Omni 接近度</h4>
        {table(["layer", "evidence", "closeness", "why different"], microwave_analysis["true_physx_omni_rows"])}
        <h4>Microwave047 的关键不一致点</h4>
        {table(["missing_from_true", "extra_in_true", "mismatch", "impact"], microwave_analysis["true_physx_omni_issues"])}
        <h4>Microwave047 collision 为什么从 22 变成 3</h4>
        <p class="muted">这里的 22 和 3 不是刚体数量，而是碰撞 primitive 数量。原始 USD 为每个刚体手工放了多块碰撞几何；proxy 为每个刚体只放一个 bbox collision proxy，所以 body-level 覆盖仍是 3/3，但 primitive 级细节大幅减少。</p>
        {table(["group", "original primitives", "proxy primitives", "main difference", "simulation impact"], microwave_collision_rows)}
        <h4>Proxy 与原始 USD 的分层接近度</h4>
        {proxy_detail_html}
        <h4>提升空间</h4>
        <ol>{improvement_html}</ol>
        <p><a href="difference_closeness_analysis.json">打开差异与接近度 JSON</a></p>
      </section>
      {''.join(sections)}
    </main>
  </body>
</html>
"""
    out = run_dir / "index.html"
    out.write_text(html_text, encoding="utf-8")
    return out


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--run-dir", default="experiments/lightwheel_physx_reconstruction/run_latest")
    args = parser.parse_args()
    out = build_report(Path(args.run_dir))
    print(out)


if __name__ == "__main__":
    main()
