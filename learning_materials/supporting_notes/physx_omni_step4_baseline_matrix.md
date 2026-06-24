# PhysX-Omni 第四步附录 A：Baseline 矩阵与可比性分析

## 1. 为什么 baseline 不能只看谁分数高

PhysX-Omni 论文里的 baseline 覆盖了不同问题定义：

- 有些方法主要做 articulated object。
- 有些方法主要做几何生成或重建。
- 有些方法开始输出物理属性。
- PhysX-Anything 和 PhysX-Omni 才更接近“从单图生成 simulation-ready physical 3D asset”的完整目标。

因此表中的 `--` 不是 0 分，而是方法没有对应输出，或不适合按该物理属性指标评估。

## 2. Baseline 逐个拆解

### 2.1 Articulate-Anything

定位：

- 面向 articulated object 的生成或构建。
- 更关注可动部件、关节、运动结构，而不是完整材料、尺度、affordance、description。

论文里怎么评：

- conventional table 中有 PSNR、CD、F-score、kinematic。
- scale、material、affordance、description 为 `--`。
- PhysX-Bench 中也主要参与 geometry 和 kinematic，物理属性列大多为 `--`。

严谨结论：

- 它不是 PhysX-Omni 的完整同类竞品。
- 它的存在主要是为了说明：单纯 articulated generation 不能覆盖完整 simulation-ready 资产。

### 2.2 MonoArt

定位：

- 从单图推断 articulated 3D 和运动结构。
- 论文讨论中指出 MonoArt 借助强几何生成先验，因此在外观/几何类评估上表现强。

论文里怎么评：

- conventional table 中有几何和 kinematic。
- PhysX-Bench 中几何三项最好：CLIP `0.835`、3D consistency `82.56`、visual quality `96.20`。
- 但 scale、material、affordance、description 为 `--`。

严谨结论：

- MonoArt 是几何外观强 baseline。
- 它证明 PhysX-Omni 并不是在所有视觉几何指标上无条件第一。
- 但 MonoArt 不解决完整物理属性建模，因此 simulation-ready 维度不完整。

### 2.3 PhysXGen

定位：

- 从图像生成带部分物理属性的 3D 资产。
- 论文 related work 中把 PhysXGen 放在物理属性生成方向，强调它可以生成尺度、密度等基本物理属性。

论文里怎么评：

- conventional table 中全列可比：geometry、scale、material、affordance、kinematic、description。
- PhysX-Bench 中也参与 geometry、scale、affordance、kinematic、description；material 在表中为 `--`。

严谨结论：

- PhysXGen 比 Articulate-Anything/MonoArt 更接近 PhysX-Omni 的物理属性目标。
- 但它不是 PhysX-Anything/PhysX-Omni 这种更完整的 simulation-ready 统一输出。

### 2.4 PhysX-Anything

定位：

- 最接近 PhysX-Omni 的前作。
- 使用 VLM 和纯文本表示来建模 simulation-ready physical 3D assets。

论文认为的瓶颈：

- 依赖显式 segmentation stage。
- 最终质量受 segmentation module 限制。
- text-based voxel indices 表达冗长，对复杂拓扑、细部结构、邻近部件连续性不友好。

论文里怎么评：

- conventional table 与 PhysX-Omni 全列可比。
- PhysX-Bench 也全列可比。
- 在 PhysX-Mobility 的 F-score 上，PhysX-Anything `89.51` 高于 PhysX-Omni `88.50`，这是必须保留的细节。

严谨结论：

- PhysX-Anything 是本文最重要的直接 baseline。
- PhysX-Omni 的主要 claim 应该理解成：在更紧凑的 template-based RLE 表示和更大数据集下，整体 geometry/physical/kinematic 能力明显提升，而不是每个单项都绝对第一。

## 3. Baseline 输出和 benchmark 代码格式

`benchmark/scripts/common.sh` 里把方法映射到默认输出目录：

| benchmark method | source folder |
|---|---|
| `ours` | `ours_<dataset>_181500` |
| `physxanything` | `output_physxanything_<dataset>` |
| `physxgen` | `outputs_physxgen_<dataset>` |
| `articulateanything` | `output_articulateanything_<dataset>` |

每个 object 目录下面，不同方法需要不同证据：

| 方法 | 常见几何/运动文件 | 物理属性文件 |
|---|---|---|
| ours | `basic.xml`、`basic.urdf`、`sample.glb` 或 mesh outputs | `basic_info.json` 或 `basic_info.txt`、affordance/description masks |
| physxanything | 通常与 ours 相近，`basic.xml`、`basic_info.*` | 同上 |
| physxgen | `texture.glb`、`mesh/basic.urdf`、`scale.npy` | 部分物理属性或单独 metadata |
| articulateanything | `joint_actor/iter_0/seed_0/mobility.urdf` | 通常不包含完整材料/尺度/描述 |

这也解释了 full benchmark 的工作量：它不是只跑一个生成脚本，而是需要把每个 baseline 的输出转成统一证据资产后再评分。

## 4. 对比时最容易犯的错误

1. 把 `--` 当成 0 分。正确理解是“不适用或没有该输出”。
2. 把 PhysX-Bench 的几何项和 conventional geometry 混为一谈。前者是 VLM/CLIP/多视角视觉判断，后者是有 GT 的渲染或几何误差。
3. 只看 PhysX-Omni 的物理维度优势，忽略 MonoArt 在 PhysX-Bench 几何项上更高。
4. 把我们本地官方 demo 的成功说成论文 benchmark 成功。demo 证明主流程可跑，benchmark 需要 baseline 对齐和分母校验。

