# 28 最适合继续追的问题精讲

对应 `paper-reading.md`：`## 28. 最适合继续追的问题`

## 问题 1：单图物理属性有多少是真实推断

从单图看不出内部密度、摩擦、惯量。模型很多时候是在根据类别和外观做常识补全。后续可以比较生成属性和真实物体测量值，区分“合理”与“准确”。

## 问题 2：换 VLM judge 后排名是否稳定

PhysX-Bench 依赖 VLM judge。后续可以用多个 judge 复评：

- Qwen3.5
- GPT 系列
- Gemini 系列
- Claude 系列
- 本地开源 VLM

看 ranking 是否稳定，尤其是 affordance、material、kinematic。

## 问题 3：不同仿真器中是否稳定

同一 URDF/XML 在 MuJoCo、Isaac Sim、Genesis 中可能表现不同。需要检查：

- 尺度。
- 质量。
- 惯量。
- 接触。
- 关节 limit。
- mesh 碰撞近似。

## 问题 4：URDF/XML 是否足够可靠

当前输出能生成 URDF/XML，但还要看：

- link 是否完整。
- joint 是否合理。
- inertia 是否可信。
- collision geometry 是否简化得当。
- friction/contact 参数是否存在。

## 问题 5：真实机器人任务是否提升 sim-to-real

最关键的应用验证不是视觉分数，而是用生成资产训练策略后，真实机器人成功率是否提高。

## 问题 6：RLE 是否能泛化到更复杂拓扑

64³ RLE 对很多对象够用，但对于更细薄结构、复杂拓扑、透明材质、柔性物体，可能还不够。后续可以测试更高分辨率或和更强 decoder 结合。

## 问题 7：换 TRELLIS.2 后瓶颈在哪

官方 README 提到可替换为 TRELLIS.2。如果 decoder 更强，瓶颈可能转向：

- VLM 物理语义推理。
- part hierarchy。
- 关节参数。
- 数据标注质量。
- benchmark 的 VLM judge 可靠性。

## 建议下一步实验

最现实的下一步：

1. 用同一输入图跑 PhysX-Omni 和 PhysX-Anything。
2. 对比 JSON、URDF、mesh、关节和尺度。
3. 用 PhysX-Bench 小样本跑 RQS、DQS、KPS。
4. 再考虑 MonoArt 的 geometry/kinematic 对照。

