# 08 为什么不用纯 mesh 或纯 point cloud 精讲

对应 `paper-reading.md`：`## 8. 为什么不用纯 mesh 或纯 point cloud`

## 论文原意

PhysX-Omni 选择 template-based RLE，不是因为 mesh 或 point cloud 没用，而是因为它们不适合作为 VLM 直接生成的主表示。

主要问题：

- mesh 顶点和面片有顺序问题，文本序列长且脆弱。
- point cloud 缺少显式表面、拓扑和部件关系。
- dense voxel 展开太长。
- latent 表示短，但解释性和物理部件对齐弱。

## 为什么 VLM 不适合直接吐 mesh

mesh 通常包含：

- 大量顶点坐标。
- 大量三角面索引。
- 顶点和面的顺序虽然对几何不一定有意义，但对语言模型却变成了序列建模问题。

如果一个点顺序或面索引错了，后处理可能直接失败。更麻烦的是，mesh 本身不告诉你哪个面属于轮子、把手或铰链。

## 为什么 point cloud 不够

point cloud 表示一堆点，适合粗略形状，但不天然表达：

- 表面连续性。
- 部件边界。
- 可动结构。
- 碰撞体。
- 语义部件。

机器人仿真需要的是“能交互的结构”，不是孤立点集。

## RLE 的折中

template-based RLE 试图在三者之间折中：

- 比 mesh 更容易被文本模型生成。
- 比 point cloud 更接近占据体和部件形状。
- 比 dense voxel 更短。
- 比 latent token 更可解释。

## 代码证据

官方训练数据模板 `dataset/example_64_finetune_rle.txt` 明确要求输出：

```text
3D voxel (grid=64) in the 3D RLE format
Output one run per line as: start_index length
```

这说明论文不是只在概念上说 RLE，而是在训练样本里直接要求 VLM 学这种输出格式。

## 大白话说明

mesh 像“把整个模型的三角面施工图逐行写出来”，太复杂。  
point cloud 像“撒一堆点说这就是物体”，不够结构化。  
RLE 像“把物体切片后用压缩文字记录实体区域”，既能让模型写出来，也能还原为几何。

## 复现注意

评估这个表示时，不要只问“生成 mesh 好不好看”。更重要的是看：

- 部件是否完整。
- 细小结构是否断裂。
- 关节连接处是否合理。
- RLE decode 后 voxel 是否闭合。
- 转成 mesh 后是否能进入 URDF/XML。

