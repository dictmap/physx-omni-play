# 第九步证据矩阵：审稿问题与本地代码/复现证据

本文件把审稿判断挂到具体证据上，避免第九步只是主观评论。

## 源文件与本地资产

| 类型 | 路径或链接 | 用途 |
|---|---|---|
| 论文 | https://arxiv.org/abs/2605.21572v1 | 论文主张和实验结论 |
| 官方代码 | https://github.com/physx-omni/PhysX-Omni | 方法和 benchmark 实现 |
| 本地代码 | `C:\Users\robot\Documents\成长学习库\physx-omni-assets\code\PhysX-Omni` | 已下载官方仓库 |
| 官方 demo 复现输出 | `C:\Users\robot\physx_outputs\official_demo_full` | URDF/XML/JSON/mesh 产物检查 |
| Benchmark README | `benchmark\README.md` | 指标定义、模型、缺失证据策略 |
| VLM runner | `benchmark\code\vlm\multi.py` | Qwen3.5 judge、缺失证据自动 0 分 |
| 聚合脚本 | `benchmark\code\aggregation\aggregate_vlm_results.py` | 分数聚合、MPS/DCS/KPS 字段 |
| Prompt 目录 | `benchmark\prompts` | VLM judge 的具体评价准则 |
| RLE 数据脚本 | `dataset\3generate_data_new_64_finetune_rle.py` | 64³ voxel RLE、template/delta、token 过滤 |

## 证据 1：benchmark 使用单一默认 VLM judge

`benchmark\README.md` 和 `benchmark\code\vlm\multi.py` 中默认 judge 是：

```text
Qwen/Qwen3.5-122B-A10B
```

这说明官方评估的主通道依赖一个具体 VLM。缺失证据自动 0 分的分母策略是严格的，但 judge 选择本身仍可能影响 ranking。

审稿含义：

- 需要跨 judge 稳定性实验。
- 如果只报告 Qwen3.5 下的排名，不能排除 prompt/model-specific bias。

## 证据 2：缺失证据进入分母并计 0 分

`benchmark\README.md` 的 Missing Evidence Policy 覆盖：

- RQS/MCS 缺渲染视图；
- DCS 缺 color/mask/description；
- DQS 缺生成尺寸或格式错误；
- APS 缺 heatmap；
- KPS 缺 video；
- MPS 缺 water/floor video。

`multi.py` 里也有 APS/KPS/MPS/DCS/RQS/MCS 的 auto-score 逻辑。

审稿含义：

- 这是 benchmark 的强项，减少了 selective reporting。
- 但它解决的是分母公平，不解决 VLM judge 主观性。

## 证据 3：DQS 明确使用类别先验和日常尺寸

`benchmark\prompts\prompts_dimension.yaml` 要求：当图像缺少清晰尺度参照时，基于物体类别先验、日常尺寸和视觉线索估计。

审稿含义：

- DQS 的尺寸不是单图真实测量。
- 它更像“VLM 对合理尺寸范围的先验判断 + 算法输出误差计算”。
- 对罐子这类对象，如果没有标尺，模型可能把高罐误判成矮罐，这是单图尺度歧义的典型表现。

## 证据 4：APS 使用日常常识和安全常识

`benchmark\prompts\prompts_affordance.yaml` 要求根据常识建立交互区域优先级，并把危险区域作为低 affordance。

审稿含义：

- APS 评估的是“可交互热力图是否符合人类常识”。
- 它不是机器人真实接触成功率，也不是力控/抓取实验。

## 证据 5：MPS 用材料常识、视频和参数共同评分

`benchmark\prompts\prompts_material.yaml` 要求 VLM 根据条件图、地面 impact 视频、水中视频、生成参数来评价 Young's modulus、Poisson ratio、density，并且承认 Poisson ratio 只靠视频很难可靠判断。

审稿含义：

- MPS 的价值是检查 material behavior 是否看起来合理。
- 但它不是材料测试仪，不等于真实杨氏模量/密度测量。
- 对不可见内部结构、复合材料、空心物体，单图和短视频无法确定真实材料参数。

## 证据 6：KPS/VAPS 使用图像结构先验再看视频

