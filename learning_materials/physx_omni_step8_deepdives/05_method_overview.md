# 05 方法总览精讲

对应 `paper-reading.md`：`## 5. 方法总览`

## 主流程

PhysX-Omni 的方法可以拆成四段：

1. 图像理解：VLM 识别物体类别、部件、尺度、功能和物理先验。
2. 结构化文本生成：把物体描述、部件属性、关节关系和几何表示写成文本。
3. 几何解码：使用 TRELLIS decoder 或其替代版本生成 3D 几何。
4. 仿真资产转换：把生成结果转换为 URDF/XML 等 simulation-ready 输出。

官方 README 中的推理命令正好对应：

```bash
python 1vlm_demo.py
python 2infer_geo.py
python 3jsongen_update.py
```

## VLM 和 TRELLIS 的分工

不要把 PhysX-Omni 理解成“重新发明了所有 3D 生成模块”。它的核心工程策略是：

- VLM 负责高层语义、物理属性、部件结构和文本几何表示。
- TRELLIS 负责把结构化几何条件解码成 3D 资产。
- 后处理脚本负责 URDF/XML 转换和仿真可用性。

这是一种组合式路线，而不是纯端到端黑盒路线。

## 数据流

训练数据里每个对象有 25 张 conditioning images。VLM 学到从图像和结构化 prompt 生成：

- 全局描述。
- 部件属性。
- group_info。
- 每个部件的 64³ voxel RLE。

代码中 `dataset/3generate_data_new_64_finetune_rle.py` 会构造多轮 conversation，其中一轮要求模型：

```text
Based on the structured description of l_<part>,
generate its 3D voxel (grid=64) in the 3D RLE format.
```

## 大白话说明

这套方法像一个“先写说明书，再按说明书建模”的系统：

1. 先看图，判断这是什么东西。
2. 拆出部件，并给每个部件写物理说明。
3. 用紧凑文本表达每个部件的体素形状。
4. 交给 3D decoder 变成几何。
5. 最后整理成仿真器能读的资产。

## 为什么这样设计

因为物理属性强依赖部件结构。比如门的铰链、车轮、抽屉滑轨、把手都不是独立外观细节，它们决定了物体能不能被交互。Global-to-local 加 part-level RLE 是为了让这些局部物理结构有位置、有名称、有几何、有运动关系。

