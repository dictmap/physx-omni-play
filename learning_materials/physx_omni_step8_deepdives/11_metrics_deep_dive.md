# 11 各评测项精讲

对应 `paper-reading.md`：`## 11. 各评测项怎么理解`

## 总体理解

PhysX-Bench 的评测不是一个单分数，而是一组证据驱动的指标。它把“物体是否可用于仿真”拆成可观察的几类问题：像不像、尺寸是否合理、材料行为是否合理、哪里能交互、关节是否合理、部件描述是否对齐。

## 11.1 Geometry

Geometry 包括：

- CLIP score：输入图和生成结果语义是否一致。
- 3D consistency：多视角渲染是否结构一致。
- visual quality：渲染质量和视觉自然度。

这类指标更接近传统 3D 生成评估。第七步已经确认，PhysX-Omni 在 PhysX-Bench 的视觉几何项不是全胜，MonoArt 的 CLIP、3D consistency、visual quality 更高。

大白话：它问的是“这个 3D 模型看起来是不是像输入图，而且换角度看会不会崩”。

## 11.2 Absolute scale

Absolute scale 评估尺寸是否合理。代码流程中 DQS 会先让 VLM 从条件图估计真实世界尺寸先验，再和生成资产的尺寸元数据比较。

benchmark README 中 DQS 的描述是：先问 VLM 图像尺寸先验，然后确定性计算最终分数。

大白话：桌子不能生成成手机大小，玩具车也不能生成成公交车大小。仿真里的质量、碰撞、抓取全依赖尺寸。

## 11.3 Material

Material 不是只看纹理颜色，而是看物理行为。PhysX-Bench 的 MPS 使用 water 和 floor simulations：

- 水滴或流体相关行为。
- 落地、弹性、硬度、密度等间接视觉证据。

代码中 MPS 需要：

- material metric JSON。
- water video。
- floor video。
- `prompts_material.yaml`。

大白话：看上去像布不够，还要在仿真视频里表现得像布；看上去像钢不够，还要有更硬、更重的行为先验。

## 11.4 Affordance

Affordance 评估哪里可交互。APS 需要 condition image 和 affordance heatmap views。

合理例子：

- 杯子把手适合抓。
- 椅面适合坐。
- 车轮适合滚动。
- 门把手适合拉。

不合理例子：

- 把刀刃标成主要抓握区域。
- 把椅背标成坐面。
- 把装饰纹理当按钮。

大白话：affordance 是“这个地方对人或机器人来说能干什么”。

## 11.5 Kinematics

Kinematics 评估运动结构是否合理。KPS 使用标准化 articulation video。代码中 `benchmark/code/render/kinematic/kinematic_articulation_demo.py` 会把 URDF/XML 证据渲染成运动视频。

KPS 关注：

- 可见部件运动是否和输入一致。
- 不可见但生成后暴露的部件是否合理。
- 全局关节结构是否协调。

大白话：门应该绕铰链转，抽屉应该沿滑轨平移，轮子应该绕轴滚，不应该乱飞或穿过主体。

## 11.6 Description

Description 评估部件语义是否落到正确区域。DCS 用一个 rendered color view、一个同视角 black/white mask 和 reference description 作为证据。

大白话：不是生成一个整体形状就完事，而是每个部件都要“叫得对、遮得对、功能说得对”。

## 复现注意

这些指标的证据不一样，所以 full benchmark 不是一个脚本能解决：

- RQS/MCS 要渲染多视角图。
- DCS 要 mask 和描述。
- DQS 要尺寸元数据。
- APS 要 affordance heatmap。
- KPS 要 articulation video。
- MPS 要材料仿真视频。

缺证据不能跳过，benchmark 代码会把缺失证据保留在分母中，缺失项可记为 0。这是严谨比较的关键。

