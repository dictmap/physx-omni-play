# PhysX-Omni 第四步附录 B：论文实验表格逐项分析

## 1. Conventional Metrics 表

论文表格列：

- Geometry：PSNR 越高越好，Chamfer Distance 越低越好，F-score 越高越好。
- Physical Attributes：Absolute scale 越低越好；Material、Affordance、Kinematic、Description 越高越好。
- CD 单位是 `x10^-3`。
- F-score 单位是 `x10^-2`，阈值 `0.05`。

### 1.1 PhysXVerse

| Method | PSNR ↑ | CD ↓ | F-score ↑ | Abs. scale ↓ | Material ↑ | Affordance ↑ | Kinematic ↑ | Description ↑ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Articulate-Anything | 14.03 | 48.77 | 46.44 | -- | -- | -- | 0.2952 | -- |
| MonoArt | 19.68 | 7.03 | 85.27 | -- | -- | -- | 0.3805 | -- |
| PhysXGen | 19.41 | 15.19 | 83.56 | 309.31 | 16.51 | 9.40 | 0.3494 | 11.84 |
| PhysX-Anything | 15.97 | 37.06 | 40.46 | 298.19 | 15.65 | 10.50 | 0.4191 | 21.38 |
| PhysX-Omni | 21.52 | 2.95 | 91.28 | 2.79 | 27.23 | 21.47 | 0.9185 | 31.05 |

解释：

- PhysX-Omni 在 PhysXVerse 上全列最优。
- 相对 MonoArt，CD 从 `7.03` 到 `2.95`，下降约 `58.0%`。
- 相对 PhysX-Anything，CD 从 `37.06` 到 `2.95`，下降约 `92.0%`。
- 绝对尺度误差相对 PhysX-Anything 从 `298.19` 到 `2.79`，下降约 `99.1%`。
- Kinematic 从 PhysX-Anything 的 `0.4191` 到 `0.9185`，约 `2.19x`。
- 这张表支持论文的主要 claim：template-based RLE 和更统一的 physical representation 对复杂结构、尺度和 articulation 有明显帮助。

### 1.2 PhysX-Mobility

| Method | PSNR ↑ | CD ↓ | F-score ↑ | Abs. scale ↓ | Material ↑ | Affordance ↑ | Kinematic ↑ | Description ↑ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Articulate-Anything | 15.02 | 16.09 | 66.95 | -- | -- | -- | 0.6396 | -- |
| MonoArt | 16.46 | 6.35 | 87.41 | -- | -- | -- | 0.4351 | -- |
| PhysXGen | 15.75 | 35.32 | 79.62 | 46.58 | 16.02 | 8.73 | 0.3884 | 11.60 |
| PhysX-Anything | 16.57 | 23.13 | 89.51 | 22.58 | 22.58 | 16.29 | 0.7852 | 26.28 |
| PhysX-Omni | 18.38 | 4.70 | 88.50 | 2.78 | 24.09 | 16.58 | 0.8603 | 28.40 |

解释：

- PhysX-Omni 在 PSNR、CD、absolute scale、material、affordance、kinematic、description 上最好。
- F-score 不是最好：PhysX-Anything `89.51`，PhysX-Omni `88.50`。
- 相对 PhysX-Anything，CD 从 `23.13` 到 `4.70`，下降约 `79.7%`。
- 相对 MonoArt，CD 从 `6.35` 到 `4.70`，下降约 `26.0%`。
- 相对 PhysX-Anything，absolute scale 从 `22.58` 到 `2.78`，下降约 `87.7%`。
- Kinematic 相对 PhysX-Anything 提升约 `9.6%`。

严谨结论：

- PhysX-Mobility 上，PhysX-Omni 不是所有 geometry 子指标全胜。
- 更准确的说法是：PhysX-Omni 在几何误差、尺度、物理属性和 articulation 上整体更好，但 F-score 与 PhysX-Anything 非常接近且略低。

## 2. PhysX-Bench 表

PhysX-Bench 是无 GT 的 VLM benchmark，列包括：

- Geometry：CLIP、3D Consistency、Visual Quality，越高越好。
- Physical Attributes：Absolute scale、Material、Affordance、Kinematic、Description，越高越好。

| Method | CLIP ↑ | 3D Consistency ↑ | Visual Quality ↑ | Abs. scale ↑ | Material ↑ | Affordance ↑ | Kinematic ↑ | Description ↑ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Articulate-Anything | 0.554 | 55.27 | 88.46 | -- | -- | -- | 71.25 | -- |
| MonoArt | 0.835 | 82.56 | 96.20 | -- | -- | -- | 68.32 | -- |
| PhysXGen | 0.803 | 73.50 | 85.93 | 24.21 | -- | 66.07 | 69.17 | 22.24 |
| PhysX-Anything | 0.547 | 52.71 | 70.81 | 50.20 | 44.70 | 59.96 | 65.99 | 26.89 |
| PhysX-Omni | 0.767 | 64.48 | 90.00 | 64.26 | 59.89 | 70.57 | 80.72 | 39.02 |

解释：

- MonoArt 的三项几何指标最高。论文也承认 MonoArt 在若干 geometry-related metrics 上更强。
- PhysX-Omni 在所有物理属性列中最高。
- 相对 PhysX-Anything，PhysX-Omni 的 Kinematic 从 `65.99` 到 `80.72`，提升约 `22.3%`。
- 相对 PhysX-Anything，Scale 从 `50.20` 到 `64.26`，提升约 `28.0%`。
- 相对 PhysX-Anything，Material 从 `44.70` 到 `59.89`，提升约 `34.0%`。
- 相对 PhysX-Anything，Description 从 `26.89` 到 `39.02`，提升约 `45.1%`。

严谨结论：

- PhysX-Bench 支持的是“PhysX-Omni 在 simulation-ready 物理属性上显著更强”。
- 它不支持“PhysX-Omni 在所有无 GT 几何视觉指标上最好”。
- 论文把这一点解释为：MonoArt 借助强 TRELLIS 几何 pipeline 得到更高外观指标，但缺少 part-level motion 与物理交互建模。

## 3. Human alignment

论文补充了 PhysX-Bench 自动评分与人工偏好的相关性：

- scale、affordance、material、description：Spearman `rho=1.0`。
- kinematic：Spearman `rho=1.0`，Pearson `r=0.992`。
- geometry：Spearman `rho=0.8`，Pearson `r=0.803`。

这说明 PhysX-Bench 的自动排序与人工偏好高度一致。但这里仍要注意：

- 相关性高说明 benchmark 排序合理，不代表绝对分数没有 VLM 偏差。
- VLM prompt 固定、输入证据固定、分母校验固定，是减少偏差的关键。

## 4. Ablation 的严谨边界

论文 ablation 聚焦 geometry representation：

- baseline：直接用 text-based voxel indices 表示 3D structure，类似 PhysX-Anything 的路径。
- ours：template-based RLE，显式且紧凑地编码高分辨率 3D structure。

论文文字结论：

- 新表示提升 conventional metrics 和 PhysX-Bench。
- 主要改善 kinematic 和 absolute scale。
- qualitative ablation 显示 baseline 在 stroller、tractor 等复杂结构上出现结构歧义、局部几何不完整、articulated components 不一致。

严谨边界：

- 论文没有把所有 ablation 分解成非常细的多因素表，例如单独拆数据集大小、训练 schedule、decoder 等。
- 因此当前能确认的是“表示法 + 简化 pipeline”的组合贡献很强；不能从表格中完全隔离每个工程因素的独立贡献。

