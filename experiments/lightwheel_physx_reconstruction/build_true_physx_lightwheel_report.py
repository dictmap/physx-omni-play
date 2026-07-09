from __future__ import annotations

import argparse
from collections import Counter
import html
import json
from pathlib import Path
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
