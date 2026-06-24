# PhysX-Omni 论文精读 第七步：被超越方法、接近分数与复现优先级

论文地址：[https://arxiv.org/abs/2605.21572v1](https://arxiv.org/abs/2605.21572v1)  
HTML 版本：[https://arxiv.org/html/2605.21572v1](https://arxiv.org/html/2605.21572v1)  
本地代码：`C:\Users\robot\Documents\成长学习库\physx-omni-assets\code\PhysX-Omni`

## 0. 结论先行

第七步的核心判断：

1. **最值得优先复现的是 PhysX-Anything**。它是 PhysX-Omni 的直接前作、论文中出现频率最高、Table 1/2 全维度可比，并且在 PhysX-Mobility 的 F-score 上还略高于 PhysX-Omni。
2. **第二优先级是 MonoArt**。它不是完整 physical asset 生成器，但在几何/视觉指标上非常强：PhysX-Bench 中 CLIP、3D consistency、visual quality 都高于 PhysX-Omni；PhysX-Mobility conventional CD/F-score 也非常接近。
3. **第三优先级是 PhysXGen / PhysX-3D**。它覆盖物理属性，和 PhysX-Omni 的目标接近，但数据/模型资产较重，复现成本明显高于只做单图 demo。
4. **Articulate-Anything 适合作为 articulation-only 对照**，但它缺少材料、尺度、affordance、描述等完整物理维度，不应作为首个复现目标。
5. 截至 2026-06-20 的检索结果，没有找到明确“后续论文在 PhysX-Bench 上超越 PhysX-Omni”的公开论文。arXiv API 对 `all:"PhysX-Omni"` 只返回 PhysX-Omni 本文；Semantic Scholar API 本轮返回 429，因此 citation 侧结论需要后续再刷一次。
6. 同期或近同期方向中，**MonoArt** 已经在自己的 PartNet-Mobility articulated reconstruction 设置里超越 PhysX-Anything / PhysXGen / Articulate-Anything 等共同 baseline，但它解决的是 articulation reconstruction，不是 PhysX-Omni 的完整 rigid/deformable/articulated + material/scale/affordance 统一生成任务。

## 1. 论文中被比较的方法

| 方法 | 任务定位 | 在 PhysX-Omni 中可比维度 | 关键限制 | 复现价值 |
|---|---|---|---|---|
| Articulate-Anything | 自动构建 articulated object，偏 VLM 推理与 URDF/关节结构 | geometry、kinematic | 不覆盖完整尺度、材料、affordance、description | 中等，适合验证 articulation-only baseline |
| MonoArt | 单图 articulated 3D reconstruction，几何和运动结构强 | geometry、kinematic；PhysX-Bench 几何三项 | 不生成完整 simulation-ready 物理属性 | 高，因它在几何/视觉项非常接近甚至超过 PhysX-Omni |
| PhysXGen / PhysX-3D | physical-grounded 3D asset generation，PhysXNet 数据和 PhysXGen 模型 | geometry、scale、material、affordance、kinematic、description | 较早框架；资产重；不是 PhysX-Anything/Omni 的统一多轮 VLM 表达 | 中高，适合做物理属性 baseline |
| PhysX-Anything | 直接前作，single image 到 simulation-ready physical 3D asset | 全维度 | 文本 voxel index 与显式 segmentation 造成结构瓶颈 | 最高，和 PhysX-Omni 最可比 |

论文 related work 对 PhysX-Anything 的定位很关键：PhysX-Anything 用纯文本表示建模 simulation-ready physical 3D asset，但显式 segmentation stage 成为性能瓶颈；PhysX-Omni 的主张是用 template-based RLE / explicit high-resolution 3D representation 减少这一瓶颈。

## 2. 高频程度

基于本地 `2605.21572v1.html` 的大小写不敏感全文计数：

| 关键词 | 出现次数 | 解读 |
|---|---:|---|
| PhysX-Anything / PhysX-anything | 24 | 直接前作，出现频率最高 |
| MonoArt | 19 | 几何/运动强 baseline，论文讨论较多 |
| PhysX-3D + PhysXGen | 19 | 数据、前置范式和 baseline 都相关 |
| Articulate-Anything | 12 | articulation baseline |
| DreamArt | 4 | related work，非主表格重点 |
| SOPHY | 2 | related work，非主表格重点 |
| Articulate AnyMesh | 2 | related work，非主表格重点 |

因此“高频复现”的排序不是 Articulate-Anything，而是：

1. PhysX-Anything
2. MonoArt
3. PhysXGen / PhysX-3D
4. Articulate-Anything

## 3. 分数最接近和反超点

### 3.1 PhysXVerse conventional metrics

| 指标 | PhysX-Omni | 最接近/最强 baseline | 解读 |
|---|---:|---:|---|
| PSNR ↑ | 21.52 | MonoArt 19.68 / PhysXGen 19.41 | MonoArt 和 PhysXGen 都接近，但仍低约 1.8-2.1 |
| CD ↓ | 2.95 | MonoArt 7.03 | MonoArt 是最接近几何误差 baseline |
| F-score ↑ | 91.28 | MonoArt 85.27 | MonoArt 接近，但差距仍明显 |
| Kinematic ↑ | 0.9185 | PhysX-Anything 0.4191 | PhysX-Omni 大幅领先 |
| Material / affordance / description | PhysX-Omni 全部最高 | PhysXGen / PhysX-Anything | 物理属性是 PhysX-Omni 主优势区 |

### 3.2 PhysX-Mobility conventional metrics

| 指标 | PhysX-Omni | 最接近/最强 baseline | 解读 |
|---|---:|---:|---|
| PSNR ↑ | 18.38 | PhysX-Anything 16.57 / MonoArt 16.46 | PhysX-Anything 稍近 |
| CD ↓ | 4.70 | MonoArt 6.35 | MonoArt 很接近 |
| F-score ↑ | 88.50 | **PhysX-Anything 89.51** | 这是 PhysX-Omni 未胜出的关键单项 |
| Absolute scale ↓ | 2.78 | PhysX-Anything 22.58 | PhysX-Omni 大幅领先 |
| Material ↑ | 24.09 | PhysX-Anything 22.58 | 分差较小，值得复现实测 |
| Affordance ↑ | 16.58 | PhysX-Anything 16.29 | 几乎贴近，适合做高价值复现 |
| Kinematic ↑ | 0.8603 | PhysX-Anything 0.7852 | 分差不大，直接前作值得复现 |
| Description ↑ | 28.40 | PhysX-Anything 26.28 | 分差不大 |

PhysX-Mobility 是复现优先级最高的数据设置，因为它包含多个“接近分数”：F-score 被 PhysX-Anything 反超，material/affordance/description/kinematic 也都接近。

### 3.3 PhysX-Bench

| 指标 | PhysX-Omni | 最强 baseline | 是否被超过 |
|---|---:|---:|---|
| CLIP ↑ | 0.767 | **MonoArt 0.835** | 是 |
| 3D Consistency ↑ | 64.48 | **MonoArt 82.56** | 是 |
| Visual Quality ↑ | 90.00 | **MonoArt 96.20** | 是 |
| Absolute scale ↑ | 64.26 | PhysX-Anything 50.20 | 否 |
| Material ↑ | 59.89 | PhysX-Anything 44.70 | 否 |
| Affordance ↑ | 70.57 | PhysXGen 66.07 | 否，但接近 |
| Kinematic ↑ | 80.72 | Articulate-Anything 71.25 | 否 |
| Description ↑ | 39.02 | PhysX-Anything 26.89 | 否 |

这里要保留一个严谨结论：**PhysX-Omni 不是在 PhysX-Bench 所有列第一**。MonoArt 在几何/视觉项上更强；PhysX-Omni 的优势主要是 simulation-ready 物理属性和语义一致性。

## 4. 推荐复现矩阵

| 优先级 | 方法 | 为什么先做 | 目标不是 |
|---|---|---|---|
| P0 | PhysX-Anything | 高频最高、直接前作、全维度可比、分数最接近，且 PhysX-Mobility F-score 反超 PhysX-Omni | 不是只跑 demo；要尽量产出可喂给 PhysX-Bench 的 baseline 输出 |
| P1 | MonoArt | PhysX-Bench 几何三项超过 PhysX-Omni，PhysXVerse/PhysX-Mobility 几何也最接近 | 不要把它当完整物理属性 baseline |
| P2 | PhysXGen / PhysX-3D | 覆盖物理属性，和 PhysX-Omni 目标接近 | 不建议一上来全量下载 1.8TB 数据 |
| P3 | Articulate-Anything | kinematic-only 对照，有官方代码，适合比较关节结构 | 不适合评估材料/尺度/affordance/description |

## 5. “是否已有论文超越 PhysX-Omni”的检索结论

本轮检索覆盖：

- arXiv API：`all:"PhysX-Omni"`，结果只有 PhysX-Omni 本文。
- arXiv API：`all:"simulation-ready physical 3D"`，结果为 PhysX-Omni 与 PhysX-Anything。
- Web 搜索：`"PhysX-Omni" "outperform"`、`"PhysX-Omni" "PhysX-Bench"`、`"2605.21572"`、`"PhysXVerse" "outperform"`。
- Semantic Scholar Graph API：本轮请求返回 429，未能确认引用列表。

谨慎结论：

截至 2026-06-20，**没有找到公开论文明确声称在 PhysX-Bench 或 PhysXVerse / PhysX-Mobility 同协议上超越 PhysX-Omni**。当前网络结果主要是论文索引、项目页、新闻解读和社交媒体传播。

这个结论不是永久结论，建议在正式报告里写成“截至检索日期未发现”，不要写成“没有任何后续工作”。

## 6. 同期/近同期超越共同 baseline 的工作

### 6.1 MonoArt

论文：[https://arxiv.org/html/2603.19231v1](https://arxiv.org/html/2603.19231v1)  
代码：[https://github.com/Quest4Science/MonoArt](https://github.com/Quest4Science/MonoArt)

MonoArt 在自己的 PartNet-Mobility 设置里比较了 Articulate-Anything、PhysXGen、PhysX-Anything 等共同 baseline。它在 full 46 classes 上报告：

- CD 1.25，优于 PhysXAnything 1.88、ArtAny 2.07、PhysXGen 3.06。
- F-score 0.670，优于 PhysXAnything 0.531、ArtAny 0.514、PhysXGen 0.501。
- PSNR 18.55，优于 PhysXAnything 17.07。
- Type accuracy 67.47，优于 PhysXAnything 63.35。
- Pivot error 0.108，优于 PhysXAnything 0.173。

但它不是完整替代 PhysX-Omni，因为它没有覆盖 PhysX-Omni 的材料、尺度、affordance、功能描述和 deformable/general object asset 生成。

### 6.2 MotionAnymesh

论文：[https://arxiv.org/html/2603.12936v1](https://arxiv.org/html/2603.12936v1)

MotionAnymesh 和 PhysX-Omni 都落在 simulation-ready / articulation 方向，但它没有直接比较 PhysX-Omni 或 PhysX-Anything。它比较的是 Articulate-Anything、Articulate-AnyMesh、SINGAPO、URDFormer、PARIS，并在 part segmentation、joint estimation、physical executability 上报告明显优势。因此它是“同方向值得关注”，不是“已超越 PhysX-Omni”。

### 6.3 REST3D

论文：[https://arxiv.org/html/2605.30338v1](https://arxiv.org/html/2605.30338v1)

REST3D 是 single-image 到 physically stable 3D scene reconstruction。它关注 scene-level 物体支撑、漂浮、穿模和稳定仿真，不是单物体 simulation-ready physical asset generation。它可以作为 PhysX-Omni 后续 scene generation 应用的对照，但不能直接进入 PhysX-Bench 单物体表格。

## 7. 下一步建议

下一步不要马上全量复现四个 baseline。建议分三阶段推进：

1. **Phase A：PhysX-Anything 单图 + 小集输出格式对齐**  
   目标是跑通 PhysX-Anything 官方 demo，拿同一张罐子图和 PhysX-Bench 小样本输出 mesh / JSON / articulation 证据，并转成 PhysX-Bench 所需目录结构。

2. **Phase B：MonoArt 几何/kinematic 对照**  
   目标是跑通 MonoArt 的单图推理，并用同一输入图生成几何/关节视频证据。只比较 geometry 和 kinematic，不比较它没有输出的 material/scale 等项。

3. **Phase C：PhysXGen / Articulate-Anything 小样本**  
   目标是补齐物理属性 baseline 和 articulation-only baseline。这里更适合先做 1-5 个样本的输出规范化，而不是全量 benchmark。