`benchmark\prompts\prompts_vaps_english.yaml` 先让 VLM 从单图抽取 articulation prior，再用视频判断 observed_state，并按 prior/reveal/global 权重计算 VAPS。

审稿含义：

- KPS 强依赖图像先验和 prompt 规则。
- 它能评估“视频中的运动是否和先验一致”，但不能独立证明真实关节轴、阻尼和限位准确。

## 证据 7：官方 demo 的 JSON 和 URDF/XML 物理字段存在落差

我检查了：

```text
C:\Users\robot\physx_outputs\official_demo_full\basic_info.json
C:\Users\robot\physx_outputs\official_demo_full\basic.urdf
C:\Users\robot\physx_outputs\official_demo_full\basic.xml
```

结果摘要：

| 文件 | 检查结果 | 审稿含义 |
|---|---|---|
| `basic_info.json` | 有对象尺寸、部件、材料、density、Young's modulus、Poisson ratio、group/joint 信息 | 语义和物理参数在 JSON 层存在 |
| `basic.urdf` | 13 个 link 的 mass 都是 1.0，惯量字段高度重复，未见 density/friction | URDF 动力学字段不足 |
| `basic.xml` | 有 density，joint frictionloss 为 0.0，未显式看到完整 mass/inertia | MJCF 可用性强于 URDF，但仍不足以说明真实动力学 |

审稿含义：

- 输出文件可解析不等于物理字段可靠。
- JSON 层的物理语义没有完全转化为高质量 dynamics model。

## 证据 8：RLE 是 64³ voxel 的无损编码，但复杂度受 token 约束

`dataset\3generate_data_new_64_finetune_rle.py` 中可见：

- shape 默认为 `(64, 64, 64)`；
- z-slice 2D RLE；
- template/delta lossless 编码；
- 编码后再 decode 并比较 voxel 索引；
- 训练数据按 token 长度过滤，阈值为 20000。

审稿含义：

- RLE 编码本身可靠；
- 但生成模型是否能泛化到复杂拓扑或更高分辨率，仍需要实验；
- token 过滤可能让数据偏向较简单对象。

## 证据 9：README 将 TRELLIS.2 作为可替换 decoder

官方 README 提到当前使用预训练 TRELLIS decoder，并可替换为 TRELLIS.2 以获得更精细几何和更高质量结构。

审稿含义：

- 作者自己也承认几何 decoder 是可升级模块。
- 升级 decoder 主要解决视觉几何质量，不自动解决物理参数校准、URDF/MJCF 完整性和真实机器人效果。

## 七个问题的证据强度表

| 问题 | 当前证据强度 | 我的判断 |
|---|---:|---|
| 单图物理属性是真实推断还是常识补全 | 强证据支持“混合且常识占大头” | 需要把 physical property 解释为 plausible prior |
| 换 VLM judge 排名是否稳定 | 证据不足 | 必须补多 judge ranking correlation |
| 跨 MuJoCo/Isaac/Genesis 是否一致 | 证据不足 | 需要跨仿真器导入/稳定/接触测试 |
| URDF/XML 是否含可靠质量惯量摩擦限位 | 本地证据显示不足 | 当前不能直接作为高可信 dynamics model |
| 是否提升真实机器人 sim-to-real | 证据不足 | 需要真实机器人 ablation |
| template RLE 是否泛化复杂拓扑/高分辨率 | 编码可靠，泛化不足 | 需要分辨率和拓扑复杂度 scaling |
| 换 TRELLIS.2 后瓶颈在哪里 | 有合理推断 | 几何改善后瓶颈转向物理语义/校准/评测 |

## 可直接放进 paper-reading 的审稿摘要

PhysX-Omni 的主要强项是端到端系统整合和可运行资产生成；主要风险是将 VLM 先验生成的 plausible physical attributes 误读为 calibrated physical truth。PhysX-Bench 的分母控制较严格，但 judge 稳定性未充分证明。官方 demo 的 JSON 层有材料和物理参数，但 URDF/MJCF 层仍存在质量、惯量、摩擦和限位字段不完整的问题。因此，这篇论文目前更适合被理解为“从单图生成视觉/语义/物理常识一致的仿真候选资产”，而不是“从单图恢复真实动力学资产”。
