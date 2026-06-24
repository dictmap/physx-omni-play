# PhysX-Omni 第四步附录 C：Benchmark 代码与论文实验对应

## 1. 代码总流程

本地 benchmark 代码在：

`C:\Users\robot\Documents\成长学习库\physx-omni-assets\code\PhysX-Omni\benchmark`

`benchmark/README.md` 的主流程可以压缩成：

```text
physx_result/ baseline outputs
  -> 生成每个 metric 需要的证据资产
  -> 构造每个 metric 的 manifest
  -> 用固定 prompt 调 VLM 产生 JSON 分数
  -> aggregate_vlm_results.py 聚合
  -> validate_denominators.py 校验分母
```

这个结构和论文 PhysX-Bench 对应：PhysX-Bench 不直接读模型内部参数打分，而是把物理属性转成可视化证据，再让 VLM 按统一 rubric 判断。

## 2. 配置入口

默认配置模板：

`benchmark/configs/paths.example.yaml`

关键字段：

| 字段 | 作用 |
|---|---|
| `physx_result_root` | baseline 输出根目录 |
| `benchmark_asset_root` | 渲染图、视频、heatmap 等证据资产输出根目录 |
| `benchmark_manifest_root` | JSONL/CSV manifest 根目录 |
| `benchmark_result_root` | VLM raw output、object score、summary score 输出根目录 |
| `vlm_model_path` | 默认 `Qwen/Qwen3.5-122B-A10B` |
| `condition_image_root` | DQS/APS/KPS/MPS 共用输入图片 |
| `rendered_view_root` | RQS/MCS/DCS 使用的 rendered views |
| `material_metric_json_root` | MPS 使用的材料参数 JSON |

脚本公共逻辑：

`benchmark/scripts/common.sh`

其中 `METHODS`、`DATASETS`、`RUN_VLM`、`RUN_AGGREGATE`、`RUN_VALIDATE`、`LIMIT` 都在这里统一处理。

## 3. 指标到代码的逐项对应

| PhysX-Bench 指标 | 论文含义 | 脚本 | prompt | 聚合名 |
|---|---|---|---|---|
| RQS | rendered visual quality | `benchmark/scripts/run_rqs.sh` | `benchmark/prompts/prompts_quality.yaml` | `RQS` |
| MCS | multi-view consistency | `benchmark/scripts/run_mcs.sh` | `benchmark/prompts/prompts_consistency.yaml` | `MCS` |
| DCS | description / mask consistency | `benchmark/scripts/run_dcs.sh` | `benchmark/prompts/prompts_description.yaml` | `DCS` |
| DQS | dimension / absolute scale quality | `benchmark/scripts/run_dqs.sh` | `benchmark/prompts/prompts_dimension.yaml` + deterministic scoring | `DQS` |
| APS | affordance plausibility | `benchmark/scripts/run_aps.sh` | `benchmark/prompts/prompts_affordance.yaml` | `APS` |
| KPS | kinematic plausibility | `benchmark/scripts/run_kps.sh` | `benchmark/prompts/prompts_vaps_english.yaml` | `KPS` / `VAPS` |
| MPS | material plausibility | `benchmark/scripts/run_mps.sh` | `benchmark/prompts/prompts_material.yaml` | `MPS` |

## 4. 每个指标的证据资产

### RQS

输入：

- 4 张 rendered views。
- `benchmark/assets/quality_reference/image.png` 作为 1 到 5 的质量参考。

prompt 要求 VLM 输出 1 到 5 分，聚合器会转成 0 到 100 尺度。

### MCS

输入：

- 多视角 rendered views。

prompt 关注：

- global view consistency。
- view-specific failures。
- surface appearance coherence。

它不评价类别是否正确，也不评价 affordance 或部件功能。

### DCS

输入：

- 一张彩色渲染图。
- 同视角黑白 mask。
- reference description。

prompt 中公式：

```text
DCS = round(0.60 * alignment_score + 0.40 * precision_score, 2)
```

这说明 DCS 同时看语义是否对齐和 mask 是否精准。mask 覆盖全物体会被强惩罚。

### DQS

输入：

- condition image。
- 方法输出的 dimension 元数据，例如 `basic_info.json` 里的 `dimension`。

流程：

1. VLM 先从 condition image 估计真实世界最大尺寸。
2. `benchmark/code/scoring/score_dimension_results.py` 读取方法生成的尺寸。
3. 用 symmetric error 计算 DQS。

代码公式：

```text
symmetric_error = 2 * abs(generated_max - vlm_estimated_max) / (generated_max + vlm_estimated_max)
if symmetric_error >= 0.8:
    DQS = 0
else:
    DQS = 100 * (1 - symmetric_error / 0.8)
```

### APS

输入：

- condition image。
- 多视角 affordance heatmap。

prompt 关注：

- relative ranking plausibility。
- salient misranking。
- overall common-sense plausibility。
- 危险区域不应被高亮为强 affordance。

这说明 APS 不是看 heatmap 是否漂亮，而是看交互强弱排序是否符合常识。

### KPS

输入：

- condition image。
- 标准化 articulation video。
- 图像先验 JSON。

代码统一使用：

