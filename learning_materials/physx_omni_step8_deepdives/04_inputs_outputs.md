# 04 输入输出精讲

对应 `paper-reading.md`：`## 4. 输入输出怎么理解`

## 输入是什么

论文里的输入可以是：

- 单张完整图像。
- 单张部分遮挡图像。
- benchmark 中的真实照片或合成渲染条件图。

代码上，推理入口是 `1vlm_demo.py`。它接收图像，先让 VLM 输出结构化物理语义和几何生成所需文本。

## 输出是什么

输出不是单个 mesh 文件，而是一组 simulation-ready 资产信息：

- 3D 几何。
- 部件层级。
- 绝对尺度。
- 材料属性。
- affordance，可交互区域。
- kinematics，运动学结构。
- function description，部件功能和语义。
- URDF / XML 等仿真结构。

本地官方 demo 输出目录 `C:\Users\robot\physx_outputs\official_demo_full` 里可以看到：

- `basic_info.json`
- `basic.urdf`
- `basic.xml`
- `ind_*.npy`
- `ind_*.ply`
- `allind.npy`
- `voxel_projection.png`
- `official_7part_mesh_preview.png`

这说明输出已经从“视觉网格”扩展成了结构化资产包。

## JSON schema 怎么看

本地 `basic_info.json` 的顶层键：

```text
object_name
category
dimension
parts
group_info
```

其中 `parts` 内部有部件标签、名称、材料、密度、泊松比、优先级等字段。`group_info` 表示部件之间的父子关系和运动关系。

## 大白话说明

输入是一张照片，输出是一份“物体说明书 + 3D 部件 + 仿真配置”。

可以类比为：

- mesh 是外壳。
- part 是拆件图。
- dimension 是真实世界尺码。
- material 是材质和物性说明。
- affordance 是告诉机器人哪里能操作。
- kinematics 是告诉仿真器哪个部件怎么动。
- URDF/XML 是让仿真器实际加载的文件。

## 复现检查点

跑 demo 时，不要只看是否生成了图片。至少要检查：

1. `basic_info.json` 是否存在并可解析。
2. `parts` 是否非空。
3. `dimension` 是否合理。
4. `group_info` 是否和物体类型相符。
5. URDF/XML 是否生成。
6. mesh/voxel 文件是否能被预览或加载。

