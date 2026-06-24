# 专题 2：PhysXVerse 与 PhysX-Bench 深挖

这一专题讲两件事：训练数据怎么支撑创新，评估体系怎么证明它不是只会生成漂亮 mesh。

## 1. PhysXVerse：解决数据稀缺

### 1.1 问题

Simulation-ready physical 3D generation 需要的训练样本远比普通 image-to-3D 复杂。普通 3D 数据可能只有 mesh/texture；PhysX-Omni 需要：

- object category；
- absolute scale；
- part hierarchy；
- part geometry；
- material / density / elastic parameters；
- affordance；
- kinematic relation；
- functional description。

所以论文构建 PhysXVerse。

### 1.2 构建流程

```text
PartVerse assets
  -> 使用 human-verified segmentation annotations
  -> 过滤无效样本
  -> 合并过小或噪声 part
  -> 渲染多视角图像
  -> GPT/VLM 生成初始物理标注
  -> 人工验证和修正
  -> PhysXVerse
```

### 1.3 标注内容

| 标注 | 作用 |
|---|---|
| absolute scale | 进入仿真必须知道真实尺度 |
| material | 影响密度、弹性、接触和形变 |
| affordance | 描述人/机器人怎么用这个部件 |
| function description | 提供语义和功能解释 |
| kinematic information | 关节轴、位置、范围、父子部件关系 |
| part segmentation | 让几何和物理属性按部件对齐 |

### 1.4 数据规模

| 项 | 数值 |
|---|---:|
| PhysXVerse assets | >8.7K |
| categories | >2.9K |
| part count range | 1 到 65 |
| combined training corpus | >42K sim-ready physical 3D assets |
| rendered conditioning views | 每个对象 25 张 |

### 1.5 为什么是创新

PhysXVerse 的创新不在“数量最大”，而在“物理标注 + 部件结构 + 类别覆盖 + VLM 可学习格式”。它让模型不只是记住几类关节物体，而能覆盖车辆、机器人、玩具、建筑、室内家具、无人机等更泛化类别。

---

## 2. PhysX-Bench：解决评估缺口

### 2.1 问题

传统 3D 评估主要看：

- PSNR；
- Chamfer Distance；
- F-score；
- CLIP similarity；
- visual quality。

但 simulation-ready 资产还需要：

- 尺度合理；
- 材料合理；
- affordance 合理；
- 关节运动合理；
- 语义描述和部件对应合理。

所以 PhysX-Bench 评六个维度。

### 2.2 六维评估

| 维度 | 子指标/思路 |
|---|---|
| Geometry | CLIP、3D consistency、visual quality |
| Absolute scale | 生成最大尺寸和 VLM 估计真实最大尺寸比较，转 scale plausibility |
| Material | 用渲染图像/视频评估机械属性表现 |
| Affordance | 局部/全局常识合理性、relative ranking、典型 part misranking |
| Kinematics | motion behavior、part motion consistency、overall articulation coherence |
| Description | part-level mask 区域和参考语义描述是否匹配 |

### 2.3 为什么用 VLM 评估

论文采用 Qwen3.5-122B-A10B 作为开源 VLM 评估器，并且用渲染图像/视频作为输入，而不是直接喂物理参数。原因是：

| 做法 | 好处 |
|---|---|
| 评 rendered images/videos | 让 VLM 看“资产表现”，接近人类评估 |
| 不直接喂 raw params | 避免复杂物理参数格式干扰评估 |
| 维度拆开 | 可以知道模型是 geometry 强，还是 material/kinematics 强 |
| ground-truth-free | 能评估 in-the-wild 图片生成结果 |

### 2.4 Human alignment

论文用人类偏好验证 PhysX-Bench 的可靠性：

| 维度 | Spearman ρ | 解释 |
|---|---:|---|
| absolute scale | 1.0 | 自动排名和人工偏好高度一致 |
| affordance | 1.0 | 同上 |
| material | 1.0 | 同上 |
| description | 1.0 | 同上 |
| kinematic | 1.0，Pearson r=0.992 | 运动学评估非常贴近人工评分 |
| geometry | 0.8，Pearson r=0.803 | geometry 更主观，但仍有较强相关 |

### 2.5 表格结果如何读

PhysX-Bench 上，MonoArt 的 geometry 三项更高：CLIP、3D consistency、visual quality 都是最高。但 PhysX-Omni 在五个物理/语义属性上最高：

| 指标 | PhysX-Omni | 最强含义 |
|---|---:|---|
| Absolute scale | 64.26 | 尺度更接近真实物理对象 |
| Material | 59.89 | 材料/机械属性判断更合理 |
| Affordance | 70.57 | 部件功能和交互常识更合理 |
| Kinematic | 80.72 | 关节/运动行为最合理 |
| Description | 39.02 | part-level semantic grounding 更好 |

这正好支持论文的主张：PhysX-Omni 不是纯视觉最优，而是 **simulation-ready 综合最优**。
