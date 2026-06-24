# 18 Simulation-ready scene generation 精讲

对应 `paper-reading.md`：`## 18. 应用：simulation-ready scene generation`

## 论文原意

PhysX-Omni 主要是对象级 sim-ready asset 生成器。论文进一步展示了它可以嵌入场景生成流程：

1. 从输入图像估计深度。
2. 用 2D segmentation 分割对象。
3. 得到粗略 3D layout。
4. 用 PhysX-Omni 生成对象级 sim-ready assets。
5. 插入场景，构建物理合理的仿真环境。

## 代码证据

官方仓库提供：

- `convert_objects2scene.py`
- `applications_scene/`

README 写到：`convert_objects2scene.py` 可以把 individual objects 转成 simulation-ready scene，`applications_scene` 基于现有工作构建 simple scene generation pipeline。

## 大白话说明

PhysX-Omni 本身像“做单个物体”的机器。  
如果再加上深度估计、分割和布局重建，就可以把一张房间照片拆成多个对象，再逐个生成仿真资产，最后摆回一个场景里。

这相当于：

- 场景理解负责“东西在哪里”。
- PhysX-Omni 负责“每个东西是什么、怎么动、什么材质”。
- 仿真器负责“这些东西放在一起能不能跑”。

## 和 REST3D 等工作的关系

第七步扫描到 REST3D 这类场景级 physically stable reconstruction 工作。它们关注场景级支撑、碰撞、漂浮和稳定性。PhysX-Omni 更偏对象级资产生成。两者不是直接替代关系，而是可以互补。

## 复现建议

要复现场景生成，不要一开始就做完整复杂房间。建议：

1. 选择 2-3 个对象的简单桌面场景。
2. 用人工或现成工具给出粗略 layout。
3. 用 PhysX-Omni 分别生成对象资产。
4. 用 `convert_objects2scene.py` 拼接。
5. 检查碰撞、尺度和对象间穿模。

## 边界

场景生成比单对象更难，因为多了：

- 对象间尺度一致性。
- 支撑关系。
- 物体接触。
- 重力稳定性。
- 遮挡下的完整性推断。

因此 scene generation demo 只能证明方向可行，不能代表自动构建大型稳定仿真环境已经完全解决。

