# PhysX-Omni 当前推进交付记录

日期：2026-06-20

## 1. M&M's 高罐几何解码

输入：

```text
C:\Users\robot\physx_outputs\mms_yellow_body_focus
```

VLM 结果：

- 原图：4 个 part 里只有 1 个非空，总计 2237 voxels。
- body-focus 裁剪图：4 个 part 里有 3 个非空，总计 6188 voxels。
- 本地已同步远端 `ind_*.npy`、`ind_*.ply`、`allind.*`、`cond_img.png`。

TRELLIS 低显存几何解码：

- 已在 4090 上启动多 part 低显存 TRELLIS mesh 解码脚本。
- 第一次失败：`trellis` 未进入 Python path。
- 第二次失败：远端直连 Hugging Face 超时，且本地没有 `microsoft/TRELLIS-image-large` 的 `pipeline.json` cache。
- 已改用 `HF_ENDPOINT=https://hf-mirror.com`，完成 TRELLIS-image-large 权重缓存与 3 个非空部件 mesh-only 解码。
- 首次运行总耗时 1682.54 秒，主要是模型下载/缓存；实际每个 part 解码约 2.3-2.5 秒。

TRELLIS mesh-only 输出：

```text
C:\Users\robot\physx_outputs\mms_yellow_body_focus\objs_lowmem_parts\1\1_mesh_only.glb
C:\Users\robot\physx_outputs\mms_yellow_body_focus\objs_lowmem_parts\2\2_mesh_only.glb
C:\Users\robot\physx_outputs\mms_yellow_body_focus\objs_lowmem_parts\3\3_mesh_only.glb
C:\Users\robot\physx_outputs\mms_yellow_body_focus\mms_yellow_body_focus_trellis_lowmem_combined.glb
C:\Users\robot\physx_outputs\mms_yellow_body_focus\lowmem_mesh_parts_report.json
```

TRELLIS 解码结果：

| part | voxels | vertices | faces | elapsed_sec |
|---:|---:|---:|---:|---:|
| 1 | 2866 | 93656 | 187404 | 2.53 |
| 2 | 1759 | 55025 | 110034 | 2.32 |
| 3 | 1563 | 53610 | 107244 | 2.34 |

已完成 fallback 几何解码：

```text
C:\Users\robot\physx_outputs\mms_yellow_body_focus\voxel_mesh_fallback
```

输出：

```text
C:\Users\robot\physx_outputs\mms_yellow_body_focus\voxel_mesh_fallback\mms_yellow_body_focus_voxel_mesh_combined.glb
C:\Users\robot\physx_outputs\mms_yellow_body_focus\voxel_mesh_fallback\voxel_mesh_fallback_report.json
C:\Users\robot\physx_outputs\mms_yellow_body_focus\voxel_mesh_fallback\parts\1\part_1.glb
C:\Users\robot\physx_outputs\mms_yellow_body_focus\voxel_mesh_fallback\parts\2\part_2.glb
C:\Users\robot\physx_outputs\mms_yellow_body_focus\voxel_mesh_fallback\parts\3\part_3.glb
```

关键几何结论：

| part | voxels | bbox dims xyz | z/max(x,y) | 解释 |
|---:|---:|---|---:|---|
| 0 | 0 | - | - | 空 |
| 1 | 2866 | 42 x 41 x 10 | 0.2381 | 罐身主体被生成得很扁 |
| 2 | 1759 | 30 x 32 x 4 | 0.1250 | 盖子很薄 |
| 3 | 1563 | 28 x 27 x 13 | 0.4643 | 瓶颈/上部结构 |
| combined | 6188 | 42 x 41 x 64 | 1.5238 | 总高度来自上下分离结构，不是连续高罐身 |

结论：用户观察“出来的好像有点矮”是对的。TRELLIS mesh 解码成功，但它解的是 VLM 已经生成好的稀疏 voxel/SLAT 坐标；当前 VLM voxel 输出本身把罐身压成了低矮主体，顶部和瓶颈与底部分离，所以 mesh-only 解码不能自动恢复连续高罐身。

## 2. 官方 7 部件交互查看器

目录：

```text
C:\Users\robot\Documents\成长学习库\physx_omni_official_viewer
```

服务已启动：

```text
http://127.0.0.1:8017/index.html
```

内容：

- 直接加载官方复现输出的 7 个 GLB；
- 支持 part 显隐；
- 支持主体 solo；
- 支持 opacity、wireframe、auto rotate、reset camera；
- 读取 `basic_info.json` 展示 part 名称、材料和 density。

资产：

```text
C:\Users\robot\Documents\成长学习库\physx_omni_official_viewer\assets\parts\0.glb
...
C:\Users\robot\Documents\成长学习库\physx_omni_official_viewer\assets\parts\6.glb
```

## 3. 固化复现脚本和补丁

质量补丁：

```text
C:\Users\robot\Documents\成长学习库\physx-omni-assets\physx_omni_repro_quality.patch
```

新增一键脚本：

```text
C:\Users\robot\Documents\成长学习库\physx-omni-assets\reproduce_quality.sh
```

远端已同步到：

```text
/data/light/repro/physx_omni_2605_21572/reproduce_quality.sh
```

默认行为：

- 设置 `SPCONV_ALGO=native`；
- 设置 `ATTN_BACKEND=xformers`；
- 设置 `DINO_LOCAL_REPO`；
- 设置 `HF_ENDPOINT=https://hf-mirror.com`；
- 设置 `PYTHONPATH`；
- 运行 `2infer_geo.py`；
- 运行 `3jsongen_update.py`。

## 4. 远端环境清理

清理脚本：

```text
C:\Users\robot\Documents\成长学习库\physx-omni-assets\cleanup_remote_worktree.sh
```

远端已同步到：

```text
/data/light/repro/physx_omni_2605_21572/cleanup_remote_worktree.sh
```

执行结果：

- 已清理 `__pycache__`、`.pyc`、临时日志和备份文件。
- 已保留复现输出目录 `repro_runs`。
- 已保留两个 intentional source diff：
  - `decoder_each.py`
  - `trellis/pipelines/trellis_image_to_3d.py`

远端 repo 当前关键状态：

```text
 M decoder_each.py
 M trellis/pipelines/trellis_image_to_3d.py
```

这两个改动与本地 `physx_omni_repro_quality.patch` 对齐。

## 5. 后续建议

如果要继续拿到真正 textured GLB，需要再跑官方 `mesh + gaussian` 路径或扩展低显存脚本支持 gaussian 解码与 `to_glb()`。当前 M&M's 的 TRELLIS lowmem 输出是 mesh-only GLB，适合检查几何，不含官方 textured material。
