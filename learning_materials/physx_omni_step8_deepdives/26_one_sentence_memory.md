# 26 用一句话记住整篇论文精讲

对应 `paper-reading.md`：`## 26. 用一句话记住整篇论文`

## 一句话

PhysX-Omni 用 VLM 从单图推理物体的全局物理语义，再用 template-based RLE 文本表示生成部件级高分辨率几何，最后解码成带尺寸、材料、affordance 和运动学结构的 simulation-ready 3D 资产。

## 拆成四段记

1. `看图`：Qwen2.5-VL 理解输入图。
2. `拆件`：识别物体部件和父子关系。
3. `写几何`：用 RLE 文本表达 part-level voxel。
4. `进仿真`：转成 mesh、URDF、XML 等资产。

## 大白话版本

给模型一张物体照片，它不只是生成一个好看的 3D 壳，而是要生成一份能放进仿真器里的“物体工程包”。

## 为什么这句话重要

这句话同时包含了论文的四个核心：

- VLM。
- 部件级物理语义。
- template-based RLE。
- simulation-ready 输出。

缺任何一个，都不是完整的 PhysX-Omni。

## 记忆口诀

```text
先看懂，再拆件；
先写结构，再生几何；
先有物理语义，再进仿真。
```

