# 14 Benchmark 代码可用性精讲

对应 `paper-reading.md`：`## 14. Benchmark 代码可用性`

## benchmark 代码公开了什么

官方仓库内有完整 `benchmark/` 目录。README 中说明它支持：

- metric-specific manifest 构建。
- VLM judge 调用。
- raw JSON 聚合。
- dataset-level CSV 汇总。
- denominator validation。
- tiny smoke test。

这比只给论文表格更有价值，因为它给出了评测协议和工程骨架。

## 七个指标

| 缩写 | 名称 | 证据 |
|---|---|---|
| RQS | Render Quality Score | rendered views + quality reference |
| MCS | Multi-view Consistency Score | sampled rendered views |
| DCS | Description Consistency Score | color view + mask + reference description |
| DQS | Dimension Quality Score | condition image + generated dimension |
| APS | Affordance Plausibility Score | condition image + affordance heatmaps |
| KPS | Kinematic Plausibility Score | condition image + articulation video |
| MPS | Material Plausibility Score | condition image + water/floor video + material params |

## tiny smoke test 的意义

命令：

```bash
bash benchmark/scripts/run_tiny_smoke_test.sh
```

这个 smoke test 不追求论文分数，而是检查：

- manifest 是否能构建。
- aggregation 是否能跑。
- denominator validation 是否能跑。
- 小样本目录结构是否符合 benchmark 代码预期。

本地已有 tiny 输出：

`C:\Users\robot\Documents\成长学习库\physx-omni-assets\code\PhysX-Omni\benchmark\tiny_example\generated`

## denominator validation 为什么重要

benchmark README 明确说，缺失证据仍然保留在分母里：

- 缺 rendered views，RQS/MCS 记 0。
- 缺 DCS 图像/mask/描述，DCS 记 0。
- 缺尺寸元数据，DQS 记 0。
- 缺 affordance heatmap，APS 记 0。
- 缺 KPS video，KPS 记 0。
- 缺 MPS water/floor video，MPS 记 0。

这避免了只挑成功样本报分。

## 大白话说明

这个 benchmark 不是“模型跑完给个分”。它更像一个考试系统：

1. 每道题需要提交不同证据。
2. 证据格式要统一。
3. 缺交不能不算，要计入总分。
4. 最后按统一规则聚合。

## 复现边界

本地 tiny smoke 成功只说明 benchmark 管线基本可执行，不说明 full benchmark 已复现。full benchmark 还需要：

- 完整条件图。
- 每个 baseline 的输出。
- 多视角渲染。
- heatmap。
- 运动视频。
- 材料视频。
- VLM judge 服务。

因此第八步文档中保留这个边界很重要。

