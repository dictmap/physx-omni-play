# 10 PhysX-Bench 评测框架精讲

对应 `paper-reading.md`：`## 10. PhysX-Bench 评测框架`

## 为什么要 PhysX-Bench

真实图片通常没有 ground-truth 3D 物理资产。传统 CD、F-score、PSNR 需要 GT，无法覆盖 in-the-wild 条件图。PhysX-Bench 的目的就是评估“没有完整 GT 时，生成资产是否在几何、尺度、材料、affordance、运动学和描述上合理”。

## 六个评测维度

| 维度 | 评估什么 | 证据 |
|---|---|---|
| Geometry | 外观、语义、多视角一致性 | 渲染视图、CLIP、VLM judge |
| Absolute scale | 真实世界尺寸是否合理 | 条件图和生成尺寸元数据 |
| Material | 材料行为是否合理 | 水滴、落地等仿真视频和材料参数 |
| Affordance | 可交互区域是否合理 | 条件图和 affordance heatmap |
| Kinematics | 关节运动是否合理 | 条件图和 articulation video |
| Description | 部件 mask 与描述是否匹配 | 渲染图、mask、参考描述 |

## 代码流程

`benchmark/README.md` 说明的主流程：

```text
physx_result/ model outputs
  -> generate metric evidence assets
  -> build one manifest per metric
  -> run VLM judge with corresponding prompt
  -> aggregate raw JSON outputs into CSV summaries
```

关键脚本和机制：

- `benchmark/scripts/run_tiny_smoke_test.sh`：tiny smoke。
- `benchmark/code/manifests/*`：构建每个指标的 manifest。
- `benchmark/code/vlm/multi.py`：运行 VLM judge。
- `benchmark/code/aggregation/aggregate_vlm_results.py`：聚合。
- `benchmark/code/validation/validate_denominators.py`：分母校验。

## 官方数据

`PhysX-Omni/PhysX-Bench` 当前公开约 0.87GB，1219 个文件。它包含：

- `demo_inthewild`
- `demo_mobility`
- `demo_verse`
- description JSON

前面第六步核过：`demo_verse` 与本地 `testset_physxverse.npy` 的 400 个测试 ID 对齐。

## 大白话说明

PhysX-Bench 像一个“证据审判流程”。它不直接问模型“你觉得自己好不好”，而是要求每个方法把输出转成统一证据：

- 多视角图。
- 部件 mask。
- 尺寸 JSON。
- affordance 热力图。
- 关节运动视频。
- 材料仿真视频。

然后再用统一 prompt 让 VLM judge 打分，并且缺失证据也算进分母，避免只报成功样本。

## 本地复现状态

本地已经有 tiny benchmark 输出目录：

`C:\Users\robot\Documents\成长学习库\physx-omni-assets\code\PhysX-Omni\benchmark\tiny_example\generated`

这说明 benchmark 的 manifest、aggregation、denominator validation 路径可以跑通。但它只是 smoke test，不等于 full PhysX-Bench 复现。

