# PhysX-Omni 论文精读 第四步：Baseline 与实验严谨梳理

论文地址：[https://arxiv.org/abs/2605.21572v1](https://arxiv.org/abs/2605.21572v1)  
代码地址：[https://github.com/physx-omni/PhysX-Omni](https://github.com/physx-omni/PhysX-Omni)  
本地代码：`C:\Users\robot\Documents\成长学习库\physx-omni-assets\code\PhysX-Omni`，当前 `git` 版本 `46fa1cd`  
本地论文源码：`C:\Users\robot\Documents\成长学习库\physx-omni-author-sources\src\main.tex`  
本地官方 demo 复现输出：`C:\Users\robot\physx_outputs\official_demo_full`  
本地 benchmark smoke 输出：`C:\Users\robot\Documents\成长学习库\physx-omni-assets\code\PhysX-Omni\benchmark\tiny_example\generated`

## 0. 这一部分先给结论

PhysX-Omni 的实验不是只在“图像看起来像不像”上做比较，而是分成两套评价：

1. **有 GT 的 conventional evaluation**：在 PhysXVerse 和 PhysX-Mobility 上比较几何与物理属性，指标包括 PSNR、Chamfer Distance、F-score、绝对尺度、材料、affordance、运动学、描述。
2. **无 GT 的 PhysX-Bench**：把生成结果渲染成图像或视频，再由开源 VLM `Qwen/Qwen3.5-122B-A10B` 按统一 prompt 打分，覆盖视觉质量、多视角一致性、尺度、affordance、运动学、材料、描述。

论文里的核心实验结论要分开看：

- 在 **PhysXVerse conventional 指标**上，PhysX-Omni 对所有列都是最优。
- 在 **PhysX-Mobility conventional 指标**上，PhysX-Omni 在 PSNR、CD、绝对尺度、材料、affordance、运动学、描述上最好，但 **F-score 不是最好**，PhysX-Anything 是 `89.51`，PhysX-Omni 是 `88.50`。
- 在 **PhysX-Bench** 上，PhysX-Omni 不是几何视觉指标第一：MonoArt 的 CLIP、3D consistency、visual quality 都更高。PhysX-Omni 的优势主要集中在 simulation-ready 物理维度：尺度、材料、affordance、运动学、描述。
- 最接近的 baseline 是 **PhysX-Anything**。论文认为 PhysX-Anything 的瓶颈在文本 voxel index 表示和显式 segmentation 中间阶段；PhysX-Omni 用 template-based RLE 直接生成高分辨率结构，减少 segmentation 误差传播。
- 我们本地已经跑通的是 **官方生成主流程**和 **benchmark 聚合/分母校验 smoke**。这证明代码路径可执行，但不能把它说成论文 Table 1 / Table 2 的完整复现，因为 full benchmark 还需要各 baseline 输出、condition images、渲染资产、VLM 服务和全量 manifest。

## 1. Baseline 分类

论文比较的 baseline 可以分成三类：

| 方法 | 主要能力 | 论文中可比指标 | 关键局限 |
|---|---:|---|---|
| Articulate-Anything | 生成或构建 articulated asset | geometry、kinematic | 不输出完整尺度、材料、affordance、description，因此很多列为 `--` |
| MonoArt | 单图 articulated 3D/运动估计，强依赖几何生成先验 | geometry、kinematic | 几何强，但不是完整 simulation-ready 物理属性生成器 |
| PhysXGen | 图像到带物理属性的 3D asset | geometry、scale、material、affordance、kinematic、description | 物理属性覆盖较多，但不是 PhysX-Anything/PhysX-Omni 这种统一 sim-ready 表达 |
| PhysX-Anything | 直接前作，文本表示 simulation-ready 资产 | geometry 与物理属性全列 | 依赖显式 segmentation，文本 voxel index 表示较冗长且易损失结构 |
| PhysX-Omni | 本文方法，统一 rigid/deformable/articulated sim-ready 生成 | 全列 | 训练和 full benchmark 复现成本高 |

更详细的 baseline 对照见：

- `C:\Users\robot\Documents\成长学习库\physx_omni_step4_baseline_matrix.md`

## 2. Conventional Evaluation 该怎么读

论文的 conventional evaluation 使用有 GT 的 PhysXVerse 和 PhysX-Mobility。几何部分对生成资产和 GT 资产从 30 个视角渲染，然后平均计算 PSNR、CD、F-score。物理属性部分延续 PhysX-Anything protocol：

- absolute scale：预测尺度与 GT 尺度的 MSE，越低越好。
- material / affordance / description：基于 heatmap 的 PSNR，越高越好。
- kinematic：关节轴位置、方向、关节类型、运动范围等 articulation 参数的 MSE 或对应评分，论文表中越高越好。

关键表格结论：

| 数据集 | 主要观察 |
|---|---|
| PhysXVerse | PhysX-Omni 全列第一。CD 从 MonoArt 的 `7.03` 降到 `2.95`，下降约 `58.0%`；相对 PhysX-Anything 的 `37.06` 下降约 `92.0%`。 |
| PhysXVerse | 绝对尺度误差从 PhysX-Anything 的 `298.19` 降到 `2.79`，下降约 `99.1%`。运动学从 `0.4191` 到 `0.9185`，约 `2.19x`。 |
| PhysX-Mobility | PhysX-Omni 在大多数指标上第一，但 F-score 不是第一。PhysX-Anything `89.51` 高于 PhysX-Omni `88.50`。 |
| PhysX-Mobility | CD 相对 PhysX-Anything 从 `23.13` 降到 `4.70`，下降约 `79.7%`；运动学相对 PhysX-Anything 提升约 `9.6%`。 |

详细数值和逐列解释见：

- `C:\Users\robot\Documents\成长学习库\physx_omni_step4_experiment_tables_analysis.md`

## 3. PhysX-Bench 该怎么读

PhysX-Bench 是论文新增的无 GT 评估框架。它的出发点是：真实 in-the-wild 图片没有 GT 3D 资产，因此不能直接算 CD 或 GT heatmap PSNR。代码里采用的策略是：

1. 把每个方法的输出转成统一证据资产，例如多视角渲染图、mask、affordance heatmap、kinematic video、material simulation video。
2. 为每个指标构造 JSONL manifest。
3. 用开源 VLM `Qwen/Qwen3.5-122B-A10B` 和固定 prompt 输出结构化 JSON 分数。
4. `aggregate_vlm_results.py` 聚合 object-level 和 dataset-level 分数。
5. `validate_denominators.py` 校验每个 method / dataset / metric 的分母，避免漏样本后虚高。

PhysX-Bench 表格的严谨读法：

- MonoArt 在几何三个维度第一：CLIP `0.835`、3D consistency `82.56`、visual quality `96.20`。
- PhysX-Omni 在物理维度第一：scale `64.26`、material `59.89`、affordance `70.57`、kinematic `80.72`、description `39.02`。
- 因此不能简单说 PhysX-Omni 在 PhysX-Bench “所有指标最佳”。准确说法是：**MonoArt 更强于几何外观，PhysX-Omni 更强于 simulation-ready 物理属性与语义一致性，整体更均衡。**

代码层面的 benchmark 映射见：

- `C:\Users\robot\Documents\成长学习库\physx_omni_step4_benchmark_code_mapping.md`

## 4. Baseline 与代码输出格式的对应关系

`benchmark/README.md` 明确要求不同方法的输出放在 `physx_result/<method_result_folder>/<object_id>/` 下。`benchmark/scripts/common.sh` 中的 `source_folder()` 给出默认命名：

| 方法 | 默认结果目录 |
|---|---|
| ours | `ours_<dataset>_181500` |
| physxanything | `output_physxanything_<dataset>` |
| physxgen | `outputs_physxgen_<dataset>` |
| articulateanything | `output_articulateanything_<dataset>` |

这说明 benchmark 不是直接调用各 baseline 模型从零生成，而是假设 baseline 输出已经按约定准备好。然后每个指标从这些输出里取不同证据：

| 指标 | 代码入口 | 主要证据 |
|---|---|---|
| RQS | `benchmark/scripts/run_rqs.sh` | 4 张 rendered views + 质量参考图 |
| MCS | `benchmark/scripts/run_mcs.sh` | 多视角 rendered views |
| DCS | `benchmark/scripts/run_dcs.sh` | 彩色渲染图 + 同视角黑白 part mask + reference description |
| DQS | `benchmark/scripts/run_dqs.sh` | condition image + 生成的 dimension 元数据 |
| APS | `benchmark/scripts/run_aps.sh` | condition image + affordance heatmap views |
| KPS | `benchmark/scripts/run_kps.sh` | condition image + standardized articulation video |
| MPS | `benchmark/scripts/run_mps.sh` | condition image + water/floor simulation videos + material params |

这个代码设计也解释了为什么 full reproduction 比单张 demo 复杂得多：不仅要生成资产，还要为每个 baseline 和每个 metric 生成证据资产。

## 5. 本地复现证据与边界

已完成：

- 官方 demo full path 成功：`C:\Users\robot\physx_outputs\official_demo_full\repro_summary.json`
  - `status=success`
  - `mode=4bit`
  - `detected_parts=7`
  - `total_voxels=22031`
  - `elapsed_sec=393.95`
  - 输出包括 `coord_*.txt`、`ind_*.npy`、`ind_*.ply`、`allind.ply`、`basic_info.json`、`basic.urdf`、`basic.xml`、mesh 目录。
- benchmark tiny smoke 成功：
  - `summary.csv` 中 `ours,mobility,RQS,count=1,mean=100.0`
  - `denominator_validation.csv` 中 `count_mismatch=False`
  - 这验证了 manifest -> fake VLM result -> aggregation -> denominator validation 链路。

未完成，不能夸大：

- 没有全量准备 `physx_result/ours_*`、`output_physxanything_*`、`outputs_physxgen_*`、`output_articulateanything_*`。
- 没有跑全量 RQS/MCS/DCS/DQS/APS/KPS/MPS。
- 没有在本地生成论文 Table 1 / Table 2 的完整复现实验数值。
- 当前 Windows 本地 benchmark smoke 暴露两个平台兼容问题：
  - MSYS bash 会调用 WindowsApps 的 `python3.exe` 占位程序，需映射到真实 `python` 或在 Linux/4090 环境跑。
  - `aggregate_vlm_results.py` 在 Windows 目录扫描时优先用 `rg --files`，但只筛 `/result.json`，会漏掉反斜杠路径；传入具体 `result.json` 文件可绕过。

## 6. 下一步 full benchmark 的质量复现顺序

为了避免“跑了但分母不一致”的问题，后续建议按这个顺序推进：

1. 在 4090 Linux 环境整理 `physx_result/`，确认四类 baseline 输出目录完整。
2. 先跑 `RUN_VLM=0 LIMIT=5` 的各 metric manifest 和资产生成，检查 manifest 中 ready / missing-zero 状态。
3. 跑 RQS/MCS 的 render path，因为它们依赖最少，最适合先测端到端。
4. 跑 KPS，确认 `basic.xml`、`mesh/basic.urdf`、`joint_actor/.../mobility.urdf` 三类方法路径都能渲染成标准视频。
5. 跑 MPS，单独检查 watertight remesh、water/floor simulation 视频是否稳定。
6. 启动 `Qwen/Qwen3.5-122B-A10B` 或兼容 VLM 服务，逐 metric 开始 `RUN_VLM=1`。
7. 每次 metric 完成后立刻跑 `aggregate_vlm_results.py` 和 `validate_denominators.py`，只报告 denominator validation 无 mismatch 的分数。

这一部分的 Jupyter 版本：

- `C:\Users\robot\Documents\成长学习库\physx_omni_paper_baselines_experiments_step4.ipynb`

