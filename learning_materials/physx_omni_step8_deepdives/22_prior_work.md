# 22 和前序工作的关系精讲

对应 `paper-reading.md`：`## 22. 和前序工作的关系`

## PhysXGen / PhysX-3D

PhysXGen 更偏 physical-grounded 3D asset generation。它关注给 3D asset 注入物理属性，是 PhysX-Omni 的重要前置方向。

PhysX-3D / PhysXNet 也成为 PhysX-Omni 训练数据的重要组成。Hugging Face 当前公开 `Caoza/PhysX-3D` 约 1.83TB，说明它是一个很重的数据和资产体系。

PhysX-Omni 相比 PhysXGen 的推进：

- 覆盖更统一的 rigid、deformable、articulated。
- 引入 PhysXVerse 扩大通用物体覆盖。
- 用 template-based RLE 改进 VLM 几何生成。
- 通过 PhysX-Bench 评估真实条件图下的物理属性。

## PhysX-Anything

PhysX-Anything 是 PhysX-Omni 最直接的前作。它已经尝试从单图生成 simulation-ready physical 3D assets。

PhysX-Omni 相比 PhysX-Anything 的主要改进：

- 数据更广。
- 几何表示更强。
- 减少对显式 segmentation 的依赖。
- 运动学和复杂结构表现更好。
- PhysXVerse 和 PhysX-Bench 进一步扩展数据和评测。

第七步复现建议把 PhysX-Anything 排为 P0 baseline，因为它全维度可比且分数最接近。

## TRELLIS

TRELLIS 是 decoder 角色。PhysX-Omni 不是替代 TRELLIS，而是把 VLM 生成的结构化物理/几何表示交给 TRELLIS 解码。

官方 README 还提到可以替换为 TRELLIS.2，以获得更细几何细节和更高质量结构。这说明 PhysX-Omni 的瓶颈可能随 decoder 进步而移动。

## MonoArt

虽然 `paper-reading.md` 的前序工作小节没有展开 MonoArt，但第七步分析表明它很重要。MonoArt 在 PhysX-Bench 的视觉几何三项上超过 PhysX-Omni，是需要严肃对照的 geometry/kinematic baseline。

## 大白话说明

可以把这些工作放成一条路线：

```text
PhysX-3D / PhysXGen：开始把物理属性放进 3D asset
PhysX-Anything：从单图生成 sim-ready physical asset
PhysX-Omni：统一 rigid/deformable/articulated，并补数据、表示和 benchmark
TRELLIS：提供强 3D decoder
MonoArt：在 articulated geometry/kinematic 上很强
```

## 复现含义

如果要对比，优先级是：

1. PhysX-Anything：直接前作，全维度可比。
2. MonoArt：几何/运动强 baseline。
3. PhysXGen / PhysX-3D：物理属性 baseline。
4. Articulate-Anything：articulation-only baseline。

