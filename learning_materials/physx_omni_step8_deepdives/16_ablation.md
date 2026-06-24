# 16 消融实验结论精讲

对应 `paper-reading.md`：`## 16. 消融实验结论`

## 消融要验证什么

论文最核心的消融目标是证明 template-based geometry representation 有价值。也就是说，性能提升不只是因为数据更多或模型更大，而是和新的几何文本表示有关。

主要对比对象：

- text-based voxel indices 表示。
- 旧的 segmentation pipeline。
- PhysX-Anything 风格的显式分割中间阶段。

## 论文想证明的因果关系

论文主张：

1. 旧表示序列长、冗余高、难生成复杂局部结构。
2. 显式 segmentation pipeline 容易把早期错误传到后续几何生成。
3. template-based RLE 能更紧凑地表达高分辨率部件几何。
4. 更好的局部几何会帮助 kinematic、scale、affordance 等物理指标。

## 大白话说明

旧方法像是先把物体切错了，再按错误切片建模。切错一步，后面全歪。  
PhysX-Omni 的思路是让 VLM 直接学部件级结构和几何文本表示，减少“先分割再生成”的误差传递。

## 代码落点

消融对应的关键代码不是单独一个 `ablation.py`，而是数据表示和训练样本构造：

- `dataset/1voxel_verse.py`：生成 part-level voxel。
- `dataset/2encode_representation_64_finetune.py`：结构化部件文本。
- `dataset/3generate_data_new_64_finetune_rle.py`：RLE 几何文本。
- `dataset/example_64_finetune_rle.txt`：训练样本格式模板。

如果要自己做消融，最自然的方向是改 `3generate_data_new_64_finetune_rle.py` 的表示方式，比较：

- dense voxel index。
- plain coordinate list。
- 2D RLE。
- template-based RLE。

## 复现建议

完整训练消融成本太高。实际可做的小规模消融：

1. 对同一批 voxel coords 分别编码成 coordinate list 和 RLE。
2. 比较文本长度。
3. decode 后检查是否 lossless。
4. 统计 token 数，验证是否更适合 VLM。
5. 用 1-5 个样本观察细部结构是否更稳定。

## 注意边界

消融结论支持的是“表示改进有帮助”，但不能单独证明全部性能提升都来自 RLE。数据规模、训练细节、decoder、VLM backbone 都会影响最终分数。

