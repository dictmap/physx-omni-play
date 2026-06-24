# PhysX-Omni 第九步：审稿人视角的灵魂拷问

论文地址：[https://arxiv.org/abs/2605.21572v1](https://arxiv.org/abs/2605.21572v1)  
官方代码：[https://github.com/physx-omni/PhysX-Omni](https://github.com/physx-omni/PhysX-Omni)  
官方模型：[https://huggingface.co/PhysX-Omni/PhysX-Omni](https://huggingface.co/PhysX-Omni/PhysX-Omni)  
PhysXVerse：[https://huggingface.co/datasets/PhysX-Omni/PhysXVerse](https://huggingface.co/datasets/PhysX-Omni/PhysXVerse)  
PhysX-Bench：[https://huggingface.co/datasets/PhysX-Omni/PhysX-Bench](https://huggingface.co/datasets/PhysX-Omni/PhysX-Bench)

本文件不是复述论文贡献，而是站在审稿人位置追问：这篇工作的“从单图生成可物理交互资产”到底证明到了什么程度，哪些部分是可靠工程，哪些部分仍然依赖视觉语言模型的常识先验、提示词设计和后处理默认值。

## 一句话审稿结论

PhysX-Omni 是一个很强的“视觉到可交互资产”系统工程：它把单图输入、部件级结构、几何重建、材质参数、关节关系、URDF/MJCF 输出和 VLM benchmark 串成了一条可运行流水线。  

但如果把它解读成“从单张图片真实恢复物体的物理属性”，证据还不够。当前更准确的说法是：系统生成的是**视觉一致、结构合理、物理参数大体符合常识、可被仿真器消费的候选资产**。它还没有充分证明这些质量、惯量、摩擦、材料、关节限制在真实物理意义上是可校准、可跨仿真器稳定、可直接提升 sim-to-real 的。

我的审稿倾向：

- 作为 3D/robotics 资产生成系统：强贡献。
- 作为物理真值恢复方法：证据不足，需要收窄 claim。
- 作为 benchmark：覆盖面有价值，但 VLM judge 稳定性、跨 judge 排名一致性和真实任务相关性需要补实验。

## 1. 单图生成的物理属性到底有多少是真实推断，多少是常识补全？

**审稿判断：大部分是“视觉证据 + 类别常识 + 数据集统计先验”的混合，不应称为真实测量式推断。**

单张 RGB 图像确实能提供一些物理线索：可见形状、部件边界、可开合结构、常见材料外观、相对尺度、重心大概位置、轮子/铰链/把手等功能部件。这些线索足够支持“合理猜测”：比如垃圾桶有塑料盖、金属主体、轮子可转，M&M's 罐子可能是塑料筒或包装罐。

但真正的物理属性包括质量、密度、杨氏模量、泊松比、摩擦系数、惯量张量、关节阻尼、关节限位、接触参数。单图通常无法唯一确定这些量。即使图像清晰，也缺少：

- 绝对尺度参照；
- 内部结构和壁厚；
- 材料配方；
- 质量分布；
- 接触面粗糙度；
- 真实铰链阻尼和限位；
- 使用磨损和制造差异。

本地复现输出也支持这个判断。官方 demo 的 `basic_info.json` 对 Dumpster 输出了分部件材料和数值，例如 Steel、Plastic/HDPE、Steel with Rubber 等。这些值看起来像常见材料表，而不是从图像中被唯一确定的测量值。更关键的是，同一类“Steel with Rubber”轮子在不同部件上出现了不同的杨氏模量/泊松比组合，说明生成结果带有 LLM/VLM 语义推断和默认值混合的痕迹。

benchmark prompt 也明确把常识作为评价依据：DQS 的维度先验要求在缺少尺度参照时使用物体类别先验和日常尺寸；APS 要求根据日常常识判断可交互区域；MPS 要求用材料物理知识、常见物体材料和视频行为共同判断。这些设计合理，但它们证明的是“是否符合常识和视觉先验”，不是“是否等于真实物理属性”。

**审稿人会要求作者改写 claim：**

- 可以说：predicts plausible physical attributes from visual and semantic priors。
- 不宜说：recovers accurate physical properties from a single image。
- 如果要说 accurate，需要用真实称重、材料测试、尺度测量、机器人接触实验来闭环。

## 2. PhysX-Bench 换一个 VLM judge 后排名是否稳定？

**审稿判断：当前证据不足。benchmark 的缺失证据处理比较严格，但排名是否依赖 Qwen3.5 judge 尚未被充分排除。**

官方 benchmark 默认使用 `Qwen/Qwen3.5-122B-A10B` 作为 VLM judge。代码和 README 对缺失证据有明确规则：缺少 RQS/MCS/DCS/DQS/APS/KPS/MPS 证据时保留分母并记 0 分。这能减少“只提交容易样本”的偏差，是优点。

但 VLM judge 的主观性仍然很强：

- APS 依赖“常识中的可交互区域排序”；
- DQS 先问 VLM 维度先验，再确定性算分；
- KPS/VAPS 先抽取图像结构先验，再比较视频运动；
- MPS 让 VLM 同时读图、读水/地面模拟视频、读材料参数，并判断杨氏模量、泊松比、密度是否合理。

这些 prompt 的约束很细，但“约束细”不等于“不同 judge 排名稳定”。如果换成 GPT、Gemini、Claude、InternVL、Qwen 小模型，甚至同模型不同温度/不同 prompt，排序是否一致，论文需要报告。

**我建议的最低补实验：**

- 用至少 4 个 judge：Qwen3.5、GPT 系、Gemini 系、一个开源 VLM。
- 对所有方法计算 Spearman/Kendall 排名相关。
- 对每个 metric 做 bootstrap 置信区间。
- 报告“方法 A 是否显著优于方法 B”，而不是只报均值。
- 对 prompt 做轻微改写，测试 ranking 是否稳定。
- 引入人工专家小样本标注，报告 VLM-human 相关。

如果排名在 RQS/MCS 这种视觉质量指标稳定，但在 APS/KPS/MPS/DQS 不稳定，那么论文结论也应分层：视觉重建强，物理语义/动力学可信度仍待验证。

## 3. 生成资产在 MuJoCo、Isaac Sim、Genesis 等不同仿真器中是否一致稳定？

**审稿判断：还不能默认一致。代码已经覆盖 MuJoCo/Genesis 渲染或模拟环节，但这不等于同一资产在多仿真器中动力学一致。**

不同仿真器对以下内容的处理存在明显差异：

- mesh collision 的凸分解、缩放、单位；
- URDF/MJCF importer 对惯量缺失的默认处理；
- joint axis 和 joint limit 的解释；
- 摩擦、阻尼、接触软硬程度；
- deformable/soft body 支持；
- fluid 或水中运动的近似模型；
- 非闭合网格、薄壳、穿模、非流形几何。

官方 benchmark 中 KPS/MPS 会用到 MuJoCo/Genesis 相关渲染/模拟组件，但这更像“benchmark renderer/simulator 的标准化证据生成”，不是“同一资产跨仿真器动力学等价”的验证。

**审稿人会要求跨仿真器一致性表：**

| 检查项 | MuJoCo | Isaac Sim | Genesis | 需要报告 |
|---|---:|---:|---:|---|
| 导入成功率 | 必需 | 必需 | 必需 | URDF/MJCF/USD 是否能无错误导入 |
| 静态稳定 | 必需 | 必需 | 必需 | 释放后是否爆炸、穿地、飞散 |
| 关节一致性 | 必需 | 必需 | 必需 | axis、limit、range 是否一致 |
| 接触一致性 | 必需 | 必需 | 必需 | 滑动距离、反弹、抓取接触 |
| 参数保真 | 必需 | 必需 | 必需 | mass/inertia/friction 是否被实际使用 |
| 任务可用性 | 推荐 | 推荐 | 推荐 | grasp/open/push 等任务表现 |

如果没有这个表，只能说“在作者指定流水线中可运行”，不能说“跨仿真器稳定一致”。

## 4. URDF/XML 输出是否包含足够可靠的质量、惯量、摩擦、关节限制？

**审稿判断：从本地复现产物看，不足以支撑可靠动力学。当前输出更接近结构/运动可视化或初步仿真资产。**

我对官方 demo 输出的 `basic.urdf` 和 `basic.xml` 做了结构检查：

- `basic.urdf`
  - 13 个 link、12 个 joint；
  - 13 个 link 的 mass 全是 `1.0`；
  - 13 个 inertia 使用同一组惯量；
  - 未发现 density；
  - 未发现 friction 属性；
  - joint 包含 fixed、continuous、revolute，少量 limit。

- `basic.xml`
  - 16 个 geom、5 个 hinge joint；
  - 有 density 字段，来自材料语义；
  - 未显式看到 link mass/inertia；
  - joint frictionloss 为 `0.0`；
  - 关节限制/阻尼/接触参数仍不足。

这说明 JSON 中的材料语义和最终仿真文件之间有落差。即使 JSON 写了 material/density/Young's modulus/Poisson ratio，URDF/MJCF 是否完整、是否被仿真器正确使用、是否能产生真实接触行为，仍需额外验证。

对真实机器人训练而言，以下字段尤其关键：

- 绝对尺度；
- 每个 link 的质量；
- 每个 link 的惯量张量；
- collision mesh 与 visual mesh 的差异；
- 接触摩擦系数；
- rolling/spinning friction；
- joint lower/upper limit；
- joint damping/friction/armature；
- actuator/drive 参数；
- deformable material 参数是否被目标仿真器支持。

当前复现结果不能证明这些字段可靠。它能证明官方脚本可以产出可解析文件，但不能证明“物理参数够准”。

## 5. 真实机器人任务中，使用这些生成资产训练是否能提升 sim-to-real 表现？

**审稿判断：这是最关键但也最缺闭环的验证。没有真实机器人 ablation，就不能把贡献外推为 sim-to-real 提升。**

PhysX-Omni 对机器人学习的潜在价值很明显：如果能从商品图/场景图批量生成可交互资产，就能扩大训练物体多样性，尤其对 open-vocabulary manipulation、抽屉/门/容器/轮子等 articulated object 很有意义。

但“生成资产能用于训练”与“能提升 sim-to-real”之间还差几层：

- 生成资产的几何是否足够抓取/接触；
- 关节和限位是否足够真实；
- 质量/摩擦/惯量是否足够接近真实；
- 视觉 domain gap 是否被控制；
- 机器人策略是否真的利用了生成资产带来的物理多样性；
- 与手工资产、扫描资产、无资产增强相比是否显著更好。

**建议的真实机器人最小验证：**

1. 选 20-50 个真实可交互物体：盒子、罐子、抽屉、小柜门、带轮容器、按钮/开关等。
2. 每个物体采集单图，生成资产。
3. 用三组仿真数据训练同一个策略：
   - A：无生成资产或基础 domain randomization；
   - B：手工/扫描高质量资产；
   - C：PhysX-Omni 生成资产。
4. 在真实机器人上测试成功率、接触失败、关节误判、抓取滑落、过拟合类别等。
5. 报告每个类别的增益，而不是只报平均值。

如果 C 明显优于 A，说明生成资产有用；如果接近 B，说明质量很强；如果 C 低于 B 但仍优于 A，也仍是有价值结果。没有这个实验，sim-to-real 只能作为潜力而不是已证明结论。

## 6. template-based RLE 是否能泛化到更复杂拓扑或更高分辨率？

**审稿判断：template-based RLE 是很实用的 64³ voxel 表示压缩方案，但泛化到复杂拓扑和更高分辨率还未被证明。**

代码显示当前训练数据生成以 `64 x 64 x 64` voxel grid 为核心，把每个 z-slice 编码成 2D RLE，并用 template/delta 方式做 lossless 压缩。代码中还会把编码再解码回 voxel，并用唯一索引比较保证无损。这是工程上扎实的一点：表示本身不是有损压缩。

但问题在于模型生成和尺度扩展：

- 64³ 对细长结构、薄壳、螺纹、把手内侧、透明/空心容器不够；
- 更复杂拓扑会让 RLE run 数量上升，template 复用下降；
- 高分辨率会让 token 长度快速增加；
- 当前数据构建里有 token 长度过滤，超过限制的复杂对象可能被排除；
- voxel 到 mesh 的重建质量和 collision mesh 质量会影响仿真稳定性；
- 多部件对象的拓扑错误会进一步影响关节轴和关节限位。

因此，RLE 的“lossless”只能说明编码/解码不丢 voxel，并不能说明模型能稳定生成复杂拓扑，也不能说明 128³ 或 256³ 仍然可训练、可推理、可转换成稳定 mesh。

**建议补实验：**

- 64³/128³/256³ 三档分辨率；
- simple/medium/complex topology 分层；
- token length、valid decode rate、mesh watertight rate、collision stability；
- thin structure IoU/chamfer；
- articulated joint 成功率；
- 训练/推理显存和时间曲线。

## 7. 如果换成 TRELLIS.2 或更强 3D decoder，瓶颈会转移到哪里？

**审稿判断：几何瓶颈会缓解，但系统瓶颈会转移到物理语义、部件关系、参数校准、仿真文件可靠性和评测可信度。**

官方 README 已经指出，当前使用预训练 TRELLIS decoder，并提到可以替换为 TRELLIS.2 decoder 以获得更细几何细节和更高质量结构。这个方向合理，但不应期待“更强 decoder”自动解决物理问题。

更强 3D decoder 可能改善：

- visual mesh 质量；
- 表面纹理和局部细节；
- 部件边界；
- thin structure 表达；
- 视觉 RQS/MCS 分数。

但新瓶颈会更突出：

- **物理参数瓶颈**：质量、摩擦、惯量、材料模量仍不能从单图唯一恢复。
- **部件语义瓶颈**：同样的几何，哪个部件可动、怎么动、限位多少，仍依赖 VLM 先验。
- **关节/拓扑瓶颈**：细几何不等于正确 articulated hierarchy。
- **collision 表示瓶颈**：高质量 visual mesh 可能更难直接用于稳定 collision。
- **仿真器差异瓶颈**：MuJoCo/Isaac/Genesis 对同一资产的默认处理不一致。
- **benchmark 瓶颈**：如果 judge 仍由单一 VLM 主导，更高几何质量可能只提升视觉分，而不能证明物理真值。
- **数据标注瓶颈**：更强 decoder 需要更高质量、多样和物理标定数据，否则只是更漂亮地生成常识猜测。

换句话说，TRELLIS.2 会把“看起来像不像”的问题往前推，但会把“物理上对不对”的问题暴露得更明显。

## 作为审稿人的最终问题清单

如果我是 reviewer，会要求作者在 rebuttal 或后续版本中回答这些问题：

1. 对 DQS/MPS/APS/KPS，是否测试过不同 VLM judge 的排名相关？如果没有，为什么默认 Qwen3.5 的排序可信？
2. 物理参数是否和真实测量值对齐过？有无真实物体的 mass、inertia、friction、joint limit 标定集？
3. URDF/MJCF 中的 mass/inertia/friction/limit 是否完整？是否有自动报告缺失字段？
4. 同一生成资产在 MuJoCo、Isaac Sim、Genesis 中导入和释放是否稳定？失败率是多少？
5. benchmark 的 MPS/KPS 视频是否会奖励“看起来合理”的错误参数？
6. 对真实机器人策略训练，是否有 generated assets vs scanned assets vs handcrafted assets 的 ablation？
7. RLE token 长度过滤是否排除了复杂物体，从而让训练/benchmark 样本偏向简单拓扑？
8. 如果用 TRELLIS.2，视觉分提升后，物理分是否同步提升，还是出现视觉-物理脱钩？

## 我会建议的论文措辞修订

更稳妥的主张：

> PhysX-Omni generates visually and semantically plausible articulated simulation assets from a single image, including geometry, part structure, materials, and simulator-consumable files, and evaluates them with a VLM-assisted benchmark.

需要避免的强主张：

> PhysX-Omni accurately recovers physical properties from a single image.

如果作者想保留“physical properties”这个表述，应补一句：

> These physical properties should be interpreted as plausible priors rather than calibrated measurements unless validated by task-specific simulation or real-world measurements.

## 总结

PhysX-Omni 的价值不在于它已经解决了“单图真实物理恢复”，而在于它把一个长期分散的问题系统化了：从图像到部件、从部件到可动结构、从语义到物理参数、从几何到仿真文件、从生成到 benchmark。  

最核心的审稿质疑是：**它现在证明了“可生成、可评估、可运行”，但还没有完全证明“物理准确、跨仿真器稳定、真实机器人有效”。** 这不削弱工作作为系统论文的意义，但要求我们读论文时把 claim 分层，不要把 plausible physical priors 误读成 calibrated physical truth。
