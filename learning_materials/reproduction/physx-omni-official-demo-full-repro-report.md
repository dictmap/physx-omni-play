# PhysX-Omni 官方参考链路完整复现报告

复现日期：2026-06-20  
论文地址：https://arxiv.org/abs/2605.21572v1  
远端机器：4090 主机 `y12`  
远端根目录：`/data/light/repro/physx_omni_2605_21572`

## 结论

官方参考链路已走完：

1. `1vlm_demo.py` 对应的 VLM/RLE 阶段：已复用前面成功生成的 demo VLM 输出。
2. `2infer_geo.py` 几何/贴图解码阶段：已生成 7 个部件的 textured `GLB + OBJ + MTL + PNG`。
3. `3jsongen_update.py` 结构转换阶段：已生成 `basic.urdf`、`basic.xml`、`basic_info.json`。

本地完整产物目录：

`C:\Users\robot\physx_outputs\official_demo_full`

本地打包文件：

`C:\Users\robot\physx_outputs\physx_omni_official_demo_full_repro.zip`

预览图：

`C:\Users\robot\physx_outputs\official_demo_full\official_7part_mesh_preview.png`

## 关键输出

远端 case 目录：

`/data/light/repro/physx_omni_2605_21572/repro_runs/vlm_full/65e2f7b0452046be8ee948b49ee17ef4`

核心文件：

- `basic.urdf`
- `basic.xml`
- `basic_info.json`
- `objs/0/0.glb` ... `objs/6/6.glb`
- `objs/0/0.obj` ... `objs/6/6.obj`
- `objs/*/material_0.png`
- `allind.npy`
- `allind.ply`
- `voxel_projection.png`

本地校验结果：

- `basic.urdf`：XML 可解析，根节点 `robot`
- `basic.xml`：XML 可解析，根节点 `mujoco`
- GLB 数量：`7`
- OBJ 数量：`7`
- PNG 贴图数量：`7`

## 运行中修正过的问题

1. 释放显存  
   4090 上原有 Kit 和 openpi 进程占用约 14GB 显存。已停止这些进程后，GPU 空闲显存恢复到约 23.7GB。

2. DINOv2 在线检查卡住  
   官方 `torch.hub.load('facebookresearch/dinov2', ...)` 在网络检查阶段静默卡住。添加了环境变量门控补丁：设置 `DINO_LOCAL_REPO=/home/yjl/.cache/torch/hub/facebookresearch_dinov2_main` 时，从本地缓存加载 DINOv2。模型权重和推理逻辑不变。

3. 默认 `radiance_field` 占满显存  
   官方 `decoder_each.py` 默认解码 `mesh + gaussian + radiance_field`，但后续 `to_glb()` 只使用 `mesh + gaussian`。整张 4090 释放后，`radiance_field` 阶段仍 OOM。已将 `run_decoder` 的 formats 调整为 `['mesh', 'gaussian']`，保留 textured GLB 所需路径。

4. 缺失 Gaussian rasterizer  
   `to_glb()` 贴图烘焙需要 `diff_gaussian_rasterization`。按官方 `setup.sh --mipgaussian` 对应来源安装了 `autonomousvision/mip-splatting/submodules/diff-gaussian-rasterization`，并确认可导入。

## 复现命令摘要

几何/贴图阶段：

```bash
ROOT=/data/light/repro/physx_omni_2605_21572
ENV=/home/yjl/anaconda3/envs/3dgrut_nv
cd "$ROOT/code/PhysX-Omni"
HF_ENDPOINT=https://hf-mirror.com \
HF_HOME=/data/light/hf_cache \
DINO_LOCAL_REPO=/home/yjl/.cache/torch/hub/facebookresearch_dinov2_main \
PYTHONUNBUFFERED=1 \
ATTN_BACKEND=xformers \
SPCONV_ALGO=native \
PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True \
PATH="$ENV/bin:$PATH" \
"$ENV/bin/python" 2infer_geo.py --outputpath "$ROOT/repro_runs/vlm_full" --range 1
```

URDF/XML 阶段：

```bash
ROOT=/data/light/repro/physx_omni_2605_21572
ENV=/home/yjl/anaconda3/envs/3dgrut_nv
cd "$ROOT/code/PhysX-Omni"
PATH="$ENV/bin:$PATH" \
"$ENV/bin/python" 3jsongen_update.py --basepath "$ROOT/repro_runs/vlm_full"
```

## 关于自定义 M&M's 罐图片

你给的罐子实际是高罐，但那次结果只重建出 `Jar Lid`，所以 mesh 看起来很矮。这不是显示比例压扁，而是 VLM/RLE 阶段只有盖子 `ind_2.npy` 非空，罐体主体为空。

要改善这类真实图片质量，下一步应先做输入预处理：前景裁剪、背景去除、把高罐主体居中拉正、尽量减少桌面和商标文字干扰，再重跑 VLM 阶段。

