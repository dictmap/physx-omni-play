# 15 主要实验结果精讲

对应 `paper-reading.md`：`## 15. 主要实验结果`

## 实验分两类

论文实验主要有两套：

1. 有 GT 的 conventional evaluation：PhysXVerse 和 PhysX-Mobility。
2. 无完整 GT 的 PhysX-Bench：真实或合成条件图，通过证据和 VLM judge 评分。

## Conventional metrics

指标含义：

- PSNR 越高越好。
- CD 越低越好。
- F-score 越高越好。
- Absolute scale 越低越好。
- Material、Affordance、Kinematic、Description 越高越好。

PhysXVerse 上，PhysX-Omni 全列最好。关键值：

| 方法 | PSNR | CD | F-score | Abs. scale | Material | Affordance | Kinematic | Description |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| PhysXGen | 19.41 | 15.19 | 83.56 | 309.31 | 16.51 | 9.40 | 0.3494 | 11.84 |
| PhysX-Anything | 15.97 | 37.06 | 40.46 | 298.19 | 15.65 | 10.50 | 0.4191 | 21.38 |
| PhysX-Omni | 21.52 | 2.95 | 91.28 | 2.79 | 27.23 | 21.47 | 0.9185 | 31.05 |

PhysX-Mobility 上，PhysX-Omni 在大多数指标最好，但 F-score 不是第一：

- PhysX-Anything：89.51
- PhysX-Omni：88.50

这说明论文结论要精确表达，不能说所有指标无条件第一。

## PhysX-Bench metrics

PhysX-Bench 上：

| 方法 | CLIP | 3D Consistency | Visual Quality | Scale | Material | Affordance | Kinematic | Description |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| MonoArt | 0.835 | 82.56 | 96.20 | - | - | - | 68.32 | - |
| PhysX-Anything | 0.547 | 52.71 | 70.81 | 50.20 | 44.70 | 59.96 | 65.99 | 26.89 |
| PhysX-Omni | 0.767 | 64.48 | 90.00 | 64.26 | 59.89 | 70.57 | 80.72 | 39.02 |

关键点：

- MonoArt 在 CLIP、3D consistency、visual quality 上更高。
- PhysX-Omni 在 scale、material、affordance、kinematic、description 上更高。

## 大白话说明

PhysX-Omni 的强项不是“渲染最漂亮”。它的强项是“更像一个能用的仿真资产”。  
MonoArt 更像几何/外观强手，PhysX-Omni 更像物理语义和交互能力更完整的系统。

## 和第七步的关系

第七步复现优先级就是从这些结果来的：

- PhysX-Anything 最值得复现，因为它全维度可比且很多指标接近。
- MonoArt 也值得复现，因为它在几何/视觉项超过 PhysX-Omni。

## 复现边界

当前本地没有生成完整 Table 1 / Table 2。我们已有的是：

- 官方 demo 主流程。
- 本地 `basic_info.json` 等输出证据。
- benchmark tiny smoke。
- Step 4/7 中的表格解析与分差分析。

因此文档里使用“论文报告”而不是“本地复现得到”来描述这些表格数值。

