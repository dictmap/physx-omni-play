# PhysX-Omni 第七步附录 A：Baseline 复现优先级与执行路线

## 1. 优先级算法

复现优先级按四个因素打分：

| 因素 | 权重 | 说明 |
|---|---:|---|
| 任务可比性 | 35% | 是否和 PhysX-Omni 一样从单图生成 simulation-ready physical 3D asset |
| 分数接近度 | 30% | 是否在 Table 1/2 里接近 PhysX-Omni 或超过某些指标 |
| 论文高频度 | 20% | 论文全文出现次数与讨论强度 |
| 复现可行性 | 15% | 是否有代码、模型、数据、依赖是否可控 |

## 2. 复现排序

| 排名 | 方法 | 综合判断 | 推荐动作 |
|---:|---|---|---|
| 1 | PhysX-Anything | 直接前作，全维度可比，分数最接近；在 PhysX-Mobility F-score 上高于 PhysX-Omni | 先跑官方 demo，再做同输入图对比，最后对齐 PhysX-Bench 小样本 |
| 2 | MonoArt | 在 PhysX-Bench 几何三项超过 PhysX-Omni，conventional geometry 很接近 | 跑单图推理，重点产出 geometry 和 articulation video |
| 3 | PhysXGen / PhysX-3D | 覆盖物理属性，与 PhysX-Omni 目标相近，但资产很重 | 先只取官方 demo / 小样本，避免全量下载 |
| 4 | Articulate-Anything | articulation-only，对应 kinematic baseline | 跑一个 articulated object 案例即可，不作为完整物理 baseline |

## 3. P0：PhysX-Anything 复现路线

官方代码：[https://github.com/ziangcao0312/PhysX-Anything](https://github.com/ziangcao0312/PhysX-Anything)  
模型/数据入口：[https://huggingface.co/Caoza/PhysX-Anything](https://huggingface.co/Caoza/PhysX-Anything)，[https://huggingface.co/datasets/Caoza/PhysX-Mobility](https://huggingface.co/datasets/Caoza/PhysX-Mobility)

### 为什么先做

- PhysX-Omni 论文中最高频。
- 和 PhysX-Omni 一样有 VLM + geometry text representation + simulation-ready 输出链路。
- Table 1/2 全维度可比。
- PhysX-Mobility 上多个指标与 PhysX-Omni 接近：
  - F-score：PhysX-Anything `89.51`，PhysX-Omni `88.50`。
  - Affordance：PhysX-Anything `16.29`，PhysX-Omni `16.58`。
  - Kinematic：PhysX-Anything `0.7852`，PhysX-Omni `0.8603`。
  - Description：PhysX-Anything `26.28`，PhysX-Omni `28.40`。

### 小样本目标

1. 克隆代码并记录 commit。
2. 下载模型和最小 demo 资产。
3. 用同一张罐子图和 PhysX-Omni 已跑过的 demo 图输入。
4. 输出：
   - `basic_info.json` 或等价物理属性 JSON。
   - mesh / voxel / URDF / MJCF 证据。
   - 多视角渲染图。
   - kinematic motion video 或可替代证据。
5. 转成 PhysX-Bench 所需输出目录。

### 风险

- 和 PhysX-Omni 共用 TRELLIS/Kaolin/spconv/nvdiffrast 等依赖，环境容易冲突。
- 旧版 representation 与文件格式可能和 PhysX-Omni 当前 benchmark 不完全一致，需要 adapter。
- full benchmark 不应一开始做，先做 1-5 个样本。

## 4. P1：MonoArt 复现路线

官方代码：[https://github.com/Quest4Science/MonoArt](https://github.com/Quest4Science/MonoArt)  
论文：[https://arxiv.org/html/2603.19231v1](https://arxiv.org/html/2603.19231v1)

### 为什么做

- PhysX-Bench 中 MonoArt 的 CLIP、3D consistency、visual quality 都高于 PhysX-Omni。
- PhysXVerse / PhysX-Mobility conventional geometry 中，MonoArt 是最接近 PhysX-Omni 的 baseline。
- MonoArt 自己的论文也在 PartNet-Mobility 上超越 PhysX-Anything、PhysXGen、Articulate-Anything 等共同 baseline。

### 小样本目标

1. 跑官方 demo 或 inference。
2. 同输入图生成 canonical mesh、part mask、joint type、axis、pivot、motion limit。
3. 输出 kinematic video，喂给 PhysX-Bench 的 kinematic/geometry 项。
4. 不比较 material、scale、affordance、description，避免不公平。

### 风险

- MonoArt 主要面向 articulated object，不适合 rigid/deformable/general object 全覆盖。
- 如果输入物体不是 articulated，MonoArt 的比较意义会弱。

## 5. P2：PhysXGen / PhysX-3D 复现路线

官方代码：[https://github.com/ziangcao0312/PhysX-3D](https://github.com/ziangcao0312/PhysX-3D)  
项目页：[https://physx-3d.github.io/](https://physx-3d.github.io/)  
数据：[https://huggingface.co/datasets/Caoza/PhysX-3D](https://huggingface.co/datasets/Caoza/PhysX-3D)

### 为什么做

- 物理属性 baseline，覆盖 scale/material/affordance/kinematic/description。
- PhysX-Omni 的训练数据和 benchmark 都继承 PhysX-3D/PhysXNet 体系。

### 小样本目标

1. 只克隆代码和必要模型，不全量下载 PhysXNet-XL。
2. 跑官方 demo 输入。
3. 比较 PhysXGen 和 PhysX-Omni 的 JSON schema、物理字段、mesh 质量。
4. 后续再决定是否扩到 PhysX-Mobility 小样本。

### 风险

- Hugging Face 公开数据体量约 1.8TB，不适合直接全量拉。
- 依赖和 PhysX-Omni 类似，同样重。

## 6. P3：Articulate-Anything 复现路线

官方代码：[https://github.com/vlongle/articulate-anything](https://github.com/vlongle/articulate-anything)  
项目页：[https://articulate-anything.github.io/](https://articulate-anything.github.io/)

### 为什么做

- 是 PhysX-Omni 的 articulation baseline。
- 能帮助验证 kinematic video / URDF-style 输出对比。

### 小样本目标

1. 选择一个明显 articulated object，例如柜门、抽屉、笔记本电脑。
2. 跑出关节结构和可动部件。
3. 只进入 kinematic 对比，不进入完整 PhysX-Bench 物理属性对比。

## 7. 推荐立即执行的复现清单

1. 在 4090 上新建 `baselines/physx-anything`，克隆 PhysX-Anything，记录 commit。
2. 复用当前 PhysX-Omni 的 Conda/CUDA 依赖，先不改全局环境。
3. 跑 PhysX-Anything demo 输入，优先用：
   - 用户罐子图；
   - PhysX-Omni 已跑通的官方 demo 图；
   - PhysX-Bench 中 1-3 张 `demo_mobility` articulated 图。
4. 建立 `baseline_outputs/physx_anything/<object_id>/` 输出规范。
5. 再克隆 MonoArt，只跑 1 个 articulated object，并输出 geometry/kinematic evidence。