`benchmark/code/render/kinematic/kinematic_articulation_demo.py`

不同方法的输入：

| 方法 | KPS 渲染文件 |
|---|---|
| ours / physxanything | `basic.xml` |
| physxgen | `mesh/basic.urdf` |
| articulateanything | `joint_actor/iter_0/seed_0/mobility.urdf` |

prompt 中最终分数是 VAPS：

```text
base weights:
prior channel = 0.70
reveal channel = 0.20
global channel = 0.10
```

如果 prior 或 reveal channel inactive，则对应权重不参与归一化。

### MPS

输入：

- condition image。
- water simulation video。
- floor simulation video。
- 生成的 material parameters。

prompt 让 VLM 分别评价：

- Young's modulus。
- Poisson's ratio。
- Density。

公式：

```text
weighted_score = 0.4 * S_E + 0.2 * S_nu + 0.4 * S_rho
MPS = 25 * (weighted_score - 1)
```

所以 MPS 不是 VLM 随意给 0 到 100，而是先给三个 1 到 5 的子分，再按公式转成 0 到 100。

## 5. Aggregation 与 denominator validation

聚合脚本：

`benchmark/code/aggregation/aggregate_vlm_results.py`

它把 raw `result.json` 解析为：

- object-level long rows。
- dataset-level summary。
- submetric summary。

分母校验脚本：

`benchmark/code/validation/validate_denominators.py`

它检查每个 method / dataset / metric：

- manifest expected count。
- ready count。
- missing-zero count。
- raw result count。
- dedup 后 count。
- object score count。
- summary count。
- 是否 count mismatch。

这一步非常关键。没有 denominator validation，就可能出现某个方法因为少跑了难样本而均值虚高。

## 6. 本地 smoke 验证

我在 Windows 本地用 PowerShell 版 smoke 跑通了官方代码模块：

```text
build_render_view_manifest.py
  -> fake result.json
  -> aggregate_vlm_results.py
  -> validate_denominators.py
```

输出：

`C:\Users\robot\Documents\成长学习库\physx-omni-assets\code\PhysX-Omni\benchmark\tiny_example\generated\benchmark_results\summary.csv`

内容要点：

```text
method,dataset,metric,count,mean,std
ours,mobility,RQS,1,100.0,0.0
```

分母校验：

`C:\Users\robot\Documents\成长学习库\physx-omni-assets\code\PhysX-Omni\benchmark\tiny_example\generated\benchmark_results\denominator_validation.csv`

内容要点：

```text
method,dataset,metric,expected_count,...,summary_count,summary_mean,...,count_mismatch
ours,mobility,RQS,1,...,1,100.0,...,False
```

边界：

- 这是 benchmark 辅助链路 smoke，不是 full PhysX-Bench。
- 没有使用真实 VLM 输出，fake result 只用于验证聚合和分母校验。
- 在 Windows 下发现 `aggregate_vlm_results.py` 扫目录时会因为 `rg --files` 输出反斜杠路径而漏掉 `result.json`。传入具体 `result.json` 文件可以绕过；在 4090 Linux 环境预计不会触发这个 Windows 路径问题。

## 7. 后续 full benchmark 命令骨架

先检查资产和 manifest，不跑 VLM：

```bash
CONFIG=benchmark/configs/paths.yaml \
METHODS="ours physxanything physxgen articulateanything" \
DATASETS="mobility verse inthewild" \
RUN_VLM=0 \
LIMIT=5 \
bash benchmark/scripts/run_rqs.sh
```

RQS/MCS 先跑，因为依赖最少：

```bash
RUN_RENDER=1 bash benchmark/scripts/run_rqs.sh
RUN_RENDER=1 bash benchmark/scripts/run_mcs.sh
```

KPS 需要标准 articulation video：

```bash
RENDER_KPS=1 bash benchmark/scripts/run_kps.sh
```

MPS 需要 watertight proxy 和 water/floor simulation：

```bash
RUN_WATERTIGHT=1 RENDER_MATERIAL=1 bash benchmark/scripts/run_mps.sh
```

每个 metric 结束后都跑：

```bash
python3 benchmark/code/aggregation/aggregate_vlm_results.py \
  --results-root benchmark/benchmark_results/raw_vlm_outputs \
  --object-csv benchmark/benchmark_results/object_level_scores/object_scores_long.csv \
  --summary-csv benchmark/benchmark_results/dataset_level_scores/dataset_metric_summary.csv \
  --submetric-csv benchmark/benchmark_results/dataset_level_scores/dataset_submetric_summary.csv \
  --errors-jsonl benchmark/benchmark_results/logs/aggregate_errors.jsonl

python3 benchmark/code/validation/validate_denominators.py \
  --manifest-root benchmark/benchmark_manifests \
  --results-root benchmark/benchmark_results/raw_vlm_outputs \
  --object-csv benchmark/benchmark_results/object_level_scores/object_scores_long.csv \
  --summary-csv benchmark/benchmark_results/dataset_level_scores/dataset_metric_summary.csv \
  --output-csv benchmark/benchmark_results/logs/denominator_validation.csv \
  --errors-jsonl benchmark/benchmark_results/logs/denominator_validation_errors.jsonl \
  --strict
```

