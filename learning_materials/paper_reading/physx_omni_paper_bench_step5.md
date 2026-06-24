# PhysX-Omni 论文精读 第五步：PhysX-Bench 评测设计与数据字段

论文地址：[https://arxiv.org/abs/2605.21572v1](https://arxiv.org/abs/2605.21572v1)  
代码地址：[https://github.com/physx-omni/PhysX-Omni](https://github.com/physx-omni/PhysX-Omni)  
PhysX-Bench 数据集：[https://huggingface.co/datasets/PhysX-Omni/PhysX-Bench](https://huggingface.co/datasets/PhysX-Omni/PhysX-Bench)  
本地代码：`C:\Users\robot\Documents\成长学习库\physx-omni-assets\code\PhysX-Omni`

## 0. 一句话理解 PhysX-Bench

PhysX-Bench 是给 simulation-ready physical 3D generation 用的无 GT 评测基准。它不要求每张 in-the-wild 条件图都有对应的真实 3D 资产，而是把生成结果转成可视证据，再用固定 VLM prompt 评价几何外观、尺度、affordance、运动学、材料和语义描述。

它解决的是传统 3D benchmark 的一个核心缺口：传统指标更擅长评价几何和外观，但很难评价一个生成资产是否有合理尺度、可交互区域、关节行为、材料力学行为，以及 part-level 语义是否落在正确部件上。

## 1. Bench 的核心设计

PhysX-Bench 的设计可以拆成四层：

| 层级 | 做什么 | 为什么重要 |
|---|---|---|
| 条件图层 | 收集真实图片和合成渲染图片作为输入条件 | 覆盖真实场景和 synthetic asset，两者共同测试泛化 |
| 生成结果层 | 每个方法对同一个 object_id 生成 3D/物理资产 | 保证不同方法面对相同条件图 |
| 证据资产层 | 把 3D 结果渲染成 views、mask、heatmap、motion video、material video | VLM 不直接读内部参数，而是看可视化物理行为 |
| 评分与校验层 | 固定 prompt 评分，聚合 object-level/dataset-level，并校验分母 | 防止缺样本、缺证据导致平均分虚高 |

论文里强调的评测原则是：用 rendered images 或 videos 降低 VLM 理解复杂 3D 和物理属性的难度，而不是直接把原始物理参数塞给 VLM 让它抽象判断。

## 2. 数据来源与规模

官方 Hugging Face 数据集当前文件树包含：

| 数据域 | 条件图目录 | 数量 | object_id 形态 |
|---|---|---:|---|
| in-the-wild | `demo_inthewild/` | 426 | 连续或半连续数字字符串，如 `0.png`、`202.png` |
| mobility | `demo_mobility/` | 388 | PartNet-Mobility 风格数字 ID，如 `100028.png` |
| verse | `demo_verse/` | 400 | 32 位 hash 风格 ID，如 `00d1cb5aa82745228a3b764c97f867de.png` |
| 合计 | - | 1214 | - |

同时有三个 description JSON：

| 文件 | 条目数 | 字段结构 |
|---|---:|---|
| `descript_inthewild.json` | 426 | `{object_id: reference_description}` |
| `descript_mobility.json` | 388 | `{object_id: reference_description}` |
| `descript_verse.json` | 400 | `{object_id: reference_description}` |

本地 repo 的 `benchmark/assets/description/descript_*.json` 与 Hugging Face 当前版本在 key 和 value 上一致。README 很短，只声明 license 和 “Image source of PhysX-Bench”，真正的数据结构主要由文件树和 benchmark 代码约定。

## 3. 原始数据到本地评测布局

HF 原始数据：

```text
demo_<dataset>/<object_id>.png
descript_<dataset>.json
```

代码期望转换后的 condition image 布局：

```text
benchmark/benchmark_assets/condition_images/<dataset>/<object_id>/first_frame.png
```

转换脚本：

```bash
python3 benchmark/code/assets/prepare_demo_condition_images.py \
  --input-dir physx_result/demo_mobility \
  --dataset mobility \
  --output-root benchmark/benchmark_assets/condition_images \
  --symlink --skip-existing
```

注意：condition image 被 DQS、APS、KPS、MPS 共用。RQS/MCS/DCS 主要依赖生成资产的 rendered views 或 mask。

## 4. 七类评测指标

### 4.1 RQS - Render Quality Score

评价什么：

- 生成资产渲染图是否清晰。
- 轮廓、边缘、纹理、局部细节是否可辨。
- 是否有噪声、碎片、漂浮片、拉伸、异常渲染 artifact。

输入证据：

```text
benchmark/benchmark_assets/rendered_views/description/<source_folder>/<object_id>/000.png ... 029.png
benchmark/assets/quality_reference/image.png
```

代码会从 rendered views 中采样 4 张图给 VLM。prompt 让 VLM 输出 1 到 5 分，聚合器把它映射到 0 到 100。

### 4.2 MCS - Multi-view Consistency Score

评价什么：

- 多视角是否像同一个稳定的 3D 对象。
- 是否某些视角暴露坍缩、破洞、融化、异常缺失、异常突起。
- 材质和颜色是否跨视角一致。

输入证据：

```text
sampled rendered views
```

MCS 不评价类别是否正确，也不评价 affordance 或关节功能。它只问多视角是否能组成一个全局一致的对象。

### 4.3 DCS - Description Consistency Score

评价什么：

- 生成结果中的某个 mask 区域是否语义匹配 reference description。
- mask 是否精准落在被描述的 part 上，而不是覆盖全物体或大量无关区域。

输入证据：

```text
one color render
same-view black/white part mask
reference_description from descript_<dataset>.json
```

prompt 公式：

```text
DCS = round(0.60 * alignment_score + 0.40 * precision_score, 2)
```

其中：

- `alignment_score` 看语义是否对。
- `precision_score` 看 mask 是否定位准确。

### 4.4 DQS - Dimension Quality Score

评价什么：

- 生成资产的最大真实尺寸是否合理。

输入证据：

```text
condition image
basic_info.json / basic_info.txt 中的 dimension
或 physxgen 的 scale.npy
```

DQS 是两段式：

1. VLM 只看 condition image，估计真实世界尺寸 prior。
2. `score_dimension_results.py` 把方法输出的尺寸和 VLM 估计作对比。

代码公式：

```text
symmetric_error = 2 * abs(generated_max - estimated_max) / (generated_max + estimated_max)
if symmetric_error >= 0.8:
    DQS = 0
else:
    DQS = 100 * (1 - symmetric_error / 0.8)
```

### 4.5 APS - Affordance Plausibility Score

评价什么：

- affordance heatmap 的相对强弱排序是否符合人类交互常识。
- 关键交互区域是否高亮。
- 危险区域或不应交互区域是否被错误高亮。

输入证据：

```text
condition image
affordance heatmap views
```

APS 不看 heatmap 美观程度，而看“红色区域代表高 affordance”这一排序是否合理。

### 4.6 KPS - Kinematic Plausibility Score

评价什么：

- 可动部件是否符合图像先验。
- 新显露的隐藏结构或内部物体是否合理。
- 整体 articulation 是否连贯。

输入证据：

```text
condition image
standardized articulation video
image-prior JSON
```

KPS prompt 内部叫 VAPS，三部分权重：

```text
prior channel = 0.70
reveal channel = 0.20
global channel = 0.10
```

代码使用统一渲染器：

```text
benchmark/code/render/kinematic/kinematic_articulation_demo.py
```

不同方法的输入文件：

| 方法 | KPS 证据来源 |
|---|---|
| ours / physxanything | `basic.xml` |
| physxgen | `mesh/basic.urdf` |
| articulateanything | `joint_actor/iter_0/seed_0/mobility.urdf` |

### 4.7 MPS - Material Plausibility Score

评价什么：

- Young's modulus 对应的刚度、形变、回弹是否合理。
- Poisson's ratio 对应的横向膨胀和体积保持倾向是否合理。
- Density 对应的浮沉、惯性、碰撞质量感是否合理。

输入证据：

```text
condition image
water simulation video
floor simulation video
generated material parameters
```

MPS prompt 公式：

```text
weighted_score = 0.4 * S_E + 0.2 * S_nu + 0.4 * S_rho
MPS = 25 * (weighted_score - 1)
```

其中：

- `S_E` 是 Young's modulus 子分。
- `S_nu` 是 Poisson's ratio 子分。
- `S_rho` 是 density 子分。

## 5. 论文概念与当前开源代码的对应边界

论文里 PhysX-Bench 的 geometry 包含：

- CLIP score。
- 3D consistency。
- visual quality。

当前本地开源 benchmark 脚本中直接暴露的是：

- `RQS`：对应 visual quality。
- `MCS`：对应 3D consistency。
- 未看到同名 CLIP 评分脚本。

因此复现时要把两件事分开：

- 论文表格里的 Geometry 是论文报告层面的指标组。
- 当前公开代码主要提供 VLM-based RQS/MCS 和物理属性打分链路；CLIP 若要复现，需要另行确认作者是否在其它脚本、早期内部脚本或后续发布中提供。

## 6. 数据字段总览

Bench 的核心字段不是一个单一 schema，而是多层 schema：

| 层 | 核心字段 |
|---|---|
| HF 原始数据 | `demo_<dataset>/<object_id>.png`，`descript_<dataset>.json` |
| condition image | `dataset`，`object_id`，`first_frame.png` |
| method output | `source_folder`，`object_id`，`basic_info.json`，`basic.xml`，`basic.urdf`，`affordance/`，`description/` |
| metric manifest | `metric`，`method`，`dataset`，`object_id`，证据路径，`ready`，`status`，missing-zero 标记 |
| raw VLM result | `run_id`，`video_id`，`benchmark_context`，`turns_template`，`results[]`，`pair_error` |
| object score | `method`，`dataset`，`object_id`，`metric`，`score`，submetrics，`result_json` |
| summary score | `method`，`dataset`，`metric`，`count`，`mean`，`std` |
| denominator validation | `expected_count`，`raw_dedup_count`，`object_score_count`，`summary_count`，`count_mismatch` |

更详细字段字典见：

`C:\Users\robot\Documents\成长学习库\physx_omni_step5_bench_data_fields.md`

## 7. 为什么 denominator validation 是核心质量门

PhysX-Bench 的难点不是只打分，而是保证不同方法的分母一致。

如果某个方法缺少难样本的 rendered views、mask、heatmap、video，而聚合时直接跳过这些样本，它的均值会被虚高。因此代码设计了 missing-zero 和 denominator validation：

- missing RQS/MCS rendered views -> 0 分。
- missing DCS color/mask/description evidence -> DCS 0。
- malformed or missing DQS dimension -> DQS 0。
- missing APS heatmaps -> APS 0。
- missing KPS videos -> KPS 0。
- missing MPS water/floor video pairs -> MPS 0。

最终报告之前必须检查：

```text
count_mismatch == False
summary_count == expected_count
```

## 8. 和我们当前复现状态的关系

已经完成：

- 官方 demo 生成主流程跑通。
- benchmark tiny smoke 跑通 manifest、aggregation、denominator validation。
- 第五步已经把 Bench 的评测机制、数据字段和复现质量门整理成文档。

尚未完成：

- 全量准备 `physx_result/` 下所有方法输出。
- 全量生成 RQS/MCS/DCS/DQS/APS/KPS/MPS 证据资产。
- 全量运行 VLM 评分。
- 全量 denominator validation 后复现论文 PhysX-Bench 表格。

这意味着：当前可以讲清楚 PhysX-Bench 怎么设计、怎么跑、字段是什么；但还不能声称已经完整复现 PhysX-Bench 全表。

