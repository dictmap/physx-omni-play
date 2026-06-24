# 21 需要警惕的边界精讲

对应 `paper-reading.md`：`## 21. 需要警惕的边界`

## 边界 1：VLM judge 的主观性

PhysX-Bench 依赖 VLM judge 来评估很多复杂属性，例如 affordance、description、kinematic plausibility。好处是能评估没有 ground-truth 的真实图片，坏处是评分会受模型、prompt 和证据质量影响。

风险：

- 换一个 VLM judge，排名可能变化。
- prompt 写法会影响分数。
- VLM 的物理直觉不等于真实仿真动力学。
- 分数高不代表材料参数真实。

## 边界 2：物理属性是合理性，不是测量值

从单张图像很难精确反推密度、弹性、摩擦、惯量等物理属性。论文更多是在生成 physically plausible asset，而不是做实验室物性测量。

大白话：模型能猜“这个看起来像金属”，但不能保证知道它真实密度、摩擦系数和内部质量分布。

## 边界 3：训练成本高

论文训练成本是 64 张 A100、约 14 天。个人 4090 不适合完整复训。可行路线是：

- 用公开 checkpoint inference。
- 跑 demo pipeline。
- 跑 tiny benchmark smoke。
- 做小规模数据预处理或 finetune 验证。

## 边界 4：几何质量不是所有指标第一

第七步已确认：PhysX-Bench 里 MonoArt 的 CLIP、3D consistency、visual quality 高于 PhysX-Omni。PhysX-Omni 更强的是 physical/sim-ready 综合维度，而不是纯视觉质量。

## 边界 5：商业使用受限

代码是 S-Lab License，PhysXVerse 和 PhysX-Mobility 是 cc-by-nc-4.0。模型页面的 `mit` 不能覆盖代码和训练数据限制。商用前必须逐项审查。

## 边界 6：本地复现边界

当前本地已完成：

- 官方 demo 主流程。
- `basic_info.json`、URDF/XML、voxel/mesh 输出检查。
- benchmark tiny smoke。
- Step 1-7 的文档化精读。

当前未完成：

- full training。
- full PhysX-Bench。
- 所有 baseline 输出对齐。
- 真实机器人策略学习验证。

## 建议写法

报告中建议使用：

```text
PhysX-Omni 提供了面向 simulation-ready physical 3D generation 的完整研究框架，
并在论文协议下展示出强物理属性和运动学能力。
但其物理参数应理解为 plausibility 生成结果，full benchmark 和机器人落地仍需要额外验证。
```

