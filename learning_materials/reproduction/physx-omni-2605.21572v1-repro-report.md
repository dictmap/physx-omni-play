# PhysX-Omni 2605.21572v1 复现报告

复现日期：2026-06-20  
远端机器：4090 主机 `y12`  
论文地址：https://arxiv.org/abs/2605.21572v1  
远端复现根目录：`/data/light/repro/physx_omni_2605_21572`

## 结论

已拿到明确输出测试效果：

1. **VLM / RLE voxel 阶段全量成功**：同一张 demo 图检测出 7 个部件，生成 22031 个 voxel，输出 `coord_*.txt`、`ind_*.npy`、`ind_*.ply`、`allind.npy`、`allind.ply`。
2. **TRELLIS mesh 解码链路成功跑通一个部件**：用官方 `microsoft/TRELLIS-image-large`、官方 mesh decoder、同一次 VLM 输出的第 0 个部件，生成 `OBJ / GLB / PLY`。mesh 结果为 1716 vertices、3428 faces。
3. **官方默认全 7 部件 + 默认 GLB 贴图链路尚未完整跑完**：`2infer_geo.py` 已进入 TRELLIS 采样和 mesh 提取，但当前 4090 上已有进程占用约 14GB 显存，默认解码在 mesh 提取阶段 OOM。没有擅自杀其它 GPU 进程。

## 可视化结果

VLM voxel 投影视图：

`C:\Users\robot\physx_outputs\voxel_projection.png`

mesh 解码预览：

`C:\Users\robot\physx_outputs\mesh_part0\mesh_preview.png`

本地可查看的 mesh 文件：

- `C:\Users\robot\physx_outputs\mesh_part0\0_mesh_only.obj`
- `C:\Users\robot\physx_outputs\mesh_part0\0_mesh_only.glb`
- `C:\Users\robot\physx_outputs\mesh_part0\0_mesh_only.ply`
- `C:\Users\robot\physx_outputs\mesh_part0\lowmem_mesh_report.json`

## VLM 阶段输出

远端输出目录：

`/data/light/repro/physx_omni_2605_21572/repro_runs/vlm_full/65e2f7b0452046be8ee948b49ee17ef4`

核心摘要：

- status：`success`
- mode：`4bit`
- image：`demo/65e2f7b0452046be8ee948b49ee17ef4.png`
- detected_parts：`7`
- elapsed_sec：`393.95`
- total_voxels：`22031`
- part voxel counts：`56, 14065, 7570, 46, 186, 60, 48`

生成文件：

- `cond_img.png`
- `basic_info.txt`
- `coord_0.txt` ... `coord_6.txt`
- `ind_0.npy` ... `ind_6.npy`
- `ind_0.ply` ... `ind_6.ply`
- `allind.npy`
- `allind.ply`
- `voxel_projection.png`
- `repro_summary.json`

## TRELLIS mesh 输出

远端输出目录：

`/data/light/repro/physx_omni_2605_21572/repro_runs/vlm_part0/65e2f7b0452046be8ee948b49ee17ef4`

低显存 mesh 输出：

- status：`success`
- 输入 part：`ind_0.npy`
- voxels：`56`
- slat_coords：`56`
- vertices：`1716`
- faces：`3428`
- elapsed_sec：`23.68`
- peak CUDA allocated：`5730.55 MiB`

远端 mesh 文件：

- `objs_lowmem/0/0_mesh_only.obj`
- `objs_lowmem/0/0_mesh_only.glb`
- `objs_lowmem/0/0_mesh_only.ply`
- `lowmem_mesh_report.json`

说明：这个 GLB 是 mesh-only 导出，用来验证官方 TRELLIS mesh decoder 输出；没有执行默认 `postprocessing_utils.to_glb()` 的 Gaussian 贴图烘焙。

## 官方默认解码阻塞点

运行默认 `2infer_geo.py` 时，已经完成：

- TRELLIS 权重下载/缓存
- DINOv2 权重下载/缓存
- xFormers attention 初始化
- spconv sparse backend 初始化
- 25-step sampling

失败点：

`trellis/representations/mesh/flexicubes/flexicubes.py` 中 mesh 提取需要额外分配 1024 MiB CUDA 内存，但 GPU 当时只剩约 469-471 MiB。

日志中的显存占用：

- `Process 175539`：约 `3.87 GiB`
- `Process 2656909`：约 `10.28 GiB`
- 本次 TRELLIS 进程：约 `8.48 GiB`

因此，默认全量官方 `2infer_geo.py` 不是代码逻辑失败，而是当前 GPU 共享状态下显存不足。

## 关键脚本

本地脚本：

- `physx-omni-assets/run_vlm_repro_one.py`
- `physx-omni-assets/render_voxel_projections.py`
- `physx-omni-assets/run_trellis_lowmem_mesh.py`

远端脚本：

- `/data/light/repro/physx_omni_2605_21572/run_vlm_repro_one.py`
- `/data/light/repro/physx_omni_2605_21572/render_voxel_projections.py`
- `/data/light/repro/physx_omni_2605_21572/run_trellis_lowmem_mesh.py`

## 继续完成全量官方资产的条件

要跑完默认全 7 部件、带纹理 GLB/OBJ 和后续 `3jsongen_update.py`，需要释放 4090 上至少一个大显存占用进程，优先释放：

- openpi 服务：约 10.28 GiB
- Kit 进程：约 3.87 GiB

释放后建议直接重跑：

```bash
ROOT=/data/light/repro/physx_omni_2605_21572
ENV=/home/yjl/anaconda3/envs/3dgrut_nv
cd "$ROOT/code/PhysX-Omni"
HF_ENDPOINT=https://hf-mirror.com \
HF_HOME=/data/light/hf_cache \
ATTN_BACKEND=xformers \
SPCONV_ALGO=native \
PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True \
PATH="$ENV/bin:$PATH" \
"$ENV/bin/python" 2infer_geo.py --outputpath "$ROOT/repro_runs/vlm_full" --range 1
```

