# 13 GitHub 推理管线精讲

对应 `paper-reading.md`：`## 13. GitHub 推理管线`

## 官方推理步骤

README 给出的 inference 流程：

```bash
python download.py
python 1vlm_demo.py
python 2infer_geo.py
python 3jsongen_update.py
```

这四步分别对应：

| 步骤 | 作用 |
|---|---|
| `download.py` | 下载模型权重 |
| `1vlm_demo.py` | VLM 推理，生成结构化物理/几何文本 |
| `2infer_geo.py` | decoder 推理，生成几何 |
| `3jsongen_update.py` | 转换为 URDF/XML 等资产 |

## 本地复现输出

本地官方 demo 输出在：

`C:\Users\robot\physx_outputs\official_demo_full`

关键文件：

- `basic_info.json`：结构化物理信息。
- `basic.urdf`：URDF 结构。
- `basic.xml`：XML/MJCF 结构。
- `ind_*.npy` / `ind_*.ply`：部件 voxel / point 可视化资产。
- `cond_img.png`：输入条件图。
- `official_7part_mesh_preview.png`：部件预览。
- `voxel_projection.png`：voxel 投影。

## 推理输出怎么读

`basic_info.json` 是最值得先看的文件。它让我们知道模型是否真的生成了物理语义，而不是只生成 mesh。

本地 demo 中：

- `object_name`：Dumpster
- `category`：Waste Container
- `dimension`：180*120*150
- `parts`：7 个部件
- `group_info`：dict 类型，包含多个运动/父子关系条目

这说明推理链路确实产出了可解释结构。

## 大白话说明

推理管线像一条生产线：

1. 先备料：下载模型。
2. 看图写说明书：VLM 输出部件、材料、尺寸、关节。
3. 按说明书做形状：decoder 生成几何。
4. 装配成仿真资产：导出 URDF/XML。

如果只看最后图片，容易漏掉最重要的结构化信息。

## 常见失败点

复现时容易失败在：

- 模型权重未完整下载。
- CUDA / spconv / kaolin / nvdiffrast 依赖不匹配。
- TRELLIS 子模块或 decoder 依赖不完整。
- Windows 原生环境不如 Linux GPU 环境稳定。
- 输出目录里有文件，但 JSON 或 URDF 结构不完整。

## 质量检查建议

推理成功至少应检查：

1. `basic_info.json` 可解析。
2. `parts` 数量合理。
3. 每个 part 有名称和物理属性。
4. URDF/XML 存在。
5. voxel 或 mesh 预览不是空图。
6. 若物体有可动结构，`group_info` 不应为空。

