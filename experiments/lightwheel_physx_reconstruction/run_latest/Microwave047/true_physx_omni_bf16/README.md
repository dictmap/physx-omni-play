# Microwave047 4090 真实 PhysX-Omni 复现记录

## 结论

本目录是 `Microwave047` 的真实 PhysX-Omni 4090 输出，不是本地结构 proxy。

- 输入：`Microwave047_textured_condition.png`，由原始 Lightwheel USD 和原始 base-color atlas 渲染后上传到 4090。
- VLM 模式：`bf16_offload`。
- VLM 结果：识别为 `Microwave Oven`，生成 7 个 parts。
- RLE/voxel：总计 22236 voxels。
- 几何后处理：7 个 parts 均生成 `OBJ/GLB/material_0.png`。
- 物理结构后处理：生成 `basic.urdf` 和 `basic.xml`。

## 关键文件

- `cond_img.png`：送入 PhysX-Omni VLM 的条件图。
- `basic_info.txt`：VLM 生成的部件、材料、物理属性和关节描述。
- `repro_summary.json`：VLM 运行摘要。
- `voxel_projection.png`：7 个部件的 voxel 投影。
- `true_physx_omni_mesh_preview.png`：7 个真实 GLB 输出合并后的本地渲染预览。
- `objs/*/*.glb`：官方几何解码输出。
- `basic.urdf` / `basic.xml`：官方 `3jsongen_update.py` 输出。
- `logs/lightwheel_true_microwave047_bf16_vlm.log`：VLM 日志。
- `logs/lightwheel_true_microwave047_bf16_geo_jsongen_dinofix.log`：几何解码和 URDF/MJCF 日志。

## 运行边界

- 远端 4bit 路径因为 `bitsandbytes` package metadata 缺失失败，本次切到官方脚本支持的 `bf16_offload` 路径跑通。
- 远端 OpenUSD `usdrecord` 缺 Hydra renderer plugin，远端 Blender 3.0.1 的 USD import operator 不可执行；条件图因此在本机 Blender 4.5 从原始 USD 渲染后上传到 4090。
- PhysX-Omni 官方链路输出 GLB/OBJ/URDF/MJCF，不直接输出 USDA。本目录不把本地 structural proxy 冒充为官方生成资产。
- `basic.urdf` 中质量、惯量大量仍为默认值，不能据此声称物理参数已经可靠。
