# PhysX-Omni 论文精读与复现教学站

本目录是一个本地静态前端，不只是 3D viewer。它按“课程 + 证据 + 材料库”组织 PhysX-Omni 精读内容：

- Step 1-10 论文精读路线；
- 论文主线和官方 pipeline；
- `1vlm_demo.py`、`2infer_geo.py`、`decoder_each.py`、`3jsongen_update.py` 核心代码入口；
- 官方 7 部件复现记录；
- M&M's 高罐 body-focus 实测记录；
- PhysX-Bench、数据集和 reviewer 问题；
- 全量 Markdown / Notebook 材料库，可搜索、过滤、预览章节大纲；
- 官方 7 部件 GLB 与 M&M's 3 个 lowmem GLB 的 Three.js 交互查看。

当前材料清单由 `materials-data.js` 提供，来源是 `build_materials_data.py` 扫描项目内 Markdown 和 Jupyter 生成。

## Run

```powershell
python official_viewer/build_materials_data.py
python official_viewer/serve_viewer.py
```

Open:

```text
http://127.0.0.1:8017/index.html
```

也可以直接双击 `index.html` 用 `file://` 打开。为了避开 `file://` 下的 ES module/CORS 限制，页面会通过 `boot-viewer.js` 只加载教学层；十步课程、材料库、搜索和链接可用，Three.js 3D GLB 交互查看器需要用上面的 HTTP 地址打开。

## Loaded assets

- `assets/parts/0.glb` to `assets/parts/6.glb`
- `assets/basic_info.json`
- `assets/evidence/official_7part_mesh_preview.png`
- `assets/mms/parts/1.glb` to `assets/mms/parts/3.glb`
- `assets/mms/cond_img.png`
- `assets/mms/voxel_projection.png`
