# 25 核心术语表精讲

对应 `paper-reading.md`：`## 25. 核心术语表`

## Simulation-ready

不是只可视化，而是可以进入物理仿真器。至少包含尺度、碰撞、材料、关节、功能语义等信息。

大白话：不是摆着看的模型，而是仿真器能拿来碰、推、抓、转的模型。

## Affordance

物体给人或机器人提供的可操作性。比如：

- 把手可抓。
- 按钮可按。
- 椅面可坐。
- 门可拉。
- 轮子可滚。

在 PhysX-Bench 中，APS 用 condition image 和 affordance heatmap 判断可交互区域是否合理。

## Kinematics

物体部件的运动学结构，包括：

- joint type
- joint axis
- pivot
- motion limit
- parent-child relation

大白话：告诉仿真器哪个部件能怎么动。

## Absolute scale

真实世界尺寸。对仿真非常重要，因为碰撞、抓取、动力学、稳定性都和尺度相关。

## Material

不只是纹理外观，还包括密度、弹性、硬度、泊松比、杨氏模量等物理含义。

PhysX-Omni 输出示例里可以看到 `density`、`Poisson's Ratio` 这类字段。

## Template-based RLE

把 3D voxel 切成 2D 层，用 run-length encoding 写成文本，再用模板复用相似切片，压缩几何表达。

大白话：把 3D 物体切片，再用短文本记录每层哪里有实体。

## VLM judge

使用视觉语言模型根据图像、视频、mask、描述等证据打分。它适合评估没有 GT 的复杂语义和物理合理性，但有主观性和模型依赖。

## URDF / XML / MJCF

仿真器常用的结构文件。它们描述 link、joint、geometry、material 等信息。PhysX-Omni 的 `3jsongen_update.py` 会把输出转换为这类结构。

