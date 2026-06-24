# PhysX-Omni 第五步附录：PhysX-Bench 数据字段字典

## 1. HF 原始数据层

官方数据集：

[https://huggingface.co/datasets/PhysX-Omni/PhysX-Bench](https://huggingface.co/datasets/PhysX-Omni/PhysX-Bench)

文件树：

```text
demo_inthewild/<object_id>.png
demo_mobility/<object_id>.png
demo_verse/<object_id>.png
descript_inthewild.json
descript_mobility.json
descript_verse.json
```

核心字段：

| 字段 | 类型 | 含义 |
|---|---|---|
| `dataset` | enum | `inthewild`、`mobility`、`verse` |
| `object_id` | string | 图片文件名去掉 `.png` 后的 ID |
| `image` | png | 条件图 |
| `reference_description` | string | 从 `descript_<dataset>.json` 按 `object_id` 读取 |

三个 description JSON 都是简单 key-value：

```json
{
  "object_id": "reference description"
}
```

## 2. Prepared condition image 层

转换脚本：

`benchmark/code/assets/prepare_demo_condition_images.py`

输入：

```text
physx_result/demo_<dataset>/<object_id>.png
```

输出：

```text
benchmark/benchmark_assets/condition_images/<dataset>/<object_id>/first_frame.png
```

字段：

| 字段 | 来源 | 用途 |
|---|---|---|
| `dataset` | 命令行参数 | 区分 mobility / verse / inthewild |
| `object_id` | png stem | 对齐 method output、description、manifest |
| `first_frame.png` | copy 或 symlink | DQS/APS/KPS/MPS 共用条件图 |

## 3. Method output 层

默认输出根目录：

```text
physx_result/<source_folder>/<object_id>/
```

`benchmark/scripts/common.sh` 中的映射：

| method | source folder |
|---|---|
| `ours` | `ours_<dataset>_181500` |
| `physxanything` | `output_physxanything_<dataset>` |
| `physxgen` | `outputs_physxgen_<dataset>` |
| `articulateanything` | `output_articulateanything_<dataset>` |

常见文件：

| 文件或目录 | 使用指标 | 含义 |
|---|---|---|
| `basic_info.json` / `basic_info.txt` | DQS / MPS | 对象名称、类别、尺寸、材料参数等 |
| `basic.xml` | KPS | ours / physxanything 的 MJCF 运动学证据 |
| `basic.urdf` | KPS 或导出检查 | URDF 表达 |
| `mesh/basic.urdf` | KPS | physxgen 的 URDF 输入 |
| `scale.npy` | DQS | physxgen 的尺度输出 |
| `affordance/*.png` | APS | affordance 灰度或 heatmap 源图 |
| `description/*.png` | DCS | part-level description mask |
| rendered mesh / glb | RQS / MCS / DCS | 多视角渲染源 |

## 4. Metric asset 层

| 资产 | 路径 | 使用指标 |
|---|---|---|
| condition images | `benchmark/benchmark_assets/condition_images/<dataset>/<object_id>/first_frame.png` | DQS / APS / KPS / MPS |
| rendered views | `benchmark/benchmark_assets/rendered_views/description/<source_folder>/<object_id>/<view>.png` | RQS / MCS / DCS |
| affordance heatmaps | `benchmark/benchmark_assets/affordance_heatmaps/<method>/<dataset>/<object_id>/` | APS |
| kinematic videos | `benchmark/benchmark_assets/kinematic_videos/<method>/<dataset>/<object_id>/kinematic_demo.mp4` | KPS |
| material videos | `benchmark/benchmark_assets/material_videos/...` and `material_videos_v2/floor/...` | MPS |
| watertight proxy meshes | `physx_result/watertightFix_max3000/<source_folder>/<object_id>/` | MPS preprocessing |

## 5. Manifest 公共字段

所有 manifest 都是 JSONL 和 CSV 双格式。最核心公共字段：

| 字段 | 含义 |
|---|---|
| `metric` | 指标名，如 `rqs`、`mcs`、`dcs`、`dqs`、`aps`、`kps`、`mps` |
| `method` | 方法名，如 `ours`、`physxanything`、`physxgen`、`articulateanything` |
| `dataset` | 数据域 |
| `object_id` | 样本 ID |
| `sample_id` | 通常等于 `object_id` |
| `relative_dir` | raw result 输出相对目录 |
| `source_result_dir` | 方法输出 object 目录 |
| `ready` | 该行是否有足够证据进入 VLM 或 deterministic scoring |
| `status` | 缺失或异常状态 |

## 6. RQS / MCS manifest 字段

构建脚本：

`benchmark/code/manifests/build_render_view_manifest.py`

字段：

| 字段 | 含义 |
|---|---|
| `source_folder` | 例如 `ours_mobility_181500` |
| `num_render_views_available` | 实际找到的 png 数 |
| `num_render_views_required` | RQS 需要 4，MCS 需要 8 |
| `num_render_views_selected` | 采样后送入 VLM 的数量 |
| `view_image_paths` | 被选择的 rendered views |
| `render_missing_score_zero` | 缺 rendered views 时是否自动 0 分 |

## 7. DCS manifest 字段

构建脚本：

`benchmark/code/manifests/build_description_mask_manifest.py`

字段：

| 字段 | 含义 |
|---|---|
| `part_id` | description/mask 对应 part |
| `render_folder` | rendered views 来源目录 |
| `result_folder` | 方法输出目录名 |
| `color_render_dir` | 彩色图目录 |
| `mask_dir` | description mask 目录 |
| `description_json` | `descript_<dataset>.json` |
| `reference_description` | 当前 object/part 的参考描述 |
| `num_color_views_available` | 彩色 views 数 |
| `num_description_mask_views_available` | mask views 数 |
| `num_paired_views_available` | 同视角配对数 |
| `num_nonblack_masks_available` | 非全黑 mask 数 |
| `view_pair_indices` | 选中的配对视角 |
| `selected_mask_white_ratio` | 选中 mask 的白色区域比例 |
| `view_image_paths` | 彩色图路径 |
| `mask_image_paths` | mask 图路径 |
| `dcs_missing_score_zero` | 证据缺失时是否 0 分 |

常见 `status`：

- `missing_color_render_views`
- `missing_description_masks`
- `missing_paired_description_views`
- `all_masks_black`
- `missing_reference_description`

## 8. DQS manifest 字段

构建脚本：

`benchmark/code/manifests/build_dimension_manifest.py`

字段：

| 字段 | 含义 |
|---|---|
| `image_path` / `condition_image` | 条件图 |
| `algorithm_dimension_source` | `basic_info_json`、`basic_info_txt`、`scale_npy`、`default_zero` 等 |
| `algorithm_json_path` | `basic_info.json` 路径 |
| `algorithm_info_path` | 实际采用的 info 文件 |
| `algorithm_scale_path` | `scale.npy` 路径 |
| `algorithm_dimension` | 原始 dimension 字符串，如 `180*120*150` |
| `algorithm_generated_max_dimension_cm` | 生成结果最大尺寸 |
| `algorithm_dimension_defaulted` | 是否因缺失或异常回退到 0 |
| `object_name` | 生成结果对象名 |
| `category` | 生成结果类别 |

DQS 特别点：

- VLM prior 行可以用 `--unique-priors` 生成，每个 dataset/object 只估一次尺寸。
- 真正 DQS 由 `score_dimension_results.py` 确定性计算。

## 9. APS manifest 字段

构建脚本：

`benchmark/code/manifests/build_affordance_manifest.py`

字段：

| 字段 | 含义 |
|---|---|
| `image_path` / `condition_image` | 条件图 |
| `affordance_heatmap_grid` | heatmap 拼图 |
| `affordance_view_paths` | 送入 VLM 的 heatmap views |
| `source_affordance_dir` | 原始 affordance 目录 |
| `num_affordance_views` | 采样后 views 数 |
| `num_affordance_views_available` | 原始可用 views 数 |
| `affordance_view_sample_indices` | 采样下标 |
| `affordance_view_sampling` | 当前为 `uniform_numeric` |
| `aps_missing_score_zero` | 是否因缺 heatmap 自动 0 |
| `missing_affordance_reason` | 缺失原因 |

常见 `status`：

- `missing_condition_image`
- `missing_affordance_heatmap_views`
- `insufficient_affordance_heatmap_views`
- `missing_affordance_heatmap_grid`

## 10. KPS manifest 字段

构建脚本：

`benchmark/code/manifests/build_kinematic_manifest.py`

字段：

| 字段 | 含义 |
|---|---|
| `image_path` | 条件图 |
| `video_path` | 实际采用的 articulation video |
| `expected_video_path` | 标准期望视频路径 |
| `fallback_video_path` | 兼容旧路径 |
| `video_source` | `expected` / `fallback` 等 |
| `source_xml` | `basic.xml` 路径 |
| `source_urdf` | URDF 路径 |

常见 `status`：

- `missing_condition_image`
- `missing_source_urdf`
- `needs_render_video`
- `missing_video_path`
- `uses_fallback_video`

## 11. MPS manifest 字段

构建脚本：

`benchmark/code/manifests/build_material_manifest.py`

字段：

| 字段 | 含义 |
|---|---|
| `image_path` | 条件图 |
| `video_paths` | water/floor 视频列表 |
| `floor_video_path` | floor simulation video |
| `water_video_path` | water simulation video |
| `material_parameters_path` | 材料参数 JSON |
| `source_folder` | 方法结果目录名 |
| `floor_folder` | floor video 所在目录 |
| `num_material_videos` | 实际可用视频数 |
| `num_material_videos_required` | 通常需要 2 |
| `mps_missing_score_zero` | 是否因缺材料视频/参数自动 0 |
| `missing_material_reason` | 缺失原因 |

常见 `status`：

- `missing_condition_image`
- `missing_floor_video`
- `missing_water_video`
- `missing_material_json`
- `invalid_floor_video`
- `invalid_water_video`
- `invalid_material_json`
- `insufficient_material_videos`

## 12. Raw VLM result 字段

生成脚本：

`benchmark/code/vlm/multi.py`

每个 object/metric 会输出：

```text
benchmark/benchmark_results/raw_vlm_outputs/<model_id>/run_<timestamp>/<relative_dir>/result.json
```

核心字段：

| 字段 | 含义 |
|---|---|
| `run_id` | 本次 VLM run |
| `video_path` | 单视频路径，KPS 等使用 |
| `video_paths` | 多视频路径，MPS 使用 |
| `video_id` | object id 或 sample id |
| `video_relative_dir` | 与 manifest `relative_dir` 对齐 |
| `paired_image_path` | 条件图或配对图 |
| `view_image_paths` | RQS/MCS/DCS views |
| `mask_image_paths` | DCS masks |
| `affordance_view_paths` | APS heatmap views |
| `benchmark_context` | 原始 manifest row |
| `sampling` | video/image 采样信息 |
| `turns_template` | 使用的 prompt turns |
| `results[]` | 每个 turn 的 VLM 输出 |
| `pair_error` | object-level 异常 |
| `elapsed_sec` | 该 pair 耗时 |

`results[]` 子字段：

| 字段 | 含义 |
|---|---|
| `turn_id` | prompt id，如 `render_quality`、`description_scoring` |
| `turn_index` | 第几个 turn |
| `prompt_ref_id` | prompt 引用 |
| `input_modalities` | 本 turn 使用 image/video/static/view 等输入 |
| `output` | VLM 输出的 JSON 字符串 |
| `error` | turn-level 异常 |
| `elapsed_sec` | turn 耗时 |

## 13. Aggregation 输出字段

聚合脚本：

`benchmark/code/aggregation/aggregate_vlm_results.py`

### object_scores.csv

字段：

```text
method,dataset,object_id,metric,score,
S_prior,S_reveal,S_global,
alignment_score,precision_score,
youngs_modulus_score,poisson_ratio_score,density_score,
task,verdict,turn_id,result_json,video_path,video_paths,paired_image_path,pair_error
```

解释：

- `S_prior/S_reveal/S_global` 主要来自 KPS/VAPS。
- `alignment_score/precision_score` 主要来自 DCS。
- `youngs_modulus_score/poisson_ratio_score/density_score` 主要来自 MPS。

### summary.csv

字段：

```text
method,dataset,metric,count,mean,std
```

这是报告 dataset-level benchmark 表格最直接的来源。

### submetric_summary.csv

用于展开 KPS/DCS/MPS 的子指标均值、标准差和计数。

## 14. Denominator validation 字段

校验脚本：

`benchmark/code/validation/validate_denominators.py`

字段：

| 字段 | 含义 |
|---|---|
| `method` | 方法 |
| `dataset` | 数据域 |
| `metric` | 指标 |
| `expected_count` | manifest 期望样本数 |
| `manifest_ready_count` | ready 样本数 |
| `manifest_missing_zero_count` | manifest 中应自动 0 分样本数 |
| `raw_metric_rows_before_dedup` | raw result 解析到的原始行数 |
| `raw_dedup_count` | 去重后的 raw 行数 |
| `raw_auto_zero_count` | 自动 0 分 raw 行数 |
| `object_score_count` | object-level 分数行数 |
| `summary_count` | summary 中 count |
| `summary_mean` | summary 均值 |
| `duplicate_object_result_keys` | 重复 object 结果数 |
| `missing_raw_after_dedup` | manifest 有但 raw 缺失数 |
| `extra_raw_after_dedup` | raw 多出来的 object 数 |
| `count_mismatch` | 是否分母不一致 |

报告任何 benchmark 分数前，`count_mismatch` 必须为 `False`。

